// The ten chapters and the final test: 50 problems each, simple to complex
// (1–16 warm-up, 17–34 core, 35–50 challenge). Every problem carries a `_check` that recomputes
// its answer another way (a geometric angle measure, or substituting the solution back).
const L = require('./lib.cjs');
const {
  MINUS,
  ANG,
  sg,
  rng,
  make,
  frac,
  ft,
  ans,
  decAns,
  lin,
  measure,
  geoMeasure,
  REL,
  CODES,
  rel,
  figure,
  INTRO,
  findSteps,
  pairsOf,
} = L;

const near = (x, y) => Math.abs(x - y) < 1e-9;
const P = (q, a, steps, extra = {}) => ({ q, a: String(a), steps, ...extra });
const withForm = (p, f) => ({ ...p, ...(f.form ? { form: f.form } : {}) });

// ───────── building a chapter ─────────
const seen = new Set();
function chapter(name, plan) {
  const R = make(rng(`parallel-lines:${name}`));
  const out = [];
  for (const [count, fn] of plan) {
    let added = 0;
    let tries = 0;
    while (added < count) {
      tries += 1;
      if (tries > 2000) throw new Error(`${name}: could not fill a group of ${count}`);
      const p = fn(R, added);
      if (!p || seen.has(p.q)) continue;
      seen.add(p.q);
      out.push(p);
      added += 1;
    }
  }
  if (out.length !== 50) throw new Error(`${name} has ${out.length}`);
  return out;
}
const times = (n, fn) => [n, fn];

// ───────── transversal problems ─────────
const ANGLE_VALUES = [
  35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 105, 110, 115, 120, 125, 130, 135, 140,
];

/** ∠i is known; find ∠j (directly or through a shared angle) */
function tFind(R, opts = {}) {
  let i;
  let j;
  for (let t = 0; t < 200; t += 1) {
    if (opts.rel) {
      [i, j] = R.pick(pairsOf(opts.rel));
      if (R.int(0, 1)) [i, j] = [j, i];
    } else {
      i = R.int(1, 8);
      j = R.int(1, 8);
      if (i === j) continue;
      if (opts.twoStep && rel(i, j)) continue;
      if (opts.direct && !rel(i, j)) continue;
    }
    break;
  }
  const A = R.pick(ANGLE_VALUES);
  const v = measure(i, A);
  const w = measure(j, A);
  return P(`${INTRO} ${ANG}${i} = ${v}°. What is ${ANG}${j}?`, w, findSteps(i, j, A), {
    fig: figure(A),
    _check: () => near(geoMeasure(i, A), v) && near(geoMeasure(j, A), w),
  });
}

/** ∠i and ∠j are written with x; the pair must be directly related */
function tAlg(R, opts = {}) {
  let i;
  let j;
  let r;
  for (let t = 0; t < 300; t += 1) {
    if (opts.rel) {
      [i, j] = R.pick(pairsOf(opts.rel));
      if (R.int(0, 1)) [i, j] = [j, i];
    } else {
      i = R.int(1, 8);
      j = R.int(1, 8);
    }
    r = rel(i, j);
    if (r && (!opts.eq || REL[r].eq === opts.eq)) break;
    r = null;
  }
  if (!r) return null;
  const A = R.pick(ANGLE_VALUES);
  const vi = measure(i, A);
  const vj = measure(j, A);
  const eq = REL[r].eq;
  for (let t = 0; t < 400; t += 1) {
    const a = R.int(1, 9);
    const c = R.int(1, 9);
    if (eq && a === c) continue;
    const x = R.int(4, 24);
    const b = vi - a * x;
    const d = vj - c * x;
    if (Math.abs(b) > 60 || Math.abs(d) > 60) continue;
    const ask = opts.ask ?? R.pick(['x', 'i', 'j']);
    const ei = lin(a, b);
    const ej = lin(c, d);
    const what = ask === 'x' ? 'What is x?' : `What is ${ANG}${ask === 'i' ? i : j}?`;
    const steps = [
      `${ANG}${i} and ${ANG}${j} are ${REL[r].text}, so ${eq ? 'they are equal' : 'they add up to 180°'}.`,
    ];
    if (eq) {
      steps.push(`${ei} = ${ej}`, `${sg(a - c)}x = ${sg(d - b)}, so x = ${x}.`);
    } else {
      steps.push(
        `(${ei}) + (${ej}) = 180`,
        `${a + c}x ${b + d < 0 ? MINUS : '+'} ${Math.abs(b + d)} = 180, so ${a + c}x = ${180 - b - d} and x = ${x}.`,
      );
    }
    if (ask !== 'x') {
      const [e, k, co, cb] = ask === 'i' ? [ei, i, a, b] : [ej, j, c, d];
      steps.push(
        `${ANG}${k} = ${co}(${x}) ${cb < 0 ? MINUS : '+'} ${Math.abs(cb)} = ${co * x + cb}°.`,
      );
      void e;
    }
    const value = ask === 'x' ? x : ask === 'i' ? vi : vj;
    return P(`${INTRO} ${ANG}${i} = (${ei})° and ${ANG}${j} = (${ej})°. ${what}`, value, steps, {
      fig: figure(A),
      _check: () => {
        const gi = geoMeasure(i, A);
        const gj = geoMeasure(j, A);
        const okRel = eq ? near(gi, gj) : near(gi + gj, 180);
        const okVals = near(a * x + b, gi) && near(c * x + d, gj);
        const asked = ask === 'x' ? x : ask === 'i' ? gi : gj;
        return okRel && okVals && near(asked, value);
      },
    });
  }
  return null;
}

