// Builds the Inequalities study-guide problem files (psat-design.md). Every answer is computed.
const fs = require('fs');
const path = require('path');
const { sg, frac, fd, gcd } = require('../quadratics/lib.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const M = '−';
const ORDER = [
  'symbols',
  'numberline',
  'linear',
  'or',
  'and',
  'abs',
  'twovar',
  'systems',
  'poly',
  'rational',
];
const STD = {
  symbols: 'MA.912.AR.2.5',
  numberline: 'MA.912.AR.2.5',
  linear: 'MA.912.AR.2.5',
  or: 'MA.912.AR.2.5',
  and: 'MA.912.AR.2.5',
  abs: 'MA.912.AR.2.5',
  twovar: 'MA.912.AR.2.7',
  systems: 'MA.912.AR.2.8',
  poly: 'MA.912.AR.5.4',
  rational: 'MA.912.AR.8.3',
};

const VIDEO = [
  'x + 3 > 7',
  '−2x + 5 ≤ 13',
  '-2x + 5 ≤ 13',
  '5x − 3 > −18',
  '5x - 3 > -18',
  '−2x − 1 > 15',
  '|x − 3| ≤ 5',
  '|x - 3| ≤ 5',
  '|2x − 5|',
  '|2x - 5|',
  '−2x + 3y > 6',
  '-2x + 3y > 6',
  'x³ − 3x² − 25x + 75',
];

const banned = (q) => VIDEO.some((ex) => q.includes(ex));

function intAns(n) {
  return { a: String(n), disp: sg(n) };
}

function fracAns(n, d) {
  const f = frac(n, d);
  return {
    a: f.d === 1 ? String(f.n) : `${f.n}/${f.d}`,
    disp: fd(f),
    form: f.d === 1 ? undefined : 'fraction',
  };
}

function problem(q, ans, steps, extra = {}) {
  return {
    q,
    a: ans.a,
    ...(ans.form ? { form: ans.form } : {}),
    steps: [...steps, `Answer: ${ans.disp}`],
    ...extra,
  };
}

function take(items, n, label) {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    if (!item || seen.has(item.q) || banned(item.q)) continue;
    if (item.steps.some((s) => s.includes('  ') || s.trim() === '')) continue;
    seen.add(item.q);
    out.push(item);
    if (out.length === n) return out;
  }
  throw new Error(`${label}: only ${out.length} of ${n}`);
}

const FLIP = { gt: 'lt', lt: 'gt', ge: 'le', le: 'ge' };
const SYM = { gt: '>', lt: '<', ge: '≥', le: '≤' };
const OPEN = { gt: true, lt: true, ge: false, le: false };
const RIGHT = { gt: true, ge: true, lt: false, le: false };

function ax(a) {
  if (a === 1) return 'x';
  if (a === -1) return `${M}x`;
  return `${sg(a)}x`;
}

function lin(a, b) {
  if (b === 0) return ax(a);
  return `${ax(a)} ${b < 0 ? M : '+'} ${Math.abs(b)}`;
}

function ineq(a, b, op, c) {
  return `${lin(a, b)} ${SYM[op]} ${sg(c)}`;
}

function solveLin(a, b, op, c) {
  const rhs = c - b;
  let n = rhs;
  let d = a;
  let next = op;
  if (d < 0) {
    n = -n;
    d = -d;
    next = FLIP[op];
  }
  const f = frac(n, d);
  return { op: next, n: f.n, d: f.d, bound: f.n / f.d };
}

function holdsLin(x, a, b, op, c) {
  const left = a * x + b;
  if (op === 'gt') return left > c;
  if (op === 'ge') return left >= c;
  if (op === 'lt') return left < c;
  return left <= c;
}

function edgeInt(sol) {
  const { op, bound } = sol;
  if (RIGHT[op]) return OPEN[op] ? Math.floor(bound) + 1 : Math.ceil(bound);
  return OPEN[op] ? Math.ceil(bound) - 1 : Math.floor(bound);
}

function countInts(pred, lo, hi) {
  let n = 0;
  for (let x = lo; x <= hi; x += 1) if (pred(x)) n += 1;
  return n;
}

function numlineFig(bound, open, dir) {
  const pad = 4;
  const min = Math.min(bound - pad, bound);
  const max = Math.max(bound + pad, bound);
  return {
    kind: 'numline',
    min,
    max,
    dots: [{ at: bound, open, label: sg(bound) }],
    ray: { from: bound, dir },
  };
}

