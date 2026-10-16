/**
 * Exact values for AMC-style answers (DESIGN.md §9.13): sums of rational multiples of
 * √r · πᵖ, with r a square-free integer. Anything else (a root of a sum, a non-integer power…) is
 * kept as a floating-point approximation instead.
 */

export interface Rational {
  n: bigint;
  d: bigint;
}

/** One term's shape: √radicand · π^pi. */
export interface TermKey {
  radicand: bigint;
  pi: number;
}

export type Value = { kind: 'exact'; terms: Map<string, Rational> } | { kind: 'approx'; x: number };

export class MathError extends Error {}

const abs = (a: bigint) => (a < 0n ? -a : a);
export function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

export function rational(n: bigint, d = 1n): Rational {
  if (d === 0n) throw new MathError('Division by zero');
  const sign = d < 0n ? -1n : 1n;
  const g = gcd(n, d) || 1n;
  return { n: (sign * n) / g, d: (sign * d) / g };
}

const radd = (a: Rational, b: Rational) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const rmul = (a: Rational, b: Rational) => rational(a.n * b.n, a.d * b.d);
const rinv = (a: Rational) => rational(a.d, a.n);
const rneg = (a: Rational): Rational => ({ n: -a.n, d: a.d });
const rnum = (a: Rational) => Number(a.n) / Number(a.d);

const keyOf = (radicand: bigint, pi: number) => `${radicand}|${pi}`;
export function parseKey(key: string): TermKey {
  const [r, p] = key.split('|');
  return { radicand: BigInt(r!), pi: Number(p) };
}

/** n = s² · r with r square-free (n > 0). */
export function squareFree(n: bigint): { outside: bigint; inside: bigint } {
  if (n <= 0n) throw new MathError('Square root of a non-positive number');
  let outside = 1n;
  let inside = n;
  for (let f = 2n; f * f <= inside; f += 1n) {
    while (inside % (f * f) === 0n) {
      inside /= f * f;
      outside *= f;
    }
    if (f > 100_000n) break;
  }
  return { outside, inside };
}

function exact(entries: [TermKey, Rational][]): Value {
  const terms = new Map<string, Rational>();
  for (const [k, c] of entries) {
    const key = keyOf(k.radicand, k.pi);
    const sum = terms.has(key) ? radd(terms.get(key)!, c) : c;
    if (sum.n === 0n) terms.delete(key);
    else terms.set(key, sum);
  }
  return { kind: 'exact', terms };
}

export const fromRational = (r: Rational): Value => exact([[{ radicand: 1n, pi: 0 }, r]]);
export const fromInt = (n: bigint | number) => fromRational(rational(BigInt(n)));
export const PI: Value = exact([[{ radicand: 1n, pi: 1 }, rational(1n)]]);

export function approx(v: Value): number {
  if (v.kind === 'approx') return v.x;
  let x = 0;
  for (const [key, c] of v.terms) {
    const { radicand, pi } = parseKey(key);
    x += rnum(c) * Math.sqrt(Number(radicand)) * Math.PI ** pi;
  }
  return x;
}

const approxValue = (x: number): Value => {
  if (!Number.isFinite(x)) throw new MathError('The value is not a finite number');
  return { kind: 'approx', x };
};

/** The value as a plain rational, if it is one. */
export function asRational(v: Value): Rational | null {
  if (v.kind !== 'exact') return null;
  if (v.terms.size === 0) return rational(0n);
  if (v.terms.size !== 1) return null;
  const [key, c] = [...v.terms][0]!;
  return key === keyOf(1n, 0) ? c : null;
}

export function asInteger(v: Value): bigint | null {
  const r = asRational(v);
  return r && r.d === 1n ? r.n : null;
}

export function add(a: Value, b: Value): Value {
  if (a.kind === 'exact' && b.kind === 'exact')
    return exact([...a.terms, ...b.terms].map(([k, c]) => [parseKey(k), c] as [TermKey, Rational]));
  return approxValue(approx(a) + approx(b));
}

