import type { AnswerForm } from '@storyforge/math-check';

/** A study-guide sub-module problem: a typed answer (a math-check expression) and the worked steps. */
export type GuideProblem = {
  q: string;
  a: string;
  form?: AnswerForm;
  steps: string[];
  /** The Florida B.E.S.T. benchmark the problem practises (the middle-school sets), e.g. MA.8.GR.1.1. */
  std?: string;
};

/** One problem: the question, the accepted answer, the worked steps (ending "Answer: …"). */
export const guideProblem = (
  q: string,
  a: string,
  steps: string[],
  form?: AnswerForm,
): GuideProblem => ({ q, a, steps, ...(form ? { form } : {}) });

/** A middle-school problem tagged with its Florida B.E.S.T. benchmark (grades 6–8). */
export const bestProblem = (
  std: string,
  q: string,
  a: string,
  steps: string[],
  form?: AnswerForm,
): GuideProblem => ({ ...guideProblem(q, a, steps, form), std });