function gridLine(m, b, label) {
  const xs = 8;
  const ys = Math.max(8, Math.abs(m) * 8 + Math.abs(b) + 2);
  return {
    kind: 'grid',
    x: [-2, xs],
    y: [-ys, ys],
    fn: [{ m, b, label }],
  };
}

function symbolsLevel(ks) {
  const items = [];
  for (const k of ks) {
    items.push(
      problem(
        `The inequality x > ${sg(k)} is true for which of these: ${sg(k)} or ${sg(k + 1)}? Type the number that works.`,
        intAns(k + 1),
        [
          `x > ${sg(k)} means strictly greater than ${sg(k)}.`,
          `${sg(k)} is equal to ${sg(k)}, so it is not greater.`,
          `${sg(k + 1)} is greater than ${sg(k)}.`,
        ],
      ),
    );
    items.push(
      problem(
        `Is ${sg(k)} a solution of x ≥ ${sg(k)}? Type 1 for yes, 0 for no.`,
        intAns(1),
        [`≥ includes equals, so ${sg(k)} is in the solution set.`],
      ),
    );
    items.push(
      problem(
        `Is ${sg(k)} a solution of x > ${sg(k)}? Type 1 for yes, 0 for no.`,
        intAns(0),
        [`> does not include equals, so ${sg(k)} is not a solution.`],
      ),
    );
    items.push(
      problem(
        `The interval for x ≤ ${sg(k)} has its finite end at what number?`,
        intAns(k),
        [`x ≤ ${sg(k)} is (−∞, ${sg(k)}], so the finite end is ${sg(k)}.`],
      ),
    );
    items.push(
      problem(
        `How many of the integers from ${sg(k - 2)} to ${sg(k + 2)} make x < ${sg(k)} true?`,
        intAns(countInts((x) => x < k, k - 2, k + 2)),
        [
          `x < ${sg(k)} keeps the integers strictly less than ${sg(k)}.`,
          `From ${sg(k - 2)} to ${sg(k + 2)} that is ${sg(k - 2)} and ${sg(k - 1)}.`,
        ],
      ),
    );
  }
  return items;
}

function numberlineLevel(ks) {
  const items = [];
  for (const k of ks) {
    items.push(
      problem(
        `To graph x > ${sg(k)}, is the circle at ${sg(k)} open (type 1) or closed (type 0)?`,
        intAns(1),
        [`> does not include ${sg(k)}, so use an open circle.`],
        { fig: numlineFig(k, true, 1) },
      ),
    );
    items.push(
      problem(
        `To graph x ≥ ${sg(k)}, is the circle at ${sg(k)} open (type 1) or closed (type 0)?`,
        intAns(0),
        [`≥ includes ${sg(k)}, so use a closed circle.`],
        { fig: numlineFig(k, false, 1) },
      ),
    );
    items.push(
      problem(
        `The graph of x ≤ ${sg(k)} is a ray to the left. What is the endpoint?`,
        intAns(k),
        [`x ≤ ${sg(k)} starts at ${sg(k)} and goes toward −∞.`],
        { fig: numlineFig(k, false, -1) },
      ),
    );
    items.push(
      problem(
        `x > ${sg(k)} is shaded to the right. What is the endpoint?`,
        intAns(k),
        [`The ray starts at ${sg(k)} and goes toward +∞.`],
        { fig: numlineFig(k, true, 1) },
      ),
    );
    items.push(
      problem(
        `How many integers from ${sg(k)} to ${sg(k + 6)} are on the graph of x > ${sg(k)}?`,
        intAns(countInts((x) => x > k, k, k + 6)),
        [
          `x > ${sg(k)} keeps integers strictly larger than ${sg(k)}.`,
          `From ${sg(k)} to ${sg(k + 6)} that is ${sg(k + 1)} through ${sg(k + 6)}.`,
        ],
      ),
    );
  }
  return items;
}

