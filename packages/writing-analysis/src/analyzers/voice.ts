import { type Span, type WordToken, sentences, words } from '../text.js';
import type { GrammarIssue } from './grammar.js';
import { verbForms, verbHits } from './verbs.js';

/**
 * Active and passive voice for the Essay Writing track (Unit 5, DESIGN.md §9.12): find passive
 * verbs (a form of be + a past participle) and their tense, the "by" doer, and active sentences;
 * spot a wrong participle in the passive ("was took", "was eat by") and "by she"; and suggest the
 * active version of a passive sentence that names its doer. Word lists and patterns, no parser:
 * a guide, never a rule.
 */

export const VOICE_FEATURES = [
  'active-voice',
  'passive-voice',
  'passive-agent',
  'passive-present',
  'passive-past',
  'passive-future',
  'passive-progressive',
  'passive-perfect',
] as const;
export type VoiceFeature = (typeof VOICE_FEATURES)[number];

export const VOICE_FEATURE_LABELS: Record<VoiceFeature, string> = {
  'active-voice': 'the active voice',
  'passive-voice': 'the passive voice',
  'passive-agent': 'a passive with “by” and the doer',
  'passive-present': 'a present passive',
  'passive-past': 'a past passive',
  'passive-future': 'a future passive',
  'passive-progressive': 'a progressive passive',
  'passive-perfect': 'a perfect passive',
};

export const VOICE_FEATURE_EXAMPLES: Record<VoiceFeature, string> = {
  'active-voice': 'the doer first, then the action, like “The dog chased the ball”',
  'passive-voice': 'the receiver first + be + a past participle, like “The ball was chased”',
  'passive-agent': 'a passive that names the doer with “by”, like “was chased by the dog”',
  'passive-present': 'am, is or are + a past participle, like “is made” or “are sold”',
  'passive-past': 'was or were + a past participle, like “was built” or “were found”',
  'passive-future': 'will be + a past participle, like “will be announced”',
  'passive-progressive': 'is, are, was or were being + a past participle, like “is being painted”',
  'passive-perfect': 'has, have or had been + a past participle, like “has been eaten”',
};

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const { BE, BE_CONTRACTED, HAVE, MODALS, ADVERBS, BASES, SAME_FORMS } = verbForms;

/** -ed words that describe a feeling or state after be ("was tired"), unless "by" follows. */
const STATE = set(`tired excited interested bored scared frightened worried surprised amazed pleased
annoyed confused embarrassed disappointed relieved satisfied married supposed located crowded talented
determined exhausted thrilled terrified delighted shocked ashamed stressed involved convinced impressed
horrified fascinated overwhelmed puzzled stunned devastated qualified concerned dressed tied relaxed
amused drained enraged hushed packed`);
/** States that a person is in ("I'm done", "we were lost"), passive only with "by". */
const PERSON_STATE = set('done finished lost stuck gone hurt prepared shattered worn');
/** Participles of verbs that don't take an object: be + these is never passive ("is gone"). */
const INTRANSITIVE = set(
  'gone come become fallen risen arrived happened appeared seemed died slept sat stood',
);
const PERSONAL = set("i he she we they you i'm he's she's we're they're you're");
const PRESENT_BE = set(
  "am is are 's 're 'm isn't aren't i'm he's she's it's we're they're you're that's there's",
);
const PAST_BE = set("was were wasn't weren't");
const FUTURE = set("will shall won't 'll i'll we'll they'll you'll he'll she'll it'll");
/** Words that end the doer after "by" ("by Sam in the park"). */
const AGENT_STOP = set(`in on at into onto during after before with for to from under over through
across near behind beside who whom that which when while because yesterday today tonight last every
since until as and but so or than this next later soon again once twice together too also`);
const DESCRIBERS = set('a an the this that these those my your our their his her its every each');
/** "by Friday", "by the end of the day", "by car": a time or a way, not a doer. */
const NOT_A_DOER =
  set(`monday tuesday wednesday thursday friday saturday sunday january february march
april may june july august september october november december noon midnight tomorrow tonight lunch dinner
bedtime morning evening end time way car bus train bike plane boat hand mistake accident email phone mail
then now far`);
/** Little words after a verb that belong to it ("knocked over", "picked up"). */
const PARTICLES = set('up down over out off away in back');
const SUBJECT_FOR: Record<string, string> = {
  me: 'I',
  him: 'he',
  her: 'she',
  us: 'we',
  them: 'they',
  you: 'you',
  it: 'it',
};
const OBJECT_FOR: Record<string, string> = {
  i: 'me',
  he: 'him',
  she: 'her',
  we: 'us',
  they: 'them',
  you: 'you',
  it: 'it',
};
/** Irregular bases that are also describing words ("was light", "was mean"): not a missing -en. */
const ADJECTIVE_BASES = set('light mean lay free open clean close like dry');

