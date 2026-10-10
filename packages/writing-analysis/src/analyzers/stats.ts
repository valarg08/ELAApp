import { type Span, countWords, paragraphs, sentences, words } from '../text.js';

export interface WordStats {
  words: number;
  sentences: number;
  paragraphs: number;
  averageSentenceLength: number;
}

export function wordStats(text: string): WordStats {
  const all = sentences(text);
  const wordCount = countWords(text);
  return {
    words: wordCount,
    sentences: all.length,
    paragraphs: paragraphs(text).length,
    averageSentenceLength: all.length ? Math.round((wordCount / all.length) * 10) / 10 : 0,
  };
}

export interface RepeatedStart {
  word: string;
  count: number;
  /** The first word of each sentence that starts this way. */
  spans: Span[];
}

export interface SentenceVariety {
  total: number;
  /** ≤ 7 words */
  short: number;
  /** 8–19 words */
  medium: number;
  /** ≥ 20 words */
  long: number;
  /** Starting words used by 3+ sentences. */
  repeatedStarts: RepeatedStart[];
}

const SHORT_MAX = 7;
const LONG_MIN = 20;
/** Little words that often start sentences without sounding repetitive. */
const START_OK = new Set(['a', 'an', 'the']);

export function sentenceVariety(text: string): SentenceVariety {
  const result: SentenceVariety = { total: 0, short: 0, medium: 0, long: 0, repeatedStarts: [] };
  const starts = new Map<string, Span[]>();
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    result.total += 1;
    if (tokens.length <= SHORT_MAX) result.short += 1;
    else if (tokens.length >= LONG_MIN) result.long += 1;
    else result.medium += 1;
    const first = tokens[0];
    if (first && !START_OK.has(first.lower)) {
      starts.set(first.lower, [...(starts.get(first.lower) ?? []), first]);
    }
  }
  result.repeatedStarts = [...starts.entries()]
    .filter(([, spans]) => spans.length >= 3)
    .map(([word, spans]) => ({ word, count: spans.length, spans }))
    .toSorted((a, b) => b.count - a.count);
  return result;
}

export interface Readability {
  /** Flesch–Kincaid grade level. For teachers only; never shown to students as a score. */
  grade: number;
}

function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

export function readability(text: string): Readability {
  const tokens = words(text);
  const sentenceCount = sentences(text).length;
  if (tokens.length === 0 || sentenceCount === 0) return { grade: 0 };
  const syllableCount = tokens.reduce((n, t) => n + syllables(t.text), 0);
  const grade =
    0.39 * (tokens.length / sentenceCount) + 11.8 * (syllableCount / tokens.length) - 15.59;
  return { grade: Math.max(0, Math.round(grade * 10) / 10) };
}
