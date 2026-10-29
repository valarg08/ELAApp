import { type Guide, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  expressions: {
    file: 'expressions',
    alt: 'Like terms sorted into groups and collected to −2x² + 2x + 5, and the distributive property 2(x + 5) = 2x + 10.',
  },
  equations: {
    file: 'equations',
    alt: 'A balance with 3x − 4 on one side and 11 on the other; adding 4 then dividing by 3 on both sides gives x = 5.',
  },
  inequalities: {
    file: 'inequalities',
    alt: 'Number lines: x > 3 with an open circle at 3, and x ≥ −3 with a closed circle at −3, both with arrows to the right.',
  },
  functions: {
    file: 'functions',
    alt: 'The parabola f(x) = x² − 1 from a table of values, with a vertical line crossing it only once.',
  },
  linear: {
    file: 'linear',
    alt: 'The line y = (2/3)x − 1 from the y-intercept (0, −1), rising 2 and running 3 to (3, 1).',
  },
  systems: {
    file: 'systems',
    alt: 'The lines y = −x + 6 and y = 2x − 3 crossing at (3, 3), the solution of the system.',
  },
  exponents: {
    file: 'exponents',
    alt: 'Tiles showing 3² × 3³ = 3⁵, 5⁶ ÷ 5⁴ = 5² and (2²)³ = 2⁶.',
  },
  multiplying: {
    file: 'multiplying',
    alt: 'An area model for (x + 2)(x + 6) with boxes x², 6x, 2x and 12, giving x² + 8x + 12.',
  },
  factoring: {
    file: 'factoring',
    alt: 'A sum-product diamond for x² + x − 12 giving (x + 4)(x − 3), and an area model splitting 3x² + 10x + 8 into (3x + 4)(x + 2).',
  },
  quadratics: {
    file: 'quadratics',
    alt: 'The parabola y = x² − 4x + 3 with vertex (2, −1), roots at x = 1 and x = 3, and the axis of symmetry x = 2.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'expressions',
    title: 'Simplifying expressions',
    start: '0:15',
    intro:
      'A term is a number, a variable or a product of them (7, x, 4x²). Like terms have exactly the same variables with the same exponents: 3x² and −6x² are like terms; 3x and 3y are not.',
    rules: [
      'Collect like terms: add their coefficients and keep the variable part.',
      'Each term keeps the sign in front of it.',
      'Distribute: a(x + y) = ax + ay; the number outside multiplies every term inside.',
    ],
    example:
      '4x² + 3x − 6x² + 5 − x = −2x² + 2x + 5, and 2(x + 5) − 3(x − 1) = 2x + 10 − 3x + 3 = −x + 13.',
    tip: 'A minus sign in front of brackets changes every sign inside: −3(x − 1) = −3x + 3.',
  },
  {
    id: 'equations',
    title: 'Solving linear equations',
    start: '6:33',
    intro:
      'Solving means finding the value that makes both sides equal. Keep the equation balanced: do the same thing to both sides, undoing + and − first, then × and ÷.',
    rules: [
      '3x − 4 = 11 → add 4: 3x = 15 → divide by 3: x = 5.',
      '5x + 3 = 2x − 9 → x-terms left, numbers right: 3x = −12 → x = −4.',
    ],
    tip: 'Moving a whole term to the other side changes its sign. Check by substituting: 3(5) − 4 = 11.',
  },
  {
    id: 'inequalities',
    title: 'Inequalities',
    start: '12:13',
    intro:
      'An inequality (<, >, ≤, ≥) has a range of answers. Solve it like an equation, but multiplying or dividing by a negative flips the sign.',
    tables: [
      {
        caption: 'Worked examples',
        table: {
          head: ['Inequality', 'Answer', 'Number line', 'Interval'],
          rows: [
            ['3x − 2 > 7', 'x > 3', 'open circle at 3, arrow right', '(3, ∞)'],
            [
              '−2x + 5 ≤ 11',
              'x ≥ −3 (÷ by −2 flips)',
              'closed circle at −3, arrow right',
              '[−3, ∞)',
            ],
          ],
        },
      },
    ],
    tip: 'Round brackets and open circles leave the end out; square brackets and closed circles include it. Infinity always gets a round bracket.',
  },
  {
    id: 'functions',
    title: 'Functions and function notation',
    start: '17:29',
    intro:
      'A function gives exactly one output for each input. f(x) is the output for input x, not f times x.',
    tables: [
      {
        caption: 'f(x) = x² − 1',
        table: {
          head: ['x', '−2', '−1', '0', '1', '2'],
          rows: [['f(x)', '3', '0', '−1', '0', '3']],
        },
      },
    ],
    example: 'f(2) = 2² − 1 = 3: input 2, output 3, the point (2, 3). The points make a parabola.',
    tip: 'Vertical line test: if a vertical line can cross the graph twice, it is not a function.',
  },
  {
    id: 'linear',
    title: 'Graphing linear functions',
    start: '20:49',
    intro:
      'In y = mx + b, m is the slope (rise ÷ run, the rate of change) and b is the y-intercept, where the line crosses the y-axis.',
    rules: [
      'y = (2/3)x − 1: plot (0, −1).',
      'Slope 2/3: up 2, right 3, to (3, 1). Or down 2, left 3, to (−3, −3).',
      'Draw the line through the points.',
    ],
    tip: 'A negative slope goes down to the right; a bigger slope is steeper.',
  },
  {
    id: 'systems',
    title: 'Systems of equations',
    start: '23:32',
    intro:
      'Solve x + y = 6 and 2x − y = 3: find the x and y that make both true. All three methods give x = 3, y = 3.',
    tables: [
      {
        caption: 'Three methods',
        table: {
          head: ['Method', 'How', 'Here'],
          rows: [
            ['Graphing', 'where the lines cross', 'y = −x + 6 and y = 2x − 3 meet at (3, 3)'],
            [
              'Substitution',
              'isolate a variable, substitute',
              'y = 6 − x → 2x − (6 − x) = 3 → x = 3',
            ],
            ['Elimination', 'add or subtract to cancel a variable', 'add: 3x = 9 → x = 3, y = 3'],
          ],
        },
      },
    ],
    tip: 'Check the answer in both equations: 3 + 3 = 6 and 6 − 3 = 3.',
  },
  {
    id: 'exponents',
    title: 'Exponent rules',
    start: '30:19',
    intro: 'A power is repeated multiplication: 3⁴ = 3 × 3 × 3 × 3 (base 3, exponent 4).',
    tables: [
      {
        caption: 'Rules (same base)',
        table: {
          head: ['Rule', 'Symbols', 'Example'],
          rows: [
            ['Product', 'aᵐ · aⁿ = aᵐ⁺ⁿ', '3² · 3³ = 3⁵ = 243'],
            ['Quotient', 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ', '5⁶ ÷ 5⁴ = 5² = 25'],
            ['Power of a power', '(aᵐ)ⁿ = aᵐⁿ', '(2²)³ = 2⁶ = 64'],
          ],
        },
      },
    ],
    tip: 'Brackets decide the base: (−4)² = 16 but −4² = −16.',
  },
  {
    id: 'multiplying',
    title: 'Multiplying polynomials',
    start: '33:42',
    intro:
      'Multiply every term in the first bracket by every term in the second, then collect like terms. For two binomials, FOIL (First, Outside, Inside, Last) lists the four products.',
    rules: [
      '(x + 2)(x + 6) = x² + 6x + 2x + 12 = x² + 8x + 12.',
      '(x² − 3x + 2)(2x + 1) = 2x³ + x² − 6x² − 3x + 4x + 2 = 2x³ − 5x² + x + 2.',
    ],
    tip: 'Count the products first: 3 terms × 2 terms = 6 products.',
  },
  {
    id: 'factoring',
    title: 'Factoring',
    start: '37:42',
    intro: 'Factoring reverses expanding: write the expression as a product.',
    tables: [
      {
        caption: 'Three methods',
        table: {
          head: ['Type', 'Method', 'Example'],
          rows: [
            ['Common factor', 'take out the GCF', '4x³y² + 10xy⁴ = 2xy²(2x² + 5y²)'],
            ['x² + bx + c', 'two numbers: sum b, product c', 'x² + x − 12 = (x + 4)(x − 3)'],
            [
              'ax² + bx + c',
              'sum b, product ac; split and group',
              '3x² + 10x + 8 = (3x + 4)(x + 2)',
            ],
          ],
        },
      },
    ],
    example:
      '3x² + 10x + 8: ac = 24, and 6 + 4 = 10, so 3x² + 6x + 4x + 8 = 3x(x + 2) + 4(x + 2) = (3x + 4)(x + 2).',
    tip: 'Expand your answer to check it.',
  },
  {
    id: 'quadratics',
    title: 'Quadratic functions and equations',
    start: '46:10',
    intro:
      'y = ax² + bx + c makes a parabola: it opens up (vertex is the minimum) when a > 0 and down when a < 0.',
    rules: [
      'Vertex: x = −b ÷ 2a, then substitute to find y.',
      'Roots (x-intercepts): set y = 0 and factor, then use the zero product rule.',
      'Or use the quadratic formula: x = (−b ± √(b² − 4ac)) ÷ 2a.',
    ],
    example:
      'y = x² − 4x + 3: vertex x = 4 ÷ 2 = 2, y = −1, so (2, −1). (x − 1)(x − 3) = 0 gives x = 1 or 3.',
    tip: 'The vertex sits halfway between the roots.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'Simplify 5a − 2b + 3a + 7b.', a: '8a + 5b' },
  { q: 'Expand and simplify 4(2x − 3) − (x − 5).', a: '7x − 7' },
  { q: 'Solve 7x + 2 = 30.', a: 'x = 4' },
  { q: 'Solve 4(x − 1) = 2x + 10.', a: 'x = 7' },
  { q: 'Solve 5 − 3x < 14 and write it in interval notation.', a: 'x > −3, (−3, ∞)' },
  { q: 'f(x) = 2x² − 3. Find f(−2) and f(0).', a: 'f(−2) = 5, f(0) = −3' },
  { q: 'Find the slope and y-intercept of 2x + 4y = 8.', a: 'm = −1/2, b = 2' },
  { q: 'Write the line with slope 3 through (0, −2).', a: 'y = 3x − 2' },
  { q: 'Solve x + 2y = 7 and x − y = 1.', a: 'x = 3, y = 2' },
  { q: 'Simplify x⁴ · x³, (y⁵)² and a⁹ ÷ a⁶.', a: 'x⁷, y¹⁰, a³' },
  { q: 'Evaluate (−3)² and −3².', a: '9 and −9' },
  { q: 'Expand (x − 4)(x + 7).', a: 'x² + 3x − 28' },
  { q: 'Factor x² − 7x + 10.', a: '(x − 2)(x − 5)' },
  { q: 'Factor 2x² + 7x + 3.', a: '(2x + 1)(x + 3)' },
  { q: 'Find the vertex and x-intercepts of y = x² + 2x − 8.', a: 'vertex (−1, −9); x = −4 or 2' },
  { q: 'Solve x² − 6x + 7 = 0 with the quadratic formula.', a: 'x = 3 ± √2' },
];

const REVIEW: Guide['review'] = [
  ['Like terms', 'same variables, same exponents; add the coefficients'],
  ['Distributive property', 'a(x + y) = ax + ay'],
  ['Equations', 'same operation on both sides; undo + and − first, then × and ÷'],
  ['Inequalities', 'flip the sign when × or ÷ by a negative; ( ) excludes, [ ] includes'],
  ['Function notation', 'f(a) = the output when x = a'],
  ['Vertical line test', 'crosses once at most → a function'],
  ['Slope-intercept form', 'y = mx + b; m = rise ÷ run, b = y-intercept'],
  ['Systems', 'graphing (crossing point), substitution, elimination'],
  ['Exponents', 'aᵐ · aⁿ = aᵐ⁺ⁿ · aᵐ ÷ aⁿ = aᵐ⁻ⁿ · (aᵐ)ⁿ = aᵐⁿ'],
  ['Multiplying', 'every term × every term; FOIL for two binomials'],
  [
    'Factoring',
    'common factor; x² + bx + c: sum b, product c; ax² + bx + c: sum b, product ac, then group',
  ],
  ['Vertex', 'x = −b ÷ 2a'],
  ['Quadratic formula', 'x = (−b ± √(b² − 4ac)) ÷ 2a'],
];

/** The PSAT algebra guide: ten must-know topics, summarised in our own words from a JensenMath video. */
const ALGEBRA: Guide = {
  title: 'Algebra',
  blurb:
    'Ten must-know algebra topics with rules, worked examples and practice. Each topic links to its part of the video.',
  folder: 'algebra',
  href: '/psat/algebra',
  video: {
    url: 'https://www.youtube.com/watch?v=ueUr7xGOCNc',
    label: 'JensenMath, “All of ALGEBRA in under 1 hour” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
};

export function PsatAlgebraGuide() {
  return <StudyGuide guide={ALGEBRA} />;
}
