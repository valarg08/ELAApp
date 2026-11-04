// Builds the two Powers chapters that are not in the video: multiplying and dividing numbers in
// scientific notation, 50 problems each from simple to complex. Coefficients are exact fractions,
// so every answer is computed, then re-checked with plain floating-point arithmetic and math-check.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '../../..');
const M = '−';
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n) =>
  String(n)
    .split('')
    .map((c) => (c === '-' ? '⁻' : SUPS[Number(c)]))
    .join('');
const sg = (n) => (n < 0 ? M + -n : String(n));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// ───────── exact arithmetic ─────────
const fr = (n, d = 1) => {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
const parse = (s) => {
  const [i, f = ''] = String(s).split('.');
  return fr(Number(i + f), 10 ** f.length);
};
const fmul = (a, b) => fr(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => fr(a.n * b.d, a.d * b.n);
const val = (f) => f.n / f.d;
const isInt = (f) => f.d === 1;
function dec(f) {
  // a terminating decimal, exactly
  let d = f.d;
  for (const p of [2, 5]) while (d % p === 0) d /= p;
  if (d !== 1) throw new Error('not terminating');
  let k = 0;
  while ((f.n * 10 ** k) % f.d !== 0) k += 1;
  const digits = String(Math.abs((f.n * 10 ** k) / f.d)).padStart(k + 1, '0');
  const text = k === 0 ? digits : `${digits.slice(0, -k)}.${digits.slice(-k)}`;
  return (f.n < 0 ? '-' : '') + text;
}
const disp = (s) => s.replace('-', M);
/** shift a coefficient into [1, 10) */
function norm(c, e) {
  let r = c;
  let k = e;
  while (val(r) >= 10) {
    r = fdiv(r, fr(10));
    k += 1;
  }
  while (val(r) < 1) {
    r = fmul(r, fr(10));
    k -= 1;
  }
  return { r, k };
}
const valueOf = (c, e) => (e >= 0 ? fmul(c, fr(10 ** e)) : fdiv(c, fr(10 ** -e)));
const sci = (c, e) => `${c} × 10${sup(e)}`;
const par = (c, e) => `(${sci(c, e)})`;
const exp = (e) => (e < 0 ? `(${sg(e)})` : String(e));

function P(q, a, steps, form) {
  return { q, a, ...(form ? { form } : {}), steps, check: undefined };
}
function numAnswer(f) {
  const a = dec(f);
  return { a, form: isInt(f) ? undefined : 'decimal' };
}

// ───────── the rule, as steps ─────────
function ruleSteps(op, c1, e1, c2, e2) {
  const x = parse(c1);
  const y = parse(c2);
  const mul = op === 'mul';
  const coef = mul ? fmul(x, y) : fdiv(x, y);
  const e = mul ? e1 + e2 : e1 - e2;
  const { r, k } = norm(coef, e);
  const steps = [
    mul
      ? `Multiply the coefficients: ${c1} × ${c2} = ${dec(coef)}.`
      : `Divide the coefficients: ${c1} ÷ ${c2} = ${dec(coef)}.`,
    mul
      ? `Add the exponents of 10: ${sg(e1)} + ${exp(e2)} = ${sg(e)}.`
      : `Subtract the exponents of 10: ${sg(e1)} − ${exp(e2)} = ${sg(e)}.`,
    `So the result is ${sci(dec(coef), e)}.`,
  ];
  if (k !== e) {
    steps.push(
      val(coef) >= 10
        ? `${dec(coef)} is 10 or more, so move a power of 10 into the exponent: ${sci(dec(coef), e)} = ${sci(dec(r), k)}.`
        : `${dec(coef)} is less than 1, so make the coefficient 10 times bigger and the exponent 1 smaller: ${sci(dec(coef), e)} = ${sci(dec(r), k)}.`,
    );
  }
  return { steps, r, k, coef, e };
}

const WHAT = {
  a: 'What is a?',
  n: 'What is n?',
};

/** A two-number problem: ask is a, n or std (standard form). */
function two(op, c1, e1, c2, e2, ask) {
  const { steps, r, k } = ruleSteps(op, c1, e1, c2, e2);
  const sign = op === 'mul' ? '' : ' ÷ ';
  const expr =
    op === 'mul' ? `${par(c1, e1)}${par(c2, e2)}` : `${par(c1, e1)}${sign}${par(c2, e2)}`;
  let q;
  let ans;
  if (ask === 'std') {
    q = `What is ${expr} in standard form?`;
    const v = valueOf(r, k);
    ans = numAnswer(v);
    steps.push(`${sci(dec(r), k)} in standard form is ${disp(ans.a)}.`);
  } else {
    q = `${expr} = a × 10ⁿ, with 1 ≤ a < 10. ${WHAT[ask]}`;
    ans = ask === 'a' ? numAnswer(r) : { a: String(k), form: undefined };
    steps.push(
      `In scientific notation the result is ${sci(dec(r), k)}, so ${ask} = ${ask === 'a' ? dec(r) : sg(k)}.`,
    );
  }
  return {
    ...P(q, ans.a, steps, ans.form),
    _chk: { op, c1, e1, c2, e2, ask },
  };
}

/** powers of ten alone */
function tens(op, m, n) {
  const k = op === 'mul' ? m + n : m - n;
  const sym = op === 'mul' ? '×' : '÷';
  return {
    ...P(`10${sup(m)} ${sym} 10${sup(n)} = 10^k. What is k?`, String(k), [
      op === 'mul'
        ? `Same base 10: keep the base and add the exponents, ${sg(m)} + ${exp(n)} = ${sg(k)}.`
        : `Same base 10: keep the base and subtract the exponents, ${sg(m)} − ${exp(n)} = ${sg(k)}.`,
      `So k = ${sg(k)}.`,
    ]),
    _chk: { tens: true, op, m, n, k },
  };
}

/** several factors or a chain, built from a list of [op, c, e] */
function chain(parts, ask, text) {
  // parts: first is [c, e]; later are ['mul'|'div', c, e]
  let coef = parse(parts[0][0]);
  let e = parts[0][1];
  const steps = [];
  const shown = [];
  parts.slice(1).forEach(([op, c, ee], i) => {
    const y = parse(c);
    const before = sci(dec(coef), e);
    coef = op === 'mul' ? fmul(coef, y) : fdiv(coef, y);
    e = op === 'mul' ? e + ee : e - ee;
    steps.push(
      op === 'mul'
        ? `Step ${i + 1}: multiply by ${par(c, ee)}: coefficients ${before.split(' ×')[0]} × ${c} = ${dec(coef)}, exponents add to ${sg(e)}.`
        : `Step ${i + 1}: divide by ${par(c, ee)}: coefficients ${before.split(' ×')[0]} ÷ ${c} = ${dec(coef)}, exponents subtract to ${sg(e)}.`,
    );
    shown.push(op);
  });
  const { r, k } = norm(coef, e);
  if (k !== e) steps.push(`${sci(dec(coef), e)} = ${sci(dec(r), k)} in scientific notation.`);
  let ans;
  let q;
  if (ask === 'std') {
    ans = numAnswer(valueOf(r, k));
    q = `${text} What is it in standard form?`;
    steps.push(`In standard form that is ${disp(ans.a)}.`);
  } else {
    ans = ask === 'a' ? numAnswer(r) : { a: String(k), form: undefined };
    q = `${text} Write the result as a × 10ⁿ, with 1 ≤ a < 10. ${WHAT[ask]}`;
    steps.push(`So ${ask} = ${ask === 'a' ? dec(r) : sg(k)}.`);
  }
  return { ...P(q, ans.a, steps, ans.form), _chk: { chain: parts, ask } };
}

/** an unknown coefficient or exponent; `ok(solution)` substitutes it back with plain arithmetic */
function unknown(q, sol, steps, ok) {
  return { ...P(q, String(sol), steps), _chk: { unknown: true, ok, sol } };
}
const near = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));

