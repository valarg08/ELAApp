// Builds the Powers & Scientific Notation study-guide problem files (psat-design.md). Every answer is
// computed from the numbers themselves, and every value is checked a second way (a float) against what
// math-check reads from the typed answer. Typed answers are whole numbers, fractions or decimals.
const fs = require('fs');
const path = require('path');
const { sg, frac } = require('../quadratics/lib.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const M = '−';
const ORDER = ['powers', 'negzero', 'writing', 'signs', 'substitute', 'sci', 'tostd', 'tosci'];
// Florida B.E.S.T. codes. Checked against the FLDOE Grade 8 instructional guide (NSO.1.3 integer exponents,
// NSO.1.4 scientific notation, NSO.1.7 order of operations); MA.7.NSO.1.1 is named there as the grade 7
// exponent benchmark. A teacher should still check that each chapter fits its code.
const STD = {
  powers: 'MA.7.NSO.1.1',
  negzero: 'MA.8.NSO.1.3',
  writing: 'MA.7.NSO.1.1',
  signs: 'MA.7.NSO.1.1',
  substitute: 'MA.8.NSO.1.7',
  sci: 'MA.8.NSO.1.4',
  tostd: 'MA.8.NSO.1.4',
  tosci: 'MA.8.NSO.1.4',
};

// The video's own examples stay in the notes. No practice question may repeat one.
const VIDEO = [
  '2⁴',
  '2³',
  '2²',
  '2¹',
  '2⁰',
  '2⁻¹',
  '2⁻²',
  '2⁻³',
  '3²',
  '5⁴',
  '4³',
  '(−2)²',
  '(−2)³',
  '(−2)⁴',
  '(−2)⁵',
  '(−3)⁴',
  '−3⁴',
  '(1/5)²',
  'h⁵',
  '6x²',
  '6x² − 2x − 24',
  '9.47',
  '1.67',
  '4.5 × 10⁻³',
  '2.4571 × 10⁸',
  '245,710,000',
  '0.0045',
  '4,567,000,000',
  '4.567',
  '4.872',
  '0.0004872',
  '812,000',
  '8.12 × 10⁵',
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BANNED = VIDEO.map(
  (s) => new RegExp(`(?<![\\d.,⁰¹²³⁴⁵⁶⁷⁸⁹⁻])${esc(s)}(?![\\d⁰¹²³⁴⁵⁶⁷⁸⁹.,])`),
);
const banned = (q) => BANNED.some((re) => re.test(q));

// ───────── answers and text ─────────
const I = (n) => {
  const v = n === 0 ? 0 : n;
  return { a: String(v), disp: sg(v), val: v };
};
function F(n, d) {
  const f = frac(n, d);
  return {
    a: f.d === 1 ? String(f.n) : `${f.n}/${f.d}`,
    disp: f.d === 1 ? sg(f.n) : `${sg(f.n)}/${f.d}`,
    val: f.n / f.d,
    ...(f.d === 1 ? {} : { form: 'fraction' }),
  };
}
/** A decimal answer written out, like "0.0045". */
const D = (s) => ({ a: s, disp: s.replace('-', M), val: parseFloat(s), form: 'decimal' });
/** A whole number or a decimal, whichever the digits make. */
const N = (s) => (s.includes('.') ? D(s) : I(Number(s)));
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
const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n) =>
  (n < 0 ? '⁻' : '') +
  String(Math.abs(n))
    .split('')
    .map((d) => SUPD[+d])
    .join('');
const bt = (b) => (b < 0 ? `(${sg(b)})` : String(b));
const pw = (b, n) => `${bt(b)}${sup(n)}`;
const chain = (b, n) => Array(n).fill(bt(b)).join(' × ');
const ipow = (b, n) => Number(BigInt(b) ** BigInt(n));
const com = (s) => {
  const [i, f] = String(s).split('.');
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return f === undefined ? g : `${g}.${f}`;
};
/** num ÷ 10^k as decimal text. */
function dec(num, k) {
  const s = String(num);
  if (k === 0) return s;
  const pad = s.padStart(k + 1, '0');
  const fr = pad.slice(-k).replace(/0+$/, '');
  const ip = pad.slice(0, -k);
  return fr ? `${ip}.${fr}` : ip;
}
const sumT = (xs) =>
  xs.map((x, i) => (i === 0 ? sg(x) : ` ${x < 0 ? M : '+'} ${Math.abs(x)}`)).join('');

// ───────── small fractions ─────────
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
};
const fadd = ([a, b], [c, d]) => fr(a * d + c * b, b * d);
const fmul = ([a, b], [c, d]) => fr(a * c, b * d);
const fpow = (f, n) => {
  let r = [1, 1];
  for (let i = 0; i < Math.abs(n); i += 1) r = fmul(r, f);
  return n < 0 ? fr(r[1], r[0]) : r;
};
const ft = ([n, d]) => (d === 1 ? sg(n) : `${sg(n)}/${d}`);
const Fq = ([n, d]) => F(n, d);

