import { type Span, type WordToken, quotedSpans, sentences, words } from '../text.js';
import { TAG_VERBS, dialogue, tagAfter } from './dialogue.js';
import type { GrammarIssue } from './grammar.js';
import { verbForms } from './verbs.js';

/**
 * Direct and indirect (reported) speech for the Essay Writing track (Unit 6, DESIGN.md §9.12):
 * find quoted speech and where its tag sits, split quotes, reported statements, questions and
 * commands, and quotes used as evidence; spot speech punctuation slips, reported questions that
 * keep the question order, commands without "to", quotation marks after "said that", and verbs
 * and time words that usually shift in reported speech. Word lists and patterns, no parser:
 * a guide, never a rule.
 */

export const SPEECH_FEATURES = [
  'direct-speech',
  'tag-before',
  'tag-after',
  'split-quote',
  'reported-speech',
  'reported-question',
  'reported-command',
  'quoted-evidence',
] as const;
export type SpeechFeature = (typeof SPEECH_FEATURES)[number];

export const SPEECH_FEATURE_LABELS: Record<SpeechFeature, string> = {
  'direct-speech': 'direct speech in quotation marks',
  'tag-before': 'a speech tag before the quote',
  'tag-after': 'a speech tag after the quote',
  'split-quote': 'a quote split by its speech tag',
  'reported-speech': 'reported speech',
  'reported-question': 'a reported question',
  'reported-command': 'a reported command or request',
  'quoted-evidence': 'a quote used as evidence',
};

export const SPEECH_FEATURE_EXAMPLES: Record<SpeechFeature, string> = {
  'direct-speech': 'someone’s exact words in quotation marks, like “I’m ready,” said Ana',
  'tag-before': 'the tag, a comma, then the quote, like Ana said, “I’m ready.”',
  'tag-after': 'the quote, a comma inside the marks, then the tag, like “I’m ready,” Ana said',
  'split-quote': 'the tag in the middle, like “I’m ready,” said Ana, “so let’s go.”',
  'reported-speech':
    'what someone said without their exact words, like Ana said that she was ready',
  'reported-question':
    'asked if, whether or a question word, in statement order, like He asked where the bus was',
  'reported-command': 'told or asked someone to do something, like She told us to wait',
  'quoted-evidence':
    'a quote introduced with According to…, writes, states or explains, like The author writes, “…”',
};

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const { BASES, SAME_FORMS } = verbForms;

/** Verbs that report what someone said or thought. */
const REPORT =
  set(`said says say told tells tell explained explains replied replies answered answers
promised promises admitted admits claimed claims announced announces mentioned mentions complained
complains insisted insists agreed agrees whispered whispers shouted shouts yelled yells added adds
warned warns reminded reminds argued argues wrote writes thought thinks believed believes knew
decided decides informed informs assured assures reports reported states stated suggests suggested
shows showed notes noted finds found`);
/** Reporting verbs that take a person before the reported words ("told me that…"). */
const TELL = set(
  'told tells tell reminded reminds warned warns promised promises informed informs assured assures',
);
const ASK = set('asked asks ask wondered wonders inquired inquires');
/** Verbs that report a command or request: told/asked + someone + to… */
const COMMAND = set(`told tells tell asked asks ask ordered orders begged begs advised advises
instructed instructs encouraged encourages urged urges invited invites commanded commands warned warns
reminded reminds allowed allows`);
/** Present forms of reporting verbs: no backshift needed after them. */
const PRESENT_REPORT = set(`says say tells tell asks ask explains replies answers promises admits
claims announces mentions complains insists agrees whispers shouts yells adds warns reminds argues
writes thinks believes decides informs assures wonders inquires reports states suggests shows notes
finds`);
/** Verbs that bring in a quote as evidence in an essay. */
const EVIDENCE = set(`writes wrote states stated explains explained argues argued notes noted claims
claimed suggests suggested describes described reports reported observes observed calls called shows
showed adds added points points concludes concluded`);
const WH = set('what where when why who whom whose how which');
const SUBJECTS = set('i he she we they it you there');
const OBJECTS = set('me him her us them you');
const DETERMINERS = set('the a an my our your their his her its this that these those some');
const AUX = set(
  'is are was were am can could will would should shall may might must has have had do does did',
);
/** Verbs that move back a step in reported speech. */
const BACKSHIFT: Record<string, string> = {
  am: 'was',
  is: 'was',
  are: 'were',
  will: 'would',
  can: 'could',
  has: 'had',
  have: 'had',
  may: 'might',
  shall: 'should',
  "isn't": 'wasn’t',
  "aren't": 'weren’t',
  "won't": 'wouldn’t',
  "can't": 'couldn’t',
  "don't": 'didn’t',
  "doesn't": 'didn’t',
};
/** Time and place words that usually shift in reported speech. */
const TIME_SHIFT: Record<string, string> = {
  today: 'that day',
  tomorrow: 'the next day',
  yesterday: 'the day before',
  tonight: 'that night',
  now: 'then',
  here: 'there',
  ago: 'before',
};
const TIME_NOUNS = set(
  'morning afternoon evening week weekend month year summer winter spring fall',
);
const WEEKDAYS = set('monday tuesday wednesday thursday friday saturday sunday');
/** Verbs a command usually starts with ("told us sit" → to sit). */
const COMMAND_VERBS =
  set(`sit stand stop wait come go be clean bring take put open close look listen
run hurry finish turn write read try keep leave give help start get pick hand move follow stay call
check wash sweep line clear eat drink sleep raise walk share tidy fix wear pack`);
/** Words that start a continued quote: after “…,” said Mia, these stay small. */
const CONTINUING =
  set(`but and so or the a an it is was we they you he she this that then because if
when to of in on at for not just maybe there my your our their`);
/** Words that end a reported clause ("she was tired, so she left"). */
const CLAUSE_JOINS = set('and but so or then');

