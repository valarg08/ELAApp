import { type Guide, StudyGuide, type Topic } from './study-guide';

const FIGURES: Guide['figures'] = {
  angles: {
    file: 'angles',
    alt: 'Parallel lines cut by a transversal: Z angles equal, C angles add to 180°, F angles equal; vertical angles equal.',
  },
  triangles: {
    file: 'triangles',
    alt: 'Equilateral, isosceles and scalene triangles, and an exterior angle equal to x + y.',
  },
  congruent: {
    file: 'congruence',
    alt: 'The congruence tests SSS, SAS, ASA and HL, with the equal parts highlighted.',
  },
  similar: {
    file: 'similar',
    alt: 'Similar triangles with sides 4 and 8 (scale factor 2), and a bow-tie where AB ∥ DE makes △ABC ~ △DEC.',
  },
  pythagoras: {
    file: 'pythagoras',
    alt: 'A 3-4-5 right triangle with squares on each side: 9 + 16 = 25.',
  },
  coordinates: {
    file: 'coordinates',
    alt: 'A(−2, 4) and B(6, −4) on a grid, midpoint M(2, 0), and legs of 8 and 8 giving the distance 8√2.',
  },
  circles: {
    file: 'circles',
    alt: 'Parts of a circle (radius, diameter, chord, tangent, arc), the angle at the centre twice the angle at the circumference, and the tangent–chord angle equal to the angle in the opposite segment.',
  },
  area: {
    file: 'area',
    alt: 'An 8 cm by 4 cm rectangle with area 32 cm² and perimeter 24 cm, and a circle of radius 3 in with area 9π and circumference 6π.',
  },
  solids: {
    file: 'solids',
    alt: 'A 6 × 3 × 2 box (surface area 72, volume 36), a cylinder with r = 5 and h = 9, and the cylinder unrolled into two circles and a rectangle 2πr long.',
  },
  transformations: {
    file: 'transformations',
    alt: 'Triangle A(1, 1), B(4, 1), C(2, 4) on a grid, translated by (1, −4), dilated by 2 and reflected in the y-axis.',
  },
};

