import { z } from 'zod/v4';
import type { AnalyzerDef } from '../types.js';

/**
 * Extra practice (self-learning): a few new multiple-choice questions on the skill of a practice
 * activity. Input is lesson content only (no student text), so results are cached and shared.
 */
export interface ExtraPracticeInput {
  unitTitle: string;
  lessonTitle: string;
  gradeLevel: number;
  activityTitle: string;
  /** The original activity as plain text: instructions plus its items and answers. */
  activityText: string;
  /** Rotates the question set so repeat requests get different questions. */
  variant: number;
  /** Ready-made questions for the offline fake (built from the original activity). */
  fallback: ExtraPracticeResult['questions'];
}

export const ExtraPracticeResult = z.object({
  questions: z.array(
    z.object({
      prompt: z.string(),
      options: z.array(z.string()),
      /** Index of the correct option. */
      correctIndex: z.number().int(),
      /** Why the answer is right, in one or two kid-friendly sentences. */
      explanation: z.string(),
    }),
  ),
});
export type ExtraPracticeResult = z.infer<typeof ExtraPracticeResult>;

const SYSTEM = `You are Quill, a writing tutor for students aged 11-14 who are learning on their own.
Write 3 NEW multiple-choice practice questions on the same skill as the activity below.
Rules:
- Each question has 3 or 4 options and exactly one clearly correct answer. correctIndex is the 0-based index of that option.
- Vary which position holds the correct answer.
- Use fresh sentences and situations; do not copy the activity's items.
- Questions test the skill (for example: which sentence shows instead of tells; which word is the strongest verb).
- explanation: one or two warm sentences saying why the answer is right.
- Simple words (Grade 6 reading level). School-appropriate content only.
Return only the requested JSON.`;

export const extraPracticeAnalyzer: AnalyzerDef<ExtraPracticeInput, ExtraPracticeResult> = {
  id: 'extra-practice',
  version: 'extra-practice-1',
  effort: 'low',
  maxTokens: 1500,
  system: SYSTEM,
  schema: ExtraPracticeResult,
  buildUser: (input) =>
    [
      `Unit: ${input.unitTitle}`,
      `Lesson: ${input.lessonTitle}`,
      `Grade level: ${input.gradeLevel}`,
      `Question set number: ${input.variant + 1} (make it different from other sets)`,
      '',
      `Activity: ${input.activityTitle}`,
      input.activityText,
    ].join('\n'),
  fake: (input) => ({ questions: input.fallback }),
};
