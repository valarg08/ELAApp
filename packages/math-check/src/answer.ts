import { readAnswer, texToExpression, evaluate } from './parse.js';
import { MathError, type Value, asRational, equal, gcd, squareFree } from './value.js';

/** The form a typed answer must take (stated in the problem, as on the AMC). */
export const ANSWER_FORMS = [
  'any',
  'integer',
  'fraction',
  'mixed',
  'decimal',
  'radical',
  'pi',
] as const;
export type AnswerForm = (typeof ANSWER_FORMS)[number];

/** How the form is asked for, finishing "Now write it …". */
export const FORM_LABELS: Record<AnswerForm, string> = {
  any: 'as a number',
  integer: 'as a whole number',
  fraction: 'as a common fraction in lowest terms (like 3/4)',
  mixed: 'as a mixed number (like 2 1/3)',
  decimal: 'as a decimal',
  radical: 'in simplest radical form (like 2√3)',
  pi: 'in terms of π (like 4π)',
};

export const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
export type ChoiceLetter = (typeof CHOICE_LETTERS)[number];

export type AnswerStatus = 'correct' | 'form' | 'wrong' | 'invalid';

export interface AnswerCheck {
  status: AnswerStatus;
  /** Shown to the student: why it is not accepted yet ("Right value! Write it as …"). */
  message: string;
}

const clean = (s: string) => s.trim().replace(/−/g, '-').replace(/\s+/g, ' ');

/** Whether the typed answer has the asked-for form (its value is checked separately). */
export function hasForm(input: string, form: AnswerForm): boolean {
  const s = clean(input);
  switch (form) {
    case 'any':
      return true;
    case 'integer':
      return /^-?\d{1,3}(,\d{3})*$|^-?\d+$/.test(s);
    case 'fraction': {
      const m = /^-?(\d+)(?:\s*\/\s*(\d+))?$/.exec(s);
      if (!m) return false;
      return !m[2] || (gcd(BigInt(m[1]!), BigInt(m[2])) === 1n && m[2] !== '1');
    }
    case 'mixed': {
      if (/^-?\d+$/.test(s)) return true;
      const m = /^-?(?:(\d+) )?(\d+)\s*\/\s*(\d+)$/.exec(s);
      if (!m) return false;
      const n = BigInt(m[2]!);
      const d = BigInt(m[3]!);
      return n < d && gcd(n, d) === 1n;
    }
    case 'decimal':
      return /^-?(\d+\.?\d*|\.\d+)$/.test(s);
    case 'radical': {
      if (/\./.test(s)) return false;
      // Every root holds a square-free whole number, and no root is left in a denominator.
      const roots = [...s.matchAll(/(?:√|sqrt)\s*\(?\s*([^)\s+*/-]*)/g)].map((m) => m[1] ?? '');
      if (roots.length === 0) return false;
      for (const r of roots) {
        if (!/^\d+$/.test(r)) return false;
        const n = BigInt(r);
        if (n < 2n || squareFree(n).outside !== 1n) return false;
      }
      return !/\/\s*\(?[^)]*(√|sqrt)/.test(s);
    }
    case 'pi':
      return /π|pi/i.test(s) && !/\./.test(s);
    default:
      return false;
  }
}

/**
 * The value of an accepted answer or a compute expression (content, so functions are allowed, and
 * template variables when given).
 */
export function contentValue(expression: string, vars?: Readonly<Record<string, Value>>): Value {
  return evaluate(expression, { functions: true, vars });
}

/**
 * Check a typed answer against the accepted answers (DESIGN.md §9.13): the value decides, exactly;
 * a right value in the wrong form is "form", never "wrong".
 */
export function checkAnswer(
  input: string,
  accepted: readonly string[],
  form: AnswerForm = 'any',
): AnswerCheck {
  if (!input.trim()) return { status: 'invalid', message: 'Type an answer first.' };
  const read = readAnswer(input);
  if (!read.ok) return { status: 'invalid', message: `${read.message}. Check what you typed.` };
  const right = accepted.some((a) => {
    try {
      return equal(read.value, contentValue(a));
    } catch {
      return false;
    }
  });
  if (!right) return { status: 'wrong', message: 'Not quite.' };
  if (!hasForm(input, form))
    return { status: 'form', message: `Right value! Now write it ${FORM_LABELS[form]}.` };
  return { status: 'correct', message: 'Correct!' };
}

/** The value of an answer choice written in TeX or plain text, or null when it isn't a number. */
export function choiceValue(choice: string): Value | null {
  try {
    return evaluate(texToExpression(choice), { functions: true });
  } catch {
    return null;
  }
}

/** Whether a value is a whole number (for messages and integer-only answers). */
export function isInteger(v: Value): boolean {
  const r = asRational(v);
  return !!r && r.d === 1n;
}

export { MathError };