const spanOf = (text: string, a: WordToken, b: WordToken = a): Span => ({
  start: a.start,
  end: b.end,
  text: text.slice(a.start, b.end),
});
const gap = (text: string, a: WordToken, b: WordToken) => text.slice(a.end, b.start);
const plainSpace = (text: string, a: WordToken, b: WordToken) => /^\s+$/.test(gap(text, a, b));
const isAdverb = (w: string) => ADVERBS.has(w) || (w.length > 4 && w.endsWith('ly'));
const isBeWord = (w: string) =>
  BE.has(w) || BE_CONTRACTED.has(w) || /^(?:it|that|there|what|who)'s$/.test(w);

/** A past participle: an irregular one ("taken"), a no-change one ("hit") or a regular -ed word. */
/** Participles the verb table doesn't list (it keeps one past per verb: "sewed" and "sewn" are both fine). */
const EXTRA_PARTICIPLES = new Map([
  ['sewn', 'sew'],
  ['shown', 'show'],
  ['woven', 'weave'],
  ['sworn', 'swear'],
  ['proven', 'prove'],
  ['mown', 'mow'],
  ['sought', 'seek'],
  ['bound', 'bind'],
]);

function isParticiple(w: string): boolean {
  return (
    verbForms.byParticiple(w) !== undefined ||
    SAME_FORMS.has(w) ||
    verbForms.isRegularEd(w) ||
    EXTRA_PARTICIPLES.has(w)
  );
}

/** A verb after will/can/should… that isn't be or have: "will thank", "can carry" (active). */
const NOT_AFTER_MODAL = set('be have been not never also always still just really even');
/** Noun + -s verb + a describer or preposition: "the sap drips into", "my uncle tests the". */
const AFTER_S_VERB = set(
  'a an the this that these those my your our their his her its every each into onto in on at to from with for over under through across up down out away back',
);

export interface PassiveVerb {
  /** The first helper ("will" in "will be eaten") to the participle. */
  span: Span;
  tense: 'present' | 'past' | 'future' | 'progressive' | 'perfect' | 'modal' | 'other';
  /** Token indexes in the sentence: the first helper, the be word and the participle. */
  helper: number;
  be: number;
  participle: number;
  /** The doer after "by" (token indexes, inclusive), if there is one. */
  agent?: { from: number; to: number };
  negative: boolean;
}

/** The doer after "by": up to five words, stopping at a comma or a word like "in" or "who". */
function agentAfter(
  text: string,
  tokens: readonly WordToken[],
  by: number,
): { from: number; to: number } | undefined {
  const first = tokens[by + 1];
  if (!first || !plainSpace(text, tokens[by]!, first)) return undefined;
  if (AGENT_STOP.has(first.lower) || /^\d/.test(first.text)) return undefined;
  if (NOT_A_DOER.has(first.lower)) return undefined;
  if (
    DESCRIBERS.has(first.lower) &&
    /^(?:end|time|way|middle|start)$/.test(tokens[by + 2]?.lower ?? '')
  )
    return undefined;
  let to = by + 1;
  while (
    to - by < 5 &&
    tokens[to + 1] &&
    plainSpace(text, tokens[to]!, tokens[to + 1]!) &&
    !AGENT_STOP.has(tokens[to + 1]!.lower) &&
    !isAdverb(tokens[to + 1]!.lower) &&
    !verbForms.isRegularEd(tokens[to + 1]!.lower) &&
    !verbForms.byPast(tokens[to + 1]!.lower)
  ) {
    to++;
  }
  // "by Sam and Leo": a second doer.
  if (
    tokens[to + 1]?.lower === 'and' &&
    tokens[to + 2] &&
    plainSpace(text, tokens[to]!, tokens[to + 1]!) &&
    /^\p{Lu}/u.test(tokens[to + 2]!.text)
  ) {
    to += 2;
  }
  return { from: by + 1, to };
}

