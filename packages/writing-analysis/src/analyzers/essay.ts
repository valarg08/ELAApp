import { type Span, paragraphs, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';

/**
 * Essay structure for the Essay Writing track (Units 11–15, DESIGN.md §9.12): find the
 * introduction, body paragraphs and conclusion; the hook and the thesis (a claim, an informative
 * focus or a narrative focus) and what kind they are; each body paragraph's topic sentence and
 * whether it links to the thesis; counterclaims and rebuttals; and whether the conclusion echoes
 * the thesis and ends with a final thought. An outline written as labelled lines ("Thesis: …") is
 * read the same way. Word lists and positions, no parser: a guide, never a rule.
 */

export const ESSAY_TYPES = ['argumentative', 'informative', 'narrative'] as const;
export type EssayType = (typeof ESSAY_TYPES)[number];

export const ESSAY_TYPE_LABELS: Record<EssayType, string> = {
  argumentative: 'Argumentative',
  informative: 'Informative',
  narrative: 'Narrative',
};

// ───────── Thesis ─────────

export const THESIS_KINDS = [
  'claim',
  'focus',
  'opinion',
  'fact',
  'announcement',
  'question',
] as const;
export type ThesisKind = (typeof THESIS_KINDS)[number];

export const THESIS_KIND_LABELS: Record<ThesisKind, string> = {
  claim: 'Claim',
  focus: 'Focus',
  opinion: 'Opinion',
  fact: 'Fact',
  announcement: 'Announcement',
  question: 'Question',
};

const ANNOUNCE =
  /^(?:in this (?:essay|paper|report)|this (?:essay|paper|report) (?:is|will)|i (?:am|'m) going to (?:tell|write|explain|talk|show)|i will (?:tell|write|explain|talk|show)|my essay|today i (?:will|am going to)|hi|hello)\b/;
/** Personal taste, with nothing to argue: "I love pizza.", "Summer is the best." */
const TASTE =
  /\b(?:tastiest|yummiest|prettiest|nicest|coolest|cutest|funniest|loveliest|most beautiful|most delicious)\b|^(?:i (?:think|believe|feel) (?:that )?)?(?:i (?:like|love|hate|enjoy|prefer)|my favou?rite)\b|\b(?:is|are|was) (?:so |really |very )?(?:cool|awesome|boring|fun|great|nice|amazing|the best|the worst|terrible|gross|yummy|delicious)[.!]?$/;
/** Words that make a sentence arguable. */
const CLAIM =
  /\b(?:should|must|ought|need|needs|need to|needs to|have to|has to|deserve|deserves|better|worse|best|worst|more important|most important|essential|necessary|unfair|harmful|dangerous|valuable|beneficial|benefit|benefits|improve|improves|ban|banned|allow|allowed|require|required|outweigh|outweighs|waste|worth|more harm|more good|than good|than harm|too much|too many|too little)\b/;
/** Words that set up an informative essay: ways, causes, effects, steps, how, why… */
const FOCUS =
  /\b(?:(?:several|three|two|four|five|many|important|key|main|different)(?: [a-z]+)? (?:ways|reasons|causes|effects|steps|types|kinds|benefits|parts|stages|factors|problems|changes|lessons|machines|skills|jobs)|affects?|causes?|leads? to|changed|changes|works (?:by|through|in)|how|why|because|helps?|plays? an? (?:important|key|big) role|is important)\b/;
/** A narrative focus hints at what the story means: "the day I learned…". */
const NARRATIVE_FOCUS =
  /\b(?:taught me|learned|learnt|realized|realised|changed (?:my|the way|how)|never forget|would change|that was (?:when|the day)|the day (?:i|we|my)|showed me|discovered|understood)\b/;

const lowerOf = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replaceAll('’', "'")
    .replace(/^[“"'(]+/, '');

/** What kind of sentence a thesis is: an arguable claim, an informative focus, or not yet a thesis. */
export function thesisKind(sentence: string, type?: EssayType): ThesisKind {
  const s = lowerOf(sentence);
  if (ANNOUNCE.test(s)) return 'announcement';
  if (s.endsWith('?')) return 'question';
  if (type === 'narrative' && NARRATIVE_FOCUS.test(s)) return 'focus';
  if (TASTE.test(s) && !/\bbecause\b/.test(s)) return 'opinion';
  if (type === 'informative' && FOCUS.test(s)) return 'focus';
  if (CLAIM.test(s)) return 'claim';
  if (FOCUS.test(s)) return 'focus';
  if (/^i (?:think|believe|feel)\b/.test(s)) return 'opinion';
  return 'fact';
}

const isThesisKind = (k: ThesisKind) => k === 'claim' || k === 'focus';

// ───────── Hook ─────────

export const HOOK_KINDS = [
  'question',
  'statistic',
  'quote',
  'anecdote',
  'bold',
  'announcement',
  'plain',
] as const;
export type HookKind = (typeof HOOK_KINDS)[number];

export const HOOK_KIND_LABELS: Record<HookKind, string> = {
  question: 'Question or what-if',
  statistic: 'Surprising fact',
  quote: 'Quote',
  anecdote: 'Short story',
  bold: 'Bold statement',
  announcement: 'Announcement',
  plain: 'Plain start',
};

const ANECDOTE =
  /^(?:when i|when my|one (?:day|morning|afternoon|evening|night|summer|winter|spring|autumn|fall)|last (?:year|summer|winter|week|month|spring|autumn|fall|night|[a-z]+day)|yesterday|this (?:morning|afternoon|summer|year)|i (?:remember|still remember|will never forget|'ll never forget)|it was (?:a|the|late|early)|the (?:day|night|morning) (?:i|we|my))\b/;
const STATISTIC =
  /\d|%|\b(?:(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand) (?:hours|minutes|days|years|times|out of|in every|of every)|half|a third|a quarter|percent|per cent|half of|one in (?:two|three|four|five|ten)|millions?|billions?|thousands?|every (?:year|day|minute|second))\b/;

/** What kind of hook a first sentence is. */
export function hookKind(sentence: string): HookKind {
  const t = sentence.trim();
  const s = lowerOf(t);
  if (ANNOUNCE.test(s)) return 'announcement';
  if (s.endsWith('?') || /^(?:imagine|picture (?:this|yourself|a|an))\b/.test(s)) return 'question';
  if (/^[“"]/.test(t) || /[”"]\s*(?:said|wrote|says|writes)\b/.test(t)) return 'quote';
  if (ANECDOTE.test(s)) return 'anecdote';
  if (STATISTIC.test(s)) return 'statistic';
  const n = words(t).length;
  if (
    n <= 12 &&
    (t.endsWith('!') ||
      CLAIM.test(s) ||
      /\b(?:never|always|everyone|nobody|no one|every|broken|wrong|overrated|a myth|a lie|matters|everything|nothing)\b/.test(
        s,
      ))
  )
    return 'bold';
  return 'plain';
}

// ───────── Counterclaims ─────────

const COUNTER =
  /\b(?:some (?:people|students|parents|teachers|adults|critics|experts) (?:argue|say|think|believe|claim|feel|worry|might say|may say)|others? (?:argue|say|think|believe|claim|might say|may say|might argue|may argue)|critics|opponents|people who disagree|it is true that|admittedly|of course, some|one (?:could|might) argue|you (?:might|may|could) think|some may say|some might say)\b/;
const REBUTTAL =
  /^(?:however|but|even so|nevertheless|still|yet|this (?:ignores|overlooks|is not|isn't|misses)|that (?:ignores|overlooks|is not|isn't)|while (?:this|that)|although (?:this|that)|in fact|the truth is|on the contrary)\b/;
/** "Although some people say…, …" answers itself in one sentence. */
const SELF_ANSWERED = /^(?:although|while|even though|though) /;

// ───────── Evidence and time order ─────────

const EXAMPLE =
  /^(?:for example|for instance|one example|another example|take)\b|\b(?:such as|for example|for instance|like when)\b/;
const SOURCE =
  /\b(?:according to|said|says|wrote|writes|explains|reported|found that|shows that|a study|research|survey|scientists|experts|doctors)\b/;
/** Time words that order a narrative's events. */
const TIME_WORD =
  /^(?:first|at first|then|next|after(?: that)?|afterwards|later|soon|suddenly|finally|in the end|at last|meanwhile|the next (?:day|morning|week)|that (?:morning|night|afternoon|evening|day)|when|before|as soon as|by the time|minutes later|hours later|the moment)\b/i;

/** What kind of evidence a sentence gives: a quote (with its source), a fact or number, or an example. */
export function evidenceKind(sentence: string): EvidenceKind | null {
  const t = sentence.trim();
  const s = lowerOf(t);
  if (/[“"][^”"]{8,}[”"]/.test(t) && SOURCE.test(s)) return 'quote';
  if (STATISTIC.test(s) || /^(?:according to|a study|one study|research|a survey)\b/.test(s))
    return 'fact';
  if (EXAMPLE.test(s)) return 'example';
  return null;
}

// ───────── Conclusion ─────────

const FINAL_THOUGHT =
  /\b(?:should|must|imagine|next time|remember|in the future|let's|let us|we (?:can|all|need)|it is time|it's time|only then|so the next time|from now on|the choice is|together)\b|\?$|!$/;
const REFLECTION =
  /\b(?:learned|learnt|taught me|realized|realised|now i|ever since|from that day|i will always|i still|showed me|changed me|understand now)\b/;

// ───────── Words for linking ─────────

const STOP = new Set(
  `a an the and or but so for nor yet of to in on at by with from into onto about as is are was were be been being
am do does did have has had this that these those it its they them their there here i me my we us our you your he
him his she her not no can could will would should must may might also very more most much many some any all each
every which who whom whose what when where why how than then because if while although though just only even too
one two three first second third finally another other others such own same both few lot lots thing things way ways
really make makes made get gets got go goes went like people`.split(/\s+/),
);

/** Content-word stems: "students" → "student", "helping" → "help". */
export function contentStems(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of words(text)) {
    if (w.lower.length < 3 || STOP.has(w.lower) || /^\d+$/.test(w.lower)) continue;
    out.add(stem(w.lower));
  }
  return out;
}

function stem(w: string): string {
  return w
    .replace(/'s$/, '')
    .replace(/(?:ies)$/, 'y')
    .replace(/(?:ing|ed|es|s|ly)$/, '')
    .replace(/e$/, '');
}

const overlap = (a: Set<string>, b: Set<string>) => [...a].filter((w) => b.has(w)).length;

// ───────── Outlines ─────────

export const OUTLINE_PARTS = [
  'hook',
  'thesis',
  'body',
  'evidence',
  'counterclaim',
  'rebuttal',
  'conclusion',
] as const;
export type OutlinePart = (typeof OUTLINE_PARTS)[number];

export const OUTLINE_PART_LABELS: Record<OutlinePart, string> = {
  hook: 'Hook',
  thesis: 'Thesis',
  body: 'Body paragraph',
  evidence: 'Evidence',
  counterclaim: 'Counterclaim',
  rebuttal: 'Rebuttal',
  conclusion: 'Conclusion',
};

const OUTLINE_LINE =
  /^\s*(?:[-*•]\s*)?(hook|thesis|focus|body(?: paragraph)?\s*\d?|reason\s*\d?|point\s*\d?|topic sentence\s*\d?|evidence\s*\d?|example\s*\d?|details?\s*\d?|counterclaim|counter-claim|rebuttal|conclusion|closing)\s*\d?\s*[:\-–—]\s*(.*)$/i;

export interface OutlineLine {
  part: OutlinePart;
  /** 1-based body paragraph this line belongs to (body and evidence lines). */
  body?: number;
  /** The words after the label. */
  span: Span;
}

/** Labelled outline lines ("Thesis: …", "Body 1: …", "Evidence: …"). */
export function outlineLines(text: string): OutlineLine[] {
  const out: OutlineLine[] = [];
  let body = 0;
  for (const line of text.matchAll(/[^\n]+/g)) {
    const m = OUTLINE_LINE.exec(line[0]);
    if (!m) continue;
    const label = m[1]!.toLowerCase();
    const content = m[2]!.trim();
    const start =
      line.index + line[0].length - m[2]!.length + (m[2]!.length - m[2]!.trimStart().length);
    const span = { start, end: start + content.length, text: content };
    let part: OutlinePart;
    if (label === 'hook') part = 'hook';
    else if (label === 'thesis' || label === 'focus') part = 'thesis';
    else if (/^(?:body|reason|point|topic)/.test(label)) {
      part = 'body';
      body++;
    } else if (/^(?:evidence|example|detail)/.test(label)) part = 'evidence';
    else if (label.startsWith('counter')) part = 'counterclaim';
    else if (label === 'rebuttal') part = 'rebuttal';
    else part = 'conclusion';
    out.push({
      part,
      ...(part === 'body' || part === 'evidence' ? { body: Math.max(body, 1) } : {}),
      span,
    });
  }
  return out;
}

/** An outline is two or more labelled lines. */
export const isOutline = (text: string) => outlineLines(text).length >= 2;

// ───────── Structure ─────────

export type EssayPart = 'introduction' | 'body' | 'conclusion';

export interface EssayParagraph {
  part: EssayPart;
  span: Span;
  /** Introduction: the first sentence when it isn't the thesis. */
  hook?: { span: Span; kind: HookKind };
  /** Introduction: the thesis sentence. */
  thesis?: { span: Span; kind: ThesisKind };
  /** Introduction: the sentences between the hook and the thesis. */
  background?: Span[];
  /** Introduction: sentences after the thesis. */
  afterThesis?: Span[];
  /** Body: the first sentence, and whether it shares a key word with the thesis. */
  topic?: { span: Span; linked: boolean | null };
  counterclaim?: Span;
  rebuttal?: Span;
  /** Conclusion: echoes the thesis (shares key words), copies it, ends with a final thought. */
  echoesThesis?: boolean;
  copiesThesis?: boolean;
  finalThought?: Span;
  /** Body: the first piece of evidence and its kind (not narratives). */
  evidence?: { span: Span; kind: EvidenceKind };
  /** Body (narratives): time words that show the order of events. */
  timeWords?: Span[];
}

export const EVIDENCE_KINDS = ['quote', 'fact', 'example'] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];
export const EVIDENCE_KIND_LABELS: Record<EvidenceKind, string> = {
  quote: 'Quote',
  fact: 'Fact or number',
  example: 'Example',
};

export interface EssayOptions {
  type?: EssayType;
  /** Argumentative essays that must answer the other side (Unit 13 on). */
  counterclaim?: boolean;
  /** Just one part of an essay (Unit 12 introductions, Unit 14 conclusions). */
  part?: EssayPartTask;
  /** The essay's thesis, given by a part task (body paragraphs and conclusions link back to it). */
  thesis?: string;
}

export const ESSAY_PART_TASKS = ['introduction', 'body', 'conclusion'] as const;
export type EssayPartTask = (typeof ESSAY_PART_TASKS)[number];

export interface EssayStructure {
  outline: boolean;
  paragraphs: EssayParagraph[];
  /** Outline lines, when the text is an outline. */
  lines: OutlineLine[];
  thesis?: { span: Span; kind: ThesisKind };
}

const trimSpan = (s: Span): Span => {
  const text = s.text.trim();
  const start = s.start + s.text.indexOf(text);
  return { start, end: start + text.length, text };
};

/** How well a sentence fits as the thesis of this kind of essay (0: not a thesis). */
function thesisFit(kind: ThesisKind, type?: EssayType): number {
  if (!isThesisKind(kind)) return 0;
  if (type === 'argumentative') return kind === 'claim' ? 2 : 1;
  if (type === 'informative' || type === 'narrative') return kind === 'focus' ? 2 : 1;
  return 2;
}

/**
 * Pick the thesis among the introduction's sentences: the best-fitting claim or focus, the last
 * one when several fit as well. The first sentence is usually the hook, so it is the thesis only
 * when nothing after it fits as well (then the sentences after it are out of place).
 */
function findThesis(list: Span[], type?: EssayType): { span: Span; kind: ThesisKind } | undefined {
  if (list.length === 0) return undefined;
  const kinds = list.map((s) => thesisKind(s.text, type));
  const fits = kinds.map((k) => thesisFit(k, type));
  const best = Math.max(...fits);
  if (best > 0) {
    const i = fits.findLastIndex((f) => f === best);
    return { span: list[i]!, kind: kinds[i]! };
  }
  const last = list.length - 1;
  return { span: list[last]!, kind: kinds[last]! };
}

/** The parts of an essay (or an outline). */
export function essayStructure(text: string, options: EssayOptions = {}): EssayStructure {
  const lines = outlineLines(text);
  if (lines.length >= 2) return outlineStructure(lines, options);
  const paras = paragraphs(text);
  const n = paras.length;
  const all = sentences(text).map(trimSpan);
  const result: EssayParagraph[] = paras.map((p, i) => ({
    part:
      options.part === 'body'
        ? 'body'
        : options.part === 'introduction'
          ? i === 0
            ? 'introduction'
            : 'body'
          : n >= 3
            ? i === 0
              ? 'introduction'
              : i === n - 1
                ? 'conclusion'
                : 'body'
            : i === 0 && n === 2
              ? 'introduction'
              : 'body',
    span: trimSpan(p),
  }));
  const inPara = (p: EssayParagraph) =>
    all.filter((s) => s.start >= p.span.start && s.start < p.span.end);
  let thesis: EssayStructure['thesis'];
  const intro = result.find((p) => p.part === 'introduction');
  if (intro) {
    const list = inPara(intro);
    thesis = findThesis(list, options.type);
    if (thesis) intro.thesis = thesis;
    const first = list[0];
    if (first && first.start !== thesis?.span.start)
      intro.hook = { span: first, kind: hookKind(first.text) };
    if (thesis) {
      intro.background = list.filter((s) => s.start > first!.start && s.start < thesis!.span.start);
      intro.afterThesis = list.filter((s) => s.start > thesis!.span.start);
    }
  }
  // Part tasks give the thesis; body paragraphs and conclusions link back to it.
  const linkText = thesis?.span.text ?? options.thesis;
  const thesisStems = linkText ? contentStems(linkText) : new Set<string>();
  const narrative = options.type === 'narrative';
  for (const p of result) {
    const list = inPara(p);
    if (p.part === 'body') {
      const first = list[0];
      if (first) {
        p.topic = {
          span: first,
          linked: linkText ? overlap(contentStems(first.text), thesisStems) > 0 : null,
        };
      }
      if (narrative) {
        p.timeWords = list.flatMap((x) => {
          const m = TIME_WORD.exec(x.text);
          return m
            ? [{ start: x.start + m.index, end: x.start + m.index + m[0].length, text: m[0] }]
            : [];
        });
      } else {
        const found = list
          .map((x) => ({ span: x, kind: evidenceKind(x.text) }))
          .find((x) => x.kind);
        if (found?.kind) p.evidence = { span: found.span, kind: found.kind };
      }
      list.forEach((s, i) => {
        const lower = lowerOf(s.text);
        if (!p.counterclaim && COUNTER.test(lower)) {
          p.counterclaim = s;
          if (SELF_ANSWERED.test(lower) && s.text.includes(',')) p.rebuttal = s;
          else {
            const answer = list.slice(i + 1).find((x) => REBUTTAL.test(lowerOf(x.text)));
            if (answer) p.rebuttal = answer;
          }
        }
      });
    }
    if (p.part === 'conclusion' && linkText) {
      const stems = contentStems(p.span.text);
      p.echoesThesis = overlap(stems, thesisStems) >= Math.min(2, thesisStems.size);
      p.copiesThesis = list.some((s) => normal(s.text) === normal(linkText));
    }
    if (p.part === 'conclusion') {
      const last = list.at(-1);
      const pattern = options.type === 'narrative' ? REFLECTION : FINAL_THOUGHT;
      const thought = list.toReversed().find((s) => pattern.test(lowerOf(s.text)));
      if (thought && last && list.indexOf(thought) >= list.length - 2) p.finalThought = thought;
    }
  }
  return { outline: false, paragraphs: result, lines: [], ...(thesis ? { thesis } : {}) };
}

const normal = (s: string) =>
  lowerOf(s)
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ');

function outlineStructure(lines: OutlineLine[], options: EssayOptions): EssayStructure {
  const thesisLine = lines.find((l) => l.part === 'thesis');
  const thesis = thesisLine
    ? { span: thesisLine.span, kind: thesisKind(thesisLine.span.text, options.type) }
    : undefined;
  const thesisStems = thesis ? contentStems(thesis.span.text) : new Set<string>();
  const paras: EssayParagraph[] = [];
  const hook = lines.find((l) => l.part === 'hook');
  if (hook || thesis) {
    paras.push({
      part: 'introduction',
      span: (hook ?? thesisLine)!.span,
      ...(hook ? { hook: { span: hook.span, kind: hookKind(hook.span.text) } } : {}),
      ...(thesis ? { thesis } : {}),
    });
  }
  for (const l of lines.filter((x) => x.part === 'body')) {
    paras.push({
      part: 'body',
      span: l.span,
      topic: {
        span: l.span,
        linked: thesis ? overlap(contentStems(l.span.text), thesisStems) > 0 : null,
      },
    });
  }
  const counter = lines.find((l) => l.part === 'counterclaim');
  if (counter) {
    const rebuttal = lines.find((l) => l.part === 'rebuttal');
    paras.push({
      part: 'body',
      span: counter.span,
      counterclaim: counter.span,
      ...(rebuttal ? { rebuttal: rebuttal.span } : {}),
    });
  }
  const conclusion = lines.find((l) => l.part === 'conclusion');
  if (conclusion) {
    paras.push({
      part: 'conclusion',
      span: conclusion.span,
      ...(thesis
        ? {
            echoesThesis: overlap(contentStems(conclusion.span.text), thesisStems) >= 1,
            copiesThesis: normal(conclusion.span.text) === normal(thesis.span.text),
          }
        : {}),
    });
  }
  return { outline: true, paragraphs: paras, lines, ...(thesis ? { thesis } : {}) };
}

// ───────── Features (sentence sets) ─────────

export const ESSAY_FEATURES = [
  'thesis-statement',
  'hook',
  'counterclaim',
  'rebuttal',
  'final-thought',
  'hook-question',
  'hook-fact',
  'hook-quote',
  'hook-story',
  'hook-bold',
  'fact-evidence',
  'example-evidence',
  'time-order',
] as const;
export type EssayFeature = (typeof ESSAY_FEATURES)[number];

export const ESSAY_FEATURE_LABELS: Record<EssayFeature, string> = {
  'thesis-statement': 'a thesis statement',
  hook: 'a hook',
  counterclaim: 'a counterclaim',
  rebuttal: 'a rebuttal',
  'final-thought': 'a final thought',
  'hook-question': 'a question hook',
  'hook-fact': 'a surprising-fact hook',
  'hook-quote': 'a quote hook',
  'hook-story': 'a short-story hook',
  'hook-bold': 'a bold-statement hook',
  'fact-evidence': 'a fact or number as evidence',
  'example-evidence': 'an example as evidence',
  'time-order': 'a time word',
};

export const ESSAY_FEATURE_EXAMPLES: Record<EssayFeature, string> = {
  'thesis-statement':
    'one sentence your essay will prove or explain, like “Schools should start later because teens need sleep, focus better and are safer on the roads.”',
  hook: 'an opening that grabs the reader: a question, a surprising fact, a quote, a short story or a bold statement',
  counterclaim:
    'the other side, in fair words, like “Some people argue that homework teaches responsibility.”',
  rebuttal:
    'your answer to the other side, like “However, a chore chart teaches responsibility without the stress.”',
  'final-thought':
    'a last idea to leave the reader with: a call to act, a look ahead or a question, like “Next time you…”',
  'hook-question': 'a question that makes the reader think, like “Have you ever…?” or “What if…?”',
  'hook-fact':
    'a surprising number or fact, like “Every year, millions of tons of plastic end up in the ocean.”',
  'hook-quote': 'someone’s words in quotation marks, with who said them',
  'hook-story':
    'a tiny true moment, like “When I was seven, I…”, “One morning…” or “I still remember…”',
  'hook-bold': 'a short, strong claim, like “Homework is broken.” or “Every minute counts!”',
  'fact-evidence':
    'a fact you could check, with a number or a source, like “According to the CDC, teens need 8 to 10 hours of sleep.”',
  'example-evidence':
    'a specific example, like “For example, our school’s garden club grew 40 kilos of vegetables last year.”',
  'time-order': 'a word that shows when, like First, Then, Suddenly, After that or Finally',
};

const HOOK_FEATURE: Record<Exclude<HookKind, 'plain' | 'announcement'>, EssayFeature> = {
  question: 'hook-question',
  statistic: 'hook-fact',
  quote: 'hook-quote',
  anecdote: 'hook-story',
  bold: 'hook-bold',
};

export interface EssayHit {
  feature: EssayFeature;
  span: Span;
}

/** Essay moves found in single sentences. */
export function essayHits(text: string): EssayHit[] {
  const hits: EssayHit[] = [];
  for (const raw of sentences(text)) {
    const s = trimSpan(raw);
    const lower = lowerOf(s.text);
    const kind = thesisKind(s.text);
    // A narrative focus ("That day taught me…") counts too.
    if ((isThesisKind(kind) || NARRATIVE_FOCUS.test(lower)) && words(s.text).length >= 6)
      hits.push({ feature: 'thesis-statement', span: s });
    const hook = hookKind(s.text);
    if (hook !== 'plain' && hook !== 'announcement') {
      hits.push({ feature: 'hook', span: s });
      hits.push({ feature: HOOK_FEATURE[hook], span: s });
    }
    if (COUNTER.test(lower)) hits.push({ feature: 'counterclaim', span: s });
    if (
      REBUTTAL.test(lower) ||
      (COUNTER.test(lower) && SELF_ANSWERED.test(lower) && s.text.includes(','))
    )
      hits.push({ feature: 'rebuttal', span: s });
    if (FINAL_THOUGHT.test(lower) || REFLECTION.test(lower))
      hits.push({ feature: 'final-thought', span: s });
    const evidence = evidenceKind(s.text);
    if (evidence === 'fact') hits.push({ feature: 'fact-evidence', span: s });
    if (evidence === 'example') hits.push({ feature: 'example-evidence', span: s });
    if (TIME_WORD.test(s.text.trim())) hits.push({ feature: 'time-order', span: s });
  }
  return hits;
}

// ───────── Notes ─────────

const THESIS_FIX: Partial<Record<ThesisKind, string>> = {
  fact: 'Your thesis is a fact, so there is nothing to prove. Make a claim someone could disagree with (… should …, because …) or say what you will explain (… in three ways).',
  opinion:
    'Your thesis is a personal taste. Turn it into a claim with reasons, like “Schools should … because …”.',
  announcement: 'Don’t announce your essay (“In this essay I will…”). Just state your main point.',
  question: 'A thesis answers a question; it doesn’t ask one. Save questions for your hook.',
};

/** Where a note points when the part it is about is missing. */
const at = (s?: Span): Span => s ?? { start: 0, end: 0, text: '' };

/**
 * Structure notes, not mistakes (they stay out of `grammarIssues`): too few paragraphs, no thesis
 * or a weak one, an announcement for a hook, a body paragraph that doesn't link to the thesis, a
 * missing or unanswered counterclaim, a conclusion that copies the thesis or doesn't echo it, and a
 * conclusion with no final thought. Outlines: missing parts.
 */
export function essayNotes(text: string, options: EssayOptions = {}): GrammarIssue[] {
  const notes: GrammarIssue[] = [];
  const e = essayStructure(text, options);
  const intro = e.paragraphs.find((p) => p.part === 'introduction');
  const bodies = e.paragraphs.filter((p) => p.part === 'body' && !p.counterclaim);
  const conclusion = e.paragraphs.find((p) => p.part === 'conclusion');
  const narrative = options.type === 'narrative';

  if (e.outline) {
    if (!e.thesis)
      notes.push({
        kind: 'no-thesis',
        span: at(e.lines[0]?.span),
        message: `Add a line “${narrative ? 'Focus' : 'Thesis'}: …” with the one sentence your essay will ${narrative ? 'show' : 'prove or explain'}.`,
      });
    if (bodies.length < 2)
      notes.push({
        kind: 'few-paragraphs',
        span: at(e.lines.at(-1)?.span),
        message:
          'Plan at least two body paragraphs: “Body 1: …”, “Body 2: …”, each with its own point.',
      });
    if (!conclusion)
      notes.push({
        kind: 'no-conclusion',
        span: at(e.lines.at(-1)?.span),
        message:
          'Add a line “Conclusion: …” with how you will sum up and the final thought you will leave.',
      });
  } else {
    const n = e.paragraphs.length;
    if (n > 0 && n < 3 && !options.part) {
      notes.push({
        kind: 'few-paragraphs',
        span: at(e.paragraphs.at(-1)?.span),
        message: `An essay has an introduction, body paragraphs and a conclusion, each its own paragraph (you have ${n}). Press Enter to start each new paragraph.`,
      });
    }
  }
  if (e.thesis && !isThesisKind(e.thesis.kind) && !(narrative && e.thesis.kind === 'fact')) {
    const fix = THESIS_FIX[e.thesis.kind];
    if (fix) notes.push({ kind: 'weak-thesis', span: e.thesis.span, message: fix });
  } else if (!e.outline && intro && !e.thesis) {
    notes.push({
      kind: 'no-thesis',
      span: intro.span,
      message:
        'End your introduction with a thesis: the one sentence your essay will prove or explain.',
    });
  }
  // Introductions: hook first, background next, thesis last.
  if (intro && e.thesis && !e.outline) {
    if (!intro.hook && options.part === 'introduction') {
      notes.push({
        kind: 'no-hook',
        span: e.thesis.span,
        message:
          'Open with a hook before your thesis: a question, a surprising fact, a quote, a short story or a bold statement.',
      });
    } else if (intro.hook && intro.background?.length === 0 && !narrative) {
      notes.push({
        kind: 'no-background',
        span: e.thesis.span,
        message:
          'Add one or two sentences of background between your hook and your thesis: what the reader needs to know about the topic.',
      });
    }
    const after = intro.afterThesis?.[0];
    if (after && isThesisKind(e.thesis.kind) && !narrative) {
      notes.push({
        kind: 'thesis-not-last',
        span: after,
        message:
          'End your introduction with your thesis, so it leads straight into your body paragraphs. Move this sentence before it, or into a body paragraph.',
      });
    }
  }
  if (intro?.hook?.kind === 'announcement') {
    notes.push({
      kind: 'plain-hook',
      span: intro.hook.span,
      message:
        'Start with a hook instead of an announcement: a question, a surprising fact, a quote, a short story or a bold statement.',
    });
  }
  for (const p of bodies) {
    if (p.topic && p.topic.linked === false && !narrative) {
      notes.push({
        kind: 'body-off-thesis',
        span: p.topic.span,
        message: e.outline
          ? 'Link this body point to your thesis: use a key word from it, so the reader sees which part of the thesis it proves.'
          : 'Link this body paragraph to your thesis: start with a topic sentence that uses a key word from it, so the reader sees which part of the thesis it proves.',
      });
    }
  }
  if (e.outline) {
    bodies.forEach((p, i) => {
      if (!e.lines.some((l) => l.part === 'evidence' && l.body === i + 1)) {
        notes.push({
          kind: 'no-evidence',
          span: p.span,
          message: `Add an “${narrative ? 'Details' : 'Evidence'}: …” line under Body ${i + 1}: ${narrative ? 'what you saw, heard and felt' : 'a fact, example or quote that proves it'}.`,
        });
      }
    });
  } else if (options.part === 'body' && !narrative) {
    for (const p of bodies) {
      if (!p.evidence) {
        notes.push({
          kind: 'no-evidence',
          span: p.span,
          message:
            'Back up your topic sentence with evidence: a fact or number, an example (“For example, …”) or a quote with its source.',
        });
      }
    }
  }
  for (const p of e.paragraphs) {
    if (p.counterclaim && !p.rebuttal) {
      notes.push({
        kind: 'unanswered-counterclaim',
        span: p.counterclaim,
        message:
          'Answer the other side: follow the counterclaim with a rebuttal that starts “However, …” and explains why your side is stronger.',
      });
    }
  }
  if (narrative && !e.outline) {
    for (const p of bodies) {
      if (p.timeWords?.length === 0 && sentences(p.span.text).length >= 3) {
        notes.push({
          kind: 'no-time-words',
          span: p.span,
          message:
            'Show the order of events with time words: First, Then, Suddenly, After that, Finally, That morning….',
        });
      }
    }
  }
  if (
    options.counterclaim &&
    !e.paragraphs.some((p) => p.counterclaim) &&
    (e.outline || e.paragraphs.length >= 3 || options.part === 'body')
  ) {
    notes.push({
      kind: 'no-counterclaim',
      span: at(bodies.at(-1)?.span ?? e.paragraphs.at(-1)?.span),
      message: e.outline
        ? 'Add “Counterclaim: …” and “Rebuttal: …” lines: what the other side says, and your answer.'
        : 'Add a counterclaim and a rebuttal: what the other side says (“Some people argue…”), then why you still disagree (“However, …”).',
    });
  }
  if (conclusion && e.thesis) {
    if (conclusion.copiesThesis) {
      notes.push({
        kind: 'copied-thesis',
        span: conclusion.span,
        message: 'Restate your thesis in new words instead of copying it.',
      });
    } else if (conclusion.echoesThesis === false && !narrative) {
      notes.push({
        kind: 'no-restatement',
        span: conclusion.span,
        message:
          'Start your conclusion by restating your thesis in new words, so the reader remembers your main point.',
      });
    }
  }
  if (conclusion && !e.outline && !conclusion.finalThought) {
    notes.push({
      kind: 'no-final-thought',
      span: conclusion.span,
      message: narrative
        ? 'End with what the experience taught you or how it changed you (I learned…, Ever since…).'
        : 'End with a final thought: a call to act, a look ahead or a question for the reader.',
    });
  }
  return notes;
}
