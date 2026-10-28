import {
  ANSWER_FORMS,
  CHOICE_LETTERS,
  type ChoiceLetter as ChoiceLetterType,
  checkAnswer,
  choiceValue,
  contentValue,
  equal,
  format,
  formatDecimal,
  formatTex,
  hasForm,
  holds,
  readAnswer,
  type Value,
} from '@storyforge/math-check';
import { z } from 'zod';

/**
 * Math track problems (math-design.md): AMC-style problems with an answer the code checks.
 * Every problem is original (never copied or reworded from a past AMC). `compute` is an
 * expression content:check evaluates to prove the stored answer right. A `template` turns one
 * problem into many verified variants (new numbers each time), picked by a seed.
 */

const text = (max = 2000) => z.string().trim().min(1).max(max);
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Use lowercase letters, numbers and dashes');

export interface MathSegment {
  math: boolean;
  /** `$$…$$` display math, set on its own centred line. */
  display?: boolean;
  text: string;
}

/**
 * Split text into plain, $…$ inline math and $$…$$ display math pieces. `\$` is a literal dollar
 * sign (for money); `ok` is false when a `$` or `$$` is left open.
 */
export function splitMath(value: string): { segments: MathSegment[]; ok: boolean } {
  const segments: MathSegment[] = [];
  let current = '';
  let mode: 'text' | 'inline' | 'display' = 'text';
  const flush = () => {
    if (current)
      segments.push(
        mode === 'display'
          ? { math: true, display: true, text: current }
          : { math: mode === 'inline', text: current },
      );
    current = '';
  };
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i]!;
    if (ch === '\\' && value[i + 1] === '$') {
      current += mode === 'text' ? '$' : '\\$';
      i += 1;
    } else if (ch === '$' && value[i + 1] === '$' && mode !== 'inline') {
      flush();
      mode = mode === 'display' ? 'text' : 'display';
      i += 1;
    } else if (ch === '$' && mode !== 'display') {
      flush();
      mode = mode === 'inline' ? 'text' : 'inline';
    } else {
      current += ch;
    }
  }
  flush();
  return { segments, ok: mode === 'text' };
}

// ───────── Strands and skills ─────────

export const MATH_STRAND_IDS = [
  'strategy',
  'algebra',
  'number-theory',
  'counting',
  'geometry',
] as const;
export const MathStrandId = z.enum(MATH_STRAND_IDS);
export type MathStrandId = z.infer<typeof MathStrandId>;

/** One AMC skill (content/math/skills.json): problems and Math lessons name skills by id. */
export const MathSkill = z.object({
  id,
  label: text(80),
  strand: MathStrandId,
  units: z.array(z.number().int().min(1).max(15)).min(1).max(15),
});
export type MathSkill = z.infer<typeof MathSkill>;

export const MathSkillsFile = z.array(MathSkill).min(1).max(150);

// ───────── Answers ─────────

export const ChoiceLetter = z.enum(CHOICE_LETTERS);
export const AnswerFormId = z.enum(ANSWER_FORMS);

/** The five AMC choices (A–E) or the four PSAT ones (A–D), each TeX or plain text, and the right letter. */
export const ChoiceAnswer = z.object({
  kind: z.literal('choice'),
  choices: z.union([
    z.tuple([text(200), text(200), text(200), text(200), text(200)]),
    z.tuple([text(200), text(200), text(200), text(200)]),
  ]),
  correct: ChoiceLetter,
  /** Why a wrong choice is wrong, shown the moment it is picked (no AI needed). */
  why: z.partialRecord(ChoiceLetter, text(300)).optional(),
});

/** A wrong typed answer we expect, and why it is wrong. */
export const MathMistake = z.object({ value: text(100), why: text(300) });

/** A typed answer: accepted values (all equal) and the form it must be written in. */
export const ValueAnswer = z.object({
  kind: z.literal('value'),
  accepted: z.array(text(100)).min(1).max(6),
  form: AnswerFormId.default('any'),
  /** Expected wrong answers: a wrong answer equal to one of these gets its note. */
  mistakes: z.array(MathMistake).max(6).default([]),
});

