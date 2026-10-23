import { randomBytes } from 'node:crypto';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  type AdminAiUsage,
  type AdminAnalytics,
  type AdminContentStatus,
  type AdminOrg,
  type AdminTeacher,
  type ContentSyncResponse,
  type CreateOrgRequest,
  type CreateTeacherRequest,
  ErrorCode,
  type UpdateOrgRequest,
  type TeacherCredential,
  type UpdateTeacherRequest,
  estimateCostCents,
} from '@storyforge/shared';
import { orgSpendTodayCents, startOfUtcDay } from '../ai/ai-budget.js';
import type { AuthUser } from '../auth/auth.types.js';
import { AuthService } from '../auth/auth.service.js';
import { PasswordService } from '../auth/password.service.js';
import { TokenService } from '../auth/token.service.js';
import { AppError, notFound } from '../common/app-error.js';
import { AuditService } from '../common/audit.service.js';
import { loadContent } from '../curriculum/content-loader.js';
import { syncContent } from '../curriculum/content-sync.js';
import { DatabaseService } from '../database/database.service.js';

const DAYS = 14;
const DAY_MS = 86_400_000;
/** A deactivated teacher is locked until this date; failed-login locks are much shorter. */
const DEACTIVATED_UNTIL = new Date('9999-12-31T00:00:00Z');

/** The last 14 UTC days as YYYY-MM-DD, oldest first. */
function lastDays(): string[] {
  const today = startOfUtcDay().getTime();
  return Array.from({ length: DAYS }, (_, i) =>
    new Date(today - (DAYS - 1 - i) * DAY_MS).toISOString().slice(0, 10),
  );
}

const windowStart = () => new Date(startOfUtcDay().getTime() - (DAYS - 1) * DAY_MS);

type DayCount = { day: string; n: bigint };
const byDay = (rows: DayCount[]) => new Map(rows.map((r) => [r.day, Number(r.n)]));

const emptyTotals = () => ({
  calls: 0,
  inputTokens: 0,
  outputTokens: 0,
  cacheReadTokens: 0,
  costCents: 0,
});

/**
 * The admin console (DESIGN.md §11.9): schools, teachers, platform analytics, AI usage and the
 * curriculum sync. Only counts and token totals, never student text.
 */
