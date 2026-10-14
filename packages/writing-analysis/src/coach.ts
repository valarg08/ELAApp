import { dialogue } from './analyzers/dialogue.js';
import {
  type Narrator,
  type Pov,
  type Tense,
  firstPersonGaps,
  narratorReach,
  offTenseSentences,
  pointOfView,
  povShifts,
  shiftSpan,
  splitSections,
  tense,
  thirdPersonSlips,
} from './analyzers/narration.js';
import {
  TONE_AXES,
  type ToneAxis,
  type ToneStep,
  tone,
  toneIdeas,
  tonePoleOf,
  toneStepLabel,
} from './analyzers/tone.js';
import { type Sense, senses } from './analyzers/senses.js';
import { type Device, figurative } from './analyzers/figurative.js';
import {
  SOUND_DEVICES,
  type SoundDevice,
  checkSyllablePattern,
  lineBreaks,
  poemLines,
  soundDevices,
} from './analyzers/poetry.js';
import { type PacingSegment, pacing } from './analyzers/pacing.js';
import {
  MOOD_AXES,
  MOOD_WORDS,
  type MoodPole,
  axisOf,
  mood,
  oppositeOf,
} from './analyzers/mood.js';
import { sentenceVariety } from './analyzers/stats.js';
import {
  GRAMMAR_FEATURE_EXAMPLES,
  GRAMMAR_FEATURE_LABELS,
  type GrammarFeature,
  type GrammarIssue,
  grammarFeatures,
  connectorIssues,
  grammarSkillOf,
  modifierIssues,
  nounIssues,
  passiveNotes,
  pronounIssues,
  verbIssues,
  veryPhrases,
  speechIssues,
  voiceIssues,
} from './analyzers/grammar.js';
import { filterWords, telling } from './analyzers/word-choice.js';
import { type Span, countWords, sentenceAt, sentences } from './text.js';

/** Checks an activity can switch on for the Coach panel (content: `analyzers` on writing activities). */
export const ANALYZER_IDS = [
  'telling',
  'filterWords',
  'senses',
  'sentenceVariety',
  'dialogue',
  'pov',
  'tense',
  'mood',
  'pacing',
  'tone',
  'figurative',
  'syllables',
  'lineBreaks',
  'sound',
  'nouns',
  'pronouns',
  'verbs',
  'modifiers',
  'connectors',
  'voice',
  'speech',
] as const;
export type AnalyzerId = (typeof ANALYZER_IDS)[number];

/** Used when an activity doesn't choose. */
export const DEFAULT_ANALYZERS: readonly AnalyzerId[] = [
  'telling',
  'filterWords',
  'senses',
  'sentenceVariety',
];

export interface CoachCard {
  id: string;
  analyzer: AnalyzerId | 'length';
  title: string;
  message: string;
  /** Where in the text this card points (for "Show me"). */
  span?: Span;
}

export interface CoachReport {
  wordCount: number;
  /** 1–2 things done well. */
  strengths: CoachCard[];
  /** At most 3 next steps, most important first. */
  nextSteps: CoachCard[];
  /** Sense counts, when the senses check ran (for the senses meter). */
  senses?: Record<Sense, number>;
  /** Story parts with their pace, when the pacing check ran (for the pacing band). */
  pacing?: Pick<PacingSegment, 'start' | 'end' | 'text' | 'pace' | 'at'>[];
  /** Per tone scale, what the student aimed for and where their words sit (for the tone sliders). */
  tone?: { axis: ToneAxis; aimed: ToneStep | null; heard: ToneStep | null }[];
  /** Per figurative device (the activity's goals, or all three), how many and the first one. */
  figurative?: { device: Device; count: number; span?: Span }[];
  /** Per part of a multi-perspective rewrite, whether it keeps its point of view. */
  perspectives?: PerspectiveCheck[];
  /** Sound devices found, when the sound check ran (Unit 7). */
  sound?: { device: SoundDevice; count: number; span?: Span }[];
}

export interface Perspective {
  label: string;
  pov: Pov;
  narrator?: Narrator;
}

export interface PerspectiveCheck extends Perspective {
  status: 'ok' | 'missing' | 'short' | 'shift' | 'narrator';
  /** The slip, or the start of the part. */
  span?: Span;
}

export interface CoachOptions {
  analyzers?: readonly AnalyzerId[];
  povLock?: Pov;
  tenseLock?: Tense;
  /** Moods the student chose for their setting (Unit 3); the mood check compares against them. */
  moods?: readonly MoodPole[];
  /** Third person only: one character's mind (limited) or everyone's (omniscient). */
  narrator?: Narrator;
  /** Parts of a multi-perspective rewrite, each with its own point of view (Unit 5). */
  perspectives?: readonly Perspective[];
  /** Figurative devices the activity asks for (Unit 6); the figurative check looks for each. */
  devices?: readonly Device[];
  /** Syllables per line for each stanza (haiku: [5, 7, 5]) and the student's own counts (Unit 7). */
  syllablePattern?: readonly number[];
  syllableOverrides?: Readonly<Record<string, number>>;
  /** The tone the student aimed for, per scale (Unit 5). */
  tone?: Partial<Record<ToneAxis, ToneStep>>;
  /** Grammar the activity practises (Essay Writing): the Coach looks for each. */
  grammarFocus?: readonly GrammarFeature[];
}

