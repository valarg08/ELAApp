import { dialogue } from './analyzers/dialogue.js';
import {
  type Pov,
  type Tense,
  offTenseSentences,
  pointOfView,
  povShifts,
  tense,
} from './analyzers/narration.js';
import { type Sense, senses } from './analyzers/senses.js';
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
}

export interface CoachOptions {
  analyzers?: readonly AnalyzerId[];
  povLock?: Pov;
  tenseLock?: Tense;
  /** Moods the student chose for their setting (Unit 3); the mood check compares against them. */
  moods?: readonly MoodPole[];
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
  const wordCount = countWords(text);
  const strengths: CoachCard[] = [];
  const nextSteps: CoachCard[] = [];
  const report: CoachReport = { wordCount, strengths, nextSteps };

  if (wordCount < MIN_WORDS) {
    nextSteps.push({
      id: 'length',
      analyzer: 'length',
      title: 'Keep writing',
      message: 'Write a few sentences first, then check again. Quill needs something to read!',
    });
    return report;
  }

  // Lock problems come first: they block submitting.
  if (enabled.has('pov')) {
    const pov = pointOfView(text);
    const lock = options.povLock;
    const shifts = lock ? povShifts(pov, lock) : [];
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