const spanOf = (text: string, a: Span, b: Span = a): Span => ({
  start: a.start,
  end: b.end,
  text: text.slice(a.start, b.end),
});
const gap = (text: string, a: Span, b: Span) => text.slice(a.end, b.start);
const plainSpace = (text: string, a: Span, b: Span) => /^\s+$/.test(gap(text, a, b));
const isCapital = (t: WordToken) => /^\p{Lu}/u.test(t.text);
const QUOTE_MARK = /[“”"]/;

// ───────── Direct speech ─────────

export interface QuoteInfo {
  span: Span;
  /** The tag before the quote ("Ana said,"), with the punctuation between them. */
  before?: { verb: WordToken; punct: string };
  /** The tag after the quote ("she said"). */
  after?: { first: WordToken };
  /** This quote carries on a sentence the quote before it started (“…,” said Ana, “so…”). */
  continues: boolean;
  /** This quote is the first part of a split quote. */
  splits: boolean;
  words: number;
}

/** The speech tag right before a quote ("Ana said, “"), if there is one. */
function tagBefore(text: string, start: number): QuoteInfo['before'] {
  const from = Math.max(0, start - 50);
  const back = words(text, from, start).slice(-3);
  const last = back.at(-1);
  if (!last) return undefined;
  const between = text.slice(last.end, start);
  if (!/^[ \t,:]*$/.test(between)) return undefined;
  // "Ana said," or "said Ana," or "the author writes:".
  const prev = back.at(-2);
  const verb = TAG_VERBS.has(last.lower)
    ? last
    : prev && TAG_VERBS.has(prev.lower) && isCapital(last) && plainSpace(text, prev, last)
      ? prev
      : undefined;
  if (!verb) return undefined;
  return { verb, punct: between.trim() };
}

/** The speaker in front of a tag verb ("Kai said", "the coach yelled"), or the verb itself. */
function speakerBefore(text: string, verb: WordToken): WordToken {
  const back = words(text, Math.max(0, verb.start - 30), verb.start);
  const who = back.at(-1);
  if (!who || !plainSpace(text, who, verb)) return verb;
  if (!isCapital(who) && !SUBJECTS.has(who.lower) && !OBJECTS.has(who.lower)) {
    const det = back.at(-2);
    return det && DETERMINERS.has(det.lower) && plainSpace(text, det, who) ? det : verb;
  }
  // "the coach", "Principal Cho".
  const det = back.at(-2);
  const joined = det !== undefined && plainSpace(text, det, who);
  return joined &&
    (/^(?:the|my|our|your|their|his|her)$/.test(det.lower) || (isCapital(det) && isCapital(who)))
    ? det
    : who;
}

/** Every quote in the text, with its tags. */
export function quotes(text: string): QuoteInfo[] {
  const { spans } = quotedSpans(text);
  const list: QuoteInfo[] = spans.map((q) => {
    const tag = tagAfter(text, q.end);
    return {
      span: q,
      before: tagBefore(text, q.start),
      after: tag ? { first: tag.first } : undefined,
      continues: false,
      splits: false,
      words: words(q.text).length,
    };
  });
  list.forEach((q, i) => {
    const next = list[i + 1];
    if (!next || !q.after) return;
    const between = text.slice(q.span.end, next.span.start);
    // “I know,” said Ana, “but…” or “I know,” said Ana. “Let’s go.”
    if (between.length <= 45 && !/[!?\n]/.test(between) && /[,.]\s*$/.test(between)) {
      q.splits = true;
      next.continues = between.trim().endsWith(',');
    }
  });
  return list;
}

/** Text from the start of the sentence (or line) to a position; "Dr. Ruiz" doesn't end a sentence. */
function leadIn(text: string, pos: number): string {
  const before = text.slice(0, pos);
  let from = before.lastIndexOf('\n') + 1;
  for (const m of before.matchAll(/[.!?]["”’)]*\s+/g)) {
    if (m.index + m[0].length <= from) continue;
    if (/(?:^|\s)(?:Dr|Mr|Mrs|Ms|Mx|Prof|St|Mt|Jr|Sr|[A-Z])$/.test(before.slice(0, m.index)))
      continue;
    from = m.index + m[0].length;
  }
  return before.slice(from);
}

function isEvidence(text: string, q: QuoteInfo): boolean {
  if (q.words < 2) return false;
  const lead = leadIn(text, q.span.start);
  if (/according to/i.test(lead) || /:\s*$/.test(lead)) return true;
  return words(lead).some((t) => EVIDENCE.has(t.lower));
}

// ───────── Reported speech ─────────

export interface ReportedClause {
  kind: 'statement' | 'question' | 'command';
  /** The reporting verb ("said", "asked", "told"). */
  verb: WordToken;
  past: boolean;
  /** The reported words: from "that" / "if" / the question word / "to" to the end of the clause. */
  tokens: WordToken[];
  span: Span;
}

/** A person after "told": me, Sam, the class, my little brother (up to three words). */
function objectEnd(tokens: readonly WordToken[], j: number): number {
  const t = tokens[j];
  if (!t) return -1;
  if (OBJECTS.has(t.lower)) return j + 1;
  if (isCapital(t) && !SUBJECTS.has(t.lower)) {
    return tokens[j + 1] && isCapital(tokens[j + 1]!) ? j + 2 : j + 1;
  }
  if (DETERMINERS.has(t.lower)) {
    for (let k = j + 1; k <= j + 3 && tokens[k]; k++) {
      const next = tokens[k + 1]?.lower;
      if (
        next === 'that' ||
        next === 'to' ||
        next === 'not' ||
        (next && WH.has(next)) ||
        next === 'if'
      )
        return k + 1;
    }
  }
  return -1;
}

/** The reported clause's tokens: up to a semicolon, a dash or ", and/but/so…". */
function clauseTokens(text: string, tokens: readonly WordToken[], from: number): WordToken[] {
  const out: WordToken[] = [];
  for (let k = from; k < tokens.length; k++) {
    const t = tokens[k]!;
    const prev = tokens[k - 1];
    if (k > from && prev) {
      const g = gap(text, prev, t);
      if (/[;:—–]/.test(g) || (g.includes(',') && CLAUSE_JOINS.has(t.lower))) break;
    }
    out.push(t);
  }
  return out;
}

/** Reported statements, questions and commands in one sentence (no quotation marks after the verb). */
function reportedIn(text: string, s: Span): ReportedClause[] {
  const tokens = words(text, s.start, s.end);
  const found: ReportedClause[] = [];
  tokens.forEach((v, i) => {
    const w = v.lower;
    if (!REPORT.has(w) && !ASK.has(w) && !COMMAND.has(w)) return;
    // Direct speech, not reported: a quotation mark anywhere after the verb in this sentence.
    if (QUOTE_MARK.test(text.slice(v.end, s.end)) && !/that\s*[“"]/.test(text.slice(v.end, s.end)))
      return;
    // "“Hi,” she said that night": a tag right after a quote is not reporting.
    if (QUOTE_MARK.test(text.slice(s.start, v.start))) return;
    const past = !PRESENT_REPORT.has(w);
    const push = (kind: ReportedClause['kind'], from: number) => {
      const clause = clauseTokens(text, tokens, from);
      if (clause.length < 2) return;
      found.push({ kind, verb: v, past, tokens: clause, span: spanOf(text, v, clause.at(-1)) });
    };
    let j = i + 1;
    const next = tokens[j];
    if (!next || !plainSpace(text, v, next)) return;
    // Commands: told/asked + someone + (not) to + verb.
    if (COMMAND.has(w)) {
      const end = objectEnd(tokens, j);
      if (end > 0) {
        const k = tokens[end]?.lower === 'not' ? end + 1 : end;
        if (tokens[k]?.lower === 'to' && tokens[k + 1] && !DETERMINERS.has(tokens[k + 1]!.lower)) {
          push('command', end);
          return;
        }
      }
    }
    // Questions: asked (someone) if/whether/where…
    if (ASK.has(w)) {
      const end = objectEnd(tokens, j);
      const q = end > 0 ? end : j;
      const qw = tokens[q]?.lower;
      if (qw && (qw === 'if' || qw === 'whether' || WH.has(qw))) push('question', q);
      return;
    }
    if (!REPORT.has(w)) return;
    // Statements: said (that) she…, told me (that) he…
    if (TELL.has(w)) {
      const end = objectEnd(tokens, j);
      if (end < 0) return;
      j = end;
    }
    const first = tokens[j];
    if (!first) return;
    if (
      first.lower === 'that' &&
      tokens[j + 1] &&
      !/^\s*[,.]/.test(gap(text, first, tokens[j + 1]!))
    ) {
      // "said that" + a describing word ("said that night") is not a clause.
      if (TIME_NOUNS.has(tokens[j + 1]!.lower) || tokens[j + 1]!.lower === 'night') return;
      push('statement', j);
    } else if (
      SUBJECTS.has(first.lower) &&
      first.lower !== 'it' &&
      first.lower !== 'you' &&
      tokens[j + 1] &&
      plainSpace(text, first, tokens[j + 1]!) &&
      !/^(?:and|or|to|too)$/.test(tokens[j + 1]!.lower)
    ) {
      push('statement', j);
    } else if (
      // "told me Sam was moving": a name, then a helping verb.
      isCapital(first) &&
      tokens[j + 1] &&
      AUX.has(tokens[j + 1]!.lower) &&
      plainSpace(text, first, tokens[j + 1]!)
    ) {
      push('statement', j);
    }
  });
  return found;
}

/** Every reported statement, question and command in the text. */
export function reportedClauses(text: string): ReportedClause[] {
  return sentences(text).flatMap((s) => reportedIn(text, s));
}

// ───────── Features ─────────

export interface SpeechHit {
  feature: SpeechFeature;
  span: Span;
}

/** Speech features in a whole text (quotes can cross the sentence splitter: “Ready?” asked Sam.). */
export function speechHits(text: string): SpeechHit[] {
  const hits: SpeechHit[] = [];
  for (const q of quotes(text)) {
    const tagged = q.before || q.after || q.continues;
    if (tagged || (q.words >= 2 && /[.,!?…]["”]$/.test(q.span.text))) {
      hits.push({ feature: 'direct-speech', span: q.span });
    }
    if (q.before && !q.continues) {
      hits.push({
        feature: 'tag-before',
        span: spanOf(text, speakerBefore(text, q.before.verb), q.span),
      });
    }
    if (q.after) {
      // To the end of the tag: “…,” she said / “…,” said Ana.
      const [second] = words(
        text,
        q.after.first.end,
        Math.min(text.length, q.after.first.end + 30),
      );
      const end = second && plainSpace(text, q.after.first, second) ? second : q.after.first;
      hits.push({ feature: 'tag-after', span: spanOf(text, q.span, end) });
    }
    if (q.splits) hits.push({ feature: 'split-quote', span: q.span });
    if (isEvidence(text, q)) hits.push({ feature: 'quoted-evidence', span: q.span });
  }
  for (const c of reportedClauses(text)) {
    hits.push({
      feature:
        c.kind === 'question'
          ? 'reported-question'
          : c.kind === 'command'
            ? 'reported-command'
            : 'reported-speech',
      span: c.span,
    });
  }
  return hits.toSorted((a, b) => a.span.start - b.span.start);
}

// ───────── Mistakes ─────────

const DIALOGUE_KIND = {
  'unmatched-quote': 'unmatched-quote',
  'missing-comma': 'speech-comma',
  'punctuation-outside': 'speech-punctuation',
  'capital-tag': 'speech-capital',
  'new-speaker-paragraph': 'new-speaker',
} as const;

/** The past of a verb for "where did she live" → where she lived. */
const pastOf = (w: string) =>
  SAME_FORMS.has(w) ? w : (verbForms.byBase(w)?.past ?? verbForms.regularPast(w));

/** "asked where was the library" → where the library was; "asked if could she" → if she could. */
function questionOrder(text: string, c: ReportedClause): GrammarIssue | undefined {
  const t = c.tokens;
  let k = 1;
  // "what time is it", "how far was the lake": one extra word after what/which/how.
  if (/^(?:what|which|how)$/.test(t[0]!.lower) && t[1] && !AUX.has(t[1].lower)) k = 2;
  const aux = t[k];
  const subj = t[k + 1];
  if (!aux || !subj || !AUX.has(aux.lower) || !plainSpace(text, t[k - 1]!, aux)) return undefined;
  const isDo = /^(?:do|does|did)$/.test(aux.lower);
  const isBe = /^(?:is|are|was|were|am)$/.test(aux.lower);
  const message = (fix: string) =>
    `A reported question uses statement order (who, then the verb) and no question mark: “${t[0]!.text} ${t
      .slice(1, k)
      .map((x) => `${x.text} `)
      .join('')}${fix}”.`;
  const verbFor = (base: WordToken) => {
    if (aux.lower === 'did' || c.past) return pastOf(base.lower);
    return aux.lower === 'does' ? verbForms.thirdPerson(base.lower) : base.lower;
  };
  if (SUBJECTS.has(subj.lower)) {
    const name = subj.lower === 'i' ? 'I' : subj.lower;
    if (isDo) {
      const base = t[k + 2];
      if (!base || !BASES.has(base.lower)) return undefined;
      const fix = `${name} ${verbFor(base)}`;
      return {
        kind: 'reported-question',
        span: spanOf(text, aux, base),
        fix,
        message: message(fix),
      };
    }
    const fix = `${name} ${aux.lower}`;
    return { kind: 'reported-question', span: spanOf(text, aux, subj), fix, message: message(fix) };
  }
  if (!DETERMINERS.has(subj.lower) && !isCapital(subj)) return undefined;
  const rest = t.slice(k + 1);
  if (isBe) {
    if (rest.length > 5) return undefined;
    const last = rest.at(-1)!;
    const ing = rest.length > 1 && verbForms.isIng(last.lower);
    const subject = ing ? rest.slice(0, -1) : rest;
    const phrase = text.slice(subject[0]!.start, subject.at(-1)!.end);
    const fix = ing ? `${phrase} ${aux.lower} ${last.text}` : `${phrase} ${aux.lower}`;
    return { kind: 'reported-question', span: spanOf(text, aux, last), fix, message: message(fix) };
  }
  // Modal or do + a noun subject + a verb: "when would the bus arrive" → the bus would arrive.
  const m = rest.findIndex((x, n) => n > 0 && BASES.has(x.lower));
  if (m < 1 || m > 3) return undefined;
  const base = rest[m]!;
  const phrase = text.slice(rest[0]!.start, rest[m - 1]!.end);
  const fix = isDo ? `${phrase} ${verbFor(base)}` : `${phrase} ${aux.lower} ${base.text}`;
  return { kind: 'reported-question', span: spanOf(text, aux, base), fix, message: message(fix) };
}

/** Speech mistakes: punctuation and capitals in direct speech, and slips in reported speech. */
export function findSpeechIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = dialogue(text)
    // A word or two in quotation marks with no tag (calls it “home”.) is a mention, not speech.
    .issues.filter(
      (d) =>
        d.type !== 'punctuation-outside' ||
        words(d.span.text).length > 2 ||
        tagAfter(text, d.span.end) !== null,
    )
    .map((d) => ({ kind: DIALOGUE_KIND[d.type], span: d.span, message: d.message }));
  const all = sentences(text);

  for (const q of quotes(text)) {
    const firstWord = words(q.span.text)[0];
    if (!firstWord) continue;
    const word: WordToken = {
      ...firstWord,
      start: q.span.start + firstWord.start,
      end: q.span.start + firstWord.end,
    };
    // Ana said "Let's go." → said, "Let's go."
    if (
      q.before &&
      !q.continues &&
      q.before.punct === '' &&
      !QUOTE_MARK.test(text[q.span.start - 2] ?? '')
    ) {
      const v = q.before.verb;
      if (/^\s+$/.test(text.slice(v.end, q.span.start))) {
        issues.push({
          kind: 'speech-comma',
          span: spanOf(text, v),
          fix: `${v.text},`,
          message: `Put a comma after the speech tag “${v.text}”, before the opening quotation mark: ${v.text}, “…`,
        });
      }
    }
    if (q.continues) {
      // “I know,” said Ana, “But…” → but: the quote carries on the same sentence.
      if (isCapital(firstWord) && CONTINUING.has(firstWord.lower)) {
        issues.push({
          kind: 'speech-capital',
          span: word,
          fix: firstWord.text.toLowerCase(),
          message: `The quote carries on the same sentence after the tag, so “${firstWord.text.toLowerCase()}” starts with a small letter.`,
        });
      }
    } else if (q.before && /^[a-z]/.test(firstWord.text)) {
      // Ana said, "let's go." → Let's.
      const fix = firstWord.text.charAt(0).toUpperCase() + firstWord.text.slice(1);
      issues.push({
        kind: 'speech-capital',
        span: word,
        fix,
        message: `A quoted sentence starts with a capital letter: “${fix}”.`,
      });
    }
  }

  for (const s of all) {
    for (const c of reportedIn(text, s)) {
      const after = text.slice(c.verb.end, s.end);
      // She said that "I am tired." → no quotation marks after "that".
      const thatQuote = /^(.*?\bthat)\s*[“"]/.exec(after);
      if (thatQuote && c.kind === 'statement') {
        const at = c.verb.end + thatQuote[0].length - 1;
        issues.push({
          kind: 'reported-quotes',
          span: { start: at, end: at + 1, text: text.slice(at, at + 1) },
          message:
            'After “said that”, report the words without quotation marks (She said that she was tired), or drop “that” and quote the exact words (She said, “I am tired.”).',
        });
        continue;
      }
      const t = c.tokens;
      if (c.kind === 'command') {
        continue;
      }
      if (c.kind === 'question') {
        const order = questionOrder(text, c);
        if (order) issues.push(order);
        // He asked if I was ready? → a full stop.
        const startsQuestion =
          AUX.has(words(s.text)[0]?.lower ?? '') || WH.has(words(s.text)[0]?.lower ?? '');
        if (s.text.trimEnd().endsWith('?') && !startsQuestion && !QUOTE_MARK.test(s.text)) {
          const at = s.start + s.text.trimEnd().length - 1;
          issues.push({
            kind: 'reported-question',
            span: { start: at, end: at + 1, text: '?' },
            fix: '.',
            message:
              'A reported question is a statement about a question, so it ends with a full stop, not a question mark.',
          });
        }
      }
      if (!c.past) continue;
      // Backshift: "said that she is tired" → was; also "…and that every class can…".
      const starts = [
        0,
        ...t.flatMap((x, n) =>
          x.lower === 'that' && /^(?:and|but)$/.test(t[n - 1]?.lower ?? '') ? [n] : [],
        ),
      ];
      let firstVerb = -1;
      for (let s0 of starts) {
        if (/^(?:that|if|whether)$/.test(t[s0]!.lower) || WH.has(t[s0]!.lower)) s0++;
        const subj = t[s0];
        if (!subj) continue;
        // The subject: a pronoun, "the school", "every class", "Ms. Lee".
        const longest = SUBJECTS.has(subj.lower)
          ? 1
          : DETERMINERS.has(subj.lower) || subj.lower === 'every' || isCapital(subj)
            ? 3
            : 0;
        for (let v = s0 + 1; v <= s0 + longest && t[v]; v++) {
          const verb = t[v]!;
          const shifted = BACKSHIFT[verb.lower];
          if (!plainSpace(text, t[v - 1]!, verb)) break;
          if (!shifted) continue;
          if (firstVerb < 0) firstVerb = v;
          issues.push({
            kind: 'backshift',
            span: spanOf(text, verb),
            fix: shifted,
            message: `In reported speech after “${c.verb.text}”, the verb usually moves one step back in time: “${verb.text}” → “${shifted}”. (If it’s still true now, the present can stay.)`,
          });
          break;
        }
      }
      // Time and place words: "said she would come tomorrow" → the next day.
      const from = firstVerb >= 0 ? firstVerb + 1 : 1;
      for (let n = from; n < t.length; n++) {
        const x = t[n]!;
        const prev = t[n - 1];
        let fix = TIME_SHIFT[x.lower];
        let at = spanOf(text, x);
        const nextWord = t[n + 1];
        if (!fix && nextWord && /^(?:next|last|this)$/.test(x.lower)) {
          const unit = nextWord.lower;
          if (TIME_NOUNS.has(unit) || WEEKDAYS.has(unit)) {
            fix =
              x.lower === 'next'
                ? `the following ${nextWord.text}`
                : x.lower === 'last'
                  ? `the ${nextWord.text} before`
                  : `that ${nextWord.text}`;
            at = spanOf(text, x, nextWord);
          }
        }
        // "here" after a verb of being or coming: "the bus stops here", "she was here".
        if (x.lower === 'here' && prev && /^(?:over|right|in|from)$/.test(prev.lower))
          fix = undefined;
        if (!fix) continue;
        issues.push({
          kind: 'reported-time',
          span: at,
          fix,
          message: `When you report words later or somewhere else, time and place words usually shift too: “${at.text}” → “${fix}”. (Same day, same place? Then “${at.text}” can stay.)`,
        });
        break;
      }
    }

    // Commands without "to": "told us sit down" → to sit; "told me don't" → not to.
    const tokens = words(text, s.start, s.end);
    tokens.forEach((v, i) => {
      if (!COMMAND.has(v.lower) || QUOTE_MARK.test(text.slice(v.end, s.end))) return;
      const obj = tokens[i + 1];
      if (!obj || !OBJECTS.has(obj.lower) || !plainSpace(text, v, obj)) return;
      const next = tokens[i + 2];
      if (!next || !plainSpace(text, obj, next)) return;
      if (next.lower === "don't" || (next.lower === 'do' && tokens[i + 3]?.lower === 'not')) {
        const end = next.lower === 'do' ? tokens[i + 3]! : next;
        issues.push({
          kind: 'reported-command',
          span: spanOf(text, next, end),
          fix: 'not to',
          message: `A reported command that says don’t uses “not to”: “${v.text} ${obj.text} not to ${tokens[i + (next.lower === 'do' ? 4 : 3)]?.text ?? '…'}”.`,
        });
      } else if (COMMAND_VERBS.has(next.lower) && !/^(?:asked|asks|ask)$/.test(v.lower)) {
        issues.push({
          kind: 'reported-command',
          span: spanOf(text, next),
          fix: `to ${next.text}`,
          message: `A reported command uses “to” + the verb: “${v.text} ${obj.text} to ${next.text}”.`,
        });
      }
    });
  }
  return issues.toSorted((a, b) => a.span.start - b.span.start);
}

/** Two pieces of one sentence the splitter cut after a quoted ! or ?: “Ready?” asked Sam. */
export function continuesSpeech(prev: string, next: string): boolean {
  if (!/[!?…]["”]\s*$/.test(prev)) return false;
  const [a, b] = words(next);
  if (!a) return false;
  return /^[a-z]/.test(a.text) || TAG_VERBS.has(a.lower) || (!!b && TAG_VERBS.has(b.lower));
}
