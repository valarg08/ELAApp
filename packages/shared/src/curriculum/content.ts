import {
  ANALYZER_IDS,
  DEVICES,
  GRAMMAR_FEATURES,
  SENSES,
  MOOD_AXES,
  MOOD_AXIS_IDS,
  type MoodPole,
  TONE_AXIS_IDS,
  syllableKey,
  type ToneAxis,
  type ToneStep,
  isToneStep,
} from '@storyforge/writing-analysis';
import { z } from 'zod';
import { Proofread, normaliseForProofread, occurrences } from './proofread.js';
import { WritingConstraints } from './constraints.js';
import { CONFLICT_TYPE_IDS, type ConflictTypeId, PlotPlan } from './plot.js';
import { ParagraphBuilder, ParagraphPlan } from './paragraph.js';
import { Checklist } from './checklist.js';
import { EssayConfig, EssayPrompt, OutlineBuilder, OutlinePlan } from './outline.js';

/**
 * Curriculum content format (DESIGN.md §9). Units, lessons and activities live as JSON files in
 * /content/units/unit-XX (Story Writing) and /content/essay/unit-XX (Essay Writing, §9.12) and are
 * validated against these schemas before they reach the database.
 */

const text = (max = 2000) => z.string().trim().min(1).max(max);
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Use lowercase letters, numbers and dashes');

// ───────── Activities ─────────

/** The two learning tracks (DESIGN.md §9.12). */
export const TRACKS = ['STORY', 'ESSAY'] as const;
export const Track = z.enum(TRACKS);
export type Track = z.infer<typeof Track>;

/** Activity keys start with the unit: "u01." in Story Writing, "e01." in Essay Writing. */
export const ActivityKey = z
  .string()
  .regex(
    /^[ue]\d{2}\.[a-z0-9][a-z0-9-]*$/,
    'Activity keys look like "u01.sort-show-tell" (or "e01.…" in Essay Writing)',
  );

/** The track an activity belongs to, from its key ("e01." is Essay Writing). */
export const trackOfActivityKey = (key: string): Track => (key.startsWith('e') ? 'ESSAY' : 'STORY');

/** The prefix every activity key of a unit starts with. */
export const activityKeyPrefix = (track: Track, unitNumber: number) =>
  `${track === 'ESSAY' ? 'e' : 'u'}${String(unitNumber).padStart(2, '0')}.`;

const activityBase = {
  key: ActivityKey,
  title: text(120),
  xpReward: z.number().int().min(0).max(500).optional(),
};

export const MultipleChoiceActivity = z.object({
  ...activityBase,
  type: z.literal('MULTIPLE_CHOICE'),
  questions: z
    .array(
      z.object({
        id,
        prompt: text(500),
        options: z
          .array(z.object({ id, text: text(300) }))
          .min(2)
          .max(5),
        correctOptionId: id,
        explanation: text(500),
        hint: text(300).optional(),
      }),
    )
    .min(1)
    .max(5),
});

export const SortActivity = z.object({
  ...activityBase,
  type: z.literal('SORT'),
  instructions: text(500),
  buckets: z
    .array(z.object({ id, label: text(60) }))
    .min(2)
    .max(4),
  items: z
    .array(z.object({ id, text: text(300), bucketId: id }))
    .min(2)
    .max(12),
});

export const HighlightActivity = z.object({
  ...activityBase,
  type: z.literal('HIGHLIGHT'),
  instructions: text(500),
  text: text(1500),
  /** Single words in `text` the student should tap (matched without case or punctuation). */
  targets: z.array(z.string().trim().min(1)).min(1).max(10),
  explanation: text(500),
});

/**
 * Put the cards in order (the story mountain, DESIGN.md §10 plot diagram): drag them, or use the
 * move buttons. `items` are listed in the correct order; `labels` names each position.
 */
export const SequenceActivity = z.object({
  ...activityBase,
  type: z.literal('SEQUENCE'),
  instructions: text(500),
  items: z
    .array(z.object({ id, text: text(300) }))
    .min(3)
    .max(8),
  labels: z.array(text(60)).max(8).optional(),
  explanation: text(500),
});

/**
 * The sensory lab (DESIGN.md §10, Unit 6): five stations, one per sense, each with a scene to
 * imagine (a picture and words, read aloud on request) and a word jar. Collected words go to the
 * student's personal sensory word bank. Done when every jar has `wordsPerStation` words.
 */
export const SensoryLabActivity = z.object({
  ...activityBase,
  type: z.literal('SENSORY_LAB'),
  instructions: text(500),
  stations: z
    .array(
      z.object({
        sense: z.enum(SENSES),
        title: text(80),
        /** A big emoji picture for the scene. */
        picture: z.string().trim().min(1).max(16),
        scene: text(600),
        prompt: text(200),
        /** Idea words a student can tap into the jar when stuck. */
        ideas: z.array(z.string().trim().toLowerCase().min(1).max(30)).min(3).max(10),
      }),
    )
    .min(1)
    .max(5),
  wordsPerStation: z.number().int().min(1).max(5).default(2),
});

const quizQuestion = z.object({
  id,
  prompt: text(500),
  options: z
    .array(z.object({ id, text: text(300) }))
    .min(2)
    .max(5),
  correctOptionId: id,
  explanation: text(500),
  /** The skill the question checks, shown in the review ("Review: pronouns"). */
  skill: text(60).optional(),
});

/**
 * A marked quiz (Essay Writing unit checks, DESIGN.md §9.12). The server picks
 * `questionsPerAttempt` questions from the bank, marks the answers and stores the attempt; the
 * answers never reach the browser before submitting. The activity is done at `passPercent` or more.
 */
