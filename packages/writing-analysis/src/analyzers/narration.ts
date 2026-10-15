import {
  type Span,
  type WordToken,
  inside,
  narrationWords,
  quotedSpans,
  sentences,
  span,
  words,
} from '../text.js';

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

const SUBJECTS_3RD = new Set(['he', 'she', 'they']);

/**
 * In a first-person story, runs of 3+ sentences that start with he/she/they and never use I, me or
 * my: the narrator may have slipped into third person (or is describing someone else for a while).
 * Returns the first sentence of each run. A hint, never a rule.
 */
export function firstPersonGaps(text: string): Span[] {
  const quoted = quotedSpans(text).spans;
  const gaps: Span[] = [];
  let run: { first: Span; count: number; third: number; startsThird: boolean } | null = null;
  const close = () => {
    if (run && run.count >= 3 && run.third >= 3 && run.startsThird) gaps.push(run.first);
    run = null;
  };
  for (const sentence of sentences(text)) {
    const tokens = words(text, sentence.start, sentence.end).filter(
      (w) => !inside(w.start, quoted),
    );
    if (tokens.length === 0) continue;
    const people = tokens.map(personOf);
    if (people.includes('first')) {
      close();
      continue;
    }
    const third = people.filter((p) => p === 'third').length;
    if (third === 0) {
      close();
      continue;
    }
    if (!run)
      run = {
        first: sentence,
        count: 0,
        third: 0,
        startsThird: SUBJECTS_3RD.has(tokens[0]!.lower),
      };
    run.count += 1;
    run.third += third;
  }
  close();
  return gaps;
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

const INNER_SPEECH = /\b(thought|wondered|said|asked|whispered|told (?:him|her|them)self)\b/i;

/**
 * Stricter than `povShifts` for a third-person part: any I, me, my, we… in the narration is a slip,
 * unless its sentence is a character's unquoted thought or speech ("I can do this, she thought").
 */
export function thirdPersonSlips(text: string): Span[] {
  const all = sentences(text);
  return pointOfView(text).spans.first.filter((w) => {
    const sentence = all.find((x) => w.start >= x.start && w.start < x.end);
    return !sentence || !INNER_SPEECH.test(sentence.text);
  });
}

// ───────── Narrator reach (third person limited vs omniscient) ─────────

/** How much a third-person narrator knows: one character's mind, or everyone's. */
export type Narrator = 'limited' | 'omniscient';

// prettier-ignore
const THOUGHT_VERBS = new Set([
  'thought', 'wondered', 'knew', 'felt', 'hoped', 'wished', 'feared', 'realised', 'realized',
  'worried', 'decided', 'remembered', 'believed', 'imagined', 'guessed', 'suspected', 'wanted',
  'dreaded', 'longed', 'hated', 'loved', 'missed', 'regretted', 'doubted', 'pictured',
  'thinks', 'wonders', 'knows', 'feels', 'hopes', 'wishes', 'fears', 'realises', 'realizes',
  'worries', 'decides', 'remembers', 'believes', 'imagines', 'wants', 'dreads', 'longs',
]);
/** After a comma, these show the thoughts of whoever the sentence is about ("Leo froze, wishing…"). */
// prettier-ignore
const CLAUSE_THOUGHTS = new Set([
  'wishing', 'wondering', 'hoping', 'thinking', 'knowing', 'sure', 'certain', 'afraid',
  'convinced', 'worrying', 'remembering', 'imagining', 'praying', 'dreading',
]);
/** Words that may sit between the thinker and the verb ("Sam secretly hoped", "she still knew"). */
const BETWEEN = new Set([
  'also',
  'never',
  'just',
  'still',
  'already',
  'always',
  'suddenly',
  'only',
]);
/** Capitalised words that aren't characters' names (mostly words that start sentences). */
// prettier-ignore
const NOT_NAMES = new Set([
  'the', 'a', 'an', 'and', 'but', 'or', 'so', 'then', 'when', 'while', 'if', 'as', 'it', 'its',
  'this', 'that', 'these', 'those', 'there', 'they', 'he', 'she', 'we', 'you', 'i', 'his', 'her',
  'their', 'our', 'my', 'your', 'everyone', 'nobody', 'no', 'someone', 'somebody', 'everybody',
  'nothing', 'something', 'all', 'both', 'each', 'one', 'neither', 'either', 'every', 'some',
  'what', 'why', 'how', 'who', 'where', 'later', 'now', 'still', 'maybe', 'even', 'only', 'just',
  'after', 'before', 'because', 'once', 'in', 'on', 'at', 'from', 'with', 'without', 'by', 'for',
  'to', 'of', 'into', 'onto', 'over', 'under', 'behind', 'across', 'through', 'outside',
  'inside', 'suddenly', 'finally', 'meanwhile', 'today', 'tomorrow', 'yesterday', 'tonight',
  'perhaps', 'not', 'never', 'always', 'soon', 'until', 'back', 'up', 'down', 'here', 'yes',
  'mr', 'mrs', 'ms', 'miss', 'dr',
]);

const TITLES = new Set(['mr', 'mrs', 'ms', 'miss', 'dr']);

const verbLike = (w: WordToken | undefined) =>
  !!w &&
  (THOUGHT_VERBS.has(w.lower) ||
    PAST_WORDS.has(w.lower) ||
    (w.lower.length > 3 && w.lower.endsWith('ed')) ||
    /[^s]s$/.test(w.lower));

export interface NarratorResult {
  /** Characters whose thoughts or feelings the narration shows, first time each appears. */
  minds: { who: string; span: Span }[];
  /**
   * "omniscient" when two or more characters' thoughts are shown, "limited" with one, "unknown"
   * with none. A heuristic: "he" and "she" stand for the last named character doing something.
   */
  guess: Narrator | 'unknown';
}

export function narratorReach(text: string): NarratorResult {
  const narration = new Set(narrationWords(text).map((w) => w.start));
  const all = words(text);
  const starts = new Set(sentences(text).map((s) => words(text, s.start, s.end)[0]?.start));
  /** The word after i, skipping "still", "secretly"… */
  const next = (i: number) => {
    let j = i + 1;
    if (all[j] && (BETWEEN.has(all[j]!.lower) || all[j]!.lower.endsWith('ly'))) j += 1;
    return all[j];
  };
  const isName = (i: number) => {
    const w = all[i]!;
    return (
      /^\p{Lu}/u.test(w.text) &&
      !NOT_NAMES.has(w.lower) &&
      (!starts.has(w.start) || verbLike(next(i)))
    );
  };
  /** "Ms Rivera", not just "Rivera". */
  const withTitle = (i: number) =>
    TITLES.has(all[i - 1]?.lower ?? '') ? `${all[i - 1]!.text} ${all[i]!.text}` : all[i]!.text;
  // The last named character who did something, at each word (what "he" or "she" points back to).
  let last: string | null = null;
  const actorAt = all.map((w, i) => {
    if (isName(i) && verbLike(next(i))) last = withTitle(i);
    return last;
  });

  const minds = new Map<string, Span>();
  let unresolved = 0;
  all.forEach((verb, v) => {
    if (!narration.has(verb.start)) return;
    if (CLAUSE_THOUGHTS.has(verb.lower) && /,\s*$/.test(text.slice(0, verb.start))) {
      const actor = actorAt[v - 1];
      if (actor && !minds.has(actor)) minds.set(actor, verb);
      return;
    }
    if (!THOUGHT_VERBS.has(verb.lower)) return;
    let i = v - 1;
    if (all[i] && (BETWEEN.has(all[i]!.lower) || all[i]!.lower.endsWith('ly'))) i -= 1;
    // "Mum dropped her tray and wondered…": the thinker is whoever the sentence is about.
    const and = all[i];
    if (and?.lower === 'and') {
      const actor = actorAt[i];
      const sameSentence = !/[.!?…\n]/.test(
        text.slice(text.lastIndexOf(actor ?? '', and.start), and.start),
      );
      if (actor && sameSentence && !minds.has(actor))
        minds.set(actor, span(text, and.start, verb.end));
      return;
    }
    const subject = all[i];
    // The thinker must be in the same sentence, right before the verb.
    if (!subject || /[.!?…\n]/.test(text.slice(subject.end, verb.start))) return;
    let who: string | null = null;
    if (isName(i)) who = withTitle(i);
    else if (subject.lower === 'he' || subject.lower === 'she') {
      who = actorAt[i - 1] ?? subject.lower;
      if (who === subject.lower && !minds.has(who)) unresolved += 1;
    }
    if (who && !minds.has(who)) minds.set(who, span(text, subject.start, verb.end));
  });
  const count = Math.max(minds.size - unresolved, unresolved);
  return {
    minds: [...minds].map(([who, s]) => ({ who, span: s })),
    guess: minds.size === 0 ? 'unknown' : count >= 2 ? 'omniscient' : 'limited',
  };
}

// ───────── Labelled parts (the multi-perspective rewrite) ─────────

export interface Section extends Span {
  label: string;
  /** False when the heading line is missing (then the span is empty). */
  found: boolean;
}

const headingKey = (line: string) =>
  line
    .trim()
    .replace(/^[#*\-\s]+/, '')
    .replace(/[:*\s]+$/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();

/**
 * Split a draft into parts that each start with a heading line equal to a label (case, spaces,
 * a trailing colon and leading # or * are ignored). Returned in label order.
 */
export function splitSections(text: string, labels: readonly string[]): Section[] {
  const wanted = new Map(labels.map((l) => [headingKey(l), l]));
  const heads: { label: string; start: number; bodyStart: number }[] = [];
  for (const m of text.matchAll(/[^\n]*/g)) {
    const label = wanted.get(headingKey(m[0]));
    if (!label || heads.some((h) => h.label === label)) continue;
    heads.push({ label, start: m.index, bodyStart: m.index + m[0].length });
  }
  return labels.map((label) => {
    const at = heads.findIndex((h) => h.label === label);
    const head = heads[at];
    if (!head) return { label, found: false, start: 0, end: 0, text: '' };
    const end = heads[at + 1]?.start ?? text.length;
    return { label, found: true, ...span(text, head.bodyStart, end) };
  });
}

/** Move spans found in a part back to positions in the whole draft. */
export const shiftSpan = <T extends Span>(s: T, by: number): T => ({
  ...s,
  start: s.start + by,
  end: s.end + by,
});
