import { z } from 'zod/v4';
import type { AnalyzerDef } from '../types.js';

/**
 * "Explain it another way" on a Learn card (self-learning). No student text is involved: the input
 * is lesson content only, so results are cached and shared by every student.
 */
export interface ExplainInput {
  unitTitle: string;
  lessonTitle: string;
  gradeLevel: number;
  cardTitle: string;
  /** The card's content as plain text. */
  cardText: string;
  /** 0, 1, 2…: each attempt uses a different teaching angle. */
  attempt: number;
}

export const ExplainResult = z.object({
  explanation: z.string(),
  example: z.string(),
  check: z.object({ question: z.string(), answer: z.string() }),
});
export type ExplainResult = z.infer<typeof ExplainResult>;

const ANGLES = [
  'Use an everyday comparison from a middle-schooler’s life (sports, games, food, friends).',
  'Break it into 2–3 short numbered steps the student can follow.',
  'Show a weak example and a strong example side by side and say what changed.',
  'Explain it as if to a younger student, in the simplest possible words.',
  'Start from a mistake students often make, then show how to fix it.',
];

const SYSTEM = `You are Quill, a warm writing tutor for students aged 11-14 who are learning on their own.
A student read a lesson card and wants it explained another way.
Rules:
- Teach the same idea as the card. Do not add new rules or contradict it.
- Use simple words (Grade 6 reading level) and speak to the student as "you".
- explanation: 2-4 short sentences.
- example: one short, original example (1-3 sentences) that shows the idea. Not copied from the card.
- check: one quick question the student can answer in their head to test understanding, with a one-sentence answer.
- Keep everything school-appropriate.
Return only the requested JSON.`;

export const explainCardAnalyzer: AnalyzerDef<ExplainInput, ExplainResult> = {
  id: 'explain-card',
  version: 'explain-card-1',
  effort: 'low',
  maxTokens: 800,
  system: SYSTEM,
  schema: ExplainResult,
  buildUser: (input) =>
    [
      `Unit: ${input.unitTitle}`,
      `Lesson: ${input.lessonTitle}`,
      `Grade level: ${input.gradeLevel}`,
      `Teaching angle for this attempt: ${ANGLES[input.attempt % ANGLES.length]}`,
      '',
      `Card title: ${input.cardTitle}`,
      'Card content:',
      input.cardText,
    ].join('\n'),
  fake(input) {
    const first = input.cardText.split(/(?<=[.!?])\s+/)[0] ?? input.cardText;
    return {
      explanation: `Here's the big idea of "${input.cardTitle}" in a nutshell: ${first} Try to picture it like a movie in your head: what would you actually see and hear?`,
      example:
        input.attempt % 2 === 0
          ? 'Instead of "Mia was nervous," try "Mia picked at her sleeve and checked the clock again."'
          : 'Weak: "The room was scary." Strong: "The floorboards groaned, and the door creaked open on its own."',
      check: {
        question: 'Which is stronger: "He was tired" or "His eyelids drooped over his homework"?',
        answer: 'The second one, because it shows the tiredness instead of naming it.',
      },
    };
  },
};
