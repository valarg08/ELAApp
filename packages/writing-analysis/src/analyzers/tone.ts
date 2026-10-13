import { type Span, words } from '../text.js';

/**
 * Tone (Unit 5, DESIGN.md §10 tone sliders): three scales a narrator's voice can sit on. Each pole
 * has a small lexicon; contractions also count as casual and "not"/"cannot" as formal. A heuristic:
 * it shows where the words sit, so students can compare what they aimed for with what they wrote.
 */
export const TONE_AXES = [
  { id: 'humor', poles: ['funny', 'serious'] },
  { id: 'formality', poles: ['formal', 'casual'] },
  { id: 'outlook', poles: ['hopeful', 'dark'] },
] as const;
export type ToneAxis = (typeof TONE_AXES)[number]['id'];
export type TonePole = (typeof TONE_AXES)[number]['poles'][number];
export const TONE_AXIS_IDS = [
  'humor',
  'formality',
  'outlook',
] as const satisfies readonly ToneAxis[];
export const TONE_POLES: readonly TonePole[] = TONE_AXES.flatMap((a) => a.poles);

/** A place on a scale: -2 strongly the first pole, 0 in between, 2 strongly the second pole. */
export const TONE_STEPS = [-2, -1, 0, 1, 2] as const;
export type ToneStep = (typeof TONE_STEPS)[number];
export const isToneStep = (value: unknown): value is ToneStep =>
  (TONE_STEPS as readonly unknown[]).includes(value);

export const toneAxis = (id: ToneAxis) => TONE_AXES.find((a) => a.id === id)!;

/** "very funny", "a bit funny", "in between", "a bit serious", "very serious". */
export function toneStepLabel(id: ToneAxis, step: ToneStep): string {
  const [left, right] = toneAxis(id).poles;
  if (step === 0) return 'in between';
  return `${Math.abs(step) === 2 ? 'very' : 'a bit'} ${step < 0 ? left : right}`;
}

/** The pole a step leans towards (null in the middle). */
export function tonePoleOf(id: ToneAxis, step: ToneStep): TonePole | null {
  const [left, right] = toneAxis(id).poles;
  return step < 0 ? left : step > 0 ? right : null;
}

/** Base forms only: simple endings (-s, -ed, -ing, -y, -ly) are matched automatically. */
// prettier-ignore
export const TONE_WORDS: Record<TonePole, readonly string[]> = {
  funny: [
    'laugh', 'giggle', 'snort', 'chuckle', 'grin', 'silly', 'ridiculous', 'hilarious', 'joke',
    'prank', 'oops', 'whoops', 'splat', 'plop', 'wobble', 'burp', 'tumble', 'flail', 'banana',
    'pants', 'sock', 'cheese', 'chicken', 'goofy', 'wacky', 'absurd', 'squeak', 'honk', 'haha',
    'slime', 'gooey', 'embarrass', 'clumsy', 'tickle', 'wiggle', 'bonkers', 'nonsense', 'funny',
  ],
  serious: [
    'silence', 'solemn', 'grave', 'careful', 'important', 'serious', 'slowly', 'heavy', 'tear',
    'death', 'die', 'grief', 'loss', 'duty', 'promise', 'war', 'pain', 'hurt', 'sorry', 'truth',
    'honest', 'responsibility', 'worry', 'quietly', 'gently', 'whisper', 'memory', 'nod',
    'stare', 'still',
  ],
  formal: [
    'therefore', 'however', 'moreover', 'furthermore', 'nevertheless', 'indeed', 'thus', 'hence',
    'shall', 'whom', 'whilst', 'perhaps', 'rather', 'certainly', 'approximately', 'require',
    'inform', 'regarding', 'assist', 'commence', 'obtain', 'request', 'purchase', 'sincerely',
    'consequently', 'accordingly', 'additionally', 'subsequently', 'cannot', 'not', 'madam',
    'sir', 'apologise', 'apologize', 'regret', 'observe', 'remain',
  ],
  casual: [
    'gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'yeah', 'yep', 'nope', 'okay', 'ok', 'cool',
    'awesome', 'totally', 'super', 'stuff', 'guys', 'hey', 'wow', 'um', 'uh', 'huh',
    'seriously', 'basically', 'literally', 'mega', 'epic', 'weird', 'dude', 'bro', 'lol', 'omg',
    'anyway', 'mate', 'nah', 'whatever',
  ],
  hopeful: [
    'hope', 'bright', 'smile', 'warm', 'together', 'tomorrow', 'chance', 'light', 'sunrise',
    'dawn', 'begin', 'cheer', 'safe', 'home', 'believe', 'dream', 'better', 'glad', 'heal', 'grow',
    'bloom', 'spring', 'rise', 'shine', 'help', 'friend', 'kind', 'brave', 'future', 'laugh',
  ],
  dark: [
    'never', 'alone', 'cold', 'dark', 'shadow', 'end', 'lost', 'broken', 'nothing', 'empty',
    'fear', 'grim', 'gone', 'dead', 'ruin', 'cruel', 'hopeless', 'bleak', 'despair', 'darkness',
    'rot', 'decay', 'ash', 'crumble', 'fade', 'forgotten', 'doom', 'trap', 'scream', 'bitter',
  ],
};

const POLES_OF = new Map<string, TonePole[]>();
for (const pole of TONE_POLES) {
  for (const word of TONE_WORDS[pole]) POLES_OF.set(word, [...(POLES_OF.get(word) ?? []), pole]);
}

function lookup(word: string): TonePole[] {
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

/** don't, I'm, we're, they'll, I've, she'd, it's, that's (not possessives like Sam's). */
const CONTRACTION =
  /^(?:\w+n't|i'm|\w+'re|\w+'ll|\w+'ve|\w+'d|it's|that's|there's|what's|he's|she's|let's|who's)$/;

export interface ToneResult {
  counts: Record<TonePole, number>;
  hits: { pole: TonePole; word: string; span: Span }[];
  /** Per scale, where the words sit (-2 … 2), or null with fewer than 2 tone words. */
  heard: Record<ToneAxis, ToneStep | null>;
}

const MIN_HITS = 2;

function place(left: number, right: number): ToneStep | null {
  const total = left + right;
  if (total < MIN_HITS) return null;
  const ratio = (right - left) / total;
  const step: ToneStep =
    ratio <= -0.6 ? -2 : ratio <= -0.2 ? -1 : ratio < 0.2 ? 0 : ratio < 0.6 ? 1 : 2;
  // A handful of words is a hint, not a strong tone.
  if (total < 4 && Math.abs(step) === 2) return step < 0 ? -1 : 1;
  return step;
}

export function tone(text: string): ToneResult {
  const counts: Record<TonePole, number> = {
    funny: 0,
    serious: 0,
    formal: 0,
    casual: 0,
    hopeful: 0,
    dark: 0,
  };
  const hits: ToneResult['hits'] = [];
  for (const w of words(text)) {
    const poles = CONTRACTION.test(w.lower) ? (['casual'] as const) : lookup(w.lower);
    for (const pole of poles) {
      counts[pole] += 1;
      hits.push({ pole, word: w.lower, span: w });
    }
  }
  return {
    counts,
    hits,
    heard: {
      humor: place(counts.funny, counts.serious),
      formality: place(counts.formal, counts.casual),
      outlook: place(counts.hopeful, counts.dark),
    },
  };
}

/** A few example words for a pole (for "you could try words like…"). */
export const toneIdeas = (pole: TonePole, skip: readonly string[] = [], n = 4) =>
  TONE_WORDS[pole].filter((w) => w !== pole && w !== 'not' && !skip.includes(w)).slice(0, n);