// ───────── scientific-notation numbers: digits d (no trailing zero) and exponent n ─────────
const coef = (d) => (d.length === 1 ? d : `${d[0]}.${d.slice(1)}`);
const sciT = (d, n) => `${coef(d)} × 10${sup(n)}`;
function stdStr(d, n) {
  if (n >= 0) {
    if (d.length <= n + 1) return d + '0'.repeat(n + 1 - d.length);
    return `${d.slice(0, n + 1)}.${d.slice(n + 1)}`;
  }
  return `0.${'0'.repeat(-n - 1)}${d}`;
}
const stdT = (d, n) => com(stdStr(d, n));
/** Digits of an integer mantissa and its scale (value = int × 10^scale) as {d, n}. */
function sciFromInt(int, scale) {
  const s = String(int);
  const d = s.replace(/0+$/, '') || '0';
  return { d, n: s.length - 1 + scale };
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
  /** Digits of a coefficient: `len` digits, a non-zero first and (for more than one digit) last digit. */
  dig: (len) => {
    let s = String(1 + Math.floor(r() * 9));
    for (let i = 1; i < len; i += 1) {
      const last = i === len - 1;
      s += String((last ? 1 : 0) + Math.floor(r() * (last ? 9 : 10)));
    }
    return s;
  },
});
/** Up to n distinct questions from a generator that returns an item or null. */
function many(n, f) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i < n * 80 && out.length < n; i += 1) {
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
function bands({ warm, core, chal }, label, seen) {
  return [
    ...pick(warm, 8, seen, `${label} warm`),
    ...pick(core, 9, seen, `${label} core`),
    ...pick(chal, 8, seen, `${label} challenge`),
  ];
}
const setup = (L, name) => ({ p: L === 'psat', R: mk(rng(`${L}:${name}`)) });
const YN = 'Type 1 for yes, 0 for no.';
/** " Write it as a fraction." unless the answer z ([n, d]) is a whole number. */
const askF = (z) => (z[1] === 1 ? '' : ' Write it as a fraction.');

// ───────── 1. What is a power ─────────
function powers(L) {
  const { p, R } = setup(L, 'powers');
  const bmax = p ? 12 : 9;
  const emax = p ? 5 : 3;
  const lim = p ? 300000 : 1500;
  const val = many(14, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, emax);
    const v = ipow(b, n);
    if (v > lim) return null;
    return P(`What is ${pw(b, n)}?`, I(v), [
      `${pw(b, n)} means ${n} factors of ${b}: ${chain(b, n)}.`,
      `That equals ${v}.`,
    ]);
  });
  const name = many(12, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, p ? 9 : 6);
    const kind = R.ri(0, 2);
    if (kind === 0)
      return P(`In the power ${pw(b, n)}, what is the exponent?`, I(n), [
        'The exponent is the small raised number. It counts the factors.',
      ]);
    if (kind === 1)
      return P(`In the power ${pw(b, n)}, what is the base?`, I(b), [
        'The base is the number being multiplied by itself.',
      ]);
    return P(`How many factors of ${b} are multiplied together in ${pw(b, n)}?`, I(n), [
      `The exponent ${n} tells how many factors of the base ${b} there are.`,
    ]);
  });
  const expanded = many(10, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, emax);
    const v = ipow(b, n);
    if (v > lim) return null;
    return P(`What is ${chain(b, n)}?`, I(v), [
      `Multiply the ${n} factors of ${b} one at a time.`,
      `${chain(b, n)} = ${v}.`,
    ]);
  });
  const warm = mix(val, name, expanded);

  const two = many(14, () => {
    const a = R.ri(2, bmax);
    const m = R.ri(2, emax);
    const b = R.ri(2, bmax);
    const n = R.ri(2, emax);
    if (a === b) return null;
    const x = ipow(a, m);
    const y = ipow(b, n);
    const op = R.pk(['+', '−']);
    if (op === '−' && x <= y) return null;
    const v = op === '+' ? x + y : x - y;
    if (v > lim) return null;
    return P(`What is ${pw(a, m)} ${op} ${pw(b, n)}?`, I(v), [
      `${pw(a, m)} = ${x} and ${pw(b, n)} = ${y}.`,
      `${x} ${op} ${y} = ${v}.`,
    ]);
  });
  const times = many(10, () => {
    const c = R.ri(2, p ? 12 : 6);
    const b = R.ri(2, p ? 9 : 5);
    const n = R.ri(2, p ? 4 : 3);
    const x = ipow(b, n);
    return P(`What is ${c} × ${pw(b, n)}?`, I(c * x), [
      `Powers come before multiplying: ${pw(b, n)} = ${x}.`,
      `${c} × ${x} = ${c * x}.`,
    ]);
  });
  const findBase = many(10, () => {
    const b = R.ri(3, p ? 15 : 9);
    const n = R.ri(2, p ? 4 : 3);
    const v = ipow(b, n);
    if (v > (p ? 70000 : 800)) return null;
    return P(`What positive whole number b makes b${sup(n)} = ${v}?`, I(b), [
      `Find the number that, used as a factor ${n} times, gives ${v}.`,
      `${chain(b, n)} = ${v}, so b = ${b}.`,
    ]);
  });
  const findExp = many(10, () => {
    const b = R.ri(2, p ? 7 : 5);
    const n = R.ri(2, p ? 9 : 5);
    const v = ipow(b, n);
    if (v > (p ? 400000 : 1500)) return null;
    return P(`What exponent n makes ${b}ⁿ = ${com(v)}?`, I(n), [
      `Multiply ${b} by itself until you reach ${com(v)}.`,
      `It takes ${n} factors: ${pw(b, n)} = ${com(v)}.`,
    ]);
  });
  const core = mix(two, times, findBase, findExp);

  const units = many(10, () => {
    const b = R.ri(2, 9);
    const n = p ? R.ri(10, 60) : R.ri(2, 6);
    const last = Number(BigInt(b) ** BigInt(n) % 10n);
    if (!p)
      return P(`What is the last digit of ${pw(b, n)}?`, I(last), [
        `${pw(b, n)} = ${ipow(b, n)}.`,
        `The last digit is ${last}.`,
      ]);
    const cyc = [];
    let x = b % 10;
    do {
      cyc.push(x);
      x = (x * b) % 10;
    } while (x !== cyc[0]);
    const len = cyc.length;
    const pos = ((n - 1) % len) + 1;
    return P(`What is the last digit of ${pw(b, n)}?`, I(last), [
      `The last digits of ${b}, ${b}², ${b}³, … repeat every ${len} powers: ${cyc.join(', ')}.`,
      `${n} is position ${pos} in the repeating list, so the last digit is ${last}.`,
    ]);
  });
  const diff = many(12, () => {
    const a = R.ri(2, bmax);
    const m = R.ri(2, emax + 1);
    const b = R.ri(2, bmax);
    const n = R.ri(2, emax + 1);
    if (a === b || m === n) return null;
    const x = ipow(a, m);
    const y = ipow(b, n);
    if (x > lim * 3 || y > lim * 3 || x === y) return null;
    return P(
      `One number is ${pw(a, m)} and the other is ${pw(b, n)}. How much larger is the bigger number?`,
      I(Math.abs(x - y)),
      [
        `${pw(a, m)} = ${x} and ${pw(b, n)} = ${y}.`,
        `${Math.max(x, y)} − ${Math.min(x, y)} = ${Math.abs(x - y)}.`,
      ],
    );
  });
  const tens = many(10, () => {
    const n = R.ri(p ? 4 : 2, p ? 9 : 6);
    const kind = R.ri(0, 1);
    if (kind === 0)
      return P(`What exponent n makes 10ⁿ = ${com(10 ** n)}?`, I(n), [
        `Each factor of 10 adds one zero to the 1.`,
        `${com(10 ** n)} has ${n} zeros, so n = ${n}.`,
      ]);
    return P(`How many zeros are in the number ${pw(10, n)}?`, I(n), [
      `${pw(10, n)} = 1 followed by ${n} zeros: ${com(10 ** n)}.`,
    ]);
  });
  const prod = many(10, () => {
    const c = R.ri(2, p ? 6 : 4);
    const b = R.ri(2, p ? 6 : 4);
    const n = R.ri(2, p ? 3 : 2);
    const x = ipow(c * b, n);
    return P(`What is (${c} × ${b})${sup(n)}?`, I(x), [
      `Brackets first: ${c} × ${b} = ${c * b}.`,
      `${pw(c * b, n)} = ${x}.`,
    ]);
  });
  const chal = mix(units, diff, tens, prod);
  return { warm, core, chal };
}

