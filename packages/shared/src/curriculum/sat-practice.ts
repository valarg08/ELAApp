import { z } from 'zod';

/**
 * SAT adaptive practice (sat-design.md §7): short untimed sets that go where the student is
 * weakest. Each question is chosen from the student's recent record per skill, and a skill's
 * difficulty moves up after a right answer and down after a wrong one. The weekly test is not
 * adaptive this way; it stays like the real SAT.
 */

/** Questions in a practice set. */
export const SAT_PRACTICE_SIZE = 10;
/** A skill's accuracy is read from this many of its latest answers (tests and practice). */
export const SAT_RECENT_ANSWERS = 8;

export interface SatBankItem {
  id: string;
  skill: string;
  difficulty: number;
}

/** Right answers out of the latest answers for a skill. */
export interface SatSkillStats {
  right: number;
  total: number;
}

/** A skill's accuracy (0–1), or null when it has not been tried. */
export const satAccuracy = (s: SatSkillStats | undefined): number | null =>
  s && s.total > 0 ? s.right / s.total : null;

/** The difficulty a skill starts at: 1 below 50% right, 3 from 80%, else 2 (2 when untried). */
export const satStartLevel = (accuracy: number | null): 1 | 2 | 3 =>
  accuracy === null ? 2 : accuracy < 0.5 ? 1 : accuracy >= 0.8 ? 3 : 2;

/** One step up after a right answer, one down after a wrong one (1 to 3). */
export const satNextLevel = (level: number, correct: boolean): number =>
  Math.min(3, Math.max(1, level + (correct ? 1 : -1)));

export interface SatPickInput {
  bank: readonly SatBankItem[];
  stats: Readonly<Record<string, SatSkillStats>>;
  /** The difficulty each skill is at now in this set. */
  levels: Readonly<Record<string, number>>;
  /** Questions already asked in this set. */
  asked: readonly string[];
  /** Questions whose latest answer (in a test or earlier practice) was wrong / right. */
  wrongBefore: ReadonlySet<string>;
  rightBefore: ReadonlySet<string>;
  lastSkill: string | null;
  rng: () => number;
}

/**
 * The next question: a skill chosen at random with weight 1.2 minus its accuracy (0.7 when untried;
 * a fifth of that if it was just asked), then the question in it closest to the skill's level,
 * preferring ones missed before and avoiding ones already solved. Null when nothing is left.
 */
export function satPickNext(input: SatPickInput): string | null {
  const open = input.bank.filter((q) => !input.asked.includes(q.id));
  if (open.length === 0) return null;
  const skills = [...new Set(open.map((q) => q.skill))];
  const weights = skills.map((s) => {
    const acc = satAccuracy(input.stats[s]);
    const w = 1.2 - (acc ?? 0.5);
    return s === input.lastSkill && skills.length > 1 ? w * 0.2 : w;
  });
  let roll = input.rng() * weights.reduce((a, b) => a + b, 0);
  let chosen = skills[skills.length - 1]!;
  for (let i = 0; i < skills.length; i += 1) {
    roll -= weights[i]!;
    if (roll <= 0) {
      chosen = skills[i]!;
      break;
    }
  }
  const target = input.levels[chosen] ?? satStartLevel(satAccuracy(input.stats[chosen]));
  const scored = open
    .filter((q) => q.skill === chosen)
    .map((q) => ({
      id: q.id,
      score:
        Math.abs(q.difficulty - target) +
        (input.rightBefore.has(q.id) ? 0.5 : 0) -
        (input.wrongBefore.has(q.id) ? 0.5 : 0) +
        input.rng() * 0.1,
    }))
    .toSorted((a, b) => a.score - b.score);
  return scored[0]?.id ?? null;
}

// ───────── Stored and sent shapes ─────────

/** One answered question in a practice set. */
export const SatPracticeAnswer = z.object({
  id: z.string(),
  skill: z.string(),
  difficulty: z.number().int(),
  answer: z.string().nullable(),
  correct: z.boolean(),
  at: z.string(),
});
export type SatPracticeAnswer = z.infer<typeof SatPracticeAnswer>;

/** What is stored for a practice set (a Json column, checked with Zod before every write). */
export const SatPracticeState = z.object({
  levels: z.record(z.string(), z.number().int().min(1).max(3)),
  /** The question waiting for an answer, or null when the set is over. */
  current: z.string().nullable(),
  history: z.array(SatPracticeAnswer).max(50),
});
export type SatPracticeState = z.infer<typeof SatPracticeState>;
