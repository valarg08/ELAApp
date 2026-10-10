import { sentences } from '@storyforge/writing-analysis';
import { z } from 'zod/v4';
import { QUILL_RULES, writingBlock } from '../prompts.js';
import type { AnalyzerDef, WritingContext } from '../types.js';

/**
 * "Can your reader tell?" (Unit 2, DESIGN.md §10): Quill reads the piece like a reader and says
 * which of the student's chosen traits come through, and whether the character's want and fear
 * are clear.
 */
export interface CharacterReadInput extends WritingContext {
  /** Traits (or a flaw) the student chose before writing; may be empty. */
  targetTraits: readonly string[];
  /** Also check that the character's want and fear are clear (sketches and flaw scenes). */
  checkWantFear: boolean;
}

export const CharacterReadResult = z.object({
  targets: z.array(
    z.object({
      trait: z.string(),
      /** Would a reader say the character has this trait, without being told? */
      inferred: z.boolean(),
      /** The exact words that show it (when inferred). */
      quote: z.string().nullable(),
      /** When not inferred: one idea for an action or line that would show it. */
      idea: z.string().nullable(),
    }),
  ),
  /** Other traits a reader would notice, up to 3. */
  otherTraits: z.array(z.object({ trait: z.string(), quote: z.string() })),
  want: z.object({ clear: z.boolean(), quote: z.string().nullable() }),
  fear: z.object({ clear: z.boolean(), quote: z.string().nullable() }),
});
export type CharacterReadResult = z.infer<typeof CharacterReadResult>;

const SYSTEM = `${QUILL_RULES}

Task: read the student's character writing the way a reader would. The student chose some traits for their character and tried to SHOW them through actions, choices, dialogue and details, without naming them.
- targets: one entry for every chosen trait, in the same order. inferred = true only if a reader who was not told the trait would name it (or a close synonym) from what the character does or says. quote = the exact words that show it best (when inferred, else null). idea = when not inferred, one short idea for an action, choice or line of dialogue that would show it, starting with "You could try" (else null).
- otherTraits: up to 3 other traits a reader would clearly notice, each with the exact words that show it.
- want: clear = true if a reader can tell what the character wants; quote = the words that show it, or null.
- fear: clear = true if a reader can tell what the character fears or worries about; quote = the words that show it, or null.
If there are no chosen traits, return an empty targets list.`;

/** Simple clue words for the offline fake: if any appears, it guesses the trait shows. */
const TRAIT_CLUES: Record<string, readonly string[]> = {
  brave: [
    'stepped forward',
    'faced',
    'did not flinch',
    "didn't flinch",
    'charged',
    'climbed',
    'rescued',
    'stood up',
    'dared',
    'shield',
  ],
  kind: ['shared', 'helped', 'gave', 'smiled at', 'hugged', 'offered', 'comforted', 'thank'],
  shy: [
    'whispered',
    'looked down',
    'mumbled',
    'blushed',
    'hid',
    'stared at her shoes',
    'stared at his shoes',
    'quietly',
  ],
  curious: ['wondered', 'peeked', 'poked', 'asked', 'opened', 'explored', 'why', 'leaned closer'],
  stubborn: [
    'refused',
    'crossed her arms',
    'crossed his arms',
    'would not',
    "wouldn't",
    'again',
    'no way',
    'kept going',
  ],
  funny: ['laughed', 'joked', 'grinned', 'winked', 'giggled', 'silly'],
  honest: ['admitted', 'confessed', 'told the truth', 'returned', 'owned up', 'gave it back'],
  secretive: [
    'hid',
    'locked',
    'whispered',
    'glanced around',
    'tucked',
    'pocket',
    'nobody knew',
    'secret',
  ],
  loyal: ['stayed', 'promised', 'stood by', 'waited for', 'never left', 'defended'],
  impatient: ['tapped', 'sighed', 'paced', 'checked the clock', 'hurry', 'groaned', 'drummed'],
  messy: ['crumpled', 'spilled', 'pile', 'stained', 'scattered', 'tangled'],
  careful: ['checked', 'slowly', 'twice', 'gently', 'measured', 'tiptoed'],
  jealous: ['glared', 'scowled', 'muttered', 'wished it were', 'stared at', 'unfair'],
  proud: ['chin up', 'puffed', 'boasted', 'showed off', 'refused help', 'by myself'],
  forgetful: ['forgot', 'left behind', 'where did', 'again', 'oops', 'misplaced'],
  greedy: ['grabbed', 'hoarded', 'snatched', 'more', 'kept it all', 'stuffed'],
  selfish: ['grabbed', 'kept', 'ignored', 'pushed past', 'mine', 'first'],
  'hot-tempered': ['slammed', 'yelled', 'snapped', 'stomped', 'fists', 'kicked'],
  lazy: ['yawned', 'slumped', 'later', 'flopped', 'napped', 'sprawled'],
  'show-off': ['look at me', 'bragged', 'boasted', 'showed off', 'flipped', 'everyone watched'],
  cowardly: ['ran', 'hid', 'backed away', 'trembled', 'froze', 'let someone else'],
};

const WANT =
  /\b(wants?|wanted|wish(?:ed|es)?|dream(?:ed|s)? of|hop(?:e|ed|es)|longed|needs? to|needed to|had to|more than anything)\b/i;
const FEAR =
  /\b(afraid|scared|fear(?:ed|s)?|terrified|dread(?:ed)?|nervous|worried|panic(?:ked)?|trembl(?:e|ed|ing)|shak(?:e|es|ing|y)|shook|flinch(?:ed|es)?|froze|avoid(?:ed|s)?)\b/i;

function sentenceWith(text: string, re: RegExp): string | null {
  return (
    sentences(text)
      .find((s) => re.test(s.text))
      ?.text.trim() ?? null
  );
}

function clueQuote(text: string, clues: readonly string[]): string | null {
  const lower = text.toLowerCase();
  for (const clue of clues) {
    const at = lower.indexOf(clue);
    if (at >= 0)
      return (
        sentences(text)
          .find((s) => at >= s.start && at < s.end)
          ?.text.trim() ?? null
      );
  }
  return null;
}

export const characterReadAnalyzer: AnalyzerDef<CharacterReadInput, CharacterReadResult> = {
  id: 'character-read',
  version: 'character-read-1',
  effort: 'medium',
  maxTokens: 2000,
  system: SYSTEM,
  schema: CharacterReadResult,
  buildUser: (input) =>
    [
      `Chosen traits: ${input.targetTraits.join(', ') || '(none)'}`,
      `Check want and fear: ${input.checkWantFear ? 'yes' : 'no'}`,
      writingBlock(input),
    ].join('\n'),
  fake(input) {
    const targets = input.targetTraits.map((trait) => {
      const quote = clueQuote(input.text, TRAIT_CLUES[trait] ?? []);
      return {
        trait,
        inferred: quote !== null,
        quote,
        idea:
          quote === null
            ? `You could try a moment where your character makes a choice that only a ${trait} person would make.`
            : null,
      };
    });
    const wantQuote = sentenceWith(input.text, WANT);
    const fearQuote = sentenceWith(input.text, FEAR);
    return {
      targets,
      otherTraits: [],
      want: { clear: wantQuote !== null, quote: wantQuote },
      fear: { clear: fearQuote !== null, quote: fearQuote },
    };
  },
};
