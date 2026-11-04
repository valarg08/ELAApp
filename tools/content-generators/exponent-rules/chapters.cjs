// The nine rule chapters and the final test: 50 problems each, simple to complex
// (1–16 warm-up, 17–34 core, 35–50 challenge). Expression problems come from lib.cjs and are
// answered by exact monomial arithmetic; the rest are small hand-built families with computed answers.
const L = require('./lib.cjs');
const { sup, t, N, xs, ys, xp, yp, pw, mul, div, fromExpr: E, MINUS } = L;

const P = (q, a, steps, form) => ({ q, a: String(a), ...(form ? { form } : {}), steps });
const show = (n) => t(n);
const frac = (n, d) => {
  const g = (a, b) => (b === 0 ? Math.abs(a) : g(b, a % b));
  const k = g(n, d);
  return { n: n / k, d: d / k };
};
const fr = (f) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
const frTxt = (f) => (f.d === 1 ? t(f.n) : `${t(f.n)}/${f.d}`);
const val = (f) => f.n / f.d;
const rep = (b, n) => Array(n).fill(b).join(' · ');
const asks = {
  val: { k: 'val' },
  c: { k: 'c' },
  cn: { k: 'cn' },
  sum: { k: 'sum' },
  ex: (v) => ({ k: 'exp', v }),
  fnum: { k: 'fnum' },
  fden: { k: 'fden' },
  fsum: { k: 'fsum' },
};

/** b^n as a value, with the repeated multiplication shown (small cases) */
const bpow = (b, n) => b ** n;
const baseTxt = (b) => (b < 0 ? `(${t(b)})` : String(b));
const withAnswer = (p) => ({
  ...p,
  steps: [
    ...p.steps,
    `Answer: ${t(Number(p.a.split('/')[0])) + (p.a.includes('/') ? '/' + p.a.split('/')[1] : '')}`,
  ],
});

// ───────── same-base numeric families ─────────
const sameProd = (b, m, n) =>
  P(`What is ${b}${sup(m)} · ${b}${sup(n)}?`, bpow(b, m + n), [
    `Same base ${b}: keep the base and add the exponents.`,
    `${b}${sup(m)} · ${b}${sup(n)} = ${b}^(${m} + ${n}) = ${b}${sup(m + n)}.`,
    `${b}${sup(m + n)} = ${bpow(b, m + n)}.`,
  ]);
const sameQuot = (b, m, n) =>
  P(`What is ${b}${sup(m)}/${b}${sup(n)}?`, bpow(b, m - n), [
    `Same base ${b}: keep the base and subtract the exponents.`,
    `${b}${sup(m)}/${b}${sup(n)} = ${b}^(${m} − ${n}) = ${b}${sup(m - n)}.`,
    `${b}${sup(m - n)} = ${bpow(b, m - n)}.`,
  ]);
const samePow = (b, m, n) =>
  P(`What is (${b}${sup(m)})${sup(n)}?`, bpow(b, m * n), [
    `Power of a power: keep the base and multiply the exponents.`,
    `(${b}${sup(m)})${sup(n)} = ${b}^(${m}·${n}) = ${b}${sup(m * n)}.`,
    `${b}${sup(m * n)} = ${bpow(b, m * n)}.`,
  ]);

// ───────── 1. What is an exponent? ─────────
function whatis() {
  const out = [];
  const ev = (b, n) => {
    const v = bpow(b, n);
    const shown = n <= 5 ? `${Array(n).fill(baseTxt(b)).join(' · ')} = ${t(v)}` : `${t(v)}`;
    out.push(
      P(`What is ${baseTxt(b)}${sup(n)}?`, v, [
        `The exponent ${n} says to multiply the base ${t(b)} by itself, ${n} factors in all.`,
        `${baseTxt(b)}${sup(n)} = ${shown}.`,
      ]),
    );
  };
  // warm-up
  [
    [3, 4],
    [5, 3],
    [4, 3],
    [6, 2],
    [10, 3],
    [2, 6],
  ].forEach(([b, n]) => ev(b, n));
  [
    [6, 5],
    [7, 4],
    [8, 3],
  ].forEach(([b, n]) =>
    out.push(
      P(`How many factors of ${b} are multiplied together in ${b}${sup(n)}?`, n, [
        `In ${b}${sup(n)} the base is ${b} and the exponent is ${n}.`,
        `The exponent tells how many times the base is a factor: ${rep(b, n)}.`,
      ]),
    ),
  );
  [
    [9, 5],
    [3, 8],
    [11, 3],
  ].forEach(([b, n]) =>
    out.push(
      P(`What is the base in ${b}${sup(n)}?`, b, [
        `In a power, the base is the number being multiplied by itself.`,
        `In ${b}${sup(n)} the base is ${b} and the exponent is ${n}.`,
      ]),
    ),
  );
  [
    [5, 4],
    [9, 3],
    [7, 6],
  ].forEach(([b, n]) =>
    out.push(
      P(`${rep(b, n)} = ${b}^n. What is n?`, n, [
        `Count the factors of ${b}: there are ${n}.`,
        `Repeated multiplication of ${n} equal factors is the power ${b}${sup(n)}, so n = ${n}.`,
      ]),
    ),
  );
  // core: bigger values
  [
    [7, 3],
    [12, 2],
    [9, 3],
    [4, 5],
    [3, 5],
    [6, 4],
    [5, 4],
    [8, 3],
  ].forEach(([b, n]) => ev(b, n));
  // signs
  [
    [-3, 4],
    [-2, 5],
    [-5, 2],
    [-4, 3],
  ].forEach(([b, n]) => ev(b, n));
  [
    [3, 4],
    [5, 2],
    [7, 2],
    [6, 3],
  ].forEach(([bb, nn]) => {
    // −b^n: the exponent belongs to b only
    out.push(
      P(`What is ${MINUS}${bb}${sup(nn)}?`, -bpow(bb, nn), [
        `Without parentheses the exponent applies only to ${bb}, not to the minus sign.`,
        `${MINUS}${bb}${sup(nn)} = ${MINUS}(${bb}${sup(nn)}) = ${MINUS}${bpow(bb, nn)}.`,
      ]),
    );
  });
  // fractions
  [
    [1, 3, 4],
    [3, 2, 2],
  ].forEach(([a, b, n]) => {
    const f = frac(a ** n, b ** n);
    out.push(
      P(
        `What is (${a}/${b})${sup(n)}?`,
        fr(f),
        [
          `Multiply ${a}/${b} by itself ${n} times: numerator ${a}${sup(n)} = ${a ** n}, denominator ${b}${sup(n)} = ${b ** n}.`,
          `(${a}/${b})${sup(n)} = ${a ** n}/${b ** n}${f.d === a ** n * 0 + b ** n && f.n === a ** n ? '' : ` = ${frTxt(f)}`}.`,
        ],
        f.d === 1 ? undefined : 'fraction',
      ),
    );
  });
  // challenge
  [
    [2, 3, 3, 2],
    [5, 2, 2, 4],
    [10, 3, 10, 2],
    [3, 3, 2, 3],
    [4, 2, 2, 2],
    [7, 2, 3, 1],
    [6, 2, 2, 5],
  ].forEach(([a, m, b, n]) => {
    // a^m + b^n
    const v = a ** m + b ** n;
    out.push(
      P(`What is ${a}${sup(m)} + ${b}${sup(n)}?`, v, [
        `Work out each power first: ${a}${sup(m)} = ${a ** m} and ${b}${sup(n)} = ${b ** n}.`,
        `${a ** m} + ${b ** n} = ${v}.`,
      ]),
    );
  });
  [
    [2, 7],
    [3, 5],
    [5, 4],
  ].forEach(([b, n]) =>
    out.push(
      P(`${b}^n = ${b ** n}. What is n?`, n, [
        `Multiply ${b}s until you reach ${b ** n}: ${Array.from({ length: n }, (_, i) => b ** (i + 1)).join(', ')}.`,
        `That took ${n} factors of ${b}, so n = ${n}.`,
      ]),
    ),
  );
  [
    [6, 3],
    [3, 4],
  ].forEach(([b, n]) =>
    out.push(
      P(`n${sup(n)} = ${b ** n}, and n is a positive whole number. What is n?`, b, [
        `Find the number that multiplied by itself ${n} times gives ${b ** n}.`,
        `${b}${sup(n)} = ${b ** n}, so n = ${b}.`,
      ]),
    ),
  );
  [
    [2, 6, 6, 2],
    [3, 4, 4, 3],
  ].forEach(([a, m, b, n]) => {
    const A = a ** m;
    const B = b ** n;
    out.push(
      P(`Which is larger, ${a}${sup(m)} or ${b}${sup(n)}? Type the larger value.`, Math.max(A, B), [
        `${a}${sup(m)} = ${A} and ${b}${sup(n)} = ${B}.`,
        `The larger value is ${Math.max(A, B)}.`,
      ]),
    );
  });
  [
    [7, 4],
    [3, 5],
    [2, 10],
  ].forEach(([b, n]) => {
    const last = (x) => x % 10;
    let u = 1;
    const seq = [];
    for (let i = 1; i <= n; i += 1) {
      u = last(u * b);
      seq.push(u);
    }
    out.push(
      P(`What is the units digit of ${b}${sup(n)}?`, u, [
        `Only the units digit matters, so multiply units digits one power at a time.`,
        `The units digits of ${b}, ${b}², … are ${seq.join(', ')}; the units digit of ${b}${sup(n)} is ${u}.`,
      ]),
    );
  });
  return out;
}

