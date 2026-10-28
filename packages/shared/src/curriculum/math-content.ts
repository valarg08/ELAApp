import { z } from 'zod';
import {
  type MathProblem,
  MathProblem as MathProblemSchema,
  MathSkill,
  problemErrors,
} from './math.js';

/**
 * Math-wide content (math-design.md §3): files in content/math beside the units. The skill list,
 * the four stages, the timed tests (the diagnostic, the checkpoint mocks and the Unit 15 mocks) and
 * each unit's fact sheet. The loader validates them and the sync stores them in MathContent.
 */

const text = (max = 2000) => z.string().trim().min(1).max(max);

// ───────── Timed tests: the diagnostic, the checkpoint mocks and the Unit 15 mocks ─────────

/** The Unit 15 mocks, taken inside a lesson through a MOCK_TEST activity (math-design.md §4.15). */
export const MATH_MOCK_KEYS = ['mock-a', 'mock-b', 'mock-c', 'mock-final'] as const;
export const MATH_TEST_KEYS = [
  'diagnostic',
  'checkpoint-1',
  'checkpoint-2',
  ...MATH_MOCK_KEYS,
] as const;
export const MathTestKey = z.enum(MATH_TEST_KEYS);
export type MathTestKey = z.infer<typeof MathTestKey>;
export const isMockKey = (key: string): boolean =>
  (MATH_MOCK_KEYS as readonly string[]).includes(key);

/** content/math/tests/<key>.json: 25 original AMC-style choice problems (fewer while drafting). */
export const MathTestFile = z.object({
  key: MathTestKey,
  title: text(120),
  instructions: text(800),
  /** No limit for the diagnostic; 75 for a full mock. */
  timeLimitMinutes: z.number().int().min(5).max(90).nullable(),
  /** Unlocks once this Math unit's ⭐ check is passed (none: always open). */
  afterUnit: z.number().int().min(1).max(15).nullable(),
  problems: z.array(MathProblemSchema).min(1).max(30),
});
export type MathTestFile = z.infer<typeof MathTestFile>;

// ───────── Fact sheets ─────────

/** content/math/unit-XX/facts.json: the unit's one-page summary, by skill. */
export const MathFactsFile = z.object({
  sections: z
    .array(
      z.object({
        skill: text(60),
        title: text(120),
        facts: z.array(text(400)).min(1).max(12),
      }),
    )
    .min(1)
    .max(10),
});
export type MathFactsFile = z.infer<typeof MathFactsFile>;

// ───────── Stages ─────────

export const MathStageItem = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('diagnostic') }),
  z.object({
    kind: z.literal('unit'),
    unit: z.number().int().min(1).max(15),
    /** Only these lessons of the unit (Unit 15 is split across stages 3 and 4). */
    lessons: z.object({ from: z.number().int().min(1), to: z.number().int().min(1) }).optional(),
  }),
  z.object({ kind: z.literal('checkpoint'), key: MathTestKey }),
  z.object({ kind: z.literal('sprints') }),
  z.object({ kind: z.literal('light-review') }),
  z.object({ kind: z.literal('fact-sheets') }),
]);
export type MathStageItem = z.infer<typeof MathStageItem>;

/** content/math/stages.json: labels only; the unit order and unlocking don't change. */
export const MathStagesFile = z
  .array(
    z.object({
      number: z.number().int().min(1).max(4),
      title: text(80),
      focus: text(300),
      items: z.array(MathStageItem).min(1).max(20),
    }),
  )
  .length(4);
export type MathStagesFile = z.infer<typeof MathStagesFile>;

/** Everything Math-wide the loader found (absent files are undefined). */
export interface MathContentBundle {
  skills: MathSkill[];
  stages?: MathStagesFile;
  tests: MathTestFile[];
  /** Fact sheets by unit number. */
  facts: Record<number, MathFactsFile>;
  /** content/math/psat-facts.json: the PSAT review fact sheet. */
  psatFacts?: MathFactsFile;
}

/** What the units look like, for the cross-checks below. */
export interface MathUnitSummary {
  number: number;
  lessonCount: number;
  problems: MathProblem[];
  focusSkills: string[];
  /** Tests taken in this unit's lessons (MOCK_TEST activities). */
  mockTests: string[];
}

/**
 * Cross-checks for the Math-wide content: skill ids are unique and every problem, lesson focus
 * skill and fact-sheet section names one; test problems are verified and are choice problems; each
 * unit (or Unit 15 lesson) and each test belongs to exactly one stage.
 */
