// Builds the Equations with Fractions study-guide problem files (psat-design.md). Every equation is built
// from a chosen solution, then solved again by exact fraction arithmetic and by plugging the answer back
// into both sides, so every answer is checked three ways. Typed answers are whole numbers or fractions.
const fs = require('fs');
const path = require('path');
const { sg } = require('../quadratics/lib.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const M = '−';
const ORDER = ['lcm', 'clear', 'solve', 'single', 'cross', 'parens', 'check'];
// Florida B.E.S.T. codes, checked against FLDOE material: MA.6.NSO.3.1 (GCF and LCM) and MA.8.AR.2.1
// (multi-step linear equations with rational coefficients, variables on both sides). A teacher should
// still check that each chapter fits its code.
const STD = {
  lcm: 'MA.6.NSO.3.1',
  clear: 'MA.8.AR.2.1',
  solve: 'MA.8.AR.2.1',
  single: 'MA.8.AR.2.1',
  cross: 'MA.8.AR.2.1',
  parens: 'MA.8.AR.2.1',
  check: 'MA.8.AR.2.1',
};

// The video's own examples stay in the notes. No practice question may repeat one.
const VIDEO = [
  '3x/4 − 2/3 = 5/6',
  'x/2 + 4/5 = 2x/5 − 7/10',
  'x/4 − 2 = x/8 + 3',
  '(3x + 5)/11 = −2',
  '(3x − 4)/5 = (x + 1)/4',
  '(x + 2)/6 − (x − 4)/8 = 1',
  '(x − 7)/3 = x/5 + 2',
  '(2x + 1)/9 + 3/4 = −(x + 5)/6',
  '9x − 8 = 10',
  '5x + 8 = 2x − 7',
  '2x − 16 = x + 8',
];
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const banned = (q) => VIDEO.some((v) => norm(q).includes(v));
// LCM sets used in the video (sorted).
const VIDEO_LCM = new Set(['3,4,6', '2,5,10', '4,8', '6,8', '3,5', '4,6,9', '3,4,6', '2,3,4']);

// ───────── answers and text ─────────
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm2 = (a, b) => (a / gcd(a, b)) * b;
/** An exact fraction [n, d] in lowest terms with d > 0. */
const q = (n, d = 1) => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
};
const qadd = ([a, b], [c, d]) => q(a * d + c * b, b * d);
const qsub = ([a, b], [c, d]) => q(a * d - c * b, b * d);
const qmul = ([a, b], [c, d]) => q(a * c, b * d);
const qeq = ([a, b], [c, d]) => a === c && b === d;
const qt = ([n, d]) => (d === 1 ? sg(n) : `${sg(n)}/${d}`);
const I = (n) => {
  const v = n === 0 ? 0 : n;
  return { a: String(v), disp: sg(v), val: v };
};
function F([n, d]) {
  return {
    a: d === 1 ? String(n) : `${n}/${d}`,
    disp: d === 1 ? sg(n) : `${sg(n)}/${d}`,
    val: n / d,
    ...(d === 1 ? {} : { form: 'fraction' }),
  };
}
function P(question, ans, steps, extra = {}) {
  return {
    q: question,
    a: ans.a,
    ...(ans.form ? { form: ans.form } : {}),
    val: ans.val,
    steps: [...steps, `Answer: ${ans.disp}`],
    ...extra,
  };
}
const par = (n) => (n < 0 ? `(${sg(n)})` : String(n));
const askF = (z) => (z[1] === 1 ? '' : ' Write it as a fraction.');
const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n) =>
  String(n)
    .split('')
    .map((d) => SUPD[+d])
    .join('');
const listT = (xs) =>
  xs.length <= 1 ? String(xs[0]) : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const YN = 'Type 1 for yes, 0 for no.';

// ───────── terms and equations ─────────
const coefT = (a) => (a === 1 ? 'x' : a === -1 ? `${M}x` : `${sg(a)}x`);
const lin = (p, c) => `${coefT(p)}${c > 0 ? ` + ${c}` : c < 0 ? ` ${M} ${-c}` : ''}`;
/** a·x/d */
const fx = (a, d) => ({
  n: Math.abs(a),
  neg: a < 0,
  t: `${Math.abs(a) === 1 ? '' : Math.abs(a)}x/${d}`,
  a: q(a, d),
  b: q(0),
  den: d,
  clear: (L) => `${(Math.abs(a) * L) / d === 1 ? '' : (Math.abs(a) * L) / d}x`,
});
/** a·x */
const ix = (a) => ({
  neg: a < 0,
  t: `${Math.abs(a) === 1 ? '' : Math.abs(a)}x`,
  a: q(a),
  b: q(0),
  den: 1,
  clear: (L) => `${Math.abs(a) * L === 1 ? '' : Math.abs(a) * L}x`,
});
/** a constant, a whole number or a fraction */
const cn = (n, d = 1) => {
  const f = q(n, d);
  return {
    neg: f[0] < 0,
    t: f[1] === 1 ? `${Math.abs(f[0])}` : `${Math.abs(f[0])}/${f[1]}`,
    a: q(0),
    b: f,
    den: f[1],
    clear: (L) => String((Math.abs(f[0]) * L) / f[1]),
  };
};
/** (p·x + c)/d, optionally with a minus sign in front of the whole fraction */
const pf = (p, c, d, neg = false) => ({
  neg,
  t: `(${lin(p, c)})/${d}`,
  a: q(neg ? -p : p, d),
  b: q(neg ? -c : c, d),
  den: d,
  clear: (L) => `${L / d === 1 ? '' : L / d}(${lin(p, c)})`,
});
/** k(p·x + c) with a whole-number multiplier */
const pm = (k, p, c) => ({
  neg: k < 0,
  t: `${Math.abs(k) === 1 ? '' : Math.abs(k)}(${lin(p, c)})`,
  a: q(k * p),
  b: q(k * c),
  den: 1,
  clear: (L) => `${Math.abs(k) * L}(${lin(p, c)})`,
});
const sideT = (ts) =>
  ts.map((t, i) => (i === 0 ? `${t.neg ? M : ''}${t.t}` : ` ${t.neg ? M : '+'} ${t.t}`)).join('');