export const MathAnswer = z.discriminatedUnion('kind', [ChoiceAnswer, ValueAnswer]);
export type MathAnswer = z.infer<typeof MathAnswer>;

/** A figure: an SVG file next to the unit's JSON (the loader inlines it as `svg`). */
export const MathFigure = z.object({
  file: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*\.svg$/, 'Figures are .svg files named like "square-1.svg"'),
  alt: text(400),
  /** As on the AMC, figures are "not drawn to scale" unless they say so. */
  scale: z.enum(['to-scale', 'not-to-scale']).default('not-to-scale'),
  svg: z.string().max(60_000).optional(),
});
export type MathFigure = z.infer<typeof MathFigure>;

// ───────── Templates ─────────

const RESERVED = new Set([
  'pi',
  'sqrt',
  'and',
  'or',
  'binom',
  'gcd',
  'lcm',
  'floor',
  'ceil',
  'abs',
  'min',
  'max',
  'mod',
  'fact',
]);

const VarName = z
  .string()
  .regex(/^[a-z]+$/, 'Template variables are lowercase letters only (like "a" or "side")')
  .refine((n) => !RESERVED.has(n), 'That name is a function or keyword');

/** A template variable: a whole-number range, a list to choose from, or a value from the others. */
export const TemplateVar = z.union([
  z.object({
    from: z.number().int(),
    to: z.number().int(),
    step: z.number().int().min(1).default(1),
  }),
  z.object({
    choose: z
      .array(z.union([z.number(), text(30)]))
      .min(1)
      .max(60),
  }),
  z.object({ let: text(200) }),
]);
export type TemplateVar = z.infer<typeof TemplateVar>;

/**
 * Numbers that change each time: `[[expr]]` in the prompt, hints, solution, choices, accepted
 * answers and notes is filled with the value (TeX inside $…$, "3/4" outside; `[[expr|decimal]]`
 * writes a terminating decimal like 100.5). `where` conditions filter the
 * variants (== != < <= > >=, and, or); `compute` may use the variables directly.
 */
export const MathTemplate = z.object({
  vars: z.record(VarName, TemplateVar).refine((v) => {
    const n = Object.keys(v).length;
    return n >= 1 && n <= 6;
  }, 'A template has 1 to 6 variables'),
  where: z.array(text(200)).max(8).default([]),
});
export type MathTemplate = z.infer<typeof MathTemplate>;

export const MathProblem = z.object({
  id,
  /** Text with $…$ for math (rendered with KaTeX). */
  prompt: text(1500),
  figure: MathFigure.optional(),
  answer: MathAnswer,
  /** Shown one at a time in practice; never in marked sets. */
  hints: z.array(text(400)).max(3).default([]),
  solution: text(3000),
  /** A skill id from content/math/skills.json (its strand comes from the skill). */
  skill: text(60),
  difficulty: z.number().int().min(1).max(5),
  /** An expression whose value is the answer, e.g. "binom(8,3) - binom(5,3)". */
  compute: text(300).optional(),
  template: MathTemplate.optional(),
});
export type MathProblem = z.infer<typeof MathProblem>;

/** A problem as shown, after a template is filled: `seed` says which variant. */
export type MathVariant = MathProblem & { seed?: number };

/** At most this many combinations are tried; content:check rejects bigger templates. */
export const MAX_TEMPLATE_COMBINATIONS = 20_000;
/** content:check checks every variant up to this many, else an even sample of this many. */
export const MAX_CHECKED_VARIANTS = 500;
/** A template must allow at least this many variants. */
export const MIN_TEMPLATE_VARIANTS = 5;

type Vars = Record<string, Value>;

const varValue = (v: number | string) => contentValue(String(v));

