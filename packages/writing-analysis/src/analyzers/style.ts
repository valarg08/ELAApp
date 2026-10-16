import { type Span, quotedSpans, sentences } from '../text.js';
import type { GrammarIssue } from './grammar.js';

/**
 * Formal style for essays (Essay Writing Unit 15, DESIGN.md §9.12): contractions, informal words,
 * wordy phrases, vague words and "I think" in arguments and explanations. Quoted words are left
 * alone. Word lists, not rules: a formal essay may still choose an informal word on purpose.
 */

export const STYLE_FEATURES = ['formal-sentence'] as const;
export type StyleFeature = (typeof STYLE_FEATURES)[number];

export const STYLE_FEATURE_LABELS: Record<StyleFeature, string> = {
  'formal-sentence': 'a formal sentence',
};

export const STYLE_FEATURE_EXAMPLES: Record<StyleFeature, string> = {
  'formal-sentence':
    'a complete sentence with no contractions, slang, wordy phrases or vague words, like Many students do not have time to eat breakfast',
};

export interface StyleOptions {
  /** Narratives may say "I think" and "I feel"; arguments and explanations shouldn't. */
  type?: 'argumentative' | 'informative' | 'narrative';
}

const CONTRACTIONS: Record<string, string> = {
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "can't": 'cannot',
  "won't": 'will not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "haven't": 'have not',
  "hasn't": 'has not',
  "hadn't": 'had not',
  "shouldn't": 'should not',
  "wouldn't": 'would not',
  "couldn't": 'could not',
  "it's": 'it is',
  "that's": 'that is',
  "there's": 'there is',
  "they're": 'they are',
  "we're": 'we are',
  "you're": 'you are',
  "i'm": 'I am',
  "i've": 'I have',
  "we've": 'we have',
  "they've": 'they have',
  "i'll": 'I will',
  "we'll": 'we will',
  "they'll": 'they will',
  "it'll": 'it will',
  "let's": 'let us',
  "what's": 'what is',
  "who's": 'who is',
};

const INFORMAL: Record<string, string | null> = {
  kids: 'children',
  kid: 'child',
  gonna: 'going to',
  wanna: 'want to',
  gotta: 'have to',
  kinda: 'somewhat',
  sorta: 'somewhat',
  stuff: null,
  awesome: 'excellent',
  totally: 'completely',
  okay: 'acceptable',
  ok: 'acceptable',
  guys: 'people',
  'a lot of': 'many',
  'lots of': 'many',
  'a bunch of': 'several',
  basically: null,
  'pretty much': 'mostly',
  super: 'very',
  dumb: 'unwise',
  crazy: 'surprising',
};

const WORDY: Record<string, string> = {
  'in order to': 'to',
  'due to the fact that': 'because',
  'because of the fact that': 'because',
  'owing to the fact that': 'because',
  'at this point in time': 'now',
  'at the present time': 'now',
  'in the event that': 'if',
  'the reason why is because': 'because',
  'the reason is because': 'because',
  'the reason why is that': 'because',
  'each and every': 'every',
  'has the ability to': 'can',
  'have the ability to': 'can',
  'a large number of': 'many',
  'a great number of': 'many',
  'in spite of the fact that': 'although',
  'despite the fact that': 'although',
  'for the purpose of': 'for',
  'it is important to note that': '',
  'needless to say': '',
  'in today’s society': 'today',
  "in today's society": 'today',
  'first and foremost': 'first',
  'end result': 'result',
  'past history': 'history',
  'true fact': 'fact',
  'free gift': 'gift',
  'very unique': 'unique',
  'whether or not': 'whether',
  'in my personal opinion': '',
  'at all times': 'always',
  'on a daily basis': 'daily',
};

