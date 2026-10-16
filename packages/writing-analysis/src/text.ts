/**
 * Text helpers shared by the analyzers. All positions are UTF-16 offsets into the original text,
 * so the browser can select them in a textarea (`setSelectionRange`).
 */

export interface Span {
  start: number;
  end: number;
  text: string;
}

export interface WordToken extends Span {
  /** Lowercase, with curly apostrophes made straight ("don’t" → "don't"). */
  lower: string;
}

/** Words are runs of letters, digits and apostrophes/hyphens inside words ("don't", "well-known"). */
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

export function countWords(text: string): number {
  return text.match(WORD)?.length ?? 0;
}

export function words(text: string, from = 0, to = text.length): WordToken[] {
  const slice = text.slice(from, to);
  return [...slice.matchAll(WORD)].map((m) => ({
    text: m[0],
    lower: m[0].toLowerCase().replaceAll('’', "'"),
    start: from + m.index,
    end: from + m.index + m[0].length,
  }));
}

/**
 * Sentences end at . ! ? … (plus any closing quotes or brackets) or at a line break; a title
 * like “Dr.” or “Mrs.” before a name doesn't end one.
 */
const SENTENCE =
  /(?:(?:Mr|Mrs|Ms|Dr|Prof)\.(?=\s)|[^\s])(?:\b(?:Mr|Mrs|Ms|Dr|Prof)\.(?=\s)|[^.!?…\n])*(?:[.!?…]+["'”’)\]]*|(?=\n)|$)/gu;

export function sentences(text: string): Span[] {
  return [...text.matchAll(SENTENCE)]
    .map((m) => ({ start: m.index, end: m.index + m[0].length, text: m[0] }))
    .filter((s) => countWords(s.text) > 0);
}

/** Paragraphs are non-empty lines (students press Enter once or twice between paragraphs). */
export function paragraphs(text: string): Span[] {
  return [...text.matchAll(/[^\n]+/g)]
    .filter((m) => m[0].trim().length > 0)
    .map((m) => ({ start: m.index, end: m.index + m[0].length, text: m[0] }));
}

/**
 * Quoted speech, including the quotation marks. Handles curly (“ ”) and straight (") quotes.
 * A quote still open at the end of a paragraph is reported as unmatched.
 */
export function quotedSpans(text: string): { spans: Span[]; unmatched: number[] } {
  const spans: Span[] = [];
  const unmatched: number[] = [];
  let open: { at: number; mark: string } | null = null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]!;
    if (ch === '\n') {
      if (open) unmatched.push(open.at);
      open = null;
    } else if (ch === '“' || (ch === '"' && !open)) {
      if (open) unmatched.push(open.at);
      open = { at: i, mark: ch };
    } else if ((ch === '”' && open) || (ch === '"' && open?.mark === '"')) {
      spans.push({ start: open.at, end: i + 1, text: text.slice(open.at, i + 1) });
      open = null;
    } else if (ch === '”') {
      unmatched.push(i);
    }
  }
  if (open) unmatched.push(open.at);
  return { spans, unmatched };
}

export const inside = (pos: number, spans: readonly Span[]) =>
  spans.some((s) => pos >= s.start && pos < s.end);

/** Word tokens of the narration only (everything outside quoted speech). */
export function narrationWords(text: string): WordToken[] {
  const { spans } = quotedSpans(text);
  return words(text).filter((w) => !inside(w.start, spans));
}

/** The sentence containing a position. */
export function sentenceAt(all: readonly Span[], pos: number): Span | undefined {
  return all.find((s) => pos >= s.start && pos < s.end);
}

export const span = (text: string, start: number, end: number): Span => ({
  start,
  end,
  text: text.slice(start, end),
});
