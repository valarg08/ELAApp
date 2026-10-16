import {
  MathError,
  PI,
  type Value,
  add,
  approx,
  asInteger,
  asRational,
  div,
  equal,
  fromInt,
  fromRational,
  gcd,
  mul,
  neg,
  pow,
  rational,
  sqrt,
  sub,
} from './value.js';

/**
 * A small, safe expression reader (no loops, no eval): numbers, + − × ÷ ^, parentheses, √ / sqrt(),
 * π / pi, ! and, with `functions`, binom gcd lcm floor ceil abs min max mod. Students' answers use
 * it without functions or variables; content (`compute`, problem templates) uses both, and
 * template conditions add comparisons (== != < <= > >=) joined by `and` / `or`.
 */

export interface EvaluateOptions {
  /** binom, gcd, lcm… (content only). */
  functions?: boolean;
  /** Template variables by name (content only). */
  vars?: Readonly<Record<string, Value>>;
}

type Token = { t: 'num'; v: string } | { t: 'id'; v: string } | { t: 'op'; v: string };

const OPS = new Set(['+', '-', '*', '/', '^', '(', ')', ',', '!', '√']);
const ALIASES: Record<string, string> = {
  '−': '-',
  '–': '-',
  '×': '*',
  '·': '*',
  '⋅': '*',
  '÷': '/',
  π: 'pi',
  '[': '(',
  ']': ')',
  '{': '(',
  '}': ')',
};

const COMPARISONS = ['==', '!=', '<=', '>=', '<', '>'];

function tokenize(input: string, comparisons = false): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const raw = input[i]!;
    const ch = ALIASES[raw] ?? raw;
    const comparison = comparisons && COMPARISONS.find((c) => input.startsWith(c, i));
    if (comparison) {
      tokens.push({ t: 'op', v: comparison });
      i += comparison.length;
    } else if (/\s/.test(ch)) {
      i += 1;
    } else if (/[0-9.]/.test(ch)) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(input.slice(i));
      if (!m) throw new MathError(`I can't read "${input.slice(i, i + 4)}"`);
      tokens.push({ t: 'num', v: m[0] });
      i += m[0].length;
    } else if (ch === 'pi') {
      tokens.push({ t: 'id', v: 'pi' });
      i += 1;
    } else if (/[a-z]/i.test(ch)) {
      const m = /^[a-z]+/i.exec(input.slice(i))!;
      tokens.push({ t: 'id', v: m[0].toLowerCase() });
      i += m[0].length;
    } else if (OPS.has(ch)) {
      tokens.push({ t: 'op', v: ch });
      i += 1;
    } else {
      throw new MathError(`I can't read "${raw}"`);
    }
  }
  return tokens;
}

/** Words that join conditions, never variables or implicit factors. */
const KEYWORDS = new Set(['and', 'or']);

const FUNCTIONS = ['binom', 'gcd', 'lcm', 'floor', 'ceil', 'abs', 'min', 'max', 'mod', 'fact'];

function integerArg(v: Value, name: string): bigint {
  const n = asInteger(v);
  if (n === null) throw new MathError(`${name} needs whole numbers`);
  return n;
}

function factorial(n: bigint): Value {
  if (n < 0n || n > 200n) throw new MathError('Factorials need a whole number from 0 to 200');
  let r = 1n;
  for (let k = 2n; k <= n; k += 1n) r *= k;
  return fromInt(r);
}

function binom(n: bigint, k: bigint): Value {
  if (k < 0n || n < 0n || k > n) return fromInt(0);
  let r = 1n;
  const kk = k > n - k ? n - k : k;
  for (let i = 1n; i <= kk; i += 1n) r = (r * (n - kk + i)) / i;
  return fromInt(r);
}

/** Whole part of a value, guarding against 2.9999999 from floating point. */
function floorOf(v: Value): Value {
  const r = asRational(v);
  if (r) {
    const q = r.n / r.d;
    return fromInt(r.n < 0n && q * r.d !== r.n ? q - 1n : q);
  }
  const x = approx(v);
  const near = Math.round(x);
  return fromInt(BigInt(Math.abs(x - near) < 1e-9 ? near : Math.floor(x)));
}

