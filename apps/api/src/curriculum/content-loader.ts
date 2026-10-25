import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ActivitiesFile,
  type ActivityContent,
  LessonContent,
  type MathContentBundle,
  MathFactsFile,
  type MathProblem,
  MathSkillsFile,
  MathStagesFile,
  MathTestFile,
  MentalLevelsFile,
  type Track,
  type UnitBundle,
  UnitContent,
  checkedVariants,
  isMathTrack,
  mentalLevelErrors,
  splitMath,
  validateMathContent,
  validateUnitBundle,
} from '@storyforge/shared';
import { renderToString } from 'katex';
import type { z } from 'zod';

/** /content at the repo root (src/curriculum and dist/curriculum are both four levels down). */
export const defaultContentDir = () =>
  process.env.CONTENT_DIR ?? fileURLToPath(new URL('../../../../content', import.meta.url));

export interface LoadedUnit extends UnitBundle {
  track: Track;
  dir: string;
  contentHash: string;
}

export interface LoadResult {
  units: LoadedUnit[];
  errors: string[];
  /** Math-wide content (skills, stages, tests, fact sheets), when content/math exists. */
  math?: MathContentBundle & { contentHash: string };
  /** Mental Math track-wide content (skills, levels, cheat sheets), when content/mental exists. */
  mental?: MentalBundle & { contentHash: string };
}

/** Mental Math's own track-wide files (mental-math-design.md). */
export interface MentalBundle {
  skills: z.infer<typeof MathSkillsFile>;
  levels?: MentalLevelsFile;
  /** Cheat sheets by unit number (the Math fact sheet format). */
  facts: Record<number, MathFactsFile>;
}

const formatIssues = (file: string, error: z.ZodError) =>
  error.issues.map((i) => `${file}: ${i.path.length ? `${i.path.join('.')}: ` : ''}${i.message}`);

/** Where each track's units live under /content (DESIGN.md §9.12). */
const TRACK_FOLDERS: { folder: string; track: Track; required: boolean }[] = [
  { folder: 'units', track: 'STORY', required: true },
  { folder: 'essay', track: 'ESSAY', required: false },
  { folder: 'math', track: 'MATH', required: false },
  { folder: 'mental', track: 'MENTAL', required: false },
];

/** Figures are drawn SVG only: no scripts, event handlers, links, embedded HTML or outside files. */
const UNSAFE_SVG =
  /<script|<foreignObject|<iframe|<image|<use|\son[a-z]+\s*=|href\s*=|url\s*\(|<!ENTITY|<!DOCTYPE/i;
const MAX_FIGURE_BYTES = 60_000;

/** Problems in a unit's activities (Math track). */
const problemsOf = (activities: ActivityContent[]) =>
  activities.flatMap((a) =>
    a.type === 'PROBLEMS' || a.type === 'PROBLEM_SET' ? a.problems.map((p) => ({ a, p })) : [],
  );

/** Every $…$ and $…$ piece of math in a text, to check KaTeX can render it. */
function texErrors(where: string, value: string): string[] {
  const errors: string[] = [];
  const { segments, ok } = splitMath(value);
  if (!ok) errors.push(`${where}: a "$" is not closed (write \\$ for a dollar sign)`);
  for (const { math, display, text } of segments) {
    if (!math) continue;
    try {
      renderToString(text, { throwOnError: true, output: 'mathml', displayMode: display === true });
    } catch (e) {
      const why = e instanceof Error ? e.message : String(e);
      errors.push(`${where}: KaTeX can't read "${text}" (${why})`);
    }
  }
  return errors;
}

/** Every string inside a value (lesson cards, worked-example steps…). */
function stringsIn(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === 'object') return Object.values(value).flatMap(stringsIn);
  return [];
}

/** The texts KaTeX must render for one (filled) problem. */
function problemTexts(p: MathProblem): string[] {
  const texts = [p.prompt, p.solution, ...p.hints];
  if (p.answer.kind === 'choice')
    texts.push(...p.answer.choices, ...Object.values(p.answer.why ?? {}).flatMap((w) => w ?? []));
  else texts.push(...p.answer.mistakes.map((m) => m.why));
  return texts;
}

