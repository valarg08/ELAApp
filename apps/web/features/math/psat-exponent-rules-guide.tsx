import { EXPONENT_RULES_PROBLEMS } from './psat-exponent-rules-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  whatis: {
    file: 'whatis',
    alt: 'An exponent counts equal factors: the base 3 with the exponent 4 means four threes multiplied, 3 times 3 times 3 times 3, which is 81.',
  },
  product: {
    file: 'product',
    alt: 'Product of powers: three threes times four threes is seven threes, so 3 to the 3 times 3 to the 4 equals 3 to the 7. Same base: keep it and add the exponents.',
  },
  quotient: {
    file: 'quotient',
    alt: 'Quotient of powers: five threes on top and two threes on the bottom. Two pairs cancel and three threes are left, so 3 to the 5 over 3 squared is 3 cubed. Same base: keep it and subtract the exponents.',
  },
  powerpower: {
    file: 'powerpower',
    alt: 'Power of a power: 3 squared, raised to the third power, is three groups of two threes. That is six threes, so the exponents multiply: 3 to the 6.',
  },
  powerproduct: {
    file: 'powerproduct',
    alt: 'Power of a product: 3 times x, cubed, is 3x times 3x times 3x. Regroup the numbers and the letters: three threes and three x, which is 3 cubed times x cubed, or 27 x cubed.',
  },
  powerquotient: {
    file: 'powerquotient',
    alt: 'Power of a quotient: two thirds, squared, is two thirds times two thirds. Multiply the tops and multiply the bottoms to get 2 squared over 3 squared, which is four ninths.',
  },
  one: {
    file: 'one',
    alt: 'The one exponent: any number to the first power is itself, so 5 to the 1 is 5. A letter with no written exponent has exponent 1, so y cubed times y is y cubed times y to the 1, which is y to the 4.',
  },
  zero: {
    file: 'zero',
    alt: 'The zero exponent: powers of 3 go 27, 9, 3 as the exponent drops from 3 to 1, each step divided by 3. The next step divides 3 by 3 to get 1, so 3 to the 0 is 1.',
  },
  negative: {
    file: 'negative',
    alt: 'The negative exponent: continuing the pattern past 3 to the 0, each step divides by 3 again, so 3 to the negative 1 is one third and 3 to the negative 2 is one ninth. A negative exponent means take the reciprocal.',
  },
  final: {
    file: 'final',
    alt: 'The exponent rules on one page: product, quotient, power of a power, power of a product, power of a quotient, one, zero and negative exponent rules.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'whatis',
    title: 'What is an exponent?',
    start: '0:00',
    intro:
      'An exponent is a short way to write repeated multiplication. In aᵐ the base a is the number being multiplied and the exponent m says how many factors of a there are. Every rule that follows comes from this one idea.',
    rules: [
      'aᵐ means a multiplied by itself, with m factors of a.',
      'The base tells you what is multiplied. The exponent tells you how many times it appears as a factor.',
      'A power is just a short name for the product: 3⁴ = 3 · 3 · 3 · 3 = 81.',
      'Parentheses matter: (−3)⁴ = 81, but −3⁴ = −81, because without parentheses the exponent belongs only to the 3.',
    ],
    example:
      '5³ = 5 · 5 · 5 = 125. And y⁶ is six factors of y, so you never have to write y · y · y · y · y · y.',
    tip: 'The exponent counts the factors. It does not multiply the base: 4³ is 4 · 4 · 4 = 64, not 4 · 3 = 12.',
  },
  {
    id: 'product',
    title: 'Product of powers',
    start: '1:14',
    intro:
      'When you multiply powers with the same base, keep the base and add the exponents. It works because the first power supplies some factors, the second supplies more, and you simply count all of them.',
    rules: [
      'aᵐ · aⁿ = aᵐ⁺ⁿ.',
      'The bases must be the same. 2³ · 3⁴ cannot be combined this way.',
      'It works for any number of powers: aᵐ · aⁿ · aᵖ = aᵐ⁺ⁿ⁺ᵖ.',
      'With numbers in front, multiply the numbers and add the exponents: 3x² · 4x⁵ = 12x⁷.',
    ],
    example:
      '3³ · 3⁴ is three factors of 3 and then four more, seven in all, so 3⁷. With letters, y⁵ · y² · y⁶ = y¹³.',
    tip: 'Add the exponents, never multiply them. And do not multiply the bases: 3² · 3⁴ is 3⁶, not 9⁶.',
  },
  {
    id: 'quotient',
    title: 'Quotient of powers',
    start: '2:59',
    intro:
      'When you divide powers with the same base, keep the base and subtract the exponents. Top and bottom share some factors, those cancel in pairs, and what is left is the difference.',
    rules: [
      'aᵐ ÷ aⁿ = aᵐ⁻ⁿ (a is not 0).',
      'Subtract the bottom exponent from the top exponent, in that order.',
      'With numbers in front, divide the numbers and subtract the exponents: 12x⁸ ÷ 3x² = 4x⁶.',
      'If the bottom exponent is larger, the result has a negative exponent: x³ ÷ x⁸ = x⁻⁵.',
    ],
    example:
      '3⁵ ÷ 3² cancels two pairs of threes and leaves three of them, so 3³ = 27. With letters, y¹² ÷ y⁵ = y⁷.',
    tip: 'Order matters: m − n, not n − m. Check which exponent is on top.',
  },
  {
    id: 'powerpower',
    title: 'Power of a power',
    start: '4:24',
    intro:
      'When a power is raised to another power, keep the base and multiply the exponents. The outer exponent says how many groups there are, and each group already has the inner number of factors.',
    rules: [
      '(aᵐ)ⁿ = aᵐⁿ.',
      'Multiply the exponents. Do not add them.',
      'It works for several layers: ((aᵐ)ⁿ)ᵖ = aᵐⁿᵖ.',
      'Combine it with the other rules after you have multiplied: (x³)⁴ · x² = x¹² · x² = x¹⁴.',
    ],
    example:
      '(3²)³ is three groups of two threes, six in all, so 3⁶ = 729. With letters, (y⁶)² = y¹².',
    tip: 'Tell the two rules apart by the shape: a product (x³ · x⁴) adds, a power of a power ((x³)⁴) multiplies.',
  },
  {
    id: 'powerproduct',
    title: 'Power of a product',
    start: '5:56',
    intro:
      'When a product is raised to a power, every factor inside gets the exponent. The order of multiplication does not matter, so you can regroup the numbers together and the letters together.',
    rules: [
      '(ab)ⁿ = aⁿ · bⁿ, and it works for any number of factors: (abc)ⁿ = aⁿbⁿcⁿ.',
      'Raise the number in front too: (2x)³ = 2³ · x³ = 8x³.',
      'If a factor already has an exponent, multiply it by the outer one: (2x³)² = 2² · x⁶ = 4x⁶.',
      'A negative coefficient follows its own sign rules: (−2x)³ = −8x³ but (−2x)⁴ = 16x⁴.',
    ],
    example: '(5y)² = 5² · y² = 25y². And (2xy²)³ = 2³ · x³ · (y²)³ = 8x³y⁶.',
    tip: 'The number in front is a factor like any other. (3x)² is 9x², not 3x².',
  },
  {
    id: 'powerquotient',
    title: 'Power of a quotient',
    start: '7:34',
    intro:
      'When a fraction is raised to a power, the numerator and the denominator both get the exponent. Multiplying the fraction by itself multiplies the tops together and the bottoms together.',
    rules: [
      '(a/b)ⁿ = aⁿ/bⁿ (b is not 0).',
      'Raise numbers and letters alike: (3/4)² = 9/16 and (x/y)⁵ = x⁵/y⁵.',
      'A coefficient inside is raised too: (2x/3y)³ = 8x³/27y³.',
      'Simplify inside the brackets first if you can, then apply the exponent.',
    ],
    example: '(2/3)² = 2²/3² = 4/9. With letters, (a/b)⁶ = a⁶/b⁶.',
    tip: 'The bottom gets the exponent too. (1/2)³ is 1/8; it is not 1/2, because the 3 applies to the 2 as well.',
  },
  {
    id: 'one',
    title: 'The one exponent',
    start: '9:03',
    intro:
      'Any number to the first power is just that number. When a letter or number shows no exponent, the exponent is 1, and that hidden 1 is what you add when you simplify.',
    rules: [
      'a¹ = a.',
      'A base with no exponent written has exponent 1: x = x¹.',
      'Use it when simplifying: y³ · y = y³ · y¹ = y⁴.',
      'The same goes for dividing: x⁵ ÷ x = x⁴.',
    ],
    example:
      '8¹ = 8 and x¹ = x. In x · x · x, each x is x¹, so the exponents add to 3 and the result is x³.',
    tip: 'A lone letter is not "exponent zero". It is exponent 1.',
  },
  {
    id: 'zero',
    title: 'The zero exponent',
    start: '10:02',
    intro:
      'Any base that is not zero, raised to the power 0, equals 1. You can see why by continuing a pattern of powers downward, or by dividing a number by itself with the quotient rule.',
    rules: [
      'a⁰ = 1 when a is not 0.',
      'Pattern: 3³ = 27, 3² = 9, 3¹ = 3. Each step down divides by 3, so 3⁰ = 3 ÷ 3 = 1.',
      'Quotient rule: 3³ ÷ 3³ = 3⁰, and 27 ÷ 27 = 1.',
      '0⁰ is not defined, because the base must not be zero.',
      'The exponent goes with its own base: 5x⁰ = 5, but (5x)⁰ = 1.',
    ],
    example: '7⁰ = 1, (−4)⁰ = 1, x⁰ = 1. But −4⁰ = −1, because the exponent belongs only to the 4.',
    tip: 'Anything to the 0 is 1, not 0. Check which part the zero exponent is attached to.',
  },
  {
    id: 'negative',
    title: 'Negative exponents',
    start: '11:25',
    intro:
      'A negative exponent means take the reciprocal and make the exponent positive. It is the same pattern as before, carried past zero: each step down divides by the base again.',
    rules: [
      'a⁻ⁿ = 1/aⁿ, for example 5⁻² = 1/5² = 1/25.',
      'If the negative exponent is in the denominator, it moves up: 1/a⁻ⁿ = aⁿ.',
      'A fraction with a negative exponent flips: (a/b)⁻ⁿ = (b/a)ⁿ. Then use the power of a quotient rule.',
      'Only the base the exponent is attached to moves: 3x⁻² = 3/x².',
      'A negative exponent does not make the number negative: 2⁻³ is 1/8, not −8.',
    ],
    example: '3⁻² = 1/3² = 1/9. 1/4⁻² = 4² = 16. (2/3)⁻³ = (3/2)³ = 27/8.',
    tip: 'Negative exponent = flip, not minus. Keep the sign of the number as it was.',
  },
  {
    id: 'final',
    title: 'Final test: all the rules together',
    intro:
      'Fifty problems that mix every rule in this guide. Most need two or three rules in a row, and the last ones need all of them. Take your time: simplify the inside of brackets first, then apply the outside exponent, then combine like bases.',
    rules: [
      'Product of powers: add the exponents. Quotient of powers: subtract them.',
      'Power of a power: multiply the exponents.',
      'Power of a product or a quotient: give every factor (or the top and the bottom) the exponent.',
      'One exponent: a¹ = a. Zero exponent: a⁰ = 1. Negative exponent: flip it to the other side.',
      'Work from the inside out, and keep a running list of each letter’s exponent.',
    ],
    example: '(2x³)² · x⁻⁴ ÷ x: first (2x³)² = 4x⁶, then 4x⁶ · x⁻⁴ = 4x², then 4x² ÷ x = 4x¹ = 4x.',
    tip: 'When the answer asks for an exponent, finish simplifying to a single power of each letter first. Then read the exponent off.',
  },
];

