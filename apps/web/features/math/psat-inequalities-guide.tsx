import { INEQUALITIES_ALGEBRA1 } from './psat-inequalities-algebra1';
import { INEQUALITIES_PROBLEMS } from './psat-inequalities-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  symbols: {
    file: 'symbols',
    alt: 'A table of the four inequality symbols with interval notation: x > 5 is (5, ∞), x < 5 is (−∞, 5), x ≥ 5 is [5, ∞) and x ≤ 5 is (−∞, 5].',
  },
  numberline: {
    file: 'numberline',
    alt: 'Three number lines: a closed dot at 3 for x = 3, an open circle at −2 with a ray right for x > −2, and a closed circle at 3 with a ray left for x ≤ 3.',
  },
  linear: {
    file: 'linear',
    alt: 'Solving −2x + 5 ≤ 13 by dividing by −2 and reversing the inequality, then a closed circle at −4 with a ray to the right for x ≥ −4.',
  },
  or: {
    file: 'or',
    alt: 'An OR compound inequality as a union: an open ray left of −8 and an open ray right of −3, with a gap between them.',
  },
  and: {
    file: 'and',
    alt: 'An AND compound inequality as an overlap: x ≥ −2 and x < 2 meet on the segment from −2 (closed) to 2 (open).',
  },
  abs: {
    file: 'abs',
    alt: 'An absolute-value inequality |x − 3| ≤ 5 as the closed segment from −2 to 8, because x is within 5 of 3.',
  },
  twovar: {
    file: 'twovar',
    alt: 'The dashed boundary y = (2/3)x + 2 with the region above it shaded, because a test at (0, 0) makes −2x + 3y > 6 false.',
  },
  systems: {
    file: 'systems',
    alt: 'A system: the solid half-plane under y = (1/2)x + 5 overlapping the region above the dashed parabola y = x².',
  },
  poly: {
    file: 'poly',
    alt: 'A cubic through x-intercepts −5, 3 and 5, positive on [−5, 3] and [5, ∞), the solution of the polynomial inequality ≥ 0.',
  },
  rational: {
    file: 'rational',
    alt: 'A sign chart for a rational inequality with vertical asymptotes at −1 and 3 and a zero at 7; the negative intervals are (−∞, −1) ∪ (3, 7).',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'symbols',
    title: 'What is an inequality?',
    start: '0:00',
    intro:
      'An inequality compares two values and says whether one is greater, less, or possibly equal to the other. The four symbols each have an interval that lists every number that works.',
    tables: [
      {
        caption: 'Symbols and interval notation',
        table: {
          head: ['Symbol', 'Meaning', 'Example', 'Interval'],
          rows: [
            ['>', 'greater than', 'x > 5', '(5, ∞)'],
            ['<', 'less than', 'x < 5', '(−∞, 5)'],
            ['≥', 'greater than or equal to', 'x ≥ 5', '[5, ∞)'],
            ['≤', 'less than or equal to', 'x ≤ 5', '(−∞, 5]'],
          ],
        },
      },
    ],
    rules: [
      'A round bracket leaves the end out. A square bracket puts it in.',
      'Infinity always gets a round bracket: you never “reach” it.',
      'The symbol opens toward the larger value, so you can read an inequality from either side: 5 < 7 is the same as 7 > 5.',
    ],
    tip: 'x > 5 does not include 5, because 5 is not greater than 5.',
  },
  {
    id: 'numberline',
    title: 'Graphing on a number line',
    start: '5:23',
    intro:
      'An equation is one point. An inequality is a range. A number line shows that range: a circle at the bound, then a ray over every number that works.',
    rules: [
      'An equation such as x = 3 is a closed dot at 3.',
      'Open circle: the bound is not included (strict > or <).',
      'Closed circle: the bound is included (≥ or ≤).',
      'Shade right for greater, left for less. The ray goes on forever.',
    ],
    example:
      'x > −2 is an open circle at −2 and a ray to the right: interval (−2, ∞). x ≤ 3 is a closed circle at 3 and a ray to the left: interval (−∞, 3].',
    tip: 'Draw the circle first, then the ray. The circle is how you remember whether the bound is in.',
  },
  {
    id: 'linear',
    title: 'Linear inequalities with one variable',
    start: '8:42',
    intro:
      'Solve a linear inequality the same way as an equation — isolate x with inverse operations — with one extra rule: multiplying or dividing by a negative reverses the inequality.',
    rules: [
      'Add or subtract on both sides; the symbol stays as it is.',
      'Multiply or divide by a positive; the symbol stays as it is.',
      'Multiply or divide by a negative; flip < with > and ≤ with ≥.',
      'Check with a test value from the interval you found.',
    ],
    example:
      'x + 3 > 7 becomes x > 4, interval (4, ∞). For −2x + 5 ≤ 13, subtract 5 to get −2x ≤ 8, then divide by −2 and reverse: x ≥ −4, interval [−4, ∞). A test at x = 0 works in the original: 5 ≤ 13.',
    tip: 'The reverse happens only for multiply or divide by a negative. Adding −5 does not flip the symbol.',
  },
  {
    id: 'or',
    title: 'Compound inequalities (OR)',
    start: '13:30',
    intro:
      'An OR (a disjunction) is two inequalities at once. Solve each part on its own. The solution is every number that works in either part: the union of the two sets, written with ∪.',
    rules: [
      'Solve the two inequalities separately.',
      'Graph both rays (or segments). Keep anything under either graph.',
      'A number only has to satisfy one of the two parts.',
      'If one part already covers the other, the union is just the larger set. If they cover the whole line, the answer is all real numbers.',
    ],
    example:
      '5x − 3 > −18 or −2x − 1 > 15. The first is x > −3. The second, after dividing by a negative and reversing, is x < −8. Union: (−∞, −8) ∪ (−3, ∞), with a gap from −8 to −3. In a different example, x ≥ 6 or x ≥ 3 collapses to [3, ∞), because every number ≥ 6 is already ≥ 3.',
    tip: 'U is “or”. A number in only one of the two intervals still counts.',
  },
  {
    id: 'and',
    title: 'Compound inequalities (AND)',
    start: '20:09',
    intro:
      'An AND (a conjunction) keeps only the numbers that satisfy both parts: the overlap, or intersection. A double inequality such as −4 ≤ 3x − 7 < 8 is the same idea written on one line.',
    rules: [
      'Solve each part, then keep only the overlap of the two graphs.',
      'On a double inequality, do the same step to all three sections.',
      'The final interval often has a square bracket at one end and a round bracket at the other.',
    ],
    example:
      '6x − 3 < 9 and 2x + 7 ≥ 3 becomes x < 2 and x ≥ −2, so [−2, 2). The double inequality −4 ≤ 3x − 7 < 8: add 7 throughout, then divide by 3, to get 1 ≤ x < 5, interval [1, 5).',
    tip: 'If the two rays do not overlap, the AND has no solution. Check with a test point from the overlap: it must work in both originals.',
  },
  {
    id: 'abs',
    title: 'Absolute-value inequalities',
    start: '27:18',
    intro:
      'Absolute value is distance from 0, always positive. An inequality with an absolute value becomes a compound inequality. Isolate the absolute value first, then split into two cases.',
    rules: [
      '|x| < a (or ≤) is an AND: −a < x < a. Distance less than a is a segment.',
      '|x| > a (or ≥) is an OR: x < −a or x > a. Distance greater than a is two rays.',
      'If the isolated absolute value is less than a negative, there is no solution. If it is greater than a negative, every real number works.',
    ],
    example:
      '|x − 3| ≤ 5 becomes −5 ≤ x − 3 ≤ 5, then −2 ≤ x ≤ 8, interval [−2, 8]. For 3|2x − 5| − 9 > 12, isolate first: |2x − 5| > 7, then 2x − 5 > 7 or 2x − 5 < −7, so x > 6 or x < −1: (−∞, −1) ∪ (6, ∞).',
    tip: 'Less than → AND (between). Greater than → OR (outside). Do not skip isolating the absolute value.',
  },
  {
    id: 'twovar',
    title: 'Linear inequalities with two variables',
    start: '32:14',
    intro:
      'With x and y, the solution is a whole region in the plane. Graph the boundary line, then shade the side whose points make the inequality true.',
    rules: [
      'Isolate y if you can. The boundary is that equation with = instead of the inequality.',
      'Dashed line when the symbol is < or > (the line is not in). Solid line for ≤ or ≥.',
      'Test a point not on the line, often (0, 0). If it works, shade that side; if not, shade the other side.',
      'When y is isolated, y > mx + b is above the line and y < mx + b is below it.',
    ],
    example:
      '−2x + 3y > 6 isolates to y > (2/3)x + 2. The boundary is dashed. (0, 0) gives 0 > 6, false, so shade the side that does not contain the origin: above the line.',
    tip: 'If (0, 0) sits on the boundary, pick a different test point such as (0, 1).',
  },
  {
    id: 'systems',
    title: 'Systems of inequalities',
    start: '35:54',
    intro:
      'A system is two or more inequalities in the same variables. The solution is the overlap of the shaded regions: the points that make every inequality true at once.',
    rules: [
      'Graph each inequality on the same axes, with its own dashed or solid boundary.',
      'Shade each region lightly, then darken (or outline) only the overlap.',
      'A point in the overlap must pass a test in every inequality.',
    ],
    example:
      'y ≤ (1/2)x + 5 (solid line, shade below) and y > x² (dashed parabola, shade above). The solution is the region under the line and above the parabola, not including the parabola itself.',
    tip: 'The overlap can be a polygon, a wedge, or empty. If the shaded sides miss each other, the system has no solution.',
  },
  {
    id: 'poly',
    title: 'Polynomial inequalities',
    start: '38:52',
    intro:
      'Move every term to one side, factor, read the roots, then use a graph or a sign chart to see where the polynomial is positive or negative.',
    rules: [
      'Get 0 on one side, then factor completely.',
      'The roots are the x-intercepts. They split the line into intervals.',
      'Odd degree with a positive leading coefficient: the graph starts down (quadrant III) and ends up (quadrant I).',
      'On a sign chart, test one number in each interval. Include a root only when the inequality has equals.',
    ],
    example:
      'x³ − 3x² − 25x + 75 ≥ 0 factors by grouping to (x − 3)(x − 5)(x + 5) ≥ 0. Roots −5, 3 and 5. The cubic is non-negative on [−5, 3] ∪ [5, ∞).',
    tip: 'A sign chart is the graph without drawing it: one test value per interval, then multiply the signs of the factors.',
  },
  {
    id: 'rational',
    title: 'Rational inequalities',
    start: '44:20',
    intro:
      'A rational inequality is a comparison of fractions with x. Move everything to one side, combine over a common denominator, then use a sign chart. The extra critical numbers are the vertical asymptotes, where the denominator is 0.',
    rules: [
      'Move all terms to one side and combine into a single fraction.',
      'Zeros of the numerator are roots. Zeros of the denominator are vertical asymptotes — never solutions.',
      'Those numbers split the line. Test a point in each open interval.',
      'Include a root only for ≤ or ≥. Never include an asymptote.',
    ],
    example:
      '(x + 3)/(x + 1) < (x − 2)/(x − 3) becomes (x − 7)/((x − 3)(x + 1)) < 0 after subtracting and combining. Root 7, asymptotes −1 and 3. The negative intervals are (−∞, −1) ∪ (3, 7).',
    tip: 'Do not multiply both sides by a denominator that might be negative: that would need a flip you cannot see. Combine first, then test signs.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'Write the interval for x ≥ −2.', a: '[−2, ∞)' },
  { q: 'Is the circle open or closed for x < 4?', a: 'open' },
  { q: 'Solve x − 6 > 1.', a: 'x > 7' },
  { q: 'Solve −3x ≤ 12.', a: 'x ≥ −4' },
  { q: 'Solve x < 1 or x > 5. How many integers from 0 to 6 work?', a: '3' },
  { q: 'Solve −1 ≤ x < 4. How many integers work?', a: '5' },
  { q: 'Solve |x − 2| ≤ 3. What is the left end?', a: '−1' },
  { q: 'Solve |x| > 4. What is the right ray’s bound?', a: '4' },
  { q: 'For y > 2x − 1, is the boundary dashed or solid?', a: 'dashed' },
  { q: 'Is (0, 0) a solution of y ≥ x + 1?', a: 'no' },
  {
    q: 'The factors of a polynomial inequality are (x + 1)(x − 4). What is the larger root?',
    a: '4',
  },
  { q: 'For (x − 1)/(x + 2) < 0, what x is never a solution?', a: '−2' },
  { q: 'Solve 2x + 5 < 11. What is the bound?', a: '3' },
  { q: 'How many integers from −2 to 2 satisfy |x| ≥ 2?', a: '3' },
  { q: 'On y ≤ −x + 4, what is y on the boundary when x = 0?', a: '4' },
];

