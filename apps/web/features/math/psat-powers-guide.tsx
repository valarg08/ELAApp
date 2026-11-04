import { POWERS_MIDDLE } from './psat-powers-middle';
import { POWERS_PROBLEMS } from './psat-powers-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  powers: {
    file: 'powers',
    alt: 'Anatomy of a power. In 5 to the power 3, the base 5 is the number being multiplied and the exponent 3 counts the factors, so it equals 5 times 5 times 5, which is 125.',
  },
  negzero: {
    file: 'negzero',
    alt: 'A table of powers of 3 from 3 cubed down to 3 to the minus 2. Each step down divides the value by 3: 27, 9, 3, then 3 to the 0 equals 1, then 1 over 3, then 1 over 9. A zero exponent gives 1, and a negative exponent gives a reciprocal.',
  },
  writing: {
    file: 'writing',
    alt: 'Three ways to write the same thing: the expanded form 7 times 7 times 7 times 7, the power 7 to the 4, and the value 2401.',
  },
  signs: {
    file: 'signs',
    alt: 'Brackets matter for a negative base. Negative 5, cubed, in brackets is minus 125; negative 5, squared, in brackets is positive 25; but minus 5 squared without brackets is minus 25 because the exponent is only on the 5.',
  },
  substitute: {
    file: 'substitute',
    alt: 'Substituting a negative value. For 4x squared plus 3x when x is minus 2, replace x with minus 2 in brackets: 4 times (minus 2) squared plus 3 times (minus 2) is 16 minus 6, which is 10. Without brackets, minus 2 squared would wrongly look like minus 4.',
  },
  sci: {
    file: 'sci',
    alt: 'The rule for scientific notation a times 10 to the n: a is at least 1 and less than 10, and n is a whole number. 3.2 times 10 to the 5 is correct. 32 times 10 to the 4 has a coefficient that is too big. 0.32 times 10 to the 6 has a coefficient that is too small.',
  },
  tostd: {
    file: 'tostd',
    alt: 'Moving the decimal point. 6.3 times 10 to the 4 moves the decimal point 4 places right to give 63,000. 6.3 times 10 to the minus 3 moves it 3 places left to give 0.0063.',
  },
  tosci: {
    file: 'tosci',
    alt: 'Writing in scientific notation. 52,000,000 becomes 5.2 times 10 to the 7, because the decimal point moves 7 places left. 0.00031 becomes 3.1 times 10 to the minus 4, because the decimal point moves 4 places right.',
  },
};

