/** Split text into words and the bits between them, so words can be tappable buttons. */
export interface TextPart {
  text: string;
  /** Lowercase form used for matching, or null for spaces/punctuation. */
  word: string | null;
  index: number;
}

const WORD = /([\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*)/u;

export function splitWords(passage: string): TextPart[] {
  return passage
    .split(WORD)
    .filter((part) => part !== '')
    .map((text, index) => ({ text, word: WORD.test(text) ? text.toLowerCase() : null, index }));
}

/** Compare a set of tapped words with the expected ones (case-insensitive). */
export function scoreSelection(selected: Iterable<string>, targets: readonly string[]) {
  const want = new Set(targets.map((t) => t.toLowerCase()));
  const got = new Set([...selected].map((s) => s.toLowerCase()));
  const found = [...want].filter((w) => got.has(w));
  const extra = [...got].filter((w) => !want.has(w));
  return {
    found,
    extra,
    missed: [...want].filter((w) => !got.has(w)),
    correct: extra.length === 0 && found.length === want.size,
  };
}