// ───────── 2. Zero and negative exponents ─────────
function negzero(L) {
  const { p, R } = setup(L, 'negzero');
  const zero = many(12, () => {
    const b = R.pk([3, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 100]);
    const kind = R.ri(0, 2);
    if (kind === 0)
      return P(`What is ${b}⁰?`, I(1), ['Any number except 0 raised to the power 0 is 1.']);
    if (kind === 1)
      return P(`What is ${pw(-b, 0)}?`, I(1), [
        'The bracket makes the base −' + b + ', and a base that is not 0 to the power 0 is 1.',
      ]);
    const c = R.ri(2, 9);
    return P(`What is ${b}⁰ + ${c}⁰?`, I(2), [
      'Each power with exponent 0 equals 1.',
      '1 + 1 = 2.',
    ]);
  });
  const neg = many(14, () => {
    const b = R.ri(3, p ? 10 : 7);
    const n = R.ri(1, p ? 3 : 2);
    const v = ipow(b, n);
    return P(`What is ${pw(b, -n)}? Write it as a fraction.`, F(1, v), [
      `A negative exponent means the reciprocal: ${pw(b, -n)} = 1/${pw(b, n)}.`,
      `${pw(b, n)} = ${v}, so the value is 1/${v}.`,
    ]);
  });
  const asDec = many(12, () => {
    const b = R.pk([2, 5, 10]);
    const n = R.ri(1, p ? 6 : 4);
    const v = ipow(b, n);
    const num = b === 10 ? 1 : b === 2 ? ipow(5, n) : ipow(2, n);
    return P(`Write ${pw(b, -n)} as a decimal.`, D(dec(num, n)), [
      `${pw(b, -n)} = 1/${com(v)}.`,
      `As a decimal, 1/${com(v)} = ${dec(num, n)}.`,
    ]);
  });
  const warm = mix(zero, neg, asDec, [
    P(`Is 0⁰ defined? ${YN}`, I(0), ['0⁰ is not defined. It is not 0 and not 1.']),
  ]);

  const table = many(12, () => {
    const b = R.pk([3, 4, 5, 6, 7, 10]);
    const k = R.ri(1, p ? 3 : 2);
    const v = ipow(b, k + 1);
    const top = Array.from(
      { length: 4 },
      (_, i) => `${pw(b, 3 - i)} = ${ipow(b, 3 - i) === 0 ? 1 : ipow(b, 3 - i)}`,
    );
    return P(
      `${top.join(', ')}. Each step down divides by ${b}. Following the pattern, what is ${pw(b, -k)}? Write it as a fraction.`,
      F(1, ipow(b, k)),
      [
        `Dividing by ${b} each step, 1 becomes 1/${b}, then 1/${b * b}, and so on.`,
        `${pw(b, -k)} = 1/${ipow(b, k)}.`,
      ],
    );
  });
  const sum = many(14, () => {
    const a = R.ri(2, p ? 6 : 4);
    const b = R.ri(2, p ? 6 : 4);
    const m = R.ri(-2, 1);
    const n = R.ri(-2, 1);
    if (a === b || (m >= 0 && n >= 0)) return null;
    const x = fpow([a, 1], m);
    const y = fpow([b, 1], n);
    const op = R.pk(['+', '−']);
    const z = op === '+' ? fadd(x, y) : fadd(x, [-y[0], y[1]]);
    return P(`What is ${pw(a, m)} ${op} ${pw(b, n)}?${askF(z)}`, Fq(z), [
      `${pw(a, m)} = ${ft(x)} and ${pw(b, n)} = ${ft(y)}.`,
      `${ft(x)} ${op} ${ft(y)} = ${ft(z)}.`,
    ]);
  });
  const findK = many(10, () => {
    const b = R.ri(2, p ? 9 : 6);
    const n = R.ri(1, p ? 4 : 3);
    const v = ipow(b, n);
    if (v > 8000) return null;
    return P(`1/${com(v)} = ${b}ᵏ. What is k?`, I(-n), [
      `1/${com(v)} is the reciprocal of ${pw(b, n)}.`,
      `The reciprocal of ${pw(b, n)} is ${pw(b, -n)}, so k = ${sg(-n)}.`,
    ]);
  });
  const negBase = many(10, () => {
    const b = R.ri(2, p ? 7 : 5);
    const n = R.ri(1, 3);
    const v = ipow(b, n);
    const s = n % 2 === 0 ? 1 : -1;
    return P(`What is ${pw(-b, -n)}? Write it as a fraction.`, F(s, v), [
      `${pw(-b, -n)} = 1/${pw(-b, n)}.`,
      `${pw(-b, n)} = ${sg(s * v)}, so the value is ${ft([s, v])}.`,
    ]);
  });
  const times10 = many(12, () => {
    const c = R.ri(2, 9);
    const n = R.ri(1, p ? 5 : 4);
    return P(`Write ${c} × ${pw(10, -n)} as a decimal.`, D(dec(c, n)), [
      `${pw(10, -n)} = 1/${com(10 ** n)} = ${dec(1, n)}.`,
      `${c} × ${dec(1, n)} = ${dec(c, n)}.`,
    ]);
  });
  const core = mix(table, sum, findK, negBase, times10);

  const fracBase = many(12, () => {
    const q = R.ri(2, p ? 7 : 5);
    const n = R.ri(1, 3);
    if (!p) {
      return P(`What is (1/${q})${sup(-n)}?`, I(ipow(q, n)), [
        `A negative exponent flips the fraction: (1/${q})${sup(-n)} = (${q}/1)${sup(n)}.`,
        `${pw(q, n)} = ${ipow(q, n)}.`,
      ]);
    }
    const a = R.ri(2, 5);
    if (gcd(a, q) !== 1) return null;
    const z = fpow([a, q], -n);
    return P(`What is (${a}/${q})${sup(-n)}?${askF(z)}`, Fq(z), [
      `A negative exponent flips the fraction: (${a}/${q})${sup(-n)} = (${q}/${a})${sup(n)}.`,
      `(${q}/${a})${sup(n)} = ${ft(z)}.`,
    ]);
  });
  const quot = many(12, () => {
    const b = R.ri(2, p ? 7 : 5);
    const m = R.ri(1, 3);
    const n = m + R.ri(1, 3);
    return P(
      `What is ${pw(b, m)} ÷ ${pw(b, n)}? Write it as a fraction.`,
      F(ipow(b, m), ipow(b, n)),
      [
        `${pw(b, m)} = ${ipow(b, m)} and ${pw(b, n)} = ${ipow(b, n)}.`,
        `${ipow(b, m)}/${ipow(b, n)} = ${ft(fr(ipow(b, m), ipow(b, n)))}.`,
      ],
    );
  });
  const prodNeg = many(12, () => {
    const b = R.ri(2, p ? 6 : 4);
    const n = R.ri(1, 3);
    const m = n + R.ri(1, 3);
    const z = fpow([b, 1], m - n);
    return P(`What is ${pw(b, m)} × ${pw(b, -n)}?${askF(z)}`, Fq(z), [
      `${pw(b, m)} = ${ipow(b, m)} and ${pw(b, -n)} = 1/${ipow(b, n)}.`,
      `${ipow(b, m)} ÷ ${ipow(b, n)} = ${ft(z)}.`,
    ]);
  });
  const copies = many(10, () => {
    const b = R.ri(2, p ? 9 : 6);
    const n = R.ri(1, 2);
    const times = ipow(b, n);
    if (times > 40) return null;
    return P(`What is the sum of ${times} copies of ${pw(b, -n)}?`, I(1), [
      `${pw(b, -n)} = 1/${times}.`,
      `${times} copies of 1/${times} add up to 1.`,
    ]);
  });
  const cMul = many(10, () => {
    const c = R.ri(2, 9);
    const b = R.ri(2, p ? 6 : 4);
    const n = R.ri(1, 3);
    return P(`What is ${c} × ${pw(b, -n)}?${askF(fr(c, ipow(b, n)))}`, F(c, ipow(b, n)), [
      `${pw(b, -n)} = 1/${ipow(b, n)}.`,
      `${c} × 1/${ipow(b, n)} = ${ft(fr(c, ipow(b, n)))}.`,
    ]);
  });
  const chal = mix(fracBase, quot, prodNeg, copies, cMul);
  return { warm, core, chal };
}

