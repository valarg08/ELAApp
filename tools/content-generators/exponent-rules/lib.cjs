// Shared helpers for the Exponent Rules generator: exact rational arithmetic, monomials, a tiny
// expression tree that prints with superscripts, and a step writer that explains each rule it uses.
const MINUS = '−';
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n) =>
  String(n)
    .split('')
    .map((c) => (c === '-' ? '⁻' : SUPS[Number(c)]))
    .join('');
const t = (n) => (n < 0 ? MINUS + -n : String(n));

const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const R = (n, d = 1) => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
const rmul = (a, b) => R(a.n * b.n, a.d * b.d);
const rdiv = (a, b) => R(a.n * b.d, a.d * b.n);
const rpow = (a, k) => (k >= 0 ? R(a.n ** k, a.d ** k) : R(a.d ** -k, a.n ** -k));
const SAFE = 1e12;
const safe = (r) => {
  if (Math.abs(r.n) > SAFE || r.d > SAFE) throw new Error('number too big');
  return r;
};

// monomials: a rational coefficient and integer exponents
const mono = (c, v = {}) => ({ c, v });
const mmul = (a, b) => {
  const v = { ...a.v };
  for (const [k, e] of Object.entries(b.v)) v[k] = (v[k] ?? 0) + e;
  return mono(safe(rmul(a.c, b.c)), v);
};
const mdiv = (a, b) => {
  const v = { ...a.v };
  for (const [k, e] of Object.entries(b.v)) v[k] = (v[k] ?? 0) - e;
  return mono(safe(rdiv(a.c, b.c)), v);
};
const mpow = (a, k) =>
  mono(safe(rpow(a.c, k)), Object.fromEntries(Object.entries(a.v).map(([x, e]) => [x, e * k])));

function monoStr(m) {
  const vs = Object.keys(m.v)
    .filter((k) => m.v[k] !== 0)
    .sort();
  const { n, d } = m.c;
  if (!vs.length) return d === 1 ? t(n) : `${t(n)}/${d}`;
  const body = vs.map((k) => k + (m.v[k] === 1 ? '' : sup(m.v[k]))).join('');
  if (d !== 1) return `(${t(n)}/${d})${body}`;
  return (n === 1 ? '' : n === -1 ? MINUS : t(n)) + body;
}

// expression tree; every node prints itself (.s), evaluates exactly (mono) and as a float (ev)
const isAtom = (b) => b.t === 'var' || (b.t === 'num' && b.n >= 0);
const num = (n) => ({ t: 'num', n, s: t(n), mono: () => mono(R(n)), ev: () => n });
const vr = (x) => ({ t: 'var', x, s: x, mono: () => mono(R(1), { [x]: 1 }), ev: (e) => e[x] });
const pw = (b, k) => ({
  t: 'pow',
  b,
  k,
  s: (isAtom(b) ? b.s : `(${b.s})`) + sup(k),
  mono: () => mpow(b.mono(), k),
  ev: (e) => Math.pow(b.ev(e), k),
});
const nameOf = (x) => (x.t === 'var' ? x.x : x.t === 'pow' && x.b.t === 'var' ? x.b.x : null);
const mul = (...f) => {
  let s = '';
  let group = new Set();
  f.forEach((x, i) => {
    const xs =
      x.t === 'div' || x.t === 'mul' || (x.t === 'num' && x.n < 0 && i > 0) ? `(${x.s})` : x.s;
    const name = nameOf(x);
    if (i === 0) {
      s = x.t === 'num' && x.n === -1 && f[1] && f[1].t !== 'num' ? MINUS : xs;
      group = new Set(name ? [name] : []);
      return;
    }
    const prev = f[i - 1];
    let joined = false;
    if (name) {
      if (prev.t === 'num') joined = true;
      else if (nameOf(prev) && !group.has(name)) joined = true;
      group = joined && prev.t !== 'num' ? group.add(name) : new Set([name]);
    } else group = new Set();
    s += (joined ? '' : '·') + xs;
  });
  return {
    t: 'mul',
    f,
    s,
    mono: () => f.map((x) => x.mono()).reduce(mmul),
    ev: (e) => f.reduce((p, x) => p * x.ev(e), 1),
  };
};
const par = (x) =>
  x.t === 'mul' || x.t === 'div' || (x.t === 'num' && x.n < 0) ? `(${x.s})` : x.s;
const div = (a, b) => ({
  t: 'div',
  a,
  b,
  s: `${par(a)}/${par(b)}`,
  mono: () => mdiv(a.mono(), b.mono()),
  ev: (e) => a.ev(e) / b.ev(e),
});

const xs = vr('x');
const ys = vr('y');
const xp = (k) => pw(xs, k);
const yp = (k) => pw(ys, k);
const N = num;