export const QuizActivity = z.object({
  ...activityBase,
  type: z.literal('QUIZ'),
  instructions: text(500),
  passPercent: z.number().int().min(50).max(100).default(80),
  questionsPerAttempt: z.number().int().min(3).max(25).optional(),
  questions: z.array(quizQuestion).min(3).max(60),
});
export type QuizActivity = z.infer<typeof QuizActivity>;

/**
 * The transformer (DESIGN.md §9.12): rewrite a sentence by a rule — change its tense, make it
 * passive or active, turn direct speech into reported speech, make it formal. Answers are matched
 * against the accepted rewrites (see `transformMatches`); a wrong try shows the next hint.
 */
export const TransformActivity = z.object({
  ...activityBase,
  type: z.literal('TRANSFORM'),
  instructions: text(500),
  items: z
    .array(
      z.object({
        id,
        /** What to do with this sentence ("Change it to the past tense"). */
        task: text(200),
        source: text(400),
        answers: z.array(text(400)).min(1).max(8),
        hints: z.array(text(300)).max(4).default([]),
        explanation: text(500),
      }),
    )
    .min(1)
    .max(8),
});
export type TransformActivity = z.infer<typeof TransformActivity>;

/** A rewrite in a form that ignores case, spacing, curly quotes and a missing final full stop. */
export function normalizeRewrite(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/\.$/, '')
    .toLowerCase();
}

/** True when the student's rewrite matches one of the accepted answers. */
export const transformMatches = (answer: string, accepted: readonly string[]) =>
  accepted.some((a) => normalizeRewrite(a) === normalizeRewrite(answer));

/** The blank in a fill-the-blank sentence. */
export const BLANK = '___';

/**
 * Fill the blank (Essay Writing grammar, DESIGN.md §9.12): each sentence has one blank. With
 * `choices` (for the item, or for every item) the student picks a word; without, they type it.
 */
export const FillBlankActivity = z.object({
  ...activityBase,
  type: z.literal('FILL_BLANK'),
  instructions: text(500),
  /** Words to pick from for every item (a word bank). */
  choices: z.array(text(40)).min(2).max(12).optional(),
  items: z
    .array(
      z.object({
        id,
        /** The sentence, with the blank written as "___". */
        sentence: text(300),
        answers: z.array(text(60)).min(1).max(6),
        /** Words to pick from for this item (instead of the activity's). */
        choices: z.array(text(40)).min(2).max(6).optional(),
        hint: text(300).optional(),
        explanation: text(400),
      }),
    )
    .min(1)
    .max(10),
});
export type FillBlankActivity = z.infer<typeof FillBlankActivity>;

const answerForm = (v: string) => normalizeRewrite(v).replace(/[.!?]$/, '');

/** True when a blank's answer matches (ignoring case, spacing, curly quotes and end punctuation). */
export const blankMatches = (answer: string, accepted: readonly string[]) =>
  accepted.some((a) => answerForm(a) === answerForm(answer));

/**
 * The error hunt (Essay Writing grammar): tap the wrong words in a passage, then type the fix.
 * Each error is one word of the passage; `occurrence` says which one when it appears twice.
 */
export const ErrorHuntActivity = z.object({
  ...activityBase,
  type: z.literal('ERROR_HUNT'),
  instructions: text(500),
  text: text(1500),
  errors: z
    .array(
      z.object({
        /** The wrong word exactly as it is written in the text. */
        word: text(40),
        occurrence: z.number().int().min(1).max(20).default(1),
        fixes: z.array(text(60)).min(1).max(4),
        explanation: text(300),
      }),
    )
    .min(1)
    .max(15),
});
export type ErrorHuntActivity = z.infer<typeof ErrorHuntActivity>;

const fixForm = (v: string) =>
  v
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?,]$/, '');

/**
 * True when a fix matches. Capitals count when the mistake is about capitals ("monday" →
 * "Monday"); otherwise case is ignored.
 */
export function errorFixMatches(wrong: string, answer: string, fixes: readonly string[]): boolean {
  const caseOnly = fixes.some((f) => fixForm(f).toLowerCase() === fixForm(wrong).toLowerCase());
  return fixes.some((f) =>
    caseOnly
      ? fixForm(f) === fixForm(answer)
      : fixForm(f).toLowerCase() === fixForm(answer).toLowerCase(),
  );
}

/** Word positions (in `tokenize` order) of each error in an error hunt, or -1 if not found. */
export function errorPositions(activity: Pick<ErrorHuntActivity, 'text' | 'errors'>): number[] {
  const tokens = tokenize(activity.text).map((t) => t.replace(/’/g, "'"));
  return activity.errors.map((e) => {
    const want = e.word.toLowerCase().replace(/’/g, "'");
    let seen = 0;
    return tokens.findIndex((t) => t === want && ++seen === e.occurrence);
  });
}

export const ReflectionActivity = z.object({
  ...activityBase,
  type: z.literal('REFLECTION'),
  prompts: z.array(text(300)).min(1).max(3),
});

export const WRITING_ACTIVITY_TYPES = [
  'QUICK_WRITE',
  'SIX_WORD_STORY',
  'SHOW_TELL_TRANSFORM',
  'DESCRIBE_WITHOUT_NAMING',
  'VIVID_REWRITE',
  'CHARACTER_SKETCH',
  'TRAITS_IN_ACTION',
  'CHARACTER_VOICE',
  'FLAW_SCENE',
  'SETTING_SNAPSHOT',
  'MOOD_SCENE',
  'WORLD_DETAILS',
  'SETTING_SCENE',
  'STORY_MOUNTAIN',
  'CONFLICT_SCENE',
  'PACING_SCENE',
  'PLOT_STORY',
  'FIRST_PERSON_SCENE',
  'NARRATOR_SCENE',
  'VOICE_SCENE',
  'POV_REWRITE',
  'SENSORY_SCENE',
  'FIGURATIVE_LAB',
  'PERSONIFICATION_SCENE',
  'SENSORY_CHALLENGE',
  'HAIKU',
  'FREE_VERSE',
  'SPOKEN_WORD',
  'SOUND_POEM',
  'SENTENCE_SET',
  'GRAMMAR_PARAGRAPH',
  'PARAGRAPH',
  'ESSAY_OUTLINE',
  'ESSAY_PART',
  'ESSAY',
] as const;

