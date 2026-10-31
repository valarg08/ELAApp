// Build the Quadratics problem files, checking every set (25 per chapter, readable answers, no repeats).
const fs = require('fs');
const ROOT = require('path').resolve(__dirname, '../../..');
const path = require('path');
const psatA = require('./psat-a.cjs');
const psatB = require('./psat-b.cjs');
const mid = require('./alg1.cjs');

const ID = {
  recognize: 'recognize',
  standard: 'standard',
  vertexForm: 'vertex-form',
  factoredForm: 'factored-form',
  factoring: 'factoring',
  solveFactoring: 'solve-factoring',
  completeSquare: 'complete-square',
  formula: 'formula',
  discriminant: 'discriminant',
  findVertex: 'find-vertex',
};
const psat = { ...psatA, ...psatB };

async function main() {
  const { readAnswer } = await import(
    require('url').pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const problems = [];
  for (const [label, set] of [
    ['psat', psat],
    ['mid', mid],
  ]) {
    for (const key of Object.keys(ID)) {
      const list = set[key];
      if (!list) problems.push(`${label}.${key} missing`);
      else {
        if (list.length !== 25) problems.push(`${label}.${key} has ${list.length}`);
        const seen = new Set();
        list.forEach((p, i) => {
          const where = `${label}.${key}#${i + 1}`;
          if (/undefined|NaN|null|\[object/.test(JSON.stringify(p)))
            problems.push(`${where} has a bad token: ${p.q}`);
          if (seen.has(p.q)) problems.push(`${where} repeats a question`);
          seen.add(p.q);
          const r = readAnswer(p.a);
          if (!r.ok) problems.push(`${where} answer "${p.a}" unreadable: ${r.message}`);
          if (!/^Answer: /.test(p.steps.at(-1))) problems.push(`${where} last step is not Answer`);
          if (p.steps.some((s) => s.trim() === '' || s.includes('  ')))
            problems.push(`${where} has an empty/double-space step`);
        });
      }
    }
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
  }
  const out = (set, level) =>
    Object.fromEntries(
      Object.entries(ID).map(([key, id]) => [
        id,
        (set[key] ?? []).map((p) => ({
          q: p.q,
          a: p.a,
          ...(p.form ? { form: p.form } : {}),
          steps: p.steps,
          ...(level === 'mid' ? { std: p.std } : {}),
          ...(p.fig ? { fig: p.fig } : {}),
        })),
      ]),
    );
  const dir = path.join(ROOT, 'apps/web/features/math');
  fs.writeFileSync(
    path.join(dir, 'psat-quadratics-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/** 25 problems per Quadratics chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */\nexport const QUADRATICS_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(out(psat, 'psat'), null, 1)};\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'psat-quadratics-algebra1.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * Algebra 1 (grade 9) problems per Quadratics chapter, 25 each from simple to complex, each tagged with\n * its Florida B.E.S.T. Algebra 1 benchmark (MA.912). They follow the video's chapters at the level of the\n * Algebra 1 end-of-course exam. Generated from small templates, so every answer is computed.\n */\nexport const QUADRATICS_ALGEBRA1: Record<string, GuideProblem[]> = ${JSON.stringify(out(mid, 'mid'), null, 1)};\n`,
  );
  console.log('written; problems found:', problems.length);
}
main();
