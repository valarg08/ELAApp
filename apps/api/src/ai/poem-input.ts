import type { PoemForm, PoetryCraftInput } from '@storyforge/ai';
import { type WritingActivity, validSyllables } from '@storyforge/shared';

const FORMS: Partial<Record<WritingActivity['type'], PoemForm>> = {
  HAIKU: 'haiku',
  FREE_VERSE: 'free-verse',
  SPOKEN_WORD: 'spoken-word',
  SOUND_POEM: 'sound-poem',
};

/** The form, syllable pattern and the student's own syllable counts for "Does my poem work?". */
export function poemInput(
  activity: WritingActivity,
  syllables: unknown,
): Pick<PoetryCraftInput, 'form' | 'pattern' | 'syllableOverrides'> {
  return {
    form: FORMS[activity.type] ?? 'free-verse',
    pattern: activity.constraints.syllablePattern ?? null,
    syllableOverrides: validSyllables(syllables),
  };
}

/** Cache key part: different syllable counts can change the form check. */
export const poemScope = (input: Pick<PoetryCraftInput, 'syllableOverrides'>) =>
  Object.entries(input.syllableOverrides)
    .map(([w, n]) => `${w}${n}`)
    .join(',') || '-';
