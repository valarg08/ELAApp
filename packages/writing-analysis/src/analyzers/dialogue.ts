import { type Span, type WordToken, paragraphs, quotedSpans, span, words } from '../text.js';

/** Rules for punctuating dialogue (Unit 8, and any story with speech). */

const TAG_VERBS = new Set([
  'said',
  'says',
  'asked',
  'asks',
  'replied',
  'replies',
  'answered',
  'whispered',
  'whispers',
  'shouted',
  'shouts',
  'yelled',
  'yells',
  'cried',
  'called',
  'muttered',
  'mumbled',
  'screamed',
  'laughed',
  'sighed',
  'snapped',
  'added',
  'exclaimed',
  'explained',
  'begged',
  'demanded',
  'groaned',
  'grumbled',
  'hissed',
  'murmured',
  'sobbed',
  'stammered',
  'told',
]);
const PRONOUNS = new Set(['he', 'she', 'they', 'it', 'we', 'you', 'i']);

export type DialogueIssueType =
  | 'unmatched-quote'
  | 'missing-comma'
  | 'punctuation-outside'
  | 'capital-tag'
  | 'new-speaker-paragraph';

export interface DialogueIssue {
  type: DialogueIssueType;
  message: string;
  span: Span;
}

export interface DialogueResult {
  quotes: number;
  issues: DialogueIssue[];
}

/** The speech tag right after a quote ("she said", "said Mo"), if there is one. */
function tagAfter(text: string, end: number): { speaker: string; first: WordToken } | null {
  const next = words(text, end, Math.min(text.length, end + 40)).slice(0, 3);
  const [a, b] = next;
  if (!a) return null;
  // Only whitespace and punctuation between the quote and the tag.
  if (/[\p{L}\p{N}]/u.test(text.slice(end, a.start))) return null;
  if (TAG_VERBS.has(a.lower)) return { speaker: b?.lower ?? '', first: a };
  if (b && TAG_VERBS.has(b.lower)) return { speaker: a.lower, first: a };
  return null;
}

export function dialogue(text: string): DialogueResult {
  const { spans, unmatched } = quotedSpans(text);
  const issues: DialogueIssue[] = unmatched.map((at) => ({
    type: 'unmatched-quote',
    message: 'This quotation mark doesn’t have a partner. Speech needs marks at both ends.',
    span: span(text, at, at + 1),
  }));

  for (const q of spans) {
    const inner = q.text.slice(1, -1).trimEnd();
    const lastInside = inner.at(-1) ?? '';
    const after = text[q.end] ?? '';
    const tag = tagAfter(text, q.end);

    if ((after === ',' || after === '.') && !/[,.!?…—-]/.test(lastInside)) {
      issues.push({
        type: 'punctuation-outside',
        message: 'Put the comma or full stop inside the closing quotation mark.',
        span: span(text, q.start, q.end + 1),
      });
    } else if (tag && !/[,!?…—-]/.test(lastInside)) {
      issues.push({
        type: 'missing-comma',
        message: 'Add a comma inside the closing quotation mark before the speech tag.',
        span: span(text, q.start, tag.first.end),
      });
    }
    if (
      tag &&
      lastInside === ',' &&
      tag.first.text !== 'I' &&
      PRONOUNS.has(tag.first.lower) &&
      /^\p{Lu}/u.test(tag.first.text)
    ) {
      issues.push({
        type: 'capital-tag',
        message: `After a comma, the speech tag starts with a small letter: “${tag.first.text.toLowerCase()} …”.`,
        span: tag.first,
      });
    }
  }

  // Two different speakers in one paragraph.
  for (const p of paragraphs(text)) {
    const speakers = new Map<string, Span>();
    for (const q of spans) {
      if (q.start < p.start || q.end > p.end) continue;
      const tag = tagAfter(text, q.end);
      if (tag?.speaker && !speakers.has(tag.speaker)) speakers.set(tag.speaker, q);
    }
    const second = [...speakers.values()][1];
    if (second) {
      issues.push({
        type: 'new-speaker-paragraph',
        message: 'Start a new paragraph each time a different person speaks.',
        span: second,
      });
    }
  }

  return { quotes: spans.length, issues: issues.toSorted((a, b) => a.span.start - b.span.start) };
}
