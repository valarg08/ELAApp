import { HttpStatus, Injectable } from '@nestjs/common';
import type { QuizAttempt } from '@storyforge/db';
import {
  ErrorCode,
  type MathProblem,
  type ProblemSetActivity,
  type ProblemSetAttemptView,
  type ProblemSetResult,
  type ProblemSetStatus,
  type SubmitProblemSetRequest,
  answerLabel,
  markAnswer,
  publicProblem,
} from '@storyforge/shared';
import { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { ErrorLogService } from './error-log.service.js';
import { MathContentService } from './math-content.service.js';

const ProblemIds = z.array(z.string());
const Answers = z.record(z.string(), z.string());

/** A random order (Fisher–Yates). */
function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const percentOf = (score: number, total: number) =>
  total === 0 ? 0 : Math.round((score / total) * 100);

/**
 * Marked problem sets (Math challenges and unit checks, DESIGN.md §9.13). Attempts live in
 * QuizAttempt like marked quizzes: the server picks the problems (easiest first, as on the AMC),
 * marks them with math-check, keeps every attempt and adds every miss to the error log. `passed`
 * means done: a pass at `passPercent`, or any submitted attempt when the set has no pass mark.
 */
@Injectable()
export class ProblemSetService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
    private readonly errorLog: ErrorLogService,
  ) {}

  async status(user: AuthUser, lessonId: string, key: string): Promise<ProblemSetStatus> {
    const set = await this.load(user, lessonId, key);
    const attempts = await this.finished(user, lessonId, key);
    const best = attempts.reduce<number | null>(
      (max, a) => Math.max(max ?? 0, percentOf(a.score ?? 0, a.total)),
      null,
    );
    const last = attempts.at(0);
    return {
      attempts: attempts.length,
      bestPercent: best,
      done: attempts.some((a) => a.passed),
      passPercent: set.passPercent ?? null,
      problemCount: set.problemsPerAttempt ?? set.problems.length,
      timeLimitMinutes: set.timeLimitMinutes ?? null,
      last: last ? this.result(set, last, 0) : null,
    };
  }

  /** The unfinished attempt if there is one, else a new attempt with fresh problems. */
  async start(user: AuthUser, lessonId: string, key: string): Promise<ProblemSetAttemptView> {
    this.studentOnly(user);
    const set = await this.load(user, lessonId, key);
    const open = await this.db.client.quizAttempt.findFirst({
      where: { studentId: user.id, lessonId, activityKey: key, submittedAt: null },
      orderBy: { startedAt: 'desc' },
    });
    const finished = await this.finished(user, lessonId, key);
    const attemptNumber = finished.length + 1;
    if (open) {
      const problems = this.problems(set, ProblemIds.parse(open.questionIds));
      if (problems.length > 0) return this.view(set, open, attemptNumber, problems);
    }

    const seen = new Set(finished[0] ? ProblemIds.parse(finished[0].questionIds) : []);
    const count = set.problemsPerAttempt ?? set.problems.length;
    const picked = shuffled(set.problems)
      .toSorted((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)))
      .slice(0, count)
      .toSorted((a, b) => a.difficulty - b.difficulty);
    const ids = picked.map((p) => p.id);
    const attempt = await this.db.client.quizAttempt.create({
      data: { studentId: user.id, lessonId, activityKey: key, questionIds: ids, total: ids.length },
    });
    return this.view(set, attempt, attemptNumber, picked);
  }

  async submit(
    user: AuthUser,
    lessonId: string,
    key: string,
    attemptId: string,
    body: SubmitProblemSetRequest,
  ): Promise<ProblemSetResult> {
    this.studentOnly(user);
    const set = await this.load(user, lessonId, key);
    const attempt = await this.db.client.quizAttempt.findFirst({
      where: { id: attemptId, studentId: user.id, lessonId, activityKey: key },
    });
    if (!attempt) throw notFound(ErrorCode.NOT_FOUND, 'Attempt not found.');
    if (attempt.submittedAt) {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.QUIZ_ATTEMPT_CLOSED,
        'Already marked',
        'This try is finished. Start a new one.',
      );
    }

    const problems = this.problems(set, ProblemIds.parse(attempt.questionIds));
    const answers = Object.fromEntries(
      problems.map((p) => [p.id, (body.answers[p.id] ?? '').trim()]),
    );
    const marks = problems.map((p) => ({ p, mark: markAnswer(p, answers[p.id] ?? '') }));
    const score = marks.filter((m) => m.mark.verdict === 'correct').length;
    const passed =
      set.passPercent === undefined || percentOf(score, problems.length) >= set.passPercent;
    const saved = await this.db.client.quizAttempt.update({
      where: { id: attempt.id },
      data: { answers, score, total: problems.length, passed, submittedAt: new Date() },
    });

    const missed = marks.filter((m) => m.mark.verdict !== 'correct');
    for (const { p } of missed) await this.errorLog.record(user.id, lessonId, key, p.id, p.skill);
    return this.result(set, saved, missed.length);
  }

  // ───────── helpers ─────────

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('Only students take problem sets.');
  }

  private async load(user: AuthUser, lessonId: string, key: string): Promise<ProblemSetActivity> {
    const { activity } = await this.content.lessonActivity(user, lessonId, key);
    if (activity.type !== 'PROBLEM_SET')
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Problem set not found.');
    return activity;
  }

  /** Finished attempts, newest first. */
  private finished(user: AuthUser, lessonId: string, key: string): Promise<QuizAttempt[]> {
    return this.db.client.quizAttempt.findMany({
      where: { studentId: user.id, lessonId, activityKey: key, submittedAt: { not: null } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  /** The problems with these ids, in this order (ones removed from the content are skipped). */
  private problems(set: ProblemSetActivity, ids: readonly string[]): MathProblem[] {
    return ids.flatMap((id) => set.problems.filter((p) => p.id === id));
  }

  private view(
    set: ProblemSetActivity,
    attempt: QuizAttempt,
    attemptNumber: number,
    problems: MathProblem[],
  ): ProblemSetAttemptView {
    return {
      attemptId: attempt.id,
      attemptNumber,
      passPercent: set.passPercent ?? null,
      timeLimitMinutes: set.timeLimitMinutes ?? null,
      startedAt: attempt.startedAt.toISOString(),
      problems: problems.map(publicProblem),
    };
  }

  private result(
    set: ProblemSetActivity,
    attempt: QuizAttempt,
    addedToErrorLog: number,
  ): ProblemSetResult {
    const answers = Answers.catch({}).parse(attempt.answers);
    const review = this.problems(set, ProblemIds.parse(attempt.questionIds)).map((p) => {
      const given = answers[p.id] ?? '';
      return {
        problem: publicProblem(p),
        given,
        verdict: markAnswer(p, given).verdict,
        rightAnswer: answerLabel(p),
        solution: p.solution,
        skill: p.skill,
      };
    });
    const score = attempt.score ?? 0;
    return {
      attemptId: attempt.id,
      score,
      total: attempt.total,
      percent: percentOf(score, attempt.total),
      passed: attempt.passed,
      passPercent: set.passPercent ?? null,
      review,
      reviewSkills: [...new Set(review.flatMap((r) => (r.verdict === 'correct' ? [] : [r.skill])))],
      addedToErrorLog,
    };
  }
}
