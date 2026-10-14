import { type Span, type WordToken, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { isAdjective } from './modifiers.js';
import { verbHits } from './verbs.js';

/**
 * Prepositions and conjunctions for the Essay Writing track (Unit 4, DESIGN.md §9.12): find
 * prepositions of place and time, prepositional phrases, FANBOYS, subordinating and correlative
 * conjunctions and interjections; spot a missing comma before FANBOYS, a "because" sentence with no
 * main idea, mismatched pairs ("neither… or") and wrong time prepositions ("at Monday").
 * Word lists and patterns, no parser: a guide, never a rule.
 */

export const CONNECTOR_FEATURES = [
  'preposition-place',
  'preposition-time',
  'prepositional-phrase',
  'coordinating-conjunction',
  'subordinating-conjunction',
  'correlative-conjunction',
  'interjection',
] as const;
export type ConnectorFeature = (typeof CONNECTOR_FEATURES)[number];

export const CONNECTOR_FEATURE_LABELS: Record<ConnectorFeature, string> = {
  'preposition-place': 'a preposition of place',
  'preposition-time': 'a preposition of time',
  'prepositional-phrase': 'a prepositional phrase',
  'coordinating-conjunction': 'a FANBOYS conjunction',
  'subordinating-conjunction': 'a subordinating conjunction',
  'correlative-conjunction': 'a correlative pair',
  interjection: 'an interjection',
};

export const CONNECTOR_FEATURE_EXAMPLES: Record<ConnectorFeature, string> = {
  'preposition-place':
    'where something is, like under the bridge, behind the door or across the street',
  'preposition-time':
    'when something happens, like at noon, on Monday, during lunch or after school',
  'prepositional-phrase':
    'a preposition and its noun, like over the fence, with my friends or before dinner',
  'coordinating-conjunction': 'for, and, nor, but, or, yet or so joining two ideas',
  'subordinating-conjunction':
    'a word that starts a linked idea, like because, although, when, if or until',
  'correlative-conjunction': 'a pair that works together: either… or, neither… nor, both… and',
  interjection: 'a burst of feeling at the start, like “Wow!”, “Oops,” or “Ouch!”',
};

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

const PLACE =
  set(`above across against along among around at behind below beneath beside between beyond by
down from in inside into near off on onto opposite outside over past through throughout to toward towards under
underneath up upon within`);
/** Prepositions that are always about time. */
const TIME_ONLY = set('during since until till');
/** Prepositions that are about time when their noun is a time word ("at noon", "for an hour"). */
const TIME_WITH_NOUN = set('at on in by from for within around before after past throughout');
const OTHER_PREPOSITIONS = set('about of with without for except despite like besides');
const DAYS = set('monday tuesday wednesday thursday friday saturday sunday');
const MONTHS = set(
  'january february march april may june july august september october november december',
);
const SEASONS = set('spring summer autumn winter');
const PARTS_OF_DAY = set('morning afternoon evening');
const AT_TIMES = set('night noon midnight dawn dusk sunrise sunset lunchtime bedtime');
const TIME_NOUNS = new Set([
  ...DAYS,
  ...MONTHS,
  ...SEASONS,
  ...PARTS_OF_DAY,
  ...AT_TIMES,
  ...set(`lunch breakfast dinner school recess break weekend weekends weekday holiday holidays vacation
second seconds minute minutes hour hours day days week weeks month months year years decade decades century
moment moments time o'clock pm am christmas halloween thanksgiving birthday practice class game`),
]);
const DURATIONS = set('seconds minutes hours days weeks months years decades');
const DESCRIBERS =
  set(`a an the this that these those my your our their his her its every each some all
both several many few no one two three four five six seven eight nine ten twenty hundred last next`);
const SUBJECT = set('i he she we they');
const OBJECT = set('me him her us them it you');
/** Words that can't be the noun at the end of a prepositional phrase. */
const NOT_NOUN =
  set(`and or but nor yet so because although though since if when while unless than then
is am are was were be been being has have had do does did will would can could should may might must not
to of in on at for with by from as who which that what where why how there here very too also just`);
const FANBOYS = set('for and nor but or yet so');
/** Words that start a part still waiting for its verb ("how the character… has changed"). */
const WAITING = set(
  'how that what when where why who which whose whom if whether because although',
);
/** After "so" + subject, these mean "so that" (purpose), which takes no comma. */
const MODAL_AFTER =
  set(`can could will would won't wouldn't can't couldn't don't doesn't didn't might may
shall should`);
const ALWAYS_SUBORDINATING = set(
  'because although though unless whereas whenever wherever whether',
);
const SUBORDINATING = set('if when while once');
/** Words that are prepositions with a noun ("after lunch") and conjunctions with a clause ("after we ate"). */
const BOTH_WAYS = set('after before until till since as');
const INTERJECTIONS =
  set(`wow oh ouch hey yikes oops hooray alas ugh phew whoa hmm yay aha eek ah ahh oh no
yes well gosh golly bravo shh psst ow ugh huh uh-oh wahoo yippee`);
/** Interjections that need an exclamation mark or comma after them (so "Well" isn't "well done"). */
const NEEDS_MARK = set('well yes no oh ah');

/** A sentence that is only an interjection ("Wow!"), which belongs with the sentence after it. */
export const isInterjectionOnly = (sentence: string) => {
  const w = words(sentence);
  return w.length === 1 && INTERJECTIONS.has(w[0]!.lower) && /!/.test(sentence);
};

const spanOf = (text: string, a: WordToken, b: WordToken = a): Span => ({
  start: a.start,
  end: b.end,
  text: text.slice(a.start, b.end),
});
const gap = (text: string, a: WordToken, b: WordToken) => text.slice(a.end, b.start);
const hasPunct = (text: string, a: WordToken, b: WordToken) =>
  /[,;:.!?()—–/]/.test(gap(text, a, b));

/** The noun ending a phrase that starts at `i + 1` ("the old wooden fence" → fence), or -1. */
function phraseEnd(
  text: string,
  tokens: readonly WordToken[],
  i: number,
  verbs: Set<number>,
): number {
  let j = i + 1;
  const first = tokens[j];
  if (!first || hasPunct(text, tokens[i]!, first) || SUBJECT.has(first.lower)) return -1;
  if (OBJECT.has(first.lower)) return j;
  let steps = 0;
  while (
    tokens[j + 1] &&
    steps < 4 &&
    !hasPunct(text, tokens[j]!, tokens[j + 1]!) &&
    (DESCRIBERS.has(tokens[j]!.lower) ||
      /^[\p{L}]+['’]s$/u.test(tokens[j]!.lower) ||
      /^\d+$/.test(tokens[j]!.lower) ||
      (isAdjective(tokens[j]!.lower) && !NOT_NOUN.has(tokens[j + 1]!.lower)) ||
      // "Lake Michigan", "the bus stop"
      (/^\p{Lu}/u.test(tokens[j]!.text) && /^\p{Lu}/u.test(tokens[j + 1]!.text)) ||
      (j > i + 1 && !NOT_NOUN.has(tokens[j + 1]!.lower) && TIME_NOUNS.has(tokens[j + 1]!.lower)))
  ) {
    j++;
    steps++;
  }
  const end = tokens[j];
  if (!end || NOT_NOUN.has(end.lower) || DESCRIBERS.has(end.lower)) return -1;
  if (/^\d+$/.test(end.lower) || /^\d{4}s?$/.test(end.lower)) return j;
  if (!/^[\p{L}'’-]+$/u.test(end.text)) return -1;
  // "to run", "to the park": a verb straight after "to" is an infinitive.
  if (j === i + 1 && verbs.has(end.start) && !/^\p{Lu}/u.test(end.text)) return -1;
  return j;
}

/** Does a clause (a subject and a verb) start right after `i`? ("after we ate", "because the bus was late") */
function clauseFollows(
  text: string,
  tokens: readonly WordToken[],
  i: number,
  verbs: Set<number>,
): boolean {
  const next = tokens[i + 1];
  if (!next || hasPunct(text, tokens[i]!, next)) return false;
  if (
    SUBJECT.has(next.lower) ||
    ((next.lower === 'it' || next.lower === 'you') &&
      tokens[i + 2] &&
      verbs.has(tokens[i + 2]!.start))
  ) {
    return true;
  }
  for (let j = i + 2; j <= i + 5 && tokens[j]; j++) {
    if (hasPunct(text, tokens[j - 1]!, tokens[j]!)) return false;
    if (SUBJECT.has(tokens[j]!.lower)) return false;
    if (verbs.has(tokens[j]!.start)) return true;
  }
  return false;
}

export interface ConnectorHit {
  feature: ConnectorFeature;
  span: Span;
}

const verbStarts = (text: string, tokens: readonly WordToken[]) =>
  new Set(verbHits(text, tokens).map((h) => h.span.start));

/** Preposition and conjunction features in one sentence's words. */
export function connectorHits(text: string, tokens: readonly WordToken[]): ConnectorHit[] {
  const hits: ConnectorHit[] = [];
  const add = (feature: ConnectorFeature, span: Span) => hits.push({ feature, span });
  const verbs = verbStarts(text, tokens);
  let skipUntil = -1;
  tokens.forEach((t, i) => {
    const w = t.lower;
    const prev = tokens[i - 1];
    const next = tokens[i + 1];

    // Interjections open a sentence: "Wow!", "Oops, I forgot."
    if (i === 0 && INTERJECTIONS.has(w)) {
      const mark = next ? /^\s*[!,]/.test(gap(text, t, next)) : /^\s*!/.test(text.slice(t.end));
      if (mark || (!NEEDS_MARK.has(w) && !next)) add('interjection', spanOf(text, t));
    }

    // Correlative pairs.
    const pairs: Record<string, string[]> = {
      either: ['or'],
      neither: ['nor'],
      both: ['and'],
      whether: ['or'],
    };
    const partner = pairs[w];
    if (partner) {
      const k = tokens.findIndex((x, j) => j > i + 1 && partner.includes(x.lower));
      if (k > 0) add('correlative-conjunction', spanOf(text, t, tokens[k]));
    }
    if (w === 'not' && next?.lower === 'only') {
      const k = tokens.findIndex((x, j) => j > i + 2 && x.lower === 'but');
      if (k > 0)
        add(
          'correlative-conjunction',
          spanOf(text, t, tokens[k + 1]?.lower === 'also' ? tokens[k + 1]! : tokens[k]!),
        );
    }

    // FANBOYS ("so happy", "so that", "not yet" and "for" without a comma aside).
    if (FANBOYS.has(w) && i > 0) {
      const afterComma = prev !== undefined && /,\s*$/.test(gap(text, prev, t));
      const ok =
        (w !== 'for' || afterComma) &&
        (w !== 'so' ||
          (next !== undefined &&
            !isAdjective(next.lower) &&
            next.lower !== 'that' &&
            !next.lower.endsWith('ly') &&
            next.lower !== 'much' &&
            next.lower !== 'many')) &&
        (w !== 'yet' || (next !== undefined && !hasPunct(text, t, next) && prev?.lower !== 'not'));
      const inPair = hits.some(
        (h) => h.feature === 'correlative-conjunction' && h.span.end === t.end,
      );
      if (ok && !inPair) add('coordinating-conjunction', spanOf(text, t));
    }

    // Subordinating conjunctions: "because", or "after"/"when" with a clause after them.
    const evenThough = w === 'even' && /^(?:though|if)$/.test(next?.lower ?? '');
    const soThat = w === 'so' && next?.lower === 'that';
    if (evenThough || soThat) {
      add('subordinating-conjunction', spanOf(text, t, next));
      skipUntil = i + 1;
    } else if (i > skipUntil) {
      const question = /\?\s*["”’)]*\s*$/.test(text.slice(t.start, tokens.at(-1)!.end + 3));
      if (
        (ALWAYS_SUBORDINATING.has(w) && !(w === 'because' && next?.lower === 'of')) ||
        (SUBORDINATING.has(w) && !(i === 0 && question && w === 'when')) ||
        (BOTH_WAYS.has(w) && clauseFollows(text, tokens, i, verbs))
      ) {
        if (!(w === 'as' && /^(?:as|such|well|soon|long)$/.test(next?.lower ?? ''))) {
          add('subordinating-conjunction', spanOf(text, t));
          return;
        }
      }
    }

    // Prepositions with their phrase: place, time, or neither ("about the war").
    const twoWord =
      (w === 'next' && next?.lower === 'to') ||
      (w === 'close' && next?.lower === 'to') ||
      (w === 'because' && next?.lower === 'of') ||
      (w === 'in' && next?.lower === 'front' && tokens[i + 2]?.lower === 'of');
    const isPrep =
      PLACE.has(w) || TIME_ONLY.has(w) || TIME_WITH_NOUN.has(w) || OTHER_PREPOSITIONS.has(w);
    if (!isPrep && !twoWord) return;
    if (
      prev &&
      (prev.lower === 'next' ||
        prev.lower === 'close' ||
        prev.lower === 'front' ||
        (prev.lower === 'because' && w === 'of'))
    )
      return;
    const head = twoWord ? i + (w === 'in' ? 2 : 1) : i;
    const end = phraseEnd(text, tokens, head, verbs);
    if (end < 0) return;
    const noun = tokens[end]!.lower;
    add('prepositional-phrase', spanOf(text, t, tokens[end]));
    const timeNoun =
      TIME_NOUNS.has(noun) ||
      /^\d{4}s?$/.test(noun) ||
      (/^\d+$/.test(noun) && /^(?:at|by|around|until|till|before|after)$/.test(w));
    if (TIME_ONLY.has(w) || (TIME_WITH_NOUN.has(w) && timeNoun)) {
      add('preposition-time', spanOf(text, t, twoWord ? tokens[head]! : t));
    } else if (PLACE.has(w) || (twoWord && w !== 'because')) {
      add('preposition-place', spanOf(text, t, twoWord ? tokens[head]! : t));
    }
  });
  return hits;
}

// ───────── Mistakes ─────────

/** Which preposition a time word takes: on Monday, in July, at noon. */
function timePreposition(tokens: readonly WordToken[], j: number): 'on' | 'in' | 'at' | null {
  const noun = tokens[j]!.lower;
  const after = tokens[j + 1]?.lower;
  if (DAYS.has(noun)) return 'on';
  if (MONTHS.has(noun)) return after && /^\d/.test(after) ? 'on' : 'in';
  if (SEASONS.has(noun) || /^\d{4}s?$/.test(noun)) return 'in';
  if (AT_TIMES.has(noun)) return 'at';
  return null;
}

/** Missing commas before FANBOYS, "because" sentences with no main idea, mismatched pairs, time prepositions. */
export function findConnectorIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    if (tokens.length === 0) continue;
    const verbs = verbStarts(text, tokens);
    const hasVerb = (from: number, to: number) =>
      tokens.slice(from, to).some((x) => verbs.has(x.start));
    /** "and the road was long": a noun phrase, then its verb straight after. */
    const nounThenVerb = (i: number) => {
      const n = phraseEnd(text, tokens, i, verbs);
      if (n < 0) return false;
      const v =
        tokens[n + 1]?.lower === 'not' || (tokens[n + 1]?.lower ?? '').endsWith('ly')
          ? n + 2
          : n + 1;
      return tokens[v] !== undefined && verbs.has(tokens[v].start);
    };
    /**
     * "shows how the character or their world has changed", "a time you or a character worked":
     * after the last verb, a new subject (or how/that/when…) is still waiting for its own verb.
     */
    const compoundSubject = (i: number) => {
      let last = -1;
      tokens.slice(0, i).forEach((x, j) => {
        // "The cat's dreams": a word after a possessive is a noun, not a verb.
        if (verbs.has(x.start) && !/['’]s$/.test(tokens[j - 1]?.lower ?? '')) last = j;
      });
      if (last < 0) return true;
      return tokens
        .slice(last + 1, i)
        .some((x) => SUBJECT.has(x.lower) || x.lower === 'you' || WAITING.has(x.lower));
    };
    /** Where the clause holding token `i` starts: after the last comma, quote or symbol. */
    const clauseStart = (i: number) => {
      let b = i;
      while (b > 0 && /^\s+$/.test(gap(text, tokens[b - 1]!, tokens[b]!))) b--;
      return b;
    };

    tokens.forEach((t, i) => {
      const w = t.lower;
      const prev = tokens[i - 1];
      const next = tokens[i + 1];

      // "at Monday" → on, "on July" → in, "in night" → at.
      if (/^(?:at|on|in)$/.test(w) && next) {
        const j = next.lower === 'the' ? i + 2 : i + 1;
        const right = tokens[j] ? timePreposition(tokens, j) : null;
        const withThe = j === i + 2;
        // "in the night" and "at the weekend" are fine; "at the morning" is not.
        const partOfDay =
          withThe &&
          PARTS_OF_DAY.has(tokens[j]?.lower ?? '') &&
          w === 'at' &&
          tokens[j + 1]?.lower !== 'of';
        if ((right && right !== w && !withThe) || partOfDay) {
          const fix = partOfDay ? 'in' : right!;
          issues.push({
            kind: 'time-preposition',
            span: spanOf(text, t),
            fix,
            message: `Use “${fix}” here: on for days and dates (on Monday), in for months, seasons, years and parts of the day (in July, in the morning), at for clock times and night (at noon, at night).`,
          });
          return;
        }
      }
      // "since three years" → for.
      if (
        w === 'since' &&
        next &&
        /^(?:\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|few|several|many)$/.test(
          next.lower,
        )
      ) {
        const unit = tokens
          .slice(i + 1, i + 4)
          .find((x) => DURATIONS.has(x.lower) || DURATIONS.has(`${x.lower}s`));
        if (unit) {
          issues.push({
            kind: 'time-preposition',
            span: spanOf(text, t),
            fix: 'for',
            message:
              '“For” goes with an amount of time (for three years); “since” goes with a starting point (since 2020, since Monday).',
          });
          return;
        }
      }
      // "off of" → off; "on accident" → by accident.
      if (w === 'off' && next?.lower === 'of') {
        issues.push({
          kind: 'extra-preposition',
          span: spanOf(text, t, next),
          fix: t.text,
          message: '“Off” works on its own: “jumped off the wall”, not “off of”.',
        });
        return;
      }
      if (w === 'on' && next?.lower === 'accident') {
        issues.push({
          kind: 'extra-preposition',
          span: spanOf(text, t, next),
          fix: 'by accident',
          message: 'The phrase is “by accident” (like “by mistake”), not “on accident”.',
        });
        return;
      }

      // "neither… or" → nor; "either… nor" → or; "both… or" → and.
      const wrongPartner: Record<string, [string, string]> = {
        neither: ['or', 'nor'],
        either: ['nor', 'or'],
        both: ['or', 'and'],
      };
      const pair = wrongPartner[w];
      if (pair) {
        // A real pair sits close together, with plain spaces ("either/or" and "both: not… or" aren't pairs).
        const k = tokens.findIndex(
          (x, j) => j > i + 1 && j <= i + 8 && (x.lower === pair[0] || x.lower === pair[1]),
        );
        const plain =
          k > 0 &&
          tokens.slice(i, k).every((x, j) => /^\s+$/.test(gap(text, x, tokens[i + j + 1]!)));
        if (plain && tokens[k]!.lower === pair[0]) {
          issues.push({
            kind: 'correlative-pair',
            span: spanOf(text, tokens[k]!),
            fix: pair[1],
            message: `“${t.text}” goes with “${pair[1]}”: ${t.lower}… ${pair[1]}. They’re a pair.`,
          });
        }
      }

      // Two complete ideas joined by FANBOYS need a comma: "I was tired, but I kept going."
      if (
        /^(?:and|but|or|so|yet)$/.test(w) &&
        prev &&
        !/,\s*$/.test(gap(text, prev, t)) &&
        next &&
        tokens[i + 2] &&
        // A new subject and verb after it: "but I kept going", "but the road was long".
        (SUBJECT.has(next.lower)
          ? verbs.has(tokens[i + 2]!.start) ||
            (tokens[i + 3] !== undefined && verbs.has(tokens[i + 3]!.start))
          : DESCRIBERS.has(next.lower) && next.lower !== 'that' && nounThenVerb(i)) &&
        i >= 2 &&
        // Plain spaces around the joining word ("“he” or “she”" is a list of words, not two sentences).
        /^\s+$/.test(gap(text, prev, t)) &&
        /^\s+$/.test(gap(text, t, next)) &&
        !(tokens[i + 2] && hasPunct(text, next, tokens[i + 2]!)) &&
        // "so we don't have to…", "so a stranger could…" mean "so that": no comma.
        !(w === 'so' && tokens.slice(i + 1, i + 6).some((x) => MODAL_AFTER.has(x.lower))) &&
        // "Jada and I with…": a phrase follows, not a verb.
        !PLACE.has(tokens[i + 2]!.lower) &&
        !OTHER_PREPOSITIONS.has(tokens[i + 2]!.lower) &&
        // The part before needs its own verb ("My sister and I share…" is one subject).
        hasVerb(clauseStart(i), i) &&
        !compoundSubject(i) &&
        !tokens
          .slice(0, i)
          .some((x) => x.lower === 'only' || x.lower === 'either' || x.lower === 'neither')
      ) {
        issues.push({
          kind: 'fanboys-comma',
          span: spanOf(text, prev, t),
          fix: `${prev.text}, ${t.text}`,
          message: `“${t.text}” joins two complete sentences here, so put a comma before it: “…${prev.text}, ${t.lower} ${next.text}…”.`,
        });
      }
    });

    // A sentence that starts with "Because"/"Although"/"When…" needs a main idea after a comma.
    const first = tokens[0]!;
    const opener =
      (ALWAYS_SUBORDINATING.has(first.lower) &&
        !(first.lower === 'because' && tokens[1]?.lower === 'of') &&
        first.lower !== 'whether') ||
      (SUBORDINATING.has(first.lower) && first.lower !== 'once') ||
      (first.lower === 'even' && /^(?:though|if)$/.test(tokens[1]?.lower ?? '')) ||
      (BOTH_WAYS.has(first.lower) && first.lower !== 'as' && clauseFollows(text, tokens, 0, verbs));
    const question = /\?\s*["”’)]*\s*$/.test(s.text);
    // Only finished sentences (a heading or a sentence still being typed has no end mark).
    const finished = /[.!]\s*$/.test(s.text);
    if (opener && finished && !question && !/[,;:—–]/.test(s.text) && !/[“"]/.test(s.text)) {
      // Count verb groups: "When I got home I ate" has two (got, ate).
      let groups = 0;
      tokens.forEach((x, i) => {
        if (verbs.has(x.start) && !(i > 0 && verbs.has(tokens[i - 1]!.start))) groups++;
      });
      if (groups <= 1) {
        issues.push({
          kind: 'fragment',
          span: s,
          message: `This is only half a sentence: “${first.text}…” needs a main idea. Add it after a comma, like “Because it rained, we stayed inside.”, or join it to the sentence before.`,
        });
      } else {
        issues.push({
          kind: 'intro-comma',
          span: spanOf(text, first),
          message: `When a sentence starts with “${first.text}”, it needs a main idea too, after a comma where the first part ends, like “When I got home, I ate dinner.”`,
        });
      }
    }
  }
  return issues;
}