/** TeX errors in a problem; for a template, in its checked variants (the first one that fails). */
function problemTexErrors(where: string, p: MathProblem): string[] {
  let variants: MathProblem[];
  try {
    variants = checkedVariants(p);
  } catch {
    return []; // problemErrors reports templates that can't be filled
  }
  for (const v of variants) {
    const errors = problemTexts(v).flatMap((t) => texErrors(where, t));
    if (errors.length > 0) return errors;
  }
  return [];
}

/** Read, check and inline a problem's figure from `dir/figures/`; returns errors. */
async function inlineFigure(
  dir: string,
  where: string,
  p: MathProblem,
  hash: ReturnType<typeof createHash>,
): Promise<string[]> {
  if (!p.figure) return [];
  const rel = `figures/${p.figure.file}`;
  const svg = await readFile(path.join(dir, rel), 'utf8').catch(() => null);
  if (svg === null) return [`${where}: figure ${rel} is missing`];
  if (Buffer.byteLength(svg) > MAX_FIGURE_BYTES) return [`${where}: figure ${rel} is over 60 KB`];
  if (!/^\s*(<\?xml[^>]*>\s*)?<svg[\s>]/.test(svg) || UNSAFE_SVG.test(svg))
    return [`${where}: figure ${rel} must be a plain drawn SVG (no scripts or links)`];
  hash.update(rel).update(svg);
  p.figure.svg = svg.replace(/^\s*<\?xml[^>]*>\s*/, '').trim();
  return [];
}

/** Parse a JSON file against a schema; null (with errors) when missing, invalid or wrong. */
async function readJson<S extends z.ZodType>(
  file: string,
  rel: string,
  schema: S,
  errors: string[],
  hash: ReturnType<typeof createHash>,
): Promise<z.infer<S> | undefined> {
  let raw: string;
  try {
    raw = await readFile(file, 'utf8');
  } catch {
    return undefined;
  }
  hash.update(rel).update(raw);
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    errors.push(`${rel}: invalid JSON (${e instanceof Error ? e.message : String(e)})`);
    return undefined;
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    errors.push(...formatIssues(rel, parsed.error));
    return undefined;
  }
  return parsed.data;
}

/**
 * The Math-wide content (math-design.md §3): content/math/skills.json (required once there are
 * Math units), stages.json, tests/<key>.json (with figures in tests/figures/) and each unit's
 * facts.json, cross-checked against the Math units.
 */
async function loadMathExtras(
  root: string,
  units: LoadedUnit[],
): Promise<{ math: NonNullable<LoadResult['math']>; errors: string[] }> {
  const dir = path.join(root, 'math');
  const errors: string[] = [];
  const hash = createHash('sha256');
  const mathUnits = units.filter((u) => u.track === 'MATH');

  const skills = await readJson(
    path.join(dir, 'skills.json'),
    'math/skills.json',
    MathSkillsFile,
    errors,
    hash,
  );
  if (!skills && !errors.some((e) => e.startsWith('math/skills.json')))
    errors.push('math/skills.json: missing (the Math track names its skills there)');
  const stages = await readJson(
    path.join(dir, 'stages.json'),
    'math/stages.json',
    MathStagesFile,
    errors,
    hash,
  );

  const tests = [];
  const testDir = path.join(dir, 'tests');
  const testFiles = await readdir(testDir).catch(() => [] as string[]);
  for (const file of testFiles.filter((f) => f.endsWith('.json')).toSorted()) {
    const rel = `math/tests/${file}`;
    const test = await readJson(path.join(testDir, file), rel, MathTestFile, errors, hash);
    if (!test) continue;
    if (file !== `${test.key}.json`) errors.push(`${rel}: the file must be named ${test.key}.json`);
    for (const p of test.problems) {
      errors.push(...problemTexErrors(`${rel}/${p.id}`, p));
      errors.push(...(await inlineFigure(testDir, `${rel}/${p.id}`, p, hash)));
    }
    tests.push(test);
  }

  const facts: Record<number, MathFactsFile> = {};
  for (const u of mathUnits) {
    const rel = `math/${path.basename(u.dir)}/facts.json`;
    const sheet = await readJson(path.join(u.dir, 'facts.json'), rel, MathFactsFile, errors, hash);
    if (!sheet) continue;
    for (const s of sheet.sections)
      for (const t of [s.title, ...s.facts]) errors.push(...texErrors(rel, t));
    facts[u.unit.number] = sheet;
  }

  const bundle: MathContentBundle = { skills: skills ?? [], stages, tests, facts };
  if (skills)
    errors.push(
      ...validateMathContent(
        bundle,
        mathUnits.map((u) => ({
          number: u.unit.number,
          lessonCount: u.lessons.length,
          problems: problemsOf(u.activities).map(({ p }) => p),
          focusSkills: u.lessons.flatMap((l) => l.focusSkills),
          mockTests: u.activities.flatMap((a) => (a.type === 'MOCK_TEST' ? [a.test] : [])),
        })),
      ),
    );
  return { math: { ...bundle, contentHash: hash.digest('hex') }, errors };
}