// ───────── 3. Writing and expanding powers ─────────
function writing(L) {
  const { p, R } = setup(L, 'writing');
  const bmax = p ? 12 : 9;
  const asPow = many(12, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, p ? 8 : 6);
    return P(`Write ${chain(b, n)} as a power ${b}ⁿ. What is n?`, I(n), [
      `Count the factors of ${b}: there are ${n}.`,
      `${chain(b, n)} = ${pw(b, n)}, so n = ${n}.`,
    ]);
  });
  const variable = many(10, () => {
    const v = R.pk(['a', 'b', 'k', 'm', 'n', 'p', 'r', 't', 'w', 'x', 'y', 'z']);
    const n = R.ri(2, p ? 9 : 6);
    return P(`Write ${Array(n).fill(v).join(' × ')} as a power ${v}ᵏ. What is k?`, I(n), [
      `Count the factors of ${v}: there are ${n}.`,
      `${Array(n).fill(v).join(' × ')} = ${v}${sup(n)}, so k = ${n}.`,
    ]);
  });
  const signs = many(10, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(3, p ? 9 : 6);
    return P(`How many multiplication signs are in the expanded form of ${pw(b, n)}?`, I(n - 1), [
      `${pw(b, n)} = ${chain(b, n)}.`,
      `${n} factors have ${n - 1} multiplication signs between them.`,
    ]);
  });
  const prodVal = many(10, () => {
    const b = R.ri(2, p ? 12 : 8);
    const n = R.ri(2, p ? 4 : 3);
    const v = ipow(b, n);
    if (v > (p ? 30000 : 600)) return null;
    return P(`What is ${chain(b, n)}?`, I(v), [
      `Multiply the factors in order.`,
      `${chain(b, n)} = ${v}.`,
    ]);
  });
  const warm = mix(asPow, variable, signs, prodVal);

  const fracPow = many(14, () => {
    const q = R.ri(2, p ? 7 : 5);
    const a = R.ri(1, q - 1);
    if (gcd(a, q) !== 1) return null;
    const n = R.ri(2, p ? 4 : 3);
    return P(`What is (${a}/${q})${sup(n)}? Write it as a fraction.`, F(ipow(a, n), ipow(q, n)), [
      `${n} factors of ${a}/${q}: multiply the tops and multiply the bottoms.`,
      `${pw(a, n)}/${pw(q, n)} = ${ipow(a, n)}/${ipow(q, n)}.`,
    ]);
  });
  const decPow = many(12, () => {
    const t = R.pk([2, 3, 5, 6, 7, 11, 12, 15]);
    const n = R.ri(2, p ? 4 : 3);
    const base = t / 10;
    const num = ipow(t, n);
    return P(`What is ${base}${sup(n)}? Write it as a decimal.`, D(dec(num, n)), [
      `${base}${sup(n)} = ${Array(n).fill(base).join(' × ')}.`,
      `Multiply the digits (${Array(n).fill(t).join(' × ')} = ${num}), then place the decimal point ${n} places from the right: ${dec(num, n)}.`,
    ]);
  });
  const twoGroups = many(12, () => {
    const a = R.ri(2, 4);
    const b = R.ri(2, 5);
    if (a === b) return null;
    const m = R.ri(2, p ? 4 : 3);
    const n = R.ri(2, p ? 3 : 2);
    const v = ipow(a, m) * ipow(b, n);
    return P(`What is ${chain(a, m)} × ${chain(b, n)}?`, I(v), [
      `${chain(a, m)} = ${pw(a, m)} = ${ipow(a, m)} and ${chain(b, n)} = ${pw(b, n)} = ${ipow(b, n)}.`,
      `${ipow(a, m)} × ${ipow(b, n)} = ${v}.`,
    ]);
  });
  const letters = many(12, () => {
    const [u, w] = R.pk([
      ['a', 'b'],
      ['x', 'y'],
      ['m', 'n'],
      ['p', 'q'],
      ['r', 's'],
    ]);
    const m = R.ri(2, p ? 6 : 4);
    const n = R.ri(2, p ? 6 : 4);
    return P(
      `Write ${Array(m).fill(u).join(' × ')} × ${Array(n).fill(w).join(' × ')} as ${u}ᵖ${w}ᵠ. What is p + q?`,
      I(m + n),
      [
        `${u} appears ${m} times and ${w} appears ${n} times.`,
        `So the expression is ${u}${sup(m)}${w}${sup(n)}, and p + q = ${m} + ${n} = ${m + n}.`,
      ],
    );
  });
  const core = mix(fracPow, decPow, twoGroups, letters);

  const tenZeros = many(10, () => {
    const n = R.ri(3, p ? 12 : 8);
    return P(`How many zeros are in the standard form of ${pw(10, n)}?`, I(n), [
      `${pw(10, n)} = 10 × 10 × … (${n} factors of 10).`,
      `Each factor of 10 adds a zero, so there are ${n} zeros.`,
    ]);
  });
  const area = many(10, () => {
    const s = R.ri(3, p ? 15 : 12);
    const cube = R.ri(0, 1) === 1;
    const n = cube ? 3 : 2;
    const v = ipow(s, n);
    if (v > 4000) return null;
    return P(
      `A ${cube ? 'cube' : 'square'} has ${cube ? 'edges' : 'sides'} ${s} cm long. Its ${cube ? 'volume' : 'area'} is ${pw(s, n)} cm${cube ? '³' : '²'}. What is the number ${cube ? 'of cubic centimetres' : 'of square centimetres'}?`,
      I(v),
      [`${pw(s, n)} = ${chain(s, n)}.`, `${chain(s, n)} = ${v}.`],
    );
  });
  const grow = many(10, () => {
    const b = R.pk([2, 3]);
    const n = R.ri(3, p ? 8 : 6);
    const v = ipow(b, n);
    if (v > (p ? 7000 : 800)) return null;
    return P(
      `A colony starts with 1 cell and ${b === 2 ? 'doubles' : 'triples'} every hour. How many cells are there after ${n} hours?`,
      I(v),
      [
        `Each hour multiplies by ${b}, so after ${n} hours there are ${n} factors of ${b}.`,
        `${pw(b, n)} = ${v}.`,
      ],
    );
  });
  const count = many(10, () => {
    const b = R.ri(2, p ? 9 : 6);
    const m = R.ri(2, 5);
    const n = R.ri(2, 5);
    return P(
      `${pw(b, m)} × ${pw(b, n)} is written out as a product of ${b}s. How many factors of ${b} are there in total?`,
      I(m + n),
      [`${pw(b, m)} has ${m} factors and ${pw(b, n)} has ${n} factors.`, `${m} + ${n} = ${m + n}.`],
    );
  });
  const chal = mix(tenZeros, area, grow, count);
  return { warm, core, chal };
}

// ───────── 4. Negative bases ─────────
function signs(L) {
  const { p, R } = setup(L, 'signs');
  const bmax = p ? 9 : 6;
  const brk = many(14, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, p ? 5 : 4);
    const v = ipow(b, n) * (n % 2 === 0 ? 1 : -1);
    if (Math.abs(v) > 20000) return null;
    return P(`What is ${pw(-b, n)}?`, I(v), [
      `The bracket puts the exponent on −${b}: ${chain(-b, n)}.`,
      `${n} is ${n % 2 === 0 ? 'even, so the answer is positive' : 'odd, so the answer is negative'}: ${sg(v)}.`,
    ]);
  });
  const nobrk = many(14, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, p ? 5 : 4);
    const v = -ipow(b, n);
    if (Math.abs(v) > 20000) return null;
    return P(`What is −${b}${sup(n)}?`, I(v), [
      `There is no bracket, so the exponent is only on ${b}: −${b}${sup(n)} = −1 × ${pw(b, n)}.`,
      `${pw(b, n)} = ${ipow(b, n)}, so the answer is ${sg(v)}.`,
    ]);
  });
  const pos = many(10, () => {
    const b = R.ri(2, bmax);
    const n = R.ri(2, p ? 15 : 9);
    const even = n % 2 === 0;
    return P(
      `Is ${pw(-b, n)} positive or negative? Type 1 for positive, 0 for negative.`,
      I(even ? 1 : 0),
      [
        `A negative base to ${even ? 'an even' : 'an odd'} exponent is ${even ? 'positive' : 'negative'}.`,
        `${n} is ${even ? 'even' : 'odd'}.`,
      ],
    );
  });
  const minusOne = many(10, () => {
    const n = p ? R.ri(10, 99) : R.ri(2, 15);
    const v = n % 2 === 0 ? 1 : -1;
    return P(`What is ${pw(-1, n)}?`, I(v), [
      `Powers of −1 alternate: −1, 1, −1, 1, …`,
      `${n} is ${n % 2 === 0 ? 'even, so the answer is 1' : 'odd, so the answer is −1'}.`,
    ]);
  });
  const warm = mix(brk, nobrk, pos, minusOne);

  const compare = many(14, () => {
    const b = R.ri(2, p ? 8 : 5);
    const n = R.ri(2, 4);
    const v1 = (n % 2 === 0 ? 1 : -1) * ipow(b, n);
    const v2 = -ipow(b, n);
    return P(`What is ${pw(-b, n)} − (−${b}${sup(n)})?`, I(v1 - v2), [
      `${pw(-b, n)} = ${sg(v1)} and −${b}${sup(n)} = ${sg(v2)}.`,
      `${sg(v1)} − (${sg(v2)}) = ${sg(v1 - v2)}.`,
    ]);
  });
  const outer = many(12, () => {
    const b = R.ri(2, p ? 7 : 5);
    const n = R.ri(2, 4);
    const v = (n % 2 === 0 ? 1 : -1) * ipow(b, n);
    return P(`What is −${pw(-b, n)}?`, I(-v), [
      `${pw(-b, n)} = ${sg(v)}.`,
      `The negative in front flips the sign: ${sg(-v)}.`,
    ]);
  });
  const fracs = many(12, () => {
    const q = R.ri(2, p ? 7 : 5);
    const a = R.ri(1, q - 1);
    if (gcd(a, q) !== 1) return null;
    const n = R.ri(2, p ? 4 : 3);
    const s = n % 2 === 0 ? 1 : -1;
    return P(
      `What is (−${a}/${q})${sup(n)}? Write it as a fraction.`,
      F(s * ipow(a, n), ipow(q, n)),
      [
        `${n} factors of −${a}/${q}: the sign is ${s === 1 ? 'positive' : 'negative'} because ${n} is ${n % 2 === 0 ? 'even' : 'odd'}.`,
        `${ipow(a, n)}/${ipow(q, n)} with that sign is ${ft(fr(s * ipow(a, n), ipow(q, n)))}.`,
      ],
    );
  });
  const prod = many(12, () => {
    const a = R.ri(2, p ? 5 : 3);
    const b = R.ri(2, p ? 5 : 3);
    const m = R.ri(2, 3);
    const n = R.ri(2, 3);
    const x = (m % 2 === 0 ? 1 : -1) * ipow(a, m);
    const y = (n % 2 === 0 ? 1 : -1) * ipow(b, n);
    return P(`What is ${pw(-a, m)} × ${pw(-b, n)}?`, I(x * y), [
      `${pw(-a, m)} = ${sg(x)} and ${pw(-b, n)} = ${sg(y)}.`,
      `${sg(x)} × ${bt(y)} = ${sg(x * y)}.`,
    ]);
  });
  const findN = many(10, () => {
    const b = R.pk([3, 5, 4, 6]);
    const n = R.ri(2, p ? 5 : 4);
    const v = (n % 2 === 0 ? 1 : -1) * ipow(b, n);
    return P(`What exponent n makes (−${b})ⁿ = ${sg(v)}?`, I(n), [
      `${ipow(b, n)} is ${n} factors of ${b}.`,
      `The answer is ${v < 0 ? 'negative, so n is odd' : 'positive, so n is even'}: n = ${n}.`,
    ]);
  });
  const core = mix(compare, outer, fracs, prod, findN);

  const addPow = many(14, () => {
    const b = R.ri(2, p ? 7 : 4);
    const m = R.ri(2, 4);
    const n = R.ri(2, 4);
    if (m === n) return null;
    const x = (m % 2 === 0 ? 1 : -1) * ipow(b, m);
    const y = (n % 2 === 0 ? 1 : -1) * ipow(b, n);
    return P(`What is ${pw(-b, m)} + ${pw(-b, n)}?`, I(x + y), [
      `${pw(-b, m)} = ${sg(x)} and ${pw(-b, n)} = ${sg(y)}.`,
      `${sg(x)} + ${bt(y)} = ${sg(x + y)}.`,
    ]);
  });
  const mixed = many(12, () => {
    const b = R.ri(4, p ? 9 : 7);
    const n = R.pk([2, 4]);
    return P(`What is −${b}${sup(n)} − ${pw(-b, n)}?`, I(-2 * ipow(b, n)), [
      `−${b}${sup(n)} = ${sg(-ipow(b, n))} and ${pw(-b, n)} = ${ipow(b, n)}.`,
      `${sg(-ipow(b, n))} − ${ipow(b, n)} = ${sg(-2 * ipow(b, n))}.`,
    ]);
  });
  const alt = many(3, () => {
    const n = p ? R.ri(10, 60) : R.ri(3, 9);
    const terms = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? -1 : 1));
    const total = terms.reduce((s, x) => s + x, 0);
    return P(`What is (−1)¹ + (−1)² + (−1)³ + … + (−1)${sup(n)}?`, I(total), [
      `The terms alternate −1, 1, −1, 1, … and each pair adds to 0.`,
      `${n} terms: ${n % 2 === 0 ? 'all in pairs, so the total is 0' : 'a pair for each two terms and one −1 left over, so the total is −1'}.`,
    ]);
  });
  const threeTerm = many(12, () => {
    const b = R.ri(4, p ? 9 : 7);
    const x = ipow(b, 2);
    const y = ipow(b, 3);
    return P(`What is ${pw(-b, 2)} − ${b}² + ${pw(-b, 3)}?`, I(x - x - y), [
      `${pw(-b, 2)} = ${x}, ${b}² = ${x} and ${pw(-b, 3)} = ${sg(-y)}.`,
      `${x} − ${x} + ${bt(-y)} = ${sg(-y)}.`,
    ]);
  });
  const chal = mix(addPow, mixed, alt, threeTerm);
  return { warm, core, chal };
}