/** Passive verbs in one sentence's words. */
export function passiveVerbs(text: string, tokens: readonly WordToken[]): PassiveVerb[] {
  const found: PassiveVerb[] = [];
  tokens.forEach((t, i) => {
    if (!isBeWord(t.lower)) return;
    let j = i + 1;
    let negative = t.lower.endsWith("n't");
    while (tokens[j] && isAdverb(tokens[j]!.lower)) {
      if (tokens[j]!.lower === 'not' || tokens[j]!.lower === 'never') negative = true;
      j++;
    }
    let p = tokens[j];
    // "is being eaten", "was being built".
    let progressive = false;
    if (p?.lower === 'being' && i + 1 === j) {
      progressive = true;
      j++;
      p = tokens[j];
    }
    if (!p || !isParticiple(p.lower) || !plainSpace(text, tokens[j - 1]!, p)) return;
    if (/^\p{Lu}/u.test(p.text)) return;
    // "She's finished her homework": 's is "has" when an object follows (active).
    const after = tokens[j + 1]?.lower ?? '';
    if (t.lower.endsWith("'s") && (DESCRIBERS.has(after) || OBJECT_FOR[after] !== undefined))
      return;
    if (INTRANSITIVE.has(p.lower)) return;
    // "was eaten by", "were driven home by", "was picked up by".
    const by =
      tokens[j + 1]?.lower === 'by'
        ? j + 1
        : tokens[j + 2]?.lower === 'by' &&
            /^(?:home|up|down|over|out|off|away|back)$/.test(tokens[j + 1]?.lower ?? '')
          ? j + 2
          : -1;
    const subject = tokens[i - 1]?.lower ?? '';
    if (by < 0) {
      if (STATE.has(p.lower)) return;
      if (PERSON_STATE.has(p.lower) && (PERSONAL.has(subject) || PERSONAL.has(t.lower))) return;
      // "I was used to the noise" (a habit) vs "a spoon was used to stir".
      if (
        p.lower === 'used' &&
        tokens[j + 1]?.lower === 'to' &&
        (DESCRIBERS.has(tokens[j + 2]?.lower ?? '') || verbForms.isIng(tokens[j + 2]?.lower ?? ''))
      )
        return;
      // "There was a crowd": only a participle counts, not "was red" or "were seed".
    }
    // Helpers before the be word: "will be", "has been", "can be", "is going to be".
    let helper = i;
    let tense: PassiveVerb['tense'] = 'other';
    const w = t.lower;
    if (progressive) tense = 'progressive';
    else if (PRESENT_BE.has(w) || /^(?:it|that|there|what|who)'s$/.test(w)) tense = 'present';
    else if (PAST_BE.has(w)) tense = 'past';
    else if (w === 'been') {
      const h = tokens[i - 1];
      if (h && (HAVE.has(h.lower) || h.lower.endsWith("'s"))) {
        helper = i - 1;
        tense = 'perfect';
        if (tokens[i - 2] && MODALS.has(tokens[i - 2]!.lower)) helper = i - 2;
      } else if (h && MODALS.has(h.lower)) {
        helper = i - 1;
      }
      if (tense !== 'perfect') {
        // "will have been built", "has never been seen".
        let k = i - 1;
        while (tokens[k] && isAdverb(tokens[k]!.lower)) k--;
        if (tokens[k] && HAVE.has(tokens[k]!.lower)) {
          helper = k;
          tense = 'perfect';
        }
      }
    } else if (w === 'be') {
      let k = i - 1;
      while (tokens[k] && isAdverb(tokens[k]!.lower)) {
        if (tokens[k]!.lower === 'not' || tokens[k]!.lower === 'never') negative = true;
        k--;
      }
      const h = tokens[k];
      if (h && (FUTURE.has(h.lower) || h.lower.endsWith("'ll"))) {
        helper = k;
        tense = 'future';
        if (h.lower === "won't") negative = true;
      } else if (h && MODALS.has(h.lower)) {
        helper = k;
        tense = 'modal';
        if (h.lower.endsWith("n't")) negative = true;
      } else if (h?.lower === 'to' && tokens[k - 1]?.lower === 'going') {
        helper = k - 1;
        if (tokens[k - 2] && isBeWord(tokens[k - 2]!.lower)) helper = k - 2;
        tense = 'future';
      } else if (h?.lower === 'to') {
        tense = 'other';
      } else return;
    } else if (w === 'being') return;
    found.push({
      span: spanOf(text, tokens[helper]!, p),
      tense,
      helper,
      be: i,
      participle: j,
      agent: by >= 0 ? agentAfter(text, tokens, by) : undefined,
      negative,
    });
  });
  return found;
}

export interface VoiceHit {
  feature: VoiceFeature;
  span: Span;
}

/** Voice features in one sentence's words. */
export function voiceHits(text: string, tokens: readonly WordToken[]): VoiceHit[] {
  const hits: VoiceHit[] = [];
  const passives = passiveVerbs(text, tokens);
  for (const p of passives) {
    hits.push({ feature: 'passive-voice', span: p.span });
    const tense = p.tense;
    if (tense !== 'modal' && tense !== 'other') {
      hits.push({ feature: `passive-${tense}`, span: p.span });
    }
    if (p.agent) {
      hits.push({
        feature: 'passive-agent',
        span: spanOf(text, tokens[p.helper]!, tokens[p.agent.to]),
      });
    }
  }
  // Active: an action verb with its doer in front (the passive's participle is never one).
  const inPassive = (s: Span) =>
    passives.some((p) => s.start >= p.span.start && s.end <= p.span.end);
  const active =
    verbHits(text, tokens).find((h) => h.feature === 'action-verb' && !inPassive(h.span))?.span ??
    // Verbs the word lists don't know: "will thank the", "the sap drips into".
    tokens
      .map((t, i) => {
        const prev = tokens[i - 1];
        const afterModal =
          prev !== undefined &&
          MODALS.has(prev.lower) &&
          /^[a-z]+$/.test(t.text) &&
          !NOT_AFTER_MODAL.has(t.lower) &&
          !isParticiple(t.lower);
        const sVerb =
          prev !== undefined &&
          DESCRIBERS.has(tokens[i - 2]?.lower ?? '') &&
          /^[a-z]{3,}s$/.test(t.text) &&
          !/(?:ss|us|is)$/.test(t.lower) &&
          AFTER_S_VERB.has(tokens[i + 1]?.lower ?? '');
        return afterModal || sVerb ? spanOf(text, t) : undefined;
      })
      .find((x) => x !== undefined && !inPassive(x));
  if (active) hits.push({ feature: 'active-voice', span: active });
  return hits;
}

// ───────── Rewriting: passive → active ─────────

const isPlural = (phrase: string) => {
  const ws = phrase.toLowerCase().split(/\s+/);
  const last = ws.at(-1) ?? '';
  if (ws.includes('and')) return true;
  if (/^(?:i|we|they|you|people|children|men|women|teeth|feet|mice)$/.test(last)) return true;
  return /^[a-z]{3,}s$/.test(last) && !/(?:ss|us|is)$/.test(last);
};

/** The base of a participle ("eaten" → eat, "chased" → chase), when the word lists know it. */
function baseOf(p: string): string | undefined {
  const irregular = verbForms.byParticiple(p);
  if (irregular) return irregular.base;
  const extra = EXTRA_PARTICIPLES.get(p);
  if (extra) return extra;
  if (SAME_FORMS.has(p)) return p;
  const candidates = [
    p.endsWith('ied') ? `${p.slice(0, -3)}y` : '',
    p.slice(0, -1),
    p.slice(0, -2),
    p.at(-3) === p.at(-4) ? p.slice(0, -3) : '',
  ];
  return candidates.find((c) => c && BASES.has(c));
}

const ingOf = (base: string) => {
  if (base.endsWith('ie')) return `${base.slice(0, -2)}ying`;
  if (base.endsWith('e') && !base.endsWith('ee')) return `${base.slice(0, -1)}ing`;
  if (/^[^aeiou]*[aeiou][bdgmnprt]$/.test(base)) return `${base}${base.at(-1)}ing`;
  return `${base}ing`;
};

/** The active verb for a passive one, agreeing with the new subject (the doer). */
function activeVerb(
  p: PassiveVerb,
  tokens: readonly WordToken[],
  doer: string,
): string | undefined {
  const part = tokens[p.participle]!.lower;
  const base = baseOf(part);
  const plural = isPlural(doer);
  const first = doer.toLowerCase() === 'i';
  switch (p.tense) {
    case 'past': {
      const irregular = verbForms.byParticiple(part);
      return irregular ? irregular.past : part;
    }
    case 'present':
      if (!base) return undefined;
      return plural ? base : verbForms.thirdPerson(base);
    case 'future':
    case 'modal': {
      const helper = tokens[p.helper]!;
      if (!base || p.be - p.helper !== 1) return undefined;
      return `${helper.text.toLowerCase()} ${base}`;
    }
    case 'perfect': {
      const helper = tokens[p.helper]!.lower;
      if (p.be - p.helper !== 1) return undefined;
      if (helper === 'had') return `had ${part}`;
      if (helper === 'has' || helper === 'have') return `${plural ? 'have' : 'has'} ${part}`;
      return undefined;
    }
    case 'progressive': {
      if (!base) return undefined;
      const be = tokens[p.be]!.lower;
      const past = be === 'was' || be === 'were';
      const helper = past
        ? plural && !first
          ? 'were'
          : 'was'
        : first
          ? 'am'
          : plural
            ? 'are'
            : 'is';
      return `${helper} ${ingOf(base)}`;
    }
    default:
      return undefined;
  }
}

const CLAUSE_STARTERS = set(
  'and but so or yet because when while if although though after before since until once as',
);

/**
 * The active version of a passive sentence that names its doer: "The ball was kicked by Sam." →
 * "Sam kicked the ball." Only for simple sentences the patterns understand; otherwise undefined.
 */
export function activeRewrite(
  text: string,
  sentence: Span,
  tokens: readonly WordToken[],
  p: PassiveVerb,
): string | undefined {
  // Only "was eaten by …": a word in between ("driven home by") would need moving too.
  if (!p.agent || p.negative || p.agent.from !== p.participle + 2) return undefined;
  // The receiver: from the start of the clause to the helper.
  let from = p.helper - 1;
  while (from >= 0 && !/[,;:—–]/.test(gap(text, tokens[from]!, tokens[from + 1]!))) from--;
  from++;
  if (tokens[from] && CLAUSE_STARTERS.has(tokens[from]!.lower)) from++;
  const receiver = tokens.slice(from, p.helper);
  if (receiver.length === 0 || receiver.length > 6) return undefined;
  if (receiver.some((t) => isBeWord(t.lower) || /^(?:who|which|that)$/.test(t.lower)))
    return undefined;
  const agent = tokens.slice(p.agent.from, p.agent.to + 1);
  // "by my mom and dad", "by the dog running…": the doer may go on, so don't guess.
  const afterAgent = tokens[p.agent.to + 1];
  if (
    afterAgent &&
    plainSpace(text, tokens[p.agent.to]!, afterAgent) &&
    (/^(?:and|or|but)$/.test(afterAgent.lower) || !AGENT_STOP.has(afterAgent.lower)) &&
    !isAdverb(afterAgent.lower)
  )
    return undefined;
  const adverbs = tokens.slice(p.helper + 1, p.participle).filter((t) => isAdverb(t.lower));
  const doerText = text.slice(agent[0]!.start, agent.at(-1)!.end);
  // "by J. K. Rowling" is cut short by the full stops.
  if (doerText.length < 2) return undefined;
  const doer = SUBJECT_FOR[doerText.toLowerCase()] ?? doerText;
  const verb = activeVerb(p, tokens, doer);
  if (!verb) return undefined;
  let receiverText = text.slice(receiver[0]!.start, receiver.at(-1)!.end);
  const r0 = receiver[0]!;
  if (receiver.length === 1 && OBJECT_FOR[r0.lower]) receiverText = OBJECT_FOR[r0.lower]!;
  else if (DESCRIBERS.has(r0.lower) || r0.lower === 'it')
    receiverText = r0.text.toLowerCase() + receiverText.slice(r0.text.length);
  const prefix = text.slice(sentence.start, r0.start);
  const atStart = prefix.trim() === '';
  const doerOut =
    atStart && doer.length > 0
      ? doer.charAt(0).toUpperCase() + doer.slice(1)
      : DESCRIBERS.has(agent[0]!.lower)
        ? doer.charAt(0).toLowerCase() + doer.slice(1)
        : doer;
  const rest = text.slice(agent.at(-1)!.end, sentence.end);
  const adv = adverbs.map((a) => `${a.text} `).join('');
  return `${prefix}${doerOut} ${adv}${verb} ${receiverText}${rest}`.trim();
}

export interface PassiveNote {
  sentence: Span;
  /** The passive verb ("was kicked by Sam"). */
  span: Span;
  /** The active version, when the doer is named and the sentence is simple. */
  rewrite?: string;
  hasAgent: boolean;
}

/** Every passive verb in a text, with the active version of each one that names its doer. */
export function passiveNotes(text: string): PassiveNote[] {
  const notes: PassiveNote[] = [];
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    for (const p of passiveVerbs(text, tokens)) {
      const end = p.agent ? tokens[p.agent.to]! : tokens[p.participle]!;
      notes.push({
        sentence: s,
        span: spanOf(text, tokens[p.helper]!, end),
        rewrite: activeRewrite(text, s, tokens, p),
        hasAgent: p.agent !== undefined,
      });
    }
  }
  return notes;
}