@Injectable()
export class AdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
    private readonly tokens: TokenService,
    private readonly auth: AuthService,
    private readonly passwords: PasswordService,
  ) {}

  async orgs(): Promise<AdminOrg[]> {
    const orgs = await this.db.client.organization.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { teachers: { where: { deletedAt: null } } } },
        classes: {
          where: { archivedAt: null },
          select: { _count: { select: { enrollments: true } } },
        },
      },
    });
    const spend = await orgSpendTodayCents(
      this.db.client,
      orgs.map((o) => o.id),
    );
    return orgs.map((o) => ({
      id: o.id,
      name: o.name,
      country: o.country,
      timezone: o.timezone,
      aiDailyBudgetCents: o.aiDailyBudgetCents,
      teachers: o._count.teachers,
      classes: o.classes.length,
      students: o.classes.reduce((n, c) => n + c._count.enrollments, 0),
      aiCostTodayCents: spend.get(o.id) ?? 0,
      createdAt: o.createdAt.toISOString(),
    }));
  }

  private async org(orgId: string): Promise<AdminOrg> {
    return (await this.orgs()).find((o) => o.id === orgId)!;
  }

  async createOrg(admin: AuthUser, req: CreateOrgRequest): Promise<AdminOrg> {
    const org = await this.db.client.organization.create({
      data: {
        name: req.name,
        country: req.country || null,
        timezone: req.timezone,
        aiDailyBudgetCents: req.aiDailyBudgetCents ?? null,
      },
    });
    await this.audit.record(admin.id, 'org.create', org.id);
    return this.org(org.id);
  }

  async updateOrg(admin: AuthUser, orgId: string, req: UpdateOrgRequest): Promise<AdminOrg> {
    const found = await this.db.client.organization.findUnique({ where: { id: orgId } });
    if (!found) throw notFound(ErrorCode.ORG_NOT_FOUND, 'School not found.');
    await this.db.client.organization.update({
      where: { id: orgId },
      data: { name: req.name, aiDailyBudgetCents: req.aiDailyBudgetCents },
    });
    await this.audit.record(
      admin.id,
      'org.update',
      orgId,
      req.aiDailyBudgetCents !== undefined ? { aiDailyBudgetCents: req.aiDailyBudgetCents } : {},
    );
    return this.org(orgId);
  }

  async teachers(): Promise<AdminTeacher[]> {
    const teachers = await this.db.client.user.findMany({
      where: { role: 'TEACHER', deletedAt: null },
      orderBy: { displayName: 'asc' },
      include: {
        org: { select: { name: true } },
        taughtClasses: {
          where: { archivedAt: null },
          select: { _count: { select: { enrollments: true } } },
        },
      },
    });
    return teachers.map((t) => ({
      id: t.id,
      displayName: t.displayName,
      email: t.email,
      orgId: t.orgId,
      orgName: t.org?.name ?? null,
      classes: t.taughtClasses.length,
      students: t.taughtClasses.reduce((n, c) => n + c._count.enrollments, 0),
      lastLoginAt: t.lastLoginAt?.toISOString() ?? null,
      active: !(t.lockedUntil && t.lockedUntil >= DEACTIVATED_UNTIL),
    }));
  }

  /** A new teacher with a random password, shown to the admin once (only the hash is stored). */
  async createTeacher(admin: AuthUser, req: CreateTeacherRequest): Promise<TeacherCredential> {
    const db = this.db.client;
    if (await db.user.findUnique({ where: { email: req.email } })) {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_TAKEN,
        'Email already registered',
        'That email already has an account. Reset its password instead.',
      );
    }
    if (req.orgId && !(await db.organization.findUnique({ where: { id: req.orgId } }))) {
      throw notFound(ErrorCode.ORG_NOT_FOUND, 'School not found.');
    }
    const password = newPassword();
    const teacher = await db.user.create({
      data: {
        role: 'TEACHER',
        email: req.email,
        displayName: req.displayName,
        username: await this.auth.uniqueTeacherUsername(req.email),
        passwordHash: await this.passwords.hash(password),
        orgId: req.orgId ?? null,
      },
    });
    await this.audit.record(admin.id, 'teacher.create', teacher.id, { orgId: req.orgId ?? null });
    return { teacher: (await this.teachers()).find((t) => t.id === teacher.id)!, password };
  }

  /** A new random password for a teacher; signs them out everywhere and unlocks the account. */
  async resetTeacherPassword(admin: AuthUser, teacherId: string): Promise<TeacherCredential> {
    const teacher = await this.db.client.user.findFirst({
      where: { id: teacherId, role: 'TEACHER', deletedAt: null },
    });
    if (!teacher) throw notFound(ErrorCode.TEACHER_NOT_FOUND, 'Teacher not found.');
    const password = newPassword();
    const deactivated = teacher.lockedUntil && teacher.lockedUntil >= DEACTIVATED_UNTIL;
    await this.db.client.user.update({
      where: { id: teacherId },
      data: {
        passwordHash: await this.passwords.hash(password),
        failedLogins: 0,
        // A reset unlocks a temporary lockout but never reactivates a deactivated teacher.
        ...(deactivated ? {} : { lockedUntil: null }),
      },
    });
    await this.tokens.revokeAllForUser(teacherId);
    await this.audit.record(admin.id, 'teacher.reset_password', teacherId);
    return { teacher: (await this.teachers()).find((t) => t.id === teacherId)!, password };
  }

  async updateTeacher(
    admin: AuthUser,
    teacherId: string,
    req: UpdateTeacherRequest,
  ): Promise<AdminTeacher> {
    const teacher = await this.db.client.user.findFirst({
      where: { id: teacherId, role: 'TEACHER', deletedAt: null },
    });
    if (!teacher) throw notFound(ErrorCode.TEACHER_NOT_FOUND, 'Teacher not found.');
    if (req.orgId) {
      const org = await this.db.client.organization.findUnique({ where: { id: req.orgId } });
      if (!org) throw notFound(ErrorCode.ORG_NOT_FOUND, 'School not found.');
    }
    await this.db.client.$transaction(async (tx) => {
      if (req.orgId !== undefined) {
        await tx.user.update({ where: { id: teacherId }, data: { orgId: req.orgId } });
        // A teacher's classes belong to the teacher's school (for its AI budget).
        await tx.class.updateMany({ where: { teacherId }, data: { orgId: req.orgId } });
      }
      if (req.active !== undefined) {
        await tx.user.update({
          where: { id: teacherId },
          data: req.active
            ? { lockedUntil: null, failedLogins: 0 }
            : { lockedUntil: DEACTIVATED_UNTIL },
        });
      }
    });
    if (req.active === false) await this.tokens.revokeAllForUser(teacherId);
    if (req.orgId !== undefined) {
      await this.audit.record(admin.id, 'teacher.assign_org', teacherId, { orgId: req.orgId });
    }
    if (req.active !== undefined) {
      await this.audit.record(
        admin.id,
        req.active ? 'teacher.activate' : 'teacher.deactivate',
        teacherId,
      );
    }
    return (await this.teachers()).find((t) => t.id === teacherId)!;
  }

  async analytics(): Promise<AdminAnalytics> {
    const db = this.db.client;
    const since = windowStart();
    const [schools, teachers, classes, students, submissions, submitted, completed, active] =
      await Promise.all([
        db.organization.count(),
        db.user.count({ where: { role: 'TEACHER', deletedAt: null } }),
        db.class.count({ where: { archivedAt: null } }),
        db.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
        db.submission.count({ where: { submittedAt: { not: null } } }),
        db.$queryRaw<DayCount[]>`
          SELECT to_char("submittedAt", 'YYYY-MM-DD') AS day, count(*) AS n FROM "Submission"
          WHERE "submittedAt" >= ${since} GROUP BY 1`,
        db.$queryRaw<DayCount[]>`
          SELECT to_char("completedAt", 'YYYY-MM-DD') AS day, count(*) AS n FROM "LessonProgress"
          WHERE "completedAt" >= ${since} GROUP BY 1`,
        db.$queryRaw<DayCount[]>`
          SELECT day, count(DISTINCT sid) AS n FROM (
            SELECT to_char("updatedAt", 'YYYY-MM-DD') AS day, "studentId" AS sid
            FROM "LessonProgress" WHERE "updatedAt" >= ${since}
            UNION ALL
            SELECT to_char("updatedAt", 'YYYY-MM-DD'), "studentId"
            FROM "Submission" WHERE "updatedAt" >= ${since}
          ) a GROUP BY day`,
      ]);
    const [s, c, a] = [byDay(submitted), byDay(completed), byDay(active)];
    return {
      totals: { schools, teachers, classes, students, submissions },
      days: lastDays().map((day) => ({
        day,
        activeStudents: a.get(day) ?? 0,
        submissions: s.get(day) ?? 0,
        lessonsCompleted: c.get(day) ?? 0,
      })),
    };
  }

  async aiUsage(): Promise<AdminAiUsage> {
    const db = this.db.client;
    const rows = await db.$queryRaw<
      {
        day: string;
        kind: string;
        analyzer: string;
        model: string;
        calls: bigint;
        input: bigint;
        output: bigint;
        cache: bigint;
      }[]
    >`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS day, kind, analyzer, model, count(*) AS calls,
        sum("inputTokens") AS input, sum("outputTokens") AS output,
        sum("cacheReadTokens") AS cache
      FROM "AiUsage" WHERE "createdAt" >= ${windowStart()} GROUP BY 1, 2, 3, 4`;
    const days = new Map(lastDays().map((d) => [d, emptyTotals()]));
    const analyzers = new Map<
      string,
      ReturnType<typeof emptyTotals> & { kind: string; analyzer: string }
    >();
    for (const r of rows) {
      const tokens = {
        inputTokens: Number(r.input),
        outputTokens: Number(r.output),
        cacheReadTokens: Number(r.cache),
      };
      const key = `${r.kind}|${r.analyzer}`;
      if (!analyzers.has(key)) {
        analyzers.set(key, { kind: r.kind, analyzer: r.analyzer, ...emptyTotals() });
      }
      for (const total of [days.get(r.day), analyzers.get(key)]) {
        if (!total) continue;
        total.calls += Number(r.calls);
        total.inputTokens += tokens.inputTokens;
        total.outputTokens += tokens.outputTokens;
        total.cacheReadTokens += tokens.cacheReadTokens;
        total.costCents += estimateCostCents(r.model, tokens);
      }
    }
    const orgs = await db.organization.findMany({ orderBy: { name: 'asc' } });
    const spend = await orgSpendTodayCents(
      db,
      orgs.map((o) => o.id),
    );
    return {
      days: [...days].map(([day, totals]) => ({ day, ...totals })),
      byAnalyzer: [...analyzers.values()].toSorted((x, y) => y.costCents - x.costCents),
      orgsToday: orgs.map((o) => ({
        orgId: o.id,
        name: o.name,
        costCents: spend.get(o.id) ?? 0,
        aiDailyBudgetCents: o.aiDailyBudgetCents,
      })),
    };
  }

  async contentStatus(): Promise<AdminContentStatus> {
    const { units, errors } = await loadContent();
    const inDb = await this.db.client.unit.findMany({
      select: { track: true, number: true, contentHash: true },
    });
    const hashes = new Map(inDb.map((u) => [`${u.track}|${u.number}`, u.contentHash]));
    return {
      units: units
        .map((u) => {
          const hash = hashes.get(`${u.track}|${u.unit.number}`);
          const state = hash === undefined ? 'new' : hash === u.contentHash ? 'in-sync' : 'changed';
          return {
            track: u.track,
            number: u.unit.number,
            title: u.unit.title,
            published: u.unit.published,
            state,
          } as const;
        })
        .toSorted((a, b) => a.track.localeCompare(b.track) || a.number - b.number),
      errors,
    };
  }

  /** Validate /content and, unless it is a dry run, load it into the database (DESIGN.md §9.4). */
  async syncContent(admin: AuthUser, dryRun: boolean): Promise<ContentSyncResponse> {
    const { units, errors, math } = await loadContent();
    const lessons = units.reduce((n, u) => n + u.lessons.length, 0);
    const activities = units.reduce((n, u) => n + u.activities.length, 0);
    if (errors.length > 0 || dryRun) {
      return { dryRun: true, units: units.length, lessons, activities, orphans: [], errors };
    }
    const report = await syncContent(this.db.client, units, math);
    await this.audit.record(admin.id, 'content.sync', 'content', {
      units: report.units,
      lessons: report.lessons,
      activities: report.activities,
    });
    return { dryRun: false, ...report, errors: [] };
  }
}

/** 20 random URL-safe characters: strong, and easy to copy from the screen. */
function newPassword(): string {
  return randomBytes(15).toString('base64url');
}