// ───────── 2. Product of powers ─────────
function product() {
  const out = [];
  [
    [2, 2, 3],
    [3, 2, 2],
    [10, 2, 3],
    [5, 2, 2],
    [2, 6, 2],
    [4, 2, 3],
  ].forEach(([b, m, n]) => out.push(sameProd(b, m, n)));
  [
    [2, 3],
    [4, 5],
    [6, 3],
    [7, 8],
    [10, 2],
    [5, 9],
  ].forEach(([m, n]) => out.push(E(mul(xp(m), xp(n)), asks.ex('x'))));
  [
    [2, 3, 4],
    [3, 4, 6],
    [5, 3, 2],
    [7, 2, 8],
  ].forEach(([a, b, c]) => out.push(E(mul(xp(a), xp(b), xp(c)), asks.ex('x'))));
  // core
  out.push(E(mul(N(3), xp(2), N(4), xp(5)), asks.c));
  out.push(E(mul(N(2), xp(3), N(5), xp(4)), asks.c));
  out.push(E(mul(N(-3), xp(4), N(2), xp(3)), asks.c));
  out.push(E(mul(N(6), xp(2), N(-2), xp(7)), asks.c));
  out.push(E(mul(N(5), xp(4), N(3), xp(2)), asks.ex('x')));
  out.push(E(mul(N(7), xp(6), N(2), xp(9)), asks.ex('x')));
  out.push(E(mul(N(-4), xp(5), N(-3), xp(8)), asks.cn));
  out.push(E(mul(xp(2), yp(3), xp(4), yp(2)), asks.ex('y')));
  out.push(E(mul(xp(5), yp(2), xp(3), yp(6)), asks.ex('x')));
  out.push(E(mul(xp(3), yp(4), xp(6), yp(5)), asks.sum));
  out.push(E(mul(N(2), xp(3), yp(2), N(4), xp(2), yp(5)), asks.c));
  [
    [2, 5, 3],
    [3, 3, 2],
    [10, 4, 2],
  ].forEach(([b, m, n]) => out.push(sameProd(b, m, n)));
  // missing exponent
  const missing = (base, e1, total, unknown) => {
    const m = total - e1;
    return P(`${base}^m · ${base}${sup(e1)} = ${base}${sup(total)}. What is m?`, m, [
      `Same base ${base}: the exponents add, so m + ${e1} = ${total}.`,
      `m = ${total} − ${e1} = ${m}.`,
    ]);
  };
  out.push(missing('x', 4, 9));
  out.push(missing('2', 3, 8));
  out.push(
    P(`y^m · y^m = y${sup(14)}. What is m?`, 7, [
      `Both factors have the same exponent m, so the exponents add to m + m = 2m.`,
      `2m = 14, so m = 7.`,
    ]),
  );
  out.push(missing('3', 5, 12));
  // challenge: rewrite to one base
  [
    [4, 2, 2, 3],
    [9, 3, 2, 4],
    [8, 2, 3, 4],
    [25, 5, 2, 3],
    [27, 3, 3, 2],
  ].forEach(([k, b, e, m]) => {
    const n = e + m;
    out.push(
      P(`${k} · ${b}${sup(m)} = ${b}^n. What is n?`, n, [
        `Write ${k} as a power of ${b}: ${k} = ${b}${sup(e)}.`,
        `${b}${sup(e)} · ${b}${sup(m)} = ${b}^(${e} + ${m}) = ${b}${sup(n)}, so n = ${n}.`,
      ]),
    );
  });
  // exponent equations
  const eq = (b, a1, c1, a2, c2, total) => {
    const A = a1 + a2;
    const C = c1 + c2;
    const x = (total - C) / A;
    if (!Number.isInteger(x)) throw new Error('eq x');
    const lin = (a, c) => `${a === 1 ? '' : a}x${c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`}`;
    return P(`${b}^(${lin(a1, c1)}) · ${b}^(${lin(a2, c2)}) = ${b}${sup(total)}. What is x?`, x, [
      `Same base ${b}: add the exponents, (${lin(a1, c1)}) + (${lin(a2, c2)}) = ${lin(A, C)}.`,
      `So ${lin(A, C)} = ${total}, which gives ${A === 1 ? 'x' : `${A}x`} = ${total - C}.`,
      `x = ${x}.`,
    ]);
  };
  out.push(eq(2, 1, 1, 1, 2, 9));
  out.push(eq(3, 1, 0, 1, -1, 7));
  out.push(eq(5, 2, 0, 1, 1, 10));
  out.push(eq(7, 1, -2, 1, 4, 10));
  // negative exponents in a product
  out.push(E(mul(xp(7), xp(-3)), asks.ex('x')));
  out.push(E(mul(xp(-2), xp(-5)), asks.ex('x')));
  out.push(E(mul(yp(-4), yp(9)), asks.ex('y')));
  out.push(
    P(`What is 2${sup(-3)} · 2${sup(7)}?`, 16, [
      `Same base 2: add the exponents, ${MINUS}3 + 7 = 4.`,
      `2${sup(-3)} · 2${sup(7)} = 2${sup(4)} = 16.`,
    ]),
  );
  // several factors
  out.push(E(mul(N(2), xp(3), N(-5), xp(4), N(3), xs), asks.c));
  out.push(E(mul(N(-1), xp(2), ys, N(3), xs, yp(4), N(2), ys), asks.sum));
  out.push(E(mul(xp(2), yp(3), xp(4), ys, xp(3), yp(2)), asks.sum));
  return out;
}

// ───────── 3. Quotient of powers ─────────
function quotient() {
  const out = [];
  [
    [2, 8, 5],
    [3, 6, 4],
    [10, 7, 4],
    [5, 5, 2],
    [4, 6, 3],
    [6, 4, 2],
  ].forEach(([b, m, n]) => out.push(sameQuot(b, m, n)));
  [
    [8, 3],
    [10, 6],
    [12, 5],
    [7, 2],
    [15, 9],
    [20, 11],
  ].forEach(([m, n]) => out.push(E(div(xp(m), xp(n)), asks.ex('x'))));
  [
    [5, 4, 3],
    [2, 8, 4],
    [6, 7, 5],
    [3, 3, 2],
  ].forEach(([a, b, c]) => out.push(E(div(mul(xp(a), xp(b)), xp(c)), asks.ex('x'))));
  // core
  out.push(E(div(mul(N(12), xp(8)), mul(N(3), xp(2))), asks.c));
  out.push(E(div(mul(N(20), xp(9)), mul(N(4), xp(5))), asks.c));
  out.push(E(div(mul(N(-18), xp(7)), mul(N(6), xp(3))), asks.c));
  out.push(E(div(mul(N(30), xp(11)), mul(N(5), xp(4))), asks.cn));
  out.push(E(div(mul(N(15), xp(10)), mul(N(5), xp(4))), asks.ex('x')));
  out.push(E(div(mul(N(24), xp(9)), mul(N(8), xp(6))), asks.ex('x')));
  out.push(E(div(mul(xp(8), yp(5)), mul(xp(3), yp(2))), asks.sum));
  out.push(E(div(mul(xp(9), yp(7)), mul(xp(4), yp(3))), asks.ex('y')));
  out.push(E(div(mul(xp(12), yp(6)), mul(xp(5), yp(1))), asks.sum));
  out.push(E(div(mul(N(14), xp(6), yp(8)), mul(N(7), xp(2), yp(3))), asks.c));
  [
    [2, 10, 6],
    [3, 9, 6],
    [10, 9, 5],
    [5, 8, 5],
  ].forEach(([b, m, n]) => out.push(sameQuot(b, m, n)));
  const missing = (base, a, b, total) =>
    a === null
      ? P(`${base}^m/${base}${sup(b)} = ${base}${sup(total)}. What is m?`, total + b, [
          `Same base ${base}: m − ${b} = ${total}.`,
          `m = ${total} + ${b} = ${total + b}.`,
        ])
      : P(`${base}${sup(a)}/${base}^m = ${base}${sup(total)}. What is m?`, a - total, [
          `Same base ${base}: ${a} − m = ${total}.`,
          `m = ${a} − ${total} = ${a - total}.`,
        ]);
  out.push(missing('x', null, 3, 7));
  out.push(missing('2', null, 4, 5));
  out.push(missing('x', 9, 0, 4));
  out.push(missing('5', 8, 0, 3));
  // challenge: rewrite
  [
    [8, 2, 3, 9],
    [9, 3, 2, 7],
    [25, 5, 2, 8],
    [100, 10, 2, 6],
    [49, 7, 2, 5],
  ].forEach(([k, b, e, m]) => {
    const n = m - e;
    out.push(
      P(`${b}${sup(m)}/${k} = ${b}^n. What is n?`, n, [
        `Write ${k} as a power of ${b}: ${k} = ${b}${sup(e)}.`,
        `${b}${sup(m)}/${b}${sup(e)} = ${b}^(${m} − ${e}) = ${b}${sup(n)}, so n = ${n}.`,
      ]),
    );
  });
  // negative results
  out.push(E(div(xp(3), xp(8)), asks.ex('x')));
  out.push(E(div(yp(2), yp(9)), asks.ex('y')));
  out.push(
    P(
      `What is 2${sup(3)}/2${sup(7)}?`,
      '1/16',
      [
        `Same base 2: subtract the exponents, 3 − 7 = ${MINUS}4.`,
        `2${sup(-4)} means 1/2${sup(4)} = 1/16.`,
      ],
      'fraction',
    ),
  );
  out.push(E(div(xp(4), xp(10)), asks.ex('x')));
  // exponent equations
  const eq = (b, a1, c1, a2, c2, total) => {
    const A = a1 - a2;
    const C = c1 - c2;
    const x = (total - C) / A;
    if (!Number.isInteger(x)) throw new Error('eq x');
    const lin = (a, c) => `${a === 1 ? '' : a}x${c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`}`;
    return P(`${b}^(${lin(a1, c1)})/${b}^(${lin(a2, c2)}) = ${b}${sup(total)}. What is x?`, x, [
      `Same base ${b}: subtract the exponents, (${lin(a1, c1)}) − (${lin(a2, c2)}) = ${lin(A, C)}.`,
      `So ${lin(A, C)} = ${total}, which gives ${A === 1 ? 'x' : `${A}x`} = ${total - C}.`,
      `x = ${x}.`,
    ]);
  };
  out.push(eq(2, 3, 0, 1, -1, 9));
  out.push(eq(3, 2, 5, 1, 1, 10));
  out.push(eq(7, 4, 0, 1, 3, 12));
  out.push(eq(5, 1, 9, 2, -1, 3));
  out.push(E(div(mul(N(18), xp(9), yp(4)), mul(N(6), xp(3), ys)), asks.sum));
  out.push(E(div(mul(xp(7), yp(3)), mul(xp(2), yp(5))), asks.sum));
  out.push(E(div(mul(N(-36), xp(6), yp(5)), mul(N(9), xp(4), yp(2))), asks.c));
  return out;
}

