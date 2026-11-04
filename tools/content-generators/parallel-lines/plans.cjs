// The tiers of each chapter: [how many, a function that makes one problem]. A group keeps drawing
// until it has that many different questions (across the whole guide, so no question repeats).
const C = require('./chapters.cjs');
const {
  chapter,
  times: t,
  tFind,
  tAlg,
  relCode,
  partner,
  countEqual,
  sumOf,
  angleWord,
  simpleComp,
  missingAround,
  adjacent,
  crossXY,
  ratioWord,
} = C;
const {
  polySum,
  polyEach,
  polyMissing,
  polyFindN,
  polyExpr,
  slopeAsk,
  eqSlope,
  yesNo,
  twoPoints,
  standardForm,
  findK,
  findKStandard,
  interceptThrough,
  slopeOfThroughPoints,
} = C;
const { P, MINUS, ANG, figure, INTRO, sg } = C;
const L = require('./lib.cjs');

const ALTS = ['altInterior', 'altExterior'];
const pickAsk = (R) => R.pick(['x', 'i', 'j']);

// ───────── small fixed questions about the figure ─────────
const interior = (k) => (L.POS[k][0] === 'top' ? [3, 4] : [1, 2]).includes(L.POS[k][1]);
const fact = (q, a, steps, check) => P(q, a, steps, { fig: figure(60), _check: check });

/** an angle with an unknown value: vertical, linear pair, right angle */
function simpleX(R, kind) {
  const v = R.int(15, 85);
  if (kind === 'vert') {
    return P(
      `Two vertical angles measure x° and ${v}°. What is x?`,
      v,
      ['Vertical angles are equal.', `x = ${v}.`],
      { _check: () => true },
    );
  }
  if (kind === 'linear') {
    const w = R.int(30, 150);
    return P(
      `Two angles form a linear pair and measure ${w}° and x°. What is x?`,
      180 - w,
      ['A linear pair adds up to 180°.', `${w} + x = 180, so x = ${180 - w}.`],
      { _check: () => w + (180 - w) === 180 },
    );
  }
  return P(
    `${ANG}ABC is a right angle and D is inside it. ${ANG}ABD = ${v}° and ${ANG}DBC = x°. What is x?`,
    90 - v,
    ['A right angle is 90°, so the two parts add up to 90°.', `${v} + x = 90, so x = ${90 - v}.`],
    { _check: () => v + (90 - v) === 90 },
  );
}

// 1. parallel and perpendicular lines
const parallel = () =>
  chapter('parallel', [
    t(4, (R, k) => slopeAsk(R, 'par', k % 2 ? 'frac' : 'int')),
    t(6, (R, k) => slopeAsk(R, 'perp', k % 2 ? 'frac' : 'int')),
    t(3, (R) => eqSlope(R, 'par')),
    t(3, (R) => eqSlope(R, 'perp')),
    t(2, (R) => yesNo(R, 'par')),
    t(2, (R) => yesNo(R, 'perp')),
    t(2, (R) => twoPoints(R, 'par')),
    t(2, (R) => twoPoints(R, 'perp')),
    t(2, (R) => standardForm(R, 'par')),
    t(2, (R) => standardForm(R, 'perp')),
    t(3, (R) => findK(R, 'par')),
    t(3, (R) => findK(R, 'perp')),
    t(5, (R) => interceptThrough(R, 'par')),
    t(5, (R) => interceptThrough(R, 'perp')),
    t(2, (R) => findKStandard(R, 'par')),
    t(2, (R) => findKStandard(R, 'perp')),
    t(2, (R) => slopeOfThroughPoints(R)),
  ]);

