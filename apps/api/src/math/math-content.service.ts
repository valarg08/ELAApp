import { Injectable } from '@nestjs/common';
import {
  ActivityContent,
  ErrorCode,
  LessonSteps,
  MathFactsFile,
  type MathProblem,
  MathSkillsFile,
  type MathSkill,
  MathStagesFile,
  MathTestFile,
  type MathVariant,
  type ProblemLocator,
  type ProblemSetActivity,
  type ProblemsActivity,
  problemVariant,
} from '@storyforge/shared';
import type { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';

export type ProblemActivity = ProblemsActivity | ProblemSetActivity;

/** A problem found for a student, with its variant and where it lives. */
export interface LocatedProblem {
  /** The variant shown (the seed applied). */
  problem: MathVariant;
  base: MathProblem;
  /** The unit's title, or the test's. */
  title: string;
  classId: string;
  source: 'PROBLEMS' | 'PROBLEM_SET' | 'TEST';
}

/** A problem from a lesson the student has finished (the pool for reviews and sprints). */
export interface PoolProblem {
  lessonId: string;
  activityKey: string;
  type: 'PROBLEMS' | 'PROBLEM_SET';
  unitNumber: number;
  problem: MathProblem;
}

/** The tracks on the Math engine: Math (AMC 10) and Mental Math. */
export type EngineTrack = 'MATH' | 'MENTAL';

/** Mental Math activity keys start "n01.", Math ones "m01." (or "test:"). */
export const isMentalActivityKey = (key: string) => /^ndd./.test(key);

/** A Prisma filter on activityKey: only this track's rows (error log, answer record). */
export const trackKeyFilter = (track: EngineTrack) =>
  track === 'MENTAL'
    ? { activityKey: { startsWith: 'n' } }
    : { NOT: { activityKey: { startsWith: 'n' } } };

/** "test:diagnostic" → "diagnostic". */
export const testKeyOf = (activityKey: string) =>
  activityKey.startsWith('test:') ? activityKey.slice(5) : null;

/**
 * Finding Math problems (math-design.md) for a student: in lessons they may open, in the Math-wide
 * content (skills, stages, tests, fact sheets) and in the lessons they have finished.
 */
@Injectable()
export class MathContentService {
  constructor(
    private readonly db: DatabaseService,
    private readonly curriculum: CurriculumService,
  ) {}

  /** A problem activity used by a lesson this user may open (practice or challenge step). */
  async lessonActivity(
    user: AuthUser,
    lessonId: string,
    key: string,
  ): Promise<{
    activity: ProblemActivity;
    lessonTitle: string;
    unitNumber: number;
    unitTitle: string;
    classId: string;
  }> {
    const { lesson, unit, classId } = await this.curriculum.openLesson(user, lessonId);
    const [, , practice, challenge] = LessonSteps.parse(lesson.steps);
    const used = practice.activityKeys.includes(key) || challenge.activityKey === key;
    const activity = used ? await this.activity(key) : null;
    if (!activity) throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Problems not found.');
    return {
      activity,
      lessonTitle: lesson.title,
      unitNumber: unit.number,
      unitTitle: unit.title,
      classId,
    };
  }

  /** The problem activity with this key, or null. */
  async activity(key: string): Promise<ProblemActivity | null> {
    const row = await this.db.client.activity.findUnique({ where: { key } });
    const parsed = row ? ActivityContent.safeParse(row.config) : null;
    if (!parsed?.success) return null;
    const a = parsed.data;
    return a.type === 'PROBLEMS' || a.type === 'PROBLEM_SET' ? a : null;
  }

  problem(activity: { problems: MathProblem[] }, problemId: string): MathProblem {
    const p = activity.problems.find((x) => x.id === problemId);
    if (!p) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
    return p;
  }

  // ───────── Math-wide content ─────────

  private async content<S extends z.ZodType>(key: string, schema: S): Promise<z.infer<S> | null> {
    const row = await this.db.client.mathContent.findUnique({ where: { key } });
    const parsed = row ? schema.safeParse(row.data) : null;
    return parsed?.success ? parsed.data : null;
  }

  async skills(): Promise<MathSkill[]> {
    return (await this.content('skills', MathSkillsFile)) ?? [];
  }

  stages() {
    return this.content('stages', MathStagesFile);
  }

  test(key: string) {
    return this.content(`test:${key}`, MathTestFile);
  }

  facts(unitNumber: number) {
    return this.content(`facts:${unitNumber}`, MathFactsFile);
  }

  /** Unit numbers with a fact sheet. */
  async factUnits(): Promise<number[]> {
    const rows = await this.db.client.mathContent.findMany({
      where: { key: { startsWith: 'facts:' } },
      select: { key: true },
    });
    return rows.map((r) => Number(r.key.slice(6))).toSorted((a, b) => a - b);
  }

  // ───────── Locating problems ─────────

  /**
   * A problem the student may see, by locator. Lesson problems need the lesson open; a marked
   * set's problems (and a test's) are only explained after the student has handed it in, so
   * `afterHandIn` checks that.
   */
  async locate(
    user: AuthUser,
    loc: ProblemLocator,
    { afterHandIn }: { afterHandIn: boolean },
  ): Promise<LocatedProblem> {
    const testKey = testKeyOf(loc.activityKey);
    if (testKey) {
      const test = await this.test(testKey);
      const base = test?.problems.find((p) => p.id === loc.problemId);
      if (!test || !base) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
      const handedIn = await this.db.client.mathTestAttempt.count({
        where: { studentId: user.id, testKey, submittedAt: { not: null } },
      });
      if (handedIn === 0) throw notFound(ErrorCode.NOT_FOUND, 'Finish the test first.');
      const classId = (await this.curriculum.studentClassId(user)) ?? '';
      return {
        problem: problemVariant(base, loc.seed),
        base,
        title: test.title,
        classId,
        source: 'TEST',
      };
    }
    if (!loc.lessonId) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
    const { activity, unitTitle, classId } = await this.lessonActivity(
      user,
      loc.lessonId,
      loc.activityKey,
    );
    const base = this.problem(activity, loc.problemId);
    if (afterHandIn && activity.type === 'PROBLEM_SET') {
      const submitted = await this.db.client.quizAttempt.count({
        where: {
          studentId: user.id,
          lessonId: loc.lessonId,
          activityKey: activity.key,
          submittedAt: { not: null },
        },
      });
      if (submitted === 0) throw notFound(ErrorCode.NOT_FOUND, 'Finish the set first.');
    }
    return {
      problem: problemVariant(base, loc.seed),
      base,
      title: unitTitle,
      classId,
      source: activity.type,
    };
  }

  /** Problems from the lessons the student has finished in one track (practice and marked sets). */
  async pool(user: AuthUser, track: EngineTrack = 'MATH'): Promise<PoolProblem[]> {
    const done = [...(await this.curriculum.completedLessons(user))];
    if (done.length === 0) return [];
    const rows = await this.db.client.activity.findMany({
      where: { lessonId: { in: done }, type: { in: ['PROBLEMS', 'PROBLEM_SET'] } },
      include: { unit: { select: { number: true, track: true } } },
    });
    return rows.flatMap((row) => {
      const parsed = ActivityContent.safeParse(row.config);
      const a = parsed.success ? parsed.data : null;
      if (!a || !row.lessonId || row.unit.track !== track) return [];
      if (a.type !== 'PROBLEMS' && a.type !== 'PROBLEM_SET') return [];
      return a.problems.map((problem) => ({
        lessonId: row.lessonId!,
        activityKey: a.key,
        type: a.type,
        unitNumber: row.unit.number,
        problem,
      }));
    });
  }
}
