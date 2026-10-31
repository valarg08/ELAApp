// Problem types for the Quadratics guide. Each returns { q, a, steps, fig? } with a worked solution.
const L = require('./lib.cjs');
const {
  M,
  par,
  minus,
  cx,
  gcd,
  sg,
  A,
  frac,
  fd,
  fa,
  sumStr,
  co,
  poly,
  lin,
  linA,
  vf,
  ff,
  radExpr,
  sqrtParts,
  radTxt,
  yAt,
  fin,
  graph,
} = L;

const T = {};

// ───────── Reading and evaluating ─────────
T.degree = (a, b, c, why) =>
  fin(
    `What is the highest exponent of x in y = ${poly(a, b, c)}?`,
    '2',
    [why ?? 'Look for the largest power of x: x² is the largest.'],
    '2',
  );

T.ev = (a, b, c, x, extra = {}) => {
  const v = yAt(a, b, c, x);
  return fin(
    `Find y when x = ${sg(x)} in y = ${poly(a, b, c)}.`,
    A(v),
    [
      `Replace x with ${sg(x)}. Square first: ${par(x)}² = ${x * x}.`,
      `${a === 1 ? '' : `${sg(a)} × ${x * x} = ${sg(a * x * x)}. `}${b === 0 ? '' : `${sg(b)} × ${par(x)} = ${sg(b * x)}. `}`.trim(),
      [a * x * x, b * x, c].filter((_, i) => i === 0 || (i === 1 ? b !== 0 : c !== 0)).length > 1
        ? `Add: ${sumStr([a * x * x, b * x, c].filter((_, i) => i === 0 || (i === 1 ? b !== 0 : c !== 0)))} = ${sg(v)}.`
        : null,
    ].filter(Boolean),
    sg(v),
    extra,
  );
};

T.coef = (a, b, c, which) => {
  const val = { a, b, c }[which];
  const note = {
    a: 'the number in front of x²',
    b: 'the number in front of x',
    c: 'the constant, with its sign',
  }[which];
  return fin(
    `In y = ${poly(a, b, c)}, what is the value of ${which}? (Standard form is y = ax² + bx + c.)`,
    A(val),
    [`${which} is ${note}.`, `Here it is ${sg(val)}.`],
    sg(val),
  );
};

T.yint = (a, b, c) =>
  fin(
    `At what y-value does y = ${poly(a, b, c)} cross the y-axis?`,
    A(c),
    ['On the y-axis x = 0, so every x-term disappears.', `y = ${sg(c)}, which is c.`],
    sg(c),
  );

T.opens = (a, b, c) =>
  fin(
    `Enter 1 if the parabola y = ${poly(a, b, c)} opens up and −1 if it opens down.`,
    a > 0 ? '1' : '-1',
    [`a = ${sg(a)}.`, a > 0 ? 'a > 0, so it opens up.' : 'a < 0, so it opens down.'],
    a > 0 ? '1' : M + '1',
  );

T.sdiff = (a, b, c, x0, dx) => {
  const xs = [0, 1, 2, 3, 4].map((i) => x0 + i * dx);
  const ys = xs.map((x) => yAt(a, b, c, x));
  const d1 = ys.slice(1).map((v, i) => v - ys[i]);
  const d2 = d1.slice(1).map((v, i) => v - d1[i]);
  return fin(
    `A table has x = ${xs.map(sg).join(', ')} and y = ${ys.map(sg).join(', ')}. The relationship is quadratic. What is its constant second difference?`,
    A(d2[0]),
    [
      `First differences (bottom minus top): ${d1.map(sg).join(', ')}.`,
      `Second differences: ${d2.map(sg).join(', ')}.`,
      'They are all the same, as they must be for a quadratic.',
    ],
    sg(d2[0]),
  );
};

T.nexty = (a, b, c, x0) => {
  const ys = [0, 1, 2, 3].map((i) => yAt(a, b, c, x0 + i));
  const d1 = ys.slice(1).map((v, i) => v - ys[i]);
  const d2 = d1[1] - d1[0];
  const nextD = d1[2] + d2;
  const next = ys[3] + nextD;
  return fin(
    `A quadratic relationship has x = ${[0, 1, 2, 3, 4].map((i) => x0 + i).join(', ')} and its y-values start ${ys.map(sg).join(', ')}. Find y when x = ${x0 + 4}.`,
    A(next),
    [
      `First differences: ${d1.map(sg).join(', ')}. Second difference: ${sg(d2)}.`,
      `The second difference is constant, so the next first difference is ${sg(d1[2])} + ${sg(d2)} = ${sg(nextD)}.`.replace(
        '+ −',
        `${M} `,
      ),
      `Next y: ${sg(ys[3])} + ${sg(nextD)} = ${sg(next)}.`.replace('+ −', `${M} `),
    ],
    sg(next),
  );
};

