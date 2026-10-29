import { NUMBER_SENSE_PROBLEMS } from './psat-number-sense-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  integers: {
    file: 'integers',
    alt: 'A number line from −6 to 6: −2 − (−5) becomes −2 + 5, a jump of 5 to the right landing on 3; 3 + (−7) becomes 3 − 7, a jump of 7 to the left landing on −4. A sign table: same signs give a positive product, opposite signs a negative one.',
  },
  'absolute-value': {
    file: 'absolute-value',
    alt: 'A number line with brackets from 0 to −4 and from 0 to 4, both 4 units long: |−4| = |4| = 4.',
  },
  fractions: {
    file: 'fractions',
    alt: 'Fraction bars: 1/3 + 1/2 rewritten as 2/6 + 3/6 = 5/6, and 3/4 ÷ 2/5 changed by keep-change-flip to 3/4 × 5/2 = 15/8.',
  },
  percent: {
    file: 'percent',
    alt: 'A 10 by 10 grid with 35 squares shaded: 35% = 35/100 = 0.35, with arrows moving the decimal point two places.',
  },
  ratios: {
    file: 'ratios',
    alt: 'A double number line matching 3 cups of flour to 2 eggs, 6 to 4 and 9 to 6, solving 3/2 = 9/x with a scale factor of 3.',
  },
  powers: {
    file: 'powers',
    alt: 'Base and exponent labelled on 5³ = 5 × 5 × 5; (−2)⁴ = 16 compared with −2⁴ = −16; the product, quotient and power-of-a-power rules.',
  },
  'scientific-notation': {
    file: 'scientific-notation',
    alt: '3.2 × 10⁵ = 320,000 with the decimal point hopping 5 places right, and 0.00061 = 6.1 × 10⁻⁴ with it hopping 4 places.',
  },
  rounding: {
    file: 'rounding',
    alt: 'Place values of 572,938.164 from hundred thousands to thousandths, and 4.6283 rounded to the nearest hundredth: the next digit 8 is 5 or more, so it rounds up to 4.63.',
  },
  factors: {
    file: 'factors',
    alt: 'A factor tree for 84: 84 = 4 × 21 = 2 × 2 × 3 × 7 = 2² × 3 × 7, and the multiples of 6 and 8 meeting first at 24, their least common multiple.',
  },
  'order-of-operations': {
    file: 'order-of-operations',
    alt: 'PEMDAS as steps, with × and ÷ sharing a step and + and − sharing a step, and 18 − 2 × (1 + 3)² ÷ 4 worked one step at a time to 10.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'integers',
    title: 'Integers',
    start: '0:00',
    intro:
      'The integers (written ℤ) are the whole numbers, their negatives and zero: …, −3, −2, −1, 0, 1, 2, 3, … They go on forever in both directions on a number line.',
    rules: [
      'Combine two signs side by side first: + + and − − become +; + − and − + become −.',
      'Then use a number line: start at the first number, move right to add and left to subtract.',
      'Multiplying or dividing: same signs give a positive answer, opposite signs a negative one.',
    ],
    example: '−2 − (−5) = −2 + 5 = 3; 3 + (−7) = 3 − 7 = −4; (−6)(4) = −24; (−36) ÷ (−9) = 4.',
    tip: 'Count the negative signs in a product: an even number gives a positive answer, an odd number a negative one.',
  },
  {
    id: 'absolute-value',
    title: 'Absolute value',
    start: '5:03',
    intro:
      'The absolute value |a| is the distance from a to 0 on the number line. A distance is never negative, so |a| ≥ 0, and a number and its opposite have the same absolute value.',
    rules: ['|−4| = 4 and |4| = 4, so |−a| = |a|.', '|a − b| is the distance between a and b.'],
    example: '|−9| + |2| = 9 + 2 = 11, and |3 − 10| = |−7| = 7.',
    tip: 'Work out what is inside the bars before taking the absolute value: |5 − 8| is 3, not 13.',
  },
  {
    id: 'fractions',
    title: 'Fractions',
    start: '7:33',
    intro:
      'A fraction a/b has a numerator a (the parts you have) over a denominator b (the equal parts in a whole). The fraction bar means division: 3/4 = 3 ÷ 4 = 0.75.',
    tables: [
      {
        caption: 'Operations with fractions',
        table: {
          head: ['Operation', 'Rule', 'Example'],
          rows: [
            ['Multiply', 'tops × tops, bottoms × bottoms', '2/3 × 4/5 = 8/15'],
            ['Divide', 'keep, change ÷ to ×, flip the second', '3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8'],
            [
              'Add or subtract',
              'common denominator first, then add the tops',
              '1/3 + 1/2 = 2/6 + 3/6 = 5/6',
            ],
          ],
        },
      },
    ],
    tip: 'Always simplify the answer: divide top and bottom by their greatest common factor (6/9 = 2/3).',
  },
  {
    id: 'percent',
    title: 'Percent',
    start: '13:48',
    intro:
      'Percent means “per hundred”: 35% is 35 out of 100, or 35/100. To find a percent of a number, change the percent to a decimal and multiply.',
    rules: [
      'Percent → decimal: move the decimal point 2 places left (35% = 0.35, 4% = 0.04).',
      'Decimal → percent: move it 2 places right (0.6 = 60%, 1.25 = 125%).',
      'p% of n = (p ÷ 100) × n.',
    ],
    example: '15% of 80 = 0.15 × 80 = 12.',
    tip: 'A single-digit percent needs a zero: 7% is 0.07, not 0.7.',
  },
  {
    id: 'ratios',
    title: 'Ratios, rates and proportions',
    start: '17:24',
    intro:
      'A ratio compares two amounts, written a:b or a/b. A rate is a ratio of different units (miles per hour), and a unit rate is a rate per 1 unit. A proportion says two ratios are equal.',
    rules: [
      'Unit rate: divide. $12 for 4 notebooks → $3 per notebook.',
      'Solve a proportion with a scale factor or by cross-multiplying: a/b = c/d → ad = bc.',
    ],
    example:
      'A recipe uses 3 cups of flour for 2 eggs. With 6 eggs: 3/2 = x/6, the scale factor is 3, so x = 9 cups (cross-multiplying: 2x = 18).',
    tip: 'Keep the units in the same order on both sides: flour over eggs = flour over eggs.',
  },
  {
    id: 'powers',
    title: 'Powers',
    start: '20:40',
    intro:
      'A power aⁿ has a base a and an exponent n: the exponent says how many factors of the base to multiply. 5³ = 5 × 5 × 5 = 125.',
    rules: [
      'Brackets decide the base: (−2)⁴ = 16 but −2⁴ = −(2⁴) = −16.',
      'Product rule: aᵐ × aⁿ = aᵐ⁺ⁿ.',
      'Quotient rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ.',
      'Power of a power: (aᵐ)ⁿ = aᵐⁿ.',
    ],
    example: '3² × 3³ = 3⁵ = 243; 7⁶ ÷ 7⁴ = 7² = 49; (5²)³ = 5⁶ = 15,625.',
    tip: 'The rules only work when the bases are the same: 2³ × 3² cannot be combined into one power.',
  },
  {
    id: 'scientific-notation',
    title: 'Scientific notation',
    start: '24:42',
    intro:
      'Scientific notation writes a number as a × 10ⁿ, where the coefficient a has exactly one non-zero digit before the decimal point (1 ≤ |a| < 10).',
    rules: [
      'To standard form: if n > 0, move the decimal point n places right; if n < 0, move it n places left. Fill the gaps with zeros.',
      'To scientific notation: write the non-zero digits with the point after the first one, then count how far the point moved. Moved left → positive n; moved right → negative n.',
    ],
    example: '3.2 × 10⁵ = 320,000; 0.00061 = 6.1 × 10⁻⁴; 72,500,000 = 7.25 × 10⁷.',
    tip: 'Big numbers have positive exponents; numbers between 0 and 1 have negative exponents.',
  },
  {
    id: 'rounding',
    title: 'Rounding',
    start: '29:44',
    intro:
      'Rounding approximates a number to a given place value, so you need the place names: thousands, hundreds, tens, ones, then tenths, hundredths, thousandths after the decimal point.',
    rules: [
      'Find the place you are rounding to and look at the digit just to its right.',
      '0–4: round down, keep the digit and change the digits after it to zeros.',
      '5–9: round up, add 1 to the digit and change the digits after it to zeros.',
      'Drop trailing zeros after the decimal point (8.30 → 8.3).',
    ],
    example:
      '6,481 to the nearest hundred → 6,500; 2.749 to the nearest tenth → 2.7; 4.6283 to the nearest hundredth → 4.63.',
    tip: 'Round in one step from the original number; rounding twice (2.749 → 2.75 → 2.8) can give the wrong answer.',
  },
  {
    id: 'factors',
    title: 'Factors and multiples',
    start: '34:18',
    intro:
      'A factor divides a number with no remainder (the factors of 18 are 1, 2, 3, 6, 9, 18). A prime has exactly two factors, 1 and itself. Every integer above 1 is a unique product of primes (the fundamental theorem of arithmetic).',
    rules: [
      'Prime factorisation: split with a factor tree until every branch ends in a prime. 84 = 2² × 3 × 7.',
      'Simplify fractions by cancelling shared primes: 30/84 = (2 × 3 × 5)/(2² × 3 × 7) = 5/14.',
      'A multiple is the number times an integer (6, 12, 18, …). The least common multiple (LCM) is the smallest positive multiple two numbers share.',
    ],
    example: 'The LCM of 6 and 8 is 24, so 1/6 + 3/8 = 4/24 + 9/24 = 13/24.',
    tip: '1 is not prime: it has only one factor.',
  },
  {
    id: 'order-of-operations',
    title: 'Order of operations',
    start: '39:29',
    intro:
      'PEMDAS gives the order: Parentheses, Exponents, Multiplication and Division, Addition and Subtraction.',
    rules: [
      'Multiplication and division are one step: do them left to right as they appear.',
      'Addition and subtraction are one step: left to right as well.',
      'With brackets inside brackets, start with the innermost.',
    ],
    example:
      '18 − 2 × (1 + 3)² ÷ 4 = 18 − 2 × 4² ÷ 4 = 18 − 2 × 16 ÷ 4 = 18 − 32 ÷ 4 = 18 − 8 = 10.',
    tip: '12 ÷ 3 × 2 is 8, not 2: division comes first here because it is on the left.',
  },
];

