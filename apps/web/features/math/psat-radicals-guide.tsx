import { RADICALS_ALGEBRA1 } from './psat-radicals-algebra1';
import { RADICALS_PROBLEMS } from './psat-radicals-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  whatis: {
    file: 'whatis',
    alt: 'A root undoes a power: 7 squared is 49 so the square root of 49 is 7, and 2 cubed is 8 so the cube root of 8 is 2. The square root of a negative number is not real.',
  },
  perfect: {
    file: 'perfect',
    alt: 'A table of perfect squares from 1 to 15 squared and perfect cubes from 1 to 6 cubed.',
  },
  simplify: {
    file: 'simplify',
    alt: 'Simplifying the square root of 50: split 50 into 25 times 2, take the square root of 25 out as 5, and leave the square root of 2, giving 5 root 2.',
  },
  muldiv: {
    file: 'muldiv',
    alt: 'Multiplying and dividing radicals: the square root of a times the square root of b is the square root of a b, and the square root of a over the square root of b is the square root of a over b.',
  },
  addsub: {
    file: 'addsub',
    alt: 'Adding like radicals: 3 root 2 plus 5 root 2 is 8 root 2, like adding 3 apples and 5 apples. Unlike radicals such as 3 root 2 plus 5 root 3 cannot be combined.',
  },
  rationalize: {
    file: 'rationalize',
    alt: 'Rationalizing a denominator: 2 over root 3 times root 3 over root 3 is 2 root 3 over 3. For a binomial denominator such as 5 over 3 plus root 2, multiply by the conjugate 3 minus root 2.',
  },
  equations: {
    file: 'equations',
    alt: 'Solving a radical equation: isolate the radical, square both sides, solve, then check. The square root of x plus 3 equals 7 gives x equals 46. An equation like the square root of x plus 5 equals negative 3 has no solution.',
  },
  function: {
    file: 'function',
    alt: 'The graph of y equals the square root of x: it starts at the origin, passes through (1, 1), (4, 2) and (9, 3), and rises ever more slowly. The domain is x greater than or equal to 0.',
  },
  imaginary: {
    file: 'imaginary',
    alt: 'The powers of i repeat every four steps: i, then negative 1, then negative i, then 1, and back to i. The square root of a negative number is a multiple of i.',
  },
  uses: {
    file: 'uses',
    alt: 'Where radicals appear: the hypotenuse of a right triangle with legs 3 and 4 is the square root of 25, which is 5; the distance formula and the side of a square from its area are also square roots.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'whatis',
    title: 'What is a radical?',
    start: '0:00',
    intro:
      'A radical is a root. The square root of a number is the value that gives that number when you square it, so a root undoes a power. The small number on the radical sign is the index; a square root has index 2 and it is not written.',
    rules: [
      '√49 = 7 because 7² = 49. ∛8 = 2 because 2³ = 8.',
      'A root is a power: √x = x^(1/2), ∛x = x^(1/3), and in general the nth root of x is x^(1/n).',
      'Even index (√, ∜): the radicand cannot be negative if the answer must be real.',
      'Odd index (∛): any radicand works, and a negative radicand gives a negative root.',
      'The √ sign means the positive root only. Solving x² = 49 gives both ±7.',
    ],
    example:
      '√16 = 4, and ±√9 means both 3 and −3. ∛(−125) = −5, but √(−9) is not a real number. A fractional power such as 8^(2/3) means take the cube root, then square: 2² = 4.',
    tip: 'A radical sign alone means the positive root. The ± comes from solving an equation, not from the sign itself.',
  },
  {
    id: 'perfect',
    title: 'Perfect squares and cubes',
    start: '8:41',
    intro:
      'A perfect square is the square of a whole number; a perfect cube is the cube of one. Knowing them by heart is what makes every later skill fast.',
    rules: [
      'Squares to know: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.',
      'Cubes to know: 1, 8, 27, 64, 125, 216.',
      'A number that is both a square and a cube is a sixth power: 1, 64, 729, …',
      'To test a number, try the perfect squares in order and see whether one divides it.',
    ],
    example:
      '√64 = 8 and ∛64 = 4, because 64 = 8² = 4³. 200 is not a perfect square: 14² = 196 and 15² = 225, so it lies between them.',
    tip: 'Learn squares to 15 and cubes to 6. The next chapter uses them to pull factors out of roots.',
  },
  {
    id: 'simplify',
    title: 'Simplifying radicals',
    start: '10:21',
    intro:
      'A radical is in simplest form when no perfect-square factor (or perfect cube, for a cube root) is left under the sign. Split the radicand into a perfect power times what is left, then take the root of the perfect power.',
    rules: [
      'Find the largest perfect square that divides the radicand.',
      'Split with √(ab) = √a · √b and take the root of the perfect square.',
      'The number that comes out multiplies the radical; the leftover stays inside.',
      'For a cube root, look for perfect cubes instead: 8, 27, 64, 125.',
      'A negative under a cube root comes out as a negative number.',
    ],
    example: '√50 = √(25 · 2) = 5√2. √80 = √(16 · 5) = 4√5. ∛(−16) = ∛(−8 · 2) = −2∛2.',
    tip: 'If you are unsure which square to use, start with a small one such as 4 and keep going until nothing perfect is left.',
  },
  {
    id: 'muldiv',
    title: 'Multiplying and dividing radicals',
    start: '16:24',
    intro:
      'Radicals with the same index multiply and divide under one root. When there are numbers in front, handle the outside numbers and the radicals separately.',
    rules: [
      '√a · √b = √(ab) and √a / √b = √(a/b), for roots of the same index.',
      'Numbers in front multiply with numbers in front; radicands multiply with radicands.',
      'Simplify the result at the end.',
      'Squaring a root cancels it: (√a)² = a.',
    ],
    example:
      '√2 · √8 = √16 = 4. √20 · √3 = √60 = 2√15. 3√2 · 4√3 = 12√6. For cube roots, ∛(−2) · ∛(−4) = ∛8 = 2.',
    tip: 'Sometimes it is easier to simplify each radical first and then multiply, so the numbers stay small.',
  },
  {
    id: 'addsub',
    title: 'Adding and subtracting radicals',
    start: '21:37',
    intro:
      'Radicals add and subtract like variables: only like radicals (same index and same radicand) combine. You add the numbers in front and keep the radical. A radical that looks stuck may combine after you simplify it.',
    rules: [
      'Like radicals combine: 3√2 + 5√2 = 8√2.',
      'Unlike radicals do not: 3√2 + 5√3 stays as it is.',
      'Simplify every radical first, then look for like radicals.',
      'Products of sums use FOIL, then combine the like terms.',
      'A sum times its conjugate removes the radicals: (a + √b)(a − √b) = a² − b.',
    ],
    example:
      '√50 + √18 = 5√2 + 3√2 = 8√2. 7∛5 − 2∛5 = 5∛5. (4√3 + 5)(2 − √3) = 8√3 − 12 + 10 − 5√3 = −2 + 3√3.',
    tip: 'Treat √2 like the letter x. You would never add 3x and 5y into one term, and you cannot add √2 and √3 either.',
  },
  {
    id: 'rationalize',
    title: 'Rationalizing the denominator',
    start: '26:47',
    intro:
      'By convention a simplified answer has no radical in the denominator. To remove it, multiply the top and bottom by the same thing, which does not change the value of the fraction.',
    rules: [
      'One square root in the denominator: multiply top and bottom by that root.',
      'A sum or difference in the denominator: multiply top and bottom by the conjugate (same terms, opposite sign in the middle).',
      '(a + √b)(a − √b) = a² − b, so the radical disappears.',
      'Distribute the top, then reduce the fraction if you can.',
    ],
    example: '2/√3 = 2√3/3. 5/(3 + √2) · (3 − √2)/(3 − √2) = 5(3 − √2)/(9 − 2) = (15 − 5√2)/7.',
    tip: 'Change only the sign between the terms of the conjugate, never the sign of the radical itself.',
  },
  {
    id: 'equations',
    title: 'Solving radical equations',
    start: '30:19',
    intro:
      'To solve an equation with a square root, get the radical alone on one side, square both sides to remove it, solve the result, and then check every answer in the original equation.',
    rules: [
      'Isolate the radical before squaring.',
      'Squaring both sides can introduce extraneous roots, so always check.',
      'A square root equal to a negative number has no solution.',
      'With two radicals, put one on each side, then square.',
      'If squaring leaves another radical, isolate it and square again.',
    ],
    example:
      '√(x + 3) = 7 gives x + 3 = 49, so x = 46, and √49 = 7 checks. √(x + 1) = √(2x − 3) gives x + 1 = 2x − 3, so x = 4. √(x + 5) = −3 has no solution, because a square root is never negative.',
    tip: 'Plug each answer back in. A fake root that comes from squaring will fail the check.',
  },
  {
    id: 'function',
    title: 'The square root function',
    start: '34:51',
    intro:
      'The function f(x) = √x has a graph that starts at the origin and curves up to the right ever more slowly. It only exists for x ≥ 0, which is its domain.',
    rules: [
      'Anchor points: (0, 0), (1, 1), (4, 2), (9, 3).',
      'Domain: x ≥ 0. Range: y ≥ 0.',
      'f(x) = √(x − h) + k starts at (h, k): inside the root moves left or right, outside moves up or down.',
      'The domain of √(expression) is wherever the expression is ≥ 0.',
    ],
    example:
      'For f(x) = √(x + 3) − 2 the graph starts at (−3, −2). Its domain is x ≥ −3 and f(1) = √4 − 2 = 0.',
    tip: 'To find where a root function starts, set the inside equal to 0 and solve.',
  },
  {
    id: 'imaginary',
    title: 'Imaginary and complex numbers',
    start: '37:49',
    intro:
      'The square root of a negative number is not real, so mathematicians define i as √(−1). Then every √(−a) is a multiple of i, and a number a + bi is called complex.',
    rules: [
      'i² = −1. The powers of i repeat every four: i, −1, −i, 1.',
      'For iⁿ, divide n by 4 and use the remainder (0 means 1).',
      '√(−a) = i√a, then simplify the radical as usual.',
      'In a + bi, a is the real part and b is the imaginary part.',
      'Add like terms for + and −; FOIL for ×, replacing i² by −1.',
      '(a + bi)(a − bi) = a² + b², which is real.',
    ],
    example:
      '√(−9) = 3i and √(−8) = 2i√2. x² + 4x + 5 = 0 has solutions x = −2 ± i, because the discriminant is −4.',
    tip: 'Never leave i² in an answer. Replace it with −1 and the real and imaginary parts separate.',
  },
  {
    id: 'uses',
    title: 'Where radicals are used',
    start: '42:17',
    intro:
      'Radicals turn up wherever a quantity is squared in a formula and you need to undo it: lengths in geometry, distances, and physics formulas.',
    rules: [
      'Right triangle: c = √(a² + b²) for the hypotenuse; a = √(c² − b²) for a leg.',
      'Distance between two points: d = √((x₂ − x₁)² + (y₂ − y₁)²).',
      'The side of a square with area A is √A; its diagonal is s√2.',
      'Free fall: t = √(2h/g). Leave the answer in simplest radical form unless a decimal is requested.',
    ],
    example:
      'Legs 3 and 4 give √(9 + 16) = 5. Legs 1 and 7 give √50 = 5√2. The distance from (0, 0) to (3, 4) is also 5.',
    tip: 'When a PSAT question says “in simplest radical form”, finish by pulling out every perfect square.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'What is √81?', a: '9' },
  { q: 'What is ∛(−27)?', a: '−3' },
  { q: 'Is √(−16) a real number?', a: 'no' },
  { q: 'What is the largest perfect square that divides 72?', a: '36' },
  { q: 'Simplify √72.', a: '6√2' },
  { q: 'What is √3 · √12?', a: '6' },
  { q: 'Simplify 4√5 + 2√5.', a: '6√5' },
  { q: 'Can 2√3 + 5√2 be combined into one term?', a: 'no' },
  { q: 'Rationalize 6/√3.', a: '2√3' },
  { q: 'What do you multiply by to rationalize 1/(2 + √5)?', a: '2 − √5' },
  { q: 'Solve √x = 5.', a: 'x = 25' },
  { q: 'How many solutions does √(x + 1) = −2 have?', a: '0' },
  { q: 'What is the domain of f(x) = √(x − 4)?', a: 'x ≥ 4' },
  { q: 'What is i³?', a: '−i' },
  { q: 'What is the hypotenuse of a right triangle with legs 5 and 12?', a: '13' },
];

