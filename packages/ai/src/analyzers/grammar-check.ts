import {
  GRAMMAR_FEATURE_LABELS,
  type GrammarFeature,
  checkSentenceSet,
  grammarFeatures,
  grammarIssues,
  sentences,
  veryPhrases,
} from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Is my grammar right?" (Essay Writing, DESIGN.md §9.12): Quill finds real grammar mistakes with
 * their fixes, checks the lesson's grammar skill and each task of a sentence set.
 */
export interface GrammarCheckInput extends WritingContext {
  /** The grammar the activity practises. */
  focus: readonly GrammarFeature[];
  /** Sentence-set tasks, in order (sentence n answers task n). */
  tasks: readonly { ask: string; needs: readonly GrammarFeature[] }[];
}

export const GrammarCheckResult = z.object({
  /** Up to 5 real mistakes: grammar, capitals, punctuation or spelling. */
  errors: z.array(z.object({ quote: z.string(), fix: z.string(), rule: z.string() })),
  /** Whether the lesson's grammar skill is used correctly. */
  focus: z.object({ used: z.boolean(), note: z.string(), quote: z.string().nullable() }),
  /** One entry per sentence task. */
  tasks: z.array(z.object({ number: z.number().int(), done: z.boolean(), note: z.string() })),
  bestSentence: z.object({ quote: z.string(), why: z.string() }).nullable(),
  /** One idea to make the writing stronger, starting "You could try". */
  nextIdea: z.string().nullable(),
});
export type GrammarCheckResult = z.infer<typeof GrammarCheckResult>;

const SYSTEM = `${QUILL_RULES}

Task: check the student's GRAMMAR like a kind English teacher. They are practising grammar in short sentences or a paragraph.
- errors: up to 5 real mistakes in grammar, capital letters, punctuation or spelling, most important first. quote = the exact wrong words (as short as possible); fix = the corrected words; rule = one short sentence a 12-year-old understands. Never flag style choices, informal words or sentence starters that are correct. Empty if there are none.
- focus: the lesson's grammar skill (given below). used = true if the student uses it correctly at least once. note = one sentence: what they did well with it, or how to use it. quote = exact words where they use it, or null.
- tasks: if there are numbered sentence tasks, one entry per task: number (1-based), done = sentence number n does what task n asks, note = one short sentence. Empty if there are no tasks.
- bestSentence: the strongest correct sentence; quote = exact words; why = one sentence of specific praise. Null if none.
- nextIdea: one idea to make the writing stronger, starting "You could try", or null.`;

const labels = (features: readonly GrammarFeature[]) => {
  const names = features.map((f) => GRAMMAR_FEATURE_LABELS[f]);
  return names.length <= 1
    ? (names[0] ?? '')
    : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
};

export const grammarCheckAnalyzer: AnalyzerDef<GrammarCheckInput, GrammarCheckResult> = {
  id: 'grammar-check',
  version: 'grammar-check-1',
  effort: 'medium',
  maxTokens: 1500,
  system: SYSTEM,
  schema: GrammarCheckResult,
  buildUser: (input) =>
    [
      `Lesson grammar skill: ${input.focus.map((f) => GRAMMAR_FEATURE_LABELS[f]).join(', ') || '(general grammar)'}`,
      input.tasks.length > 0
        ? `Sentence tasks:\n${input.tasks.map((t, i) => `${i + 1}. ${t.ask}`).join('\n')}`
        : 'Sentence tasks: (none)',
      writingBlock(input),
    ].join('\n'),
  fake(input) {
    const { text } = input;
    // A sentence set's tasks can ask for different tenses on purpose, so tense slips don't count.
    const issues = grammarIssues(text).filter(
      (i) => input.tasks.length === 0 || i.kind !== 'tense-shift',
    );
    const weakPhrases = veryPhrases(text);
    const weak = weakPhrases[0];
    const hits = grammarFeatures(text);
    const used = input.focus.filter((f) => hits.some((h) => h.feature === f));
    const missing = input.focus.find((f) => !used.includes(f));
    const firstUsed = used[0] ? hits.find((h) => h.feature === used[0])?.span : undefined;
    const checks = checkSentenceSet(text, input.tasks);
    const flawed = (s: { start: number; end: number }) =>
      [...issues, ...weakPhrases].some((i) => i.span.start >= s.start && i.span.start < s.end);
    const best = sentences(text)
      .filter((s) => !flawed(s))
      .toSorted((a, b) => b.text.length - a.text.length)[0];
    return {
      errors: issues.slice(0, 5).map((i) => ({
        quote: i.span.text,
        fix: i.fix ?? i.span.text,
        rule: i.message,
      })),
      focus: {
        used: !missing,
        note: missing
          ? `Try using ${GRAMMAR_FEATURE_LABELS[missing]} in one of your sentences.`
          : input.focus.length > 0
            ? `You used ${labels(input.focus)} correctly.`
            : 'Your sentences are clear.',
        quote: firstUsed?.text ?? null,
      },
      tasks: checks.map((c, i) => ({
        number: i + 1,
        done: c.done,
        note: c.done
          ? 'This sentence does what the task asks.'
          : c.sentence
            ? `This sentence still needs ${labels(c.missing)}.`
            : 'Write a sentence for this task.',
      })),
      bestSentence: best
        ? { quote: best.text.trim(), why: 'It is clear and correct, with no mistakes to fix.' }
        : null,
      nextIdea: weak?.fix
        ? `You could try swapping “${weak.span.text}” for one stronger word, like “${weak.fix}”.`
        : issues.length === 0 && !missing
          ? 'You could try adding a describing word to make one sentence more vivid.'
          : null,
    };
  },
};