// ───────── 5. Substituting into expressions ─────────
const termsT = (terms, v = 'x') =>
  terms
    .map(([c, e], i) => {
      const a = Math.abs(c);
      const body = e === 0 ? String(a) : `${a === 1 ? '' : a}${v}${e > 1 ? sup(e) : ''}`;
      return i === 0 ? `${c < 0 ? M : ''}${body}` : ` ${c < 0 ? M : '+'} ${body}`;
    })
    .join('');
const termsSub = (terms, k) =>
  terms
    .map(([c, e], i) => {
      const a = Math.abs(c);
      let body;
      if (e === 0) body = String(a);
      else {
        const base = `(${sg(k)})`;
        const pwr = e > 1 ? base + sup(e) : base;
        body = a === 1 ? pwr : `${a}${pwr}`;
      }
      return i === 0 ? `${c < 0 ? M : ''}${body}` : ` ${c < 0 ? M : '+'} ${body}`;
    })
    .join('');
function evalAt(terms, k, label) {
  const vals = terms.map(([c, e]) => c * k ** e);
  const total = vals.reduce((s, x) => s + x, 0);
  const steps = [`Replace x with (${sg(k)}), keeping the brackets: ${label}${termsSub(terms, k)}.`];
  steps.push(
    vals.length === 1
      ? `Evaluate the power first, then multiply: ${sg(total)}.`
      : `Powers first, then multiply. The terms are ${vals.map(sg).join(', ')}.`,
  );
  if (vals.length > 1) steps.push(`Add them: ${sumT(vals)} = ${sg(total)}.`);
  return { total, steps };
}
function substitute(L) {
  const { p, R } = setup(L, 'substitute');
  const one = many(14, () => {
    const c = R.ri(2, p ? 12 : 9);
    const e = R.ri(2, p ? 3 : 2);
    const k = R.ri(2, p ? 9 : 6);
    const terms = [[c, e]];
    const r = evalAt(terms, k, '');
    return P(`Evaluate ${termsT(terms)} when x = ${k}.`, I(r.total), r.steps);
  });
  const negX = many(14, () => {
    const c = R.ri(1, p ? 6 : 4);
    const e = R.ri(2, 3);
    const k = -R.ri(2, p ? 7 : 5);
    const terms = [[c, e]];
    const r = evalAt(terms, k, '');
    return P(`Evaluate ${termsT(terms)} when x = ${sg(k)}.`, I(r.total), r.steps);
  });
  const trap = many(10, () => {
    const k = R.ri(2, p ? 9 : 6) * (R.ri(0, 1) === 1 ? -1 : 1);
    const kind = R.ri(0, 1);
    const v = k * k;
    if (kind === 0)
      return P(`Evaluate x² when x = ${sg(k)}.`, I(v), [
        `Substitute with brackets: (${sg(k)})².`,
        `(${sg(k)})² = ${v}.`,
      ]);
    return P(`Evaluate (−x)² when x = ${sg(k)}.`, I(v), [
      `Replace x with (${sg(k)}): (−(${sg(k)}))².`,
      `−(${sg(k)}) = ${sg(-k)}, and (${sg(-k)})² = ${v}.`,
    ]);
  });
  const warm = mix(one, negX, trap);

  const quad = many(14, () => {
    const a = R.ri(1, p ? 7 : 5);
    const b = R.nz(-9, 9);
    const c = R.ri(-20, 20);
    const k = R.ri(-9, 9);
    if (k === 0) return null;
    const terms = [[a, 2], [b, 1], ...(c === 0 ? [] : [[c, 0]])];
    const r = evalAt(terms, k, '');
    return P(`Evaluate ${termsT(terms)} when x = ${sg(k)}.`, I(r.total), r.steps);
  });
  const negLead = many(12, () => {
    const c = R.ri(1, p ? 9 : 6);
    const e = R.pk([2, 2, 3]);
    const k = R.ri(2, p ? 7 : 5) * (R.ri(0, 1) === 1 ? -1 : 1);
    const c2 = R.ri(1, 15);
    const terms = [
      [-c, e],
      [c2, 0],
    ];
    const r = evalAt(terms, k, '');
    return P(`Evaluate ${termsT(terms)} when x = ${sg(k)}.`, I(r.total), r.steps);
  });
  const twoVar = many(14, () => {
    const x = R.nz(-6, 6);
    const y = R.nz(-6, 6);
    if (x === y) return null;
    const kind = R.ri(0, 2);
    if (kind === 0) {
      const v = x * x - y * y;
      return P(`Evaluate x² − y² when x = ${sg(x)} and y = ${sg(y)}.`, I(v), [
        `Replace x and y with brackets: (${sg(x)})² − (${sg(y)})².`,
        `${x * x} − ${y * y} = ${sg(v)}.`,
      ]);
    }
    if (kind === 1) {
      const v = x * x * y;
      return P(`Evaluate x²y when x = ${sg(x)} and y = ${sg(y)}.`, I(v), [
        `Replace x and y with brackets: (${sg(x)})²(${sg(y)}).`,
        `${x * x} × ${bt(y)} = ${sg(v)}.`,
      ]);
    }
    const v = x * x + y * y;
    return P(`Evaluate x² + y² when x = ${sg(x)} and y = ${sg(y)}.`, I(v), [
      `Replace x and y with brackets: (${sg(x)})² + (${sg(y)})².`,
      `${x * x} + ${y * y} = ${v}.`,
    ]);
  });
  const reverse = many(10, () => {
    const c = R.ri(2, p ? 9 : 6);
    const k = R.ri(2, p ? 12 : 9);
    return P(`If ${c}x² = ${c * k * k} and x is positive, what is x?`, I(k), [
      `Divide both sides by ${c}: x² = ${k * k}.`,
      `x is positive, so x = ${k}.`,
    ]);
  });
  const core = mix(quad, negLead, twoVar, reverse);

  const cubic = many(14, () => {
    const a = R.nz(-4, 4);
    const b = R.nz(-6, 6);
    const c = R.ri(-9, 9);
    const k = R.ri(-4, 4);
    if (k === 0) return null;
    const terms = [[a, 3], [b, 2], ...(c === 0 ? [] : [[c, 0]])];
    const r = evalAt(terms, k, '');
    return P(`Evaluate ${termsT(terms)} when x = ${sg(k)}.`, I(r.total), r.steps);
  });
  const fourth = many(10, () => {
    const a = R.ri(1, 3);
    const b = R.nz(-5, 5);
    const k = R.ri(-3, 3);
    if (k === 0) return null;
    const terms = [
      [a, 4],
      [b, 2],
      [R.ri(1, 9), 0],
    ];
    const r = evalAt(terms, k, '');
    return P(`Evaluate ${termsT(terms)} when x = ${sg(k)}.`, I(r.total), r.steps);
  });
  const negExp = many(10, () => {
    const k = R.ri(2, p ? 6 : 4);
    const n = R.ri(1, 3);
    return P(`Evaluate x${sup(-n)} when x = ${k}. Write it as a fraction.`, F(1, ipow(k, n)), [
      `Replace x with ${k}: ${pw(k, -n)} = 1/${pw(k, n)}.`,
      `${pw(k, n)} = ${ipow(k, n)}, so the value is 1/${ipow(k, n)}.`,
    ]);
  });
  const diffForm = many(10, () => {
    const x = R.ri(2, 7);
    const y = -R.ri(1, 6);
    const a = (x - y) ** 2;
    const b = x * x - y * y;
    return P(`Let x = ${x} and y = ${sg(y)}. What is (x − y)² − (x² − y²)?`, I(a - b), [
      `(x − y)² = (${x} − (${sg(y)}))² = ${x - y}² = ${a}.`,
      `x² − y² = ${x * x} − ${y * y} = ${b}.`,
      `${a} − ${b} = ${a - b}.`,
    ]);
  });
  const chal = mix(cubic, fourth, negExp, diffForm);
  return { warm, core, chal };
}