function callFunction(name: string, args: Value[]): Value {
  const need = (n: number) => {
    if (args.length !== n) throw new MathError(`${name} needs ${n} number${n === 1 ? '' : 's'}`);
  };
  switch (name) {
    case 'sqrt':
      need(1);
      return sqrt(args[0]!);
    case 'binom':
      need(2);
      return binom(integerArg(args[0]!, name), integerArg(args[1]!, name));
    case 'fact':
      need(1);
      return factorial(integerArg(args[0]!, name));
    case 'gcd':
    case 'lcm': {
      if (args.length < 2) throw new MathError(`${name} needs at least 2 numbers`);
      const ns = args.map((a) => integerArg(a, name));
      const result = ns.reduce((a, b) =>
        name === 'gcd'
          ? gcd(a, b)
          : a === 0n || b === 0n
            ? 0n
            : (a * b < 0n ? -(a * b) : a * b) / gcd(a, b),
      );
      return fromInt(result);
    }
    case 'floor':
      need(1);
      return floorOf(args[0]!);
    case 'ceil':
      need(1);
      return neg(floorOf(neg(args[0]!)));
    case 'abs':
      need(1);
      return approx(args[0]!) < 0 ? neg(args[0]!) : args[0]!;
    case 'min':
    case 'max':
      if (args.length < 1) throw new MathError(`${name} needs numbers`);
      return args.reduce((a, b) =>
        name === 'min' ? (approx(b) < approx(a) ? b : a) : approx(b) > approx(a) ? b : a,
      );
    case 'mod': {
      need(2);
      const a = integerArg(args[0]!, name);
      const m = integerArg(args[1]!, name);
      if (m <= 0n) throw new MathError('mod needs a positive divisor');
      return fromInt(((a % m) + m) % m);
    }
    default:
      throw new MathError(`Unknown function "${name}"`);
  }
}

class Parser {
  private i = 0;
  constructor(
    private readonly tokens: Token[],
    private readonly functions: boolean,
    private readonly vars: Readonly<Record<string, Value>> = {},
  ) {}

  parse(): Value {
    if (this.tokens.length === 0) throw new MathError('Type an answer');
    const v = this.expr();
    if (this.i < this.tokens.length) throw new MathError('Check the end of your answer');
    return v;
  }

  /** A template condition: comparisons joined by `and` / `or` (`and` binds tighter). */
  parseCondition(): boolean {
    if (this.tokens.length === 0) throw new MathError('The condition is empty');
    let result = this.conjunction();
    while (this.isWord('or')) {
      this.i += 1;
      const rhs = this.conjunction();
      result = result || rhs;
    }
    if (this.i < this.tokens.length) throw new MathError('Check the end of the condition');
    return result;
  }

  private isWord(w: string) {
    const t = this.peek();
    return t?.t === 'id' && t.v === w;
  }

  private conjunction(): boolean {
    let result = this.comparison();
    while (this.isWord('and')) {
      this.i += 1;
      const rhs = this.comparison();
      result = result && rhs;
    }
    return result;
  }

  private comparison(): boolean {
    const a = this.expr();
    const t = this.peek();
    if (t?.t !== 'op' || !COMPARISONS.includes(t.v))
      throw new MathError('A condition needs a comparison (== != < <= > >=)');
    this.i += 1;
    const b = this.expr();
    const same = equal(a, b);
    switch (t.v) {
      case '==':
        return same;
      case '!=':
        return !same;
      case '<':
        return !same && approx(a) < approx(b);
      case '<=':
        return same || approx(a) < approx(b);
      case '>':
        return !same && approx(a) > approx(b);
      default:
        return same || approx(a) > approx(b);
    }
  }

  private peek() {
    return this.tokens[this.i];
  }
  private isOp(v: string) {
    const t = this.peek();
    return t?.t === 'op' && t.v === v;
  }
  private expect(v: string) {
    if (!this.isOp(v)) throw new MathError(v === ')' ? 'A bracket is missing' : `Expected "${v}"`);
    this.i += 1;
  }

  private expr(): Value {
    let v = this.term();
    while (this.isOp('+') || this.isOp('-')) {
      const op = this.peek()!.v;
      this.i += 1;
      const rhs = this.term();
      v = op === '+' ? add(v, rhs) : sub(v, rhs);
    }
    return v;
  }

  /** Can the next token start a factor written right after another (2π, 3√5, 2(x+1))? */
  private startsImplicitFactor() {
    const t = this.peek();
    if (!t) return false;
    if (t.t === 'id') return !KEYWORDS.has(t.v);
    return t.t === 'op' && (t.v === '(' || t.v === '√');
  }