/**
 * Mental Math's track-wide files (mental-math-design.md): content/mental/skills.json,
 * levels.json and each unit's facts.json (its cheat sheet), cross-checked against the units.
 */
async function loadMentalExtras(
  root: string,
  units: LoadedUnit[],
): Promise<{ mental: NonNullable<LoadResult['mental']>; errors: string[] }> {
  const dir = path.join(root, 'mental');
  const errors: string[] = [];
  const hash = createHash('sha256');
  const mentalUnits = units.filter((u) => u.track === 'MENTAL');

  const skills =
    (await readJson(
      path.join(dir, 'skills.json'),
      'mental/skills.json',
      MathSkillsFile,
      errors,
      hash,
    )) ?? [];
  if (skills.length === 0 && !errors.some((e) => e.startsWith('mental/skills.json')))
    errors.push('mental/skills.json: missing (Mental Math names its skills there)');
  const levels = await readJson(
    path.join(dir, 'levels.json'),
    'mental/levels.json',
    MentalLevelsFile,
    errors,
    hash,
  );
  if (!levels && !errors.some((e) => e.startsWith('mental/levels.json')))
    errors.push('mental/levels.json: missing (the four age levels and their units)');

  const facts: Record<number, MathFactsFile> = {};
  for (const u of mentalUnits) {
    const rel = `mental/${path.basename(u.dir)}/facts.json`;
    const sheet = await readJson(path.join(u.dir, 'facts.json'), rel, MathFactsFile, errors, hash);
    if (!sheet) continue;
    for (const sec of sheet.sections)
      for (const t of [sec.title, ...sec.facts]) errors.push(...texErrors(rel, t));
    facts[u.unit.number] = sheet;
  }
  for (const u of mentalUnits)
    for (const tip of u.unit.tips)
      errors.push(...texErrors(`mental/${path.basename(u.dir)}: tips`, tip));

  // The Math checks (skills known, no duplicates), with the Mental Math folder names.
  errors.push(
    ...validateMathContent(
      { skills, tests: [], facts },
      mentalUnits.map((u) => ({
        number: u.unit.number,
        lessonCount: u.lessons.length,
        problems: problemsOf(u.activities).map(({ p }) => p),
        focusSkills: u.lessons.flatMap((l) => l.focusSkills),
        mockTests: [],
      })),
    ).map((e) => e.replace(/^math\//, 'mental/')),
  );
  if (levels)
    errors.push(
      ...mentalLevelErrors(
        levels,
        mentalUnits.map((u) => u.unit.number),
      ).map((e) => `mental/${e}`),
    );
  return { mental: { skills, levels, facts, contentHash: hash.digest('hex') }, errors };
}

/**
 * Read and validate every unit under `<root>/units/unit-XX/` (Story Writing),
 * `<root>/essay/unit-XX/` (Essay Writing) and `<root>/math/unit-XX/` (Math):
 *   unit.json (required), activities.json (optional), lessons/*.json (optional),
 *   figures/*.svg (Math problem figures, inlined into the problem).
 * Never throws for bad content; problems are returned as readable messages.
 */
export async function loadContent(root = defaultContentDir()): Promise<LoadResult> {
  const errors: string[] = [];
  const units: LoadedUnit[] = [];
  for (const { folder, track, required } of TRACK_FOLDERS) {
    const result = await loadTrack(root, folder, track);
    if (result === null) {
      if (required)
        return { units, errors: [`Content folder not found: ${path.join(root, folder)}`] };
      continue;
    }
    units.push(...result.units);
    errors.push(...result.errors);
  }

  for (const { track } of TRACK_FOLDERS) {
    const numbers = units.filter((u) => u.track === track).map((u) => u.unit.number);
    if (new Set(numbers).size !== numbers.length) errors.push('Two units share the same number');
  }
  const slugs = units.map((u) => u.unit.slug);
  if (new Set(slugs).size !== slugs.length) errors.push('Two units share the same slug');
  const result: LoadResult = { units, errors };
  if (units.some((u) => u.track === 'MATH')) {
    const extras = await loadMathExtras(root, units);
    result.errors.push(...extras.errors);
    result.math = extras.math;
  }
  if (units.some((u) => u.track === 'MENTAL')) {
    const extras = await loadMentalExtras(root, units);
    result.errors.push(...extras.errors);
    result.mental = extras.mental;
  }
  return result;
}

/** One track's folder; null when the folder doesn't exist. */
async function loadTrack(root: string, folder: string, track: Track): Promise<LoadResult | null> {
  const unitsDir = path.join(root, folder);
  const errors: string[] = [];
  const units: LoadedUnit[] = [];

  let dirs: string[];
  try {
    dirs = (await readdir(unitsDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory() && /^unit-\d{2}$/.test(d.name))
      .map((d) => d.name)
      .toSorted();
  } catch {
    return null;
  }

  for (const dirName of dirs) {
    const dir = path.join(unitsDir, dirName);
    const hash = createHash('sha256');
    const read = async <S extends z.ZodType>(
      file: string,
      schema: S,
    ): Promise<z.infer<S> | null> => {
      const rel = `${folder}/${dirName}/${file}`;
      let raw: string;
      try {
        raw = await readFile(path.join(dir, file), 'utf8');
      } catch {
        return null;
      }
      hash.update(file).update(raw);
      let json: unknown;
      try {
        json = JSON.parse(raw);
      } catch (e) {
        errors.push(`${rel}: invalid JSON (${e instanceof Error ? e.message : String(e)})`);
        return null;
      }
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        errors.push(...formatIssues(rel, parsed.error));
        return null;
      }
      return parsed.data;
    };

    const unit = await read('unit.json', UnitContent);
    if (!unit) {
      if (!errors.some((e) => e.includes(`${folder}/${dirName}/unit.json`))) {
        errors.push(`${folder}/${dirName}/unit.json: missing`);
      }
      continue;
    }
    if (dirName !== `unit-${String(unit.number).padStart(2, '0')}`) {
      errors.push(
        `${folder}/${dirName}/unit.json: "number" ${unit.number} does not match the folder name`,
      );
    }

    const activities: ActivityContent[] = (await read('activities.json', ActivitiesFile)) ?? [];
    const lessonFiles = await readdir(path.join(dir, 'lessons')).catch(() => [] as string[]);
    const lessons: LessonContent[] = [];
    for (const file of lessonFiles.filter((f) => f.endsWith('.json')).toSorted()) {
      const lesson = await read(`lessons/${file}`, LessonContent);
      if (lesson) lessons.push(lesson);
    }

    if (isMathTrack(track)) {
      // Math lessons render $…$ in the hook question, the Learn cards and the reflect prompts.
      for (const lesson of lessons) {
        const [hook, learn, , , reflect] = lesson.steps;
        const texts = [
          ...('prompt' in hook ? [hook.prompt] : []),
          ...stringsIn(learn.cards),
          ...reflect.prompts,
        ];
        for (const value of texts)
          errors.push(...texErrors(`${folder}/${dirName}: lesson "${lesson.slug}"`, value));
      }
      for (const a of activities)
        if (a.type === 'PROBLEMS' || a.type === 'PROBLEM_SET')
          errors.push(...texErrors(`${folder}/${dirName}: ${a.key}`, a.instructions));
    }
    for (const { a, p } of problemsOf(activities)) {
      const where = `${folder}/${dirName}: ${a.key}/${p.id}`;
      errors.push(...problemTexErrors(where, p));
      errors.push(...(await inlineFigure(dir, where, p, hash)));
    }

    const bundle = { track, unit, lessons, activities };
    errors.push(...validateUnitBundle(bundle).map((e) => `${folder}/${dirName}: ${e}`));
    units.push({ ...bundle, dir, contentHash: hash.digest('hex') });
  }
  return { units, errors };
}