// ───────── 6. What is scientific notation ─────────
function sci(L) {
  const { p, R } = setup(L, 'sci');
  const rsci = (maxLen = 3, lo = -9, hi = 9) => {
    const n = R.nz(lo, hi);
    return { d: R.dig(R.ri(1, maxLen)), n };
  };
  const isSci = many(16, () => {
    const kind = R.ri(0, p ? 5 : 3);
    const n = R.nz(-9, 12);
    if (kind <= 1) {
      const { d } = rsci();
      return P(`Is ${sciT(d, n)} in scientific notation? ${YN}`, I(1), [
        `The coefficient ${coef(d)} is at least 1 and less than 10, and the other factor is a power of 10.`,
        'So it is in scientific notation.',
      ]);
    }
    if (kind === 2) {
      const ip = R.ri(10, 99);
      const txt = R.ri(0, 1) ? `${ip}.${R.dig(1)}` : String(ip);
      return P(`Is ${txt} × 10${sup(n)} in scientific notation? ${YN}`, I(0), [
        `The coefficient ${txt} is 10 or more. It needs exactly one digit before the decimal point.`,
      ]);
    }
    if (kind === 3) {
      const txt = `0.${R.dig(R.ri(1, 2))}`;
      return P(`Is ${txt} × 10${sup(n)} in scientific notation? ${YN}`, I(0), [
        `The coefficient ${txt} is less than 1. It needs one non-zero digit before the decimal point.`,
      ]);
    }
    if (kind === 4) {
      const { d } = rsci();
      return P(
        `Is ${coef(d)} × ${R.pk([2, 5, 8])}${sup(Math.abs(n))} in scientific notation? ${YN}`,
        I(0),
        [
          'Scientific notation multiplies the coefficient by a power of 10, not by a power of another number.',
        ],
      );
    }
    return P(`Is 10 × 10${sup(n)} in scientific notation? ${YN}`, I(0), [
      'The coefficient must be less than 10. 10 × 10ⁿ = 1 × 10ⁿ⁺¹.',
    ]);
  });
  const ident = many(14, () => {
    const { d, n } = rsci();
    const kind = R.ri(0, 1);
    if (kind === 0)
      return P(`In ${sciT(d, n)}, what is the exponent on the 10?`, I(n), [
        `The exponent is the small number on the 10: ${sg(n)}.`,
      ]);
    return P(`In ${sciT(d, n)}, what is the coefficient?`, N(coef(d)), [
      `The coefficient is the number multiplying the power of 10: ${coef(d)}.`,
    ]);
  });
  const bigSmall = many(12, () => {
    const { d, n } = rsci(3, -9, 9);
    return P(
      `Is ${sciT(d, n)} greater than 1 or between 0 and 1? Type 1 for greater than 1, 0 for between 0 and 1.`,
      I(n > 0 ? 1 : 0),
      [
        n > 0
          ? `A positive exponent multiplies by 10 ${n} times, so the number is large.`
          : `A negative exponent divides by 10 ${-n} times, so the number is between 0 and 1.`,
      ],
    );
  });
  const warm = mix(isSci, ident, bigSmall);

  const fix = (askCoef) =>
    many(16, () => {
      const d = R.dig(R.ri(1, 3));
      const s = R.nz(p ? -4 : -3, p ? 4 : 3);
      const e = R.ri(-6, 8);
      if (e + s === 0) return null;
      const c = stdStr(d, s);
      const q = `Rewrite ${c} × 10${sup(e)} in scientific notation a × 10ⁿ.`;
      const nn = e + s;
      return askCoef
        ? P(`${q} What is a?`, N(coef(d)), [
            `${c} is ${coef(d)} × 10${sup(s)}, so a = ${coef(d)}.`,
            `The coefficient must have one digit before the decimal point.`,
          ])
        : P(`${q} What is n?`, I(nn), [
            `${c} = ${coef(d)} × 10${sup(s)}.`,
            `Combine the powers of 10: ${sg(e)} ${s < 0 ? '−' : '+'} ${Math.abs(s)} = ${sg(nn)}, so n = ${sg(nn)}.`,
          ]);
    });
  const cmp = many(16, () => {
    const A = rsci(3, -8, 9);
    const B = rsci(3, -8, 9);
    if (A.n === B.n && !p) return null;
    const a = parseFloat(coef(A.d)) * 10 ** A.n;
    const b = parseFloat(coef(B.d)) * 10 ** B.n;
    if (a === b) return null;
    return P(
      `Which is greater, ${sciT(A.d, A.n)} or ${sciT(B.d, B.n)}? Type 1 for the first, 2 for the second.`,
      I(a > b ? 1 : 2),
      [
        A.n === B.n
          ? `The exponents are equal, so compare the coefficients: ${coef(A.d)} and ${coef(B.d)}.`
          : `The larger exponent wins when both coefficients are between 1 and 10: ${sg(A.n)} against ${sg(B.n)}.`,
        a > b ? 'The first number is greater.' : 'The second number is greater.',
      ],
    );
  });
  const times = many(12, () => {
    const d = R.dig(R.ri(1, 2));
    const m = R.ri(3, p ? 9 : 6);
    const n = m - R.ri(1, p ? 5 : 3);
    return P(`How many times larger is ${sciT(d, m)} than ${sciT(d, n)}?`, I(10 ** (m - n)), [
      `The coefficients are the same, so divide the powers of 10.`,
      `10${sup(m)} ÷ 10${sup(n)} = 10${sup(m - n)} = ${com(10 ** (m - n))}.`,
    ]);
  });
  const core = mix(fix(false), cmp, times, fix(true));

  const cmpNS = many(14, () => {
    const dA = R.dig(R.ri(1, 2));
    const dB = R.dig(R.ri(1, 2));
    const sA = R.ri(-2, 2);
    const sB = R.ri(-2, 2);
    const eA = R.ri(2, 9);
    const eB = R.ri(2, 9);
    const a = parseFloat(coef(dA)) * 10 ** (sA + eA);
    const b = parseFloat(coef(dB)) * 10 ** (sB + eB);
    if (a === b || (sA === 0 && sB === 0)) return null;
    return P(
      `Which is greater, ${stdStr(dA, sA)} × 10${sup(eA)} or ${stdStr(dB, sB)} × 10${sup(eB)}? Type 1 for the first, 2 for the second.`,
      I(a > b ? 1 : 2),
      [
        `Put both in scientific notation: ${stdStr(dA, sA)} × 10${sup(eA)} = ${coef(dA)} × 10${sup(sA + eA)} and ${stdStr(dB, sB)} × 10${sup(eB)} = ${coef(dB)} × 10${sup(sB + eB)}.`,
        `Compare: the ${a > b ? 'first' : 'second'} is greater.`,
      ],
    );
  });
  const ratio = many(14, () => {
    const a2 = R.ri(1, 4);
    const k = R.ri(2, 4);
    const a1 = a2 * k;
    if (a1 >= 10) return null;
    const n = R.ri(2, p ? 6 : 4);
    const m = n + R.ri(1, p ? 5 : 3);
    return P(
      `How many times larger is ${a1} × 10${sup(m)} than ${a2} × 10${sup(n)}?`,
      I(k * 10 ** (m - n)),
      [
        `Divide the coefficients: ${a1} ÷ ${a2} = ${k}.`,
        `Divide the powers of 10: 10${sup(m)} ÷ 10${sup(n)} = 10${sup(m - n)}.`,
        `${k} × ${com(10 ** (m - n))} = ${com(k * 10 ** (m - n))}.`,
      ],
    );
  });
  const countPow = many(10, () => {
    const lo = R.pk([5, 30, 200, 600, 2000, 50000]);
    const hi = lo * R.pk([1000, 10000, 100000, 1000000]);
    let cnt = 0;
    for (let n = 0; n <= 15; n += 1) if (10 ** n > lo && 10 ** n < hi) cnt += 1;
    return P(
      `How many powers 10ⁿ (n a whole number) are greater than ${com(lo)} and less than ${com(hi)}?`,
      I(cnt),
      [
        `List the powers of 10: 1, 10, 100, 1,000, 10,000, …`,
        `Count the ones between ${com(lo)} and ${com(hi)}: ${cnt}.`,
      ],
    );
  });
  const chal = mix(cmpNS, fix(true), ratio, countPow);
  return { warm, core, chal };
}