// ───────── multiplying ─────────
function multiplying() {
  const out = [];
  [
    [3, 4],
    [-2, 5],
    [6, -9],
    [-4, -3],
  ].forEach(([m, n]) => out.push(tens('mul', m, n)));
  [
    [2, 3, 3, 2, 'n'],
    [4, 5, 2, 1, 'a'],
    ['1.5', 4, 2, 3, 'a'],
    [3, 2, 3, 2, 'n'],
  ].forEach((t) => out.push(two('mul', ...t)));
  [
    [2, 2, 4, 1, 'std'],
    [3, 1, 2, 2, 'std'],
    ['1.5', 2, 2, 1, 'std'],
    [4, 3, 2, 0, 'std'],
  ].forEach((t) => out.push(two('mul', ...t)));
  [
    [2, -3, 3, -2, 'n'],
    [3, -4, 2, 2, 'n'],
    [4, -2, 2, -3, 'a'],
    ['1.5', -3, 3, -1, 'std'],
  ].forEach((t) => out.push(two('mul', ...t)));
  // core: the coefficient product reaches 10, or the numbers are decimals
  [
    [5, 3, 4, 2, 'a'],
    [5, 3, 4, 2, 'n'],
    [6, 4, 5, 2, 'n'],
    [8, 5, 3, 1, 'a'],
    [9, 2, 9, 3, 'a'],
    [9, 2, 9, 3, 'n'],
    [7, -3, 6, -2, 'n'],
    [5, 4, 2, 3, 'n'],
    ['2.5', 6, 4, 2, 'n'],
    ['1.2', 5, 5, 3, 'a'],
    ['3.5', -2, 2, 4, 'a'],
    ['4.5', 3, 2, -5, 'n'],
    ['2.5', -3, 8, 5, 'a'],
    [3, 7, 2, -4, 'n'],
    [8, -6, 5, 9, 'a'],
    [6, 5, 7, -8, 'a'],
    [9, -4, 3, 4, 'n'],
    ['1.6', 3, 5, 2, 'std'],
  ].forEach((t) => out.push(two('mul', ...t)));
  // challenge
  out.push(
    chain(
      [
        [2, 3],
        ['mul', 3, 4],
        ['mul', 5, 2],
      ],
      'n',
      '(2 × 10³)(3 × 10⁴)(5 × 10²) = ?',
    ),
  );
  out.push(
    chain(
      [
        [4, -2],
        ['mul', 5, 3],
        ['mul', 5, -1],
      ],
      'n',
      '(4 × 10⁻²)(5 × 10³)(5 × 10⁻¹) = ?',
    ),
  );
  out.push(
    chain(
      [
        ['1.5', 5],
        ['mul', 2, -2],
        ['mul', 4, 1],
      ],
      'a',
      '(1.5 × 10⁵)(2 × 10⁻²)(4 × 10¹) = ?',
    ),
  );
  out.push(
    chain(
      [
        [3, 4],
        ['mul', 3, 4],
      ],
      'n',
      '(3 × 10⁴)² = ?',
    ),
  );
  out.push(
    chain(
      [
        [4, 3],
        ['mul', 4, 3],
      ],
      'a',
      '(4 × 10³)² = ?',
    ),
  );
  out.push(
    chain(
      [
        [2, 5],
        ['mul', 2, 5],
        ['mul', 2, 5],
      ],
      'n',
      '(2 × 10⁵)³ = ?',
    ),
  );
  out.push(
    chain(
      [
        [5, -3],
        ['mul', 5, -3],
      ],
      'n',
      '(5 × 10⁻³)² = ?',
    ),
  );
  out.push(
    unknown(
      '(a × 10⁴)(2 × 10³) = 8 × 10⁷. What is a?',
      4,
      [
        'Multiply the left side: a · 2 × 10^(4 + 3) = 2a × 10⁷.',
        'This must equal 8 × 10⁷, so 2a = 8.',
        'a = 4.',
      ],
      (a) => near(a * 1e4 * 2e3, 8e7),
    ),
  );
  out.push(
    unknown(
      '(3 × 10ⁿ)(2 × 10⁵) = 6 × 10⁹. What is n?',
      4,
      [
        'Multiply the left side: 3 · 2 × 10^(n + 5) = 6 × 10^(n + 5).',
        'This must equal 6 × 10⁹, so n + 5 = 9.',
        'n = 4.',
      ],
      (n) => near(3 * 10 ** n * 2e5, 6e9),
    ),
  );
  out.push(
    unknown(
      '(a × 10⁻³)(5 × 10⁶) = 2 × 10⁴. What is a?',
      4,
      [
        'Multiply the left side: 5a × 10^(−3 + 6) = 5a × 10³.',
        'Write the right side with the same power: 2 × 10⁴ = 20 × 10³.',
        'So 5a = 20 and a = 4.',
      ],
      (a) => near(a * 1e-3 * 5e6, 2e4),
    ),
  );
  out.push(
    unknown(
      '(6 × 10ⁿ)(5 × 10⁻²) = 3 × 10⁷. What is n?',
      8,
      [
        'Multiply the left side: 6 · 5 × 10^(n − 2) = 30 × 10^(n − 2) = 3 × 10^(n − 1).',
        'This must equal 3 × 10⁷, so n − 1 = 7.',
        'n = 8.',
      ],
      (n) => near(6 * 10 ** n * 5e-2, 3e7),
    ),
  );
  out.push(
    chain(
      [
        [3, 8],
        ['mul', 5, 2],
      ],
      'n',
      'Light travels 3 × 10⁸ metres each second. How far does it travel in 5 × 10² seconds? Give the distance in metres.',
    ),
  );
  out.push(
    chain(
      [
        [4, 3],
        ['mul', '2.5', 2],
      ],
      'n',
      'A machine makes 4 × 10³ items an hour and runs for 2.5 × 10² hours. How many items does it make?',
    ),
  );
  out.push(
    chain(
      [
        [6, 4],
        ['mul', 2, 9],
      ],
      'a',
      'A sample has 6 × 10⁴ cells and each cell has about 2 × 10⁹ atoms. How many atoms are in the sample?',
    ),
  );
  out.push(
    chain(
      [
        ['1.2', 3],
        ['mul', 5, 2],
      ],
      'n',
      'A printer prints 1.2 × 10³ pages a day for 5 × 10² days. How many pages is that in all?',
    ),
  );
  out.push(
    chain(
      [
        ['2.4', -3],
        ['mul', 5, 7],
      ],
      'std',
      '(2.4 × 10⁻³)(5 × 10⁷) = ?',
    ),
  );
  return out;
}

