import { z } from 'zod';
import { MathFactsFile, MathTestKey } from '../curriculum/math-content.js';
import { MathProblem, MathProblemPublic, MathStrandId } from '../curriculum/math.js';

/**
 * Math track contracts (math-design.md): marked problem sets, the error log, the answer record,
 * skill mastery, the daily review, sprints and timed tests, and Quill's explanations and nudges.
 */

/** The skill strands of the Math track, by unit number. */
export const MATH_STRANDS = [
  { id: 'strategy', label: 'Strategy', emoji: '🧭', units: [1, 14, 15] },
  { id: 'algebra', label: 'Algebra', emoji: '📈', units: [2, 3, 4, 5, 6] },
  { id: 'number-theory', label: 'Number theory', emoji: '🔢', units: [7, 8] },
  { id: 'counting', label: 'Counting & probability', emoji: '🎲', units: [9, 10] },
  { id: 'geometry', label: 'Geometry', emoji: '📐', units: [11, 12, 13] },
] as const;

/** AMC scoring: 6 for a right answer, 1.5 for a blank, 0 for a wrong one. */
export const AMC_POINTS = { correct: 6, blank: 1.5, wrong: 0 } as const;
/** The AMC pace: 75 minutes for 25 questions. */
export const AMC_SECONDS_PER_PROBLEM = 180;
/** The 2-minute rule (math-design.md §3.4 D1). */
export const SKIP_PROMPT_SECONDS = 120;
/** A question that took longer than this is a "time sink". */
export const TIME_SINK_SECONDS = 240;

/** Confidence after answering (math-design.md §3.2 B5). */
export const MATH_CONFIDENCE = [
  { value: 3, label: 'Sure' },
  { value: 2, label: 'Think so' },
  { value: 1, label: 'Guessing' },
] as const;
export const MathConfidence = z.number().int().min(1).max(3);
export type MathConfidence = z.infer<typeof MathConfidence>;

const answerText = z.string().trim().max(100);

/**
 * Where a problem lives: a lesson activity (practice or a marked set) or a test outside the units
 * (`activityKey` "test:diagnostic"); `seed` picks the template variant.
 */
export const ProblemLocator = z.object({
  lessonId: z.string().min(1).max(40).optional(),
  activityKey: z.string().min(1).max(80),
  problemId: z.string().min(1).max(80),
  seed: z.number().int().min(0).optional(),
});
export type ProblemLocator = z.infer<typeof ProblemLocator>;

// ───────── Marked problem sets ─────────

export const ProblemSetAttemptView = z.object({
  attemptId: z.string(),
  attemptNumber: z.number(),
  passPercent: z.number().nullable(),
  timeLimitMinutes: z.number().nullable(),
  startedAt: z.string(),
  problems: z.array(MathProblemPublic),
});
export type ProblemSetAttemptView = z.infer<typeof ProblemSetAttemptView>;

/** Answers by problem id: a letter A–E for choices, the typed answer otherwise; "" or missing is blank. */
export const SubmitProblemSetRequest = z.object({
  answers: z.record(z.string(), z.string().max(100)),
  /** Sure / Think so / Guessing per problem id (optional). */
  confidence: z.record(z.string(), MathConfidence).optional(),
});
export type SubmitProblemSetRequest = z.infer<typeof SubmitProblemSetRequest>;

export const ProblemVerdict = z.enum(['correct', 'wrong', 'form', 'blank']);
export type ProblemVerdict = z.infer<typeof ProblemVerdict>;

export const ProblemReviewItem = z.object({
  problem: MathProblemPublic,
  given: z.string(),
  verdict: ProblemVerdict,
  rightAnswer: z.string(),
  solution: z.string(),
  skill: z.string(),
  /** The authored note on this wrong answer, if any. */
  note: z.string().nullable().default(null),
  confidence: MathConfidence.nullable().default(null),
});
export type ProblemReviewItem = z.infer<typeof ProblemReviewItem>;

export const ProblemSetResult = z.object({
  attemptId: z.string(),
  score: z.number(),
  total: z.number(),
  percent: z.number(),
  passed: z.boolean(),
  passPercent: z.number().nullable(),
  review: z.array(ProblemReviewItem),
  /** Skills of the problems missed, for "Review: …". */
  reviewSkills: z.array(z.string()),
  /** How many missed problems went to the error log. */
  addedToErrorLog: z.number(),
});
export type ProblemSetResult = z.infer<typeof ProblemSetResult>;