/** Every assignment of the variables that passes `where` (throws for bad templates). */
function enumerate(template: MathTemplate): Vars[] {
  const entries = Object.entries(template.vars);
  const free = entries.filter(([, v]) => !('let' in v));
  const domains = free.map(([name, v]) => {
    if ('choose' in v) return { name, values: v.choose.map(varValue) };
    if ('from' in v) {
      if (v.to < v.from) throw new Error(`variable "${name}": "to" is less than "from"`);
      const values: Value[] = [];
      for (let x = v.from; x <= v.to && values.length <= 1000; x += v.step)
        values.push(varValue(x));
      return { name, values };
    }
    return { name, values: [] };
  });
  const combos = domains.reduce((n, d) => n * d.values.length, 1);
  if (combos > MAX_TEMPLATE_COMBINATIONS)
    throw new Error(
      `the template has ${combos} combinations; keep it under ${MAX_TEMPLATE_COMBINATIONS}`,
    );
  const out: Vars[] = [];
  const pick = (i: number, vars: Vars) => {
    if (i === domains.length) {
      const all = { ...vars };
      for (const [name, v] of entries) if ('let' in v) all[name] = contentValue(v.let, all);
      if (template.where.every((c) => holds(c, all))) out.push(all);
      return;
    }
    const d = domains[i]!;
    for (const value of d.values) pick(i + 1, { ...vars, [d.name]: value });
  };
  pick(0, {});
  return out;
}

const cache = new WeakMap<MathTemplate, Vars[]>();

/** The template's variants (cached per problem). */
export function templateVariants(template: MathTemplate): Vars[] {
  let list = cache.get(template);
  if (!list) {
    list = enumerate(template);
    cache.set(template, list);
  }
  return list;
}

/** Fill `[[expr]]` placeholders: TeX inside $…$ and $$…$$, plain text ("3/4", "2√3") outside. */
export function fillPlaceholders(value: string, vars: Readonly<Vars>): string {
  if (!value.includes('[[')) return value;
  let out = '';
  // The same modes as splitMath, so a placeholder is TeX exactly when it is rendered as math.
  let mode: 'text' | 'inline' | 'display' = 'text';
  let i = 0;
  while (i < value.length) {
    const ch = value[i]!;
    const math = mode !== 'text';
    if (ch === '\\' && value[i + 1] === '$') {
      out += '\\$';
      i += 2;
    } else if (ch === '$' && value[i + 1] === '$' && mode !== 'inline') {
      mode = mode === 'display' ? 'text' : 'display';
      out += '$$';
      i += 2;
    } else if (ch === '$' && mode !== 'display') {
      mode = mode === 'inline' ? 'text' : 'inline';
      out += ch;
      i += 1;
    } else if (value.startsWith('[[', i)) {
      const end = value.indexOf(']]', i);
      if (end === -1) throw new Error(`"[[" is not closed in "${value.slice(i, i + 20)}"`);
      const [expr = '', style] = value.slice(i + 2, end).split('|');
      const v = contentValue(expr, vars);
      if (style?.trim() === 'decimal') out += formatDecimal(v);
      else if (style !== undefined) throw new Error(`unknown placeholder style "${style}"`);
      else out += math ? formatTex(v) : format(v);
      i = end + 2;
    } else {
      out += ch;
      i += 1;
    }
  }
  return out;
}

/** A problem with every text filled for these variables (template removed; compute kept). */
function fillProblem(p: MathProblem, vars: Readonly<Vars>): MathProblem {
  const f = (s: string) => fillPlaceholders(s, vars);
  const answer: MathAnswer =
    p.answer.kind === 'choice'
      ? {
          ...p.answer,
          choices: p.answer.choices.map(f) as typeof p.answer.choices,
          ...(p.answer.why
            ? {
                why: Object.fromEntries(
                  Object.entries(p.answer.why).map(([k, w]) => [k, f(w ?? '')]),
                ),
              }
            : {}),
        }
      : {
          ...p.answer,
          accepted: p.answer.accepted.map(f),
          mistakes: p.answer.mistakes.map((m) => ({ value: f(m.value), why: f(m.why) })),
        };
  const { template: _template, ...rest } = p;
  return {
    ...rest,
    prompt: f(p.prompt),
    hints: p.hints.map(f),
    solution: f(p.solution),
    answer,
    ...(p.figure ? { figure: { ...p.figure, alt: f(p.figure.alt) } } : {}),
  };
}

