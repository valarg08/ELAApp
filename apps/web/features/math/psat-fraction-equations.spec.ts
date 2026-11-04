import { checkAnswer } from '@storyforge/math-check';
import { describe, expect, it } from 'vitest';
import type { GuideProblem } from './guide-problem';
import { FRACTION_EQUATIONS_MIDDLE } from './psat-fraction-equations-middle';
import { FRACTION_EQUATIONS_PROBLEMS } from './psat-fraction-equations-problems';

const CHAPTERS = ['lcm', 'clear', 'solve', 'single', 'cross', 'parens', 'check'] as const;

/** The video's examples stay in the notes. Practice must not repeat them. */
const VIDEO = [
  '3x/4 − 2/3 = 5/6',
  'x/2 + 4/5 = 2x/5 − 7/10',
  'x/4 − 2 = x/8 + 3',
  '(3x + 5)/11 = −2',
  '(3x − 4)/5 = (x + 1)/4',
  '(x + 2)/6 − (x − 4)/8 = 1',
  '(x − 7)/3 = x/5 + 2',
  '(2x + 1)/9 + 3/4 = −(x + 5)/6',
  '9x − 8 = 10',
  '5x + 8 = 2x − 7',
  '2x − 16 = x + 8',
];

const STD: Record<(typeof CHAPTERS)[number], string> = {
  lcm: 'MA.6.NSO.3.1',
  clear: 'MA.8.AR.2.1',
  solve: 'MA.8.AR.2.1',
  single: 'MA.8.AR.2.1',
  cross: 'MA.8.AR.2.1',
  parens: 'MA.8.AR.2.1',
  check: 'MA.8.AR.2.1',
};

/** Problems that fail the answer, step, or chapter rules. Empty means the set is sound. */
function problemsOf(problems: Record<string, GuideProblem[]>, tagged: boolean): string[] {
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
      const hit = VIDEO.find((example) => problem.q.includes(example));
      if (hit) bad.push(`${where} uses a video example: ${hit}`);
      const status = checkAnswer(problem.a, [problem.a], problem.form ?? 'any').status;
      if (status !== 'correct') bad.push(`${where} ${problem.a} is ${status}`);
      if (tagged && problem.std !== STD[id]) bad.push(`${where} std ${problem.std}`);
      if (!tagged && problem.std) bad.push(`${where} has a benchmark tag`);
    });
  }
  return bad;
}

describe('PSAT equations with fractions study guide', () => {
  it('checks every PSAT and middle-school answer', () => {
    expect(problemsOf(FRACTION_EQUATIONS_PROBLEMS, false)).toEqual([]);
    expect(problemsOf(FRACTION_EQUATIONS_MIDDLE, true)).toEqual([]);
    expect(Object.keys(FRACTION_EQUATIONS_PROBLEMS)).toEqual(
      Object.keys(FRACTION_EQUATIONS_MIDDLE),
    );
  });
});