export const ProblemSetStatus = z.object({
  attempts: z.number(),
  bestPercent: z.number().nullable(),
  done: z.boolean(),
  passPercent: z.number().nullable(),
  problemCount: z.number(),
  timeLimitMinutes: z.number().nullable(),
  last: ProblemSetResult.nullable(),
});
export type ProblemSetStatus = z.infer<typeof ProblemSetStatus>;

// ───────── Error log ─────────

/** A missed problem is resolved after this many right redos, on different days. */
export const REDOS_TO_RESOLVE = 2;

export const AddErrorLogRequest = ProblemLocator;
export type AddErrorLogRequest = z.infer<typeof AddErrorLogRequest>;

export const ErrorLogEntry = z.object({
  id: z.string(),
  lessonId: z.string(),
  /** The lesson, or the test's title for a test problem. */
  lessonTitle: z.string(),
  unitNumber: z.number(),
  activityKey: z.string(),
  skill: z.string(),
  /** The problem to redo: a template problem has new numbers each time. */
  problem: MathProblemPublic,
  /** The variant that was missed, when the redo has new numbers. */
  missed: MathProblemPublic.nullable(),
  wrongTimes: z.number(),
  correctRedos: z.number(),
  lastRedoAt: z.string().nullable(),
  resolvedAt: z.string().nullable(),
  createdAt: z.string(),
  /** False when a right redo today would not count (one counts per day). */
  canCountToday: z.boolean(),
});
export type ErrorLogEntry = z.infer<typeof ErrorLogEntry>;

export const ErrorLogList = z.object({
  open: z.array(ErrorLogEntry),
  resolved: z.array(ErrorLogEntry),
});
export type ErrorLogList = z.infer<typeof ErrorLogList>;

export const RedoRequest = z.object({ answer: z.string().trim().min(1).max(100) });
export type RedoRequest = z.infer<typeof RedoRequest>;

export const RedoResponse = z.object({
  verdict: ProblemVerdict,
  message: z.string(),
  note: z.string().nullable(),
  entry: ErrorLogEntry,
  /** Shown once the redo is right, or after a wrong one. */
  solution: z.string(),
  rightAnswer: z.string().nullable(),
});
export type RedoResponse = z.infer<typeof RedoResponse>;

// ───────── The answer record (B1) ─────────

/** One practice problem finished (solved or shown): the first answer is re-marked by the server. */
export const PracticeAnswer = z.object({
  lessonId: z.string().min(1).max(40),
  activityKey: z.string().min(1).max(80),
  problemId: z.string().min(1).max(80),
  seed: z.number().int().min(0).optional(),
  /** The first answer checked ("" when the solution was shown before any answer). */
  firstAnswer: answerText,
  hintsUsed: z.number().int().min(0).max(3),
  /** "Show me the solution" was used. */
  revealed: z.boolean(),
  seconds: z.number().int().min(0).max(7200).optional(),
});
export type PracticeAnswer = z.infer<typeof PracticeAnswer>;

export const PracticeAnswersRequest = z.object({ answers: z.array(PracticeAnswer).min(1).max(20) });
export type PracticeAnswersRequest = z.infer<typeof PracticeAnswersRequest>;

export const PracticeAnswersResponse = z.object({ saved: z.number() });
export type PracticeAnswersResponse = z.infer<typeof PracticeAnswersResponse>;

// ───────── Skills, calibration and danger zones (B2, B5, D4) ─────────

export const MASTERY_LEVELS = ['new', 'learning', 'strong', 'mastered'] as const;
export const MasteryLevel = z.enum(MASTERY_LEVELS);
export type MasteryLevel = z.infer<typeof MasteryLevel>;
export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  new: 'New',
  learning: 'Learning',
  strong: 'Strong',
  mastered: 'Mastered',
};