/** A new random seed for a template variant. */
export const newSeed = () => Math.floor(Math.random() * 2_147_483_647);

/** The variant a seed picks (a problem without a template is returned as it is). */
export function problemVariant(p: MathProblem, seed?: number): MathVariant {
  if (!p.template) return p;
  const list = templateVariants(p.template);
  if (list.length === 0) return p;
  const s = seed ?? newSeed();
  const filled = fillProblem(p, list[Math.abs(s) % list.length]!);
  const { compute: _compute, ...rest } = filled;
  return { ...rest, seed: s };
}

/** "id" or "id#seed": how attempts and the answer record name a variant. */
export const problemRef = (problemId: string, seed?: number) =>
  seed === undefined ? problemId : `${problemId}#${seed}`;

export function parseProblemRef(ref: string): { problemId: string; seed?: number } {
  const [problemId = '', seed] = ref.split('#');
  const n = seed === undefined ? Number.NaN : Number(seed);
  return Number.isInteger(n) ? { problemId, seed: n } : { problemId };
}

// ───────── Public views and marking ─────────

/** A problem as a marked set hands it out: no answer, hints or solution. */
export const MathProblemPublic = z.object({
  id,
  prompt: z.string(),
  figure: MathFigure.optional(),
  choices: z.array(z.string()).optional(),
  form: AnswerFormId.optional(),
  difficulty: z.number().int(),
  /** The template variant shown, if the problem has a template. */
  seed: z.number().int().optional(),
});
export type MathProblemPublic = z.infer<typeof MathProblemPublic>;