function linearItems(as, bs, cs, ops) {
  const items = [];
  for (const a of as) {
    for (const b of bs) {
      for (const c of cs) {
        for (const op of ops) {
          if (a === 0) continue;
          const sol = solveLin(a, b, op, c);
          if (!Number.isFinite(sol.bound)) continue;
          const text = ineq(a, b, op, c);
          const steps = [
            `Start with ${text}.`,
            b === 0
              ? `The constant term is already 0.`
              : `Move ${sg(b)}: ${ax(a)} ${SYM[op]} ${sg(c - b)}.`,
            a < 0
              ? `Divide by ${sg(a)}. Reverse the inequality because the divisor is negative.`
              : a === 1
                ? `x is already isolated.`
                : `Divide by ${sg(a)}. The inequality stays ${SYM[op]}.`,
            `The bound is ${sol.d === 1 ? sg(sol.n) : `${sg(sol.n)}/${sol.d}`}.`,
          ];
          const boundAns = fracAns(sol.n, sol.d);
          items.push(
            problem(`Solve ${text}. What is the boundary number?`, boundAns, steps),
          );
          items.push(
            problem(
              `When graphing the solution of ${text}, is the circle at the bound open (type 1) or closed (type 0)?`,
              intAns(OPEN[sol.op] ? 1 : 0),
              [...steps, OPEN[sol.op] ? 'The inequality is strict, so the circle is open.' : 'Equals is allowed, so the circle is closed.'],
            ),
          );
          const edge = edgeInt(sol);
          if (Number.isInteger(edge) && Math.abs(edge) <= 80) {
            const ask = RIGHT[sol.op]
              ? `Solve ${text}. What is the smallest integer solution?`
              : `Solve ${text}. What is the largest integer solution?`;
            items.push(
              problem(ask, intAns(edge), [
                ...steps,
                RIGHT[sol.op]
                  ? `The solution goes to the right of the bound, so the smallest integer is ${sg(edge)}.`
                  : `The solution goes to the left of the bound, so the largest integer is ${sg(edge)}.`,
              ]),
            );
          }
          const test = sol.bound + (RIGHT[sol.op] ? 1 : -1);
          const t = Math.round(test);
          items.push(
            problem(
              `Is x = ${sg(t)} a solution of ${text}? Type 1 for yes, 0 for no.`,
              intAns(holdsLin(t, a, b, op, c) ? 1 : 0),
              [
                `Substitute ${sg(t)}: ${sg(a * t + b)} ${SYM[op]} ${sg(c)} is ${holdsLin(t, a, b, op, c) ? 'true' : 'false'}.`,
              ],
            ),
          );
        }
      }
    }
  }
  return items;
}

function compoundItems(kind, lefts, rights) {
  const items = [];
  for (const L of lefts) {
    for (const R of rights) {
      const s1 = solveLin(L.a, L.b, L.op, L.c);
      const s2 = solveLin(R.a, R.b, R.op, R.c);
      const t1 = ineq(L.a, L.b, L.op, L.c);
      const t2 = ineq(R.a, R.b, R.op, R.c);
      const word = kind === 'or' ? 'or' : 'and';
      const pred = (x) => {
        const a = holdsLin(x, L.a, L.b, L.op, L.c);
        const b = holdsLin(x, R.a, R.b, R.op, R.c);
        return kind === 'or' ? a || b : a && b;
      };
      const lo = -6;
      const hi = 12;
      const n = countInts(pred, lo, hi);
      items.push(
        problem(
          `Solve ${t1}. In ${t1} ${word} ${t2}, what is this first boundary number?`,
          fracAns(s1.n, s1.d),
          [`Solve each part on its own. ${t1} has bound ${s1.d === 1 ? sg(s1.n) : `${sg(s1.n)}/${s1.d}`}.`],
        ),
      );
      items.push(
        problem(
          `Solve ${t2}. In ${t1} ${word} ${t2}, what is this second boundary number?`,
          fracAns(s2.n, s2.d),
          [`Solve each part on its own. ${t2} has bound ${s2.d === 1 ? sg(s2.n) : `${sg(s2.n)}/${s2.d}`}.`],
        ),
      );
      items.push(
        problem(
          `How many integers from ${sg(lo)} to ${sg(hi)} satisfy ${t1} ${word} ${t2}?`,
          intAns(n),
          [
            kind === 'or'
              ? 'OR keeps a number if it works in either part.'
              : 'AND keeps a number only if it works in both parts.',
            `Count the integers from ${sg(lo)} to ${sg(hi)} that work.`,
          ],
        ),
      );
      const mid = Math.round((s1.bound + s2.bound) / 2);
      items.push(
        problem(
          `Is x = ${sg(mid)} a solution of ${t1} ${word} ${t2}? Type 1 for yes, 0 for no.`,
          intAns(pred(mid) ? 1 : 0),
          [
            `${t1} at ${sg(mid)} is ${holdsLin(mid, L.a, L.b, L.op, L.c) ? 'true' : 'false'}.`,
            `${t2} at ${sg(mid)} is ${holdsLin(mid, R.a, R.b, R.op, R.c) ? 'true' : 'false'}.`,
          ],
        ),
      );
    }
  }
  return items;
}