// ───────── 7. Scientific notation to standard form ─────────
const LARGE = [
  ['A stadium has', 'seats'],
  ['A company sold', 'tickets in one year'],
  ['A forest has about', 'trees'],
  ['A lake holds about', 'litres of water'],
  ['A video was watched', 'times'],
  ['A factory made', 'screws last month'],
];
const SMALL = [
  ['A grain of pollen is', 'metres across'],
  ['A sheet of paper is', 'metres thick'],
  ['A bacterium is', 'metres long'],
  ['A virus particle is', 'metres wide'],
  ['A dust speck weighs', 'grams'],
  ['A thread is', 'metres thick'],
];
function tostd(L) {
  const { p, R } = setup(L, 'tostd');
  const nmax = p ? 9 : 5;
  const pos = (lo) =>
    many(14, () => {
      const d = R.dig(R.ri(1, p ? 5 : 3));
      const n = R.ri(lo, nmax);
      const s = stdStr(d, n);
      return P(`Write ${sciT(d, n)} in standard form (no commas).`, N(s), [
        `The exponent is ${n}, so move the decimal point ${n} places to the right.`,
        `Fill in the missing zeros: ${stdT(d, n)}.`,
      ]);
    });
  const neg = (lo) =>
    many(14, () => {
      const d = R.dig(R.ri(1, p ? 5 : 3));
      const n = -R.ri(lo, nmax);
      const s = stdStr(d, n);
      return P(`Write ${sciT(d, n)} in standard form as a decimal.`, D(s), [
        `The exponent is ${sg(n)}, so move the decimal point ${-n} places to the left.`,
        `Fill in the missing zeros: ${s}.`,
      ]);
    });
  const way = many(12, () => {
    const d = R.dig(R.ri(1, 3));
    const n = R.nz(-nmax, nmax);
    if (R.ri(0, 1) === 0)
      return P(
        `To write ${sciT(d, n)} in standard form, do you move the decimal point right or left? Type 1 for right, 0 for left.`,
        I(n > 0 ? 1 : 0),
        [
          n > 0
            ? 'A positive exponent moves the decimal point right.'
            : 'A negative exponent moves the decimal point left.',
        ],
      );
    return P(
      `To write ${sciT(d, n)} in standard form, how many places does the decimal point move?`,
      I(Math.abs(n)),
      [`The number of places is the size of the exponent: ${Math.abs(n)}.`],
    );
  });
  const warm = mix(pos(1), neg(1), way);

  const zeros = many(12, () => {
    const len = p ? R.ri(1, 3) : 1;
    const d = R.dig(len);
    const n = R.ri(len, p ? 11 : 8);
    const z = n - (len - 1);
    if (z < 1) return null;
    return P(`How many zeros are in the standard form of ${sciT(d, n)}?`, I(z), [
      `Move the decimal point ${n} places to the right: ${stdT(d, n)}.`,
      `That gives ${z} zeros after the digits ${d}.`,
    ]);
  });
  const words = many(14, () => {
    const big = R.ri(0, 1) === 0;
    const [pre, post] = R.pk(big ? LARGE : SMALL);
    const d = R.dig(R.ri(1, 3));
    const n = big ? R.ri(2, p ? 9 : 6) : -R.ri(2, p ? 8 : 6);
    const s = stdStr(d, n);
    return P(
      `${pre} ${sciT(d, n)} ${post}. Write this number in standard form (no commas).`,
      big ? N(s) : D(s),
      [
        `The exponent is ${sg(n)}, so move the decimal point ${Math.abs(n)} places to the ${n > 0 ? 'right' : 'left'}.`,
        `${stdT(d, n)}.`,
      ],
    );
  });
  const digitsN = many(12, () => {
    const len = R.ri(1, 3);
    const d = R.dig(len);
    const n = R.ri(Math.max(len - 1, 3), p ? 12 : 8);
    return P(`How many digits does the standard form of ${sciT(d, n)} have?`, I(n + 1), [
      `Move the decimal point ${n} places to the right: ${stdT(d, n)}.`,
      `A number below 10 times 10${sup(n)} has ${n + 1} digits.`,
    ]);
  });
  const core = mix(pos(3), neg(3), zeros, words, digitsN);

  const afterPt = many(12, () => {
    const len = R.ri(1, 4);
    const d = R.dig(len);
    const n = -R.ri(2, p ? 9 : 6);
    return P(
      `How many digits are after the decimal point in the standard form of ${sciT(d, n)}?`,
      I(-n + len - 1),
      [
        `${sciT(d, n)} = ${stdStr(d, n)}.`,
        `Count the digits after the decimal point: ${-n + len - 1}.`,
      ],
    );
  });
  const leadZ = many(10, () => {
    const d = R.dig(R.ri(1, 3));
    const n = -R.ri(2, p ? 10 : 7);
    return P(
      `How many zeros are between the decimal point and the first non-zero digit of ${sciT(d, n)} in standard form?`,
      I(-n - 1),
      [`${sciT(d, n)} = ${stdStr(d, n)}.`, `There are ${-n - 1} zeros before the digit ${d[0]}.`],
    );
  });
  const addTwo = many(14, () => {
    const d1 = R.dig(R.ri(1, 2));
    const d2 = R.dig(R.ri(1, 2));
    const n1 = R.ri(3, p ? 7 : 5);
    const n2 = R.ri(2, n1);
    const s1 = Number(stdStr(d1, n1));
    const s2 = Number(stdStr(d2, n2));
    if (!Number.isInteger(s1) || !Number.isInteger(s2)) return null;
    const op = R.pk(['+', '−']);
    if (op === '−' && s1 <= s2) return null;
    const v = op === '+' ? s1 + s2 : s1 - s2;
    return P(
      `What is ${sciT(d1, n1)} ${op} ${sciT(d2, n2)}? Write it in standard form (no commas).`,
      I(v),
      [
        `${sciT(d1, n1)} = ${com(s1)} and ${sciT(d2, n2)} = ${com(s2)}.`,
        `${com(s1)} ${op} ${com(s2)} = ${com(v)}.`,
      ],
    );
  });
  const digitSum = many(12, () => {
    const d = R.dig(R.ri(2, 5));
    const n = R.ri(d.length, p ? 11 : 8);
    const s = d.split('').reduce((t, x) => t + Number(x), 0);
    return P(`What is the sum of the digits of the standard form of ${sciT(d, n)}?`, I(s), [
      `${sciT(d, n)} = ${stdT(d, n)}.`,
      `The zeros add nothing, so add ${d.split('').join(' + ')} = ${s}.`,
    ]);
  });
  const chal = mix(afterPt, addTwo, leadZ, digitSum);
  return { warm, core, chal };
}