// ───────── Mistakes ─────────

/** Passive mistakes: the past instead of the participle ("was took"), a base verb ("was eat by"), "by she". */
export function findVoiceIssues(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  for (const s of sentences(text)) {
    const tokens = words(text, s.start, s.end);
    tokens.forEach((t, i) => {
      const w = t.lower;
      const prev = tokens[i - 1];
      // "by she" → by her.
      if (
        prev?.lower === 'by' &&
        OBJECT_FOR[w] &&
        !/^(?:you|it)$/.test(w) &&
        plainSpace(text, prev, t)
      ) {
        const next = tokens[i + 1];
        // "by I mean…" is something else; "by he and Sam" is pronounIssues' job.
        if (next?.lower === 'and' || (w === 'i' && next?.lower === 'mean')) return;
        const fix = OBJECT_FOR[w];
        issues.push({
          kind: 'by-pronoun',
          span: { start: t.start, end: t.end, text: t.text },
          fix,
          message: `After “by”, use the object pronoun: “by ${fix}”, not “by ${t.text}”.`,
        });
        return;
      }
      if (!prev) return;
      // Find the be word before, skipping little adverbs: "was quickly took".
      let k = i - 1;
      while (tokens[k] && isAdverb(tokens[k]!.lower)) k--;
      const be = tokens[k];
      if (!be || !(isBeWord(be.lower) || be.lower === 'being') || !plainSpace(text, prev, t))
        return;
      // "was took" → taken: the past form where the participle belongs.
      const forms = verbForms.byPast(w);
      if (/^\p{Lu}/u.test(t.text)) return;
      if (
        forms &&
        forms.past !== forms.participle &&
        w !== forms.participle &&
        !verbForms.byParticiple(w)
      ) {
        issues.push({
          kind: 'passive-form',
          span: { start: t.start, end: t.end, text: t.text },
          fix: forms.participle,
          message: `The passive needs the past participle: “${be.text} ${forms.participle}”, not “${be.text} ${t.text}”.`,
        });
        return;
      }
      // "was eat by the dog" → eaten.
      const base = verbForms.byBase(w);
      // "was knock over by" → knocked.
      const byNext =
        tokens[i + 1]?.lower === 'by' ||
        (PARTICLES.has(tokens[i + 1]?.lower ?? '') && tokens[i + 2]?.lower === 'by');
      if (
        !verbForms.byParticiple(w) &&
        !SAME_FORMS.has(w) &&
        !ADJECTIVE_BASES.has(w) &&
        ((base && base.participle !== w && base.past !== w) || (byNext && BASES.has(w)))
      ) {
        const fix = base ? base.participle : verbForms.regularPast(w);
        issues.push({
          kind: 'passive-form',
          span: { start: t.start, end: t.end, text: t.text },
          fix,
          message: `The passive needs the past participle: “${be.text} ${fix}”, not “${be.text} ${t.text}”.`,
        });
      }
    });
  }
  return issues;
}
