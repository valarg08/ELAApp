import { FUNCTIONS_ALGEBRA1 } from './psat-functions-algebra1';
import { FUNCTIONS_PROBLEMS } from './psat-functions-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  whatis: {
    file: 'whatis',
    alt: 'The vertical line test. On the left a parabola opening upward is crossed once by a vertical line, so it is a function. On the right a parabola opening sideways is crossed twice by a vertical line, so it is not a function.',
  },
  domain: {
    file: 'domain',
    alt: 'Domain and range from a graph: for a parabola that opens up with its lowest point at height 2, the domain is every real x (how wide it is) and the range is y at least 2 (how high it reaches).',
  },
  common: {
    file: 'common',
    alt: 'Eight common graphs: the line y = x, the parabola y = x squared, the cubic y = x cubed, the square root curve, the reciprocal y = 1 over x with two branches, the sine wave, the exponential 2 to the x and the logarithm log base 2 of x.',
  },
  transform: {
    file: 'transform',
    alt: 'Transformations of y = f(x) into g(x) = a f(x − d) + c: c moves the graph up, d moves it right, a stretches it vertically or flips it, and k inside f(kx) squeezes it sideways. On the right, y = x squared and its image y = (x − 3) squared + 1.',
  },
  inverse: {
    file: 'inverse',
    alt: 'A function and its inverse are mirror images across the line y = x. The graphs of 2 to the x and log base 2 of x are shown with the line y = x, and the point (3, 8) on one matches the point (8, 3) on the other.',
  },
  combine: {
    file: 'combine',
    alt: 'Adding two functions by adding their heights. A parabola f(x) = x squared over 2 plus 1, a line g(x) = x minus 1 and their sum, a new parabola, at x = 2 where the heights 3 and 1 add to 4.',
  },
  composite: {
    file: 'composite',
    alt: 'A composite function as two machines in a row: the input 4 goes into g(x) = x + 5 and comes out as 9, then 9 goes into f(x) = 3x and comes out as 27, so f of g of 4 is 27.',
  },
  piecewise: {
    file: 'piecewise',
    alt: 'A piecewise function with two rules: y = x + 1 for x less than 1, ending at an open circle at (1, 2), and y = 4 minus x for x at least 1, starting at a closed circle at (1, 3).',
  },
  evenodd: {
    file: 'evenodd',
    alt: 'Even and odd functions. On the left an even function is mirror symmetric about the y-axis, with f(−2) = f(2). On the right an odd function has point symmetry about the origin, with f(−2) the opposite of f(2).',
  },
  asymptotes: {
    file: 'asymptotes',
    alt: 'Asymptotes of y = 1 over (x − 2) plus 1: a vertical asymptote at x = 2 where the denominator is zero, and a horizontal asymptote at y = 1 that the graph approaches as x goes to infinity.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'whatis',
    title: 'What is a function?',
    start: '0:00',
    intro:
      'A function is a relationship between two variables where each input has exactly one output. You can show it as an equation, a table or a graph, and on a graph there is a quick test for it.',
    rules: [
      'Each input x goes with exactly one output y. Two different y-values for one x means it is not a function.',
      'Vertical line test: if any vertical line touches the graph more than once, the graph is not a function.',
      'Function notation f(x) names the function f. It does not mean f times x. The x in the brackets is the input; the whole expression is the output.',
      'To evaluate f(a), replace every x with the input a, then work it out.',
    ],
    example:
      'y = 2x² − 5 is a function: x = −2 gives 3, x = 1 gives −3, one output each. x = y² is not: x = 4 goes with both y = 2 and y = −2, so a vertical line at x = 4 crosses the graph twice. For f(x) = 2x² − 5, f(−2) = 2(−2)² − 5 = 3.',
    tip: 'Repeated outputs are fine; repeated inputs with different outputs are not. y = x² sends 2 and −2 to the same y, and that is allowed.',
  },
  {
    id: 'domain',
    title: 'Domain and range',
    start: '5:21',
    intro:
      'The domain is every input x that gives a real output; the range is every output y the function can produce. From a graph, the domain is how wide it reaches and the range is how high and low it reaches.',
    rules: [
      'Domain: which x-values can go in. Watch for a zero denominator and a negative number under a square root.',
      'Range: which y-values come out. Think about the lowest or highest point of the graph.',
      'Set notation {x ∈ ℝ} means any real number. Interval notation uses brackets: ( ) leaves the end out, [ ] includes it, and infinity always gets ( ).',
      'A parabola that opens up has a smallest y at its vertex; one that opens down has a largest y.',
    ],
    example:
      'f(x) = x² + 1 accepts every real x, so the domain is (−∞, ∞). Since x² ≥ 0, the output is at least 1, so the range is y ≥ 1, or [1, ∞).',
    tip: 'To find the range of a quadratic, find its vertex. The range starts or stops at the vertex height.',
  },
  {
    id: 'common',
    title: 'Graphs of common functions',
    start: '9:58',
    intro:
      'A handful of graphs show up again and again. Learn their shapes, where they start, and what they never touch.',
    rules: [
      'Power functions: y = x is a line through the origin, y = x² is a parabola, y = x³ is an S-shape through the origin.',
      'Square root: starts at the origin and goes right; the domain is x ≥ 0 because a negative has no real square root.',
      'Reciprocal y = 1/x: two branches (a hyperbola) with asymptotes x = 0 and y = 0.',
      'Sine and cosine: periodic waves between −1 and 1; cosine is sine shifted left.',
      'Exponential y = 2ˣ: always positive, horizontal asymptote y = 0, doubles for every step right.',
      'Logarithm y = log₂ x: the inverse of 2ˣ, vertical asymptote x = 0, grows slowly.',
    ],
    example:
      '2ˣ goes 1, 2, 4, 8 as x goes 0, 1, 2, 3, and gets cut in half each step left: 1/2, 1/4, … log₂ 8 = 3 because 2³ = 8.',
    tip: 'An exponential and a logarithm with the same base undo each other. Swap the coordinates of one to get a point on the other.',
  },
  {
    id: 'transform',
    title: 'Transformations',
    start: '13:54',
    intro:
      'A parent function f(x) can be shifted, stretched, compressed or reflected. In g(x) = a · f(k(x − d)) + c, the four numbers each have one job.',
    rules: [
      'c (added to the whole output): up if positive, down if negative.',
      'd (subtracted from x): right if positive, left if negative. f(x + 3) moves the graph 3 to the left.',
      'a (multiplied outside): a vertical stretch by |a| if |a| > 1, a compression if |a| < 1, and a flip over the x-axis if a < 0.',
      'k (multiplied inside): a horizontal compression by 1/|k| if |k| > 1, a stretch if |k| < 1, and a flip over the y-axis if k < 0.',
      'To move a point: change x with the inside numbers, and y with the outside numbers.',
    ],
    example:
      'g(x) = ½ f(x − 2) − 1 with f(x) = x³: every point moves 2 right, halves its height, then drops 1. The point (−2, −8) becomes (0, −5).',
    tip: 'Inside changes are the opposite of what they look like (x − 2 moves right) and they act on x; outside changes act on y in the way they look.',
  },
  {
    id: 'inverse',
    title: 'Inverse functions',
    start: '18:30',
    intro:
      'An inverse function f⁻¹ reverses f. If f takes a to b, then f⁻¹ takes b back to a. The graphs are mirror images across the line y = x.',
    rules: [
      'f⁻¹(f(x)) = x and f(f⁻¹(x)) = x. The −1 is not an exponent and does not mean 1/f.',
      'Every point (a, b) on f gives the point (b, a) on f⁻¹.',
      'To find the equation: swap x and y, then solve for y.',
      'Only a one-to-one function has an inverse function. A parabola on all real numbers does not, because two inputs share one output.',
    ],
    example:
      'f(x) = 2ˣ has the points (−2, 1/4), (0, 1), (3, 8). Its inverse has (1/4, −2), (1, 0), (8, 3). Swapping x and y in y = 2ˣ gives x = 2ʸ, so f⁻¹(x) = log₂ x.',
    tip: 'Check an inverse by feeding it an output of f. You must get the original input back.',
  },
  {
    id: 'combine',
    title: 'Combining functions',
    start: '22:08',
    intro:
      'Two functions can be added, subtracted, multiplied or divided. The new function does the operation to the two outputs.',
    rules: [
      '(f + g)(x) = f(x) + g(x); likewise (f − g)(x) and (f · g)(x).',
      '(f / g)(x) = f(x) / g(x), but only where g(x) ≠ 0.',
      'Graphically: add the heights point by point. Algebraically: add the two equations and collect like terms.',
      'Write the answer in descending order of degree, then use what you know about that function (factor it, find the vertex).',
    ],
    example:
      'If f(x) = −x² + 3 and g(x) = −2x, then (f + g)(x) = −x² − 2x + 3 = −(x + 3)(x − 1). The x-intercepts are −3 and 1, the vertex is at x = −1, and (f + g)(−1) = 4.',
    tip: 'The vertex of a parabola with x-intercepts p and q is at x = (p + q)/2.',
  },
  {
    id: 'composite',
    title: 'Composite functions',
    start: '22:53',
    intro:
      'A composite function uses the output of one function as the input of another. f(g(x)) means: do g first, then put the result into f.',
    rules: [
      'f(g(x)) is read “f of g of x”. The function inside the brackets runs first.',
      'To evaluate f(g(a)): find g(a), then find f of that number.',
      'To get an expression, replace every x in f with the whole expression g(x), then expand and simplify.',
      'The order matters: f(g(x)) and g(f(x)) are usually different.',
    ],
    example:
      'f(x) = x² + 2x + 3 and g(x) = x + 4: f(g(x)) = (x + 4)² + 2(x + 4) + 3 = x² + 10x + 27. With f(x) = 2x and g(x) = x + 3, g(f(4)) = g(8) = 11.',
    tip: 'Work from the inside out, and bracket the expression you substitute.',
  },
  {
    id: 'piecewise',
    title: 'Piecewise functions',
    start: '28:28',
    intro:
      'A piecewise function uses different rules on different parts of its domain. You graph each rule, then keep only the part it applies to.',
    rules: [
      'Read the condition first, then choose the rule for the input you have.',
      'Graph each rule on its own, then keep only the part inside its condition.',
      'An open circle marks an end that is not included (< or >); a closed circle marks one that is (≤ or ≥).',
      'Each input gets exactly one rule, so the result is still a function.',
    ],
    example:
      'f(x) = x² for x ≥ 0, and f(x) = x − 2 for x < 0. At x = 0 the graph is at the parabola, height 0, so the point (0, −2) on the line is an open circle.',
    tip: 'Absolute value is piecewise: |x| is x for x ≥ 0 and −x for x < 0.',
  },
  {
    id: 'evenodd',
    title: 'Even and odd functions',
    start: '30:42',
    intro:
      'Some functions have a symmetry. An even function is a mirror image across the y-axis. An odd function looks the same after a 180° turn around the origin.',
    rules: [
      'Even: f(−x) = f(x). Example: x², |x|, x⁴, cos x, a constant.',
      'Odd: f(−x) = −f(x). Example: x, x³, x⁵, sin x.',
      'Test: replace x with −x and simplify. Same as before is even; the exact opposite is odd; anything else is neither.',
      'An odd function defined at 0 has f(0) = 0.',
      'Even powers of x stay the same under x → −x; odd powers change sign. A mix is usually neither.',
    ],
    example:
      'f(x) = x⁴ − 2x² − 1: f(−x) = (−x)⁴ − 2(−x)² − 1 = x⁴ − 2x² − 1 = f(x), so it is even. g(x) = x³ + 3x: g(−x) = −x³ − 3x = −g(x), so it is odd.',
    tip: 'Even: f(2) and f(−2) match. Odd: they are opposites. A table of two values can disprove, but only algebra proves.',
  },
  {
    id: 'asymptotes',
    title: 'Asymptotes',
    start: '35:17',
    intro:
      'An asymptote is a line that the graph gets closer and closer to without touching it. Vertical ones come from zero denominators; horizontal ones come from what happens for very large x.',
    rules: [
      'Vertical asymptote x = a: the function has a non-zero number over 0 at x = a. Near it the graph goes to +∞ or −∞.',
      'A factor that cancels from top and bottom leaves a hole, not an asymptote.',
      'Horizontal asymptote y = b: f(x) approaches b as x → ∞ or x → −∞.',
      'For a rational function, compare degrees: top lower → y = 0; same degree → ratio of the leading coefficients; top higher → none.',
      'To find a horizontal limit, divide every term by the highest power of x in the denominator.',
    ],
    example:
      'f(x) = 1/((x + 2)(x − 4)) has vertical asymptotes x = −2 and x = 4. Expanded, the denominator is x² − 2x − 8; dividing by x² gives (1/x²) / (1 − 2/x − 8/x²) → 0/1 = 0, so the horizontal asymptote is y = 0.',
    tip: 'A graph can cross a horizontal asymptote near the middle. It can never reach a vertical one.',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'Is y = 3x − 4 a function of x?', a: 'yes' },
  { q: 'For f(x) = 2x + 5, what is f(−3)?', a: '−1' },
  { q: 'What is the domain of f(x) = 1/(x − 6)?', a: 'all x except 6' },
  { q: 'What is the range of f(x) = x² − 3?', a: 'y ≥ −3' },
  { q: 'What is log₂ 32?', a: '5' },
  { q: 'g(x) = f(x − 4) + 2: which way and how far does the graph move?', a: '4 right, 2 up' },
  { q: 'If f(5) = 9, what is f⁻¹(9)?', a: '5' },
  { q: 'f(x) = 2x + 1 and g(x) = x − 3. What is (f + g)(4)?', a: '10' },
  { q: 'f(x) = x² and g(x) = x + 1. What is f(g(2))?', a: '9' },
  { q: 'What is g(f(2)) for the same functions?', a: '5' },
  { q: 'f(x) = x for x < 0 and 2x for x ≥ 0. What is f(3)?', a: '6' },
  { q: 'Is f(x) = x⁵ even, odd or neither?', a: 'odd' },
  { q: 'If f is even and f(4) = 7, what is f(−4)?', a: '7' },
  { q: 'What is the vertical asymptote of f(x) = 3/(x + 5)?', a: 'x = −5' },
  { q: 'What is the horizontal asymptote of f(x) = (4x + 1)/(2x − 3)?', a: 'y = 2' },
];