const CODE_LEGEND =
  'Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.';
const RELS = Object.keys(CODES);

function relCode(R, type) {
  const r = type ?? R.pick(RELS);
  let [i, j] = R.pick(pairsOf(r));
  if (R.int(0, 1)) [i, j] = [j, i];
  return P(
    `${INTRO} What is the relationship between ${ANG}${i} and ${ANG}${j}? ${CODE_LEGEND}`,
    CODES[r],
    [
      `Look at where the two angles sit. ${ANG}${i} and ${ANG}${j} are ${REL[r].text}.`,
      `That is code ${CODES[r]}.`,
    ],
    { fig: figure(60), _check: () => rel(i, j) === r },
  );
}

const PARTNER_TEXT = {
  altInterior: 'alternate interior angle',
  altExterior: 'alternate exterior angle',
  corresponding: 'corresponding angle',
  consInterior: 'consecutive interior angle',
  vertical: 'vertical angle',
};
function partner(R, type) {
  const r = type ?? R.pick(Object.keys(PARTNER_TEXT));
  const [i, j0] = R.pick(pairsOf(r));
  const [from, to] = R.int(0, 1) ? [j0, i] : [i, j0];
  return P(
    `${INTRO} Which angle is the ${PARTNER_TEXT[r]} of ${ANG}${from}? Type its number.`,
    to,
    [
      `The ${PARTNER_TEXT[r]} of ${ANG}${from} is the one in the matching position that makes ${REL[r].text}.`,
      `That is ${ANG}${to}.`,
    ],
    {
      fig: figure(60),
      _check: () =>
        rel(from, to) === r &&
        [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => rel(from, k) === r).length === 1,
    },
  );
}

function countEqual(R) {
  const i = R.int(1, 8);
  const A = R.pick(ANGLE_VALUES.filter((v) => v !== 90));
  const v = measure(i, A);
  const same = R.int(0, 1);
  const target = same ? v : 180 - v;
  const n = [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => measure(k, A) === target).length;
  return P(
    `${INTRO} ${ANG}${i} = ${v}°. How many of the eight angles measure ${target}°?`,
    n,
    [
      `The eight angles take only two values: ${v}° and 180° ${MINUS} ${v}° = ${180 - v}°.`,
      `Four angles are ${v}° and four are ${180 - v}°, so ${n} of them measure ${target}°.`,
    ],
    {
      fig: figure(A),
      _check: () =>
        [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => near(geoMeasure(k, A), target)).length === n,
    },
  );
}

function sumOf(R, count) {
  const ks = [];
  while (ks.length < count) {
    const k = R.int(1, 8);
    if (!ks.includes(k)) ks.push(k);
  }
  ks.sort((a, b) => a - b);
  const known = R.int(1, 8);
  const A = R.pick(ANGLE_VALUES);
  const v = measure(known, A);
  const total = ks.reduce((s, k) => s + measure(k, A), 0);
  return P(
    `${INTRO} ${ANG}${known} = ${v}°. What is ${ks.map((k) => `${ANG}${k}`).join(' + ')}?`,
    total,
    [
      `The eight angles are ${v}° or ${180 - v}°: ${ks.map((k) => `${ANG}${k} = ${measure(k, A)}°`).join(', ')}.`,
      `${ks.map((k) => measure(k, A)).join(' + ')} = ${total}.`,
    ],
    {
      fig: figure(A),
      _check: () =>
        near(
          ks.reduce((s, k) => s + geoMeasure(k, A), 0),
          total,
        ),
    },
  );
}

