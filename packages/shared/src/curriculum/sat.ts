import { approx, contentValue, equal, readAnswer } from '@storyforge/math-check';
import { z } from 'zod';
import { MathAnswer, MathFigure } from './math.js';

/**
 * SAT Math (sat-design.md): the digital SAT's Math section as a weekly practice test, for students
 * in grades 8–10. The format and rules follow the College Board's digital SAT; the content areas
 * and their weights are our own (no trigonometry). Questions are original.
 */

/** The test's shape: two adaptive modules of 22 questions, 35 minutes each. */
export const SAT_FORMAT = {
  modules: 2,
  questionsPerModule: 22,
  minutesPerModule: 35,
  /** All 44 scored questions; the real test adds unscored trial questions, ours has none. */
  totalQuestions: 44,
  totalMinutes: 70,
  /** Multiple-choice questions have four choices, A to D; about one in four answers is typed. */
  choices: 4,
  typedShare: 0.25,
  typedPerWeek: 11,
} as const;

/** The SAT's content areas and the share of questions each one gets (sat-design.md §2). */
export const SAT_DOMAINS = [
  {
    id: 'algebra',
    label: 'Algebra',
    weight: 42.5,
    skills: [
      { id: 'linear-equations-1', label: 'Linear equations in 1 variable' },
      { id: 'linear-equations-2', label: 'Linear equations in 2 variables' },
      { id: 'linear-functions', label: 'Linear functions' },
      { id: 'systems', label: 'Systems of 2 linear equations in 2 variables' },
      { id: 'linear-inequalities', label: 'Linear inequalities in 1 or 2 variables' },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced Math',
    weight: 20,
    skills: [
      { id: 'equivalent-expressions', label: 'Equivalent expressions' },
      {
        id: 'nonlinear-equations',
        label: 'Nonlinear equations in 1 variable and systems of equations in 2 variables',
      },
      { id: 'nonlinear-functions', label: 'Nonlinear functions' },
    ],
  },
  {
    id: 'data',
    label: 'Problem-Solving and Data Analysis',
    weight: 25,
    skills: [
      { id: 'ratios-rates', label: 'Ratios, rates, proportional relationships, and units' },
      { id: 'percentages', label: 'Percentages' },
      {
        id: 'one-variable-data',
        label: 'One-variable data: distributions and measures of center and spread',
      },
      { id: 'two-variable-data', label: 'Two-variable data: models and scatterplots' },
      { id: 'probability', label: 'Probability and conditional probability' },
    ],
  },
  {
    id: 'geometry',
    label: 'Geometry',
    weight: 12.5,
    skills: [
      { id: 'area-volume', label: 'Area and volume' },
      {
        id: 'lines-angles-triangles',
        label: 'Lines, angles, and triangles, including right triangles',
      },
    ],
  },
] as const;

export type SatDomainId = (typeof SAT_DOMAINS)[number]['id'];
export type SatSkillId = (typeof SAT_DOMAINS)[number]['skills'][number]['id'];

/** Questions per content area in one module of 22. */
export type SatModuleCounts = Record<SatDomainId, number>;

/**
 * How a week's 44 questions split across the content areas. Weeks alternate between two plans so
 * that, over two weeks, each area gets its weight (18.5 / 9 / 11 / 5.5 questions on average).
 * Odd weeks: 19 / 9 / 11 / 5. Even weeks: 18 / 9 / 11 / 6.
 */
const PLAN_ODD: [SatModuleCounts, SatModuleCounts] = [
  { algebra: 10, advanced: 5, data: 5, geometry: 2 },
  { algebra: 9, advanced: 4, data: 6, geometry: 3 },
];
const PLAN_EVEN: [SatModuleCounts, SatModuleCounts] = [
  { algebra: 9, advanced: 4, data: 6, geometry: 3 },
  { algebra: 9, advanced: 5, data: 5, geometry: 3 },
];

/** The content-area counts for module 1 and module 2 of a week (week 1 is the first). */
export const satWeekPlan = (week: number): [SatModuleCounts, SatModuleCounts] =>
  week % 2 === 1 ? PLAN_ODD : PLAN_EVEN;

/** The rules shown first on the SAT page and again before each test starts (sat-design.md §3). */
export const SAT_RULES: { title: string; items: string[] }[] = [
  {
    title: 'The test',
    items: [
      'Math only: 2 modules of 22 questions, 35 minutes each. That is 44 questions in 70 minutes, with no break between the modules.',
      'The second module depends on the first. Do well in module 1 and module 2 has harder questions (and a higher score ceiling); otherwise it has easier ones.',
      'Inside a module the questions go from easier to harder. You can jump between questions and change answers until you submit the module.',
      'Once you submit module 1 you cannot go back to it. When the 35 minutes run out, the module is submitted for you.',
      'The clock is yours to hide, but it always comes back when 5 minutes are left.',
    ],
  },
  {
    title: 'The questions',
    items: [
      'About 3 in 4 are multiple choice with four choices (A, B, C, D) and exactly one right answer.',
      'About 1 in 4 are student-produced responses: you type the answer instead of choosing one.',
      'A wrong answer costs nothing, so answer every question, even if you have to guess.',
      'Mark a question for review to find it again from the question list. You can cross out choices you rule out.',
      'About 3 in 10 questions are set in real-life, science or social-studies situations.',
    ],
  },
  {
    title: 'Typing an answer',
    items: [
      'Type a whole number, a decimal or a fraction, such as 12, 0.75, -3.5 or 7/4.',
      'An answer can have at most 5 characters, or 6 if it is negative. The fraction bar and the decimal point count as characters.',
      'Do not type a mixed number such as 3 1/2 (type 7/2 or 3.5 instead), a percent sign, units, or a comma.',
      'If a decimal is too long to fit, round or cut it so that it fills the space (for example 0.3333 for one third).',
      'If a question has more than one right answer, type any one of them.',
    ],
  },
  {
    title: 'Tools',
    items: [
      'A calculator is allowed for the whole test.',
      'A reference sheet of area, volume and triangle facts is on screen all the time.',
      'Pictures are drawn as accurately as the question needs; unless it says "not drawn to scale", you can trust them.',
      'Numbers and variables are real numbers, and a function is defined for every real number that makes sense, unless the question says otherwise.',
    ],
  },
  {
    title: 'Your score and your week',
    items: [
      'You take one full test each week. Your score is an estimate on the 200 to 800 scale for the Math section, because the real conversion is secret; trust the trend more than any single number.',
      'After the test you see every question with its worked solution, and your results by content area and skill.',
      'All our questions are written by us. They follow the SAT style but are never copied from the College Board.',
    ],
  },
];

// ───────── Questions, weeks and the rules the code enforces ─────────

const SKILL_IDS = SAT_DOMAINS.flatMap((d) => d.skills.map((s) => s.id)) as [
  SatSkillId,
  ...SatSkillId[],
];
export const SatSkill = z.enum(SKILL_IDS);

/** The domain a skill belongs to. */
export const satDomainOfSkill = (skill: SatSkillId): SatDomainId =>
  SAT_DOMAINS.find((d) => (d.skills as readonly { id: string }[]).some((s) => s.id === skill))!.id;

const satText = (max: number) => z.string().trim().min(1).max(max);

/**
 * One SAT question (content/sat/week-XX/module-*.json). Like a Math problem, minus hints and
 * templates: `difficulty` runs 1 (easy) to 3 (hard) and a module lists its questions from easier to
 * harder. `compute` proves a typed answer right when content:check runs.
 */
export const SatQuestion = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Use lowercase letters, numbers and dashes'),
  prompt: satText(1500),
  figure: MathFigure.optional(),
  answer: MathAnswer,
  solution: satText(3000),
  skill: SatSkill,
  difficulty: z.number().int().min(1).max(3),
  compute: satText(300).optional(),
});
export type SatQuestion = z.infer<typeof SatQuestion>;