// 2. the transversal and its eight angles
const transversal = () =>
  chapter('transversal', [
    t(7, (R, k) =>
      relCode(
        R,
        [
          'altInterior',
          'altExterior',
          'corresponding',
          'consInterior',
          'vertical',
          'linear',
          'consExterior',
        ][k],
      ),
    ),
    t(1, () =>
      fact(
        `${INTRO} How many of the eight angles are interior angles (between the two parallel lines)?`,
        4,
        [
          'Interior means between the two parallel lines.',
          'The interior angles are 3, 4, 5 and 6, so there are 4.',
        ],
        () => [1, 2, 3, 4, 5, 6, 7, 8].filter(interior).length === 4,
      ),
    ),
    t(1, () =>
      fact(
        `${INTRO} How many of the eight angles are exterior angles (outside the two parallel lines)?`,
        4,
        [
          'Exterior means outside the two parallel lines.',
          'The exterior angles are 1, 2, 7 and 8, so there are 4.',
        ],
        () => [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => !interior(k)).length === 4,
      ),
    ),
    t(1, () =>
      fact(
        `${INTRO} How many angles do the two parallel lines and the transversal make in all?`,
        8,
        ['Each crossing makes 4 angles.', 'There are 2 crossings, so 2 × 4 = 8 angles.'],
        () => Object.keys(L.POS).length === 8,
      ),
    ),
    t(1, () =>
      fact(
        `${INTRO} How many of the eight angles lie to the left of the transversal?`,
        4,
        ['Angles 1, 3, 5 and 7 are on the left of the transversal.', 'That is 4 angles.'],
        () => Object.values(L.POS).filter(([, q]) => q === 2 || q === 3).length === 4,
      ),
    ),
    t(5, (R, k) =>
      partner(
        R,
        ['altInterior', 'altExterior', 'corresponding', 'consInterior', 'vertical'][k % 5],
      ),
    ),
    t(10, (R, k) =>
      partner(
        R,
        ['altInterior', 'altExterior', 'corresponding', 'consInterior', 'vertical'][k % 5],
      ),
    ),
    t(8, (R) => relCode(R)),
    t(4, (R) => countEqual(R)),
    t(7, (R) => sumOf(R, R.int(2, 4))),
    t(1, () =>
      fact(
        `${INTRO} What is the sum of all eight angles?`,
        720,
        [
          'The four angles at one crossing make a full turn, 360°.',
          'Two crossings: 2 × 360° = 720°.',
        ],
        () => [1, 2, 3, 4, 5, 6, 7, 8].reduce((s, k) => s + L.geoMeasure(k, 60), 0) > 719.999,
      ),
    ),
    t(1, () =>
      fact(
        `${INTRO} What is the sum of the four interior angles?`,
        360,
        [
          'The interior angles are 3, 4, 5 and 6.',
          'Angles 3 and 4 add to 180° and angles 5 and 6 add to 180°, so the sum is 360°.',
        ],
        () => Math.abs([3, 4, 5, 6].reduce((s, k) => s + L.geoMeasure(k, 60), 0) - 360) < 1e-9,
      ),
    ),
    t(1, () =>
      fact(
        `${INTRO} What is the sum of the four exterior angles?`,
        360,
        [
          'The exterior angles are 1, 2, 7 and 8.',
          'Angles 1 and 2 add to 180° and angles 7 and 8 add to 180°, so the sum is 360°.',
        ],
        () => Math.abs([1, 2, 7, 8].reduce((s, k) => s + L.geoMeasure(k, 60), 0) - 360) < 1e-9,
      ),
    ),
    t(2, (R) => {
      const nones = [];
      for (let i = 1; i <= 8; i += 1)
        for (let j = i + 1; j <= 8; j += 1) if (!L.rel(i, j)) nones.push([i, j]);
      const [i, j] = R.pick(nones);
      return fact(
        `${INTRO} Do ${ANG}${i} and ${ANG}${j} have a named relationship (vertical, linear pair, corresponding, alternate or consecutive)? Type 1 for yes, 0 for no.`,
        0,
        [
          `Check the pairs: ${ANG}${i} and ${ANG}${j} are not vertical, not a linear pair, and not corresponding, alternate or consecutive.`,
          'They have no named relationship, so the answer is 0.',
        ],
        () => !L.rel(i, j),
      );
    }),
  ]);

