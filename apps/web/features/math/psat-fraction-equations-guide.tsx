import { FRACTION_EQUATIONS_MIDDLE } from './psat-fraction-equations-middle';
import { FRACTION_EQUATIONS_PROBLEMS } from './psat-fraction-equations-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  lcm: {
    file: 'lcm',
    alt: 'Finding the least common multiple of 6 and 9. The multiples of 6 are 6, 12, 18, 24. The multiples of 9 are 9, 18, 27. The first number in both lists is 18, so the LCM is 18.',
  },
  clear: {
    file: 'clear',
    alt: 'Clearing fractions. In x over 2 plus 1 over 3 equals 5 over 6, the LCM of 2, 3 and 6 is 6. Multiply every term by 6 to get 3x plus 2 equals 5, which has no fractions.',
  },
  solve: {
    file: 'solve',
    alt: 'Solving with fractions on both sides. For x over 3 minus 2 equals x over 2 plus 1, multiply every term by 6, including the whole numbers: 2x minus 12 equals 3x plus 6. Then x equals minus 18.',
  },
  single: {
    file: 'single',
    alt: 'One fraction equal to a number. In the fraction 2x plus 1, over 5, equal to 3, multiply both sides by 5 to get 2x plus 1 equals 15. Then 2x equals 14 and x equals 7.',
  },
  cross: {
    file: 'cross',
    alt: 'Cross multiplication. For x over 4 equal to 5 over 6, multiply across the equals sign: 6 times x equals 4 times 5, so 6x equals 20 and x equals 20 over 6, which is 10 over 3.',
  },
  parens: {
    file: 'parens',
    alt: 'Brackets over denominators. For x plus 1 over 2 minus x minus 1 over 3 equals 2, multiply by 6. This gives 3 times (x plus 1) minus 2 times (x minus 1) equals 12. Distribute: 3x plus 3 minus 2x plus 2 equals 12, so x equals 7.',
  },
  check: {
    file: 'check',
    alt: 'Checking a solution. For x over 4 plus 3 equals 5, the solution is x equals 8. Put 8 in both sides. The left side is 8 over 4 plus 3, which is 5, and the right side is 5. Both sides match, so 8 is correct.',
  },
};

