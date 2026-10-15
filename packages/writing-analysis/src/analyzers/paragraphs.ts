import { type Span, type WordToken, paragraphs } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { structureSentences } from './structure.js';

/**
 * Paragraph structure for the Essay Writing track (Unit 10, DESIGN.md §9.12): label each sentence
 * of a paragraph topic, evidence, explanation, closing or detail, find transitions, and point out a
 * paragraph that starts with evidence, has no evidence, leaves evidence unexplained, stops without
 * a closing sentence or has no transitions. Word lists and positions, no parser: a guide, never a
 * rule.
 */

export const PARAGRAPH_ROLES = ['topic', 'evidence', 'explanation', 'closing', 'detail'] as const;
export type ParagraphRole = (typeof PARAGRAPH_ROLES)[number];

export const PARAGRAPH_ROLE_LABELS: Record<ParagraphRole, string> = {
  topic: 'Topic sentence',
  evidence: 'Evidence',
  explanation: 'Explanation',
  closing: 'Closing sentence',
  detail: 'Supporting detail',
};

export const PARAGRAPH_FEATURES = [
  'topic-sentence',
  'evidence-sentence',
  'explanation-sentence',
  'transition',
  'closing-sentence',
] as const;
export type ParagraphFeature = (typeof PARAGRAPH_FEATURES)[number];

export const PARAGRAPH_FEATURE_LABELS: Record<ParagraphFeature, string> = {
  'topic-sentence': 'a topic sentence',
  'evidence-sentence': 'evidence (a fact, example or quote)',
  'explanation-sentence': 'an explanation of the evidence',
  transition: 'a transition',
  'closing-sentence': 'a closing sentence',
};

export const PARAGRAPH_FEATURE_EXAMPLES: Record<ParagraphFeature, string> = {
  'topic-sentence':
    'one sentence that states the main idea, like “School should start later for teenagers.”',
  'evidence-sentence':
    'a fact, number, example or quote, starting “For example,”, “According to…” or “One study found…”',
  'explanation-sentence':
    'what the evidence shows, starting “This shows that…”, “This means…” or “As a result,”',
  transition: 'a linking word or phrase at the start, like First, In addition, However or Finally',
  'closing-sentence':
    'a last sentence that sums up the idea, like “For these reasons, …” or “Overall, …”',
};

export interface ParagraphSentence {
  span: Span;
  role: ParagraphRole;
  /** 0-based paragraph number. */
  paragraph: number;
  /** The transition word or phrase the sentence starts with, if any. */
  transition?: Span;
}

const TRANSITION_PHRASES = [
  'first of all',
  'to begin with',
  'in addition',
  'on the other hand',
  'for example',
  'for instance',
  'as a result',
  'because of this',
  'in fact',
  'after that',
  'most importantly',
  'even so',
  'as well',
  'in conclusion',
  'in short',
  'in summary',
  'to sum up',
  'all in all',
  'for these reasons',
  'for this reason',
  'in the end',
  'on top of that',
  'not only that',
  'in other words',
  'to conclude',
  'that is why',
  "that's why",
  'this is why',
].map((p) => p.split(' '));
const TRANSITION_WORDS = new Set(
  `first firstly second secondly third thirdly next then also additionally furthermore moreover
another however therefore finally lastly overall meanwhile similarly likewise besides instead
consequently still ultimately clearly afterwards later thus hence`.split(/\s+/),
);
/** "Then we left" is a transition; "Then" alone in "Then." is not a sentence anyway. */
const NEEDS_COMMA = new Set(['still', 'clearly', 'later', 'thus', 'hence']);

const EVIDENCE_START =
  /^(?:for example|for instance|according to|in fact|research|studies|a (?:recent )?(?:study|survey|report)|one (?:study|survey|report)|statistics|data|scientists|experts|doctors|in the (?:text|article|story|book|poem)|the (?:author|article|text|graph|chart) (?:says|states|shows|explains))\b/;