const REVIEW: Guide['review'] = [
  ['Exponent', 'aᵐ = m factors of a (the base a, the exponent m)'],
  ['Product of powers', 'aᵐ · aⁿ = aᵐ⁺ⁿ (same base: add)'],
  ['Quotient of powers', 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ (same base: subtract)'],
  ['Power of a power', '(aᵐ)ⁿ = aᵐⁿ (multiply)'],
  ['Power of a product', '(ab)ⁿ = aⁿbⁿ (every factor gets the exponent)'],
  ['Power of a quotient', '(a/b)ⁿ = aⁿ/bⁿ (top and bottom both get it)'],
  ['One exponent', 'a¹ = a; a letter with no exponent is a¹'],
  ['Zero exponent', 'a⁰ = 1 for a ≠ 0; 0⁰ is not defined'],
  ['Negative exponent', 'a⁻ⁿ = 1/aⁿ; 1/a⁻ⁿ = aⁿ; (a/b)⁻ⁿ = (b/a)ⁿ'],
];

const PRACTICE: Guide['practice'] = [
  { q: 'Simplify 3⁴ · 3⁵.', a: '3⁹ = 19683' },
  { q: 'Simplify x¹² ÷ x⁵.', a: 'x⁷' },
  { q: 'Simplify (y³)⁶.', a: 'y¹⁸' },
  { q: 'Simplify (4x²)³.', a: '64x⁶' },
  { q: 'Simplify (3/5)².', a: '9/25' },
  { q: 'What is 9⁰ + 9¹?', a: '1 + 9 = 10' },
  { q: 'Write 4⁻² without a negative exponent and evaluate it.', a: '1/4² = 1/16' },
  { q: 'Simplify (2x⁻¹)³ · x⁵ with no negative exponents.', a: '8x⁻³ · x⁵ = 8x²' },
];

/** The PSAT exponent rules guide: nine rules and a final test, summarised in our own words from a GoTutor Math video. */
export const EXPONENT_RULES: Guide = {
  title: 'Exponent Rules',
  blurb:
    'The rules of exponents, one at a time: product, quotient, power of a power, power of a product, power of a quotient, and the one, zero and negative exponents. Each has a diagram, notes and 50 problems from easy to hard, and a final test mixes them all.',
  folder: 'exponent-rules',
  href: '/psat/exponent-rules',
  video: {
    url: 'https://www.youtube.com/watch?v=ZK78cOKDKWE',
    label: 'GoTutor Math, “Master Exponent Rules in One Lesson” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: EXPONENT_RULES_PROBLEMS,
};

export function PsatExponentRulesGuide() {
  return <StudyGuide guide={EXPONENT_RULES} />;
}

/** One Exponent Rules chapter as a sub-module: its notes and 50 problems. */
export function PsatExponentRulesTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={EXPONENT_RULES} topicId={topicId} />;
}