/**
 * A sentence set (Essay Writing): N sentences, each with its own task ("Use a proper noun for a
 * place"). Sentence n of the draft answers task n; `needs` are the grammar features the Coach
 * checks for in it. A guide: only the sentence count (constraints.minSentences) blocks submitting.
 */
export const SentenceSet = z.object({
  label: text(120),
  sentences: z
    .array(
      z.object({
        ask: text(200),
        needs: z.array(z.enum(GRAMMAR_FEATURES)).max(3).default([]),
      }),
    )
    .min(2)
    .max(10),
});
export type SentenceSet = z.infer<typeof SentenceSet>;

/**
 * The simile / metaphor / personification helper (Unit 6): pick a subject and a device, get frames
 * and idea seeds, then write the line yourself. The devices are also what the figurative check
 * looks for.
 */
export const FigurativeHelper = z.object({
  label: text(120),
  devices: z.array(z.enum(DEVICES)).min(1).max(3),
  /** Quick subject ideas (the student can type their own). */
  subjects: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
});
export type FigurativeHelper = z.infer<typeof FigurativeHelper>;

/**
 * The tone sliders (Unit 5): before writing, the student sets the tone they're aiming for on
 * each scale (funny ↔ serious, formal ↔ casual, hopeful ↔ dark), five steps each. The Coach
 * shows where their words sit on the same scales.
 */
export const TonePicker = z.object({
  label: text(120),
  axes: z
    .array(z.enum(TONE_AXIS_IDS))
    .min(1)
    .max(3)
    .default([...TONE_AXIS_IDS]),
});
export type TonePicker = z.infer<typeof TonePicker>;

const toneStep = z.number().int().min(-2).max(2);
/** The tone aimed for, per scale: -2 strongly the first pole … 2 strongly the second. */
export const ToneChoice = z.object({
  humor: toneStep.optional(),
  formality: toneStep.optional(),
  outlook: toneStep.optional(),
});
export type ToneChoice = z.infer<typeof ToneChoice>;
/** A tone choice checked against the scales (whole steps only). */
export type ToneSteps = Partial<Record<ToneAxis, ToneStep>>;

/** The conflict selector (Unit 4): the student picks one conflict card before writing. */
export const ConflictPicker = z.object({
  label: text(120),
  options: z
    .array(z.enum(CONFLICT_TYPE_IDS))
    .min(2)
    .max(6)
    .default([...CONFLICT_TYPE_IDS]),
});
export type ConflictPicker = z.infer<typeof ConflictPicker>;

/** The story mountain planner (Unit 4): one line per stage, all five before submitting. */
export const PlotPlanner = z.object({ label: text(120) });
export type PlotPlanner = z.infer<typeof PlotPlanner>;

/**
 * Before writing, the student sets the mood of their setting on one or more scales (calm ↔ tense,
 * bright ↔ gloomy, safe ↔ dangerous). The workspace shows a word bank for the chosen moods, the
 * Coach compares the mood of their words, and Quill says what mood a reader feels (Unit 3).
 */
export const MoodPicker = z.object({
  label: text(120),
  axes: z
    .array(z.enum(MOOD_AXIS_IDS))
    .min(1)
    .max(3)
    .default([...MOOD_AXIS_IDS]),
});
export type MoodPicker = z.infer<typeof MoodPicker>;

/**
 * Before writing, the student picks traits (or a flaw) for their character. Picked traits become
 * banned words (show, don't name them), and Quill checks whether a reader can tell (Unit 2).
 */
export const TraitPicker = z.object({
  label: text(120),
  count: z.number().int().min(1).max(3),
  options: z
    .array(
      z.object({
        trait: z.string().trim().toLowerCase().min(1).max(30),
        /** Other forms that also name the trait (bravely, bravery), banned with it. */
        forms: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(4).default([]),
      }),
    )
    .min(2)
    .max(30),
});
export type TraitPicker = z.infer<typeof TraitPicker>;

