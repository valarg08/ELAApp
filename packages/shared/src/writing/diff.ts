/**
 * Word-level text comparison for version history (DESIGN.md §5.4 diff) and the autosave snapshot
 * rule (§2.4: snapshot after 50 changed words).
 */

export type DiffSegmentType = 'same' | 'added' | 'removed';
export interface DiffSegment {
  type: DiffSegmentType;
  text: string;
}

/** Words, whitespace runs and single punctuation marks, so every character belongs to a token. */
const TOKEN = /\s+|[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;
const WORD = /[\p{L}\p{N}]/u;

const tokens = (text: string): string[] => text.match(TOKEN) ?? [];

/** Whitespace differences other than paragraph breaks don't count as changes. */
const key = (token: string) => (/^\s+$/.test(token) ? (token.includes('\n') ? '\n' : ' ') : token);

/** Above this many cells the middle section is shown as "replaced" instead of diffed in detail. */
const MAX_CELLS = 4_000_000;

/**
 * Compare two texts word by word. Common starts and ends are trimmed first (edits are usually in
 * one place), then the changed middle is diffed with a longest-common-subsequence table.
 */
export function diffWords(before: string, after: string): DiffSegment[] {
  const a = tokens(before);
  const b = tokens(after);
  let start = 0;
  while (start < a.length && start < b.length && key(a[start]!) === key(b[start]!)) start += 1;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && key(a[endA - 1]!) === key(b[endB - 1]!)) {
    endA -= 1;
    endB -= 1;
  }

  const out: DiffSegment[] = [];
  const push = (type: DiffSegmentType, text: string) => {
    const last = out.at(-1);
    if (last?.type === type) last.text += text;
    else if (text) out.push({ type, text });
  };

  // Shared tokens come from `after` so the result reads as the newer text.
  for (const t of b.slice(0, start)) push('same', t);
  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);
  for (const seg of diffMiddle(midA, midB)) push(seg.type, seg.text);
  for (const t of b.slice(endB)) push('same', t);
  return out;
}

function diffMiddle(a: string[], b: string[]): DiffSegment[] {
  if (a.length === 0) return b.map((text) => ({ type: 'added', text }));
  if (b.length === 0) return a.map((text) => ({ type: 'removed', text }));
  if ((a.length + 1) * (b.length + 1) > MAX_CELLS) {
    return [
      ...a.map((text): DiffSegment => ({ type: 'removed', text })),
      ...b.map((text): DiffSegment => ({ type: 'added', text })),
    ];
  }

  // lcs[i][j] = length of the longest common subsequence of a[i..] and b[j..].
  const cols = b.length + 1;
  const lcs = new Uint32Array((a.length + 1) * cols);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lcs[i * cols + j] =
        key(a[i]!) === key(b[j]!)
          ? lcs[(i + 1) * cols + j + 1]! + 1
          : Math.max(lcs[(i + 1) * cols + j]!, lcs[i * cols + j + 1]!);
    }
  }

  const out: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (key(a[i]!) === key(b[j]!)) {
      out.push({ type: 'same', text: b[j]! });
      i += 1;
      j += 1;
    } else if (lcs[(i + 1) * cols + j]! >= lcs[i * cols + j + 1]!) {
      out.push({ type: 'removed', text: a[i]! });
      i += 1;
    } else {
      out.push({ type: 'added', text: b[j]! });
      j += 1;
    }
  }
  for (; i < a.length; i += 1) out.push({ type: 'removed', text: a[i]! });
  for (; j < b.length; j += 1) out.push({ type: 'added', text: b[j]! });
  return out;
}

/** Number of words in the added and removed segments of a diff. */
export function diffStats(segments: readonly DiffSegment[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const s of segments) {
    if (s.type === 'same') continue;
    const words = tokens(s.text).filter((t) => WORD.test(t)).length;
    if (s.type === 'added') added += words;
    else removed += words;
  }
  return { added, removed };
}

/**
 * How many words differ between two texts, ignoring order: words added plus words removed
 * (case-insensitive). Cheap enough to run on every autosave.
 */
export function changedWordCount(before: string, after: string): number {
  const counts = new Map<string, number>();
  for (const t of tokens(before)) {
    if (WORD.test(t)) counts.set(t.toLowerCase(), (counts.get(t.toLowerCase()) ?? 0) + 1);
  }
  for (const t of tokens(after)) {
    if (WORD.test(t)) counts.set(t.toLowerCase(), (counts.get(t.toLowerCase()) ?? 0) - 1);
  }
  let changed = 0;
  for (const n of counts.values()) changed += Math.abs(n);
  return changed;
}
