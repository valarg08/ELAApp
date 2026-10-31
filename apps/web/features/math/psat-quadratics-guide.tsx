import { QUADRATICS_ALGEBRA1 } from './psat-quadratics-algebra1';
import { QUADRATICS_PROBLEMS } from './psat-quadratics-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  recognize: {
    file: 'recognize',
    alt: 'A table of values for y = x² − 6x + 8 with constant second differences of 2, and its U-shaped graph with the vertex (3, −1) and the axis of symmetry x = 3.',
  },
  standard: {
    file: 'standard',
    alt: 'The parabola y = 2x² + 4x − 5 opening up because a = 2, crossing the y-axis at (0, −5) because c = −5.',
  },
  'vertex-form': {
    file: 'vertex-form',
    alt: 'The parabola y = −2(x − 5)² + 39 opening down with its vertex (5, 39) at the top, the axis of symmetry x = 5, and the y-intercept (0, −11).',
  },
  'factored-form': {
    file: 'factored-form',
    alt: 'The parabola y = ½(x + 2)(x − 6) crossing the x-axis at −2 and 6, with the axis of symmetry x = 2 halfway between and the vertex (2, −8).',
  },
  factoring: {
    file: 'factoring',
    alt: 'Three ways to factor: a sum and product pair for x² + 11x + 24 giving (x + 8)(x + 3), splitting and grouping for 2x² + 7x − 4 giving (x + 4)(2x − 1), and the difference of squares x² − 9 = (x − 3)(x + 3).',
  },
  'solve-factoring': {
    file: 'solve-factoring',
    alt: 'The parabola y = 2x² − 2x − 24 crossing the x-axis at x = −3 and x = 4, the two solutions found by factoring 2(x − 4)(x + 3) = 0.',
  },
  'complete-square': {
    file: 'complete-square',
    alt: 'An area model for completing the square: the square (x − 3)² plus two strips of 3 and a corner of 9 make up x², leading from x² − 6x − 8 = 0 to (x − 3)² = 17 and x = 3 ± √17.',
  },
  formula: {
    file: 'formula',
    alt: 'The quadratic formula x = (−b ± √(b² − 4ac)) ÷ 2a, with the example x² − 6x − 8 = 0 giving x = 3 ± √17.',
  },
  discriminant: {
    file: 'discriminant',
    alt: 'Three parabolas: a positive discriminant gives two x-intercepts, a zero discriminant touches the x-axis once at the vertex, and a negative discriminant never reaches the x-axis.',
  },
  'find-vertex': {
    file: 'find-vertex',
    alt: 'The parabola y = 2x² − 12x + 10 with vertex (3, −8) found three ways: completing the square, averaging the x-intercepts 1 and 5, and using x = −b ÷ 2a.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'recognize',
    title: 'What is a quadratic relationship?',
    start: '0:00',
    intro:
      'A quadratic relationship has x² as its highest power (it is a degree 2 polynomial). You can recognise one from its equation, a table or a graph.',
    tables: [
      {
        caption: 'y = x² − 6x + 8',
        table: {
          head: ['x', '0', '1', '2', '3', '4', '5'],
          rows: [
            ['y', '8', '3', '0', '−1', '0', '3'],
            ['1st difference', '−5', '−3', '−1', '1', '3', ''],
            ['2nd difference', '2', '2', '2', '2', '', ''],
          ],
        },
      },
    ],
    rules: [
      'Equation: the highest exponent on x is 2.',
      'Table: the first differences (bottom minus top) change, but the second differences are constant.',
      'Graph: a U-shaped parabola with a vertex (its maximum or minimum) and a vertical axis of symmetry through the vertex.',
    ],
    tip: 'Constant first differences mean a linear relationship; constant second differences mean a quadratic one.',
  },
  {
    id: 'standard',
    title: 'Standard form',
    start: '1:55',
    intro:
      'Standard form is y = ax² + bx + c, where a, b and c are any real numbers (a is not 0). a and c tell you two things about the graph at a glance.',
    rules: [
      'a > 0: the parabola opens up. a < 0: it opens down.',
      'c is the y-intercept: the graph crosses the y-axis at (0, c).',
      'To graph from standard form, make a table of values and plot the points.',
    ],
    example:
      'y = 2x² + 4x − 5 has a = 2, b = 4, c = −5. It opens up (a > 0) and crosses the y-axis at (0, −5).',
    tip: 'Keep the sign with each number: in y = x² − 6x + 8, b is −6, not 6.',
  },
  {
    id: 'vertex-form',
    title: 'Vertex form',
    start: '3:55',
    intro:
      'Vertex form is y = a(x − h)² + k. The numbers h and k are the coordinates of the vertex, so this form shows the highest or lowest point at once.',
    rules: [
      'The vertex is (h, k) and the axis of symmetry is the line x = h.',
      'a > 0: opens up and the vertex is the minimum. a < 0: opens down and the vertex is the maximum.',
      'x − h means the vertex is at +h: (x − 5)² puts the vertex at x = 5, and (x + 3)² puts it at x = −3.',
      'From standard form, complete the square to get vertex form.',
    ],
    example:
      'y = −2x² + 20x − 11 = −2(x² − 10x) − 11 = −2(x² − 10x + 25) + 50 − 11 = −2(x − 5)² + 39. The vertex is (5, 39), the axis is x = 5, and since a is negative it is a maximum.',
    tip: 'When you add 25 inside the bracket you are really adding −2 × 25 = −50, so add +50 outside to keep it equal.',
  },
  {
    id: 'factored-form',
    title: 'Factored form',
    start: '6:45',
    intro:
      'Factored form is y = a(x − m)(x − n). It shows the x-intercepts directly, because a product is zero when one of its factors is zero.',
    rules: [
      'The x-intercepts are x = m and x = n.',
      'The axis of symmetry is halfway between them: x = (m + n) ÷ 2.',
      'The vertex lies on the axis: put that x-value into the equation to find its y.',
    ],
    example:
      'y = ½(x + 2)(x − 6): the x-intercepts are −2 and 6, the axis is x = (−2 + 6) ÷ 2 = 2, and at x = 2 we get y = ½(4)(−4) = −8, so the vertex is (2, −8).',
    tip: 'A factor x + 2 gives the intercept x = −2: the sign flips.',
  },
  {
    id: 'factoring',
    title: 'Factoring quadratics',
    start: '9:20',
    intro:
      'Factoring turns standard form into factored form. First take out any common factor, then use one of three methods.',
    tables: [
      {
        caption: 'Three types',
        table: {
          head: ['Type', 'Example', 'Result'],
          rows: [
            [
              'a = 1: find a product and sum',
              'x² + 11x + 24 (product 24, sum 11: 8 and 3)',
              '(x + 8)(x + 3)',
            ],
            [
              'a ≠ 1: product a × c, split the middle term, group',
              '2x² + 7x − 4 (product −8, sum 7: 8 and −1)',
              '2x² + 8x − x − 4 = 2x(x + 4) − (x + 4) = (x + 4)(2x − 1)',
            ],
            ['Difference of squares', 'x² − 9 (9 = 3²)', '(x − 3)(x + 3)'],
          ],
        },
      },
    ],
    rules: [
      'Difference of squares: a² − b² = (a − b)(a + b).',
      'Check any factoring by expanding it back.',
    ],
    tip: 'For a = 1, the two numbers multiply to c and add to b. For a ≠ 1, they multiply to a × c and add to b.',
  },
  {
    id: 'solve-factoring',
    title: 'Solving by factoring',
    start: '11:55',
    intro:
      'To solve a quadratic equation by factoring, set one side to 0, factor, then use the zero product rule: each factor can be 0.',
    rules: [
      'Always set the equation equal to 0 first.',
      'Take out any common factor, then factor the rest.',
      'Set each factor equal to 0 and solve: there are usually two answers.',
    ],
    example:
      '2x² − 2x − 24 = 0 → 2(x² − x − 12) = 0 → 2(x − 4)(x + 3) = 0 → x = 4 or x = −3. And 3x² + 13x = 10 → 3x² + 13x − 10 = 0 → (3x − 2)(x + 5) = 0 → x = 2/3 or x = −5.',
    tip: 'Only a product that equals 0 can be split into factors. (x − 3)(x + 2) = 6 does not mean x − 3 = 6.',
  },
  {
    id: 'complete-square',
    title: 'Solving by completing the square',
    start: '14:20',
    intro:
      'Not every quadratic factors. Completing the square always works: it turns the equation into (x − h)² = a number, which you solve with a square root.',
    rules: [
      'Move the constant to the other side: x² − 6x = 8.',
      'Add (half of the x-coefficient)² to both sides: (−6 ÷ 2)² = 9.',
      'Factor the perfect square: (x − 3)² = 17.',
      'Take plus and minus the square root, then solve for x.',
    ],
    example: 'x² − 6x − 8 = 0 → (x − 3)² = 17 → x − 3 = ±√17 → x = 3 ± √17 (exact form).',
    tip: 'Taking a square root always gives two answers: + and −.',
  },
  {
    id: 'formula',
    title: 'The quadratic formula',
    start: '15:45',
    intro:
      'Completing the square on ax² + bx + c = 0 gives a formula that solves any quadratic equation. Set the equation to 0 and read a, b and c.',
    rules: [
      'x = (−b ± √(b² − 4ac)) ÷ 2a.',
      'Work out b² − 4ac first, then simplify the root, then divide every term by the common factor.',
    ],
    example:
      'x² − 6x − 8 = 0: a = 1, b = −6, c = −8. x = (6 ± √(36 + 32)) ÷ 2 = (6 ± √68) ÷ 2 = (6 ± 2√17) ÷ 2 = 3 ± √17.',
    tip: 'Put brackets round negative numbers: b² is (−6)² = 36, and −4ac with c = −8 gives +32.',
  },
  {
    id: 'discriminant',
    title: 'The discriminant',
    start: '18:05',
    intro:
      'The discriminant is b² − 4ac, the part under the square root in the quadratic formula. Its value tells you how many and what kind of solutions there are.',
    tables: [
      {
        caption: 'What the discriminant tells you',
        table: {
          head: ['b² − 4ac', 'Solutions', 'Graph'],
          rows: [
            ['> 0 (a perfect square)', '2 real, rational: it factors', 'crosses the x-axis twice'],
            ['> 0 (not a perfect square)', '2 real, irrational', 'crosses the x-axis twice'],
            ['= 0', '1 real solution', 'the vertex is on the x-axis'],
            ['< 0', 'no real solutions', 'never reaches the x-axis'],
          ],
        },
      },
    ],
    tip: 'No real solutions does not mean no answer: there are complex solutions, but the graph never touches the x-axis.',
  },
  {
    id: 'find-vertex',
    title: 'Finding the vertex',
    start: '20:00',
    intro: 'There are three ways to find the vertex of a parabola. All three give the same point.',
    rules: [
      'Complete the square: y = a(x − h)² + k gives (h, k).',
      'Average the x-intercepts: x = (m + n) ÷ 2, then find y.',
      'Shortcut: x = −b ÷ 2a, then put it back into the equation for y.',
    ],
    example:
      'y = 2x² − 12x + 10: x = 12 ÷ 4 = 3, y = 2(9) − 36 + 10 = −8, so the vertex is (3, −8). Completing the square gives 2(x − 3)² − 8, and the intercepts 1 and 5 average to 3.',
    tip: 'The x-coordinate −b ÷ 2a is also the axis of symmetry.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'Is y = 3x² − 5 quadratic? What is its y-intercept?', a: 'yes; (0, −5)' },
  { q: 'Does y = −x² + 4x + 1 open up or down?', a: 'down (a = −1)' },
  { q: 'Find the vertex and axis of y = 2(x + 3)² − 4.', a: 'vertex (−3, −4); axis x = −3' },
  { q: 'Find the x-intercepts and axis of y = (x + 1)(x − 7).', a: 'x = −1 and 7; axis x = 3' },
  { q: 'Factor x² + 7x + 12.', a: '(x + 3)(x + 4)' },
  { q: 'Factor 3x² + 8x + 4.', a: '(3x + 2)(x + 2)' },
  { q: 'Factor x² − 49.', a: '(x − 7)(x + 7)' },
  { q: 'Solve x² − 2x − 15 = 0.', a: 'x = 5 or x = −3' },
  { q: 'Solve 6x² + x = 2.', a: 'x = 1/2 or x = −2/3' },
  { q: 'Solve x² + 4x − 3 = 0 by completing the square.', a: 'x = −2 ± √7' },
  { q: 'Solve 2x² − 3x − 4 = 0 with the quadratic formula.', a: 'x = (3 ± √41) ÷ 4' },
  {
    q: 'Find the discriminant of x² + 5x + 7 and say how many real solutions it has.',
    a: '−3; none',
  },
  { q: 'For which k does x² + kx + 16 = 0 have exactly one solution (k > 0)?', a: 'k = 8' },
  { q: 'Find the vertex of y = x² − 8x + 3.', a: '(4, −13)' },
  {
    q: 'A ball’s height is h = −5t² + 20t metres. When does it land, and what is its greatest height?',
    a: 't = 4 s; 20 m',
  },
];

