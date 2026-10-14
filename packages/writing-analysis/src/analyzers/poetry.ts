import { type Span, span, words } from '../text.js';

/**
 * Poetry (Unit 7, DESIGN.md §10): syllables (the haiku counter), lines and stanzas, line breaks
 * (free verse) and sound devices. Syllable counts are estimates from spelling plus a list of common
 * exceptions; students can set any word's count themselves (overrides).
 */

// ───────── Syllables ─────────

/** Common words the spelling rules get wrong. */
// prettier-ignore
const EXCEPTIONS: Record<string, number> = {
  the: 1, every: 2, everything: 3, everyone: 3, evening: 2, different: 3, family: 3,
  beautiful: 3, poem: 2, poems: 2, poet: 2, poetry: 3, quiet: 2, quietly: 3, being: 2,
  create: 2, created: 3, idea: 3, ideas: 3, area: 3, lion: 2, lions: 2, science: 2, orange: 2,
  people: 2, little: 2, really: 2, fire: 1, fires: 1, hour: 1, hours: 1, flower: 2, flowers: 2,
  power: 2, tower: 2, shower: 2, our: 1, ours: 1, are: 1, were: 1, where: 1, there: 1, here: 1,
  "where's": 1, "there's": 1, "they're": 1, "you're": 1, "we're": 1, once: 1, one: 1, done: 1, gone: 1,
  some: 1, come: 1, comes: 1, home: 1, love: 1, move: 1, give: 1, live: 1, have: 1, sure: 1,
  something: 2, sometimes: 2, someone: 2, maybe: 2, cereal: 3, violet: 3, piano: 3, radio: 3,
  video: 3, rhythm: 2, rhythms: 2, prism: 2, chasm: 2, business: 2, wednesday: 2, chocolate: 2,
  camera: 3, favorite: 3, favourite: 3, interesting: 3, vegetable: 3, comfortable: 3,
  temperature: 4, usually: 4, actually: 4, naturally: 4, finally: 3, real: 1,
  going: 2, doing: 2, seeing: 2, saying: 2, playing: 2, flying: 2, crying: 2,
  dying: 2, lying: 2, trying: 2, buying: 2, eyes: 1, eye: 1, beyond: 2, ocean: 2,
  oceans: 2, ancient: 2, special: 2, precious: 2, delicious: 3, gracious: 2, cruel: 2,
  fuel: 2, jewel: 2, duet: 2, giant: 2, giants: 2, diamond: 2,
  violin: 3, iron: 2, dandelion: 4, butterfly: 3, butterflies: 3, dragonfly: 3, firefly: 3,
  wolves: 1, leaves: 1, waves: 1, moves: 1, lives: 1, clothes: 1, smiled: 1, raced: 1,
  rained: 1, played: 1, danced: 1, named: 1, ended: 2, wanted: 2, needed: 2, landed: 2,
  breathe: 1, breathes: 1, apple: 2, simple: 2, gentle: 2, purple: 2, circle: 2, candle: 2,
  table: 2, whistle: 2, castle: 2, bicycle: 3, icicle: 3, crumble: 2, tumble: 2,
  whale: 1, smile: 1, while: 1, mile: 1, stale: 1, pale: 1, tale: 1,
};