// ───────── dividing ─────────
function dividing() {
  const out = [];
  [
    [7, 3],
    [-2, 4],
    [5, -3],
    [-4, -9],
  ].forEach(([m, n]) => out.push(tens('div', m, n)));
  [
    [6, 8, 2, 3, 'a'],
    [8, 7, 4, 2, 'n'],
    [9, 6, 3, 4, 'a'],
    [4, 9, 2, 5, 'n'],
  ].forEach((t) => out.push(two('div', ...t)));
  [
    [8, 5, 2, 2, 'std'],
    [6, 4, 3, 1, 'std'],
    ['7.5', 4, '2.5', 1, 'std'],
    [9, 3, 3, 0, 'std'],
  ].forEach((t) => out.push(two('div', ...t)));
  [
    [8, -3, 2, -5, 'n'],
    [6, -2, 3, 4, 'n'],
    [9, -5, 3, -2, 'a'],
    ['4.5', -4, '1.5', -6, 'a'],
  ].forEach((t) => out.push(two('div', ...t)));
  // core: the coefficient quotient is below 1, or the numbers are decimals
  [
    [2, 8, 4, 3, 'a'],
    [2, 8, 4, 3, 'n'],
    [3, 5, 6, 2, 'n'],
    [1, 6, 5, 2, 'a'],
    [1, 6, 5, 2, 'n'],
    [4, -3, 5, 2, 'a'],
    [7, 4, 8, 6, 'n'],
    ['2.4', 5, 6, 3, 'a'],
    ['7.5', 6, '2.5', 2, 'n'],
    ['1.2', -4, 4, -7, 'a'],
    ['9.6', 8, '1.2', 3, 'a'],
    ['3.6', 5, '1.5', -2, 'n'],
    ['5.6', -2, '1.4', 3, 'a'],
    ['2.25', 9, '1.5', 4, 'std'],
    [6, 7, 2, -3, 'n'],
    [8, -6, 2, 5, 'n'],
    [9, 0, '4.5', 3, 'a'],
    ['1.5', -2, 3, -5, 'a'],
  ].forEach((t) => out.push(two('div', ...t)));
  // challenge
  out.push(
    chain(
      [
        [6, 5],
        ['mul', 4, 2],
        ['div', 8, 3],
      ],
      'n',
      '(6 × 10⁵)(4 × 10²) ÷ (8 × 10³) = ?',
    ),
  );
  out.push(
    chain(
      [
        [9, -2],
        ['mul', 8, 6],
        ['div', 6, -4],
      ],
      'a',
      '(9 × 10⁻²)(8 × 10⁶) ÷ (6 × 10⁻⁴) = ?',
    ),
  );
  out.push(
    chain(
      [
        ['2.4', 7],
        ['div', 3, 2],
        ['div', 4, -1],
      ],
      'n',
      '(2.4 × 10⁷) ÷ (3 × 10²) ÷ (4 × 10⁻¹) = ?',
    ),
  );
  out.push(
    chain(
      [
        [5, 4],
        ['mul', 5, 4],
        ['div', '2.5', 3],
      ],
      'n',
      '(5 × 10⁴)² ÷ (2.5 × 10³) = ?',
    ),
  );
  out.push(
    unknown(
      '(a × 10⁹) ÷ (3 × 10⁴) = 2 × 10⁵. What is a?',
      6,
      [
        'Divide the left side: (a ÷ 3) × 10^(9 − 4) = (a ÷ 3) × 10⁵.',
        'This must equal 2 × 10⁵, so a ÷ 3 = 2.',
        'a = 6.',
      ],
      (a) => near((a * 1e9) / 3e4, 2e5),
    ),
  );
  out.push(
    unknown(
      '(8 × 10ⁿ) ÷ (2 × 10⁻³) = 4 × 10¹⁰. What is n?',
      7,
      [
        'Divide the left side: (8 ÷ 2) × 10^(n − (−3)) = 4 × 10^(n + 3).',
        'This must equal 4 × 10¹⁰, so n + 3 = 10.',
        'n = 7.',
      ],
      (n) => near((8 * 10 ** n) / 2e-3, 4e10),
    ),
  );
  out.push(
    unknown(
      '(6 × 10⁷) ÷ (b × 10³) = 3 × 10⁴. What is b?',
      2,
      [
        'Divide the left side: (6 ÷ b) × 10^(7 − 3) = (6 ÷ b) × 10⁴.',
        'This must equal 3 × 10⁴, so 6 ÷ b = 3.',
        'b = 2.',
      ],
      (b) => near(6e7 / (b * 1e3), 3e4),
    ),
  );
  out.push(
    unknown(
      '(4.5 × 10⁻³) ÷ (c × 10⁵) = 1.5 × 10⁻⁸. What is c?',
      3,
      [
        'Divide the left side: (4.5 ÷ c) × 10^(−3 − 5) = (4.5 ÷ c) × 10⁻⁸.',
        'This must equal 1.5 × 10⁻⁸, so 4.5 ÷ c = 1.5.',
        'c = 3.',
      ],
      (c) => near(4.5e-3 / (c * 1e5), 1.5e-8),
    ),
  );
  out.push(
    chain(
      [
        [6, 9],
        ['div', 2, 4],
      ],
      'std',
      'How many times larger is 6 × 10⁹ than 2 × 10⁴?',
    ),
  );
  out.push(
    chain(
      [
        [8, 7],
        ['div', 4, -2],
      ],
      'std',
      'How many times larger is 8 × 10⁷ than 4 × 10⁻²?',
    ),
  );
  out.push(
    chain(
      [
        ['1.5', 11],
        ['div', 3, 8],
      ],
      'n',
      'Light travels 3 × 10⁸ metres each second. How many seconds does it take to cover 1.5 × 10¹¹ metres?',
    ),
  );
  out.push(
    chain(
      [
        ['7.2', 9],
        ['div', 9, 2],
      ],
      'a',
      'A prize pool of 7.2 × 10⁹ dollars is shared equally between 9 × 10² winners. How many dollars does each winner get?',
    ),
  );
  out.push(
    chain(
      [
        ['2.4', -3],
        ['div', 6, 4],
      ],
      'n',
      'A sample of mass 2.4 × 10⁻³ grams is split into 6 × 10⁴ equal parts. What is the mass of one part, in grams?',
    ),
  );
  out.push(
    chain(
      [
        [6, 24],
        ['div', '7.5', 22],
      ],
      'std',
      'The Earth has a mass of 6 × 10²⁴ kg and the Moon 7.5 × 10²² kg. How many times heavier is the Earth than the Moon?',
    ),
  );
  out.push(
    chain(
      [
        ['7.2', 5],
        ['div', 9, -2],
      ],
      'std',
      '(7.2 × 10⁵) ÷ (9 × 10⁻²) = ?',
    ),
  );
  out.push(
    chain(
      [
        [1, -3],
        ['div', 4, -6],
      ],
      'std',
      '(1 × 10⁻³) ÷ (4 × 10⁻⁶) = ?',
    ),
  );
  return out;
}