function absItems(centres, radii, ops) {
  const items = [];
  for (const h of centres) {
    for (const r of radii) {
      if (r <= 0) continue;
      for (const op of ops) {
        const left = h - r;
        const right = h + r;
        const text = `|x ${h < 0 ? '+ ' + -h : h === 0 ? '' : M + ' ' + h}| ${SYM[op]} ${r}`.replace(
          '|x |',
          '|x|',
        );
        const pred = (x) => {
          const d = Math.abs(x - h);
          if (op === 'gt') return d > r;
          if (op === 'ge') return d >= r;
          if (op === 'lt') return d < r;
          return d <= r;
        };
        const absX = h === 0 ? '|x|' : `|x ${h < 0 ? '+ ' + -h : M + ' ' + h}|`;
        items.push(
          problem(
            `For ${text}, what is the centre of the interval or of the two rays?`,
            intAns(h),
            [`${absX} measures distance from ${sg(h)}.`],
          ),
        );
        items.push(
          problem(
            `For ${text}, what is the left critical number?`,
            intAns(left),
            [
              `${text} splits at ${sg(h)} − ${r} and ${sg(h)} + ${r}.`,
              `The left number is ${sg(left)}.`,
            ],
          ),
        );
        items.push(
          problem(
            `For ${text}, what is the right critical number?`,
            intAns(right),
            [
              `${text} splits at ${sg(h)} − ${r} and ${sg(h)} + ${r}.`,
              `The right number is ${sg(right)}.`,
            ],
          ),
        );
        items.push(
          problem(
            `How many integers from ${sg(left - 3)} to ${sg(right + 3)} satisfy ${text}?`,
            intAns(countInts(pred, left - 3, right + 3)),
            [
              RIGHT[op]
                ? 'A greater-than absolute value is an OR: two rays.'
                : 'A less-than absolute value is an AND: a segment.',
              `Count the integers that lie at distance ${RIGHT[op] ? 'at least' : 'at most'} ${r} from ${sg(h)}.`,
            ],
          ),
        );
      }
    }
  }
  return items;
}

function twovarItems(slopes, intercepts, ops) {
  const items = [];
  for (const m of slopes) {
    for (const b of intercepts) {
      for (const op of ops) {
        const yline = `y ${SYM[op]} ${m === 0 ? sg(b) : `${m === 1 ? '' : m === -1 ? M : sg(m)}x ${b < 0 ? M : '+'} ${Math.abs(b)}`.replace(/x \+ 0$/, 'x').replace(/x − 0$/, 'x')}`;
        const label = `y = ${m === 0 ? sg(b) : `${m === 1 ? '' : m === -1 ? M : sg(m)}x ${b === 0 ? '' : `${b < 0 ? M : '+'} ${Math.abs(b)}`}`.trim()}`;
        items.push(
          problem(
            `The boundary of ${yline} has y-intercept at what number?`,
            intAns(b),
            [`When x = 0 the boundary is y = ${sg(b)}.`],
            { fig: gridLine(m, b, label) },
          ),
        );
        if (m !== 0) {
          items.push(
            problem(
              `The boundary of ${yline} has slope equal to what number?`,
              intAns(m),
              [`The slope of y = ${label.slice(4)} is ${sg(m)}.`],
            ),
          );
        }
        const y0 = 0;
        const trueAtOrigin =
          op === 'gt' ? y0 > m * 0 + b : op === 'ge' ? y0 >= m * 0 + b : op === 'lt' ? y0 < m * 0 + b : y0 <= m * 0 + b;
        items.push(
          problem(
            `Is (0, 0) a solution of ${yline}? Type 1 for yes, 0 for no.`,
            intAns(trueAtOrigin ? 1 : 0),
            [`Plug in: 0 ${SYM[op]} ${sg(b)} is ${trueAtOrigin ? 'true' : 'false'}.`],
          ),
        );
        items.push(
          problem(
            `When graphing ${yline}, is the boundary dashed (type 0) or solid (type 1)?`,
            intAns(OPEN[op] ? 0 : 1),
            [OPEN[op] ? 'Strict inequalities use a dashed boundary.' : '≤ and ≥ use a solid boundary.'],
          ),
        );
        const x1 = 2;
        const yBound = m * x1 + b;
        if (Number.isInteger(yBound)) {
          items.push(
            problem(
              `On the boundary of ${yline}, what is y when x = 2?`,
              intAns(yBound),
              [`y = ${sg(m)} · 2 ${b < 0 ? M : '+'} ${Math.abs(b)} = ${sg(yBound)}.`],
            ),
          );
        }
      }
    }
  }
  return items;
}