T.missing = (a, b, c, hide) => {
  const ys = [0, 1, 2, 3, 4].map((x) => yAt(a, b, c, x));
  const shown = ys.map((v, i) => (i === hide ? '?' : sg(v)));
  const d2 = 2 * a;
  return fin(
    `The table is for a quadratic relationship: x = 0, 1, 2, 3, 4 and y = ${shown.join(', ')}. Find the missing y-value.`,
    A(ys[hide]),
    [
      `The second difference of a quadratic is constant, here ${sg(d2)} (from the other values).`,
      'Work from the known differences to the missing value.',
      `Missing y = ${sg(ys[hide])}; check that the second differences all equal ${sg(d2)}.`,
    ],
    sg(ys[hide]),
  );
};

T.findA = (a, b, c) => {
  const ys = [0, 1, 2, 3, 4].map((x) => yAt(a, b, c, x));
  const d1 = ys.slice(1).map((v, i) => v - ys[i]);
  const d2 = d1[1] - d1[0];
  return fin(
    `The table x = 0, 1, 2, 3, 4 and y = ${ys.map(sg).join(', ')} fits y = ax² + bx + c. Find a.`,
    A(a),
    [
      `First differences: ${d1.map(sg).join(', ')}. Second difference: ${sg(d2)}.`,
      `For steps of 1 the second difference is 2a, so a = ${sg(d2)} ÷ 2 = ${sg(a)}.`,
    ],
    sg(a),
  );
};

T.axisPair = (h, d, y0) => {
  const p = h - d;
  const q = h + d;
  const f = frac(p + q, 2);
  return fin(
    `A parabola passes through (${sg(p)}, ${sg(y0)}) and (${sg(q)}, ${sg(y0)}). Find x in the equation x = ? of its axis of symmetry.`,
    fa(f),
    [
      'Two points at the same height are mirror images across the axis of symmetry.',
      `The axis is halfway between them: (${sg(p)} + ${sg(q)}) ÷ 2 = ${fd(f)}.`.replace(
        '+ −',
        `${M} `,
      ),
    ],
    fd(f),
  );
};

T.extreme = (a, b, c, x0, wantMin) => {
  const xs = [0, 1, 2, 3, 4, 5, 6].map((i) => x0 + i);
  const ys = xs.map((x) => yAt(a, b, c, x));
  const v = wantMin ? Math.min(...ys) : Math.max(...ys);
  return fin(
    `A table has x = ${xs.map(sg).join(', ')} and y = ${ys.map(sg).join(', ')}. What is the ${wantMin ? 'minimum' : 'maximum'} y-value of this parabola?`,
    A(v),
    [
      'The vertex is where the y-values turn around, in the middle of the table.',
      `The ${wantMin ? 'smallest' : 'largest'} y in the table is ${sg(v)}.`,
    ],
    sg(v),
  );
};

T.pass = (a, b, c, which) => {
  // y = ax² + bx + c passes through a given point; find the unknown coefficient.
  if (which === 'b') {
    const x = 2;
    const y = yAt(a, b, c, x);
    return fin(
      `The parabola y = ${a === 1 ? '' : a}x² + bx ${c < 0 ? M : '+'} ${Math.abs(c)} passes through (${x}, ${sg(y)}). Find b.`,
      A(b),
      [
        `Put x = ${x} and y = ${sg(y)}: ${sg(y)} = ${a * 4} + ${x}b ${c < 0 ? M : '+'} ${Math.abs(c)}.`.replace(
          '+ −',
          `${M} `,
        ),
        `${x}b = ${sg(y - a * 4 - c)}, so b = ${sg(b)}.`,
      ],
      sg(b),
    );
  }
  const x = 2;
  const y = yAt(a, b, c, x);
  return fin(
    `The parabola y = ax² ${c < 0 ? M : '+'} ${Math.abs(c)} passes through (${x}, ${sg(y)}). Find a.`,
    A(a),
    [
      `Put x = ${x} and y = ${sg(y)}: ${sg(y)} = a(4) ${c < 0 ? M : '+'} ${Math.abs(c)}.`,
      `4a = ${sg(y - c)}, so a = ${sg(a)}.`,
    ],
    sg(a),
  );
};

// ───────── Vertex form ─────────
T.vfRead = (a, h, k, ask) => {
  const eq = `y = ${vf(a, h, k)}`;
  if (ask === 'h')
    return fin(
      `The vertex form is ${eq}. What is the x-coordinate of the vertex?`,
      A(h),
      [
        `Vertex form is y = a(x ${M} h)² + k, so the vertex is (h, k).`,
        `x ${M} h matches ${lin(-h)}, so h = ${sg(h)}.`,
      ],
      sg(h),
      { fig: graph(a, -2 * a * h, a * h * h + k) },
    );
  if (ask === 'k')
    return fin(
      `The vertex form is ${eq}. What is the y-coordinate of the vertex?`,
      A(k),
      [`The vertex is (h, k).`, `k is the number added at the end: ${sg(k)}.`],
      sg(k),
    );
  if (ask === 'axis')
    return fin(
      `The vertex form is ${eq}. Find x in the equation x = ? of the axis of symmetry.`,
      A(h),
      ['The axis of symmetry is the vertical line through the vertex: x = h.', `h = ${sg(h)}.`],
      sg(h),
    );
  return fin(
    `The parabola ${eq} has a ${k > 0 ? 'minimum' : 'minimum'} value. What is it?`,
    A(k),
    [],
    sg(k),
  );
};