const TOPICS: Topic[] = [
  {
    id: 'angles',
    title: 'Angle relationships',
    start: '0:00',
    intro:
      'An angle is two rays from one endpoint (the vertex). Acute is under 90°, right is exactly 90°, obtuse is between 90° and 180°.',
    rules: [
      'Complementary angles add to 90°; supplementary angles add to 180° (a straight line).',
      'Vertical angles (opposite each other where two lines cross) are equal.',
    ],
    tables: [
      {
        caption: 'Parallel lines cut by a transversal',
        table: {
          head: ['Pair', 'Where', 'Rule', 'Shape'],
          rows: [
            ['Alternate interior', 'between the lines, opposite sides', 'equal', 'Z'],
            ['Co-interior', 'between the lines, same side', 'add to 180°', 'C'],
            ['Corresponding', 'same position at each crossing', 'equal', 'F'],
          ],
        },
      },
    ],
    tip: 'Z, C and F only work when the lines are parallel: look for the arrow marks.',
  },
  {
    id: 'triangles',
    title: 'Triangle properties',
    start: '4:49',
    intro:
      'By sides: equilateral (3 equal, every angle 60°), isosceles (2 equal sides, the angles opposite them equal), scalene (none equal). By angles: acute, right (one 90°), obtuse (one over 90°).',
    rules: [
      'Angle sum: the three interior angles add to 180°.',
      'Exterior angle: an outside angle equals the sum of the two interior angles not next to it.',
    ],
    example:
      'Angles 50° and 70°: the third is 180 − 50 − 70 = 60°, and the exterior angle beside it is 50 + 70 = 120°.',
  },
  {
    id: 'congruent',
    title: 'Congruent triangles',
    start: '7:23',
    intro:
      'Congruent triangles have the same size and shape: every side and angle matches. Write △ABC ≅ △DEF with matching vertices in the same order.',
    tables: [
      {
        caption: 'Congruence tests',
        table: {
          head: ['Test', 'What you need'],
          rows: [
            ['SSS', 'three pairs of equal sides'],
            ['SAS', 'two pairs of equal sides and the angle between them'],
            ['ASA', 'two pairs of equal angles and one pair of equal sides'],
            ['HL', 'right triangles: equal hypotenuses and one pair of equal legs'],
          ],
        },
      },
    ],
    tip: 'Two sides and an angle that is not between them (SSA) does not prove congruence.',
  },
  {
    id: 'similar',
    title: 'Similar triangles',
    start: '11:40',
    intro:
      'Similar triangles have the same shape, any size: matching angles are equal and matching sides share one ratio, the scale factor k. Write △ABC ~ △DEF.',
    tables: [
      {
        caption: 'Similarity tests',
        table: {
          head: ['Test', 'What you need'],
          rows: [
            ['AA', 'two pairs of equal angles'],
            ['SAS~', 'two pairs of sides in the same ratio and the angle between them equal'],
            ['SSS~', 'all three pairs of sides in the same ratio'],
          ],
        },
      },
    ],
    example:
      'Bow-tie: AD and BE cross at C with AB ∥ DE. Alternate interior angles give ∠A = ∠D and ∠B = ∠E, so △ABC ~ △DEC by AA.',
  },
  {
    id: 'pythagoras',
    title: 'Pythagorean theorem',
    start: '16:52',
    intro:
      'In a right triangle, a² + b² = c², where c is the hypotenuse (the longest side, opposite the right angle).',
    rules: [
      'Missing hypotenuse: legs 8 and 15 → 64 + 225 = 289, so c = 17.',
      'Missing leg: leg 8, hypotenuse 10 → 100 − 64 = 36, so the leg is 6.',
    ],
    tip: 'Worth knowing by heart: 3-4-5, 5-12-13, 8-15-17 and their multiples.',
  },
  {
    id: 'coordinates',
    title: 'Coordinate geometry',
    start: '19:56',
    intro: 'For points (x₁, y₁) and (x₂, y₂):',
    rules: [
      'Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2), the average of each coordinate.',
      'Distance = √((x₂ − x₁)² + (y₂ − y₁)²), the Pythagorean theorem on the horizontal and vertical gaps.',
    ],
    example: 'A(−2, 4) and B(6, −4): midpoint (2, 0); distance √(64 + 64) = 8√2 ≈ 11.3.',
  },
  {
    id: 'circles',
    title: 'Circles',
    start: '24:32',
    intro:
      'Radius: centre to edge. Diameter: a chord through the centre (d = 2r). Chord: both ends on the circle. Tangent: touches at exactly one point. Arc: part of the circumference.',
    rules: [
      'Angles at the circumference standing on the same chord, on the same side, are equal.',
      'The angle at the centre is twice the angle at the circumference on the same chord.',
      'The angle between a tangent and a chord equals the angle in the opposite segment.',
    ],
    example: 'An angle at the circumference of 35° means 70° at the centre.',
  },
  {
    id: 'area',
    title: 'Area and perimeter',
    start: '28:55',
    intro: 'Area is in square units; perimeter (for a circle, circumference) is in plain units.',
    tables: [
      {
        caption: 'Formulas',
        table: {
          head: ['Shape', 'Area', 'Perimeter', 'Example'],
          rows: [
            ['Rectangle', 'lw', '2l + 2w', '8 by 4 cm: 32 cm², 24 cm'],
            ['Circle', 'πr²', '2πr = πd', 'r = 3 in: 9π ≈ 28.3 in², 6π ≈ 18.8 in'],
          ],
        },
      },
    ],
    tip: 'Given the diameter? Halve it before using πr².',
  },
  {
    id: 'solids',
    title: 'Surface area and volume',
    start: '31:36',
    intro:
      'Surface area is the area of all outside faces (units²). Volume is the space inside (units³); for any prism it is base area × height.',
    tables: [
      {
        caption: 'Formulas',
        table: {
          head: ['Solid', 'Surface area', 'Volume', 'Example'],
          rows: [
            ['Rectangular prism', '2lw + 2lh + 2wh', 'lwh', '2 × 3 × 6: SA 72, V 36'],
            ['Cylinder', '2πr² + 2πrh', 'πr²h', 'r 5, h 9: SA 140π, V 225π'],
          ],
        },
      },
    ],
    tip: "A cylinder's curved side unrolls into a rectangle 2πr long and h wide.",
  },
  {
    id: 'transformations',
    title: 'Transformations',
    start: '36:17',
    intro: 'The original is the pre-image (A); the result is the image (A′).',
    tables: [
      {
        caption: 'Rules for a point (x, y)',
        table: {
          head: ['Transformation', 'Image'],
          rows: [
            ['Translation by (a, b)', '(x + a, y + b)'],
            ['Dilation by k, centre the origin', '(kx, ky)'],
            ['Reflection in the x-axis', '(x, −y)'],
            ['Reflection in the y-axis', '(−x, y)'],
            ['Reflection in y = x', '(y, x)'],
          ],
        },
      },
    ],
    example:
      'A(1, 1), B(4, 1), C(2, 4) translated by (1, −4) gives (2, −3), (5, −3), (3, 0); dilated by 2 gives (2, 2), (8, 2), (4, 8).',
  },
];