// ───────── complementary, supplementary and angle algebra ─────────
function angleWord(kind, R, ask) {
  // returns a pair problem with expressions; kind: comp, supp, vert, linear
  const total = { comp: 90, supp: 180, linear: 180 }[kind];
  for (let t = 0; t < 400; t += 1) {
    const a = R.int(1, 9);
    const c = R.int(1, 9);
    if (kind === 'vert' && a === c) continue;
    const x = R.int(2, 20);
    const b = R.int(-30, 30);
    let d;
    if (kind === 'vert') d = a * x + b - c * x;
    else d = total - (a + c) * x - b;
    if (Math.abs(d) > 40) continue;
    const vi = a * x + b;
    const vj = c * x + d;
    if (vi <= 0 || vj <= 0 || (total && vi >= total) || (total && vj >= total)) continue;
    const ei = lin(a, b);
    const ej = lin(c, d);
    const names = { comp: ['R', 'S'], supp: ['X', 'Y'], vert: ['P', 'Q'], linear: ['M', 'N'] }[
      kind
    ];
    const intro = {
      comp: `Angles ${names[0]} and ${names[1]} are complementary.`,
      supp: `Angles ${names[0]} and ${names[1]} are supplementary.`,
      vert: 'Two vertical angles are formed when two lines cross.',
      linear: 'Two angles form a linear pair.',
    }[kind];
    const what = ask === 'x' ? 'What is x?' : `What is ${ANG}${names[ask === 'i' ? 0 : 1]}?`;
    const steps = [
      kind === 'vert'
        ? 'Vertical angles are equal.'
        : `${kind === 'comp' ? 'Complementary' : kind === 'supp' ? 'Supplementary' : 'A linear pair is supplementary:'} angles add up to ${total}°.`,
    ];
    if (kind === 'vert') steps.push(`${ei} = ${ej}`, `${sg(a - c)}x = ${sg(d - b)}, so x = ${x}.`);
    else
      steps.push(
        `(${ei}) + (${ej}) = ${total}`,
        `${a + c}x ${b + d < 0 ? MINUS : '+'} ${Math.abs(b + d)} = ${total}, so ${a + c}x = ${total - b - d} and x = ${x}.`,
      );
    if (ask !== 'x') {
      const [co, cb] = ask === 'i' ? [a, b] : [c, d];
      steps.push(
        `${ANG}${names[ask === 'i' ? 0 : 1]} = ${co}(${x}) ${cb < 0 ? MINUS : '+'} ${Math.abs(cb)} = ${co * x + cb}°.`,
      );
    }
    const value = ask === 'x' ? x : ask === 'i' ? vi : vj;
    const label = kind === 'vert' ? 'One angle measures' : '';
    const text =
      kind === 'vert'
        ? `${intro} One measures (${ei})° and the other (${ej})°. ${what.replace(`${ANG}P`, 'the first angle').replace(`${ANG}Q`, 'the second angle')}`
        : kind === 'linear'
          ? `${intro} They measure (${ei})° and (${ej})°. ${what.replace(`${ANG}M`, 'the first angle').replace(`${ANG}N`, 'the second angle')}`
          : `${intro} ${ANG}${names[0]} = (${ei})° and ${ANG}${names[1]} = (${ej})°. ${what}`;
    void label;
    return P(text, value, steps, {
      _check: () =>
        (kind === 'vert' ? a * x + b === c * x + d : a * x + b + c * x + d === total) &&
        value === (ask === 'x' ? x : ask === 'i' ? a * x + b : c * x + d),
    });
  }
  return null;
}

function simpleComp(R, kind, ask) {
  const total = kind === 'comp' ? 90 : 180;
  const v = kind === 'comp' ? R.int(10, 80) : R.int(20, 160);
  if (kind === 'comp' && [30, 35].includes(v)) return null;
  if (ask === 'word') {
    return P(
      `Angles A and B are ${kind === 'comp' ? 'complementary' : 'supplementary'}. ${ANG}A = ${v}°. What is ${ANG}B?`,
      total - v,
      [
        `${kind === 'comp' ? 'Complementary' : 'Supplementary'} angles add up to ${total}°.`,
        `${ANG}B = ${total}° ${MINUS} ${v}° = ${total - v}°.`,
      ],
      { _check: () => v + (total - v) === total },
    );
  }
  return P(
    `What is the ${kind === 'comp' ? 'complement' : 'supplement'} of a ${v}° angle?`,
    total - v,
    [
      `${kind === 'comp' ? 'Complementary' : 'Supplementary'} angles add up to ${total}°.`,
      `${total}° ${MINUS} ${v}° = ${total - v}°.`,
    ],
    { _check: () => v + (total - v) === total },
  );
}

/** the missing angle on a straight line or around a point */
function missingAround(R, n, total) {
  const parts = [];
  let left = total;
  for (let k = 0; k < n; k += 1) {
    const hi = Math.min(left - 10 * (n - k), total / 2);
    const v = R.int(15, Math.max(16, hi));
    parts.push(v);
    left -= v;
  }
  if (left < 10) return null;
  const where = total === 180 ? 'on a straight line' : 'around a point';
  return P(
    `${['Two', 'Three', 'Four', 'Five'][n - 1]} angles ${where} measure ${parts.map((v) => `${v}°`).join(', ')} and x°. What is x?`,
    left,
    [
      `Angles ${where} add up to ${total}°.`,
      `${parts.join(' + ')} + x = ${total}, so x = ${total} ${MINUS} ${parts.reduce((s, v) => s + v, 0)} = ${left}.`,
    ],
    { _check: () => parts.reduce((s, v) => s + v, 0) + left === total },
  );
}

