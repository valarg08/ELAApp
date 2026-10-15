import { type Span, type WordToken, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { verbForms, verbHits } from './verbs.js';

/**
 * Sentence structure for the Essay Writing track (Unit 7, DESIGN.md §9.12): find complete
 * sentences, compound subjects and predicates, and dependent and relative clauses; spot fragments
 * (no verb, an -ing or "which" group on its own), run-ons (two sentences with nothing between them)
 * and comma splices (two sentences joined by a comma). Word lists and patterns, no parser: a guide,
 * never a rule. Fragments that start with "because", "when"… are found by the connector checks.
 */

export const STRUCTURE_FEATURES = [
  'complete-sentence',
  'compound-subject',
  'compound-predicate',
  'dependent-clause',
  'relative-clause',
] as const;
export type StructureFeature = (typeof STRUCTURE_FEATURES)[number];

export const STRUCTURE_FEATURE_LABELS: Record<StructureFeature, string> = {
  'complete-sentence': 'a complete sentence',
  'compound-subject': 'a compound subject',
  'compound-predicate': 'a compound predicate',
  'dependent-clause': 'a dependent clause',
  'relative-clause': 'a relative clause',
};

export const STRUCTURE_FEATURE_EXAMPLES: Record<StructureFeature, string> = {
  'complete-sentence':
    'a subject and a verb that make sense on their own, like “The bus was late.”',
  'compound-subject': 'two subjects sharing one verb, like “Maya and Leo built a fort.”',
  'compound-predicate': 'one subject doing two things, like “The dog barked and ran away.”',
  'dependent-clause':
    'a clause that can’t stand alone, starting with because, when, although, who or which',
  'relative-clause':
    'a who, which or that clause that describes a noun, like “the girl who won” or “a book that I love”',
};

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const { BE, BE_CONTRACTED, HAVE, MODALS } = verbForms;

/** Subjects that start a second sentence after a comma or with nothing in between. */
const CLAUSE_SUBJECTS = set('i he she we they it you');
const DETERMINERS = set(
  'the a an my your our their his her its this that these those every each some',
);
/** Words that start a dependent clause or link clauses: no run-on after them. */
const LINKS =
  set(`and but or so nor yet for because since when whenever while if although though even
unless until till after before as than that which who whom whose where wherever whether once how what
why like then's`);
const SUBORDINATORS =
  set(`because since when whenever while if although though unless until till after
before as once whereas wherever whether`);
/** Verbs and adjectives that take a clause without "that" ("I think he’s right", "I’m glad you came"). */
const CLAUSE_TAKERS =
  set(`think thinks thought know knows knew say says said hope hoped hopes believe
believed guess guessed wish wished bet suppose supposed remember remembered forget forgot decided learned
learnt found find realized realised realize noticed notice saw see heard hear felt feel mean meant figured
promised told tell showed show sure glad afraid sorry worried happy surprised proud scared amazed
bet imagine imagined pretend pretended swear swore admit admitted expect expected doubt wonder wondered
let lets make makes made help helps helped watch watched`);
const ADVERBS = set(
  'always never just really also still often usually sometimes finally even only quickly slowly suddenly',
);
const TRANSITIONS = set(
  'however therefore then also besides instead otherwise meanwhile consequently',
);
const PREPOSITIONS =
  set(`in on at to from with without into onto of for by about under over above below
behind beside between among near across through during after before since until around inside outside`);
const INDEFINITE = set(
  'everything something anything nothing everyone someone anyone nobody all one ones thing things way time day reason',
);
/** Fragment starters: "Such as…", "For example…", "Like…", "Especially…". */
const EXAMPLE_STARTS = set('such especially including like');

const spanOf = (text: string, a: Span, b: Span = a): Span => ({
  start: a.start,
  end: b.end,
  text: text.slice(a.start, b.end),
});
const gap = (text: string, a: Span, b: Span) => text.slice(a.end, b.start);
const plainSpace = (text: string, a: Span, b: Span) => /^\s+$/.test(gap(text, a, b));
const isCapital = (t: WordToken) => /^\p{Lu}/u.test(t.text);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const QUOTE_MARK = /[“”"]/;
/** after/before/since… can start a phrase ("after lunch") or a clause ("after we ate"). */
const TIME_OPENER = /^(?:after|before|since|until|till|as)$/;

/** "Before a big match, I…": a comma comes before the opener's first verb, so it's a phrase. */
function phraseBeforeComma(
  text: string,
  tokens: readonly WordToken[],
  finite: ReadonlySet<number>,
  i: number,
): boolean {
  for (let k = i + 1; k < tokens.length; k++) {
    if (gap(text, tokens[k - 1]!, tokens[k]!).includes(',')) return true;
    if (finite.has(k)) return false;
  }
  return false;
}

/** Indexes of the words that are a finite verb (one that has a tense: was, ran, is eating, will go). */
function finiteVerbs(text: string, tokens: readonly WordToken[]): Set<number> {
  const at = new Map(tokens.map((t, i) => [t.start, i]));
  const found = new Set<number>();
  for (const h of verbHits(text, tokens)) {
    const i = at.get(h.span.start);
    if (i === undefined) continue;
    const w = tokens[i]!.lower;
    // "Tired from the game": an -ed word starting the sentence has no subject.
    if (i === 0 && verbForms.isRegularEd(w)) continue;
    // "in May" is a month, not a modal.
    if (i > 0 && MODALS.has(w) && tokens[i]!.text !== w) continue;
    if (h.feature === 'action-verb') {
      // "Running to the bus": an -ing word on its own leads nowhere.
      if (verbForms.isIng(w)) continue;
    } else if (
      !['helping-verb', 'linking-verb', 'past-tense', 'present-tense', 'future-tense'].includes(
        h.feature,
      )
    ) {
      continue;
    }
    found.add(i);
  }
  tokens.forEach((t, i) => {
    if (
      HAVE.has(t.lower) ||
      BE_CONTRACTED.has(t.lower) ||
      (BE.has(t.lower) && !/^(?:be|been|being)$/.test(t.lower)) ||
      /^(?:do|does|did|don't|doesn't|didn't)$/.test(t.lower) ||
      // "may" in "in May" is a month.
      (MODALS.has(t.lower) && i > 0 && t.text === t.lower)
    ) {
      found.add(i);
    }
  });
  return found;
}

/** "The flowers bloom in spring", "The sap drips into…": a verb the word lists don't know. */
function maybeUnknownVerb(tokens: readonly WordToken[]): boolean {
  return tokens.some((t, i) => {
    const prev = tokens[i - 1];
    if (!prev || i < 2 || !/^[a-z]+$/.test(t.text)) return false;
    if (DETERMINERS.has(prev.lower) || PREPOSITIONS.has(t.lower) || DETERMINERS.has(t.lower))
      return false;
    if (PREPOSITIONS.has(prev.lower) || /^(?:and|or|of)$/.test(prev.lower)) return false;
    // A plural noun then a bare word, or a noun then an -s word: "flowers bloom", "sap drips".
    const pluralThenBare = prev.lower.endsWith('s') && !t.lower.endsWith('s');
    const thenS = /^[a-z]{3,}s$/.test(t.lower) && !/(?:ss|us|is)$/.test(t.lower);
    return pluralThenBare || thenS;
  });
}

interface Sentence {
  span: Span;
  tokens: readonly WordToken[];
  finite: Set<number>;
}

/** "Mr. Diaz" doesn't end a sentence. */
const TITLE_END = /(?:^|\s)(?:Mr|Mrs|Ms|Mx|Dr|Prof|St)\.\s*$/;

function split(text: string): Sentence[] {
  const merged: Span[] = [];
  for (const s of sentences(text)) {
    const last = merged.at(-1);
    if (last && TITLE_END.test(last.text) && !text.slice(last.end, s.start).includes('\n')) {
      merged[merged.length - 1] = {
        start: last.start,
        end: s.end,
        text: text.slice(last.start, s.end),
      };
    } else {
      merged.push(s);
    }
  }
  return merged.map((s) => {
    const tokens = words(text, s.start, s.end);
    return { span: s, tokens, finite: finiteVerbs(text, tokens) };
  });
}

// ───────── Features ─────────

export interface StructureHit {
  feature: StructureFeature;
  span: Span;
}

/** Structure features in one sentence's words. */
export function structureHits(text: string, tokens: readonly WordToken[]): StructureHit[] {
  const hits: StructureHit[] = [];
  const finite = finiteVerbs(text, tokens);
  const first = tokens[0];
  if (!first || tokens.length < 2) return hits;
  const sentenceSpan = spanOf(text, first, tokens.at(-1));
  const fragment = fragmentIn(text, { span: sentenceSpan, tokens, finite });
  // "When I got home, I ate" is complete; "Because I was late." is not ("After lunch, we…" is a phrase).
  const second = tokens[1]!;
  const opensClause =
    SUBORDINATORS.has(first.lower) &&
    (!TIME_OPENER.test(first.lower) ||
      ((CLAUSE_SUBJECTS.has(second.lower) || DETERMINERS.has(second.lower)) &&
        !phraseBeforeComma(text, tokens, finite, 0)));
  if (finite.size > (opensClause ? 1 : 0) && !fragment) {
    hits.push({ feature: 'complete-sentence', span: sentenceSpan });
  }
  // The first finite verb, and the words in front of it (after an opening phrase and its comma).
  const v = Math.min(...finite);
  if (Number.isFinite(v)) {
    let from = 0;
    for (let k = v - 1; k > 0; k--) {
      if (gap(text, tokens[k - 1]!, tokens[k]!).includes(',')) {
        from = k;
        break;
      }
    }
    const subject = tokens.slice(from, v);
    const and = subject.findIndex((t, n) => n > 0 && /^(?:and|or)$/.test(t.lower));
    if (and > 0 && and < subject.length - 1 && !SUBORDINATORS.has(subject[0]!.lower)) {
      hits.push({ feature: 'compound-subject', span: spanOf(text, subject[0]!, subject.at(-1)) });
    }
    // One subject, two verbs: "barked and ran", "laughed but kept going".
    for (let k = v + 1; k < tokens.length - 1; k++) {
      if (!/^(?:and|or|but)$/.test(tokens[k]!.lower)) continue;
      let n = k + 1;
      while (tokens[n] && ADVERBS.has(tokens[n]!.lower)) n++;
      if (finite.has(n) && !CLAUSE_SUBJECTS.has(tokens[n]!.lower)) {
        hits.push({ feature: 'compound-predicate', span: spanOf(text, tokens[v]!, tokens[n]) });
        break;
      }
    }
  }
  // Dependent clauses: because/when… + a subject and verb, or a relative clause.
  tokens.forEach((t, i) => {
    const w = t.lower;
    const next = tokens[i + 1];
    if (!next) return;
    const verbSoon = [i + 1, i + 2, i + 3, i + 4].some((k) => finite.has(k));
    if (SUBORDINATORS.has(w) && verbSoon && !PREPOSITIONS.has(next.lower)) {
      // "after lunch" is a phrase; "after we ate" a clause.
      if (
        TIME_OPENER.test(w) &&
        ((!CLAUSE_SUBJECTS.has(next.lower) && !DETERMINERS.has(next.lower) && !isCapital(next)) ||
          phraseBeforeComma(text, tokens, finite, i))
      )
        return;
      hits.push({
        feature: 'dependent-clause',
        span: spanOf(text, t, tokens[Math.min(i + 3, tokens.length - 1)]),
      });
    }
    const prev = tokens[i - 1];
    // "the girl who won", "a book that I love" (not "I know that…", not a question's "Who").
    const relative =
      prev !== undefined &&
      (/^(?:who|which|whose|whom)$/.test(w) ||
        (w === 'that' &&
          !CLAUSE_TAKERS.has(prev.lower) &&
          (DETERMINERS.has(tokens[i - 2]?.lower ?? '') || INDEFINITE.has(prev.lower))));
    if (relative && !PREPOSITIONS.has(prev.lower) && verbSoon) {
      const end = tokens[Math.min(i + 3, tokens.length - 1)]!;
      hits.push({ feature: 'relative-clause', span: spanOf(text, t, end) });
      hits.push({ feature: 'dependent-clause', span: spanOf(text, t, end) });
    }
  });
  return hits;
}

// ───────── Mistakes ─────────

/** Why a sentence is a fragment, or undefined. */
function fragmentIn(text: string, s: Sentence): string | undefined {
  const { tokens, finite, span } = s;
  const first = tokens[0];
  if (!first || tokens.length < 3) return undefined;
  // Only finished sentences (a title or a list line has no end mark), never speech.
  if (!/[.!?]["”’)]*\s*$/.test(span.text) || span.text.trimEnd().endsWith('?')) return undefined;
  if (QUOTE_MARK.test(span.text)) return undefined;
  // "Because I was late." is the connector check's job.
  if (SUBORDINATORS.has(first.lower)) return undefined;
  // "Which made everyone laugh.": which/who + its verb, with nothing for it to describe.
  if (/^(?:which|who)$/.test(first.lower) && finite.has(1)) {
    return `“${first.text} …” on its own isn’t a sentence: it describes something in the sentence before. Join it to that sentence with a comma (“…, ${first.lower} …”).`;
  }
  if (finite.size > 0) return undefined;
  // "Thank you for reading." is a set phrase with an understood "I".
  if (/^(?:thank|thanks)$/.test(first.lower)) return undefined;
  if (
    EXAMPLE_STARTS.has(first.lower) ||
    (first.lower === 'for' && tokens[1]?.lower === 'example')
  ) {
    return `This group of words gives an example but has no subject and verb of its own. Join it to the sentence before it, or add a subject and a verb.`;
  }
  if (
    verbForms.isIng(first.lower) ||
    (verbForms.isRegularEd(first.lower) && !BE.has(first.lower))
  ) {
    return `This starts with “${first.text}” but has no subject doing it and no main verb. Add them (“I was ${first.lower} …”), or join it to the next sentence (“${first.text} …, I …”).`;
  }
  if (maybeUnknownVerb(tokens)) return undefined;
  // A noun group with phrases but no verb: "A big red dog in the yard."
  if (DETERMINERS.has(first.lower) || isCapital(first)) {
    return 'This group of words names something but doesn’t say what it does or is: there’s no verb. Add a verb (“… was in the yard”), or join it to another sentence.';
  }
  return undefined;
}

/** "I was tired I went to bed": a subject and verb straight after a finished clause. */
function runOnIn(text: string, s: Sentence): GrammarIssue | undefined {
  const { tokens, finite } = s;
  if (QUOTE_MARK.test(s.span.text) || !tokens[0] || SUBORDINATORS.has(tokens[0].lower))
    return undefined;
  for (let i = 2; i < tokens.length - 1; i++) {
    const t = tokens[i]!;
    const prev = tokens[i - 1]!;
    if (!CLAUSE_SUBJECTS.has(t.lower) || !plainSpace(text, prev, t)) continue;
    let v = i + 1;
    while (tokens[v] && ADVERBS.has(tokens[v]!.lower)) v++;
    if (!finite.has(v)) continue;
    if (LINKS.has(prev.lower) || CLAUSE_TAKERS.has(prev.lower) || PREPOSITIONS.has(prev.lower))
      continue;
    // Question order: "Why do you like…?", "How can we help?".
    if (
      /^(?:do|does|did|don't|doesn't|didn't|can|could|will|would|should|may|might|must|is|are|was|were|am|has|have|had)$/.test(
        prev.lower,
      )
    )
      continue;
    // "told him I was…", "made sure we had…".
    const prev2 = tokens[i - 2];
    if (prev2 && (CLAUSE_TAKERS.has(prev2.lower) || LINKS.has(prev2.lower)) && !finite.has(i - 1))
      continue;
    // The first part needs its own subject and verb, after any comma ("Sam, I think…").
    let from = 0;
    for (let k = i - 1; k > 0; k--) {
      if (/[,;:]/.test(gap(text, tokens[k - 1]!, tokens[k]!))) {
        from = k;
        break;
      }
    }
    const firstPart = [...finite].filter((k) => k >= from && k < i);
    if (firstPart.length === 0) continue;
    if (SUBORDINATORS.has(tokens[from]!.lower)) continue;
    // "I loved the book I read": a noun with a clause describing it. Only call it a run-on when the
    // second part is complete: be + something, or a verb + an object.
    const nounBefore =
      INDEFINITE.has(prev.lower) ||
      (DETERMINERS.has(tokens[i - 2]?.lower ?? '') && !finite.has(i - 1)) ||
      (DETERMINERS.has(tokens[i - 3]?.lower ?? '') && !finite.has(i - 1) && !finite.has(i - 2));
    if (nounBefore) {
      const verb = tokens[v]!.lower;
      const after = tokens[v + 1];
      const beLike =
        BE.has(verb) ||
        BE_CONTRACTED.has(verb) ||
        /^(?:seemed|looked|felt|tasted|smelled)$/.test(verb);
      const withObject =
        after !== undefined &&
        (DETERMINERS.has(after.lower) || /^(?:me|him|her|us|them|it)$/.test(after.lower));
      if (!(beLike && after) && !withObject) continue;
      // …and nothing else that needs a subject comes after: "the book I read was good".
      if ([...finite].some((k) => k > v + 1)) continue;
    }
    // Break before "then": "I ate lunch then I went out" → lunch. Then I…
    const breakAt = prev.lower === 'then' ? i - 1 : i;
    const before = tokens[breakAt - 1]!;
    const rest = tokens.slice(breakAt, i + 1);
    const restText = text.slice(rest[0]!.start, t.end);
    const fixed = `${before.text}. ${capitalize(restText)}`;
    return {
      kind: 'run-on',
      span: spanOf(text, before, t),
      fix: fixed,
      message: `Two sentences run together here with nothing between them. Split them with a full stop (“${fixed}”), or join them with a comma and a word like and, but or so.`,
    };
  }
  return undefined;
}

/** "I was tired, I went to bed": two sentences joined by only a comma. */
function spliceIn(text: string, s: Sentence): GrammarIssue | undefined {
  const { tokens, finite } = s;
  if (QUOTE_MARK.test(s.span.text) || !tokens[0]) return undefined;
  for (let i = 1; i < tokens.length - 1; i++) {
    const before = tokens[i - 1]!;
    let t = tokens[i]!;
    const g = gap(text, before, t);
    if (!/^,\s+$/.test(g)) continue;
    // "…, however, we…" / "…, however we…".
    let k = i;
    let transition: WordToken | undefined;
    if (TRANSITIONS.has(t.lower) && t.lower !== 'then') {
      transition = t;
      k = i + 1;
      t = tokens[k]!;
      if (!t) continue;
    }
    // The second part: a pronoun, a name or "the …" (up to two words), then a finite verb.
    let v = -1;
    if (CLAUSE_SUBJECTS.has(t.lower)) v = k + 1;
    else if (DETERMINERS.has(t.lower) || (isCapital(t) && !TRANSITIONS.has(t.lower))) {
      for (let n = k + 1; n <= k + 3 && tokens[n]; n++) {
        if (finite.has(n)) {
          v = n;
          break;
        }
        if (!plainSpace(text, tokens[n - 1]!, tokens[n]!)) break;
      }
    }
    while (v > 0 && tokens[v] && ADVERBS.has(tokens[v]!.lower)) v++;
    if (v < 0 || !finite.has(v)) continue;
    // The first part (since the sentence start or the last comma) needs its own subject and verb.
    let from = 0;
    for (let n = i - 1; n > 0; n--) {
      if (/[,;:]/.test(gap(text, tokens[n - 1]!, tokens[n]!))) {
        from = n;
        break;
      }
    }
    const lead = tokens[from]!;
    if (SUBORDINATORS.has(lead.lower) || LINKS.has(lead.lower) || verbForms.isIng(lead.lower))
      continue;
    // "When I got home, I ate": an opening clause anywhere before.
    if (tokens.slice(0, i).some((x) => SUBORDINATORS.has(x.lower) && x.lower !== 'as')) continue;
    if (![...finite].some((n) => n >= from && n < i)) continue;
    if (/^(?:said|says|asked|replied|thinks|think)$/.test(before.lower)) continue;
    if (transition) {
      const fix = `${before.text}; ${transition.text.toLowerCase()},`;
      return {
        kind: 'comma-splice',
        span: spanOf(text, before, transition),
        fix,
        message: `“${transition.text}” can’t join two sentences with just a comma. Use a semicolon before it and a comma after it (“${fix} …”), or start a new sentence.`,
      };
    }
    const fix = `${before.text}. ${t.text === 'I' ? 'I' : capitalize(t.text)}`;
    return {
      kind: 'comma-splice',
      span: spanOf(text, before, t),
      fix,
      message: `A comma can’t join two complete sentences on its own (a comma splice). Use a full stop (“${fix}”), a semicolon, or a comma + and, but or so.`,
    };
  }
  return undefined;
}

/** Structure mistakes: fragments, run-ons and comma splices. */
export function findStructureIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const s of split(text)) {
    const why = fragmentIn(text, s);
    if (why) {
      const span = { ...s.span, text: s.span.text.trimEnd() };
      span.end = span.start + span.text.length;
      issues.push({ kind: 'fragment', span, message: why });
      continue;
    }
    const runOn = runOnIn(text, s);
    if (runOn) issues.push(runOn);
    const splice = spliceIn(text, s);
    if (splice) issues.push(splice);
  }
  return issues;
}

// ───────── Clauses (for sentence types) ─────────

export interface ClauseCounts {
  /** Clauses that could stand alone, joined by and/but/so… or a semicolon. */
  independent: number;
  /** because/when/if… clauses and who/which/that clauses. */
  dependent: number;
  /** A subject and a verb, and not a fragment. */
  complete: boolean;
  /** The words that join independent clauses (and, but, ;…), in order. */
  joins: string[];
}

const FANBOYS = set('and but or so yet nor for');

/** How many independent and dependent clauses one sentence has. */
export function clauseCounts(text: string, tokens: readonly WordToken[]): ClauseCounts {
  const finite = finiteVerbs(text, tokens);
  const first = tokens[0];
  if (!first || finite.size === 0) {
    return { independent: 0, dependent: 0, complete: false, joins: [] };
  }
  const span = spanOf(text, first, tokens.at(-1));
  const complete =
    !fragmentIn(text, { span, tokens, finite }) &&
    structureHits(text, tokens).some((h) => h.feature === 'complete-sentence');
  const dependent = structureHits(text, tokens).filter(
    (h) => h.feature === 'dependent-clause',
  ).length;
  const joins: string[] = [];
  for (let k = 1; k < tokens.length - 1; k++) {
    const t = tokens[k]!;
    const before = gap(text, tokens[k - 1]!, t);
    const semicolon = before.includes(';');
    const fanboys =
      FANBOYS.has(t.lower) &&
      (t.lower !== 'for' || before.includes(',')) &&
      !(t.lower === 'so' && tokens[k + 1]?.lower === 'that');
    if (!semicolon && !fanboys) continue;
    // A verb must come before the join, inside this sentence.
    if (![...finite].some((f) => f < k)) continue;
    // The subject of the new clause: skip the joining word, then a transition ("; however, we").
    let s = fanboys ? k + 1 : k;
    while (tokens[s] && (TRANSITIONS.has(tokens[s]!.lower) || ADVERBS.has(tokens[s]!.lower))) s++;
    const subject = tokens[s];
    // "barked and ran": a verb straight after "and" shares the subject (a compound predicate).
    if (!subject || finite.has(s) || SUBORDINATORS.has(subject.lower)) continue;
    let v = s + 1;
    while (v < tokens.length && v <= s + 4 && !finite.has(v)) {
      if (
        PREPOSITIONS.has(tokens[v]!.lower) ||
        /^(?:and|or|who|which|that)$/.test(tokens[v]!.lower)
      )
        break;
      v++;
    }
    if (!finite.has(v)) continue;
    joins.push(semicolon ? ';' : t.lower);
  }
  return { independent: 1 + joins.length, dependent, complete, joins };
}

/** Sentences with their words ("Mr. Diaz" kept together), for other analyzers. */
export const structureSentences = (text: string): { span: Span; tokens: readonly WordToken[] }[] =>
  split(text).map(({ span, tokens }) => ({ span, tokens }));