export function neg(a: Value): Value {
  if (a.kind === 'approx') return { kind: 'approx', x: -a.x };
  return exact([...a.terms].map(([k, c]) => [parseKey(k), rneg(c)]));
}

export const sub = (a: Value, b: Value) => add(a, neg(b));

export function mul(a: Value, b: Value): Value {
  if (a.kind !== 'exact' || b.kind !== 'exact') return approxValue(approx(a) * approx(b));
  const out: [TermKey, Rational][] = [];
  for (const [ka, ca] of a.terms) {
    for (const [kb, cb] of b.terms) {
      const ta = parseKey(ka);
      const tb = parseKey(kb);
      const { outside, inside } = squareFree(ta.radicand * tb.radicand);
      out.push([{ radicand: inside, pi: ta.pi + tb.pi }, rmul(rmul(ca, cb), rational(outside))]);
    }
  }
  return exact(out);
}

/** 1/v: exact for one term, and for a ± b√r (rationalised with the conjugate). */
export function inverse(v: Value): Value {
  if (v.kind === 'approx') {
    if (v.x === 0) throw new MathError('Division by zero');
    return approxValue(1 / v.x);
  }
  const entries = [...v.terms].map(([k, c]) => [parseKey(k), c] as const);
  if (entries.length === 0) throw new MathError('Division by zero');
  if (entries.length === 1) {
    const [k, c] = entries[0]!;
    // 1/(c√r πᵖ) = √r / (c·r) · π⁻ᵖ
    return exact([[{ radicand: k.radicand, pi: -k.pi }, rinv(rmul(c, rational(k.radicand)))]]);
  }
  if (entries.length === 2 && entries.every(([k]) => k.pi === entries[0]![0].pi)) {
    const rationalPart = entries.find(([k]) => k.radicand === 1n);
    const rootPart = entries.find(([k]) => k.radicand !== 1n);
    if (rationalPart && rootPart) {
      const conjugate = exact([
        [rationalPart[0], rationalPart[1]],
        [rootPart[0], rneg(rootPart[1])],
      ]);
      const denominator = mul(v, conjugate); // a² − b²r (times π²ᵖ)
      return mul(conjugate, inverse(denominator));
    }
  }
  return approxValue(1 / approx(v));
}

export const div = (a: Value, b: Value) => mul(a, inverse(b));

export function pow(base: Value, exponent: Value): Value {
  const e = asRational(exponent);
  if (e && e.d === 1n && abs(e.n) <= 4096n) {
    // Square-and-multiply keeps 2^100 exact and fast.
    let result = fromInt(1);
    let square = base;
    for (let k = abs(e.n); k > 0n; k >>= 1n) {
      if (k & 1n) result = mul(result, square);
      if (k > 1n) square = mul(square, square);
    }
    return e.n < 0n ? inverse(result) : result;
  }
  if (e && e.d === 2n && abs(e.n) <= 64n) return pow(sqrt(base), fromInt(e.n));
  const x = approx(base) ** approx(exponent);
  if (Number.isNaN(x)) throw new MathError('That power is not a real number');
  return approxValue(x);
}

export function sqrt(v: Value): Value {
  const r = asRational(v);
  if (r) {
    if (r.n < 0n) throw new MathError('Square root of a negative number');
    if (r.n === 0n) return fromInt(0);
    // √(n/d) = √(n·d) / d
    const { outside, inside } = squareFree(r.n * r.d);
    return exact([[{ radicand: inside, pi: 0 }, rational(outside, r.d)]]);
  }
  if (v.kind === 'exact' && v.terms.size === 1) {
    const [key, c] = [...v.terms][0]!;
    const k = parseKey(key);
    // √(c·πᵖ) with p even and c rational: √c · π^(p/2)
    if (k.radicand === 1n && k.pi % 2 === 0) return mul(sqrt(fromRational(c)), piPower(k.pi / 2));
  }
  const x = approx(v);
  if (x < 0) throw new MathError('Square root of a negative number');
  return approxValue(Math.sqrt(x));
}