function systemsItems(pairs) {
  const items = [];
  for (const p of pairs) {
    const t1 = `y ${SYM[p.op1]} ${p.m1 === 0 ? sg(p.b1) : `${p.m1 === 1 ? '' : p.m1 === -1 ? M : sg(p.m1)}x ${p.b1 === 0 ? '' : `${p.b1 < 0 ? M : '+'} ${Math.abs(p.b1)}`}`.trim()}`;
    const t2 = `y ${SYM[p.op2]} ${p.m2 === 0 ? sg(p.b2) : `${p.m2 === 1 ? '' : p.m2 === -1 ? M : sg(p.m2)}x ${p.b2 === 0 ? '' : `${p.b2 < 0 ? M : '+'} ${Math.abs(p.b2)}`}`.trim()}`;
    const in1 = (x, y) =>
      p.op1 === 'gt'
        ? y > p.m1 * x + p.b1
        : p.op1 === 'ge'
          ? y >= p.m1 * x + p.b1
          : p.op1 === 'lt'
            ? y < p.m1 * x + p.b1
            : y <= p.m1 * x + p.b1;
    const in2 = (x, y) =>
      p.op2 === 'gt'
        ? y > p.m2 * x + p.b2
        : p.op2 === 'ge'
          ? y >= p.m2 * x + p.b2
          : p.op2 === 'lt'
            ? y < p.m2 * x + p.b2
            : y <= p.m2 * x + p.b2;
    const both = (x, y) => in1(x, y) && in2(x, y);
    items.push(
      problem(
        `In the system ${t1} and ${t2}, what is the y-intercept of the first boundary?`,
        intAns(p.b1),
        [`The first boundary crosses the y-axis at ${sg(p.b1)}.`],
        {
          fig: {
            kind: 'grid',
            x: [-2, 8],
            y: [-6, 10],
            fn: [
              { m: p.m1, b: p.b1, label: 'first' },
              { m: p.m2, b: p.b2, label: 'second' },
            ],
          },
        },
      ),
    );
    items.push(
      problem(
        `Is (0, 0) in the solution of ${t1} and ${t2}? Type 1 for yes, 0 for no.`,
        intAns(both(0, 0) ? 1 : 0),
        [
          `(0, 0) in the first: ${in1(0, 0) ? 'yes' : 'no'}.`,
          `(0, 0) in the second: ${in2(0, 0) ? 'yes' : 'no'}.`,
        ],
      ),
    );
    const pts = [
      [0, 2],
      [2, 0],
      [2, 4],
      [4, 2],
      [1, 1],
    ];
    const n = pts.filter(([x, y]) => both(x, y)).length;
    items.push(
      problem(
        `How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both ${t1} and ${t2}?`,
        intAns(n),
        ['A point is in the system only when it sits in both shaded regions.', 'Check each listed point.'],
      ),
    );
    items.push(
      problem(
        `In the system ${t1} and ${t2}, what is the y-intercept of the second boundary?`,
        intAns(p.b2),
        [`The second boundary crosses the y-axis at ${sg(p.b2)}.`],
      ),
    );
  }
  return items;
}

function polyVal(roots, x) {
  return roots.reduce((p, r) => p * (x - r), 1);
}

function holdsPoly(v, op) {
  if (op === 'gt') return v > 0;
  if (op === 'ge') return v >= 0;
  if (op === 'lt') return v < 0;
  return v <= 0;
}

function factored(roots) {
  return roots
    .map((r) => {
      if (r === 0) return 'x';
      return `(x ${r < 0 ? '+ ' + -r : M + ' ' + r})`;
    })
    .join('');
}

function polyItems(rootSets, ops) {
  const items = [];
  for (const roots of rootSets) {
    const uniq = [...new Set(roots)].toSorted((a, b) => a - b);
    const name = factored(roots);
    for (const op of ops) {
      const text = `${name} ${SYM[op]} 0`;
      items.push(
        problem(
          `The polynomial in ${text} has a root at what smallest number?`,
          intAns(uniq[0]),
          [`Set each factor to 0. The smallest root is ${sg(uniq[0])}.`],
        ),
      );
      items.push(
        problem(
          `The polynomial in ${text} has a root at what largest number?`,
          intAns(uniq[uniq.length - 1]),
          [`Set each factor to 0. The largest root is ${sg(uniq[uniq.length - 1])}.`],
        ),
      );
      const lo = uniq[0] - 3;
      const hi = uniq[uniq.length - 1] + 3;
      const n = countInts((x) => holdsPoly(polyVal(roots, x), op), lo, hi);
      items.push(
        problem(
          `How many integers from ${sg(lo)} to ${sg(hi)} satisfy ${text}?`,
          intAns(n),
          [
            'The roots split the line into intervals. Test a point in each interval.',
            `Count the integers from ${sg(lo)} to ${sg(hi)} whose sign matches ${SYM[op]} 0.`,
          ],
        ),
      );
      const test = uniq[0] - 1;
      const v = polyVal(roots, test);
      items.push(
        problem(
          `Is x = ${sg(test)} a solution of ${text}? Type 1 for yes, 0 for no.`,
          intAns(holdsPoly(v, op) ? 1 : 0),
          [`At x = ${sg(test)} the product is ${sg(v)}, and ${sg(v)} ${SYM[op]} 0 is ${holdsPoly(v, op) ? 'true' : 'false'}.`],
        ),
      );
    }
  }
  return items;
}

