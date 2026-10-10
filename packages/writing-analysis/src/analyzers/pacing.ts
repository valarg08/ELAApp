import { type Span, countWords, paragraphs, quotedSpans, sentences, words } from '../text.js';
import { MOOD_WORDS } from './mood.js';

/**
 * Pacing (Unit 4, DESIGN.md §10 "Pacing analyzer"): splits the story into parts and rates each one
 * slow / medium / fast from sentence length, action words, dialogue and exclamations. The most
 * intense part is taken as the climax, and its position is reported as a percentage of the story.
 */
export type Pace = 'slow' | 'medium' | 'fast';

export interface PacingSegment extends Span {
  pace: Pace;
  /** Higher = more intense (used to find the climax). */
  intensity: number;
  /** Where the part starts, as a percentage of the story (0–100). */
  at: number;
  words: number;
}

export interface PacingResult {
  segments: PacingSegment[];
  /** The most intense part, or null when the story is too short to tell. */
  peak: PacingSegment | null;
  /** True when every part has the same pace. */
  flat: boolean;
}

// prettier-ignore
const ACTION = new Set([
  'run', 'ran', 'race', 'grab', 'slam', 'crash', 'jump', 'dash', 'burst', 'scream', 'smash',
  'leap', 'leapt', 'dive', 'dove', 'sprint', 'duck', 'spin', 'spun', 'snatch', 'yank', 'shove',
  'tumble', 'explode', 'chase', 'flee', 'fled', 'kick', 'strike', 'struck', 'hurl', 'gasp',
  'shout', 'yell', 'rush', 'charge', 'fall', 'fell', 'trip', 'scramble', 'lunge', 'hit', 'punch',
  'throw', 'threw', 'catch', 'caught', 'bolt', 'swing', 'swung', 'roar', 'shatter', 'collapse',
  ...MOOD_WORDS.tense,
]);

function isAction(word: string): boolean {
  if (ACTION.has(word)) return true;
  for (const ending of ['ing', 'ed', 'es', 's', 'd']) {
    if (!word.endsWith(ending) || word.length - ending.length < 3) continue;
    const stem = word.slice(0, -ending.length);
    if (ACTION.has(stem) || ACTION.has(`${stem}e`) || ACTION.has(stem.slice(0, -1))) return true;
  }
  return false;
}

const MIN_WORDS = 60;
const MIN_SEGMENTS = 3;
const MAX_SEGMENTS = 6;

/** Paragraphs when there are enough; otherwise the sentences split into roughly equal parts. */
function parts(text: string): Span[] {
  const paras = paragraphs(text);
  if (paras.length >= MIN_SEGMENTS) return paras;
  const all = sentences(text);
  if (all.length < MIN_SEGMENTS) return [];
  const count = Math.min(MAX_SEGMENTS, Math.max(MIN_SEGMENTS, Math.round(all.length / 2)));
  const size = all.length / count;
  const out: Span[] = [];
  for (let i = 0; i < count; i++) {
    const group = all.slice(Math.round(i * size), Math.round((i + 1) * size));
    const first = group[0];
    const last = group.at(-1);
    if (!first || !last) continue;
    out.push({ start: first.start, end: last.end, text: text.slice(first.start, last.end) });
  }
  return out;
}

export function pacing(text: string): PacingResult {
  const total = text.length;
  const segs = countWords(text) >= MIN_WORDS ? parts(text) : [];
  if (segs.length < MIN_SEGMENTS) return { segments: [], peak: null, flat: false };
  const quotes = quotedSpans(text).spans;

  const segments = segs.map((s): PacingSegment => {
    const ws = words(text, s.start, s.end);
    const n = Math.max(1, ws.length);
    const sents = sentences(s.text);
    const avg = n / Math.max(1, sents.length);
    const actionPer10 = (ws.filter((w) => isAction(w.lower)).length / n) * 10;
    const quoted = quotes
      .filter((q) => q.start < s.end && q.end > s.start)
      .reduce((sum, q) => sum + countWords(q.text), 0);
    const exclaim = /[!?]/.test(s.text) ? 0.5 : 0;
    const lengthScore = avg <= 7 ? 2 : avg <= 12 ? 1.25 : avg <= 18 ? 0.5 : 0;
    const score =
      lengthScore + Math.min(1.5, actionPer10 * 0.75) + exclaim + (quoted / n > 0.3 ? 0.5 : 0);
    const pace: Pace = score >= 2.5 ? 'fast' : score >= 1.25 ? 'medium' : 'slow';
    return {
      ...s,
      pace,
      intensity: score + actionPer10 * 0.25,
      at: Math.round((s.start / Math.max(1, total)) * 100),
      words: ws.length,
    };
  });

  const peak = segments.reduce((best, s) => (s.intensity > best.intensity ? s : best));
  const flat = segments.every((s) => s.pace === segments[0]?.pace);
  return { segments, peak, flat };
}
