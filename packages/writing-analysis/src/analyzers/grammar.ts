import { type Span, type WordToken, sentences, words } from '../text.js';
import {
  VERB_FEATURES,
  VERB_FEATURE_EXAMPLES,
  VERB_FEATURE_LABELS,
  type VerbFeature,
  findVerbIssues,
  verbHits,
} from './verbs.js';
import {
  MODIFIER_FEATURES,
  MODIFIER_FEATURE_EXAMPLES,
  MODIFIER_FEATURE_LABELS,
  type ModifierFeature,
  findModifierIssues,
  modifierHits,
  veryPhrases,
} from './modifiers.js';
import {
  CONNECTOR_FEATURES,
  CONNECTOR_FEATURE_EXAMPLES,
  CONNECTOR_FEATURE_LABELS,
  type ConnectorFeature,
  connectorHits,
  isInterjectionOnly,
  findConnectorIssues,
} from './connectors.js';
import {
  VOICE_FEATURES,
  VOICE_FEATURE_EXAMPLES,
  VOICE_FEATURE_LABELS,
  type VoiceFeature,
  findVoiceIssues,
  passiveNotes,
  voiceHits,
} from './voice.js';
import {
  SPEECH_FEATURES,
  SPEECH_FEATURE_EXAMPLES,
  SPEECH_FEATURE_LABELS,
  type SpeechFeature,
  continuesSpeech,
  findSpeechIssues,
  reportedClauses,
  speechHits,
} from './speech.js';
import {
  STRUCTURE_FEATURES,
  STRUCTURE_FEATURE_EXAMPLES,
  STRUCTURE_FEATURE_LABELS,
  type StructureFeature,
  findStructureIssues,
  structureHits,
} from './structure.js';
import {
  PUNCTUATION_FEATURES,
  PUNCTUATION_FEATURE_EXAMPLES,
  PUNCTUATION_FEATURE_LABELS,
  type PunctuationFeature,
  findPunctuationIssues,
  punctuationHits,
} from './punctuation.js';
import {
  SENTENCE_TYPE_FEATURES,
  SENTENCE_TYPE_FEATURE_EXAMPLES,
  SENTENCE_TYPE_FEATURE_LABELS,
  type SentenceTypeFeature,
  sentenceTypeHits,
  varietyNotes as findVarietyNotes,
} from './sentence-types.js';

/**
 * Grammar checks for the Essay Writing track (DESIGN.md §9.12): find grammar features in a
 * sentence (a proper noun, a plural, an object pronoun…) for sentence sets, and spot common noun
 * and pronoun mistakes for the Coach. Word lists and patterns, no parser: a guide, never a rule.
 */

export const GRAMMAR_FEATURES = [
  'proper-noun',
  'common-noun',
  'plural',
  'possessive',
  'collective-noun',
  'abstract-noun',
  'subject-pronoun',
  'object-pronoun',
  'possessive-pronoun',
  ...VERB_FEATURES,
  ...MODIFIER_FEATURES,
  ...CONNECTOR_FEATURES,
  ...VOICE_FEATURES,
  ...SPEECH_FEATURES,
  ...STRUCTURE_FEATURES,
  ...PUNCTUATION_FEATURES,
  ...SENTENCE_TYPE_FEATURES,
] as const;
export type GrammarFeature = (typeof GRAMMAR_FEATURES)[number];

export const GRAMMAR_FEATURE_LABELS: Record<GrammarFeature, string> = {
  'proper-noun': 'a proper noun',
  'common-noun': 'a common noun',
  plural: 'a plural noun',
  possessive: 'a possessive noun',
  'collective-noun': 'a collective noun',
  'abstract-noun': 'an abstract noun',
  'subject-pronoun': 'a subject pronoun',
  'object-pronoun': 'an object pronoun',
  'possessive-pronoun': 'a possessive pronoun',
  ...VERB_FEATURE_LABELS,
  ...MODIFIER_FEATURE_LABELS,
  ...CONNECTOR_FEATURE_LABELS,
  ...VOICE_FEATURE_LABELS,
  ...SPEECH_FEATURE_LABELS,
  ...STRUCTURE_FEATURE_LABELS,
  ...PUNCTUATION_FEATURE_LABELS,
  ...SENTENCE_TYPE_FEATURE_LABELS,
};

