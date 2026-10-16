import { z } from 'zod/v4';
import type { AnalyzerDef } from '../types.js';

/**
 * Quill's nudge on a Math practice problem (math-design.md §3.3 C1): after a wrong try, one
 * guiding question, never an explanation or the answer. The API drops a nudge with a number that
 * isn't in the problem or a choice letter, retries once, then falls back to an authored hint.
 */
export interface MathNudgeInput {
  skill: string;
  problem: string;
  choices: string[];
  rightAnswer: string;
  solution: string;
  /** The wrong answer the student gave (a number, expression or letter). */
  studentAnswer: string;
  /** 0, 1, 2…: each nudge asks about a different part. */
  attempt: number;
  /** A retry after a nudge was dropped: be stricter. */
  strict: boolean;
}

export const MathNudgeResult = z.object({ question: z.string() });
export type MathNudgeResult = z.infer<typeof MathNudgeResult>;

const SYSTEM = `You are Quill, a math coach for students aged 14-16 practising for the AMC 10 on their own.
The student gave a wrong answer to a practice problem. Ask ONE short guiding question (at most 25 words) that helps them find their own mistake or the next step.
Rules:
- Never give the answer, any number that is not already in the problem, or an answer letter.
- Never explain the solution; ask about one idea only (what a quantity means, what they know, what to draw or try).
- Write any math between $...$ in LaTeX (KaTeX), using only numbers from the problem.
- The worked solution is for you only; don't quote it.
Return only the requested JSON.`;

export const mathNudgeAnalyzer: AnalyzerDef<MathNudgeInput, MathNudgeResult> = {
  id: 'math-nudge',
  version: 'math-nudge-1',
  effort: 'low',
  maxTokens: 300,
  system: SYSTEM,
  schema: MathNudgeResult,
  buildUser: (input) =>
    [
      `Skill: ${input.skill}`,
      `Nudge number: ${input.attempt + 1}`,
      ...(input.strict
        ? ['Important: your last question used a number that is not in the problem. Use none.']
        : []),
      '',
      'Problem:',
      input.problem,
      ...(input.choices.length > 0
        ? ['Choices:', ...input.choices.map((c, i) => `(${'ABCDE'[i]}) ${c}`)]
        : []),
      '',
      `Correct answer (for you only): ${input.rightAnswer}`,
      'Worked solution (for you only):',
      input.solution,
      '',
      `The student answered: ${input.studentAnswer}`,
    ].join('\n'),
  fake(input) {
    const questions = [
      'What exactly is the question asking you to find? Underline it, then check your answer answers that.',
      'Can you draw or list what the problem describes before you calculate?',
      'Which fact in the problem have you not used yet?',
    ];
    return { question: questions[input.attempt % questions.length]! };
  },
};
