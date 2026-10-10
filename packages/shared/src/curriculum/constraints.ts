import { z } from 'zod';

/** Rules for a writing activity (DESIGN.md §9.3). Checked live in the browser and again by the API. */
export const WritingConstraints = z
  .object({
    minWords: z.number().int().positive().optional(),
    maxWords: z.number().int().positive().optional(),
    exactWords: z.number().int().positive().optional(),
    bannedWords: z.array(z.string().trim().min(1)).default([]),
    requiredWords: z.array(z.string().trim().min(1)).default([]),
    /** Shows a countdown in the workspace. Informational: running out of time never blocks. */
    timeLimitMin: z.number().int().min(1).max(120).optional(),
    /** "hard" blocks submitting; "soft" only warns. */
    enforcement: z.enum(['soft', 'hard']).default('hard'),
  })
  .refine((c) => !(c.minWords && c.maxWords) || c.minWords <= c.maxWords, {
    message: 'minWords must not exceed maxWords',
  });
export type WritingConstraints = z.infer<typeof WritingConstraints>;

export type ConstraintProblem =
  | { rule: 'minWords'; expected: number; actual: number }
  | { rule: 'maxWords'; expected: number; actual: number }
  | { rule: 'exactWords'; expected: number; actual: number }
  | { rule: 'bannedWords'; found: string[] }
  | { rule: 'requiredWords'; missing: string[] };

/** Words are runs of letters, digits and apostrophes/hyphens inside words ("don't", "well-known"). */
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

export function countWords(text: string): number {
  return text.match(WORD)?.length ?? 0;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole-word, case-insensitive match that also catches simple endings (said → says, saying). */
function wordPattern(word: string): RegExp {
  return new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(word)}(?:s|es|ed|d|ing)?(?![\\p{L}\\p{N}])`,
    'iu',
  );
}

export function findBannedWords(text: string, banned: readonly string[]): string[] {
  return banned.filter((w) => wordPattern(w).test(text));
}

export function checkConstraints(
  text: string,
  c: WritingConstraints,
): { wordCount: number; problems: ConstraintProblem[] } {
  const wordCount = countWords(text);
  const problems: ConstraintProblem[] = [];
  if (c.exactWords !== undefined && wordCount !== c.exactWords) {
    problems.push({ rule: 'exactWords', expected: c.exactWords, actual: wordCount });
  }
  if (c.minWords !== undefined && wordCount < c.minWords) {
    problems.push({ rule: 'minWords', expected: c.minWords, actual: wordCount });
  }
  if (c.maxWords !== undefined && wordCount > c.maxWords) {
    problems.push({ rule: 'maxWords', expected: c.maxWords, actual: wordCount });
  }
  const found = findBannedWords(text, c.bannedWords);
  if (found.length > 0) problems.push({ rule: 'bannedWords', found });
  const missing = c.requiredWords.filter((w) => !wordPattern(w).test(text));
  if (missing.length > 0) problems.push({ rule: 'requiredWords', missing });
  return { wordCount, problems };
}

/** Kid-friendly explanation of a problem. */
export function describeProblem(p: ConstraintProblem): string {
  switch (p.rule) {
    case 'exactWords':
      return `Use exactly ${p.expected} words (you have ${p.actual}).`;
    case 'minWords':
      return `Write at least ${p.expected} words (you have ${p.actual}).`;
    case 'maxWords':
      return `Keep it to ${p.expected} words or fewer (you have ${p.actual}).`;
    case 'bannedWords':
      return `Try writing without: ${p.found.join(', ')}.`;
    case 'requiredWords':
      return `Remember to use: ${p.missing.join(', ')}.`;
  }
  const unreachable: never = p;
  return String(unreachable);
}