/** Examples shown when a feature is missing. */
export const GRAMMAR_FEATURE_EXAMPLES: Record<GrammarFeature, string> = {
  'proper-noun': 'a name with a capital letter, like Maya, Chicago or Tuesday',
  'common-noun': 'an everyday thing, like a dog, the city or this book',
  plural: 'more than one, like dogs, boxes or children',
  possessive: 'something that belongs, like Sam’s bike or the girls’ team',
  'collective-noun': 'one word for a group, like team, flock or audience',
  'abstract-noun': 'an idea or feeling you can’t touch, like courage, friendship or fear',
  'subject-pronoun': 'I, he, she, we or they doing the action',
  'object-pronoun': 'me, him, her, us or them receiving the action',
  'possessive-pronoun': 'my, your, their, or mine, yours, theirs',
  ...VERB_FEATURE_EXAMPLES,
  ...MODIFIER_FEATURE_EXAMPLES,
  ...CONNECTOR_FEATURE_EXAMPLES,
  ...VOICE_FEATURE_EXAMPLES,
  ...SPEECH_FEATURE_EXAMPLES,
  ...STRUCTURE_FEATURE_EXAMPLES,
  ...PUNCTUATION_FEATURE_EXAMPLES,
  ...SENTENCE_TYPE_FEATURE_EXAMPLES,
};

/** The Coach skill a grammar feature belongs to. */
export function grammarSkillOf(
  feature: GrammarFeature,
):
  | 'nouns'
  | 'pronouns'
  | 'verbs'
  | 'modifiers'
  | 'connectors'
  | 'voice'
  | 'speech'
  | 'structure'
  | 'punctuation'
  | 'sentenceTypes' {
  if ((VERB_FEATURES as readonly string[]).includes(feature)) return 'verbs';
  if ((MODIFIER_FEATURES as readonly string[]).includes(feature)) return 'modifiers';
  if ((CONNECTOR_FEATURES as readonly string[]).includes(feature)) return 'connectors';
  if ((VOICE_FEATURES as readonly string[]).includes(feature)) return 'voice';
  if ((SPEECH_FEATURES as readonly string[]).includes(feature)) return 'speech';
  if ((STRUCTURE_FEATURES as readonly string[]).includes(feature)) return 'structure';
  if ((PUNCTUATION_FEATURES as readonly string[]).includes(feature)) return 'punctuation';
  if ((SENTENCE_TYPE_FEATURES as readonly string[]).includes(feature)) return 'sentenceTypes';
  return feature.endsWith('pronoun') ? 'pronouns' : 'nouns';
}

export type {
  ConnectorFeature,
  ModifierFeature,
  PunctuationFeature,
  SentenceTypeFeature,
  SpeechFeature,
  StructureFeature,
  VerbFeature,
  VoiceFeature,
};
export type { PassiveNote } from './voice.js';
export { passiveNotes, veryPhrases };
export { reportedClauses };
export { quotes } from './speech.js';
export type { QuoteInfo, ReportedClause } from './speech.js';

const set = (s: string) => new Set(s.split(' '));