const MAX_STRENGTHS = 2;
const MAX_NEXT_STEPS = 3;
const MIN_WORDS = 5;

const SENSE_LABELS: Record<Sense, string> = {
  sight: 'sight',
  sound: 'sound',
  smell: 'smell',
  taste: 'taste',
  touch: 'touch',
};
const SENSE_PROMPTS: Record<Sense, string> = {
  sight: 'What colours, shapes or light could the reader see?',
  sound: 'What could the reader hear right now?',
  smell: 'What does this place smell like?',
  taste: 'Is there a taste in the air or in someone’s mouth?',
  touch: 'What could someone feel on their skin or in their hands?',
};
const SOUND_TIPS: Record<SoundDevice, string> = {
  alliteration: 'Start a few words close together with the same sound: “silver snakes slither”.',
  repetition: 'Repeat a line or phrase, like a chorus. It gives the poem a heartbeat.',
  rhyme: 'End two nearby lines with words that sound alike: night / light.',
  onomatopoeia: 'Use a word that sounds like its meaning: crash, sizzle, whoosh, drip.',
};

const DEVICE_TIPS: Record<Device, string> = {
  simile:
    'Compare something to something else using “like” or “as”: “The hallway was as quiet as a held breath.”',
  metaphor: 'Say something IS something else, without “like”: “The playground was a battlefield.”',
  personification:
    'Give an object or place a human action: “The old stairs groaned under every step.”',
};
const DEVICE_PRAISE: Record<Device, string> = {
  simile: 'compares two things with “like” or “as”, so the reader sees it in a new way.',
  metaphor: 'says one thing IS another. That makes a strong picture.',
  personification: 'gives something non-human a human action. It brings the scene to life.',
};

/** A part of a rewrite needs this many words before its point of view is checked. */
export const MIN_PART_WORDS = 15;

const NARRATOR_LABELS: Record<Narrator, string> = {
  limited: 'third person limited',
  omniscient: 'third person omniscient',
};
export const perspectiveName = (p: Pick<Perspective, 'pov' | 'narrator'>) =>
  p.pov === 'third' && p.narrator ? NARRATOR_LABELS[p.narrator] : `${p.pov} person`;

const POV_LABELS: Record<Pov, string> = {
  first: 'first person (I, me, my)',
  second: 'second person (you)',
  third: 'third person (he, she, they)',
};

