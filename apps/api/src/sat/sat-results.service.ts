import { Injectable } from '@nestjs/common';
import {
  SAT_DOMAINS,
  type SatBreakdown,
  type SatClassCell,
  type SatClassResults,
  type SatClassStudent,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { ClassAccessService } from '../classes/class-access.service.js';
import { DatabaseService } from '../database/database.service.js';
import { SatContentService } from './sat-content.service.js';
import { SatService, isOutdated } from './sat.service.js';

const SKILLS = SAT_DOMAINS.flatMap((d) =>
  d.skills.map((k) => ({ id: k.id as string, label: k.label as string, domain: d.id as string })),
);
const mean = (xs: number[]) =>
  xs.length === 0 ? null : Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);

/**
 * What a teacher sees of the class's SAT tests (sat-design.md §8): scores by student and week, the
 * class's right answers by content area and skill, and each student's weakest skill. Only the
 * teacher's own classes (another teacher's class answers 404). Nothing is shown for a test a
 * student has not finished.
 */
@Injectable()
export class SatResultsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ClassAccessService,
    private readonly content: SatContentService,
    private readonly sat: SatService,
  ) {}

  async classResults(teacher: AuthUser, classId: string): Promise<SatClassResults> {
    await this.access.ownedClass(teacher, classId);
    const [weeks, enrollments] = await Promise.all([
      this.content.weeks().then((w) => w.toSorted((a, b) => a.week - b.week)),
      this.db.client.enrollment.findMany({
        where: { classId, student: { deletedAt: null } },
        include: { student: true },
        orderBy: { student: { displayName: 'asc' } },
      }),
    ]);
    const attempts = await this.db.client.satAttempt.findMany({
      where: { studentId: { in: enrollments.map((e) => e.studentId) } },
    });

    const skillTotals = new Map<string, SatBreakdown & { domain: string; below: number }>(
      SKILLS.map((k) => [k.id, { ...k, correct: 0, total: 0, below: 0 }]),
    );
    const areaTotals = new Map<string, SatBreakdown>(
      SAT_DOMAINS.map((d) => [d.id, { id: d.id, label: d.label, correct: 0, total: 0 }]),
    );

    const students: SatClassStudent[] = [];
    for (const { student } of enrollments) {
      const mine = attempts.filter((a) => a.studentId === student.id);
      const perSkill = new Map<string, { correct: number; total: number }>();
      const scores: number[] = [];
      const cells: SatClassCell[] = [];
      for (const w of weeks) {
        const row = mine.find((a) => a.week === w.week && !isOutdated(a, w));
        if (!row) {
          cells.push({ status: 'new', score: null, correct: null, total: null });
          continue;
        }
        const result = await this.sat.resultFor(row);
        if (!result) {
          cells.push({ status: 'in-progress', score: null, correct: null, total: null });
          continue;
        }
        scores.push(result.score.estimate);
        cells.push({
          status: 'done',
          score: result.score.estimate,
          correct: result.correct,
          total: result.total,
        });
        for (const k of result.skills) {
          const own = perSkill.get(k.id) ?? { correct: 0, total: 0 };
          own.correct += k.correct;
          own.total += k.total;
          perSkill.set(k.id, own);
        }
        for (const a of result.areas) {
          const t = areaTotals.get(a.id);
          if (t) {
            t.correct += a.correct;
            t.total += a.total;
          }
        }
      }
      let weakest: SatClassStudent['weakest'] = null;
      for (const [id, own] of perSkill) {
        const t = skillTotals.get(id);
        if (!t) continue;
        t.correct += own.correct;
        t.total += own.total;
        const share = own.correct / own.total;
        if (share < 0.6) t.below += 1;
        if (
          !weakest ||
          share < weakest.correct / weakest.total ||
          (share === weakest.correct / weakest.total && own.total > weakest.total)
        )
          weakest = { label: t.label, correct: own.correct, total: own.total };
      }
      students.push({
        id: student.id,
        displayName: student.displayName,
        cells,
        average: mean(scores),
        weakest,
      });
    }

    return {
      weeks: weeks.map((w) => ({ week: w.week, title: w.title })),
      students,
      weekAverages: weeks.map((_, i) =>
        mean(students.flatMap((s) => (s.cells[i]?.score != null ? [s.cells[i].score] : []))),
      ),
      areas: [...areaTotals.values()].filter((a) => a.total > 0),
      skills: [...skillTotals.values()]
        .filter((k) => k.total > 0)
        .map(({ below, ...k }) => ({ ...k, studentsBelow: below }))
        .toSorted((a, b) => a.correct / a.total - b.correct / b.total),
    };
  }
}