const EVIDENCE_ANY =
  /\b(?:for example|for instance|such as|according to|a (?:recent )?(?:study|survey|report)|studies (?:show|found|suggest)|research (?:shows|found|suggests)|scientists|experts|statistics|percent|per cent)\b|\d|%|[“"]/;
const EXPLANATION =
  /\b(?:this (?:shows|means|proves|suggests|explains|matters|tells us|is (?:important|why|because))|that (?:shows|means|proves|is why)|these (?:facts|numbers|examples|details|results|findings) (?:show|prove|suggest|mean)|which (?:means|shows|proves)|in other words|as a result|because of this|this is why|that's why|so this)\b/;
/** A last sentence that adds another point ("Games also…", "Another reason…") doesn't close. */
const ADDS_POINT =
  /^(?:also|another|in addition|additionally|furthermore|moreover|first|firstly|second|secondly|third|next|plus|besides)\b|^\S+(?: \S+)? also\b/;
/** After evidence, "This…", "So…" or "It shows…" usually explain it. */
const EXPLAINS_AFTER_EVIDENCE = /^(?:this|that|these|those|so|because|it|without|with this)\b/;
const CLOSING =
  /^(?:in conclusion|overall|in short|in summary|to sum up|to conclude|all in all|in the end|ultimately|for these reasons|for this reason|that is why|that's why|this is why|clearly|in the long run)\b/;

function transitionIn(text: string, tokens: readonly WordToken[]): Span | undefined {
  const lower = tokens.map((t) => t.lower.replace(/’/g, "'"));
  for (const parts of TRANSITION_PHRASES) {
    if (tokens.length > parts.length && parts.every((p, k) => lower[k] === p)) {
      const end = tokens[parts.length - 1]!;
      return { start: tokens[0]!.start, end: end.end, text: text.slice(tokens[0]!.start, end.end) };
    }
  }
  const first = tokens[0];
  if (!first || tokens.length < 3 || !TRANSITION_WORDS.has(first.lower)) return undefined;
  // "Another reason is…" / "Another example…"; "Still, …" only with its comma.
  if (NEEDS_COMMA.has(first.lower) && !text.slice(first.end, first.end + 1).includes(','))
    return undefined;
  return first;
}

/** Sentence starts normalised for the marker patterns (curly apostrophes, no opening quote). */
const startOf = (s: string) =>
  s
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/^[“"'(\s]+/, '');

/** Every sentence of every paragraph with its role. */
export function paragraphRoles(text: string): ParagraphSentence[] {
  const paras = paragraphs(text);
  const all = structureSentences(text);
  const out: ParagraphSentence[] = [];
  paras.forEach((para, p) => {
    const list = all.filter((s) => s.span.start >= para.start && s.span.start < para.end);
    const n = list.length;
    const lowered = list.map((s) => startOf(s.span.text));
    const isEvidence = (i: number) =>
      EVIDENCE_START.test(lowered[i]!) ||
      (EVIDENCE_ANY.test(list[i]!.span.text) && !CLOSING.test(lowered[i]!));
    const roles: ParagraphRole[] = [];
    list.forEach((_, i) => {
      const s = lowered[i]!;
      const explains =
        EXPLANATION.test(s) || (roles[i - 1] === 'evidence' && EXPLAINS_AFTER_EVIDENCE.test(s));
      let role: ParagraphRole;
      if (i === 0) {
        role = EVIDENCE_START.test(s) ? 'evidence' : 'topic';
      } else if (i === n - 1 && n >= 3) {
        if (CLOSING.test(s)) role = 'closing';
        else if (isEvidence(i)) role = 'evidence';
        else if (explains && roles[i - 1] === 'evidence') role = 'explanation';
        else if (ADDS_POINT.test(s)) role = 'detail';
        else role = 'closing';
      } else if (isEvidence(i) && !EXPLANATION.test(s)) {
        role = 'evidence';
      } else if (explains) {
        role = 'explanation';
      } else {
        role = 'detail';
      }
      roles.push(role);
    });
    // "In addition, the library runs reading clubs." followed by "As a result, …" is evidence too.
    roles.forEach((role, i) => {
      if (role === 'detail' && i > 0 && EXPLANATION.test(lowered[i + 1] ?? '')) {
        roles[i] = 'evidence';
        if (roles[i + 1] === 'detail') roles[i + 1] = 'explanation';
      }
    });
    list.forEach((s, i) => {
      const span = { ...s.span, text: s.span.text.trimEnd() };
      span.end = span.start + span.text.length;
      const transition = transitionIn(text, s.tokens);
      out.push({ span, role: roles[i]!, paragraph: p, ...(transition ? { transition } : {}) });
    });
  });
  return out;
}

export interface ParagraphHit {
  feature: ParagraphFeature;
  span: Span;
}

/** Paragraph parts as grammar features (for sentence sets and the lesson focus). */
export function paragraphHits(text: string): ParagraphHit[] {
  const hits: ParagraphHit[] = [];
  for (const s of paragraphRoles(text)) {
    const lower = startOf(s.span.text);
    if (s.role === 'topic' && !CLOSING.test(lower) && !EXPLANATION.test(lower) && wordsIn(s) >= 5)
      hits.push({ feature: 'topic-sentence', span: s.span });
    // A number, a quote or "according to" is evidence wherever it sits (a sentence-set task).
    if (
      s.role === 'evidence' ||
      EVIDENCE_START.test(lower) ||
      (s.role !== 'closing' && EVIDENCE_ANY.test(s.span.text))
    )
      hits.push({ feature: 'evidence-sentence', span: s.span });
    if (s.role === 'explanation' || EXPLANATION.test(lower))
      hits.push({ feature: 'explanation-sentence', span: s.span });
    if (s.role === 'closing' || CLOSING.test(lower))
      hits.push({ feature: 'closing-sentence', span: s.span });
    if (s.transition) hits.push({ feature: 'transition', span: s.transition });
  }
  return hits;
}

const wordsIn = (s: ParagraphSentence) => s.span.text.split(/\s+/).filter(Boolean).length;

/**
 * Structure notes, not mistakes (they stay out of `grammarIssues`): a paragraph that starts with
 * evidence, has no evidence, leaves evidence unexplained, ends without a closing sentence, or has
 * five or more sentences and no transitions.
 */
export function paragraphNotes(text: string): GrammarIssue[] {
  const notes: GrammarIssue[] = [];
  const roles = paragraphRoles(text);
  const count = roles.reduce((max, s) => Math.max(max, s.paragraph + 1), 0);
  for (let p = 0; p < count; p++) {
    const list = roles.filter((s) => s.paragraph === p);
    const n = list.length;
    if (n < 3) continue;
    const first = list[0]!;
    if (first.role === 'evidence') {
      notes.push({
        kind: 'no-topic-sentence',
        span: first.span,
        message:
          'This paragraph starts with evidence. Start with a topic sentence that says your main idea, then give the example.',
      });
    }
    if (!list.some((s) => s.role === 'evidence')) {
      notes.push({
        kind: 'no-evidence',
        span: first.span,
        message:
          'This paragraph has no evidence yet. Add a fact, an example or a quote that supports your topic sentence (For example, …).',
      });
    }
    list.forEach((s, i) => {
      if (s.role !== 'evidence' || list[i + 1]?.role === 'evidence') return;
      const next = list[i + 1];
      if (next && (next.role === 'explanation' || EXPLANATION.test(startOf(next.span.text))))
        return;
      notes.push({
        kind: 'unexplained-evidence',
        span: s.span,
        message:
          'Explain this evidence: say what it shows and how it supports your point (This shows that…).',
      });
    });
    const last = list[n - 1]!;
    if (n >= 4 && last.role !== 'closing') {
      notes.push({
        kind: 'no-closing',
        span: last.span,
        message:
          'End with a closing sentence that sums up your main idea in new words (For these reasons, …).',
      });
    }
    if (n >= 5 && !list.some((s) => s.transition)) {
      notes.push({
        kind: 'no-transitions',
        span: list[1]!.span,
        message:
          'Link your sentences with transitions, like First, In addition, For example or As a result, so the reader can follow your ideas.',
      });
    }
  }
  return notes;
}