const PRACTICE: Guide['practice'] = [
  { q: 'An angle is 38°. Find its complement and supplement.', a: '52° and 142°' },
  {
    q: 'Alternate interior angles measure (3x + 10)° and (5x − 30)°. Find x and the angle.',
    a: 'x = 20, angle 70°',
  },
  { q: 'Co-interior angles measure 2x° and (3x + 30)°. Find both.', a: '60° and 120°' },
  { q: "A triangle's angles are x, 2x and 3x. Find them.", a: '30°, 60°, 90° (a right triangle)' },
  {
    q: 'An exterior angle is 130° and one opposite interior angle is 45°. Find the other.',
    a: '85°',
  },
  {
    q: 'An isosceles triangle has a 40° angle between its equal sides. Find the others.',
    a: '70° and 70°',
  },
  {
    q: 'Two pairs of equal angles and the side between them are equal. Which test applies?',
    a: 'ASA',
  },
  { q: '△ABC ~ △DEF with AB = 4, DE = 10, BC = 6. Find k and EF.', a: 'k = 2.5, EF = 15' },
  { q: 'A right triangle has legs 9 and 12. Find the hypotenuse.', a: '15' },
  { q: 'A right triangle has hypotenuse 13 and a leg 5. Find the other leg.', a: '12' },
  { q: 'P(1, 2) and Q(7, 10). Find the midpoint and length of PQ.', a: '(4, 6) and 10' },
  {
    q: 'A central angle on a chord is 110°. Find an angle at the circumference on the same chord.',
    a: '55°',
  },
  {
    q: 'A circle has diameter 10 cm. Find its area and circumference.',
    a: '25π ≈ 78.5 cm², 10π ≈ 31.4 cm',
  },
  { q: 'A box is 5 × 4 × 2. Find its surface area and volume.', a: 'SA 76, V 40' },
  { q: 'A cylinder has r = 3, h = 10. Find its surface area and volume.', a: 'SA 78π, V 90π' },
  {
    q: '(3, −5) is reflected in y = x, then in the x-axis. Where does it end up?',
    a: '(−5, 3), then (−5, −3)',
  },
];

/** The PSAT geometry guide: ten must-know topics, summarised in our own words from a JensenMath video. */
const GEOMETRY: Guide = {
  title: 'Geometry',
  blurb:
    'Ten must-know geometry topics with formulas, worked examples and practice. Each topic links to its part of the video.',
  folder: 'geometry',
  video: {
    url: 'https://www.youtube.com/watch?v=O-tQVdNwPT0',
    label: 'JensenMath, “All of GEOMETRY in 40 minutes!” on YouTube',
  },
  topics: TOPICS,
  figures: FIGURES,
  practice: PRACTICE,
};

export function PsatGeometryGuide() {
  return <StudyGuide guide={GEOMETRY} />;
}
