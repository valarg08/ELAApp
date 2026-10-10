import { HttpStatus, Injectable } from '@nestjs/common';
import type { SafetyFlag } from '@storyforge/db';
import {
  type LocalFlag,
  URGENT_FLAG_TYPES,
  type WritingContext,
  localSafetyFlags,
  safetyAnalyzer,
} from '@storyforge/ai';
import {
  ErrorCode,
  FlagType,
  type FlagStatus,
  type SafetyFlagView,
  type UpdateFlagRequest,
} from '@storyforge/shared';
import { AiRunnerService } from '../ai/ai-runner.service.js';
import type { AuthUser } from '../auth/auth.types.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { AppError, notFound } from '../common/app-error.js';
import { AuditService } from '../common/audit.service.js';
import { DatabaseService } from '../database/database.service.js';

export interface ScreenResult {
  /** Feedback must not reach the student; they see the holding message instead. */
  hold: boolean;
  /** Real contact details found: remind the student gently. */
  personalInfo: boolean;
  /** The safety classifier declined to answer (routed to the teacher). */
  declined: boolean;
}

/** Don't create the same flag again for repeated live checks of the same text. */
const DEDUPE_HOURS = 24;

/**
 * Safety layer (DESIGN.md §8.7): local word list + Claude classifier → SafetyFlag rows and a
 * teacher notification. The student never sees AI commentary on sensitive disclosures.
 */
@Injectable()
export class SafetyService {
  constructor(
    private readonly db: DatabaseService,
    private readonly ai: AiRunnerService,
    private readonly access: ClassAccessService,
    private readonly audit: AuditService,
  ) {}

  async screen(
    ctx: WritingContext,
    meta: { studentId: string; classId: string; submissionId?: string; live: boolean },
  ): Promise<ScreenResult> {
    const found: (LocalFlag & { detectedBy: string })[] = localSafetyFlags(ctx.text).map((f) => ({
      ...f,
      detectedBy: 'wordlist',
    }));

    const outcome = await this.ai.run(safetyAnalyzer, ctx, {
      kind: meta.live ? 'live-safety' : 'feedback',
      userId: meta.studentId,
      classId: meta.classId,
      cacheScope: 'safety',
      text: ctx.text,
    });
    const declined = outcome.status === 'declined';
    const type = outcome.status === 'ok' && outcome.result.flagged ? outcome.result.type : null;
    if (outcome.status === 'ok' && type) {
      const r = outcome.result;
      if (!found.some((f) => f.type === type)) {
        const severity: 1 | 2 | 3 = URGENT_FLAG_TYPES.includes(type) ? 3 : r.severity >= 2 ? 2 : 1;
        found.push({
          type,
          severity,
          excerpt: r.excerpt.slice(0, 300),
          detectedBy: 'ai-safety',
        });
      }
    }

    for (const flag of found) await this.record(flag, meta);
    return {
      hold: declined || found.some((f) => f.severity >= 2),
      personalInfo: found.some((f) => f.type === 'PERSONAL_INFO'),
      declined,
    };
  }

  private async record(
    flag: LocalFlag & { detectedBy: string },
    meta: { studentId: string; classId: string; submissionId?: string },
  ): Promise<void> {
    const recent = await this.db.client.safetyFlag.findFirst({
      where: {
        studentId: meta.studentId,
        type: flag.type,
        excerpt: flag.excerpt,
        createdAt: { gt: new Date(Date.now() - DEDUPE_HOURS * 3_600_000) },
      },
    });
    if (recent) return;
    const created = await this.db.client.safetyFlag.create({
      data: {
        studentId: meta.studentId,
        classId: meta.classId,
        submissionId: meta.submissionId ?? null,
        type: flag.type,
        severity: flag.severity,
        excerpt: flag.excerpt,
        detectedBy: flag.detectedBy,
      },
    });
    const klass = await this.db.client.class.findUnique({ where: { id: meta.classId } });
    if (klass) {
      await this.db.client.notification.create({
        data: {
          userId: klass.teacherId,
          type: flag.severity === 3 ? 'safety.flag.urgent' : 'safety.flag',
          payload: { flagId: created.id, classId: meta.classId, severity: flag.severity },
        },
      });
    }
  }

  // ───────── teacher inbox ─────────

  async list(
    teacher: AuthUser,
    classId: string,
    status: FlagStatus | 'ALL',
  ): Promise<SafetyFlagView[]> {
    await this.access.ownedClass(teacher, classId);
    const flags = await this.db.client.safetyFlag.findMany({
      where: { classId, ...(status === 'ALL' ? {} : { status }) },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take: 200,
    });
    return this.views(flags);
  }

  async update(
    teacher: AuthUser,
    flagId: string,
    input: UpdateFlagRequest,
  ): Promise<SafetyFlagView> {
    const flag = await this.db.client.safetyFlag.findUnique({ where: { id: flagId } });
    if (!flag) throw notFound(ErrorCode.FLAG_NOT_FOUND, 'Flag not found.');
    try {
      await this.access.ownedClass(teacher, flag.classId, { allowArchived: true });
    } catch {
      throw notFound(ErrorCode.FLAG_NOT_FOUND, 'Flag not found.');
    }
    if (flag.status === 'RESOLVED' && input.status === 'ACKNOWLEDGED') {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.VALIDATION_FAILED,
        'Already resolved',
        'This flag is already resolved.',
      );
    }
    const updated = await this.db.client.safetyFlag.update({
      where: { id: flagId },
      data: {
        status: input.status,
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        ...(input.status === 'RESOLVED' ? { resolvedById: teacher.id } : {}),
      },
    });
    await this.audit.record(teacher.id, 'flag.update', flagId, { status: input.status });
    const [view] = await this.views([updated]);
    return view!;
  }

  async openCount(classId: string): Promise<number> {
    return this.db.client.safetyFlag.count({ where: { classId, status: 'OPEN' } });
  }

  private async views(flags: SafetyFlag[]): Promise<SafetyFlagView[]> {
    const students = await this.db.client.user.findMany({
      where: { id: { in: [...new Set(flags.map((f) => f.studentId))] } },
      select: { id: true, displayName: true },
    });
    const byId = new Map(students.map((s) => [s.id, s]));
    return flags.map((f) => ({
      id: f.id,
      type: FlagType.parse(f.type),
      severity: f.severity,
      excerpt: f.excerpt,
      status: f.status,
      detectedBy: f.detectedBy,
      notes: f.notes,
      createdAt: f.createdAt.toISOString(),
      student: byId.get(f.studentId) ?? { id: f.studentId, displayName: '(removed)' },
      submissionId: f.submissionId,
    }));
  }
}