const sideC = (ts, L) =>
  ts
    .map((t, i) =>
      i === 0 ? `${t.neg ? M : ''}${t.clear(L)}` : ` ${t.neg ? M : '+'} ${t.clear(L)}`,
    )
    .join('');
const eqT = (e) => `${sideT(e.lhs)} = ${sideT(e.rhs)}`;
const sideAB = (ts) => ts.reduce(([a, b], t) => [qadd(a, t.a), qadd(b, t.b)], [q(0), q(0)]);
const sideAt = (ts, x) => ts.reduce((s, t) => qadd(s, qadd(qmul(t.a, x), t.b)), q(0));
/** Linear text from integer parts a·x + b. */
const linT = (a, b) => (a === 0 ? sg(b) : lin(a, b));

/** Solve an equation exactly and write the steps. Returns null if there is no single solution. */
function analyse(e) {
  const dens = [...e.lhs, ...e.rhs].map((t) => t.den).filter((d) => d > 1);
  const L = dens.length ? dens.reduce(lcm2) : 1;
  const [Al, Bl] = sideAB(e.lhs);
  const [Ar, Br] = sideAB(e.rhs);
  const toI = ([n, d]) => (n * L) / d;
  const al = toI(Al);
  const bl = toI(Bl);
  const ar = toI(Ar);
  const br = toI(Br);
  if (![al, bl, ar, br].every(Number.isInteger)) return null;
  const Pc = al - ar;
  const Qv = br - bl;
  if (Pc === 0) return null;
  const x = q(Qv, Pc);
  // Plug back in: both sides must agree.
  if (!qeq(sideAt(e.lhs, x), sideAt(e.rhs, x))) throw new Error(`bad solution for ${eqT(e)}`);
  const distinct = [...new Set(dens)];
  const steps = [];
  const cleared = `${sideC(e.lhs, L)} = ${sideC(e.rhs, L)}`;
  if (L > 1) {
    steps.push(
      `The denominators are ${listT(distinct)}, so the least common multiple is ${L}.`,
      `Multiply every term by ${L}: ${cleared}.`,
    );
  }
  const combined = `${linT(al, bl)} = ${linT(ar, br)}`;
  if (combined !== cleared)
    steps.push(
      `${L > 1 ? 'Distribute and combine' : 'Combine'} like terms on each side: ${combined}.`,
    );
  const collect = `${coefT(Pc)} = ${sg(Qv)}`;
  if (ar === 0 && bl === 0 && Pc === al) {
    // Already in the form Px = Q.
  } else steps.push(`Collect the x terms on one side and the numbers on the other: ${collect}.`);
  if (Pc === 1) {
    if (steps.length === 0 || !steps[steps.length - 1].includes(collect))
      steps.push(`So x = ${qt(x)}.`);
  } else steps.push(`Divide both sides by ${sg(Pc)}: x = ${qt(x)}.`);
  return { L, x, steps, cleared, al, bl, ar, br, Pc, Qv, dens };
}
/** Add the constant that makes x the solution: lhs value at x minus rhsPartial value at x. */
function finish(lhs, rhsPartial, x, maxDen, p) {
  const c = qsub(sideAt(lhs, x), sideAt(rhsPartial, x));
  if (c[0] === 0 || c[1] > maxDen) return null;
  // Keep the numbers friendly: a small constant and a small solution.
  if (Math.abs(c[0] / c[1]) > (p ? 30 : 20) || Math.abs(x[0] / x[1]) > (p ? 40 : 30)) return null;
  const e = { lhs, rhs: [...rhsPartial, cn(c[0], c[1])] };
  const r = analyse(e);
  if (!r || !qeq(r.x, x)) return null;
  return { e, r };
}

// ───────── seeded random numbers, so a rebuild gives the same questions ─────────
function rng(seed) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mk = (r) => ({
  ri: (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)),
  nz: (lo, hi) => {
    let v = 0;
    while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1));
    return v;
  },
  pk: (a) => a[Math.floor(r() * a.length)],
});
function many(n, f) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i < n * 400 && out.length < n; i += 1) {
    const it = f(i);
    if (!it || seen.has(it.q)) continue;
    seen.add(it.q);
    out.push(it);
  }
  return out;
}
function mix(...lists) {
  const out = [];
  for (let i = 0; lists.some((l) => i < l.length); i += 1)
    for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}
function pick(items, n, seen, label) {
  const out = [];
  for (const item of items) {
    if (!item || seen.has(item.q) || banned(item.q)) continue;
    if (!Number.isFinite(item.val)) continue;
    if (item.steps.some((s) => s.includes('  ') || s.trim() === '')) continue;
    seen.add(item.q);
    out.push(item);
    if (out.length === n) return out;
  }
  throw new Error(`${label}: only ${out.length} of ${n}`);
}
function bands({ warm, core, chal }, label, seen) {
  return [
    ...pick(warm, 8, seen, `${label} warm`),
    ...pick(core, 9, seen, `${label} core`),
    ...pick(chal, 8, seen, `${label} challenge`),
  ];
}
const setup = (L, name) => ({ p: L === 'psat', R: mk(rng(`${L}:${name}`)) });

