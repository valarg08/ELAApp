import { z } from 'zod';
import { Track } from '../curriculum/content.js';
import { TrackProgress } from './essay.js';

// ───────── Teacher progress views (DESIGN.md §11.3) ─────────

/** Days without any activity before a student shows as inactive. */
export const INACTIVE_DAYS = 5;
/** A reflection confidence at or below this (1–4 scale) counts as "needs help". */
export const LOW_CONFIDENCE = 2;

export const LESSON_CELL_STATES = ['not_started', 'in_progress', 'done'] as const;
export const LessonCellState = z.enum(LESSON_CELL_STATES);
export type LessonCellState = z.infer<typeof LessonCellState>;

/** One student × lesson square of the heatmap. */
export const LessonCell = z.object({
  lessonId: z.string(),
  state: LessonCellState,
  completedSteps: z.number().int(),
  /** Best marked-quiz score, when the lesson has a quiz and it was tried. */
  quizPercent: z.number().int().nullable(),
  quizPassed: z.boolean().nullable(),
  /** The challenge writing was handed in; its latest feedback score as a percentage. */
  submitted: z.boolean(),
  scorePercent: z.number().int().nullable(),
  /** The confidence the student gave in the lesson's reflection (1–4). */
  confidence: z.number().int().nullable(),
});
export type LessonCell = z.infer<typeof LessonCell>;

export const StudentProgressRow = z.object({
  id: z.string(),
  displayName: z.string(),
  lastActiveAt: z.string().nullable(),
  /** No activity for INACTIVE_DAYS days (or never). */
  inactive: z.boolean(),
  /** Low confidence in a reflection, or a failed quiz not yet passed, in the shown unit. */
  needsHelp: z.boolean(),
  /** Lessons finished in the whole track. */
  trackCompletedLessons: z.number().int(),
  cells: z.array(LessonCell),
});
export type StudentProgressRow = z.infer<typeof StudentProgressRow>;

export const ClassProgress = z.object({
  track: Track,
  /** The track's published units, for choosing which one the heatmap shows. */
  units: z.array(
    z.object({
      id: z.string(),
      number: z.number().int(),
      title: z.string(),
      lessonCount: z.number(),
    }),
  ),
  trackLessons: z.number().int(),
  /** The unit the heatmap shows (null when the track has no published units). */
  unit: z
    .object({
      id: z.string(),
      number: z.number().int(),
      title: z.string(),
      lessons: z.array(
        z.object({
          id: z.string(),
          order: z.number().int(),
          title: z.string(),
          /** Students who finished it. */
          completed: z.number().int(),
        }),
      ),
    })
    .nullable(),
  /** The last seven days. */
  week: z.object({
    activeStudents: z.number().int(),
    totalStudents: z.number().int(),
    lessonsCompleted: z.number().int(),
    submissions: z.number().int(),
    wordsSubmitted: z.number().int(),
    averageScorePercent: z.number().int().nullable(),
  }),
  students: z.array(StudentProgressRow),
});
export type ClassProgress = z.infer<typeof ClassProgress>;

export const ActivityKind = z.enum(['lesson', 'quiz', 'writing']);

/** A student's profile for their teacher: the track tracker plus recent activity. */
export const StudentProgressDetail = z.object({
  student: z.object({
    id: z.string(),
    displayName: z.string(),
    username: z.string().nullable(),
    lastActiveAt: z.string().nullable(),
  }),
  progress: TrackProgress,
  recent: z.array(
    z.object({
      kind: ActivityKind,
      at: z.string(),
      unitNumber: z.number().int(),
      title: z.string(),
      /** "4 of 5 steps", "80% · passed", "312 words · 14/20". */
      detail: z.string(),
    }),
  ),
  /** Reflections with a confidence, newest first. */
  confidence: z.array(
    z.object({
      lessonId: z.string(),
      unitNumber: z.number().int(),
      lessonTitle: z.string(),
      confidence: z.number().int(),
      at: z.string(),
    }),
  ),
});
export type StudentProgressDetail = z.infer<typeof StudentProgressDetail>;