export const SkillMastery = z.object({
  skill: z.string(),
  label: z.string(),
  strand: MathStrandId,
  units: z.array(z.number()),
  level: MasteryLevel,
  /** Weighted recent accuracy, 0–100 (null before any answer). */
  accuracy: z.number().nullable(),
  answered: z.number(),
  /** When the daily review brings the skill back. */
  dueAt: z.string().nullable(),
  /** Median seconds per answer, when timed. */
  medianSeconds: z.number().nullable(),
});
export type SkillMastery = z.infer<typeof SkillMastery>;

export const CalibrationRow = z.object({
  confidence: MathConfidence,
  label: z.string(),
  answered: z.number(),
  correct: z.number(),
  percent: z.number().nullable(),
});
export type CalibrationRow = z.infer<typeof CalibrationRow>;

export const POSITION_BANDS = ['1-10', '11-20', '21-25'] as const;
export const PositionBand = z.enum(POSITION_BANDS);
export type PositionBand = z.infer<typeof PositionBand>;

export const PositionRow = z.object({
  band: PositionBand,
  answered: z.number(),
  correct: z.number(),
  percent: z.number().nullable(),
});
export type PositionRow = z.infer<typeof PositionRow>;

export const DangerZone = z.object({
  kind: z.enum(['weak', 'slow', 'overconfident', 'position', 'past-paper']),
  /** The skill to practise (null for a question-position zone). */
  skill: z.string().nullable(),
  title: z.string(),
  reason: z.string(),
});
export type DangerZone = z.infer<typeof DangerZone>;

// ───────── The past-paper log and the AMC-score estimate (M15, math-design.md §4.15) ─────────

export const AMC_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
export const AmcLetter = z.enum(AMC_LETTERS);
export type AmcLetter = z.infer<typeof AmcLetter>;
/** An official paper has 25 questions. */
export const PAST_PAPER_SIZE = 25;

/**
 * One question of a past paper the student worked outside StoryForge: their letter (null for a
 * blank), the official letter and an optional topic tag. Never the problem text (© MAA).
 */
export const PastPaperItem = z.object({
  answer: AmcLetter.nullable(),
  official: AmcLetter,
  skill: z.string().trim().min(1).max(60).nullable(),
});
export type PastPaperItem = z.infer<typeof PastPaperItem>;

export const CreatePastPaperRequest = z.object({
  /** The student's own name for the paper, e.g. "Practice paper 1". */
  label: z.string().trim().min(1).max(60),
  takenOn: z.iso.date(),
  items: z.array(PastPaperItem).length(PAST_PAPER_SIZE),
});
export type CreatePastPaperRequest = z.infer<typeof CreatePastPaperRequest>;

export const PastPaperView = z.object({
  id: z.string(),
  label: z.string(),
  takenOn: z.string(),
  correct: z.number(),
  wrong: z.number(),
  blank: z.number(),
  points: z.number(),
  items: z.array(PastPaperItem),
  /** Tagged skills with a wrong answer, most missed first. */
  missedSkills: z.array(z.object({ skill: z.string(), label: z.string(), missed: z.number() })),
});
export type PastPaperView = z.infer<typeof PastPaperView>;

export const PastPaperList = z.object({ papers: z.array(PastPaperView) });
export type PastPaperList = z.infer<typeof PastPaperList>;

/** A full 25-question score: a checkpoint, a Unit 15 mock or a logged past paper. */
export const FullTestScore = z.object({
  kind: z.enum(['checkpoint', 'mock', 'past-paper']),
  title: z.string(),
  points: z.number(),
  date: z.string(),
  /** The attempt's review (null for a past paper). */
  attemptId: z.string().nullable(),
});
export type FullTestScore = z.infer<typeof FullTestScore>;

/** How many recent full tests the AMC-score estimate averages. */
export const ESTIMATE_TESTS = 3;

export const AmcScores = z.object({
  /** Newest first. */
  tests: z.array(FullTestScore),
  /** From the last ESTIMATE_TESTS full tests; null before the first one. */
  estimate: z
    .object({ points: z.number(), low: z.number(), high: z.number(), basedOn: z.number() })
    .nullable(),
});
export type AmcScores = z.infer<typeof AmcScores>;

/**
 * The AMC-score estimate: the mean of the last few full-test scores (rounded to a half point), with
 * their lowest and highest as the range. One test gives a range of ±6 points (one question).
 */