const REVIEW: Guide['review'] = [
  [
    'Integers',
    'Combine adjacent signs (same → +, opposite → −); add = move right, subtract = move left; × or ÷: same signs → +, opposite → −',
  ],
  [
    'Absolute value',
    '|a| = distance from 0, never negative; |−a| = |a|; |a − b| = distance between a and b',
  ],
  [
    'Fractions',
    'a/b × c/d = ac/bd; a/b ÷ c/d = a/b × d/c; add with a common denominator; simplify',
  ],
  ['Percent', 'p% = p/100; percent → decimal: point 2 left; p% of n = (p ÷ 100) × n'],
  ['Ratios', 'Unit rate = amount ÷ units; a/b = c/d → ad = bc'],
  ['Powers', 'aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; (−a)ⁿ ≠ −aⁿ for even n'],
  ['Scientific notation', 'a × 10ⁿ with 1 ≤ |a| < 10; n > 0 → point moves right, n < 0 → left'],
  ['Rounding', 'Look one digit right: 0–4 round down, 5–9 round up'],
  ['Factors', 'Prime factorisation is unique; LCM = smallest shared positive multiple'],
  ['Order of operations', 'P, E, then × ÷ left to right, then + − left to right'],
];

const PRACTICE: Guide['practice'] = [
  { q: 'Evaluate −8 − (−3).', a: '−8 + 3 = −5' },
  { q: 'Evaluate 5 + (−11).', a: '5 − 11 = −6' },
  { q: 'Evaluate (−4)(−9) ÷ (−6).', a: '36 ÷ (−6) = −6' },
  { q: 'Evaluate |−12| − |7 − 10|.', a: '12 − 3 = 9' },
  { q: 'Evaluate 5/6 × 3/10 and simplify.', a: '15/60 = 1/4' },
  { q: 'Evaluate 2/3 ÷ 4/9.', a: '2/3 × 9/4 = 18/12 = 3/2' },
  { q: 'Evaluate 3/4 − 1/6.', a: '9/12 − 2/12 = 7/12' },
  {
    q: 'Write 8% and 0.375 the other way (as a decimal and as a percent).',
    a: '8% = 0.08; 0.375 = 37.5%',
  },
  { q: 'What is 30% of 150?', a: '0.3 × 150 = 45' },
  {
    q: 'A car travels 210 miles in 3.5 hours. What is its unit rate?',
    a: '210 ÷ 3.5 = 60 miles per hour',
  },
  { q: 'Solve 4/7 = x/21.', a: 'Scale factor 3, so x = 12' },
  { q: 'Evaluate −3⁴ and (−3)⁴.', a: '−81 and 81' },
  { q: 'Write 2⁷ × 2³ ÷ 2⁶ as a single power and evaluate it.', a: '2⁴ = 16' },
  { q: 'Write 0.0000308 in scientific notation.', a: '3.08 × 10⁻⁵' },
  { q: 'Write 9.04 × 10⁶ in standard form.', a: '9,040,000' },
  {
    q: 'Round 3.9461 to the nearest hundredth, and 47,520 to the nearest thousand.',
    a: '3.95 and 48,000',
  },
  {
    q: 'Find the prime factorisation of 90 and the LCM of 9 and 12.',
    a: '90 = 2 × 3² × 5; LCM = 36',
  },
  { q: 'Evaluate 24 ÷ 4 × 3 − (5 − 2)².', a: '6 × 3 − 9 = 18 − 9 = 9' },
];

export const NUMBER_SENSE: Guide = {
  title: 'Number Sense',
  blurb:
    'The ten number skills every PSAT topic leans on, from integers to the order of operations, in our own words, with a diagram, a review sheet and practice questions.',
  folder: 'number-sense',
  href: '/psat/number-sense',
  video: {
    url: 'https://www.youtube.com/watch?v=JnAYdGXgwjo',
    label: 'JensenMath, “Number Sense - Top 10 Must Knows” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: NUMBER_SENSE_PROBLEMS,
};

/** The number sense study guide in the PSAT Math track (psat-design.md). */
export function PsatNumberSenseGuide() {
  return <StudyGuide guide={NUMBER_SENSE} />;
}

/** One Number Sense chapter as a sub-module: its notes and 25 problems. */
export function PsatNumberSenseTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={NUMBER_SENSE} topicId={topicId} />;
}
