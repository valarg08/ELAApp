// Builds the Parallel Lines and Angles study-guide problems (psat-design.md): 50 per chapter and a
// 50-problem final test. Every answer is computed, then re-checked another way (a geometric angle
// measure or substituting the solution back) and read by math-check.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const plans = require('./plans.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const ORDER = [
  ['parallel', plans.parallel],
  ['transversal', plans.transversal],
  ['alternate', plans.alternate],
  ['corresponding', plans.corresponding],
  ['consecutive', plans.consecutive],
  ['compsupp', plans.compSupp],
  ['solvex', plans.solveX],
  ['allangles', plans.allAngles],
  ['polygons', plans.polygons],
  ['words', plans.wordProblems],
  ['final', plans.finalTest],
];
const disp = (a) => a.replace(/^-/, '−');

async function main() {
  const { readAnswer, checkAnswer } = await import(
    pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const problems = [];
  const all = {};
  for (const [id, make] of ORDER) {
    const list = make();
    if (list.length !== 50) problems.push(`${id} has ${list.length}`);
    list.forEach((p, i) => {
      const where = `${id}#${i + 1}`;
      if (/undefined|NaN|null|\[object|Infinity/.test(JSON.stringify([p.q, p.a, p.steps])))
        problems.push(`${where} bad token: ${p.q}`);
      if (!p._check || !p._check()) problems.push(`${where} fails its own check: ${p.q}`);
      const r = readAnswer(p.a);
      if (!r.ok) problems.push(`${where} unreadable answer ${p.a}`);
      else if (checkAnswer(p.a, [p.a], p.form ?? 'any').status !== 'correct')
        problems.push(`${where} answer ${p.a} does not check`);
      if (p.steps.some((s) => s.trim() === '' || s.includes('  ')))
        problems.push(`${where} empty or double-spaced step`);
      if (/\b-\d/.test(p.q) || /(^|[^\d])-[0-9]/.test(p.steps.join(' ')))
        problems.push(`${where} ASCII minus in text: ${p.q}`);
    });
    all[id] = list.map((p) => ({
      q: p.q,
      a: p.a,
      ...(p.form ? { form: p.form } : {}),
      steps: [...p.steps, `Answer: ${disp(p.a)}`],
      ...(p.fig ? { fig: p.fig } : {}),
    }));
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
  }
  if (process.argv.includes('--list')) {
    for (const [id, list] of Object.entries(all))
      list.forEach((p, i) => console.log(`${id}#${i + 1} ${p.q} => ${p.a}`));
    return;
  }
  fs.writeFileSync(
    path.join(ROOT, 'apps/web/features/math/psat-parallel-lines-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * 50 problems per Parallel Lines and Angles chapter, simple to complex (1–16 warm-up, 17–34 core, 35–50 challenge),\n * and a 50-problem final test that mixes every chapter. Generated from small templates, so every answer is computed.\n */\nexport const PARALLEL_LINES_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(all, null, 1)};\n`,
  );
  console.log('written; problems found:', problems.length);
}
main();
