import { DEVICES, type Device, figurative } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Did my comparisons work?" (Unit 6, DESIGN.md §8.4 `figurative-language`): Quill finds the
 * similes, metaphors and personification, says what effect each has, checks the devices the
 * activity asks for, and flags tired clichés.
 */
export interface FigurativeLanguageInput extends WritingContext {
  /** Devices the activity asks for (may be empty). */
  goals: readonly Device[];
}

const OTHER_DEVICES = ['hyperbole', 'onomatopoeia', 'alliteration'] as const;

export const FigurativeLanguageResult = z.object({
  devices: z.array(
    z.object({
      type: z.enum([...DEVICES, ...OTHER_DEVICES]),
      quote: z.string(),
      /** One sentence on what it makes the reader see or feel. */
      effect: z.string(),
      /** False for a cliché ("as cold as ice"). */
      fresh: z.boolean(),
    }),
  ),
  /** One entry per goal device, in order. */
  goals: z.array(
    z.object({
      device: z.enum(DEVICES),
      found: z.boolean(),
      quote: z.string().nullable(),
      /** When not found: one idea, starting "You could try". */
      idea: z.string().nullable(),
    }),
  ),
  /** The strongest comparison, if any. */
  strongest: z.object({ quote: z.string(), why: z.string() }).nullable(),
});
export type FigurativeLanguageResult = z.infer<typeof FigurativeLanguageResult>;

const SYSTEM = `${QUILL_RULES}

Task: find the FIGURATIVE LANGUAGE in the student's writing.
- simile: compares two things using "like" or "as". metaphor: says one thing IS another (not literally true). personification: gives something non-human a human action, feeling or voice. You may also note hyperbole, onomatopoeia or alliteration.
- devices: up to 6 of the clearest examples. quote = the exact words; effect = one sentence on what it makes the reader see or feel; fresh = false if it is a common cliché (for example "as cold as ice", "slept like a log"), else true.
- goals: one entry for each device listed under "Goal devices", in that order. found = true if the writing has at least one real example; quote = the best one (exact words), or null; idea = if not found, one short idea starting "You could try" that fits the student's subject (an idea, not a finished line), else null.
- strongest: the most vivid comparison; quote = exact words; why = one sentence of specific praise. Null if there are none.
Literal comparisons ("She is a teacher", "I like pizza") are not figurative.`;

const EFFECTS: Record<Device, string> = {
  simile: 'The comparison helps the reader picture it in a new way.',
  metaphor: 'Saying one thing IS another makes a bold, strong picture.',
  personification: 'Giving it a human action makes the scene feel alive.',
};

const IDEAS: Record<Device, string> = {
  simile:
    'You could try comparing one thing in your scene to an animal or a machine, using “like”.',
  metaphor:
    'You could try saying your main object IS something bigger: a monster, an ocean, a maze.',
  personification:
    'You could try giving an object in the scene one human action: does it sigh, grumble or watch?',
};

export const figurativeLanguageAnalyzer: AnalyzerDef<
  FigurativeLanguageInput,
  FigurativeLanguageResult
> = {
  id: 'figurative-language',
  version: 'figurative-language-1',
  effort: 'medium',
  maxTokens: 1800,
  system: SYSTEM,
  schema: FigurativeLanguageResult,
  buildUser: (input) =>
    [`Goal devices: ${input.goals.join(', ') || '(none)'}`, writingBlock(input)].join('\n'),
  fake(input) {
    const fig = figurative(input.text);
    const staleAt = (start: number, end: number) =>
      fig.cliches.some((c) => c.span.start >= start && c.span.start < end);
    // One of each device first, then the rest, up to six.
    const firsts = DEVICES.flatMap((d) => fig.hits.find((h) => h.device === d) ?? []);
    const ordered = [...firsts, ...fig.hits.filter((h) => !firsts.includes(h))];
    const devices = ordered.slice(0, 6).map((h) => ({
      type: h.device,
      quote: h.span.text,
      effect: EFFECTS[h.device],
      fresh: !staleAt(h.sentence.start, h.sentence.end),
    }));
    const goals = input.goals.map((device) => {
      const hit = fig.hits.find((h) => h.device === device);
      return {
        device,
        found: hit !== undefined,
        quote: hit?.span.text ?? null,
        idea: hit ? null : IDEAS[device],
      };
    });
    const best = devices.find((d) => d.fresh);
    return {
      devices,
      goals,
      strongest: best ? { quote: best.quote, why: best.effect } : null,
    };
  },
};