T.vfMinMax = (a, h, k) =>
  fin(
    `What is the ${a > 0 ? 'minimum' : 'maximum'} value of y = ${vf(a, h, k)}?`,
    A(k),
    [
      `a = ${sg(a)}, so the parabola opens ${a > 0 ? 'up' : 'down'} and the vertex is the ${a > 0 ? 'lowest' : 'highest'} point.`,
      `The vertex is (${sg(h)}, ${sg(k)}), so the ${a > 0 ? 'minimum' : 'maximum'} value is ${sg(k)}.`,
    ],
    sg(k),
  );

T.vfExpand = (a, h, k, ask) => {
  const b = -2 * a * h;
  const c = a * h * h + k;
  const w = ask === 'b' ? b : c;
  return fin(
    `Write y = ${vf(a, h, k)} in standard form y = ax² + bx + c. Find ${ask}.`,
    A(w),
    [
      `Expand ${h === 0 ? 'x²' : `(${lin(-h)})²`}: ${h === 0 ? 'x²' : `x² ${h > 0 ? M : '+'} ${Math.abs(2 * h)}x + ${h * h}`}.`,
      `Multiply by ${sg(a)} and ${k < 0 ? `subtract ${-k}` : `add ${k}`}: ${poly(a, b, c)}.`,
      `${ask} = ${sg(w)}.`,
    ],
    sg(w),
  );
};

T.vfYint = (a, h, k) => {
  const c = a * h * h + k;
  return fin(
    `Where does y = ${vf(a, h, k)} cross the y-axis? Give the y-value.`,
    A(c),
    [
      'Put x = 0.',
      `${a === 1 ? '' : sg(a)}(${sg(-h)})² ${k < 0 ? M : '+'} ${Math.abs(k)} = ${sg(a * h * h)} ${k < 0 ? M : '+'} ${Math.abs(k)} = ${sg(c)}.`,
    ],
    sg(c),
  );
};

T.vfPoint = (a, h, k, x) => {
  const y = yAt(a, -2 * a * h, a * h * h + k, x);
  return fin(
    `Find y when x = ${sg(x)} on y = ${vf(a, h, k)}.`,
    A(y),
    [
      `x ${M} ${sg(h)} → ${sg(x)} ${h < 0 ? '+' : M} ${Math.abs(h)} = ${sg(x - h)}.`.replace(
        '− 0',
        `${M} 0`,
      ),
      `Square: ${(x - h) ** 2}. Multiply by ${sg(a)}: ${sg(a * (x - h) ** 2)}. Add ${sg(k)}: ${sg(y)}.`,
    ],
    sg(y),
  );
};

T.vfFromVertexPoint = (h, k, x, y) => {
  const a = (y - k) / (x - h) ** 2;
  return fin(
    `A parabola has vertex (${sg(h)}, ${sg(k)}) and passes through (${sg(x)}, ${sg(y)}). Write it as y = a(x ${M} h)² + k. Find a.`,
    A(a),
    [
      `Put h = ${sg(h)}, k = ${sg(k)} and the point into y = a(x ${M} h)² + k: ${sg(y)} = a(${sg(x - h)})² ${k < 0 ? M : '+'} ${Math.abs(k)}.`.replace(
        '+ 0',
        '+ 0',
      ),
      `${sg(y - k)} = ${(x - h) ** 2}a, so a = ${sg(a)}.`,
    ],
    sg(a),
  );
};

T.csConvert = (a, b, c, ask) => {
  // complete the square for ax²+bx+c (b divisible by 2a... b/a even)
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);
  const w = ask === 'h' ? h : k;
  const half = b / (2 * a);
  return fin(
    `Complete the square to write y = ${poly(a, b, c)} as y = a(x ${M} h)² + k. Find ${ask}.`,
    A(w),
    [
      a === 1
        ? `Half of ${sg(b)} is ${sg(half)}, and ${par(half)}² = ${half * half}. Add and subtract ${half * half}.`
        : `Take ${sg(a)} out of the first two terms: ${sg(a)}(x² ${b / a < 0 ? M : '+'} ${Math.abs(b / a)}x) ${c < 0 ? M : '+'} ${Math.abs(c)}. Half of ${sg(b / a)} is ${sg(half)}; ${par(half)}² = ${half * half}.`,
      a === 1
        ? `y = (x² ${b < 0 ? M : '+'} ${Math.abs(b)}x + ${half * half}) ${M} ${half * half} ${c < 0 ? M : '+'} ${Math.abs(c)} = (${lin(half)})² ${k < 0 ? M : '+'} ${Math.abs(k)}.`
        : `Add and subtract ${half * half} inside; the subtracted part leaves the bracket times ${sg(a)}: y = ${sg(a)}(${lin(half)})² ${k < 0 ? M : '+'} ${Math.abs(k)}.`,
      `h = ${sg(h)} and k = ${sg(k)}.`,
    ],
    sg(w),
  );
};