const VAGUE: Record<string, string> = {
  good: 'helpful, valuable, effective or healthy',
  bad: 'harmful, unfair, dangerous or costly',
  nice: 'kind, pleasant, welcoming or comfortable',
  thing: 'the exact object or idea',
  things: 'the exact objects or ideas',
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const phrase = (keys: string[]) =>
  new RegExp(
    `(?<![\\p{L}'’])(?:${keys
      .toSorted((a, b) => b.length - a.length)
      .map((k) => escape(k).replace(/'/g, "['’]"))
      .join('|')})(?![\\p{L}'’])`,
    'giu',
  );
const CONTRACTION = phrase(Object.keys(CONTRACTIONS));
const INFORMAL_WORD = phrase(Object.keys(INFORMAL));
const WORDY_PHRASE = phrase(Object.keys(WORDY).filter((k) => !k.includes('’')));
const VAGUE_WORD = phrase(Object.keys(VAGUE));
/** "I think (that)…" or "In my opinion, …" at the start of a sentence or clause. */
const PERSONAL =
  /(?<![\p{L}])(?:i (?:think|believe|feel|guess)(?: that)?|in my opinion,?)(?![\p{L}])/giu;

const key = (s: string) => s.toLowerCase().replaceAll('’', "'");
/** Keep the capital when a fix replaces the first word of a sentence. */
const fitCase = (found: string, fix: string) =>
  /^[A-Z]/.test(found) && fix ? fix.charAt(0).toUpperCase() + fix.slice(1) : fix;

/** Formal style notes, in text order. Not counted as grammar mistakes. */
export function styleIssues(text: string, options: StyleOptions = {}): GrammarIssue[] {
  const quoted = quotedSpans(text).spans;
  const inQuote = (start: number) => quoted.some((q) => start > q.start && start < q.end);
  const issues: GrammarIssue[] = [];
  const add = (re: RegExp, make: (m: RegExpExecArray, span: Span) => GrammarIssue | null) => {
    for (const m of text.matchAll(re)) {
      if (inQuote(m.index)) continue;
      const span = { start: m.index, end: m.index + m[0].length, text: m[0] };
      const issue = make(m, span);
      if (issue) issues.push(issue);
    }
  };
  add(CONTRACTION, (m, span) => {
    const full = CONTRACTIONS[key(m[0])]!;
    return {
      kind: 'contraction',
      span,
      fix: fitCase(m[0], full),
      message: `Formal essays write contractions out in full: “${fitCase(m[0], full)}” instead of “${m[0]}”.`,
    };
  });
  add(INFORMAL_WORD, (m, span) => {
    const fix = INFORMAL[key(m[0])];
    return {
      kind: 'informal-word',
      span,
      ...(fix ? { fix: fitCase(m[0], fix) } : {}),
      message: fix
        ? `“${m[0]}” sounds like talking to a friend. In an essay, try “${fix}”.`
        : `“${m[0]}” is too casual and too vague for an essay. Name exactly what you mean.`,
    };
  });
  add(WORDY_PHRASE, (m, span) => {
    const fix = WORDY[key(m[0])] ?? '';
    return {
      kind: 'wordy-phrase',
      span,
      fix: fitCase(m[0], fix),
      message: fix
        ? `Say it in fewer words: “${fix}” instead of “${m[0]}”.`
        : `“${m[0]}” adds words but no meaning. Cut it and start with your point.`,
    };
  });
  add(VAGUE_WORD, (m, span) => ({
    kind: 'vague-word',
    span,
    message: `“${m[0]}” is vague. Choose a precise word: ${VAGUE[key(m[0])]}.`,
  }));
  if (options.type !== 'narrative') {
    add(PERSONAL, (m, span) => ({
      kind: 'personal-opinion',
      span,
      fix: '',
      message: `Your essay is already your opinion, so “${m[0].trim()}” isn’t needed. Cut it and state the point directly.`,
    }));
  }
  return issues.toSorted((a, b) => a.span.start - b.span.start);
}

/** Sentences of six or more words with no style notes count as formal sentences. */
export function styleHits(text: string): { feature: StyleFeature; span: Span }[] {
  const issues = styleIssues(text);
  return sentences(text)
    .filter(
      (s) =>
        s.text.trim().split(/\s+/).length >= 6 &&
        /[.!?]["'”’)]*\s*$/.test(s.text) &&
        !issues.some((i) => i.span.start >= s.start && i.span.start < s.end),
    )
    .map((s) => ({ feature: 'formal-sentence' as const, span: s }));
}
