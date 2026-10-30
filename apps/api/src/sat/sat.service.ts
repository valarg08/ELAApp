import { Injectable } from '@nestjs/common';
import type { SatAttempt } from '@storyforge/db';
import {
  ErrorCode,
  type SatAttemptView,
  type SatModuleKey,
  type SatModuleView,
  type SatQuestion,
  type SatQuestionPublic,
  type SatResult,
  type SatReviewItem,
  type SatStoredModule,
  SatStoredState,
  type SatWeekSummary,
  type SaveSatRequest,
  satNextModule,
  satTypedMatches,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { forbidden, notFound } from '../common/app-error.js';
import type { LoadedSatWeek } from '../curriculum/content-loader.js';
import { DatabaseService } from '../database/database.service.js';
import { SatContentService } from './sat-content.service.js';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** A question as the student sees it: no answer, no solution. */
const publicQuestion = (q: SatQuestion): SatQuestionPublic => ({
  id: q.id,
  kind: q.answer.kind === 'choice' ? 'choice' : 'typed',
  prompt: q.prompt,
  ...(q.figure ? { figure: q.figure } : {}),
  ...(q.answer.kind === 'choice' ? { choices: [...q.answer.choices] } : {}),
});

/** Whether an answer is right: the letter for a choice, the number rules for a typed answer. */
export const isRight = (q: SatQuestion, answer: string | undefined): boolean => {
  if (!answer?.trim()) return false;
  return q.answer.kind === 'choice'
    ? answer === q.answer.correct
    : satTypedMatches(answer, q.answer.accepted);
};

/** The right answer for the review: a letter, or the first accepted value. */
const correctText = (q: SatQuestion): string =>
  q.answer.kind === 'choice' ? q.answer.correct : (q.answer.accepted[0] ?? '');

/**
 * SAT Math's weekly test (sat-design.md): one attempt per student per week, two timed modules, the
 * second chosen from the first. The clock is the server's: any request after a module's deadline
 * hands that module in first. Answers and solutions are sent only after the test.
 */
@Injectable()
export class SatService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: SatContentService,
  ) {}

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('Only students take the SAT tests.');
  }

  async weeks(user: AuthUser): Promise<SatWeekSummary[]> {
    this.studentOnly(user);
    const [weeks, attempts] = await Promise.all([
      this.content.weeks(),
      this.db.client.satAttempt.findMany({ where: { studentId: user.id } }),
    ]);
    return weeks.map((w) => {
      const a = attempts.find((x) => x.week === w.week);
      return {
        week: w.week,
        title: w.title,
        sample: w.sample,
        questions: w.modules.m1.length + w.modules['m2-easy'].length,
        minutes: w.minutes,
        status: !a ? 'new' : a.submittedAt ? 'done' : 'in-progress',
        attemptId: a?.id ?? null,
        correct: a?.correct ?? null,
        total: a?.submittedAt ? a.total : null,
      };
    });
  }

  async start(user: AuthUser, weekNumber: number): Promise<SatAttemptView> {
    this.studentOnly(user);
    const week = await this.content.week(weekNumber);
    if (!week) throw notFound(ErrorCode.NOT_FOUND, 'That test does not exist.');
    const existing = await this.db.client.satAttempt.findUnique({
      where: { studentId_week: { studentId: user.id, week: weekNumber } },
    });
    if (existing) return this.settleAndView(existing);

    const now = new Date();
    const state = SatStoredState.parse({
      modules: [this.openModule('m1', week, now)],
    });
    const created = await this.db.client.satAttempt.create({
      data: {
        studentId: user.id,
        week: weekNumber,
        state,
        total: week.modules.m1.length + week.modules['m2-easy'].length,
      },
    });
    return this.view(created, state, week, now);
  }

  async get(user: AuthUser, id: string): Promise<SatAttemptView> {
    return this.settleAndView(await this.own(user, id));
  }

  async save(user: AuthUser, id: string, body: SaveSatRequest): Promise<SatAttemptView> {
    const row = await this.own(user, id);
    const week = await this.weekOf(row);
    const now = new Date();
    const state = this.settle(SatStoredState.parse(row.state), week, now);
    const open = state.modules.find((m) => !m.submittedAt);
    if (open) {
      const known = new Set(open.ids);
      const questions = new Map(week.modules[open.key].map((q) => [q.id, q]));
      open.answers = {};
      for (const [qid, value] of Object.entries(body.answers)) {
        const q = questions.get(qid);
        const v = value.trim();
        if (!q || !v) continue;
        if (q.answer.kind === 'choice' && !(LETTERS as readonly string[]).includes(v)) continue;
        open.answers[qid] = v;
      }
      open.marked = body.marked.filter((qid) => known.has(qid));
      open.struck = Object.fromEntries(
        Object.entries(body.struck).filter(([qid]) => known.has(qid)),
      );
    }
    const saved = await this.persist(row, state, week);
    return this.view(saved, state, week, now);
  }

  async submit(user: AuthUser, id: string): Promise<SatAttemptView> {
    const row = await this.own(user, id);
    const week = await this.weekOf(row);
    const now = new Date();
    let state = this.settle(SatStoredState.parse(row.state), week, now);
    const open = state.modules.find((m) => !m.submittedAt);
    if (open) state = this.close(state, open, week, now);
    const saved = await this.persist(row, state, week);
    return this.view(saved, state, week, now);
  }

  // ───────── State ─────────

  /** The attempt, if it is the student's (anyone else's answers 404). */
  private async own(user: AuthUser, id: string): Promise<SatAttempt> {
    this.studentOnly(user);
    const row = await this.db.client.satAttempt.findFirst({ where: { id, studentId: user.id } });
    if (!row) throw notFound(ErrorCode.NOT_FOUND, 'That test was not found.');
    return row;
  }

  private async weekOf(row: SatAttempt): Promise<LoadedSatWeek> {
    const week = await this.content.week(row.week);
    if (!week) throw notFound(ErrorCode.NOT_FOUND, 'That test is no longer available.');
    return week;
  }

  private async settleAndView(row: SatAttempt): Promise<SatAttemptView> {
    const week = await this.weekOf(row);
    const now = new Date();
    const state = this.settle(SatStoredState.parse(row.state), week, now);
    const saved = await this.persist(row, state, week);
    return this.view(saved, state, week, now);
  }

  private openModule(key: SatModuleKey, week: LoadedSatWeek, now: Date): SatStoredModule {
    return {
      key,
      ids: week.modules[key].map((q) => q.id),
      startedAt: now.toISOString(),
      deadline: new Date(now.getTime() + week.minutes * 60_000).toISOString(),
      submittedAt: null,
      correct: null,
      answers: {},
      marked: [],
      struck: {},
    };
  }

  /** Hands in every module whose time has run out (module 2 then starts at `now`). */
  private settle(state: SatStoredState, week: LoadedSatWeek, now: Date): SatStoredState {
    let current = state;
    for (;;) {
      const open = current.modules.find((m) => !m.submittedAt);
      if (!open || now.getTime() < new Date(open.deadline).getTime()) return current;
      current = this.close(current, open, week, now);
    }
  }

  /** Scores a module and, after module 1, opens the module 2 its result calls for. */
  private close(
    state: SatStoredState,
    mod: SatStoredModule,
    week: LoadedSatWeek,
    now: Date,
  ): SatStoredState {
    const questions = new Map(week.modules[mod.key].map((q) => [q.id, q]));
    const correct = mod.ids.filter((qid) => {
      const q = questions.get(qid);
      return q ? isRight(q, mod.answers[qid]) : false;
    }).length;
    const closed: SatStoredModule = { ...mod, submittedAt: now.toISOString(), correct };
    const modules = state.modules.map((m) => (m === mod ? closed : m));
    if (mod.key === 'm1')
      modules.push(this.openModule(satNextModule(correct, mod.ids.length), week, now));
    return SatStoredState.parse({ modules });
  }

  private async persist(
    row: SatAttempt,
    state: SatStoredState,
    week: LoadedSatWeek,
  ): Promise<SatAttempt> {
    const done = state.modules.length === 2 && state.modules.every((m) => m.submittedAt);
    const correct = done ? state.modules.reduce((n, m) => n + (m.correct ?? 0), 0) : null;
    const total = done ? state.modules.reduce((n, m) => n + m.ids.length, 0) : row.total;
    void week;
    return this.db.client.satAttempt.update({
      where: { id: row.id },
      data: {
        state: SatStoredState.parse(state),
        ...(done ? { submittedAt: new Date(state.modules[1]!.submittedAt!), correct, total } : {}),
      },
    });
  }

  // ───────── Views ─────────

  private view(
    row: SatAttempt,
    state: SatStoredState,
    week: LoadedSatWeek,
    now: Date,
  ): SatAttemptView {
    const open = state.modules.find((m) => !m.submittedAt);
    if (open) return this.moduleView(row, state, week, open, now);
    return this.resultView(row, state, week);
  }

  private moduleView(
    row: SatAttempt,
    state: SatStoredState,
    week: LoadedSatWeek,
    open: SatStoredModule,
    now: Date,
  ): SatModuleView {
    const byId = new Map(week.modules[open.key].map((q) => [q.id, q]));
    return {
      phase: 'module',
      id: row.id,
      week: week.week,
      title: week.title,
      module: state.modules.indexOf(open) === 0 ? 1 : 2,
      minutes: week.minutes,
      deadline: open.deadline,
      serverNow: now.toISOString(),
      questions: open.ids.flatMap((qid) => {
        const q = byId.get(qid);
        return q ? [publicQuestion(q)] : [];
      }),
      answers: open.answers,
      marked: open.marked,
      struck: open.struck,
    };
  }

  private resultView(row: SatAttempt, state: SatStoredState, week: LoadedSatWeek): SatResult {
    const review: SatReviewItem[] = state.modules.flatMap((mod, mi) => {
      const byId = new Map(week.modules[mod.key].map((q) => [q.id, q]));
      return mod.ids.flatMap((qid, i) => {
        const q = byId.get(qid);
        if (!q) return [];
        const mine = mod.answers[qid] ?? null;
        return [
          {
            id: q.id,
            module: mi === 0 ? 1 : 2,
            number: i + 1,
            kind: q.answer.kind === 'choice' ? 'choice' : 'typed',
            prompt: q.prompt,
            ...(q.figure ? { figure: q.figure } : {}),
            ...(q.answer.kind === 'choice' ? { choices: [...q.answer.choices] } : {}),
            yourAnswer: mine,
            correctAnswer: correctText(q),
            correct: isRight(q, mine ?? undefined),
            solution: q.solution,
            skill: q.skill,
            difficulty: q.difficulty,
          } satisfies SatReviewItem,
        ];
      });
    });
    return {
      phase: 'done',
      id: row.id,
      week: week.week,
      title: week.title,
      correct: state.modules.reduce((n, m) => n + (m.correct ?? 0), 0),
      total: state.modules.reduce((n, m) => n + m.ids.length, 0),
      modules: state.modules.map((m) => ({ correct: m.correct ?? 0, total: m.ids.length })),
      variant: state.modules[1]?.key === 'm2-hard' ? 'hard' : 'easy',
      submittedAt: state.modules[1]?.submittedAt ?? new Date().toISOString(),
      review,
    };
  }
}
