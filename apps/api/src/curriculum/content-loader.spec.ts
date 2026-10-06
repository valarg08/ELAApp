import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadContent } from './content-loader.js';

/**
 * The real /content must always be valid: this test is what makes CI fail on a broken lesson file
 * (DESIGN.md §14.2 P2 "invalid content fails CI").
 */
describe('repository content', () => {
  it('is valid', async () => {
    const { units, errors } = await loadContent();
    expect(errors).toEqual([]);
    expect(units.map((u) => u.unit.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const unit1 = units[0]!;
    expect(unit1.unit.published).toBe(true);
    expect(unit1.lessons.length).toBeGreaterThanOrEqual(3);
  });
});

describe('loadContent with broken files', () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'storyforge-content-'));
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  async function unitFiles(files: Record<string, unknown>) {
    const dir = path.join(root, 'units', 'unit-01');
    await mkdir(path.join(dir, 'lessons'), { recursive: true });
    for (const [name, value] of Object.entries(files)) {
      await writeFile(
        path.join(dir, name),
        typeof value === 'string' ? value : JSON.stringify(value),
      );
    }
  }

  const unit = {
    number: 1,
    slug: 'foundations',
    title: 'Foundations',
    summary: 'S',
    published: false,
  };

  it('reports invalid JSON with the file name', async () => {
    await unitFiles({ 'unit.json': '{ not json' });
    const { errors } = await loadContent(root);
    expect(errors[0]).toMatch(/^units\/unit-01\/unit\.json: invalid JSON/);
  });

  it('reports schema problems with the field path', async () => {
    await unitFiles({ 'unit.json': { ...unit, number: 99 } });
    const { errors } = await loadContent(root);
    expect(errors.join('\n')).toMatch(/unit\.json: number: Too big/);
  });

  it('reports a lesson that points at a missing activity', async () => {
    await unitFiles({
      'unit.json': { ...unit, published: true },
      'activities.json': [],
      'lessons/01-a.json': {
        slug: 'a',
        order: 1,
        title: 'A',
        estMinutes: 20,
        steps: [
          { id: 'hook', type: 'hook', variant: 'question', prompt: 'Q?' },
          {
            id: 'learn',
            type: 'mini_lesson',
            cards: [
              { kind: 'definition', title: '1', body: 'b' },
              { kind: 'definition', title: '2', body: 'b' },
              { kind: 'definition', title: '3', body: 'b' },
            ],
          },
          { id: 'practice', type: 'guided_practice', activityKeys: ['u01.missing'] },
          { id: 'challenge', type: 'challenge', activityKey: 'u01.also-missing' },
          { id: 'reflect', type: 'reflection', prompts: ['Why?'] },
        ],
      },
    });
    const { errors } = await loadContent(root);
    expect(errors).toContain(
      'units/unit-01: lesson "a": practice activity "u01.missing" does not exist',
    );
    expect(errors).toContain(
      'units/unit-01: lesson "a": challenge activity "u01.also-missing" does not exist',
    );
  });

  it('reports a folder/number mismatch and a missing unit.json', async () => {
    await unitFiles({ 'unit.json': { ...unit, number: 2 } });
    await mkdir(path.join(root, 'units', 'unit-03'), { recursive: true });
    const { errors } = await loadContent(root);
    expect(errors).toContain('units/unit-01/unit.json: "number" 2 does not match the folder name');
    expect(errors).toContain('units/unit-03/unit.json: missing');
  });

  it('reports a missing content folder', async () => {
    const { errors } = await loadContent(path.join(root, 'nope'));
    expect(errors[0]).toMatch(/Content folder not found/);
  });
});