export const publicProblem = (p: MathVariant): MathProblemPublic => ({
  id: p.id,
  prompt: p.prompt,
  figure: p.figure,
  ...(p.answer.kind === 'choice' ? { choices: [...p.answer.choices] } : { form: p.answer.form }),
  difficulty: p.difficulty,
  ...(p.seed === undefined ? {} : { seed: p.seed }),
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

/** Answer checks for one concrete problem; `vars` are the template variables for `compute`. */
function answerErrors(at: string, p: MathProblem, vars?: Readonly<Vars>): string[] {
  const errors: string[] = [];
  if (p.answer.kind === 'choice') {
    const values = p.answer.choices.map(choiceValue);
    const right = values[CHOICE_LETTERS.indexOf(p.answer.correct)];
    if (right) {
      const same = values.filter((v) => v && equal(v, right)).length;
      if (same !== 1) errors.push(`${at}: the right value appears in ${same} choices`);
    }
    if (new Set(p.answer.choices).size !== p.answer.choices.length)
      errors.push(`${at}: two choices are the same`);
    if (CHOICE_LETTERS.indexOf(p.answer.correct) >= p.answer.choices.length)
      errors.push(`${at}: the right letter ${p.answer.correct} has no choice`);
    if (p.answer.why?.[p.answer.correct])
      errors.push(`${at}: "why" explains the right letter ${p.answer.correct}`);
  } else {
    const [first, ...rest] = p.answer.accepted.map((a) => contentValue(a));
    for (const [i, v] of rest.entries())
      if (!equal(v, first!))
        errors.push(`${at}: accepted "${p.answer.accepted[i + 1]}" differs from the first`);
    const { form } = p.answer;
    if (!p.answer.accepted.some((a) => hasForm(a, form)))
      errors.push(`${at}: no accepted answer is written as the form "${p.answer.form}"`);
    const seen: Value[] = [];
    for (const m of p.answer.mistakes) {
      const v = contentValue(m.value);
      if (equal(v, first!)) errors.push(`${at}: the mistake "${m.value}" is the right answer`);
      if (seen.some((s) => equal(s, v)))
        errors.push(`${at}: the mistake "${m.value}" is listed twice`);
      seen.push(v);
    }
  }
  if (p.compute) {
    const want = contentValue(p.compute, vars);
    const have = answerValue(p);
    if (!have) errors.push(`${at}: compute is set but the answer is not a number`);
    else if (!equal(want, have))
      errors.push(`${at}: compute gives ${format(want)}, but the answer is ${format(have)}`);
  }
  return errors;
}

/** The variants content:check looks at: all of them, or an even sample of MAX_CHECKED_VARIANTS. */
export function checkedVariants(p: MathProblem): MathProblem[] {
  if (!p.template) return [p];
  const list = templateVariants(p.template);
  const step = Math.max(1, list.length / MAX_CHECKED_VARIANTS);
  const picked: MathProblem[] = [];
  for (let i = 0; i < list.length && picked.length < MAX_CHECKED_VARIANTS; i += step)
    picked.push(fillProblem(p, list[Math.floor(i)]!));
  return picked;
}

/**
 * content:check for one problem: answers parse, agree, have their form, and match `compute`; notes
 * don't explain the right answer; a template's variants each pass the same checks.
 */
export function problemErrors(where: string, p: MathProblem): string[] {
  const at = `${where}/${p.id}`;
  try {
    if (!p.template) return answerErrors(at, p);
    const list = templateVariants(p.template);
    if (list.length < MIN_TEMPLATE_VARIANTS)
      return [
        `${at}: the template allows ${list.length} variants (at least ${MIN_TEMPLATE_VARIANTS})`,
      ];
    const errors: string[] = [];
    const step = Math.max(1, list.length / MAX_CHECKED_VARIANTS);
    for (let i = 0; i < list.length && errors.length < 3; i += step) {
      const vars = list[Math.floor(i)]!;
      const label = Object.entries(vars)
        .map(([k, v]) => `${k}=${format(v)}`)
        .join(', ');
      try {
        errors.push(...answerErrors(`${at} (${label})`, fillProblem(p, vars), vars));
      } catch (e) {
        errors.push(
          `${at} (${label}): ${e instanceof Error ? e.message : 'cannot fill the template'}`,
        );
      }
    }
    return errors;
  } catch (e) {
    return [`${at}: ${e instanceof Error ? e.message : 'cannot read the answer'}`];
  }
}

export type Verdict = 'correct' | 'wrong' | 'form' | 'blank';

/** The authored note for a wrong answer, if there is one (choice "why" or a listed mistake). */
function wrongNote(p: MathProblem, given: string): string | null {
  if (p.answer.kind === 'choice')
    return p.answer.why?.[given.toUpperCase() as ChoiceLetterType] ?? null;
  const read = readAnswer(given);
  if (!read.ok) return null;
  for (const m of p.answer.mistakes) {
    try {
      if (equal(read.value, contentValue(m.value))) return m.why;
    } catch {
      // A note whose value can't be read never matches.
    }
  }
  return null;
}

/**
 * Mark one answer (practice in the browser, marked sets and redos on the server): a letter A–E for
 * choice problems, a typed value otherwise. A right value in the wrong form is "form" (not counted
 * as right in a marked set); text math-check can't read is "wrong" in a marked set, so practice
 * shows `message` instead. A wrong answer the problem expected gets its `note`.
 */
export function markAnswer(
  p: MathProblem,
  given: string,
): { verdict: Verdict; message: string; readable: boolean; note: string | null } {
  const g = given.trim();
  if (!g) return { verdict: 'blank', message: 'No answer yet.', readable: true, note: null };
  if (p.answer.kind === 'choice') {
    const right = g.toUpperCase() === p.answer.correct;
    return {
      verdict: right ? 'correct' : 'wrong',
      message: right ? 'Correct!' : 'Not quite.',
      readable: true,
      note: right ? null : wrongNote(p, g),
    };
  }
  const check = checkAnswer(g, p.answer.accepted, p.answer.form);
  if (check.status === 'invalid')
    return { verdict: 'wrong', message: check.message, readable: false, note: null };
  return {
    verdict: check.status,
    message: check.message,
    readable: true,
    note: check.status === 'wrong' ? wrongNote(p, g) : null,
  };
}
