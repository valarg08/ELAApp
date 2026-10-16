import { Injectable } from '@nestjs/common';
import type { MathErrorLog } from '@storyforge/db';
import {
  type AddErrorLogRequest,
  ErrorCode,
  type ErrorLogEntry,
  type ErrorLogList,
  REDOS_TO_RESOLVE,
  type RedoRequest,
  type RedoResponse,
  answerLabel,
  markAnswer,
  publicProblem,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { MathContentService } from './math-content.service.js';

/** Calendar day (UTC) of a time, for "one right redo counts per day". */
const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The error log (DESIGN.md §9.13): missed problems to redo. Marked sets add their misses; in
 * practice the student adds one with "Add to my error log". A problem is resolved after
 * REDOS_TO_RESOLVE right redos on different days; a wrong redo starts the count again.
 */
@Injectable()
export class ErrorLogService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
  ) {}

  async list(user: AuthUser): Promise<ErrorLogList> {
    this.studentOnly(user);
    const rows = await this.db.client.mathErrorLog.findMany({
      where: { studentId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
    const entries = await this.entries(rows);
    return {
      open: entries.filter((e) => !e.resolvedAt),
      resolved: entries.filter((e) => e.resolvedAt).slice(0, 50),
    };
  }

  /** From practice: "Add to my error log". */
  async add(user: AuthUser, body: AddErrorLogRequest): Promise<ErrorLogEntry> {
    this.studentOnly(user);
    const { activity } = await this.content.lessonActivity(user, body.lessonId, body.activityKey);
    const problem = this.content.problem(activity, body.problemId);
    const row = await this.record(
      user.id,
      body.lessonId,
      body.activityKey,
      problem.id,
      problem.skill,
    );
    const [entry] = await this.entries([row]);
    if (!entry) throw notFound();
    return entry;
  }

  /** A miss, added or counted again (marked sets call this for every problem not right). */
  record(
    studentId: string,
    lessonId: string,
    activityKey: string,
    problemId: string,
    skill: string,
  ) {
    return this.db.client.mathErrorLog.upsert({
      where: { studentId_activityKey_problemId: { studentId, activityKey, problemId } },
      create: { studentId, lessonId, activityKey, problemId, skill },
      update: { wrongTimes: { increment: 1 }, correctRedos: 0, resolvedAt: null, lessonId },
    });
  }

  async redo(user: AuthUser, id: string, body: RedoRequest): Promise<RedoResponse> {
    this.studentOnly(user);
    const row = await this.db.client.mathErrorLog.findFirst({ where: { id, studentId: user.id } });
    const activity = row ? await this.content.activity(row.activityKey) : null;
    if (!row || !activity) throw notFound(ErrorCode.NOT_FOUND, 'Error log entry not found.');
    const problem = this.content.problem(activity, row.problemId);
    const mark = markAnswer(problem, body.answer);
    const now = new Date();

    let message = mark.message;
    let updated = row;
    if (mark.verdict === 'correct') {
      const counts = !row.lastRedoAt || dayOf(row.lastRedoAt) !== dayOf(now);
      if (counts && !row.resolvedAt) {
        const correctRedos = row.correctRedos + 1;
        const resolved = correctRedos >= REDOS_TO_RESOLVE;
        updated = await this.db.client.mathErrorLog.update({
          where: { id },
          data: { correctRedos, lastRedoAt: now, ...(resolved ? { resolvedAt: now } : {}) },
        });
        message = resolved
          ? 'Right again: this one is resolved! 🎉'
          : `Right! ${REDOS_TO_RESOLVE - correctRedos} more right redo on another day resolves it.`;
      } else if (!row.resolvedAt) {
        message = 'Right! One redo counts per day, so try it again tomorrow.';
      }
    } else if (mark.verdict === 'wrong' && mark.readable) {
      updated = await this.db.client.mathErrorLog.update({
        where: { id },
        data: { wrongTimes: { increment: 1 }, correctRedos: 0 },
      });
      message = 'Not yet. Read the solution, then try it again another day.';
    }

    const [entry] = await this.entries([updated]);
    if (!entry) throw notFound();
    const reveal = mark.verdict === 'correct' || (mark.verdict === 'wrong' && mark.readable);
    return {
      verdict: mark.verdict,
      message,
      entry,
      solution: reveal ? problem.solution : '',
      rightAnswer: reveal ? answerLabel(problem) : null,
    };
  }

  // ───────── helpers ─────────

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('The error log is for students.');
  }

  /** Entries with their problems (rows whose problem left the content are skipped). */
  private async entries(rows: MathErrorLog[]): Promise<ErrorLogEntry[]> {
    const keys = [...new Set(rows.map((r) => r.activityKey))];
    const activities = new Map(
      await Promise.all(keys.map(async (k) => [k, await this.content.activity(k)] as const)),
    );
    const lessons = new Map(
      (
        await this.db.client.lesson.findMany({
          where: { id: { in: [...new Set(rows.map((r) => r.lessonId))] } },
          select: { id: true, title: true, unit: { select: { number: true } } },
        })
      ).map((l) => [l.id, l]),
    );
    const today = dayOf(new Date());
    return rows.flatMap((row) => {
      const problem = activities.get(row.activityKey)?.problems.find((p) => p.id === row.problemId);
      if (!problem) return [];
      const lesson = lessons.get(row.lessonId);
      return [
        {
          id: row.id,
          lessonId: row.lessonId,
          lessonTitle: lesson?.title ?? '',
          unitNumber: lesson?.unit.number ?? 0,
          activityKey: row.activityKey,
          skill: row.skill,
          problem: publicProblem(problem),
          wrongTimes: row.wrongTimes,
          correctRedos: row.correctRedos,
          lastRedoAt: row.lastRedoAt?.toISOString() ?? null,
          resolvedAt: row.resolvedAt?.toISOString() ?? null,
          createdAt: row.createdAt.toISOString(),
          canCountToday: !row.lastRedoAt || dayOf(row.lastRedoAt) !== today,
        },
      ];
    });
  }
}