export function amcEstimate(newestFirst: readonly { points: number }[]): AmcScores['estimate'] {
  const recent = newestFirst.slice(0, ESTIMATE_TESTS).map((t) => t.points);
  if (recent.length === 0) return null;
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const points = Math.round(mean * 2) / 2;
  const clamp = (x: number) => Math.min(150, Math.max(0, x));
  return recent.length === 1
    ? { points, low: clamp(points - 6), high: clamp(points + 6), basedOn: 1 }
    : { points, low: Math.min(...recent), high: Math.max(...recent), basedOn: recent.length };
}

export const MathSkillsView = z.object({
  /** Checkpoint, mock and past-paper scores with the AMC-score estimate. */
  scores: AmcScores,
  skills: z.array(SkillMastery),
  calibration: z.array(CalibrationRow),
  /** "Your 'Guessing' answers are right 18% of the time: leave those blank." */
  calibrationAdvice: z.string().nullable(),
  positions: z.array(PositionRow),
  /** The top 3 danger zones. */
  dangerZones: z.array(DangerZone),
});
export type MathSkillsView = z.infer<typeof MathSkillsView>;

// ───────── Tests, sprints and the daily review (B3, B4, D1–D3, D6) ─────────

export const MATH_TEST_KINDS = [
  'diagnostic',
  'checkpoint',
  'mock',
  'sprint',
  'review',
  'light-review',
] as const;
export const MathTestKind = z.enum(MATH_TEST_KINDS);
export type MathTestKind = z.infer<typeof MathTestKind>;

/** What POST /math/tests/:key/start accepts. */
export const MathStartKey = z.union([MathTestKey, z.enum(['sprint', 'review', 'light-review'])]);
export type MathStartKey = z.infer<typeof MathStartKey>;

/** A problem in an attempt (stored in MathTestAttempt.items). */
export const MathTestItem = ProblemLocator.extend({
  /** A daily-review redo of this error-log entry. */
  errorLogId: z.string().optional(),
});
export type MathTestItem = z.infer<typeof MathTestItem>;

/** A saved answer in an attempt (stored in MathTestAttempt.answers by item index). */
export const MathTestAnswer = z.object({
  answer: answerText,
  seconds: z.number().int().min(0).max(7200),
  confidence: MathConfidence.optional(),
  flagged: z.boolean().default(false),
  /** Instant-check kinds (the reviews): set when the answer was checked. */
  verdict: ProblemVerdict.optional(),
});
export type MathTestAnswer = z.infer<typeof MathTestAnswer>;

export const SaveTestAnswerRequest = z.object({
  index: z.number().int().min(0).max(40),
  answer: answerText,
  seconds: z.number().int().min(0).max(7200),
  confidence: MathConfidence.optional(),
  flagged: z.boolean().default(false),
  /** Instant-check kinds: check this answer now (it can't be changed after). */
  check: z.boolean().default(false),
});
export type SaveTestAnswerRequest = z.infer<typeof SaveTestAnswerRequest>;

/** The feedback on a checked answer (reviews), or after hand-in. */
export const TestItemFeedback = z.object({
  verdict: ProblemVerdict,
  message: z.string(),
  note: z.string().nullable(),
  rightAnswer: z.string(),
  solution: z.string(),
});
export type TestItemFeedback = z.infer<typeof TestItemFeedback>;

export const MathFactCard = z.object({ title: z.string(), text: z.string() });
export type MathFactCard = z.infer<typeof MathFactCard>;

export const MathTestView = z.object({
  attemptId: z.string(),
  kind: MathTestKind,
  testKey: z.string(),
  title: z.string(),
  instructions: z.string(),
  /** Reviews check each answer as it is given; tests and sprints mark on hand-in. */
  instant: z.boolean(),
  /** AMC scoring (6 / 1.5 / 0). */
  amcScoring: z.boolean(),
  timeLimitSeconds: z.number().nullable(),
  startedAt: z.string(),
  problems: z.array(MathProblemPublic),
  /** Where each problem lives (for Quill and the error log after hand-in). */
  locators: z.array(MathTestItem.omit({ errorLogId: true })),
  /** Which problems are error-log redos (reviews). */
  redo: z.array(z.boolean()),
  answers: z.record(z.string(), MathTestAnswer),
  /** Reviews: the feedback on answers already checked, by index. */
  feedback: z.record(z.string(), TestItemFeedback),
  /** Light review: fact-sheet cards to read. */
  facts: z.array(MathFactCard),
});
export type MathTestView = z.infer<typeof MathTestView>;