// ───────── Factored form ─────────
T.ffRoot = (a, m, n, which) => {
  const lo = Math.min(m, n);
  const hi = Math.max(m, n);
  const w = which === 'small' ? lo : hi;
  return fin(
    `The parabola y = ${ff(a, m, n)} crosses the x-axis at two points. What is the ${which === 'small' ? 'smaller' : 'larger'} x-intercept?`,
    A(w),
    [
      'An x-intercept has y = 0. A product is 0 when a factor is 0 (zero product rule).',
      `${lin(-m)} = 0 gives x = ${sg(m)}, and ${lin(-n)} = 0 gives x = ${sg(n)}.`,
    ],
    sg(w),
    { fig: graph(a, -a * (m + n), a * m * n) },
  );
};

T.ffAxis = (a, m, n) => {
  const f = frac(m + n, 2);
  return fin(
    `Find x in the equation x = ? of the axis of symmetry of y = ${ff(a, m, n)}.`,
    fa(f),
    [
      `The x-intercepts are ${sg(m)} and ${sg(n)}.`,
      `The axis is halfway between them: (${sg(m)} + ${sg(n)}) ÷ 2 = ${fd(f)}.`.replace(
        '+ −',
        `${M} `,
      ),
    ],
    fd(f),
  );
};

T.ffVertexY = (a, m, n) => {
  const f = frac(m + n, 2);
  const h = (m + n) / 2;
  const k = a * (h - m) * (h - n);
  const kf = frac(a * (m + n - 2 * m) * (m + n - 2 * n), 4);
  return fin(
    `What is the y-coordinate of the vertex of y = ${ff(a, m, n)}?`,
    fa(kf),
    [
      `The x-intercepts are ${sg(m)} and ${sg(n)}, so the vertex is at x = ${fd(f)}.`,
      `Put x = ${fd(f)} into both factors and multiply by ${sg(a)}: ${sg(a)} × (${sg(h - m)}) × (${sg(h - n)}) = ${fd(kf)}.`.replace(
        /\(([^)]*\.[^)]*)\)/g,
        '($1)',
      ),
    ],
    fd(kf),
    { fig: graph(a, -a * (m + n), a * m * n) },
  );
};

T.ffExpand = (a, m, n, ask) => {
  const b = -a * (m + n);
  const c = a * m * n;
  const w = ask === 'b' ? b : c;
  return fin(
    `Expand y = ${ff(a, m, n)} into standard form y = ax² + bx + c. Find ${ask}.`,
    A(w),
    [
      `Multiply the two brackets: (${lin(-m)})(${lin(-n)}) = ${poly(1, -(m + n), m * n)}.`,
      `Multiply by ${sg(a)}: ${poly(a, b, c)}.`,
      `${ask} = ${sg(w)}.`,
    ],
    sg(w),
  );
};

T.ffFromRoots = (a, m, n, x) => {
  const y = a * (x - m) * (x - n);
  return fin(
    `A parabola has x-intercepts ${sg(m)} and ${sg(n)} and passes through (${sg(x)}, ${sg(y)}). It is y = a(x ${m < 0 ? '+' : M} ${Math.abs(m)})(x ${n < 0 ? '+' : M} ${Math.abs(n)}). Find a.`.replace(
      `x ${M} 0`,
      'x',
    ),
    A(a),
    [
      `Put x = ${sg(x)} and y = ${sg(y)} into the factored form: ${sg(y)} = a(${sg(x - m)})(${sg(x - n)}).`,
      `${sg(y)} = ${sg((x - m) * (x - n))}a, so a = ${sg(a)}.`,
    ],
    sg(a),
  );
};

// ───────── Factoring ─────────
T.gcf = (g, p, q) =>
  fin(
    `${poly(g, g * p, 0)} = ${g}x(x ${p < 0 ? M : '+'} k). Find k.`.replace(`${g}x(`, `${g}x(`),
    A(p),
    [
      `Both terms contain ${g}x. Divide ${poly(g, g * p, 0)} by ${g}x.`,
      `x² ÷ x = x, and ${sg(g * p)}x ÷ ${g}x = ${sg(p)}.`,
    ],
    sg(p),
  );

T.factorMonic = (p, q, ask) => {
  const lo = Math.min(p, q);
  const hi = Math.max(p, q);
  const b = p + q;
  const c = p * q;
  const w = ask === 'small' ? lo : hi;
  return fin(
    `Factor ${poly(1, b, c)} as (x + p)(x + q) with p < q (or equal). Find ${ask === 'small' ? 'p' : 'q'}.`,
    A(w),
    [
      `Look for two numbers with product ${sg(c)} and sum ${sg(b)}.`,
      `${sg(lo)} × ${sg(hi)} = ${sg(c)} and ${sg(lo)} + ${sg(hi)} = ${sg(b)}.`.replace(
        '+ −',
        `${M} `,
      ),
      `So it factors as (${lin(lo)})(${lin(hi)}); ${ask === 'small' ? 'p' : 'q'} = ${sg(w)}.`,
    ],
    sg(w),
  );
};