// ───────── equation makers (each returns {e, r} or null) ─────────
const DEN_MS = [2, 3, 4, 5, 6, 8, 10];
const DEN_P = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
const dens = (p) => (p ? DEN_P : DEN_MS);
const maxDen = (p) => (p ? 12 : 10);
const maxL = (p) => (p ? 72 : 30);
/** a/d is in lowest terms, and a, c and d have no common factor (no hidden simplifying). */
const cop = (a, d) => gcd(Math.abs(a), d) === 1;
const cop3 = (a, c, d) => gcd(gcd(Math.abs(a), Math.abs(c)), d) === 1;
const okL = (res, p) => (res && res.r.L <= maxL(p) ? res : null);

/** Fractions on one side: ax/d1 ± b/d2 = c */
function genA(R, p) {
  const d1 = R.pk(dens(p));
  const d2 = R.pk(dens(p));
  const a = R.nz(p ? -7 : 1, p ? 7 : 3);
  const b = R.nz(p ? -9 : -5, p ? 9 : 5);
  if (gcd(b, d2) !== 1 || !cop(a, d1)) return null;
  const x = q(R.nz(-12, 12));
  return okL(finish([fx(a, d1), cn(b, d2)], [], x, maxDen(p), p), p);
}
/** Fractions with the variable on both sides: ax/d1 + b/d2 = cx/d3 + k */
function genB(R, p) {
  const d1 = R.pk(dens(p));
  const d3 = R.pk(dens(p));
  const d2 = R.pk(dens(p));
  const a1 = R.nz(p ? -7 : 1, p ? 7 : 4);
  const a2 = R.nz(p ? -7 : 1, p ? 7 : 4);
  const b = R.nz(p ? -9 : -5, p ? 9 : 5);
  if (qeq(q(a1, d1), q(a2, d3)) || gcd(b, d2) !== 1 || !cop(a1, d1) || !cop(a2, d3)) return null;
  const x = q(R.nz(-10, 10));
  return okL(finish([fx(a1, d1), cn(b, d2)], [fx(a2, d3)], x, maxDen(p), p), p);
}
/** Whole-number terms too: ax/d1 + b = cx/d3 + k (the numbers must be multiplied as well) */
function genC(R, p) {
  const d1 = R.pk(dens(p));
  const d3 = R.pk(dens(p));
  const a1 = R.nz(p ? -7 : 1, p ? 7 : 4);
  const a2 = R.nz(p ? -7 : 1, p ? 7 : 4);
  const b = R.nz(p ? -12 : -9, p ? 12 : 9);
  if (qeq(q(a1, d1), q(a2, d3)) || d1 === d3 || !cop(a1, d1) || !cop(a2, d3)) return null;
  const x = q(R.nz(-4, 4) * lcm2(d1, d3));
  const res = finish([fx(a1, d1), cn(b)], [fx(a2, d3)], x, 1, p);
  return okL(res, p);
}
/** One fraction equal to a number: (px + c)/d = k */
function genD(R, p) {
  const d = R.pk(p ? [3, 4, 5, 6, 7, 8, 9, 11, 12] : [3, 4, 5, 6, 7, 8, 9]);
  const pp = R.ri(1, p ? 7 : 4);
  const x = R.nz(-9, 9);
  const k = R.nz(-7, 7);
  const c = k * d - pp * x;
  if (c === 0 || !cop3(pp, c, d) || Math.abs(c) > 40) return null;
  const e = { lhs: [pf(pp, c, d)], rhs: [cn(k)] };
  const r = analyse(e);
  return r && qeq(r.x, q(x)) ? { e, r } : null;
}
/** Two fractions with brackets: (a1x + c1)/d1 ± (a2x + c2)/d2 = k */
function genE(R, p) {
  const d1 = R.pk(dens(p));
  const d2 = R.pk(dens(p));
  if (d1 === d2) return null;
  const a1 = R.ri(1, p ? 4 : 2);
  const a2 = R.ri(1, p ? 4 : 2);
  const c1 = R.nz(-9, 9);
  const c2 = R.nz(-9, 9);
  const neg = R.ri(0, 1) === 1;
  if (!cop3(a1, c1, d1) || !cop3(a2, c2, d2)) return null;
  const x = q(R.nz(-10, 10));
  return okL(finish([pf(a1, c1, d1), pf(a2, c2, d2, neg)], [], x, maxDen(p), p), p);
}
/** A fraction with brackets on one side and a whole-number multiple on the other. */
function genH(R, p) {
  const d = R.pk(dens(p));
  const a = R.ri(1, p ? 5 : 3);
  const c = R.nz(-9, 9);
  const k = p ? R.pk([-4, -3, -2, 2, 3, 4]) : R.ri(2, 4);
  const c2 = R.nz(-6, 6);
  if (!cop3(a, c, d)) return null;
  const x = q(R.nz(-8, 8));
  return okL(finish([pf(a, c, d)], [pm(k, 1, c2)], x, maxDen(p), p), p);
}
/** A proportion: (ax + b)/d1 = (cx + e)/d2 */
function genF(R, p) {
  const d1 = R.pk(dens(p));
  const d2 = R.pk(dens(p));
  if (d1 === d2) return null;
  const a = R.ri(1, p ? 6 : 4);
  const cc = R.ri(1, p ? 6 : 4);
  if (a * d2 === cc * d1) return null;
  const k = R.nz(-3, 3);
  const x = R.nz(-6, 6);
  const b = k * d1 - a * x;
  const e = k * d2 - cc * x;
  if (b === 0 || e === 0 || Math.abs(b) > 25 || Math.abs(e) > 25) return null;
  if (!cop3(a, b, d1) || !cop3(cc, e, d2)) return null;
  const eq = { lhs: [pf(a, b, d1)], rhs: [pf(cc, e, d2)] };
  const r = analyse(eq);
  return r && qeq(r.x, q(x)) ? { e: eq, r } : null;
}
/** Plain equations without fractions: ax + b = cx + d */
function genPlain(R, p) {
  const a = R.ri(2, p ? 12 : 8);
  const c = R.ri(1, p ? 9 : 5);
  if (a === c) return null;
  const b = R.nz(-15, 15);
  const x = q(R.nz(-9, 9));
  const lhs = [ix(a), cn(b)];
  const rhsP = [ix(c)];
  return finish(lhs, rhsP, x, 1, p);
}
/** Fractional solutions: build the equation around x = u/v. */
function genFracAnswer(R, p) {
  const d1 = R.pk(dens(p));
  const d2 = R.pk(dens(p));
  const a1 = R.nz(1, p ? 7 : 4);
  const a2 = R.nz(1, p ? 7 : 4);
  const b = R.nz(-9, 9);
  const v = R.pk([2, 3, 4]);
  const u = R.nz(-9, 9);
  if (gcd(u, v) !== 1 || qeq(q(a1, d1), q(a2, d2)) || !cop(a1, d1) || !cop(a2, d2)) return null;
  const x = q(u, v);
  const res = finish([fx(a1, d1), cn(b)], [fx(a2, d2)], x, maxDen(p), p);
  return res && res.r.L <= (p ? 72 : 40) ? res : null;
}

