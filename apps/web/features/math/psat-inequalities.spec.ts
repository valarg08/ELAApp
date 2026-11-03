import { checkAnswer } from '@storyforge/math-check';
import { describe, expect, it } from 'vitest';
import type { GuideProblem } from './guide-problem';
import { INEQUALITIES_ALGEBRA1 } from './psat-inequalities-algebra1';
import { INEQUALITIES_PROBLEMS } from './psat-inequalities-problems';

const CHAPTERS = [
  'symbols',
  'numberline',
  'linear',
  'or',
  'and',
  'abs',
  'twovar',
  'systems',
  'poly',
  'rational',
] as const;

/** The video's examples stay in the notes. Practice must not repeat them. */
const VIDEO = [
  'x + 3 > 7',
  '−2x + 5 ≤ 13',
  '5x − 3 > −18',
  '|x − 3| ≤ 5',
  '|2x − 5|',
  '−2x + 3y > 6',
  'x³ − 3x² − 25x + 75',
];

const STD: Record<(typeof CHAPTERS)[number], string> = {
  symbols: 'MA.912.AR.2.5',
  numberline: 'MA.912.AR.2.5',
  linear: 'MA.912.AR.2.5',
  or: 'MA.912.AR.2.5',
  and: 'MA.912.AR.2.5',
  abs: 'MA.912.AR.2.5',
  twovar: 'MA.912.AR.2.7',
  systems: 'MA.912.AR.2.8',
  poly: 'MA.912.AR.5.4',
  rational: 'MA.912.AR.8.3',
};

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
      if (VIDEO.some((example) => problem.q.includes(example)))
        bad.push(`${where} uses a video example`);
      const status = checkAnswer(problem.a, [problem.a], problem.form ?? 'any').status;
      if (status !== 'correct') bad.push(`${where} ${problem.a} is ${status}`);
      if (algebra1 && problem.std !== STD[id]) bad.push(`${where} std ${problem.std}`);
      if (!algebra1 && problem.std) bad.push(`${where} has a benchmark tag`);
    });
  }
  return bad;
}

describe('PSAT inequalities study guide', () => {
  it('checks every PSAT and Algebra 1 answer', () => {
    expect(problemsOf(INEQUALITIES_PROBLEMS, false)).toEqual([]);
    expect(problemsOf(INEQUALITIES_ALGEBRA1, true)).toEqual([]);
    expect(Object.keys(INEQUALITIES_PROBLEMS)).toEqual(Object.keys(INEQUALITIES_ALGEBRA1));
  });
});
