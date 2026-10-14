import { z } from 'zod';
import { Track } from '../curriculum/content.js';
import { UnitLockReason } from './curriculum.js';

// ───────── Marked quizzes (Essay Writing unit checks, DESIGN.md §9.12) ─────────

/** A question as an attempt shows it: no correct answer, no explanation. */
export const QuizQuestionView = z.object({
  id: z.string(),
  prompt: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string() })),
});
export type QuizQuestionView = z.infer<typeof QuizQuestionView>;

/** An attempt in progress (a new one, or the unfinished one the student left). */
export const QuizAttemptView = z.object({
  attemptId: z.string(),
  /** 1 for the first try. */
  attemptNumber: z.number().int().min(1),
  passPercent: z.number().int(),
  questions: z.array(QuizQuestionView),
});
export type QuizAttemptView = z.infer<typeof QuizAttemptView>;

export const SubmitQuizRequest = z.object({
  /** questionId → chosen optionId; every question of the attempt must be answered. */
  answers: z.record(z.string().max(60), z.string().max(60)),
});
export type SubmitQuizRequest = z.infer<typeof SubmitQuizRequest>;

export const QuizReviewItem = z.object({
  questionId: z.string(),
  prompt: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string() })),
  chosenOptionId: z.string(),
  correctOptionId: z.string(),
  correct: z.boolean(),
  explanation: z.string(),
  skill: z.string().nullable(),
});
export type QuizReviewItem = z.infer<typeof QuizReviewItem>;

export const QuizResult = z.object({
  attemptId: z.string(),
  score: z.number().int(),
  total: z.number().int(),
  percent: z.number().int(),
  passed: z.boolean(),
  passPercent: z.number().int(),
  review: z.array(QuizReviewItem),
  /** Skills of the questions answered wrongly, to look at again before retrying. */
  reviewSkills: z.array(z.string()),
});
export type QuizResult = z.infer<typeof QuizResult>;

/** Where the student stands with one quiz. */
export const QuizStatus = z.object({
  attempts: z.number().int(),
  bestPercent: z.number().int().nullable(),
  passed: z.boolean(),
  passPercent: z.number().int(),
  questionCount: z.number().int(),
  /** The last finished attempt, to show the review again. */
  last: QuizResult.nullable(),
});
export type QuizStatus = z.infer<typeof QuizStatus>;

// ───────── Progress tracker (one track) ─────────

export const LessonProgressRow = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  completed: z.boolean(),
  completedSteps: z.number(),
  totalSteps: z.number(),
  locked: z.boolean(),
  /** The lesson's marked quiz, if it has one. */
  quiz: z
    .object({
      attempts: z.number().int(),
      bestPercent: z.number().int().nullable(),
      passed: z.boolean(),
    })
    .nullable(),
  /** The challenge writing: submitted, and the latest feedback score shown to the student. */
  writing: z.object({
    submitted: z.boolean(),
    score: z.number().nullable(),
    maxScore: z.number().nullable(),
  }),
});
export type LessonProgressRow = z.infer<typeof LessonProgressRow>;

export const UnitProgressRow = z.object({
  id: z.string(),
  number: z.number(),
  slug: z.string(),
  title: z.string(),
  available: z.boolean(),
  lockReason: UnitLockReason.nullable(),
  lessonCount: z.number(),
  completedLessons: z.number(),
  lessons: z.array(LessonProgressRow),
});
export type UnitProgressRow = z.infer<typeof UnitProgressRow>;

export const TrackProgress = z.object({
  track: Track,
  units: z.array(UnitProgressRow),
  totals: z.object({
    lessons: z.number(),
    completedLessons: z.number(),
    quizzes: z.number(),
    quizzesPassed: z.number(),
    writingSubmitted: z.number(),
  }),
});
export type TrackProgress = z.infer<typeof TrackProgress>;

/**
 * The skill strands of Essay Writing, by unit number (DESIGN.md §9.12). The progress tracker shows
 * a badge per strand once all its units are finished.
 */
export const ESSAY_STRANDS = [
  { id: 'grammar', label: 'Grammar', emoji: '🧩', units: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'sentences', label: 'Sentences', emoji: '🔗', units: [9] },
  { id: 'paragraphs', label: 'Paragraphs', emoji: '🧱', units: [10] },
  { id: 'essays', label: 'Essays', emoji: '📝', units: [11, 12, 13, 14] },
  { id: 'editing', label: 'Editing & style', emoji: '✨', units: [15] },
] as const;

/** "Unit 3" in Story Writing, "Essay Unit 3" in Essay Writing. */
export const unitLabel = (track: Track, number: number) =>
  `${track === 'ESSAY' ? 'Essay Unit' : 'Unit'} ${number}`;

/** Where a track's journey page lives. */
export const TRACK_HOME: Record<Track, string> = { STORY: '/home', ESSAY: '/essays' };