const eqProblem = (res, lead = 'Solve') => {
  const { e, r } = res;
  return P(`${lead} ${eqT(e)}.${askF(r.x)}`, F(r.x), r.steps);
};

// ───────── LCM helpers ─────────
function fac(n) {
  const out = [];
  let m = n;
  for (let f = 2; f * f <= m; f += 1) {
    let c = 0;
    while (m % f === 0) {
      m /= f;
      c += 1;
    }
    if (c) out.push([f, c]);
  }
  if (m > 1) out.push([m, 1]);
  return out;
}
const facT = (n) =>
  fac(n)
    .map(([f, c]) => (c === 1 ? String(f) : `${f}${sup(c)}`))
    .join(' × ');
function lcmSteps(nums, force = false) {
  const L = nums.reduce(lcm2);
  if (!force && nums.every((n) => L / n <= 8)) {
    const lists = nums.map(
      (n) =>
        `Multiples of ${n}: ${Array.from({ length: L / n }, (_, i) => n * (i + 1)).join(', ')}.`,
    );
    return [...lists, `The smallest number in every list is ${L}.`];
  }
  const hi = new Map();
  nums.forEach((n) => fac(n).forEach(([f, c]) => hi.set(f, Math.max(hi.get(f) ?? 0, c))));
  const parts = [...hi.entries()].toSorted((x, y) => x[0] - y[0]);
  return [
    ...nums.map((n) => `${n} = ${facT(n)}.`),
    `Take the highest power of each prime: ${parts.map(([f, c]) => (c === 1 ? f : `${f}${sup(c)}`)).join(' × ')}.`,
    `Multiply them: ${L}.`,
  ];
}
const lcmKey = (nums) => nums.toSorted((a, b) => a - b).join(',');

// ───────── 1. Finding the LCM ─────────
function lcm(L) {
  const { p, R } = setup(L, 'lcm');
  const top = p ? 24 : 12;
  const pair = many(16, () => {
    const a = R.ri(2, top);
    const b = R.ri(2, top);
    if (a === b || a % b === 0 || b % a === 0 || VIDEO_LCM.has(lcmKey([a, b]))) return null;
    const l = lcm2(a, b);
    const word = R.pk([
      `What is the least common multiple of ${a} and ${b}?`,
      `What is the smallest number that both ${a} and ${b} go into?`,
      `Find the LCM of ${a} and ${b}.`,
    ]);
    return P(word, I(l), lcmSteps([a, b]));
  });
  const multiple = many(10, () => {
    const a = R.ri(2, p ? 15 : 9);
    const k = R.ri(2, 4);
    const b = a * k;
    if (b > 40) return null;
    return P(`What is the LCM of ${a} and ${b}?`, I(b), [
      `${b} is a multiple of ${a} (${a} × ${k} = ${b}).`,
      `So the smallest number both go into is ${b}.`,
    ]);
  });
  const triple = many(12, () => {
    const nums = [R.ri(2, p ? 12 : 8), R.ri(2, p ? 12 : 8), R.ri(2, p ? 12 : 8)];
    if (new Set(nums).size < 3 || VIDEO_LCM.has(lcmKey(nums))) return null;
    const l = nums.reduce(lcm2);
    if (l > (p ? 120 : 60)) return null;
    return P(`What is the least common multiple of ${listT(nums)}?`, I(l), lcmSteps(nums));
  });
  const fromEq = many(12, () => {
    const g = R.pk([genA, genB, genC, genE]);
    const res = g(R, p);
    if (!res || res.r.L === 1) return null;
    return P(
      `What is the least common multiple of the denominators in ${eqT(res.e)}?`,
      I(res.r.L),
      [
        `The denominators are ${listT([...new Set(res.r.dens)])}.`,
        ...lcmSteps([...new Set(res.r.dens)]).slice(-1),
      ],
    );
  });
  const factored = many(12, () => {
    const a = R.ri(2, p ? 36 : 18);
    const b = R.ri(2, p ? 36 : 18);
    const prime = (n) => fac(n).length === 1 && fac(n)[0][1] === 1;
    if (a === b || prime(a) || prime(b) || VIDEO_LCM.has(lcmKey([a, b]))) return null;
    const l = lcm2(a, b);
    return P(
      `${a} = ${facT(a)} and ${b} = ${facT(b)}. What is the LCM of ${a} and ${b}?`,
      I(l),
      lcmSteps([a, b], true).slice(-2),
    );
  });
  const warm = mix(pair, multiple, triple);
  const core = mix(fromEq, pair.slice(8), factored, triple.slice(6));
  const smallestN = many(10, () => {
    const a = R.ri(2, p ? 12 : 9);
    const n = R.ri(2, p ? 30 : 16);
    const l = lcm2(a, n);
    let best = 0;
    for (let m = 1; m <= l; m += 1)
      if (lcm2(a, m) === l) {
        best = m;
        break;
      }
    if (best === n || best < 2) return null;
    return P(
      `What is the smallest positive whole number n for which the LCM of ${a} and n is ${l}?`,
      I(best),
      [
        `n must go into ${l}, and ${a} and n together must need ${l}.`,
        `Test small divisors of ${l}: the smallest one that works is ${best}.`,
      ],
    );
  });
  const cycle = many(10, () => {
    const a = R.ri(3, p ? 15 : 10);
    const b = R.ri(3, p ? 15 : 10);
    if (a === b || a % b === 0 || b % a === 0) return null;
    const l = lcm2(a, b);
    if (l > 150) return null;
    return P(
      `One bus comes every ${a} minutes and another every ${b} minutes. They both leave together now. After how many minutes do they next leave together?`,
      I(l),
      [`They leave together again at the LCM of ${a} and ${b}.`, ...lcmSteps([a, b]).slice(-1)],
    );
  });
  const sumFac = many(10, () => {
    const a = R.pk([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60]);
    const b = R.pk([8, 9, 10, 14, 15, 16, 21, 25, 27, 32]);
    if (a % b === 0) return null;
    const l = lcm2(a, b);
    const f = fac(l).reduce((s, [, c]) => s + c, 0);
    return P(
      `The LCM of ${a} and ${b} is written as a product of primes. How many prime factors does it have, counting repeats?`,
      I(f),
      [
        ...lcmSteps([a, b]).slice(-3),
        `${l} = ${facT(l)}, which has ${f} prime factors counting repeats.`,
      ],
    );
  });
  const chal = mix(smallestN, cycle, sumFac, fromEq.slice(6), triple.slice(6));
  return { warm, core, chal };
}

