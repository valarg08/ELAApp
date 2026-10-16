import { type EssayType, sentences, styleIssues } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Does my essay sound formal?" (Essay Writing Unit 15, DESIGN.md §9.12): Quill reads the tone and
 * finds informal words, wordy phrases and vague words, each with a more formal or precise version.
 */
export interface FormalToneInput extends WritingContext {
  /** Narratives may use "I" and feelings; arguments and explanations stay impersonal. */
  essayType: EssayType | null;
}

const KINDS = ['informal', 'contraction', 'wordy', 'vague', 'personal'] as const;

export const FormalToneResult = z.object({
  /** Overall: does it sound like a formal essay? */
  formal: z.boolean(),
  note: z.string(),
  /** Up to 5 places to change, most important first. */
  changes: z.array(
    z.object({ kind: z.enum(KINDS), quote: z.string(), better: z.string(), why: z.string() }),
  ),
  /** The most formal, precise sentence, if any. */
  bestSentence: z.object({ quote: z.string(), why: z.string() }).nullable(),
  /** One idea to make the style stronger, starting "You could try". */
  nextIdea: z.string().nullable(),
});
export type FormalToneResult = z.infer<typeof FormalToneResult>;

const SYSTEM = `${QUILL_RULES}

Task: check whether the student's ESSAY sounds formal, clear and precise, like a kind English teacher. You are told the kind of essay.
- formal: true when the essay mostly sounds like a polished essay, not a chat with a friend. note = one sentence about the tone overall.
- changes: up to 5 places to change, most important first. kind = informal (slang or chatty words: kids, stuff, awesome, a lot of), contraction (don't, it's), wordy (phrases that use more words than needed: in order to, due to the fact that), vague (good, bad, nice, things where a precise word would be stronger) or personal ("I think", "In my opinion" in an argumentative or informative essay; never for a narrative). quote = the exact words; better = the formal or precise version (the same stretch of text rewritten); why = one short sentence.
- Do not change words inside quotation marks, and do not flag "I" in a narrative essay.
- bestSentence: the most formal, precise sentence. quote = exact words; why = one sentence. Or null.
- nextIdea: one idea to make the style stronger, starting "You could try", or null.
Judge style and tone only, not structure or spelling.`;

const KIND_OF: Record<string, (typeof KINDS)[number]> = {
  contraction: 'contraction',
  'informal-word': 'informal',
  'wordy-phrase': 'wordy',
  'vague-word': 'vague',
  'personal-opinion': 'personal',
};

export const formalToneAnalyzer: AnalyzerDef<FormalToneInput, FormalToneResult> = {
  id: 'formal-tone',
  version: 'formal-tone-1',
  effort: 'medium',
  maxTokens: 1200,
  system: SYSTEM,
  schema: FormalToneResult,
  buildUser: (input) =>
    [`Kind of essay: ${input.essayType ?? 'not given'}`, writingBlock(input)].join('\n'),
  fake(input) {
    const issues = styleIssues(input.text, { type: input.essayType ?? undefined });
    const clean = sentences(input.text).find(
      (s) =>
        s.text.split(/\s+/).length >= 8 &&
        !issues.some((i) => i.span.start >= s.start && i.span.start < s.end),
    );
    return {
      formal: issues.length <= 2,
      note:
        issues.length === 0
          ? 'Your essay sounds formal and precise.'
          : issues.length <= 2
            ? 'Your essay mostly sounds formal, with a couple of words to polish.'
            : 'Some words sound like talking to a friend. Polish them to sound like an essay.',
      changes: issues.slice(0, 5).map((i) => ({
        kind: KIND_OF[i.kind] ?? 'informal',
        quote: i.span.text,
        better: i.fix ?? '',
        why: i.message,
      })),
      bestSentence: clean
        ? { quote: clean.text.trim(), why: 'It is clear, precise and formal.' }
        : null,
      nextIdea:
        issues.length === 0
          ? 'You could try replacing one general verb (shows, makes, gets) with a more exact one (demonstrates, creates, earns).'
          : null,
    };
  },
};
