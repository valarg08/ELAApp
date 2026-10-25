import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { MathErrorLog } from '@storyforge/db';
import {
  type AddErrorLogRequest,
  ErrorCode,
  type ErrorLogEntry,
  type ErrorLogList,
  type MathProblem,
  type MathVariant,
  REDOS_TO_RESOLVE,
  type RedoRequest,
  type RedoResponse,
  answerLabel,
  markAnswer,
  problemVariant,
  publicProblem,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { AnswerLogService } from './answer-log.service.js';
import {
  type EngineTrack,
  MathContentService,
  testKeyOf,
  trackKeyFilter,
} from './math-content.service.js';

/** Calendar day (UTC) of a time, for "one right redo counts per day". */
const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The seed of a template problem's next redo: new numbers after every counted redo, so the answer
 * can't be remembered (math-design.md §3.1 A2). Stable until the entry changes.
 */
export function redoSeed(row: Pick<MathErrorLog, 'id' | 'wrongTimes' | 'correctRedos'>): number {
  const h = createHash('sha256').update(`${row.id}|${row.wrongTimes}|${row.correctRedos}`).digest();
  return h.readUInt32BE(0) % 2_147_483_647;
}

/**
 * The error log (math-design.md): missed problems to redo. Marked sets add their misses; in
 * practice and after a test the student adds one with "Add to my error log". A problem is resolved
 * after REDOS_TO_RESOLVE right redos on different days; a wrong redo starts the count again.
 */
@Injectable()
export class ErrorLogService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
    private readonly answers: AnswerLogService,
  ) {}

  /** One track's log: Math and Mental Math keep separate error logs. */
  async list(user: AuthUser, track: EngineTrack = 'MATH'): Promise<ErrorLogList> {
    this.studentOnly(user);
    const rows = await this.db.client.mathErrorLog.findMany({
      where: { studentId: user.id, ...trackKeyFilter(track) },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
    const entries = await this.entries(rows);
    return {
      open: entries.filter((e) => !e.resolvedAt),
      resolved: entries.filter((e) => e.resolvedAt).slice(0, 50),
    };
  }

  /** "Add to my error log" from practice, or from a test's review. */
  async add(user: AuthUser, body: AddErrorLogRequest): Promise<ErrorLogEntry> {
    this.studentOnly(user);
    const found = await this.content.locate(user, body, { afterHandIn: true });
    const row = await this.record(
      user.id,
      body.lessonId ?? '',
      body.activityKey,
      found.base.id,
      found.base.skill,
      found.problem.seed,
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
    seed?: number,
  ) {
    return this.db.client.mathErrorLog.upsert({
      where: { studentId_activityKey_problemId: { studentId, activityKey, problemId } },
      create: { studentId, lessonId, activityKey, problemId, skill, seed: seed ?? null },
      update: {
        wrongTimes: { increment: 1 },
        correctRedos: 0,
        resolvedAt: null,
        lessonId,
        seed: seed ?? null,
      },
    });
  }

  async redo(user: AuthUser, id: string, body: RedoRequest): Promise<RedoResponse> {
    this.studentOnly(user);
    const row = await this.db.client.mathErrorLog.findFirst({ where: { id, studentId: user.id } });
    const base = row ? await this.baseProblem(row) : null;
    if (!row || !base) throw notFound(ErrorCode.NOT_FOUND, 'Error log entry not found.');
    const problem = this.redoProblem(row, base);
    const result = await this.check(user, row, problem, body.answer);
    const [entry] = await this.entries([result.updated]);
    if (!entry) throw notFound();
    const { mark } = result;
    const reveal = mark.verdict === 'correct' || (mark.verdict === 'wrong' && mark.readable);
    return {
      verdict: mark.verdict,
      message: result.message,
      note: mark.note,
      entry,
      solution: reveal ? problem.solution : '',
      rightAnswer: reveal ? answerLabel(problem) : null,
    };
  }

  /**
   * Mark a redo (from the error log or the daily review) and update the entry: a right redo
   * counts once a day, a wrong one starts the count again.
   */
  async check(user: AuthUser, row: MathErrorLog, problem: MathVariant, answer: string) {
    const mark = markAnswer(problem, answer);
    const now = new Date();
    let message = mark.message;
    let updated = row;
    if (mark.verdict === 'correct') {
      const counts = !row.lastRedoAt || dayOf(row.lastRedoAt) !== dayOf(now);
      if (counts && !row.resolvedAt) {
        const correctRedos = row.correctRedos + 1;
        const resolved = correctRedos >= REDOS_TO_RESOLVE;
        updated = await this.db.client.mathErrorLog.update({
          where: { id: row.id },
          data: { correctRedos, lastRedoAt: now, ...(resolved ? { resolvedAt: now } : {}) },
        });
        message = resolved
          ? 'Right again: this one is resolved.'
          : `Right! ${REDOS_TO_RESOLVE - correctRedos} more right redo on another day resolves it.`;
      } else if (!row.resolvedAt) {
        message = 'Right! One redo counts per day, so try it again tomorrow.';
      }
    } else if (mark.verdict === 'wrong' && mark.readable) {
      updated = await this.db.client.mathErrorLog.update({
        where: { id: row.id },
        data: { wrongTimes: { increment: 1 }, correctRedos: 0 },
      });
      message = 'Not yet. Read the solution, then try it again another day.';
    }
    if (mark.readable && mark.verdict !== 'blank')
      await this.answers.record(user.id, [
        {
          source: 'redo',
          lessonId: row.lessonId || null,
          activityKey: row.activityKey,
          problemId: row.problemId,
          seed: problem.seed ?? null,
          skill: problem.skill,
          difficulty: problem.difficulty,
          verdict: mark.verdict,
        },
      ]);
    return { mark, message, updated };
  }

  /** The problem behind an entry (a lesson activity or a test), or null if it left the content. */
  async baseProblem(
    row: Pick<MathErrorLog, 'activityKey' | 'problemId'>,
  ): Promise<MathProblem | null> {
    const testKey = testKeyOf(row.activityKey);
    const holder = testKey
      ? await this.content.test(testKey)
      : await this.content.activity(row.activityKey);
    return holder?.problems.find((p) => p.id === row.problemId) ?? null;
  }

  /** The variant to redo now: new numbers for a template problem. */
  redoProblem(row: MathErrorLog, base: MathProblem): MathVariant {
    return problemVariant(base, base.template ? redoSeed(row) : undefined);
  }

  // ───────── helpers ─────────

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('The error log is for students.');
  }

  /** Entries with their problems (rows whose problem left the content are skipped). */
  async entries(rows: MathErrorLog[]): Promise<ErrorLogEntry[]> {
    const bases = new Map(
      await Promise.all(rows.map(async (r) => [r.id, await this.baseProblem(r)] as const)),
    );
    const lessons = new Map(
      (
        await this.db.client.lesson.findMany({
          where: { id: { in: [...new Set(rows.map((r) => r.lessonId).filter(Boolean))] } },
          select: { id: true, title: true, unit: { select: { number: true } } },
        })
      ).map((l) => [l.id, l]),
    );
    const testTitles = new Map<string, string>();
    for (const key of new Set(rows.flatMap((r) => testKeyOf(r.activityKey) ?? []))) {
      testTitles.set(key, (await this.content.test(key))?.title ?? 'Test');
    }
    const labels = new Map((await this.content.skills()).map((s) => [s.id, s.label]));
    const today = dayOf(new Date());
    return rows.flatMap((row) => {
      const base = bases.get(row.id);
      if (!base) return [];
      const lesson = lessons.get(row.lessonId);
      const testKey = testKeyOf(row.activityKey);
      const redo = this.redoProblem(row, base);
      return [
        {
          id: row.id,
          lessonId: row.lessonId,
          lessonTitle: testKey ? (testTitles.get(testKey) ?? '') : (lesson?.title ?? ''),
          unitNumber: lesson?.unit.number ?? 0,
          activityKey: row.activityKey,
          // The skill's name (older rows may hold free text from before the skill list).
          skill: labels.get(row.skill) ?? row.skill,
          problem: publicProblem(redo),
          missed:
            base.template && row.seed !== null
              ? publicProblem(problemVariant(base, row.seed))
              : null,
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