// ───────── 2. Clearing fractions ─────────
function clear(L) {
  const { p, R } = setup(L, 'clear');
  const mul = many(14, () => {
    const d = R.pk(dens(p));
    const n = R.nz(-(p ? 9 : 5), p ? 9 : 5);
    const m = R.ri(2, p ? 6 : 3);
    const Lc = d * m;
    if (Lc > (p ? 60 : 30) || gcd(n, d) !== 1) return null;
    return P(`What is ${Lc} × (${sg(n)}/${d})?`, I((n * Lc) / d), [
      `${Lc} ÷ ${d} = ${Lc / d}.`,
      `${Lc / d} × ${par(n)} = ${sg((n * Lc) / d)}.`,
    ]);
  });
  const which = many(14, () => {
    const g = R.pk([genA, genB, genC]);
    const res = g(R, p);
    if (!res || res.r.L === 1) return null;
    return P(
      `By what number should you multiply every term of ${eqT(res.e)} to clear the fractions?`,
      I(res.r.L),
      [
        `The denominators are ${listT([...new Set(res.r.dens)])}.`,
        `Their least common multiple is ${res.r.L}.`,
      ],
    );
  });
  const coefAfter = many(14, () => {
    const g = R.pk([genA, genB, genC]);
    const res = g(R, p);
    if (!res || res.r.L === 1) return null;
    const terms = [...res.e.lhs, ...res.e.rhs].filter((t) => t.n !== undefined);
    if (!terms.length) return null;
    const t = R.pk(terms);
    const c = Math.abs((t.a[0] * res.r.L) / t.a[1]);
    return P(
      `Multiply every term of ${eqT(res.e)} by ${res.r.L}. The term ${t.neg ? M : ''}${t.t} becomes ${t.neg ? M : ''}cx. What is c?`,
      I(c),
      [`${res.r.L} ÷ ${t.den} = ${res.r.L / t.den}.`, `${res.r.L / t.den} × ${t.n} = ${c}.`],
    );
  });
  const whole = many(14, () => {
    const res = genC(R, p);
    if (!res) return null;
    const t = res.e.lhs.find((x) => x.a[0] === 0);
    const val = Math.abs(t.b[0]);
    return P(
      `In ${eqT(res.e)}, every term is multiplied by ${res.r.L}, including the whole numbers. What does the number ${t.neg ? M : ''}${val} on the left become?`,
      I(t.neg ? -val * res.r.L : val * res.r.L),
      [
        `Every term must be multiplied, even the ones without fractions.`,
        `${t.neg ? M : ''}${val} × ${res.r.L} = ${sg(t.neg ? -val * res.r.L : val * res.r.L)}.`,
      ],
    );
  });
  const rhsNum = many(12, () => {
    const res = genA(R, p);
    if (!res || res.r.L === 1) return null;
    const c = res.e.rhs[0];
    const v = (c.b[0] * res.r.L) / c.b[1];
    return P(
      `Multiply every term of ${eqT(res.e)} by ${res.r.L}. What number is on the right side now?`,
      I(v),
      [`The right side is ${qt(c.b)}.`, `${qt(c.b)} × ${res.r.L} = ${sg(v)}.`],
    );
  });
  const warm = mix(mul, which, mul.slice(7));
  const core = mix(which.slice(5), coefAfter, whole, rhsNum);
  const full = many(14, () => {
    const g = R.pk([genB, genC, genE]);
    const res = g(R, p);
    if (!res || res.r.L === 1) return null;
    return P(
      `Multiply every term of ${eqT(res.e)} by the LCM of the denominators. What is the coefficient of x on the left side after you combine like terms?`,
      I(res.r.al),
      res.r.steps.slice(0, 3),
    );
  });
  const chal = mix(full, rhsNum.slice(5), whole.slice(6), coefAfter.slice(6));
  return { warm, core, chal };
}

