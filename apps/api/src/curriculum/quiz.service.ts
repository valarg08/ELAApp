import { HttpStatus, Injectable } from '@nestjs/common';
import type { QuizAttempt } from '@storyforge/db';
import {
  ActivityContent,
  ErrorCode,
  LessonSteps,
  type QuizActivity,
  type QuizAttemptView,
  type QuizResult,
  type QuizStatus,
  type SubmitQuizRequest,
} from '@storyforge/shared';
import { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { CurriculumService } from './curriculum.service.js';

const QuestionIds = z.array(z.string());
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
 * Marked quizzes (Essay Writing unit checks, DESIGN.md §9.12). The server picks the questions for
 * each attempt (questions from the last attempt go to the back of the queue, so a retry feels new),
 * marks the answers, and keeps every attempt. The lesson's practice step completes only after a
 * passed attempt.
 */
@Injectable()
export class QuizService {
  constructor(
    private readonly db: DatabaseService,
    private readonly curriculum: CurriculumService,
  ) {}

  async status(user: AuthUser, lessonId: string, key: string): Promise<QuizStatus> {
    const quiz = await this.load(user, lessonId, key);
    const attempts = await this.finished(user, lessonId, key);
    const best = attempts.reduce<number | null>(
      (max, a) => Math.max(max ?? 0, percentOf(a.score ?? 0, a.total)),
      null,
    );
    const last = attempts.at(0);
    return {
      attempts: attempts.length,
      bestPercent: best,
      passed: attempts.some((a) => a.passed),
      passPercent: quiz.passPercent,
      questionCount: quiz.questionsPerAttempt ?? quiz.questions.length,
      last: last ? this.result(quiz, last) : null,
    };
  }

  /** The unfinished attempt if there is one, else a new attempt with fresh questions. */
  async start(user: AuthUser, lessonId: string, key: string): Promise<QuizAttemptView> {
    const quiz = await this.load(user, lessonId, key);
    const open = await this.db.client.quizAttempt.findFirst({
      where: { studentId: user.id, lessonId, activityKey: key, submittedAt: null },
      orderBy: { startedAt: 'desc' },
    });
    const finished = await this.finished(user, lessonId, key);
    const attemptNumber = finished.length + 1;
    if (open) {
      const questions = this.questions(quiz, QuestionIds.parse(open.questionIds));
      if (questions.length > 0) return this.view(quiz, open.id, attemptNumber, questions);
    }

    const seen = new Set(finished[0] ? QuestionIds.parse(finished[0].questionIds) : []);
    const count = quiz.questionsPerAttempt ?? quiz.questions.length;
    const picked = shuffled(quiz.questions)
      .toSorted((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)))
      .slice(0, count);
    const ids = shuffled(picked).map((q) => q.id);
    const attempt = await this.db.client.quizAttempt.create({
      data: {
        studentId: user.id,
        lessonId,
        activityKey: key,
        questionIds: ids,
        total: ids.length,
      },
    });
    return this.view(quiz, attempt.id, attemptNumber, this.questions(quiz, ids));
  }

  async submit(
    user: AuthUser,
    lessonId: string,
    key: string,
    attemptId: string,
    body: SubmitQuizRequest,
  ): Promise<QuizResult> {
    const quiz = await this.load(user, lessonId, key);
    const attempt = await this.db.client.quizAttempt.findFirst({
      where: { id: attemptId, studentId: user.id, lessonId, activityKey: key },
    });
    if (!attempt) throw notFound(ErrorCode.NOT_FOUND, 'Quiz attempt not found.');
    if (attempt.submittedAt) {
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.QUIZ_ATTEMPT_CLOSED,
        'Already marked',
        'This try is finished. Start a new one.',
      );
    }

    const questions = this.questions(quiz, QuestionIds.parse(attempt.questionIds));
    const missing = questions.filter(
      (q) => !q.options.some((o) => o.id === body.answers[q.id]),
    ).length;
    if (missing > 0) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Not finished',
        `Answer every question first (${missing} left).`,
      );
    }
    const answers = Object.fromEntries(questions.map((q) => [q.id, body.answers[q.id] ?? '']));
    const score = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    const passed = percentOf(score, questions.length) >= quiz.passPercent;
    const saved = await this.db.client.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        answers,
        score,
        total: questions.length,
        passed,
        submittedAt: new Date(),
      },
    });
    return this.result(quiz, saved);
  }

  // ───────── helpers ─────────

  /** The quiz, if it is a practice activity of a lesson this student may open. */
  private async load(user: AuthUser, lessonId: string, key: string): Promise<QuizActivity> {
    const { lesson } = await this.curriculum.openLesson(user, lessonId);
    const [, , practice] = LessonSteps.parse(lesson.steps);
    const row = practice.activityKeys.includes(key)
      ? await this.db.client.activity.findUnique({ where: { key } })
      : null;
    const parsed = row ? ActivityContent.safeParse(row.config) : null;
    if (!parsed?.success || parsed.data.type !== 'QUIZ')
      throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Quiz not found.');
    return parsed.data;
  }

  /** Finished attempts, newest first. */
  private finished(user: AuthUser, lessonId: string, key: string): Promise<QuizAttempt[]> {
    return this.db.client.quizAttempt.findMany({
      where: { studentId: user.id, lessonId, activityKey: key, submittedAt: { not: null } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  /** The questions with these ids, in this order (ones removed from the content are skipped). */
  private questions(quiz: QuizActivity, ids: readonly string[]) {
    return ids.flatMap((id) => quiz.questions.filter((q) => q.id === id));
  }

  private view(
    quiz: QuizActivity,
    attemptId: string,
    attemptNumber: number,
    questions: QuizActivity['questions'],
  ): QuizAttemptView {
    return {
      attemptId,
      attemptNumber,
      passPercent: quiz.passPercent,
      questions: questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
    };
  }

  private result(quiz: QuizActivity, attempt: QuizAttempt): QuizResult {
    const answers = Answers.catch({}).parse(attempt.answers);
    const questions = this.questions(quiz, QuestionIds.parse(attempt.questionIds));
    const review = questions.map((q) => ({
      questionId: q.id,
      prompt: q.prompt,
      options: q.options,
      chosenOptionId: answers[q.id] ?? '',
      correctOptionId: q.correctOptionId,
      correct: answers[q.id] === q.correctOptionId,
      explanation: q.explanation,
      skill: q.skill ?? null,
    }));
    const score = attempt.score ?? 0;
    return {
      attemptId: attempt.id,
      score,
      total: attempt.total,
      percent: percentOf(score, attempt.total),
      passed: attempt.passed,
      passPercent: quiz.passPercent,
      review,
      reviewSkills: [...new Set(review.flatMap((r) => (!r.correct && r.skill ? [r.skill] : [])))],
    };
  }
}
