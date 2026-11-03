// Builds the Radicals study-guide problem files (psat-design.md). Every answer is computed, and every
// value is checked a second way (a float) against what math-check reads from the typed answer.
const fs = require('fs');
const path = require('path');
const { sg, frac, gcd, sqrtParts, radTxt } = require('../quadratics/lib.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const M = '−';
const ORDER = [
  'whatis',
  'perfect',
  'simplify',
  'muldiv',
  'addsub',
  'rationalize',
  'equations',
  'function',
  'imaginary',
  'uses',
];
const STD = {
  whatis: 'MA.912.NSO.1.1',
  perfect: 'MA.912.NSO.1.2',
  simplify: 'MA.912.NSO.1.2',
  muldiv: 'MA.912.NSO.1.2',
  addsub: 'MA.912.NSO.1.2',
  rationalize: 'MA.912.NSO.1.2',
  equations: 'MA.912.AR.9.1',
  function: 'MA.912.F.1.2',
  imaginary: 'MA.912.NSO.1.4',
  uses: 'MA.912.NSO.1.2',
};

// The video's own examples stay in the notes. No practice question may repeat one.
const VIDEO = [
  '√16',
  '√9',
  '±√9',
  '∛8',
  '√64',
  '∛125',
  '√50',
  '√80',
  '∛(−16)',
  '√2 · √8',
  '√20 · √3',
  '∛(−2) · ∛(−4)',
  '3√2 · 4√3',
  '−2∛4 · 3∛2',
  '3√2 + 5√2',
  '7∛5 − 2∛5',
  '√50 + √18',
  '(4√3 + 5)(2 − √3)',
  '2/√3',
  '5/(3 + √2)',
  '√(x + 3) = 7',
  '√(x + 1) = √(2x − 3)',
  '√(x + 5) = −3',
  'f(x) = √x',
  '√(−9)',
  '√(−8)',
  '√(−1)',
  'x² + 4x + 5 = 0',
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BANNED = VIDEO.map(
  (s) => new RegExp(`${/^\d/.test(s) ? '(?<!\\d)' : ''}${esc(s)}(?!\\d)`),
);
const banned = (q) => BANNED.some((re) => re.test(q));

// ───────── answers ─────────
const I = (n) => ({ a: String(n), disp: sg(n), val: n });
function F(n, d) {
  const f = frac(n, d);
  return {
    a: f.d === 1 ? String(f.n) : `${f.n}/${f.d}`,
    disp: f.d === 1 ? sg(f.n) : `${sg(f.n)}/${f.d}`,
    val: f.n / f.d,
    ...(f.d === 1 ? {} : { form: 'fraction' }),
  };
}

/** (N + s√r)/d in lowest terms, with r made square-free. */
function norm(N, s, r, d) {
  const [o, rest] = sqrtParts(r);
  s *= o;
  r = rest;
  if (r === 1) {
    N += s;
    s = 0;
  }
  if (d < 0) {
    N = -N;
    s = -s;
    d = -d;
  }
  const g = gcd(gcd(Math.abs(N), Math.abs(s)), d) || 1;
  return { N: N / g, s: s / g, r, d: d / g };
}

function E(N0, s0, r0, d0 = 1) {
  const { N, s, r, d } = norm(N0, s0, r0, d0);
  if (s === 0) return F(N, d);
  const neg = s < 0;
  const rad = radTxt(Math.abs(s), r);
  const dispTop = N === 0 ? `${neg ? M : ''}${rad}` : `${sg(N)} ${neg ? M : '+'} ${rad}`;
  const disp = d === 1 ? dispTop : N === 0 ? `${dispTop}/${d}` : `(${dispTop})/${d}`;
  const rootA = Math.abs(s) === 1 ? `sqrt(${r})` : `${Math.abs(s)}*sqrt(${r})`;
  const topA = N === 0 ? `${neg ? '-' : ''}${rootA}` : `${N}${neg ? '-' : '+'}${rootA}`;
  const a = d === 1 ? topA : N === 0 ? `${topA}/${d}` : `(${topA})/${d}`;
  return { a, disp, val: (N + s * Math.sqrt(r)) / d, form: 'radical', parts: { N, s, r, d } };
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

// ───────── text helpers ─────────
const SUP = { 2: '√', 3: '∛', 4: '∜' };
/** The n-th root of x, with brackets unless x is a plain whole number. */
function rt(n, x) {
  const s = typeof x === 'number' ? sg(x) : String(x);
  const body = /^(\d+|[a-z])$/.test(s) ? s : `(${s})`;
  return SUP[n] ? `${SUP[n]}${body}` : `the ${n}th root of ${body}`;
}
const root = rt;
/** A term c·ⁿ√r for a sum or product, e.g. −2∛4. */
const term = (c, n, r) => `${c < 0 ? M : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}${SUP[n]}${r}`;
/** A sum or difference of terms [[c, n, r], ...] as text. */
function sum(terms) {
  return terms
    .map(([c, n, r], i) =>
      i === 0 ? term(c, n, r) : ` ${c < 0 ? M : '+'} ${term(Math.abs(c), n, r)}`,
    )
    .join('');
}
/** x ± a as text (a may be negative); a = 0 gives plain x. */
const xa = (a, v = 'x') => (a === 0 ? v : `${v} ${a < 0 ? M : '+'} ${Math.abs(a)}`);
/** a·x ± b as text. */
const lin = (a, b) => xa(b, a === 1 ? 'x' : `${a}x`);
const cx = (a, b) => `${sg(a)} ${b < 0 ? M : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}i`;
const ints = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
const cubeParts = (n) => {
  let out = 1;
  let rest = n;
  for (let f = 2; f * f * f <= rest; f += 1) while (rest % (f * f * f) === 0) ((rest /= f * f * f), (out *= f));
  return [out, rest];
};
const isCube = (n) => Math.round(Math.cbrt(n)) ** 3 === n;

/** Interleaves lists so a band mixes the question types. */
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

// ───────── 1. What is a radical ─────────
function whatis(L) {
  const p = L === 'psat';
  const sq = p ? [14, 15, 17, 18, 19, 20, 22, 25, 11, 12] : [3, 5, 6, 7, 9, 10, 11, 12, 13, 15];
  const cu = p ? [7, 9, 11, 12, 13, 6, 10] : [3, 4, 6, 10, 5, 7, 9];
  const warm = mix(
    sq.map((k) =>
      P(`What is ${rt(2, k * k)}?`, I(k), [
        `Find the number that squares to ${k * k}.`,
        `${k} × ${k} = ${k * k}.`,
      ]),
    ),
    cu.map((k) =>
      P(`What is ${rt(3, k ** 3)}?`, I(k), [
        `Find the number that cubes to ${k ** 3}.`,
        `${k} × ${k} × ${k} = ${k ** 3}.`,
      ]),
    ),
    sq.map((k) =>
      P(`What is −${rt(2, k * k)}? Remember the sign in front.`, I(-k), [
        `The principal root of ${k * k} is ${k}.`,
        `The minus sign in front makes it ${sg(-k)}.`,
      ]),
    ),
    sq.map((k) =>
      P(`How many real numbers x satisfy x² = ${k * k}?`, I(2), [
        `Both ${k} and ${sg(-k)} square to ${k * k}.`,
      ]),
    ),
  );
  const core = mix(
    (p ? [49, 81, 100, 144, 225] : [25, 36, 121, 169, 196]).map((n) =>
      P(`Is ${root(2, -n)} a real number? Type 1 for yes, 0 for no.`, I(0), [
        `The index 2 is even and the radicand ${sg(-n)} is negative.`,
        'No real number squares to a negative.',
      ]),
    ),
    (p ? [64, 216, 343, 512, 729] : [27, 64, 216, 343, 1000]).map((n) =>
      P(`Is ${root(3, -n)} a real number? Type 1 for yes, 0 for no.`, I(1), [
        `The index 3 is odd, so the radicand can be negative.`,
        `${sg(-Math.cbrt(n))} cubed is ${sg(-n)}.`,
      ]),
    ),
    (p ? [4, 5, 6] : [3, 4, 5, 6]).map((n) =>
      P(`${root(n, 'x')} = x^(1/m). What is m?`, I(n), [
        `The radicand becomes the base and the index becomes the denominator of the exponent.`,
        `So the root is x^(1/${n}).`,
      ]),
    ),
    (p
      ? [[4, 4], [4, 5], [5, 3], [6, 2], [4, 6]]
      : [[4, 2], [4, 3], [5, 2], [6, 2], [4, 5]]
    ).map(([n, k]) =>
      P(`What is ${rt(n, k ** n)}?`, I(k), [
        `Find the number whose power ${n} is ${k ** n}.`,
        `${k}^${n} = ${k ** n}.`,
      ]),
    ),
    (p ? [81, 121, 169, 225] : [4, 49, 100, 144]).map((n) =>
      P(`What is ${n}^(1/2)?`, I(Math.sqrt(n)), [
        `A power of 1/2 is a square root.`,
        `${rt(2, n)} = ${Math.sqrt(n)}.`,
      ]),
    ),
  );
  const chal = mix(
    (p
      ? [
          [8, 2, 4],
          [27, 4, 81],
          [125, 2, 25],
          [64, 5, 1024],
        ]
      : [
          [8, 2, 4],
          [27, 2, 9],
          [64, 2, 16],
          [1000, 2, 100],
        ]
    ).map(([b, m, v]) =>
      P(`What is ${b}^(${m}/3)?`, I(v), [
        `Take the cube root first: ${Math.cbrt(b)}.`,
        `Then raise it to the power ${m}: ${Math.cbrt(b)}^${m} = ${v}.`,
      ]),
    ),
    (p
      ? [
          [36, 3, 216],
          [9, 5, 243],
          [49, 3, 343],
          [4, 5, 32],
        ]
      : [
          [4, 3, 8],
          [9, 3, 27],
          [16, 3, 64],
          [25, 3, 125],
        ]
    ).map(([b, m, v]) =>
      P(`What is ${b}^(${m}/2)?`, I(v), [
        `Take the square root first: ${Math.sqrt(b)}.`,
        `Then raise it to the power ${m}: ${Math.sqrt(b)}^${m} = ${v}.`,
      ]),
    ),
    p
      ? [
          [8, 2, 4],
          [4, 3, 8],
          [16, 3, 8],
          [27, 1, 3],
          [9, 1, 2],
        ].map(([b, m]) => {
          const e = b === 8 || b === 27 ? 3 : b === 16 ? 4 : 2;
          const base = Math.round(b ** (1 / e));
          return P(
            `What is ${b}^(−${m}/${e})? Write a fraction.`,
            F(1, base ** m),
            [
              `A negative exponent means the reciprocal.`,
              `${b}^(${m}/${e}) = ${base}^${m} = ${base ** m}.`,
            ],
          );
        })
      : ints(3, 12).map((k) => {
          const n = k * k;
          return P(`How many whole numbers from 1 to ${n} have a whole-number square root?`, I(k), [
            `The perfect squares in that range are 1², 2², …, ${k}².`,
          ]);
        }),
    (p ? [3, 5, 8, 11, 14, 17] : [2, 4, 6, 7, 9, 10]).map((a) =>
      P(`${root(2, `x − ${a}`)} is a real number only when x ≥ what number?`, I(a), [
        `The radicand must be at least 0, so x − ${a} ≥ 0.`,
        `That gives x ≥ ${a}.`,
      ]),
    ),
    (p ? [3, 5, 7, 9] : [2, 4, 6, 8]).map((a) => {
      const n = ints(-10, 10).filter((x) => x + a >= 0).length;
      return P(
        `How many whole numbers x from −10 to 10 make ${root(2, `x + ${a}`)} a real number?`,
        I(n),
        [`The radicand must satisfy x + ${a} ≥ 0, so x ≥ ${sg(-a)}.`, `Count the integers from ${sg(-a)} to 10.`],
      );
    }),
    (p ? [27, 64, 125, 343, 512] : [27, 64, 125, 216, 1000]).map((n) =>
      P(`What is the cube root of ${sg(-n)}?`, I(-Math.round(Math.cbrt(n))), [
        `The index 3 is odd, so a negative radicand is allowed.`,
        `${sg(-Math.round(Math.cbrt(n)))} × ${sg(-Math.round(Math.cbrt(n)))} × ${sg(-Math.round(Math.cbrt(n)))} = ${sg(-n)}.`,
      ]),
    ),
  );
  return { warm, core, chal };
}

// ───────── 2. Perfect squares and cubes ─────────
function perfect(L) {
  const p = L === 'psat';
  const warm = mix(
    (p ? [16, 17, 18, 19, 20, 25, 30] : [11, 12, 13, 14, 15, 16, 18]).map((n) =>
      P(`What is ${n}²?`, I(n * n), [`${n} × ${n} = ${n * n}.`]),
    ),
    (p ? [7, 8, 9, 11, 12, 15] : [3, 4, 5, 6, 7, 10]).map((n) =>
      P(`What is ${n}³?`, I(n ** 3), [`${n} × ${n} × ${n} = ${n ** 3}.`]),
    ),
    (p ? [196, 200, 289, 300, 361, 400] : [49, 50, 81, 90, 121, 130]).map((n) =>
      P(`Is ${n} a perfect square? Type 1 for yes, 0 for no.`, I(isSq(n) ? 1 : 0), [
        isSq(n)
          ? `${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}.`
          : `${Math.floor(Math.sqrt(n))}² = ${Math.floor(Math.sqrt(n)) ** 2} and ${Math.ceil(Math.sqrt(n))}² = ${Math.ceil(Math.sqrt(n)) ** 2}, so ${n} is between squares.`,
      ]),
    ),
    (p ? [343, 344, 512, 700, 729, 1000] : [27, 28, 64, 65, 125, 216]).map((n) =>
      P(`Is ${n} a perfect cube? Type 1 for yes, 0 for no.`, I(isCube(n) ? 1 : 0), [
        isCube(n)
          ? `${Math.round(Math.cbrt(n))}³ = ${n}.`
          : `${Math.floor(Math.cbrt(n))}³ = ${Math.floor(Math.cbrt(n)) ** 3} and ${Math.ceil(Math.cbrt(n))}³ = ${Math.ceil(Math.cbrt(n)) ** 3}, so ${n} is between cubes.`,
      ]),
    ),
  );
  const core = mix(
    (p ? [200, 450, 600, 777, 1000] : [20, 30, 50, 70, 90, 110]).map((n) => {
      let k = Math.floor(Math.sqrt(n)) + 1;
      return P(`What is the next perfect square after ${n}?`, I(k * k), [
        `${k - 1}² = ${(k - 1) ** 2} is not above ${n}.`,
        `${k}² = ${k * k} is the next one.`,
      ]);
    }),
    (p ? [500, 1000, 2000] : [50, 100, 150, 200]).map((x) => {
      const n = Math.floor(Math.sqrt(x));
      return P(`How many perfect squares are there from 1 to ${x}?`, I(n), [
        `${n}² = ${n * n} ≤ ${x} but ${n + 1}² = ${(n + 1) ** 2} is too big.`,
        `The squares are 1², 2², …, ${n}².`,
      ]);
    }),
    (p ? [2000, 5000, 10000] : [100, 500, 1000]).map((x) => {
      const n = Math.floor(Math.cbrt(x + 0.5));
      const m = ints(1, n + 1).filter((k) => k ** 3 <= x).length;
      return P(`How many perfect cubes are there from 1 to ${x}?`, I(m), [
        `Cube 1, 2, 3, … until the cube passes ${x}.`,
        `${m}³ = ${m ** 3} ≤ ${x} but ${m + 1}³ = ${(m + 1) ** 3} is too big.`,
      ]);
    }),
    (p ? [288, 432, 500, 675, 720, 968] : [32, 45, 48, 72, 75, 98, 108, 200]).map((n) => {
      const big = ints(1, 40)
        .map((k) => k * k)
        .filter((s) => n % s === 0)
        .at(-1);
      return P(`What is the largest perfect square that divides ${n}?`, I(big), [
        `Check the perfect squares 4, 9, 16, 25, … that divide ${n}.`,
        `The largest is ${big}, since ${n} = ${big} × ${n / big}.`,
      ]);
    }),
  );
  const chalSq = (p ? [180, 252, 294, 338, 450, 588, 720] : [8, 12, 18, 20, 24, 27, 28, 45]).map((n) => {
    const k = ints(1, 400).find((m) => isSq(n * m));
    return P(`What is the smallest positive whole number you can multiply ${n} by to get a perfect square?`, I(k), [
      `Factor ${n} and look for primes with an odd power.`,
      `${n} × ${k} = ${n * k} = ${Math.sqrt(n * k)}².`,
    ]);
  });
  const chalCu = (p ? [18, 24, 36, 40, 54, 100, 135] : [12, 16, 18, 24, 32, 40, 54, 81]).map((n) => {
    const k = ints(1, 400).find((m) => isCube(n * m));
    return P(`What is the smallest positive whole number you can multiply ${n} by to get a perfect cube?`, I(k), [
      `Factor ${n} and look for primes whose power is not a multiple of 3.`,
      `${n} × ${k} = ${n * k} = ${Math.round(Math.cbrt(n * k))}³.`,
    ]);
  });
  const sixth = (p ? [200, 1000, 5000, 20000] : [100, 200, 800]).map((x) => {
    const m = ints(1, 10).filter((k) => k ** 6 <= x).length;
    return P(
      `How many whole numbers from 1 to ${x} are both a perfect square and a perfect cube?`,
      I(m),
      [`A number that is both is a sixth power: 1⁶, 2⁶, 3⁶, ….`, `${m}⁶ = ${m ** 6} ≤ ${x}.`],
    );
  });
  const lastSq = (p ? [300, 500, 800, 1500] : [60, 90, 140]).map((x) => {
    const n = Math.ceil(Math.sqrt(x)) - 1;
    return P(`What is the largest whole number n for which n² is less than ${x}?`, I(n), [
      `${n}² = ${n * n} < ${x}, but ${n + 1}² = ${(n + 1) ** 2} is not.`,
    ]);
  });
  return { warm, core, chal: mix(chalSq, chalCu, sixth, lastSq) };
}

// ───────── 3. Simplifying radicals ─────────
function simplify(L) {
  const p = L === 'psat';
  const nsq = (p
    ? [180, 200, 242, 245, 288, 300, 320, 363, 392, 396, 432, 450, 468, 500, 507, 525, 567, 588, 600, 605, 675, 720, 726, 800, 845]
    : [12, 18, 20, 24, 27, 28, 32, 40, 44, 45, 48, 52, 54, 56, 63, 72, 75, 76, 88, 90, 96, 98, 99, 108, 112, 117, 120, 125, 128, 147]
  ).filter((n) => sqrtParts(n)[1] !== 1);
  const ncu = p
    ? [54, 108, 128, 162, 189, 192, 250, 256, 297, 320, 375, 432, 500, 686, 864]
    : [24, 40, 54, 56, 81, 88, 104, 108, 135, 128, 162, 189, 192, 250];
  const biggestSq = (n) => sqrtParts(n)[0] ** 2;
  // Each band uses its own radicands: small ones to warm up, larger ones later.
  const nWarm = nsq.slice(0, 7);
  const nCore = nsq.slice(7, 19);
  const nChal = nsq.slice(19);
  const warm = mix(
    nWarm.map((n) =>
      P(`What is the largest perfect square that divides ${n}?`, I(biggestSq(n)), [
        `Check 4, 9, 16, 25, … for factors of ${n}.`,
        `${n} = ${biggestSq(n)} × ${n / biggestSq(n)}.`,
      ]),
    ),
    nWarm.map((n) => {
      const [c, r] = sqrtParts(n);
      return P(`Simplify ${root(2, n)} to c${root(2, 'r')} with r as small as possible. What is c?`, I(c), [
        `${n} = ${c * c} × ${r}.`,
        `${root(2, n)} = ${root(2, c * c)} × ${root(2, r)} = ${c}${root(2, r)}.`,
      ]);
    }),
  );
  const core = mix(
    nCore.map((n) => {
      const [c, r] = sqrtParts(n);
      return P(`Write ${root(2, n)} in simplest radical form.`, E(0, c, r), [
        `${n} = ${c * c} × ${r}, and ${c * c} is a perfect square.`,
        `${root(2, n)} = ${root(2, c * c)} × ${root(2, r)} = ${c}${root(2, r)}.`,
      ]);
    }),
    nCore.slice(0, 6).map((n) => {
      const [c, r] = sqrtParts(n);
      return P(`Simplify ${root(2, n)} to c${root(2, 'r')} with r as small as possible. What is r?`, I(r), [
        `${n} = ${c * c} × ${r}.`,
        `The ${c * c} comes out as ${c}, and ${r} stays under the radical.`,
      ]);
    }),
  );
  const chal = mix(
    ncu.map((n) => {
      const [c, r] = cubeParts(n);
      return P(`Simplify ${root(3, n)} to c${root(3, 'r')} with r as small as possible. What is c?`, I(c), [
        `Look for a perfect cube factor: ${n} = ${c ** 3} × ${r}.`,
        `${root(3, n)} = ${root(3, c ** 3)} × ${root(3, r)} = ${c}${root(3, r)}.`,
      ]);
    }),
    ncu.map((n) => {
      const [c, r] = cubeParts(n);
      return P(`Simplify ${root(3, n)} to c${root(3, 'r')} with r as small as possible. What is r?`, I(r), [
        `Look for a perfect cube factor: ${n} = ${c ** 3} × ${r}.`,
        `The ${c ** 3} comes out as ${c}, and ${r} stays under the cube root.`,
      ]);
    }),
    nChal.map((n) => {
      const [c, r] = sqrtParts(n);
      return P(`${root(2, n)} in simplest radical form is c${root(2, 'r')}. What is c + r?`, I(c + r), [
        `${n} = ${c * c} × ${r}, so ${root(2, n)} = ${c}${root(2, r)}.`,
        `${c} + ${r} = ${c + r}.`,
      ]);
    }),
    ncu.map((n) => {
      const [c, r] = cubeParts(n);
      return P(`${root(3, -n)} = −c${root(3, 'r')} in simplest form. What is c × r?`, I(c * r), [
        `${root(3, -n)} = −${root(3, n)} because the index is odd.`,
        `${n} = ${c ** 3} × ${r}, so ${root(3, n)} = ${c}${root(3, r)}.`,
        `${c} × ${r} = ${c * r}.`,
      ]);
    }),
  );
  return { warm, core, chal };
}

// ───────── 4. Multiplying and dividing ─────────
function muldiv(L) {
  const p = L === 'psat';
  const sqPairs = p
    ? [[2, 72], [3, 48], [5, 45], [8, 50], [6, 54], [7, 63], [10, 40], [12, 75], [18, 98], [20, 45]]
    : [[2, 18], [3, 12], [5, 20], [2, 32], [6, 24], [8, 18], [3, 27], [7, 28], [12, 27], [5, 45]];
  const cuPairs = p
    ? [[4, 16], [9, 24], [2, 108], [5, 200], [6, 36], [3, 72]]
    : [[3, 9], [4, 16], [2, 32], [5, 25], [9, 24], [4, 54]];
  const divPairs = p
    ? [[288, 2], [180, 5], [450, 2], [363, 3], [500, 5], [392, 2]]
    : [[72, 2], [45, 5], [75, 3], [98, 2], [48, 3], [200, 2], [180, 5], [150, 6]];
  const nonSq = p
    ? [[6, 14], [10, 15], [14, 21], [15, 35], [22, 33], [26, 39]]
    : [[6, 10], [2, 6], [3, 6], [10, 5], [2, 14], [7, 14], [6, 15], [12, 5]];
  const warm = mix(
    [[3, 5], [2, 7], [5, 11], [3, 13], [6, 7], [2, 11]].map(([a, b]) =>
      P(`${root(2, a)} · ${root(2, b)} = ${root(2, 'n')}. What is n?`, I(a * b), [
        `Same index, so multiply the radicands.`,
        `${a} × ${b} = ${a * b}.`,
      ]),
    ),
    sqPairs.map(([a, b]) =>
      P(`What is ${root(2, a)} · ${root(2, b)}?`, I(Math.sqrt(a * b)), [
        `Multiply the radicands: ${a} × ${b} = ${a * b}.`,
        `${root(2, a * b)} = ${Math.sqrt(a * b)}.`,
      ]),
    ),
    cuPairs.map(([a, b]) =>
      P(`What is ${root(3, a)} · ${root(3, b)}?`, I(Math.round(Math.cbrt(a * b))), [
        `Multiply the radicands: ${a} × ${b} = ${a * b}.`,
        `${root(3, a * b)} = ${Math.round(Math.cbrt(a * b))}.`,
      ]),
    ),
    divPairs.map(([a, b]) =>
      P(`What is ${root(2, a)} / ${root(2, b)}?`, I(Math.sqrt(a / b)), [
        `Divide the radicands: ${a} ÷ ${b} = ${a / b}.`,
        `${root(2, a / b)} = ${Math.sqrt(a / b)}.`,
      ]),
    ),
  );
  const prodSimple = nonSq.map(([a, b]) => {
    const [c, r] = sqrtParts(a * b);
    return P(`Write ${root(2, a)} · ${root(2, b)} in simplest radical form.`, E(0, c, r), [
      `Multiply the radicands: ${a} × ${b} = ${a * b}.`,
      `${a * b} = ${c * c} × ${r}, so ${root(2, a * b)} = ${radTxt(c, r)}.`,
    ]);
  });
  const mixedProd = (p
    ? [[3, 6, 5, 10], [4, 3, 6, 21], [2, 15, 3, 10], [5, 7, 4, 14]]
    : [[2, 3, 5, 6], [3, 2, 4, 6], [4, 5, 2, 10], [2, 7, 3, 7]]
  ).map(([c, a, d, b]) => {
    const [o, r] = sqrtParts(a * b);
    return P(
      `Write (${c}${root(2, a)})(${d}${root(2, b)}) in simplest radical form.`,
      E(0, c * d * o, r),
      [
        `Multiply the coefficients: ${c} × ${d} = ${c * d}.`,
        `Multiply the radicands: ${a} × ${b} = ${a * b} = ${o * o} × ${r}.`,
        `${c * d} × ${o}${r === 1 ? '' : root(2, r)} = ${radTxt(c * d * o, r)}.`,
      ],
    );
  });
  const quot = (p
    ? [[360, 5], [270, 5], [375, 5], [392, 7], [288, 3], [440, 5]]
    : [[90, 5], [48, 6], [54, 3], [150, 5], [200, 5], [110, 5], [60, 5]]
  ).map(([a, b]) => {
    const [c, r] = sqrtParts(a / b);
    return P(`Write ${root(2, a)} / ${root(2, b)} in simplest radical form.`, E(0, c, r), [
      `Divide the radicands: ${a} ÷ ${b} = ${a / b}.`,
      `${a / b} = ${c * c} × ${r}, so ${root(2, a / b)} = ${radTxt(c, r)}.`,
    ]);
  });
  const mixedQuot = (p
    ? [[42, 90, 6, 5], [35, 280, 7, 5], [24, 176, 8, 11]]
    : [[12, 10, 4, 5], [18, 14, 6, 7], [20, 6, 5, 3], [30, 15, 10, 5]]
  ).map(([c, a, d, b]) => {
    const [o, r] = sqrtParts(a / b);
    const k = (c * o) / d;
    return Number.isInteger(k)
      ? P(
          `Write (${c}${root(2, a)})/(${d}${root(2, b)}) in simplest radical form.`,
          E(0, k, r),
          [
            `Divide the coefficients: ${c} ÷ ${d} = ${c / d}.`,
            `Divide the radicands: ${a} ÷ ${b} = ${a / b} = ${o * o} × ${r}.`,
            `${c / d} × ${o}${r === 1 ? '' : root(2, r)} = ${radTxt(k, r)}.`,
          ],
        )
      : null;
  });
  const core = mix(prodSimple, mixedProd, quot, mixedQuot.filter(Boolean));
  const cubeProd = (p
    ? [[3, 4, -5, 2], [2, 3, 5, 9], [-4, 4, 3, 6], [2, 9, 6, 6], [5, 2, -3, 4]]
    : [[2, 3, 5, 9], [-3, 4, 5, 2], [4, 2, 3, 4], [-2, 6, 3, 36], [3, 5, 2, 25]]
  ).map(([c, a, d, b]) => {
    const k = Math.round(Math.cbrt(a * b));
    if (k ** 3 !== a * b) return null;
    return P(`What is (${c < 0 ? M : ''}${Math.abs(c)}${root(3, a)})(${d < 0 ? M : ''}${Math.abs(d)}${root(3, b)})?`, I(c * d * k), [
      `Multiply the coefficients: ${sg(c)} × ${sg(d)} = ${sg(c * d)}.`,
      `Multiply the radicands: ${a} × ${b} = ${a * b}, and ${root(3, a * b)} = ${k}.`,
      `${sg(c * d)} × ${k} = ${sg(c * d * k)}.`,
    ]);
  });
  const triple = (p
    ? [[2, 5, 10], [3, 7, 21], [6, 10, 15], [2, 8, 9]]
    : [[2, 3, 6], [3, 5, 15], [2, 5, 10], [6, 8, 12]]
  ).map(([a, b, c]) =>
    isSq(a * b * c)
      ? P(`What is ${root(2, a)} · ${root(2, b)} · ${root(2, c)}?`, I(Math.sqrt(a * b * c)), [
          `Multiply the three radicands: ${a} × ${b} × ${c} = ${a * b * c}.`,
          `${root(2, a * b * c)} = ${Math.sqrt(a * b * c)}.`,
        ])
      : null,
  );
  const squared = (p ? [[7, 3], [5, 6], [11, 4], [3, 9]] : [[5, 3], [2, 6], [7, 2], [3, 4]]).map(([c, a]) =>
    P(`What is (${c}${root(2, a)})²?`, I(c * c * a), [
      `Square the coefficient and the root: ${c}² = ${c * c} and (${root(2, a)})² = ${a}.`,
      `${c * c} × ${a} = ${c * c * a}.`,
    ]),
  );
  const prodTwo = (p
    ? [[12, 15], [18, 30], [24, 20], [28, 21]]
    : [[8, 12], [12, 15], [18, 20], [20, 24]]
  ).map(([a, b]) => {
    const [c, r] = sqrtParts(a * b);
    return P(`Write ${root(2, a)} · ${root(2, b)} in simplest radical form.`, E(0, c, r), [
      `Multiply the radicands: ${a} × ${b} = ${a * b}.`,
      `${a * b} = ${c * c} × ${r}, so ${root(2, a * b)} = ${radTxt(c, r)}.`,
    ]);
  });
  const chal = mix(cubeProd.filter(Boolean), triple.filter(Boolean), squared, prodTwo);
  return { warm, core, chal };
}

// ───────── 5. Adding and subtracting ─────────
function addsub(L) {
  const p = L === 'psat';
  const rs = p ? [2, 3, 5, 6, 7, 10, 11] : [2, 3, 5, 6, 7];
  const cs = p
    ? [[7, 4], [9, 5], [12, 7], [8, 11], [15, 6], [13, 9]]
    : [[2, 3], [4, 5], [6, 1], [7, 2], [5, 4], [9, 3]];
  const warm = mix(
    cs.map(([a, b], i) => {
      const r = rs[i % rs.length];
      return P(`${term(a, 2, r)} + ${term(b, 2, r)} = c${root(2, r)}. What is c?`, I(a + b), [
        `The radical parts match, so these are like terms.`,
        `Add the coefficients: ${a} + ${b} = ${a + b}.`,
      ]);
    }),
    cs.map(([a, b], i) => {
      const r = rs[(i + 2) % rs.length];
      return P(`${term(a + b, 2, r)} − ${term(b, 2, r)} = c${root(2, r)}. What is c?`, I(a), [
        `The radical parts match, so these are like terms.`,
        `Subtract the coefficients: ${a + b} − ${b} = ${a}.`,
      ]);
    }),
    [[2, 3], [5, 7], [3, 6], [2, 5], [7, 11], [6, 10]].map(([a, b]) =>
      P(`Can ${term(3, 2, a)} + ${term(4, 2, b)} be combined into one term? Type 1 for yes, 0 for no.`, I(0), [
        `The radicands ${a} and ${b} are different, so they are not like terms.`,
      ]),
    ),
    (p ? [[11, 11], [6, 9], [13, 13], [4, 10]] : [[5, 5], [5, 7], [3, 3], [6, 5]]).map(([c1, c2]) => {
      const same = c1 === c2;
      return P(
        `Can ${term(5, 3, c1)} − ${term(2, 3, c2)} be combined into one term? Type 1 for yes, 0 for no.`,
        I(same ? 1 : 0),
        [
          same
            ? `Same index 3 and same radicand ${c1}: like terms.`
            : `The radicands ${c1} and ${c2} differ, so they are not like terms.`,
        ],
      );
    }),
  );
  const coreLike = cs.flatMap(([a, b], i) => {
    const r = rs[i % rs.length];
    return [
      P(`Simplify ${term(a, 2, r)} + ${term(b, 2, r)}.`, E(0, a + b, r), [
        `Like terms: add the coefficients ${a} + ${b} = ${a + b}.`,
        `Keep ${root(2, r)}.`,
      ]),
      P(`Simplify ${term(a + b, 2, r)} − ${term(b, 2, r)}.`, E(0, a, r), [
        `Like terms: subtract the coefficients ${a + b} − ${b} = ${a}.`,
        `Keep ${root(2, r)}.`,
      ]),
    ];
  });
  const uv = (p
    ? [[3, 4], [2, 5], [4, 6], [3, 7], [5, 2]]
    : [[2, 3], [1, 4], [3, 2], [2, 5], [4, 1]]
  );
  const coreSimp = uv.flatMap(([u, v], i) => {
    const r = rs[i % rs.length];
    const a = u * u * r;
    const b = v * v * r;
    return [
      P(`Simplify ${root(2, a)} + ${root(2, b)}.`, E(0, u + v, r), [
        `${root(2, a)} = ${radTxt(u, r)} and ${root(2, b)} = ${radTxt(v, r)}.`,
        `Now they are like terms: ${u} + ${v} = ${u + v}.`,
      ]),
      u !== v
        ? P(`Simplify ${root(2, a)} − ${root(2, b)}.`, E(0, u - v, r), [
            `${root(2, a)} = ${radTxt(u, r)} and ${root(2, b)} = ${radTxt(v, r)}.`,
            `Now they are like terms: ${u} − ${v} = ${sg(u - v)}.`,
          ])
        : null,
    ];
  });
  const core = mix(coreLike, coreSimp.filter(Boolean));
  const three = (p
    ? [[2, 3, 5, 2], [4, 2, 3, 3], [3, 5, 2, 6], [2, 4, 3, 5]]
    : [[2, 3, 1, 2], [3, 2, 1, 3], [1, 4, 2, 5], [2, 1, 3, 2], [4, 1, 2, 3]]
  ).map(([u, v, w, r]) => {
    const t = [[u * u * r, 1], [v * v * r, 1], [w * w * r, -1]];
    const total = u + v - w;
    return P(`Simplify ${root(2, t[0][0])} + ${root(2, t[1][0])} − ${root(2, t[2][0])}.`, E(0, total, r), [
      `Simplify each: ${radTxt(u, r)}, ${radTxt(v, r)}, ${radTxt(w, r)}.`,
      `Combine: ${u} + ${v} − ${w} = ${total}.`,
    ]);
  });
  const fo = (p
    ? [[5, 2], [6, 3], [7, 5], [4, 7], [3, 11]]
    : [[3, 2], [4, 3], [2, 5], [5, 2], [6, 3]]
  );
  // (√a + b)(√a − b): a is not a perfect square, so the root stays a root.
  const conjSet = p
    ? [[5, 6], [7, 4], [11, 3], [13, 5], [10, 7]]
    : [[2, 3], [3, 2], [5, 4], [7, 3], [6, 5]];
  const conj = conjSet.map(([a, b]) =>
    P(`What is (${root(2, a)} + ${b})(${root(2, a)} − ${b})?`, I(a - b * b), [
      `A sum times a difference: (x + y)(x − y) = x² − y².`,
      `${a} − ${b * b} = ${sg(a - b * b)}.`,
    ]),
  );
  const sqBin = fo.map(([a, r]) =>
    P(`Write (${a} + ${root(2, r)})² in the form m + n${root(2, r)}.`, E(a * a + r, 2 * a, r), [
      `(${a} + ${root(2, r)})² = ${a * a} + 2 × ${a} × ${root(2, r)} + ${r}.`,
      `That is ${a * a + r} + ${2 * a}${root(2, r)}.`,
    ]),
  );
  const foil = (p
    ? [[3, 2, 2, 5, 3], [2, 5, 3, 1, 7], [4, 1, 2, 3, 6]]
    : [[2, 1, 3, 4, 2], [1, 3, 2, 1, 3], [3, 2, 1, 2, 5]]
  ).map(([a, b, c, d, r]) => {
    const N = a * c * r + b * d;
    const s = a * d + b * c;
    return P(`Write (${a === 1 ? '' : a}${root(2, r)} + ${b})(${c === 1 ? '' : c}${root(2, r)} + ${d}) in simplest form.`, E(N, s, r), [
      `FOIL: ${a * c}·${r} + ${a * d}${root(2, r)} + ${b * c}${root(2, r)} + ${b * d}.`,
      `${a * c * r} + ${b * d} = ${N} and ${a * d} + ${b * c} = ${s}.`,
    ]);
  });
  const chal = mix(three, conj, sqBin, foil);
  return { warm, core, chal };
}

// ───────── 6. Rationalizing the denominator ─────────
function rationalize(L) {
  const p = L === 'psat';
  const bs = p ? [2, 3, 5, 6, 7, 10, 11, 13] : [2, 3, 5, 6, 7, 10];
  const as = p ? [4, 9, 12, 15, 18, 21, 22, 30] : [1, 2, 3, 4, 5, 6, 8, 10];
  const warm = mix(
    bs.map((b) =>
      P(`To rationalize 1/${root(2, b)}, multiply top and bottom by ${root(2, b)}. What is the new denominator?`, I(b), [
        `${root(2, b)} × ${root(2, b)} = ${b}.`,
      ]),
    ),
    (p ? [[5, 3], [7, 2], [6, 5], [8, 3], [9, 7], [11, 6]] : [[3, 2], [5, 6], [4, 3], [2, 5], [6, 2], [7, 3]]).map(([c, d]) =>
      P(`What is (${c} + ${root(2, d)})(${c} − ${root(2, d)})?`, I(c * c - d), [
        `x² − y² with x = ${c} and y = ${root(2, d)}.`,
        `${c * c} − ${d} = ${c * c - d}.`,
      ]),
    ),
    (p ? [[5, 3], [7, 2], [6, 5], [8, 3], [9, 7]] : [[3, 2], [5, 6], [4, 3], [2, 5], [6, 2]]).map(([c, d]) =>
      P(`To rationalize 1/(${c} + ${root(2, d)}), you multiply top and bottom by ${c} − ${root(2, d)}. What is the new denominator?`, I(c * c - d), [
        `(${c} + ${root(2, d)})(${c} − ${root(2, d)}) = ${c * c} − ${d}.`,
        `That is ${c * c - d}.`,
      ]),
    ),
  );
  const single = as.flatMap((a) =>
    bs.slice(0, 5).map((b) => {
      const v = E(0, a, b, b);
      return P(`Rationalize the denominator of ${a}/${root(2, b)}.`, v, [
        `Multiply top and bottom by ${root(2, b)}.`,
        `${a}${root(2, b)} / ${b}.`,
        `Reduce: ${v.disp}.`,
      ]);
    }),
  );
  const sqrtOver = (p ? [[5, 7], [3, 11], [7, 5], [2, 13]] : [[3, 5], [2, 3], [5, 7], [3, 2]]).map(([a, b]) => {
    const v = E(0, 1, a * b, b);
    return P(`Rationalize the denominator of ${root(2, a)}/${root(2, b)}.`, v, [
      `Multiply top and bottom by ${root(2, b)}.`,
      `${root(2, a)} × ${root(2, b)} = ${root(2, a * b)}, and ${root(2, b)} × ${root(2, b)} = ${b}.`,
      `Reduce: ${v.disp}.`,
    ]);
  });
  const core = mix(single, sqrtOver);
  const conjSets = p
    ? [[6, 5, 2], [10, 4, 3], [12, 5, 3], [8, 3, 2], [14, 6, 5], [21, 5, 6]]
    : [[6, 3, 2], [4, 3, 5], [10, 4, 7], [5, 4, 3], [8, 5, 3], [12, 4, 2]];
  const conj = conjSets.flatMap(([a, c, d]) => {
    const D = c * c - d;
    if (D === 0) return [];
    const v = E(a * c, -a, d, D);
    return [
      P(`Rationalize the denominator of ${a}/(${c} + ${root(2, d)}).`, v, [
        `Multiply top and bottom by the conjugate ${c} − ${root(2, d)}.`,
        `Top: ${a * c} − ${a}${root(2, d)}. Bottom: ${c * c} − ${d} = ${D}.`,
        `Reduce: ${v.disp}.`,
      ]),
    ];
  });
  const twoRoots = (p
    ? [[6, 7, 3], [10, 5, 2], [12, 11, 2], [8, 6, 2]]
    : [[4, 5, 3], [6, 7, 2], [3, 6, 3], [10, 5, 3]]
  ).map(([a, b, c]) => {
    const D = b - c;
    return P(
      `In ${a}/(${root(2, b)} + ${root(2, c)}), you multiply top and bottom by ${root(2, b)} − ${root(2, c)}. What is the new denominator?`,
      I(D),
      [
        `(${root(2, b)} + ${root(2, c)})(${root(2, b)} − ${root(2, c)}) = ${b} − ${c}.`,
        `${b} − ${c} = ${D}.`,
      ],
    );
  });
  const denomOnly = conjSets.map(([a, c, d]) => {
    const D = c * c - d;
    return P(`After rationalizing ${a}/(${c} − ${root(2, d)}), what is the new denominator?`, I(D), [
      `Multiply top and bottom by ${c} + ${root(2, d)}.`,
      `(${c} − ${root(2, d)})(${c} + ${root(2, d)}) = ${c * c} − ${d} = ${D}.`,
    ]);
  });
  const chal = mix(conj, denomOnly, twoRoots);
  return { warm, core, chal };
}

// ───────── 7. Equations with radicals ─────────
function equations(L) {
  const p = L === 'psat';
  const ks = p ? [6, 7, 8, 9, 11, 12, 13] : [2, 3, 4, 5, 6, 7, 8, 9];
  const as = p ? [-11, -7, -4, 5, 8, 12] : [-5, -3, -2, 2, 4, 6, 7];
  const warm = mix(
    ks.map((k) =>
      P(`Solve √x = ${k}.`, I(k * k), [`Square both sides.`, `x = ${k}² = ${k * k}.`]),
    ),
    as.map((a, i) => {
      const k = ks[i % ks.length];
      return P(`Solve ${root(2, xa(a))} = ${k}.`, I(k * k - a), [
        `Square both sides: ${xa(a)} = ${k * k}.`,
        `x = ${k * k} ${a < 0 ? '+' : '−'} ${Math.abs(a)} = ${sg(k * k - a)}.`,
      ]);
    }),
    as.map((a, i) => {
      const k = [-4, -3, -2, 2, 3, 4, 5][i % 7];
      return P(`Solve ${root(3, xa(a))} = ${sg(k)}.`, I(k ** 3 - a), [
        `Cube both sides: ${xa(a)} = ${sg(k ** 3)}.`,
        `x = ${sg(k ** 3)} ${a < 0 ? '+' : '−'} ${Math.abs(a)} = ${sg(k ** 3 - a)}.`,
      ]);
    }),
    as.map((a, i) => {
      const k = ks[(i + 3) % ks.length];
      const right = k * k - a;
      const t = i % 2 === 0 ? right : right + 1;
      const ok = t + a === k * k;
      return P(`Is x = ${sg(t)} a solution of ${root(2, xa(a))} = ${k}? Type 1 for yes, 0 for no.`, I(ok ? 1 : 0), [
        `Square both sides: ${xa(a)} should equal ${k * k}.`,
        ok
          ? `At x = ${sg(t)} the radicand is ${sg(t + a)} = ${k * k}, so x = ${sg(t)} works.`
          : `At x = ${sg(t)} the radicand is ${sg(t + a)}, not ${k * k}, so x = ${sg(t)} does not work.`,
      ]);
    }),
  );
  const core = mix(
    ks.flatMap((k) => [2, 3].map((a) => {
      const b = k % 2 === 0 ? 1 : 3;
      const total = k * k - b;
      if (total % a !== 0) return null;
      const x = total / a;
      return P(`Solve ${root(2, lin(a, b))} = ${k}.`, I(x), [
        `Square both sides: ${lin(a, b)} = ${k * k}.`,
        `${a}x = ${k * k - b}, so x = ${x}.`,
        `Check: ${root(2, a * x + b)} = ${k}. ✓`,
      ]);
    })),
    ks.map((k, i) => {
      const a = as[i % as.length];
      const c = [1, 2, 3][i % 3];
      if (k - c < 0) return null;
      const x = (k - c) ** 2 - a;
      return P(`Solve ${root(2, xa(a))} + ${c} = ${k}.`, I(x), [
        `Isolate the radical: ${root(2, xa(a))} = ${k - c}.`,
        `Square both sides: ${xa(a)} = ${(k - c) ** 2}.`,
        `x = ${sg(x)}.`,
      ]);
    }),
    ks.slice(0, 6).map((k, i) =>
      P(`How many solutions does ${root(2, xa([2, 4, 6, 8, 3, 5][i]))} = ${sg(-k)} have?`, I(0), [
        `A principal square root is never negative.`,
        `It cannot equal ${sg(-k)}, so there are 0 solutions.`,
      ]),
    ),
    (p
      ? [[3, 2, 1, 8], [5, 1, 2, 13], [4, 7, 1, 22], [6, 2, 3, 14], [3, -2, 1, 6]]
      : [[2, 1, 1, 7], [2, 3, 1, 8], [4, 1, 2, 9], [3, 5, 1, 13], [5, 2, 3, 6]]
    ).map(([a, b, c, d]) => {
      const x = (d - b) / (a - c);
      if (!Number.isInteger(x) || a * x + b < 0) return null;
      return P(`Solve ${root(2, lin(a, b))} = ${root(2, lin(c, d))}.`, I(x), [
        `Square both sides: ${lin(a, b)} = ${lin(c, d)}.`,
        `${a - c === 1 ? '' : a - c}x = ${d - b}, so x = ${x}.`,
        `Check: both radicals equal ${root(2, a * x + b)}. ✓`,
      ]);
    }),
  );
  // √(x + a) = x − b
  // Choose b and the good root rOk (at least b + 2); the other root is rBad = 2b + 1 − rOk, below b.
  const quads = (p
    ? [[3, 7], [4, 8], [5, 9], [6, 10], [5, 8], [4, 9]]
    : [[1, 3], [2, 5], [3, 6], [2, 4], [4, 7], [1, 4]]
  )
    .map(([b, rOk]) => {
      const rBad = 2 * b + 1 - rOk;
      return { rOk, rBad, a: b * b - rOk * rBad, b };
    })
    .filter(({ rOk, rBad, b }) => rOk >= b + 2 && rBad < b);
  const fac = (r) => (r === 0 ? 'x' : `(x ${r < 0 ? '+' : '−'} ${Math.abs(r)})`);
  const quadItems = quads.map(({ rOk, rBad, a, b }) => {
    const sols = ints(-60, 90).filter((x) => x + a >= 0 && x - b >= 0 && x + a === (x - b) ** 2);
    if (sols.length !== 1 || sols[0] !== rOk) return null;
    return P(`Solve ${root(2, xa(a))} = ${xa(-b)}. Check for extraneous roots.`, I(rOk), [
      `Square both sides: ${xa(a)} = (${xa(-b)})².`,
      `Move everything to one side and factor: ${fac(rBad)}${fac(rOk)} = 0.`,
      `x = ${rOk} works. x = ${sg(rBad)} makes ${xa(-b)} = ${sg(rBad - b)}, which is negative, so it is extraneous.`,
    ]);
  });
  const extra = quads.map(({ rOk, rBad, a, b }) =>
    P(`Squaring ${root(2, xa(a))} = ${xa(-b)} gives two roots. What is the extraneous root?`, I(rBad), [
      `Square both sides: ${xa(a)} = (${xa(-b)})², so ${fac(rBad)}${fac(rOk)} = 0.`,
      `x = ${rOk} gives ${xa(-b)} = ${rOk - b} ≥ 0, so it works.`,
      `x = ${sg(rBad)} gives ${xa(-b)} = ${sg(rBad - b)} < 0, so it is extraneous.`,
    ]),
  );
  const uu = (p ? [4, 5, 6, 7, 8] : [3, 4, 5, 6, 2]).map((u) => {
    const k = u * u - u;
    return P(`Solve x − √x = ${k}. Only x ≥ 0 is allowed.`, I(u * u), [
      `Let u = √x, so u² − u = ${k}, which is (u − ${u})(u + ${u - 1}) = 0.`,
      `u = ${u} works. u = ${sg(-(u - 1))} is impossible because √x is not negative.`,
      `x = u² = ${u * u}.`,
    ]);
  });
  const chal = mix(quadItems.filter(Boolean), extra, uu);
  return { warm, core: core.filter(Boolean), chal };
}

// ───────── 8. The radical function ─────────
function gridFn(h, k, sign = 1) {
  const pts = [];
  for (let t = 0; t <= 16; t += 1) pts.push([h + t / 2, k + (sign * Math.sqrt(t / 2)) ]);
  return {
    kind: 'grid',
    x: [h - 3, h + 9],
    y: [Math.min(k, k + sign * 3) - 2, Math.max(k, k + sign * 3) + 2],
    lines: [{ pts: pts.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]), label: 'f' }],
    pts: [{ at: [h, k], label: `(${sg(h)}, ${sg(k)})` }],
    free: true,
  };
}
const fx = (h, k, a = 1) => {
  const inner = xa(-h);
  const body = a === 1 ? `√(${inner})` : a === -1 ? `−√(${inner})` : `${a}√(${inner})`;
  return `f(x) = ${body}${k === 0 ? '' : ` ${k < 0 ? M : '+'} ${Math.abs(k)}`}`;
};
function fn(L) {
  const p = L === 'psat';
  const hs = p ? [-7, -4, 5, 8, 11, -9] : [-5, -3, -2, 2, 4, 6];
  const ks = p ? [-6, -4, 3, 5, 7, -2] : [-3, -2, 1, 2, 4, 5];
  const warm = mix(
    hs.map((h, i) =>
      P(`${fx(h, 0)}: the graph starts at what x-value?`, I(h), [
        `The radicand ${xa(-h)} must be at least 0.`,
        `So x ≥ ${sg(h)}, and the graph starts at x = ${sg(h)}.`,
      ], { fig: gridFn(h, 0) }),
    ),
    hs.map((h, i) => {
      const k = ks[i];
      return P(`${fx(h, k)}: what is f(${sg(h)})?`, I(k), [
        `Substitute x = ${sg(h)}: the radicand is 0.`,
        `f(${sg(h)}) = 0 + ${sg(k)} = ${sg(k)}.`,
      ]);
    }),
    hs.map((h, i) => {
      const k = ks[i];
      return P(`${fx(h, k)}: what is the smallest output value of f?`, I(k), [
        `The square root part is never below 0, and it is 0 at x = ${sg(h)}.`,
        `So the smallest value is ${sg(k)}.`,
      ]);
    }),
    hs.map((h, i) => {
      const m = [2, 3, 4, 5, 6, 3][i];
      return P(`${fx(h, 0)}: what is f(${sg(h + m * m)})?`, I(m), [
        `x ${h < 0 ? '+' : '−'} ${Math.abs(h)} = ${sg(h + m * m)} ${h < 0 ? '+' : '−'} ${Math.abs(h)} = ${m * m}.`,
        `${root(2, m * m)} = ${m}.`,
      ]);
    }),
  );
  const core = mix(
    hs.map((h, i) => {
      const k = ks[i];
      return P(`The graph of ${fx(h, k)} starts at the point (h, k). What is h + k?`, I(h + k), [
        `The graph starts where the radicand is 0: x = ${sg(h)}, and there y = ${sg(k)}.`,
        `${sg(h)} + ${sg(k)} = ${sg(h + k)}.`,
      ], { fig: gridFn(h, k) });
    }),
    hs.map((h, i) => {
      const k = ks[i];
      const m = [3, 2, 4, 1, 5, 2][i];
      return P(`${fx(h, k)}: what is f(${sg(h + m * m)})?`, I(m + k), [
        `The radicand is ${sg(h + m * m)} ${h < 0 ? '+' : '−'} ${Math.abs(h)} = ${m * m}, so the root is ${m}.`,
        `f = ${m} ${k < 0 ? '−' : '+'} ${Math.abs(k)} = ${sg(m + k)}.`,
      ]);
    }),
    [[2, 6], [3, 5], [4, 9], [5, 4], [2, -8], [3, 12]].map(([a, b]) => {
      const x = F(-b, a);
      return P(`What is the smallest x for which ${root(2, lin(a, b))} is a real number? Write a fraction if needed.`, x, [
        `Need ${lin(a, b)} ≥ 0.`,
        `${a}x ≥ ${sg(-b)}, so x ≥ ${x.disp}.`,
      ]);
    }),
    [[1, 6], [2, 8], [3, 9], [1, 3], [4, 5]].map(([a, b]) => {
      const x = F(b, a);
      return P(`What is the largest x for which ${root(2, `${b} − ${a === 1 ? '' : a}x`)} is a real number? Write a fraction if needed.`, x, [
        `Need ${b} − ${a === 1 ? '' : a}x ≥ 0.`,
        `${a === 1 ? '' : a}x ≤ ${b}, so x ≤ ${x.disp}.`,
      ]);
    }),
  );
  const chal = mix(
    hs.map((h, i) => {
      const k = ks[i];
      return P(`${fx(h, 0, -1)}: what is the largest output value of f?`, I(0), [
        `The root is never below 0, so ${'−'}√ is never above 0.`,
        `It equals 0 at x = ${sg(h)}, so the largest value is 0.`,
      ]);
    }),
    hs.map((h, i) => {
      const k = ks[i];
      const m = [2, 3, 4, 5, 3, 6][i];
      return P(`${fx(h, k)}: f(t) = ${sg(k + m)}. What is t?`, I(h + m * m), [
        `Isolate the root: ${root(2, xa(-h, 't'))} = ${m}.`,
        `Square both sides: ${xa(-h, 't')} = ${m * m}.`,
        `t = ${sg(h + m * m)}.`,
      ]);
    }),
    hs.map((h, i) => {
      const n = ints(-10, 20).filter((x) => x - h >= 0 && isSq(x - h)).length;
      return P(`How many whole numbers x from −10 to 20 give a whole-number output for ${fx(h, 0)}?`, I(n), [
        `The radicand must be at least 0 and a perfect square.`,
        `${xa(-h)} is a perfect square for ${n} whole numbers in that range.`,
      ]);
    }),
    hs.map((h, i) => {
      const a = [2, 3, 2, 4, 3, 2][i];
      const k = ks[i];
      const m = [1, 2, 3, 2, 4, 5][i];
      const out = a * m + k;
      return P(`${fx(h, k, a)}: what is f(${sg(h + m * m)})?`, I(out), [
        `The radicand is ${m * m}, so the root is ${m}.`,
        `f = ${a} × ${m} ${k < 0 ? '−' : '+'} ${Math.abs(k)} = ${sg(out)}.`,
      ]);
    }),
  );
  return { warm, core, chal };
}

// ───────── 9. Imaginary numbers ─────────
const ipow = (n) => ['1', 'i', '−1', '−i'][n % 4];
function imaginary(L) {
  const p = L === 'psat';
  const sqs = p ? [6, 7, 8, 9, 11, 12, 13] : [2, 3, 4, 5, 6, 7, 8];
  const warm = mix(
    [
      P('What is i²?', I(-1), [`By definition i = √(−1), so i² = −1.`]),
      P('What is i⁴?', I(1), [`i⁴ = (i²)² = (−1)² = 1.`]),
      P('i³ = c·i. What is c?', I(-1), [`i³ = i² × i = −1 × i = −i.`, `So c = −1.`]),
      P('What is i × i × i × i × i × i?', I(-1), [`Six factors of i is i⁶.`, `i⁶ = (i²)³ = (−1)³ = −1.`]),
    ],
    sqs.map((k) =>
      P(`${root(2, -(k * k))} = c·i. What is c?`, I(k), [
        `${root(2, -(k * k))} = ${root(2, k * k)} × ${root(2, -1)} = ${k} × i.`,
        `So c = ${k}.`,
      ]),
    ),
    (p ? [[5, 7], [-3, 11], [9, -4], [-6, -2]] : [[3, 4], [5, 2], [-1, 6], [7, -3]]).map(([a, b]) =>
      P(`What is the real part of ${cx(a, b)}?`, I(a), [`In a + bi the real part is a.`]),
    ),
    (p ? [[5, 7], [-3, 11], [9, -4], [-6, -2]] : [[3, 4], [5, 2], [-1, 6], [7, -3]]).map(([a, b]) =>
      P(`What is the imaginary part (the number multiplying i) of ${cx(a, b)}?`, I(b), [`In a + bi the imaginary part is b.`]),
    ),
  );
  const core = mix(
    (p ? [13, 22, 35, 46, 57, 62] : [5, 9, 12, 14, 18, 22, 27]).map((n) => {
      const v = ipow(n);
      const real = v === '1' || v === '−1';
      return P(
        real
          ? `What is i^${n}?`
          : `i^${n} = c·i. What is c?`,
        I(real ? (v === '1' ? 1 : -1) : v === 'i' ? 1 : -1),
        [
          `The powers of i repeat every 4: i, −1, −i, 1.`,
          `${n} ÷ 4 leaves remainder ${n % 4}, so i^${n} = ${v}.`,
        ],
      );
    }),
    (p ? [101, 154, 203, 257, 318] : [37, 58, 71, 86, 99]).map((n) =>
      P(`What is the remainder when ${n} is divided by 4? (It decides i^${n}.)`, I(n % 4), [
        `${n} = 4 × ${Math.floor(n / 4)} + ${n % 4}.`,
      ]),
    ),
    sqs.flatMap((k) => {
      const n = k * k * [2, 3, 5][k % 3];
      const [c, r] = sqrtParts(n);
      return r === 1
        ? []
        : [
            P(`${root(2, -n)} = c·i·${root(2, 'r')} in simplest form. What is c?`, I(c), [
              `${root(2, -n)} = i × ${root(2, n)} and ${n} = ${c * c} × ${r}.`,
              `So it is ${c}${root(2, r)}·i, and c = ${c}.`,
            ]),
          ];
    }),
    (p ? [[3, 5, 4, -2], [-4, 6, 7, 3], [8, -1, -5, 9]] : [[2, 3, 4, 1], [5, -2, 1, 6], [-3, 4, 2, -1]]).flatMap(([a, b, c, d]) => [
      P(`What is the real part of (${cx(a, b)}) + (${cx(c, d)})?`, I(a + c), [
        `Add the real parts: ${sg(a)} + ${sg(c)} = ${sg(a + c)}.`,
      ]),
      P(`What is the imaginary part of (${cx(a, b)}) + (${cx(c, d)})?`, I(b + d), [
        `Add the imaginary parts: ${sg(b)} + ${sg(d)} = ${sg(b + d)}.`,
      ]),
    ]),
  );
  const prods = (p
    ? [[3, 2, 4, -5], [2, -3, 5, 1], [4, 1, -2, 6], [5, 3, 2, -1]]
    : [[1, 2, 3, 1], [2, 1, 1, 3], [3, -1, 2, 2], [2, 3, 1, -2]]
  );
  const chal = mix(
    prods.flatMap(([a, b, c, d]) => [
      P(`What is the real part of (${cx(a, b)})(${cx(c, d)})?`, I(a * c - b * d), [
        `FOIL: ${a}·${sg(c)} + ${a}·${sg(d)}i + ${sg(b)}i·${sg(c)} + ${sg(b)}i·${sg(d)}i.`,
        `The i² term is −1 times ${sg(b * d)}. Real part: ${sg(a * c)} − (${sg(b * d)}) = ${sg(a * c - b * d)}.`,
      ]),
      P(`What is the imaginary part of (${cx(a, b)})(${cx(c, d)})?`, I(a * d + b * c), [
        `The i terms are ${a}·${sg(d)} and ${sg(b)}·${sg(c)}.`,
        `${sg(a * d)} + ${sg(b * c)} = ${sg(a * d + b * c)}.`,
      ]),
    ]),
    (p ? [[5, 7], [6, 8], [9, 4], [11, 3]] : [[2, 3], [4, 1], [5, 2], [3, 3]]).map(([a, b]) =>
      P(`What is (${cx(a, b)})(${cx(a, -b)})?`, I(a * a + b * b), [
        `A conjugate pair: (a + bi)(a − bi) = a² + b².`,
        `${a * a} + ${b * b} = ${a * a + b * b}.`,
      ]),
    ),
    (p
      ? [[1, 4, 13], [1, 6, 25], [2, 4, 5], [1, -2, 17], [3, 6, 5]]
      : [[1, 2, 10], [1, 4, 8], [1, -6, 13], [2, 4, 5], [1, 2, 5]]
    ).flatMap(([a, b, c]) => {
      const D = b * b - 4 * a * c;
      const re = F(-b, 2 * a);
      const im = E(0, 1, -D, 2 * a);
      const eq = `${a === 1 ? '' : a}x² ${b < 0 ? M : '+'} ${Math.abs(b)}x + ${c} = 0`;
      return [
        P(`What is the discriminant b² − 4ac of ${eq}?`, I(D), [
          `a = ${a}, b = ${sg(b)}, c = ${c}.`,
          `${b * b} − ${4 * a * c} = ${sg(D)}.`,
        ]),
        P(`The solutions of ${eq} are x = p ± q·i. What is p?`, re, [
          `Use x = (−b ± √(b² − 4ac)) / (2a) with discriminant ${sg(D)}.`,
          `The real part is −b/(2a) = ${re.disp}.`,
        ]),
        P(`The solutions of ${eq} are x = p ± q·i with q > 0. What is q?`, im, [
          `The discriminant is ${sg(D)}, so √${sg(D)} = ${root(2, -D)}·i.`,
          `q = ${root(2, -D)}/(2×${a}), which is ${im.disp}.`,
        ]),
      ];
    }),
  );
  return { warm, core, chal };
}

// ───────── 10. Real uses ─────────
const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [12, 16, 20],
  [15, 20, 25],
  [10, 24, 26],
  [20, 21, 29],
  [9, 40, 41],
  [30, 40, 50],
];
const tri = (a, b, c, hypLabel) => ({
  kind: 'poly',
  pts: [[0, 0], [a, 0], [0, b]],
  s: [String(a), hypLabel ?? '?', String(b)],
  right: [0],
});
function uses(L) {
  const p = L === 'psat';
  const triples = p ? TRIPLES.slice(4) : TRIPLES.slice(0, 8);
  const odd = p
    ? [[1, 7], [2, 6], [3, 9], [4, 8], [5, 10], [6, 12], [4, 10], [3, 15]]
    : [[1, 2], [1, 3], [2, 3], [2, 4], [3, 6], [5, 5], [6, 6], [1, 7]];
  const warm = mix(
    triples.map(([a, b, c]) =>
      P(`A right triangle has legs ${a} and ${b}. What is the hypotenuse?`, I(c), [
        `c = √(a² + b²) = √(${a * a} + ${b * b}).`,
        `${root(2, c * c)} = ${c}.`,
      ], { fig: tri(a, b, c) }),
    ),
    triples.map(([a, b, c]) =>
      P(`A right triangle has hypotenuse ${c} and one leg ${a}. What is the other leg?`, I(b), [
        `b = √(c² − a²) = √(${c * c} − ${a * a}).`,
        `${root(2, b * b)} = ${b}.`,
      ]),
    ),
    (p ? [49, 81, 121, 169, 225, 289] : [16, 25, 36, 49, 81, 100]).map((A) =>
      P(`A square has area ${A} square units. What is its side length?`, I(Math.sqrt(A)), [
        `side = √area = ${root(2, A)}.`,
        `That is ${Math.sqrt(A)}.`,
      ]),
    ),
    (p ? [20, 45, 80, 125, 180, 245] : [5, 20, 45, 80, 125]).map((h) =>
      P(`Free fall: t = √(2h/g). With g = 10 m/s², how many seconds does it take to fall ${h} m?`, I(Math.round(Math.sqrt((2 * h) / 10))), [
        `t = √(2 × ${h} / 10) = √${(2 * h) / 10}.`,
        `${root(2, (2 * h) / 10)} = ${Math.round(Math.sqrt((2 * h) / 10))}.`,
      ]),
    ),
  );
  const core = mix(
    odd.map(([a, b]) => {
      const [c, r] = sqrtParts(a * a + b * b);
      return P(`A right triangle has legs ${a} and ${b}. Write the hypotenuse in simplest radical form.`, E(0, c, r), [
        `c = √(${a * a} + ${b * b}) = ${root(2, a * a + b * b)}.`,
        `${a * a + b * b} = ${c * c} × ${r}, so c = ${radTxt(c, r)}.`,
      ], { fig: tri(a, b, 0) });
    }),
    (p
      ? [[-3, -2, 3, 6], [1, -4, 4, -2], [-5, 2, 1, -6], [0, 3, -4, -1], [2, -3, -2, 5]]
      : [[0, 0, 3, 4], [1, 2, 4, 6], [-2, 1, 4, 5], [0, 0, 5, 12], [2, 3, 8, 7]]
    ).map(([x1, y1, x2, y2]) => {
      const d2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      const [c, r] = sqrtParts(d2);
      return P(`What is the distance between (${sg(x1)}, ${sg(y1)}) and (${sg(x2)}, ${sg(y2)})? Simplest radical form if needed.`, E(0, c, r), [
        `Δx = ${sg(x2 - x1)}, Δy = ${sg(y2 - y1)}.`,
        `d = √(${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}) = ${root(2, d2)}.`,
        r === 1 ? `That is ${c}.` : `${d2} = ${c * c} × ${r}, so d = ${radTxt(c, r)}.`,
      ]);
    }),
    (p ? [7, 9, 11, 13] : [2, 3, 5, 6]).map((s) =>
      P(`What is the diagonal of a square with side ${s}? Simplest radical form.`, E(0, s, 2), [
        `d = √(${s}² + ${s}²) = √${2 * s * s}.`,
        `${2 * s * s} = ${s * s} × 2, so d = ${s}${root(2, 2)}.`,
      ]),
    ),
    (p ? [30, 50, 75, 150] : [12, 18, 27, 32]).map((A) => {
      const [c, r] = sqrtParts(A);
      return P(`A square has area ${A}. What is its side length in simplest radical form?`, E(0, c, r), [
        `side = ${root(2, A)}.`,
        r === 1 ? `That is ${c}.` : `${A} = ${c * c} × ${r}, so side = ${radTxt(c, r)}.`,
      ]);
    }),
  );
  const sds = (p
    ? [[[2, 6, 10]], [[1, 3, 5, 7, 9]], [[4, 7, 10]], [[0, 2, 6, 10, 12]], [[1, 5, 6, 7, 11]], [[1, 3, 6, 9, 11]]]
    : [[[2, 4, 6]], [[3, 6, 9]], [[3, 5, 6, 7, 9]], [[2, 4, 6, 8, 10]], [[5, 8, 11]]]
  ).map(([xs]) => {
    const n = xs.length;
    const mean = xs.reduce((s, v) => s + v, 0) / n;
    const ss = xs.reduce((s, v) => s + (v - mean) ** 2, 0);
    const [c, r] = sqrtParts(ss / (n - 1));
    if (!Number.isInteger(mean) || !Number.isInteger(ss / (n - 1))) return null;
    return { xs, n, mean, ss, c, r };
  }).filter(Boolean);
  const sdVar = sds.map(({ xs, n, mean, ss }) =>
    P(`For the data ${xs.join(', ')}, what is the sample variance? (Sum of squared deviations ÷ (n − 1).)`, I(ss / (n - 1)), [
      `The mean is ${mean}.`,
      `The squared deviations add to ${ss}.`,
      `${ss} ÷ ${n - 1} = ${ss / (n - 1)}.`,
    ]),
  );
  const sdRoot = sds.map(({ xs, n, mean, ss, c, r }) =>
    P(`What is the sample standard deviation of ${xs.join(', ')}? Simplest radical form if needed.`, E(0, c, r), [
      `The mean is ${mean}, and the squared deviations add to ${ss}.`,
      `Variance = ${ss} ÷ ${n - 1} = ${ss / (n - 1)}.`,
      r === 1 ? `s = ${root(2, ss / (n - 1))} = ${c}.` : `s = ${root(2, ss / (n - 1))} = ${radTxt(c, r)}.`,
    ]),
  );
  const fall = (p ? [30, 70, 90, 12] : [10, 15, 30]).map((h) => {
    const q = (2 * h) / 10;
    const [c, r] = sqrtParts(q * 1);
    const num = Number.isInteger(q) ? q : null;
    return num === null
      ? null
      : P(`Free fall: t = √(2h/g), g = 10 m/s². How many seconds to fall ${h} m? Simplest radical form if needed.`, E(0, c, r), [
          `t = √(2 × ${h} / 10) = ${root(2, num)}.`,
          r === 1 ? `That is ${c}.` : `${num} = ${c * c} × ${r}, so t = ${radTxt(c, r)}.`,
        ]);
  });
  const ladder = (p
    ? [[26, 10], [25, 7], [41, 9], [29, 20]]
    : [[13, 5], [10, 6], [17, 8], [25, 7]]
  ).map(([L2, base]) => {
    const h = Math.round(Math.sqrt(L2 * L2 - base * base));
    return h * h === L2 * L2 - base * base
      ? P(`A ${L2}-foot ladder leans on a wall with its foot ${base} feet from the wall. How high does it reach?`, I(h), [
          `The ladder is the hypotenuse: h = √(${L2 * L2} − ${base * base}).`,
          `${root(2, h * h)} = ${h}.`,
        ], { fig: { ...tri(base, h, L2), s: [String(base), String(L2), '?'] } })
      : null;
  });
  const chal = mix(sdVar, sdRoot, fall.filter(Boolean), ladder.filter(Boolean));
  return { warm, core, chal };
}

