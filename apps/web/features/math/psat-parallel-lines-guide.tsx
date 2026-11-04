import { PARALLEL_LINES_PROBLEMS } from './psat-parallel-lines-problems';
import { type Guide, GuideTopicPage, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  parallel: {
    file: 'parallel',
    alt: 'Parallel lines never meet and have the same slope. Perpendicular lines meet at 90 degrees and their slopes are negative reciprocals: a slope of 2 pairs with a slope of negative one half.',
  },
  transversal: {
    file: 'transversal',
    alt: 'A transversal crossing two parallel lines makes eight angles, numbered 1 to 8. Angles 3, 4, 5 and 6 are between the parallel lines and are interior; angles 1, 2, 7 and 8 are outside and are exterior.',
  },
  alternate: {
    file: 'alternate',
    alt: 'Alternate angles are on opposite sides of the transversal. Alternate interior angles 3 and 6 are equal, and so are 4 and 5. Alternate exterior angles 1 and 8 are equal, and so are 2 and 7.',
  },
  corresponding: {
    file: 'corresponding',
    alt: 'Corresponding angles sit in the same position at the two crossings. Angles 2 and 6 are equal, 1 and 5 are equal, 4 and 8 are equal, and 3 and 7 are equal.',
  },
  consecutive: {
    file: 'consecutive',
    alt: 'Consecutive interior angles are on the same side of the transversal between the parallel lines. Angles 4 and 6 add up to 180 degrees, and so do 3 and 5. Vertical angles, such as 1 and 4, are equal.',
  },
  compsupp: {
    file: 'compsupp',
    alt: 'Complementary angles add up to 90 degrees, as the 30 and 60 degrees inside a right angle do. Supplementary angles add up to 180 degrees, as the 60 and 120 degrees on a straight line do.',
  },
  solvex: {
    file: 'solvex',
    alt: 'Solving for x: pick the relationship, write the equation, solve it, then use x to find the angle. Vertical angles are equal, a linear pair adds up to 180, and the parts of a right angle add up to 90.',
  },
  allangles: {
    file: 'allangles',
    alt: 'With a transversal and parallel lines, the eight angles take only two values. If one angle is 50 degrees, the four angles 2, 3, 6 and 7 are 50 degrees and the other four are 130 degrees.',
  },
  polygons: {
    file: 'polygons',
    alt: 'The interior angles of a polygon add up to the number of sides minus 2, times 180. A triangle (3 sides) is 180, a quadrilateral (4 sides) is 360 and a pentagon (5 sides) is 540.',
  },
  words: {
    file: 'words',
    alt: 'Angle word problems: translate the words into an equation, solve for x, then find the angle that was asked for. Complementary angles add up to 90 and supplementary angles add up to 180.',
  },
  final: {
    file: 'final',
    alt: 'The parallel line and angle facts on one page: parallel slopes are equal, perpendicular slopes are negative reciprocals, alternate and corresponding angles are equal, consecutive interior angles add to 180, complementary add to 90, supplementary add to 180, and polygon angles add to (n − 2) times 180.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'parallel',
    title: 'Parallel and perpendicular lines',
    start: '0:00',
    intro:
      'Parallel lines never meet, and they have the same slope. Perpendicular lines meet at a right angle, and their slopes are negative reciprocals: flip the fraction and change the sign.',
    rules: [
      'Parallel lines (∥) never intersect and have equal slopes.',
      'Perpendicular lines (⊥) meet at 90°.',
      'The slope of a perpendicular line is −1 ÷ m, the negative reciprocal of m.',
      'Two slopes belong to perpendicular lines when their product is −1.',
      'To find a line through a point with a given slope, put the point into y = mx + b and solve for b.',
    ],
    example:
      'A line with slope 2/5 has a parallel line with slope 2/5 and a perpendicular line with slope −5/2. A line with slope −4 has a perpendicular line with slope 1/4.',
    tip: 'Flip and change the sign, both. 5/2 is not enough, and −2/5 is not either.',
  },
  {
    id: 'transversal',
    title: 'A transversal and its eight angles',
    start: '1:14',
    intro:
      'A third line that crosses two parallel lines is called a transversal. It makes eight angles, four at each crossing. The four angles between the parallel lines are interior, and the four outside them are exterior.',
    rules: [
      'Number the angles 1 to 8: 1 and 2 above the top line, 3 and 4 below it, 5 and 6 above the bottom line, 7 and 8 below it, left before right.',
      'Interior angles (between the parallel lines): 3, 4, 5 and 6.',
      'Exterior angles (outside the parallel lines): 1, 2, 7 and 8.',
      'Only two sizes appear: if one angle is a, every angle is either a or 180° − a.',
    ],
    example:
      'If ∠2 = 50°, then 50° is also the size of ∠3, ∠6 and ∠7, and the other four angles are each 130°.',
    tip: 'The names matter in the problems, so learn the picture first: left or right of the transversal, inside or outside the parallel lines.',
  },
  {
    id: 'alternate',
    title: 'Alternate interior and exterior angles',
    start: '2:41',
    intro:
      'Alternate angles sit on opposite sides of the transversal. When they are both inside the parallel lines they are alternate interior angles, and when both are outside they are alternate exterior angles. Either way, they are equal.',
    rules: [
      'Alternate interior angles: ∠3 and ∠6, and ∠4 and ∠5. They are equal.',
      'Alternate exterior angles: ∠1 and ∠8, and ∠2 and ∠7. They are equal.',
      'They are equal only because the two lines are parallel.',
      'To spot one: inside or outside the parallel lines, and on opposite sides of the transversal.',
    ],
    example:
      'If ∠3 = 70°, then its alternate interior angle ∠6 = 70°. If ∠1 = 110°, then its alternate exterior angle ∠8 = 110°.',
    tip: 'Both angles must be inside, or both outside. An inside angle and an outside angle are not alternate interior or exterior.',
  },
  {
    id: 'corresponding',
    title: 'Corresponding angles',
    start: '4:45',
    intro:
      'Corresponding angles are in the same position at the two crossings: both above or both below their parallel line, and both left or both right of the transversal. They are equal.',
    rules: [
      'The corresponding pairs are ∠1 and ∠5, ∠2 and ∠6, ∠3 and ∠7, and ∠4 and ∠8.',
      'Corresponding angles are equal when the lines are parallel.',
      'Slide one crossing down to the other: each angle lands on its partner.',
    ],
    example: 'If ∠2 = 65°, then ∠6 = 65°. If ∠3 = 115°, then ∠7 = 115°.',
    tip: 'If the picture has three or more lines, make sure both angles are made by the same transversal.',
  },
  {
    id: 'consecutive',
    title: 'Consecutive interior and vertical angles',
    start: '5:18',
    intro:
      'Consecutive interior angles are inside the parallel lines on the same side of the transversal. They are supplementary, so they add up to 180°. Vertical angles are the opposite angles where two lines cross, and they are equal.',
    rules: [
      'Consecutive (same-side) interior angles: ∠4 and ∠6, and ∠3 and ∠5. They add up to 180°.',
      'Vertical angles: ∠1 and ∠4, ∠2 and ∠3, ∠5 and ∠8, ∠6 and ∠7. They are equal.',
      'Vertical angles are equal even when the lines are not parallel.',
      'Two angles that form a straight line (a linear pair) add up to 180°.',
    ],
    example:
      'If ∠4 = 120°, then ∠6 = 60° (they add to 180°). If ∠1 = 50°, then ∠4 = 50° because they are vertical, and ∠6 = 130°.',
    tip: 'Consecutive means “next to each other in the list”, here on the same side. Do not call them equal.',
  },
  {
    id: 'compsupp',
    title: 'Complementary and supplementary angles',
    start: '8:03',
    intro:
      'Two angles are complementary when they add up to 90°, as the parts of a right angle do. They are supplementary when they add up to 180°, as the parts of a straight line do.',
    rules: [
      'Complementary: the sum is 90°. The complement of a is 90° − a.',
      'Supplementary: the sum is 180°. The supplement of a is 180° − a.',
      'All the angles on a straight line add up to 180°. A full turn is 360°.',
      'For angles written with x, add the expressions, set the sum equal to 90° or 180°, and solve.',
    ],
    example:
      'The complement of 32° is 58°. The supplement of 74° is 106°. If R = 3x + 1 and S = 9x − 7 are complementary, 12x − 6 = 90, so x = 8 and S = 65°.',
    tip: 'Complement goes with 90 (C comes before S in the alphabet, as 90 comes before 180).',
  },
  {
    id: 'solvex',
    title: 'Solving for x with angle relationships',
    start: '11:37',
    intro:
      'Most angle problems have the same shape. Decide how the angles are related, write that as an equation, solve for x, and then answer what was asked, which is sometimes x and sometimes an angle.',
    rules: [
      'Vertical angles: set the two expressions equal.',
      'Linear pair or a straight line: the angles add up to 180°.',
      'The parts of a right angle: they add up to 90°.',
      'After finding x, put it back in if the question asks for an angle, not for x.',
      'An answer for x can be a decimal, such as 72.5.',
    ],
    example:
      'The angles 7x and 11x fill a right angle, so 18x = 90 and x = 5. The question asked for the angle of 7x, which is 35°, not 5.',
    tip: 'Reread the question after solving. Stopping at x is the most common slip.',
  },
  {
    id: 'allangles',
    title: 'Finding every angle in a figure',
    start: '20:00',
    intro:
      'With parallel lines, one known angle gives all the others. Work from the known angle with vertical angles, linear pairs, and the alternate or corresponding pairs, and keep a record of which angles you have found.',
    rules: [
      'Every angle is either the known angle or 180° minus it.',
      'Start with a vertical angle (equal), then a linear pair (supplementary), then use the parallel lines.',
      'The three angles of a triangle add up to 180°, and the four angles of a quadrilateral add up to 360°.',
      'Drawings in a problem are often not to scale, so trust the numbers and the relationships, not how the angle looks.',
    ],
    example:
      'If one angle is 50°, the angle vertical to it is 50°, the angle next to it is 130°, and the corresponding angles at the other crossing are 50° and 130° too.',
    tip: 'Label each angle with its size on your sketch as you find it. It stops you using the same angle twice.',
  },
  {
    id: 'polygons',
    title: 'Angle sums of polygons',
    start: '28:22',
    intro:
      'The interior angles of any polygon add up to (n − 2) × 180°, where n is the number of sides. A triangle is 180°, a quadrilateral 360° and a pentagon 540°.',
    rules: [
      'Sum of the interior angles = (n − 2) × 180°.',
      'Each angle of a regular polygon is that sum divided by n.',
      'To find a missing angle, subtract the known angles from the sum.',
      'To find n from the sum, divide the sum by 180 and add 2.',
    ],
    example:
      'A hexagon has n = 6, so (6 − 2) × 180 = 720°. A regular hexagon has 720 ÷ 6 = 120° at every corner.',
    tip: 'The (n − 2) counts the triangles you can draw from one corner. That is why each side beyond three adds 180°.',
  },
  {
    id: 'words',
    title: 'Angle word problems with algebra',
    start: '29:39',
    intro:
      'Word problems about angles ask you to translate a sentence into an equation. The words complementary, supplementary, vertical, alternate and consecutive each tell you which equation to write.',
    rules: [
      'Complementary: first + second = 90. Supplementary: first + second = 180.',
      'Vertical, alternate and corresponding angles: first = second.',
      'Consecutive interior angles: first + second = 180.',
      'Solve for x, then evaluate each expression the problem asks about.',
      'Check by adding or comparing the two angles.',
    ],
    example:
      'Angles X and Y are supplementary, with X = 11x − 22 and Y = 5x + 10. Then 16x − 12 = 180, so x = 12 and Y = 5(12) + 10 = 70°.',
    tip: 'Check your answer: the two angles you found should add to 90° or 180°, or be equal, as the words said.',
  },
  {
    id: 'final',
    title: 'Final test: everything together',
    intro:
      'Fifty problems that mix every chapter: slopes of parallel and perpendicular lines, angles made by a transversal, complementary and supplementary angles, equations in x, and polygon angle sums. Read each problem for the key word first.',
    rules: [
      'Parallel lines: equal slopes. Perpendicular lines: negative reciprocal slopes.',
      'Alternate, corresponding and vertical angles are equal.',
      'Consecutive interior angles and a linear pair add up to 180°.',
      'Complementary angles add up to 90° and supplementary angles add up to 180°.',
      'A polygon with n sides has angles that add up to (n − 2) × 180°.',
    ],
    example:
      'The lines are parallel and ∠4 = (6x − 27)° and ∠6 = (x + 53)° are consecutive interior angles. Then 7x + 26 = 180, so x = 22 and ∠6 = 75°.',
    tip: 'Name the relationship before you write the equation, and read the question again before you answer.',
  },
];

