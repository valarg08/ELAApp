import { type Span, type WordToken, inside, quotedSpans, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { verbHits } from './verbs.js';

/**
 * Capitals and punctuation for the Essay Writing track (Unit 8, DESIGN.md §9.12): find question
 * and exclamation marks, list commas, commas after openers and around extra information,
 * contractions, colons, semicolons and dashes; spot small-letter sentence starts, extra capitals,
 * missing or doubled end marks, missing apostrophes, its/it's-style mix-ups, missing commas after
 * openers such as "However", and colons and semicolons in the wrong place. Quoted speech is left to
 * the speech checks. Word lists and patterns, no parser: a guide, never a rule.
 */

export const PUNCTUATION_FEATURES = [
  'question-mark',
  'exclamation-mark',
  'list-commas',
  'intro-comma',
  'extra-info-commas',
  'contraction',
  'colon',
  'semicolon',
  'dash',
] as const;
export type PunctuationFeature = (typeof PUNCTUATION_FEATURES)[number];

export const PUNCTUATION_FEATURE_LABELS: Record<PunctuationFeature, string> = {
  'question-mark': 'a question mark',
  'exclamation-mark': 'an exclamation mark',
  'list-commas': 'a list with commas',
  'intro-comma': 'a comma after an opener',
  'extra-info-commas': 'commas around extra information',
  contraction: 'a contraction',
  colon: 'a colon',
  semicolon: 'a semicolon',
  dash: 'a dash',
};

export const PUNCTUATION_FEATURE_EXAMPLES: Record<PunctuationFeature, string> = {
  'question-mark': 'a question that ends with a question mark, like “Have you ever seen snow?”',
  'exclamation-mark': 'a strong feeling that ends with an exclamation mark, like “What a game!”',
  'list-commas': 'three or more things with commas between them, like “pens, paper and glue”',
  'intro-comma':
    'an opening word, phrase or clause and a comma, like “However, …”, “After lunch, …” or “When the bell rang, …”',
  'extra-info-commas':
    'a pair of commas around a detail, like “My sister, who is twelve, plays the drums.”',
  contraction: 'two words joined with an apostrophe, like don’t, it’s or we’ll',
  colon:
    'a complete sentence, a colon, then a list or an explanation, like “I packed three things: a map, a torch and snacks.”',
  semicolon:
    'two linked sentences joined by a semicolon, like “The storm hit; the lights went out.”',
  dash: 'a dash for a sudden break or an extra detail, like “We opened the door — nothing.”',
};

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const spanOf = (text: string, start: number, end: number): Span => ({
  start,
  end,
  text: text.slice(start, end),
});

const SUBJECTS = set('i he she we they it you');
const SUBORDINATORS =
  set(`because since when whenever while if although though unless until after before
as once whereas wherever`);
const PREPOSITIONS =
  set(`in on at to from with without into during after before since until around inside
outside through across under over behind beside between near by for about`);
/** One-word openers that take a comma ("However, …"). */
const TRANSITIONS =
  set(`however therefore finally meanwhile furthermore moreover consequently unfortunately
fortunately luckily sadly lastly firstly secondly thirdly additionally overall honestly surprisingly`);
/** Openers that take a comma only before a subject ("Besides, we…" but "Besides the rain…"). */
const TRANSITIONS_BEFORE_SUBJECT = set('besides instead also afterwards');
const TRANSITION_PHRASES = [
  'for example',
  'for instance',
  'in conclusion',
  'in addition',
  'as a result',
  'on the other hand',
  'in fact',
  'after that',
  'at first',
  'of course',
  'in the end',
  'to sum up',
  'first of all',
  'most importantly',
  'in my opinion',
  'to be honest',
];
const CONTRACTION_ENDINGS = /^[\p{L}]+(?:n't|'re|'ve|'ll|'m|'d)$/u;
const S_CONTRACTIONS = set(
  "it's that's he's she's what's there's here's who's where's let's how's when's why's i'm",
);
const MISSING_APOSTROPHE: Record<string, string> = {
  dont: 'don’t',
  cant: 'can’t',
  wont: 'won’t',
  didnt: 'didn’t',
  doesnt: 'doesn’t',
  isnt: 'isn’t',
  wasnt: 'wasn’t',
  arent: 'aren’t',
  werent: 'weren’t',
  couldnt: 'couldn’t',
  wouldnt: 'wouldn’t',
  shouldnt: 'shouldn’t',
  hasnt: 'hasn’t',
  havent: 'haven’t',
  hadnt: 'hadn’t',
  mustnt: 'mustn’t',
  im: 'I’m',
  ive: 'I’ve',
  youre: 'you’re',
  youve: 'you’ve',
  youll: 'you’ll',
  theyre: 'they’re',
  theyve: 'they’ve',
  theyll: 'they’ll',
  weve: 'we’ve',
  thats: 'that’s',
  whats: 'what’s',
  theres: 'there’s',
  heres: 'here’s',
  shes: 'she’s',
  wheres: 'where’s',
  whos: 'who’s',
};
/** Words after "its" that show it means "it is" ("its raining", "its a"). */
const AFTER_IT_IS =
  set(`a an not been going so too very really just always never only getting raining snowing
hard easy fun true important okay ok over cold hot late early time also still already almost about`);
/** Things that belong ("it's tail" → its). */
const BELONGINGS =
  set(`own tail tails paws fur wings nest shell owner eyes legs leaves roots mouth teeth body
feathers claws`);
const AFTER_YOU_ARE = set(
  `welcome going not so too very really always never coming getting doing trying a an the`,
);
const AFTER_THEY_ARE = set(
  `going not coming always never so too very really getting doing trying a an the also still already`,
);
const THEIR_THINGS =
  set(`own house home friends friend team teacher teachers dog dogs parents car homework names
mom dad family school bikes`);
const YOUR_THINGS =
  set(`own house home friend friends bike book homework name family teacher phone turn mom dad
dog room team`);
const FAMILY = set(
  'mom dad mum grandma grandpa grandmother grandfather aunt uncle cousin sister brother',
);
const OWNERS =
  set(`mom dad mum sister brother friend teacher grandma grandpa aunt uncle cousin neighbor
neighbour dog cat`);
const POSSESSIONS =
  set(`house car bike room phone book dog cat birthday party name idea team shoes backpack
garden office class homework kitchen garage bedroom jacket`);
const POSSESSIVE_WORDS = set('my your his her our their');
/** "there" is the possessive mistake only after a verb or preposition ("went to there house"). */
const POSSESSIVE_TARGET = /\b(?:to|at|in|from|with|for|visited|saw|met|called|helped)\s+$/i;
const SEASONS = set('spring summer autumn fall winter');
const SEASON_CUES = set('in this last next the every during of all');
const SUBJECTS_AT_SCHOOL = set('math maths science history geography art music');
const PLACE_NOUNS = set(
  'library gym cafeteria school park museum hospital beach playground classroom office zoo mall',
);
const INVERTED = set('can could will would should is are was were am');
const DO_HAVE = set('do does did have has');
/** Question words (not who/which: "Which was a surprise." is usually a fragment). */
const WH = set('what where when why how');
/** "Mr. Diaz", "p.m.": always part of the same sentence. */
const TITLE_END = /(?:^|\s)(?:Mr|Mrs|Ms|Mx|Dr|Prof|St)\.\s*$|(?:^|[\s.])\p{L}\.\s*$/iu;
/** "at 7 a.m. we left": the same sentence when a small letter follows. */
const ABBREVIATION_END = /(?:^|\s)(?:a\.m|p\.m|e\.g|i\.e|etc|vs|Jr|Sr|No)\.\s*$/i;
const CLOSES = /[.!?…]["'”’)\]]*$/;

interface Sentence {
  span: Span;
  tokens: WordToken[];
}

/** Sentences, with "Mr. Diaz" kept together. */
function split(text: string): Sentence[] {
  const merged: Span[] = [];
  for (const s of sentences(text)) {
    const last = merged.at(-1);
    const joins =
      last &&
      !text.slice(last.end, s.start).includes('\n') &&
      (TITLE_END.test(last.text) || (ABBREVIATION_END.test(last.text) && /^\p{Ll}/u.test(s.text)));
    if (last && joins) {
      merged[merged.length - 1] = spanOf(text, last.start, s.end);
    } else {
      merged.push(s);
    }
  }
  return merged.map((s) => ({ span: s, tokens: words(text, s.start, s.end) }));
}

/** The opener at the start of a sentence: a transition word or phrase, and the word after it. */
function transitionAt(
  tokens: readonly WordToken[],
): { length: number; phrase: string } | undefined {
  const lower = tokens.map((t) => t.lower);
  for (const phrase of TRANSITION_PHRASES) {
    const parts = phrase.split(' ');
    if (parts.every((p, k) => lower[k] === p) && tokens.length > parts.length + 1) {
      return { length: parts.length, phrase };
    }
  }
  const first = lower[0];
  if (!first || tokens.length < 3) return undefined;
  if (TRANSITIONS.has(first)) return { length: 1, phrase: first };
  if (TRANSITIONS_BEFORE_SUBJECT.has(first) && SUBJECTS.has(lower[1] ?? '')) {
    return { length: 1, phrase: first };
  }
  return undefined;
}

// ───────── Features ─────────

export interface PunctuationHit {
  feature: PunctuationFeature;
  span: Span;
}

const VERB_FEATURES = new Set([
  'action-verb',
  'linking-verb',
  'helping-verb',
  'past-tense',
  'present-tense',
]);

/** Punctuation features in one sentence. */
export function punctuationHits(
  text: string,
  sentence: Span,
  tokens: readonly WordToken[],
): PunctuationHit[] {
  const hits: PunctuationHit[] = [];
  const first = tokens[0];
  if (!first) return hits;
  const lastToken = tokens.at(-1)!;
  const whole = spanOf(text, first.start, sentence.end);
  const { spans: quoted } = quotedSpans(text);
  const outside = (pos: number) => !inside(pos, quoted);
  const end = sentence.text.trimEnd();
  if (end.endsWith('?') && outside(sentence.start + end.length - 1)) {
    hits.push({ feature: 'question-mark', span: whole });
  }
  if (end.endsWith('!') && outside(sentence.start + end.length - 1) && tokens.length > 1) {
    hits.push({ feature: 'exclamation-mark', span: whole });
  }

  // The gaps between words: where the commas, colons, semicolons and dashes are.
  const gaps = tokens.slice(1).map((t, k) => ({
    at: k + 1,
    text: text.slice(tokens[k]!.end, t.start),
    start: tokens[k]!.end,
  }));
  const commaAt = gaps.filter((g) => /^,\s+$/.test(g.text) && outside(g.start)).map((g) => g.at);

  // An opener and its comma: a transition, a dependent clause, a phrase, an -ing or -ed group.
  const opener = transitionAt(tokens);
  const firstComma = commaAt[0];
  if (firstComma !== undefined) {
    const startsWell =
      (opener && opener.length === firstComma) ||
      (firstComma <= 9 &&
        (SUBORDINATORS.has(first.lower) ||
          PREPOSITIONS.has(first.lower) ||
          /^(?:yes|no|well|oh|wow|sadly|luckily|suddenly|first|second|third|next|then|also|later|now|today|yesterday|tomorrow|besides|instead|afterwards|actually|personally)$/.test(
            first.lower,
          ) ||
          (/(?:ing|ed)$/.test(first.lower) && first.lower.length > 4) ||
          TRANSITIONS.has(first.lower)));
    if (startsWell) {
      const before = tokens[firstComma - 1]!;
      hits.push({ feature: 'intro-comma', span: spanOf(text, first.start, before.end + 1) });
    }
  }

  // A list: two or more short items with commas, then "and"/"or" and the last one.
  const verbAt = new Set(
    verbHits(text, tokens)
      .filter((h) => VERB_FEATURES.has(h.feature))
      .map((h) => tokens.findIndex((t) => t.start === h.span.start)),
  );
  const skipFirst =
    firstComma !== undefined &&
    (SUBORDINATORS.has(first.lower) ||
      PREPOSITIONS.has(first.lower) ||
      opener !== undefined ||
      (/(?:ing|ed)$/.test(first.lower) && first.lower.length > 4));
  const isAndOr = (n: number) => /^(?:and|or)$/.test(tokens[n]?.lower ?? '');
  for (const c of commaAt) {
    if (skipFirst && c === firstComma) continue;
    // Items after this comma: up to 4 words each, separated by commas, then and/or + the last item.
    let k = c;
    let last = -1;
    while (k < tokens.length) {
      // "the dog, the cat, and the bird": and/or straight after a comma ends the list too.
      if (isAndOr(k) && k > c) {
        if (tokens[k + 1]) last = k + 1;
        break;
      }
      let n = k + 1;
      while (n < tokens.length && n - k < 5 && !commaAt.includes(n) && !isAndOr(n)) n++;
      const size = n - k;
      // A verb is fine at the start of an item ("ate lunch"), not after a subject ("my dog barked").
      const clause = [...Array(size).keys()].some((d) => d > 0 && verbAt.has(k + d));
      if (size > 4 || clause || SUBJECTS.has(tokens[k]!.lower)) break;
      if (commaAt.includes(n)) {
        k = n;
        continue;
      }
      if (isAndOr(n) && tokens[n + 1]) last = n + 1;
      break;
    }
    if (last !== -1) {
      // The last item: one word, or two after a little word ("and the bird", "and a torch").
      const lastEnd = /^(?:a|an|the|my|our|your|his|her|their|some)$/.test(tokens[last]!.lower)
        ? Math.min(last + 1, tokens.length - 1)
        : last;
      hits.push({
        feature: 'list-commas',
        span: spanOf(text, tokens[c - 1]!.start, tokens[lastEnd]!.end),
      });
      break;
    }
  }

  // Commas around extra information: ", who is twelve," or ", our coach," in the middle.
  for (let n = 0; n < commaAt.length - 1; n++) {
    const a = commaAt[n]!;
    const b = commaAt[n + 1]!;
    const w = tokens[a]!.lower;
    const after = tokens[b]?.lower ?? '';
    if (b - a > 7 || b - a < 1 || /^(?:and|or)$/.test(after)) continue;
    if (
      /^(?:who|which|whose)$/.test(w) ||
      (/^(?:a|an|the|my|our|your|his|her|their)$/.test(w) &&
        a > 0 &&
        !(skipFirst && a === firstComma))
    ) {
      hits.push({
        feature: 'extra-info-commas',
        span: spanOf(text, tokens[a - 1]!.start, tokens[b - 1]!.end + 1),
      });
      break;
    }
  }

  for (const t of tokens) {
    if (!outside(t.start)) continue;
    if (CONTRACTION_ENDINGS.test(t.lower) || S_CONTRACTIONS.has(t.lower)) {
      hits.push({ feature: 'contraction', span: spanOf(text, t.start, t.end) });
      break;
    }
  }

  for (const g of gaps) {
    if (!outside(g.start)) continue;
    const a = tokens[g.at - 1]!;
    const b = tokens[g.at]!;
    if (/^:\s+$/.test(g.text) && g.at >= 3) {
      hits.push({ feature: 'colon', span: spanOf(text, a.start, Math.min(b.end, lastToken.end)) });
    }
    if (/^;\s+$/.test(g.text) && !/^(?:and|but|or|so|yet)$/.test(b.lower)) {
      hits.push({ feature: 'semicolon', span: spanOf(text, a.start, b.end) });
    }
    if (/^\s*(?:—|–|--)\s*$|^\s+-\s+$/.test(g.text)) {
      hits.push({ feature: 'dash', span: spanOf(text, a.start, b.end) });
    }
  }
  return hits;
}

// ───────── Mistakes ─────────

const issue = (
  kind: GrammarIssue['kind'],
  span: Span,
  message: string,
  fix?: string,
): GrammarIssue => (fix === undefined ? { kind, span, message } : { kind, span, fix, message });

/** Capital and punctuation mistakes, in the order they appear. */
export function findPunctuationIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  const { spans: quoted } = quotedSpans(text);
  const outside = (pos: number) => !inside(pos, quoted);
  const all = split(text);

  all.forEach((s, n) => {
    const { tokens } = s;
    const first = tokens[0];
    if (!first) return;
    const prev = all[n - 1];
    const before = prev ? text.slice(prev.span.start, s.span.start) : '';

    // A small letter starting a sentence (not inside speech, not after "a.m." or a quote).
    const lead = text.slice(s.span.start, first.start);
    if (
      /^\p{Ll}/u.test(first.text) &&
      !/^\p{Ll}+\p{Lu}/u.test(first.text) &&
      !/[“"‘'(]/.test(lead) &&
      outside(first.start) &&
      // “Ready?” asked Sam. / “Ready”? asked Sam. (speech is the speech check's job)
      !(prev && /[”"’'][.!?]?\s*$/.test(before)) &&
      // After "…" or a line with no end mark, the sentence may go on (a list, a poem line).
      !(prev && (!/[.!?]["'”’)\]]*\s*$/.test(before) || /(?:\.\.\.|…)\s*$/.test(before))) &&
      !/[,;:)]/.test(lead) &&
      !(prev && /[,;:]\s*$/.test(before)) &&
      first.lower !== 'i' &&
      !first.lower.startsWith("i'")
    ) {
      issues.push(
        issue(
          'sentence-capital',
          spanOf(text, first.start, first.end),
          'Every sentence starts with a capital letter.',
          capitalize(first.text),
        ),
      );
    }

    // A question that ends with a full stop.
    const end = s.span.text.trimEnd();
    const second = tokens[1]?.lower ?? '';
    const asks =
      (INVERTED.has(first.lower) &&
        (SUBJECTS.has(second) || /^(?:the|a|an|there|this|that|your|my)$/.test(second))) ||
      (DO_HAVE.has(first.lower) && SUBJECTS.has(second)) ||
      (WH.has(first.lower) && (INVERTED.has(second) || DO_HAVE.has(second)));
    if (
      asks &&
      /(?<!\.)\.$/.test(end) &&
      !/[“”"]/.test(s.span.text) &&
      tokens.length >= 3 &&
      // "What a day." "How lucky we were." aren't questions; "Should you need help, …" isn't either.
      !s.span.text.includes(',')
    ) {
      const last = tokens.at(-1)!;
      issues.push(
        issue(
          'question-mark',
          spanOf(text, last.start, s.span.start + end.length),
          'This sentence asks a question, so it ends with a question mark.',
          `${last.text}?`,
        ),
      );
    }

    // A missing comma after an opener ("However we…", "For example the…").
    const opener = transitionAt(tokens);
    if (opener) {
      const lastWord = tokens[opener.length - 1]!;
      const next = tokens[opener.length]!;
      const gap = text.slice(lastWord.end, next.start);
      if (/^\s+$/.test(gap) && outside(first.start)) {
        const span = spanOf(text, first.start, lastWord.end);
        issues.push(
          issue(
            'intro-comma',
            span,
            `Put a comma after an opening word or phrase like “${capitalize(opener.phrase)}”, so the reader pauses before the main sentence.`,
            `${span.text},`,
          ),
        );
      }
    }

    // Extra information in the subject needs its closing comma: "My aunt, who owns a shop has…".
    const who = tokens.findIndex(
      (t, i) =>
        i > 0 &&
        i <= 5 &&
        /^(?:who|which|whose)$/.test(t.lower) &&
        /^,\s*$/.test(text.slice(tokens[i - 1]!.end, t.start)),
    );
    // Not a question ("In an essay, which lead-in fits?") or after an opener ("After lunch, who…").
    if (
      who > 0 &&
      !text.slice(tokens[who]!.end, s.span.end).includes(',') &&
      !s.span.text.trimEnd().endsWith('?') &&
      !SUBORDINATORS.has(first.lower) &&
      !PREPOSITIONS.has(first.lower) &&
      !transitionAt(tokens)
    ) {
      const verbs = new Set(
        verbHits(text, tokens)
          .filter((h) => VERB_FEATURES.has(h.feature))
          .map((h) => tokens.findIndex((t) => t.start === h.span.start)),
      );
      // Only extra information about the subject: no verb before it ("It isn’t true, which…").
      const subjectOnly = ![...verbs].some((k) => k >= 0 && k < who);
      // The clause's own verb (and its helpers), then the main verb after a word or more.
      // "who owns…": the next word is the clause's verb; "who I met…": find it after the subject.
      let v = who + 1;
      const own = tokens[v]?.lower ?? '';
      if (SUBJECTS.has(own) || /^(?:the|a|an|my|our|your|his|her|their)$/.test(own)) {
        while (v < tokens.length && !verbs.has(v)) v++;
      }
      v++;
      while (v < tokens.length && verbs.has(v)) v++;
      let main = v + 1;
      while (main < tokens.length && !verbs.has(main)) main++;
      const lastOfClause = tokens[main - 1];
      if (
        subjectOnly &&
        main < tokens.length &&
        lastOfClause &&
        main - 1 >= v &&
        outside(lastOfClause.start)
      ) {
        issues.push(
          issue(
            'pair-comma',
            spanOf(text, lastOfClause.start, tokens[main]!.end),
            'Extra information takes a comma on both sides. Close it with a second comma before the main verb.',
            `${lastOfClause.text},${text.slice(lastOfClause.end, tokens[main]!.start)}${tokens[main]!.text}`,
          ),
        );
      }
    }

    // A semicolon after an opening dependent clause ("Because it rained; we…").
    if (SUBORDINATORS.has(first.lower)) {
      const semi = s.span.text.indexOf(';');
      const comma = s.span.text.indexOf(',');
      if (semi > 0 && (comma === -1 || semi < comma)) {
        const at = s.span.start + semi;
        const w = words(text, s.span.start, at).at(-1);
        if (w && outside(at)) {
          issues.push(
            issue(
              'semicolon-use',
              spanOf(text, w.start, at + 1),
              'A semicolon joins two complete sentences. After an opening clause (Because…, When…), use a comma.',
              `${w.text},`,
            ),
          );
        }
      }
    }
  });

  // Word-level mistakes: apostrophes, mix-ups, capitals in the middle of a sentence.
  for (const s of all) {
    const { tokens } = s;
    tokens.forEach((t, i) => {
      if (!outside(t.start)) return;
      const span = spanOf(text, t.start, t.end);
      const next = tokens[i + 1];
      const nextLower = next?.lower ?? '';
      const prevLower = tokens[i - 1]?.lower ?? '';
      const firstWord = i === 0;

      const missing = MISSING_APOSTROPHE[t.lower];
      if (missing && !(t.lower === 'wont' && prevLower === 'their')) {
        const fix = firstWord || missing.startsWith('I') ? capitalize(missing) : missing;
        const fixed = /^\p{Lu}/u.test(t.text) ? capitalize(fix) : fix;
        issues.push(
          issue(
            'missing-apostrophe',
            span,
            `“${fixed}” is short for two words, so it needs an apostrophe where the letters are missing.`,
            fixed,
          ),
        );
        return;
      }
      if (/^i'(?:m|ve|ll|d)$/.test(t.lower) && t.text.startsWith('i')) {
        issues.push(
          issue(
            'lowercase-i',
            span,
            'When you mean yourself, “I” is always a capital letter.',
            capitalize(t.text),
          ),
        );
        return;
      }
      if (
        /^(?:mr|mrs|ms|dr)$/.test(t.text) &&
        next &&
        /^\.?\s*\p{Lu}/u.test(text.slice(t.end, next.start + 1))
      ) {
        issues.push(
          issue(
            'lowercase-proper',
            span,
            'A title before a name (Mr., Mrs., Ms., Dr.) starts with a capital letter.',
            capitalize(t.text),
          ),
        );
        return;
      }

      // its / it's, your / you're, their / they're / there.
      const swap = (fix: string, why: string) => {
        const fixed = /^\p{Lu}/u.test(t.text) ? capitalize(fix) : fix;
        issues.push(issue('apostrophe-confusion', span, why, fixed));
      };
      if (t.lower === 'its' && AFTER_IT_IS.has(nextLower)) {
        swap(
          'it’s',
          '“it’s” means “it is”. “its” (no apostrophe) shows belonging: the dog wagged its tail.',
        );
      } else if (t.lower === "it's" && BELONGINGS.has(nextLower)) {
        swap(
          'its',
          'To show belonging, write “its” with no apostrophe. “it’s” always means “it is” or “it has”.',
        );
      } else if (
        t.lower === 'your' &&
        AFTER_YOU_ARE.has(nextLower) &&
        !POSSESSIVE_WORDS.has(prevLower)
      ) {
        swap('you’re', '“you’re” means “you are”. “your” shows belonging: your bike.');
      } else if (t.lower === "you're" && YOUR_THINGS.has(nextLower)) {
        swap('your', 'To show belonging, write “your”. “you’re” means “you are”.');
      } else if (
        (t.lower === 'their' && AFTER_THEY_ARE.has(nextLower)) ||
        (t.lower === 'there' && AFTER_THEY_ARE.has(nextLower) && nextLower.endsWith('ing'))
      ) {
        swap('they’re', '“they’re” means “they are”. “their” shows belonging; “there” is a place.');
      } else if (
        THEIR_THINGS.has(nextLower) &&
        (t.lower === "they're" ||
          (t.lower === 'there' &&
            POSSESSIVE_TARGET.test(text.slice(Math.max(0, t.start - 12), t.start))))
      ) {
        swap(
          'their',
          'To show belonging, write “their”. “they’re” means “they are”; “there” is a place.',
        );
      }

      // A missing possessive apostrophe: "my friends house" → friend’s.
      if (
        POSSESSIVE_WORDS.has(prevLower) &&
        t.lower.endsWith('s') &&
        OWNERS.has(t.lower.slice(0, -1)) &&
        POSSESSIONS.has(nextLower) &&
        !text.slice(t.end, t.end + 1).match(/['’]/)
      ) {
        const one = `${t.text.slice(0, -1)}’s`;
        issues.push(
          issue(
            'missing-apostrophe',
            span,
            `To show the ${nextLower} belongs to them, add an apostrophe: “${one}” for one, or “${t.text}’” for more than one.`,
            one,
          ),
        );
        return;
      }

      // Capitals that don't belong: "in the Summer", "my Mom", "my Science class".
      if (!firstWord && /^\p{Lu}\p{Ll}+$/u.test(t.text) && !(next && /^\p{Lu}/u.test(next.text))) {
        const lowered = lowerFirst(t.text);
        if (SEASONS.has(t.lower) && SEASON_CUES.has(prevLower)) {
          issues.push(
            issue(
              'extra-capital',
              span,
              'Seasons (spring, summer, autumn, winter) don’t need a capital letter.',
              lowered,
            ),
          );
        } else if (FAMILY.has(t.lower) && POSSESSIVE_WORDS.has(prevLower)) {
          issues.push(
            issue(
              'extra-capital',
              span,
              `After “${prevLower}”, “${lowered}” is an ordinary noun, so no capital. Use a capital only when it’s a name: “Mom said…”.`,
              lowered,
            ),
          );
        } else if (SUBJECTS_AT_SCHOOL.has(t.lower) && !/^(?:at|of)$/.test(prevLower)) {
          issues.push(
            issue(
              'extra-capital',
              span,
              `School subjects such as ${lowered} don’t need a capital (but languages like English and Spanish do).`,
              lowered,
            ),
          );
        } else if (
          PLACE_NOUNS.has(t.lower) &&
          /^(?:the|a|our|my|this|that)$/.test(prevLower) &&
          nextLower !== 'of'
        ) {
          issues.push(
            issue(
              'extra-capital',
              span,
              `“${lowered}” here is an ordinary noun, not a name, so no capital. (A full name takes capitals: Riverside Public Library.)`,
              lowered,
            ),
          );
        }
      }
    });
  }

  // Marks: doubled, a space before, a missing space after.
  for (const m of text.matchAll(/[!?]{2,}|(?<![.\s])\.\.(?!\.)/g)) {
    if (!outside(m.index)) continue;
    const mark = m[0].includes('?') ? '?' : m[0][0]!;
    issues.push(
      issue(
        'double-mark',
        spanOf(text, m.index, m.index + m[0].length),
        'One end mark is enough. In an essay, use a single full stop, question mark or exclamation mark.',
        mark,
      ),
    );
  }
  for (const m of text.matchAll(/([\p{L}\p{N}]+)([ \t]+)([,.;:!?])(?=\s|$)/gu)) {
    if (!outside(m.index)) continue;
    issues.push(
      issue(
        'mark-spacing',
        spanOf(text, m.index, m.index + m[0].length),
        'No space before a comma or an end mark: put it right after the word.',
        `${m[1]}${m[3]}`,
      ),
    );
  }
  for (const m of text.matchAll(/(\p{Ll}{2,})([,;:!?]|\.(?=\p{Lu}))(\p{L}{2,})/gu)) {
    if (!outside(m.index)) continue;
    issues.push(
      issue(
        'mark-spacing',
        spanOf(text, m.index, m.index + m[0].length),
        'Leave a space after a comma or an end mark.',
        `${m[1]}${m[2]} ${m[3]}`,
      ),
    );
  }

  // A colon straight after a verb or "such as" ("My favourites are: …").
  for (const m of text.matchAll(
    /\b(are|is|was|were|am|be|include|includes|included|including|such as|like|of|because)[ \t]*:/gi,
  )) {
    if (!outside(m.index)) continue;
    issues.push(
      issue(
        'colon-use',
        spanOf(text, m.index, m.index + m[0].length),
        `A colon comes after a complete sentence. After “${m[1]}”, just carry on: no colon.`,
        m[1],
      ),
    );
  }

  // A semicolon before and/but/so ("; and") → a comma.
  for (const m of text.matchAll(/;(\s+)(and|but|or|so|yet)\b/gi)) {
    if (!outside(m.index)) continue;
    issues.push(
      issue(
        'semicolon-use',
        spanOf(text, m.index, m.index + m[0].length),
        `Use a semicolon or a joining word, not both. Write “, ${m[2]}” (or keep the semicolon and drop “${m[2]}”).`,
        `,${m[1]}${m[2]}`,
      ),
    );
  }

  // A paragraph that ends without an end mark (not the last one, which may still be in progress).
  const lines = [...text.matchAll(/[^\n]+/g)].filter((m) => m[0].trim());
  lines.slice(0, -1).forEach((m) => {
    const line = m[0].trimEnd();
    const lineWords = words(line);
    const last = lineWords.at(-1);
    if (!last || lineWords.length < 6 || CLOSES.test(line) || /[:;,—–-]$/.test(line)) return;
    const start = m.index + last.start;
    if (!outside(start)) return;
    issues.push(
      issue(
        'end-mark',
        spanOf(text, start, m.index + last.end),
        'This paragraph ends without an end mark. Finish the last sentence with a full stop (or ? or !).',
        `${last.text}.`,
      ),
    );
  });

  return issues.toSorted((a, b) => a.span.start - b.span.start);
}