export const WritingActivity = z.object({
  ...activityBase,
  type: z.enum(WRITING_ACTIVITY_TYPES),
  prompt: text(1000),
  /** Text for the student to transform or rewrite, shown above the box. */
  starter: text(1500).optional(),
  /** Put the starter in the editor instead (proofreading and revising, Essay Writing). */
  starterInEditor: z.boolean().optional(),
  tips: z.array(text(300)).max(5).default([]),
  constraints: WritingConstraints,
  /** Checks shown in the Coach panel (default: telling, filter words, senses, sentence variety). */
  analyzers: z.array(z.enum(ANALYZER_IDS)).min(1).optional(),
  traitPicker: TraitPicker.optional(),
  moodPicker: MoodPicker.optional(),
  conflictPicker: ConflictPicker.optional(),
  plotPlanner: PlotPlanner.optional(),
  tonePicker: TonePicker.optional(),
  figurativeHelper: FigurativeHelper.optional(),
  /** Shows the five senses beside the word count, updating as the student types (Unit 6). */
  senseTracker: z.boolean().optional(),
  /** Free verse (Unit 7): the poem as a paragraph vs as lines, a line ruler and "Read with pauses". */
  lineBreakView: z.boolean().optional(),
  /** Spoken word (Unit 7): a metronome, stress marking and a recording that stays on the device. */
  rhythmMode: z.boolean().optional(),
  /** Essay Writing: numbered sentence tasks, each checked (see `SentenceSet`). */
  sentenceSet: SentenceSet.optional(),
  /** Essay Writing: a checklist of the planted mistakes in the starter (see `Proofread`). */
  proofread: Proofread.optional(),
  /** Essay Writing: the paragraph builder (see `ParagraphBuilder`). */
  paragraphBuilder: ParagraphBuilder.optional(),
  /** Essay Writing (Unit 11 on): the kind of essay; the essay Coach check and Quill read it. */
  essay: EssayConfig.optional(),
  /** Essay Writing: the outline builder (see `OutlineBuilder`). */
  outlineBuilder: OutlineBuilder.optional(),
  /** Essay Writing (Unit 14 on): a checklist to edit a whole essay against (see `Checklist`). */
  checklist: Checklist.optional(),
  /** Essay Writing (Unit 15): prompts of different kinds the student chooses between (see `chosenEssay`). */
  essayPrompts: z.array(EssayPrompt).min(2).max(3).optional(),
  /** Essay Writing (Unit 15): the first time it opens, start from the student's writing (and choices) for this earlier activity. */
  continuesFrom: ActivityKey.optional(),
  /** Essay Writing: the grammar this activity practises; the Coach and Quill look for it. */
  grammarFocus: z.array(z.enum(GRAMMAR_FEATURES)).min(1).max(4).optional(),
});

export const ActivityContent = z.discriminatedUnion('type', [
  MultipleChoiceActivity,
  SortActivity,
  HighlightActivity,
  SequenceActivity,
  SensoryLabActivity,
  QuizActivity,
  TransformActivity,
  FillBlankActivity,
  ErrorHuntActivity,
  ReflectionActivity,
  WritingActivity,
]);
export type ActivityContent = z.infer<typeof ActivityContent>;
export type WritingActivity = z.infer<typeof WritingActivity>;
export type PracticeActivity = Exclude<ActivityContent, WritingActivity>;

/**
 * A quiz as a lesson sends it: no questions or answers. The server hands out the questions for
 * each attempt and marks them (DESIGN.md §9.12).
 */
export const QuizActivityPublic = QuizActivity.pick({
  key: true,
  title: true,
  xpReward: true,
  type: true,
  instructions: true,
  passPercent: true,
}).extend({ questionCount: z.number().int().min(1) });
export type QuizActivityPublic = z.infer<typeof QuizActivityPublic>;

/** An activity as the lesson payload carries it (quizzes without their answers). */
export const LessonActivity = z.discriminatedUnion('type', [
  MultipleChoiceActivity,
  SortActivity,
  HighlightActivity,
  SequenceActivity,
  SensoryLabActivity,
  QuizActivityPublic,
  TransformActivity,
  FillBlankActivity,
  ErrorHuntActivity,
  ReflectionActivity,
  WritingActivity,
]);
export type LessonActivity = z.infer<typeof LessonActivity>;

/** The lesson payload form of an activity: a quiz loses its questions. */
export function publicActivity(a: ActivityContent): LessonActivity {
  if (a.type !== 'QUIZ') return a;
  return {
    key: a.key,
    title: a.title,
    xpReward: a.xpReward,
    type: a.type,
    instructions: a.instructions,
    passPercent: a.passPercent,
    questionCount: a.questionsPerAttempt ?? a.questions.length,
  };
}

export const PRACTICE_ACTIVITY_TYPES = [
  'MULTIPLE_CHOICE',
  'SORT',
  'HIGHLIGHT',
  'SEQUENCE',
  'SENSORY_LAB',
  'QUIZ',
  'TRANSFORM',
  'FILL_BLANK',
  'ERROR_HUNT',
  'REFLECTION',
] as const;

export const isWritingActivity = (a: ActivityContent | LessonActivity): a is WritingActivity =>
  (WRITING_ACTIVITY_TYPES as readonly string[]).includes(a.type);

/** Character activities (Unit 2): Quill can check whether a reader can tell who the character is. */
export const CHARACTER_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'CHARACTER_SKETCH',
  'TRAITS_IN_ACTION',
  'FLAW_SCENE',
];

/** Setting activities (Unit 3): Quill says what mood a reader feels and whether time and place are clear. */
export const SETTING_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'SETTING_SNAPSHOT',
  'MOOD_SCENE',
  'WORLD_DETAILS',
  'SETTING_SCENE',
];

/** Plot activities (Unit 4): Quill checks the conflict, the story mountain stages and the ending. */
export const PLOT_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'STORY_MOUNTAIN',
  'CONFLICT_SCENE',
  'PACING_SCENE',
  'PLOT_STORY',
];

/** Point-of-view activities (Unit 5): Quill checks whose eyes the story is told through. */
export const POV_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'FIRST_PERSON_SCENE',
  'NARRATOR_SCENE',
  'POV_REWRITE',
];

/** Sensory activities (Unit 6): Quill's sense check is the point of the activity. */
export const SENSORY_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'SENSORY_SCENE',
  'SENSORY_CHALLENGE',
];

/** Figurative activities (Unit 6): Quill checks the similes, metaphors and personification. */
export const FIGURATIVE_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'FIGURATIVE_LAB',
  'PERSONIFICATION_SCENE',
  'SENSORY_CHALLENGE',
];

/** Poetry activities (Unit 7): Quill reads the poem for form, imagery, line breaks and sound. */
export const POETRY_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'HAIKU',
  'FREE_VERSE',
  'SPOKEN_WORD',
  'SOUND_POEM',
];