const piPower = (p: number): Value => exact([[{ radicand: 1n, pi: p }, rational(1n)]]);

const TOLERANCE = 1e-9;

/** Exact comparison when both are exact; otherwise a relative tolerance. */
export function equal(a: Value, b: Value): boolean {
  if (a.kind === 'exact' && b.kind === 'exact') {
    if (a.terms.size !== b.terms.size) return false;
    for (const [k, c] of a.terms) {
      const other = b.terms.get(k);
      if (!other || other.n !== c.n || other.d !== c.d) return false;
    }
    return true;
  }
  const x = approx(a);
  const y = approx(b);
  return Math.abs(x - y) <= TOLERANCE * Math.max(1, Math.abs(x), Math.abs(y));
}

/** A terminating decimal like "100.5" when the value is one, else the readable form ("1/3"). */
export function formatDecimal(v: Value): string {
  const r = asRational(v);
  if (!r) return format(v);
  for (let k = 0; k <= 12; k += 1) {
    const scale = 10n ** BigInt(k);
    if ((r.n * scale) % r.d !== 0n) continue;
    const scaled = (r.n * scale) / r.d;
    const digits = abs(scaled)
      .toString()
      .padStart(k + 1, '0');
    const whole = digits.slice(0, digits.length - k);
    const frac = digits.slice(digits.length - k);
    return `${scaled < 0n ? '-' : ''}${whole}${k ? `.${frac}` : ''}`;
  }
  return format(v);
}

/** TeX for a value, for filling template placeholders inside $…$: "\frac{3}{4}", "2\sqrt{3}", "\frac{5\pi}{2}". */
export function formatTex(v: Value): string {
  if (v.kind === 'approx') return String(Number(v.x.toPrecision(12)));
  if (v.terms.size === 0) return '0';
  return [...v.terms]
    .map(([key, c]) => ({ ...parseKey(key), c }))
    .toSorted((a, b) => a.pi - b.pi || Number(a.radicand - b.radicand))
    .map(({ radicand, pi, c }, i) => {
      const symbol = `${radicand === 1n ? '' : `\\sqrt{${radicand}}`}${pi === 0 ? '' : pi === 1 ? '\\pi' : `\\pi^{${pi}}`}`;
      const n = abs(c.n);
      const top = `${symbol && n === 1n ? '' : String(n)}${symbol}`;
      const body = c.d === 1n ? top : `\\frac{${top}}{${c.d}}`;
      const sign = c.n < 0n ? '-' : '+';
      return i === 0 ? (sign === '-' ? `-${body}` : body) : ` ${sign} ${body}`;
    })
    .join('');
}

/** A readable form for messages: "3/4", "2√3", "5π/2", "1 + √2". */
export function format(v: Value): string {
  if (v.kind === 'approx') return String(Number(v.x.toPrecision(12)));
  if (v.terms.size === 0) return '0';
  const parts = [...v.terms]
    .map(([key, c]) => ({ ...parseKey(key), c }))
    .toSorted((a, b) => a.pi - b.pi || Number(a.radicand - b.radicand))
    .map(({ radicand, pi, c }) => {
      const symbol = `${radicand === 1n ? '' : `√${radicand}`}${pi === 0 ? '' : pi === 1 ? 'π' : `π^${pi}`}`;
      const n = abs(c.n);
      const coeff = symbol && n === 1n ? '' : String(n);
      const body = `${coeff}${symbol}${c.d === 1n ? '' : `/${c.d}`}`;
      return { negative: c.n < 0n, body };
    });
  return parts
    .map((p, i) =>
      i === 0 ? (p.negative ? `-${p.body}` : p.body) : `${p.negative ? ' - ' : ' + '}${p.body}`,
    )
    .join('');
}