function rationalItems(pairs, ops) {
  const items = [];
  for (const { z, p } of pairs) {
    if (z === p) continue;
    const name = `(x ${z < 0 ? '+ ' + -z : z === 0 ? '' : M + ' ' + z})/(x ${p < 0 ? '+ ' + -p : p === 0 ? '' : M + ' ' + p})`.replace(
      '(x )',
      'x',
    );
    const val = (x) => {
      if (x === p) return null;
      return (x - z) / (x - p);
    };
    const holds = (x, op) => {
      const v = val(x);
      if (v === null) return false;
      return holdsPoly(v, op);
    };
    for (const op of ops) {
      const text = `${name} ${SYM[op]} 0`;
      items.push(
        problem(
          `For ${text}, what x-value makes the denominator 0?`,
          intAns(p),
          [`The denominator is 0 at x = ${sg(p)}. That vertical asymptote is never a solution.`],
        ),
      );
      items.push(
        problem(
          `For ${text}, what x-value makes the numerator 0?`,
          intAns(z),
          [`The numerator is 0 at x = ${sg(z)}. That is a root, included only when equals is allowed.`],
        ),
      );
      const lo = Math.min(z, p) - 4;
      const hi = Math.max(z, p) + 4;
      const n = countInts((x) => holds(x, op), lo, hi);
      items.push(
        problem(
          `How many integers from ${sg(lo)} to ${sg(hi)} satisfy ${text}?`,
          intAns(n),
          [
            `Critical numbers ${sg(z)} and ${sg(p)} split the line.`,
            `${sg(p)} is never included. Count the integers whose value is ${SYM[op]} 0.`,
          ],
        ),
      );
      const test = p + (p > z ? 1 : -1);
      items.push(
        problem(
          `Is x = ${sg(test)} a solution of ${text}? Type 1 for yes, 0 for no.`,
          intAns(holds(test, op) ? 1 : 0),
          [
            test === p
              ? `x = ${sg(p)} makes the denominator 0, so it is not a solution.`
              : `At x = ${sg(test)} the value is ${sg(val(test))}, and that ${SYM[op]} 0 is ${holds(test, op) ? 'true' : 'false'}.`,
          ],
        ),
      );
    }
  }
  return items;
}

