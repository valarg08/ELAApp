import { type Span, type WordToken, narrationWords, sentences, words } from '../text.js';

/**
 * Point of view and tense of the narration (quoted speech is ignored, since characters may speak in
 * any person or tense). Both are heuristics: they guess from pronouns and common verb forms.
 */

// ───────── Point of view ─────────

export type Pov = 'first' | 'second' | 'third';

const FIRST = new Set(['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves']);
const SECOND = new Set(['you', 'your', 'yours', 'yourself', 'yourselves']);
const THIRD = new Set([
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
]);

const personOf = (w: WordToken): Pov | null => {
  const base = w.lower.split("'")[0] ?? w.lower; // I'm, we're, you'll, she'd
  if (FIRST.has(base)) return 'first';
  if (SECOND.has(base)) return 'second';
  if (THIRD.has(base)) return 'third';
  return null;
};

export interface PovResult {
  counts: Record<Pov, number>;
  /** "unknown" when there are too few pronouns to tell. */
  guess: Pov | 'unknown';
  /** Narration pronouns of each person, for pointing at shifts. */
  spans: Record<Pov, Span[]>;
}

export function pointOfView(text: string): PovResult {
  const counts: Record<Pov, number> = { first: 0, second: 0, third: 0 };
  const spans: Record<Pov, Span[]> = { first: [], second: [], third: [] };
  for (const w of narrationWords(text)) {
    const person = personOf(w);
    if (!person) continue;
    counts[person] += 1;
    spans[person].push(w);
  }
  const total = counts.first + counts.second + counts.third;
  // A first-person narrator still talks about "he" and "she", so a little "I" in the narration
  // is a strong signal; "you" must dominate to count as second person.
  let guess: PovResult['guess'] = 'unknown';
  if (counts.first >= 2 && counts.first >= total * 0.15) guess = 'first';
  else if (counts.second >= 3 && counts.second >= total * 0.4) guess = 'second';
  else if (counts.third >= 2) guess = 'third';
  return { counts, guess, spans };
}

/** Narration pronouns that break a point-of-view lock (empty when the lock is kept). */
export function povShifts(result: PovResult, lock: Pov): Span[] {
  if (result.guess === 'unknown' || result.guess === lock) return [];
  if (lock === 'third') return [...result.spans.first, ...result.spans.second];
  if (lock === 'first') return result.spans.third.slice(0, 1);
  return [...result.spans.first, ...result.spans.third];
}

// ───────── Tense ─────────

export type Tense = 'past' | 'present';

const PAST_WORDS = new Set([
  'was',
  'were',
  'had',
  'did',
  "wasn't",
  "weren't",
  "hadn't",
  "didn't",
  'went',
  'came',
  'saw',
  'took',
  'made',
  'said',
  'got',
  'gave',
  'found',
  'thought',
  'told',
  'felt',
  'left',
  'kept',
  'knew',
  'ran',
  'sat',
  'stood',
  'heard',
  'held',
  'brought',
  'began',
  'became',
  'fell',
  'grew',
  'threw',
  'caught',
  'drew',
  'drove',
  'ate',
  'drank',
  'swam',
  'sang',
  'rang',
  'wrote',
  'rode',
  'spoke',
  'broke',
  'chose',
  'woke',
  'froze',
  'hid',
  'bit',
  'shook',
  'stole',
  'tore',
  'wore',
  'flew',
  'blew',
  'knelt',
  'slept',
  'swept',
  'wept',
  'crept',
  'meant',
  'sent',
  'spent',
  'built',
  'lost',
  'paid',
  'laid',
  'led',
  'fed',
  'fled',
  'bought',
  'fought',
  'sought',
  'taught',
  'understood',
  'forgot',
  'won',
  'stuck',
  'struck',
  'swung',
  'hung',
  'clung',
  'dug',
  'lit',
  'met',
  'sank',
  'shone',
  'slid',
  'spun',
  'sprang',
  'stung',
  'strode',
  'tripped',
]);
const PRESENT_WORDS = new Set([
  'is',
  'am',
  'are',
  "isn't",
  "aren't",
  'has',
  'does',
  "doesn't",
  "he's",
  "she's",
  "it's",
  "that's",
  "there's",
  "i'm",
  "we're",
  "they're",
  "you're",
]);
/** Words ending in -ed that aren't past-tense verbs. */
const NOT_PAST_ED = new Set([
  'bed',
  'red',
  'shed',
  'sled',
  'need',
  'seed',
  'feed',
  'speed',
  'weed',
  'bleed',
  'breed',
  'greed',
  'deed',
  'hundred',
  'sacred',
  'wicked',
  'naked',
  'ragged',
  'rugged',
  'jagged',
  'beloved',
  'kindred',
  'indeed',
]);
const SUBJECTS = new Set(['he', 'she', 'it']);

function tenseOf(w: WordToken, previous: WordToken | undefined): Tense | null {
  if (PAST_WORDS.has(w.lower)) return 'past';
  if (PRESENT_WORDS.has(w.lower)) return 'present';
  if (w.lower.length > 3 && w.lower.endsWith('ed') && !NOT_PAST_ED.has(w.lower)) return 'past';
  // "she runs", "it creaks"
  if (previous && SUBJECTS.has(previous.lower) && /[^s]s$/.test(w.lower)) return 'present';
  return null;
}

export interface TenseResult {
  counts: Record<Tense, number>;
  /** "mixed" when neither tense clearly leads; "unknown" with too few verbs. */
  guess: Tense | 'mixed' | 'unknown';
  /** Sentences whose narration verbs are all in one tense. */
  sentenceTenses: { sentence: Span; tense: Tense }[];
}

export function tense(text: string): TenseResult {
  const counts: Record<Tense, number> = { past: 0, present: 0 };
  const narration = narrationWords(text);
  const narrationStarts = new Set(narration.map((w) => w.start));
  const sentenceTenses: TenseResult['sentenceTenses'] = [];

  for (const sentence of sentences(text)) {
    const tokens = words(text, sentence.start, sentence.end);
    const seen: Record<Tense, number> = { past: 0, present: 0 };
    tokens.forEach((w, i) => {
      if (!narrationStarts.has(w.start)) return;
      const t = tenseOf(w, tokens[i - 1]);
      if (t) seen[t] += 1;
    });
    counts.past += seen.past;
    counts.present += seen.present;
    if (seen.past > 0 && seen.present === 0) sentenceTenses.push({ sentence, tense: 'past' });
    if (seen.present > 0 && seen.past === 0) sentenceTenses.push({ sentence, tense: 'present' });
  }

  const total = counts.past + counts.present;
  let guess: TenseResult['guess'] = 'unknown';
  if (total >= 4) {
    if (counts.past >= total * 0.7) guess = 'past';
    else if (counts.present >= total * 0.7) guess = 'present';
    else guess = 'mixed';
  }
  return { counts, guess, sentenceTenses };
}

/** True when enough of the narration uses the other tense (at least 2 verbs and 35%). */
export function breaksTenseLock(result: TenseResult, lock: Tense): boolean {
  const other = lock === 'past' ? result.counts.present : result.counts.past;
  const total = result.counts.past + result.counts.present;
  return other >= 2 && other >= total * 0.35;
}

/** Sentences written in the other tense. */
export function offTenseSentences(result: TenseResult, expected: Tense): Span[] {
  return result.sentenceTenses.filter((s) => s.tense !== expected).map((s) => s.sentence);
}
