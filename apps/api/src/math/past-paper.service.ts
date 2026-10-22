import { HttpStatus, Injectable } from '@nestjs/common';
import type { MathPastPaper } from '@storyforge/db';
import {
  type CreatePastPaperRequest,
  ErrorCode,
  type PastPaperList,
  PastPaperItem,
  type PastPaperView,
  pointsFor,
} from '@storyforge/shared';
import { z } from 'zod';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, forbidden, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';
import { MathContentService } from './math-content.service.js';

const Items = z.array(PastPaperItem);

/** The verdict of one past-paper question. */
const verdictOf = (i: PastPaperItem) =>
  i.answer === null ? 'blank' : i.answer === i.official ? 'correct' : 'wrong';

/**
 * The past-paper log (math-design.md §4.15): official AMC 10 papers a student worked on their own,
 * stored as answer letters, official letters and topic tags only, never problem text (© MAA). The
 * app scores them like the AMC; the progress page uses them for the AMC-score estimate, accuracy by
 * question position and the danger zones.
 */
@Injectable()
export class PastPaperService {
  constructor(
    private readonly db: DatabaseService,
    private readonly content: MathContentService,
  ) {}

  async list(user: AuthUser): Promise<PastPaperList> {
    this.studentOnly(user);
    const rows = await this.rows(user.id);
    const labels = await this.skillLabels();
    return { papers: rows.map((r) => this.view(r, labels)) };
  }

  async create(user: AuthUser, body: CreatePastPaperRequest): Promise<PastPaperView> {
    this.studentOnly(user);
    const labels = await this.skillLabels();
    const unknown = body.items.find((i) => i.skill !== null && !labels.has(i.skill));
    if (unknown)
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
        'Invalid request',
        'Pick each topic from the list.',
      );
    const verdicts = body.items.map(verdictOf);
    const row = await this.db.client.mathPastPaper.create({
      data: {
        studentId: user.id,
        label: body.label,
        takenOn: new Date(`${body.takenOn}T00:00:00Z`),
        items: body.items,
        correct: verdicts.filter((v) => v === 'correct').length,
        blank: verdicts.filter((v) => v === 'blank').length,
        points: verdicts.reduce((sum, v) => sum + pointsFor(v), 0),
      },
    });
    return this.view(row, labels);
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    this.studentOnly(user);
    const { count } = await this.db.client.mathPastPaper.deleteMany({
      where: { id, studentId: user.id },
    });
    if (count === 0) throw notFound(ErrorCode.NOT_FOUND, 'Past paper not found.');
  }

  /** A student's papers, newest first (for the progress page too). */
  async rows(studentId: string): Promise<(MathPastPaper & { parsed: PastPaperItem[] })[]> {
    const rows = await this.db.client.mathPastPaper.findMany({
      where: { studentId },
      orderBy: [{ takenOn: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    });
    return rows.map((r) => ({ ...r, parsed: Items.catch([]).parse(r.items) }));
  }

  /** Tagged skills answered wrong, most missed first. */
  missedSkills(
    items: readonly PastPaperItem[],
    labels: ReadonlyMap<string, string>,
  ): PastPaperView['missedSkills'] {
    const missed = new Map<string, number>();
    for (const i of items)
      if (i.skill && verdictOf(i) === 'wrong') missed.set(i.skill, (missed.get(i.skill) ?? 0) + 1);
    return [...missed]
      .map(([skill, n]) => ({ skill, label: labels.get(skill) ?? skill, missed: n }))
      .toSorted((a, b) => b.missed - a.missed || a.label.localeCompare(b.label));
  }

  async skillLabels(): Promise<Map<string, string>> {
    return new Map((await this.content.skills()).map((s) => [s.id, s.label]));
  }

  private view(
    row: MathPastPaper & { parsed?: PastPaperItem[] },
    labels: ReadonlyMap<string, string>,
  ): PastPaperView {
    const items = row.parsed ?? Items.catch([]).parse(row.items);
    return {
      id: row.id,
      label: row.label,
      takenOn: row.takenOn.toISOString().slice(0, 10),
      correct: row.correct,
      wrong: items.length - row.correct - row.blank,
      blank: row.blank,
      points: row.points,
      items,
      missedSkills: this.missedSkills(items, labels),
    };
  }

  private studentOnly(user: AuthUser) {
    if (user.role !== 'STUDENT') throw forbidden();
  }
}
