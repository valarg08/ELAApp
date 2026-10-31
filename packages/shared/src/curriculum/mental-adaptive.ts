import { z } from 'zod';
import type { AnswerRow } from './math-mastery.js';

/**
 * Adaptive Mental Math practice (mental-math-design.md, Adaptive practice). The daily review and
 * the sprints choose their problems from where the student stands in each skill. Unit tests, level
 * checks and the placement check stay fixed so their scores can be compared.
 */

/** A skill's latest answers that count towards its standing. */
export const MENTAL_RECENT_ANSWERS = 10;
/** Answers a skill needs before it stops being New. */
export const MENTAL_MIN_ANSWERS = 3;
/** Under this share of credit (0–1) a skill is shaky. */
export const MENTAL_SHAKY_BELOW = 0.6;
/** From this share of credit a skill can be solid. */
export const MENTAL_SOLID_FROM = 0.8;
/** The seconds a right answer may take at difficulty 1, 2 and 3 to count as fast (Levels 3 and 4). */
export const MENTAL_FAST_SECONDS = [8, 12, 18] as const;

export const MentalStanding = z.enum(['new', 'shaky', 'solid', 'fast']);
export type MentalStanding = z.infer<typeof MentalStanding>;

export const MENTAL_STANDING_LABELS: Record<MentalStanding, string> = {
  new: 'Just starting',
  shaky: 'Needs practice',
  solid: 'Solid',
  fast: 'Fast and sure',
};

/** The difficulty (1–3) a problem in a skill is picked at. */
export const MENTAL_TARGET: Record<MentalStanding, number> = {
  new: 1,
  shaky: 1,
  solid: 2,
  fast: 3,
};

/** How much a skill is favoured when a session picks skills (higher: more likely). */
export const MENTAL_WEIGHT: Record<MentalStanding, number> = {
  new: 2,
  shaky: 3,
  solid: 1,
  fast: 0.5,
};

/** Right answers in a row, unaided, that a skill needs to be fast: more for the youngest level. */
export const mentalStreakNeeded = (level: number) => (level <= 1 ? 4 : 3);

const credit = (row: AnswerRow): number =>
  row.verdict === 'correct' ? (row.hintsUsed > 0 ? 0.5 : 1) : row.verdict === 'form' ? 0.5 : 0;

const unaidedRight = (row: AnswerRow) => row.verdict === 'correct' && row.hintsUsed === 0;

/**
 * Where a student stands in one skill, from its answers (any order). New under 3 answers; Shaky
 * under 60% credit or after two wrong answers in a row; Fast when 80% or better with the latest
 * answers (4 at Level 1, otherwise 3) right and unaided, and at Levels 3 and 4 also quick; Solid
 * otherwise. `level` is the Mental Math level (1–4) the skill belongs to.
 */
export function mentalStanding(rows: readonly AnswerRow[], level: number): MentalStanding {
  const recent = rows
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, MENTAL_RECENT_ANSWERS);
  if (recent.length < MENTAL_MIN_ANSWERS) return 'new';
  const share = recent.reduce((sum, r) => sum + credit(r), 0) / recent.length;
  const lastTwoWrong = recent.slice(0, 2).every((r) => credit(r) === 0);
  if (share < MENTAL_SHAKY_BELOW || lastTwoWrong) return 'shaky';
  if (share < MENTAL_SOLID_FROM) return 'solid';
  const need = mentalStreakNeeded(level);
  const streak = recent.slice(0, need);
  if (streak.length < need || !streak.every(unaidedRight)) return 'solid';
  if (level >= 3) {
    const quick = streak.every((r) => {
      const limit = MENTAL_FAST_SECONDS[Math.min(3, Math.max(1, r.difficulty)) - 1]!;
      return r.seconds === null || r.seconds === undefined || r.seconds <= limit;
    });
    if (!quick) return 'solid';
  }
  return 'fast';
}

/**
 * Skills picked at random without repeats, each with its weight, so shaky and new skills come up
 * more often than fast ones. `rng` returns a number in [0, 1).
 */
export function mentalPickSkills(
  standings: ReadonlyMap<string, MentalStanding>,
  count: number,
  rng: () => number = Math.random,
): string[] {
  const left = [...standings];
  const out: string[] = [];
  while (out.length < count && left.length > 0) {
    const total = left.reduce((sum, [, s]) => sum + MENTAL_WEIGHT[s], 0);
    let roll = rng() * total;
    let index = left.length - 1;
    for (const [i, [, s]] of left.entries()) {
      roll -= MENTAL_WEIGHT[s];
      if (roll <= 0) {
        index = i;
        break;
      }
    }
    out.push(left[index]![0]);
    left.splice(index, 1);
  }
  return out;
}