export const SaveTestAnswerResponse = z.object({
  saved: z.boolean(),
  feedback: TestItemFeedback.nullable(),
});
export type SaveTestAnswerResponse = z.infer<typeof SaveTestAnswerResponse>;

export const TestReviewItem = TestItemFeedback.extend({
  number: z.number(),
  problem: MathProblemPublic,
  locator: MathTestItem.omit({ errorLogId: true }),
  given: z.string(),
  skill: z.string(),
  seconds: z.number(),
  confidence: MathConfidence.nullable(),
  flagged: z.boolean(),
});
export type TestReviewItem = z.infer<typeof TestReviewItem>;

export const TestBandRow = z.object({
  band: PositionBand,
  correct: z.number(),
  total: z.number(),
  points: z.number(),
});

export const TestStrandRow = z.object({
  strand: MathStrandId,
  label: z.string(),
  correct: z.number(),
  total: z.number(),
});

export const TestResult = z.object({
  attemptId: z.string(),
  kind: MathTestKind,
  testKey: z.string(),
  title: z.string(),
  amcScoring: z.boolean(),
  submittedAt: z.string(),
  correct: z.number(),
  wrong: z.number(),
  blank: z.number(),
  total: z.number(),
  points: z.number(),
  maxPoints: z.number(),
  /** "Your score if you had left your guesses blank" (null when nothing was marked a guess). */
  pointsIfGuessesBlank: z.number().nullable(),
  bands: z.array(TestBandRow),
  strands: z.array(TestStrandRow),
  /** Questions that took over TIME_SINK_SECONDS. */
  timeSinks: z.array(
    z.object({ number: z.number(), seconds: z.number(), verdict: ProblemVerdict }),
  ),
  review: z.array(TestReviewItem),
  /** Diagnostic: the suggested focus units and the change since the last diagnostic. */
  focusUnits: z.array(z.object({ number: z.number(), title: z.string(), reason: z.string() })),
  previousPoints: z.number().nullable(),
});
export type TestResult = z.infer<typeof TestResult>;

export const TestCard = z.object({
  key: z.string(),
  kind: MathTestKind,
  title: z.string(),
  instructions: z.string(),
  problemCount: z.number(),
  timeLimitMinutes: z.number().nullable(),
  unlocked: z.boolean(),
  lockedReason: z.string().nullable(),
  attempts: z.number(),
  best: z.object({ points: z.number(), correct: z.number(), total: z.number() }).nullable(),
  /** An unfinished attempt to continue. */
  openAttemptId: z.string().nullable(),
  /** The last finished attempt (for its review). */
  lastAttemptId: z.string().nullable(),
});
export type TestCard = z.infer<typeof TestCard>;

export const ReviewStatus = z.object({
  /** Problems due today (redos + skills). */
  due: z.number(),
  doneToday: z.boolean(),
  /** Days in a row with the review done (display only). */
  streak: z.number(),
  /** Problems available for a light review. */
  lightAvailable: z.number(),
});
export type ReviewStatus = z.infer<typeof ReviewStatus>;

export const StageView = z.object({
  number: z.number(),
  title: z.string(),
  focus: z.string(),
  /** Math unit numbers in this stage (a split unit appears in each of its stages). */
  units: z.array(
    z.object({ number: z.number(), lessons: z.tuple([z.number(), z.number()]).nullable() }),
  ),
  tests: z.array(z.string()),
  extras: z.array(z.enum(['sprints', 'light-review', 'fact-sheets'])),
});
export type StageView = z.infer<typeof StageView>;

export const MathHome = z.object({
  stages: z.array(StageView),
  /** The stage of the student's next lesson. */
  currentStage: z.number().nullable(),
  tests: z.array(TestCard),
  review: ReviewStatus,
  /** Choice problems a sprint can draw from (needs at least SPRINT_MIN). */
  sprintProblems: z.number(),
  /** Units with a fact sheet. */
  factSheets: z.array(z.object({ number: z.number(), slug: z.string(), title: z.string() })),
});
export type MathHome = z.infer<typeof MathHome>;

