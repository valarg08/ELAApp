import { z } from 'zod/v4';
import type { AnalyzerDef } from '../types.js';

/**
 * "Explain it another way" on a Math Learn card (math-design.md §3.3 C2). The writing tutor
 * (explain-card) stays for Story and Essay cards; this one explains a math idea or worked example
 * in steps. The API drops steps that state a result different from the card's.
 */
export interface MathCardInput {
  unitTitle: string;
  lessonTitle: string;
  cardTitle: string;
  cardText: string;
  /** 0, 1, 2…: each attempt uses a different angle. */
  attempt: number;
}

export const MathCardResult = z.object({
  steps: z.array(z.string()).min(1).max(6),
  keyIdea: z.string(),
});
export type MathCardResult = z.infer<typeof MathCardResult>;

const ANGLES = [
  'Use a smaller, concrete example with easy numbers.',
  'Say it as a picture or table in words.',
  'Start from why the idea works, then how to use it.',
  'Show the common trap first, then the right way.',
  'Connect it to an idea a 9th grader already knows.',
];

const SYSTEM = `You are Quill, a math coach for students aged 14-16 preparing for the AMC 10 on their own.
Explain the lesson card's idea another way, in 2-5 short steps (one idea each), then one sentence with the key idea to remember.
Rules:
- The card is correct: never contradict it or state a different result for its example.
- Write math between $...$ in LaTeX (KaTeX), e.g. $\\frac{3}{4}$.
- Plain, direct language. Do not copy or mention real AMC problems.
Return only the requested JSON.`;

export const mathCardAnalyzer: AnalyzerDef<MathCardInput, MathCardResult> = {
  id: 'math-card',
  version: 'math-card-1',
  effort: 'low',
  maxTokens: 900,
  system: SYSTEM,
  schema: MathCardResult,
  buildUser: (input) =>
    [
      `Unit: ${input.unitTitle}`,
      `Lesson: ${input.lessonTitle}`,
      `Angle for this attempt: ${ANGLES[input.attempt % ANGLES.length]}`,
      '',
      `Card: ${input.cardTitle}`,
      input.cardText,
    ].join('\n'),
  fake(input) {
    const sentences = input.cardText
      .split(/(?<=[.!?])\s+(?=[A-Z$])/)
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      steps: (sentences.length > 0 ? sentences : [input.cardText]).slice(0, 5),
      keyIdea: `${input.cardTitle}: try it on a small example first.`,
    };
  },
};