/** adjacent angles inside a right angle, or on a straight line */
function adjacent(R, total, ask) {
  for (let t = 0; t < 400; t += 1) {
    const a = R.int(1, 15);
    const c = R.int(1, 15);
    const x = R.int(2, 12);
    const b = R.int(-20, 20);
    const d = total - (a + c) * x - b;
    if (Math.abs(d) > 30) continue;
    const vi = a * x + b;
    const vj = c * x + d;
    if (vi <= 0 || vj <= 0) continue;
    const ei = lin(a, b);
    const ej = lin(c, d);
    const intro =
      total === 90
        ? `${ANG}ABC is a right angle and D is inside it. ${ANG}ABD = (${ei})° and ${ANG}DBC = (${ej})°.`
        : `A, B and C lie on a straight line and D is off it. ${ANG}ABD = (${ei})° and ${ANG}DBC = (${ej})°.`;
    const askText =
      ask === 'x' ? 'What is x?' : ask === 'i' ? `What is ${ANG}ABD?` : `What is ${ANG}DBC?`;
    const value = ask === 'x' ? x : ask === 'i' ? vi : vj;
    return P(
      `${intro} ${askText}`,
      value,
      [
        total === 90
          ? `${ANG}ABD + ${ANG}DBC = ${ANG}ABC = 90°.`
          : `${ANG}ABD + ${ANG}DBC = 180° because they make a straight line.`,
        `(${ei}) + (${ej}) = ${total}, so ${a + c}x ${b + d < 0 ? MINUS : '+'} ${Math.abs(b + d)} = ${total} and x = ${x}.`,
        ...(ask === 'x'
          ? []
          : [
              `${ask === 'i' ? `${ANG}ABD = ${a}(${x}) ${b < 0 ? MINUS : '+'} ${Math.abs(b)}` : `${ANG}DBC = ${c}(${x}) ${d < 0 ? MINUS : '+'} ${Math.abs(d)}`} = ${value}°.`,
            ]),
      ],
      {
        _check: () =>
          vi + vj === total && value === (ask === 'x' ? x : ask === 'i' ? a * x + b : c * x + d),
      },
    );
  }
  return null;
}

/** two unknowns: a pair of crossing lines */
function crossXY(R, ask) {
  for (let t = 0; t < 300; t += 1) {
    const p = R.int(25, 80);
    const k = R.int(2, Math.min(20, p - 1));
    const a = R.pick([2, 3, 4, 5]);
    const b = R.int(1, 20);
    const xNum = 180 - p - b;
    if (xNum <= 0) continue;
    const x = xNum / a;
    if (!Number.isInteger(x * 2)) continue;
    const y = p - k;
    const value = ask === 'x' ? x : ask === 'y' ? y : x + y;
    return P(
      `Two lines cross. One angle measures ${p}°, the angle vertical to it is (y + ${k})°, and an angle next to it is (${lin(a, b)})°. ${ask === 'x+y' ? 'What is x + y?' : `What is ${ask}?`}`,
      value,
      [
        `Vertical angles are equal: y + ${k} = ${p}, so y = ${y}.`,
        `The angle next to it forms a linear pair with the ${p}° angle: ${p} + (${lin(a, b)}) = 180.`,
        `${a}x = ${180 - p - b}, so x = ${x}.`,
        ...(ask === 'x+y' ? [`x + y = ${x} + ${y} = ${x + y}.`] : []),
      ],
      {
        ...(Number.isInteger(value) ? {} : { form: 'decimal' }),
        _check: () =>
          y + k === p &&
          p + a * x + b === 180 &&
          value === (ask === 'x' ? x : ask === 'y' ? y : x + y),
      },
    );
  }
  return null;
}

