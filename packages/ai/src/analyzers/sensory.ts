import { SENSES, type Sense, senses } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/** Sensory analysis (DESIGN.md §8.4): Units 3 and 6, and describe-without-naming tasks. */
const SenseFinding = z.object({ count: z.number().int(), bestQuote: z.string().nullable() });

export const SensoryResult = z.object({
  senses: z.object({
    sight: SenseFinding,
    sound: SenseFinding,
    smell: SenseFinding,
    taste: SenseFinding,
    touch: SenseFinding,
  }),
  missing: z.array(z.enum(SENSES)),
  /** One concrete idea for adding a missing sense, starting with "You could try". */
  suggestion: z.string(),
});
export type SensoryResult = z.infer<typeof SensoryResult>;

const SYSTEM = `${QUILL_RULES}

Task: find the sensory details (sight, sound, smell, taste, touch) the student used.
- For each sense: count = how many separate details use it; bestQuote = the exact words of the strongest one, or null if none.
- missing: the senses with no details.
- suggestion: one concrete idea for adding a missing sense that fits this piece, starting with "You could try".`;

export const sensoryAnalyzer: AnalyzerDef<WritingContext, SensoryResult> = {
  id: 'sensory-analysis',
  version: 'sensory-1',
  effort: 'medium',
  maxTokens: 1500,
  system: SYSTEM,
  schema: SensoryResult,
  buildUser: (ctx) => writingBlock(ctx),
  fake(ctx) {
    const found = senses(ctx.text);
    const finding = (s: Sense) => ({
      count: found.counts[s],
      bestQuote: found.hits.find((h) => h.sense === s)?.span.text ?? null,
    });
    const missing = found.missing.find((s) => s === 'smell' || s === 'touch') ?? found.missing[0];
    return {
      senses: {
        sight: finding('sight'),
        sound: finding('sound'),
        smell: finding('smell'),
        taste: finding('taste'),
        touch: finding('touch'),
      },
      missing: found.missing,
      suggestion: missing
        ? `You could try adding ${missing}: one small detail is enough.`
        : 'You used every sense. Read it aloud and check each one earns its place.',
    };
  },
};