// ───────── checks ─────────
const fl = (s) => Number(String(s));
function floatResult(op, c1, e1, c2, e2) {
  const x = fl(c1) * 10 ** e1;
  const y = fl(c2) * 10 ** e2;
  return op === 'mul' ? x * y : x / y;
}
/** [a, k] with a in [1, 10), from a plain float */
function sciOf(v) {
  let k = Math.floor(Math.log10(Math.abs(v)) + 1e-12);
  let a = v / 10 ** k;
  if (a >= 10 - 1e-9) {
    a /= 10;
    k += 1;
  }
  if (a < 1 - 1e-9) {
    a *= 10;
    k -= 1;
  }
  return [a, k];
}
function checkProblem(p) {
  const c = p._chk;
  if (!c) return true;
  if (c.unknown) return c.ok(Number(p.a));
  if (c.tens) return Number(p.a) === c.k && c.k === (c.op === 'mul' ? c.m + c.n : c.m - c.n);
  let v;
  let ask;
  if (c.chain) {
    ask = c.ask;
    v = fl(c.chain[0][0]) * 10 ** c.chain[0][1];
    for (const [op, co, e] of c.chain.slice(1))
      v = op === 'mul' ? v * (fl(co) * 10 ** e) : v / (fl(co) * 10 ** e);
  } else {
    ask = c.ask;
    v = floatResult(c.op, c.c1, c.e1, c.c2, c.e2);
  }
  const [a, k] = sciOf(v);
  const got = Number(p.a);
  if (ask === 'a') return near(a, got);
  if (ask === 'n') return k === got;
  return near(v, got);
}

