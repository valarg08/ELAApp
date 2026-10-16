import { z } from 'zod';
import { LessonActivity, LessonSteps, StepId, Track } from '../curriculum/content.js';

/** Why a unit can't be opened yet. FINISH_PREVIOUS: self-paced, the earlier unit isn't finished. */
export const UnitLockReason = z.enum(['COMING_SOON', 'LOCKED', 'FINISH_PREVIOUS']);

export const UnitSummary = z.object({
  id: z.string(),
  track: Track,
  number: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  available: z.boolean(),
  lockReason: UnitLockReason.nullable(),
  dueAt: z.iso.datetime().nullable(),
  lessonCount: z.number(),
  completedLessons: z.number(),
});
export type UnitSummary = z.infer<typeof UnitSummary>;

export const LessonSummary = z.object({
  id: z.string(),
  slug: z.string(),
  order: z.number(),
  title: z.string(),
  estMinutes: z.number(),
  completedSteps: z.number(),
  totalSteps: z.number(),
  completed: z.boolean(),
  /** Self-paced: the previous lesson isn't finished yet. */
  locked: z.boolean(),
});
export type LessonSummary = z.infer<typeof LessonSummary>;

export const UnitDetail = UnitSummary.extend({
  bigIdeas: z.array(z.string()),
  lessons: z.array(LessonSummary),
});
export type UnitDetail = z.infer<typeof UnitDetail>;

export const LessonProgressView = z.object({
  completedSteps: z.array(StepId),
  responses: z.record(z.string(), z.unknown()),
  completedAt: z.iso.datetime().nullable(),
});
export type LessonProgressView = z.infer<typeof LessonProgressView>;

export const LessonDetail = z.object({
  id: z.string(),
  slug: z.string(),
  order: z.number(),
  title: z.string(),
  estMinutes: z.number(),
  unit: z.object({
    id: z.string(),
    track: Track,
    number: z.number(),
    slug: z.string(),
    title: z.string(),
  }),
  steps: LessonSteps,
  /** Activities used by this lesson, by key (quizzes without their questions). */
  activities: z.record(z.string(), LessonActivity),
  progress: LessonProgressView,
  /** The writing activity of the challenge step (opened in the writing workspace). */
  challengeActivityId: z.string(),
  nextLessonId: z.string().nullable(),
});
export type LessonDetail = z.infer<typeof LessonDetail>;

// ───────── Step completion bodies (one per step) ─────────

export const HookResponse = z.object({ response: z.string().trim().max(1000).optional() });
export const LearnResponse = z.object({ cardsViewed: z.number().int().min(0).max(20) });
export const PracticeResponse = z.object({
  results: z
    .array(
      z.object({
        activityKey: z.string(),
        correct: z.boolean(),
        attempts: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(5),
});
/** The writing is submitted from the workspace; completing the step only checks that it was. */
export const ChallengeResponse = z.object({});
export const ReflectResponse = z.object({
  /** One per prompt (a Math reflect step with the trap picker may have no prompts). */
  answers: z.array(z.string().trim().min(1, 'Write a short answer').max(1000)).max(3),
  confidence: z.number().int().min(1).max(4).optional(),
  /** Math trap picker (math-design.md §3.3 C3): the problem that tricked the student, and the trap. */
  trap: z
    .object({
      activityKey: z.string().min(1).max(80),
      problemId: z.string().min(1).max(80),
      note: z.string().trim().min(1, 'Say what the trap was').max(300),
    })
    .optional(),
});

export const STEP_RESPONSE_SCHEMAS = {
  hook: HookResponse,
  learn: LearnResponse,
  practice: PracticeResponse,
  challenge: ChallengeResponse,
  reflect: ReflectResponse,
} as const;

export const CONFIDENCE_LEVELS = [
  { value: 1, emoji: '😟', label: 'Not sure yet' },
  { value: 2, emoji: '😐', label: 'Getting there' },
  { value: 3, emoji: '🙂', label: 'Pretty confident' },
  { value: 4, emoji: '🤩', label: 'I could teach this!' },
] as const;

// ───────── Teacher pacing ─────────

export const ClassUnitPacing = z.object({
  unitId: z.string(),
  track: Track,
  number: z.number(),
  title: z.string(),
  published: z.boolean(),
  available: z.boolean(),
  hidden: z.boolean(),
  unlockAt: z.iso.datetime().nullable(),
  dueAt: z.iso.datetime().nullable(),
  lessonCount: z.number(),
});
export type ClassUnitPacing = z.infer<typeof ClassUnitPacing>;

export const UpdatePacingRequest = z
  .object({
    hidden: z.boolean(),
    unlockAt: z.iso.datetime().nullable(),
    dueAt: z.iso.datetime().nullable(),
  })
  .partial();
export type UpdatePacingRequest = z.infer<typeof UpdatePacingRequest>;
