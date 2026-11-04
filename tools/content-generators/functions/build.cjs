// Builds the Functions study-guide problem files (psat-design.md). Every answer is computed from the
// functions themselves, and every value is checked a second way (a float) against what math-check
// reads from the typed answer. Typed answers are always whole numbers or fractions.
const fs = require('fs');
const path = require('path');
const { sg, frac, graph } = require('../quadratics/lib.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const M = '−';
const ORDER = [
  'whatis',
  'domain',
  'common',
  'transform',
  'inverse',
  'combine',
  'composite',
  'piecewise',
  'evenodd',
  'asymptotes',
];
// Florida B.E.S.T. codes from a third-party list: a teacher should check them.
const STD = {
  whatis: 'MA.912.F.1.2',
  domain: 'MA.912.F.1.1',
  common: 'MA.912.F.1.3',
  transform: 'MA.912.F.2.1',
  inverse: 'MA.912.F.2.2',
  combine: 'MA.912.F.1.4',
  composite: 'MA.912.F.1.4',
  piecewise: 'MA.912.F.1.3',
  evenodd: 'MA.912.F.1.6',
  asymptotes: 'MA.912.F.1.5',
};

// The video's own examples stay in the notes. No practice question may repeat one.
const VIDEO = [
  'y = 2x² − 5',
  'f(x) = 2x² − 5',
  'x = y²',
  'f(x) = x² + 1',
  'y = x² + 1',
  'f(x) = x³',
  'f(x) = 2^x',
  'f(x) = log₂ x',
  'f(x) = −x² + 3',
  'g(x) = −2x',
  'f(x) = x² + 2x + 3',
  'g(x) = x + 4',
  'f(x) = 2x',
  'g(x) = x + 3',
  'f(x) = x⁴ − 2x² − 1',
  'f(x) = x³ + 3x',
  '1/((x + 2)(x − 4))',
  'f(x) = √x',
  'f(x) = 1/x',
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BANNED = VIDEO.map((s) => new RegExp(`${esc(s)}(?!\\d|\\s[+−×/]|[²³⁴^])`));
const banned = (q) => BANNED.some((re) => re.test(q));

// ───────── answers and text ─────────
const I = (n) => ({ a: String(n === 0 ? 0 : n), disp: sg(n === 0 ? 0 : n), val: n });
function F(n, d) {
  const f = frac(n, d);
  return {
    a: f.d === 1 ? String(f.n) : `${f.n}/${f.d}`,
    disp: f.d === 1 ? sg(f.n) : `${sg(f.n)}/${f.d}`,
    val: f.n / f.d,
    ...(f.d === 1 ? {} : { form: 'fraction' }),
  };
}
function P(q, ans, steps, extra = {}) {
  return {
    q,
    a: ans.a,
    ...(ans.form ? { form: ans.form } : {}),
    val: ans.val,
    steps: [...steps, `Answer: ${ans.disp}`],
    ...extra,
  };
}
const par = (n) => (n < 0 ? `(${sg(n)})` : String(n));
const SUP = { 2: '²', 3: '³', 4: '⁴' };
const SUB = { 2: '₂', 3: '₃', 4: '₄', 5: '₅' };
const lg = (b, x) => `log${SUB[b]} ${x}`;

/** A polynomial from coefficients, highest power first, as text. */
function polyT(cs) {
  const d = cs.length - 1;
  let s = '';
  cs.forEach((c, i) => {
    if (c === 0) return;
    const n = d - i;
    const abs = Math.abs(c);
    const body = n === 0 ? String(abs) : `${abs === 1 ? '' : abs}x${n > 1 ? SUP[n] : ''}`;
    s += s === '' ? `${c < 0 ? M : ''}${body}` : ` ${c < 0 ? M : '+'} ${body}`;
  });
  return s || '0';
}
/** f(k) written out: each x replaced by the (bracketed) input. */
function substT(cs, k) {
  const d = cs.length - 1;
  const parts = [];
  cs.forEach((c, i) => {
    if (c === 0) return;
    const n = d - i;
    const abs = Math.abs(c);
    let t;
    if (n === 0) t = String(abs);
    else {
      const base = par(k) + (n > 1 ? SUP[n] : '');
      t = abs === 1 ? base : `${abs} × ${base}`;
    }
    parts.push({ neg: c < 0, t });
  });
  return (
    parts
      .map((p, i) => (i === 0 ? `${p.neg ? M : ''}${p.t}` : ` ${p.neg ? M : '+'} ${p.t}`))
      .join('') || '0'
  );
}
const xa = (a, v = 'x') => (a === 0 ? v : `${v} ${a < 0 ? M : '+'} ${Math.abs(a)}`);
const fxT = (cs, name = 'f') => `${name}(x) = ${polyT(cs)}`;

// ───────── small polynomial algebra (coefficients highest first) ─────────
const trim = (cs) => {
  let a = cs.slice();
  while (a.length > 1 && a[0] === 0) a = a.slice(1);
  return a;
};
const addP = (a, b) => {
  const n = Math.max(a.length, b.length);
  const A = Array(n - a.length)
    .fill(0)
    .concat(a);
  const B = Array(n - b.length)
    .fill(0)
    .concat(b);
  return trim(A.map((v, i) => v + B[i]));
};
const mulP = (a, b) => {
  const out = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return trim(out);
};
const scaleP = (a, k) => trim(a.map((v) => v * k));
const evalP = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
const compP = (f, g) => {
  let out = [0];
  for (const c of f) out = addP(mulP(out, g), [c]);
  return trim(out);
};

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
/** Up to n distinct questions from a generator that returns an item or null. */
function many(n, f) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i < n * 60 && out.length < n; i += 1) {
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
/** 25 problems: 1–8 warm-up, 9–17 core, 18–25 challenge. */
function bands({ warm, core, chal }, label) {
  const seen = new Set();
  return [
    ...pick(warm, 8, seen, `${label} warm`),
    ...pick(core, 9, seen, `${label} core`),
    ...pick(chal, 8, seen, `${label} challenge`),
  ];
}
const setup = (L, name) => {
  const p = L === 'psat';
  return { p, R: mk(rng(`${L}:${name}`)) };
};
const YN = 'Type 1 for yes, 0 for no.';

// ───────── 1. What is a function ─────────
const REL_YES = [
  ['y = x² + 4', 'Each x gives one number x² + 4, so one y.'],
  ['y = |x − 3|', 'Each x gives one absolute value.'],
  ['y = 5 − 2x', 'A line that is not vertical passes the vertical line test.'],
  ['x = y³', 'Solve for y: y = ∛x, one value for each x.'],
  ['y = x³ − x', 'Each x gives one value of x³ − x.'],
  ['y = √(x + 4)', 'The square root sign gives only the positive root: one y for each x.'],
  ['y = 1/(x − 2)', 'Each x except 2 gives one y.'],
  ['y = 3^x', 'Each x gives one power of 3.'],
];
const REL_NO = [
  ['x² + y² = 25', 'x = 3 gives both y = 4 and y = −4.'],
  ['x = |y|', 'x = 2 gives both y = 2 and y = −2.'],
  ['y² = x + 4', 'x = 5 gives both y = 3 and y = −3.'],
  ['x = y⁴', 'x = 16 gives both y = 2 and y = −2.'],
  ['(x − 2)² + y² = 9', 'x = 2 gives both y = 3 and y = −3.'],
  ['|y| = x + 1', 'x = 1 gives both y = 2 and y = −2.'],
  ['x = 7', 'The one input x = 7 goes with every y: not a function of x.'],
  ['x = y² − 5', 'x = −1 gives both y = 2 and y = −2.'],
];
function whatis(L) {
  const { p, R } = setup(L, 'whatis');
  const big = p ? 9 : 5;
  const evalLin = many(10, () => {
    const a = R.nz(-big, big);
    const b = R.ri(-2 * big, 2 * big);
    const k = R.ri(-5, 7);
    const cs = [a, b];
    if (Math.abs(a) === 1 && b === 0) return null;
    return P(`${fxT(cs)}: what is f(${sg(k)})?`, I(evalP(cs, k)), [
      `Replace x with ${par(k)}: ${substT(cs, k)}.`,
      `That is ${sg(evalP(cs, k))}.`,
    ]);
  });
  const rel = (list, ans) =>
    list.map(([t, why]) =>
      P(`Is y a function of x for the relation ${t}? ${YN}`, I(ans), [
        ans ? why : `${why} One input with two outputs is not a function.`,
      ]),
    );
  const tables = many(10, () => {
    const xs = [1, 2, 3, 4, 5].sort(() => R.ri(-1, 1)).slice(0, 4);
    const pairs = xs.map((x) => [x, R.ri(-5, 9)]);
    const clash = R.ri(0, 1) === 1;
    if (clash) {
      const [x, y] = pairs[R.ri(0, 3)];
      pairs.push([x, y + R.nz(-3, 3)]);
    }
    pairs.sort((u, v) => u[0] - v[0] || u[1] - v[1]);
    const t = `{${pairs.map(([x, y]) => `(${x}, ${sg(y)})`).join(', ')}}`;
    const ok = !pairs.some(([x, y], i) =>
      pairs.some(([x2, y2], j) => i < j && x === x2 && y !== y2),
    );
    return P(`Is the set of pairs ${t} a function from x to y? ${YN}`, I(ok ? 1 : 0), [
      'A function gives each input x exactly one output y.',
      ok
        ? 'No x-value is paired with two different y-values.'
        : 'One x-value is paired with two different y-values.',
    ]);
  });
  const warm = mix(
    evalLin,
    rel(REL_YES.slice(0, p ? 8 : 4), 1),
    rel(REL_NO.slice(0, p ? 8 : 4), 0),
    tables,
  );
  const quad = many(10, () => {
    const a = R.nz(-4, 4);
    const b = R.ri(-6, 6);
    const c = R.ri(-9, 9);
    const k = R.ri(-4, 5);
    const cs = [a, b, c];
    const v = evalP(cs, k);
    const fig = k === 0 ? undefined : undefined;
    return P(
      `${fxT(cs)}: what is f(${sg(k)})?`,
      I(v),
      [`Replace x with ${par(k)}: ${substT(cs, k)}.`, `That is ${sg(v)}.`],
      fig ? { fig } : {},
    );
  });
  const circle = [
    [3, 2],
    [0, 2],
    [5, 1],
    [6, 0],
    [4, 2],
    [-5, 1],
    [-7, 0],
    [1, 2],
  ].map(([k, n]) =>
    P(
      `How many points does the vertical line x = ${sg(k)} share with the graph of x² + y² = 25?`,
      I(n),
      [
        `Put x = ${sg(k)} in: y² = ${25 - k * k}.`,
        n === 2
          ? 'Two values of y, so two points: the circle fails the vertical line test.'
          : n === 1
            ? 'One value of y: the line just touches the circle.'
            : 'No real y: the line misses the circle.',
      ],
    ),
  );
  const solve = many(10, () => {
    const a = R.nz(-big, big);
    const b = R.ri(-2 * big, 2 * big);
    const k = R.ri(-6, 8);
    const v = a * k + b;
    return P(`${fxT([a, b])}: for what x is f(x) = ${sg(v)}?`, I(k), [
      `Set ${polyT([a, b])} = ${sg(v)}.`,
      `${polyT([a, 0])} = ${sg(v - b)}, so x = ${sg(k)}.`,
    ]);
  });
  const two = many(10, () => {
    const a = R.nz(-big, big);
    const b = R.ri(-2 * big, 2 * big);
    const x1 = R.ri(-3, 3);
    const x2 = x1 + R.nz(1, 4);
    const x3 = R.ri(-6, 8);
    if (x3 === x1 || x3 === x2) return null;
    const f = (x) => a * x + b;
    return P(
      `f is a linear function with f(${sg(x1)}) = ${sg(f(x1))} and f(${sg(x2)}) = ${sg(f(x2))}. What is f(${sg(x3)})?`,
      I(f(x3)),
      [
        `The slope is (${sg(f(x2))} − ${par(f(x1))}) / (${sg(x2)} − ${par(x1)}) = ${sg(a)}.`,
        `Then f(x) = ${polyT([a, b])}, so f(${sg(x3)}) = ${sg(f(x3))}.`,
      ],
    );
  });
  const core = mix(quad, circle, solve, two);
  const sumF = many(8, () => {
    const a = R.nz(-4, 4);
    const b = R.ri(-6, 6);
    const c = R.ri(-9, 9);
    const k = R.ri(1, 5);
    const cs = [a, b, c];
    const v = evalP(cs, k) + evalP(cs, -k);
    return P(`${fxT(cs)}: what is f(${k}) + f(${sg(-k)})?`, I(v), [
      `f(${k}) = ${substT(cs, k)} = ${sg(evalP(cs, k))}.`,
      `f(${sg(-k)}) = ${substT(cs, -k)} = ${sg(evalP(cs, -k))}.`,
    ]);
  });
  const shift = many(8, () => {
    const b = R.ri(-6, 6);
    const c = R.ri(-9, 9);
    const h = R.nz(-4, 4);
    const cs = [1, b, c];
    const g = compP(cs, [1, h]);
    return P(
      `${fxT(cs)}. Then f(x + ${sg(h)}) = x² + px + q. What is q?`.replace('+ −', '− '),
      I(g[2]),
      [
        `q is the constant term, which is f(0 + ${sg(h)}) = f(${sg(h)}).`,
        `f(${sg(h)}) = ${substT(cs, h)} = ${sg(g[2])}.`,
      ],
    );
  });
  const rate = many(8, () => {
    const a = R.nz(-3, 3);
    const b = R.ri(-5, 5);
    const c = R.ri(-6, 6);
    const m = R.ri(1, 6);
    const n = R.ri(-4, 0);
    const cs = [a, b, c];
    const num = evalP(cs, m) - evalP(cs, n);
    return P(
      `${fxT(cs)}: what is (f(${m}) − f(${sg(n)})) / (${m} − ${par(n)})? Write a fraction if needed.`,
      F(num, m - n),
      [
        `f(${m}) = ${sg(evalP(cs, m))} and f(${sg(n)}) = ${sg(evalP(cs, n))}.`,
        `(${sg(evalP(cs, m))} − ${par(evalP(cs, n))}) / ${m - n} = ${F(num, m - n).disp}.`,
      ],
    );
  });
  const twin = many(8, () => {
    const h = R.ri(1, 6);
    const c = R.ri(-9, 9);
    const m = R.ri(-4, 9);
    if (2 * h - m === m) return null;
    return P(
      `f(x) = x² ${M} ${2 * h}x ${c < 0 ? M : '+'} ${Math.abs(c)}. If f(${sg(m)}) = f(t) and t ≠ ${sg(m)}, what is t?`,
      I(2 * h - m),
      [
        `The parabola is symmetric about x = ${h}, the midpoint of ${sg(m)} and t.`,
        `t = 2 × ${h} ${m < 0 ? '+' : '−'} ${Math.abs(m)} = ${sg(2 * h - m)}.`,
      ],
    );
  });
  const chal = mix(shift, rate, sumF, twin);
  return { warm, core, chal };
}

// ───────── 2. Domain and range ─────────
function domain(L) {
  const { p, R } = setup(L, 'domain');
  const big = p ? 9 : 6;
  const warm = mix(
    many(8, () => {
      const k = R.ri(-big, big);
      if (k === 1) return null;
      return P(
        `f(x) = x² ${k < 0 ? M : '+'} ${Math.abs(k)}: what is the smallest output value of f?`.replace(
          / \+ 0$/,
          '',
        ),
        I(k),
        [
          'x² is never below 0, and it is 0 at x = 0.',
          `So the smallest output is 0 + ${par(k)} = ${sg(k)}.`,
        ],
      );
    }),
    many(8, () => {
      const k = R.ri(-big, big);
      return P(
        `f(x) = ${M}x² ${k < 0 ? M : '+'} ${Math.abs(k)}: what is the largest output value of f?`,
        I(k),
        [`${M}x² is never above 0, and it is 0 at x = 0.`, `So the largest output is ${sg(k)}.`],
      );
    }),
    many(8, () => {
      const h = R.nz(-big, big);
      return P(`f(x) = 1/(${xa(-h)}): which x-value is not in the domain?`, I(h), [
        'A fraction has no value when its denominator is 0.',
        `${xa(-h)} = 0 when x = ${sg(h)}.`,
      ]);
    }),
    many(8, () => {
      const h = R.ri(-big, big);
      return P(`f(x) = √(${xa(-h)}): what is the smallest x in the domain?`, I(h), [
        'The number under a square root cannot be negative.',
        `${xa(-h)} ≥ 0 gives x ≥ ${sg(h)}.`,
      ]);
    }),
  );
  const core = mix(
    many(8, () => {
      const a = R.pk([2, 3, 4, 5, 6]);
      const b = R.nz(-12, 12);
      return P(
        `f(x) = √(${a}x ${b < 0 ? M : '+'} ${Math.abs(b)}): what is the smallest x in the domain? Write a fraction if needed.`,
        F(-b, a),
        [
          `Need ${a}x ${b < 0 ? M : '+'} ${Math.abs(b)} ≥ 0.`,
          `${a}x ≥ ${sg(-b)}, so x ≥ ${F(-b, a).disp}.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.nz(-big, big);
      const k = R.nz(-big, big);
      if (h === k) return null;
      return P(
        `f(x) = 1/((${xa(-h)})(${xa(-k)})): what is the sum of the x-values not in the domain?`,
        I(h + k),
        [
          `The denominator is 0 at x = ${sg(h)} and x = ${sg(k)}.`,
          `${sg(h)} + ${par(k)} = ${sg(h + k)}.`,
        ],
      );
    }),
    many(8, () => {
      const lo = R.ri(-6, -1);
      const hi = R.ri(2, 7);
      const a = R.nz(-4, 4);
      const b = R.ri(-6, 6);
      const hiOut = Math.max(a * lo + b, a * hi + b);
      return P(
        `f(x) = ${polyT([a, b])} with the domain ${sg(lo)} ≤ x ≤ ${hi}. What is the largest output value?`,
        I(hiOut),
        [
          `A line is monotone, so the extremes are at the ends: f(${sg(lo)}) = ${sg(a * lo + b)} and f(${hi}) = ${sg(a * hi + b)}.`,
          `The larger is ${sg(hiOut)}.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.ri(-4, 6);
      const n = Math.max(0, 10 - Math.max(h, -5) + 1);
      return P(
        `How many integers x from −5 to 10 are in the domain of f(x) = √(${xa(-h)})?`,
        I(n),
        [
          `The domain is x ≥ ${sg(h)}.`,
          `The integers from ${sg(Math.max(h, -5))} to 10 number ${n}.`,
        ],
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      const a = R.pk([1, 2, 3]);
      const h = R.ri(-4, 5);
      const k = R.ri(-9, 9);
      const cs = addP(scaleP(mulP([1, -h], [1, -h]), a), [k]);
      return P(`${fxT(cs)}: what is the smallest output value of f?`, I(k), [
        `Complete the square: ${polyT(cs)} = ${a === 1 ? '' : a}(${xa(-h)})² ${k < 0 ? M : '+'} ${Math.abs(k)}.`,
        `The square is at least 0, so the smallest value is ${sg(k)}.`,
      ]);
    }),
    many(8, () => {
      const r = R.ri(2, 6);
      let n = 0;
      for (let x = -10; x <= 10; x += 1) if (x * x - r * r >= 0) n += 1;
      return P(
        `How many integers from −10 to 10 are in the domain of f(x) = √(x² ${M} ${r * r})?`,
        I(n),
        [
          `Need x² ≥ ${r * r}, so x ≤ ${sg(-r)} or x ≥ ${r}.`,
          `That is ${10 - r + 1} integers on the right and ${10 - r + 1} on the left, ${n} in all.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.ri(-5, 5);
      return P(`f(x) = 1/√(${xa(-h)}): what is the smallest integer in the domain?`, I(h + 1), [
        `Need ${xa(-h)} > 0 (it is in a denominator), so x > ${sg(h)}.`,
        `The smallest integer is ${sg(h + 1)}.`,
      ]);
    }),
    many(8, () => {
      const a = R.ri(-4, 3);
      const b = R.ri(-3, 8);
      let n = 0;
      for (let x = -10; x <= 10; x += 1) if (x + a >= 0 && x !== b) n += 1;
      return P(
        `How many integers from −10 to 10 are in the domain of f(x) = √(${xa(a)}) / ${b === 0 ? 'x' : `(${xa(-b)})`}?`,
        I(n),
        [
          `The root needs ${xa(a)} ≥ 0, so x ≥ ${sg(-a)}.`,
          `The fraction needs x ≠ ${sg(b)}. Counting the integers that pass both gives ${n}.`,
        ],
      );
    }),
    many(8, () => {
      const lo = R.ri(-5, -2);
      const hi = R.ri(1, 4);
      const k = R.nz(-4, 4);
      const big2 = Math.max(lo * lo, hi * hi) + k;
      return P(
        `f(x) = x² ${k < 0 ? M : '+'} ${Math.abs(k)} with the domain ${sg(lo)} ≤ x ≤ ${hi}. What is the largest output value?`,
        I(big2),
        [
          `x² is largest at the end farther from 0: x = ${lo * lo > hi * hi ? sg(lo) : hi}.`,
          `That gives ${sg(big2)}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

// ───────── 3. Common functions ─────────
function common(L) {
  const { p, R } = setup(L, 'common');
  const warm = mix(
    many(8, () => {
      const k = R.ri(-5, 5);
      return P(`h(x) = x³: what is h(${sg(k)})?`, I(k ** 3), [
        `${par(k)} × ${par(k)} × ${par(k)} = ${sg(k ** 3)}.`,
      ]);
    }),
    many(8, () => {
      const b = R.pk([2, 3, 4, 5]);
      const k = R.ri(0, p ? 5 : 4);
      return P(`f(x) = ${b}^x: what is f(${k})?`, I(b ** k), [`${b}^${k} = ${b ** k}.`]);
    }),
    many(8, () => {
      const b = R.pk([2, 3, 4, 5]);
      const k = R.ri(1, 4);
      return P(`What is ${lg(b, b ** k)}?`, I(k), [
        `${lg(b, b ** k)} asks: ${b} to what power is ${b ** k}?`,
        `${b}^${k} = ${b ** k}.`,
      ]);
    }),
    [
      ['sin 0°', 0],
      ['cos 0°', 1],
      ['sin 90°', 1],
      ['cos 180°', -1],
      ['sin 270°', -1],
      ['cos 90°', 0],
    ].map(([t, v]) =>
      P(`What is ${t}?`, I(v), [`Read it off the sine or cosine wave (the unit circle).`]),
    ),
  );
  const core = mix(
    many(8, () => {
      const b = R.pk([2, 3, 4, 5]);
      const k = R.ri(1, 4);
      return P(`f(x) = ${b}^x: what is f(${sg(-k)})? Write a fraction.`, F(1, b ** k), [
        `A negative exponent means a reciprocal: ${b}^${sg(-k)} = 1/${b}^${k}.`,
        `That is 1/${b ** k}.`,
      ]);
    }),
    many(8, () => {
      const c = R.ri(-6, 6);
      const b = R.pk([2, 3]);
      return P(
        `f(x) = ${b}^x ${c < 0 ? M : '+'} ${Math.abs(c)}: what is its y-intercept?`.replace(
          / \+ 0\?/,
          '?',
        ),
        I(1 + c),
        [`At x = 0, ${b}^0 = 1.`, `1 ${c < 0 ? M : '+'} ${Math.abs(c)} = ${sg(1 + c)}.`],
      );
    }),
    many(8, () => {
      const b = R.pk([2, 3]);
      const c = R.nz(-6, 6);
      return P(
        `The graph of f(x) = ${b}^x ${c < 0 ? M : '+'} ${Math.abs(c)} has a horizontal asymptote y = c. What is c?`,
        I(c),
        [
          `${b}^x gets closer and closer to 0 but never reaches it.`,
          `So the graph approaches y = ${sg(c)}.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.nz(-6, 6);
      return P(
        `The graph of f(x) = ${lg(2, `(${xa(-h)})`)} has a vertical asymptote x = a. What is a?`,
        I(h),
        [
          `A logarithm needs a positive input, so ${xa(-h)} > 0.`,
          `The graph approaches the line x = ${sg(h)}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.pk([1, 2, 3, 4]);
      const b = R.pk([1, 2, 3, 4, 5]);
      if (a === b) return null;
      return P(`g(x) = 1/x: what is g(${a}) + g(${b})? Write a fraction.`, F(a + b, a * b), [
        `g(${a}) = 1/${a} and g(${b}) = 1/${b}.`,
        `1/${a} + 1/${b} = ${F(a + b, a * b).disp}.`,
      ]);
    }),
  );
  const chal = mix(
    many(8, () => {
      const b = R.pk([2, 3, 4]);
      const k = R.ri(2, 4);
      return P(`What x makes ${b}^x = 1/${b ** k}?`, I(-k), [
        `1/${b ** k} = ${b}^${sg(-k)}.`,
        `So x = ${sg(-k)}.`,
      ]);
    }),
    many(8, () => {
      const b = R.pk([2, 3]);
      const x = R.ri(1, 3);
      const y = R.ri(1, 3);
      return P(`What is ${lg(b, b ** x)} + ${lg(b, b ** y)}?`, I(x + y), [
        `${lg(b, b ** x)} = ${x} and ${lg(b, b ** y)} = ${y}.`,
        `${x} + ${y} = ${x + y}.`,
      ]);
    }),
    many(8, () => {
      const x = R.ri(1, 4);
      const b = 2;
      return P(
        `The point (${x}, ${b ** x}) is on the graph of y = ${b}^x. The matching point on y = ${lg(b, 'x')} is (m, n). What is m + n?`,
        I(b ** x + x),
        [
          'The two functions are inverses, so the coordinates swap.',
          `The point is (${b ** x}, ${x}), and ${b ** x} + ${x} = ${b ** x + x}.`,
        ],
      );
    }),
    many(8, () => {
      const k = R.ri(2, 5);
      const n = R.pk([
        [1, 'x³ = k²? '],
        [2, ''],
      ]);
      void n;
      return null;
    }),
    [
      ['2^x = −4', 0, '2^x is always positive.'],
      ['x² = 49', 2, 'x = 7 and x = −7.'],
      ['x³ = 27', 1, 'Only x = 3 cubes to 27.'],
      ['|x| = 6', 2, 'x = 6 and x = −6.'],
      ['√x = −3', 0, 'A square root is never negative.'],
      ['x² = −9', 0, 'A square is never negative.'],
      ['1/x = 0', 0, 'A fraction with numerator 1 is never 0.'],
      ['3^x = 81', 1, 'Only x = 4.'],
      ['x³ = −8', 1, 'Only x = −2.'],
    ].map(([t, n, why]) => P(`How many real numbers x satisfy ${t}?`, I(n), [why])),
    many(8, () => {
      const b = R.pk([2, 3]);
      const k = R.ri(1, 3);
      const a = R.pk([2, 3, 5]);
      return P(
        `f(x) = ${a} · ${b}^x. What is f(${k + 1}) − f(${k})?`,
        I(a * b ** (k + 1) - a * b ** k),
        [
          `f(${k + 1}) = ${a} × ${b ** (k + 1)} = ${a * b ** (k + 1)}.`,
          `f(${k}) = ${a} × ${b ** k} = ${a * b ** k}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

// ───────── 4. Transformations ─────────
const aT = (a) => (a === 1 ? '' : a === -1 ? M : sg(a));
const gT = (a, d, c) =>
  `g(x) = ${aT(a)}f(${xa(-d)})${c === 0 ? '' : ` ${c < 0 ? M : '+'} ${Math.abs(c)}`}`;
const NAMES = { 'x²': (x) => x * x, '|x|': (x) => Math.abs(x), 'x³': (x) => x ** 3 };
function transform(L) {
  const { p, R } = setup(L, 'transform');
  const big = p ? 8 : 5;
  const warm = mix(
    many(8, () => {
      const px = R.ri(-5, 5);
      const py = R.ri(-6, 6);
      const d = R.nz(-big, big);
      const c = R.nz(-big, big);
      return P(
        `The point (${sg(px)}, ${sg(py)}) is on the graph of y = f(x). ${gT(1, d, c)}. What is the x-coordinate of the matching point on g?`,
        I(px + d),
        [
          `${xa(-d)} replaces x, so every point moves ${Math.abs(d)} units ${d > 0 ? 'right' : 'left'}.`,
          `${sg(px)} + ${par(d)} = ${sg(px + d)}.`,
        ],
      );
    }),
    many(8, () => {
      const px = R.ri(-5, 5);
      const py = R.ri(-6, 6);
      const d = R.nz(-big, big);
      const c = R.nz(-big, big);
      return P(
        `The point (${sg(px)}, ${sg(py)}) is on the graph of y = f(x). ${gT(1, d, c)}. What is the y-coordinate of the matching point on g?`,
        I(py + c),
        [
          `Adding ${sg(c)} outside moves every point ${Math.abs(c)} units ${c > 0 ? 'up' : 'down'}.`,
          `${sg(py)} + ${par(c)} = ${sg(py + c)}.`,
        ],
      );
    }),
    many(8, () => {
      const d = R.nz(-big, big);
      return P(
        `g(x) = f(${xa(d)}): does the graph of f shift right or left? Type 1 for right, 0 for left.`,
        I(d < 0 ? 1 : 0),
        [
          `f(x ${d > 0 ? '+' : M} ${Math.abs(d)}) is f(x ${M} (${sg(-d)})), so the shift is ${sg(-d)}.`,
          d < 0 ? 'A positive shift means right.' : 'A negative shift means left.',
        ],
      );
    }),
    many(8, () => {
      const a = R.pk([2, 3, 4, 5]);
      return P(`g(x) = ${a}f(x): by what factor is the graph of f stretched vertically?`, I(a), [
        `Every output is multiplied by ${a}.`,
      ]);
    }),
  );
  const core = mix(
    many(8, () => {
      const px = R.ri(-6, 6);
      const k = R.pk([2, 3, 4, -1, -2]);
      return P(
        `The point (${sg(px)}, 5) is on the graph of y = f(x). g(x) = f(${k === -1 ? '−x' : `${sg(k)}x`}). What is the x-coordinate of the matching point on g? Write a fraction if needed.`,
        F(px, k),
        [`g(x) = 5 when ${k === -1 ? '−x' : `${sg(k)}x`} = ${sg(px)}.`, `x = ${F(px, k).disp}.`],
      );
    }),
    many(8, () => {
      const px = R.ri(-5, 5);
      const py = R.nz(-6, 6);
      const a = R.pk([-1, -2, -3, 2, 3]);
      const d = R.nz(-big, big);
      const c = R.ri(-big, big);
      return P(
        `The point (${sg(px)}, ${sg(py)}) is on the graph of y = f(x). ${gT(a, d, c)}. What is the sum of the coordinates of the matching point on g?`,
        I(px + d + a * py + c),
        [
          `x moves to ${sg(px)} + ${par(d)} = ${sg(px + d)}.`,
          `y becomes ${par(a)} × ${par(py)} + ${par(c)} = ${sg(a * py + c)}.`,
          `${sg(px + d)} + ${par(a * py + c)} = ${sg(px + d + a * py + c)}.`,
        ],
      );
    }),
    many(8, () => {
      const q = R.ri(-4, 9);
      const px = R.ri(-4, 5);
      const a = R.pk([2, 3, -1, -2]);
      const d = R.nz(-4, 5);
      const c = R.nz(-5, 5);
      return P(`f(${sg(px)}) = ${sg(q)}. ${gT(a, d, c)}. What is g(${sg(px + d)})?`, I(a * q + c), [
        `g(${sg(px + d)}) = ${aT(a) || ''}f(${sg(px + d)} ${d < 0 ? '+' : M} ${Math.abs(d)}) ${c < 0 ? M : '+'} ${Math.abs(c)}`.replace(
          '  ',
          ' ',
        ),
        `${xa(0, sg(px + d))} ${d < 0 ? '+' : M} ${Math.abs(d)} = ${sg(px)}, so f(${sg(px)}) = ${sg(q)}.`,
        `${par(a)} × ${par(q)} + ${par(c)} = ${sg(a * q + c)}.`,
      ]);
    }),
    many(8, () => {
      const d = R.nz(-big, big);
      const c = R.nz(-big, big);
      const a = R.pk([1, 2, 3]);
      const fig = graph(a, -2 * a * d, a * d * d + c);
      return P(
        `The graph of y = ${a === 1 ? '' : a}(${xa(-d)})² ${c < 0 ? M : '+'} ${Math.abs(c)} is the parabola y = ${a === 1 ? '' : a}x² moved. What is the x-coordinate of its vertex?`,
        I(d),
        [
          `The vertex form ${a === 1 ? '' : a}(x ${M} h)² + k has its vertex at (h, k).`,
          `Here h = ${sg(d)} and k = ${sg(c)}.`,
        ],
        { fig },
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      const nm = R.pk(['x²', '|x|']);
      const a = R.pk([2, 3, -1, -2]);
      const d = R.ri(-4, 4);
      const c = R.ri(-6, 6);
      const k = R.ri(-4, 6);
      const v = a * NAMES[nm](k - d) + c;
      return P(`f(x) = ${nm}. ${gT(a, d, c)}. What is g(${sg(k)})?`, I(v), [
        `g(${sg(k)}) = ${aT(a) || ''}f(${sg(k - d)}) ${c < 0 ? M : '+'} ${Math.abs(c)}.`,
        `f(${sg(k - d)}) = ${sg(NAMES[nm](k - d))}.`,
        `${par(a)} × ${par(NAMES[nm](k - d))} + ${par(c)} = ${sg(v)}.`,
      ]);
    }),
    many(8, () => {
      const a = R.pk([2, 3, -2]);
      const d = R.ri(-3, 3);
      const c = R.ri(-5, 5);
      const k = R.ri(-3, 5);
      const v = a * (k - d) ** 3 + c;
      return P(
        `h(x) = x³. ${gT(a, d, c).replace('f(', 'h(')}`.replace('g(x) = ', 'g(x) = ') +
          `, with h as the parent. What is g(${sg(k)})?`,
        I(v),
        [
          `g(${sg(k)}) = ${aT(a) || ''}h(${sg(k - d)}) ${c < 0 ? M : '+'} ${Math.abs(c)}.`,
          `${sg(k - d)}³ = ${sg((k - d) ** 3)}.`,
          `${par(a)} × ${par((k - d) ** 3)} + ${par(c)} = ${sg(v)}.`,
        ],
      );
    }),
    many(8, () => {
      const d = R.ri(-4, 5);
      const c = R.ri(-5, 5);
      const m = R.ri(1, 5);
      return P(
        `f(x) = √x and g(x) = f(${xa(-d)}) ${c < 0 ? M : '+'} ${Math.abs(c)}. What is g(${sg(d + m * m)})?`.replace(
          / \+ 0\./,
          '.',
        ),
        I(m + c),
        [
          `${sg(d + m * m)} ${d < 0 ? '+' : M} ${Math.abs(d)} = ${m * m}, so f(${m * m}) = ${m}.`,
          `${m} ${c < 0 ? M : '+'} ${Math.abs(c)} = ${sg(m + c)}.`,
        ],
      );
    }),
    many(8, () => {
      const px = R.ri(-4, 4);
      const py = R.nz(-5, 5);
      const k = R.pk([2, 3, 4]);
      const a = R.pk([-1, 2, 3]);
      const c = R.ri(-4, 4);
      const x = F(px, k);
      return P(
        `(${sg(px)}, ${sg(py)}) is on y = f(x). g(x) = ${aT(a)}f(${k}x) ${c < 0 ? M : '+'} ${Math.abs(c)}. The matching point on g is (m, n). What is n?`,
        I(a * py + c),
        [
          `The inside ${k}x only changes the x-coordinate, to m = ${x.disp}.`,
          `The outside changes y: ${par(a)} × ${par(py)} + ${par(c)} = ${sg(a * py + c)}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

// ───────── 5. Inverse functions ─────────
function inverse(L) {
  const { p, R } = setup(L, 'inverse');
  const big = p ? 8 : 5;
  const warm = mix(
    many(8, () => {
      const a = R.ri(-6, 8);
      const b = R.ri(-9, 14);
      return P(`f(${sg(a)}) = ${sg(b)}. What is the inverse of f, f⁻¹, at ${sg(b)}?`, I(a), [
        `An inverse undoes f: if f(${sg(a)}) = ${sg(b)}, then f⁻¹(${sg(b)}) = ${sg(a)}.`,
      ]);
    }),
    many(8, () => {
      const c = R.nz(-big, big);
      const v = R.ri(-9, 12);
      return P(`f(x) = x ${c < 0 ? M : '+'} ${Math.abs(c)}: what is f⁻¹(${sg(v)})?`, I(v - c), [
        `f adds ${sg(c)}, so f⁻¹ subtracts ${sg(c)}.`,
        `${sg(v)} ${c < 0 ? '+' : M} ${Math.abs(c)} = ${sg(v - c)}.`,
      ]);
    }),
    many(8, () => {
      const px = R.ri(-6, 6);
      const py = R.ri(-6, 6);
      return P(
        `The point (${sg(px)}, ${sg(py)}) is on the graph of f. The point (m, n) is on the graph of f⁻¹ with m = ${sg(py)}. What is n?`,
        I(px),
        [
          'An inverse swaps the coordinates: (x, y) becomes (y, x).',
          `So (${sg(py)}, ${sg(px)}) is on f⁻¹.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.pk([2, 3, 4, 5, 6]);
      const k = R.ri(-5, 8);
      return P(`f(x) = ${a}x: what is f⁻¹(${sg(a * k)})?`, I(k), [
        `f multiplies by ${a}, so f⁻¹ divides by ${a}.`,
        `${a * k} ÷ ${a} = ${sg(k)}.`,
      ]);
    }),
  );
  const core = mix(
    many(8, () => {
      const a = R.nz(-big, big);
      if (Math.abs(a) === 1) return null;
      const b = R.nz(-big, big);
      const k = R.ri(-5, 7);
      return P(`f(x) = ${polyT([a, b])}: what is f⁻¹(${sg(a * k + b)})?`, I(k), [
        `Solve ${polyT([a, b])} = ${sg(a * k + b)}.`,
        `${polyT([a, 0])} = ${sg(a * k)}, so x = ${sg(k)}.`,
      ]);
    }),
    many(8, () => {
      const a = R.pk([2, 3, 4, 5, -2, -3]);
      const b = R.nz(-9, 9);
      return P(
        `f(x) = ${polyT([a, b])}. Its inverse is f⁻¹(x) = mx + n. What is m? Write a fraction.`,
        F(1, a),
        [
          `Swap x and y: x = ${a}y ${b < 0 ? M : '+'} ${Math.abs(b)}, then solve for y.`,
          `y = (x ${b < 0 ? '+' : M} ${Math.abs(b)})/${a}, so m = ${F(1, a).disp}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.pk([2, 3, 4, 5, -2, -3]);
      const b = R.nz(-9, 9);
      const f = F(-b, a);
      return P(
        `f(x) = ${polyT([a, b])}. Its inverse is f⁻¹(x) = mx + n. What is n? Write a fraction if needed.`,
        f,
        [
          `Swap x and y and solve: y = (x ${b < 0 ? '+' : M} ${Math.abs(b)})/${a}.`,
          `n = ${sg(-b)}/${a} = ${f.disp}.`,
        ],
      );
    }),
    many(8, () => {
      const c = R.nz(-9, 9);
      const k = R.ri(-4, 5);
      return P(
        `g(x) = x³ ${c < 0 ? M : '+'} ${Math.abs(c)}: what is g⁻¹(${sg(k ** 3 + c)})?`.replace(
          / \+ 0:/,
          ':',
        ),
        I(k),
        [
          `Solve x³ ${c < 0 ? M : '+'} ${Math.abs(c)} = ${sg(k ** 3 + c)}.`,
          `x³ = ${sg(k ** 3)}, so x = ${sg(k)}.`,
        ],
      );
    }),
    many(8, () => {
      const b = R.pk([2, 3, 4, 5]);
      const k = R.ri(1, 4);
      return P(`h(x) = ${b}^x: what is h⁻¹(${b ** k})?`, I(k), [
        `h⁻¹(x) = ${lg(b, 'x')}.`,
        `${lg(b, b ** k)} = ${k}.`,
      ]);
    }),
    [
      ['f(x) = x² for all real x', 0, 'f(2) = f(−2) = 4, so f is not one-to-one.'],
      ['f(x) = x³ for all real x', 1, 'Each output comes from one input.'],
      ['f(x) = |x| for all real x', 0, 'f(3) = f(−3) = 3.'],
      ['f(x) = 2x + 1 for all real x', 1, 'A non-horizontal line passes the horizontal line test.'],
      ['f(x) = x² for x ≥ 0 only', 1, 'With negative x removed, each output comes from one input.'],
      ['f(x) = 5 for all real x', 0, 'Every input gives the same output 5.'],
    ].map(([t, v, why]) =>
      P(`Does ${t} have an inverse function? ${YN}`, I(v), [
        `An inverse function needs f to be one-to-one (pass the horizontal line test).`,
        why,
      ]),
    ),
  );
  const chal = mix(
    many(8, () => {
      const a = R.pk([2, 3, 4]);
      const b = R.nz(-6, 6);
      const c = R.pk([2, 3, 4, 5]);
      const k = R.ri(-4, 6);
      const v = a * (k - c) + b; // f(x) = a x + b, g(x) = x - c, (f∘g)(k)
      return P(
        `f(x) = ${polyT([a, b])} and g(x) = x ${M} ${c}. What x gives f(g(x)) = ${sg(v)}?`,
        I(k),
        [
          `f(g(x)) = ${a}(x ${M} ${c}) ${b < 0 ? M : '+'} ${Math.abs(b)}.`,
          `Set it equal to ${sg(v)} and solve: x = ${sg(k)}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.pk([2, 3, 4]);
      const b = R.nz(-6, 6);
      const k = R.ri(-4, 6);
      const x = F(-b, a - 1);
      return P(
        `f(x) = ${polyT([a, b])}. The graphs of f and f⁻¹ meet on the line y = x. At what x does f(x) = x? Write a fraction if needed.`,
        x,
        [`Solve ${polyT([a, b])} = x.`, `${a - 1}x = ${sg(-b)}, so x = ${x.disp}.`],
      );
    }),
    many(8, () => {
      const c = R.ri(-4, 6);
      const k = R.ri(1, 6);
      return P(
        `f(x) = √x ${c < 0 ? M : '+'} ${Math.abs(c)}: what is f⁻¹(${sg(k + c)})?`.replace(
          / \+ 0:/,
          ':',
        ),
        I(k * k),
        [
          `Undo the steps: subtract ${sg(c)}, then square.`,
          `(${sg(k + c)} ${c < 0 ? '+' : M} ${Math.abs(c)})² = ${k}² = ${k * k}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.pk([2, 3, 4, 5]);
      const b = R.nz(-8, 8);
      const k = R.ri(-4, 5);
      const v = a * (a * k + b) + b;
      return P(
        `f(x) = ${polyT([a, b])}: what is f⁻¹(f⁻¹(${sg(v)}))?`.replace('f⁻¹(f⁻¹(', 'f⁻¹(f⁻¹('),
        I(k),
        [
          `Apply the inverse twice. First: f⁻¹(${sg(v)}) = ${sg(a * k + b)}, since ${polyT([a, b])} = ${sg(v)} at x = ${sg(a * k + b)}.`,
          `Then f⁻¹(${sg(a * k + b)}) = ${sg(k)}.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.ri(-3, 4);
      const k = R.ri(1, 6);
      return P(
        `f(x) = (x ${M} ${h})² for x ≥ ${h}. What is f⁻¹(${k * k})?`
          .replace(`${M} -`, '+ ')
          .replace(`(x ${M} ${h})`, `(${xa(-h)})`),
        I(h + k),
        [
          `Solve (${xa(-h)})² = ${k * k} with x ≥ ${sg(h)}.`,
          `${xa(-h)} = ${k}, so x = ${sg(h + k)}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

// ───────── 6. Combining functions ─────────
function combine(L) {
  const { p, R } = setup(L, 'combine');
  const big = p ? 8 : 5;
  const lin2 = () => [R.nz(-big, big), R.ri(-big, big)];
  const op = (name) => {
    return many(8, () => {
      const f = lin2();
      const g = lin2();
      const k = R.ri(-4, 6);
      const fv = evalP(f, k);
      const gv = evalP(g, k);
      let ans;
      let sym;
      if (name === 'add') {
        ans = I(fv + gv);
        sym = '(f + g)';
      } else if (name === 'sub') {
        ans = I(fv - gv);
        sym = '(f − g)';
      } else if (name === 'mul') {
        ans = I(fv * gv);
        sym = '(f · g)';
      } else {
        if (gv === 0) return null;
        ans = F(fv, gv);
        sym = '(f / g)';
      }
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. What is ${sym}(${sg(k)})${name === 'div' ? '? Write a fraction if needed.' : '?'}`,
        ans,
        [
          `f(${sg(k)}) = ${sg(fv)} and g(${sg(k)}) = ${sg(gv)}.`,
          `${sym}(${sg(k)}) = f(${sg(k)}) ${name === 'add' ? '+' : name === 'sub' ? M : name === 'mul' ? '×' : '÷'} g(${sg(k)}) = ${ans.disp}.`,
        ],
      );
    });
  };
  const warm = mix(op('add'), op('sub'), op('mul'), op('div'));
  const core = mix(
    many(8, () => {
      const f = lin2();
      const g = lin2();
      const s = addP(f, g);
      if (s.length < 2) return null;
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. (f + g)(x) = px + q. What is p?`,
        I(s[0]),
        [`Add like terms: (${polyT(f)}) + (${polyT(g)}).`, `The x-terms add to ${sg(s[0])}x.`],
      );
    }),
    many(8, () => {
      const f = [R.nz(-4, 4), R.ri(-6, 6), R.ri(-9, 9)];
      const g = lin2();
      const s = addP(f, g);
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. (f + g)(x) = ${s.length === 3 ? 'ax² + bx + c' : 'bx + c'}. What is c?`.replace(
          'ax² + bx + c',
          'ax² + bx + c',
        ),
        I(s[s.length - 1]),
        [
          `Add: (${polyT(f)}) + (${polyT(g)}) = ${polyT(s)}.`,
          `The constant term is ${sg(s[s.length - 1])}.`,
        ],
      );
    }),
    many(8, () => {
      const f = lin2();
      const g = [R.nz(-3, 3), R.ri(-5, 5), R.ri(-6, 6)];
      const m = mulP(f, g);
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. (f · g)(x) has constant term c. What is c?`,
        I(m[m.length - 1]),
        [
          `The constant term of a product is the product of the constant terms.`,
          `${par(f[1])} × ${par(g[2])} = ${sg(m[m.length - 1])}.`,
        ],
      );
    }),
    many(8, () => {
      const g = lin2();
      if (g[0] === 0) return null;
      const x = F(-g[1], g[0]);
      return P(
        `f(x) = x² + 4 and g(x) = ${polyT(g)}. (f / g)(x) has no value at one x-value. What is it? Write a fraction if needed.`,
        x,
        [
          `A quotient has no value when the divisor g(x) is 0.`,
          `${polyT(g)} = 0 gives x = ${x.disp}.`,
        ],
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      // f + g = a(x - r1)(x - r2), with g linear.
      const r1 = R.ri(-6, 3);
      const r2 = r1 + R.ri(1, 6);
      const a = R.pk([1, 1, 2]);
      const tot = scaleP(mulP([1, -r1], [1, -r2]), a);
      const g = [R.nz(-4, 4), R.ri(-6, 6)];
      const f = addP(tot, scaleP(g, -1));
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. What is the larger x-intercept of (f + g)(x)?`,
        I(r2),
        [
          `(f + g)(x) = ${polyT(tot)} = ${a === 1 ? '' : a}(${xa(-r1)})(${xa(-r2)}).`,
          `The x-intercepts are ${sg(r1)} and ${sg(r2)}; the larger is ${sg(r2)}.`,
        ],
      );
    }),
    many(8, () => {
      const r1 = R.ri(-6, 2);
      const r2 = r1 + R.pk([2, 4, 6]);
      const tot = mulP([1, -r1], [1, -r2]);
      const g = [R.nz(-4, 4), R.ri(-6, 6)];
      const f = addP(tot, scaleP(g, -1));
      const vx = (r1 + r2) / 2;
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. What is the x-coordinate of the vertex of (f + g)(x)?`,
        I(vx),
        [
          `(f + g)(x) = ${polyT(tot)}, with x-intercepts ${sg(r1)} and ${sg(r2)}.`,
          `The vertex is halfway between them: (${sg(r1)} + ${par(r2)})/2 = ${sg(vx)}.`,
        ],
      );
    }),
    many(8, () => {
      const r1 = R.ri(-5, 2);
      const r2 = r1 + R.pk([2, 4, 6]);
      const tot = mulP([1, -r1], [1, -r2]);
      const g = [R.nz(-4, 4), R.ri(-6, 6)];
      const f = addP(tot, scaleP(g, -1));
      const vx = (r1 + r2) / 2;
      const vy = evalP(tot, vx);
      return P(
        `f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. What is the minimum value of (f + g)(x)?`,
        I(vy),
        [
          `(f + g)(x) = ${polyT(tot)}. Its vertex is at x = ${sg(vx)}.`,
          `(f + g)(${sg(vx)}) = ${sg(vy)}.`,
        ],
      );
    }),
    many(8, () => {
      const f = [1, R.ri(-5, 5), R.ri(-6, 6)];
      const g = [R.nz(-3, 3), R.ri(-5, 5)];
      const d = addP(f, scaleP(g, -1)); // f - g
      const disc = d[1] * d[1] - 4 * d[0] * d[2];
      const n = disc > 0 ? 2 : disc === 0 ? 1 : 0;
      return P(`f(x) = ${polyT(f)} and g(x) = ${polyT(g)}. How many x satisfy f(x) = g(x)?`, I(n), [
        `f(x) = g(x) means (f − g)(x) = ${polyT(d)} = 0.`,
        `The discriminant is ${sg(disc)}, so there are ${n} solution${n === 1 ? '' : 's'}.`,
      ]);
    }),
  );
  return { warm, core, chal };
}

// ───────── 7. Composite functions ─────────
function composite(L) {
  const { p, R } = setup(L, 'composite');
  const big = p ? 7 : 4;
  const q2 = () => [R.pk([1, 1, 2, -1]), R.ri(-4, 4), R.ri(-6, 6)];
  const l1 = () => [R.nz(-big, big), R.ri(-big, big)];
  const warm = mix(
    many(8, () => {
      const f = q2();
      const g = l1();
      const k = R.ri(-3, 4);
      const gv = evalP(g, k);
      const v = evalP(f, gv);
      return P(`${fxT(f)} and ${fxT(g, 'g')}. What is f(g(${sg(k)}))?`, I(v), [
        `g(${sg(k)}) = ${substT(g, k)} = ${sg(gv)}.`,
        `f(${sg(gv)}) = ${substT(f, gv)} = ${sg(v)}.`,
      ]);
    }),
    many(8, () => {
      const f = l1();
      const g = q2();
      const k = R.ri(-3, 4);
      const fv = evalP(f, k);
      const v = evalP(g, fv);
      return P(`${fxT(f)} and ${fxT(g, 'g')}. What is g(f(${sg(k)}))?`, I(v), [
        `f(${sg(k)}) = ${substT(f, k)} = ${sg(fv)}.`,
        `g(${sg(fv)}) = ${substT(g, fv)} = ${sg(v)}.`,
      ]);
    }),
    many(8, () => {
      const f = l1();
      const k = R.ri(-3, 5);
      const v = evalP(f, evalP(f, k));
      return P(`${fxT(f)}: what is f(f(${sg(k)}))?`, I(v), [
        `f(${sg(k)}) = ${sg(evalP(f, k))}.`,
        `f(${sg(evalP(f, k))}) = ${sg(v)}.`,
      ]);
    }),
    many(8, () => {
      const m = R.ri(-4, 9);
      const n = R.ri(-4, 9);
      const c = R.ri(-6, 6);
      return P(
        `g(2) = ${sg(m)}, and f(x) = x² ${c < 0 ? M : '+'} ${Math.abs(c)}. What is f(g(2))?`,
        I(m * m + c),
        [
          `f(g(2)) = f(${sg(m)}).`,
          `${par(m)}² ${c < 0 ? M : '+'} ${Math.abs(c)} = ${sg(m * m + c)}.`,
        ],
      );
    }),
  );
  const core = mix(
    many(8, () => {
      const f = [1, R.ri(-5, 5), R.ri(-6, 6)];
      const g = [1, R.nz(-5, 5)];
      const c = compP(f, g);
      return P(`${fxT(f)} and ${fxT(g, 'g')}. f(g(x)) = x² + px + q. What is p?`, I(c[1]), [
        `f(g(x)) = (${polyT(g)})² ${f[1] < 0 ? M : '+'} ${Math.abs(f[1])}(${polyT(g)}) ${f[2] < 0 ? M : '+'} ${Math.abs(f[2])}.`,
        `Expanded: ${polyT(c)}, so p = ${sg(c[1])}.`,
      ]);
    }),
    many(8, () => {
      const f = [1, R.ri(-5, 5), R.ri(-6, 6)];
      const g = [1, R.nz(-5, 5)];
      const c = compP(f, g);
      return P(`${fxT(f)} and ${fxT(g, 'g')}. f(g(x)) = x² + px + q. What is q?`, I(c[2]), [
        `The constant term is f(g(0)) = f(${sg(g[1])}).`,
        `f(${sg(g[1])}) = ${substT(f, g[1])} = ${sg(c[2])}.`,
      ]);
    }),
    many(8, () => {
      const f = l1();
      const g = l1();
      const c = compP(f, g);
      const k = R.ri(-4, 5);
      const v = evalP(c, k);
      return P(`${fxT(f)} and ${fxT(g, 'g')}. What x gives f(g(x)) = ${sg(v)}?`, I(k), [
        `f(g(x)) = ${polyT(c)}.`,
        `Set ${polyT(c)} = ${sg(v)}: x = ${sg(k)}.`,
      ]);
    }),
    many(8, () => {
      const h = R.nz(-6, 6);
      return P(
        `f(x) = √x and g(x) = ${xa(-h)}. What is the smallest x in the domain of f(g(x))?`,
        I(h),
        [`f(g(x)) = √(${xa(-h)}), which needs ${xa(-h)} ≥ 0.`, `So x ≥ ${sg(h)}.`],
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      const a = R.pk([2, 3, 4, 5]);
      const b = R.nz(-6, 6);
      const c = R.pk([2, 3, 4, 5, 6]);
      if (a === 1) return null;
      const d = (b * (c - 1)) / (a - 1);
      if (!Number.isInteger(d)) return null;
      return P(
        `f(x) = ${polyT([a, b])} and g(x) = ${c}x + d. If f(g(x)) = g(f(x)) for every x, what is d?`,
        I(d),
        [
          `f(g(x)) = ${a}(${c}x + d) ${b < 0 ? M : '+'} ${Math.abs(b)} = ${a * c}x + ${a}d ${b < 0 ? M : '+'} ${Math.abs(b)}.`,
          `g(f(x)) = ${c}(${polyT([a, b])}) + d = ${a * c}x ${b * c < 0 ? M : '+'} ${Math.abs(b * c)} + d.`,
          `Match constants: ${a}d ${b < 0 ? M : '+'} ${Math.abs(b)} = ${sg(b * c)} + d, so d = ${sg(d)}.`,
        ],
      );
    }),
    many(8, () => {
      const f = l1();
      const g = l1();
      const h = l1();
      const k = R.ri(-3, 4);
      const v = evalP(f, evalP(g, evalP(h, k)));
      return P(`${fxT(f)}, ${fxT(g, 'g')} and ${fxT(h, 'h')}. What is f(g(h(${sg(k)})))?`, I(v), [
        `h(${sg(k)}) = ${sg(evalP(h, k))}.`,
        `g(${sg(evalP(h, k))}) = ${sg(evalP(g, evalP(h, k)))}.`,
        `f(${sg(evalP(g, evalP(h, k)))}) = ${sg(v)}.`,
      ]);
    }),
    many(8, () => {
      const f = [R.nz(-2, 3), R.ri(-4, 4), R.ri(-6, 6)];
      const g = [R.nz(-3, 3), R.ri(-4, 4)];
      const c = compP(f, g);
      return P(
        `${fxT(f)} and ${fxT(g, 'g')}. f(g(x)) = Ax² + Bx + C. What is A + B + C?`,
        I(c.reduce((s, v) => s + v, 0)),
        [
          `A + B + C is the value of f(g(x)) at x = 1.`,
          `g(1) = ${sg(evalP(g, 1))}, and f(${sg(evalP(g, 1))}) = ${sg(evalP(c, 1))}.`,
        ],
      );
    }),
    many(8, () => {
      const f = [1, 0, R.ri(-4, 6)];
      const g = [R.pk([2, 3, -2]), R.ri(-4, 4)];
      const c = compP(f, g);
      const k = R.ri(-2, 3);
      const d = compP(g, f);
      return P(
        `f(x) = x² ${f[2] < 0 ? M : '+'} ${Math.abs(f[2])} and ${fxT(g, 'g')}. What is f(g(${sg(k)})) ${M} g(f(${sg(k)}))?`.replace(
          '+ 0 ',
          '',
        ),
        I(evalP(c, k) - evalP(d, k)),
        [
          `f(g(${sg(k)})) = f(${sg(evalP(g, k))}) = ${sg(evalP(c, k))}.`,
          `g(f(${sg(k)})) = g(${sg(evalP(f, k))}) = ${sg(evalP(d, k))}.`,
          `${sg(evalP(c, k))} ${M} ${par(evalP(d, k))} = ${sg(evalP(c, k) - evalP(d, k))}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

// ───────── 8. Piecewise functions ─────────
const pw = (A, B, c, closedRight = true) =>
  `f(x) = ${A.t} for x ${closedRight ? '<' : '≤'} ${sg(c)}, and f(x) = ${B.t} for x ${closedRight ? '≥' : '>'} ${sg(c)}`;
function piece(kind, R, big) {
  if (kind === 'lin') {
    const cs = [R.nz(-big, big), R.ri(-big, big)];
    return { cs, t: polyT(cs) };
  }
  if (kind === 'quad') {
    const cs = [R.pk([1, 1, 2, -1]), 0, R.ri(-6, 6)];
    return { cs, t: polyT(cs) };
  }
  const cs = [R.ri(-big, big)];
  return { cs, t: String(cs[0]) };
}
function piecewise(L) {
  const { p, R } = setup(L, 'piecewise');
  const big = p ? 7 : 4;
  const mk2 = (k1, k2) => {
    let A = piece(k1, R, big);
    let B = piece(k2, R, big);
    while (A.t === B.t) B = piece(k2, R, big);
    const c = R.ri(-2, 3);
    const f = (x) => (x < c ? evalP(A.cs, x) : evalP(B.cs, x));
    return { A, B, c, f };
  };
  const warm = mix(
    many(8, () => {
      const { A, B, c, f } = mk2('lin', 'lin');
      const k = c - R.ri(1, 4);
      return P(`${pw(A, B, c)}. What is f(${sg(k)})?`, I(f(k)), [
        `${sg(k)} < ${sg(c)}, so use the first rule: ${A.t}.`,
        `${substT(A.cs, k)} = ${sg(f(k))}.`,
      ]);
    }),
    many(8, () => {
      const { A, B, c, f } = mk2('lin', 'lin');
      const k = c + R.ri(0, 4);
      return P(`${pw(A, B, c)}. What is f(${sg(k)})?`, I(f(k)), [
        `${sg(k)} ≥ ${sg(c)}, so use the second rule: ${B.t}.`,
        `${substT(B.cs, k)} = ${sg(f(k))}.`,
      ]);
    }),
    many(8, () => {
      const { A, B, c, f } = mk2('quad', 'lin');
      const k = c + R.ri(-3, 4);
      return P(`${pw(A, B, c)}. What is f(${sg(k)})?`, I(f(k)), [
        `${sg(k)} ${k < c ? '<' : '≥'} ${sg(c)}, so use the ${k < c ? 'first' : 'second'} rule.`,
        `${substT(k < c ? A.cs : B.cs, k)} = ${sg(f(k))}.`,
      ]);
    }),
    many(8, () => {
      const { A, B, c, f } = mk2('const', 'lin');
      const k = c + R.ri(-3, 4);
      return P(`${pw(A, B, c)}. What is f(${sg(k)})?`, I(f(k)), [
        `${sg(k)} ${k < c ? '<' : '≥'} ${sg(c)}, so use the ${k < c ? 'first' : 'second'} rule.`,
        k < c ? `The first rule is the constant ${sg(f(k))}.` : `${substT(B.cs, k)} = ${sg(f(k))}.`,
      ]);
    }),
  );
  const core = mix(
    many(8, () => {
      const { A, B, c, f } = mk2('lin', 'quad');
      const a1 = c - R.ri(1, 3);
      const b1 = c + R.ri(0, 3);
      return P(`${pw(A, B, c)}. What is f(${sg(a1)}) + f(${sg(b1)})?`, I(f(a1) + f(b1)), [
        `f(${sg(a1)}) = ${sg(f(a1))} using the first rule.`,
        `f(${sg(b1)}) = ${sg(f(b1))} using the second rule.`,
        `${sg(f(a1))} + ${par(f(b1))} = ${sg(f(a1) + f(b1))}.`,
      ]);
    }),
    many(8, () => {
      const { A, B, c, f } = mk2('lin', 'lin');
      if (B.cs[0] === 0) return null;
      const k = c + R.ri(0, 4);
      const v = f(k);
      return P(`${pw(A, B, c)}. For what x ≥ ${sg(c)} is f(x) = ${sg(v)}?`, I(k), [
        `Use the second rule: ${B.t} = ${sg(v)}.`,
        `x = ${sg(k)}.`,
      ]);
    }),
    many(8, () => {
      const { A, B, c, f } = mk2('lin', 'lin');
      if (A.cs[0] === 0) return null;
      const k = c - R.ri(1, 4);
      const v = f(k);
      return P(`${pw(A, B, c)}. For what x < ${sg(c)} is f(x) = ${sg(v)}?`, I(k), [
        `Use the first rule: ${A.t} = ${sg(v)}.`,
        `x = ${sg(k)}.`,
      ]);
    }),
    many(8, () => {
      const c = R.ri(-2, 4);
      const a1 = R.nz(-3, 3);
      const b1 = R.ri(-5, 5);
      const m = R.nz(-3, 3);
      const k = a1 * c + b1 - m * c;
      return P(
        `f(x) = ${polyT([a1, b1])} for x < ${sg(c)}, and f(x) = ${polyT([m, 0])} + k for x ≥ ${sg(c)}. For the two pieces to meet at x = ${sg(c)}, what is k?`,
        I(k),
        [
          `The first rule at x = ${sg(c)} gives ${sg(a1 * c + b1)}.`,
          `The second rule at x = ${sg(c)} gives ${sg(m * c)} + k.`,
          `Set them equal: k = ${sg(a1 * c + b1)} ${M} ${par(m * c)} = ${sg(k)}.`,
        ],
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      const { A, B, c, f } = mk2('quad', 'lin');
      let n = 0;
      for (let x = -10; x <= 10; x += 1) if (f(x) === f(c - 1)) n += 1;
      return P(
        `${pw(A, B, c)}. How many whole numbers x from −10 to 10 give the same output as x = ${sg(c - 1)}?`,
        I(n),
        [
          `f(${sg(c - 1)}) = ${sg(f(c - 1))}.`,
          `Test each rule on its own part of the number line: ${n} whole number${n === 1 ? '' : 's'} work.`,
        ],
      );
    }),
    many(8, () => {
      const { A, B, c, f } = mk2('lin', 'lin');
      const k = R.ri(c - 3, c + 3);
      const inner = f(k);
      return P(`${pw(A, B, c)}. What is f(f(${sg(k)}))?`, I(f(inner)), [
        `f(${sg(k)}) = ${sg(inner)}.`,
        `f(${sg(inner)}) = ${sg(f(inner))}, with the rule chosen by comparing ${sg(inner)} to ${sg(c)}.`,
      ]);
    }),
    many(8, () => {
      const c = R.ri(-3, 3);
      const m1 = R.pk([1, 2, 3]);
      const m2 = R.pk([-1, -2, 4]);
      const b2 = R.ri(-4, 4);
      const A = [m1, 0];
      const B = [m2, b2];
      const f = (x) => (x < c ? evalP(A, x) : evalP(B, x));
      const lo = -4;
      const hi = 5;
      let best = Infinity;
      for (let x = lo; x <= hi; x += 1) best = Math.min(best, f(x));
      return P(
        `f(x) = ${polyT(A)} for x < ${sg(c)}, and f(x) = ${polyT(B)} for x ≥ ${sg(c)}. What is the smallest value of f(x) over the whole numbers x from ${sg(lo)} to ${hi}?`.replace(
          'f(x) = ' + polyT(A),
          `f(x) = ${polyT(A)}`,
        ),
        I(best),
        [
          `Compute f at each whole number from ${lo} to ${hi}.`,
          `The smallest output is ${sg(best)}.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.ri(-3, 4);
      const k = R.ri(-4, 5);
      const a = R.pk([2, 3, -1]);
      const q = R.ri(-6, 6);
      const v = a * Math.abs(q - h) + k;
      return P(
        `f(x) = ${a === 1 ? '' : a === -1 ? M : a}|${xa(-h)}| ${k < 0 ? M : '+'} ${Math.abs(k)}.`.replace(
          / \+ 0\./,
          '.',
        ) + ` What is f(${sg(q)})?`,
        I(v),
        [
          `${sg(q)} ${h < 0 ? '+' : M} ${Math.abs(h)} = ${sg(q - h)}, and |${sg(q - h)}| = ${Math.abs(q - h)}.`,
          `${par(a)} × ${Math.abs(q - h)} + ${par(k)} = ${sg(v)}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

// ───────── 9. Even and odd functions ─────────
const FN = [
  { t: 'x⁴ − 5x² + 2', f: (x) => x ** 4 - 5 * x * x + 2 },
  { t: 'x³ − 4x', f: (x) => x ** 3 - 4 * x },
  { t: 'x² + 3x', f: (x) => x * x + 3 * x },
  { t: '|x| + 6', f: (x) => Math.abs(x) + 6 },
  { t: '2x⁵ + x³', f: (x) => 2 * x ** 5 + x ** 3 },
  { t: 'x³ + 2x² ', f: (x) => x ** 3 + 2 * x * x },
  { t: 'x² − 9', f: (x) => x * x - 9 },
  { t: '5x − 7', f: (x) => 5 * x - 7 },
  { t: '3x', f: (x) => 3 * x },
  { t: '4', f: () => 4 },
  { t: 'x⁶ − x⁴ + 1', f: (x) => x ** 6 - x ** 4 + 1 },
  { t: 'x⁵ − x', f: (x) => x ** 5 - x },
  { t: 'x · |x|', f: (x) => x * Math.abs(x) },
  { t: 'x² · (x − 1)', f: (x) => x * x * (x - 1) },
  { t: '2x⁴ + 3x²', f: (x) => 2 * x ** 4 + 3 * x * x },
  { t: 'x³ + x² + x', f: (x) => x ** 3 + x * x + x },
];
const kind = (f) => {
  let even = true;
  let odd = true;
  for (const x of [1, 2, 3, 4, 5]) {
    if (f(-x) !== f(x)) even = false;
    if (f(-x) !== -f(x)) odd = false;
  }
  return even && odd ? 'both' : even ? 'even' : odd ? 'odd' : 'neither';
};
const CODE = { even: 1, odd: 2, neither: 0 };
const KQ = 'Type 1 for even, 2 for odd, 0 for neither.';
function evenodd(L) {
  const { p, R } = setup(L, 'evenodd');
  const classes = FN.filter((x) => kind(x.f) !== 'both').map((x) => {
    const k = kind(x.f);
    return P(`Is f(x) = ${x.t.trim()} even, odd or neither? ${KQ}`, I(CODE[k]), [
      `Compare f(−x) with f(x). Test x = 2: f(2) = ${sg(x.f(2))} and f(${sg(-2)}) = ${sg(x.f(-2))}.`,
      k === 'even'
        ? 'The values match for every x, so f is even.'
        : k === 'odd'
          ? 'The values are opposites for every x, so f is odd.'
          : 'The values are neither equal nor opposite, so f is neither.',
    ]);
  });
  const shuf = (a) => a.slice().sort(() => R.ri(-1, 1));
  const ev = classes.filter((c) => c.a === '1');
  const od = classes.filter((c) => c.a === '2');
  const ne = classes.filter((c) => c.a === '0');
  const warm = mix(
    ev.slice(0, 3),
    od.slice(0, 3),
    ne.slice(0, 3),
    many(8, () => {
      const k = R.ri(1, 6);
      const v = R.nz(-9, 9);
      return P(`f is an even function and f(${k}) = ${sg(v)}. What is f(${sg(-k)})?`, I(v), [
        'An even function has f(−x) = f(x): symmetric about the y-axis.',
      ]);
    }),
    many(8, () => {
      const k = R.ri(1, 6);
      const v = R.nz(-9, 9);
      return P(`f is an odd function and f(${k}) = ${sg(v)}. What is f(${sg(-k)})?`, I(-v), [
        'An odd function has f(−x) = −f(x): symmetric about the origin.',
        `So f(${sg(-k)}) = −(${sg(v)}) = ${sg(-v)}.`,
      ]);
    }),
  );
  const core = mix(
    ev.slice(3),
    od.slice(3),
    ne.slice(3),
    many(8, () => {
      const k = R.ri(1, 6);
      const v = R.nz(-9, 9);
      return P(`f is odd and f(${k}) = ${sg(v)}. What is f(${k}) + f(${sg(-k)})?`, I(0), [
        `f(${sg(-k)}) = −f(${k}) = ${sg(-v)}.`,
        `${sg(v)} + ${par(-v)} = 0.`,
      ]);
    }),
    many(8, () => {
      const k = R.ri(1, 6);
      const v = R.nz(-9, 9);
      return P(`f is even and f(${sg(-k)}) = ${sg(v)}. What is f(${k}) + f(${sg(-k)})?`, I(2 * v), [
        `f(${k}) = f(${sg(-k)}) = ${sg(v)}.`,
        `${sg(v)} + ${par(v)} = ${sg(2 * v)}.`,
      ]);
    }),
    [['an odd function', 'f(0) = −f(0), so f(0) = 0.']].map(([t, why]) =>
      P(`Suppose ${t} f is defined at x = 0. What is f(0)?`, I(0), [why]),
    ),
    many(8, () => {
      const b = R.nz(-5, 5);
      const c = R.ri(-6, 6);
      const fn = (x) => x ** 4 + b * x * x + c;
      return P(
        `f(x) = x⁴ ${b < 0 ? M : '+'} ${Math.abs(b)}x² ${c < 0 ? M : '+'} ${Math.abs(c)}. Is f even, odd or neither? ${KQ}`.replace(
          / \+ 0\./,
          '.',
        ),
        I(1),
        [`Every power of x is even, so f(−x) = f(x).`, 'f is even.'],
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      const a = R.nz(-4, 4);
      const b = R.nz(-5, 5);
      const k = R.ri(1, 4);
      const v = a * k ** 3 + b * k;
      return P(`${fxT([a, 0, b, 0])}. What is f(${k}) + f(${sg(-k)})?`, I(0), [
        `f is odd (only odd powers), so f(${sg(-k)}) = −f(${k}) = ${sg(-v)}.`,
        `f(${k}) = ${sg(v)}, and the sum is 0.`,
      ]);
    }),
    many(8, () => {
      const k = R.ri(1, 6);
      const v = R.nz(-9, 9);
      const w = R.nz(-9, 9);
      return P(
        `f is even with f(${k}) = ${sg(v)}, and g is odd with g(${k}) = ${sg(w)}. What is f(${sg(-k)}) + g(${sg(-k)})?`,
        I(v - w),
        [
          `f(${sg(-k)}) = ${sg(v)}.`,
          `g(${sg(-k)}) = −g(${k}) = ${sg(-w)}.`,
          `${sg(v)} + ${par(-w)} = ${sg(v - w)}.`,
        ],
      );
    }),
    many(8, () => {
      const k = R.ri(1, 5);
      const v = R.nz(-9, 9);
      const w = R.nz(-9, 9);
      return P(
        `f is even with f(${k}) = ${sg(v)}, and g is odd with g(${k}) = ${sg(w)}. What is f(${sg(-k)}) × g(${sg(-k)})?`,
        I(-v * w),
        [
          `f(${sg(-k)}) = ${sg(v)} and g(${sg(-k)}) = ${sg(-w)}.`,
          `${par(v)} × ${par(-w)} = ${sg(-v * w)}.`,
        ],
      );
    }),
    many(8, () => {
      const pickN = (cond) => FN.filter((x) => kind(x.f) !== 'both' && cond(kind(x.f)));
      const list = shuf(FN.filter((x) => kind(x.f) !== 'both')).slice(0, 5);
      const n = list.filter((x) => kind(x.f) === 'even').length;
      void pickN;
      return P(
        `How many of these functions are even? ${list.map((x) => x.t.trim()).join(';  ')}`,
        I(n),
        list.map((x) => `${x.t.trim()} is ${kind(x.f)}.`),
      );
    }),
  );
  void p;
  return { warm, core, chal };
}

// ───────── 10. Asymptotes ─────────
function asymptotes(L) {
  const { p, R } = setup(L, 'asymptotes');
  const big = p ? 8 : 5;
  const warm = mix(
    many(8, () => {
      const h = R.nz(-big, big);
      const a = R.pk([1, 2, 3, 5]);
      return P(`f(x) = ${a}/(${xa(-h)}): what is the vertical asymptote x = a?`, I(h), [
        `The denominator is 0 when x = ${sg(h)}, and the numerator is not 0 there.`,
      ]);
    }),
    many(8, () => {
      const h = R.nz(-big, big);
      const k = R.nz(-big, big);
      return P(
        `f(x) = 1/(${xa(-h)}) ${k < 0 ? M : '+'} ${Math.abs(k)}: what is the horizontal asymptote y = b?`,
        I(k),
        [`As x grows large, 1/(${xa(-h)}) approaches 0.`, `So f approaches ${sg(k)}.`],
      );
    }),
    many(8, () => {
      const h = R.nz(-big, big);
      const s = R.pk([1, 2, 3, -1, -2]);
      const right = R.ri(0, 1) === 1;
      return P(
        `f(x) = ${sg(s)}/(${xa(-h)}). As x approaches ${sg(h)} from the ${right ? 'right' : 'left'}, does f(x) go to +∞ or −∞? Type 1 for +∞, −1 for −∞.`,
        I(s * (right ? 1 : -1) > 0 ? 1 : -1),
        [
          `Near x = ${sg(h)} the denominator is ${right ? 'a small positive' : 'a small negative'} number.`,
          `${sg(s)} divided by it is ${s * (right ? 1 : -1) > 0 ? 'large and positive' : 'large and negative'}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.nz(-4, 4);
      const c = R.nz(-4, 4);
      return P(
        `f(x) = (${polyT([a, 1])})/(${polyT([c, 3])}): what is the horizontal asymptote y = b? Write a fraction if needed.`,
        F(a, c),
        [`Compare the leading terms: ${sg(a)}x over ${sg(c)}x.`, `The ratio is ${F(a, c).disp}.`],
      );
    }),
  );
  const core = mix(
    many(8, () => {
      const h = R.nz(-big, big);
      const k = R.nz(-big, big);
      if (h === k) return null;
      return P(
        `f(x) = 1/((${xa(-h)})(${xa(-k)})): what is the sum of the x-values of its vertical asymptotes?`,
        I(h + k),
        [
          `The denominator is 0 at x = ${sg(h)} and x = ${sg(k)}.`,
          `${sg(h)} + ${par(k)} = ${sg(h + k)}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.nz(-4, 4);
      const c = R.nz(-4, 4);
      const d = R.nz(-9, 9);
      const x = F(-d, c);
      return P(
        `f(x) = (${polyT([a, 1])})/(${polyT([c, d])}): what is its vertical asymptote x = a? Write a fraction if needed.`,
        x,
        [`The denominator is 0 when ${polyT([c, d])} = 0.`, `x = ${x.disp}.`],
      );
    }),
    many(8, () => {
      const a = R.nz(-5, 5);
      const c = R.nz(-5, 5);
      return P(
        `f(x) = (${polyT([a, 0, 3])})/(${polyT([c, 1, 4])}): what is the horizontal asymptote y = b? Write a fraction if needed.`,
        F(a, c),
        [
          `The top and the bottom both have degree 2.`,
          `Divide the leading coefficients: ${sg(a)}/${sg(c)} = ${F(a, c).disp}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.nz(-5, 5);
      const c = R.nz(-5, 5);
      return P(
        `f(x) = (${polyT([a, 2])})/(${polyT([c, 0, 1])}): what is the horizontal asymptote y = b?`,
        I(0),
        [
          'The top has degree 1 and the bottom has degree 2.',
          'When the bottom grows faster, the fraction approaches 0.',
        ],
      );
    }),
  );
  const chal = mix(
    many(8, () => {
      const h = R.nz(-big, big);
      const k = R.nz(-big, big);
      if (h === k) return null;
      return P(
        `f(x) = (${xa(-h)})/((${xa(-h)})(${xa(-k)})): how many vertical asymptotes does the graph have?`,
        I(1),
        [
          `The factor ${xa(-h)} cancels, leaving a hole at x = ${sg(h)}.`,
          `Only x = ${sg(k)} remains as a vertical asymptote.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.nz(-6, 6);
      const c = R.nz(-6, 6);
      const k = R.nz(-5, 5);
      const e = R.ri(-4, 4);
      return P(
        `f(x) = (${polyT([a, 0, e])})/(${polyT([c, 0, 5])}) ${k < 0 ? M : '+'} ${Math.abs(k)}. What is its horizontal asymptote y = b? Write a fraction if needed.`,
        F(a + k * c, c),
        [
          `The fraction part approaches ${F(a, c).disp}.`,
          `Adding ${sg(k)} gives ${F(a + k * c, c).disp}.`,
        ],
      );
    }),
    many(8, () => {
      const a = R.nz(-3, 3);
      const c = R.pk([2, 3, 4, -2, -3]);
      const d = R.nz(-8, 8);
      const x = F(-d, c);
      const y = F(a, c);
      return P(
        `f(x) = (${polyT([a, 1])})/(${polyT([c, d])}). The horizontal asymptote is y = b and the vertical asymptote is x = h. What is b + h? Write a fraction if needed.`,
        F(a - d, c),
        [
          `b = ${y.disp} (ratio of the leading coefficients).`,
          `h = ${x.disp} (where the denominator is 0).`,
          `b + h = ${F(a - d, c).disp}.`,
        ],
      );
    }),
    many(8, () => {
      const h = R.ri(-5, 5);
      const k = R.ri(-5, 5);
      const n = R.ri(2, 4);
      return P(
        `f(x) = ${n}/(${xa(-h)}) ${k < 0 ? M : '+'} ${Math.abs(k)}: the two asymptotes are x = h and y = b. What is h + b?`.replace(
          / \+ 0:/,
          ':',
        ),
        I(h + k),
        [
          `The vertical asymptote is x = ${sg(h)}.`,
          `The horizontal asymptote is y = ${sg(k)}.`,
          `${sg(h)} + ${par(k)} = ${sg(h + k)}.`,
        ],
      );
    }),
  );
  return { warm, core, chal };
}

const BUILD = {
  whatis,
  domain,
  common,
  transform,
  inverse,
  combine,
  composite,
  piecewise,
  evenodd,
  asymptotes,
};

async function main() {
  const { readAnswer, contentValue, hasForm, approx } = await import(
    require('url').pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const out = { a1: {}, psat: {} };
  const problems = [];
  for (const id of ORDER) {
    for (const level of ['a1', 'psat']) {
      let list;
      try {
        list = bands(BUILD[id](level), `${level}.${id}`);
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
        const r = readAnswer(pr.a);
        if (!r.ok) {
          problems.push(`${where} answer "${pr.a}" ${r.message}`);
          return;
        }
        try {
          const v = approx(contentValue(pr.a));
          if (Math.abs(v - pr.val) > 1e-9)
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
  const dump = (level) =>
    Object.fromEntries(
      ORDER.map((id) => [
        id,
        out[level][id].map((pr) => ({
          q: pr.q,
          a: pr.a,
          ...(pr.form ? { form: pr.form } : {}),
          steps: pr.steps,
          ...(level === 'a1' ? { std: STD[id] } : {}),
          ...(pr.fig ? { fig: pr.fig } : {}),
        })),
      ]),
    );
  const dir = path.join(ROOT, 'apps/web/features/math');
  fs.writeFileSync(
    path.join(dir, 'psat-functions-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Functions chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const FUNCTIONS_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(dump('psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-functions-algebra1.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Algebra 1 (grade 9) problems per Functions chapter, 25 each from simple to complex, each tagged\n * with a Florida B.E.S.T. benchmark (MA.912.F.1 to F.2). The codes are from a third-party list and\n * were assigned from memory; a teacher should check them. Generated, so every answer is computed.\n */\nexport const FUNCTIONS_ALGEBRA1: Record<string, GuideProblem[]> = ${JSON.stringify(dump('a1'), null, 1)};\n`,
  );
  console.log('written function problems');
}

main();