export const SAT_MODULE_KEYS = ['m1', 'm2-easy', 'm2-hard'] as const;
export const SatModuleKey = z.enum(SAT_MODULE_KEYS);
export type SatModuleKey = z.infer<typeof SatModuleKey>;

/** A module's file: its questions in the order they are asked. */
export const SatModuleFile = z.array(SatQuestion).min(1).max(22);

/** content/sat/week-XX/week.json. A `sample` week may be short; a real week has 3 × 22 questions. */
export const SatWeekFile = z.object({
  week: z.number().int().min(1).max(52),
  title: satText(80),
  sample: z.boolean().default(false),
  /** Minutes per module (35 in a real week). */
  minutes: z.number().int().min(1).max(35).default(35),
});
export type SatWeekFile = z.infer<typeof SatWeekFile>;

/** A typed answer is accepted when it reads as a number or fraction of at most this many characters. */
export const SAT_TYPED_MAX = 5;
export const SAT_TYPED_MAX_NEGATIVE = 6;

/**
 * The digital SAT's rules for a typed (student-produced) answer: a whole number, decimal or
 * fraction, at most 5 characters (6 when negative); no mixed numbers, percent signs, units or
 * commas. Returns what is wrong, or null when the answer can be checked.
 */
export function satTypedError(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (/^-?\d+\s+\d+\/\d+$/.test(v))
    return 'Do not type a mixed number. Type a fraction like 7/2 or a decimal like 3.5.';
  if (/[%$,]/.test(v)) return 'Do not type percent signs, dollar signs or commas.';
  if (!/^[-\d./]+$/.test(v)) return 'Use digits, a decimal point, a fraction bar or a minus sign.';
  if (!/^-?(\d+\.?\d*|\.\d+|\d+\/\d+)$/.test(v)) return 'That is not a number or a fraction.';
  if (v.includes('/') && /\/0+$/.test(v)) return 'A fraction cannot have 0 on the bottom.';
  const max = v.startsWith('-') ? SAT_TYPED_MAX_NEGATIVE : SAT_TYPED_MAX;
  if (v.length > max)
    return `Too long: at most ${SAT_TYPED_MAX} characters, or ${SAT_TYPED_MAX_NEGATIVE} for a negative answer.`;
  return null;
}