const ARTICLES = set('a an the this that these those every each');
/** Possessive words that also come before a noun ("my aunt", "their house"). */
const NOUN_CUES = set('my your our their his its');
const PLURAL_CUES = set(
  'the these those many some several few all both my our your their his her its two three four five six seven eight nine ten twelve twenty hundred lots plenty no',
);
const NOT_PLURAL = set(
  'this is was has his its yes us bus gas plus always perhaps news series species lens chaos sometimes besides whereas less unless across',
);
const IRREGULAR_PLURALS = set('children people men women mice teeth feet geese oxen');
const COLLECTIVE = set(
  'team class family flock herd pack crowd audience band committee group swarm army crew jury staff choir orchestra bunch litter pride colony gaggle troop fleet panel club council government public couple tribe nation community gang squad batch pile pod',
);
const ABSTRACT = set(
  'love courage freedom honesty friendship fear hope joy anger kindness bravery patience happiness sadness justice truth peace knowledge beauty pride trust loyalty curiosity wisdom childhood time idea belief dream success failure danger luck silence respect jealousy confidence imagination talent energy health safety skill strength power fun excitement worry loneliness grief sorrow surprise humor courage memory future past history education growth change opinion reason thought',
);
const ABSTRACT_SUFFIX = /(?:ness|hood|ship)$/;
const SUBJECT = set('i he she we they');
const OBJECT = set('me him us them');
const POSSESSIVE = set('my your our their mine yours hers ours theirs its');
const PREPOSITIONS = set(
  'to for with at from about by of near behind without between among beside like toward towards against around after before',
);
const OBJECT_VERBS = set(
  'gave told asked invited helped showed sent called saw met thanked joined followed taught',
);
/** Words that can come right after an object pronoun (so "and I" ending a phrase is a mistake). */
const AFTER_OBJECT = set(
  'a an the to at in on for with some yesterday today tonight tomorrow last after before about home back again too',
);
const CONTRACTIONS = set(
  "it's that's he's she's what's there's here's who's where's let's how's when's why's",
);
const DAYS_MONTHS = set(
  'monday tuesday wednesday thursday friday saturday sunday january february april june july august september october november december',
);
const PLACES_AND_LANGUAGES = set(
  'english spanish french chinese america england canada mexico china india africa europe asia australia london paris texas california christmas halloween easter thanksgiving',
);
const SUBJECT_FOR: Record<string, string> = {
  me: 'I',
  him: 'he',
  her: 'she',
  us: 'we',
  them: 'they',
};
const OBJECT_FOR: Record<string, string> = {
  i: 'me',
  he: 'him',
  she: 'her',
  we: 'us',
  they: 'them',
};
const IRREGULAR_FIXES: Record<string, string> = {
  childs: 'children',
  childrens: 'children’s',
  mans: 'men',
  mens: 'men’s',
  womans: 'women',
  womens: 'women’s',
  mouses: 'mice',
  tooths: 'teeth',
  foots: 'feet',
  gooses: 'geese',
  sheeps: 'sheep',
  deers: 'deer',
  fishs: 'fish',
  knifes: 'knives',
  wifes: 'wives',
  wolfs: 'wolves',
  halfs: 'halves',
  lifes: 'lives',
  shelfs: 'shelves',
  peoples: 'people',
};