/** word-style relationships between an angle and its complement or supplement */
function ratioWord(R, kind) {
  if (kind === 'times') {
    // an angle is k times its complement
    const k = R.pick([2, 3, 4, 5, 8]);
    const ang = (90 * k) / (k + 1);
    if (!Number.isInteger(ang)) return null;
    return P(
      `An angle is ${k} times its complement. What is the angle?`,
      ang,
      [
        `Call the angle x, so its complement is 90 ${MINUS} x.`,
        `x = ${k}(90 ${MINUS} x), so ${k + 1}x = ${90 * k}.`,
        `x = ${ang}.`,
      ],
      {
        _check: () => ang === k * (90 - ang),
      },
    );
  }
  if (kind === 'more') {
    const m = R.pick([10, 20, 30, 40, 50]);
    const ang = (90 + m) / 2;
    return P(
      `An angle is ${m}° more than its complement. What is the angle?`,
      ang,
      [
        `Call the angle x, so its complement is 90 ${MINUS} x.`,
        `x = (90 ${MINUS} x) + ${m}, so 2x = ${90 + m}.`,
        `x = ${ang}.`,
      ],
      {
        ...(Number.isInteger(ang) ? {} : { form: 'decimal' }),
        _check: () => ang === 90 - ang + m,
      },
    );
  }
  if (kind === 'supp') {
    const k = R.pick([2, 3, 5, 8, 11]);
    const ang = 180 / (k + 1);
    if (!Number.isInteger(ang)) return null;
    return P(
      `The supplement of an angle is ${k} times the angle. What is the angle?`,
      ang,
      [
        `Call the angle x, so its supplement is 180 ${MINUS} x.`,
        `180 ${MINUS} x = ${k}x, so ${k + 1}x = 180.`,
        `x = ${ang}.`,
      ],
      {
        _check: () => 180 - ang === k * ang,
      },
    );
  }
  const [p, q] = R.pick([
    [1, 2],
    [2, 3],
    [1, 4],
    [2, 7],
    [4, 5],
    [3, 7],
    [1, 5],
    [3, 5],
  ]);
  const total = p + q;
  if (90 % total !== 0) return null;
  const larger = (90 / total) * q;
  return P(
    `Two complementary angles are in the ratio ${p} : ${q}. What is the larger angle?`,
    larger,
    [
      `Share 90° in ${p + q} equal parts: 90 ÷ ${total} = ${90 / total}° each.`,
      `The larger angle has ${q} parts: ${q} × ${90 / total} = ${larger}°.`,
    ],
    {
      _check: () => (90 / total) * p + larger === 90,
    },
  );
}

// ───────── polygons and triangles ─────────
const POLY = {
  3: 'triangle',
  4: 'quadrilateral',
  5: 'pentagon',
  6: 'hexagon',
  7: 'heptagon',
  8: 'octagon',
  9: 'nonagon',
  10: 'decagon',
  12: 'dodecagon',
};
const nameOf = (n) => POLY[n] ?? `polygon with ${n} sides`;
const nameSides = (n) => (POLY[n] ? `${POLY[n]} (${n} sides)` : `polygon with ${n} sides`);
const pSum = (n) => (n - 2) * 180;

function polySum(R, n) {
  return P(
    `What is the sum of the interior angles of a ${nameSides(n)}?`,
    pSum(n),
    [
      `Use (n ${MINUS} 2) × 180 with n = ${n}.`,
      `(${n} ${MINUS} 2) × 180 = ${n - 2} × 180 = ${pSum(n)}.`,
    ],
    {
      _check: () => pSum(n) === 180 * (n - 2),
    },
  );
}
function polyEach(R, n) {
  const each = pSum(n) / n;
  if (!Number.isInteger(each * 2)) return null;
  return P(
    `Every angle of a regular ${nameOf(n)} is equal. How big is one angle?`,
    each,
    [
      `The angles add up to (${n} ${MINUS} 2) × 180 = ${pSum(n)}°.`,
      `${pSum(n)} ÷ ${n} = ${each}°.`,
    ],
    {
      ...(Number.isInteger(each) ? {} : { form: 'decimal' }),
      _check: () => each * n === pSum(n),
    },
  );
}
function polyMissing(R, n) {
  const total = pSum(n);
  const parts = [];
  let left = total;
  for (let k = 0; k < n - 1; k += 1) {
    const avg = left / (n - k);
    const v = Math.round(R.int(Math.round(avg * 0.7), Math.round(avg * 1.15)) / 5) * 5;
    parts.push(v);
    left -= v;
  }
  if (left < 20 || left > 175 || parts.some((v) => v >= 180 || v < 20)) return null;
  return P(
    `A ${nameOf(n)} has angles ${parts.map((v) => `${v}°`).join(', ')} and x°. What is x?`,
    left,
    [
      `The angles of a ${nameOf(n)} add up to (${n} ${MINUS} 2) × 180 = ${total}°.`,
      `x = ${total} ${MINUS} ${parts.reduce((s, v) => s + v, 0)} = ${left}.`,
    ],
    {
      _check: () => parts.reduce((s, v) => s + v, 0) + left === total,
    },
  );
}
function polyFindN(R, mode) {
  const n = R.int(5, 14);
  if (mode === 'sum') {
    return P(
      `The interior angles of a polygon add up to ${pSum(n)}°. How many sides does it have?`,
      n,
      [
        `Solve (n ${MINUS} 2) × 180 = ${pSum(n)}.`,
        `n ${MINUS} 2 = ${pSum(n)} ÷ 180 = ${n - 2}, so n = ${n}.`,
      ],
      { _check: () => pSum(n) === (n - 2) * 180 },
    );
  }
  const each = pSum(n) / n;
  if (!Number.isInteger(each)) return null;
  return P(
    `Every angle of a regular polygon measures ${each}°. How many sides does it have?`,
    n,
    [
      `The angles add up to (n ${MINUS} 2) × 180 and each is ${each}°, so (n ${MINUS} 2) × 180 = ${each}n.`,
      `${180}n ${MINUS} 360 = ${each}n, so ${180 - each}n = 360 and n = ${n}.`,
    ],
    { _check: () => each * n === pSum(n) },
  );
}
function polyExpr(R, n) {
  // n angles written as multiples of x (n = 3 or 4), or with constants
  for (let t = 0; t < 300; t += 1) {
    const coefs = Array.from({ length: n }, () => R.int(1, 5));
    const consts = Array.from({ length: n }, () => R.int(-10, 15));
    const total = pSum(n);
    const sumC = consts.reduce((s, v) => s + v, 0);
    const sumA = coefs.reduce((s, v) => s + v, 0);
    if ((total - sumC) % sumA !== 0) continue;
    const x = (total - sumC) / sumA;
    const vals = coefs.map((c, k) => c * x + consts[k]);
    if (x <= 0 || vals.some((v) => v <= 0 || v >= 180)) continue;
    const exprs = coefs.map((c, k) => lin(c, consts[k]));
    const largest = Math.max(...vals);
    return P(
      `The angles of a ${nameOf(n)} are ${exprs.map((e) => `(${e})°`).join(', ')}. What is the largest angle?`,
      largest,
      [
        `The angles of a ${nameOf(n)} add up to (${n} ${MINUS} 2) × 180 = ${total}°.`,
        `${exprs.join(' + ')} = ${total}, so ${sumA}x ${sumC < 0 ? MINUS : '+'} ${Math.abs(sumC)} = ${total} and x = ${x}.`,
        `The angles are ${vals.join('°, ')}°; the largest is ${largest}°.`,
      ],
      { _check: () => vals.reduce((s, v) => s + v, 0) === total },
    );
  }
  return null;
}