const BUILD = { whatis, perfect, simplify, muldiv, addsub, rationalize, equations, function: fn, imaginary, uses };

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
      list.forEach((p, i) => {
        const where = `${level}.${id}#${i + 1}`;
        if (/undefined|NaN|null|\[object|Infinity/.test(JSON.stringify(p))) problems.push(`${where} bad token`);
        if (p.steps.some((s) => s.includes('  ') || s.trim() === '')) problems.push(`${where} step spacing`);
        const r = readAnswer(p.a);
        if (!r.ok) {
          problems.push(`${where} answer "${p.a}" ${r.message}`);
          return;
        }
        try {
          const v = approx(contentValue(p.a));
          if (Math.abs(v - p.val) > 1e-9) problems.push(`${where} value ${v} vs ${p.val} (${p.a})`);
        } catch (e) {
          problems.push(`${where} value ${e.message}`);
        }
        if (p.form && !hasForm(p.a, p.form)) problems.push(`${where} form ${p.form} rejects "${p.a}"`);
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
        out[level][id].map((p) => ({
          q: p.q,
          a: p.a,
          ...(p.form ? { form: p.form } : {}),
          steps: p.steps,
          ...(level === 'a1' ? { std: STD[id] } : {}),
          ...(p.fig ? { fig: p.fig } : {}),
        })),
      ]),
    );
  const dir = path.join(ROOT, 'apps/web/features/math');
  fs.writeFileSync(
    path.join(dir, 'psat-radicals-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Radicals chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const RADICALS_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(dump('psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-radicals-algebra1.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Algebra 1 (grade 9) problems per Radicals chapter, 25 each from simple to complex, each tagged\n * with a Florida B.E.S.T. benchmark (NSO.1.1 rational exponents, NSO.1.2 radicals, NSO.1.4 complex\n * numbers, AR.9.1 radical equations, F.1.2 function notation). The codes are from a third-party\n * list; a teacher should check them. Generated, so every answer is computed.\n */\nexport const RADICALS_ALGEBRA1: Record<string, GuideProblem[]> = ${JSON.stringify(dump('a1'), null, 1)};\n`,
  );
  console.log('written radical problems');
}

main();