// The video has no chapter times, so the topics have no `start`; each links to the whole video.
const TOPICS: Topic[] = [
  {
    id: 'powers',
    title: 'What is a power?',
    intro:
      'A power is repeated multiplication of the same number. In aⁿ the base a is the number being multiplied and the exponent n tells how many factors of the base there are.',
    rules: [
      'aⁿ means n factors of a multiplied together.',
      'Use a power whenever the same number is multiplied again and again.',
      'To evaluate a power, multiply the factors one at a time.',
      'The exponent is not a multiplier: 2⁴ is 2 × 2 × 2 × 2, not 2 × 4.',
    ],
    example: '2⁴ has base 2 and exponent 4, so it is four factors of 2: 2 × 2 × 2 × 2 = 16.',
    tip: 'Read the exponent as a count of factors. It tells you how many copies of the base to multiply, not what to multiply by.',
  },
  {
    id: 'negzero',
    title: 'Zero and negative exponents',
    intro:
      'Look at the pattern in a table of powers. Each time the exponent goes down by 1, the value is divided by the base. Keep going past 1 and you get the rules for zero and negative exponents.',
    tables: [
      {
        caption: 'Powers of 2: every step down divides by 2',
        table: {
          head: ['Power', 'Expanded', 'Value'],
          rows: [
            ['2³', '2 × 2 × 2', '8'],
            ['2²', '2 × 2', '4'],
            ['2¹', '2', '2'],
            ['2⁰', '2 ÷ 2', '1'],
            ['2⁻¹', '1 ÷ 2', '1/2'],
            ['2⁻²', '1 ÷ (2 × 2)', '1/4'],
            ['2⁻³', '1 ÷ (2 × 2 × 2)', '1/8'],
          ],
        },
      },
    ],
    rules: [
      'Zero exponent: a⁰ = 1 for any base a that is not 0.',
      '0⁰ is undefined. It is not 0 and not 1.',
      'Negative exponent: a⁻ⁿ = 1/aⁿ. Write the reciprocal and make the exponent positive.',
      'Going up a row multiplies by the base; going down a row divides by it.',
    ],
    example:
      '2⁻³ = 1/2³ = 1/8. A negative exponent does not make the number negative; it flips it into a fraction.',
    tip: 'A negative exponent means “one over”. 5⁻² is 1/25, not −25 and not −10.',
  },
  {
    id: 'writing',
    title: 'Writing and expanding powers',
    intro:
      'Any repeated multiplication can be written as a power (exponential form), and any power can be written out as a product (expanded form) and then evaluated.',
    rules: [
      'To write a power, count the equal factors. That count is the exponent.',
      'A variable works the same way: h × h × h × h × h = h⁵.',
      'A negative base goes in brackets: (−2) × (−2) × (−2) = (−2)³.',
      'A fraction base goes in brackets too: (1/5)² = 1/5 × 1/5 = 1/25. Multiply the tops, then the bottoms.',
    ],
    example: '3 × 3 = 3² and 5 × 5 × 5 × 5 = 5⁴. Going the other way, 4³ = 4 × 4 × 4 = 64.',
    tip: 'Without brackets the exponent only sits on the number right next to it. Brackets show that the whole base, sign or fraction and all, is repeated.',
  },
  {
    id: 'signs',
    title: 'Negative bases',
    intro:
      'Brackets decide what is being multiplied. (−3)⁴ is four factors of −3. Without brackets, −3⁴ is the opposite of 3⁴.',
    rules: [
      'With brackets: the whole −3 is the base, so (−3)⁴ = (−3)(−3)(−3)(−3) = 81.',
      'Without brackets: −3⁴ = −1 × 3⁴ = −81. The exponent is only on the 3.',
      'A negative base to an even exponent gives a positive answer.',
      'A negative base to an odd exponent gives a negative answer.',
    ],
    example:
      '(−2)² = 4, (−2)³ = −8, (−2)⁴ = 16, (−2)⁵ = −32: the size doubles each time and the sign flips each time.',
    tip: 'Count the exponent, not the number of minus signs: even means positive, odd means negative, but only when the bracket holds the minus.',
  },
  {
    id: 'substitute',
    title: 'Substituting into expressions',
    intro:
      'To evaluate an expression for a given value of a variable, replace the variable with the value, always in brackets, then follow the order of operations.',
    rules: [
      'Replace each variable with its value in brackets.',
      'Work out the powers first.',
      'Then multiply and divide, left to right.',
      'Finally add and subtract.',
    ],
    example:
      '6x² when x = 5: 6(5)² = 6 × 25 = 150. And 6x² − 2x − 24 when x = −6: 6(−6)² − 2(−6) − 24 = 216 + 12 − 24 = 204.',
    tip: 'Forgetting the brackets around a negative value is the most common mistake: (−6)² is 36, but −6² is −36.',
  },
  {
    id: 'sci',
    title: 'What is scientific notation?',
    intro:
      'Scientific notation writes very large or very small numbers in a short form: a coefficient with one digit before the decimal point, times a power of 10.',
    rules: [
      'The form is a × 10ⁿ.',
      'The coefficient a satisfies 1 ≤ |a| < 10, so there is exactly one non-zero digit before the decimal point.',
      'The exponent n is any whole number: positive, negative or zero.',
      'Big numbers have a positive n. Numbers between 0 and 1 have a negative n.',
    ],
    example:
      'The Milky Way is about 947 quadrillion km across, which is 9.47 × 10¹⁷ km. The mass of a proton is about 1.67 × 10⁻²⁴ g. Both are far shorter to write than all those zeros.',
    tip: '45 × 10² is not in scientific notation, because 45 is 10 or more. Move one power of 10 into the exponent: 4.5 × 10³.',
  },
  {
    id: 'tostd',
    title: 'Scientific notation to standard form',
    intro:
      'Multiplying by 10 moves the decimal point one place right. Dividing by 10 moves it one place left. The exponent says how many moves.',
    rules: [
      'If n is positive, move the decimal point n places to the right.',
      'If n is negative, move the decimal point |n| places to the left. (10⁻ⁿ means divide by 10, n times.)',
      'Fill in any missing places with zeros.',
    ],
    example:
      '4.5 × 10⁻³: the exponent is −3, so move the point 3 places left to get 0.0045. 2.4571 × 10⁸: move the point 8 places right to get 245,710,000.',
    tip: 'The sign of the exponent gives the direction: positive goes right (bigger), negative goes left (smaller).',
  },
  {
    id: 'tosci',
    title: 'Standard form to scientific notation',
    intro:
      'Work the other way: put the decimal point after the first non-zero digit, then count how far it moved.',
    rules: [
      'Write the non-zero digits and put the decimal point after the first one. That is the coefficient a.',
      'Count the places the decimal point moved from where it started.',
      'If it moved left, n is positive. If it moved right, n is negative.',
      'Write a × 10ⁿ.',
    ],
    example:
      '4,567,000,000 → 4.567, and the point moved 9 places left: 4.567 × 10⁹. 0.0004872 → 4.872, moved 4 places right: 4.872 × 10⁻⁴. 812,000 → 8.12 × 10⁵.',
    tip: 'Check the answer by moving the point back: n places in the opposite direction must give the number you started with.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'What is 7²?', a: '49' },
  { q: 'What is 5⁰?', a: '1' },
  { q: 'What is 3⁻³? Write it as a fraction.', a: '1/27' },
  { q: 'What is (2/3)²?', a: '4/9' },
  { q: 'What is (−4)³?', a: '−64' },
  { q: 'What is −5²?', a: '−25' },
  { q: 'Evaluate 2x² when x = −3.', a: '18' },
  { q: 'Is 28 × 10³ in scientific notation?', a: 'No, 28 is 10 or more. It is 2.8 × 10⁴.' },
  { q: 'Write 6.2 × 10⁴ in standard form.', a: '62,000' },
  { q: 'Write 3 × 10⁻⁵ as a decimal.', a: '0.00003' },
  { q: 'Write 730,000 in scientific notation.', a: '7.3 × 10⁵' },
  { q: 'Write 0.0058 in scientific notation.', a: '5.8 × 10⁻³' },
  { q: 'Which is larger, 6 × 10⁻² or 9 × 10⁻³?', a: '6 × 10⁻²' },
  { q: 'How many times larger is 10⁷ than 10⁴?', a: '1,000' },
  { q: 'What is the last digit of 7¹⁰?', a: '9' },
];

const REVIEW: Guide['review'] = [
  ['Power', 'aⁿ = n factors of a; a is the base, n is the exponent'],
  ['Zero exponent', 'a⁰ = 1 (a ≠ 0); 0⁰ is undefined'],
  ['Negative exponent', 'a⁻ⁿ = 1/aⁿ'],
  ['Pattern', 'down one exponent: divide by the base; up one: multiply by it'],
  ['Negative base', '(−a)ⁿ: even n positive, odd n negative; −aⁿ = −(aⁿ)'],
  ['Substituting', 'put the value in brackets, powers first, then × ÷, then + −'],
  ['Scientific notation', 'a × 10ⁿ with 1 ≤ |a| < 10 and n a whole number'],
  ['To standard form', 'n > 0: point right n places; n < 0: point left |n| places'],
  ['To scientific', 'point after the first non-zero digit; moved left → +n, moved right → −n'],
];

/** The PSAT powers guide: eight topics, summarised in our own words from a JensenMath video. */
export const POWERS: Guide = {
  title: 'Powers and Scientific Notation',
  blurb:
    'Eight topics on powers, zero and negative exponents, and scientific notation, with rules, worked examples and practice. The video is a Math 9 lesson, so each topic links to the whole video.',
  folder: 'powers',
  href: '/psat/powers',
  video: {
    url: 'https://www.youtube.com/watch?v=22WqP1Ad2Bk',
    label: 'JensenMath, “Powers and Scientific Notation | math 9” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: POWERS_PROBLEMS,
  middleProblems: POWERS_MIDDLE,
  middleLevel: {
    id: 'ms',
    label: 'Middle school (grades 7–8)',
    note: "Aligned to Florida's B.E.S.T. benchmarks MA.7.NSO.1.1, MA.8.NSO.1.3 (integer exponents), MA.8.NSO.1.4 (scientific notation) and MA.8.NSO.1.7 (order of operations). The codes were checked against the Florida Department of Education Grade 8 guide, but a teacher should check that each chapter fits its code. These follow the video's topics at middle-school level.",
  },
};

export function PsatPowersGuide() {
  return <StudyGuide guide={POWERS} />;
}

/** One Powers chapter as a sub-module: its notes and 25 problems. */
export function PsatPowersTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={POWERS} topicId={topicId} />;
}
