import { HttpStatus, Injectable } from '@nestjs/common';
import type { SatPracticeSession } from '@storyforge/db';
import {
  ErrorCode,
  SAT_DOMAINS,
  SAT_PRACTICE_SIZE,
  SAT_RECENT_ANSWERS,
  type SatPracticeAnswerRequest,
  type SatPracticeQuestion,
  type SatPracticeResponse,
  type SatPracticeSummary,
  type SatPracticeView,
  type SatQuestion,
  type SatSkillStanding,
  type SatSkillStats,
  SatPracticeState,
  SatStoredState,
  satAccuracy,
  satNextLevel,
  satPickNext,
  satStartLevel,
  satTypedError,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { SatContentService } from './sat-content.service.js';
import { isRight } from './sat.service.js';

const SKILLS = SAT_DOMAINS.flatMap((d) =>
  d.skills.map((k) => ({
    id: k.id as string,
    label: k.label as string,
    domain: d.id as string,
    domainLabel: d.label as string,
  })),
);

interface Event {
  id: string;
  skill: string;
  correct: boolean;
  at: number;
}

/**
 * SAT adaptive practice (sat-design.md §7): short untimed sets that go where the student is weakest.
 * A skill's standing comes from the latest answers in finished tests and earlier practice; each
 * set moves a skill's difficulty up after a right answer and down after a wrong one. Answers and
 * solutions are sent only once a question has been answered.
 */
@Injectable()
export class SatPracticeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: SatContentService,
  ) {}

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden('Only students practise the SAT.');
  }

  /** Every question of every week, once. */
  private async bank(): Promise<Map<string, SatQuestion>> {
    const out = new Map<string, SatQuestion>();
    for (const week of await this.content.weeks())
      for (const list of Object.values(week.modules)) for (const q of list) out.set(q.id, q);
    return out;
  }

  /** What the student has answered in finished tests and in practice, newest first. */
  private async events(studentId: string, bank: Map<string, SatQuestion>): Promise<Event[]> {
    const [attempts, sessions] = await Promise.all([
      this.db.client.satAttempt.findMany({ where: { studentId, submittedAt: { not: null } } }),
      this.db.client.satPracticeSession.findMany({ where: { studentId } }),
    ]);
    const events: Event[] = [];
    for (const a of attempts) {
      const state = SatStoredState.safeParse(a.state);
      if (!state.success) continue;
      for (const mod of state.data.modules)
        for (const id of mod.ids) {
          const q = bank.get(id);
          if (q)
            events.push({
              id,
              skill: q.skill,
              correct: isRight(q, mod.answers[id]),
              at: (a.submittedAt ?? a.startedAt).getTime(),
            });
        }
    }
    for (const s of sessions) {
      const state = SatPracticeState.safeParse(s.state);
      if (!state.success) continue;
      for (const h of state.data.history)
        events.push({ id: h.id, skill: h.skill, correct: h.correct, at: new Date(h.at).getTime() });
    }
    return events.toSorted((a, b) => b.at - a.at);
  }

  private statsOf(events: Event[]): Record<string, SatSkillStats> {
    const stats: Record<string, SatSkillStats> = {};
    for (const e of events) {
      const s = (stats[e.skill] ??= { right: 0, total: 0 });
      if (s.total >= SAT_RECENT_ANSWERS) continue;
      s.total += 1;
      if (e.correct) s.right += 1;
    }
    return stats;
  }

  /** The skills, weakest first, with the level practice starts each at. */
  async skills(user: AuthUser): Promise<SatSkillStanding[]> {
    this.studentOnly(user);
    const stats = this.statsOf(await this.events(user.id, await this.bank()));
    return SKILLS.map((k) => {
      const acc = satAccuracy(stats[k.id]);
      return {
        ...k,
        accuracy: acc === null ? null : Math.round(acc * 100),
        answered: stats[k.id]?.total ?? 0,
        level: satStartLevel(acc),
      };
    }).toSorted(
      (a, b) => (a.accuracy ?? 50) - (b.accuracy ?? 50) || a.label.localeCompare(b.label),
    );
  }

  async start(user: AuthUser): Promise<SatPracticeView> {
    this.studentOnly(user);
    const bank = await this.bank();
    if (bank.size === 0)
      throw notFound(ErrorCode.NOT_FOUND, 'There are no practice questions yet.');
    const state: SatPracticeState = { levels: {}, current: null, history: [] };
    const first = await this.pick(user.id, bank, state);
    state.current = first;
    const row = await this.db.client.satPracticeSession.create({
      data: {
        studentId: user.id,
        size: Math.min(SAT_PRACTICE_SIZE, bank.size),
        state: SatPracticeState.parse(state),
      },
    });
    return this.view(row, state, bank);
  }

  async get(user: AuthUser, id: string): Promise<SatPracticeView> {
    const row = await this.own(user, id);
    return this.view(row, SatPracticeState.parse(row.state), await this.bank());
  }

  async answer(
    user: AuthUser,
    id: string,
    body: SatPracticeAnswerRequest,
  ): Promise<SatPracticeResponse> {
    const row = await this.own(user, id);
    const state = SatPracticeState.parse(row.state);
    const bank = await this.bank();
    const q = bank.get(body.questionId);
    if (!q || state.current !== body.questionId || row.finishedAt)
      throw new AppError(
        HttpStatus.CONFLICT,
        ErrorCode.VALIDATION_FAILED,
        'Question already answered',
        'That question is not waiting for an answer.',
      );
    const answer = body.answer.trim();
    if (q.answer.kind === 'value') {
      const problem = satTypedError(answer);
      if (problem || !answer)
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          ErrorCode.VALIDATION_FAILED,
          'Check your answer',
          problem ?? 'Type an answer first.',
        );
    } else if (!['A', 'B', 'C', 'D'].includes(answer)) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Check your answer',
        'Choose A, B, C or D.',
      );
    }
    const correct = isRight(q, answer);
    const stats = this.statsOf(await this.events(user.id, bank));
    const level = state.levels[q.skill] ?? satStartLevel(satAccuracy(stats[q.skill]));
    state.levels[q.skill] = satNextLevel(level, correct);
    state.history.push({
      id: q.id,
      skill: q.skill,
      difficulty: q.difficulty,
      answer,
      correct,
      at: new Date().toISOString(),
    });
    const size = Math.min(row.size, bank.size);
    state.current =
      state.history.length >= size ? null : await this.pick(user.id, bank, state, stats);
    const saved = await this.db.client.satPracticeSession.update({
      where: { id: row.id },
      data: {
        state: SatPracticeState.parse(state),
        ...(state.current === null ? { finishedAt: new Date() } : {}),
      },
    });
    return {
      correct,
      correctAnswer: q.answer.kind === 'choice' ? q.answer.correct : (q.answer.accepted[0] ?? ''),
      solution: q.solution,
      next: this.view(saved, state, bank),
    };
  }

  // ───────── Choosing and showing ─────────

  private async own(user: AuthUser, id: string): Promise<SatPracticeSession> {
    this.studentOnly(user);
    const row = await this.db.client.satPracticeSession.findFirst({
      where: { id, studentId: user.id },
    });
    if (!row) throw notFound(ErrorCode.NOT_FOUND, 'That practice set was not found.');
    return row;
  }

  private async pick(
    studentId: string,
    bank: Map<string, SatQuestion>,
    state: SatPracticeState,
    known?: Record<string, SatSkillStats>,
  ): Promise<string | null> {
    const events = await this.events(studentId, bank);
    const stats = known ?? this.statsOf(events);
    const latest = new Map<string, boolean>();
    for (const e of events) if (!latest.has(e.id)) latest.set(e.id, e.correct);
    const wrongBefore = new Set([...latest].filter(([, ok]) => !ok).map(([qid]) => qid));
    const rightBefore = new Set([...latest].filter(([, ok]) => ok).map(([qid]) => qid));
    return satPickNext({
      bank: [...bank.values()].map((q) => ({ id: q.id, skill: q.skill, difficulty: q.difficulty })),
      stats,
      levels: state.levels,
      asked: state.history.map((h) => h.id),
      wrongBefore,
      rightBefore,
      lastSkill: state.history.at(-1)?.skill ?? null,
      rng: Math.random,
    });
  }

  private view(
    row: SatPracticeSession,
    state: SatPracticeState,
    bank: Map<string, SatQuestion>,
  ): SatPracticeView {
    const answered = state.history.length;
    const q = state.current ? bank.get(state.current) : undefined;
    const size = Math.min(row.size, bank.size);
    if (q && state.current) {
      const label = SKILLS.find((k) => k.id === q.skill)?.label ?? q.skill;
      const question: SatPracticeQuestion = {
        id: q.id,
        kind: q.answer.kind === 'choice' ? 'choice' : 'typed',
        prompt: q.prompt,
        ...(q.figure ? { figure: q.figure } : {}),
        ...(q.answer.kind === 'choice' ? { choices: [...q.answer.choices] } : {}),
        number: answered + 1,
        skill: q.skill,
        skillLabel: label,
        level: q.difficulty,
      };
      return { id: row.id, size, answered, question, summary: null };
    }
    const skills = SKILLS.map((k) => {
      const mine = state.history.filter((h) => h.skill === k.id);
      return {
        id: k.id,
        label: k.label,
        right: mine.filter((h) => h.correct).length,
        total: mine.length,
      };
    }).filter((k) => k.total > 0);
    const summary: SatPracticeSummary = {
      right: state.history.filter((h) => h.correct).length,
      total: answered,
      skills,
    };
    return { id: row.id, size, answered, question: null, summary };
  }
}