/** At most this many words with the student's own syllable counts. */
/** Essay Writing grammar activities: grammar Coach checks and "Is my grammar right?". */
export const GRAMMAR_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'SENTENCE_SET',
  'GRAMMAR_PARAGRAPH',
];

/** Essay paragraphs (Unit 10 on): the paragraph Coach check, "Is my paragraph built well?" and the paragraph rubric. */
export const PARAGRAPH_ACTIVITY_TYPES: readonly WritingActivity['type'][] = ['PARAGRAPH'];

/** Essays and outlines (Unit 11 on): the essay Coach check, "Is my essay structured well?" and the essay rubrics. */
export const ESSAY_ACTIVITY_TYPES: readonly WritingActivity['type'][] = [
  'ESSAY_OUTLINE',
  'ESSAY_PART',
  'ESSAY',
];

/** Activities with an outline builder: outlines (and, from Unit 14, whole essays). */
export const OUTLINE_BUILDER_TYPES: readonly WritingActivity['type'][] = ['ESSAY_OUTLINE', 'ESSAY'];

export const MAX_SYLLABLE_OVERRIDES = 60;

/** The student's syllable counts, cleaned: known words as keys ("fire"), whole counts 1–9. */
export function validSyllables(overrides: unknown): Record<string, number> {
  if (overrides === null || typeof overrides !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [word, count] of Object.entries(overrides).slice(0, MAX_SYLLABLE_OVERRIDES)) {
    const key = syllableKey(word);
    if (key && key.length <= 30 && Number.isInteger(count) && count >= 1 && count <= 9)
      out[key] = count;
  }
  return out;
}

/** Voice activities (Unit 5): Quill says what tone a reader hears. */
export const TONE_ACTIVITY_TYPES: readonly WritingActivity['type'][] = ['VOICE_SCENE'];

/** The tone chosen for the activity's tone picker: only its scales, only whole steps. */
export function validTone(activity: WritingActivity, tone: unknown): ToneSteps {
  const axes = activity.tonePicker?.axes ?? [];
  const given =
    tone !== null && typeof tone === 'object' ? new Map(Object.entries(tone)) : new Map();
  const out: ToneSteps = {};
  for (const axis of axes) {
    const step: unknown = given.get(axis);
    if (isToneStep(step)) out[axis] = step;
  }
  return out;
}

/** True when every scale of the activity's tone picker is set. */
export const toneComplete = (activity: WritingActivity, tone: ToneChoice) =>
  (activity.tonePicker?.axes ?? []).every((a) => tone[a] !== undefined);

/** The chosen conflict if it is one of the activity's cards, else null. */
export function validConflict(
  activity: WritingActivity,
  conflict: string | null,
): ConflictTypeId | null {
  const options = activity.conflictPicker?.options ?? [];
  return options.find((o) => o === conflict) ?? null;
}

/** The paragraph builder's boxes, or empty boxes when the activity has no builder. */
export function validParagraph(activity: WritingActivity, plan: unknown): ParagraphPlan {
  const parsed = ParagraphPlan.safeParse(activity.paragraphBuilder ? (plan ?? {}) : {});
  return parsed.success ? parsed.data : ParagraphPlan.parse({});
}

/** The outline builder's boxes, or empty boxes when the activity has no builder. */
export function validOutline(activity: WritingActivity, plan: unknown): OutlinePlan {
  const parsed = OutlinePlan.safeParse(activity.outlineBuilder ? (plan ?? {}) : {});
  return parsed.success ? parsed.data : OutlinePlan.parse({});
}

/** The plan, cleaned (empty when the activity has no planner). */
export function validPlot(activity: WritingActivity, plot: unknown): PlotPlan {
  const parsed = PlotPlan.safeParse(activity.plotPlanner ? (plot ?? {}) : {});
  return parsed.success ? parsed.data : PlotPlan.parse({});
}

/** Chosen moods that fit the activity's mood picker: at most one pole per scale, in scale order. */
export function validMoods(activity: WritingActivity, moods: readonly string[]): MoodPole[] {
  const picker = activity.moodPicker;
  if (!picker) return [];
  const wanted = new Set(moods.map((m) => m.trim().toLowerCase()));
  return MOOD_AXES.filter((a) => picker.axes.includes(a.id)).flatMap((a) => {
    const pole = a.poles.find((p) => wanted.has(p));
    return pole ? [pole] : [];
  });
}

/** Words the student may not use once traits are picked: each trait and its other forms. */
export function traitBannedWords(activity: WritingActivity, traits: readonly string[]): string[] {
  const picked = new Set(traits);
  return (activity.traitPicker?.options ?? [])
    .filter((o) => picked.has(o.trait))
    .flatMap((o) => [o.trait, ...o.forms]);
}

/** The activity's rules plus the picked traits as banned words. */
export function constraintsWithTraits(
  activity: WritingActivity,
  traits: readonly string[],
): WritingConstraints {
  const extra = traitBannedWords(activity, traits);
  if (extra.length === 0) return activity.constraints;
  return {
    ...activity.constraints,
    bannedWords: [...new Set([...activity.constraints.bannedWords, ...extra])],
  };
}

/** Picked traits that are real options, in option order, at most `count`. */
export function validTraits(activity: WritingActivity, traits: readonly string[]): string[] {
  const picker = activity.traitPicker;
  if (!picker) return [];
  const wanted = new Set(traits.map((t) => t.trim().toLowerCase()));
  return picker.options
    .map((o) => o.trait)
    .filter((t) => wanted.has(t))
    .slice(0, picker.count);
}

export const ActivitiesFile = z.array(ActivityContent);

// ───────── Lesson steps (always these five, in this order) ─────────

export const STEP_IDS = ['hook', 'learn', 'practice', 'challenge', 'reflect'] as const;
export type StepId = (typeof STEP_IDS)[number];
export const StepId = z.enum(STEP_IDS);

