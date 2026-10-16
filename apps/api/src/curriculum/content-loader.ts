import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ActivitiesFile,
  type ActivityContent,
  LessonContent,
  type Track,
  type UnitBundle,
  UnitContent,
  splitMath,
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
}

const formatIssues = (file: string, error: z.ZodError) =>
  error.issues.map((i) => `${file}: ${i.path.length ? `${i.path.join('.')}: ` : ''}${i.message}`);

/** Where each track's units live under /content (DESIGN.md §9.12). */
const TRACK_FOLDERS: { folder: string; track: Track; required: boolean }[] = [
  { folder: 'units', track: 'STORY', required: true },
  { folder: 'essay', track: 'ESSAY', required: false },
  { folder: 'math', track: 'MATH', required: false },
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

/** Every $…$ piece of math in a text, to check KaTeX can render it. */
function texErrors(where: string, value: string): string[] {
  const errors: string[] = [];
  const { segments, ok } = splitMath(value);
  if (!ok) errors.push(`${where}: a "$" is not closed (write \\$ for a dollar sign)`);
  for (const { math, text } of segments) {
    if (!math) continue;
    try {
      renderToString(text, { throwOnError: true, output: 'mathml' });
    } catch (e) {
      const why = e instanceof Error ? e.message : String(e);
      errors.push(`${where}: KaTeX can't read "${text}" (${why})`);
    }
  }
  return errors;
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
  return { units, errors };
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

    if (track === 'MATH') {
      for (const lesson of lessons)
        for (const card of lesson.steps[1].cards)
          for (const value of Object.values(card))
            if (typeof value === 'string')
              errors.push(...texErrors(`${folder}/${dirName}: lesson "${lesson.slug}"`, value));
    }
    for (const { a, p } of problemsOf(activities)) {
      const where = `${folder}/${dirName}: ${a.key}/${p.id}`;
      const texts = [p.prompt, p.solution, ...p.hints];
      if (p.answer.kind === 'choice') texts.push(...p.answer.choices);
      for (const t of texts) errors.push(...texErrors(where, t));
      if (!p.figure) continue;
      const rel = `figures/${p.figure.file}`;
      const svg = await readFile(path.join(dir, rel), 'utf8').catch(() => null);
      if (svg === null) errors.push(`${where}: figure ${rel} is missing`);
      else if (Buffer.byteLength(svg) > MAX_FIGURE_BYTES)
        errors.push(`${where}: figure ${rel} is over 60 KB`);
      else if (!/^\s*(<\?xml[^>]*>\s*)?<svg[\s>]/.test(svg) || UNSAFE_SVG.test(svg))
        errors.push(`${where}: figure ${rel} must be a plain drawn SVG (no scripts or links)`);
      else {
        hash.update(rel).update(svg);
        p.figure.svg = svg.replace(/^\s*<\?xml[^>]*>\s*/, '').trim();
      }
    }

    const bundle = { track, unit, lessons, activities };
    errors.push(...validateUnitBundle(bundle).map((e) => `${folder}/${dirName}: ${e}`));
    units.push({ ...bundle, dir, contentHash: hash.digest('hex') });
  }
  return { units, errors };
}