async function main() {
  const { readAnswer, checkAnswer } = await import(
    pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const problems = [];
  const out = {};
  const seen = new Set();
  for (const [id, make] of [
    ['scimul', multiplying],
    ['scidiv', dividing],
  ]) {
    const list = make();
    if (list.length !== 50) problems.push(`${id} has ${list.length}`);
    list.forEach((p, i) => {
      const where = `${id}#${i + 1}`;
      if (/undefined|NaN|null|\[object|Infinity|wait/.test(JSON.stringify([p.q, p.a, p.steps])))
        problems.push(`${where} bad token: ${p.q}`);
      if (seen.has(p.q)) problems.push(`${where} repeats a question: ${p.q}`);
      seen.add(p.q);
      if (!checkProblem(p)) problems.push(`${where} answer ${p.a} fails the float check: ${p.q}`);
      const r = readAnswer(p.a);
      if (!r.ok) problems.push(`${where} unreadable answer ${p.a}`);
      else if (checkAnswer(p.a, [p.a], p.form ?? 'any').status !== 'correct')
        problems.push(`${where} answer ${p.a} does not check`);
      if (p.steps.some((s) => s.trim() === '' || s.includes('  ')))
        problems.push(`${where} empty or double-spaced step`);
    });
    out[id] = list.map((p) => ({
      q: p.q,
      a: p.a,
      ...(p.form ? { form: p.form } : {}),
      steps: [...p.steps, `Answer: ${disp(p.a)}`],
    }));
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
  }
  if (process.argv.includes('--list')) {
    for (const [id, list] of Object.entries(out))
      list.forEach((p, i) => console.log(`${id}#${i + 1} ${p.q} => ${p.a}`));
    return;
  }
  fs.writeFileSync(
    path.join(ROOT, 'apps/web/features/math/psat-powers-sci-ops.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Two extra Powers chapters that are not in the video: multiplying and dividing numbers in scientific\n * notation, 50 problems each from simple to complex (1–16 warm-up, 17–34 core, 35–50 challenge).\n * Generated from exact fractions, then re-checked with plain arithmetic, so every answer is computed.\n */\nexport const POWERS_SCI_OPS: Record<string, GuideProblem[]> = ${JSON.stringify(out, null, 1)};\n`,
  );
  console.log('written; problems found:', problems.length);
}
if (require.main === module) main();