/**
 * Whether a typed answer is right: equal to an accepted value, or (like the real test) a decimal of
 * at least 3 places that is the accepted value rounded or cut to that many places.
 */
export function satTypedMatches(input: string, accepted: readonly string[]): boolean {
  const v = input.trim();
  if (!v || satTypedError(v)) return false;
  const read = readAnswer(v);
  if (!read.ok) return false;
  const decimals = /^-?\d*\.(\d+)$/.exec(v)?.[1]?.length ?? 0;
  const typed = Number(v);
  return accepted.some((a) => {
    try {
      const value = contentValue(a);
      if (equal(read.value, value)) return true;
      if (decimals < 3) return false;
      const exact = approx(value);
      const scale = 10 ** decimals;
      const near = (n: number) => Math.abs(n - typed) < 1e-9;
      return near(Math.round(exact * scale) / scale) || near(Math.trunc(exact * scale) / scale);
    } catch {
      return false;
    }
  });
}

/** Module 1 sends a student to the harder module 2 at this share of right answers (14 of 22). */
export const SAT_HARD_SHARE = 14 / 22;

/** Which module 2 follows module 1, from the module 1 result. */
export const satNextModule = (correct: number, total: number): 'm2-easy' | 'm2-hard' =>
  total > 0 && correct >= Math.ceil(total * SAT_HARD_SHARE - 1e-9) ? 'm2-hard' : 'm2-easy';

/** The reference sheet shown beside every question (TeX in $…$): area, volume, triangles. */
export const SAT_REFERENCE: { title: string; facts: string[] }[] = [
  {
    title: 'Area and perimeter',
    facts: [
      'Rectangle: $A = \\ell w$',
      'Triangle: $A = \\tfrac{1}{2}bh$',
      'Circle: $A = \\pi r^2$ and $C = 2\\pi r$',
    ],
  },
  {
    title: 'Volume',
    facts: [
      'Rectangular prism: $V = \\ell w h$',
      'Cylinder: $V = \\pi r^2 h$',
      'Sphere: $V = \\tfrac{4}{3}\\pi r^3$',
      'Cone: $V = \\tfrac{1}{3}\\pi r^2 h$',
      'Pyramid: $V = \\tfrac{1}{3}\\ell w h$',
    ],
  },
  {
    title: 'Triangles',
    facts: [
      'Pythagorean theorem: $a^2 + b^2 = c^2$',
      '45°-45°-90° triangle: sides $x$, $x$, $x\\sqrt{2}$',
      '30°-60°-90° triangle: sides $x$, $x\\sqrt{3}$, $2x$',
    ],
  },
  {
    title: 'Angles',
    facts: [
      'The angles of a triangle add to $180°$.',
      'A circle has $360°$, and a straight line $180°$.',
    ],
  },
];

// ───────── The score estimate (sat-design.md §5) ─────────

/** A question counts more the harder it is: difficulty 1, 2, 3 are worth 1, 1.5, 2. */
export const SAT_WEIGHT: Record<number, number> = { 1: 1, 2: 1.5, 3: 2 };

export interface SatScore {
  estimate: number;
  low: number;
  high: number;
}

/**
 * Our estimate of the 200–800 Math score (the College Board does not publish its conversion). The
 * share of the difficulty-weighted points earned is placed on a 400-point range that depends on
 * the module 2 the student reached: 200–600 after the easier one, 400–800 after the harder one.
 * Rounded to 10, with a band of 40 either side.
 */
export function satScoreEstimate(hardPath: boolean, earned: number, possible: number): SatScore {
  const share = possible > 0 ? earned / possible : 0;
  const raw = (hardPath ? 400 : 200) + 400 * share;
  const tidy = (n: number) => Math.min(800, Math.max(200, Math.round(n / 10) * 10));
  return { estimate: tidy(raw), low: tidy(raw - 40), high: tidy(raw + 40) };
}

// ───────── The weekly schedule (sat-design.md §3) ─────────

/** Days are "YYYY-MM-DD" strings; week 1 opens on a class's start date and each week 7 days later. */
const MS_DAY = 86_400_000;
const dayNumber = (date: string) =>
  Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))) /
  MS_DAY;

/** Whether a string is a real calendar day like 2026-11-02. */
export const isSatDate = (value: string): boolean =>
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) &&
  new Date(dayNumber(value) * MS_DAY).toISOString().slice(0, 10) === value;

export const satAddDays = (date: string, days: number): string =>
  new Date((dayNumber(date) + days) * MS_DAY).toISOString().slice(0, 10);

/** The day a week opens, given the class's start date. */
export const satWeekOpens = (startDate: string, week: number): string =>
  satAddDays(startDate, (week - 1) * 7);

/** Today's date in a time zone (UTC when the zone is unknown). */
export function satToday(timezone: string, now: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/** A week is open from its day on ("YYYY-MM-DD" strings compare in order). */
export const satWeekIsOpen = (opens: string, today: string): boolean => opens <= today;
