// Helpers for the generated Quadratics problems: every answer is computed, never typed by hand.
const M = '−';
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const sg = (n) => (n < 0 ? M + -n : String(n));
const A = (n) => String(n);
const frac = (n, d) => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
const fd = (f) => (f.d === 1 ? sg(f.n) : `${sg(f.n)}/${f.d}`);
const fa = (f) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
const sumStr = (xs) =>
  xs.map((x, i) => (i === 0 ? sg(x) : ` ${x < 0 ? M : '+'} ${Math.abs(x)}`)).join('');
const co = (a) => (a === 1 ? '' : a === -1 ? M : sg(a));
const par = (x) => (x < 0 ? `(${sg(x)})` : String(x));
const minus = (x) => (x < 0 ? `${M} (${sg(x)})` : `${M} ${x}`);
const cx = (n) => (n === 1 ? 'x' : `${n}x`);

function poly(a, b, c) {
  let s = '';
  const add = (coef, body) => {
    if (coef === 0) return;
    const abs = Math.abs(coef);
    const t = body === '' ? String(abs) : abs === 1 ? body : abs + body;
    s += s === '' ? (coef < 0 ? M : '') + t : ` ${coef < 0 ? M : '+'} ${t}`;
  };
  add(a, 'x²');
  add(b, 'x');
  add(c, '');
  return s || '0';
}
const lin = (p) => (p === 0 ? 'x' : p > 0 ? `x + ${p}` : `x ${M} ${-p}`);
const linA = (m, p) => `${m === 1 ? '' : m}x ${p < 0 ? M : '+'} ${Math.abs(p)}`;
const vf = (a, h, k) => {
  const sq = h === 0 ? 'x²' : `(${lin(-h)})²`;
  const tail = k === 0 ? '' : ` ${k < 0 ? M : '+'} ${Math.abs(k)}`;
  return `${co(a)}${sq}${tail}`;
};
const fct = (r) => (r === 0 ? 'x' : `(${lin(-r)})`);
const ff = (a, m, n) => `${co(a)}${fct(m)}${fct(n)}`;
const sqrtParts = (n) => {
  if (n === 0) return [0, 1];
  let out = 1;
  let rest = n;
  for (let f = 2; f * f <= rest; f += 1) while (rest % (f * f) === 0) ((rest /= f * f), (out *= f));
  return [out, rest];
};
const radTxt = (s, r) => (r === 1 ? String(s) : `${s === 1 ? '' : s}√${r}`);

/** (N + s√r)/d reduced; returns display and answer text. */
function radExpr(N, s, r, d) {
  const g = gcd(gcd(Math.abs(N), s), d) || 1;
  N /= g;
  s /= g;
  d /= g;
  const neg = s < 0;
  const rad = radTxt(Math.abs(s), r);
  const top = N === 0 ? `${neg ? M : ''}${rad}` : `${sg(N)} ${neg ? M : '+'} ${rad}`;
  const txt = d === 1 ? top : N === 0 && !neg && s === 1 ? `${top}/${d}` : `(${top})/${d}`;
  const ans = `${d === 1 ? '' : '('}${N}${neg ? '-' : '+'}${Math.abs(s)}*sqrt(${r})${d === 1 ? '' : `)/${d}`}`;
  return { txt, ans };
}

/** The accepted y-values (rounded) of a parabola over x values. */
const yAt = (a, b, c, x) => a * x * x + b * x + c;

const fin = (q, a, steps, disp, extra = {}) => ({
  q,
  a,
  steps: steps.at(-1)?.startsWith('Answer: ') ? steps : [...steps, `Answer: ${disp}`],
  ...extra,
});
const num = (n) => fin; // placeholder to keep exports stable

// ───────── Figures ─────────
const nice = (lo, hi) => [Math.floor(lo), Math.ceil(hi)];
function graph(a, b, c, opts = {}) {
  const vx = -b / (2 * a);
  const vy = yAt(a, b, c, vx);
  let x0 = Math.floor(vx - 4);
  let x1 = Math.ceil(vx + 4);
  const edge = Math.max(yAt(a, b, c, x0), yAt(a, b, c, x1));
  const [lo, hi] =
    a > 0
      ? [Math.floor(Math.min(vy, 0)) - 1, Math.ceil(Math.min(edge, vy + 12))]
      : [Math.floor(Math.max(Math.min(edge, vy - 12), vy - 12)), Math.ceil(Math.max(vy, 0)) + 1];
  const [y0, y1] = nice(lo, hi);
  return {
    kind: 'grid',
    x: [x0, x1],
    y: [y0, y1],
    quad: [{ a, b, c, ...(opts.label ? { label: opts.label } : {}) }],
    ...(opts.pts ? { pts: opts.pts } : {}),
    free: true,
  };
}

module.exports = {
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
  sqrtParts,
  radTxt,
  radExpr,
  yAt,
  fin,
  graph,
};