const REVIEW: Guide['review'] = [
  ['Root', 'undoes a power: √x = x^(1/2); even index needs radicand ≥ 0'],
  ['Perfect powers', 'squares to 15², cubes to 6³'],
  ['Simplify', 'pull out the largest perfect square (or cube); leave the rest inside'],
  ['Multiply / divide', '√a · √b = √(ab); √a / √b = √(a/b); then simplify'],
  ['Add / subtract', 'only like radicals combine; simplify first'],
  ['Rationalize', 'multiply by the root, or by the conjugate for a sum or difference'],
  ['Radical equations', 'isolate, square, solve, check for extraneous roots'],
  ['Root function', 'starts where the inside is 0; domain x ≥ 0 for √x'],
  ['Imaginary', 'i² = −1; powers repeat every 4; √(−a) = i√a'],
  ['Uses', 'hypotenuse, distance, side of a square, free fall'],
];

/** The PSAT radicals guide: ten must-know topics, summarised in our own words from a JensenMath video. */
export const RADICALS: Guide = {
  title: 'Radicals',
  blurb:
    'Ten must-know radical topics with rules, worked examples and practice. Each topic links to its part of the video.',
  folder: 'radicals',
  href: '/psat/radicals',
  video: {
    url: 'https://www.youtube.com/watch?v=Qv79a8yneLw',
    label: 'JensenMath, “RADICALS - Top 10 Must Knows (ultimate study guide)” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: RADICALS_PROBLEMS,
  middleProblems: RADICALS_ALGEBRA1,
  middleLevel: {
    id: 'a1',
    label: 'Algebra 1 (grade 9)',
    note: "Aligned to Florida's B.E.S.T. benchmarks (MA.912): NSO.1.1 and NSO.1.2 roots and radicals, AR.9.1 radical equations, F.1.2 the square-root function, NSO.1.4 complex numbers. A teacher should check those codes. These follow the video's chapters at Algebra 1 level.",
  },
};

export function PsatRadicalsGuide() {
  return <StudyGuide guide={RADICALS} />;
}

/** One Radicals chapter as a sub-module: its notes and 25 problems. */
export function PsatRadicalsTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={RADICALS} topicId={topicId} />;
}