const lettersOnly = (word: string) =>
  word
    .toLowerCase()
    .replaceAll('’', "'")
    .replace(/[^a-z']/g, '');

/** Estimated syllables in one word (at least 1 for any word with letters). */
export function syllableCount(word: string, overrides?: Readonly<Record<string, number>>): number {
  const w = lettersOnly(word);
  if (!w) return 0;
  const override = overrides?.[w];
  if (override !== undefined) return override;
  const known = EXCEPTIONS[w];
  if (known !== undefined) return known;
  const bare = w.replaceAll("'", '');
  if (bare.length <= 3) return 1;
  // A silent e before a suffix: lonely, movement, careful, homeless.
  let core = bare.replace(/([^aeiouy])e(ly|ment|ful|less|ness)$/, '$1$2');
  // Silent endings: "-es"/"-ed" after most consonants, and a final "e" (but not "-le").
  if (/[^aeiouy]les?$/.test(core))
    core = core.replace(/les?$/, 'ul'); // candle, puddles
  else if (/(?:[sxz]|ch|sh)es$|[gc]es$/.test(core))
    core = `${core.slice(0, -2)}is`; // stretches, boxes
  else if (/(?:[^aeiouytd]ed|[^aeiouy]es|[^aeiouy]e)$/.test(core))
    core = core.replace(/e[ds]?$/, '');
  const groups = core.match(/[aeiouy]+/g)?.length ?? 1;
  // Vowel pairs that usually split into two syllables (cre-ate, li-on, di-et, po-em).
  const splits = core.match(/(?:ia|io|iu|eo|ua|uo|ie(?=t|r|nt))/g)?.length ?? 0;
  return Math.max(1, groups + splits);
}

/** True when the count is a guess the student may want to check (not in the exceptions list). */
export function syllablesUncertain(word: string): boolean {
  const w = lettersOnly(word).replaceAll("'", '');
  if (w.length <= 3 || EXCEPTIONS[w] !== undefined) return false;
  return /(?:ia|io|eo|ua|ue|ui|ea|ie|[^aeiou]les?$|ed$|es$|.y[aeiou])/.test(w);
}

/**
 * Split a word into roughly its syllables, for marking stresses ("whis-per-ing"). Splits between
 * vowel groups: VCV → V-CV, VCCV → VC-CV. The number of parts matches `syllableCount` where it can.
 */
export function splitSyllables(word: string): string[] {
  const target = syllableCount(word);
  if (target <= 1) return [word];
  const lower = word.toLowerCase();
  const isVowel = (i: number) => /[aeiouy]/.test(lower[i] ?? '');
  const cuts: number[] = [];
  let i = 0;
  while (i < word.length && cuts.length < target - 1) {
    while (i < word.length && !isVowel(i)) i += 1;
    while (i < word.length && isVowel(i)) i += 1;
    const start = i;
    while (i < word.length && !isVowel(i)) i += 1;
    if (i >= word.length) break;
    // Cut before the last consonant sound, keeping pairs like sh, ch, gh, th together:
    // kit-chens, Grand-ma, high-life, splash-ing (a pair before -ing stays with the first part).
    const cluster = lower.slice(start, i);
    const pair =
      /(?:sh|ch|th|ph|wh|ck|gh|ng)$/.test(cluster) || /.[bcdfgpt][lr]$/.test(cluster) ? 2 : 1;
    const beforeIng = lower.slice(i).startsWith('ing') && pair === 2;
    cuts.push(beforeIng ? i : Math.max(start, i - pair));
  }
  const parts: string[] = [];
  let from = 0;
  for (const c of cuts) {
    if (c > from && c < word.length) {
      parts.push(word.slice(from, c));
      from = c;
    }
  }
  parts.push(word.slice(from));
  return parts.filter((p) => p.length > 0);
}

// ───────── Lines and stanzas ─────────

export interface PoemLine extends Span {
  /** Line number in the whole poem, from 1. */
  number: number;
}

/** Non-empty lines; stanzas are separated by blank lines. */
export function stanzas(text: string): PoemLine[][] {
  const out: PoemLine[][] = [];
  let current: PoemLine[] = [];
  let number = 0;
  for (const m of text.matchAll(/[^\n]*/g)) {
    if (m.index > 0 && text[m.index - 1] !== '\n' && m[0] === '') continue;
    if (m[0].trim() === '') {
      if (current.length > 0) out.push(current);
      current = [];
      continue;
    }
    number += 1;
    current.push({ number, ...span(text, m.index, m.index + m[0].length) });
  }
  if (current.length > 0) out.push(current);
  return out;
}

export const poemLines = (text: string): PoemLine[] => stanzas(text).flat();

export interface LineSyllables {
  line: PoemLine;
  total: number;
  words: { word: Span; count: number; uncertain: boolean }[];
}

export function lineSyllables(
  line: PoemLine,
  overrides?: Readonly<Record<string, number>>,
): LineSyllables {
  const ws = words(line.text, 0, line.text.length).map((w) => {
    const key = lettersOnly(w.text);
    return {
      word: { ...w, start: w.start + line.start, end: w.end + line.start },
      count: syllableCount(w.text, overrides),
      uncertain: overrides?.[key] === undefined && syllablesUncertain(w.text),
    };
  });
  return { line, total: ws.reduce((n, w) => n + w.count, 0), words: ws };
}

/** The word used as an override key ("Fire," → "fire"). */
export const syllableKey = (word: string) => lettersOnly(word);

export interface PatternCheck {
  stanzas: { lines: LineSyllables[]; fits: boolean; lineCountOk: boolean }[];
  /** Every stanza has the right number of lines, each with the right count. */
  fits: boolean;
}

/** Check each stanza against a syllable pattern (haiku: [5, 7, 5]). */
export function checkSyllablePattern(
  text: string,
  pattern: readonly number[],
  overrides?: Readonly<Record<string, number>>,
): PatternCheck {
  const all = stanzas(text).map((lines) => {
    const counted = lines.map((l) => lineSyllables(l, overrides));
    const lineCountOk = lines.length === pattern.length;
    const fits = lineCountOk && counted.every((c, i) => c.total === pattern[i]);
    return { lines: counted, fits, lineCountOk };
  });
  return { stanzas: all, fits: all.length > 0 && all.every((s) => s.fits) };
}

// ───────── Line breaks (free verse) ─────────

export interface LineBreakResult {
  lines: (PoemLine & { words: number; enjambed: boolean })[];
  /** Share of lines (except the last) that run on into the next line, 0–1. */
  enjambment: number;
  longest: number;
  shortest: number;
}

/** A line is enjambed when it doesn't end with punctuation and the next line carries on. */
export function lineBreaks(text: string): LineBreakResult {
  const lines = poemLines(text).map((l, i, all) => ({
    ...l,
    words: words(l.text).length,
    enjambed: i < all.length - 1 && !/[.,;:!?…—–\-"”’)]\s*$/.test(l.text.trimEnd()),
  }));
  const breaks = Math.max(1, lines.length - 1);
  const counts = lines.map((l) => l.words);
  return {
    lines,
    enjambment: lines.filter((l) => l.enjambed).length / breaks,
    longest: counts.length > 0 ? Math.max(...counts) : 0,
    shortest: counts.length > 0 ? Math.min(...counts) : 0,
  };
}

// ───────── Sound devices ─────────

export const SOUND_DEVICES = ['alliteration', 'repetition', 'rhyme', 'onomatopoeia'] as const;
export type SoundDevice = (typeof SOUND_DEVICES)[number];

// prettier-ignore
const ONOMATOPOEIA = new Set([
  'buzz', 'hiss', 'pop', 'bang', 'boom', 'crash', 'splash', 'drip', 'plop', 'thud', 'thump',
  'whoosh', 'zoom', 'sizzle', 'crackle', 'crunch', 'click', 'clack', 'clang', 'clink', 'ding',
  'dong', 'tick', 'tock', 'snap', 'crack', 'squeak', 'creak', 'rustle', 'murmur', 'whisper',
  'gurgle', 'splat', 'whack', 'wham', 'bam', 'pow', 'zap', 'beep', 'honk', 'vroom', 'woof',
  'meow', 'moo', 'oink', 'quack', 'tweet', 'chirp', 'hoot', 'roar', 'growl', 'purr', 'ribbit',
  'thwack', 'clatter', 'rattle', 'jingle', 'tinkle', 'slurp', 'burp', 'hiccup', 'achoo',
  'shush', 'hush', 'swish', 'swoosh', 'whirr', 'whir', 'flutter', 'patter', 'pitter',
  'splosh', 'squelch', 'squish', 'fizz', 'boing', 'twang', 'clap', 'stomp', 'scrunch',
]);
const STOP = new Set([
  'the',
  'a',
  'an',
  'and',
  'of',
  'to',
  'in',
  'on',
  'at',
  'is',
  'it',
  'i',
  'my',
]);

export interface SoundResult {
  found: Record<SoundDevice, Span[]>;
}

/**
 * The ending sound of a word, for rhyme: its last vowel sound and what follows. Long vowels written
 * different ways become capitals first, so sea/free/me, sky/pie, night/kite and time/rhyme match.
 */
function rhymeTail(word: string): string {
  let w = lettersOnly(word).replaceAll("'", '');
  const oneSyllable = syllableCount(w) === 1;
  w = w.replace(/igh/g, 'I'); // night, light
  w = w.replace(/(?:ee|ea)$/, 'E').replace(/ie$/, 'I'); // free, sea; pie
  w = w.replace(/(?<=[^aeiouy])y$/, oneSyllable ? 'I' : 'E'); // sky; happy
  w = w.replace(/(?:ai|ay|ey)(?=[^aeiouy]*$)/, 'A'); // rain, day, they
  w = w.replace(/(?<=[^aeiouy])y(?=[^aeiouy])/g, 'i'); // rhyme → rhime
  w = w.replace(
    /([aeiou])([^aeiouy]{1,2})e$/,
    (_, v: string, c: string) => `${v.toUpperCase()}${c}`,
  ); // time
  w = w.replace(/^([^aeiouy]+)e$/, '$1E'); // me, she
  w = w.replace(/(?:ow|oe|o)$/, 'O'); // go, slow, toe
  const m = w.match(/[aeiouyAEIOU]+[^aeiouyAEIOU]*$/);
  return m ? m[0] : w;
}

/** The sound a word starts with: "ph" sounds like "f"; "th", "sh" and "ch" count as one sound. */
function firstSound(w: { lower: string }): string {
  const lower = w.lower.replace(/^ph/, 'f');
  return lower.slice(0, /^(th|sh|ch)/.test(lower) ? 2 : 1);
}

export function soundDevices(text: string): SoundResult {
  const found: Record<SoundDevice, Span[]> = {
    alliteration: [],
    repetition: [],
    rhyme: [],
    onomatopoeia: [],
  };
  const lines = poemLines(text);
  // Alliteration: three content words in a line (or two in a row) starting with the same sound.
  for (const line of lines) {
    const ws = words(line.text)
      .filter((w) => !STOP.has(w.lower))
      .map((w) => ({ ...w, start: w.start + line.start, end: w.end + line.start }));
    for (let i = 0; i + 1 < ws.length; i += 1) {
      const a = ws[i]!;
      const b = ws[i + 1]!;
      const c = ws[i + 2];
      if (
        firstSound(a) === firstSound(b) &&
        (!c || firstSound(c) === firstSound(a) || b.start - a.end <= 1)
      ) {
        const end = c && firstSound(c) === firstSound(a) ? c : b;
        found.alliteration.push(span(text, a.start, end.end));
        break;
      }
    }
  }
  // Repetition: a line or a 3+ word phrase that comes back.
  const seen = new Map<string, Span>();
  for (const line of lines) {
    const key = line.text
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N} ]/gu, '');
    if (key.split(' ').length >= 2) {
      const first = seen.get(key);
      if (first && !found.repetition.some((s) => s.start === first.start))
        found.repetition.push(first);
      if (!first) seen.set(key, line);
    }
  }
  const opening = new Map<string, Span>();
  for (const line of lines) {
    const ws = words(line.text).slice(0, 2);
    if (ws.length < 2) continue;
    const key = ws.map((w) => w.lower).join(' ');
    const first = opening.get(key);
    if (first && !found.repetition.some((s) => s.start === first.start))
      found.repetition.push(first);
    if (!first) opening.set(key, span(text, line.start, line.start + ws[1]!.end));
  }
  // Rhyme: the last words of two nearby lines share their ending sound (not the same word).
  const ends = lines
    .map((l) => words(l.text).at(-1))
    .map((w, i) =>
      w ? { ...w, start: w.start + lines[i]!.start, end: w.end + lines[i]!.start } : null,
    );
  ends.forEach((w, i) => {
    if (!w) return;
    for (const j of [i + 1, i + 2]) {
      const v = ends[j];
      if (
        v &&
        v.lower !== w.lower &&
        rhymeTail(v.text) === rhymeTail(w.text) &&
        /[A-Z]|.{2}/.test(rhymeTail(w.text))
      ) {
        found.rhyme.push(span(text, w.start, w.end), span(text, v.start, v.end));
        return;
      }
    }
  });
  // Onomatopoeia: sound words (crash, sizzle, whoosh…), also stretched ("whooosh").
  for (const w of words(text)) {
    const squeezed = w.lower.replace(/(.)\1{2,}/g, '$1$1');
    const base = squeezed.replace(/(?:ing|ed|es|s)$/, '');
    if (ONOMATOPOEIA.has(squeezed) || ONOMATOPOEIA.has(base) || ONOMATOPOEIA.has(`${base}e`)) {
      found.onomatopoeia.push(w);
    }
  }
  return { found };
}
