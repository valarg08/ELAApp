import { Injectable } from '@nestjs/common';
import {
  type AnswerRow,
  type MasteryResult,
  MathConfidence,
  type ProblemVerdict,
  masteryOf,
} from '@storyforge/shared';
import { DatabaseService } from '../database/database.service.js';

/** The answer record rows that count (the newest first, enough for mastery and calibration). */
const ROW_LIMIT = 3000;

/** Skill mastery from the answer record (math-design.md §3.2 B2). */
@Injectable()
export class MasteryService {
  constructor(private readonly db: DatabaseService) {}

  /** Recent answer rows of some students, as the pure mastery functions need them. */
  async rows(studentIds: readonly string[]): Promise<Map<string, AnswerRow[]>> {
    const rows = await this.db.client.mathAnswerLog.findMany({
      where: { studentId: { in: [...studentIds] } },
      orderBy: { createdAt: 'desc' },
      take: ROW_LIMIT * Math.max(1, studentIds.length),
      select: {
        studentId: true,
        skill: true,
        difficulty: true,
        verdict: true,
        hintsUsed: true,
        createdAt: true,
        confidence: true,
        seconds: true,
      },
    });
    const out = new Map<string, AnswerRow[]>(studentIds.map((id) => [id, []]));
    for (const r of rows) {
      out.get(r.studentId)?.push({
        skill: r.skill,
        difficulty: r.difficulty,
        verdict: r.verdict as ProblemVerdict | 'shown',
        hintsUsed: r.hintsUsed,
        createdAt: r.createdAt,
        confidence: MathConfidence.safeParse(r.confidence).data ?? null,
        seconds: r.seconds,
      });
    }
    return out;
  }

  /** Mastery per skill (skills without answers are absent: they are New). */
  levels(rows: readonly AnswerRow[]): Map<string, MasteryResult> {
    const bySkill = new Map<string, AnswerRow[]>();
    for (const r of rows) bySkill.set(r.skill, [...(bySkill.get(r.skill) ?? []), r]);
    return new Map([...bySkill].map(([skill, list]) => [skill, masteryOf(list)]));
  }

  async studentLevels(studentId: string): Promise<Map<string, MasteryResult>> {
    return this.levels((await this.rows([studentId])).get(studentId) ?? []);
  }
}
