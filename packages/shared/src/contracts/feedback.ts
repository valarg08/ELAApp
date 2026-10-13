import { z } from 'zod';

/** AI feedback, live AI checks and safety flags (DESIGN.md §5.5, §8). */

/** Job queue (pg-boss on PostgreSQL) carrying one AI feedback run per submitted version. */
export const FEEDBACK_QUEUE = 'ai-feedback';
export const FeedbackJob = z.object({ feedbackId: z.string() });
export type FeedbackJob = z.infer<typeof FeedbackJob>;

export const FeedbackStatus = z.enum([
  'QUEUED',
  'PENDING_REVIEW',
  'READY',
  'RELEASED',
  'HIDDEN',
  'SUPERSEDED',
  'FAILED',
]);
export type FeedbackStatus = z.infer<typeof FeedbackStatus>;

/** A comment for the student; `start`/`end` locate the quoted words in the submitted text. */
export const FeedbackPoint = z.object({
  title: z.string(),
  message: z.string(),
  quote: z.string().optional(),
  start: z.number().int().optional(),
  end: z.number().int().optional(),
});
export type FeedbackPoint = z.infer<typeof FeedbackPoint>;

export const CriterionScore = z.object({
  key: z.string(),
  label: z.string(),
  level: z.number().int().min(1).max(4),
  rationale: z.string(),
  confidence: z.number(),
  evidenceQuotes: z.array(z.string()),
});
export type CriterionScore = z.infer<typeof CriterionScore>;

/**
 * What the student sees: none (not submitted / AI off), pending (Quill is reading), held (safety:
 * the teacher reads it first), awaiting-teacher (teacher approval mode), ready, failed.
 */
export const StudentFeedbackState = z.enum([
  'none',
  'pending',
  'held',
  'awaiting-teacher',
  'ready',
  'failed',
]);
export type StudentFeedbackState = z.infer<typeof StudentFeedbackState>;

export const SubmissionFeedback = z.object({
  state: StudentFeedbackState,
  version: z.number().nullable(),
  /** A friendly line for the non-ready states. */
  message: z.string().nullable(),
  summary: z.string().nullable(),
  strengths: z.array(FeedbackPoint),
  nextSteps: z.array(FeedbackPoint),
  /** Only for the class teacher. */
  teacher: z
    .object({
      feedbackId: z.string(),
      status: FeedbackStatus,
      scores: z.array(CriterionScore),
      totalScore: z.number().nullable(),
      needsTeacherAttention: z.boolean(),
      declined: z.boolean(),
      model: z.string().nullable(),
      openFlags: z.number(),
    })
    .nullable(),
});
export type SubmissionFeedback = z.infer<typeof SubmissionFeedback>;

// ───────── Live checks ("Ask Quill" in the Coach panel) ─────────

export const LIVE_CHECK_LIMITS = {
  perStudentHour: 20,
  perStudentDay: 60,
  perClassDay: 1000,
  minWords: 20,
  maxWords: 8000,
} as const;

export const LiveAnalyzerId = z.enum([
  'show-vs-tell',
  'sensory-analysis',
  'character-read',
  'setting-mood',
  'plot-check',
  'pov-consistency',
  'tone-style',
  'figurative-language',
]);
export type LiveAnalyzerId = z.infer<typeof LiveAnalyzerId>;

export const LiveCheckRequest = z.object({
  activityId: z.string().min(1),
  analyzer: LiveAnalyzerId,
  text: z.string().max(60_000),
  /** For "Can your reader tell?": the traits the student picked. */
  traits: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(3).default([]),
  /** For "What mood will my reader feel?": the moods the student chose. */
  mood: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(3).default([]),
  /** For "Does my plot work?": the chosen conflict and the plan. */
  conflict: z.string().max(40).nullable().default(null),
  plot: z.record(z.string(), z.string().max(200)).optional(),
  /** For "What tone will my reader hear?": the tone aimed for, per scale. */
  tone: z.record(z.string(), z.number()).optional(),
});
export type LiveCheckRequest = z.infer<typeof LiveCheckRequest>;

export const LiveCheckResponse = z.object({
  /** Safety hold: show `message` instead of feedback. */
  held: z.boolean(),
  message: z.string().nullable(),
  strengths: z.array(FeedbackPoint),
  nextSteps: z.array(FeedbackPoint),
  remaining: z.object({ hour: z.number(), day: z.number() }),
});
export type LiveCheckResponse = z.infer<typeof LiveCheckResponse>;

// ───────── Safety flags (teacher inbox) ─────────

export const FlagType = z.enum([
  'SELF_HARM',
  'ABUSE_DISCLOSURE',
  'VIOLENCE_THREAT',
  'BULLYING',
  'PERSONAL_INFO',
  'PROFANITY',
  'OTHER',
]);
export type FlagType = z.infer<typeof FlagType>;
export const FlagStatus = z.enum(['OPEN', 'ACKNOWLEDGED', 'RESOLVED']);
export type FlagStatus = z.infer<typeof FlagStatus>;

export const FLAG_LABELS: Record<FlagType, string> = {
  SELF_HARM: 'Possible self-harm',
  ABUSE_DISCLOSURE: 'Possible abuse disclosure',
  VIOLENCE_THREAT: 'Threat of violence',
  BULLYING: 'Bullying',
  PERSONAL_INFO: 'Personal information',
  PROFANITY: 'Profanity',
  OTHER: 'Other concern',
};

export const SafetyFlagView = z.object({
  id: z.string(),
  type: FlagType,
  severity: z.number(),
  excerpt: z.string(),
  status: FlagStatus,
  detectedBy: z.string(),
  notes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  student: z.object({ id: z.string(), displayName: z.string() }),
  submissionId: z.string().nullable(),
});
export type SafetyFlagView = z.infer<typeof SafetyFlagView>;

export const UpdateFlagRequest = z.object({
  status: z.enum(['ACKNOWLEDGED', 'RESOLVED']),
  notes: z.string().trim().max(1000).optional(),
});
export type UpdateFlagRequest = z.infer<typeof UpdateFlagRequest>;
