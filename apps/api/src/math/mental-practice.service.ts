import { HttpStatus, Injectable } from '@nestjs/common';
import type { MathTestAttempt } from '@storyforge/db';
import {
  type ClassMentalSkills,
  ErrorCode,
  MENTAL_LEVEL_CHECK_SIZE,
  MENTAL_LEVEL_PASS,
  MENTAL_PLACEMENT_PER_LEVEL,
  MENTAL_REVIEW_SIZE,
  MENTAL_SPRINT_MIN,
  MENTAL_SPRINT_SECONDS,
  MENTAL_SPRINT_SIZE,
  MENTAL_UNIT_TEST_PASS,
  MENTAL_UNIT_TEST_SECONDS,
  MENTAL_UNIT_TEST_SIZE,
  type MathProblem,
  MathSkillsFile,
  type MathTestItem,
  type MathTestKind,
  type MentalLevelCheck,
  MentalLevelsFile,
  type MentalPractice,
  type MentalProgress,
  type MentalUnitTest,
  type ProblemVerdict,
  type TestResult,
  mentalUnitOf,
  newSeed,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { AppError, notFound } from '../common/app-error.js';
import { CurriculumService } from '../curriculum/curriculum.service.js';
import { DatabaseService } from '../database/database.service.js';
import { MasteryService } from './mastery.service.js';
import { MathContentService, type PoolProblem, trackKeyFilter } from './math-content.service.js';
import { dayOf, reviewStreak } from './streak.js';

/** "mental-level-3" → 3. */
export const mentalLevelOf = (key: string) => {
  const m = /^mental-level-([1-4])$/.exec(key);
  return m ? Number(m[1]) : null;
};

/** "n05.unit-check" → 5. */
const unitOfKey = (activityKey: string) => Number(activityKey.slice(1, 3));
const checkKey = (unit: number) => `n${String(unit).padStart(2, '0')}.unit-check`;

function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const elapsed = (a: MathTestAttempt) => {
  const s = Math.round(((a.submittedAt ?? new Date()).getTime() - a.startedAt.getTime()) / 1000);
  return Math.max(0, a.timeLimitSeconds ? Math.min(s, a.timeLimitSeconds) : s);
};

/** Most right first, then the fastest. */
const better = (a: MathTestAttempt, b: MathTestAttempt) =>
  (a.correct ?? 0) - (b.correct ?? 0) || elapsed(b) - elapsed(a);

const unprocessable = (detail: string) =>
  new AppError(HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_FAILED, 'Not yet', detail);

/**
 * Mental Math practice on the Math test engine (mental-math-design.md, MN-later): the problems of
 * speed sprints, the placement check and the level checks, their outcomes (personal bests, the
 * placement's starting level, level badges), the practice cards on /mental and mastery per skill.
 */
@Injectable()
export class MentalPracticeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
    private readonly mastery: MasteryService,
    private readonly curriculum: CurriculumService,
    private readonly access: ClassAccessService,
  ) {}

  private async file<T>(key: string, schema: { safeParse(v: unknown): { data?: T } }) {
    const row = await this.db.client.mathContent.findUnique({ where: { key } });
    return row ? (schema.safeParse(row.data).data ?? null) : null;
  }

  async levels() {
    const levels = await this.file('mental:levels', MentalLevelsFile);
    if (!levels) throw notFound(ErrorCode.NOT_FOUND, 'Mental Math is not set up yet.');
    return levels;
  }

  async skills() {
    return (await this.file('mental:skills', MathSkillsFile)) ?? [];
  }

  /** Published Mental Math units with their lessons. */
  private publishedUnits() {
    return this.db.client.unit.findMany({
      where: { track: 'MENTAL', published: true },
      orderBy: { number: 'asc' },
      include: { lessons: { select: { id: true } } },
    });
  }

  /** The unit checks' problems of some units (with the check lesson, for Quill after hand-in). */
  private async checkProblems(units: number[]) {
    const rows = await this.db.client.activity.findMany({
      where: { key: { in: units.map(checkKey) } },
      select: { key: true, lessonId: true },
    });
    const out = new Map<number, { lessonId: string | null; problems: MathProblem[] }>();
    for (const row of rows) {
      const activity = await this.content.activity(row.key);
      if (activity)
        out.set(unitOfKey(row.key), { lessonId: row.lessonId, problems: activity.problems });
    }
    return out;
  }

  private item(activityKey: string, p: MathProblem, lessonId?: string | null): MathTestItem {
    return {
      ...(lessonId ? { lessonId } : {}),
      activityKey,
      problemId: p.id,
      ...(p.template ? { seed: newSeed() } : {}),
    };
  }

  // ───────── Planning ─────────

  /** Quick problems (easier ones first) from finished lessons, a mix of skills. */
  async sprintItems(user: AuthUser): Promise<MathTestItem[]> {
    const pool = await this.content.pool(user, 'MENTAL');
    const easy = pool.filter((p) => p.problem.difficulty <= 2);
    const source = easy.length >= MENTAL_SPRINT_MIN ? easy : pool;
    if (source.length < MENTAL_SPRINT_MIN)
      throw unprocessable('Finish a Mental Math lesson first: sprints use what you have learned.');
    const picked: PoolProblem[] = [];
    const skills = new Set<string>();
    for (const p of shuffled(source)) {
      if (picked.length >= MENTAL_SPRINT_SIZE) break;
      if (!skills.has(p.problem.skill)) {
        picked.push(p);
        skills.add(p.problem.skill);
      }
    }
    // Top up with the rest; templates can come back with new numbers.
    const templates = source.filter((p) => p.problem.template);
    for (const p of [
      ...shuffled(source.filter((x) => !picked.includes(x))),
      ...shuffled(templates),
    ]) {
      if (picked.length >= MENTAL_SPRINT_SIZE) break;
      if (!picked.includes(p) || p.problem.template) picked.push(p);
    }
    return picked
      .toSorted((a, b) => a.problem.difficulty - b.problem.difficulty)
      .map((p) => this.item(p.activityKey, p.problem, p.lessonId));
  }

  /** Placement: a few problems from each level's unit checks, Level 1 first. */
  async placementItems(): Promise<MathTestItem[]> {
    const levels = await this.levels();
    const published = new Set((await this.publishedUnits()).map((u) => u.number));
    const items: MathTestItem[] = [];
    for (const level of levels) {
      const units = level.units.map((u) => u.number).filter((n) => published.has(n));
      const checks = await this.checkProblems(units);
      const picked: MathTestItem[] = [];
      for (const unit of shuffled(units)) {
        if (picked.length >= MENTAL_PLACEMENT_PER_LEVEL) break;
        const problems = checks.get(unit)?.problems ?? [];
        const p = shuffled(problems).toSorted(
          (a, b) => Math.abs(a.difficulty - 2) - Math.abs(b.difficulty - 2),
        )[0];
        // No lesson: the student may not have opened it, so Quill is not offered on these.
        if (p) picked.push(this.item(checkKey(unit), p));
      }
      items.push(...picked.toSorted((a, b) => unitOfKey(a.activityKey) - unitOfKey(b.activityKey)));
    }
    if (items.length === 0) throw unprocessable('The placement check is not ready yet.');
    return items;
  }

  /** Why a level check is locked (null when open): every unit of the level must be finished. */
  async levelLock(user: AuthUser, level: number, done?: Set<string>): Promise<string | null> {
    const file = (await this.levels()).find((l) => l.number === level);
    if (!file) return 'This level does not exist.';
    const numbers = new Set(file.units.map((u) => u.number));
    const units = (await this.publishedUnits()).filter((u) => numbers.has(u.number));
    const completed = done ?? (await this.curriculum.completedLessons(user));
    const finished =
      units.length === numbers.size &&
      units.every((u) => u.lessons.length > 0 && u.lessons.every((l) => completed.has(l.id)));
    return finished ? null : `Finish every unit of Level ${level} first.`;
  }

  /** Why a unit test is locked (null when open): every lesson of the unit must be finished. */
  async unitLock(user: AuthUser, unit: number, done?: Set<string>): Promise<string | null> {
    const row = (await this.publishedUnits()).find((u) => u.number === unit);
    if (!row) return 'This unit does not exist.';
    const completed = done ?? (await this.curriculum.completedLessons(user));
    const finished = row.lessons.length > 0 && row.lessons.every((l) => completed.has(l.id));
    return finished ? null : `Finish every lesson of Unit ${unit} first.`;
  }

  /**
   * A unit test: MENTAL_UNIT_TEST_SIZE problems from the unit's practice and its ⭐ check, every
   * skill of the unit first, templates with fresh numbers, easiest first.
   */
  async unitItems(user: AuthUser, unit: number): Promise<MathTestItem[]> {
    const locked = await this.unitLock(user, unit);
    if (locked) throw new AppError(HttpStatus.FORBIDDEN, ErrorCode.UNIT_LOCKED, 'Not yet', locked);
    const pool = (await this.content.pool(user, 'MENTAL')).filter((p) => p.unitNumber === unit);
    if (pool.length === 0) throw unprocessable('This unit has no problems yet.');
    const bySkill = new Map<string, PoolProblem[]>();
    for (const p of shuffled(pool))
      bySkill.set(p.problem.skill, [...(bySkill.get(p.problem.skill) ?? []), p]);
    // Take one per skill in turn, so every pattern of the unit comes up.
    const picked: PoolProblem[] = [];
    const queues = shuffled([...bySkill.values()]);
    while (picked.length < MENTAL_UNIT_TEST_SIZE && queues.some((q) => q.length > 0))
      for (const q of queues) {
        const p = q.shift();
        if (p && picked.length < MENTAL_UNIT_TEST_SIZE) picked.push(p);
      }
    // A small unit: templates come back with new numbers.
    const templates = pool.filter((p) => p.problem.template);
    while (picked.length < MENTAL_UNIT_TEST_SIZE && templates.length > 0)
      picked.push(templates[picked.length % templates.length]!);
    return picked
      .toSorted((a, b) => a.problem.difficulty - b.problem.difficulty)
      .map((p) => this.item(p.activityKey, p.problem, p.lessonId));
  }

  async unitTitle(testKey: string): Promise<string | undefined> {
    const unit = mentalUnitOf(testKey);
    return (await this.publishedUnits()).find((u) => u.number === unit)?.title;
  }

  /** A level check: problems from every unit check of the level, spread across the units. */
  async levelItems(user: AuthUser, level: number): Promise<MathTestItem[]> {
    const locked = await this.levelLock(user, level);
    if (locked) throw new AppError(HttpStatus.FORBIDDEN, ErrorCode.UNIT_LOCKED, 'Not yet', locked);
    const file = (await this.levels()).find((l) => l.number === level)!;
    const units = file.units.map((u) => u.number);
    const checks = await this.checkProblems(units);
    const queues = units.map((u) => ({
      unit: u,
      lessonId: checks.get(u)?.lessonId ?? null,
      problems: shuffled(checks.get(u)?.problems ?? []),
    }));
    const items: { item: MathTestItem; difficulty: number }[] = [];
    while (items.length < MENTAL_LEVEL_CHECK_SIZE && queues.some((q) => q.problems.length > 0))
      for (const q of queues) {
        const p = q.problems.shift();
        if (p && items.length < MENTAL_LEVEL_CHECK_SIZE)
          items.push({
            item: this.item(checkKey(q.unit), p, q.lessonId),
            difficulty: p.difficulty,
          });
      }
    return items.toSorted((a, b) => a.difficulty - b.difficulty).map((x) => x.item);
  }

  titles(kind: MathTestKind, testKey: string, levelTitle?: string) {
    if (kind === 'mental-review')
      return {
        title: 'Today’s review',
        instructions:
          'A short mix from the Mental Math lessons you have finished: mistakes to redo first, then skills that are due. Each answer is checked straight away.',
      };
    if (kind === 'mental-sprint')
      return {
        title: 'Speed sprint',
        instructions: `${MENTAL_SPRINT_SIZE} quick questions in ${MENTAL_SPRINT_SECONDS / 60} minutes. Type each answer; skip any you are stuck on and come back. Try to beat your best!`,
      };
    if (kind === 'mental-placement')
      return {
        title: 'Placement check',
        instructions: `${MENTAL_PLACEMENT_PER_LEVEL} questions from each level, easiest first. No timer and no hints: just do what you can. Your result shows the level to start at and opens its units.`,
      };
    if (kind === 'mental-unit') {
      const unit = mentalUnitOf(testKey) ?? 0;
      return {
        title: `Unit ${unit} test${levelTitle ? `: ${levelTitle}` : ''}`,
        instructions: `${MENTAL_UNIT_TEST_SIZE} questions from Unit ${unit} in ${MENTAL_UNIT_TEST_SECONDS / 60} minutes, no hints. Get all ${MENTAL_UNIT_TEST_PASS} right to pass. Skip any you are stuck on and come back; the test is handed in when time runs out.`,
      };
    }
    const level = mentalLevelOf(testKey) ?? 0;
    return {
      title: `Level ${level} check${levelTitle ? `: ${levelTitle}` : ''}`,
      instructions: `${MENTAL_LEVEL_CHECK_SIZE} questions from every unit of Level ${level}, no hints. Get ${MENTAL_LEVEL_PASS} right to earn the Level ${level} badge.`,
    };
  }

  async levelTitle(testKey: string): Promise<string | undefined> {
    const level = mentalLevelOf(testKey);
    return (await this.levels()).find((l) => l.number === level)?.title;
  }

  // ───────── Outcomes ─────────

  /** The level to start at: the first level with fewer than 2 of its 3 placement problems right. */
  async placementOutcome(rows: { activityKey: string; verdict: ProblemVerdict }[]) {
    const levels = await this.levels();
    const levelOf = new Map(levels.flatMap((l) => l.units.map((u) => [u.number, l] as const)));
    let start = levels.at(-1)!;
    for (const level of levels) {
      const mine = rows.filter(
        (r) => levelOf.get(unitOfKey(r.activityKey))?.number === level.number,
      );
      const right = mine.filter((r) => r.verdict === 'correct').length;
      if (mine.length === 0 || right < Math.min(2, mine.length)) {
        start = level;
        break;
      }
    }
    return { level: start.number, title: start.title, startUnit: start.units[0]!.number };
  }

  /** Save the placement: it only ever opens more units (a weaker retake keeps the earlier start). */
  async recordPlacement(studentId: string, outcome: { level: number; startUnit: number }) {
    const existing = await this.db.client.mentalStart.findUnique({ where: { studentId } });
    if (existing && existing.startUnit >= outcome.startUnit) return;
    await this.db.client.mentalStart.upsert({
      where: { studentId },
      create: { studentId, level: outcome.level, startUnit: outcome.startUnit },
      update: { level: outcome.level, startUnit: outcome.startUnit },
    });
  }

  /** The Mental Math part of a result: time, the sprint best, placement and level outcome. */
  async extras(
    attempt: MathTestAttempt,
    rows: { activityKey: string; verdict: ProblemVerdict }[],
  ): Promise<NonNullable<TestResult['mental']>> {
    const kind = attempt.kind as MathTestKind;
    let best: { correct: number; seconds: number } | null = null;
    let newBest = false;
    if (kind === 'mental-sprint') {
      const sprints = await this.db.client.mathTestAttempt.findMany({
        where: { studentId: attempt.studentId, kind, submittedAt: { not: null } },
      });
      const top = sprints.reduce<MathTestAttempt | null>(
        (b, a) => (!b || better(a, b) > 0 ? a : b),
        null,
      );
      if (top) best = { correct: top.correct ?? 0, seconds: elapsed(top) };
      newBest = sprints.length > 1 && top?.id === attempt.id && (attempt.correct ?? 0) > 0;
    }
    const level = mentalLevelOf(attempt.testKey);
    const unit = kind === 'mental-unit' ? mentalUnitOf(attempt.testKey) : null;
    let previousBest: number | null = null;
    if (unit) {
      const earlier = await this.db.client.mathTestAttempt.findMany({
        where: {
          studentId: attempt.studentId,
          testKey: attempt.testKey,
          submittedAt: { not: null, lt: attempt.submittedAt ?? new Date() },
        },
        select: { correct: true },
      });
      if (earlier.length) previousBest = Math.max(...earlier.map((a) => a.correct ?? 0));
    }
    return {
      seconds: elapsed(attempt),
      best,
      newBest,
      placement: kind === 'mental-placement' ? await this.placementOutcome(rows) : null,
      levelCheck:
        kind === 'mental-level' && level
          ? {
              level,
              passed: rows.filter((r) => r.verdict === 'correct').length >= MENTAL_LEVEL_PASS,
              needed: MENTAL_LEVEL_PASS,
            }
          : null,
      unitTest: unit
        ? {
            unit,
            passed: rows.filter((r) => r.verdict === 'correct').length >= MENTAL_UNIT_TEST_PASS,
            needed: MENTAL_UNIT_TEST_PASS,
            previousBest,
          }
        : null,
    };
  }

  // ───────── The practice cards and progress ─────────

  async practice(user: AuthUser): Promise<MentalPractice> {
    const now = new Date();
    const pool = await this.content.pool(user, 'MENTAL');
    const poolSkills = new Set(pool.map((p) => p.problem.skill));
    const [dueSkills, dueRedos, doneToday, attempts, start] = await Promise.all([
      this.db.client.mathSkillState.count({
        where: { studentId: user.id, dueAt: { lte: now }, skill: { in: [...poolSkills] } },
      }),
      this.db.client.mathErrorLog.count({
        where: {
          studentId: user.id,
          resolvedAt: null,
          createdAt: { lt: new Date(`${dayOf(now)}T00:00:00Z`) },
          ...trackKeyFilter('MENTAL'),
        },
      }),
      this.db.client.mathTestAttempt.count({
        where: {
          studentId: user.id,
          testKey: `mental-review:${dayOf(now)}`,
          submittedAt: { not: null },
        },
      }),
      this.db.client.mathTestAttempt.findMany({
        where: {
          studentId: user.id,
          kind: { in: ['mental-sprint', 'mental-placement', 'mental-level', 'mental-unit'] },
        },
        orderBy: { startedAt: 'desc' },
      }),
      this.db.client.mentalStart.findUnique({ where: { studentId: user.id } }),
    ]);
    const sprints = attempts.filter((a) => a.kind === 'mental-sprint' && a.submittedAt);
    const top = sprints.reduce<MathTestAttempt | null>(
      (b, a) => (!b || better(a, b) > 0 ? a : b),
      null,
    );
    const placements = attempts.filter((a) => a.kind === 'mental-placement');
    const completed = await this.curriculum.completedLessons(user);
    const levelChecks: MentalLevelCheck[] = [];
    for (const level of await this.levels()) {
      const mine = attempts.filter((a) => a.testKey === `mental-level-${level.number}`);
      const done = mine.filter((a) => a.submittedAt);
      const lock = await this.levelLock(user, level.number, completed);
      levelChecks.push({
        level: level.number,
        title: level.title,
        unlocked: !lock,
        lockedReason: lock,
        passed: done.some((a) => (a.correct ?? 0) >= MENTAL_LEVEL_PASS),
        best: done.length ? Math.max(...done.map((a) => a.correct ?? 0)) : null,
        openAttemptId: mine.find((a) => !a.submittedAt)?.id ?? null,
        lastAttemptId: done[0]?.id ?? null,
      });
    }
    const unitTests: MentalUnitTest[] = [];
    for (const unit of await this.publishedUnits()) {
      const mine = attempts.filter((a) => a.testKey === `mental-unit-${unit.number}`);
      const done = mine.filter((a) => a.submittedAt);
      unitTests.push({
        unit: unit.number,
        title: unit.title,
        unlocked: !(await this.unitLock(user, unit.number, completed)),
        best: done.length ? Math.max(...done.map((a) => a.correct ?? 0)) : null,
        passed: done.some((a) => (a.correct ?? 0) >= MENTAL_UNIT_TEST_PASS),
        openAttemptId: mine.find((a) => !a.submittedAt)?.id ?? null,
        lastAttemptId: done[0]?.id ?? null,
      });
    }
    return {
      review: {
        due: Math.min(MENTAL_REVIEW_SIZE, Math.min(dueRedos, 3) + dueSkills),
        doneToday: doneToday > 0,
        streak: await reviewStreak(this.db, user.id, 'mental-review'),
      },
      sprint: {
        available: pool.length,
        best: top ? { correct: top.correct ?? 0, seconds: elapsed(top) } : null,
        lastAttemptId: sprints[0]?.id ?? null,
      },
      placement: {
        level: start?.level ?? null,
        startUnit: start?.startUnit ?? null,
        openAttemptId: placements.find((a) => !a.submittedAt)?.id ?? null,
        lastAttemptId: placements.find((a) => a.submittedAt)?.id ?? null,
      },
      levelChecks,
      unitTests,
    };
  }

  /** Mastery per Mental Math skill, grouped by unit, with the streak, sprint best and badges. */
  async progress(user: AuthUser): Promise<MentalProgress> {
    const [skills, levels, units, practice] = await Promise.all([
      this.skills(),
      this.mastery.studentLevels(user.id),
      this.publishedUnits(),
      this.practice(user),
    ]);
    return {
      streak: practice.review.streak,
      sprintBest: practice.sprint.best,
      badges: practice.levelChecks.filter((c) => c.passed).map((c) => c.level),
      units: units.map((u) => ({
        number: u.number,
        title: u.title,
        skills: skills
          .filter((s) => s.units[0] === u.number)
          .map((s) => {
            const m = levels.get(s.id);
            return {
              skill: s.id,
              label: s.label,
              level: m?.level ?? 'new',
              accuracy: m?.accuracy ?? null,
              answered: m?.answered ?? 0,
            };
          }),
      })),
    };
  }

  // ───────── Teacher ─────────

  /**
   * The class's Mental Math skills view (another teacher's class answers 404): each student's
   * placement, badges, review streak and sprint best, mastery per skill and the weakest skills.
   */
  async classSkills(teacher: AuthUser, classId: string): Promise<ClassMentalSkills> {
    await this.access.ownedClass(teacher, classId, { allowArchived: true });
    const enrollments = await this.db.client.enrollment.findMany({
      where: { classId, student: { deletedAt: null } },
      include: { student: { select: { id: true, displayName: true } } },
      orderBy: { student: { displayName: 'asc' } },
    });
    const ids = enrollments.map((e) => e.studentId);
    const [skills, rows, starts, attempts, last] = await Promise.all([
      this.skills(),
      this.mastery.rows(ids),
      this.db.client.mentalStart.findMany({ where: { studentId: { in: ids } } }),
      this.db.client.mathTestAttempt.findMany({
        where: {
          studentId: { in: ids },
          kind: { in: ['mental-sprint', 'mental-level'] },
          submittedAt: { not: null },
        },
      }),
      this.db.client.mathAnswerLog.groupBy({
        by: ['studentId'],
        where: { studentId: { in: ids }, ...trackKeyFilter('MENTAL') },
        _max: { createdAt: true },
      }),
    ]);
    const used = new Set([...rows.values()].flatMap((list) => list.map((r) => r.skill)));
    const shown = skills
      .filter((s) => used.has(s.id))
      .map((s) => ({ skill: s.id, label: s.label, unit: s.units[0] ?? 0 }))
      .toSorted((a, b) => a.unit - b.unit);
    const startOf = new Map(starts.map((s) => [s.studentId, s.level]));
    const lastOf = new Map(last.map((l) => [l.studentId, l._max.createdAt]));
    const students: (ClassMentalSkills['students'][number] & { answered: Set<string> })[] = [];
    for (const e of enrollments) {
      const mine = rows.get(e.studentId) ?? [];
      const levels = this.mastery.levels(mine);
      const sprints = attempts.filter(
        (a) => a.studentId === e.studentId && a.kind === 'mental-sprint',
      );
      const top = sprints.reduce<MathTestAttempt | null>(
        (b, a) => (!b || better(a, b) > 0 ? a : b),
        null,
      );
      const badges = [
        ...new Set(
          attempts
            .filter(
              (a) =>
                a.studentId === e.studentId &&
                a.kind === 'mental-level' &&
                (a.correct ?? 0) >= MENTAL_LEVEL_PASS,
            )
            .map((a) => mentalLevelOf(a.testKey))
            .filter((l): l is number => l !== null),
        ),
      ].toSorted((a, b) => a - b);
      students.push({
        studentId: e.studentId,
        displayName: e.student.displayName,
        levels: Object.fromEntries(
          shown.map((s) => [s.skill, levels.get(s.skill)?.level ?? 'new']),
        ),
        answered: new Set(mine.map((r) => r.skill)),
        startLevel: startOf.get(e.studentId) ?? null,
        badges,
        streak: await reviewStreak(this.db, e.studentId, 'mental-review'),
        sprintBest: top ? { correct: top.correct ?? 0, seconds: elapsed(top) } : null,
        lastPracticeAt: lastOf.get(e.studentId)?.toISOString() ?? null,
      });
    }
    const weakest = shown
      .map((s) => ({
        skill: s.skill,
        label: s.label,
        struggling: students.filter(
          (st) => st.answered.has(s.skill) && st.levels[s.skill] === 'learning',
        ).length,
      }))
      .filter((w) => w.struggling > 0)
      .toSorted((a, b) => b.struggling - a.struggling)
      .slice(0, 5);
    return {
      classId,
      skills: shown,
      students: students.map(({ answered: _answered, ...s }) => s),
      weakest,
    };
  }
}
