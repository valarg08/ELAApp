import { type Span, countWords, sentenceAt, sentences, span, words } from '../text.js';

// ───────── Filter words ─────────

/** Words that put a filter between the reader and the scene, or add little ("very", "just"). */
export const FILTER_WORDS = [
  'felt',
  'feel',
  'feels',
  'saw',
  'see',
  'sees',
  'heard',
  'hear',
  'hears',
  'noticed',
  'notice',
  'notices',
  'realized',
  'realised',
  'wondered',
  'very',
  'really',
  'just',
  'quite',
  'suddenly',
] as const;
const FILTER_SET = new Set<string>(FILTER_WORDS);

export interface FilterWords {
  total: number;
  /** Filter words per 100 words. */
  per100: number;
  found: { word: string; count: number; spans: Span[] }[];
}

export function filterWords(text: string): FilterWords {
  const byWord = new Map<string, Span[]>();
  for (const w of words(text)) {
    if (FILTER_SET.has(w.lower)) byWord.set(w.lower, [...(byWord.get(w.lower) ?? []), w]);
  }
  const found = [...byWord.entries()]
    .map(([word, spans]) => ({ word, count: spans.length, spans }))
    .toSorted((a, b) => b.count - a.count);
  const total = found.reduce((n, f) => n + f.count, 0);
  const wordCount = countWords(text);
  return {
    total,
    per100: wordCount ? Math.round((total / wordCount) * 1000) / 10 : 0,
    found,
  };
}

// ───────── Telling (naming a feeling instead of showing it) ─────────

export const EMOTION_WORDS = [
  'afraid',
  'angry',
  'annoyed',
  'anxious',
  'ashamed',
  'bored',
  'calm',
  'cheerful',
  'confused',
  'curious',
  'depressed',
  'disappointed',
  'embarrassed',
  'excited',
  'frightened',
  'frustrated',
  'furious',
  'glad',
  'guilty',
  'happy',
  'hopeful',
  'jealous',
  'lonely',
  'mad',
  'miserable',
  'nervous',
  'proud',
  'relieved',
  'sad',
  'scared',
  'shocked',
  'shy',
  'surprised',
  'terrified',
  'thrilled',
  'tired',
  'unhappy',
  'upset',
  'worried',
] as const;
const EMOTIONS = new Set<string>(EMOTION_WORDS);
const LINKING = new Set([
  'felt',
  'feel',
  'feels',
  'feeling',
  'was',
  'were',
  'is',
  'am',
  'are',
  'seemed',
  'seems',
  'looked',
  'looks',
  'became',
  'becomes',
  'got',
  'gets',
  'grew',
]);
const INTENSIFIERS = new Set([
  'so',
  'very',
  'really',
  'extremely',
  'super',
  'too',
  'quite',
  'kind',
  'of',
  'a',
  'bit',
  'little',
  'totally',
]);

export interface TellingPhrase {
  /** e.g. "was so angry" */
  phrase: Span;
  emotion: string;
  sentence: Span;
}

/** Finds "was angry", "felt so nervous", "seemed really sad" and similar. */
export function telling(text: string): { phrases: TellingPhrase[] } {
  const tokens = words(text);
  const allSentences = sentences(text);
  const phrases: TellingPhrase[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    if (!LINKING.has(tokens[i]!.lower)) continue;
    let j = i + 1;
    while (j < tokens.length && j - i <= 3 && INTENSIFIERS.has(tokens[j]!.lower)) j += 1;
    const emotion = tokens[j];
    if (!emotion || !EMOTIONS.has(emotion.lower)) continue;
    const start = tokens[i]!.start;
    phrases.push({
      phrase: span(text, start, emotion.end),
      emotion: emotion.lower,
      sentence: sentenceAt(allSentences, start) ?? span(text, start, emotion.end),
    });
    i = j;
  }
  return { phrases };
}
