import { HttpStatus, Injectable } from '@nestjs/common';
import type { MathTestAttempt } from '@storyforge/db';
import {
  ErrorCode,
  LIGHT_REVIEW_SIZE,
  MATH_STRANDS,
  type MathFactCard,
  type MathProblem,
  type MathSkill,
  type MathStartKey,
  MathTestAnswer,
  MathTestItem,
  type MathTestKind,
  type MathTestView,
  type MathVariant,
  REVIEW_SIZE,
  SPRINT_MIN,
  SPRINT_MINUTES,
  SPRINT_SIZE,
  type SaveTestAnswerRequest,
  type SaveTestAnswerResponse,
  TARGET_DIFFICULTY,
  TIME_SINK_SECONDS,
  type TestItemFeedback,
  type TestResult,
  answerLabel,
  bandOf,
  isMockKey,
  markAnswer,
  newSeed,
  pointsFor,
  pointsIfGuessesBlank,
  problemVariant,
  publicProblem,
} from '@storyforge/shared';
import { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { AnswerLogService } from './answer-log.service.js';
import { ErrorLogService, redoSeed } from './error-log.service.js';
import { MasteryService } from './mastery.service.js';
import { MathContentService, type PoolProblem, testKeyOf } from './math-content.service.js';

const Items = z.array(MathTestItem);
const Answers = z.record(z.string(), MathTestAnswer);
/** Answers saved this long after the deadline still count (network delays). */
const GRACE_MS = 30_000;
const DAY = 86_400_000;

const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/** Instant-check kinds: each answer is checked as it is given. */
const INSTANT: readonly MathTestKind[] = ['review', 'light-review'];
/** Kinds scored like the AMC. */
const AMC_SCORED: readonly MathTestKind[] = ['diagnostic', 'checkpoint', 'mock', 'sprint'];

function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const TITLES: Record<
  'sprint' | 'review' | 'light-review',
  { title: string; instructions: string }
> = {
  sprint: {
    title: 'Sprint',
    instructions: `${SPRINT_SIZE} problems in ${SPRINT_MINUTES} minutes, scored like the AMC: 6 points right, 1.5 blank, 0 wrong. Skip what you can't do and come back to it.`,
  },
  review: {
    title: "Today's review",
    instructions:
      'A short mix of problems from what you have learned: error-log redos first, then skills that are due. Each answer is checked straight away.',
  },
  'light-review': {
    title: 'Light review',
    instructions:
      'A few easy problems from skills you know well, and some facts to read. No timer: this is for the last days before the test.',
  },
};

/** One item resolved to the problem shown. */
interface Resolved {
  item: MathTestItem;
  problem: MathVariant;
}

/**
 * Timed tests, sprints and reviews (math-design.md §3.2 B3–B4, §3.4 D1–D3, D6). One engine:
 * the server picks the problems, keeps a server-side clock (handing in late attempts itself), saves
 * answers as they are given and marks them with math-check.
 */
@Injectable()
export class MathTestsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
    private readonly answers: AnswerLogService,
    private readonly errorLog: ErrorLogService,
    private readonly mastery: MasteryService,
  ) {}

  // ───────── Starting ─────────

  async start(user: AuthUser, key: MathStartKey): Promise<MathTestView> {
    this.studentOnly(user);
    const testKey = this.attemptKey(key);
    const open = await this.db.client.mathTestAttempt.findFirst({
      where: { studentId: user.id, testKey, submittedAt: null },
      orderBy: { startedAt: 'desc' },
    });
    if (open) {
      if (!this.expired(open)) return this.view(open);
      await this.finish(user, open);
    }
    if (key === 'review' || key === 'light-review') {
      const done = await this.db.client.mathTestAttempt.count({
        where: { studentId: user.id, testKey, submittedAt: { not: null } },
      });
      if (done > 0)
        throw new AppError(
          HttpStatus.CONFLICT,
          ErrorCode.VALIDATION_FAILED,
          'Done for today',
          key === 'review'
            ? "Today's review is done. Come back tomorrow."
            : 'Light review is done for today.',
        );
    }

    const plan = await this.plan(user, key);
    const attempt = await this.db.client.mathTestAttempt.create({
      data: {
        studentId: user.id,
        kind: plan.kind,
        testKey,
        items: plan.items,
        answers: {},
        timeLimitSeconds: plan.timeLimitSeconds,
        total: plan.items.length,
      },
    });
    return this.view(attempt);
  }

  /** The stored key of an attempt: reviews are one per day. */
  private attemptKey(key: MathStartKey): string {
    return key === 'review' || key === 'light-review' ? `${key}:${dayOf(new Date())}` : key;
  }

  private async plan(
    user: AuthUser,
    key: MathStartKey,
  ): Promise<{ kind: MathTestKind; items: MathTestItem[]; timeLimitSeconds: number | null }> {
    if (key === 'sprint')
      return {
        kind: 'sprint',
        items: await this.sprintItems(user),
        timeLimitSeconds: SPRINT_MINUTES * 60,
      };
    if (key === 'review')
      return { kind: 'review', items: await this.reviewItems(user), timeLimitSeconds: null };
    if (key === 'light-review')
      return { kind: 'light-review', items: await this.lightItems(user), timeLimitSeconds: null };

    const test = await this.content.test(key);
    if (!test) throw notFound(ErrorCode.NOT_FOUND, 'Test not found.');
    const locked = await this.lockedReason(user, test.afterUnit);
    if (locked) throw new AppError(HttpStatus.FORBIDDEN, ErrorCode.UNIT_LOCKED, 'Not yet', locked);
    return {
      kind: key === 'diagnostic' ? 'diagnostic' : isMockKey(key) ? 'mock' : 'checkpoint',
      items: test.problems.map((p) => ({
        activityKey: `test:${key}`,
        problemId: p.id,
        ...(p.template ? { seed: newSeed() } : {}),
      })),
      timeLimitSeconds: test.timeLimitMinutes ? test.timeLimitMinutes * 60 : null,
    };
  }

  /** Why a test is locked (null when open): checkpoints open once their unit is finished. */
  async lockedReason(user: AuthUser, afterUnit: number | null): Promise<string | null> {
    if (afterUnit === null) return null;
    const unit = await this.db.client.unit.findFirst({
      where: { track: 'MATH', number: afterUnit },
      include: { lessons: { select: { id: true } } },
    });
    if (!unit || unit.lessons.length === 0) return `Finish Unit ${afterUnit} first.`;
    const done = await this.db.client.lessonProgress.count({
      where: {
        studentId: user.id,
        lessonId: { in: unit.lessons.map((l) => l.id) },
        completedAt: { not: null },
      },
    });
    return done === unit.lessons.length ? null : `Finish Unit ${afterUnit} first.`;
  }

  /** Choice problems from finished lessons, one per skill first, in rising difficulty. */
  private async sprintItems(user: AuthUser): Promise<MathTestItem[]> {
    const pool = (await this.content.pool(user)).filter((p) => p.problem.answer.kind === 'choice');
    if (pool.length < SPRINT_MIN)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.VALIDATION_FAILED,
        'Not yet',
        'Finish a few more Math lessons first: sprints use problems from lessons you have finished.',
      );
    const picked: PoolProblem[] = [];
    const skills = new Set<string>();
    for (const p of shuffled(pool)) {
      if (picked.length >= SPRINT_SIZE) break;
      if (!skills.has(p.problem.skill)) {
        picked.push(p);
        skills.add(p.problem.skill);
      }
    }
    for (const p of shuffled(pool)) {
      if (picked.length >= SPRINT_SIZE) break;
      if (!picked.includes(p)) picked.push(p);
    }
    return picked
      .toSorted((a, b) => a.problem.difficulty - b.problem.difficulty)
      .map((p) => this.poolItem(p));
  }

  private poolItem(p: PoolProblem): MathTestItem {
    return {
      lessonId: p.lessonId,
      activityKey: p.activityKey,
      problemId: p.problem.id,
      ...(p.problem.template ? { seed: newSeed() } : {}),
    };
  }

  /** A problem of this skill near the target difficulty (templates first, for fresh numbers). */
  private pick(
    pool: PoolProblem[],
    skill: string,
    target: number,
    used: Set<string>,
  ): PoolProblem | null {
    const options = pool
      .filter((p) => p.problem.skill === skill && !used.has(`${p.activityKey}/${p.problem.id}`))
      .toSorted(
        (a, b) =>
          Math.abs(a.problem.difficulty - target) - Math.abs(b.problem.difficulty - target) ||
          Number(!a.problem.template) - Number(!b.problem.template) ||
          Math.random() - 0.5,
      );
    return options[0] ?? null;
  }

  /** The daily review: due error-log redos first, then due skills (interleaved), about 6. */
  private async reviewItems(user: AuthUser): Promise<MathTestItem[]> {
    const now = new Date();
    const today = dayOf(now);
    const items: MathTestItem[] = [];
    const redos = await this.db.client.mathErrorLog.findMany({
      where: {
        studentId: user.id,
        resolvedAt: null,
        createdAt: { lt: new Date(`${today}T00:00:00Z`) },
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
    for (const row of redos) {
      if (items.length >= 3) break;
      if (row.lastRedoAt && dayOf(row.lastRedoAt) === today) continue;
      const base = await this.errorLog.baseProblem(row);
      if (!base) continue;
      items.push({
        ...(row.lessonId ? { lessonId: row.lessonId } : {}),
        activityKey: row.activityKey,
        problemId: row.problemId,
        ...(base.template ? { seed: redoSeed(row) } : {}),
        errorLogId: row.id,
      });
    }

    const pool = await this.content.pool(user);
    const levels = await this.mastery.studentLevels(user.id);
    const states = await this.db.client.mathSkillState.findMany({
      where: { studentId: user.id },
      orderBy: { dueAt: 'asc' },
    });
    const used = new Set(items.map((i) => `${i.activityKey}/${i.problemId}`));
    // Due skills first, then the soonest due, one problem per skill (interleaved, never blocked).
    const ordered = [
      ...states.filter((s) => s.dueAt <= now),
      ...states.filter((s) => s.dueAt > now),
    ];
    for (const state of ordered) {
      if (items.length >= REVIEW_SIZE) break;
      const level = levels.get(state.skill)?.level ?? 'new';
      const p = this.pick(pool, state.skill, TARGET_DIFFICULTY[level], used);
      if (!p) continue;
      used.add(`${p.activityKey}/${p.problem.id}`);
      items.push(this.poolItem(p));
    }
    if (items.length === 0)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.VALIDATION_FAILED,
        'Nothing yet',
        'Finish a Math lesson first: the review brings back what you have practised.',
      );
    return items;
  }

  /** Light review: easy problems from Strong and Mastered skills only. */
  private async lightItems(user: AuthUser): Promise<MathTestItem[]> {
    const levels = await this.mastery.studentLevels(user.id);
    const known = new Set(
      [...levels].filter(([, m]) => m.level === 'strong' || m.level === 'mastered').map(([s]) => s),
    );
    const pool = (await this.content.pool(user)).filter(
      (p) => known.has(p.problem.skill) && p.problem.difficulty <= 2,
    );
    if (pool.length === 0)
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.VALIDATION_FAILED,
        'Not yet',
        'Light review opens once a skill is Strong. Keep practising!',
      );
    return shuffled(pool)
      .slice(0, LIGHT_REVIEW_SIZE)
      .map((p) => this.poolItem(p));
  }

  /** How many problems a light review could use today. */
  async lightAvailable(user: AuthUser, pool: PoolProblem[]): Promise<number> {
    const levels = await this.mastery.studentLevels(user.id);
    return pool.filter((p) => {
      const level = levels.get(p.problem.skill)?.level;
      return (level === 'strong' || level === 'mastered') && p.problem.difficulty <= 2;
    }).length;
  }

  // ───────── Viewing and answering ─────────

  async get(user: AuthUser, id: string): Promise<MathTestView | TestResult> {
    const attempt = await this.own(user, id);
    if (attempt.submittedAt) return this.result(attempt);
    if (this.expired(attempt)) return this.result(await this.finish(user, attempt));
    return this.view(attempt);
  }

  async answer(
    user: AuthUser,
    id: string,
    body: SaveTestAnswerRequest,
  ): Promise<SaveTestAnswerResponse> {
    const attempt = await this.own(user, id);
    if (attempt.submittedAt) throw this.closed();
    if (this.expired(attempt)) {
      await this.finish(user, attempt);
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.QUIZ_ATTEMPT_CLOSED,
        "Time's up",
        'Time ran out, so the test was handed in.',
      );
    }
    const items = Items.parse(attempt.items);
    const item = items[body.index];
    if (!item) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
    const answers = Answers.catch({}).parse(attempt.answers);
    const previous = answers[String(body.index)];
    const kind = attempt.kind as MathTestKind;
    const instant = INSTANT.includes(kind);
    if (instant && previous?.verdict)
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.VALIDATION_FAILED,
        'Already checked',
        'This answer was already checked.',
      );

    const saved: MathTestAnswer = {
      answer: body.answer,
      seconds: body.seconds,
      flagged: body.flagged,
      ...(body.confidence ? { confidence: body.confidence } : {}),
    };
    let feedback: TestItemFeedback | null = null;
    if (instant && body.check && body.answer) {
      const problem = await this.resolveOne(item);
      if (!problem) throw notFound(ErrorCode.NOT_FOUND, 'Problem not found.');
      feedback = await this.checkNow(user, item, problem, saved);
      saved.verdict = feedback.verdict;
    }
    await this.db.client.mathTestAttempt.update({
      where: { id: attempt.id },
      data: { answers: { ...answers, [String(body.index)]: saved } },
    });
    return { saved: true, feedback };
  }

  /** Check one review answer: redos go through the error log; the rest into the answer record. */
  private async checkNow(
    user: AuthUser,
    item: MathTestItem,
    problem: MathVariant,
    saved: MathTestAnswer,
  ): Promise<TestItemFeedback> {
    if (item.errorLogId) {
      const row = await this.db.client.mathErrorLog.findFirst({
        where: { id: item.errorLogId, studentId: user.id },
      });
      if (row) {
        const { mark, message } = await this.errorLog.check(user, row, problem, saved.answer);
        return {
          verdict: mark.verdict,
          message,
          note: mark.note,
          rightAnswer: answerLabel(problem),
          solution: problem.solution,
        };
      }
    }
    const mark = markAnswer(problem, saved.answer);
    if (mark.readable)
      await this.answers.record(user.id, [
        {
          source: 'review',
          lessonId: item.lessonId ?? null,
          activityKey: item.activityKey,
          problemId: item.problemId,
          seed: problem.seed ?? null,
          skill: problem.skill,
          difficulty: problem.difficulty,
          verdict: mark.verdict,
          seconds: saved.seconds,
          confidence: saved.confidence ?? null,
        },
      ]);
    return {
      verdict: mark.verdict,
      message: mark.message,
      note: mark.note,
      rightAnswer: answerLabel(problem),
      solution: problem.solution,
    };
  }

  async submit(user: AuthUser, id: string): Promise<TestResult> {
    const attempt = await this.own(user, id);
    if (attempt.submittedAt) throw this.closed();
    return this.result(await this.finish(user, attempt));
  }

  async review(user: AuthUser, id: string): Promise<TestResult> {
    const attempt = await this.own(user, id);
    if (!attempt.submittedAt) throw notFound(ErrorCode.NOT_FOUND, 'Hand it in first.');
    return this.result(attempt);
  }

  /** Mark and close an attempt (also when its time ran out). */
  private async finish(user: AuthUser, attempt: MathTestAttempt): Promise<MathTestAttempt> {
    const kind = attempt.kind as MathTestKind;
    const resolved = await this.resolve(Items.parse(attempt.items));
    const answers = Answers.catch({}).parse(attempt.answers);
    const instant = INSTANT.includes(kind);
    let correct = 0;
    let points = 0;
    const records = [];
    for (const [i, { item, problem }] of resolved.entries()) {
      const a = answers[String(i)];
      const verdict = instant
        ? (a?.verdict ?? 'blank')
        : markAnswer(problem, a?.answer ?? '').verdict;
      if (verdict === 'correct') correct += 1;
      points += pointsFor(verdict);
      answers[String(i)] = {
        answer: a?.answer ?? '',
        seconds: a?.seconds ?? 0,
        flagged: a?.flagged ?? false,
        ...(a?.confidence ? { confidence: a.confidence } : {}),
        verdict,
      };
      if (!instant)
        records.push({
          source: kind === 'sprint' ? ('sprint' as const) : ('test' as const),
          lessonId: item.lessonId ?? null,
          activityKey: item.activityKey,
          problemId: item.problemId,
          seed: problem.seed ?? null,
          skill: problem.skill,
          difficulty: problem.difficulty,
          verdict,
          seconds: a?.seconds ?? null,
          confidence: a?.confidence ?? null,
        });
    }
    const updated = await this.db.client.mathTestAttempt.update({
      where: { id: attempt.id },
      data: {
        answers,
        correct,
        points: AMC_SCORED.includes(kind) ? points : null,
        submittedAt: new Date(),
      },
    });
    await this.answers.record(user.id, records);
    return updated;
  }

  // ───────── Views ─────────

  private async view(attempt: MathTestAttempt): Promise<MathTestView> {
    const kind = attempt.kind as MathTestKind;
    const resolved = await this.resolve(Items.parse(attempt.items));
    const answers = Answers.catch({}).parse(attempt.answers);
    const feedback: Record<string, TestItemFeedback> = {};
    if (INSTANT.includes(kind))
      for (const [i, { problem }] of resolved.entries()) {
        const a = answers[String(i)];
        if (!a?.verdict) continue;
        const mark = markAnswer(problem, a.answer);
        feedback[String(i)] = {
          verdict: a.verdict,
          message: mark.message,
          note: mark.note,
          rightAnswer: answerLabel(problem),
          solution: problem.solution,
        };
      }
    const { title, instructions } = await this.titles(attempt);
    return {
      attemptId: attempt.id,
      kind,
      testKey: attempt.testKey,
      title,
      instructions,
      instant: INSTANT.includes(kind),
      amcScoring: AMC_SCORED.includes(kind),
      timeLimitSeconds: attempt.timeLimitSeconds,
      startedAt: attempt.startedAt.toISOString(),
      problems: resolved.map(({ problem }) => publicProblem(problem)),
      locators: resolved.map(({ item, problem }) => this.locator(item, problem)),
      redo: resolved.map(({ item }) => Boolean(item.errorLogId)),
      answers,
      feedback,
      facts: kind === 'light-review' ? await this.factCards() : [],
    };
  }

  private locator(item: MathTestItem, p: MathVariant) {
    return {
      ...(item.lessonId ? { lessonId: item.lessonId } : {}),
      activityKey: item.activityKey,
      problemId: item.problemId,
      ...(p.seed === undefined ? {} : { seed: p.seed }),
    };
  }

  async result(attempt: MathTestAttempt): Promise<TestResult> {
    const kind = attempt.kind as MathTestKind;
    const resolved = await this.resolve(Items.parse(attempt.items));
    const answers = Answers.catch({}).parse(attempt.answers);
    const skills = await this.content.skills();
    const skillOf = new Map(skills.map((s) => [s.id, s]));
    const review = resolved.map(({ item, problem }, i) => {
      const a = answers[String(i)];
      const mark = markAnswer(problem, a?.answer ?? '');
      return {
        number: i + 1,
        problem: publicProblem(problem),
        locator: this.locator(item, problem),
        given: a?.answer ?? '',
        skill: problem.skill,
        seconds: a?.seconds ?? 0,
        confidence: a?.confidence ?? null,
        flagged: a?.flagged ?? false,
        verdict: a?.verdict ?? mark.verdict,
        message: mark.message,
        note: mark.note,
        rightAnswer: answerLabel(problem),
        solution: problem.solution,
      };
    });
    const count = (v: string) => review.filter((r) => r.verdict === v).length;
    const amc = AMC_SCORED.includes(kind);
    const bands = (['1-10', '11-20', '21-25'] as const).flatMap((band) => {
      const mine = review.filter((r) => bandOf(r.number - 1) === band);
      if (mine.length === 0) return [];
      return [
        {
          band,
          correct: mine.filter((r) => r.verdict === 'correct').length,
          total: mine.length,
          points: mine.reduce((s, r) => s + pointsFor(r.verdict), 0),
        },
      ];
    });
    const strands = MATH_STRANDS.flatMap((s) => {
      const mine = review.filter((r) => skillOf.get(r.skill)?.strand === s.id);
      if (mine.length === 0) return [];
      return [
        {
          strand: s.id,
          label: s.label,
          correct: mine.filter((r) => r.verdict === 'correct').length,
          total: mine.length,
        },
      ];
    });
    const { title } = await this.titles(attempt);
    const previous =
      kind === 'diagnostic' || kind === 'checkpoint' || kind === 'mock'
        ? await this.db.client.mathTestAttempt.findFirst({
            where: {
              studentId: attempt.studentId,
              testKey: attempt.testKey,
              submittedAt: { not: null, lt: attempt.submittedAt ?? new Date() },
            },
            orderBy: { submittedAt: 'desc' },
          })
        : null;
    return {
      attemptId: attempt.id,
      kind,
      testKey: attempt.testKey,
      title,
      amcScoring: amc,
      submittedAt: (attempt.submittedAt ?? new Date()).toISOString(),
      correct: count('correct'),
      wrong: count('wrong') + count('form'),
      blank: count('blank'),
      total: review.length,
      points: amc ? (attempt.points ?? 0) : 0,
      maxPoints: amc ? review.length * 6 : 0,
      pointsIfGuessesBlank: amc ? pointsIfGuessesBlank(review) : null,
      bands: amc ? bands : [],
      strands,
      timeSinks: review
        .filter((r) => r.seconds > TIME_SINK_SECONDS)
        .map((r) => ({ number: r.number, seconds: r.seconds, verdict: r.verdict })),
      review,
      focusUnits: kind === 'diagnostic' ? await this.focusUnits(review, skillOf) : [],
      previousPoints: previous?.points ?? null,
    };
  }

  /** Diagnostic: the units with the most misses, with the skills behind them. */
  private async focusUnits(
    review: { verdict: string; skill: string }[],
    skillOf: Map<string, MathSkill>,
  ): Promise<TestResult['focusUnits']> {
    const misses = new Map<number, { count: number; skills: Set<string> }>();
    for (const r of review) {
      if (r.verdict === 'correct') continue;
      const skill = skillOf.get(r.skill);
      const unit = skill?.units[0];
      if (!skill || !unit) continue;
      const m = misses.get(unit) ?? { count: 0, skills: new Set<string>() };
      m.count += 1;
      m.skills.add(skill.label);
      misses.set(unit, m);
    }
    const top = [...misses].toSorted((a, b) => b[1].count - a[1].count).slice(0, 3);
    const units = await this.db.client.unit.findMany({
      where: { track: 'MATH', number: { in: top.map(([n]) => n) } },
      select: { number: true, title: true },
    });
    return top.map(([number, m]) => ({
      number,
      title: units.find((u) => u.number === number)?.title ?? `Unit ${number}`,
      reason: `${m.count} missed: ${[...m.skills].join(', ')}`,
    }));
  }

  private async titles(attempt: MathTestAttempt): Promise<{ title: string; instructions: string }> {
    const kind = attempt.kind as MathTestKind;
    if (kind === 'sprint' || kind === 'review' || kind === 'light-review') return TITLES[kind];
    const test = await this.content.test(attempt.testKey);
    return { title: test?.title ?? 'Test', instructions: test?.instructions ?? '' };
  }

  /** Three fact-sheet facts to read in a light review. */
  private async factCards(): Promise<MathFactCard[]> {
    const units = await this.content.factUnits();
    const cards: MathFactCard[] = [];
    for (const n of units) {
      const sheet = await this.content.facts(n);
      for (const s of sheet?.sections ?? [])
        for (const f of s.facts) cards.push({ title: s.title, text: f });
    }
    return shuffled(cards).slice(0, 3);
  }

  // ───────── helpers ─────────

  private async resolve(items: MathTestItem[]): Promise<Resolved[]> {
    const out: Resolved[] = [];
    for (const item of items) {
      const problem = await this.resolveOne(item);
      if (problem) out.push({ item, problem });
    }
    return out;
  }

  private async resolveOne(item: MathTestItem): Promise<MathVariant | null> {
    const testKey = testKeyOf(item.activityKey);
    const holder: { problems: MathProblem[] } | null = testKey
      ? await this.content.test(testKey)
      : await this.content.activity(item.activityKey);
    const base = holder?.problems.find((p) => p.id === item.problemId);
    return base ? problemVariant(base, base.template ? (item.seed ?? 0) : undefined) : null;
  }

  private expired(attempt: MathTestAttempt): boolean {
    if (!attempt.timeLimitSeconds) return false;
    return Date.now() > attempt.startedAt.getTime() + attempt.timeLimitSeconds * 1000 + GRACE_MS;
  }

  private async own(user: AuthUser, id: string): Promise<MathTestAttempt> {
    this.studentOnly(user);
    const attempt = await this.db.client.mathTestAttempt.findFirst({
      where: { id, studentId: user.id },
    });
    if (!attempt) throw notFound(ErrorCode.NOT_FOUND, 'Attempt not found.');
    return attempt;
  }

  private closed() {
    return new AppError(
      HttpStatus.CONFLICT,
      ErrorCode.QUIZ_ATTEMPT_CLOSED,
      'Already handed in',
      'This attempt is finished.',
    );
  }

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('Tests are for students.');
  }

  /** Review streak: days in a row (to today or yesterday) with the daily review done. */
  async streak(studentId: string): Promise<number> {
    const rows = await this.db.client.mathTestAttempt.findMany({
      where: { studentId, kind: 'review', submittedAt: { not: null } },
      orderBy: { startedAt: 'desc' },
      take: 120,
      select: { testKey: true },
    });
    const days = new Set(rows.map((r) => r.testKey.slice('review:'.length)));
    let streak = 0;
    let t = Date.now();
    if (!days.has(dayOf(new Date(t)))) t -= DAY;
    while (days.has(dayOf(new Date(t)))) {
      streak += 1;
      t -= DAY;
    }
    return streak;
  }
}
