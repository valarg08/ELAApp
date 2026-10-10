import { type Span, words } from '../text.js';

/**
 * Setting mood (Unit 3, DESIGN.md §10): three mood scales from the World builder's sliders. Each
 * pole has a small lexicon of setting words that build that mood; the same lists are the
 * "setting word bank" shown to students.
 */
export const MOOD_AXES = [
  { id: 'energy', poles: ['calm', 'tense'] },
  { id: 'light', poles: ['bright', 'gloomy'] },
  { id: 'safety', poles: ['safe', 'dangerous'] },
] as const;
export type MoodAxis = (typeof MOOD_AXES)[number]['id'];
export type MoodPole = (typeof MOOD_AXES)[number]['poles'][number];
export const MOOD_AXIS_IDS = ['energy', 'light', 'safety'] as const satisfies readonly MoodAxis[];
export const MOOD_POLES: readonly MoodPole[] = MOOD_AXES.flatMap((a) => a.poles);
export const isMoodPole = (value: string): value is MoodPole =>
  (MOOD_POLES as readonly string[]).includes(value);

/** Base forms only: simple endings (-s, -ed, -ing, -y, -ly) are matched automatically. */
// prettier-ignore
export const MOOD_WORDS: Record<MoodPole, readonly string[]> = {
  calm: [
    'gentle', 'soft', 'still', 'quiet', 'hush', 'drift', 'float', 'ripple', 'lap', 'murmur',
    'hum', 'breeze', 'sway', 'linger', 'slow', 'peaceful', 'smooth', 'rest', 'doze', 'sigh',
    'lazy', 'mellow', 'cosy', 'cozy', 'warm', 'settle', 'glide', 'meadow', 'lullaby', 'calm',
  ],
  tense: [
    'crack', 'snap', 'creak', 'scrape', 'thud', 'pound', 'pulse', 'race', 'jolt', 'flinch',
    'freeze', 'grip', 'clench', 'tick', 'shriek', 'screech', 'rattle', 'hiss', 'sudden',
    'sharp', 'tight', 'brittle', 'jagged', 'twitch', 'lurch', 'slam', 'echo', 'silence',
    'breathless', 'hammer',
  ],
  bright: [
    'sun', 'sunlight', 'sunny', 'golden', 'gleam', 'glitter', 'sparkle', 'shine', 'dazzle',
    'glow', 'blaze', 'shimmer', 'twinkle', 'radiant', 'vivid', 'colourful', 'colorful',
    'blossom', 'bloom', 'clear', 'blue', 'yellow', 'light', 'morning', 'dawn', 'rainbow', 'beam',
    'bright', 'cheerful', 'fresh',
  ],
  gloomy: [
    'shadow', 'shade', 'dark', 'dim', 'grey', 'murky', 'fog', 'mist', 'haze', 'drizzle',
    'damp', 'drab', 'dull', 'bleak', 'faded', 'rotten', 'crumble', 'dust', 'cobweb', 'stale',
    'bare', 'cloud', 'overcast', 'dusk', 'night', 'ash', 'soot', 'gloom', 'dreary', 'gray',
  ],
  safe: [
    'home', 'blanket', 'hearth', 'fireplace', 'cushion', 'soft', 'warm', 'cosy', 'cozy', 'snug',
    'lamp', 'shelter', 'nest', 'hug', 'cocoa', 'kitchen', 'familiar', 'welcome', 'gentle',
    'laugh', 'smile', 'friend', 'garden', 'bake', 'bread', 'quilt', 'porch', 'curl', 'tuck',
    'safe',
  ],
  dangerous: [
    'cliff', 'edge', 'jagged', 'thorn', 'spike', 'claw', 'fang', 'growl', 'snarl', 'howl',
    'storm', 'thunder', 'lightning', 'flood', 'flame', 'smoke', 'ice', 'crumble', 'collapse',
    'trap', 'lurk', 'creep', 'prowl', 'stalk', 'warning', 'blood', 'poison', 'abandoned',
    'broken', 'danger',
  ],
};

const POLES_OF = new Map<string, MoodPole[]>();
for (const pole of MOOD_POLES) {
  for (const word of MOOD_WORDS[pole]) POLES_OF.set(word, [...(POLES_OF.get(word) ?? []), pole]);
}

function lookup(word: string): MoodPole[] {
  const direct = POLES_OF.get(word);
  if (direct) return direct;
  for (const ending of ['ing', 'ed', 'es', 's', 'ly', 'y', 'd']) {
    if (!word.endsWith(ending) || word.length - ending.length < 3) continue;
    const stem = word.slice(0, -ending.length);
    const found = POLES_OF.get(stem) ?? POLES_OF.get(`${stem}e`) ?? POLES_OF.get(stem.slice(0, -1));
    if (found) return found;
  }
  return [];
}

export interface MoodResult {
  counts: Record<MoodPole, number>;
  hits: { pole: MoodPole; word: string; span: Span }[];
  /** Per scale, the pole the words lean towards (null when too few words or it's even). */
  leaning: Record<MoodAxis, MoodPole | null>;
}

/** A scale leans one way with at least 2 mood words and a clear lead. */
const MIN_HITS = 2;

export function mood(text: string): MoodResult {
  const counts: Record<MoodPole, number> = {
    calm: 0,
    tense: 0,
    bright: 0,
    gloomy: 0,
    safe: 0,
    dangerous: 0,
  };
  const hits: MoodResult['hits'] = [];
  for (const w of words(text)) {
    for (const pole of lookup(w.lower)) {
      counts[pole] += 1;
      hits.push({ pole, word: w.lower, span: w });
    }
  }
  const lean = (a: MoodPole, b: MoodPole): MoodPole | null => {
    const ca = counts[a];
    const cb = counts[b];
    if (Math.max(ca, cb) < MIN_HITS || ca === cb || Math.max(ca, cb) < 2 * Math.min(ca, cb)) {
      return null;
    }
    return ca > cb ? a : b;
  };
  const leaning: Record<MoodAxis, MoodPole | null> = {
    energy: lean('calm', 'tense'),
    light: lean('bright', 'gloomy'),
    safety: lean('safe', 'dangerous'),
  };
  return { counts, hits, leaning };
}

export const axisOf = (pole: MoodPole): MoodAxis =>
  MOOD_AXES.find((a) => (a.poles as readonly string[]).includes(pole))!.id;

export const oppositeOf = (pole: MoodPole): MoodPole => {
  const axis = MOOD_AXES.find((a) => (a.poles as readonly string[]).includes(pole))!;
  return axis.poles[0] === pole ? axis.poles[1] : axis.poles[0];
};

/** The setting word bank for the chosen moods (deterministic, a few words per mood). */
export function moodWordBank(poles: readonly MoodPole[], perPole = 10): Record<string, string[]> {
  return Object.fromEntries(
    poles.map((p) => [p, MOOD_WORDS[p].filter((w) => w !== p).slice(0, perPole)]),
  );
}
