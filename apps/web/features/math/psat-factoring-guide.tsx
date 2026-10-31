import { FACTORING_ALGEBRA1 } from './psat-factoring-algebra1';
import { FACTORING_PROBLEMS } from './psat-factoring-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  average: {
    file: 'average',
    alt: 'A number line for x² + 32x + 192: 8 and 24 are each 8 away from the average 16, so the factors are (x + 8)(x + 24).',
  },
  negatives: {
    file: 'negatives',
    alt: 'The factor pair for x² − 6x − 91: 7 and −13 are each 10 away from the average −3, so the factors are (x + 7)(x − 13).',
  },
  halves: {
    file: 'halves',
    alt: 'The factor pair for x² + 9x + 20: 4 and 5 are each 1/2 away from the average 9/2, so the factors are (x + 4)(x + 5).',
  },
  leading: {
    file: 'leading',
    alt: 'Dividing 2x² − 7x − 4 by 2 gives a monic quadratic whose numbers are 1/2 and −4. Multiplying the fraction factor by 2 gives (2x + 1)(x − 4).',
  },
  irrational: {
    file: 'irrational',
    alt: 'x² + 8x + 4 has average 4 and k² = 12, so k = 2√3 and the factors are (x + 4 + 2√3)(x + 4 − 2√3).',
  },
  imaginary: {
    file: 'imaginary',
    alt: 'x² + 4x + 10 has average 2 and k² = −6, so k = i√6 and the factors are (x + 2 + i√6)(x + 2 − i√6).',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'average',
    title: 'Start from the average',
    start: '0:00',
    intro:
      'To factor x² + bx + c you need two numbers that add to b and multiply to c. Those two numbers always average to b ÷ 2, so each one is that average plus or minus the same distance k. You calculate k; you do not hunt for factor pairs.',
    rules: [
      'The average is b ÷ 2.',
      'The numbers are (b ÷ 2) − k and (b ÷ 2) + k.',
      'Their product is (b ÷ 2)² − k², and that product must equal c.',
      'So k² = (b ÷ 2)² − c. Take the positive square root.',
      'The factors are (x + (b ÷ 2) − k)(x + (b ÷ 2) + k).',
    ],
    example:
      'x² + 32x + 192. The average is 16. Then 16² − k² = 192, so 256 − k² = 192, k² = 64 and k = 8. The numbers are 16 − 8 = 8 and 16 + 8 = 24. Factored form: (x + 8)(x + 24).',
    tip: 'Use the positive square root only. Negative k swaps the two numbers and gives the same factors.',
  },
  {
    id: 'negatives',
    title: 'A negative sum',
    start: '7:00',
    intro:
      'The same steps work when b or c is negative. Half of a negative sum is negative, and a negative product means the two numbers have opposite signs, so k is larger than the average.',
    rules: [
      'Keep the sign on b when you halve it.',
      'k² = (average)² − c. Subtracting a negative constant makes k² bigger.',
      'Check the pair: they must add to b and multiply to c.',
    ],
    example:
      'x² − 6x − 91. The average is −3. Then (−3)² − k² = −91, so 9 − k² = −91, k² = 100 and k = 10. The numbers are −3 + 10 = 7 and −3 − 10 = −13. Factored form: (x + 7)(x − 13).',
    tip: 'A negative product is the clue that one number is positive and the other is negative.',
  },
  {
    id: 'halves',
    title: 'When the average is a fraction',
    start: '10:10',
    intro:
      'If b is odd, b ÷ 2 is a fraction. Stay in fractions. k² is a fraction, and k is often a fraction too. The two numbers can still be whole numbers.',
    rules: [
      'Write the average as a fraction in lowest terms, such as 9/2.',
      'Square that fraction, then subtract c. Use a common denominator.',
      'k is the positive square root of what is left.',
    ],
    example:
      'x² + 9x + 20. The average is 9/2. Then (9/2)² − k² = 20, so 81/4 − 80/4 = 1/4 and k = 1/2. The numbers are 9/2 + 1/2 = 5 and 9/2 − 1/2 = 4. Factored form: (x + 5)(x + 4).',
    tip: 'Do not switch to decimals. 4.5² is harder to keep exact than (9/2)².',
  },
  {
    id: 'leading',
    title: 'A coefficient on x²',
    start: '12:53',
    intro:
      'The average method needs the x² coefficient to be 1. Divide every term by that coefficient, factor the monic quadratic, then multiply the coefficient back into the factor that still has a fraction.',
    rules: [
      'For ax² + bx + c, divide by a first.',
      'The average is then b ÷ (2a), which is often a fraction.',
      'Multiply a into the fractional factor so both factors have whole-number coefficients.',
      'Check by expanding.',
    ],
    example:
      '2x² − 7x − 4. Divide by 2: x² − (7/2)x − 2. The average is −7/4. Then (−7/4)² − k² = −2, so 49/16 + 32/16 = 81/16 and k = 9/4. The numbers are 1/2 and −4. Then 2(x + 1/2)(x − 4) = (2x + 1)(x − 4).',
    tip: 'Only the factor with the fraction gets multiplied by a. The other factor stays as it is.',
  },
  {
    id: 'irrational',
    title: 'Irrational factors',
    start: '15:42',
    intro:
      'If k² is positive but not a perfect square, there is no whole-number pair. The factors are still real: they contain a simplified radical.',
    rules: [
      'Compute k² the same way.',
      'Simplify √k²: pull out the largest perfect-square factor.',
      'The factors are (x + average + k)(x + average − k).',
    ],
    example:
      'x² + 8x + 4. The average is 4. Then 16 − k² = 4, so k² = 12 and k = √12 = 2√3. Factored form: (x + 4 + 2√3)(x + 4 − 2√3).',
    tip: '“Not factorable” usually means “not factorable over the whole numbers.” This method still finds the real factors.',
  },
  {
    id: 'imaginary',
    title: 'Imaginary factors',
    start: '17:50',
    intro:
      'If k² is negative, k is not a real number. Write k as i times a simplified radical. The factors use that k. PSAT items rarely need these factors; the practice below asks for k² and the simplified radical, not for a typed complex number.',
    rules: [
      'k² = (average)² − c. A negative result means the factors are not real.',
      '√(−n) = i√n. Simplify √n the usual way.',
      'The factors are (x + average + k)(x + average − k).',
    ],
    example:
      'x² + 4x + 10. The average is 2. Then 4 − 10 = −6, so k² = −6 and k = i√6. Factored form: (x + 2 + i√6)(x + 2 − i√6).',
    tip: 'A negative k² is not a sign that you made an arithmetic error. It means the pair is not real.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'Two numbers add to 14. What is their average?', a: '7' },
  {
    q: 'Two numbers add to 14 and each sits 3 away from the average. What is the smaller number?',
    a: '4',
  },
  { q: 'Factor x² + 10x + 16.', a: '(x + 2)(x + 8)' },
  { q: 'Factor x² − 4x − 12.', a: '(x + 2)(x − 6)' },
  { q: 'Factor x² + 7x + 12.', a: '(x + 3)(x + 4)' },
  { q: 'Factor x² − 10x + 21.', a: '(x − 7)(x − 3)' },
  { q: 'Factor 3x² + 8x + 4.', a: '(3x + 2)(x + 2)' },
  { q: 'Factor 2x² + 7x + 3.', a: '(2x + 1)(x + 3)' },
  { q: 'Factor x² + 6x + 4.', a: '(x + 3 + √5)(x + 3 − √5)' },
  { q: 'Factor x² + 4x − 1.', a: '(x + 2 + √5)(x + 2 − √5)' },
  { q: 'For x² + 2x + 6, what is k²?', a: '−5' },
  { q: 'Two numbers add to 11. What is their average?', a: '11/2' },
];