const REVIEW: Guide['review'] = [
  ['Quadratic relationship', 'highest power x²; second differences constant; graph is a parabola'],
  ['Standard form', 'y = ax² + bx + c; a > 0 opens up; y-intercept (0, c)'],
  ['Vertex form', 'y = a(x − h)² + k; vertex (h, k); axis x = h'],
  ['Factored form', 'y = a(x − m)(x − n); x-intercepts m and n; axis x = (m + n) ÷ 2'],
  ['Factoring a = 1', 'two numbers: product c, sum b'],
  ['Factoring a ≠ 1', 'two numbers: product ac, sum b; split the middle term and group'],
  ['Difference of squares', 'a² − b² = (a − b)(a + b)'],
  ['Zero product rule', 'set to 0, factor, set each factor to 0'],
  ['Completing the square', 'add (b ÷ 2)² (inside the bracket when a ≠ 1, and balance outside)'],
  ['Quadratic formula', 'x = (−b ± √(b² − 4ac)) ÷ 2a'],
  ['Discriminant b² − 4ac', '> 0: two real; = 0: one real; < 0: none; perfect square: factorable'],
  ['Vertex', 'x = −b ÷ 2a, or the average of the x-intercepts, or complete the square'],
];

/** The PSAT quadratics guide: ten must-know topics, summarised in our own words from a JensenMath video. */
export const QUADRATICS: Guide = {
  title: 'Quadratics',
  blurb:
    'Ten must-know quadratics topics with rules, worked examples and practice. Each topic links to its part of the video.',
  folder: 'quadratics',
  href: '/psat/quadratics',
  video: {
    url: 'https://www.youtube.com/watch?v=SGUP6BkA870',
    label: 'JensenMath, “Quadratics Top 10 Must Knows (ultimate study guide)” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: QUADRATICS_PROBLEMS,
  middleProblems: QUADRATICS_ALGEBRA1,
  middleLevel: {
    id: 'a1',
    label: 'Algebra 1 (grade 9)',
    note: "Aligned to Florida's B.E.S.T. Algebra 1 benchmarks (MA.912); each problem names the benchmark it practises. These follow the video's topics at the level of the Algebra 1 end-of-course exam.",
  },
};

export function PsatQuadraticsGuide() {
  return <StudyGuide guide={QUADRATICS} />;
}

/** One Quadratics chapter as a sub-module: its notes and 25 problems. */
export function PsatQuadraticsTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={QUADRATICS} topicId={topicId} />;
}
