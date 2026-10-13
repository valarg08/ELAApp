import { type Span, words } from '../text.js';

export const SENSES = ['sight', 'sound', 'smell', 'taste', 'touch'] as const;
export type Sense = (typeof SENSES)[number];

/**
 * Starter sensory lexicon (DESIGN.md §8.3 plans ~1,500 words; extend as units need it).
 * Base forms only: simple endings (-s, -ed, -ing, -y, -ly) are matched automatically.
 */
// prettier-ignore
const LEXICON: Record<Sense, readonly string[]> = {
  sight: [
    'glow', 'gleam', 'glitter', 'sparkle', 'shimmer', 'flicker', 'flash', 'glint', 'shine',
    'shadow', 'shade', 'dim', 'dark', 'bright', 'pale', 'faded', 'blur', 'haze', 'foggy',
    'misty', 'golden', 'silver', 'crimson', 'scarlet', 'red', 'blue', 'green', 'yellow',
    'orange', 'purple', 'pink', 'grey', 'gray', 'black', 'white', 'brown', 'colour', 'color',
    'stare', 'glare', 'gaze', 'glance', 'peer', 'squint', 'watch', 'spot', 'twinkle', 'blaze',
    'dazzle', 'murky', 'gloomy', 'striped', 'spotted', 'tall', 'tiny', 'huge', 'swirl', 'lantern',
  ],
  sound: [
    'bang', 'boom', 'crash', 'thud', 'thump', 'clang', 'clatter', 'rattle', 'creak', 'squeak',
    'screech', 'scream', 'shriek', 'yell', 'shout', 'whisper', 'murmur', 'mutter', 'hum',
    'buzz', 'hiss', 'roar', 'growl', 'howl', 'bark', 'chirp', 'tweet', 'sing', 'ring', 'chime',
    'click', 'tick', 'tap', 'knock', 'pop', 'crack', 'snap', 'crunch', 'rustle', 'splash',
    'drip', 'gurgle', 'whistle', 'sizzle', 'crackle', 'rumble', 'thunder', 'echo', 'silent',
    'silence', 'quiet', 'loud', 'noisy', 'noise', 'sound', 'voice', 'sob', 'giggle', 'laugh',
    'groan', 'sigh', 'wail', 'beep', 'honk', 'slam', 'drum', 'patter', 'whimper', 'fizz', 'clap',
  ],
  smell: [
    'smell', 'scent', 'odor', 'odour', 'aroma', 'stink', 'stench', 'reek', 'whiff', 'sniff',
    'fragrance', 'fragrant', 'perfume', 'musty', 'smoky', 'smoke', 'rotten', 'stale', 'fresh',
    'flowery', 'piney', 'earthy', 'damp', 'mouldy', 'moldy', 'sour', 'burnt', 'nose', 'nostril',
    'inhale', 'garlic', 'coffee', 'bread', 'onion', 'pine', 'rain', 'sweat', 'yeast', 'cinnamon',
  ],
  taste: [
    'taste', 'flavour', 'flavor', 'sweet', 'salty', 'salt', 'bitter', 'sugary', 'spicy',
    'tangy', 'zesty', 'bland', 'juicy', 'delicious', 'tasty', 'yummy', 'chew', 'sip', 'gulp',
    'swallow', 'lick', 'bite', 'nibble', 'crunchy', 'creamy', 'buttery', 'minty', 'lemony',
    'metallic', 'tongue', 'lips', 'mouthful', 'refreshing', 'savoury', 'savory',
  ],
  touch: [
    'rough', 'smooth', 'soft', 'hard', 'silky', 'velvety', 'fuzzy', 'furry', 'prickly', 'sharp',
    'bumpy', 'slimy', 'sticky', 'slippery', 'gritty', 'grainy', 'wet', 'dry', 'cold', 'icy',
    'freezing', 'warm', 'hot', 'burning', 'chilly', 'cool', 'damp', 'heavy', 'light', 'tingle',
    'itch', 'sting', 'ache', 'throb', 'shiver', 'tremble', 'shudder', 'squeeze', 'grip', 'clutch',
    'stroke', 'brush', 'scratch', 'tickle', 'poke', 'press', 'numb', 'goosebumps', 'breeze',
    'squish', 'squelch', 'ridge', 'clammy', 'fluffy',
  ],
};

const SENSE_OF = new Map<string, Sense>();
for (const sense of SENSES) {
  for (const word of LEXICON[sense]) if (!SENSE_OF.has(word)) SENSE_OF.set(word, sense);
}

/** "glowing" → glow, "creaked" → creak, "smoky" stays, "crashes" → crash, "glittered" → glitter. */
function lookup(word: string): Sense | undefined {
  const direct = SENSE_OF.get(word);
  if (direct) return direct;
  for (const ending of ['ing', 'ed', 'es', 's', 'ly', 'y', 'd']) {
    if (!word.endsWith(ending) || word.length - ending.length < 3) continue;
    const stem = word.slice(0, -ending.length);
    const found = SENSE_OF.get(stem) ?? SENSE_OF.get(`${stem}e`) ?? SENSE_OF.get(stem.slice(0, -1));
    if (found) return found;
  }
  return undefined;
}

export interface SensesResult {
  counts: Record<Sense, number>;
  hits: { sense: Sense; word: string; span: Span }[];
  used: Sense[];
  missing: Sense[];
}

/**
 * Sense words in the text. `extra` adds the student's own words (their word bank): single words
 * count for the sense they were collected under.
 */
export function senses(
  text: string,
  extra: readonly { sense: Sense; word: string }[] = [],
): SensesResult {
  const counts: Record<Sense, number> = { sight: 0, sound: 0, smell: 0, taste: 0, touch: 0 };
  const hits: SensesResult['hits'] = [];
  const own = new Map(extra.filter((e) => !e.word.includes(' ')).map((e) => [e.word, e.sense]));
  for (const w of words(text)) {
    const sense = lookup(w.lower) ?? own.get(w.lower);
    if (!sense) continue;
    counts[sense] += 1;
    hits.push({ sense, word: w.lower, span: w });
  }
  return {
    counts,
    hits,
    used: SENSES.filter((s) => counts[s] > 0),
    missing: SENSES.filter((s) => counts[s] === 0),
  };
}
