import { checkAnswer } from '@storyforge/math-check';
import { describe, expect, it } from 'vitest';
import type { GuideProblem } from './guide-problem';
import { FACTORING_ALGEBRA1 } from './psat-factoring-algebra1';
import { FACTORING_PROBLEMS } from './psat-factoring-problems';

const CHAPTERS = ['average', 'negatives', 'halves', 'leading', 'irrational', 'imaginary'] as const;

/** The video's six examples stay in the notes. Practice must not repeat them. */
const VIDEO = [
  'x² + 32x + 192',
  'x² − 6x − 91',
  'x² + 9x + 20',
  '2x² − 7x − 4',
  'x² + 8x + 4',
  'x² + 4x + 10',
];

/** Problems that fail the answer, step, or chapter rules. Empty means the set is sound. */
function problemsOf(problems: Record<string, GuideProblem[]>, algebra1: boolean): string[] {
  const questions = new Set<string>();
  const bad: string[] = [];
  const keys = Object.keys(problems).toSorted();
  if (keys.join() !== CHAPTERS.toSorted().join()) bad.push(`chapters ${keys.join(', ')}`);
  for (const id of CHAPTERS) {
    const list = problems[id] ?? [];
    if (list.length !== 25) bad.push(`${id} has ${list.length}`);
    list.forEach((problem, i) => {
      const where = `${id} #${i + 1}`;
      if (questions.has(problem.q)) bad.push(`${where} repeats a question`);
      questions.add(problem.q);
      if (!problem.steps.at(-1)?.startsWith('Answer: ')) bad.push(`${where} steps`);
      if (problem.steps.some((step) => step.includes('  '))) bad.push(`${where} double space`);
      if (VIDEO.some((example) => problem.q.includes(`${example},`) || problem.q.endsWith(example)))
        bad.push(`${where} uses a video example`);
      const status = checkAnswer(problem.a, [problem.a], problem.form ?? 'any').status;
      if (status !== 'correct') bad.push(`${where} ${problem.a} is ${status}`);
      if (algebra1 && problem.std !== 'MA.912.AR.1.7') bad.push(`${where} std ${problem.std}`);
      if (!algebra1 && problem.std) bad.push(`${where} has a benchmark tag`);
    });
  }
  return bad;
}

describe('PSAT factoring study guide', () => {
  it('checks every PSAT and Algebra 1 answer', () => {
    expect(problemsOf(FACTORING_PROBLEMS, false)).toEqual([]);
    expect(problemsOf(FACTORING_ALGEBRA1, true)).toEqual([]);
    expect(Object.keys(FACTORING_PROBLEMS)).toEqual(Object.keys(FACTORING_ALGEBRA1));
  });
});
