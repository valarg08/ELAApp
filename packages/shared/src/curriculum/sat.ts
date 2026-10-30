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
