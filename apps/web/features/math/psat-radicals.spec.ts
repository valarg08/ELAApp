import { checkAnswer } from '@storyforge/math-check';
import { describe, expect, it } from 'vitest';
import type { GuideProblem } from './guide-problem';
import { RADICALS_ALGEBRA1 } from './psat-radicals-algebra1';
import { RADICALS_PROBLEMS } from './psat-radicals-problems';

const CHAPTERS = [
  'whatis',
  'perfect',
  'simplify',
  'muldiv',
  'addsub',
  'rationalize',
  'equations',
  'function',
  'imaginary',
  'uses',
] as const;

/** The video's examples stay in the notes. Practice must not repeat them. */
const VIDEO = [
  '√16',
  '√9',
  '∛8',
  '√64',
  '∛125',
  '√50',
  '√80',
  '∛(−16)',
  '√2 · √8',
  '√20 · √3',
  '3√2 · 4√3',
  '3√2 + 5√2',
  '7∛5 − 2∛5',
  '√50 + √18',
  '(4√3 + 5)(2 − √3)',
  '2/√3',
  '5/(3 + √2)',
  '√(x + 3) = 7',
  '√(x + 1) = √(2x − 3)',
  '√(x + 5) = −3',
  'f(x) = √x',
  '√(−9)',
  '√(−8)',
  'x² + 4x + 5 = 0',
];
const escape = (s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const VIDEO_PATTERNS = VIDEO.map(
  (example) =>
    new RegExp(
      `${/^\d/.test(example) ? String.raw`(?<!\d)` : ''}${escape(example)}${String.raw`(?!\d)`}`,
    ),
);

const STD: Record<(typeof CHAPTERS)[number], string> = {
  whatis: 'MA.912.NSO.1.1',
  perfect: 'MA.912.NSO.1.2',
  simplify: 'MA.912.NSO.1.2',
  muldiv: 'MA.912.NSO.1.2',
  addsub: 'MA.912.NSO.1.2',
  rationalize: 'MA.912.NSO.1.2',
  equations: 'MA.912.AR.9.1',
  function: 'MA.912.F.1.2',
  imaginary: 'MA.912.NSO.1.4',
  uses: 'MA.912.NSO.1.2',
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

describe('PSAT radicals study guide', () => {
  it('checks every PSAT and Algebra 1 answer', () => {
    expect(problemsOf(RADICALS_PROBLEMS, false)).toEqual([]);
    expect(problemsOf(RADICALS_ALGEBRA1, true)).toEqual([]);
    expect(Object.keys(RADICALS_PROBLEMS)).toEqual(Object.keys(RADICALS_ALGEBRA1));
  });
});