export const STEP_LABELS: Record<StepId, string> = {
  hook: 'Hook',
  learn: 'Learn',
  practice: 'Practice',
  challenge: 'Challenge',
  reflect: 'Reflect',
};

export const HookStep = z.discriminatedUnion('variant', [
  z.object({
    id: z.literal('hook'),
    type: z.literal('hook'),
    variant: z.literal('story'),
    title: text(120),
    paragraphs: z.array(text(1000)).min(1).max(6),
  }),
  z.object({
    id: z.literal('hook'),
    type: z.literal('hook'),
    variant: z.literal('compare'),
    prompt: text(300),
    a: text(500),
    b: text(500),
    reveal: text(500),
  }),
  z.object({
    id: z.literal('hook'),
    type: z.literal('hook'),
    variant: z.literal('question'),
    prompt: text(300),
    placeholder: text(120).optional(),
  }),
]);

export const LessonCard = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('definition'), title: text(120), body: text(800) }),
  z.object({
    kind: z.literal('example'),
    title: text(120),
    text: text(800),
    note: text(500).optional(),
  }),
  z.object({
    kind: z.literal('compare'),
    title: text(120),
    telling: text(500),
    showing: text(500),
    note: text(500).optional(),
    /** Column headings (default: Telling / Showing). */
    labels: z.tuple([text(30), text(30)]).optional(),
  }),
  /**
   * The POV simulator (Unit 5): one scene told 2–3 ways, switched with tabs. A camera picture shows
   * where each narrator stands, and `knows` says what that narrator can know.
   */
  z.object({
    kind: z.literal('pov-simulator'),
    title: text(120),
    prompt: text(300).optional(),
    versions: z
      .array(
        z.object({
          pov: z.enum(['first', 'third-limited', 'omniscient']),
          text: text(800),
          knows: text(300),
        }),
      )
      .min(2)
      .max(3),
  }),
  z.object({
    kind: z.literal('clue-hunt'),
    title: text(120),
    prompt: text(300),
    text: text(800),
    clues: z.array(z.string().trim().min(1)).min(1).max(6),
  }),
]);
export type LessonCard = z.infer<typeof LessonCard>;

/** Tab names for the POV simulator. */
export const POV_VERSION_LABELS = {
  first: 'First person',
  'third-limited': 'Third person limited',
  omniscient: 'Omniscient',
} as const;

export const LearnStep = z.object({
  id: z.literal('learn'),
  type: z.literal('mini_lesson'),
  cards: z.array(LessonCard).min(3).max(6),
});

export const PracticeStep = z.object({
  id: z.literal('practice'),
  type: z.literal('guided_practice'),
  activityKeys: z.array(ActivityKey).min(1).max(5),
});

export const ChallengeStep = z.object({
  id: z.literal('challenge'),
  type: z.literal('challenge'),
  activityKey: ActivityKey,
});

export const ReflectStep = z.object({
  id: z.literal('reflect'),
  type: z.literal('reflection'),
  prompts: z.array(text(300)).min(1).max(3),
  confidenceCheck: z.boolean().default(true),
});

export const LessonSteps = z.tuple([HookStep, LearnStep, PracticeStep, ChallengeStep, ReflectStep]);
export type LessonSteps = z.infer<typeof LessonSteps>;

export const LessonContent = z.object({
  slug: id,
  order: z.number().int().min(1).max(20),
  title: text(120),
  estMinutes: z.number().int().min(5).max(120),
  focusSkills: z.array(id).max(5).default([]),
  steps: LessonSteps,
});
export type LessonContent = z.infer<typeof LessonContent>;

// ───────── Units ─────────

/** Story Writing has 12 units, Essay Writing 15. */
export const MAX_UNITS: Record<Track, number> = { STORY: 12, ESSAY: 15 };

export const UnitContent = z.object({
  number: z.number().int().min(1).max(15),
  slug: id,
  title: text(120),
  summary: text(500),
  bigIdeas: z.array(text(200)).max(6).default([]),
  published: z.boolean(),
  projectSpec: z
    .object({
      title: text(120),
      description: text(1000),
      minWords: z.number().int().positive(),
      maxWords: z.number().int().positive(),
    })
    .optional(),
});
export type UnitContent = z.infer<typeof UnitContent>;

export interface UnitBundle {
  /** From the folder: content/units → STORY, content/essay → ESSAY. */
  track?: Track;
  unit: UnitContent;
  lessons: LessonContent[];
  activities: ActivityContent[];
}

// ───────── Cross-reference checks (things a schema alone can't express) ─────────

/** Lowercase word tokens with punctuation stripped, for highlight/clue matching. */
export function tokenize(passage: string): string[] {
  return passage.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.map((w) => w.toLowerCase()) ?? [];
}