// 3. alternate interior and exterior angles
const alternate = () =>
  chapter('alternate', [
    t(8, (R) => tFind(R, { rel: 'altInterior' })),
    t(8, (R) => tFind(R, { rel: 'altExterior' })),
    t(9, (R) => tAlg(R, { rel: 'altInterior', ask: pickAsk(R) })),
    t(9, (R) => tAlg(R, { rel: 'altExterior', ask: pickAsk(R) })),
    t(8, (R) => tAlg(R, { rel: R.pick(ALTS), ask: R.pick(['i', 'j']) })),
    t(8, (R) => tFind(R, { twoStep: true })),
  ]);

// 4. corresponding angles
const corresponding = () =>
  chapter('corresponding', [
    t(16, (R) => tFind(R, { rel: 'corresponding' })),
    t(18, (R) => tAlg(R, { rel: 'corresponding', ask: pickAsk(R) })),
    t(8, (R) => tAlg(R, { rel: 'corresponding', ask: R.pick(['i', 'j']) })),
    t(8, (R) => tFind(R, { twoStep: true })),
  ]);

// 5. consecutive interior and vertical angles
const consecutive = () =>
  chapter('consecutive', [
    t(8, (R) => tFind(R, { rel: 'consInterior' })),
    t(8, (R) => tFind(R, { rel: 'vertical' })),
    t(9, (R) => tAlg(R, { rel: 'consInterior', ask: pickAsk(R) })),
    t(9, (R) => tAlg(R, { rel: 'vertical', ask: pickAsk(R) })),
    t(4, (R) => tFind(R, { rel: 'consExterior' })),
    t(4, (R) => tFind(R, { rel: 'linear' })),
    t(4, (R) => tAlg(R, { rel: 'consExterior', ask: pickAsk(R) })),
    t(4, (R) => tAlg(R, { rel: 'linear', ask: pickAsk(R) })),
  ]);

// 6. complementary and supplementary angles
const compSupp = () =>
  chapter('compSupp', [
    t(6, (R) => simpleComp(R, 'comp', 'plain')),
    t(6, (R) => simpleComp(R, 'supp', 'plain')),
    t(2, (R) => simpleComp(R, 'comp', 'word')),
    t(2, (R) => simpleComp(R, 'supp', 'word')),
    t(5, (R) => angleWord('comp', R, 'x')),
    t(4, (R) => angleWord('comp', R, R.pick(['i', 'j']))),
    t(5, (R) => angleWord('supp', R, 'x')),
    t(4, (R) => angleWord('supp', R, R.pick(['i', 'j']))),
    t(4, (R) => ratioWord(R, 'times')),
    t(4, (R) => ratioWord(R, 'more')),
    t(4, (R) => ratioWord(R, 'supp')),
    t(4, (R) => ratioWord(R, 'ratio')),
  ]);

// 7. solving for x
const solveX = () =>
  chapter('solveX', [
    t(4, (R) => simpleX(R, 'vert')),
    t(4, (R) => simpleX(R, 'linear')),
    t(4, (R) => simpleX(R, 'right')),
    t(2, (R) => missingAround(R, 2, 180)),
    t(2, (R) => missingAround(R, 3, 360)),
    t(5, (R) => angleWord('vert', R, 'x')),
    t(5, (R) => angleWord('linear', R, 'x')),
    t(4, (R) => adjacent(R, 90, R.pick(['x', 'i']))),
    t(4, (R) => adjacent(R, 180, R.pick(['x', 'i']))),
    t(8, (R, k) => crossXY(R, ['x', 'y', 'x+y'][k % 3])),
    t(4, (R) => adjacent(R, 90, 'j')),
    t(4, (R) => adjacent(R, 180, 'j')),
  ]);