const a1 = {
  symbols: take(symbolsLevel([2, 3, 4, 6, 7, 8, 9, 10]), 25, 'a1.symbols'),
  numberline: take(numberlineLevel([-4, -3, -1, 2, 4, 6, 7, 8]), 25, 'a1.numberline'),
  linear: take(
    linearItems([1, 2, 3], [-6, -4, -2, 0, 2, 5], [-4, 0, 6, 8, 12], ['gt', 'ge', 'lt', 'le']),
    25,
    'a1.linear',
  ),
  or: take(
    compoundItems(
      'or',
      [
        { a: 1, b: 0, op: 'gt', c: -2 },
        { a: 1, b: 2, op: 'lt', c: 8 },
        { a: 2, b: -4, op: 'ge', c: 6 },
        { a: 1, b: -1, op: 'le', c: 3 },
        { a: 3, b: 0, op: 'gt', c: 9 },
      ],
      [
        { a: 1, b: 0, op: 'lt', c: 4 },
        { a: 1, b: 3, op: 'gt', c: 9 },
        { a: 2, b: 0, op: 'le', c: 2 },
        { a: -1, b: 0, op: 'gt', c: -6 },
        { a: 1, b: 4, op: 'ge', c: 10 },
      ],
    ),
    25,
    'a1.or',
  ),
  and: take(
    compoundItems(
      'and',
      [
        { a: 1, b: 0, op: 'ge', c: -3 },
        { a: 1, b: 2, op: 'gt', c: 0 },
        { a: 2, b: 0, op: 'le', c: 10 },
        { a: 1, b: -4, op: 'ge', c: 0 },
        { a: 3, b: 0, op: 'lt', c: 12 },
      ],
      [
        { a: 1, b: 0, op: 'lt', c: 5 },
        { a: 1, b: -1, op: 'le', c: 6 },
        { a: 2, b: 2, op: 'gt', c: 0 },
        { a: 1, b: 3, op: 'lt', c: 11 },
        { a: 1, b: 0, op: 'ge', c: 1 },
      ],
    ),
    25,
    'a1.and',
  ),
  abs: take(absItems([0, 1, 2, 4, 6], [2, 3, 4, 5], ['le', 'lt', 'ge']), 25, 'a1.abs'),
  twovar: take(
    twovarItems([1, 2, -1, 0], [-2, 1, 3, 4], ['gt', 'ge', 'lt', 'le']),
    25,
    'a1.twovar',
  ),
  systems: take(
    systemsItems([
      { m1: 1, b1: 2, op1: 'le', m2: -1, b2: 4, op2: 'ge' },
      { m1: 0, b1: 3, op1: 'lt', m2: 1, b2: 0, op2: 'gt' },
      { m1: 2, b1: -1, op1: 'ge', m2: 0, b2: 4, op2: 'le' },
      { m1: -1, b1: 5, op1: 'lt', m2: 1, b2: -2, op2: 'gt' },
      { m1: 1, b1: 0, op1: 'ge', m2: -1, b2: 6, op2: 'le' },
      { m1: 0, b1: 1, op1: 'gt', m2: 2, b2: -3, op2: 'lt' },
      { m1: 1, b1: 3, op1: 'le', m2: 0, b2: 2, op2: 'ge' },
    ]),
    25,
    'a1.systems',
  ),
  poly: take(
    polyItems(
      [
        [ -3, 1 ],
        [ -2, 4 ],
        [ -4, 0 ],
        [ 1, 5 ],
        [ -1, 2, 6 ],
        [ -5, -1, 3 ],
        [ 0, 2, 5 ],
      ],
      ['ge', 'gt', 'le'],
    ),
    25,
    'a1.poly',
  ),
  rational: take(
    rationalItems(
      [
        { z: 2, p: -1 },
        { z: 0, p: 3 },
        { z: 4, p: -2 },
        { z: -3, p: 1 },
        { z: 5, p: 2 },
        { z: -4, p: -1 },
        { z: 1, p: 6 },
      ],
      ['lt', 'le', 'gt'],
    ),
    25,
    'a1.rational',
  ),
};

