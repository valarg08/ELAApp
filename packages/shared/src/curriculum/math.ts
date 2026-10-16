import {
  ANSWER_FORMS,
  CHOICE_LETTERS,
  checkAnswer,
  choiceValue,
  contentValue,
  equal,
  format,
  hasForm,
  type Value,
} from '@storyforge/math-check';
import { z } from 'zod';

/**
 * Math track problems (DESIGN.md §9.13): AMC-style problems with an answer the code checks.
 * Every problem is original (never copied or reworded from a past AMC). `compute` is an
 * expression content:check evaluates to prove the stored answer right.
 */

const text = (max = 2000) => z.string().trim().min(1).max(max);
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Use lowercase letters, numbers and dashes');

export interface MathSegment {
  math: boolean;
  text: string;
}

/**
 * Split text into plain and $…$ math pieces. `\$` is a literal dollar sign (for money); `ok` is
 * false when a `$` is left open.
 */
export function splitMath(value: string): { segments: MathSegment[]; ok: boolean } {
  const segments: MathSegment[] = [];
  let current = '';
  let math = false;
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i]!;
    if (ch === '\\' && value[i + 1] === '$') {
      current += math ? '\\$' : '$';
      i += 1;
    } else if (ch === '$') {
      if (current) segments.push({ math, text: current });
      current = '';
      math = !math;
    } else {
      current += ch;
    }
  }
  if (current) segments.push({ math, text: current });
  return { segments, ok: !math };
}

export const ChoiceLetter = z.enum(CHOICE_LETTERS);
export const AnswerFormId = z.enum(ANSWER_FORMS);

/** The five AMC choices (A–E), each TeX or plain text, and the right letter. */
export const ChoiceAnswer = z.object({
  kind: z.literal('choice'),
  choices: z.tuple([text(200), text(200), text(200), text(200), text(200)]),
  correct: ChoiceLetter,
});

/** A typed answer: accepted values (all equal) and the form it must be written in. */
export const ValueAnswer = z.object({
  kind: z.literal('value'),
  accepted: z.array(text(100)).min(1).max(6),
  form: AnswerFormId.default('any'),
});

export const MathAnswer = z.discriminatedUnion('kind', [ChoiceAnswer, ValueAnswer]);
export type MathAnswer = z.infer<typeof MathAnswer>;

/** A figure: an SVG file next to the unit's JSON (the loader inlines it as `svg`). */
export const MathFigure = z.object({
  file: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*\.svg$/, 'Figures are .svg files named like "square-1.svg"'),
  alt: text(400),
  svg: z.string().max(60_000).optional(),
});
export type MathFigure = z.infer<typeof MathFigure>;

export const MathProblem = z.object({
  id,
  /** Text with $…$ for math (rendered with KaTeX). */
  prompt: text(1500),
  figure: MathFigure.optional(),
  answer: MathAnswer,
  /** Shown one at a time in practice; never in marked sets. */
  hints: z.array(text(400)).max(3).default([]),
  solution: text(3000),
  skill: text(60),
  difficulty: z.number().int().min(1).max(5),
  /** An expression whose value is the answer, e.g. "binom(8,3) - binom(5,3)". */
  compute: text(300).optional(),
});
export type MathProblem = z.infer<typeof MathProblem>;

/** A problem as a marked set hands it out: no answer, hints or solution. */
export const MathProblemPublic = z.object({
  id,
  prompt: z.string(),
  figure: MathFigure.optional(),
  choices: z.array(z.string()).optional(),
  form: AnswerFormId.optional(),
  difficulty: z.number().int(),
});
export type MathProblemPublic = z.infer<typeof MathProblemPublic>;

export const publicProblem = (p: MathProblem): MathProblemPublic => ({
  id: p.id,
  prompt: p.prompt,
  figure: p.figure,
  ...(p.answer.kind === 'choice' ? { choices: [...p.answer.choices] } : { form: p.answer.form }),
  difficulty: p.difficulty,
});

/** The right answer as shown in a review: "C" for choices, the first accepted value otherwise. */
export const answerLabel = (p: MathProblem) =>
  p.answer.kind === 'choice'
    ? `(${p.answer.correct}) ${p.answer.choices[CHOICE_LETTERS.indexOf(p.answer.correct)]}`
    : p.answer.accepted[0]!;

/** The value the answer stands for (null when a choice isn't a number, like "none of these"). */
function answerValue(p: MathProblem): Value | null {
  if (p.answer.kind === 'choice')
    return choiceValue(p.answer.choices[CHOICE_LETTERS.indexOf(p.answer.correct)]!);
  return contentValue(p.answer.accepted[0]!);
}

/** content:check for one problem: answers parse, agree, have their form, and match `compute`. */
export function problemErrors(where: string, p: MathProblem): string[] {
  const errors: string[] = [];
  const at = `${where}/${p.id}`;
  try {
    if (p.answer.kind === 'choice') {
      const values = p.answer.choices.map(choiceValue);
      const right = values[CHOICE_LETTERS.indexOf(p.answer.correct)];
      if (right) {
        const same = values.filter((v) => v && equal(v, right)).length;
        if (same !== 1) errors.push(`${at}: the right value appears in ${same} choices`);
      }
      if (new Set(p.answer.choices).size !== 5) errors.push(`${at}: two choices are the same`);
    } else {
      const [first, ...rest] = p.answer.accepted.map(contentValue);
      for (const [i, v] of rest.entries())
        if (!equal(v, first!))
          errors.push(`${at}: accepted "${p.answer.accepted[i + 1]}" differs from the first`);
      const { form } = p.answer;
      if (!p.answer.accepted.some((a) => hasForm(a, form)))
        errors.push(`${at}: no accepted answer is written as the form "${p.answer.form}"`);
    }
    if (p.compute) {
      const want = contentValue(p.compute);
      const have = answerValue(p);
      if (!have) errors.push(`${at}: compute is set but the answer is not a number`);
      else if (!equal(want, have))
        errors.push(`${at}: compute gives ${format(want)}, but the answer is ${format(have)}`);
    }
  } catch (e) {
    errors.push(`${at}: ${e instanceof Error ? e.message : 'cannot read the answer'}`);
  }
  return errors;
}

export type Verdict = 'correct' | 'wrong' | 'form' | 'blank';

/**
 * Mark one answer (practice in the browser, marked sets and redos on the server): a letter A–E for
 * choice problems, a typed value otherwise. A right value in the wrong form is "form" (not counted
 * as right in a marked set); text math-check can't read is "wrong" in a marked set, so practice
 * shows `message` instead.
 */
export function markAnswer(
  p: MathProblem,
  given: string,
): { verdict: Verdict; message: string; readable: boolean } {
  const g = given.trim();
  if (!g) return { verdict: 'blank', message: 'No answer yet.', readable: true };
  if (p.answer.kind === 'choice') {
    const right = g.toUpperCase() === p.answer.correct;
    return {
      verdict: right ? 'correct' : 'wrong',
      message: right ? 'Correct!' : 'Not quite.',
      readable: true,
    };
  }
  const check = checkAnswer(g, p.answer.accepted, p.answer.form);
  if (check.status === 'invalid')
    return { verdict: 'wrong', message: check.message, readable: false };
  return { verdict: check.status, message: check.message, readable: true };
}