const REVIEW: Guide['review'] = [
  ['Average', 'two numbers that add to b average to b ÷ 2'],
  ['The distance k', 'numbers are (b ÷ 2) − k and (b ÷ 2) + k'],
  ['Find k²', 'k² = (b ÷ 2)² − c; use the positive square root'],
  ['Factors when a = 1', '(x + (b ÷ 2) − k)(x + (b ÷ 2) + k)'],
  ['Negative product', 'the numbers have opposite signs, so k is larger than the average'],
  ['Fraction average', 'keep halves as fractions; do not switch to decimals'],
  ['a ≠ 1', 'divide by a, factor, then multiply a back into the fractional factor'],
  ['Irrational k', 'simplify √k²; the factors are still real'],
  ['Negative k²', 'k = i√|k²|; the factors are not real'],
];

/** The PSAT factoring guide: the average method, summarised in our own words from a JensenMath video. */
export const FACTORING: Guide = {
  title: 'Factoring',
  blurb:
    'Factor any quadratic by starting from the average of the two numbers, with no guessing of a product-and-sum pair. Each topic links to its part of the video.',
  folder: 'factoring',
  href: '/psat/factoring',
  video: {
    url: 'https://www.youtube.com/watch?v=PgI4ypRRi8k',
    label: 'JensenMath, “Factoring Quadratics WITHOUT Guessing Product & Sum” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: FACTORING_PROBLEMS,
  middleProblems: FACTORING_ALGEBRA1,
  middleLevel: {
    id: 'a1',
    label: 'Algebra 1 (grade 9)',
    note: "Aligned to Florida's B.E.S.T. Algebra 1 benchmark MA.912.AR.1.7 (factor polynomial expressions). A teacher should check that code. These follow the video's chapters at Algebra 1 level.",
  },
};

export function PsatFactoringGuide() {
  return <StudyGuide guide={FACTORING} />;
}

/** One Factoring chapter as a sub-module: its notes and 25 problems. */
export function PsatFactoringTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={FACTORING} topicId={topicId} />;
}