const psat = {
  symbols: take(symbolsLevel([-7, -6, -2, 11, 12, 13, 15, 20]), 25, 'psat.symbols'),
  numberline: take(numberlineLevel([-8, -6, -5, 9, 10, 12, 14, 16]), 25, 'psat.numberline'),
  linear: take(
    linearItems(
      [-4, -3, -2, 2, 4, 5],
      [-9, -5, 1, 7, 11],
      [-12, -6, 4, 10, 18],
      ['gt', 'ge', 'lt', 'le'],
    ),
    25,
    'psat.linear',
  ),
  or: take(
    compoundItems(
      'or',
      [
        { a: -2, b: 4, op: 'gt', c: 10 },
        { a: 3, b: -6, op: 'le', c: 9 },
        { a: 4, b: 0, op: 'ge', c: 12 },
        { a: -1, b: 5, op: 'lt', c: -3 },
        { a: 5, b: -10, op: 'gt', c: 5 },
      ],
      [
        { a: 2, b: 8, op: 'lt', c: 0 },
        { a: -3, b: 0, op: 'ge', c: 9 },
        { a: 1, b: -7, op: 'le', c: 1 },
        { a: 4, b: 4, op: 'gt', c: 20 },
        { a: -2, b: -2, op: 'lt', c: 8 },
      ],
    ),
    25,
    'psat.or',
  ),
  and: take(
    compoundItems(
      'and',
      [
        { a: -3, b: 6, op: 'le', c: 0 },
        { a: 2, b: -8, op: 'ge', c: 0 },
        { a: 4, b: 0, op: 'lt', c: 20 },
        { a: -1, b: 4, op: 'gt', c: -6 },
        { a: 5, b: 5, op: 'le', c: 30 },
      ],
      [
        { a: 1, b: 0, op: 'gt', c: -4 },
        { a: 3, b: -3, op: 'lt', c: 15 },
        { a: -2, b: 2, op: 'ge', c: -10 },
        { a: 2, b: 6, op: 'le', c: 18 },
        { a: 1, b: -9, op: 'gt', c: -3 },
      ],
    ),
    25,
    'psat.and',
  ),
  abs: take(absItems([-3, -1, 5, 7, 8], [3, 4, 6, 8], ['gt', 'ge', 'le', 'lt']), 25, 'psat.abs'),
  twovar: take(
    twovarItems([3, -2, 4, -3], [-4, -1, 5, 6], ['gt', 'ge', 'lt', 'le']),
    25,
    'psat.twovar',
  ),
  systems: take(
    systemsItems([
      { m1: 2, b1: -3, op1: 'ge', m2: -2, b2: 7, op2: 'le' },
      { m1: -1, b1: 6, op1: 'lt', m2: 3, b2: -4, op2: 'gt' },
      { m1: 0, b1: 5, op1: 'le', m2: 2, b2: -2, op2: 'ge' },
      { m1: 4, b1: 0, op1: 'gt', m2: -1, b2: 8, op2: 'lt' },
      { m1: 1, b1: -5, op1: 'ge', m2: 0, b2: 3, op2: 'le' },
      { m1: -3, b1: 4, op1: 'le', m2: 1, b2: 1, op2: 'gt' },
      { m1: 2, b1: 2, op1: 'lt', m2: -2, b2: 4, op2: 'ge' },
    ]),
    25,
    'psat.systems',
  ),
  poly: take(
    polyItems(
      [
        [ -6, -2, 4 ],
        [ -3, 1, 7 ],
        [ -8, 0, 2 ],
        [ -1, 3, 8 ],
        [ -5, 2, 6 ],
        [ -7, -4, 1 ],
        [ 0, 4, 9 ],
      ],
      ['ge', 'gt', 'le', 'lt'],
    ),
    25,
    'psat.poly',
  ),
  rational: take(
    rationalItems(
      [
        { z: -6, p: 2 },
        { z: 8, p: -4 },
        { z: -2, p: 5 },
        { z: 3, p: -7 },
        { z: 9, p: 1 },
        { z: -5, p: 4 },
        { z: 0, p: -8 },
      ],
      ['lt', 'gt', 'le', 'ge'],
    ),
    25,
    'psat.rational',
  ),
};

async function main() {
  const { readAnswer, contentValue, hasForm } = await import(
    require('url').pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const problems = [];
  for (const id of ORDER) {
    for (const [level, sets] of [
      ['a1', a1],
      ['psat', psat],
    ]) {
      const list = sets[id];
      if (list.length !== 25) problems.push(`${level}.${id} has ${list.length}`);
      const seen = new Set();
      list.forEach((p, i) => {
        const where = `${level}.${id}#${i + 1}`;
        if (/undefined|NaN|null|\[object/.test(JSON.stringify(p))) problems.push(`${where} bad token`);
        if (seen.has(p.q)) problems.push(`${where} repeats`);
        seen.add(p.q);
        if (p.steps.some((s) => s.includes('  ') || s.trim() === '')) problems.push(`${where} step spacing`);
        if (!/^Answer: /.test(p.steps.at(-1))) problems.push(`${where} missing Answer`);
        const r = readAnswer(p.a);
        if (!r.ok) problems.push(`${where} answer "${p.a}" ${r.message}`);
        else {
          try {
            contentValue(p.a);
          } catch (e) {
            problems.push(`${where} value ${e.message}`);
          }
        }
        if (p.form && r.ok && !hasForm(p.a, p.form)) problems.push(`${where} form ${p.form} rejects "${p.a}"`);
      });
    }
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
    return;
  }
  const dump = (sets, level) =>
    Object.fromEntries(
      ORDER.map((id) => [
        id,
        sets[id].map((p) => ({
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
    path.join(dir, 'psat-inequalities-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Inequalities chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const INEQUALITIES_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(dump(psat, 'psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-inequalities-algebra1.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Algebra 1 (grade 9) problems per Inequalities chapter, 25 each from simple to complex, each tagged\n * with a Florida B.E.S.T. benchmark (AR.2.5 one-variable, AR.2.7 two-variable, AR.2.8 systems;\n * polynomial and rational chapters use Algebra 2 codes AR.5.4 and AR.8.3). The codes are from a\n * third-party list; a teacher should check them. Generated, so every answer is computed.\n */\nexport const INEQUALITIES_ALGEBRA1: Record<string, GuideProblem[]> = ${JSON.stringify(dump(a1, 'a1'), null, 1)};\n`,
  );
  console.log('written inequality problems');
}

main();
