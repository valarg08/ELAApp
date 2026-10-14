import {
  MIN_PART_WORDS,
  type Pov,
  type Tense,
  breaksTenseLock,
  checkPerspectives,
  checkSyllablePattern,
  countWords,
  poemLines,
  stanzas,
  pointOfView,
  povShifts,
  splitSections,
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
    /**
     * Third person only: the narrator knows one character's mind (limited) or everyone's
     * (omniscient). A guide, not a rule: the Coach and Quill check it, it never blocks submitting.
     */
    narrator: z.enum(['limited', 'omniscient']).optional(),
    /**
     * The multi-perspective rewrite (Unit 5): the draft has one part per perspective, each starting
     * with its label on its own line, and each part must keep its own point of view.
     */
    perspectives: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(60),
          pov: z.enum(['first', 'second', 'third']),
          narrator: z.enum(['limited', 'omniscient']).optional(),
        }),
      )
      .min(2)
      .max(3)
      .optional(),
    /** Syllables per line in every stanza (haiku: [5, 7, 5]); stanzas are split by blank lines. */
    syllablePattern: z.array(z.number().int().min(1).max(20)).min(1).max(10).optional(),
    minStanzas: z.number().int().min(1).max(20).optional(),
    maxStanzas: z.number().int().min(1).max(20).optional(),
    /** Non-empty lines (poems). */
    minLines: z.number().int().min(1).max(200).optional(),
    maxLines: z.number().int().min(1).max(200).optional(),
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
  | { rule: 'tenseLock'; expected: Tense }
  | { rule: 'perspectives'; label: string; issue: 'missing' | 'short' | 'shift'; expected: Pov }
  | { rule: 'syllables'; line: number; expected: number; actual: number }
  | { rule: 'stanzaLines'; stanza: number; expected: number; actual: number }
  | {
      rule: 'minStanzas' | 'maxStanzas' | 'minLines' | 'maxLines';
      expected: number;
      actual: number;
    };

/** Extra inputs some rules need: the student's own syllable counts (Unit 7). */
export interface ConstraintContext {
  syllableOverrides?: Readonly<Record<string, number>>;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole-word, case-insensitive match that also catches simple endings (said → says, saying). */
function wordPattern(word: string): RegExp {
  return new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(word)}(?:s|es|ed|d|ing)?(?![\\p{L}\\p{N}])`,
    'iu',
  );
}

/** Words in the heading lines of a multi-perspective rewrite (they don't count towards the goal). */
function headingWords(text: string, c: WritingConstraints): number {
  if (!c.perspectives) return 0;
  const found = splitSections(
    text,
    c.perspectives.map((p) => p.label),
  );
  return c.perspectives.reduce((n, p, i) => n + (found[i]?.found ? countWords(p.label) : 0), 0);
}

export function findBannedWords(text: string, banned: readonly string[]): string[] {
  return banned.filter((w) => wordPattern(w).test(text));
}

export function checkConstraints(
  text: string,
  c: WritingConstraints,
  context: ConstraintContext = {},
): { wordCount: number; problems: ConstraintProblem[] } {
  const wordCount = countWords(text) - headingWords(text, c);
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
  if (c.minStanzas || c.maxStanzas || c.syllablePattern) {
    const count = stanzas(text).length;
    if (c.minStanzas && count < c.minStanzas)
      problems.push({ rule: 'minStanzas', expected: c.minStanzas, actual: count });
    if (c.maxStanzas && count > c.maxStanzas)
      problems.push({ rule: 'maxStanzas', expected: c.maxStanzas, actual: count });
  }
  if (c.minLines || c.maxLines) {
    const count = poemLines(text).length;
    if (c.minLines && count < c.minLines)
      problems.push({ rule: 'minLines', expected: c.minLines, actual: count });
    if (c.maxLines && count > c.maxLines)
      problems.push({ rule: 'maxLines', expected: c.maxLines, actual: count });
  }
  if (c.syllablePattern) {
    const pattern = c.syllablePattern;
    const check = checkSyllablePattern(text, pattern, context.syllableOverrides);
    // Only the first problem: a list of every line would overwhelm.
    const shape = check.stanzas.findIndex((st) => !st.lineCountOk);
    const line = check.stanzas
      .flatMap((st) => (st.lineCountOk ? st.lines.map((l, i) => ({ l, want: pattern[i]! })) : []))
      .find(({ l, want }) => l.total !== want);
    if (shape >= 0) {
      problems.push({
        rule: 'stanzaLines',
        stanza: shape + 1,
        expected: pattern.length,
        actual: check.stanzas[shape]!.lines.length,
      });
    } else if (line) {
      problems.push({
        rule: 'syllables',
        line: line.l.line.number,
        expected: line.want,
        actual: line.l.total,
      });
    }
  }
  for (const part of c.perspectives ? checkPerspectives(text, c.perspectives) : []) {
    if (part.status === 'missing' || part.status === 'short' || part.status === 'shift') {
      problems.push({
        rule: 'perspectives',
        label: part.label,
        issue: part.status,
        expected: part.pov,
      });
    }
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
    case 'syllables':
      return `Line ${p.line} has ${p.actual} syllables; it needs ${p.expected}.`;
    case 'stanzaLines':
      return `Verse ${p.stanza} has ${p.actual} lines; each verse needs ${p.expected}. Leave a blank line between verses.`;
    case 'minStanzas':
      return `Write at least ${p.expected} verses, with a blank line between them (you have ${p.actual}).`;
    case 'maxStanzas':
      return `Keep it to ${p.expected} verses or fewer (you have ${p.actual}).`;
    case 'minLines':
      return `Write at least ${p.expected} lines (you have ${p.actual}).`;
    case 'maxLines':
      return `Keep it to ${p.expected} lines or fewer (you have ${p.actual}).`;
    case 'perspectives':
      if (p.issue === 'missing')
        return `Add the heading “${p.label}” on its own line, then write that part.`;
      if (p.issue === 'short') return `Write at least ${MIN_PART_WORDS} words under “${p.label}”.`;
      return `Keep “${p.label}” in the ${p.expected} person. ${POV_RULES[p.expected]}`;
  }
  const unreachable: never = p;
  return String(unreachable);
}