// ───────── 3. Solving the fraction-free equation ─────────
function solve(L) {
  const { p, R } = setup(L, 'solve');
  const plain = many(14, () => {
    const res = genPlain(R, p);
    return res ? eqProblem(res) : null;
  });
  const one = many(16, () => {
    const res = genA(R, p);
    return res ? eqProblem(res) : null;
  });
  const both = many(16, () => {
    const res = genB(R, p);
    return res ? eqProblem(res) : null;
  });
  const whole = many(16, () => {
    const res = genC(R, p);
    return res ? eqProblem(res) : null;
  });
  const frac = many(14, () => {
    const res = genFracAnswer(R, p);
    return res ? eqProblem(res) : null;
  });
  const warm = mix(plain, one);
  const core = mix(one.slice(5), both, whole);
  const chal = mix(both.slice(6), whole.slice(6), frac);
  return { warm, core, chal };
}

// ───────── 4. One fraction ─────────
function single(L) {
  const { p, R } = setup(L, 'single');
  const simple = many(14, () => {
    const d = R.pk(p ? [3, 4, 5, 6, 7, 8, 9, 12] : [2, 3, 4, 5, 6, 8]);
    const a = R.ri(1, p ? 5 : 3);
    const k = R.nz(-9, 9);
    if (!cop(a, d)) return null;
    const e = { lhs: [fx(a, d)], rhs: [cn(k)] };
    const r = analyse(e);
    return r ? eqProblem({ e, r }) : null;
  });
  const bracket = many(16, () => {
    const res = genD(R, p);
    return res ? eqProblem(res) : null;
  });
  const times = many(12, () => {
    const res = genD(R, p);
    if (!res) return null;
    const d = res.e.lhs[0].den;
    return P(
      `What number should you multiply both sides of ${eqT(res.e)} by to remove the fraction?`,
      I(d),
      [`The only denominator is ${d}.`, `Multiplying both sides by ${d} cancels it.`],
    );
  });
  const rhsAfter = many(12, () => {
    const res = genD(R, p);
    if (!res) return null;
    const d = res.e.lhs[0].den;
    const k = res.e.rhs[0].b[0];
    return P(
      `Multiply both sides of ${eqT(res.e)} by ${d}. What is the right side now?`,
      I(k * d),
      [
        `The left side becomes ${lin((res.e.lhs[0].a[0] * d) / res.e.lhs[0].a[1], (res.e.lhs[0].b[0] * d) / res.e.lhs[0].b[1])}.`,
        `The right side is ${sg(k)} × ${d} = ${sg(k * d)}.`,
      ],
    );
  });
  const withNum = many(14, () => {
    const d = R.pk(p ? [3, 4, 5, 6, 8] : [2, 3, 4, 5]);
    const a = R.ri(1, p ? 5 : 3);
    const b = R.nz(-9, 9);
    const x = R.nz(-9, 9);
    const k = q(a * x, d);
    const c = qadd(k, q(b));
    if (c[1] !== 1 || !cop(a, d) || Math.abs(c[0]) > 25) return null;
    const e = { lhs: [fx(a, d), cn(b)], rhs: [cn(c[0])] };
    const r = analyse(e);
    return r && qeq(r.x, q(x)) ? eqProblem({ e, r }) : null;
  });
  const fracAns = many(14, () => {
    const d = R.pk([3, 4, 5, 6, 7]);
    const pp = R.ri(2, 5);
    const c = R.nz(-9, 9);
    const k = R.nz(-6, 6);
    if (pp === d) return null;
    const e = { lhs: [pf(pp, c, d)], rhs: [cn(k)] };
    const r = analyse(e);
    return r && r.x[1] !== 1 ? eqProblem({ e, r }) : null;
  });
  const warm = mix(simple, times, simple.slice(6));
  const core = mix(bracket, rhsAfter, withNum, bracket.slice(6));
  const chal = mix(fracAns, bracket.slice(8), withNum.slice(5), rhsAfter.slice(6));
  return { warm, core, chal };
}

