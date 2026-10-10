import { z } from 'zod';
import { MultipleChoiceActivity } from '../curriculum/content.js';

/** AI tutor inside lessons: "Explain it another way" and extra practice (self-learning). */

export const TUTOR_LIMITS = {
  perStudentHour: 30,
  perStudentDay: 100,
  perClassDay: 3000,
} as const;

const Remaining = z.object({ hour: z.number(), day: z.number() });

export const ExplainRequest = z.object({
  lessonId: z.string().min(1),
  cardIndex: z.number().int().min(0).max(10),
  /** 0 for the first re-explanation, 1, 2… for "another way" again. */
  attempt: z.number().int().min(0).max(4).default(0),
});
export type ExplainRequest = z.infer<typeof ExplainRequest>;

export const ExplainResponse = z.object({
  explanation: z.string(),
  example: z.string(),
  /** A quick self-check question with its answer (revealed on request). */
  check: z.object({ question: z.string(), answer: z.string() }),
  remaining: Remaining,
});
export type ExplainResponse = z.infer<typeof ExplainResponse>;

export const ExtraPracticeRequest = z.object({
  lessonId: z.string().min(1),
  activityKey: z.string().min(1),
});
export type ExtraPracticeRequest = z.infer<typeof ExtraPracticeRequest>;

export const ExtraPracticeResponse = z.object({
  /** New multiple-choice questions on the same skill, played with the normal renderer. */
  activity: MultipleChoiceActivity,
  remaining: Remaining,
});
export type ExtraPracticeResponse = z.infer<typeof ExtraPracticeResponse>;