export function validateMathContent(
  bundle: MathContentBundle,
  units: readonly MathUnitSummary[],
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const s of bundle.skills) {
    if (ids.has(s.id)) errors.push(`skills.json: duplicate skill "${s.id}"`);
    ids.add(s.id);
  }
  const known = (where: string, skill: string) => {
    if (!ids.has(skill)) errors.push(`${where}: unknown skill "${skill}" (add it to skills.json)`);
  };

  for (const u of units) {
    const where = `math/unit-${String(u.number).padStart(2, '0')}`;
    for (const p of u.problems) known(`${where}/${p.id}`, p.skill);
    for (const s of u.focusSkills) known(`${where}: focusSkills`, s);
  }
  for (const [n, facts] of Object.entries(bundle.facts)) {
    for (const s of facts.sections) known(`math/unit-${n.padStart(2, '0')}/facts.json`, s.skill);
    if (!units.some((u) => u.number === Number(n)))
      errors.push(`math/unit-${n.padStart(2, '0')}/facts.json: the unit doesn't exist`);
  }
  for (const s of bundle.psatFacts?.sections ?? []) known('math/psat-facts.json', s.skill);

  const testKeys = new Set<string>();
  for (const t of bundle.tests) {
    const where = `math/tests/${t.key}.json`;
    if (testKeys.has(t.key)) errors.push(`${where}: duplicate test key`);
    testKeys.add(t.key);
    const pids = t.problems.map((p) => p.id);
    if (new Set(pids).size !== pids.length) errors.push(`${where}: duplicate problem ids`);
    for (const p of t.problems) {
      known(`${where}/${p.id}`, p.skill);
      if (p.answer.kind !== 'choice')
        errors.push(`${where}/${p.id}: test problems have choices (A)–(E), as on the AMC`);
      errors.push(...problemErrors(where, p));
    }
    if (t.afterUnit !== null && !units.some((u) => u.number === t.afterUnit))
      errors.push(`${where}: afterUnit ${t.afterUnit} doesn't exist`);
  }

  // The Unit 15 mocks are taken in lessons: each mock test is used by exactly one MOCK_TEST activity.
  const inLessons = new Map<string, number>();
  for (const u of units)
    for (const key of u.mockTests) {
      const where = `math/unit-${String(u.number).padStart(2, '0')}`;
      if (!isMockKey(key)) errors.push(`${where}: "${key}" is not a mock test (mock-a…mock-final)`);
      else if (!testKeys.has(key))
        errors.push(`${where}: mock test "${key}" has no tests/${key}.json`);
      if (inLessons.has(key)) errors.push(`${where}: mock test "${key}" is used twice`);
      inLessons.set(key, u.number);
    }
  for (const t of bundle.tests)
    if (isMockKey(t.key) && !inLessons.has(t.key))
      errors.push(`math/tests/${t.key}.json: no MOCK_TEST activity uses this mock`);

  if (bundle.stages) {
    const numbers = bundle.stages.map((s) => s.number);
    if (numbers.some((n, i) => n !== i + 1))
      errors.push('stages.json: stages must be numbered 1–4');
    // Unit (or lesson) coverage: every lesson of every unit in exactly one stage.
    const placed = new Map<string, number>();
    const place = (key: string, stage: number) => {
      if (placed.has(key)) errors.push(`stages.json: ${key} is in two stages`);
      placed.set(key, stage);
    };
    for (const stage of bundle.stages) {
      for (const item of stage.items) {
        if (item.kind === 'unit') {
          if (!item.lessons) place(`unit ${item.unit}`, stage.number);
          else if (item.lessons.to < item.lessons.from)
            errors.push(`stages.json: unit ${item.unit} lessons "to" is before "from"`);
          else
            for (let l = item.lessons.from; l <= item.lessons.to; l += 1)
              place(`unit ${item.unit} lesson ${l}`, stage.number);
        } else if (item.kind === 'checkpoint') place(item.key, stage.number);
        else if (item.kind === 'diagnostic') place('diagnostic', stage.number);
      }
    }
    for (const u of units) {
      const whole = placed.has(`unit ${u.number}`);
      const split = [...placed.keys()].some((k) => k.startsWith(`unit ${u.number} lesson `));
      if (!whole && !split) errors.push(`stages.json: unit ${u.number} is in no stage`);
      if (whole && split) errors.push(`stages.json: unit ${u.number} is both whole and split`);
    }
    for (const t of bundle.tests)
      if (!placed.has(t.key) && !isMockKey(t.key))
        errors.push(`stages.json: test "${t.key}" is in no stage`);
  }
  return errors;
}

/** The stage a Math unit's lesson belongs to (1–4), from stages.json. */
export function stageOf(stages: MathStagesFile, unit: number, lessonOrder?: number): number | null {
  for (const stage of stages)
    for (const item of stage.items)
      if (
        item.kind === 'unit' &&
        item.unit === unit &&
        (!item.lessons ||
          lessonOrder === undefined ||
          (lessonOrder >= item.lessons.from && lessonOrder <= item.lessons.to))
      )
        return stage.number;
  return null;
}

// ───────── Mental Math levels (mental-math-design.md) ─────────

/**
 * content/mental/levels.json: the four age levels in order, each with its planned units. A unit
 * that isn't written yet shows as "coming soon" on the Mental Math home.
 */
export const MentalLevelsFile = z
  .array(
    z.object({
      number: z.number().int().min(1).max(4),
      title: text(80),
      ages: text(20),
      focus: text(300),
      units: z
        .array(z.object({ number: z.number().int().min(1).max(40), title: text(80) }))
        .min(1)
        .max(12),
    }),
  )
  .length(4);
export type MentalLevelsFile = z.infer<typeof MentalLevelsFile>;

/** Cross-checks for levels.json: levels 1–4 in order, each unit planned once, in order. */
export function mentalLevelErrors(
  levels: MentalLevelsFile,
  unitNumbers: readonly number[],
): string[] {
  const errors: string[] = [];
  if (levels.some((l, i) => l.number !== i + 1))
    errors.push('levels.json: levels must be numbered 1–4');
  const planned = levels.flatMap((l) => l.units.map((u) => u.number));
  if (planned.some((n, i) => n !== i + 1))
    errors.push('levels.json: units must be numbered 1, 2, 3… in order across the levels');
  for (const n of unitNumbers)
    if (!planned.includes(n)) errors.push(`levels.json: unit ${n} is not in any level`);
  return errors;
}