  private term(): Value {
    let v = this.unary();
    for (;;) {
      if (this.isOp('*') || this.isOp('/')) {
        const op = this.peek()!.v;
        this.i += 1;
        const rhs = this.unary();
        v = op === '*' ? mul(v, rhs) : div(v, rhs);
      } else if (this.startsImplicitFactor()) {
        v = mul(v, this.power());
      } else {
        return v;
      }
    }
  }

  private unary(): Value {
    if (this.isOp('-')) {
      this.i += 1;
      return neg(this.unary());
    }
    if (this.isOp('+')) {
      this.i += 1;
      return this.unary();
    }
    return this.power();
  }

  private power(): Value {
    const base = this.postfix();
    if (this.isOp('^')) {
      this.i += 1;
      return pow(base, this.unary());
    }
    return base;
  }

  private postfix(): Value {
    let v = this.primary();
    while (this.isOp('!')) {
      this.i += 1;
      v = factorial(integerArg(v, 'Factorial'));
    }
    return v;
  }

  private primary(): Value {
    const t = this.peek();
    if (!t) throw new MathError('Your answer stops too early');
    if (t.t === 'num') {
      this.i += 1;
      const [whole, frac = ''] = t.v.split('.');
      const digits = BigInt(`${whole || '0'}${frac}`);
      return fromRational(rational(digits, 10n ** BigInt(frac.length)));
    }
    if (t.t === 'op' && t.v === '(') {
      this.i += 1;
      const v = this.expr();
      this.expect(')');
      return v;
    }
    if (t.t === 'op' && t.v === '√') {
      this.i += 1;
      return sqrt(this.postfix());
    }
    if (t.t === 'id') {
      this.i += 1;
      if (t.v === 'pi') return PI;
      const variable = Object.hasOwn(this.vars, t.v) ? this.vars[t.v] : undefined;
      if (variable) return variable;
      if (t.v === 'sqrt' || (this.functions && FUNCTIONS.includes(t.v))) {
        this.expect('(');
        const args = [this.expr()];
        while (this.isOp(',')) {
          this.i += 1;
          args.push(this.expr());
        }
        this.expect(')');
        return callFunction(t.v, args);
      }
      throw new MathError(`I don't know "${t.v}"`);
    }
    throw new MathError(`Unexpected "${t.v}"`);
  }
}

/** Evaluate an expression. `functions` allows binom, gcd…, `vars` template variables (content only). */
export function evaluate(input: string, { functions = false, vars }: EvaluateOptions = {}): Value {
  return new Parser(tokenize(input.trim()), functions, vars).parse();
}

/** Whether a template condition like "a != b and gcd(a, b) == 1" holds for these variables. */
export function holds(condition: string, vars: Readonly<Record<string, Value>> = {}): boolean {
  return new Parser(tokenize(condition.trim(), true), true, vars).parseCondition();
}

/** Mixed numbers like "2 1/3" (or "-2 1/3"). */
const MIXED = /^\s*([-−]?)(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/;
/** Thousands separators: 1,000 or 12,345,678. */
const GROUPED = /^\s*[-−]?\d{1,3}(,\d{3})+(\.\d+)?\s*$/;

/** A student's typed answer as a value (or a reason it can't be read). */
export function readAnswer(
  input: string,
): { ok: true; value: Value } | { ok: false; message: string } {
  try {
    const mixed = MIXED.exec(input);
    if (mixed) {
      const [, sign, w, n, d] = mixed;
      const v = add(fromInt(BigInt(w!)), fromRational(rational(BigInt(n!), BigInt(d!))));
      return { ok: true, value: sign ? neg(v) : v };
    }
    const text = GROUPED.test(input) ? input.replace(/,/g, '') : input;
    return { ok: true, value: evaluate(text) };
  } catch (e) {
    return { ok: false, message: e instanceof MathError ? e.message : 'I can’t read that answer' };
  }
}

/** Light TeX → expression conversion, for reading answer choices like "$\frac{3}{4}$". */
export function texToExpression(tex: string): string {
  let s = tex.trim().replace(/^\$+|\$+$/g, '');
  for (let k = 0; k < 4; k += 1)
    s = s
      .replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '(($1)/($2))')
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, 'sqrt($1)');
  return s
    .replace(/\\sqrt\s*(\d+)/g, 'sqrt($1)')
    .replace(/\\pi/g, 'pi')
    .replace(/\\(cdot|times)/g, '*')
    .replace(/\\left|\\right|\\!|\\,|\\;/g, '')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
    .replace(/\\%|%/g, '/100')
    .replace(/\\text\(([^()]*)\)/g, '$1');
}
