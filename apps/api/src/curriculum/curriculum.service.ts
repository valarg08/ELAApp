import { HttpStatus, Injectable } from '@nestjs/common';
import type { ClassUnit, Lesson, LessonProgress, Unit } from '@storyforge/db';
import {
  ActivityContent,
  ErrorCode,
  type LessonDetail,
  type LessonProgressView,
  LessonSteps,
  STEP_IDS,
  STEP_RESPONSE_SCHEMAS,
  StepId,
  type UnitDetail,
  type UnitSummary,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';

type Availability = Pick<UnitSummary, 'available' | 'lockReason' | 'dueAt'>;

/**
 * Whether a class can open a unit (DESIGN.md §11.3 pacing).
 * Unpublished units are "coming soon". Without a pacing row, Unit 1 is open and the rest are locked.
 */
export function unitAvailability(
  unit: Unit,
  pacing: ClassUnit | undefined,
  now = new Date(),
): Availability {
  const dueAt = pacing?.dueAt?.toISOString() ?? null;
  if (!unit.published) return { available: false, lockReason: 'COMING_SOON', dueAt };
  if (pacing) {
    const open = !pacing.hidden && (!pacing.unlockAt || pacing.unlockAt <= now);
    return { available: open, lockReason: open ? null : 'LOCKED', dueAt };
  }
  return unit.number === 1
    ? { available: true, lockReason: null, dueAt }
    : { available: false, lockReason: 'LOCKED', dueAt };
}

const stepsDone = (p: LessonProgress | undefined): StepId[] =>
  StepId.array()
    .catch([])
    .parse(p?.completedSteps ?? []);

const responsesOf = (p: LessonProgress | undefined): Record<string, unknown> => {
  const value: unknown = p?.responses;
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? { ...value } : {};
};

@Injectable()
export class CurriculumService {
  constructor(private readonly db: DatabaseService) {}

  /** All units with availability for the student's class (teachers see a preview: everything published is open). */
  async listUnits(user: AuthUser, classId?: string): Promise<UnitSummary[]> {
    const units = await this.db.client.unit.findMany({
      orderBy: { number: 'asc' },
      include: { lessons: { select: { id: true } } },
    });
    const pacing = await this.pacingFor(user, classId);
    const completed = await this.completedLessonIds(user);

    return units.map((unit) => ({
      ...this.summaryBase(unit),
      ...(user.role === 'STUDENT'
        ? unitAvailability(unit, pacing.get(unit.id))
        : this.teacherPreview(unit)),
      lessonCount: unit.lessons.length,
      completedLessons: unit.lessons.filter((l) => completed.has(l.id)).length,
    }));
  }

  async getUnit(user: AuthUser, unitIdOrSlug: string, classId?: string): Promise<UnitDetail> {
    const unit = await this.db.client.unit.findFirst({
      where: { OR: [{ id: unitIdOrSlug }, { slug: unitIdOrSlug }] },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
    if (!unit) throw notFound(ErrorCode.UNIT_NOT_FOUND, 'Unit not found.');
    const pacing = await this.pacingFor(user, classId);
    const availability =
      user.role === 'STUDENT'
        ? unitAvailability(unit, pacing.get(unit.id))
        : this.teacherPreview(unit);

    const progress = await this.progressMap(
      user,
      unit.lessons.map((l) => l.id),
    );
    return {
      ...this.summaryBase(unit),
      ...availability,
      bigIdeas: stringArray(unit.bigIdeas),
      lessonCount: unit.lessons.length,
      completedLessons: unit.lessons.filter((l) => progress.get(l.id)?.completedAt).length,
      lessons: availability.available
        ? unit.lessons.map((l) => ({
            id: l.id,
            slug: l.slug,
            order: l.order,
            title: l.title,
            estMinutes: l.estMinutes,
            completedSteps: stepsDone(progress.get(l.id)).length,
            totalSteps: STEP_IDS.length,
            completed: !!progress.get(l.id)?.completedAt,
          }))
        : [],
    };
  }

  async getLesson(user: AuthUser, lessonId: string): Promise<LessonDetail> {
    const { lesson, unit } = await this.openLesson(user, lessonId);
    const steps = LessonSteps.parse(lesson.steps);
    const [, , practice, challenge] = steps;
    const keys = [...practice.activityKeys, challenge.activityKey];
    const rows = await this.db.client.activity.findMany({ where: { key: { in: keys } } });
    const activities = Object.fromEntries(
      rows.map((r) => [r.key, ActivityContent.parse(r.config)]),
    );

    const progress =
      user.role === 'STUDENT'
        ? ((await this.db.client.lessonProgress.findUnique({
            where: { studentId_lessonId: { studentId: user.id, lessonId } },
          })) ?? undefined)
        : undefined;

    const challengeRow = rows.find((r) => r.key === challenge.activityKey);
    if (!challengeRow) throw new Error(`Challenge activity ${challenge.activityKey} missing`);

    const next = await this.db.client.lesson.findFirst({
      where: { unitId: unit.id, order: { gt: lesson.order } },
      orderBy: { order: 'asc' },
      select: { id: true },
    });

    return {
      id: lesson.id,
      slug: lesson.slug,
      order: lesson.order,
      title: lesson.title,
      estMinutes: lesson.estMinutes,
      unit: { id: unit.id, number: unit.number, slug: unit.slug, title: unit.title },
      steps,
      activities,
      progress: this.progressView(progress),
      challengeActivityId: challengeRow.id,
      nextLessonId: next?.id ?? null,
    };
  }

  /** Record a finished step. Steps must be completed in order; a finished step may be redone. */
  async completeStep(
    user: AuthUser,
    lessonId: string,
    stepIdParam: string,
    body: unknown,
  ): Promise<LessonProgressView> {
    if (user.role !== 'STUDENT') throw forbidden('Only students save lesson progress.');
    const stepId = StepId.safeParse(stepIdParam);
    if (!stepId.success) throw notFound(ErrorCode.NOT_FOUND, 'Unknown lesson step.');

    const { lesson, classId } = await this.openLesson(user, lessonId);
    const steps = LessonSteps.parse(lesson.steps);
    const parsed = STEP_RESPONSE_SCHEMAS[stepId.data].safeParse(body);
    if (!parsed.success) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Invalid request',
        undefined,
        parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      );
    }

    const existing =
      (await this.db.client.lessonProgress.findUnique({
        where: { studentId_lessonId: { studentId: user.id, lessonId } },
      })) ?? undefined;
    const done = stepsDone(existing);
    const index = STEP_IDS.indexOf(stepId.data);
    if (STEP_IDS.slice(0, index).some((s) => !done.includes(s))) {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.STEP_LOCKED,
        'Not yet!',
        'Finish the earlier steps first.',
      );
    }

    let stored: unknown = parsed.data;
    const [, , practice, challenge, reflect] = steps;

    if (stepId.data === 'practice') {
      const results = STEP_RESPONSE_SCHEMAS.practice.parse(body).results;
      const allDone = practice.activityKeys.every((k) =>
        results.some((r) => r.activityKey === k && r.correct),
      );
      if (!allDone) {
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.PRACTICE_INCOMPLETE,
          'Keep going',
          'Finish every practice activity first.',
        );
      }
    }

    if (stepId.data === 'reflect') {
      const answer = STEP_RESPONSE_SCHEMAS.reflect.parse(body);
      if (
        answer.answers.length !== reflect.prompts.length ||
        (reflect.confidenceCheck && answer.confidence === undefined)
      ) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          ErrorCode.VALIDATION_FAILED,
          'Invalid request',
          'Answer every question.',
        );
      }
    }

    if (stepId.data === 'challenge') {
      // The writing itself is checked and stored by the submissions module (writing workspace).
      const submission = await this.db.client.submission.findFirst({
        where: {
          activity: { key: challenge.activityKey },
          studentId: user.id,
          classId,
          version: { gte: 1 },
        },
      });
      if (!submission) {
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.WRITING_NOT_SUBMITTED,
          'Not yet!',
          'Submit your writing first.',
        );
      }
      stored = { wordCount: submission.wordCount };
    }

    const completedSteps = done.includes(stepId.data) ? done : [...done, stepId.data];
    const responses = { ...responsesOf(existing), [stepId.data]: stored };
    const finished = STEP_IDS.every((s) => completedSteps.includes(s));
    const saved = await this.db.client.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId: user.id, lessonId } },
      create: {
        studentId: user.id,
        lessonId,
        classId,
        completedSteps,
        responses: JSON.parse(JSON.stringify(responses)),
        completedAt: finished ? new Date() : null,
      },
      update: {
        completedSteps,
        responses: JSON.parse(JSON.stringify(responses)),
        ...(finished && !existing?.completedAt ? { completedAt: new Date() } : {}),
      },
    });
    return this.progressView(saved);
  }

  // ───────── helpers ─────────

  /** Load a lesson the user may open. For students: the unit must be available in one of their classes. */
  private async openLesson(
    user: AuthUser,
    lessonId: string,
  ): Promise<{ lesson: Lesson; unit: Unit; classId: string }> {
    const lesson = await this.db.client.lesson.findUnique({
      where: { id: lessonId },
      include: { unit: true },
    });
    if (!lesson) throw notFound(ErrorCode.LESSON_NOT_FOUND, 'Lesson not found.');
    const { unit } = lesson;
    if (user.role !== 'STUDENT') {
      if (!unit.published) throw notFound(ErrorCode.LESSON_NOT_FOUND, 'Lesson not found.');
      return { lesson, unit, classId: '' };
    }

    return { lesson, unit, classId: await this.studentClassForUnit(user, unit) };
  }

  /**
   * The student's class in which this unit is open (the given class, or their first such class).
   * Throws UNIT_LOCKED when no class has it open.
   */
  async studentClassForUnit(user: AuthUser, unit: Unit, classId?: string): Promise<string> {
    const enrollments = await this.db.client.enrollment.findMany({
      where: { studentId: user.id, class: { archivedAt: null }, ...(classId ? { classId } : {}) },
      include: { class: { include: { unitAssignments: { where: { unitId: unit.id } } } } },
      orderBy: { joinedAt: 'asc' },
    });
    const open = enrollments.find(
      (e) => unitAvailability(unit, e.class.unitAssignments[0]).available,
    );
    if (!open) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        ErrorCode.UNIT_LOCKED,
        'Locked',
        'Your teacher hasn’t unlocked this unit yet.',
      );
    }
    return open.classId;
  }

  /** Pacing rows for the student's class (the given one if enrolled, else their first active class). */
  private async pacingFor(user: AuthUser, classId?: string): Promise<Map<string, ClassUnit>> {
    if (user.role !== 'STUDENT') return new Map();
    const enrollment = await this.db.client.enrollment.findFirst({
      where: { studentId: user.id, class: { archivedAt: null }, ...(classId ? { classId } : {}) },
      orderBy: { joinedAt: 'asc' },
      include: { class: { include: { unitAssignments: true } } },
    });
    return new Map((enrollment?.class.unitAssignments ?? []).map((p) => [p.unitId, p]));
  }

  private teacherPreview(unit: Unit): Availability {
    return unit.published
      ? { available: true, lockReason: null, dueAt: null }
      : { available: false, lockReason: 'COMING_SOON', dueAt: null };
  }

  private async completedLessonIds(user: AuthUser): Promise<Set<string>> {
    if (user.role !== 'STUDENT') return new Set();
    const rows = await this.db.client.lessonProgress.findMany({
      where: { studentId: user.id, completedAt: { not: null } },
      select: { lessonId: true },
    });
    return new Set(rows.map((r) => r.lessonId));
  }

  private async progressMap(
    user: AuthUser,
    lessonIds: string[],
  ): Promise<Map<string, LessonProgress>> {
    if (user.role !== 'STUDENT' || lessonIds.length === 0) return new Map();
    const rows = await this.db.client.lessonProgress.findMany({
      where: { studentId: user.id, lessonId: { in: lessonIds } },
    });
    return new Map(rows.map((r) => [r.lessonId, r]));
  }

  private progressView(p: LessonProgress | undefined): LessonProgressView {
    return {
      completedSteps: stepsDone(p),
      responses: responsesOf(p),
      completedAt: p?.completedAt?.toISOString() ?? null,
    };
  }

  private summaryBase(unit: Unit) {
    return {
      id: unit.id,
      number: unit.number,
      slug: unit.slug,
      title: unit.title,
      summary: unit.summary,
    };
  }
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}
