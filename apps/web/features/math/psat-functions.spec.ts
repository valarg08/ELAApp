import { checkAnswer } from '@storyforge/math-check';
import { describe, expect, it } from 'vitest';
import type { GuideProblem } from './guide-problem';
import { FUNCTIONS_ALGEBRA1 } from './psat-functions-algebra1';
import { FUNCTIONS_PROBLEMS } from './psat-functions-problems';

const CHAPTERS = [
  'whatis',
  'domain',
  'common',
  'transform',
  'inverse',
  'combine',
  'composite',
  'piecewise',
  'evenodd',
  'asymptotes',
] as const;

/** The video's examples stay in the notes. Practice must not repeat them. */
const VIDEO = [
  'y = 2x² − 5',
  'f(x) = 2x² − 5',
  'x = y²',
  'f(x) = x² + 1',
  'y = x² + 1',
  'f(x) = x³',
  'f(x) = 2^x',
  'f(x) = log₂ x',
  'f(x) = −x² + 3',
  'g(x) = −2x',
  'f(x) = x² + 2x + 3',
  'g(x) = x + 4',
  'f(x) = 2x',
  'g(x) = x + 3',
  'f(x) = x⁴ − 2x² − 1',
  'f(x) = x³ + 3x',
  '1/((x + 2)(x − 4))',
  'f(x) = √x',
  'f(x) = 1/x',
];
const escape = (s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const VIDEO_PATTERNS = VIDEO.map(
  (example) => new RegExp(`${escape(example)}${String.raw`(?!\d|\s[+−×/]|[²³⁴^])`}`),
);

const STD: Record<(typeof CHAPTERS)[number], string> = {
  whatis: 'MA.912.F.1.2',
  domain: 'MA.912.F.1.1',
  common: 'MA.912.F.1.3',
  transform: 'MA.912.F.2.1',
  inverse: 'MA.912.F.2.2',
  combine: 'MA.912.F.1.4',
  composite: 'MA.912.F.1.4',
  piecewise: 'MA.912.F.1.3',
  evenodd: 'MA.912.F.1.6',
  asymptotes: 'MA.912.F.1.5',
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
      const hit = VIDEO_PATTERNS.find((pattern) => pattern.test(problem.q));
      if (hit) bad.push(`${where} uses a video example: ${hit}`);
      const status = checkAnswer(problem.a, [problem.a], problem.form ?? 'any').status;
      if (status !== 'correct') bad.push(`${where} ${problem.a} is ${status}`);
      if (algebra1 && problem.std !== STD[id]) bad.push(`${where} std ${problem.std}`);
      if (!algebra1 && problem.std) bad.push(`${where} has a benchmark tag`);
    });
  }
  return bad;
}

describe('PSAT functions study guide', () => {
  it('checks every PSAT and Algebra 1 answer', () => {
    expect(problemsOf(FUNCTIONS_PROBLEMS, false)).toEqual([]);
    expect(problemsOf(FUNCTIONS_ALGEBRA1, true)).toEqual([]);
    expect(Object.keys(FUNCTIONS_PROBLEMS)).toEqual(Object.keys(FUNCTIONS_ALGEBRA1));
  });
});