const isCapital = (t: WordToken) => /^\p{Lu}/u.test(t.text);
const startsSentence = (text: string, sentence: Span, t: WordToken) =>
  t.start === sentence.start ||
  /^[\s“"'‘(]*$/.test(text.slice(sentence.start, t.start)) ||
  /[“"]\s*$/.test(text.slice(sentence.start, t.start));

interface SentenceWords {
  sentence: Span;
  tokens: WordToken[];
}

function split(text: string): SentenceWords[] {
  return sentences(text).map((s) => ({ sentence: s, tokens: words(text, s.start, s.end) }));
}

/** The possessive forms: Sam's, the dog's, the girls' (an apostrophe right after a final s). */
function isPossessiveNoun(text: string, t: WordToken): boolean {
  if (/^[\p{L}]+'s$/u.test(t.lower)) return !CONTRACTIONS.has(t.lower);
  return t.lower.endsWith('s') && /^['’]/.test(text.slice(t.end, t.end + 1)) && t.lower.length > 2;
}

function isPluralNoun(tokens: WordToken[], i: number): boolean {
  const t = tokens[i]!;
  if (IRREGULAR_PLURALS.has(t.lower)) return true;
  if (!/^[a-z]{3,}s$/.test(t.lower) || NOT_PLURAL.has(t.lower)) return false;
  if (/(?:ss|us|is)$/.test(t.lower)) return false;
  const prev = tokens[i - 1]?.lower;
  const prev2 = tokens[i - 2]?.lower;
  // "two dogs", "the boxes", or one describing word between: "the big dogs".
  return (
    (prev !== undefined && PLURAL_CUES.has(prev)) ||
    (prev2 !== undefined && PLURAL_CUES.has(prev2) && prev !== undefined && !ARTICLES.has(prev))
  );
}

/** "her" before a word is possessive ("her bike"); at the end or before a little word it's an object. */
function herIsObject(tokens: WordToken[], i: number, text: string): boolean {
  const next = tokens[i + 1];
  if (!next) return true;
  if (/[,;:.!?]/.test(text.slice(tokens[i]!.end, next.start))) return true;
  return AFTER_OBJECT.has(next.lower) || next.lower === 'and';
}

export interface FeatureHit {
  feature: GrammarFeature;
  span: Span;
}

/** Every grammar feature found in a piece of text (one hit per word). */
export function grammarFeatures(text: string): FeatureHit[] {
  const hits: FeatureHit[] = [];
  for (const { sentence, tokens } of split(text)) {
    tokens.forEach((t, i) => {
      const span: Span = { start: t.start, end: t.end, text: t.text };
      const add = (feature: GrammarFeature) => {
        // "Lake Michigan", "Ocean Avenue": one name, one hit.
        const last = hits.at(-1);
        if (
          feature === 'proper-noun' &&
          last?.feature === 'proper-noun' &&
          /^ +$/.test(text.slice(last.span.end, t.start))
        ) {
          last.span = {
            start: last.span.start,
            end: t.end,
            text: text.slice(last.span.start, t.end),
          };
          return;
        }
        hits.push({ feature, span });
      };
      const first = startsSentence(text, sentence, t);
      if (isCapital(t) && t.lower !== 'i' && !t.lower.startsWith("i'")) {
        if (!first || DAYS_MONTHS.has(t.lower) || PLACES_AND_LANGUAGES.has(t.lower)) {
          add('proper-noun');
        } else if (
          isPossessiveNoun(text, t) ||
          (tokens[i + 1]?.lower === 'and' && tokens[i + 2] && isCapital(tokens[i + 2]!))
        ) {
          add('proper-noun');
        }
      }
      const prev = tokens[i - 1]?.lower;
      if (
        prev !== undefined &&
        (ARTICLES.has(prev) || NOUN_CUES.has(prev)) &&
        /^[a-z]+$/.test(t.text) &&
        !ARTICLES.has(t.lower) &&
        !SUBJECT.has(t.lower) &&
        !OBJECT.has(t.lower) &&
        !POSSESSIVE.has(t.lower)
      ) {
        add('common-noun');
      }
      if (isPluralNoun(tokens, i)) add('plural');
      if (isPossessiveNoun(text, t)) add('possessive');
      if (COLLECTIVE.has(t.lower)) add('collective-noun');
      if (ABSTRACT.has(t.lower) || (t.lower.length > 6 && ABSTRACT_SUFFIX.test(t.lower))) {
        add('abstract-noun');
      }
      if (SUBJECT.has(t.lower)) add('subject-pronoun');
      else if ((t.lower === 'you' || t.lower === 'it') && first) add('subject-pronoun');
      if (OBJECT.has(t.lower)) add('object-pronoun');
      else if (t.lower === 'her' && herIsObject(tokens, i, text)) add('object-pronoun');
      else if ((t.lower === 'you' || t.lower === 'it') && prev && PREPOSITIONS.has(prev))
        add('object-pronoun');
      if (POSSESSIVE.has(t.lower)) add('possessive-pronoun');
      else if (t.lower === 'her' && !herIsObject(tokens, i, text)) add('possessive-pronoun');
      else if (t.lower === 'his') add('possessive-pronoun');
    });
    for (const hit of verbHits(text, tokens)) hits.push(hit);
    for (const hit of modifierHits(text, tokens)) hits.push(hit);
    for (const hit of connectorHits(text, tokens)) hits.push(hit);
    for (const hit of voiceHits(text, tokens)) hits.push(hit);
    for (const hit of structureHits(text, tokens)) hits.push(hit);
    for (const hit of punctuationHits(text, sentence, tokens)) hits.push(hit);
    for (const hit of sentenceTypeHits(text, sentence, tokens)) hits.push(hit);
  }
  // Speech works on the whole text: a quote can cross the sentence splitter (“Ready?” asked Sam.).
  for (const hit of speechHits(text)) hits.push(hit);
  return hits;
}

export interface SentenceSetCheck {
  /** The student's sentence for this task, in order, if there is one. */
  sentence: Span | null;
  missing: GrammarFeature[];
  done: boolean;
}

/** Sentence n of the text against task n: does it have the features the task needs? */
export function checkSentenceSet(
  text: string,
  tasks: readonly { needs: readonly GrammarFeature[] }[],
): SentenceSetCheck[] {
  // "Wow! That was close." is one answer: a lone interjection joins the sentence after it.
  const list: Span[] = [];
  for (const s of sentences(text)) {
    const last = list.at(-1);
    // …and so is “Ready?” asked Sam., which the splitter cuts after the question mark.
    if (last && (isInterjectionOnly(last.text) || continuesSpeech(last.text, s.text))) {
      list[list.length - 1] = {
        start: last.start,
        end: s.end,
        text: text.slice(last.start, s.end),
      };
    } else list.push(s);
  }
  return tasks.map((task, i) => {
    const sentence = list[i] ?? null;
    if (!sentence) return { sentence, missing: [...task.needs], done: false };
    const found = new Set(grammarFeatures(sentence.text).map((h) => h.feature));
    const missing = task.needs.filter((f) => !found.has(f));
    return { sentence, missing, done: missing.length === 0 };
  });
}

export interface GrammarIssue {
  kind:
    | 'lowercase-proper'
    | 'lowercase-i'
    | 'irregular-plural'
    | 'plural-ending'
    | 'apostrophe-plural'
    | 'object-as-subject'
    | 'subject-as-object'
    | 'unclear-pronoun'
    | 'pronoun-number'
    | 'wrong-past'
    | 'missing-helper'
    | 'helper-past'
    | 'should-of'
    | 'agreement'
    | 'tense-shift'
    | 'wrong-comparison'
    | 'double-comparison'
    | 'comparison-form'
    | 'real-really'
    | 'good-well'
    | 'adjective-for-adverb'
    | 'weak-very'
    | 'time-preposition'
    | 'extra-preposition'
    | 'correlative-pair'
    | 'fanboys-comma'
    | 'fragment'
    | 'intro-comma'
    | 'passive-form'
    | 'by-pronoun'
    | 'unmatched-quote'
    | 'speech-comma'
    | 'speech-punctuation'
    | 'speech-capital'
    | 'new-speaker'
    | 'reported-quotes'
    | 'reported-question'
    | 'reported-command'
    | 'backshift'
    | 'reported-time'
    | 'run-on'
    | 'comma-splice'
    | 'sentence-capital'
    | 'extra-capital'
    | 'question-mark'
    | 'end-mark'
    | 'double-mark'
    | 'mark-spacing'
    | 'missing-apostrophe'
    | 'apostrophe-confusion'
    | 'colon-use'
    | 'semicolon-use'
    | 'pair-comma'
    | 'stringy-sentence'
    | 'long-sentence'
    | 'choppy-sentences'
    | 'repeated-opener';
  span: Span;
  /** A suggested fix for the words in `span`, when there is one. */
  fix?: string;
  message: string;
}

const tokenSpan = (t: WordToken): Span => ({ start: t.start, end: t.end, text: t.text });
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Noun mistakes: names without capitals, wrong plurals, apostrophes in plurals. */
export function nounIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const { tokens } of split(text)) {
    tokens.forEach((t, i) => {
      const span = tokenSpan(t);
      if (t.text === 'i') {
        issues.push({
          kind: 'lowercase-i',
          span,
          fix: 'I',
          message: 'When you mean yourself, “I” is always a capital letter.',
        });
      } else if (
        t.text === t.lower &&
        (DAYS_MONTHS.has(t.lower) || PLACES_AND_LANGUAGES.has(t.lower))
      ) {
        issues.push({
          kind: 'lowercase-proper',
          span,
          fix: capitalize(t.text),
          message: `“${t.text}” is a proper noun (a name), so it starts with a capital letter.`,
        });
      } else if (IRREGULAR_FIXES[t.lower]) {
        const fix = IRREGULAR_FIXES[t.lower]!;
        issues.push({
          kind: 'irregular-plural',
          span,
          fix,
          message: fix.includes('’')
            ? `To show something belongs to them, write “${fix}”.`
            : `“${t.text}” has a special plural: “${fix}”.`,
        });
      } else if (/^[a-z]+[^aeiou\s]ys$/.test(t.lower) && t.lower.length > 4) {
        const fix = `${t.text.slice(0, -2)}ies`;
        issues.push({
          kind: 'plural-ending',
          span,
          fix,
          message: `When a word ends in a consonant + y, change the y to “ies”: “${fix}”.`,
        });
      } else if (/^[a-z]+(?:x|ch|sh)s$/.test(t.lower)) {
        const fix = `${t.text.slice(0, -1)}es`;
        issues.push({
          kind: 'plural-ending',
          span,
          fix,
          message: `Words ending in x, ch or sh add “es” to make the plural: “${fix}”.`,
        });
      } else if (
        /^[\p{L}]+'s$/u.test(t.lower) &&
        !CONTRACTIONS.has(t.lower) &&
        /^(?:are|were|have)$/.test(tokens[i + 1]?.lower ?? '')
      ) {
        const fix = t.text.replace(/['’]s$/, 's');
        issues.push({
          kind: 'apostrophe-plural',
          span,
          fix,
          message: `If you mean more than one, there's no apostrophe: “${fix}”. An apostrophe shows belonging.`,
        });
      }
    });
  }
  return issues;
}

/** Pronoun mistakes: "Me and Sam went", "with Sam and I", unclear he/she, "the dogs… its". */
export function pronounIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  const all = split(text);
  all.forEach(({ tokens }, n) => {
    const t0 = tokens[0];
    // A pair doing the action near the start: "Me and Sam went", "My friend Omar and me ran".
    const andAt = tokens.findIndex((t, i) => t.lower === 'and' && i >= 1 && i <= 4);
    const a = tokens[andAt - 1];
    const b = tokens[andAt + 1];
    const next = tokens[andAt + 2];
    const isObject = (i: number) => {
      const t = tokens[i];
      return !!t && (OBJECT.has(t.lower) || (t.lower === 'her' && herIsObject(tokens, i, text)));
    };
    const subjectSide =
      andAt > 0 &&
      tokens
        .slice(0, andAt)
        .every(
          (t) => !PREPOSITIONS.has(t.lower) && !OBJECT_VERBS.has(t.lower) && !SUBJECT.has(t.lower),
        ) &&
      next !== undefined &&
      b !== undefined &&
      !AFTER_OBJECT.has(next.lower) &&
      !/[,;:.!?]/.test(text.slice(b.end, next.start));
    const aIsObject = andAt === 1 && isObject(0);
    const bIsObject = isObject(andAt + 1);
    if (subjectSide && a && b && (aIsObject || bIsObject)) {
      const subj = (t: WordToken) => SUBJECT_FOR[t.lower]!;
      let fix: string | undefined;
      let span: Span = { start: a.start, end: b.end, text: text.slice(a.start, b.end) };
      if (aIsObject && bIsObject) {
        // "Him and me" → "He and I" (yourself last).
        fix = a.lower === 'me' ? `${subj(b)} and I` : `${subj(a)} and ${subj(b)}`;
      } else if (bIsObject) {
        fix = `${a.text} and ${subj(b)}`;
      } else if (/^\p{Lu}/u.test(b.text)) {
        fix = `${b.text} and ${subj(a)}`;
      } else {
        // "Me and my friend…": the other person is several words, so point at the pronoun only.
        span = tokenSpan(a);
      }
      const pronoun = bIsObject ? b : a;
      issues.push({
        kind: 'object-as-subject',
        span,
        fix: fix && span.start === t0?.start ? capitalize(fix) : fix,
        message: `“${pronoun.text}” is doing the action here, so use the subject pronoun “${subj(pronoun)}”, and put yourself last. Try it without the other person: “${capitalize(subj(pronoun))} ${next.text}”.`,
      });
    }

    // Subject pronoun after a preposition or verb: "with Sam and I", "between you and I".
    tokens.forEach((t, i) => {
      if (!PREPOSITIONS.has(t.lower) && !OBJECT_VERBS.has(t.lower)) return;
      // "with I and Sam" (pronoun first) or "with Sam and I" (pronoun last).
      if (tokens[i + 2]?.lower !== 'and') return;
      for (const j of [i + 1, i + 3]) {
        const pro = tokens[j];
        if (!pro || !SUBJECT.has(pro.lower)) continue;
        // "with Sam and I saw…" starts a new clause: only flag "and I" that ends the phrase.
        const after = tokens[j + 1];
        const endsPhrase =
          j === i + 1 ||
          !after ||
          /[,;:.!?)]/.test(text.slice(pro.end, after.start)) ||
          AFTER_OBJECT.has(after.lower);
        if (!endsPhrase) continue;
        const fixWord = OBJECT_FOR[pro.lower]!;
        issues.push({
          kind: 'subject-as-object',
          span: tokenSpan(pro),
          fix: fixWord,
          message: `After “${t.text}”, use the object pronoun: “${fixWord}”. Try it without the other person: “${t.lower} ${fixWord}”.`,
        });
      }
    });

    // Unclear he/she: the sentence before names two or more people.
    const prev = all[n - 1];
    if (prev && t0 && /^(?:he|she|him|her|his)$/.test(t0.lower)) {
      const names = new Set(
        prev.tokens
          .filter(
            (t, i) =>
              isCapital(t) &&
              t.lower !== 'i' &&
              !DAYS_MONTHS.has(t.lower) &&
              !PLACES_AND_LANGUAGES.has(t.lower) &&
              (!startsSentence(text, prev.sentence, t) || prev.tokens[i + 1]?.lower === 'and'),
          )
          .map((t) => t.text),
      );
      if (names.size >= 2) {
        const who = [...names].slice(0, 2);
        issues.push({
          kind: 'unclear-pronoun',
          span: tokenSpan(t0),
          message: `Who is “${t0.text}”: ${who[0]} or ${who[1]}? The sentence before names both, so use the name here to make it clear.`,
        });
      }
    }

    // "its" pointing back to a plural ("The dogs wagged its tails").
    const its = tokens.findIndex((t) => t.lower === 'its');
    if (its > 0) {
      // Not the verb right before "its" ("The team keeps its trophies").
      const plural = tokens
        .slice(0, its)
        .find(
          (_, i) =>
            i < its - 1 && isPluralNoun(tokens, i) && !COLLECTIVE.has(tokens[i - 1]?.lower ?? ''),
        );
      if (plural) {
        issues.push({
          kind: 'pronoun-number',
          span: tokenSpan(tokens[its]!),
          fix: 'their',
          message: `“its” is for one thing, but “${plural.text}” means more than one. Use “their”.`,
        });
      }
    }
  });
  return issues;
}

/** The first hit of a feature, for "Show me". */
export const firstFeature = (hits: readonly FeatureHit[], feature: GrammarFeature) =>
  hits.find((h) => h.feature === feature)?.span;

/** Verb mistakes: made-up pasts ("goed"), "I seen", "should of", "they was", tense slips. */
export const verbIssues = (text: string): GrammarIssue[] => {
  const issues = findVerbIssues(text, isPluralNoun);
  if (!issues.some((i) => i.kind === 'tense-shift')) return issues;
  // Reported speech mixes tenses on purpose ("The article reports that attendance went up").
  const reported = reportedClauses(text);
  return issues.filter(
    (i) =>
      i.kind !== 'tense-shift' ||
      !reported.some((c) => c.verb.start >= i.span.start && c.verb.end <= i.span.end),
  );
};

/** Adjective and adverb mistakes: "more taller", "gooder", "biggest than", "did good", "ran quick". */
export const modifierIssues = (text: string): GrammarIssue[] => findModifierIssues(text);

/** Preposition and conjunction mistakes: "at Monday", "neither… or", a missing comma before FANBOYS, "Because I was late." */
export const connectorIssues = (text: string): GrammarIssue[] => findConnectorIssues(text);

/** Passive mistakes: "was took" → taken, "was eat by" → eaten, "by she" → by her. */
export const voiceIssues = (text: string): GrammarIssue[] => findVoiceIssues(text);

/** Speech mistakes: commas and capitals in direct speech; "asked where was it", "told us sit", "said that “…”", backshift. */
export const speechIssues = (text: string): GrammarIssue[] => findSpeechIssues(text);

/** Sentence mistakes: fragments ("A big dog in the yard."), run-ons and comma splices. */
export const structureIssues = (text: string): GrammarIssue[] => findStructureIssues(text);

/** Capital and punctuation mistakes: "we went", "in the Summer", "dont", "its raining", "However we", "are: ". */
export const punctuationIssues = (text: string): GrammarIssue[] => findPunctuationIssues(text);

/** Style notes for sentence variety (stringy, choppy, too long, same opener): not counted as mistakes. */
export const varietyNotes = (text: string): GrammarIssue[] => findVarietyNotes(text);
export { SENTENCE_TYPES, SENTENCE_TYPE_LABELS, sentenceTypes } from './sentence-types.js';
export type { SentenceType, TypedSentence } from './sentence-types.js';

/** Every grammar mistake the checks know about, in the order they appear (one per stretch of text). */
export const grammarIssues = (text: string): GrammarIssue[] =>
  [
    ...nounIssues(text),
    ...pronounIssues(text),
    ...verbIssues(text),
    ...modifierIssues(text),
    ...connectorIssues(text),
    ...voiceIssues(text),
    ...speechIssues(text),
    ...structureIssues(text),
    ...punctuationIssues(text),
  ]
    .toSorted((a, b) => a.span.start - b.span.start)
    // "monday was fun": the day check and the sentence-capital check find the same word.
    .filter(
      (issue, i, all) =>
        all.findIndex((o) => o.span.start === issue.span.start && o.span.end === issue.span.end) ===
        i,
    );