const quote = (s: Span) => {
  const t = s.text.trim().replace(/\s+/g, ' ');
  return t.length > 90 ? `${t.slice(0, 87)}…` : t;
};
/** "a", "a and b", "a, b and c". */
const listing = (items: readonly string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Turn the deterministic checks into a few kid-friendly cards (DESIGN.md §8.1 tone: warm, specific,
 * "you could try…"). Pure and fast enough to run on every click in the browser.
 */
export function buildCoachReport(text: string, options: CoachOptions = {}): CoachReport {
  const enabled = new Set(options.analyzers ?? DEFAULT_ANALYZERS);
  if (options.povLock) enabled.add('pov');
  if (options.tenseLock) enabled.add('tense');
  if (options.narrator || options.perspectives?.length) enabled.add('pov');
  if (options.devices?.length) enabled.add('figurative');
  if (options.syllablePattern?.length) enabled.add('syllables');
  const wordCount = countWords(text);
  const strengths: CoachCard[] = [];
  const nextSteps: CoachCard[] = [];
  const report: CoachReport = { wordCount, strengths, nextSteps };

  // Poems are short: a haiku is about a dozen words.
  const poem = enabled.has('syllables') || enabled.has('lineBreaks') || enabled.has('sound');
  if (wordCount < (poem ? 3 : MIN_WORDS)) {
    nextSteps.push({
      id: 'length',
      analyzer: 'length',
      title: 'Keep writing',
      message: 'Write a few sentences first, then check again. Quill needs something to read!',
    });
    return report;
  }

  // Lock problems come first: they block submitting.
  if (enabled.has('pov') && options.perspectives?.length) {
    const checks = checkPerspectives(text, options.perspectives);
    report.perspectives = checks;
    const problem = checks.find((c) => c.status !== 'ok');
    if (problem) nextSteps.push(perspectiveCard(problem));
    else if (checks.length > 1) {
      strengths.push({
        id: 'perspectives',
        analyzer: 'pov',
        title: `${checks.length} points of view`,
        message: `Each part keeps its own point of view: ${listing(checks.map(perspectiveName))}. That's hard to do!`,
      });
    }
  } else if (enabled.has('pov')) {
    const pov = pointOfView(text);
    const lock = options.povLock;
    const shifts = lock ? povShifts(pov, lock) : [];
    const gap = (lock ?? pov.guess) === 'first' ? firstPersonGaps(text)[0] : undefined;
    if (lock && shifts[0]) {
      nextSteps.push({
        id: 'pov-lock',
        analyzer: 'pov',
        title: 'Check your point of view',
        message: `This piece should be told in the ${POV_LABELS[lock]}. “${quote(shifts[0])}” slips out of it. Speech inside quotation marks is fine.`,
        span: shifts[0],
      });
    } else if (!lock && pov.counts.first > 0 && pov.counts.third > 0 && pov.guess === 'third') {
      const slip = pov.spans.first[0];
      nextSteps.push({
        id: 'pov-mixed',
        analyzer: 'pov',
        title: 'Pick one point of view',
        message: `Most of your story uses he/she/they, but “${slip ? quote(slip) : 'I'}” switches to I. Is that on purpose?`,
        span: slip,
      });
    } else if (gap) {
      nextSteps.push({
        id: 'pov-gap',
        analyzer: 'pov',
        title: 'Still in first person?',
        message: `From “${quote(gap)}” there are a few sentences in a row about he or she, with no I, me or my. Is that another character, or did your narrator slip into third person? If it's your narrator, use I and my.`,
        span: gap,
      });
    } else if (
      lock &&
      options.analyzers?.includes('pov') &&
      pov.guess === lock &&
      wordCount >= 30
    ) {
      strengths.push({
        id: 'pov-steady',
        analyzer: 'pov',
        title: 'Steady point of view',
        message: `You stay in the ${POV_LABELS[lock]} all the way through.`,
      });
    }
    if (options.narrator && (!lock || lock === 'third') && !shifts[0]) {
      const card = narratorCard(narratorReach(text), options.narrator, wordCount);
      if (card) (card.id === 'narrator-ok' ? strengths : nextSteps).push(card);
    }
  }

  if (enabled.has('tense')) {
    const t = tense(text);
    const expected =
      options.tenseLock ?? (t.guess === 'past' || t.guess === 'present' ? t.guess : undefined);
    const off = expected ? offTenseSentences(t, expected) : [];
    if (expected && off[0] && (options.tenseLock || off.length <= 3)) {
      nextSteps.push({
        id: 'tense',
        analyzer: 'tense',
        title: 'Keep to one tense',
        message: `Your story is in the ${expected} tense, but “${quote(off[0])}” is in the ${expected === 'past' ? 'present' : 'past'}. You could change it to match.`,
        span: off[0],
      });
    } else if (t.guess === 'mixed' && !options.tenseLock) {
      nextSteps.push({
        id: 'tense-mixed',
        analyzer: 'tense',
        title: 'Past or present?',
        message:
          'Your story jumps between past (walked, was) and present (walks, is). Pick one and stick with it.',
      });
    }
  }

  if (enabled.has('mood') && wordCount >= 15) {
    const m = mood(text);
    const words = (pole: MoodPole) => [
      ...new Set(m.hits.filter((h) => h.pole === pole).map((h) => h.word)),
    ];
    const ideas = (pole: MoodPole) =>
      MOOD_WORDS[pole]
        .filter((w) => w !== pole && !words(pole).includes(w))
        .slice(0, 4)
        .join(', ');
    const chosen = options.moods ?? [];
    let step: CoachCard | undefined;
    const matched: MoodPole[] = [];
    for (const pole of chosen) {
      const leaning = m.leaning[axisOf(pole)];
      if (leaning === pole) {
        matched.push(pole);
        continue;
      }
      if (step) continue;
      const opposite = oppositeOf(pole);
      const against = m.hits.find((h) => h.pole === opposite);
      step =
        leaning === opposite && against
          ? {
              id: 'mood',
              analyzer: 'mood',
              title: `Make it feel ${pole}`,
              message: `You chose ${pole}, but your words feel ${opposite} so far (${words(opposite).slice(0, 3).join(', ')}). You could try words like ${ideas(pole)}.`,
              span: against.span,
            }
          : {
              id: 'mood',
              analyzer: 'mood',
              title: `Build the ${pole} mood`,
              message: `Add a few details that feel ${pole}. Words like ${ideas(pole)} can help.`,
            };
    }
    if (step) nextSteps.push(step);
    const leaning = chosen.length > 0 ? matched : MOOD_AXES.flatMap((a) => m.leaning[a.id] ?? []);
    const first = leaning[0];
    if (first) {
      strengths.push({
        id: 'mood',
        analyzer: 'mood',
        title: `Your setting feels ${listing(leaning)}`,
        message: `Words like ${leaning.flatMap((p) => words(p).slice(0, 2)).join(', ')} build the mood without naming it.`,
        span: m.hits.find((h) => h.pole === first)?.span,
      });
    }
  }

  if (enabled.has('tone') && wordCount >= 15) {
    const t = tone(text);
    const aimed = options.tone ?? {};
    const anyAimed = Object.keys(aimed).length > 0;
    const scales = TONE_AXES.filter((a) => !anyAimed || aimed[a.id] !== undefined).map((a) => ({
      axis: a.id,
      aimed: aimed[a.id] ?? null,
      heard: t.heard[a.id],
    }));
    report.tone = scales;
    const toneWords = (pole: string) => [
      ...new Set(t.hits.filter((h) => h.pole === pole).map((h) => h.word)),
    ];
    const matched: string[] = [];
    for (const { axis, aimed: want, heard } of scales) {
      const heardPole = heard === null ? null : tonePoleOf(axis, heard);
      if (want === null) {
        if (heard !== null && heardPole) matched.push(toneStepLabel(axis, heard));
        continue;
      }
      const pole = tonePoleOf(axis, want);
      if (heard !== null && Math.abs(heard - want) <= 1 && heard * want >= 0) {
        if (heardPole) matched.push(toneStepLabel(axis, heard));
        continue;
      }
      if (!pole || nextSteps.some((c) => c.id === 'tone')) continue;
      const ideas = toneIdeas(pole, toneWords(pole)).join(', ');
      nextSteps.push(
        heard !== null && heardPole && heardPole !== pole
          ? {
              id: 'tone',
              analyzer: 'tone',
              title: `Make it sound ${pole}`,
              message: `You aimed for ${toneStepLabel(axis, want)}, but it sounds ${toneStepLabel(axis, heard)} so far (${toneWords(heardPole).slice(0, 3).join(', ')}). Words like ${ideas} can shift it.`,
              span: t.hits.find((h) => h.pole === heardPole)?.span,
            }
          : {
              id: 'tone',
              analyzer: 'tone',
              title: `Turn up the ${pole}`,
              message: `You aimed for ${toneStepLabel(axis, want)}, but Quill can't hear it yet. Try a few words like ${ideas}, or let your narrator react the way a ${pole} voice would.`,
            },
      );
    }
    if (matched.length > 0) {
      strengths.push({
        id: 'tone',
        analyzer: 'tone',
        title: `Your voice sounds ${listing(matched)}`,
        message: 'Your word choices set the tone without you having to name it.',
      });
    }
  }

  if (enabled.has('figurative')) {
    const fig = figurative(text);
    const goals: readonly Device[] = options.devices?.length
      ? options.devices
      : ['simile', 'metaphor', 'personification'];
    report.figurative = goals.map((device) => ({
      device,
      count: fig.counts[device],
      span: fig.hits.find((h) => h.device === device)?.span,
    }));
    const cliche = fig.cliches[0];
    if (cliche) {
      nextSteps.push({
        id: 'cliche',
        analyzer: 'figurative',
        title: 'Make it fresh',
        message: `“${cliche.phrase}” is a comparison readers have heard many times. What would only YOUR character compare it to? Something from their life makes it surprising.`,
        span: cliche.span,
      });
    }
    const missing = options.devices?.find((d) => fig.counts[d] === 0);
    if (missing && wordCount >= 15) {
      nextSteps.push({
        id: 'figurative',
        analyzer: 'figurative',
        title: `Try a ${missing}`,
        message: DEVICE_TIPS[missing],
      });
    }
    const found = fig.hits.filter(
      (h) =>
        !fig.cliches.some((c) => c.span.start >= h.sentence.start && c.span.start < h.sentence.end),
    );
    const best = found.find((h) => goals.includes(h.device)) ?? found[0];
    if (best) {
      strengths.push({
        id: 'figurative',
        analyzer: 'figurative',
        title: `Looks like a ${best.device}`,
        message: `“${quote(best.span)}” ${DEVICE_PRAISE[best.device]}`,
        span: best.span,
      });
    }
  }

  if (enabled.has('syllables') && options.syllablePattern?.length) {
    const pattern = options.syllablePattern;
    const check = checkSyllablePattern(text, pattern, options.syllableOverrides);
    const shape = pattern.join('-');
    const badCount = check.stanzas.findIndex((st) => !st.lineCountOk);
    const badLine = check.stanzas
      .flatMap((st) => (st.lineCountOk ? st.lines.map((l, i) => ({ l, want: pattern[i]! })) : []))
      .find(({ l, want }) => l.total !== want);
    if (badCount >= 0) {
      const st = check.stanzas[badCount]!;
      nextSteps.push({
        id: 'syllables',
        analyzer: 'syllables',
        title: `Each verse needs ${pattern.length} lines`,
        message: `Verse ${badCount + 1} has ${st.lines.length} ${st.lines.length === 1 ? 'line' : 'lines'}. Press Enter to start a new line, and leave a blank line between verses.`,
        span: st.lines[0]?.line,
      });
    } else if (badLine) {
      const { l, want } = badLine;
      nextSteps.push({
        id: 'syllables',
        analyzer: 'syllables',
        title: `Line ${l.line.number}: ${l.total} syllables, aim for ${want}`,
        message:
          l.total > want
            ? `Try a shorter word, or cut one you don't need. Clap the syllables as you read it aloud.`
            : `Add a word that shows a detail: a colour, a sound, a sense. Clap the syllables as you read it aloud.`,
        span: l.line,
      });
    } else if (check.fits) {
      strengths.push({
        id: 'syllables',
        analyzer: 'syllables',
        title: `Every line fits ${shape}`,
        message:
          check.stanzas.length > 1
            ? `All ${check.stanzas.length} verses have exactly the right syllables.`
            : 'Exactly the right syllables in every line.',
      });
    }
  }

  if (enabled.has('lineBreaks')) {
    const lb = lineBreaks(text);
    const long = lb.lines.find((l) => l.words > 12);
    if (lb.lines.length < 4) {
      nextSteps.push({
        id: 'lines',
        analyzer: 'lineBreaks',
        title: 'Break it into lines',
        message:
          'A poem lives in lines. Press Enter where you want the reader to pause, or where a word deserves a line of its own.',
      });
    } else if (long) {
      nextSteps.push({
        id: 'lines',
        analyzer: 'lineBreaks',
        title: `Line ${long.number} is long`,
        message: 'Where would you take a breath reading it aloud? Try breaking the line there.',
        span: long,
      });
    } else if (lb.enjambment === 0) {
      nextSteps.push({
        id: 'lines',
        analyzer: 'lineBreaks',
        title: 'Try a run-on line',
        message:
          'Every line ends with punctuation. Try breaking one line in the middle of a thought, so the reader has to keep going to find out what happens.',
      });
    } else {
      const lonely = lb.lines.find((l) => l.words === 1);
      const run = lb.lines.find((l) => l.enjambed);
      strengths.push({
        id: 'lines',
        analyzer: 'lineBreaks',
        title: lonely ? 'A word on its own line' : 'Line breaks that pull the reader on',
        message: lonely
          ? `“${quote(lonely)}” stands alone, so the reader stops on it. That gives it weight.`
          : `“${run ? quote(run) : ''}” runs on into the next line, so the reader has to keep going.`,
        span: lonely ?? run,
      });
    }
  }

  if (enabled.has('sound') && poemLines(text).length >= 2) {
    const snd = soundDevices(text);
    report.sound = SOUND_DEVICES.map((device) => ({
      device,
      count: snd.found[device].length,
      span: snd.found[device][0],
    }));
    const used = SOUND_DEVICES.filter((d) => snd.found[d].length > 0);
    const first = used[0];
    if (first) {
      strengths.push({
        id: 'sound',
        analyzer: 'sound',
        title: `Sound: ${listing(used)}`,
        message: `“${quote(snd.found[first][0]!)}” makes the poem good to read aloud.`,
        span: snd.found[first][0],
      });
    }
    const missing = SOUND_DEVICES.find((d) => snd.found[d].length === 0);
    if (missing && used.length < 2) {
      nextSteps.push({
        id: 'sound',
        analyzer: 'sound',
        title: `Try ${missing}`,
        message: SOUND_TIPS[missing],
      });
    }
  }

  if (enabled.has('pacing')) {
    const p = pacing(text);
    if (p.peak) {
      report.pacing = p.segments.map(({ start, end, text: t, pace, at }) => ({
        start,
        end,
        text: t,
        pace,
        at,
      }));
      const peakSpan = sentenceAt(sentences(text), p.peak.start) ?? p.peak;
      if (p.flat) {
        const pace = p.segments[0]?.pace;
        nextSteps.push({
          id: 'pacing',
          analyzer: 'pacing',
          title: 'Change the speed',
          message:
            pace === 'fast'
              ? 'Every part of your story moves fast. Give the reader one slower moment to breathe before the big moment.'
              : 'Your story moves at one speed. For the most exciting part, try short sentences and strong action verbs.',
        });
      } else if (p.peak.at < 35) {
        nextSteps.push({
          id: 'pacing',
          analyzer: 'pacing',
          title: 'Build up to the big moment',
          message: `Your most intense part comes early, at about ${p.peak.at}% of the story. You could let things get harder first, so the climax comes later.`,
          span: peakSpan,
        });
      } else if (p.peak.at > 90) {
        nextSteps.push({
          id: 'pacing',
          analyzer: 'pacing',
          title: 'Bring the climax sooner',
          message: `Your climax starts at about ${p.peak.at}% of the story. Try building it sooner, so there's room to show what happens after.`,
          span: peakSpan,
        });
      } else {
        strengths.push({
          id: 'pacing',
          analyzer: 'pacing',
          title: 'Good build-up',
          message: `Your story speeds up to its most intense part at about ${p.peak.at}% of the way through. That's a strong shape.`,
          span: peakSpan,
        });
      }
    }
  }

  if (options.grammarFocus?.length) {
    const hits = grammarFeatures(text);
    const missing = options.grammarFocus.find((f) => !hits.some((h) => h.feature === f));
    const used = options.grammarFocus.filter((f) => hits.some((h) => h.feature === f));
    if (missing) {
      nextSteps.push({
        id: 'grammar-focus',
        analyzer: grammarSkillOf(missing),
        title: `Use ${GRAMMAR_FEATURE_LABELS[missing]}`,
        message: `This activity practises ${GRAMMAR_FEATURE_LABELS[missing]}: ${GRAMMAR_FEATURE_EXAMPLES[missing]}.`,
      });
    }
    const first = used[0];
    if (first) {
      const span = hits.find((h) => h.feature === first)?.span;
      strengths.push({
        id: 'grammar-focus',
        analyzer: grammarSkillOf(first),
        title: `You used ${listing(used.map((f) => GRAMMAR_FEATURE_LABELS[f]))}`,
        message: span
          ? `Like ${inQuotes(span.text)}${/[.!?][”"]$/.test(span.text) ? '' : '.'} That's the skill this lesson practises.`
          : 'That is the skill this lesson practises.',
        span,
      });
    }
  }

  if (enabled.has('voice')) {
    const issues = voiceIssues(text);
    if (issues[0]) nextSteps.push(issueCard('voice', 'Check this passive verb', issues));
    const notes = passiveNotes(text);
    const focus = options.grammarFocus ?? [];
    // Practising the passive (forming it, "by" + the doer): don't nudge toward the active.
    const formingPassive =
      focus.some((f) => f.startsWith('passive')) && !focus.includes('active-voice');
    const withDoer = focus.includes('passive-agent')
      ? undefined
      : (notes.find((n) => n.rewrite) ?? notes.find((n) => n.hasAgent));
    const total = sentences(text).length;
    const passiveCount = new Set(notes.map((n) => n.sentence.start)).size;
    if (!formingPassive && withDoer) {
      nextSteps.push({
        id: 'passive',
        analyzer: 'voice',
        title: 'Who’s doing it?',
        message: withDoer.rewrite
          ? `“${withDoer.span.text}” names the doer, so the active voice is usually clearer and stronger: “${withDoer.rewrite}”`
          : `“${withDoer.span.text}” names the doer. Try starting the sentence with the doer instead (active voice).`,
        span: withDoer.span,
      });
    } else if (!formingPassive && total >= 3 && passiveCount * 3 > total * 2 && notes[0]) {
      nextSteps.push({
        id: 'passive',
        analyzer: 'voice',
        title: 'Mostly passive',
        message: `${passiveCount} of your ${total} sentences are passive. Keep the passive for when the doer is unknown or unimportant, and put the doer first everywhere else.`,
        span: notes[0].span,
      });
    } else if (!issues[0] && wordCount >= 15) {
      const active = grammarFeatures(text).find((h) => h.feature === 'active-voice');
      if (formingPassive && notes[0]) {
        strengths.push({
          id: 'voice',
          analyzer: 'voice',
          title: 'Well-built passive',
          message: `“${notes[0].span.text}” uses a form of be + the past participle, just right.`,
          span: notes[0].span,
        });
      } else if (active) {
        strengths.push({
          id: 'voice',
          analyzer: 'voice',
          title: notes[0] ? 'Voice chosen with care' : 'Strong active voice',
          message: notes[0]
            ? `You put the doer first, like “${active.span.text}”, and keep the passive for when the doer doesn’t matter.`
            : `Your sentences put the doer first, like “${active.span.text}”, so they’re clear and direct.`,
          span: active.span,
        });
      }
    }
  }

  if (enabled.has('speech')) {
    const issues = speechIssues(text);
    if (issues[0]) nextSteps.push(issueCard('speech', 'Check this speech', issues));
    else if (wordCount >= 15) {
      const hits = grammarFeatures(text);
      const direct = hits.find((h) => h.feature === 'tag-before' || h.feature === 'tag-after');
      const reported = hits.find(
        (h) =>
          h.feature === 'reported-speech' ||
          h.feature === 'reported-question' ||
          h.feature === 'reported-command',
      );
      const evidence = hits.find((h) => h.feature === 'quoted-evidence');
      if (evidence) {
        strengths.push({
          id: 'speech',
          analyzer: 'speech',
          title: 'Quote with a lead-in',
          message: `You introduce your quote, ${evidence.span.text}, so readers know where the words come from.`,
          span: evidence.span,
        });
      } else if (direct) {
        strengths.push({
          id: 'speech',
          analyzer: 'speech',
          title: 'Speech punctuated right',
          message: `${direct.span.text}: the quotation marks, comma and capital letters are all in place.`,
          span: direct.span,
        });
      } else if (reported) {
        strengths.push({
          id: 'speech',
          analyzer: 'speech',
          title: 'Clear reported speech',
          message: `“${reported.span.text}” reports the words smoothly, with no quotation marks needed.`,
          span: reported.span,
        });
      }
    }
  }

  if (enabled.has('connectors')) {
    const issues = connectorIssues(text);
    if (issues[0]) nextSteps.push(issueCard('connectors', 'Check this joining word', issues));
    else if (wordCount >= 15) {
      const join = grammarFeatures(text).find(
        (h) =>
          h.feature === 'subordinating-conjunction' ||
          h.feature === 'coordinating-conjunction' ||
          h.feature === 'correlative-conjunction',
      );
      if (join) {
        strengths.push({
          id: 'connectors',
          analyzer: 'connectors',
          title: 'Smooth joins',
          message: `“${join.span.text}” links your ideas, and your commas and pairs are in the right places.`,
          span: join.span,
        });
      }
    }
  }

  if (enabled.has('modifiers')) {
    const issues = modifierIssues(text);
    if (issues[0]) nextSteps.push(issueCard('modifiers', 'Check this describing word', issues));
    const weak = veryPhrases(text);
    if (weak[0])
      nextSteps.push({ ...issueCard('modifiers', 'Try one strong word', weak), id: 'very' });
    if (!issues[0] && !weak[0] && wordCount >= 15) {
      const strong = grammarFeatures(text).find(
        (h) =>
          h.feature === 'superlative' || h.feature === 'comparative' || h.feature === 'adverb-how',
      );
      strengths.push({
        id: 'modifiers',
        analyzer: 'modifiers',
        title: 'Precise describing words',
        message: strong
          ? `Your adjectives and adverbs are the right forms, like “${strong.span.text}”, and you never lean on “very”.`
          : 'Your adjectives and adverbs are the right forms, and you never lean on “very”.',
        span: strong?.span,
      });
    }
  }

  if (enabled.has('verbs')) {
    const issues = verbIssues(text);
    if (issues[0]) nextSteps.push(issueCard('verbs', 'Check this verb', issues));
    else if (wordCount >= 15) {
      const strong = grammarFeatures(text).find(
        (h) => h.feature === 'irregular-past' || h.feature === 'perfect',
      );
      strengths.push({
        id: 'verbs',
        analyzer: 'verbs',
        title: 'Verbs that agree',
        message: strong
          ? `Your verbs match their subjects and stay in tense, and “${strong.span.text}” is the right form.`
          : 'Your verbs match their subjects and stay in the same tense.',
        span: strong?.span,
      });
    }
  }

  if (enabled.has('pronouns')) {
    const issues = pronounIssues(text);
    if (issues[0]) nextSteps.push(issueCard('pronouns', 'Check this pronoun', issues));
    else if (wordCount >= 15 && grammarFeatures(text).some((h) => h.feature.endsWith('pronoun'))) {
      strengths.push({
        id: 'pronouns',
        analyzer: 'pronouns',
        title: 'Clear pronouns',
        message: 'Your pronouns are the right kind, and it is clear who each one means.',
      });
    }
  }

  if (enabled.has('nouns')) {
    const issues = nounIssues(text);
    if (issues[0]) nextSteps.push(issueCard('nouns', 'Check this noun', issues));
    else if (wordCount >= 15) {
      const names = [
        ...new Set(
          grammarFeatures(text)
            .filter((h) => h.feature === 'proper-noun')
            .map((h) => h.span.text),
        ),
      ];
      if (names.length >= 2) {
        strengths.push({
          id: 'nouns',
          analyzer: 'nouns',
          title: 'Names with capitals',
          message: `${listing(names.slice(0, 3))} start with capital letters, just right for proper nouns.`,
        });
      }
    }
  }

  if (enabled.has('telling')) {
    const { phrases } = telling(text);
    const first = phrases[0];
    if (first) {
      nextSteps.push({
        id: 'telling',
        analyzer: 'telling',
        title: 'Show the feeling',
        message: `“${quote(first.phrase)}” names the feeling (${first.emotion}). You could try showing it instead: what does the character do, say, or look like?${phrases.length > 1 ? ` (${plural(phrases.length - 1, 'more place')} like this.)` : ''}`,
        span: first.phrase,
      });
    } else if (wordCount >= 15) {
      strengths.push({
        id: 'showing',
        analyzer: 'telling',
        title: 'Showing, not telling',
        message: 'You never name a feeling outright, so readers get to work it out. Nice!',
      });
    }
  }

  if (enabled.has('dialogue')) {
    const d = dialogue(text);
    const first = d.issues[0];
    if (first) {
      nextSteps.push({
        id: 'dialogue',
        analyzer: 'dialogue',
        title: 'Dialogue punctuation',
        message: `${first.message}${d.issues.length > 1 ? ` (${plural(d.issues.length - 1, 'more spot')} to check.)` : ''}`,
        span: first.span,
      });
    } else if (d.quotes >= 2) {
      strengths.push({
        id: 'dialogue',
        analyzer: 'dialogue',
        title: 'Neat dialogue',
        message: 'Your speech marks and commas are in the right places.',
      });
    }
  }

  if (enabled.has('senses') && wordCount >= 20) {
    const s = senses(text);
    report.senses = s.counts;
    if (s.used.length >= 3) {
      strengths.push({
        id: 'senses',
        analyzer: 'senses',
        title: `${s.used.length} senses`,
        message: `You used ${s.used.map((x) => SENSE_LABELS[x]).join(', ')}. That helps readers step inside the scene.`,
      });
    }
    // Suggest the least-used sense, preferring smell, touch and taste (sight is usually covered).
    const missing = (['smell', 'touch', 'sound', 'taste', 'sight'] as const).find((x) =>
      s.missing.includes(x),
    );
    if (missing && s.used.length < 4) {
      nextSteps.push({
        id: 'senses',
        analyzer: 'senses',
        title: `Add ${SENSE_LABELS[missing]}`,
        message: `${SENSE_PROMPTS[missing]} One detail is enough.`,
      });
    }
  }

  if (enabled.has('filterWords')) {
    const f = filterWords(text);
    const top = f.found[0];
    if (top && (top.count >= 2 || f.per100 >= 3)) {
      nextSteps.push({
        id: 'filter',
        analyzer: 'filterWords',
        title: `Try cutting “${top.word}”`,
        message: `You used “${top.word}” ${plural(top.count, 'time')}. Words like this can often go: “The door creaked” is stronger than “I heard the door creak”.`,
        span: top.spans[0],
      });
    } else if (f.total === 0 && wordCount >= 30) {
      strengths.push({
        id: 'filter',
        analyzer: 'filterWords',
        title: 'Straight to the point',
        message: 'No filler words like “very” or “just”. Every word is doing a job.',
      });
    }
  }

  if (enabled.has('sentenceVariety')) {
    const v = sentenceVariety(text);
    const repeated = v.repeatedStarts[0];
    if (repeated) {
      const word = repeated.spans[0]?.text ?? repeated.word;
      nextSteps.push({
        id: 'starts',
        analyzer: 'sentenceVariety',
        title: 'Mix up how sentences start',
        message: `${repeated.count} sentences start with “${word}”. Try starting one with an action, a sound or a place.`,
        span: repeated.spans[1] ?? repeated.spans[0],
      });
    } else if (v.total >= 4 && (v.short === v.total || v.medium === v.total)) {
      nextSteps.push({
        id: 'lengths',
        analyzer: 'sentenceVariety',
        title: 'Mix short and long sentences',
        message:
          v.short === v.total
            ? 'All your sentences are short. Join two with “and”, “but” or “because” to change the rhythm.'
            : 'Try a very short sentence for a big moment. Like this. It hits hard.',
      });
    } else if (v.total >= 4 && v.short > 0 && v.medium + v.long > 0) {
      strengths.push({
        id: 'variety',
        analyzer: 'sentenceVariety',
        title: 'Great rhythm',
        message: 'You mix short and long sentences, which keeps your writing lively.',
      });
    }
  }

  report.strengths = strengths.slice(0, MAX_STRENGTHS);
  report.nextSteps = nextSteps.slice(0, MAX_NEXT_STEPS);
  return report;
}

/** Quote a bit of the student's text, unless it already has its own quotation marks. */
const inQuotes = (t: string) => (/[“”"]/.test(t) ? t : `“${t}”`);

/** The first grammar issue as a card, with its fix and how many more there are. */
function issueCard(
  analyzer: 'nouns' | 'pronouns' | 'verbs' | 'modifiers' | 'connectors' | 'voice' | 'speech',
  title: string,
  issues: GrammarIssue[],
): CoachCard {
  const first = issues[0]!;
  const more = issues.length > 1 ? ` (${plural(issues.length - 1, 'more spot')} to check.)` : '';
  return {
    id: analyzer,
    analyzer,
    title: first.fix ? `“${first.span.text}” → “${first.fix}”` : title,
    message: `${first.message}${more}`,
    span: first.span,
  };
}

/** Check each part of a rewrite: heading present, long enough, its point of view and narrator. */
export function checkPerspectives(
  text: string,
  perspectives: readonly Perspective[],
): PerspectiveCheck[] {
  const sections = splitSections(
    text,
    perspectives.map((p) => p.label),
  );
  return perspectives.map((p, i): PerspectiveCheck => {
    const section = sections[i];
    if (!section?.found) return { ...p, status: 'missing' };
    const at = { start: section.start, end: section.start, text: '' };
    if (countWords(section.text) < MIN_PART_WORDS) return { ...p, status: 'short', span: at };
    const slip =
      p.pov === 'third'
        ? (thirdPersonSlips(section.text)[0] ?? povShifts(pointOfView(section.text), 'third')[0])
        : povShifts(pointOfView(section.text), p.pov)[0];
    if (slip) return { ...p, status: 'shift', span: shiftSpan(slip, section.start) };
    if (p.pov === 'third' && p.narrator) {
      const reach = narratorReach(section.text);
      const other = reach.guess === 'omniscient' ? reach.minds[1] : undefined;
      if (p.narrator === 'limited' && other) {
        return { ...p, status: 'narrator', span: shiftSpan(other.span, section.start) };
      }
      if (p.narrator === 'omniscient' && !other) return { ...p, status: 'narrator', span: at };
    }
    return { ...p, status: 'ok' };
  });
}

function perspectiveCard(c: PerspectiveCheck): CoachCard {
  const base = { id: 'perspectives', analyzer: 'pov' as const, span: c.span };
  const slip = c.span?.text ? `“${quote(c.span)}”` : 'One part';
  switch (c.status) {
    case 'missing':
      return {
        ...base,
        title: `Add the “${c.label}” part`,
        message: `Put the heading “${c.label}” on its own line, then write that version underneath. Quill uses the headings to find each part.`,
      };
    case 'short':
      return {
        ...base,
        title: `Write more in “${c.label}”`,
        message: `This part needs at least ${MIN_PART_WORDS} words before Quill can tell its point of view.`,
      };
    case 'shift':
      return {
        ...base,
        title: `Check the point of view in “${c.label}”`,
        message: `This part should be in the ${POV_LABELS[c.pov]}. ${slip} slips out of it.`,
      };
    case 'narrator':
      return c.narrator === 'limited'
        ? {
            ...base,
            title: `Stay in one head in “${c.label}”`,
            message: `In third person limited the narrator only knows one character's thoughts, but ${slip} shows another character's.`,
          }
        : {
            ...base,
            title: `Show more minds in “${c.label}”`,
            message:
              'An all-knowing narrator can show what two or more characters think or feel. Try adding another character’s thoughts.',
          };
    case 'ok':
      return { ...base, title: c.label, message: 'Keeps its point of view.' };
  }
  const unreachable: never = c.status;
  return { ...base, title: c.label, message: String(unreachable) };
}

const whose = (who: string) => (who === 'he' || who === 'she' ? 'one character' : who);

function narratorCard(
  reach: ReturnType<typeof narratorReach>,
  narrator: Narrator,
  wordCount: number,
): CoachCard | null {
  const first = reach.minds[0];
  const second = reach.guess === 'omniscient' ? reach.minds[1] : undefined;
  if (narrator === 'limited') {
    if (first && second) {
      return {
        id: 'narrator',
        analyzer: 'pov',
        title: 'Stay in one head',
        message: `In third person limited the narrator only knows one character's thoughts. Here we hear ${whose(first.who)}'s and ${whose(second.who)}'s (“${quote(second.span)}”). Could you show the second one from the outside instead?`,
        span: second.span,
      };
    }
    return first && wordCount >= 30
      ? {
          id: 'narrator-ok',
          analyzer: 'pov',
          title: 'Inside one head',
          message: `We only hear ${whose(first.who)}'s thoughts, so readers see the story through their eyes.`,
          span: first.span,
        }
      : null;
  }
  if (first && second) {
    return {
      id: 'narrator-ok',
      analyzer: 'pov',
      title: 'An all-knowing narrator',
      message: `Your narrator knows what more than one character thinks (${first.who} and ${second.who}).`,
      span: second.span,
    };
  }
  if (wordCount < 40) return null;
  return {
    id: 'narrator',
    analyzer: 'pov',
    title: 'Show another mind',
    message: first
      ? `So far we only hear ${whose(first.who)}'s thoughts. An all-knowing narrator can also show what another character thinks or feels.`
      : 'An all-knowing narrator can show what characters think and feel. Try “she wondered…” or “he knew…” for two different characters.',
  };
}
