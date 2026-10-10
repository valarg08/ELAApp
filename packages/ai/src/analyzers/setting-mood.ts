import { type MoodPole, axisOf, isMoodPole, mood, sentences } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "What mood will my reader feel?" (Unit 3, DESIGN.md §10): Quill reads the setting like a reader,
 * says which mood comes through (compared with the moods the student chose) and whether the time
 * and place are clear.
 */
export interface SettingMoodInput extends WritingContext {
  /** Moods the student chose (calm/tense, bright/gloomy, safe/dangerous); may be empty. */
  targetMoods: readonly string[];
}

export const SettingMoodResult = z.object({
  /** The mood a reader would feel overall, in one or two words. */
  overallMood: z.string(),
  targets: z.array(
    z.object({
      mood: z.string(),
      /** Would a reader feel this mood from the details, without being told? */
      felt: z.boolean(),
      /** The exact words that build it best (when felt). */
      quote: z.string().nullable(),
      /** When not felt: one idea for a detail that would build it. */
      idea: z.string().nullable(),
    }),
  ),
  time: z.object({ clear: z.boolean(), quote: z.string().nullable() }),
  place: z.object({ clear: z.boolean(), quote: z.string().nullable() }),
  /** Up to 2 setting details that work especially well. */
  strongDetails: z.array(z.object({ quote: z.string(), why: z.string() })),
});
export type SettingMoodResult = z.infer<typeof SettingMoodResult>;

const SYSTEM = `${QUILL_RULES}

Task: read the student's setting writing the way a reader would. The student may have chosen moods for their setting (calm or tense, bright or gloomy, safe or dangerous) and tried to BUILD them with details (light, weather, sounds, objects, sentence rhythm), not by naming them.
- overallMood: the mood a reader would feel, in one or two words.
- targets: one entry for every chosen mood, in the same order. felt = true only if a reader who was not told would feel that mood from the details. quote = the exact words that build it best (when felt, else null). idea = when not felt, one short idea for a setting detail that would build it, starting with "You could try" (else null).
- time: clear = true if a reader can tell when the scene happens (time of day, season, era); quote = the words that show it, or null.
- place: clear = true if a reader can tell where it happens; quote = the words that show it, or null.
- strongDetails: up to 2 setting details that work especially well; quote = exact words; why = one sentence of specific praise.
If there are no chosen moods, return an empty targets list.`;

const TIME =
  /\b(morning|afternoon|evening|night|midnight|noon|dawn|dusk|sunrise|sunset|twilight|today|tonight|yesterday|winter|spring|summer|autumn|fall|monday|tuesday|wednesday|thursday|friday|saturday|sunday|o'clock|century|year|hour|minutes?|bell|lunch(?:time)?|breakfast|dinner|bedtime|weekend|holidays?|birthday)\b/i;
const PLACE =
  /\b(in|at|on|inside|outside|under|beneath|behind|beside|across|through|near|above)\s+(the|a|an|my|his|her|their|our)\s+\w+/i;

function sentenceWith(text: string, re: RegExp): string | null {
  return (
    sentences(text)
      .find((s) => re.test(s.text))
      ?.text.trim() ?? null
  );
}

const IDEAS: Record<MoodPole, string> = {
  calm: 'You could try a slow, soft sound, like water lapping or leaves whispering.',
  tense: 'You could try a sudden sharp sound, like a twig snapping, and a very short sentence.',
  bright: 'You could try showing where the light comes from and what it makes shine.',
  gloomy: 'You could try dim light, fog or dust, and something old or broken.',
  safe: 'You could try a warm, familiar object, like a blanket or the smell of baking.',
  dangerous:
    'You could try something sharp, an edge or a warning sign, or a sound that shouldn’t be there.',
};

export const settingMoodAnalyzer: AnalyzerDef<SettingMoodInput, SettingMoodResult> = {
  id: 'setting-mood',
  version: 'setting-mood-1',
  effort: 'medium',
  maxTokens: 2000,
  system: SYSTEM,
  schema: SettingMoodResult,
  buildUser: (input) =>
    [`Chosen moods: ${input.targetMoods.join(', ') || '(none)'}`, writingBlock(input)].join('\n'),
  fake(input) {
    const m = mood(input.text);
    const leaning = Object.values(m.leaning).filter((p): p is MoodPole => p !== null);
    const sentenceOf = (pole: string) => {
      const hit = m.hits.find((h) => h.pole === pole);
      return hit
        ? (sentences(input.text)
            .find((s) => hit.span.start >= s.start && hit.span.start < s.end)
            ?.text.trim() ?? null)
        : null;
    };
    const targets = input.targetMoods.flatMap((pole) => {
      if (!isMoodPole(pole)) return [];
      const felt = m.leaning[axisOf(pole)] === pole;
      return [
        {
          mood: pole,
          felt,
          quote: felt ? sentenceOf(pole) : null,
          idea: felt ? null : IDEAS[pole],
        },
      ];
    });
    const timeQuote = sentenceWith(input.text, TIME);
    const placeQuote = sentenceWith(input.text, PLACE);
    const best = leaning[0] ? sentenceOf(leaning[0]) : null;
    return {
      overallMood: leaning.join(' and ') || 'hard to tell yet',
      targets,
      time: { clear: timeQuote !== null, quote: timeQuote },
      place: { clear: placeQuote !== null, quote: placeQuote },
      strongDetails: best
        ? [{ quote: best, why: 'This detail sets the mood without naming it.' }]
        : [],
    };
  },
};
