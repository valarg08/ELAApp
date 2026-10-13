import {
  TONE_AXES,
  TONE_AXIS_IDS,
  type ToneAxis,
  type ToneStep,
  sentenceAt,
  sentences,
  tone,
  tonePoleOf,
  toneStepLabel,
} from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "What tone will my reader hear?" (Unit 5, DESIGN.md §8.4 `tone-style`): Quill places the writing
 * on the tone sliders (funny ↔ serious, formal ↔ casual, hopeful ↔ dark), compares that with the
 * tone the student aimed for, and describes the narrator's voice. Genre conventions come with
 * Unit 10.
 */
export interface ToneStyleInput extends WritingContext {
  /** The tone aimed for, per scale (-2 … 2); only the scales the activity uses. */
  aimed: Partial<Record<ToneAxis, ToneStep>>;
}

const step = z.number().int().min(-2).max(2);

export const ToneStyleResult = z.object({
  tones: z.array(
    z.object({
      axis: z.enum(TONE_AXIS_IDS),
      aimed: step.nullable(),
      /** Where a reader would place it. */
      heard: step,
      /** Exact words that set this tone most. */
      quote: z.string().nullable(),
      /** When heard is far from aimed: one idea, starting "You could try". */
      idea: z.string().nullable(),
    }),
  ),
  /** The narrator's voice in up to three describing words, e.g. "chatty, nervous, honest". */
  voice: z.object({ words: z.array(z.string()).max(3), quote: z.string().nullable() }),
  /** A line where the voice really comes through. */
  strongLine: z.object({ quote: z.string(), why: z.string() }).nullable(),
});
export type ToneStyleResult = z.infer<typeof ToneStyleResult>;

const SYSTEM = `${QUILL_RULES}

Task: describe the TONE and VOICE of the student's writing the way a reader would hear it. Tone is set by word choice, sentence rhythm and what the narrator notices, not by naming a feeling.
Three scales, each from -2 to 2:
- humor: -2 very funny, -1 a bit funny, 0 in between, 1 a bit serious, 2 very serious
- formality: -2 very formal, -1 a bit formal, 0 in between, 1 a bit casual, 2 very casual
- outlook: -2 very hopeful, -1 a bit hopeful, 0 in between, 1 a bit dark, 2 very dark
- tones: one entry for each scale listed under "Aimed tone", in that order. aimed = the student's target (copy it). heard = where a reader would place the writing. quote = the exact words that set that tone most, or null. idea = if heard is 2 or more steps from aimed, or on the other side, one short idea starting "You could try" (else null).
- voice: words = up to three words describing the narrator's personality as it comes through (for example "chatty", "nervous", "dry"); quote = the exact words where the voice is strongest, or null.
- strongLine: one line where the voice really comes through; quote = exact words, why = one sentence of specific praise. Null if there is none.`;

const IDEAS: Record<string, string> = {
  funny: 'You could try an unexpected comparison or a narrator who notices something silly.',
  serious: 'You could try slowing down with a quiet detail and fewer jokes or exclamations.',
  formal: 'You could try full words instead of contractions (do not, I am) and fewer slang words.',
  casual: 'You could try contractions (don’t, I’m) and talking to the reader like a friend.',
  hopeful: 'You could try ending on a small sign that things might get better.',
  dark: 'You could try a cold or empty detail and a narrator who expects the worst.',
};

const FAKE_VOICE: Record<string, string> = {
  funny: 'playful',
  serious: 'thoughtful',
  formal: 'polite',
  casual: 'chatty',
  hopeful: 'upbeat',
  dark: 'gloomy',
};

export const toneStyleAnalyzer: AnalyzerDef<ToneStyleInput, ToneStyleResult> = {
  id: 'tone-style',
  version: 'tone-style-1',
  effort: 'medium',
  maxTokens: 1500,
  system: SYSTEM,
  schema: ToneStyleResult,
  buildUser: (input) => {
    const aimed = TONE_AXES.flatMap((a) => {
      const s = input.aimed[a.id];
      return s === undefined ? [] : [`${a.id}: ${s} (${toneStepLabel(a.id, s)})`];
    });
    return [
      `Aimed tone: ${aimed.join('; ') || '(none; use all three scales, aimed = null)'}`,
      writingBlock(input),
    ].join('\n');
  },
  fake(input) {
    const t = tone(input.text);
    const all = sentences(input.text);
    const axes = TONE_AXES.filter(
      (a) => Object.keys(input.aimed).length === 0 || input.aimed[a.id] !== undefined,
    );
    const tones = axes.map((a) => {
      const aimed = input.aimed[a.id] ?? null;
      const heard = t.heard[a.id] ?? 0;
      const pole = tonePoleOf(a.id, heard);
      const hit = pole ? t.hits.find((h) => h.pole === pole) : undefined;
      const want = aimed === null ? null : tonePoleOf(a.id, aimed);
      const far = aimed !== null && (Math.abs(heard - aimed) >= 2 || heard * aimed < 0);
      return {
        axis: a.id,
        aimed,
        heard,
        quote: hit ? (sentenceAt(all, hit.span.start)?.text.trim() ?? null) : null,
        idea: far && want ? (IDEAS[want] ?? null) : null,
      };
    });
    const leaning = TONE_AXES.flatMap((a) => {
      const h = t.heard[a.id];
      const pole = h === null ? null : tonePoleOf(a.id, h);
      return pole ? [pole] : [];
    });
    const strongest = tones.find((x) => x.quote && !x.idea)?.quote ?? null;
    return {
      tones,
      voice: { words: leaning.map((p) => FAKE_VOICE[p] ?? p).slice(0, 3), quote: strongest },
      strongLine: strongest
        ? { quote: strongest, why: 'Your word choices make the narrator sound like a real person.' }
        : null,
    };
  },
};