// The video has no chapter times, so the topics have no `start`; each links to the whole video.
const TOPICS: Topic[] = [
  {
    id: 'lcm',
    title: 'Finding the LCM',
    intro:
      'The whole method rests on one number: the least common multiple (LCM) of the denominators. It is the smallest number that every denominator divides into evenly.',
    rules: [
      'List the multiples of each denominator and find the first one they share, or use prime factors.',
      'With prime factors, write each denominator as a product of primes and take the highest power of each prime.',
      'The LCM is at least as big as the biggest denominator.',
      'If one denominator already divides all the others, it is the LCM.',
    ],
    example:
      'Denominators 3, 4 and 6: the multiples of 6 are 6, 12; 12 is divisible by 3, 4 and 6, so the LCM is 12. With prime factors, 4 = 2², 6 = 2 × 3 and 3 = 3, so the LCM is 2² × 3 = 12.',
    tip: 'Do not just multiply the denominators. For 4 and 6 that gives 24, which works but makes the numbers bigger than they need to be. The LCM is 12.',
  },
  {
    id: 'clear',
    title: 'Clearing the fractions',
    intro:
      'Step 1 of the method: multiply every term on both sides by the LCM. Each denominator divides into the LCM, so every fraction turns into a whole number.',
    rules: [
      'Find the LCM of all the denominators in the whole equation.',
      'Multiply every term on both sides by it, including the terms that are not fractions.',
      'Cancel each denominator: LCM ÷ denominator gives the new coefficient.',
      'You now have an equation with no fractions.',
    ],
    example:
      '3x/4 − 2/3 = 5/6. The LCM of 4, 3 and 6 is 12. Multiply every term by 12: 9x − 8 = 10. The fractions are gone.',
    tip: 'Write the multiplication out the first few times (12 · 3x/4 = 9x). Once it is a habit you can do it in your head: 12 ÷ 4 = 3, and 3 × 3x = 9x.',
  },
  {
    id: 'solve',
    title: 'Fractions on both sides',
    intro:
      'Step 2 is ordinary equation solving. When x appears on both sides, collect the x terms on one side and the numbers on the other.',
    rules: [
      'Clear the fractions first: multiply every term by the LCM.',
      'A whole-number term gets multiplied too: 8 becomes 8 × LCM.',
      'Move the x terms to one side and the numbers to the other, changing signs as you cross the equals sign.',
      'Divide by the coefficient of x. The answer can be a fraction.',
    ],
    example:
      'x/4 − 2 = x/8 + 3. The LCM of 4 and 8 is 8, so: 2x − 16 = x + 8, then 2x − x = 8 + 16, so x = 24.',
    tip: 'The most common slip is multiplying only the fractions. If a number stands alone, multiply it by the LCM as well.',
  },
  {
    id: 'single',
    title: 'One fraction equal to a number',
    intro:
      'When one fraction equals a number, there is only one denominator. Multiply both sides by it and the fraction disappears at once.',
    rules: [
      'A fraction bar means divide. Undo the division by multiplying both sides by the denominator.',
      'If the top has more than one term, keep it together: the whole top is divided.',
      'Then solve the two-step equation that is left.',
      'If the number has a fraction too, find the LCM as usual.',
    ],
    example:
      '(3x + 5)/11 = −2. Multiply both sides by 11: 3x + 5 = −22. Subtract 5: 3x = −27. Divide by 3: x = −9.',
    tip: 'Multiply the whole side by the denominator. 11 × (3x + 5)/11 is 3x + 5, with the top kept as one group.',
  },
  {
    id: 'cross',
    title: 'Cross multiplying',
    intro:
      'A fraction equal to a fraction is a proportion. Cross multiplication is a shortcut for multiplying both sides by both denominators.',
    rules: [
      'a/b = c/d becomes a × d = b × c.',
      'Multiply the top of each fraction by the bottom of the other.',
      'Put brackets around any top that has more than one term.',
      'Then expand the brackets and solve. This works only when each side is a single fraction.',
    ],
    example:
      '(3x − 4)/5 = (x + 1)/4. Cross multiply: 4(3x − 4) = 5(x + 1). Expand: 12x − 16 = 5x + 5. Then 7x = 21 and x = 3.',
    tip: 'If a side has more than one fraction, such as a sum, cross multiplying is not allowed. Clear the fractions with the LCM instead.',
  },
  {
    id: 'parens',
    title: 'Brackets over denominators',
    intro:
      'A top with two terms is really a bracket. After you multiply by the LCM, the multiplier sits in front of the whole bracket, and you must distribute it.',
    rules: [
      'Multiply by the LCM, then write the new coefficient in front of the bracket, in brackets.',
      'A minus sign in front of a fraction applies to the whole bracket: change both signs when you distribute.',
      'Distribute, combine like terms, then solve.',
      'Check that your multiplier is the LCM divided by that fraction’s denominator.',
    ],
    example:
      '(x + 2)/6 − (x − 4)/8 = 1. The LCM of 6 and 8 is 24: 4(x + 2) − 3(x − 4) = 24. Distribute: 4x + 8 − 3x + 12 = 24, so x + 20 = 24 and x = 4.',
    tip: 'Put the minus sign with the bracket: −3(x − 4) = −3x + 12. Forgetting to flip the second sign is the classic mistake.',
  },
  {
    id: 'check',
    title: 'Checking your answer',
    intro:
      'Fraction equations have many small steps, so it is worth checking. Put the answer back into the original equation, not the cleared one.',
    rules: [
      'Substitute your answer for x on the left side and work it out.',
      'Do the same on the right side.',
      'If both sides give the same value, the answer is right.',
      'If they differ, look for a term you did not multiply by the LCM or a sign you did not change.',
    ],
    example:
      '(x − 7)/3 = x/5 + 2 gives x = 65/2. Left: (65/2 − 7)/3 = (51/2)/3 = 17/2. Right: (65/2)/5 + 2 = 13/2 + 2 = 17/2. The sides match.',
    tip: 'Check in the original equation. If you check in a cleared equation that already has a mistake, a wrong answer can still look right.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'What is the LCM of 4 and 10?', a: '20' },
  { q: 'Solve x/5 + 2 = 4.', a: 'x = 10' },
  { q: 'Solve (x + 3)/4 = 2.', a: 'x = 5' },
  { q: 'Solve x/6 = 2/3.', a: 'x = 4' },
  { q: 'Solve x/2 + x/3 = 10.', a: 'x = 12' },
  { q: 'Solve 2x/3 − 1 = x/2.', a: 'x = 6' },
  { q: 'Solve 3 − x/4 = 1.', a: 'x = 8' },
  { q: 'Solve (2x − 1)/3 = (x + 4)/2.', a: 'x = 14' },
  { q: 'Solve x/4 − 2/3 = 1/6.', a: 'x = 10/3' },
  { q: 'Solve (x + 1)/2 + (x − 1)/3 = 3.', a: 'x = 17/5' },
  { q: 'Is x = 6 a solution of x/3 + 1 = 3?', a: 'Yes: 6/3 + 1 = 3.' },
  {
    q: 'A student writes x/2 + 3 = 5 as x + 3 = 10. What went wrong?',
    a: 'The 3 was not multiplied by 2. It should be x + 6 = 10, so x = 4.',
  },
];

const REVIEW: Guide['review'] = [
  ['Step 1', 'multiply every term on both sides by the LCM of the denominators'],
  ['Step 2', 'solve the equation that is left, with no fractions'],
  ['LCM', 'smallest number all denominators divide into: highest power of each prime'],
  ['Whole numbers', 'a term without a fraction is multiplied by the LCM too'],
  ['One fraction = number', 'multiply both sides by the denominator; keep the top together'],
  ['Cross multiply', 'a/b = c/d → ad = bc (only a single fraction on each side)'],
  ['Brackets', 'the multiplier goes on the whole top: distribute, and a minus flips both signs'],
  ['Check', 'put the answer in the original equation: both sides must match'],
];

/** The PSAT equations with fractions guide: seven topics, summarised in our own words from a GoTutor Math video. */
export const FRACTION_EQUATIONS: Guide = {
  title: 'Equations with Fractions',
  blurb:
    'Seven topics on solving linear equations that have fractions in two steps: clear the fractions with the LCM, then solve. Rules, worked examples and practice. The video has no chapter times, so each topic links to the whole video.',
  folder: 'fraction-equations',
  href: '/psat/fraction-equations',
  video: {
    url: 'https://www.youtube.com/watch?v=7V-T2Jr9wXY',
    label: 'GoTutor Math, “Solving Linear Equations with Fractions in Just Two Steps” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: FRACTION_EQUATIONS_PROBLEMS,
  middleProblems: FRACTION_EQUATIONS_MIDDLE,
  middleLevel: {
    id: 'ms',
    label: 'Middle school (grades 6–8)',
    note: "Aligned to Florida's B.E.S.T. benchmarks MA.6.NSO.3.1 (greatest common factor and least common multiple) and MA.8.AR.2.1 (multi-step linear equations with rational coefficients). The codes were checked against Florida Department of Education material, but a teacher should check that each chapter fits its code. These follow the video's topics at middle-school level.",
  },
};

export function PsatFractionEquationsGuide() {
  return <StudyGuide guide={FRACTION_EQUATIONS} />;
}

/** One Equations with Fractions chapter as a sub-module: its notes and 25 problems. */
export function PsatFractionEquationsTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={FRACTION_EQUATIONS} topicId={topicId} />;
}
