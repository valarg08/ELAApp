import { sentences, senses, telling } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/** Show vs tell (DESIGN.md §8.4): Units 1, 2, 3, 6 and projects. */
export const ShowVsTellResult = z.object({
  tellingSentences: z.array(
    z.object({
      quote: z.string(),
      feelingNamed: z.string(),
      showingIdea: z.string(),
    }),
  ),
  showingHighlights: z.array(z.object({ quote: z.string(), why: z.string() })),
  /** 0–1: how much of the piece shows rather than tells. */
  showRatio: z.number(),
});
export type ShowVsTellResult = z.infer<typeof ShowVsTellResult>;

const SYSTEM = `${QUILL_RULES}

Task: find where the writing TELLS a feeling or trait (names it: "she was angry", "he felt nervous") and where it SHOWS one (actions, body language, dialogue, senses that let the reader work it out).
- tellingSentences: up to 3 places that tell. quote = the exact words that tell (short). feelingNamed = the feeling or trait. showingIdea = one short idea for showing it instead, starting with "You could try" (an example, not a rewrite of the whole sentence).
- showingHighlights: up to 2 places that already show well. quote = exact words; why = one sentence of specific praise.
- showRatio: a number from 0 to 1 for how much of the piece shows rather than tells.
If there is nothing to report in a list, return an empty list.`;

export const showVsTellAnalyzer: AnalyzerDef<WritingContext, ShowVsTellResult> = {
  id: 'show-vs-tell',
  version: 'show-vs-tell-1',
  effort: 'medium',
  maxTokens: 2000,
  system: SYSTEM,
  schema: ShowVsTellResult,
  buildUser: (ctx) => writingBlock(ctx),
  fake(ctx) {
    const phrases = telling(ctx.text).phrases.slice(0, 3);
    const hit = senses(ctx.text).hits[0];
    const showing = hit
      ? sentences(ctx.text).find((s) => hit.span.start >= s.start && hit.span.start < s.end)
      : undefined;
    const total = Math.max(1, sentences(ctx.text).length);
    return {
      tellingSentences: phrases.map((p) => ({
        quote: p.phrase.text,
        feelingNamed: p.emotion,
        showingIdea: `You could try showing how ${p.emotion} feels: what do their hands, face or voice do?`,
      })),
      showingHighlights: showing
        ? [
            {
              quote: showing.text.trim(),
              why: 'This detail lets the reader see and hear the moment for themselves.',
            },
          ]
        : [],
      showRatio: Math.max(0, Math.min(1, 1 - phrases.length / total)),
    };
  },
};