T.factorMonicSum = (p, q) =>
  fin(
    `${poly(1, p + q, p * q)} = (x + p)(x + q). Find p + q.`,
    A(p + q),
    [
      `In (x + p)(x + q) the x-coefficient is p + q.`,
      `Here it is ${sg(p + q)}. (Check: p × q = ${sg(p * q)}.)`,
    ],
    sg(p + q),
  );

T.factorA = (m, p, n, q) => {
  const a = m * n;
  const b = m * q + n * p;
  const c = p * q;
  return fin(
    `${poly(a, b, c)} = (${m === 1 ? '' : m}x + p)(${n === 1 ? '' : n}x + q). Find p + q.`,
    A(p + q),
    [
      `Product a × c = ${a} × ${sg(c)} = ${sg(a * c)}; find two numbers with that product and sum ${sg(b)}: ${sg(m * q)} and ${sg(n * p)}.`.replace(
        '+ −',
        `${M} `,
      ),
      `Split the middle term and group: ${poly(a, m * q, 0)} ${n * p < 0 ? M : '+'} ${cx(Math.abs(n * p))} ${c < 0 ? M : '+'} ${Math.abs(c)}.`,
      `The factors are (${linA(m, p)})(${linA(n, q)}), so p + q = ${sg(p)} + ${sg(q)} = ${sg(p + q)}.`.replace(
        '+ −',
        `${M} `,
      ),
    ],
    sg(p + q),
  );
};

T.diffSq = (r, a = 1) =>
  fin(
    `${poly(a, 0, -a * r * r)} = ${a === 1 ? '' : `${a}`}(x ${M} p)(x + p) with p > 0. Find p.`,
    A(r),
    [
      a === 1
        ? `${r * r} = ${r}², so this is a difference of squares: x² ${M} ${r}².`
        : `Take out ${a}: ${a}(x² ${M} ${r * r}), and ${r * r} = ${r}².`,
      `a² ${M} b² = (a ${M} b)(a + b), so the factors are (x ${M} ${r})(x + ${r}) and p = ${r}.`,
    ],
    String(r),
  );

// ───────── Solving ─────────
T.solveFactor = (p, q, which, rhs = 0, shape = 'plain') => {
  // x² + bx + c = 0 with roots -p, -q (factors (x+p)(x+q))
  const r1 = -p;
  const r2 = -q;
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  const w = which === 'small' ? lo : hi;
  const b = p + q;
  const c = p * q;
  const eq =
    shape === 'move' ? `${poly(1, b, c - rhs)} = ${rhs}`.replace(/^/, '') : `${poly(1, b, c)} = 0`;
  const first =
    shape === 'move' ? `Move everything to one side so it equals 0: ${poly(1, b, c)} = 0.` : null;
  return fin(
    `Solve ${shape === 'move' ? `${poly(1, b, c - rhs === 0 ? c : c - rhs)} = ${sg(-rhs)}`.replace(/^/, '') : eq}. Give the ${which === 'small' ? 'smaller' : 'larger'} solution.`,
    A(w),
    [
      ...(first ? [first] : []),
      `Factor: (${lin(p)})(${lin(q)}) = 0.`,
      `Zero product rule: ${lin(p)} = 0 or ${lin(q)} = 0, so x = ${sg(r1)} or x = ${sg(r2)}.`,
      `The ${which === 'small' ? 'smaller' : 'larger'} one is ${sg(w)}.`,
    ],
    sg(w),
  );
};

T.solveMove = (p, q, which) => {
  // x² + bx = c form, i.e. x² + bx + pq... built from (x+p)(x+q)=0 written as x² + bx = -pq
  const b = p + q;
  const c = p * q;
  const r1 = -p;
  const r2 = -q;
  const w = which === 'small' ? Math.min(r1, r2) : Math.max(r1, r2);
  return fin(
    `Solve ${poly(1, b, 0)} = ${sg(-c)}. Give the ${which === 'small' ? 'smaller' : 'larger'} solution.`,
    A(w),
    [
      `Set one side to 0 first: ${c < 0 ? `subtract ${-c}` : `add ${c}`} on both sides to get ${poly(1, b, c)} = 0.`,
      `Factor: (${lin(p)})(${lin(q)}) = 0, so x = ${sg(r1)} or x = ${sg(r2)}.`,
      `The ${which === 'small' ? 'smaller' : 'larger'} solution is ${sg(w)}.`,
    ],
    sg(w),
  );
};

T.solveCommon = (g, p, q, which) => {
  const b = g * (p + q);
  const c = g * p * q;
  const r1 = -p;
  const r2 = -q;
  const w = which === 'small' ? Math.min(r1, r2) : Math.max(r1, r2);
  return fin(
    `Solve ${poly(g, b, c)} = 0. Give the ${which === 'small' ? 'smaller' : 'larger'} solution.`,
    A(w),
    [
      `Take out the common factor ${g}: ${g}(${poly(1, p + q, p * q)}) = 0, so ${poly(1, p + q, p * q)} = 0.`,
      `Factor: (${lin(p)})(${lin(q)}) = 0, so x = ${sg(r1)} or x = ${sg(r2)}.`,
      `The ${which === 'small' ? 'smaller' : 'larger'} solution is ${sg(w)}.`,
    ],
    sg(w),
  );
};

