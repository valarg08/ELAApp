import {
  SOUND_DEVICES,
  checkSyllablePattern,
  lineBreaks,
  poemLines,
  senses,
  soundDevices,
} from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Does my poem work?" (Unit 7): Quill reads a poem for its form (haiku, free verse, spoken word,
 * sound poem), its strongest image, what the line breaks do, its sound, and the strongest line.
 */
export const POEM_FORMS = ['haiku', 'free-verse', 'spoken-word', 'sound-poem'] as const;
export type PoemForm = (typeof POEM_FORMS)[number];

export interface PoetryCraftInput extends WritingContext {
  form: PoemForm;
  /** Syllables per line in each stanza, if the form has a pattern. */
  pattern: readonly number[] | null;
  /** The student's own syllable counts. */
  syllableOverrides: Readonly<Record<string, number>>;
}

export const PoetryCraftResult = z.object({
  form: z.object({
    /** Does it work as this kind of poem? */
    fits: z.boolean(),
    note: z.string(),
  }),
  /** The clearest picture the poem paints. */
  image: z.object({ quote: z.string(), why: z.string() }).nullable(),
  /** Up to 2 line breaks and what they do (a pause, a surprise, emphasis). */
  lineBreaks: z.array(z.object({ quote: z.string(), effect: z.string() })),
  /** Sound devices that work (alliteration, repetition, rhyme, onomatopoeia, rhythm). */
  sound: z.array(z.object({ device: z.string(), quote: z.string() })),
  strongestLine: z.object({ quote: z.string(), why: z.string() }).nullable(),
  /** One idea to make the poem stronger, starting "You could try". */
  nextIdea: z.string().nullable(),
});
export type PoetryCraftResult = z.infer<typeof PoetryCraftResult>;

const SYSTEM = `${QUILL_RULES}

Task: read the student's POEM the way a poet would, with warmth. Line breaks are part of the poem: a new line starts after each line break, and blank lines separate verses.
- form: fits = true if it works as the given form. haiku: three short lines (about 5-7-5 syllables), one moment, a picture from nature or daily life, often a surprise in the last line. free-verse: no fixed rhyme or rhythm, but line breaks chosen on purpose. spoken-word: written to be performed, with rhythm, repetition and a strong voice. sound-poem: uses sound devices on purpose. note = one sentence about how it fits or what's missing.
- image: the clearest picture in the poem; quote = exact words, why = one sentence. Null if there isn't one.
- lineBreaks: up to 2 line breaks that do something (a pause, a surprise, a word given weight); quote = the exact line before the break; effect = one sentence. Empty for very short poems.
- sound: sound devices that work; device = alliteration, repetition, rhyme, onomatopoeia or rhythm; quote = exact words.
- strongestLine: the line that hits hardest; quote = exact words; why = one sentence of specific praise.
- nextIdea: one idea to make the poem stronger, starting "You could try" (an idea, not a rewritten line), or null.`;

const FORM_NOTES: Record<PoemForm, { fits: string; not: string }> = {
  haiku: {
    fits: 'Three short lines that catch one moment: that is a haiku.',
    not: 'A haiku is three lines of 5, 7 and 5 syllables. Check each line.',
  },
  'free-verse': {
    fits: 'Your line breaks give the poem its shape.',
    not: 'Free verse still lives in lines. Break your poem where you want the reader to pause.',
  },
  'spoken-word': {
    fits: 'Repetition and rhythm make this ready to perform.',
    not: 'A spoken-word poem needs something that repeats, like a chorus, to carry it when read aloud.',
  },
  'sound-poem': {
    fits: 'You use sound on purpose, so the poem is fun to say aloud.',
    not: 'Try more sound: words that start the same way, rhymes, or words that sound like their meaning.',
  },
};

export const poetryCraftAnalyzer: AnalyzerDef<PoetryCraftInput, PoetryCraftResult> = {
  id: 'poetry-craft',
  version: 'poetry-craft-1',
  effort: 'medium',
  maxTokens: 1500,
  system: SYSTEM,
  schema: PoetryCraftResult,
  buildUser: (input) =>
    [
      `Form: ${input.form}`,
      `Syllable pattern per verse: ${input.pattern?.join('-') ?? '(none)'}`,
      writingBlock(input),
    ].join('\n'),
  fake(input) {
    const { text } = input;
    const lines = poemLines(text);
    const lb = lineBreaks(text);
    const snd = soundDevices(text);
    const sound = SOUND_DEVICES.flatMap((d) =>
      snd.found[d][0] ? [{ device: d, quote: snd.found[d][0].text }] : [],
    );
    let fits: boolean;
    if (input.form === 'haiku') {
      fits = input.pattern
        ? checkSyllablePattern(text, input.pattern, input.syllableOverrides).fits
        : lines.length === 3;
    } else if (input.form === 'spoken-word') fits = snd.found.repetition.length > 0;
    else if (input.form === 'sound-poem') fits = sound.length >= 2;
    else fits = lines.length >= 4 && lb.enjambment > 0;
    // The line with the most sense words is the clearest picture; the shortest line carries weight.
    const sensed = lines
      .map((l) => ({ l, n: senses(l.text).hits.length }))
      .toSorted((a, b) => b.n - a.n)[0];
    const image =
      sensed && sensed.n > 0
        ? { quote: sensed.l.text.trim(), why: 'You can see, hear or feel this line.' }
        : null;
    const run = lb.lines.find((l) => l.enjambed && l.words > 1);
    const lonely = lb.lines.find((l) => l.words === 1);
    const breaks = [
      ...(run
        ? [
            {
              quote: run.text.trim(),
              effect: 'The line runs on, so the reader is pulled into the next one.',
            },
          ]
        : []),
      ...(lonely
        ? [
            {
              quote: lonely.text.trim(),
              effect: 'A word on its own line makes the reader stop and notice it.',
            },
          ]
        : []),
    ];
    const last = lines.at(-1);
    const missingSound = SOUND_DEVICES.find((d) => snd.found[d].length === 0);
    let nextIdea: string | null = null;
    if (fits && !image)
      nextIdea = 'You could try adding one detail the reader can see, hear or touch.';
    else if (fits && input.form !== 'haiku' && lines.length > 3 && lb.enjambment === 0)
      nextIdea =
        'You could try breaking one line in the middle of a thought, so the reader has to keep going.';
    else if (fits && input.form === 'sound-poem' && missingSound)
      nextIdea = `You could try adding ${missingSound === 'onomatopoeia' ? 'a sound word' : `some ${missingSound}`} where the mood is strongest.`;
    return {
      form: { fits, note: fits ? FORM_NOTES[input.form].fits : FORM_NOTES[input.form].not },
      image,
      lineBreaks: breaks,
      sound,
      strongestLine: last
        ? {
            quote: last.text.trim(),
            why: 'Your last line leaves the reader with something to think about.',
          }
        : null,
      nextIdea,
    };
  },
};