// ───────── 5. Proportions and cross multiplication ─────────
function cross(L) {
  const { p, R } = setup(L, 'cross');
  const simple = many(16, () => {
    const a = R.pk(p ? [3, 4, 5, 6, 7, 8, 9, 12] : [2, 3, 4, 5, 6, 8, 10]);
    const b = R.ri(2, p ? 12 : 9);
    const c = R.pk(p ? [3, 4, 5, 6, 7, 8, 9] : [2, 3, 4, 5, 6]);
    if (a === c || gcd(b, c) !== 1) return null;
    const x = q(a * b, c);
    return P(`Solve x/${a} = ${b}/${c}.${askF(x)}`, F(x), [
      `Cross multiply: ${c} × x = ${a} × ${b}.`,
      `${c}x = ${a * b}.`,
      `Divide by ${c}: x = ${qt(x)}.`,
    ]);
  });
  const down = many(14, () => {
    const a = R.ri(2, p ? 12 : 9);
    const b = R.ri(2, p ? 12 : 9);
    const c = R.ri(2, p ? 12 : 9);
    if (a === b || gcd(b, c) !== 1) return null;
    const x = q(a * c, b);
    return P(`Solve ${a}/x = ${b}/${c}.${askF(x)}`, F(x), [
      `Cross multiply: ${a} × ${c} = ${b} × x.`,
      `${a * c} = ${b}x.`,
      `Divide by ${b}: x = ${qt(x)}.`,
    ]);
  });
  const setUp = many(12, () => {
    const a = R.ri(2, 12);
    const b = R.ri(2, 12);
    const c = R.ri(2, 12);
    if (a === c || gcd(b, c) !== 1) return null;
    return P(`Cross multiply x/${a} = ${b}/${c} to get ${c}x = n. What is n?`, I(a * b), [
      `Cross multiplying: ${c} × x = ${a} × ${b}.`,
      `So n = ${a} × ${b} = ${a * b}.`,
    ]);
  });
  const bracket = many(18, () => {
    const res = genF(R, p);
    if (!res) return null;
    const { e } = res;
    const l = e.lhs[0];
    const r2 = e.rhs[0];
    const [pa, pb] = [(l.a[0] * l.den) / l.a[1], (l.b[0] * l.den) / l.b[1]];
    const [pc, pd] = [(r2.a[0] * r2.den) / r2.a[1], (r2.b[0] * r2.den) / r2.b[1]];
    const lhsE = [r2.den * pa, r2.den * pb];
    const rhsE = [l.den * pc, l.den * pd];
    const P1 = lhsE[0] - rhsE[0];
    const Q1 = rhsE[1] - lhsE[1];
    return P(`Solve ${eqT(e)}.${askF(res.r.x)}`, F(res.r.x), [
      `Cross multiply: ${r2.den}(${lin(pa, pb)}) = ${l.den}(${lin(pc, pd)}).`,
      `Distribute: ${linT(lhsE[0], lhsE[1])} = ${linT(rhsE[0], rhsE[1])}.`,
      `Collect the x terms and the numbers: ${coefT(P1)} = ${sg(Q1)}.`,
      `Divide by ${sg(P1)}: x = ${qt(res.r.x)}.`,
    ]);
  });
  const simpleB = many(14, () => {
    const a = R.pk([2, 3, 4, 5, 6, 8]);
    const c = R.pk([3, 4, 5, 7, 9]);
    if (a === c) return null;
    const k = R.nz(-6, 6);
    const b = R.nz(-9, 9);
    const x = R.nz(-8, 8);
    // (x + b)/a = k/c written with x chosen: need x + b = k a / c
    const num = k * a;
    if (num % c !== 0) return null;
    const bb = num / c - x;
    if (bb === 0) return null;
    const e = { lhs: [pf(1, bb, a)], rhs: [cn(k, c)] };
    const r = analyse(e);
    return r && qeq(r.x, q(x)) ? { e, r } : null;
  });
  const simpleBQ = simpleB.map((res) => eqProblem(res));
  const warm = mix(simple, setUp, down);
  const core = mix(down.slice(5), bracket, simpleBQ, simple.slice(8));
  const chal = mix(bracket.slice(6), simpleBQ.slice(6), down.slice(9));
  return { warm, core, chal };
}

// ───────── 6. Fractions with brackets ─────────
function parens(L) {
  const { p, R } = setup(L, 'parens');
  const dist = many(16, () => {
    const k = R.nz(p ? -9 : -6, p ? 9 : 6);
    const v = R.pk(['x']);
    const c = R.nz(-9, 9);
    return P(
      `Distribute ${k < 0 ? `${M}${-k}` : k}(${lin(1, c)}). What is the number term (the one without x)?`,
      I(k * c),
      [
        `${sg(k)} × x = ${sg(k)}x and ${sg(k)} × ${par(c)} = ${sg(k * c)}.`,
        `The number term is ${sg(k * c)}.`,
      ],
    );
  });
  const distNeg = many(12, () => {
    const k = R.ri(2, 9);
    const c = R.nz(-9, 9);
    return P(`Write ${M}${k}(${lin(1, c)}) without brackets. What is the number term?`, I(-k * c), [
      `The minus sign applies to the whole bracket: ${M}${k} × x = ${M}${k}x and ${M}${k} × ${par(c)} = ${sg(-k * c)}.`,
      `The number term is ${sg(-k * c)}.`,
    ]);
  });
  const fracSimple = many(16, () => {
    const res = genE(R, p);
    return res ? eqProblem(res) : null;
  });
  const mulTop = many(14, () => {
    const res = genE(R, p);
    if (!res) return null;
    const l = res.e.lhs[0];
    return P(
      `Multiply every term of ${eqT(res.e)} by ${res.r.L}. What number multiplies the first bracket?`,
      I(res.r.L / l.den),
      [
        `${res.r.L} ÷ ${l.den} = ${res.r.L / l.den}.`,
        `The first bracket is multiplied by ${res.r.L / l.den}.`,
      ],
    );
  });
  const mixed = many(16, () => {
    const res = genH(R, p);
    return res ? eqProblem(res) : null;
  });
  const mixedB = many(16, () => {
    const res = genB(R, p);
    return res ? eqProblem(res) : null;
  });
  const combine = many(14, () => {
    const res = genE(R, p);
    if (!res) return null;
    return P(
      `Multiply every term of ${eqT(res.e)} by ${res.r.L}, distribute, and combine like terms on the left. What is the coefficient of x on the left?`,
      I(res.r.al),
      res.r.steps.slice(0, 3),
    );
  });
  const warm = mix(dist, distNeg, mulTop);
  const core = mix(fracSimple, mixed, mulTop.slice(5), distNeg.slice(5));
  const chal = mix(fracSimple.slice(6), mixed.slice(6), combine, mixedB);
  return { warm, core, chal };
}