T.solveA = (m, p, n, q, which) => {
  // (mx+p)(nx+q)=0
  const a = m * n;
  const b = m * q + n * p;
  const c = p * q;
  const r1 = frac(-p, m);
  const r2 = frac(-q, n);
  const [lo, hi] = r1.n / r1.d <= r2.n / r2.d ? [r1, r2] : [r2, r1];
  const w = which === 'small' ? lo : hi;
  return fin(
    `Solve ${poly(a, b, c)} = 0. Give the ${which === 'small' ? 'smaller' : 'larger'} solution.`,
    fa(w),
    [
      `Split the middle term using two numbers with product ${sg(a * c)} and sum ${sg(b)}: ${sg(m * q)} and ${sg(n * p)}.`.replace(
        '+ −',
        `${M} `,
      ),
      `Group and factor: (${linA(m, p)})(${linA(n, q)}) = 0.`,
      `${linA(m, p)} = 0 gives x = ${fd(r1)}, and ${linA(n, q)} = 0 gives x = ${fd(r2)}.`,
      `The ${which === 'small' ? 'smaller' : 'larger'} one is ${fd(w)}.`,
    ],
    fd(w),
  );
};

T.solveProduct = (p, q) =>
  fin(
    `The product of two consecutive positive integers is ${p * (p + 1)}. What is the larger one?`,
    A(p + 1),
    [
      `Let the integers be n and n + 1: n(n + 1) = ${p * (p + 1)}, so n² + n ${M} ${p * (p + 1)} = 0.`,
      `Factor: (n ${M} ${p})(n + ${p + 1}) = 0, so n = ${p} (positive).`,
      `The larger integer is ${p + 1}.`,
    ],
    String(p + 1),
  );

T.solveNumber = (p) =>
  fin(
    `A positive number n satisfies n² = ${p + 2}n ${M} ${p + 1}... Find the larger solution.`,
    '',
    [],
    '',
  );

// ───────── Completing the square ─────────
T.csFill = (b, ask) => {
  const half = b / 2;
  return fin(
    `To make x² ${b < 0 ? M : '+'} ${Math.abs(b)}x a perfect square, add the number ${ask === 'add' ? 'k' : 'k'}. Find k.`,
    A(half * half),
    [
      `Half of ${sg(b)} is ${sg(half)}.`,
      `Square it: ${par(half)}² = ${half * half}.`,
      `x² ${b < 0 ? M : '+'} ${Math.abs(b)}x + ${half * half} = (${lin(half)})².`,
    ],
    String(half * half),
  );
};

T.csSolve = (b, c, which) => {
  // x² + bx + c = 0, b even. roots = -b/2 ± sqrt(b²/4 - c)
  const half = b / 2;
  const D = half * half - c;
  const [s, r] = sqrtParts(D);
  const N = -half;
  const hi = radExpr(N, s, r, 1);
  const lo = radExpr(N, -s, r, 1);
  const root = which === 'small' ? lo : hi;
  const simplified = r === 1;
  if (simplified) {
    const v = which === 'small' ? N - s : N + s;
    return fin(
      `Solve ${poly(1, b, c)} = 0 by completing the square. Give the ${which === 'small' ? 'smaller' : 'larger'} solution.`,
      A(v),
      [
        `Move the constant: x² ${b < 0 ? M : '+'} ${Math.abs(b)}x = ${sg(-c)}. Add ${half * half} to both sides.`,
        `(${lin(half)})² = ${sg(D)}.`.replace(`= ${sg(D)}`, `= ${D}`),
        `Take square roots: ${lin(half)} = ±${s}, so x = ${sg(N)} ± ${s}.`,
        `The ${which === 'small' ? 'smaller' : 'larger'} solution is ${sg(v)}.`,
      ],
      sg(v),
    );
  }
  const display =
    which === 'small' ? `${sg(N)} ${M} ${radTxt(s, r)}` : `${sg(N)} + ${radTxt(s, r)}`;
  const ans = which === 'small' ? `${N}-${s}*sqrt(${r})` : `${N}+${s}*sqrt(${r})`;
  return fin(
    `Solve ${poly(1, b, c)} = 0 by completing the square. Give the ${which === 'small' ? 'smaller' : 'larger'} solution in exact form.`,
    ans,
    [
      `Move the constant: x² ${b < 0 ? M : '+'} ${Math.abs(b)}x = ${sg(-c)}. Add ${half * half} to both sides.`,
      `(${lin(half)})² = ${D}.`,
      `Take square roots: ${lin(half)} = ±√${D}${s === 1 ? '' : ` = ±${radTxt(s, r)}`}, so x = ${sg(N)} ± ${radTxt(s, r)}.`,
      `The ${which === 'small' ? 'smaller' : 'larger'} solution is ${display}.`,
    ],
    display,
    { form: 'radical' },
  );
};