const REVIEW: Guide['review'] = [
  ['Function', 'each input has exactly one output; vertical line test'],
  [
    'Domain and range',
    'domain = allowed x (no zero denominator, no negative root); range = reachable y',
  ],
  ['Common graphs', 'line, parabola, cubic, square root, 1/x, sin, cos, 2ˣ, log₂ x'],
  ['Transformations', 'g(x) = a·f(k(x − d)) + c: d right, c up, a vertical, k horizontal'],
  ['Inverse', 'swap x and y; mirror in y = x; one-to-one only'],
  ['Combine', '(f ± g)(x), (f · g)(x), (f / g)(x) with g(x) ≠ 0'],
  ['Composite', 'f(g(x)): inside first; the order matters'],
  ['Piecewise', 'pick the rule by the condition; open or closed circle at the ends'],
  ['Even / odd', 'even: f(−x) = f(x); odd: f(−x) = −f(x)'],
  [
    'Asymptotes',
    'vertical: denominator 0; horizontal: compare degrees; cancelled factor is a hole',
  ],
];

/** The PSAT functions guide: ten must-know topics, summarised in our own words from a JensenMath video. */
export const FUNCTIONS: Guide = {
  title: 'Functions',
  blurb:
    'Ten must-know function topics with rules, worked examples and practice. Each topic links to its part of the video.',
  folder: 'functions',
  href: '/psat/functions',
  video: {
    url: 'https://www.youtube.com/watch?v=LNZl4GqVm58',
    label:
      'JensenMath, “Learn All of Functions in only 40 Minutes! (ultimate study guide)” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: FUNCTIONS_PROBLEMS,
  middleProblems: FUNCTIONS_ALGEBRA1,
  middleLevel: {
    id: 'a1',
    label: 'Algebra 1 (grade 9)',
    note: "Aligned to Florida's B.E.S.T. benchmarks (MA.912.F.1 and F.2): domain and range, function notation, transformations, inverses, combining functions, even and odd functions. Some of these topics are Algebra 2, and the codes were assigned from memory, so a teacher should check them. These follow the video's chapters at Algebra 1 level.",
  },
};

export function PsatFunctionsGuide() {
  return <StudyGuide guide={FUNCTIONS} />;
}

/** One Functions chapter as a sub-module: its notes and 25 problems. */
export function PsatFunctionsTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={FUNCTIONS} topicId={topicId} />;
}