const REVIEW: Guide['review'] = [
  ['Parallel lines', 'never meet; equal slopes'],
  ['Perpendicular lines', 'meet at 90°; slopes are negative reciprocals (product −1)'],
  ['Transversal', 'makes eight angles; interior 3, 4, 5, 6; exterior 1, 2, 7, 8'],
  ['Alternate interior / exterior', 'equal (3 = 6, 4 = 5; 1 = 8, 2 = 7)'],
  ['Corresponding', 'equal (1 = 5, 2 = 6, 3 = 7, 4 = 8)'],
  ['Consecutive interior', 'add up to 180° (4 + 6, 3 + 5)'],
  ['Vertical angles', 'equal (1 = 4, 2 = 3, 5 = 8, 6 = 7)'],
  ['Complementary / supplementary', 'add up to 90° / 180°'],
  ['Straight line, full turn', '180°, 360°'],
  ['Triangle, quadrilateral', '180°, 360°'],
  ['Polygon with n sides', 'angles add up to (n − 2) × 180°'],
];

const PRACTICE: Guide['practice'] = [
  { q: 'A line has slope 2/3. What is the slope of a perpendicular line?', a: '−3/2' },
  {
    q: 'Parallel lines are cut by a transversal and ∠3 = 70°. What is its alternate interior angle ∠6?',
    a: '70°',
  },
  {
    q: 'Parallel lines are cut by a transversal and ∠2 = 65°. What is ∠6?',
    a: '65° (corresponding angles)',
  },
  {
    q: 'Consecutive interior angles are 4x and 2x + 30. Find x.',
    a: '4x + 2x + 30 = 180, so x = 25',
  },
  { q: 'What is the complement of 41°? The supplement?', a: '49° and 139°' },
  { q: 'A straight line has angles 70°, 40° and x°. Find x.', a: '70°' },
  { q: 'What is the sum of the interior angles of an octagon?', a: '(8 − 2) × 180 = 1080°' },
  { q: 'What is each angle of a regular decagon?', a: '1440 ÷ 10 = 144°' },
];

/** The PSAT Parallel Lines and Angles guide: ten topics and a final test, summarised in our own words from a video. */
export const PARALLEL_LINES: Guide = {
  title: 'Parallel Lines and Angles',
  blurb:
    'Slopes of parallel and perpendicular lines, the eight angles of a transversal, complementary and supplementary angles, solving for x and polygon angle sums. Each topic has a diagram, notes and 50 problems from easy to hard, and a final test mixes them all.',
  folder: 'parallel-lines',
  href: '/psat/parallel-lines',
  video: {
    url: 'https://www.youtube.com/watch?v=e4o7X6LyX-I',
    label:
      'The Organic Chemistry Tutor, “Parallel and Perpendicular Lines, Transversals, Alternate Interior Angles, Alternate Exterior Angles” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  review: REVIEW,
  practice: PRACTICE,
  problems: PARALLEL_LINES_PROBLEMS,
};

export function PsatParallelLinesGuide() {
  return <StudyGuide guide={PARALLEL_LINES} />;
}

/** One Parallel Lines chapter as a sub-module: its notes and 50 problems. */
export function PsatParallelLinesTopic({ topicId }: { topicId: string }) {
  return <GuideTopicPage guide={PARALLEL_LINES} topicId={topicId} />;
}