// ───────── Quadratic formula ─────────
T.formula = (a, b, c, which) => {
  const D = b * b - 4 * a * c;
  const [s, r] = sqrtParts(D);
  const nums = [
    `a = ${sg(a)}, b = ${sg(b)}, c = ${sg(c)}.`,
    `b² ${M} 4ac = ${b * b} ${minus(4 * a * c)} = ${D}.`,
  ];
  const N = a > 0 ? -b : b;
  const d = Math.abs(2 * a);
  const sign = which === 'small' ? -1 : 1;
  if (r === 1) {
    const hi = (-b + s) / (2 * a);
    const lo = (-b - s) / (2 * a);
    const f1 = frac(-b + s, 2 * a);
    const f2 = frac(-b - s, 2 * a);
    const arr = [f1, f2].toSorted((x, y) => x.n / x.d - y.n / y.d);
    const w = which === 'small' ? arr[0] : arr[1];
    return fin(
      `Use the quadratic formula to solve ${poly(a, b, c)} = 0. Give the ${which === 'small' ? 'smaller' : 'larger'} solution.`,
      fa(w),
      [
        ...nums,
        `√${D} = ${s}, so x = (${sg(-b)} ± ${s}) ÷ ${sg(2 * a)}.`.replace('(-', '(−'),
        `x = ${fd(f1)} or x = ${fd(f2)}.`,
        `The ${which === 'small' ? 'smaller' : 'larger'} solution is ${fd(w)}.`,
      ],
      fd(w),
    );
  }
  const pick = which === 'small' ? radExpr(N, -s, r, d) : radExpr(N, s, r, d);
  const reduced = radExpr(N, s, r, d);
  return fin(
    `Use the quadratic formula to solve ${poly(a, b, c)} = 0. Give the ${which === 'small' ? 'smaller' : 'larger'} solution in exact form.`,
    pick.ans,
    [
      ...nums,
      `√${D}${s === 1 ? '' : ` = ${radTxt(s, r)}`}, so x = (${sg(-b)} ± ${radTxt(s, r)}) ÷ ${sg(2 * a)}.`,
      `Simplify by dividing every term by their common factor.`,
      `The ${which === 'small' ? 'smaller' : 'larger'} solution is ${pick.txt}.`,
    ],
    pick.txt,
    { form: 'radical' },
  );
};

// ───────── Discriminant ─────────
T.disc = (a, b, c) => {
  const D = b * b - 4 * a * c;
  return fin(
    `Find the discriminant b² ${M} 4ac of ${poly(a, b, c)} = 0.`,
    A(D),
    [
      `a = ${sg(a)}, b = ${sg(b)}, c = ${sg(c)}.`,
      `b² = ${b * b} and 4ac = ${sg(4 * a * c)}.`,
      `${b * b} ${minus(4 * a * c)} = ${sg(D)}.`,
    ],
    sg(D),
  );
};

T.discCount = (a, b, c) => {
  const D = b * b - 4 * a * c;
  const n = D > 0 ? 2 : D === 0 ? 1 : 0;
  return fin(
    `How many real solutions does ${poly(a, b, c)} = 0 have? (Enter 0, 1 or 2.)`,
    String(n),
    [
      `b² ${M} 4ac = ${b * b} ${minus(4 * a * c)} = ${sg(D)}.`,
      D > 0
        ? 'Positive: two real solutions.'
        : D === 0
          ? 'Zero: exactly one real solution.'
          : 'Negative: no real solutions.',
    ],
    String(n),
  );
};

T.discK = (b, which) => {
  // x² + bx + k = 0 has exactly one solution: k = b²/4
  const k = (b * b) / 4;
  return fin(
    `For what value of k does x² ${b < 0 ? M : '+'} ${Math.abs(b)}x + k = 0 have exactly one real solution?`,
    A(k),
    [
      `One solution means the discriminant is 0: b² ${M} 4ac = ${b * b} ${M} 4k = 0.`,
      `4k = ${b * b}, so k = ${k}.`,
    ],
    String(k),
  );
};

T.discNoReal = (b) => {
  // x² + bx + k = 0 with no real solutions: smallest integer k  -> k > b²/4
  const k = Math.floor((b * b) / 4) + 1;
  return fin(
    `What is the smallest integer k for which x² ${b < 0 ? M : '+'} ${Math.abs(b)}x + k = 0 has no real solutions?`,
    A(k),
    [
      `No real solutions means b² ${M} 4ac < 0: ${b * b} ${M} 4k < 0.`,
      `4k > ${b * b}, so k > ${(b * b) / 4}.`,
      `The smallest integer above ${(b * b) / 4} is ${k}.`,
    ],
    String(k),
  );
};

T.discRational = (a, b, c) => {
  const D = b * b - 4 * a * c;
  const sq = Math.round(Math.sqrt(D));
  const yes = D >= 0 && sq * sq === D;
  return fin(
    `The discriminant of ${poly(a, b, c)} = 0 is ${sg(D)}. Does the quadratic factor with whole numbers? Enter 1 for yes and 0 for no.`,
    yes ? '1' : '0',
    [
      `A discriminant that is a perfect square means the solutions are rational and the quadratic factors.`,
      yes
        ? `${D} = ${sq}², so it is a perfect square.`
        : `${sg(D)} is not a perfect square, so it does not factor.`,
    ],
    yes ? '1' : '0',
  );
};