// ───────── 8. Standard form to scientific notation ─────────
function tosci(L) {
  const { p, R } = setup(L, 'tosci');
  const bigN = p ? 11 : 8;
  const bigQ = (askCoef) =>
    many(14, () => {
      const d = R.dig(R.ri(1, p ? 5 : 3));
      const n = R.ri(Math.max(3, d.length - 1), bigN);
      const s = stdT(d, n);
      return askCoef
        ? P(`Write ${s} in scientific notation a × 10ⁿ. What is a?`, N(coef(d)), [
            `Write the non-zero digits ${d} and put the decimal point after the first one: ${coef(d)}.`,
            `So a = ${coef(d)}.`,
          ])
        : P(`Write ${s} in scientific notation a × 10ⁿ. What is n?`, I(n), [
            `Put the decimal point after the first non-zero digit: ${coef(d)}.`,
            `The decimal point moved ${n} places to the left, so n = ${n}.`,
          ]);
    });
  const smallQ = (askCoef) =>
    many(14, () => {
      const d = R.dig(R.ri(1, p ? 4 : 3));
      const n = -R.ri(2, p ? 9 : 6);
      const s = stdStr(d, n);
      return askCoef
        ? P(`Write ${s} in scientific notation a × 10ⁿ. What is a?`, N(coef(d)), [
            `The first non-zero digit is ${d[0]}, so put the decimal point after it: ${coef(d)}.`,
            `So a = ${coef(d)}.`,
          ])
        : P(`Write ${s} in scientific notation a × 10ⁿ. What is n?`, I(n), [
            `Put the decimal point after the first non-zero digit: ${coef(d)}.`,
            `The decimal point moved ${-n} places to the right, so n = ${sg(n)}.`,
          ]);
    });
  const warm = mix(bigQ(false), smallQ(false), bigQ(true), smallQ(true));

  const posNeg = many(12, () => {
    const d = R.dig(R.ri(1, 3));
    const n = R.nz(-7, 8);
    return P(
      `Is the exponent n positive or negative when ${stdT(d, n)} is written in scientific notation? Type 1 for positive, 0 for negative.`,
      I(n > 0 ? 1 : 0),
      [
        n > 0
          ? 'A number of 10 or more has a positive exponent.'
          : 'A number between 0 and 1 has a negative exponent.',
      ],
    );
  });
  const places = many(12, () => {
    const d = R.dig(R.ri(1, 3));
    const n = R.nz(-8, 9);
    return P(
      `How many places does the decimal point move to write ${stdT(d, n)} in scientific notation?`,
      I(Math.abs(n)),
      [`The scientific form is ${sciT(d, n)}.`, `The decimal point moves ${Math.abs(n)} places.`],
    );
  });
  const words = many(14, () => {
    const big = R.ri(0, 1) === 0;
    const [pre, post] = R.pk(big ? LARGE : SMALL);
    const d = R.dig(R.ri(1, 3));
    const n = big ? R.ri(3, p ? 9 : 7) : -R.ri(3, p ? 8 : 6);
    const s = stdT(d, n);
    return P(`${pre} ${s} ${post}. In scientific notation a × 10ⁿ, what is n?`, I(n), [
      `Put the decimal point after the first non-zero digit: ${coef(d)}.`,
      `It moved ${Math.abs(n)} places to the ${n > 0 ? 'left' : 'right'}, so n = ${sg(n)}.`,
    ]);
  });
  const core = mix(posNeg, bigQ(false), smallQ(false), places, words);

  const shift = many(14, () => {
    const d = R.dig(R.ri(1, 3));
    const n = R.ri(-6, 8);
    const k = R.pk([10, 100, 1000, 10000]);
    const mul = R.ri(0, 1) === 0;
    const z = Math.log10(k);
    return P(
      `N = ${sciT(d, n)}. When N is ${mul ? 'multiplied' : 'divided'} by ${com(k)} and written in scientific notation a × 10ⁿ, what is n?`,
      I(mul ? n + z : n - z),
      [
        `${mul ? 'Multiplying' : 'Dividing'} by ${com(k)} ${mul ? 'adds' : 'subtracts'} ${z} ${mul ? 'to' : 'from'} the exponent.`,
        `${sg(n)} ${mul ? '+' : '−'} ${z} = ${sg(mul ? n + z : n - z)}.`,
      ],
    );
  });
  const carry = many(14, () => {
    const d = R.dig(R.ri(1, 2));
    const n = R.ri(2, p ? 9 : 6);
    const k = R.ri(2, 9);
    const mant = Number(d) * k;
    const sc = n - (d.length - 1);
    const r = sciFromInt(mant, sc);
    return P(
      `N = ${sciT(d, n)}. When N is multiplied by ${k} and written in scientific notation a × 10ⁿ, what is n?`,
      I(r.n),
      [
        `${sciT(d, n)} × ${k} = ${com(mant)} × 10${sup(sc)} = ${sciT(r.d, r.n)}.`,
        `The coefficient must be below 10, so n = ${r.n}.`,
      ],
    );
  });
  const smallA = smallQ(true);
  const chal = mix(shift, carry, bigQ(true), smallA);
  return { warm, core, chal };
}

const BUILD = { powers, negzero, writing, signs, substitute, sci, tostd, tosci };

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
        if (/ \+ −| − −|\+ -|- -/.test(pr.steps.join(' ')))
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
    path.join(dir, 'psat-powers-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Powers chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const POWERS_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(dump('psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-powers-middle.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Middle-school (grades 7–8) problems per Powers chapter, 25 each from simple to complex, each tagged\n * with a Florida B.E.S.T. benchmark (MA.7.NSO.1.1, MA.8.NSO.1.3, 1.4 and 1.7). A teacher should check\n * the codes. Generated, so every answer is computed.\n */\nexport const POWERS_MIDDLE: Record<string, GuideProblem[]> = ${JSON.stringify(dump('ms'), null, 1)};\n`,
  );
  console.log('written powers problems');
}

main();