const varsOf = (node, set = new Set()) => {
  if (node.t === 'var') set.add(node.x);
  for (const c of [node.b, node.a, ...(node.f ?? [])])
    if (c && typeof c === 'object') varsOf(c, set);
  return set;
};
const needsAssume = (node) => {
  if (node.t === 'div') return true;
  if (node.t === 'pow' && node.k <= 0 && varsOf(node.b).size) return true;
  return [node.b, node.a, ...(node.f ?? [])].some(
    (c) => c && typeof c === 'object' && needsAssume(c),
  );
};

// ───────── steps ─────────
function ruleOf(n) {
  if (n.t === 'mul')
    return 'Product of powers: multiply the numbers and add the exponents of each variable';
  if (n.t === 'div') return 'Quotient of powers: divide the numbers and subtract the exponents';
  if (n.t === 'pow') {
    if (n.b.t === 'pow') return 'Power of a power: multiply the exponents';
    if (n.b.t === 'mul') return 'Power of a product: raise every factor to the power';
    if (n.b.t === 'div') return 'Power of a quotient: raise the top and the bottom to the power';
    if (n.k === 0) return 'Zero exponent: any non-zero base to the power 0 is 1';
    if (n.k < 0) return 'Negative exponent: take the reciprocal and make the exponent positive';
    if (n.k === 1) return 'One exponent: a number to the power 1 is itself';
    return 'Evaluate the power';
  }
  return '';
}

function explain(n, out = [], parent = null) {
  for (const c of [n.b, n.a, ...(n.f ?? [])]) if (c && typeof c === 'object') explain(c, out, n);
  if (n.t === 'num' || n.t === 'var') return out;
  if ((n.t === 'mul' || n.t === 'div') && parent && parent.t === 'pow') return out; // the power's own step spreads over it
  if (n.t === 'pow' && isAtom(n.b) && n.k > 1 && n.b.t === 'var') return out; // x^k is already simple
  const res = monoStr(n.mono());
  if (res === n.s) return out;
  if (n.t === 'pow' && (n.b.t === 'mul' || n.b.t === 'div')) {
    const part = (c) => pw(c, n.k).s;
    const spread = n.b.t === 'mul' ? n.b.f.map(part).join('·') : `${part(n.b.a)}/${part(n.b.b)}`;
    out.push(`${ruleOf(n)}: ${n.s} = ${spread} = ${res}.`);
  } else if (n.t === 'pow' && n.b.t === 'pow') {
    const exps = [n.k];
    let root = n.b;
    while (root.t === 'pow') {
      exps.unshift(root.k);
      root = root.b;
    }
    out.push(
      `${ruleOf(n)}: ${n.s} = ${isAtom(root) ? root.s : `(${root.s})`}^(${exps.map((e) => (e < 0 ? `(${t(e)})` : e)).join('·')}) = ${res}.`,
    );
  } else if (n.t === 'pow' && n.k < 0 && isAtom(n.b)) {
    const flipped = n.b.t === 'var' ? `1/${pw(n.b, -n.k).s}` : `1/${pw(n.b, -n.k).s}`;
    out.push(`${ruleOf(n)}: ${n.s} = ${flipped} = ${res}.`);
  } else out.push(`${ruleOf(n)}: ${n.s} = ${res}.`);
  return out;
}

const rationalStr = (r) => (r.d === 1 ? String(r.n) : `${r.n}/${r.d}`);
const rationalTxt = (r) => (r.d === 1 ? t(r.n) : `${t(r.n)}/${r.d}`);

/**
 * A problem from an expression tree: the question text, the answer read off the exact monomial,
 * and the steps. `ask` is one of val, exp(var), c, cn, sum, fnum, fden, fsum.
 */