T.discType = (a, b, c) => {
  const D = b * b - 4 * a * c;
  const sq = Math.round(Math.sqrt(D));
  const rational = D > 0 && sq * sq === D;
  return fin(
    `Does ${poly(a, b, c)} = 0 have two rational solutions? Enter 1 for yes and 0 for no.`,
    rational ? '1' : '0',
    [
      `b² ${M} 4ac = ${b * b} ${minus(4 * a * c)} = ${sg(D)}.`,
      rational
        ? `${D} = ${sq}² is a perfect square, so both solutions are rational.`
        : D <= 0
          ? `${sg(D)} is not positive, so there are not two real solutions.`
          : `${D} is not a perfect square, so the solutions are irrational.`,
    ],
    rational ? '1' : '0',
  );
};

T.discPos = (b, c) => {
  // x² + bx + c = 0, number of integer k in list... skip
  return null;
};

// ───────── Finding the vertex ─────────
T.vtxX = (a, b, c) => {
  const f = frac(-b, 2 * a);
  return fin(
    `Find the x-coordinate of the vertex of y = ${poly(a, b, c)}.`,
    fa(f),
    ['Use x = −b ÷ 2a.', `x = ${sg(-b)} ÷ ${sg(2 * a)} = ${fd(f)}.`.replace('= −−', '= ')],
    fd(f),
    { fig: graph(a, b, c) },
  );
};

T.vtxY = (a, b, c) => {
  const hx = frac(-b, 2 * a);
  const kf = frac(4 * a * c - b * b, 4 * a);
  return fin(
    `Find the y-coordinate of the vertex of y = ${poly(a, b, c)}.`,
    fa(kf),
    [
      `The vertex has x = ${sg(-b)} ÷ ${sg(2 * a)} = ${fd(hx)}.`,
      `Put it back into the equation: ${co(a) || '1'}(${fd(hx)})² ${b < 0 ? M : '+'} ${Math.abs(b)}(${fd(hx)}) ${c < 0 ? M : '+'} ${Math.abs(c)} = ${fd(kf)}.`
        .replace('1(', '(')
        .replace(/^Put it back into the equation: \(/, 'Put it back into the equation: ('),
    ],
    fd(kf),
  );
};

T.vtxExt = (a, b, c) => {
  const kf = frac(4 * a * c - b * b, 4 * a);
  const hx = frac(-b, 2 * a);
  return fin(
    `What is the ${a > 0 ? 'minimum' : 'maximum'} value of y = ${poly(a, b, c)}?`,
    fa(kf),
    [
      `a = ${sg(a)} so the vertex is the ${a > 0 ? 'lowest' : 'highest'} point.`,
      `Vertex x = ${sg(-b)} ÷ ${sg(2 * a)} = ${fd(hx)}.`,
      `Put it back in: ${a === 1 ? '' : sg(a)}(${fd(hx)})² ${b < 0 ? M : '+'} ${Math.abs(b)}(${fd(hx)}) ${c < 0 ? M : '+'} ${Math.abs(c)} = ${fd(kf)}, the ${a > 0 ? 'minimum' : 'maximum'}.`,
    ],
    fd(kf),
  );
};

T.vtxFromRoots = (a, m, n) => {
  const b = -a * (m + n);
  const c = a * m * n;
  const f = frac(m + n, 2);
  return fin(
    `The parabola y = ${poly(a, b, c)} crosses the x-axis at ${sg(m)} and ${sg(n)}. Find the x-coordinate of its vertex.`,
    fa(f),
    [
      'The vertex is halfway between the x-intercepts.',
      `(${sg(m)} + ${sg(n)}) ÷ 2 = ${fd(f)}.`.replace('+ −', `${M} `),
      `Check with −b ÷ 2a = ${sg(-b)} ÷ ${sg(2 * a)} = ${fd(f)}.`,
    ],
    fd(f),
  );
};

T.vtxK = (a, h, k) =>
  fin(
    `The vertex of y = ${poly(a, -2 * a * h, a * h * h + k)} is at x = ${sg(h)}. Find its y-coordinate.`,
    A(k),
    [
      `Put x = ${sg(h)} into the equation.`,
      `${a === 1 ? '' : sg(a)}(${sg(h)})² ${-2 * a * h < 0 ? M : '+'} ${Math.abs(2 * a * h)}(${sg(h)}) ${a * h * h + k < 0 ? M : '+'} ${Math.abs(a * h * h + k)} = ${sg(k)}.`,
    ],
    sg(k),
  );

T.vtxB = (a, h, c) => {
  const b = -2 * a * h;
  return fin(
    `The parabola y = ${a === 1 ? '' : a}x² + bx ${c < 0 ? M : '+'} ${Math.abs(c)} has its vertex at x = ${sg(h)}. Find b.`,
    A(b),
    ['The vertex is at x = −b ÷ 2a.', `${sg(h)} = −b ÷ ${2 * a}, so b = ${sg(b)}.`],
    sg(b),
  );
};

T.height = (g, v) => {
  // h = -g t² + v t : max height and time
  const t = v / (2 * g);
  const hmax = (v * v) / (4 * g);
  return { t, hmax };
};

module.exports = T;
