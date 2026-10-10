/**
 * Anchor a model's quote to the student's text (DESIGN.md §8.2 step 7). Exact match first, then a
 * forgiving match (case, curly quotes, spacing, a trailing full stop). Unanchored items are dropped.
 */
export interface Anchor {
  start: number;
  end: number;
}

function normalize(text: string): { norm: string; map: number[] } {
  let norm = '';
  const map: number[] = [];
  let lastSpace = false;
  for (let i = 0; i < text.length; i += 1) {
    let ch = text[i]!;
    if (/\s/.test(ch)) {
      if (lastSpace) continue;
      ch = ' ';
      lastSpace = true;
    } else {
      lastSpace = false;
      if (ch === '’' || ch === '‘') ch = "'";
      else if (ch === '“' || ch === '”') ch = '"';
      else if (ch === '—' || ch === '–') ch = '-';
      ch = ch.toLowerCase();
    }
    norm += ch;
    map.push(i);
  }
  return { norm, map };
}

export function anchorQuote(text: string, quote: string | null | undefined): Anchor | null {
  const q = quote
    ?.trim()
    .replace(/^["“'‘]+|["”'’]+$/g, '')
    .trim();
  if (!q) return null;
  const exact = text.indexOf(q);
  if (exact >= 0) return { start: exact, end: exact + q.length };

  const { norm, map } = normalize(text);
  for (const candidate of [q, q.replace(/[.!?,;:]+$/, '')]) {
    const nq = normalize(candidate).norm.trim();
    if (nq.length < 3) continue;
    const at = norm.indexOf(nq);
    if (at >= 0) return { start: map[at]!, end: map[at + nq.length - 1]! + 1 };
  }
  return null;
}
