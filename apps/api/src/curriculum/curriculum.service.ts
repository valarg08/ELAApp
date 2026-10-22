import { HttpStatus, Injectable } from '@nestjs/common';
import type { ClassUnit, Lesson, LessonProgress, Unit } from '@storyforge/db';
import {
  ActivityContent,
  ErrorCode,
  type LessonDetail,
  type LessonProgressView,
  LessonSteps,
  MARKED_ACTIVITY_TYPES,
  STEP_IDS,
  STEP_RESPONSE_SCHEMAS,
  StepId,
  type Track,
  type UnitDetail,
  type UnitSummary,
  classSettings,
  publicActivity,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';

type Availability = Pick<UnitSummary, 'available' | 'lockReason' | 'dueAt'>;

type UnitWithLessons = Unit & { lessons: { id: string }[] };

export interface PacingContext {
  /** Self-paced class: finishing a unit unlocks the next one. */
  selfPaced: boolean;
  /** Every earlier published unit is finished (only matters when self-paced). */
  previousDone: boolean;
}

/**
 * Whether a class can open a unit (DESIGN.md §11.3 pacing). Unpublished units are "coming soon".
 * Teacher-paced: without a pacing row, Unit 1 is open and the rest are locked.
 * Self-paced: Unit 1 is open and each later unit opens when the earlier ones are finished; a teacher
 * can still hide a unit or schedule it for later, but not skip the order.
 */
export function unitAvailability(
  unit: Unit,
  pacing: ClassUnit | undefined,
  ctx: PacingContext = { selfPaced: false, previousDone: false },
  now = new Date(),
): Availability {
  const dueAt = pacing?.dueAt?.toISOString() ?? null;
  if (!unit.published) return { available: false, lockReason: 'COMING_SOON', dueAt };
  const blocked = !!pacing && (pacing.hidden || (!!pacing.unlockAt && pacing.unlockAt > now));
  if (ctx.selfPaced) {
    if (blocked) return { available: false, lockReason: 'LOCKED', dueAt };
    return unit.number === 1 || ctx.previousDone
      ? { available: true, lockReason: null, dueAt }
      : { available: false, lockReason: 'FINISH_PREVIOUS', dueAt };
  }
  if (pacing) return { available: !blocked, lockReason: blocked ? 'LOCKED' : null, dueAt };
  return unit.number === 1
    ? { available: true, lockReason: null, dueAt }
    : { available: false, lockReason: 'LOCKED', dueAt };
}

/** Essay Writing and Math are always self-paced, whatever the class setting (DESIGN.md §9.12, §9.13). */
export const isSelfPaced = (track: Track, classSelfPaced: boolean) =>
  track !== 'STORY' || classSelfPaced;

/**
 * Availability of every unit for one class and student, walking each track's units in order.
 * The tracks are separate: finishing Story Writing units never opens Essay Writing ones.
 */
export function classAvailability(
  units: readonly UnitWithLessons[],
  pacing: ReadonlyMap<string, ClassUnit>,
  selfPaced: boolean,
  completedLessons: ReadonlySet<string>,
): Map<string, Availability> {
  const result = new Map<string, Availability>();
  const previousDone = new Map<Track, boolean>();
  for (const unit of units.toSorted((a, b) => a.number - b.number)) {
    const done = previousDone.get(unit.track) ?? true;
    result.set(
      unit.id,
      unitAvailability(unit, pacing.get(unit.id), {
        selfPaced: isSelfPaced(unit.track, selfPaced),
        previousDone: done,
      }),
    );
    if (unit.published) {
      previousDone.set(
        unit.track,
        done && unit.lessons.length > 0 && unit.lessons.every((l) => completedLessons.has(l.id)),
      );
    }
  }
  return result;
}

interface StudentClass {
  id: string;
  selfPaced: boolean;
  pacing: Map<string, ClassUnit>;
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

  /**
   * One track's units with availability for the student's class (teachers see a preview:
   * everything published is open).
   */
  async listUnits(
    user: AuthUser,
    classId?: string,
    track: Track = 'STORY',
  ): Promise<UnitSummary[]> {
    const units = await this.db.client.unit.findMany({
      where: { track },
      orderBy: { number: 'asc' },
      include: { lessons: { select: { id: true } } },
    });
    const completed = await this.completedLessonIds(user);
    const availability = await this.availabilityFor(user, units, completed, classId);

    return units.map((unit) => ({
      ...this.summaryBase(unit),
      ...(availability?.get(unit.id) ?? this.teacherPreview(unit)),
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
    const allUnits = await this.db.client.unit.findMany({
      include: { lessons: { select: { id: true } } },
    });
    const completed = await this.completedLessonIds(user);
    const student = user.role === 'STUDENT' ? await this.studentClass(user, classId) : null;
    const availability =
      user.role === 'STUDENT'
        ? (classAvailability(
            allUnits,
            student?.pacing ?? new Map(),
            student?.selfPaced ?? false,
            completed,
          ).get(unit.id) ?? { available: false, lockReason: 'LOCKED' as const, dueAt: null })
        : this.teacherPreview(unit);
    const lessonLocks = isSelfPaced(unit.track, !!student?.selfPaced);

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
        ? unit.lessons.map((l, i) => ({
            id: l.id,
            slug: l.slug,
            order: l.order,
            title: l.title,
            estMinutes: l.estMinutes,
            completedSteps: stepsDone(progress.get(l.id)).length,
            totalSteps: STEP_IDS.length,
            completed: !!progress.get(l.id)?.completedAt,
            locked: lessonLocks && i > 0 && !completed.has(unit.lessons[i - 1]!.id),
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
      rows.map((r) => [r.key, publicActivity(ActivityContent.parse(r.config))]),
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
      unit: {
        id: unit.id,
        track: unit.track,
        number: unit.number,
        slug: unit.slug,
        title: unit.title,
      },
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
      // Quizzes and problem sets are marked on the server, so a passed attempt must be on record.
      const quizKeys = await this.quizKeys(practice.activityKeys);
      const passed = new Set(
        (
          await this.db.client.quizAttempt.findMany({
            where: { studentId: user.id, lessonId, passed: true, activityKey: { in: quizKeys } },
            select: { activityKey: true },
          })
        ).map((a) => a.activityKey),
      );
      const allDone = practice.activityKeys.every((k) =>
        quizKeys.includes(k)
          ? passed.has(k)
          : results.some((r) => r.activityKey === k && r.correct),
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
        (reflect.confidenceCheck && answer.confidence === undefined) ||
        Boolean(reflect.trapPicker) !== Boolean(answer.trap) ||
        (answer.trap &&
          ![...practice.activityKeys, challenge.activityKey].includes(answer.trap.activityKey))
      ) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          ErrorCode.VALIDATION_FAILED,
          'Invalid request',
          'Answer every question.',
        );
      }
    }

    const mock =
      stepId.data === 'challenge'
        ? await this.db.client.activity.findFirst({
            where: { key: challenge.activityKey, type: 'MOCK_TEST' },
            select: { config: true },
          })
        : null;
    if (mock) {
      // A Unit 15 mock (math-design.md §4.15): done once an attempt at its test is handed in.
      const content = ActivityContent.parse(mock.config);
      const attempt =
        content.type === 'MOCK_TEST'
          ? await this.db.client.mathTestAttempt.findFirst({
              where: { studentId: user.id, testKey: content.test, submittedAt: { not: null } },
              orderBy: { submittedAt: 'desc' },
            })
          : null;
      if (!attempt) {
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.PRACTICE_INCOMPLETE,
          'Not yet!',
          'Hand in the mock first.',
        );
      }
      stored = { score: attempt.points ?? 0, total: attempt.total * 6 };
    } else if (
      stepId.data === 'challenge' &&
      (await this.quizKeys([challenge.activityKey])).length > 0
    ) {
      // A Math challenge is a marked problem set: a finished (and, with a pass mark, passed) try.
      const attempt = await this.db.client.quizAttempt.findFirst({
        where: { studentId: user.id, lessonId, activityKey: challenge.activityKey, passed: true },
        orderBy: { submittedAt: 'desc' },
      });
      if (!attempt) {
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.PRACTICE_INCOMPLETE,
          'Not yet!',
          'Finish the problem set first (and reach the pass mark if it has one).',
        );
      }
      stored = { score: attempt.score, total: attempt.total };
    } else if (stepId.data === 'challenge') {
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

  /** The keys among these that are marked on the server (quizzes and problem sets). */
  private async quizKeys(keys: readonly string[]): Promise<string[]> {
    const rows = await this.db.client.activity.findMany({
      where: { key: { in: [...keys] }, type: { in: [...MARKED_ACTIVITY_TYPES] } },
      select: { key: true },
    });
    return rows.map((r) => r.key);
  }

  /**
   * Load a lesson the user may open. For students: the unit must be available in one of their
   * classes and, in a self-paced class, the previous lesson must be finished.
   */
  async openLesson(
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

    const klass = await this.resolveStudentClass(user, unit);
    if (isSelfPaced(unit.track, klass.selfPaced)) {
      const previous = await this.db.client.lesson.findFirst({
        where: { unitId: unit.id, order: { lt: lesson.order } },
        orderBy: { order: 'desc' },
        select: { id: true },
      });
      const done =
        !previous ||
        !!(await this.db.client.lessonProgress.findFirst({
          where: { studentId: user.id, lessonId: previous.id, completedAt: { not: null } },
          select: { lessonId: true },
        }));
      if (!done) {
        throw new AppError(
          HttpStatus.FORBIDDEN,
          ErrorCode.LESSON_LOCKED,
          'Not yet!',
          'Finish the lesson before this one first.',
        );
      }
    }
    return { lesson, unit, classId: klass.id };
  }

  /**
   * The student's class in which this unit is open (the given class, or their first such class).
   * Throws UNIT_LOCKED when no class has it open.
   */
  async studentClassForUnit(user: AuthUser, unit: Unit, classId?: string): Promise<string> {
    return (await this.resolveStudentClass(user, unit, classId)).id;
  }

  private async resolveStudentClass(
    user: AuthUser,
    unit: Unit,
    classId?: string,
  ): Promise<{ id: string; selfPaced: boolean }> {
    const enrollments = await this.db.client.enrollment.findMany({
      where: { studentId: user.id, class: { archivedAt: null }, ...(classId ? { classId } : {}) },
      include: { class: { include: { unitAssignments: true } } },
      orderBy: { joinedAt: 'asc' },
    });
    const units = await this.db.client.unit.findMany({
      include: { lessons: { select: { id: true } } },
    });
    const completed = await this.completedLessonIds(user);
    let finishPrevious = false;
    for (const e of enrollments) {
      const selfPaced = classSettings(e.class.settings).selfPaced;
      const pacing = new Map(e.class.unitAssignments.map((p) => [p.unitId, p]));
      const availability = classAvailability(units, pacing, selfPaced, completed).get(unit.id);
      if (availability?.available) return { id: e.classId, selfPaced };
      if (availability?.lockReason === 'FINISH_PREVIOUS') finishPrevious = true;
    }
    throw new AppError(
      HttpStatus.FORBIDDEN,
      ErrorCode.UNIT_LOCKED,
      'Locked',
      finishPrevious
        ? 'Finish the unit before this one to unlock it.'
        : 'Your teacher hasn’t unlocked this unit yet.',
    );
  }

  /** The student's class (the given one if enrolled, else their first active class). */
  private async studentClass(user: AuthUser, classId?: string): Promise<StudentClass | null> {
    const enrollment = await this.db.client.enrollment.findFirst({
      where: { studentId: user.id, class: { archivedAt: null }, ...(classId ? { classId } : {}) },
      orderBy: { joinedAt: 'asc' },
      include: { class: { include: { unitAssignments: true } } },
    });
    if (!enrollment) return null;
    return {
      id: enrollment.classId,
      selfPaced: classSettings(enrollment.class.settings).selfPaced,
      pacing: new Map(enrollment.class.unitAssignments.map((p) => [p.unitId, p])),
    };
  }

  /** Students: availability of every unit in their class. Teachers: null (they preview everything). */
  private async availabilityFor(
    user: AuthUser,
    units: UnitWithLessons[],
    completed: Set<string>,
    classId?: string,
  ): Promise<Map<string, Availability> | null> {
    if (user.role !== 'STUDENT') return null;
    const student = await this.studentClass(user, classId);
    return classAvailability(
      units,
      student?.pacing ?? new Map(),
      student?.selfPaced ?? false,
      completed,
    );
  }
  private teacherPreview(unit: Unit): Availability {
    return unit.published
      ? { available: true, lockReason: null, dueAt: null }
      : { available: false, lockReason: 'COMING_SOON', dueAt: null };
  }

  /** The student's first active class id, or null (for help outside a lesson, like Math tests). */
  async studentClassId(user: AuthUser): Promise<string | null> {
    return (await this.studentClass(user))?.id ?? null;
  }

  /** Lessons the student has finished. */
  completedLessons(user: AuthUser): Promise<Set<string>> {
    return this.completedLessonIds(user);
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
      track: unit.track,
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
