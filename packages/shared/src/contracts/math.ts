import { z } from 'zod';
import { MathProblemPublic } from '../curriculum/math.js';

/** Math track contracts (DESIGN.md §9.13): marked problem sets, the error log and Quill's explanations. */

/** The skill strands of the Math track, by unit number. */
export const MATH_STRANDS = [
  { id: 'strategy', label: 'Strategy', emoji: '🧭', units: [1, 14, 15] },
  { id: 'algebra', label: 'Algebra', emoji: '📈', units: [2, 3, 4, 5, 6] },
  { id: 'number-theory', label: 'Number theory', emoji: '🔢', units: [7, 8] },
  { id: 'counting', label: 'Counting & probability', emoji: '🎲', units: [9, 10] },
  { id: 'geometry', label: 'Geometry', emoji: '📐', units: [11, 12, 13] },
] as const;

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

export const AddErrorLogRequest = z.object({
  lessonId: z.string().min(1),
  activityKey: z.string().min(1),
  problemId: z.string().min(1),
});
export type AddErrorLogRequest = z.infer<typeof AddErrorLogRequest>;

export const ErrorLogEntry = z.object({
  id: z.string(),
  lessonId: z.string(),
  lessonTitle: z.string(),
  unitNumber: z.number(),
  activityKey: z.string(),
  skill: z.string(),
  problem: MathProblemPublic,
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
  entry: ErrorLogEntry,
  /** Shown once the redo is right, or after a wrong one. */
  solution: z.string(),
  rightAnswer: z.string().nullable(),
});
export type RedoResponse = z.infer<typeof RedoResponse>;

// ───────── Quill: explanations ─────────

/** "Explain the solution" or "Why was my answer wrong?" (DESIGN.md §9.13). Never changes the verdict. */
export const MathExplainRequest = z.object({
  lessonId: z.string().min(1),
  activityKey: z.string().min(1),
  problemId: z.string().min(1),
  mode: z.enum(['explain', 'mistake']),
  /** The student's answer (mistake mode): a number or expression only, never free text. */
  answer: z.string().trim().max(100).optional(),
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
