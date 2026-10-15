import { type Span, type WordToken, quotedSpans } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { clauseCounts, structureSentences } from './structure.js';

/**
 * Sentence types and variety for the Essay Writing track (Unit 9, DESIGN.md §9.12): label each
 * sentence simple, compound, complex or compound-complex from its independent clauses (joined by
 * and/but/so… or a semicolon) and dependent clauses (because/when… or who/which/that), and point
 * out stringy "and… and… so…" sentences, runs of short choppy sentences, sentences too long to
 * follow, and runs of sentences that start the same way. Word lists and patterns, no parser: a
 * guide, never a rule.
 */

export const SENTENCE_TYPES = ['simple', 'compound', 'complex', 'compound-complex'] as const;
export type SentenceType = (typeof SENTENCE_TYPES)[number];

export const SENTENCE_TYPE_FEATURES = [
  'simple-sentence',
  'compound-sentence',
  'complex-sentence',
  'compound-complex-sentence',
] as const;
export type SentenceTypeFeature = (typeof SENTENCE_TYPE_FEATURES)[number];

export const SENTENCE_TYPE_FEATURE_LABELS: Record<SentenceTypeFeature, string> = {
  'simple-sentence': 'a simple sentence',
  'compound-sentence': 'a compound sentence',
  'complex-sentence': 'a complex sentence',
  'compound-complex-sentence': 'a compound-complex sentence',
};

export const SENTENCE_TYPE_FEATURE_EXAMPLES: Record<SentenceTypeFeature, string> = {
  'simple-sentence': 'one independent clause, like “The storm hit the coast.”',
  'compound-sentence':
    'two independent clauses joined by a comma and and/but/so, or a semicolon, like “The storm hit, but the town was ready.”',
  'complex-sentence':
    'an independent clause and a dependent clause, like “When the storm hit, the lights went out.”',
  'compound-complex-sentence':
    'two independent clauses and a dependent clause, like “When the storm hit, the lights went out, and we lit candles.”',
};

export const SENTENCE_TYPE_LABELS: Record<SentenceType, string> = {
  simple: 'Simple',
  compound: 'Compound',
  complex: 'Complex',
  'compound-complex': 'Compound-complex',
};

export interface TypedSentence {
  span: Span;
  /** Undefined for a fragment or a line without a verb. */
  type?: SentenceType;
  independent: number;
  dependent: number;
  words: number;
}

function typeOf(independent: number, dependent: number): SentenceType {
  if (independent >= 2) return dependent >= 1 ? 'compound-complex' : 'compound';
  return dependent >= 1 ? 'complex' : 'simple';
}

/** Every sentence with its type (quoted speech is still counted: it's part of the sentence). */
export function sentenceTypes(text: string): TypedSentence[] {
  return structureSentences(text).map(({ span, tokens }) => {
    const c = clauseCounts(text, tokens);
    const trimmed = { ...span, text: span.text.trimEnd() };
    trimmed.end = trimmed.start + trimmed.text.length;
    return {
      span: trimmed,
      type: c.complete ? typeOf(c.independent, c.dependent) : undefined,
      independent: c.independent,
      dependent: c.dependent,
      words: tokens.length,
    };
  });
}

export interface SentenceTypeHit {
  feature: SentenceTypeFeature;
  span: Span;
}

/** The type of one sentence, as a grammar feature. */
export function sentenceTypeHits(
  text: string,
  sentence: Span,
  tokens: readonly WordToken[],
): SentenceTypeHit[] {
  const c = clauseCounts(text, tokens);
  if (!c.complete || !tokens[0]) return [];
  const span: Span = { ...sentence, text: sentence.text.trimEnd() };
  span.end = span.start + span.text.length;
  return [{ feature: `${typeOf(c.independent, c.dependent)}-sentence`, span }];
}

// ───────── Variety and clarity ─────────

const SHORT = 7;
const TOO_LONG = 40;
/** Openers that don't make a run sound repetitive. */
const START_OK = new Set(['a', 'an', 'the']);

/**
 * Style notes, not mistakes (they stay out of `grammarIssues`): a stringy sentence (three or more
 * clauses strung on and/so), three short simple sentences in a row, a sentence over 40 words, and
 * three sentences in a row starting with the same word.
 */
export function varietyNotes(text: string): GrammarIssue[] {
  const notes: GrammarIssue[] = [];
  const { spans: quoted } = quotedSpans(text);
  const inSpeech = (s: Span) => quoted.some((q) => q.start <= s.start && q.end >= s.end);
  const list = structureSentences(text);
  const typed = sentenceTypes(text);
  const firstWords = list.map((s) => s.tokens[0]?.lower ?? '');

  typed.forEach((s, i) => {
    if (inSpeech(s.span)) return;
    const { joins } = clauseCounts(text, list[i]!.tokens);
    const strung = joins.filter((j) => j === 'and' || j === 'so').length;
    if (joins.length >= 2 && strung >= 2) {
      notes.push({
        kind: 'stringy-sentence',
        span: s.span,
        message: `This sentence strings ${joins.length + 1} ideas together with ${[...new Set(joins)].map((j) => `“${j}”`).join(' and ')}. Split it into two sentences, or turn one idea into a because, when or although clause.`,
      });
    } else if (s.words > TOO_LONG) {
      notes.push({
        kind: 'long-sentence',
        span: s.span,
        message: `This sentence has ${s.words} words, so the reader may lose track. Split it where one idea ends and the next begins.`,
      });
    }
  });

  // Three short simple sentences in a row (in the same paragraph).
  for (let i = 0; i + 2 < typed.length; i++) {
    const run = typed.slice(i, i + 3);
    const sameParagraph = !text.slice(run[0]!.span.start, run[2]!.span.end).includes('\n');
    if (sameParagraph && run.every((s) => s.type === 'simple' && s.words <= SHORT)) {
      notes.push({
        kind: 'choppy-sentences',
        span: {
          start: run[0]!.span.start,
          end: run[2]!.span.end,
          text: text.slice(run[0]!.span.start, run[2]!.span.end),
        },
        message:
          'Three short simple sentences in a row sound choppy. Combine two of them with and, but or so, with because or when, or with a who or which clause.',
      });
      i += 2;
    }
  }

  // Three sentences in a row that start with the same word.
  for (let i = 0; i + 2 < list.length; i++) {
    const w = firstWords[i]!;
    if (!w || START_OK.has(w) || firstWords[i + 1] !== w || firstWords[i + 2] !== w) continue;
    const t = list[i + 2]!.tokens[0]!;
    notes.push({
      kind: 'repeated-opener',
      span: { start: t.start, end: t.end, text: t.text },
      message: `Three sentences in a row start with “${list[i]!.tokens[0]!.text}”. Start one with an opener instead: a time phrase (After lunch, …), a dependent clause (When…, …) or an -ing phrase.`,
    });
    while (firstWords[i + 1] === w) i++;
  }

  return notes.toSorted((a, b) => a.span.start - b.span.start);
}