export const SPRINT_SIZE = 10;
export const SPRINT_MINUTES = 20;
export const SPRINT_MIN = 3;
export const REVIEW_SIZE = 6;
export const LIGHT_REVIEW_SIZE = 4;

export const FactSheetView = z.object({
  unitNumber: z.number(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  sheet: MathFactsFile,
  skillLabels: z.record(z.string(), z.string()),
});
export type FactSheetView = z.infer<typeof FactSheetView>;

/** "Try a similar one" for a problem without a template: another of the same skill and difficulty. */
export const SimilarProblemResponse = z.object({
  locator: ProblemLocator.nullable(),
  /** A practice problem (practice problems are checked in the browser). */
  problem: MathProblem.nullable(),
});
export type SimilarProblemResponse = z.infer<typeof SimilarProblemResponse>;

/** The trap picker's choices (C3): the lesson's problems, the ones the student missed first. */
export const TrapProblems = z.object({
  problems: z.array(
    z.object({
      activityKey: z.string(),
      problemId: z.string(),
      prompt: z.string(),
      missed: z.boolean(),
    }),
  ),
});
export type TrapProblems = z.infer<typeof TrapProblems>;

// ───────── Teacher: the class skills view (C5) ─────────

export const ClassMathSkills = z.object({
  classId: z.string(),
  skills: z.array(z.object({ skill: z.string(), label: z.string(), strand: MathStrandId })),
  students: z.array(
    z.object({
      studentId: z.string(),
      displayName: z.string(),
      levels: z.record(z.string(), MasteryLevel),
    }),
  ),
  /** The class's five weakest skills (most students at New or Learning, with answers). */
  weakest: z.array(z.object({ skill: z.string(), label: z.string(), struggling: z.number() })),
});
export type ClassMathSkills = z.infer<typeof ClassMathSkills>;

// ───────── Quill: explanations, nudges and the card tutor ─────────

/** "Explain the solution" or "Why was my answer wrong?". Never changes the verdict. */
export const MathExplainRequest = ProblemLocator.extend({
  mode: z.enum(['explain', 'mistake']),
  /** The student's answer (mistake mode): a number or expression only, never free text. */
  answer: z.string().trim().max(100).optional(),
  /** "My working" (mistake mode, optional): never stored or logged, never cached. */
  working: z.string().trim().max(1500).optional(),
  attempt: z.number().int().min(0).max(4).default(0),
});
export type MathExplainRequest = z.infer<typeof MathExplainRequest>;

export const MathExplainResponse = z.object({
  /** Short steps in plain text with $…$ math. */
  steps: z.array(z.string()).min(1).max(8),
  /** The key idea to remember. */
  keyIdea: z.string(),
  /** Mistake mode: the likely slip ("You found the area of the whole square"). */
  likelyMistake: z.string().nullable(),
  remaining: z.object({ hour: z.number(), day: z.number() }),
});
export type MathExplainResponse = z.infer<typeof MathExplainResponse>;

/** "Give me a nudge" in practice after a wrong try: one guiding question. */
export const MathNudgeRequest = ProblemLocator.extend({
  lessonId: z.string().min(1).max(40),
  answer: z.string().trim().min(1).max(100),
  /** Nudges already shown for this problem (each asks for a new one). */
  attempt: z.number().int().min(0).max(4).default(0),
});
export type MathNudgeRequest = z.infer<typeof MathNudgeRequest>;

export const MathNudgeResponse = z.object({
  /** A guiding question, or null when the next authored hint should be shown instead. */
  question: z.string().nullable(),
  remaining: z.object({ hour: z.number(), day: z.number() }),
});
export type MathNudgeResponse = z.infer<typeof MathNudgeResponse>;

/** "Explain it another way" on a Math Learn card. */
export const MathCardRequest = z.object({
  lessonId: z.string().min(1),
  cardIndex: z.number().int().min(0).max(5),
  attempt: z.number().int().min(0).max(4).default(0),
});
export type MathCardRequest = z.infer<typeof MathCardRequest>;

export const MathCardResponse = z.object({
  steps: z.array(z.string()).min(1).max(6),
  keyIdea: z.string(),
  remaining: z.object({ hour: z.number(), day: z.number() }),
});
export type MathCardResponse = z.infer<typeof MathCardResponse>;
