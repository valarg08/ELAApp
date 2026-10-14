import { type Span, type WordToken, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';

/**
 * Verbs for the Essay Writing track (Unit 2, DESIGN.md §9.12): find action, linking and helping
 * verbs, tenses and irregular pasts in a sentence, and spot common verb mistakes ("goed", "I seen",
 * "should of", "they was", tense slips). Word lists and patterns, no parser: a guide, never a rule.
 */

export const VERB_FEATURES = [
  'action-verb',
  'linking-verb',
  'helping-verb',
  'past-tense',
  'present-tense',
  'future-tense',
  'progressive',
  'perfect',
  'irregular-past',
] as const;
export type VerbFeature = (typeof VERB_FEATURES)[number];

export const VERB_FEATURE_LABELS: Record<VerbFeature, string> = {
  'action-verb': 'an action verb',
  'linking-verb': 'a linking verb',
  'helping-verb': 'a helping verb',
  'past-tense': 'a past-tense verb',
  'present-tense': 'a present-tense verb',
  'future-tense': 'a future-tense verb',
  progressive: 'a progressive verb',
  perfect: 'a perfect verb',
  'irregular-past': 'an irregular past verb',
};

export const VERB_FEATURE_EXAMPLES: Record<VerbFeature, string> = {
  'action-verb': 'something you do, like sprinted, whispers or will build',
  'linking-verb': 'a verb that links to a description, like is, was, seems or became',
  'helping-verb': 'a verb that helps the main verb, like will, has, was, can or did',
  'past-tense': 'something that already happened, like walked, was or ran',
  'present-tense': 'something happening now or always, like walks, is or run',
  'future-tense': 'something that will happen, like will win or is going to rain',
  progressive: 'a form of be + an -ing verb, like is running or were waiting',
  perfect: 'has, have or had + a past participle, like has finished or had eaten',
  'irregular-past': 'a past verb without -ed, like went, ran, caught or wrote',
};

const set = (s: string) => new Set(s.split(' '));

/** base past participle. */
const IRREGULAR_TABLE = `go went gone,come came come,see saw seen,take took taken,make made made,say said said,
get got gotten,give gave given,find found found,think thought thought,tell told told,feel felt felt,leave left left,
keep kept kept,know knew known,run ran run,sit sat sat,stand stood stood,hear heard heard,hold held held,
bring brought brought,begin began begun,become became become,fall fell fallen,grow grew grown,throw threw thrown,
catch caught caught,draw drew drawn,drive drove driven,eat ate eaten,drink drank drunk,swim swam swum,sing sang sung,
ring rang rung,write wrote written,ride rode ridden,speak spoke spoken,break broke broken,choose chose chosen,
wake woke woken,freeze froze frozen,hide hid hidden,bite bit bitten,shake shook shaken,steal stole stolen,
tear tore torn,wear wore worn,fly flew flown,blow blew blown,sleep slept slept,sweep swept swept,weep wept wept,
creep crept crept,mean meant meant,send sent sent,spend spent spent,build built built,lose lost lost,pay paid paid,
lay laid laid,lead led led,feed fed fed,flee fled fled,buy bought bought,fight fought fought,teach taught taught,
understand understood understood,forget forgot forgotten,win won won,stick stuck stuck,strike struck struck,
swing swung swung,hang hung hung,dig dug dug,meet met met,sink sank sunk,slide slid slid,spin spun spun,
sting stung stung,do did done,have had had,rise rose risen,shine shone shone,sell sold sold,light lit lit,
shoot shot shot,forgive forgave forgiven,bend bent bent,lend lent lent,deal dealt dealt`;

interface Forms {
  base: string;
  past: string;
  participle: string;
}

const IRREGULAR: Forms[] = IRREGULAR_TABLE.split(',').map((row) => {
  const [base = '', past = '', participle = ''] = row.trim().split(' ');
  return { base, past, participle };
});
const BY_PAST = new Map(IRREGULAR.map((f) => [f.past, f]));
const BY_PARTICIPLE = new Map(IRREGULAR.map((f) => [f.participle, f]));
const BY_BASE = new Map(IRREGULAR.map((f) => [f.base, f]));
/** Verbs whose past is the same as the base ("hurt", "put"): no -ed, no change. */
const SAME_FORMS = set('hurt cut put hit let set shut cost quit read beat bet burst spread split');

const REGULAR = set(
  'walk talk play jump look like love want need help call ask work live move start stop try use open close watch wait turn learn change finish carry hope climb laugh cry kick pull push pick reach smile shout listen visit study travel enjoy practice dance clean cook paint answer agree decide believe remember wish miss hate seem appear rain snow follow happen explain plan dream hurry worry arrive return save share show stay notice point join check care fix fill guess hug hunt knock lift mix nod race rush slip spill skip stare scream shiver whisper wonder yell argue bake borrow cheer clap crawl drop drag float grab hop jog march marry paddle pour pray print rest rob scrub search shop sniff splash sprint stomp trip trudge wander wash wave wink yawn taste smell sound complain describe discover imagine improve include prove protect support score vote',
);

const thirdPerson = (base: string) => {
  if (base === 'have') return 'has';
  if (/(?:s|x|z|ch|sh|o)$/.test(base)) return `${base}es`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ies`;
  return `${base}s`;
};
const BASES = new Set([...REGULAR, ...BY_BASE.keys(), ...SAME_FORMS]);
const BASE_OF_THIRD = new Map([...BASES].map((b) => [thirdPerson(b), b]));
const regularPast = (base: string) => {
  if (base.endsWith('e')) return `${base}d`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ied`;
  if (/^[^aeiou]*[aeiou][bdgmnprt]$/.test(base)) return `${base}${base.at(-1)}ed`;
  return `${base}ed`;
};

/** Made-up regular pasts of irregular verbs ("goed", "runned", "catched") → the real verb. */
const WRONG_PAST = new Map<string, Forms>();
const REAL_WORDS = set('hanged lighted shined seed leaded ringed sited wined singed costed teared');
for (const f of [
  ...IRREGULAR,
  ...[...SAME_FORMS].map((b) => ({ base: b, past: b, participle: b })),
]) {
  for (const wrong of [`${f.base}ed`, regularPast(f.base)]) {
    if (wrong !== f.past && wrong !== f.participle && !REAL_WORDS.has(wrong)) {
      WRONG_PAST.set(wrong, f);
    }
  }
}
for (const [wrong, base] of [
  ['brang', 'bring'],
  ['brung', 'bring'],
  ['thunk', 'think'],
  ['swang', 'swing'],
  ['drownded', 'drown'],
  ['attackted', 'attack'],
] as const) {
  WRONG_PAST.set(wrong, BY_BASE.get(base) ?? { base, past: `${base}ed`, participle: `${base}ed` });
}

const BE = set('am is are was were be been being');
const BE_CONTRACTED = set(
  "i'm we're they're you're he's she's it's isn't aren't wasn't weren't there's that's",
);
const HAVE = set("have has had i've we've they've you've haven't hasn't hadn't");
const DO = set("do does did don't doesn't didn't");
const MODALS = set(
  "will would can could shall should may might must won't wouldn't can't couldn't shouldn't i'll we'll they'll you'll he'll she'll it'll",
);
const FUTURE = set("will shall won't i'll we'll they'll you'll he'll she'll it'll");
const ALWAYS_LINKING = set(
  'seem seems seemed become becomes became appear appears appeared remain remains remained',
);
const SENSE_LINKING = set(
  'feel feels felt look looks looked sound sounds sounded smell smells smelled taste tastes tasted',
);
/** Words that make a sense verb an action instead ("looked at", "felt the sand"). */
const NOT_DESCRIPTION = set(
  'a an the this that these those my your our their his her its me him us them it at for in on into over through around up down out away back like with to after by under',
);
const ADVERBS = set(
  'not never always just already still really ever often finally suddenly quickly slowly also soon',
);
const NOT_ING = set(
  'thing things something nothing anything everything morning evening during king ring rings sing wing string spring ceiling bring sting swing cling fling',
);
const NOT_PAST_ED = set(
  'bed red shed sled need seed feed speed weed bleed breed greed deed hundred sacred wicked naked ragged rugged jagged beloved kindred indeed',
);
const SUBJECT = set('i he she we they');
const STARTERS = set(
  'and but or so because when while if that then after before until since although though',
);
const NOT_A_VERB = set(
  'and or but too also all both never always often still just really then not only even soon finally almost sometimes usually each who that which',
);
const DESCRIBERS = set('a an the this that these those my your our their his its every each');
const INDEFINITE = set(
  'everyone everybody someone somebody anyone anybody nobody everything something nothing anything',
);

const isIng = (w: string) => w.length >= 5 && w.endsWith('ing') && !NOT_ING.has(w);
const isRegularEd = (w: string) => w.length > 3 && w.endsWith('ed') && !NOT_PAST_ED.has(w);
const isParticiple = (w: string) => BY_PARTICIPLE.has(w) || SAME_FORMS.has(w) || isRegularEd(w);

/** The next word after `i`, skipping little adverbs ("has never been", "was still running"). */
function nextVerbIndex(tokens: readonly WordToken[], i: number): number {
  let j = i + 1;
  while (tokens[j] && ADVERBS.has(tokens[j]!.lower)) j++;
  return j;
}

const spanOf = (text: string, a: WordToken, b: WordToken = a): Span => ({
  start: a.start,
  end: b.end,
  text: text.slice(a.start, b.end),
});

export interface VerbHit {
  feature: VerbFeature;
  span: Span;
}

/** A subject pronoun the next word belongs to: I/he/she/we/they, or "it"/"you" starting a clause. */
function isSubjectAt(text: string, tokens: readonly WordToken[], i: number): boolean {
  const t = tokens[i];
  if (!t) return false;
  if (SUBJECT.has(t.lower)) return true;
  if (t.lower !== 'it' && t.lower !== 'you') return false;
  const prev = tokens[i - 1];
  return !prev || STARTERS.has(prev.lower) || /[,;:]/.test(text.slice(prev.end, t.start));
}

/** Verb features in one sentence's words. */
export function verbHits(text: string, tokens: readonly WordToken[]): VerbHit[] {
  const hits: VerbHit[] = [];
  const add = (feature: VerbFeature, span: Span) => hits.push({ feature, span });
  tokens.forEach((t, i) => {
    const w = t.lower;
    const prev = tokens[i - 1];
    const j = nextVerbIndex(tokens, i);
    const next = tokens[j];
    const isBe = BE.has(w) || BE_CONTRACTED.has(w);
    const isHave = HAVE.has(w);

    // Helping verbs: modals, be + -ing, have + participle, do + verb.
    let helping = false;
    if (MODALS.has(w) && !(prev && DESCRIBERS.has(prev.lower))) {
      helping = true;
      if (FUTURE.has(w) && next) add('future-tense', spanOf(text, t, next));
    } else if (isBe && next && isIng(next.lower)) {
      helping = true;
      add('progressive', spanOf(text, t, next));
      if (
        /^(?:am|is|are|i'm|we're|they're|you're|he's|she's|it's)$/.test(w) &&
        next.lower === 'going' &&
        tokens[j + 1]?.lower === 'to'
      ) {
        const verb = tokens[j + 2];
        if (verb && !DESCRIBERS.has(verb.lower)) add('future-tense', spanOf(text, t, verb));
      }
    } else if (isHave && next && (isParticiple(next.lower) || next.lower === 'been')) {
      helping = true;
      add('perfect', spanOf(text, t, next));
    } else if (DO.has(w) && next && (BASES.has(next.lower) || next.lower === 'not')) {
      helping = true;
    }
    if (helping) add('helping-verb', spanOf(text, t));

    // Linking verbs: be on its own ("was tired"), seem/become, and sense verbs with a description.
    if (isBe && !helping) add('linking-verb', spanOf(text, t));
    if (ALWAYS_LINKING.has(w)) add('linking-verb', spanOf(text, t));
    const senseLinking =
      SENSE_LINKING.has(w) &&
      tokens[i + 1] !== undefined &&
      !NOT_DESCRIPTION.has(tokens[i + 1]!.lower) &&
      !(prev && DESCRIBERS.has(prev.lower));
    if (senseLinking) add('linking-verb', spanOf(text, t));

    // Action verbs: known verbs, -ed verbs, and the word right after a subject pronoun.
    const afterDescriber = prev !== undefined && DESCRIBERS.has(prev.lower);
    const afterBe =
      prev !== undefined &&
      (BE.has(prev.lower) ||
        BE_CONTRACTED.has(prev.lower) ||
        ALWAYS_LINKING.has(prev.lower) ||
        SENSE_LINKING.has(prev.lower));
    const known =
      BASES.has(w) ||
      BASE_OF_THIRD.has(w) ||
      BY_PAST.has(w) ||
      BY_PARTICIPLE.has(w) ||
      (isIng(w) && BASES.has(w.slice(0, -3))) ||
      isRegularEd(w);
    const afterSubject =
      prev !== undefined &&
      isSubjectAt(text, tokens, i - 1) &&
      /^[a-z]+$/.test(t.text) &&
      !w.endsWith('ly') &&
      !NOT_A_VERB.has(w);
    const isAction =
      !isBe &&
      !isHave &&
      !(DO.has(w) && helping) &&
      !MODALS.has(w) &&
      !ALWAYS_LINKING.has(w) &&
      !senseLinking &&
      !afterDescriber &&
      !(afterBe && !isIng(w)) &&
      (known || afterSubject);
    if (isAction) add('action-verb', spanOf(text, t));

    // Tense of the verb.
    const afterHave = prev !== undefined && HAVE.has(prev.lower);
    const afterModal = prev !== undefined && MODALS.has(prev.lower);
    if (/^(?:was|were|did|had|wasn't|weren't|didn't|hadn't)$/.test(w)) {
      add('past-tense', spanOf(text, t));
    } else if (
      (BY_PAST.has(w) || (isRegularEd(w) && isAction)) &&
      !afterHave &&
      !afterModal &&
      !afterDescriber &&
      !afterBe
    ) {
      add('past-tense', spanOf(text, t));
      const forms = BY_PAST.get(w);
      if (forms && !/^(?:had|did)$/.test(w)) add('irregular-past', spanOf(text, t));
    }
    const present =
      /^(?:am|is|are|has|does|isn't|aren't|hasn't|doesn't|i'm|we're|they're|you're)$/.test(w) ||
      (/^(?:he's|she's|it's)$/.test(w) && next !== undefined) ||
      (prev !== undefined &&
        isSubjectAt(text, tokens, i - 1) &&
        (/^(?:i|we|they|you)$/.test(prev.lower)
          ? (BASES.has(w) && !SAME_FORMS.has(w)) || /^(?:have|do|don't|haven't)$/.test(w)
          : BASE_OF_THIRD.has(w))) ||
      // "Maya walks", "The dog barks"
      (BASE_OF_THIRD.has(w) &&
        prev !== undefined &&
        !afterDescriber &&
        (/^\p{Lu}/u.test(prev.text) ||
          (tokens[i - 2] !== undefined && DESCRIBERS.has(tokens[i - 2]!.lower))));
    if (present) add('present-tense', spanOf(text, t));
  });
  return hits;
}

// ───────── Mistakes ─────────

const AGREE_I: Record<string, string> = {
  is: 'am',
  are: 'am',
  has: 'have',
  does: 'do',
  "doesn't": 'don’t',
  "hasn't": 'haven’t',
};
const AGREE_PLURAL: Record<string, string> = {
  is: 'are',
  was: 'were',
  am: 'are',
  has: 'have',
  does: 'do',
  "isn't": 'aren’t',
  "wasn't": 'weren’t',
  "doesn't": 'don’t',
  "hasn't": 'haven’t',
};
const AGREE_ONE: Record<string, string> = {
  are: 'is',
  am: 'is',
  were: 'was',
  have: 'has',
  do: 'does',
  "aren't": 'isn’t',
  "weren't": 'wasn’t',
  "don't": 'doesn’t',
  "haven't": 'hasn’t',
};
/** Little words that start a phrase between a subject and its verb ("the box of crayons"). */
const PHRASE_STARTS = set(
  'in on of with near behind under at from by inside outside beside to for about among between like around after before during across through over into onto without',
);
/** First words that tell the reader the time has changed ("Now I know…", "Last week it rained"). */
const TIME_SIGNALS = set(
  'now today nowadays tomorrow someday later next currently these still last yesterday earlier once back years when',
);
/** "if she were", "I wish I were": were is right here. */
const WERE_OK = set('if wish though as');
const QUESTION_HELPERS = set(
  'do does did will would can could should may might must let make made help helped watch watched saw see heard hear',
);

/** Verb mistakes: made-up pasts, missing helpers, "should of", subject–verb agreement, tense slips. */
export function findVerbIssues(
  text: string,
  isPluralNoun: (tokens: WordToken[], i: number) => boolean,
): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    tokens.forEach((t, i) => {
      const w = t.lower;
      const prev = tokens[i - 1];
      const before = tokens[i - 2];
      const span = spanOf(text, t);

      const wrong = WRONG_PAST.get(w);
      if (wrong) {
        const helped = prev !== undefined && HAVE.has(prev.lower);
        const fix = helped ? wrong.participle : wrong.past;
        issues.push({
          kind: 'wrong-past',
          span,
          fix,
          message: `“${wrong.base}” is an irregular verb, so it doesn’t add -ed. ${helped ? `After “${prev.text}”, use “${fix}”.` : `Its past tense is “${fix}”.`}`,
        });
        return;
      }

      // "I seen", "she done": a participle with no helper.
      const forms = BY_PARTICIPLE.get(w);
      const inverted =
        before !== undefined &&
        (HAVE.has(before.lower) ||
          BE.has(before.lower) ||
          MODALS.has(before.lower) ||
          DO.has(before.lower));
      if (
        forms &&
        forms.past !== forms.participle &&
        forms.participle !== forms.base &&
        prev &&
        !inverted &&
        isSubjectAt(text, tokens, i - 1)
      ) {
        issues.push({
          kind: 'missing-helper',
          span,
          fix: forms.past,
          message: `“${t.text}” needs a helping verb (“${prev.lower === 'i' ? 'I' : prev.text} ${/^(?:he|she|it)$/.test(prev.lower) ? 'has' : 'have'} ${t.text}”). For the simple past, use “${forms.past}”.`,
        });
        return;
      }
      if (w === 'been' && prev && !inverted && isSubjectAt(text, tokens, i - 1)) {
        const fix = /^(?:we|they|you)$/.test(prev.lower) ? 'were' : 'was';
        issues.push({
          kind: 'missing-helper',
          span,
          fix,
          message: `“been” needs a helping verb (“have been”). For the simple past, use “${fix}”.`,
        });
        return;
      }

      // "have went", "had ran": the past form after have/has/had.
      const pastForm = BY_PAST.get(w);
      let h = i - 1;
      while (tokens[h] && ADVERBS.has(tokens[h]!.lower)) h--;
      // "Has she ever drove…?"
      if (
        /^(?:i|he|she|it|we|they|you)$/.test(tokens[h]?.lower ?? '') &&
        HAVE.has(tokens[h - 1]?.lower ?? '')
      )
        h--;
      const helper = tokens[h];
      if (
        pastForm &&
        pastForm.past !== pastForm.participle &&
        helper &&
        HAVE.has(helper.lower) &&
        w !== 'had'
      ) {
        issues.push({
          kind: 'helper-past',
          span,
          fix: pastForm.participle,
          message: `After “${helper.text}”, use the past participle: “${helper.text} ${pastForm.participle}”, not “${helper.text} ${t.text}”.`,
        });
        return;
      }

      // "should of" → "should have".
      if (w === 'of' && prev && /^(?:should|could|would|must|might)$/.test(prev.lower)) {
        issues.push({
          kind: 'should-of',
          span: spanOf(text, prev, t),
          fix: `${prev.text} have`,
          message: `It sounds like “${prev.lower} of”, but it’s “${prev.lower} have” (or “${prev.lower}’ve”).`,
        });
        return;
      }

      // Subject–verb agreement after a pronoun, a plural noun or "everyone".
      if (!prev) return;
      const p = prev.lower;
      // "My friends and I is" → are (two subjects); "I ran and I is" is wrong either way.
      if (p === 'i' && before?.lower === 'and' && w === 'is') {
        issues.push({
          kind: 'agreement',
          span,
          fix: 'are',
          message: 'Two subjects joined by “and” are plural, so the verb is plural: “… and I are”.',
        });
        return;
      }
      // "The robots in the cupboard was": cover the phrase between the subject and the verb.
      const phraseSubject = tokens[i - 4];
      if (
        AGREE_PLURAL[w] &&
        phraseSubject &&
        PHRASE_STARTS.has(tokens[i - 3]!.lower) &&
        DESCRIBERS.has(tokens[i - 2]!.lower) &&
        isPluralNoun(tokens, i - 4)
      ) {
        const fix = AGREE_PLURAL[w];
        issues.push({
          kind: 'agreement',
          span,
          fix,
          message: `The subject is “${phraseSubject.text}” (more than one), not “${prev.text}”. Cover “${tokens[i - 3]!.text} ${tokens[i - 2]!.text} ${prev.text}”: “${phraseSubject.text} ${fix}”.`,
        });
        return;
      }
      // "Did he go", "let them play", "Sam and he…" (two subjects).
      if (
        before &&
        (QUESTION_HELPERS.has(before.lower) ||
          inverted ||
          (/^(?:and|or)$/.test(before.lower) && /^(?:i|he|she|it)$/.test(p)))
      )
        return;
      let fix: string | undefined;
      let who = '';
      if (p === 'i') {
        fix = AGREE_I[w] ?? (BASE_OF_THIRD.has(w) ? BASE_OF_THIRD.get(w) : undefined);
        who = '“I”';
      } else if (/^(?:we|they)$/.test(p) || (p === 'you' && isSubjectAt(text, tokens, i - 1))) {
        fix = AGREE_PLURAL[w] ?? (BASE_OF_THIRD.has(w) ? BASE_OF_THIRD.get(w) : undefined);
        who = `“${prev.text}”`;
      } else if (/^(?:he|she)$/.test(p) || (p === 'it' && isSubjectAt(text, tokens, i - 1))) {
        if (w === 'were' && before && WERE_OK.has(before.lower)) return;
        fix =
          AGREE_ONE[w] ??
          (BASES.has(w) && !SAME_FORMS.has(w) && w !== 'lay' ? thirdPerson(w) : undefined);
        who = `“${prev.text}” (one person or thing)`;
      } else if (INDEFINITE.has(p)) {
        fix = AGREE_ONE[w] ?? (BASES.has(w) && !SAME_FORMS.has(w) ? thirdPerson(w) : undefined);
        who = `“${prev.text}” (it means each one, so it’s singular)`;
      } else if (
        isPluralNoun(tokens, i - 1) &&
        // "the crowd in the stands was": a plural inside a phrase isn't the subject.
        !tokens.slice(Math.max(0, i - 4), i - 1).some((x) => PHRASE_STARTS.has(x.lower))
      ) {
        fix = AGREE_PLURAL[w];
        who = `“${prev.text}” (more than one)`;
      }
      if (fix) {
        issues.push({
          kind: 'agreement',
          span,
          fix,
          message: `The verb must agree with its subject. With ${who}, use “${fix}”: “${prev.text} ${fix}”.`,
        });
      }
    });
  }

  // A sentence or two that slips out of the paragraph's tense.
  // (Sentences with speech marks are skipped: characters may speak in any tense.)
  const tensed = sentences(text).flatMap((sentence) => {
    if (/[“”"]/.test(sentence.text)) return [];
    const first = words(text, sentence.start, sentence.end)[0];
    if (first && TIME_SIGNALS.has(first.lower)) return [];
    const hits = verbHits(text, words(text, sentence.start, sentence.end));
    const past = hits.some((x) => x.feature === 'past-tense');
    const present = hits.some((x) => x.feature === 'present-tense');
    if (past === present) return [];
    return [{ sentence, tense: past ? ('past' as const) : ('present' as const) }];
  });
  const pastCount = tensed.filter((x) => x.tense === 'past').length;
  const main = pastCount * 2 > tensed.length ? 'past' : 'present';
  const off = tensed.filter((x) => x.tense !== main);
  const mainCount = tensed.length - off.length;
  if (tensed.length >= 3 && off.length <= 2 && mainCount >= off.length * 2) {
    const other = main === 'past' ? 'present' : 'past';
    for (const { sentence } of off) {
      issues.push({
        kind: 'tense-shift',
        span: sentence,
        message: `Most of your writing is in the ${main} tense, but this sentence is in the ${other}. Keep the same tense unless the time really changes.`,
      });
    }
  }
  return issues;
}
