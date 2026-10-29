import type { AnswerForm } from '@storyforge/math-check';

/** A study-guide sub-module problem: a typed answer (a math-check expression) and the worked steps. */
export type GuideProblem = { q: string; a: string; form?: AnswerForm; steps: string[] };

/** One problem: the question, the accepted answer, the worked steps (ending "Answer: …"). */
export const guideProblem = (
  q: string,
  a: string,
  steps: string[],
  form?: AnswerForm,
): GuideProblem => ({ q, a, steps, ...(form ? { form } : {}) });