function fromExpr(node, ask) {
  const res = node.mono();
  const vars = [...varsOf(node)].sort();
  const assume = needsAssume(node) ? `Assume ${vars.map((v) => `${v} ≠ 0`).join(' and ')}. ` : '';
  const letters = vars.length === 2 ? ['m', 'n'] : ['n'];
  const c = res.c;
  const tmpl = (() => {
    const body = vars.map((v, i) => `${v}^${letters[i]}`).join('·');
    return c.n === 1 && c.d === 1 ? body : `c·${body}`;
  })();
  let q;
  let a;
  let form;
  let tail;
  let explainTail = '';
  switch (ask.k) {
    case 'val': {
      if (vars.some((v) => res.v[v] !== 0) || res.c.d < 0)
        throw new Error('not a number: ' + node.s);
      q = `${assume}What is ${node.s}?`;
      a = rationalStr(res.c);
      if (res.c.d !== 1) form = 'fraction';
      tail = `The value is ${rationalTxt(res.c)}.`;
      break;
    }
    case 'exp': {
      const i = vars.indexOf(ask.v);
      q = `${assume}${node.s} = ${tmpl}. What is ${letters[i]}?`;
      a = String(res.v[ask.v] ?? 0);
      tail = `So ${node.s} = ${monoStr(res)}, and ${letters[i]} = ${t(res.v[ask.v] ?? 0)}.`;
      break;
    }
    case 'sum': {
      const total = vars.reduce((s, v) => s + (res.v[v] ?? 0), 0);
      q = `${assume}${node.s} = ${tmpl}. What is ${letters.join(' + ')}?`;
      a = String(total);
      tail = `So ${node.s} = ${monoStr(res)}, and ${letters.join(' + ')} = ${vars.map((v) => ((res.v[v] ?? 0) < 0 ? `(${t(res.v[v])})` : t(res.v[v] ?? 0))).join(' + ')} = ${t(total)}.`;
      break;
    }
    case 'c': {
      if (c.d !== 1 || (c.n === 1 && ask.allowOne !== true)) throw new Error('bad c: ' + node.s);
      q = `${assume}${node.s} = ${tmpl.startsWith('c·') ? tmpl : `c·${tmpl}`}. What is c?`;
      a = String(c.n);
      tail = `So ${node.s} = ${monoStr(res)}, and c = ${t(c.n)}.`;
      break;
    }
    case 'cn': {
      if (c.d !== 1 || vars.length !== 1) throw new Error('bad cn: ' + node.s);
      const n = res.v[vars[0]];
      q = `${assume}${node.s} = c·${vars[0]}^n. What is c + n?`;
      a = String(c.n + n);
      tail = `So ${node.s} = ${monoStr(res)}, and c + n = ${t(c.n)} + ${n < 0 ? `(${t(n)})` : t(n)} = ${t(c.n + n)}.`;
      break;
    }
    case 'fnum':
    case 'fden':
    case 'fsum': {
      const spread = vars.reduce((s, v) => s + Math.abs(res.v[v] ?? 0), 0);
      const fracForm = (() => {
        const side = (sgn) => {
          const bits = vars
            .filter((v) => Math.sign(res.v[v] ?? 0) === sgn)
            .map((v) => v + (Math.abs(res.v[v]) === 1 ? '' : sup(Math.abs(res.v[v]))));
          return bits.join('');
        };
        const top = (c.n === 1 ? '' : t(c.n)) + side(1) || '1';
        const bottom = (c.d === 1 ? '' : String(c.d)) + side(-1) || '1';
        const wrap = (x) => (/^\d+$/.test(x) || /^[a-z][⁰¹²³⁴⁵⁶⁷⁸⁹]*$/.test(x) ? x : `(${x})`);
        return `${wrap(top)}/${wrap(bottom)}`;
      })();
      const head = `${assume}Write ${node.s} as a fraction in lowest terms with only positive exponents. `;
      explainTail = `With positive exponents, ${node.s} = ${fracForm}. `;
      if (ask.k === 'fnum') {
        q = `${head}What is the number in the numerator?`;
        a = String(c.n);
        tail = `The numerator's number is ${t(c.n)}.`;
      } else if (ask.k === 'fden') {
        q = `${head}What is the number in the denominator?`;
        a = String(c.d);
        tail = `The denominator's number is ${c.d}.`;
      } else {
        q = `${head}What is the sum of the exponents in the numerator and the denominator?`;
        a = String(spread);
        tail = `The exponents are ${vars.map((v) => Math.abs(res.v[v] ?? 0)).join(' and ')}, which add to ${spread}.`;
      }
      break;
    }
    default:
      throw new Error('ask');
  }
  return {
    q,
    a,
    ...(form ? { form } : {}),
    steps: [...explain(node), explainTail + tail],
    _node: node,
    _ask: ask,
  };
}

// independent numeric check: substitute numbers and compare with what the monomial says
function checkExpr(p) {
  const env = { x: 2, y: 3 };
  const m = p._node.mono();
  const lhs = p._node.ev(env);
  const rhs =
    (m.c.n / m.c.d) * Object.entries(m.v).reduce((s, [k, e]) => s * Math.pow(env[k], e), 1);
  return Math.abs(lhs - rhs) <= 1e-9 * Math.max(1, Math.abs(lhs));
}

module.exports = {
  MINUS,
  sup,
  t,
  R,
  rationalStr,
  rationalTxt,
  mono,
  monoStr,
  num,
  vr,
  pw,
  mul,
  div,
  xs,
  ys,
  xp,
  yp,
  N,
  fromExpr,
  checkExpr,
  explain,
};
