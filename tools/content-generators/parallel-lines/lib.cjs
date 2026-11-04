// Shared helpers for the Parallel Lines and Angles generator: a seeded random generator, exact
// fractions, the eight angles of a transversal (with an independent geometric check) and the
// worded steps for each angle relationship.
const MINUS = '−';
const ANG = '∠';
const sg = (n) => (n < 0 ? MINUS + -n : String(n));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

function rng(seed) {
  let a = 0;
  for (const c of seed) a = (a * 31 + c.charCodeAt(0)) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const make = (R) => ({
  int: (lo, hi) => lo + Math.floor(R() * (hi - lo + 1)),
  pick: (xs) => xs[Math.floor(R() * xs.length)],
});

// ───────── answers ─────────
const frac = (n, d = 1) => {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
const ft = (f) => (f.d === 1 ? sg(f.n) : `${sg(f.n)}/${f.d}`);
const fa = (f) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
const ans = (f) => ({ a: fa(f), ...(f.d === 1 ? {} : { form: 'fraction' }) });
const decAns = (x) => ({ a: String(x), ...(Number.isInteger(x) ? {} : { form: 'decimal' }) });

/** "5x + 10", "x − 6", "3x" */
const lin = (a, b, v = 'x') =>
  `${a === 1 ? '' : a}${v}${b === 0 ? '' : b > 0 ? ` + ${b}` : ` ${MINUS} ${-b}`}`;

// ───────── the eight angles ─────────
// 1,2 above the top line (left, right of the transversal), 3,4 below it; 5,6 above the bottom line; 7,8 below it.
const POS = {
  1: ['top', 2],
  2: ['top', 1],
  3: ['top', 3],
  4: ['top', 4],
  5: ['bottom', 2],
  6: ['bottom', 1],
  7: ['bottom', 3],
  8: ['bottom', 4],
};
/** the measure of angle k when angle 2 measures A (angles 2, 3, 6, 7 equal A; the rest are 180 − A) */
const measure = (k, A) => ([2, 3, 6, 7].includes(k) ? A : 180 - A);

/** an independent measure: the angle between the two bounding rays of the quadrant */
function geoMeasure(k, A) {
  const [, quad] = POS[k];
  const t = (A * Math.PI) / 180;
  const u = [Math.cos(t), Math.sin(t)];
  const rays = {
    1: [[1, 0], u],
    2: [u, [-1, 0]],
    3: [
      [-1, 0],
      [-u[0], -u[1]],
    ],
    4: [
      [-u[0], -u[1]],
      [1, 0],
    ],
  }[quad];
  const dot = rays[0][0] * rays[1][0] + rays[0][1] * rays[1][1];
  return (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
}

const REL = {
  vertical: { eq: true, text: 'vertical angles' },
  linear: { eq: false, text: 'a linear pair (they form a straight line)' },
  corresponding: { eq: true, text: 'corresponding angles' },
  altInterior: { eq: true, text: 'alternate interior angles' },
  altExterior: { eq: true, text: 'alternate exterior angles' },
  consInterior: { eq: false, text: 'consecutive (same-side) interior angles' },
  consExterior: { eq: false, text: 'consecutive (same-side) exterior angles' },
};
const CODES = {
  altInterior: 1,
  altExterior: 2,
  corresponding: 3,
  consInterior: 4,
  vertical: 5,
  linear: 6,
  consExterior: 7,
};

/** how angle i and angle j are related, or null when they have no named relationship */
function rel(i, j) {
  if (i === j) return null;
  const [li, qi] = POS[i];
  const [lj, qj] = POS[j];
  if (li === lj) return Math.abs(qi - qj) === 2 ? 'vertical' : 'linear';
  const [top, bottom] = li === 'top' ? [qi, qj] : [qj, qi];
  if (top === bottom) return 'corresponding';
  if ((top === 3 && bottom === 1) || (top === 4 && bottom === 2)) return 'altInterior';
  if ((top === 3 && bottom === 2) || (top === 4 && bottom === 1)) return 'consInterior';
  if ((top === 1 && bottom === 3) || (top === 2 && bottom === 4)) return 'altExterior';
  if ((top === 1 && bottom === 4) || (top === 2 && bottom === 3)) return 'consExterior';
  return null;
}

/** the figure with all eight angles numbered; the transversal leans like angle 2 */
function figure(A) {
  const marks = Object.entries(POS).map(([k, [line, quad]]) => ({ line, quad, text: String(k) }));
  return { kind: 'transversal', angle: Math.max(28, Math.min(152, A)), marks };
}
const INTRO = 'In the figure, the two horizontal lines are parallel.';

/** the steps that take angle i (known) to angle j, through a shared angle when they are not directly related */
function path(i, j) {
  if (rel(i, j)) return [i, j];
  for (let k = 1; k <= 8; k += 1) if (rel(i, k) && rel(k, j)) return [i, k, j];
  throw new Error('no path');
}
function findSteps(i, j, A) {
  const p = path(i, j);
  const steps = [];
  for (let s = 0; s < p.length - 1; s += 1) {
    const [a, b] = [p[s], p[s + 1]];
    const r = rel(a, b);
    const va = measure(a, A);
    const vb = measure(b, A);
    steps.push(
      REL[r].eq
        ? `${ANG}${a} and ${ANG}${b} are ${REL[r].text}, so they are equal: ${ANG}${b} = ${va}°.`
        : `${ANG}${a} and ${ANG}${b} are ${REL[r].text}, so they add up to 180°: ${ANG}${b} = 180° ${MINUS} ${va}° = ${vb}°.`,
    );
  }
  return steps;
}

/** pairs of angles with a given relationship, as [i, j] with i < j */
function pairsOf(r) {
  const out = [];
  for (let i = 1; i <= 8; i += 1)
    for (let j = i + 1; j <= 8; j += 1) if (rel(i, j) === r) out.push([i, j]);
  return out;
}

module.exports = {
  MINUS,
  ANG,
  sg,
  rng,
  make,
  frac,
  ft,
  fa,
  ans,
  decAns,
  lin,
  POS,
  measure,
  geoMeasure,
  REL,
  CODES,
  rel,
  figure,
  INTRO,
  path,
  findSteps,
  pairsOf,
  gcd,
};