// 8. finding all the angles
const allAngles = () =>
  chapter('allAngles', [
    t(6, (R) => tFind(R, { direct: true })),
    t(4, (R) => tFind(R, { twoStep: true })),
    t(6, (R) => sumOf(R, 2)),
    t(4, (R) => countEqual(R)),
    t(6, (R) => sumOf(R, 3)),
    t(8, (R) => tAlg(R, { ask: pickAsk(R) })),
    t(8, (R) => tAlg(R, { ask: R.pick(['i', 'j']) })),
    t(4, (R) => sumOf(R, 4)),
    t(4, (R) => tFind(R, { twoStep: true })),
  ]);

// 9. angle sums of polygons
const polygons = () =>
  chapter('polygons', [
    t(8, (R, k) => polySum(R, [6, 7, 8, 9, 10, 11, 12, 13][k])),
    t(4, (R) => polyMissing(R, 3)),
    t(4, (R) => polyMissing(R, 4)),
    t(6, (R, k) => polyEach(R, [5, 6, 8, 9, 10, 12][k])),
    t(6, (R) => polyMissing(R, R.pick([5, 6]))),
    t(6, (R) => polyFindN(R, 'sum')),
    t(4, (R) => polyExpr(R, 3)),
    t(4, (R) => polyExpr(R, 4)),
    t(4, (R) => polyFindN(R, 'each')),
    t(4, (R) => polyMissing(R, R.pick([7, 8]))),
  ]);

// 10. angle word problems with algebra
const wordProblems = () =>
  chapter('wordProblems', [
    t(8, (R) => angleWord('comp', R, R.pick(['i', 'j']))),
    t(8, (R) => angleWord('supp', R, R.pick(['i', 'j']))),
    t(6, (R) => tAlg(R, { rel: 'vertical', ask: 'x' })),
    t(6, (R) => tAlg(R, { rel: 'consInterior', ask: R.pick(['i', 'j']) })),
    t(6, (R) => tAlg(R, { rel: 'altExterior', ask: R.pick(['i', 'j']) })),
    t(8, (R) => tAlg(R, { ask: R.pick(['i', 'j']) })),
    t(4, (R) => crossXY(R, 'x+y')),
    t(4, (R) => adjacent(R, R.pick([90, 180]), R.pick(['i', 'j']))),
  ]);

// 11. the final test
const finalTest = () =>
  chapter('final', [
    t(2, (R) => slopeAsk(R, 'par', 'frac')),
    t(2, (R) => slopeAsk(R, 'perp', 'frac')),
    t(2, (R) => simpleComp(R, 'comp', 'plain')),
    t(2, (R) => simpleComp(R, 'supp', 'plain')),
    t(4, (R) => tFind(R, { direct: true })),
    t(4, (R) => polyEach(R, R.pick([14, 15, 16, 18, 20, 24]))),
    t(6, (R) => tAlg(R, { ask: pickAsk(R) })),
    t(4, (R) => angleWord(R.pick(['comp', 'supp']), R, R.pick(['x', 'i', 'j']))),
    t(4, (R) => polyExpr(R, R.pick([3, 4]))),
    t(4, (R) => interceptThrough(R, R.pick(['par', 'perp']))),
    t(4, (R) => tFind(R, { twoStep: true })),
    t(4, (R) => tAlg(R, { ask: R.pick(['i', 'j']) })),
    t(2, (R) => crossXY(R, R.pick(['x', 'y', 'x+y']))),
    t(2, (R) => polyExpr(R, 4)),
    t(2, (R) => adjacent(R, R.pick([90, 180]), R.pick(['x', 'i', 'j']))),
    t(2, (R) => findK(R, R.pick(['par', 'perp']))),
  ]);

module.exports = {
  parallel,
  transversal,
  alternate,
  corresponding,
  consecutive,
  compSupp,
  solveX,
  allAngles,
  polygons,
  wordProblems,
  finalTest,
  sg,
  MINUS,
};
