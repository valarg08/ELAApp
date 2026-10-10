import {
  type Pov,
  type Tense,
  breaksTenseLock,
  countWords,
  pointOfView,
  povShifts,
  tense,
} from '@storyforge/writing-analysis';
import { z } from 'zod';

export { countWords };

/** Rules for a writing activity (DESIGN.md §9.3). Checked live in the browser and again by the API. */
export const WritingConstraints = z
  .object({
    minWords: z.number().int().positive().optional(),
    maxWords: z.number().int().positive().optional(),
    exactWords: z.number().int().positive().optional(),
    bannedWords: z.array(z.string().trim().min(1)).default([]),
    requiredWords: z.array(z.string().trim().min(1)).default([]),
    /** Narration must use this point of view (quoted speech is ignored). */
    povLock: z.enum(['first', 'second', 'third']).optional(),
    /** Narration must use this tense (quoted speech is ignored). */
    tenseLock: z.enum(['past', 'present']).optional(),
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
  | { rule: 'requiredWords'; missing: string[] }
  | { rule: 'povLock'; expected: Pov; found: Pov }
  | { rule: 'tenseLock'; expected: Tense };

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
  if (c.povLock) {
    const pov = pointOfView(text);
    if (pov.guess !== 'unknown' && povShifts(pov, c.povLock).length > 0) {
      problems.push({ rule: 'povLock', expected: c.povLock, found: pov.guess });
    }
  }
  if (c.tenseLock && breaksTenseLock(tense(text), c.tenseLock)) {
    problems.push({ rule: 'tenseLock', expected: c.tenseLock });
  }
  return { wordCount, problems };
}

const POV_RULES: Record<Pov, string> = {
  first: 'Tell this story in the first person (I, me, my).',
  second: 'Tell this story in the second person (you, your).',
  third:
    'Tell this story in the third person (he, she, they). Keep “I” for speech in quotation marks.',
};

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
    case 'povLock':
      return POV_RULES[p.expected];
    case 'tenseLock':
      return p.expected === 'past'
        ? 'Keep the story in the past tense (walked, was). Some sentences are in the present.'
        : 'Keep the story in the present tense (walks, is). Some sentences are in the past.';
  }
  const unreachable: never = p;
  return String(unreachable);
}