const REVIEW: Guide['review'] = [
  ['Interval notation', 'round = out, square = in; infinity always round'],
  ['Number line', 'open circle for < or >; closed for ≤ or ≥; shade the true side'],
  [
    'Linear (one variable)',
    'solve like an equation; flip only when multiplying or dividing by a negative',
  ],
  ['OR', 'union ∪: a number that works in either part'],
  ['AND', 'overlap: a number that works in both parts; a double inequality is an AND'],
  ['Absolute value', '|x| < a is AND (segment); |x| > a is OR (two rays)'],
  ['Two variables', 'dashed if strict, solid if equals; test a point and shade that side'],
  ['Systems', 'the overlap of the shaded regions'],
  ['Polynomial', '0 on one side, factor, sign chart from the roots'],
  ['Rational', 'combine to one fraction; never include a vertical asymptote'],
];

/** The PSAT inequalities guide: ten must-know topics, summarised in our own words from a JensenMath video. */
export const INEQUALITIES: Guide = {
  title: 'Inequalities',
  blurb:
    'Ten must-know inequality topics with rules, worked examples and practice. Each topic links to its part of the video.',
  folder: 'inequalities',
  href: '/psat/inequalities',
  video: {
    url: 'https://www.youtube.com/watch?v=aRIuPgGYKcE',
    label: 'JensenMath, “INEQUALITIES - Top 10 Must Knows (ultimate study guide)” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: INEQUALITIES_PROBLEMS,
  middleProblems: INEQUALITIES_ALGEBRA1,
  middleLevel: {
    id: 'a1',
    label: 'Algebra 1 (grade 9)',
    note: "Aligned to Florida's B.E.S.T. benchmarks (MA.912): AR.2.5 one-variable, AR.2.7 two-variable, AR.2.8 systems; polynomial and rational chapters use Algebra 2 codes AR.5.4 and AR.8.3. A teacher should check those codes. These follow the video's chapters at Algebra 1 level.",
  },
};

export function PsatInequalitiesGuide() {
  return <StudyGuide guide={INEQUALITIES} />;
}

/** One Inequalities chapter as a sub-module: its notes and 25 problems. */
export function PsatInequalitiesTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={INEQUALITIES} topicId={topicId} />;
}