// ───────── 7. Checking and fraction answers ─────────
function check(L) {
  const { p, R } = setup(L, 'check');
  const isSol = many(16, (i) => {
    const g = R.pk([genA, genB, genC, genD]);
    const res = g(R, p);
    if (!res) return null;
    // Half the questions are true, half false: the yes answers must not be rare.
    const right = i % 2 === 0;
    const k = right ? res.r.x : qadd(res.r.x, q(R.nz(-3, 3)));
    if (k[1] !== 1) return null;
    const lv = sideAt(res.e.lhs, k);
    const rv = sideAt(res.e.rhs, k);
    const same = qeq(lv, rv);
    return P(`Is x = ${sg(k[0])} a solution of ${eqT(res.e)}? ${YN}`, I(same ? 1 : 0), [
      `Left side at x = ${sg(k[0])}: ${qt(lv)}.`,
      `Right side at x = ${sg(k[0])}: ${qt(rv)}.`,
      same
        ? 'The two sides match, so it is a solution.'
        : 'The two sides are different, so it is not a solution.',
    ]);
  });
  const leftVal = many(16, () => {
    const g = R.pk([genA, genB, genC]);
    const res = g(R, p);
    if (!res) return null;
    const k = q(R.nz(-12, 12));
    const lv = sideAt(res.e.lhs, k);
    const vals = res.e.lhs.map((t) => {
      const v = qadd(qmul(t.a, k), t.b);
      return qt(v);
    });
    return P(
      `Put x = ${sg(k[0])} into the left side of ${eqT(res.e)}. What is its value?${askF(lv)}`,
      F(lv),
      [
        `Replace x with ${par(k[0])} and work out each term: ${vals.join(', ')}.`,
        `Add them: ${qt(lv)}.`,
      ],
    );
  });
  const bothSides = many(14, () => {
    const g = R.pk([genA, genB, genC, genD]);
    const res = g(R, p);
    if (!res) return null;
    const v = sideAt(res.e.rhs, res.r.x);
    return P(
      `${eqT(res.e)} has the solution x = ${qt(res.r.x)}. What value do both sides have when you check it?${askF(v)}`,
      F(v),
      [
        `Put x = ${qt(res.r.x)} in the right side.`,
        `The right side is ${qt(v)}, and the left side matches it.`,
      ],
    );
  });
  const fracAns = many(16, () => {
    const res = genFracAnswer(R, p);
    return res ? eqProblem(res) : null;
  });
  const solveIt = many(14, () => {
    const g = R.pk([genB, genC, genE]);
    const res = g(R, p);
    return res ? eqProblem(res) : null;
  });
  const sum = many(14, () => {
    const g = R.pk([genA, genB, genC]);
    const res = g(R, p);
    if (!res) return null;
    const x = res.r.x;
    return P(`If x solves ${eqT(res.e)}, what is 2x?${askF(qmul(q(2), x))}`, F(qmul(q(2), x)), [
      ...res.r.steps,
      `2 × ${par(x[0]).replace(/^\(|\)$/g, '')}${x[1] === 1 ? '' : `/${x[1]}`} = ${qt(qmul(q(2), x))}.`,
    ]);
  });
  const warm = mix(isSol, leftVal, bothSides);
  const core = mix(isSol.slice(5), leftVal.slice(5), fracAns, solveIt);
  const chal = mix(fracAns.slice(6), solveIt.slice(6), sum, bothSides.slice(6));
  return { warm, core, chal };
}

const BUILD = { lcm, clear, solve, single, cross, parens, check };

async function main() {
  const { readAnswer, contentValue, hasForm, approx } = await import(
    require('url').pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const out = { ms: {}, psat: {} };
  const problems = [];
  for (const level of ['ms', 'psat']) {
    const seen = new Set();
    for (const id of ORDER) {
      let list;
      try {
        list = bands(BUILD[id](level), `${level}.${id}`, seen);
      } catch (e) {
        problems.push(e.message);
        continue;
      }
      out[level][id] = list;
      list.forEach((pr, i) => {
        const where = `${level}.${id}#${i + 1}`;
        if (/undefined|NaN|null|\[object|Infinity/.test(JSON.stringify(pr)))
          problems.push(`${where} bad token: ${pr.q}`);
        if (pr.steps.some((s) => s.includes('  ') || s.trim() === ''))
          problems.push(`${where} step spacing`);
        if (/ \+ −| − −|\+ -|- -|\+ \+/.test(pr.steps.join(' ')))
          problems.push(`${where} sign tangle: ${pr.steps.join(' | ')}`);
        const r = readAnswer(pr.a);
        if (!r.ok) {
          problems.push(`${where} answer "${pr.a}" ${r.message}`);
          return;
        }
        try {
          const v = approx(contentValue(pr.a));
          if (Math.abs(v - pr.val) > 1e-9 * Math.max(1, Math.abs(pr.val)))
            problems.push(`${where} value ${v} vs ${pr.val} (${pr.a})`);
        } catch (e) {
          problems.push(`${where} value ${e.message}`);
        }
        if (pr.form && !hasForm(pr.a, pr.form))
          problems.push(`${where} form ${pr.form} rejects "${pr.a}"`);
      });
    }
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
    return;
  }
  // `--list` prints every question and answer, for a read-through before writing the files.
  if (process.argv.includes('--list')) {
    for (const level of ['ms', 'psat'])
      for (const id of ORDER)
        out[level][id].forEach((pr, i) =>
          console.log(`${level}.${id}#${i + 1} ${pr.q} => ${pr.a}`),
        );
    return;
  }
  const dump = (level) =>
    Object.fromEntries(
      ORDER.map((id) => [
        id,
        out[level][id].map((pr) => ({
          q: pr.q,
          a: pr.a,
          ...(pr.form ? { form: pr.form } : {}),
          steps: pr.steps,
          ...(level === 'ms' ? { std: STD[id] } : {}),
        })),
      ]),
    );
  const dir = path.join(ROOT, 'apps/web/features/math');
  fs.writeFileSync(
    path.join(dir, 'psat-fraction-equations-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Equations with Fractions chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const FRACTION_EQUATIONS_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(dump('psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-fraction-equations-middle.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Middle-school (grades 6–8) problems per Equations with Fractions chapter, 25 each from simple to\n * complex, each tagged with a Florida B.E.S.T. benchmark (MA.6.NSO.3.1 and MA.8.AR.2.1). A teacher\n * should check the codes. Generated, so every answer is computed.\n */\nexport const FRACTION_EQUATIONS_MIDDLE: Record<string, GuideProblem[]> = ${JSON.stringify(dump('ms'), null, 1)};\n`,
  );
  console.log('written fraction-equation problems');
}

main();