export function validateUnitBundle({
  track = 'STORY',
  unit,
  lessons,
  activities,
}: UnitBundle): string[] {
  const errors: string[] = [];
  const prefix = activityKeyPrefix(track, unit.number);
  if (unit.number > MAX_UNITS[track])
    errors.push(`Unit number ${unit.number} is more than ${MAX_UNITS[track]}`);
  const byKey = new Map<string, ActivityContent>();

  for (const a of activities) {
    if (byKey.has(a.key)) errors.push(`Duplicate activity key "${a.key}"`);
    byKey.set(a.key, a);
    if (!a.key.startsWith(prefix)) errors.push(`Activity "${a.key}" must start with "${prefix}"`);

    if (a.type === 'MULTIPLE_CHOICE') {
      for (const q of a.questions) {
        const ids = q.options.map((o) => o.id);
        if (new Set(ids).size !== ids.length) errors.push(`${a.key}/${q.id}: duplicate option ids`);
        if (!ids.includes(q.correctOptionId))
          errors.push(`${a.key}/${q.id}: correctOptionId "${q.correctOptionId}" is not an option`);
      }
    }
    if (a.type === 'QUIZ') {
      const qids = a.questions.map((q) => q.id);
      if (new Set(qids).size !== qids.length) errors.push(`${a.key}: duplicate question ids`);
      for (const q of a.questions) {
        const ids = q.options.map((o) => o.id);
        if (new Set(ids).size !== ids.length) errors.push(`${a.key}/${q.id}: duplicate option ids`);
        if (!ids.includes(q.correctOptionId))
          errors.push(`${a.key}/${q.id}: correctOptionId "${q.correctOptionId}" is not an option`);
      }
      if (a.questionsPerAttempt && a.questionsPerAttempt > a.questions.length)
        errors.push(`${a.key}: questionsPerAttempt is more than the number of questions`);
    }
    if (a.type === 'TRANSFORM') {
      const ids = a.items.map((i) => i.id);
      if (new Set(ids).size !== ids.length) errors.push(`${a.key}: duplicate item ids`);
      for (const item of a.items) {
        if (transformMatches(item.source, item.answers))
          errors.push(`${a.key}/${item.id}: the sentence already matches an answer`);
      }
    }
    if (a.type === 'SORT') {
      const buckets = new Set(a.buckets.map((b) => b.id));
      for (const item of a.items) {
        if (!buckets.has(item.bucketId))
          errors.push(`${a.key}/${item.id}: unknown bucket "${item.bucketId}"`);
      }
      for (const b of buckets) {
        if (!a.items.some((i) => i.bucketId === b))
          errors.push(`${a.key}: bucket "${b}" has no items`);
      }
    }
    if (isWritingActivity(a) && a.traitPicker) {
      const traits = a.traitPicker.options.map((o) => o.trait);
      if (new Set(traits).size !== traits.length) errors.push(`${a.key}: duplicate trait options`);
      if (a.traitPicker.count > traits.length)
        errors.push(`${a.key}: traitPicker.count is more than the number of options`);
    }
    if (isWritingActivity(a) && a.constraints.perspectives) {
      const labels = a.constraints.perspectives.map((p) => p.label.toLowerCase());
      if (new Set(labels).size !== labels.length)
        errors.push(`${a.key}: duplicate perspective labels`);
      if (a.constraints.povLock) errors.push(`${a.key}: use perspectives or povLock, not both`);
    }
    if (isWritingActivity(a) && a.starterInEditor && !a.starter)
      errors.push(`${a.key}: starterInEditor needs a starter`);
    if (
      isWritingActivity(a) &&
      a.paragraphBuilder &&
      a.type !== 'PARAGRAPH' &&
      !(a.type === 'ESSAY_PART' && a.essay?.part === 'body')
    )
      errors.push(`${a.key}: paragraphBuilder is for PARAGRAPH and body paragraph activities`);
    if (
      isWritingActivity(a) &&
      (a.essay?.part === 'body' || a.essay?.part === 'conclusion') &&
      !a.essay.thesis
    )
      errors.push(
        `${a.key}: body paragraph and conclusion tasks need essay.thesis to link back to`,
      );
    if (isWritingActivity(a) && a.essayPrompts) {
      const types = a.essayPrompts.map((p) => p.type);
      if (a.type !== 'ESSAY') errors.push(`${a.key}: essayPrompts are for ESSAY activities`);
      if (new Set(types).size !== types.length)
        errors.push(`${a.key}: two essay prompts of the same kind`);
      if (a.essay && !types.includes(a.essay.type))
        errors.push(`${a.key}: essay.type must be one of the essay prompts' kinds`);
    }
    if (isWritingActivity(a) && a.checklist && a.type !== 'ESSAY')
      errors.push(`${a.key}: checklist is for ESSAY activities`);
    if (isWritingActivity(a) && a.checklist) {
      const ids = a.checklist.items.map((i) => i.id);
      if (new Set(ids).size !== ids.length) errors.push(`${a.key}: duplicate checklist item ids`);
      if (a.checklist.items.some((i) => i.auto === 'counterclaim') && !a.essay?.counterclaim)
        errors.push(`${a.key}: the counterclaim check needs essay.counterclaim`);
    }
    if (isWritingActivity(a) && a.outlineBuilder && !OUTLINE_BUILDER_TYPES.includes(a.type))
      errors.push(`${a.key}: outlineBuilder is for essay and outline activities`);
    if (isWritingActivity(a) && (a.type === 'ESSAY_PART') !== (a.essay?.part !== undefined))
      errors.push(`${a.key}: essay.part is for ESSAY_PART activities, which need it`);
    if (isWritingActivity(a) && ESSAY_ACTIVITY_TYPES.includes(a.type) && !a.essay)
      errors.push(`${a.key}: essay activities need essay: { type }`);
    if (
      isWritingActivity(a) &&
      a.essay?.type !== 'argumentative' &&
      (a.essay?.counterclaim || a.outlineBuilder?.counterclaim)
    )
      errors.push(`${a.key}: counterclaims are for argumentative essays`);
    if (isWritingActivity(a)) {
      const c = a.constraints;
      if (c.minStanzas && c.maxStanzas && c.minStanzas > c.maxStanzas)
        errors.push(`${a.key}: minStanzas is more than maxStanzas`);
      if (c.minLines && c.maxLines && c.minLines > c.maxLines)
        errors.push(`${a.key}: minLines is more than maxLines`);
    }
    if (a.type === 'SENSORY_LAB') {
      const senses = a.stations.map((s) => s.sense);
      if (new Set(senses).size !== senses.length)
        errors.push(`${a.key}: two stations for the same sense`);
      for (const s of a.stations) {
        if (new Set(s.ideas).size !== s.ideas.length)
          errors.push(`${a.key}/${s.sense}: duplicate idea words`);
        if (s.ideas.length < a.wordsPerStation)
          errors.push(`${a.key}/${s.sense}: fewer ideas than wordsPerStation`);
      }
    }
    if (a.type === 'SEQUENCE') {
      const ids = a.items.map((i) => i.id);
      if (new Set(ids).size !== ids.length) errors.push(`${a.key}: duplicate item ids`);
      if (a.labels && a.labels.length !== a.items.length)
        errors.push(`${a.key}: labels must match the number of items`);
    }
    if (a.type === 'FILL_BLANK') {
      const ids = a.items.map((i) => i.id);
      if (new Set(ids).size !== ids.length) errors.push(`${a.key}: duplicate item ids`);
      for (const item of a.items) {
        if (item.sentence.split(BLANK).length !== 2)
          errors.push(`${a.key}/${item.id}: the sentence needs exactly one "${BLANK}"`);
        const choices = item.choices ?? a.choices;
        if (choices && !item.answers.some((ans) => blankMatches(ans, choices)))
          errors.push(`${a.key}/${item.id}: no answer is one of the choices`);
      }
    }
    if (a.type === 'ERROR_HUNT') {
      const at = errorPositions(a);
      a.errors.forEach((e, i) => {
        if (at[i] === -1)
          errors.push(
            `${a.key}: error "${e.word}" (occurrence ${e.occurrence}) is not a word in the text`,
          );
        if (errorFixMatches(e.word, e.word, e.fixes))
          errors.push(`${a.key}: error "${e.word}" is already one of its fixes`);
      });
      if (new Set(at).size !== at.length)
        errors.push(`${a.key}: two errors point at the same word`);
    }
    if (isWritingActivity(a) && a.proofread) {
      if (!a.starter || !a.starterInEditor)
        errors.push(`${a.key}: proofread needs a starter with starterInEditor`);
      const starter = normaliseForProofread(a.starter ?? '');
      const wrongs = a.proofread.errors.map((e) => normaliseForProofread(e.wrong));
      a.proofread.errors.forEach((e, i) => {
        const wrong = wrongs[i]!;
        if (occurrences(starter, wrong) !== 1)
          errors.push(`${a.key}: proofread "${e.wrong}" must appear exactly once in the starter`);
        if (wrongs.some((w, j) => j !== i && (w.includes(wrong) || wrong.includes(w))))
          errors.push(`${a.key}: proofread "${e.wrong}" overlaps another mistake`);
        for (const f of e.fixes) {
          const fix = normaliseForProofread(f);
          if (fix.includes(wrong))
            errors.push(`${a.key}: proofread fix "${f}" still contains the mistake`);
          else if (starter.includes(fix))
            errors.push(`${a.key}: proofread fix "${f}" is already in the starter`);
        }
      });
    }
    if (isWritingActivity(a) && a.sentenceSet) {
      if (a.constraints.minSentences !== a.sentenceSet.sentences.length)
        errors.push(`${a.key}: constraints.minSentences must equal the number of sentence tasks`);
    }
    if (a.type === 'HIGHLIGHT') {
      const tokens = new Set(tokenize(a.text));
      for (const t of a.targets) {
        if (!tokens.has(t.toLowerCase()))
          errors.push(`${a.key}: target "${t}" is not a word in the text`);
      }
    }
  }

  const orders = new Set<number>();
  const slugs = new Set<string>();
  for (const lesson of lessons) {
    const where = `lesson "${lesson.slug}"`;
    if (orders.has(lesson.order)) errors.push(`${where}: duplicate order ${lesson.order}`);
    if (slugs.has(lesson.slug)) errors.push(`${where}: duplicate slug`);
    orders.add(lesson.order);
    slugs.add(lesson.slug);

    const [, learn, practice, challenge] = lesson.steps;
    for (const card of learn.cards) {
      if (card.kind === 'pov-simulator') {
        const povs = card.versions.map((v) => v.pov);
        if (new Set(povs).size !== povs.length)
          errors.push(`${where}: the POV simulator shows the same point of view twice`);
      }
      if (card.kind === 'clue-hunt') {
        const tokens = new Set(tokenize(card.text));
        for (const clue of card.clues) {
          if (!tokens.has(clue.toLowerCase()))
            errors.push(`${where}: clue "${clue}" is not a word in the card text`);
        }
      }
    }
    for (const key of practice.activityKeys) {
      const a = byKey.get(key);
      if (!a) errors.push(`${where}: practice activity "${key}" does not exist`);
      else if (isWritingActivity(a))
        errors.push(`${where}: practice activity "${key}" must not be a writing activity`);
    }
    const c = byKey.get(challenge.activityKey);
    if (!c) errors.push(`${where}: challenge activity "${challenge.activityKey}" does not exist`);
    else if (!isWritingActivity(c))
      errors.push(
        `${where}: challenge activity "${challenge.activityKey}" must be a writing activity`,
      );
  }

  for (const a of activities) {
    if (!isWritingActivity(a) || !a.continuesFrom) continue;
    const from = byKey.get(a.continuesFrom);
    if (!from || !isWritingActivity(from) || from.key === a.key)
      errors.push(
        `${a.key}: continuesFrom "${a.continuesFrom}" is not another writing activity in this unit`,
      );
  }

  const sorted = [...orders].toSorted((a, b) => a - b);
  if (sorted.some((o, i) => o !== i + 1))
    errors.push(`Lesson orders must be 1, 2, 3, … without gaps (got ${sorted.join(', ')})`);
  if (unit.published && lessons.length === 0)
    errors.push('A published unit needs at least one lesson');
  return errors;
}