// ───────── 4. Power of a power ─────────
function powerpower() {
  const out = [];
  [
    [2, 2, 3],
    [3, 2, 2],
    [10, 2, 3],
    [2, 3, 3],
    [5, 2, 2],
    [4, 2, 3],
  ].forEach(([b, m, n]) => out.push(samePow(b, m, n)));
  [
    [2, 5],
    [3, 4],
    [6, 2],
    [7, 3],
    [5, 5],
    [8, 2],
  ].forEach(([m, n]) => out.push(E(pw(xp(m), n), asks.ex('x'))));
  [
    [2, 3, 2],
    [3, 2, 4],
    [2, 2, 5],
    [4, 2, 2],
  ].forEach(([a, b, c]) => out.push(E(pw(pw(xp(a), b), c), asks.ex('x'))));
  // core
  [
    [2, 3, 4],
    [4, 2, 3],
    [5, 3, 2],
    [3, 4, 7],
  ].forEach(([m, n, p]) => out.push(E(mul(pw(xp(m), n), xp(p)), asks.ex('x'))));
  [
    [3, 4, 5],
    [2, 6, 7],
  ].forEach(([m, n, p]) => out.push(E(div(pw(xp(m), n), xp(p)), asks.ex('x'))));
  out.push(E(div(pw(xp(5), 3), xp(4)), asks.ex('x')));
  [
    [2, 3, 3, 2],
    [4, 2, 2, 5],
    [3, 3, 5, 2],
  ].forEach(([a, b, c, d]) => out.push(E(mul(pw(xp(a), b), pw(xp(c), d)), asks.ex('x'))));
  const unknownExp = (kind, ...a) => {
    if (kind === 'm') {
      const [n, total] = a;
      return P(`(x^m)${sup(n)} = x${sup(total)}. What is m?`, total / n, [
        `Power of a power: multiply the exponents, so m · ${n} = ${total}.`,
        `m = ${total} ÷ ${n} = ${total / n}.`,
      ]);
    }
    const [m, total] = a;
    return P(`(x${sup(m)})^n = x${sup(total)}. What is n?`, total / m, [
      `Power of a power: multiply the exponents, so ${m} · n = ${total}.`,
      `n = ${total} ÷ ${m} = ${total / m}.`,
    ]);
  };
  out.push(unknownExp('m', 4, 20));
  out.push(unknownExp('n', 3, 21));
  out.push(
    P(`(2^m)${sup(3)} = 2${sup(12)}. What is m?`, 4, [
      `Power of a power: multiply the exponents, so m · 3 = 12.`,
      `m = 12 ÷ 3 = 4.`,
    ]),
  );
  out.push(
    P(`(3${sup(2)})^n = 3${sup(10)}. What is n?`, 5, [
      `Power of a power: multiply the exponents, so 2 · n = 10.`,
      `n = 10 ÷ 2 = 5.`,
    ]),
  );
  [
    [6, 2, 2],
    [2, 5, 2],
    [9, 2, 2],
  ].forEach(([b, m, n]) => out.push(samePow(b, m, n)));
  out.push(E(pw(xp(-2), 5), asks.ex('x')));
  out.push(E(pw(xp(3), -2), asks.ex('x')));
  // challenge: rewrite to one base
  [
    [4, 2, 2, 3],
    [9, 3, 2, 2],
    [8, 2, 3, 2],
    [25, 5, 2, 3],
    [27, 3, 3, 2],
  ].forEach(([k, b, e, n]) => {
    const total = e * n;
    out.push(
      P(`${k}${sup(n)} = ${b}^m. What is m?`, total, [
        `Write ${k} as a power of ${b}: ${k} = ${b}${sup(e)}.`,
        `(${b}${sup(e)})${sup(n)} = ${b}^(${e}·${n}) = ${b}${sup(total)}, so m = ${total}.`,
      ]),
    );
  });
  const pe = (b, a, c, k, total) => {
    // (b^(a x + c))^k = b^total
    const lin = `${a === 1 ? '' : a}x${c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`}`;
    const x = (total / k - c) / a;
    if (!Number.isInteger(x)) throw new Error('pe');
    return P(`(${b}^(${lin}))${sup(k)} = ${b}${sup(total)}. What is x?`, x, [
      `Power of a power: multiply the exponents, so ${k}(${lin}) = ${total}.`,
      `${lin} = ${total / k}, so ${a === 1 ? 'x' : `${a}x`} = ${total / k - c}.`,
      `x = ${x}.`,
    ]);
  };
  out.push(pe(2, 1, 1, 3, 15));
  out.push(pe(3, 2, 0, 2, 20));
  out.push(pe(5, 1, -2, 4, 20));
  out.push(E(div(mul(pw(xp(2), 3), pw(xp(4), 2)), xp(5)), asks.ex('x')));
  out.push(E(div(pw(pw(xp(2), 4), 3), pw(xp(5), 4)), asks.ex('x')));
  out.push(E(div(mul(pw(xp(3), 4), pw(xp(2), 5)), pw(xp(6), 3)), asks.ex('x')));
  out.push(E(div(pw(pw(xp(3), 2), 2), mul(xp(2), xp(3))), asks.ex('x')));
  out.push(E(mul(pw(xp(2), 5), pw(yp(3), 4)), asks.sum));
  out.push(E(mul(pw(xp(4), 2), pw(yp(2), 6)), asks.sum));
  out.push(
    P(`What is (2${sup(2)})${sup(3)} · (2${sup(3)})${sup(2)} / 2${sup(5)}?`, 128, [
      `Power of a power: (2²)³ = 2⁶ and (2³)² = 2⁶.`,
      `Product and quotient of powers: 2⁶ · 2⁶ / 2⁵ = 2^(6 + 6 − 5) = 2⁷.`,
      `2⁷ = 128.`,
    ]),
  );
  return out;
}

// ───────── 5. Power of a product ─────────
function powerproduct() {
  const out = [];
  [
    [2, 3, 2],
    [2, 5, 3],
    [3, 4, 2],
    [2, 4, 3],
    [2, 3, 3],
    [3, 5, 2],
  ].forEach(([a, b, n]) =>
    out.push(
      P(`What is (${a} · ${b})${sup(n)}?`, (a * b) ** n, [
        `Power of a product: raise each factor to the power ${n}.`,
        `(${a} · ${b})${sup(n)} = ${a}${sup(n)} · ${b}${sup(n)} = ${a ** n} · ${b ** n} = ${(a * b) ** n}.`,
      ]),
    ),
  );
  [
    [2, 3],
    [5, 2],
    [3, 3],
    [4, 2],
  ].forEach(([a, n]) => out.push(E(pw(mul(N(a), xs), n), asks.c)));
  [[5], [7], [3]].forEach(([n]) => out.push(E(pw(mul(xs, ys), n), asks.ex('x'))));
  [[6], [4], [8]].forEach(([n]) => out.push(E(pw(mul(xs, ys), n), asks.sum)));
  out.push(E(pw(mul(N(-3), xs), 2), asks.c));
  out.push(E(pw(mul(N(-2), xs), 3), asks.c));
  out.push(E(pw(mul(N(-5), xs), 2), asks.c));
  // core
  out.push(E(pw(mul(N(2), xp(3)), 2), asks.ex('x')));
  out.push(E(pw(mul(N(3), xp(2)), 3), asks.c));
  out.push(E(pw(mul(N(5), xp(4)), 2), asks.ex('x')));
  out.push(E(pw(mul(N(-2), xp(2)), 3), asks.c));
  out.push(E(pw(mul(N(4), xp(3)), 2), asks.c));
  out.push(E(pw(mul(N(2), xp(5)), 4), asks.ex('x')));
  out.push(E(pw(mul(xp(2), yp(3)), 4), asks.ex('x')));
  out.push(E(pw(mul(xp(2), yp(3)), 4), asks.ex('y')));
  out.push(E(pw(mul(xp(3), yp(5)), 2), asks.sum));
  out.push(E(pw(mul(xp(4), ys), 5), asks.sum));
  out.push(E(pw(mul(N(2), xs, yp(2)), 3), asks.c));
  out.push(E(pw(mul(N(2), xs, yp(2)), 3), asks.sum));
  out.push(E(pw(mul(N(10), xs), 3), asks.c));
  out.push(E(pw(mul(N(10), xp(2)), 4), asks.cn));
  out.push(E(pw(mul(N(3), xp(2), ys), 3), asks.c));
  out.push(E(pw(mul(N(3), xp(2), ys), 3), asks.sum));
  out.push(E(pw(mul(N(2), xp(3), ys), 5), asks.c));
  // challenge
  out.push(E(mul(pw(mul(N(2), xp(2), ys), 3), pw(mul(xs, ys), 2)), asks.sum));
  out.push(E(mul(pw(mul(N(2), xp(2), ys), 3), pw(mul(xs, ys), 2)), asks.c));
  out.push(E(pw(mul(N(-3), xp(2)), 3), asks.c));
  out.push(E(pw(mul(N(2), xp(3), yp(2)), 4), asks.ex('y')));
  out.push(E(pw(mul(N(2), xp(3), yp(2)), 4), asks.c));
  out.push(E(pw(mul(N(2), xp(3), yp(2)), 4), asks.sum));
  out.push(
    P(`(2x^m)${sup(3)} = 8x${sup(15)}. What is m?`, 5, [
      `Power of a product: (2x^m)³ = 2³ · x^(3m) = 8x^(3m).`,
      `So 3m = 15 and m = 5.`,
    ]),
  );
  out.push(
    P(`(cx${sup(2)})${sup(3)} = 125x${sup(6)}. What is c?`, 5, [
      `Power of a product: (cx²)³ = c³ · x⁶.`,
      `So c³ = 125, and c = 5 because 5³ = 125.`,
    ]),
  );
  out.push(
    P(`(3x^m)${sup(2)} = 9x${sup(14)}. What is m?`, 7, [
      `Power of a product: (3x^m)² = 3² · x^(2m) = 9x^(2m).`,
      `So 2m = 14 and m = 7.`,
    ]),
  );
  out.push(
    P(`(2x)^n = 32x${sup(5)}. What is n?`, 5, [
      `Power of a product: (2x)^n = 2^n · x^n.`,
      `The power of x gives n = 5, and 2⁵ = 32 agrees.`,
    ]),
  );
  [
    [4, 25, 2],
    [5, 4, 2],
  ].forEach(([a, b, n]) => {
    // numeric: (a·b)^n with a recombination that equals 10^k or a nice number
    const v = (a * b) ** n;
    out.push(
      P(`What is (${a} · ${b})${sup(n)}?`, v, [
        `Multiply inside the parentheses first: ${a} · ${b} = ${a * b}.`,
        `${a * b}${sup(n)} = ${v}. (Or raise each factor: ${a}${sup(n)} · ${b}${sup(n)} = ${a ** n} · ${b ** n} = ${v}.)`,
      ]),
    );
  });
  out.push(E(pw(mul(N(-1), xp(2), yp(3)), 5), asks.sum));
  out.push(E(pw(mul(N(-2), xs, yp(2)), 4), asks.c));
  return out;
}

// ───────── 6. Power of a quotient ─────────
function powerquotient() {
  const out = [];
  [
    [1, 2, 3],
    [3, 4, 2],
    [2, 3, 3],
    [4, 5, 2],
    [7, 2, 2],
    [5, 3, 2],
  ].forEach(([a, b, n]) => {
    const f = frac(a ** n, b ** n);
    out.push(
      P(
        `What is (${a}/${b})${sup(n)}?`,
        fr(f),
        [
          `Power of a quotient: raise the numerator and the denominator to the power ${n}.`,
          `(${a}/${b})${sup(n)} = ${a}${sup(n)}/${b}${sup(n)} = ${a ** n}/${b ** n}${f.d === b ** n && f.n === a ** n ? '' : ` = ${frTxt(f)}`}.`,
        ],
        f.d === 1 ? undefined : 'fraction',
      ),
    );
  });
  [
    [2, 3, 4],
    [3, 4, 2],
    [1, 2, 5],
    [3, 5, 3],
  ].forEach(([a, b, n]) => {
    const f = frac(a ** n, b ** n);
    out.push(
      P(`(${a}/${b})${sup(n)} = p/q in lowest terms. What is p + q?`, f.n + f.d, [
        `Power of a quotient: (${a}/${b})${sup(n)} = ${a ** n}/${b ** n}.`,
        `That fraction is already in lowest terms (${a} and ${b} share no factor), so p + q = ${a ** n} + ${b ** n} = ${f.n + f.d}.`,
      ]),
    );
  });
  [[5], [8], [3], [10]].forEach(([n]) => out.push(E(pw(div(xs, ys), n), asks.fsum)));
  [[2], [3], [4]].forEach(([n]) => out.push(E(pw(div(xs, N(3)), n), asks.fden)));
  // core
  out.push(E(pw(div(mul(N(2), xs), mul(N(3), ys)), 3), asks.fnum));
  out.push(E(pw(div(mul(N(2), xs), mul(N(3), ys)), 3), asks.fden));
  out.push(E(pw(div(mul(N(3), xs), mul(N(2), ys)), 4), asks.fnum));
  out.push(E(pw(div(mul(N(3), xs), mul(N(2), ys)), 4), asks.fden));
  out.push(E(pw(div(mul(N(5), xs), mul(N(2), ys)), 2), asks.fden));
  out.push(E(pw(div(mul(N(4), xs), mul(N(3), ys)), 3), asks.fnum));
  out.push(E(pw(div(xp(2), yp(3)), 4), asks.fsum));
  out.push(E(pw(div(xp(3), yp(2)), 5), asks.fsum));
  out.push(E(pw(div(xp(4), yp(5)), 3), asks.fsum));
  out.push(E(pw(div(xp(2), yp(7)), 2), asks.fsum));
  out.push(E(pw(div(xs, yp(2)), 5), asks.fsum));
  out.push(E(pw(div(xs, yp(3)), 6), asks.fsum));
  out.push(E(pw(div(mul(N(2), xp(2)), ys), 3), asks.fnum));
  out.push(E(pw(div(mul(N(2), xp(2)), ys), 3), asks.fsum));
  [
    [3, 5, 3],
    [4, 3, 4],
    [2, 7, 2],
    [5, 2, 3],
  ].forEach(([a, b, n]) => {
    const f = frac(a ** n, b ** n);
    out.push(
      P(
        `What is (${a}/${b})${sup(n)}?`,
        fr(f),
        [
          `Power of a quotient: raise the numerator and the denominator to the power ${n}.`,
          `(${a}/${b})${sup(n)} = ${a}${sup(n)}/${b}${sup(n)} = ${a ** n}/${b ** n}.`,
        ],
        'fraction',
      ),
    );
  });
  // challenge
  out.push(E(pw(div(mul(xp(3), ys), mul(N(2), yp(2))), 2), asks.fden));
  out.push(E(pw(div(mul(xp(3), ys), mul(N(2), yp(2))), 2), asks.fsum));
  out.push(E(pw(div(mul(N(2), xs, yp(2)), mul(N(3), xp(2), ys)), 3), asks.fnum));
  out.push(E(pw(div(mul(N(2), xs, yp(2)), mul(N(3), xp(2), ys)), 3), asks.fden));
  out.push(
    P(`(x/3)^n = x${sup(4)}/81. What is n?`, 4, [
      `Power of a quotient: (x/3)^n = x^n/3^n.`,
      `The power of x gives n = 4, and 3⁴ = 81 agrees.`,
    ]),
  );
  out.push(
    P(`(2/x)^n = 32/x${sup(5)}. What is n?`, 5, [
      `Power of a quotient: (2/x)^n = 2^n/x^n.`,
      `The power of x gives n = 5, and 2⁵ = 32 agrees.`,
    ]),
  );
  out.push(
    P(`(x/y)^n = x${sup(7)}/y${sup(7)}. What is n?`, 7, [
      `Power of a quotient: (x/y)^n = x^n/y^n.`,
      `Matching x${sup(7)}/y${sup(7)} gives n = 7.`,
    ]),
  );
  out.push(
    P(`(a/3)${sup(3)} = 8/27. What is a?`, 2, [
      `Power of a quotient: (a/3)³ = a³/27.`,
      `So a³ = 8, and a = 2 because 2³ = 8.`,
    ]),
  );
  out.push(
    P(`(2/b)${sup(4)} = 16/81. What is b?`, 3, [
      `Power of a quotient: (2/b)⁴ = 16/b⁴.`,
      `So b⁴ = 81, and b = 3 because 3⁴ = 81.`,
    ]),
  );
  out.push(
    P(`(5/c)${sup(2)} = 25/49. What is c?`, 7, [
      `Power of a quotient: (5/c)² = 25/c².`,
      `So c² = 49, and c = 7 because 7² = 49.`,
    ]),
  );
  // products of quotients
  const pq = (a, b, n, c, d, m) => {
    // (a/b)^n · (c/d)^m as one fraction
    const num = a ** n * c ** m;
    const den = b ** n * d ** m;
    const f = frac(num, den);
    return P(
      `What is (${a}/${b})${sup(n)} · (${c}/${d})${sup(m)}?`,
      fr(f),
      [
        `Power of a quotient: (${a}/${b})${sup(n)} = ${a ** n}/${b ** n} and (${c}/${d})${sup(m)} = ${c ** m}/${d ** m}.`,
        `Multiply the fractions: ${a ** n}/${b ** n} · ${c ** m}/${d ** m} = ${num}/${den}${f.n === num && f.d === den ? '' : ` = ${frTxt(f)}`}.`,
      ],
      f.d === 1 ? undefined : 'fraction',
    );
  };
  out.push(pq(2, 3, 3, 3, 2, 2));
  out.push(pq(3, 2, 2, 2, 3, 3));
  out.push(E(div(pw(div(xp(2), ys), 3), pw(div(xs, yp(2)), 2)), asks.ex('x')));
  out.push(E(div(pw(div(xp(2), ys), 3), pw(div(xs, yp(2)), 2)), asks.ex('y')));
  out.push(E(div(pw(div(xp(3), yp(2)), 2), pw(div(xs, ys), 3)), asks.sum));
  return out;
}

// ───────── 7. The one exponent ─────────
function one() {
  const out = [];
  const sameOne = (b, shown) =>
    P(`What is ${shown}${sup(1)}?`, shown === '(3/4)' ? '3/4' : shown === '0.5' ? '0.5' : b, [
      `A number to the power 1 is the number itself.`,
      `${shown}${sup(1)} = ${shown}.`,
    ]);
  [8, 15, 100].forEach((b) => out.push(sameOne(b, String(b))));
  out.push(
    P(`What is (${MINUS}6)${sup(1)}?`, -6, [
      `A number to the power 1 is the number itself.`,
      `(${MINUS}6)¹ = ${MINUS}6.`,
    ]),
  );
  out.push(
    P(
      `What is (3/4)${sup(1)}?`,
      '3/4',
      [`A number to the power 1 is the number itself.`, `(3/4)¹ = 3/4.`],
      'fraction',
    ),
  );
  out.push(
    P(
      `What is 0.5${sup(1)}?`,
      '0.5',
      [`A number to the power 1 is the number itself.`, `0.5¹ = 0.5.`],
      'decimal',
    ),
  );
  [[6], [2], [10], [1]].forEach(([m]) => out.push(E(mul(xp(m), xs), asks.ex('x'))));
  out.push(E(mul(xs, xp(7)), asks.ex('x')));
  out.push(E(mul(xs, xs, xs), asks.ex('x')));
  out.push(E(mul(xs, xs, xs, xs, xs), asks.ex('x')));
  out.push(E(mul(ys, ys, ys, ys, ys, ys, ys), asks.ex('y')));
  out.push(
    P(`x = x^n. What is n?`, 1, [
      `A variable with no written exponent has exponent 1.`,
      `x = x¹, so n = 1.`,
    ]),
  );
  out.push(
    P(`y = y^n. What is n?`, 1, [
      `A variable with no written exponent has exponent 1.`,
      `y = y¹, so n = 1.`,
    ]),
  );
  out.push(
    P(`7 = 7^n. What is n?`, 1, [
      `A number with no written exponent has exponent 1.`,
      `7 = 7¹, so n = 1.`,
    ]),
  );
  // core
  [[5], [9], [2], [11]].forEach(([m]) => out.push(E(div(xp(m), xs), asks.ex('x'))));
  out.push(E(mul(xs, xp(2), xp(3)), asks.ex('x')));
  out.push(E(mul(ys, yp(4), yp(5)), asks.ex('y')));
  out.push(E(mul(xs, xp(6), xp(7)), asks.ex('x')));
  out.push(E(pw(pw(xs, 1), 5), asks.ex('x')));
  out.push(P(`What is (5${sup(1)})${sup(3)}?`, 125, [`5¹ = 5.`, `5³ = 125.`]));
  out.push(P(`What is (3${sup(1)})${sup(2)}?`, 9, [`3¹ = 3.`, `3² = 9.`]));
  out.push(
    P(`What is 7${sup(1)} · 7${sup(1)} · 7${sup(1)}?`, 343, [
      `7¹ = 7, so the product is 7 · 7 · 7.`,
      `Same base: 7^(1 + 1 + 1) = 7³ = 343.`,
    ]),
  );
  out.push(
    P(`What is 4${sup(1)} · 4${sup(1)}?`, 16, [
      `4¹ = 4, so the product is 4 · 4.`,
      `Same base: 4^(1 + 1) = 4² = 16.`,
    ]),
  );
  out.push(E(mul(N(5), xs, N(3), xp(2)), asks.c));
  out.push(E(mul(N(5), xs, N(3), xp(2)), asks.ex('x')));
  out.push(E(mul(N(7), xs, N(2), xp(5)), asks.cn));
  out.push(E(mul(N(-4), ys, N(3), yp(3)), asks.c));
  out.push(
    P(`x^n · x = x${sup(8)}. What is n?`, 7, [
      `x = x¹, so the exponents add: n + 1 = 8.`,
      `n = 7.`,
    ]),
  );
  out.push(
    P(`y^n · y = y${sup(12)}. What is n?`, 11, [
      `y = y¹, so the exponents add: n + 1 = 12.`,
      `n = 11.`,
    ]),
  );
  // challenge
  out.push(E(mul(xs, xp(2), xp(3), xp(4)), asks.ex('x')));
  out.push(E(pw(mul(xs, xp(3)), 2), asks.ex('x')));
  out.push(E(mul(N(2), xs, N(3), xs, N(4), xs), asks.c));
  out.push(E(mul(N(2), xs, N(3), xs, N(4), xs), asks.cn));
  out.push(
    P(`x^n · x · x${sup(2)} = x${sup(9)}. What is n?`, 6, [
      `x = x¹, so the exponents add: n + 1 + 2 = 9.`,
      `n = 9 − 3 = 6.`,
    ]),
  );
  out.push(
    P(`y^n · y${sup(3)} · y = y${sup(10)}. What is n?`, 6, [
      `y = y¹, so the exponents add: n + 3 + 1 = 10.`,
      `n = 10 − 4 = 6.`,
    ]),
  );
  out.push(E(div(xp(7), mul(xs, xp(2))), asks.ex('x')));
  out.push(E(div(xp(9), mul(xs, xp(3))), asks.ex('x')));
  out.push(E(mul(xs, xp(-3)), asks.ex('x')));
  out.push(E(mul(ys, yp(-5)), asks.ex('y')));
  out.push(E(mul(mul(N(3), xs), mul(N(2), xs)), asks.c));
  out.push(
    P(`What is 5 · 5${sup(2)} · 5${sup(3)}?`, 15625, [
      `5 = 5¹, so the bases match.`,
      `Add the exponents: 5^(1 + 2 + 3) = 5⁶ = 15625.`,
    ]),
  );
  out.push(
    P(`What is 2 · 2 · 2${sup(2)} · 2${sup(3)}?`, 128, [
      `2 = 2¹, so every base is 2.`,
      `Add the exponents: 2^(1 + 1 + 2 + 3) = 2⁷ = 128.`,
    ]),
  );
  out.push(E(mul(mul(xs, ys), mul(xp(2), ys), mul(xs, yp(3))), asks.sum));
  out.push(E(div(xp(9), mul(xs, xp(3), xs)), asks.ex('x')));
  return out;
}

// ───────── 8. The zero exponent ─────────
function zero() {
  const out = [];
  [[3], [9], [10], [100]].forEach(([b]) =>
    out.push(
      P(`What is ${b}${sup(0)}?`, 1, [`Any non-zero base to the power 0 is 1.`, `${b}⁰ = 1.`]),
    ),
  );
  out.push(
    P(`What is (${MINUS}4)${sup(0)}?`, 1, [
      `Any non-zero base to the power 0 is 1, even a negative one.`,
      `(${MINUS}4)⁰ = 1.`,
    ]),
  );
  out.push(
    P(`What is (3/5)${sup(0)}?`, 1, [`Any non-zero base to the power 0 is 1.`, `(3/5)⁰ = 1.`]),
  );
  out.push(
    P(`What is x${sup(0)} when x = 7?`, 1, [
      `Any non-zero base to the power 0 is 1.`,
      `x⁰ = 7⁰ = 1.`,
    ]),
  );
  out.push(
    P(`What is y${sup(0)} when y = ${MINUS}2?`, 1, [
      `Any non-zero base to the power 0 is 1.`,
      `y⁰ = (${MINUS}2)⁰ = 1.`,
    ]),
  );
  [[3], [7]].forEach(([b]) =>
    out.push(
      P(`What is ${MINUS}${b}${sup(0)}?`, -1, [
        `The exponent 0 belongs to ${b}, not to the minus sign.`,
        `${MINUS}${b}⁰ = ${MINUS}(${b}⁰) = ${MINUS}1.`,
      ]),
    ),
  );
  out.push(
    P(`What is ${MINUS}(2)${sup(0)}?`, -1, [
      `Evaluate the power first: (2)⁰ = 1.`,
      `Then apply the minus: ${MINUS}1.`,
    ]),
  );
  [[5], [9], [4], [10], [6]].forEach(([b]) => {
    if (b === 5)
      out.push(P(`What is 5${sup(0)} + 5${sup(1)}?`, 6, [`5⁰ = 1 and 5¹ = 5.`, `1 + 5 = 6.`]));
    if (b === 9) out.push(P(`What is 9${sup(0)} + 9${sup(0)}?`, 2, [`9⁰ = 1.`, `1 + 1 = 2.`]));
    if (b === 4)
      out.push(
        P(`What is 4${sup(0)} + 4${sup(1)} + 4${sup(2)}?`, 21, [
          `4⁰ = 1, 4¹ = 4 and 4² = 16.`,
          `1 + 4 + 16 = 21.`,
        ]),
      );
    if (b === 10)
      out.push(
        P(`What is 10${sup(0)} + 10${sup(1)} + 10${sup(2)}?`, 111, [
          `10⁰ = 1, 10¹ = 10 and 10² = 100.`,
          `1 + 10 + 100 = 111.`,
        ]),
      );
    if (b === 6)
      out.push(P(`What is 6${sup(0)} · 6${sup(2)}?`, 36, [`6⁰ = 1 and 6² = 36.`, `1 · 36 = 36.`]));
  });
  out.push(P(`What is 6${sup(0)} + 6${sup(0)} + 6${sup(0)}?`, 3, [`6⁰ = 1.`, `1 + 1 + 1 = 3.`]));
  out.push(P(`What is 12${sup(0)} ${MINUS} 1?`, 0, [`12⁰ = 1.`, `1 − 1 = 0.`]));
  // core
  out.push(E(mul(N(5), pw(xs, 0)), asks.c));
  out.push(E(mul(N(12), pw(xs, 0)), asks.c));
  out.push(E(mul(N(-3), pw(ys, 0)), asks.c));
  out.push(E(mul(N(8), pw(xs, 0), pw(ys, 0)), asks.c));
  out.push(E(pw(mul(N(5), xs), 0), asks.val));
  out.push(E(pw(mul(N(3), xs, ys), 0), asks.val));
  out.push(E(pw(mul(N(-4), xp(2)), 0), asks.val));
  out.push(E(div(xp(8), xp(8)), asks.ex('x')));
  out.push(E(div(xp(12), xp(12)), asks.ex('x')));
  out.push(
    P(`What is 2x${sup(0)} + 3y${sup(0)} when x = 4 and y = 5?`, 5, [
      `x⁰ = 1 and y⁰ = 1.`,
      `2 · 1 + 3 · 1 = 5.`,
    ]),
  );
  out.push(
    P(`What is 7${sup(0)} ${MINUS} 7${sup(1)}?`, -6, [`7⁰ = 1 and 7¹ = 7.`, `1 − 7 = ${MINUS}6.`]),
  );
  out.push(P(`What is (x${sup(0)})${sup(3)} when x = 9?`, 1, [`x⁰ = 1.`, `1³ = 1.`]));
  out.push(P(`What is 100${sup(0)} + 0${sup(5)}?`, 1, [`100⁰ = 1 and 0⁵ = 0.`, `1 + 0 = 1.`]));
  out.push(
    P(`What is (1/2)${sup(0)} + (1/3)${sup(0)}?`, 2, [
      `Each non-zero base to the power 0 is 1.`,
      `1 + 1 = 2.`,
    ]),
  );
  out.push(
    P(`What is 3${sup(0)} · 4${sup(0)} · 5${sup(0)}?`, 1, [`3⁰ = 4⁰ = 5⁰ = 1.`, `1 · 1 · 1 = 1.`]),
  );
  out.push(
    P(`What is (${MINUS}1)${sup(0)} + (${MINUS}1)${sup(1)} + (${MINUS}1)${sup(2)}?`, 1, [
      `(−1)⁰ = 1, (−1)¹ = −1 and (−1)² = 1.`,
      `1 − 1 + 1 = 1.`,
    ]),
  );
  out.push(
    P(`What is ${MINUS}4${sup(0)} + (${MINUS}4)${sup(0)}?`, 0, [
      `${MINUS}4⁰ = ${MINUS}(4⁰) = ${MINUS}1, while (${MINUS}4)⁰ = 1.`,
      `${MINUS}1 + 1 = 0.`,
    ]),
  );
  // challenge
  out.push(E(mul(pw(mul(N(2), xp(3), ys), 0), N(4)), asks.val));
  out.push(
    P(`What is (2x${sup(3)}y)${sup(0)} + 4x${sup(0)} when x and y are not 0?`, 5, [
      `(2x³y)⁰ = 1 and 4x⁰ = 4 · 1 = 4.`,
      `1 + 4 = 5.`,
    ]),
  );
  out.push(
    P(`What is 5(3x)${sup(0)} ${MINUS} 2x${sup(0)} when x is not 0?`, 3, [
      `(3x)⁰ = 1 and x⁰ = 1.`,
      `5 · 1 − 2 · 1 = 3.`,
    ]),
  );
  out.push(E(mul(xp(3), xp(-3)), asks.ex('x')));
  out.push(E(mul(yp(7), yp(-7)), asks.ex('y')));
  [
    [2, 'n'],
    [5, 'n'],
  ].forEach(([b]) =>
    out.push(P(`${b}^n = 1. What is n?`, 0, [`Only the exponent 0 turns ${b} into 1.`, `n = 0.`])),
  );
  out.push(
    P(`10^(x ${MINUS} 3) = 1. What is x?`, 3, [
      `A power equals 1 only when its exponent is 0.`,
      `x − 3 = 0, so x = 3.`,
    ]),
  );
  out.push(
    P(`3^(2x ${MINUS} 8) = 1. What is x?`, 4, [
      `A power equals 1 only when its exponent is 0.`,
      `2x − 8 = 0, so x = 4.`,
    ]),
  );
  out.push(
    P(`Is 0${sup(0)} defined? Type 1 for yes, 0 for no.`, 0, [
      `The zero exponent rule only works for a non-zero base.`,
      `0⁰ is not defined, so the answer is 0.`,
    ]),
  );
  out.push(
    P(`Is (3${sup(2)} ${MINUS} 9)${sup(0)} defined? Type 1 for yes, 0 for no.`, 0, [
      `3² − 9 = 0, so the base is 0.`,
      `0⁰ is not defined, so the answer is 0.`,
    ]),
  );
  out.push(
    P(`What is (x ${MINUS} 5)${sup(0)} when x = 9?`, 1, [
      `The base is 9 − 5 = 4, which is not 0.`,
      `4⁰ = 1.`,
    ]),
  );
  out.push(
    P(`What is (2${sup(0)} + 3${sup(0)})${sup(2)}?`, 4, [
      `2⁰ = 1 and 3⁰ = 1, so the bracket is 2.`,
      `2² = 4.`,
    ]),
  );
  out.push(
    P(`What is (5${sup(0)} + 1)${sup(3)}?`, 8, [`5⁰ = 1, so the bracket is 1 + 1 = 2.`, `2³ = 8.`]),
  );
  out.push(
    P(`What is 7x${sup(0)} + (7x)${sup(0)} + 7 when x is not 0?`, 15, [
      `7x⁰ = 7 · 1 = 7 and (7x)⁰ = 1.`,
      `7 + 1 + 7 = 15.`,
    ]),
  );
  return out;
}

// ───────── 9. Negative exponents ─────────
function negative() {
  const out = [];
  const recip = (b, n) => {
    return P(
      `What is ${b}${sup(-n)}?`,
      `1/${b ** n}`,
      [
        `Negative exponent: take the reciprocal and make the exponent positive.`,
        `${b}${sup(-n)} = 1/${b}${sup(n)} = 1/${b ** n}.`,
      ],
      'fraction',
    );
  };
  [
    [3, 2],
    [5, 2],
    [2, 4],
    [10, 3],
    [4, 2],
    [6, 2],
  ].forEach(([b, n]) => out.push(recip(b, n)));
  [[7], [2], [9], [11]].forEach(([n]) =>
    out.push(
      P(`x${sup(-n)} = 1/x^n. What is n?`, n, [
        `Negative exponent: take the reciprocal and make the exponent positive.`,
        `x${sup(-n)} = 1/x${sup(n)}, so n = ${n}.`,
      ]),
    ),
  );
  [
    [3, 2, 9],
    [5, 2, 25],
    [2, 4, 16],
  ].forEach(([b, n, v]) =>
    out.push(
      P(`What is 1/${b}${sup(-n)}?`, v, [
        `Negative exponent in the denominator: take the reciprocal and make the exponent positive.`,
        `1/${b}${sup(-n)} = ${b}${sup(n)} = ${v}.`,
      ]),
    ),
  );
  [
    [1, 3, 2, 9],
    [1, 2, 4, 16],
    [1, 5, 2, 25],
  ].forEach(([a, b, n, v]) =>
    out.push(
      P(`What is (${a}/${b})${sup(-n)}?`, v, [
        `Negative exponent: flip the fraction and make the exponent positive.`,
        `(${a}/${b})${sup(-n)} = (${b}/${a})${sup(n)} = ${b ** n}.`,
      ]),
    ),
  );
  out.push(
    P(`What is 1/10${sup(-3)}?`, 1000, [
      `Negative exponent in the denominator: take the reciprocal and make the exponent positive.`,
      `1/10${sup(-3)} = 10³ = 1000.`,
    ]),
  );
  // core
  [
    [2, 3, 2],
    [3, 4, 2],
    [5, 2, 3],
    [3, 5, 2],
  ].forEach(([a, b, n]) => {
    const f = frac(b ** n, a ** n);
    out.push(
      P(
        `What is (${a}/${b})${sup(-n)}?`,
        fr(f),
        [
          `Negative exponent: flip the fraction and make the exponent positive.`,
          `(${a}/${b})${sup(-n)} = (${b}/${a})${sup(n)} = ${b ** n}/${a ** n}.`,
        ],
        'fraction',
      ),
    );
  });
  out.push(
    P(`What is (1/2)${sup(-5)}?`, 32, [
      `Negative exponent: flip the fraction and make the exponent positive.`,
      `(1/2)${sup(-5)} = 2⁵ = 32.`,
    ]),
  );
  [
    [3, 2, 2],
    [5, 4, 4],
    [7, 3, 3],
  ].forEach(([c, n]) =>
    out.push(
      P(`${c}x${sup(-n)} = ${c}/x^m. What is m?`, n, [
        `Negative exponent: only x moves to the denominator, the ${c} stays on top.`,
        `${c}x${sup(-n)} = ${c}/x${sup(n)}, so m = ${n}.`,
      ]),
    ),
  );
  out.push(
    P(
      `What is 2${sup(-1)} + 2${sup(-2)}?`,
      '3/4',
      [`2⁻¹ = 1/2 and 2⁻² = 1/4.`, `1/2 + 1/4 = 3/4.`],
      'fraction',
    ),
  );
  out.push(
    P(
      `What is 3${sup(-1)} + 3${sup(-2)}?`,
      '4/9',
      [`3⁻¹ = 1/3 and 3⁻² = 1/9.`, `1/3 + 1/9 = 3/9 + 1/9 = 4/9.`],
      'fraction',
    ),
  );
  out.push(
    P(
      `What is 5${sup(-1)} + 5${sup(-2)}?`,
      '6/25',
      [`5⁻¹ = 1/5 and 5⁻² = 1/25.`, `1/5 + 1/25 = 5/25 + 1/25 = 6/25.`],
      'fraction',
    ),
  );
  out.push(E(mul(xp(-3), xp(7)), asks.ex('x')));
  out.push(E(mul(yp(-6), yp(2)), asks.ex('y')));
  out.push(E(mul(xp(5), xp(-9)), asks.ex('x')));
  out.push(E(div(xp(-8), xp(-3)), asks.ex('x')));
  out.push(E(div(yp(-2), yp(-9)), asks.ex('y')));
  out.push(E(pw(xp(2), -3), asks.ex('x')));
  out.push(E(pw(yp(4), -2), asks.ex('y')));
  // challenge
  out.push(E(pw(mul(N(2), xs), -3), asks.fden));
  out.push(E(pw(mul(N(3), xs), -2), asks.fden));
  out.push(E(pw(mul(N(5), xs, ys), -2), asks.fden));
  out.push(E(pw(mul(xp(-2), yp(3)), -2), asks.sum));
  out.push(E(pw(mul(xp(-3), yp(-1)), -2), asks.sum));
  out.push(E(pw(mul(xp(4), yp(-2)), -3), asks.sum));
  out.push(E(pw(mul(N(2), xp(-3)), 2), asks.c));
  out.push(E(pw(mul(N(2), xp(-3)), 2), asks.ex('x')));
  out.push(E(pw(mul(N(3), xp(-2), ys), -3), asks.fden));
  out.push(
    P(`What is (2${sup(-3)} · 2${sup(5)})/2${sup(-2)}?`, 16, [
      `Product of powers on top: 2^(${MINUS}3 + 5) = 2².`,
      `Quotient of powers: 2²/2${sup(-2)} = 2^(2 − (${MINUS}2)) = 2⁴.`,
      `2⁴ = 16.`,
    ]),
  );
  out.push(
    P(`What is (5${sup(-2)} · 5${sup(4)})/5${sup(-1)}?`, 125, [
      `Product of powers on top: 5^(${MINUS}2 + 4) = 5².`,
      `Quotient of powers: 5²/5${sup(-1)} = 5^(2 − (${MINUS}1)) = 5³.`,
      `5³ = 125.`,
    ]),
  );
  out.push(
    P(`What is (3${sup(-1)} + 6${sup(-1)})${sup(-1)}?`, 2, [
      `3⁻¹ = 1/3 and 6⁻¹ = 1/6, so the bracket is 1/3 + 1/6 = 1/2.`,
      `(1/2)⁻¹ = 2.`,
    ]),
  );
  out.push(
    P(
      `What is (2${sup(-1)} + 4${sup(-1)})${sup(-1)}?`,
      '4/3',
      [`2⁻¹ = 1/2 and 4⁻¹ = 1/4, so the bracket is 1/2 + 1/4 = 3/4.`, `(3/4)⁻¹ = 4/3.`],
      'fraction',
    ),
  );
  [
    [2, 5],
    [3, 4],
  ].forEach(([b, n]) =>
    out.push(
      P(`${b}^x = 1/${b ** n}. What is x?`, -n, [
        `1/${b ** n} = 1/${b}${sup(n)} = ${b}${sup(-n)}.`,
        `So x = ${MINUS}${n}.`,
      ]),
    ),
  );
  return out;
}

// ───────── 10. Final test ─────────
function finalTest() {
  const out = [];
  // 1–16: two rules together
  out.push(
    P(`What is (2${sup(3)} · 2${sup(4)})/2${sup(5)}?`, 4, [
      `Product of powers on top: 2³ · 2⁴ = 2^(3 + 4) = 2⁷.`,
      `Quotient of powers: 2⁷/2⁵ = 2^(7 − 5) = 2².`,
      `2² = 4.`,
    ]),
  );
  out.push(
    P(`What is (3${sup(2)})${sup(2)} · 3${sup(2)}?`, 729, [
      `Power of a power: (3²)² = 3^(2·2) = 3⁴.`,
      `Product of powers: 3⁴ · 3² = 3^(4 + 2) = 3⁶.`,
      `3⁶ = 729.`,
    ]),
  );
  out.push(E(div(mul(xp(5), xp(3)), xp(4)), asks.ex('x')));
  out.push(E(mul(pw(xp(3), 2), xp(5)), asks.ex('x')));
  out.push(E(div(pw(xp(2), 5), xp(3)), asks.ex('x')));
  out.push(E(pw(mul(N(2), xp(3)), 2), asks.c));
  out.push(E(pw(mul(N(3), xs, ys), 2), asks.sum));
  out.push(E(pw(div(xp(2), yp(3)), 2), asks.fsum));
  out.push(
    P(`What is (2${sup(3)})${sup(2)}/2${sup(4)}?`, 4, [
      `Power of a power: (2³)² = 2⁶.`,
      `Quotient of powers: 2⁶/2⁴ = 2².`,
      `2² = 4.`,
    ]),
  );
  out.push(E(mul(N(2), xs, N(3), xp(4)), asks.cn));
  out.push(E(div(mul(N(8), xp(6)), mul(N(2), xp(2))), asks.cn));
  out.push(E(mul(pw(xp(2), 2), pw(xp(3), 2)), asks.ex('x')));
  out.push(
    P(
      `What is 5${sup(0)} + 2${sup(-1)} + 3${sup(1)}?`,
      '9/2',
      [`5⁰ = 1, 2⁻¹ = 1/2 and 3¹ = 3.`, `1 + 1/2 + 3 = 9/2.`],
      'fraction',
    ),
  );
  out.push(E(mul(xp(6), xp(-4)), asks.ex('x')));
  out.push(
    P(`What is (1/2)${sup(-3)} · 2${sup(-1)}?`, 4, [
      `Negative exponent: (1/2)⁻³ = 2³ = 8.`,
      `8 · 2⁻¹ = 8 · 1/2 = 4.`,
    ]),
  );
  out.push(E(pw(mul(xp(2), ys), 3), asks.sum));
  // 17–34: three rules, two variables
  out.push(E(div(pw(xp(3), 2), mul(xp(2), xs)), asks.ex('x')));
  out.push(E(div(mul(pw(xp(2), 3), xp(5)), pw(xp(4), 2)), asks.ex('x')));
  out.push(E(div(pw(mul(xp(2), ys), 3), mul(xp(4), yp(2))), asks.sum));
  out.push(E(mul(pw(mul(xp(2), yp(3)), 2), mul(xs, ys)), asks.sum));
  out.push(E(div(mul(N(6), xp(5), yp(3)), mul(N(2), xp(2), ys)), asks.c));
  out.push(E(div(mul(N(6), xp(5), yp(3)), mul(N(2), xp(2), ys)), asks.sum));
  out.push(E(pw(div(mul(N(3), xp(2)), ys), 2), asks.fnum));
  out.push(E(pw(div(mul(N(3), xp(2)), ys), 2), asks.fsum));
  out.push(E(div(pw(mul(N(2), xs), 3), mul(N(4), xp(2))), asks.c));
  out.push(E(div(pw(mul(N(2), xs), 3), mul(N(4), xp(2))), asks.ex('x')));
  out.push(E(mul(pw(mul(N(3), xs), 2), pw(mul(N(2), xp(2)), 3)), asks.c));
  out.push(E(mul(pw(mul(N(3), xs), 2), pw(mul(N(2), xp(2)), 3)), asks.ex('x')));
  out.push(E(div(mul(xp(-2), yp(5)), mul(xp(-5), yp(2))), asks.sum));
  out.push(E(pw(mul(xp(-2), yp(3)), -2), asks.ex('x')));
  out.push(E(pw(mul(xp(-2), yp(3)), -2), asks.ex('y')));
  out.push(E(mul(pw(xp(3), -2), xp(8)), asks.ex('x')));
  out.push(E(div(pw(xp(2), -3), pw(xp(-1), 2)), asks.ex('x')));
  out.push(E(mul(pw(mul(N(2), xs, yp(-1)), 3), ys), asks.fden));
  // 35–50: challenge, all the rules
  out.push(E(div(pw(mul(N(2), xp(3), ys), 4), pw(mul(N(2), xp(2), yp(3)), 2)), asks.c));
  out.push(E(div(pw(mul(N(2), xp(3), ys), 4), pw(mul(N(2), xp(2), yp(3)), 2)), asks.sum));
  out.push(E(div(pw(mul(xp(2), yp(3)), 4), pw(mul(xp(5), ys), 2)), asks.sum));
  out.push(E(mul(pw(div(xp(2), ys), 3), pw(div(ys, xs), 2)), asks.sum));
  out.push(E(pw(div(mul(N(2), xp(-1), yp(2)), mul(N(3), xs, yp(-2))), 2), asks.fnum));
  out.push(E(pw(div(mul(N(2), xp(-1), yp(2)), mul(N(3), xs, yp(-2))), 2), asks.fden));
  out.push(E(pw(div(mul(N(2), xp(-1), yp(2)), mul(N(3), xs, yp(-2))), 2), asks.fsum));
  out.push(E(div(mul(pw(xp(3), 2), pw(xp(-4), 2)), xp(-1)), asks.ex('x')));
  out.push(E(div(pw(mul(N(-2), xp(2)), 3), mul(N(4), xp(-1))), asks.c));
  out.push(E(div(pw(mul(N(-2), xp(2)), 3), mul(N(4), xp(-1))), asks.ex('x')));
  out.push(E(mul(pw(mul(xp(2), yp(-1)), 0), pw(xs, 5)), asks.ex('x')));
  out.push(E(div(mul(pw(mul(xp(3), yp(2)), 2), pw(xp(2), 0)), mul(xp(4), yp(-1))), asks.sum));
  out.push(
    P(`What is (2${sup(3)})${sup(2)} · 2${sup(-4)} / (2${sup(2)})${sup(0)}?`, 4, [
      `Power of a power: (2³)² = 2⁶. Zero exponent: (2²)⁰ = 1.`,
      `Product of powers: 2⁶ · 2⁻⁴ = 2^(6 − 4) = 2².`,
      `Dividing by 1 changes nothing: 2² = 4.`,
    ]),
  );
  out.push(
    P(`What is (3${sup(-2)} · 3${sup(5)})${sup(2)} / 3${sup(4)}?`, 9, [
      `Product of powers inside: 3^(${MINUS}2 + 5) = 3³.`,
      `Power of a power: (3³)² = 3⁶.`,
      `Quotient of powers: 3⁶/3⁴ = 3^(6 − 4) = 3².`,
      `3² = 9.`,
    ]),
  );
  out.push(
    P(
      `What is (2/3)${sup(-2)} · (3/2)${sup(2)} · 2${sup(0)}?`,
      '81/16',
      [
        `Negative exponent: (2/3)⁻² = (3/2)² = 9/4.`,
        `Power of a quotient: (3/2)² = 9/4, and 2⁰ = 1.`,
        `9/4 · 9/4 · 1 = 81/16.`,
      ],
      'fraction',
    ),
  );
  out.push(
    P(
      `What is (4${sup(-1)} + 2${sup(-1)})${sup(-2)}?`,
      '16/9',
      [
        `4⁻¹ = 1/4 and 2⁻¹ = 1/2, so the bracket is 1/4 + 1/2 = 3/4.`,
        `Negative exponent: (3/4)⁻² = (4/3)² = 16/9.`,
      ],
      'fraction',
    ),
  );
  return out;
}

module.exports = {
  whatis,
  product,
  quotient,
  powerpower,
  powerproduct,
  powerquotient,
  one,
  zero,
  negative,
  finalTest,
  withAnswer,
  asks,
};