// ───────── slopes ─────────
const FR = [
  [2, 5],
  [3, 7],
  [5, 2],
  [4, 9],
  [7, 3],
  [1, 2],
  [2, 3],
  [5, 6],
  [3, 2],
  [8, 3],
  [1, 4],
  [5, 4],
  [6, 5],
  [7, 2],
  [9, 4],
  [2, 9],
  [4, 7],
  [1, 3],
];
const coefOf = (m) => (m === 1 ? '' : m === -1 ? MINUS : sg(m));
const slopeText = (n, d) => (d === 1 ? sg(n) : `${sg(n)}/${d}`);
function slopeValue(R) {
  const [n, d] = R.pick(FR);
  const sign = R.int(0, 1) ? -1 : 1;
  return frac(sign * n, d);
}
const perp = (f) => frac(-f.d, f.n);
const eqLine = (f, b) =>
  `y = ${f.d === 1 ? (f.n === 1 ? '' : f.n === -1 ? MINUS : sg(f.n)) : `${sg(f.n)}/${f.d}`}x${b === 0 ? '' : b > 0 ? ` + ${b}` : ` ${MINUS} ${-b}`}`;

function slopeAsk(R, kind, form) {
  const f = form === 'int' ? frac(R.pick([2, 3, 4, 5, 6, -2, -3, -4, -5, -7]), 1) : slopeValue(R);
  const g = kind === 'par' ? f : perp(f);
  return P(
    `A line has a slope of ${ft(f)}. What is the slope of a line ${kind === 'par' ? 'parallel' : 'perpendicular'} to it?`,
    ans(g).a,
    kind === 'par'
      ? ['Parallel lines have the same slope.', `The slope is ${ft(f)}.`]
      : [
          'For a perpendicular line, flip the fraction and change the sign.',
          `${ft(f)} becomes ${ft(g)}.`,
        ],
    {
      ...(ans(g).form ? { form: ans(g).form } : {}),
      _check: () => kind === 'par' || f.n * g.n === -f.d * g.d,
    },
  );
}
function eqSlope(R, kind) {
  const f = slopeValue(R);
  const b = R.int(-9, 9);
  const g = kind === 'par' ? f : perp(f);
  return P(
    `What is the slope of a line ${kind === 'par' ? 'parallel' : 'perpendicular'} to ${eqLine(f, b)}?`,
    ans(g).a,
    [
      `The slope of ${eqLine(f, b)} is ${ft(f)}.`,
      kind === 'par'
        ? `A parallel line has the same slope, ${ft(g)}.`
        : `A perpendicular line has the negative reciprocal slope: ${ft(g)}.`,
    ],
    {
      ...(ans(g).form ? { form: ans(g).form } : {}),
      _check: () => kind === 'par' || f.n * g.n === -f.d * g.d,
    },
  );
}
function yesNo(R, kind) {
  const f = slopeValue(R);
  const makeTrue = R.int(0, 1) === 1;
  let g;
  if (kind === 'par') g = makeTrue ? f : frac(f.n + R.pick([1, 2, 3]), f.d);
  else g = makeTrue ? perp(f) : frac(-f.d + R.pick([1, 2]), f.n);
  const b1 = R.int(-8, 8);
  const b2 = R.int(-8, 8);
  const ok = kind === 'par' ? f.n * g.d === g.n * f.d : f.n * g.n === -f.d * g.d;
  return P(
    `Are the lines ${eqLine(f, b1)} and ${eqLine(g, b2)} ${kind === 'par' ? 'parallel' : 'perpendicular'}? Type 1 for yes, 0 for no.`,
    ok ? 1 : 0,
    [
      `Their slopes are ${ft(f)} and ${ft(g)}.`,
      kind === 'par'
        ? `Parallel lines have equal slopes: ${ft(f)} ${ok ? '=' : '≠'} ${ft(g)}.`
        : `Perpendicular slopes multiply to ${MINUS}1: ${ft(f)} × ${ft(g)} = ${ft(frac(f.n * g.n, f.d * g.d))}.`,
      ok ? 'So the answer is yes, 1.' : 'So the answer is no, 0.',
    ],
    { _check: () => ok === (kind === 'par' ? f.n * g.d === g.n * f.d : f.n * g.n === -f.d * g.d) },
  );
}
function twoPoints(R, kind) {
  const [x1, y1] = [R.int(-5, 5), R.int(-5, 5)];
  const dx = R.pick([2, 3, 4, 5, 6]);
  const dy = R.pick([-8, -6, -5, -4, -3, -2, 1, 2, 3, 4, 5, 6, 7]);
  const f = frac(dy, dx);
  const g = kind === 'par' ? f : perp(f);
  return P(
    `A line passes through (${sg(x1)}, ${sg(y1)}) and (${sg(x1 + dx)}, ${sg(y1 + dy)}). What is the slope of a line ${kind === 'par' ? 'parallel' : 'perpendicular'} to it?`,
    ans(g).a,
    [
      `Slope = rise ÷ run = (${sg(y1 + dy)} ${MINUS} ${y1 < 0 ? `(${sg(y1)})` : y1}) ÷ (${sg(x1 + dx)} ${MINUS} ${x1 < 0 ? `(${sg(x1)})` : x1}) = ${ft(f)}.`,
      kind === 'par'
        ? `A parallel line has the same slope, ${ft(g)}.`
        : `A perpendicular line has the negative reciprocal slope, ${ft(g)}.`,
    ],
    {
      ...(ans(g).form ? { form: ans(g).form } : {}),
      _check: () => (kind === 'par' ? dy * g.d === g.n * dx : dy * g.n === -dx * g.d),
    },
  );
}
function standardForm(R, kind) {
  const A = R.int(1, 7);
  const B = R.pick([2, 3, 4, 5, 7]);
  const C = R.int(1, 20);
  if (A === B) return null;
  const slope = frac(-A, B);
  const g = kind === 'par' ? slope : perp(slope);
  return P(
    `What is the slope of a line ${kind === 'par' ? 'parallel' : 'perpendicular'} to ${A === 1 ? '' : A}x + ${B}y = ${C}?`,
    ans(g).a,
    [
      `Solve for y: ${B}y = ${MINUS}${A}x + ${C}, so y = ${ft(slope)}x + ${C}/${B}.`,
      `The slope is ${ft(slope)}.`,
      kind === 'par'
        ? `A parallel line has the same slope, ${ft(g)}.`
        : `A perpendicular line has the negative reciprocal slope, ${ft(g)}.`,
    ],
    {
      ...(ans(g).form ? { form: ans(g).form } : {}),
      _check: () => kind === 'par' || slope.n * g.n === -slope.d * g.d,
    },
  );
}
function findK(R, kind) {
  const m = R.pick([2, 3, 4, 5, 6, -2, -3, -4]);
  const q = R.pick([3, 5, 7]);
  if (kind === 'par') {
    return P(
      `The lines y = kx + ${q} and y = ${coefOf(m)}x ${MINUS} 4 are parallel. What is k?`,
      m,
      ['Parallel lines have the same slope.', `k = ${sg(m)}.`],
      { _check: () => true },
    );
  }
  const g = perp(frac(m, 1));
  return P(
    `The lines y = kx + ${q} and y = ${coefOf(m)}x ${MINUS} 4 are perpendicular. What is k?`,
    ans(g).a,
    [
      `The slope of the second line is ${sg(m)}.`,
      `A perpendicular slope is the negative reciprocal: k = ${ft(g)}.`,
    ],
    { ...(ans(g).form ? { form: ans(g).form } : {}), _check: () => m * g.n === -g.d },
  );
}
function findKStandard(R, kind) {
  // kx + 2y = c and px + y = d
  const p = R.pick([3, 4, 5, -3, -2]);
  const lines = `kx + 2y = 8 and ${p === 1 ? '' : sg(p)}x + y = 7`;
  if (kind === 'par') {
    const k = 2 * p; // slopes: −k/2 and −p
    return P(
      `The lines ${lines} are parallel. What is k?`,
      k,
      [
        `Write each line as y = mx + c: the first has slope ${MINUS}k/2 and the second has slope ${sg(-p)}.`,
        `Parallel lines have equal slopes: ${MINUS}k/2 = ${sg(-p)}, so k = ${sg(k)}.`,
      ],
      { _check: () => -k / 2 === -p },
    );
  }
  // perpendicular: (−k/2)(−p) = −1 → k p = −2 → k = −2/p
  const k = frac(-2, p);
  return P(
    `The lines ${lines} are perpendicular. What is k?`,
    ans(k).a,
    [
      `The first line has slope ${MINUS}k/2 and the second has slope ${sg(-p)}.`,
      `Perpendicular slopes multiply to ${MINUS}1: (${MINUS}k/2)(${sg(-p)}) = ${MINUS}1, so kp/2 = ${MINUS}1 with p = ${sg(p)}.`,
      `k = ${ft(k)}.`,
    ],
    { ...(ans(k).form ? { form: ans(k).form } : {}), _check: () => (-k.n / k.d / 2) * -p === -1 },
  );
}
function interceptThrough(R, kind) {
  const m = R.pick([1, 2, 3, 4, -1, -2, -3, 5]);
  const b0 = R.int(-6, 6);
  const px = R.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
  const py = R.int(-6, 9);
  if (kind === 'par') {
    const b = py - m * px;
    return P(
      `A line through (${sg(px)}, ${sg(py)}) is parallel to y = ${coefOf(m)}x ${b0 < 0 ? MINUS : '+'} ${Math.abs(b0)}. What is its y-intercept?`,
      b,
      [
        'A parallel line has the same slope: y = ' + sg(m) + 'x + b.',
        `Put in the point: ${sg(py)} = ${sg(m)}(${sg(px)}) + b, so b = ${sg(py)} ${MINUS} ${sg(m * px)} = ${sg(b)}.`,
      ],
      { _check: () => py === m * px + b },
    );
  }
  // perpendicular: choose the point's x a multiple of m so b is a whole number
  const k = R.int(-3, 4);
  const x0 = m * k;
  if (x0 === 0) return null;
  const g = perp(frac(m, 1)); // −1/m
  const b = py - (g.n * x0) / g.d;
  if (!Number.isInteger(b)) return null;
  return P(
    `A line through (${sg(x0)}, ${sg(py)}) is perpendicular to y = ${coefOf(m)}x ${b0 < 0 ? MINUS : '+'} ${Math.abs(b0)}. What is its y-intercept?`,
    b,
    [
      `The slope of the given line is ${sg(m)}, so the perpendicular slope is ${ft(g)}.`,
      `Put in the point: ${sg(py)} = ${ft(g)}(${sg(x0)}) + b, so b = ${sg(py)} ${MINUS} ${sg((g.n * x0) / g.d)} = ${sg(b)}.`,
    ],
    { _check: () => py === (g.n * x0) / g.d + b },
  );
}
function slopeOfThroughPoints(R) {
  // perpendicular to the line through two points, with fractions
  const x1 = R.int(-4, 4);
  const y1 = R.int(-4, 4);
  const dx = R.pick([3, 4, 5, 7]);
  const dy = R.pick([2, 3, 5, -2, -3, -4]);
  const f = frac(dy, dx);
  const g = perp(f);
  const h = perp(g);
  return P(
    `Line m passes through (${sg(x1)}, ${sg(y1)}) and (${sg(x1 + dx)}, ${sg(y1 + dy)}). A line n is perpendicular to m, and a line p is perpendicular to n. What is the slope of p?`,
    ans(h).a,
    [
      `The slope of m is ${ft(f)}.`,
      `n is perpendicular to m, so its slope is ${ft(g)}.`,
      `p is perpendicular to n, so its slope is ${ft(h)}, the same as m: p is parallel to m.`,
    ],
    { ...(ans(h).form ? { form: ans(h).form } : {}), _check: () => h.n * f.d === f.n * h.d },
  );
}

module.exports = {
  chapter,
  times,
  P,
  tFind,
  tAlg,
  relCode,
  partner,
  countEqual,
  sumOf,
  angleWord,
  simpleComp,
  missingAround,
  adjacent,
  crossXY,
  ratioWord,
  polySum,
  polyEach,
  polyMissing,
  polyFindN,
  polyExpr,
  slopeAsk,
  eqSlope,
  yesNo,
  twoPoints,
  standardForm,
  findK,
  findKStandard,
  interceptThrough,
  slopeOfThroughPoints,
  near,
  MINUS,
  ANG,
  sg,
  figure,
  INTRO,
  decAns,
  withForm,
};
