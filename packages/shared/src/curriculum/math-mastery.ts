import {
  AMC_POINTS,
  type CalibrationRow,
  MATH_CONFIDENCE,
  type MasteryLevel,
  type PositionBand,
  type ProblemVerdict,
} from '../contracts/math.js';

/**
 * Skill mastery, spaced review and AMC scoring for the Math track (math-design.md §3.2). Pure
 * functions over the answer record, so they are easy to test and the API and pages agree.
 */

/** One row of the answer record, as these functions need it. */
export interface AnswerRow {
  skill: string;
  difficulty: number;
  verdict: ProblemVerdict | 'shown';
  hintsUsed: number;
  createdAt: Date;
  confidence?: number | null;
  seconds?: number | null;
}

/** The recent answers per skill that count towards mastery. */
export const MASTERY_WINDOW = 12;

const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/** How much one answer counts: newer and harder answers count more. */
const weightOf = (row: AnswerRow, index: number) =>
  0.9 ** index * (1 + 0.25 * (row.difficulty - 1));

/** How right one answer was: hints halve a right answer; a right value in the wrong form is half. */
function creditOf(row: AnswerRow): number {
  if (row.verdict === 'correct') return row.hintsUsed > 0 ? 0.5 : 1;
  if (row.verdict === 'form') return 0.5;
  return 0;
}

export interface MasteryResult {
  level: MasteryLevel;
  accuracy: number | null;
  answered: number;
}

/**
 * Mastery for one skill from its answers (any order): New under 3 answers; Strong at 75% weighted
 * accuracy with 3 answers at difficulty ≥ 2; Mastered when Strong with unaided right answers at
 * difficulty ≥ 3 on two different days; Learning otherwise.
 */
export function masteryOf(rows: readonly AnswerRow[]): MasteryResult {
  const recent = rows
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, MASTERY_WINDOW);
  if (recent.length === 0) return { level: 'new', accuracy: null, answered: 0 };
  let total = 0;
  let credit = 0;
  for (const [i, row] of recent.entries()) {
    const w = weightOf(row, i);
    total += w;
    credit += w * creditOf(row);
  }
  const accuracy = Math.round((credit / total) * 100);
  if (recent.length < 3) return { level: 'new', accuracy, answered: rows.length };
  const harder = recent.filter((r) => r.difficulty >= 2).length;
  const strong = accuracy >= 75 && harder >= 3;
  if (!strong) return { level: 'learning', accuracy, answered: rows.length };
  const hardDays = new Set(
    recent
      .filter((r) => r.difficulty >= 3 && r.verdict === 'correct' && r.hintsUsed === 0)
      .map((r) => dayOf(r.createdAt)),
  );
  return { level: hardDays.size >= 2 ? 'mastered' : 'strong', accuracy, answered: rows.length };
}

/** The difficulty to aim at next for a skill: about one step above the student's level. */
export const TARGET_DIFFICULTY: Record<MasteryLevel, number> = {
  new: 1,
  learning: 2,
  strong: 3,
  mastered: 4,
};

// ───────── Spaced review ─────────

/** Days until a skill comes back, by box (math-design.md §3.2 B3). */
export const REVIEW_BOX_DAYS = [1, 2, 4, 8, 16, 30] as const;
const DAY = 86_400_000;

/**
 * The next review state after an answer. A new skill starts in box 1. When the skill is due, a
 * right answer moves it up a box and a wrong one back to box 1; before it is due, only a wrong
 * answer counts (back to box 1).
 */
export function nextReviewState(
  state: { box: number; dueAt: Date } | null,
  right: boolean,
  now: Date,
): { box: number; dueAt: Date } | null {
  const due = (box: number) => new Date(now.getTime() + REVIEW_BOX_DAYS[box - 1]! * DAY);
  if (!state) return { box: 1, dueAt: due(1) };
  if (state.dueAt <= now) {
    const box = right ? Math.min(state.box + 1, REVIEW_BOX_DAYS.length) : 1;
    return { box, dueAt: due(box) };
  }
  return right ? null : { box: 1, dueAt: due(1) };
}

// ───────── AMC scoring and calibration ─────────

export const pointsFor = (verdict: ProblemVerdict) =>
  verdict === 'correct'
    ? AMC_POINTS.correct
    : verdict === 'blank'
      ? AMC_POINTS.blank
      : AMC_POINTS.wrong;

/** The question-position band of a 0-based index, as on the AMC paper. */
export const bandOf = (index: number): PositionBand =>
  index < 10 ? '1-10' : index < 20 ? '11-20' : '21-25';

/**
 * What the score would have been with every "Guessing" answer left blank: right guesses lose
 * 6 − 1.5, wrong ones gain 1.5. Null when no answer was marked a guess.
 */
export function pointsIfGuessesBlank(
  items: readonly { verdict: ProblemVerdict; confidence?: number | null }[],
): number | null {
  const guesses = items.filter((i) => i.confidence === 1 && i.verdict !== 'blank');
  if (guesses.length === 0) return null;
  return items.reduce(
    (sum, i) =>
      sum + (i.confidence === 1 && i.verdict !== 'blank' ? AMC_POINTS.blank : pointsFor(i.verdict)),
    0,
  );
}

/** Accuracy per confidence level, and advice on guessing (a guess pays when right > 25%). */
export function calibrationOf(rows: readonly AnswerRow[]): {
  rows: CalibrationRow[];
  advice: string | null;
} {
  const out = MATH_CONFIDENCE.map(({ value, label }) => {
    const mine = rows.filter((r) => r.confidence === value && r.verdict !== 'blank');
    const correct = mine.filter((r) => r.verdict === 'correct').length;
    return {
      confidence: value,
      label,
      answered: mine.length,
      correct,
      percent: mine.length ? Math.round((correct / mine.length) * 100) : null,
    };
  });
  const guess = out.find((r) => r.confidence === 1);
  const sure = out.find((r) => r.confidence === 3);
  let advice: string | null = null;
  if (guess && guess.percent !== null && guess.answered >= 4)
    advice =
      guess.percent <= 25
        ? `Your "Guessing" answers are right ${guess.percent}% of the time: leave those blank (a guess pays only when it is right more than 25% of the time).`
        : `Your "Guessing" answers are right ${guess.percent}% of the time, more than 25%: guessing after ruling out choices pays.`;
  if (sure && sure.percent !== null && sure.answered >= 4 && sure.percent < 80)
    advice = `${advice ? `${advice} ` : ''}Your "Sure" answers are right only ${sure.percent}% of the time: check those before moving on.`;
  return { rows: out, advice };
}

/** The median of some numbers (null when empty). */
export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const s = values.toSorted((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : Math.round((s[mid - 1]! + s[mid]!) / 2);
}
