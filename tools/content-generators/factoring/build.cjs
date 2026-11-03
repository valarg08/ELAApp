// Builds the Factoring study-guide problem files (psat-design.md). Every answer is computed.
const fs = require('fs');
const path = require('path');
const { poly, sg, frac, fd, sqrtParts, gcd, M } = require('../quadratics/lib.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const STD = 'MA.912.AR.1.7';
const VIDEO = new Set(['1,32,192', '1,-6,-91', '1,9,20', '2,-7,-4', '1,8,4', '1,4,10']);

const keyOf = (a, b, c) => `${a},${b},${c}`;
const banned = (a, b, c) => VIDEO.has(keyOf(a, b, c));
const expr = (a, b, c) => poly(a, b, c);

function fracAns(n, d) {
  const f = frac(n, d);
  return {
    a: f.d === 1 ? String(f.n) : `${f.n}/${f.d}`,
    disp: fd(f),
    form: f.d === 1 ? undefined : 'fraction',
  };
}

function intAns(n) {
  return { a: String(n), disp: sg(n) };
}

/** How to show "square − constant" when the constant may be negative. */
function takeConst(square, c) {
  return c >= 0 ? `${square} − ${c}` : `${square} − (${sg(c)})`;
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

function monic(b, c) {
  if (b % 2 !== 0) return null;
  const H = b / 2;
  const k2 = H * H - c;
  if (k2 <= 0) return null;
  const k = Math.sqrt(k2);
  if (!Number.isInteger(k) || k === 0) return null;
  const lo = H - k;
  const hi = H + k;
  if (lo + hi !== b || lo * hi !== c) throw new Error(`monic check ${b},${c}`);
  return { H, k, k2, lo, hi };
}

function tidyFactor(n) {
  if (n === 0) return 'x';
  return `(x ${n < 0 ? M : '+'} ${Math.abs(n)})`;
}

function monicStepsClean(b, c, info) {
  const { H, k, k2, lo, hi } = info;
  const avgSq = H < 0 ? `(${sg(H)})²` : `${H}²`;
  return [
    `The two numbers add to ${sg(b)}, so their average is ${sg(b)} ÷ 2 = ${sg(H)}.`,
    `They are ${sg(H)} − k and ${sg(H)} + k, and their product is ${sg(c)}.`,
    `${takeConst(avgSq, c)} = ${sg(k2)}, so k² = ${sg(k2)} and k = ${k}.`,
    `The numbers are ${sg(lo)} and ${sg(hi)}.`,
    `Factored form: ${tidyFactor(lo)}${tidyFactor(hi)}.`,
  ];
}

function collect(make, n) {
  const out = [];
  const seen = new Set();
  for (const item of make()) {
    if (!item || seen.has(item.q)) continue;
    seen.add(item.q);
    out.push(item);
    if (out.length === n) return out;
  }
  throw new Error(`only ${out.length} of ${n}`);
}

function band(i) {
  if (i < 8) return 'warm';
  if (i < 17) return 'core';
  return 'challenge';
}

/** Positive average, whole-number distance: the video's first example, with our own quadratics. */
function averageLevel(minH, maxH) {
  const quads = [];
  for (let H = minH; H <= maxH; H += 1) {
    for (let k = 1; k < H; k += 1) {
      const b = 2 * H;
      const c = H * H - k * k;
      if (c <= 0 || banned(1, b, c)) continue;
      quads.push({ b, c });
    }
  }
  return (i) => {
    const { b, c } = quads[i];
    const info = monic(b, c);
    const steps = monicStepsClean(b, c, info);
    const name = expr(1, b, c);
    const kind = band(i);
    if (kind === 'warm')
      return problem(
        `Using the average method on ${name}, what is the average of the two numbers?`,
        intAns(info.H),
        steps.slice(0, 1),
      );
    if (kind === 'core')
      return problem(
        `Using the average method on ${name}, what is k, the distance from the average to each number?`,
        intAns(info.k),
        steps.slice(0, 3),
      );
    return problem(
      `Using the average method on ${name}, what is the smaller of the two numbers?`,
      intAns(info.lo),
      steps,
    );
  };
}

/** Negative average (both numbers negative) or opposite signs when k is past the average. */
function negativeLevel(pairs) {
  return (i) => {
    const { b, c } = pairs[i];
    const info = monic(b, c);
    const steps = monicStepsClean(b, c, info);
    const name = expr(1, b, c);
    const kind = band(i);
    if (kind === 'warm')
      return problem(
        `Using the average method on ${name}, what is the average of the two numbers?`,
        intAns(info.H),
        steps.slice(0, 1),
      );
    if (kind === 'core')
      return problem(
        `Using the average method on ${name}, what is k, the distance from the average to each number?`,
        intAns(info.k),
        steps.slice(0, 3),
      );
    const target = info.lo < 0 && info.hi > 0 ? info.hi : info.lo;
    const ask =
      info.lo < 0 && info.hi > 0
        ? `Using the average method on ${name}, what is the positive one of the two numbers?`
        : `Using the average method on ${name}, what is the smaller of the two numbers?`;
    return problem(ask, intAns(target), steps);
  };
}

function negativePairs(spec) {
  const pairs = [];
  for (const { minH, maxH, kFrom, kTo, opposite } of spec) {
    for (let H = minH; H <= maxH; H += 1) {
      const start = opposite ? Math.abs(H) + 1 : 1;
      const end = opposite ? Math.abs(H) + kTo : Math.min(Math.abs(H) - 1, kTo);
      for (let k = Math.max(start, kFrom); k <= end; k += 1) {
        const b = 2 * H;
        const c = H * H - k * k;
        if (c === 0 || banned(1, b, c)) continue;
        if (!opposite && c <= 0) continue;
        if (opposite && c >= 0) continue;
        pairs.push({ b, c });
      }
    }
  }
  return pairs;
}

function halvesLevel(quads, ask) {
  return (i) => {
    const row = quads[i];
    const { b, c, m } = row;
    const half = fracAns(b, 2);
    const k = fracAns(m, 2);
    const lo = (b - m) / 2;
    const hi = (b + m) / 2;
    if (lo + hi !== b || lo * hi !== c) throw new Error(`halves check ${b},${c}`);
    const name = expr(1, b, c);
    const steps = [
      `The two numbers add to ${sg(b)}, so their average is ${half.disp}.`,
      `They are ${half.disp} − k and ${half.disp} + k, and their product is ${sg(c)}.`,
      `(${half.disp})² − k² = ${sg(c)}. That gives k² = ${fracAns(m * m, 4).disp}, so k = ${k.disp}.`,
      `The numbers are ${sg(lo)} and ${sg(hi)}.`,
      `Factored form: ${tidyFactor(lo)}${tidyFactor(hi)}.`,
    ];
    const kind = ask(i);
    if (kind === 'average')
      return problem(
        `Using the average method on ${name}, what is the average of the two numbers?`,
        half,
        steps.slice(0, 1),
      );
    if (kind === 'k')
      return problem(
        `Using the average method on ${name}, what is k? Write it as a fraction.`,
        k,
        steps.slice(0, 3),
      );
    return problem(
      `Using the average method on ${name}, what is the smaller of the two numbers?`,
      intAns(lo),
      steps,
    );
  };
}

function halvesQuads(minB, maxB, sign) {
  const quads = [];
  for (let b0 = minB; b0 <= maxB; b0 += 2) {
    const b = sign * b0;
    for (let m = 1; m <= 15; m += 2) {
      if ((b * b - m * m) % 4 !== 0) continue;
      const c = (b * b - m * m) / 4;
      if (c === 0 || banned(1, b, c)) continue;
      quads.push({ b, c, m });
    }
  }
  return quads;
}

function leadingRows(as, ps, ns) {
  const rows = [];
  for (const a of as) {
    for (const p of ps) {
      if (p === 0 || gcd(Math.abs(p), a) !== 1) continue;
      for (const n of ns) {
        if (n === 0 || a * n === p) continue;
        const b = a * n + p;
        const c = p * n;
        if (banned(a, b, c)) continue;
        rows.push({ a, b, c, p, n });
      }
    }
  }
  return rows;
}

function leadingLevel(rows) {
  return (i) => {
    const { a, b, c, p, n } = rows[i];
    const name = expr(a, b, c);
    const avg = fracAns(b, 2 * a);
    const bTerm = fracAns(b, a);
    const cTerm = fracAns(c, a);
    const tail = (disp, body) => {
      const neg = disp.startsWith(M);
      return `${neg ? M : '+'} ${neg ? disp.slice(1) : disp}${body}`;
    };
    const steps = [
      `Divide every term by ${a}: x² ${tail(bTerm.disp, 'x')} ${tail(cTerm.disp, '')}.`,
      `The two numbers add to ${fracAns(b, a).disp}, so their average is ${avg.disp}.`,
      `One number is a fraction. Clearing it multiplies that factor by ${a} and gives (${a === 1 ? 'x' : `${a}x`} ${p < 0 ? M : '+'} ${Math.abs(p)}).`,
      `The other factor is ${tidyFactor(n)}.`,
      `Factored form: (${a}x ${p < 0 ? M : '+'} ${Math.abs(p)})${tidyFactor(n)}.`,
    ];
    const kind = band(i);
    if (kind === 'warm')
      return problem(
        `To factor ${name} with the average method, what number do you divide by so that x² has coefficient 1?`,
        intAns(a),
        steps.slice(0, 1),
      );
    if (kind === 'core')
      return problem(
        `After dividing ${name} by ${a}, what is the average of the two numbers?`,
        avg,
        steps.slice(0, 2),
      );
    return problem(
      `Factor ${name} with the average method, then clear the fraction. In the factor (${a}x + e), what is e?`,
      intAns(p),
      steps,
    );
  };
}

function radDisp(coef, rest) {
  if (rest === 1) return String(coef);
  return coef === 1 ? `√${rest}` : `${coef}√${rest}`;
}
function radAns(coef, rest) {
  if (rest === 1) return { a: String(coef), disp: String(coef) };
  const disp = radDisp(coef, rest);
  const a = coef === 1 ? `sqrt(${rest})` : `${coef}*sqrt(${rest})`;
  return { a, disp, form: 'radical' };
}

function irrationalLevel(quads) {
  return (i) => {
    const { b, c, H, k2, coef, rest } = quads[i];
    const name = expr(1, b, c);
    const avgSq = `${H}²`;
    const radical = radAns(coef, rest);
    const steps = [
      `The two numbers add to ${sg(b)}, so their average is ${H}.`,
      `${takeConst(avgSq, c)} = ${k2}, so k² = ${k2}.`,
      `k = √${k2} = ${radical.disp}.`,
      `The factors are (x + ${H} + ${radical.disp})(x + ${H} − ${radical.disp}).`,
    ];
    const kind = band(i);
    if (kind === 'warm')
      return problem(
        `Using the average method on ${name}, what is k²?`,
        intAns(k2),
        steps.slice(0, 2),
      );
    if (kind === 'core')
      return problem(
        `Using the average method on ${name}, write k as a square root in simplest form. What number is under the radical?`,
        intAns(rest),
        steps.slice(0, 3),
      );
    return problem(
      `Using the average method on ${name}, write k in simplest radical form.`,
      radical,
      steps.slice(0, 3),
    );
  };
}

function irrationalQuads(minH, maxH, pools) {
  const quads = [];
  for (let H = minH; H <= maxH; H += 1) {
    for (const k2 of pools) {
      const [coef, rest] = sqrtParts(k2);
      if (rest === 1) continue;
      const c = H * H - k2;
      const b = 2 * H;
      if (banned(1, b, c)) continue;
      quads.push({ b, c, H, k2, coef, rest });
    }
  }
  return quads;
}

function imaginaryLevel(quads, mode) {
  return (i) => {
    const { b, c, H, neg, coef, rest } = quads[i];
    const name = expr(1, b, c);
    const kDisp = rest === 1 ? `${coef === 1 ? '' : coef}i` : `${coef === 1 ? '' : coef}i√${rest}`;
    const steps = [
      `The two numbers add to ${sg(b)}, so their average is ${H}.`,
      `${H}² − ${c} = ${sg(-neg)}, so k² = ${sg(-neg)}.`,
      `k² is negative, so k is not a real number: k = ${kDisp}.`,
      `The factors are (x + ${H} + k)(x + ${H} − k), with that k.`,
    ];
    const kind = band(i);
    if (mode === 'a1' && kind === 'warm')
      return problem(
        `Using the average method on ${name}, what is the average of the two numbers?`,
        intAns(H),
        steps.slice(0, 1),
      );
    if ((mode === 'a1' && kind === 'core') || (mode === 'psat' && kind === 'warm'))
      return problem(
        `Using the average method on ${name}, what is k²?`,
        intAns(-neg),
        steps.slice(0, 2),
      );
    if (mode === 'a1')
      return problem(
        `Using the average method on ${name}, k = i√n in simplest form. What is n?`,
        intAns(rest),
        steps.slice(0, 3),
      );
    if (kind === 'core')
      return problem(
        `Using the average method on ${name}, write k as c·i·√n in simplest form. What is c?`,
        intAns(coef),
        steps.slice(0, 3),
      );
    return problem(
      `Using the average method on ${name}, write k as c·i·√n in simplest form. What is n?`,
      intAns(rest),
      steps.slice(0, 3),
    );
  };
}

function imaginaryQuads(minH, maxH, negs) {
  const quads = [];
  for (let H = minH; H <= maxH; H += 1) {
    for (const neg of negs) {
      const [coef, rest] = sqrtParts(neg);
      const c = H * H + neg;
      const b = 2 * H;
      if (banned(1, b, c)) continue;
      quads.push({ b, c, H, neg, coef, rest });
    }
  }
  return quads;
}

function take(factory, n) {
  const items = [];
  for (let i = 0; i < n; i += 1) items.push(factory(i));
  return items;
}

function buildAverage(minH, maxH) {
  const factory = averageLevel(minH, maxH);
  const probe = [];
  for (let i = 0; i < 80; i += 1) {
    try {
      probe.push(factory(i));
    } catch {
      break;
    }
  }
  if (probe.length < 25) throw new Error(`average ${minH}-${maxH} only ${probe.length}`);
  return probe.slice(0, 25);
}

function buildList(factory, count) {
  if (count < 25) throw new Error(`need 25, have ${count}`);
  return take(factory, 25);
}

const SQUAREY = [8, 12, 18, 20, 24, 27, 28, 32, 40, 44, 45, 48, 50, 52, 54, 63, 72, 75, 80, 96];
const MIXED = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 18, 20, 24, 27, 28, 32];

const sets = {
  average: {
    psat: buildAverage(12, 40),
    a1: buildAverage(3, 14),
  },
  negatives: {
    a1: buildList(
      negativeLevel(negativePairs([{ minH: -14, maxH: -2, kFrom: 1, kTo: 8, opposite: false }])),
      negativePairs([{ minH: -14, maxH: -2, kFrom: 1, kTo: 8, opposite: false }]).length,
    ),
    psat: buildList(
      negativeLevel(negativePairs([{ minH: -18, maxH: -3, kFrom: 1, kTo: 10, opposite: true }])),
      negativePairs([{ minH: -18, maxH: -3, kFrom: 1, kTo: 10, opposite: true }]).length,
    ),
  },
  halves: {
    a1: buildList(
      halvesLevel(halvesQuads(5, 15, 1), (i) => (i < 8 ? 'average' : i < 17 ? 'k' : 'smaller')),
      halvesQuads(5, 15, 1).length,
    ),
    psat: buildList(
      halvesLevel(halvesQuads(17, 31, 1).concat(halvesQuads(5, 21, -1)), (i) =>
        i < 8 ? 'average' : i < 17 ? 'k' : 'smaller',
      ),
      halvesQuads(17, 31, 1).concat(halvesQuads(5, 21, -1)).length,
    ),
  },
  leading: {
    a1: buildList(
      leadingLevel(
        leadingRows(
          [2, 3],
          [-5, -4, -2, -1, 1, 2, 4, 5],
          [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
        ),
      ),
      leadingRows([2, 3], [-5, -4, -2, -1, 1, 2, 4, 5], [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6])
        .length,
    ),
    psat: buildList(
      leadingLevel(
        leadingRows([4, 5, 6], [-7, -5, -3, -1, 1, 3, 5, 7], [-8, -5, -3, -2, 2, 3, 5, 7, 8]),
      ),
      leadingRows([4, 5, 6], [-7, -5, -3, -1, 1, 3, 5, 7], [-8, -5, -3, -2, 2, 3, 5, 7, 8]).length,
    ),
  },
  irrational: {
    a1: buildList(
      irrationalLevel(irrationalQuads(3, 8, MIXED)),
      irrationalQuads(3, 8, MIXED).length,
    ),
    psat: buildList(
      irrationalLevel(irrationalQuads(6, 16, SQUAREY)),
      irrationalQuads(6, 16, SQUAREY).length,
    ),
  },
  imaginary: {
    a1: buildList(
      imaginaryLevel(imaginaryQuads(1, 6, [2, 3, 5, 6, 7, 8, 10, 12]), 'a1'),
      imaginaryQuads(1, 6, [2, 3, 5, 6, 7, 8, 10, 12]).length,
    ),
    psat: buildList(
      imaginaryLevel(imaginaryQuads(3, 12, SQUAREY), 'psat'),
      imaginaryQuads(3, 12, SQUAREY).length,
    ),
  },
};

const ORDER = ['average', 'negatives', 'halves', 'leading', 'irrational', 'imaginary'];

async function main() {
  const { readAnswer, contentValue, hasForm } = await import(
    require('url').pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const problems = [];
  for (const id of ORDER) {
    for (const level of ['a1', 'psat']) {
      const list = sets[id][level];
      if (list.length !== 25) problems.push(`${level}.${id} has ${list.length}`);
      const seen = new Set();
      list.forEach((p, i) => {
        const where = `${level}.${id}#${i + 1}`;
        if (/undefined|NaN|null|\[object/.test(JSON.stringify(p)))
          problems.push(`${where} bad token`);
        if (seen.has(p.q)) problems.push(`${where} repeats`);
        seen.add(p.q);
        if (p.steps.some((s) => s.includes('  ') || s.trim() === ''))
          problems.push(`${where} step spacing`);
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
        if (p.form && r.ok && !hasForm(p.a, p.form))
          problems.push(`${where} form ${p.form} rejects "${p.a}"`);
      });
    }
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
    return;
  }
  const out = (level) =>
    Object.fromEntries(
      ORDER.map((id) => [
        id,
        sets[id][level].map((p) => ({
          q: p.q,
          a: p.a,
          ...(p.form ? { form: p.form } : {}),
          steps: p.steps,
          ...(level === 'a1' ? { std: STD } : {}),
        })),
      ]),
    );
  const dir = path.join(ROOT, 'apps/web/features/math');
  fs.writeFileSync(
    path.join(dir, 'psat-factoring-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Factoring chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const FACTORING_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(out('psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-factoring-algebra1.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Algebra 1 (grade 9) problems per Factoring chapter, 25 each from simple to complex, each tagged\n * MA.912.AR.1.7 (factor polynomial expressions). The code is from a third-party list of the\n * B.E.S.T. Algebra 1 benchmarks; a teacher should check it. Generated, so every answer is computed.\n */\nexport const FACTORING_ALGEBRA1: Record<string, GuideProblem[]> = ${JSON.stringify(out('a1'), null, 1)};\n`,
  );
  console.log('written factoring problems');
}

main();
