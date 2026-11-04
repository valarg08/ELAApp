import { checkAnswer } from '@storyforge/math-check';
import { describe, expect, it } from 'vitest';
import type { GuideProblem } from './guide-problem';
import { POWERS_MIDDLE } from './psat-powers-middle';
import { POWERS_PROBLEMS } from './psat-powers-problems';

const CHAPTERS = [
  'powers',
  'negzero',
  'writing',
  'signs',
  'substitute',
  'sci',
  'tostd',
  'tosci',
] as const;

/** The video's examples stay in the notes. Practice must not repeat them. */
const VIDEO = [
  '2⁴',
  '2³',
  '2²',
  '2¹',
  '2⁰',
  '2⁻¹',
  '2⁻²',
  '2⁻³',
  '3²',
  '5⁴',
  '4³',
  '(−2)²',
  '(−2)³',
  '(−2)⁴',
  '(−2)⁵',
  '(−3)⁴',
  '−3⁴',
  '(1/5)²',
  'h⁵',
  '6x²',
  '9.47',
  '1.67',
  '4.5 × 10⁻³',
  '2.4571 × 10⁸',
  '245,710,000',
  '0.0045',
  '4,567,000,000',
  '4.567',
  '4.872',
  '0.0004872',
  '812,000',
  '8.12 × 10⁵',
];
const escape = (s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const VIDEO_PATTERNS = VIDEO.map(
  (example) => new RegExp(`(?<![\\d.,⁰¹²³⁴⁵⁶⁷⁸⁹⁻])${escape(example)}(?![\\d⁰¹²³⁴⁵⁶⁷⁸⁹.,])`),
);

const STD: Record<(typeof CHAPTERS)[number], string> = {
  powers: 'MA.7.NSO.1.1',
  negzero: 'MA.8.NSO.1.3',
  writing: 'MA.7.NSO.1.1',
  signs: 'MA.7.NSO.1.1',
  substitute: 'MA.8.NSO.1.7',
  sci: 'MA.8.NSO.1.4',
  tostd: 'MA.8.NSO.1.4',
  tosci: 'MA.8.NSO.1.4',
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
      const hit = VIDEO_PATTERNS.find((pattern) => pattern.test(problem.q));
      if (hit) bad.push(`${where} uses a video example: ${hit}`);
      const status = checkAnswer(problem.a, [problem.a], problem.form ?? 'any').status;
      if (status !== 'correct') bad.push(`${where} ${problem.a} is ${status}`);
      if (tagged && problem.std !== STD[id]) bad.push(`${where} std ${problem.std}`);
      if (!tagged && problem.std) bad.push(`${where} has a benchmark tag`);
    });
  }
  return bad;
}

describe('PSAT powers and scientific notation study guide', () => {
  it('checks every PSAT and middle-school answer', () => {
    expect(problemsOf(POWERS_PROBLEMS, false)).toEqual([]);
    expect(problemsOf(POWERS_MIDDLE, true)).toEqual([]);
    expect(Object.keys(POWERS_PROBLEMS)).toEqual(Object.keys(POWERS_MIDDLE));
  });
});
