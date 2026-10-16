import { Injectable } from '@nestjs/common';
import {
  ErrorCode,
  type PracticeAnswersRequest,
  type PracticeAnswersResponse,
  type ProblemVerdict,
  markAnswer,
  nextReviewState,
  problemVariant,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { MathContentService, type ProblemActivity } from './math-content.service.js';

export type AnswerSource = 'practice' | 'set' | 'review' | 'sprint' | 'test' | 'redo';

/** One answered problem for the record: the verdict only, never what was typed. */
export interface AnswerRecord {
  source: AnswerSource;
  lessonId?: string | null;
  activityKey?: string | null;
  problemId: string;
  seed?: number | null;
  skill: string;
  difficulty: number;
  verdict: ProblemVerdict | 'shown';
  hintsUsed?: number;
  seconds?: number | null;
  confidence?: number | null;
}

/**
 * The answer record (math-design.md §3.2 B1): every answered Math problem, from practice (posted by
 * the browser and re-marked here, so a row can't claim "correct" falsely) and from everything
 * marked on the server. Each answer also moves its skill between the review boxes (B3).
 */
@Injectable()
export class AnswerLogService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
  ) {}

  /** Practice answers from the browser: re-marked with math-check before they are saved. */
  async practice(user: AuthUser, body: PracticeAnswersRequest): Promise<PracticeAnswersResponse> {
    const activities = new Map<string, ProblemActivity>();
    const rows: AnswerRecord[] = [];
    for (const a of body.answers) {
      const cacheKey = `${a.lessonId}|${a.activityKey}`;
      let activity = activities.get(cacheKey);
      if (!activity) {
        activity = (await this.content.lessonActivity(user, a.lessonId, a.activityKey)).activity;
        activities.set(cacheKey, activity);
      }
      if (activity.type !== 'PROBLEMS')
        throw notFound(ErrorCode.ACTIVITY_NOT_FOUND, 'Practice problems not found.');
      const problem = problemVariant(this.content.problem(activity, a.problemId), a.seed);
      const verdict = a.firstAnswer ? markAnswer(problem, a.firstAnswer).verdict : 'shown';
      rows.push({
        source: 'practice',
        lessonId: a.lessonId,
        activityKey: a.activityKey,
        problemId: a.problemId,
        seed: problem.seed ?? null,
        skill: problem.skill,
        difficulty: problem.difficulty,
        // A right first answer after "Show me" can't happen; a blank one is "shown".
        verdict:
          a.revealed && verdict !== 'correct' ? 'shown' : verdict === 'blank' ? 'shown' : verdict,
        hintsUsed: a.hintsUsed,
        seconds: a.seconds ?? null,
      });
    }
    await this.record(user.id, rows);
    return { saved: rows.length };
  }

  /** Save answers and update the review boxes of their skills. */
  async record(studentId: string, rows: readonly AnswerRecord[]): Promise<void> {
    if (rows.length === 0) return;
    await this.db.client.mathAnswerLog.createMany({
      data: rows.map((r) => ({
        studentId,
        source: r.source,
        lessonId: r.lessonId ?? null,
        activityKey: r.activityKey ?? null,
        problemId: r.problemId,
        seed: r.seed ?? null,
        skill: r.skill,
        difficulty: r.difficulty,
        verdict: r.verdict,
        hintsUsed: r.hintsUsed ?? 0,
        seconds: r.seconds ?? null,
        confidence: r.confidence ?? null,
      })),
    });
    const now = new Date();
    // Blanks in tests say nothing about the skill's spacing; everything else does.
    const counted = rows.filter((r) => r.verdict !== 'blank');
    for (const skill of new Set(counted.map((r) => r.skill))) {
      let state = await this.db.client.mathSkillState.findUnique({
        where: { studentId_skill: { studentId, skill } },
      });
      for (const r of counted.filter((x) => x.skill === skill)) {
        const right = r.verdict === 'correct' && !r.hintsUsed;
        const next = nextReviewState(state, right, now);
        if (!next) continue;
        state = await this.db.client.mathSkillState.upsert({
          where: { studentId_skill: { studentId, skill } },
          create: { studentId, skill, box: next.box, dueAt: next.dueAt },
          update: { box: next.box, dueAt: next.dueAt },
        });
      }
    }
  }
}
