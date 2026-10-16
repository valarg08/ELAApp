import { z } from 'zod/v4';
import type { AnalyzerDef } from '../types.js';

/**
 * Quill on a Math problem (DESIGN.md §9.13): "Explain the solution" and "Why was my answer wrong?".
 * The verdict and the right answer come from math-check and are given to Quill as facts; Quill
 * only explains. The input is content plus, in mistake mode, the student's typed number (never
 * free text), so results are cached per problem, mode and answer.
 */
export interface MathExplainInput {
  unitTitle: string;
  skill: string;
  problem: string;
  /** The answer choices (A–E) when the problem has them. */
  choices: string[];
  rightAnswer: string;
  solution: string;
  mode: 'explain' | 'mistake';
  /** Mistake mode: what the student answered (a letter, number or expression). */
  studentAnswer: string | null;
  /** 0, 1, 2…: each attempt uses a different angle. */
  attempt: number;
}

export const MathExplainResult = z.object({
  steps: z.array(z.string()).min(1).max(8),
  keyIdea: z.string(),
  likelyMistake: z.string().nullable(),
});
export type MathExplainResult = z.infer<typeof MathExplainResult>;

const ANGLES = [
  'Follow the worked solution, one small step at a time.',
  'Start from the key idea, then show how it unlocks the problem.',
  'Use a smaller or simpler version of the problem first, then scale up.',
  'Draw it in words: describe a picture, table or list that makes the answer visible.',
  'Check the answer a second way (estimate, plug in, or work backwards).',
];

const SYSTEM = `You are Quill, a patient math coach for students aged 14-16 preparing for the AMC 10 on their own.
You are given a problem, its correct answer and a worked solution. These are facts: never change, doubt or recompute a different answer.
Rules:
- steps: 2-6 short steps (one idea each) that lead to the given correct answer. Write math between $...$ in LaTeX (KaTeX), e.g. $\\frac{3}{4}$, $x^2$.
- keyIdea: one sentence naming the technique to remember for next time.
- likelyMistake: in "mistake" mode, one or two sentences on the most likely slip that leads to the student's answer, said kindly. If you cannot tell, say what to check. In "explain" mode, null.
- Never say the student's answer is right in "mistake" mode; it was marked wrong.
- Do not copy or mention real AMC problems or their numbers.
Return only the requested JSON.`;

export const mathExplainAnalyzer: AnalyzerDef<MathExplainInput, MathExplainResult> = {
  id: 'math-explain',
  version: 'math-explain-1',
  effort: 'low',
  maxTokens: 1200,
  system: SYSTEM,
  schema: MathExplainResult,
  buildUser: (input) =>
    [
      `Unit: ${input.unitTitle}`,
      `Skill: ${input.skill}`,
      `Mode: ${input.mode}`,
      `Angle for this attempt: ${ANGLES[input.attempt % ANGLES.length]}`,
      '',
      'Problem:',
      input.problem,
      ...(input.choices.length > 0
        ? ['Choices:', ...input.choices.map((c, i) => `(${'ABCDE'[i]}) ${c}`)]
        : []),
      '',
      `Correct answer (fact): ${input.rightAnswer}`,
      'Worked solution:',
      input.solution,
      ...(input.mode === 'mistake'
        ? ['', `The student answered: ${input.studentAnswer ?? ''}`]
        : []),
    ].join('\n'),
  fake(input) {
    const sentences = input.solution
      .split(/(?<=[.!?])\s+(?=[A-Z$])/)
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      steps: (sentences.length > 0 ? sentences : [input.solution]).slice(0, 6),
      keyIdea: `${input.skill}: write down what you know, then use it one step at a time.`,
      likelyMistake:
        input.mode === 'mistake'
          ? `Your answer ${input.studentAnswer ?? ''} isn't ${input.rightAnswer}. Check each step against the solution: a common slip is answering a different question than the one asked.`
          : null,
    };
  },
};
