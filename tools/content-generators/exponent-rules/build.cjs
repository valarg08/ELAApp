// Builds the Exponent Rules study-guide problems (psat-design.md): 50 per rule chapter and a 50-problem
// final test. Every answer is computed, then re-checked three ways: a numeric substitution of the
// expression, an independent evaluation of the question text, and math-check reading the answer.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const C = require('./chapters.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const ORDER = [
  ['whatis', C.whatis],
  ['product', C.product],
  ['quotient', C.quotient],
  ['powerpower', C.powerpower],
  ['powerproduct', C.powerproduct],
  ['powerquotient', C.powerquotient],
  ['one', C.one],
  ['zero', C.zero],
  ['negative', C.negative],
  ['final', C.finalTest],
];
const L = require('./lib.cjs');

// The video's own examples stay in the notes. No practice question may repeat one.
const VIDEO = [
  '2³·2⁵',
  'x⁹·x⁴',
  '2⁷/2³',
  'x⁹/x⁴',
  '(5²)³',
  '(x⁴)⁹',
  '(3x)⁴',
  '(7xy)²',
  '(2/5)³',
  '(x/y)⁷',
  '(4/5)⁻³',
  '(x/y)⁻⁵',
  '1/2⁻³',
  '1/x⁻⁵',
  'x⁴·x',
];
const WHOLE = ['What is 2⁴?', 'What is 5¹?', 'What is 2⁰?', 'What is 2⁻³?', 'What is x⁷?'];
const esc = (s) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const SUPCH = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻';
const digits = String.raw`\d${SUPCH}`;
const BANNED = VIDEO.map(
  (s) => new RegExp(`${/^\d/.test(s) ? `(?<![${digits}])` : ''}${esc(s)}(?![${digits}])`),
);
const isBanned = (q) => {
  const flat = q.replace(/s+/g, '');
  return WHOLE.some((w) => q === w) || BANNED.some((re) => re.test(flat));
};

// ───────── an independent evaluator for numeric question text ─────────
const SUPD = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function evalText(text) {
  const src = text.replace(/−/g, '-').replace(/·/g, '*').replace(/\s+/g, '');
  let i = 0;
  const peek = () => src[i];
  const supNum = () => {
    let neg = false;
    if (peek() === '⁻') {
      neg = true;
      i += 1;
    }
    let n = '';
    while (peek() in SUPD) {
      n += SUPD[peek()];
      i += 1;
    }
    if (n === '') throw new Error('bad exponent');
    return neg ? -Number(n) : Number(n);
  };
  const atom = () => {
    let v;
    if (peek() === '(') {
      i += 1;
      v = expr();
      if (peek() !== ')') throw new Error('paren');
      i += 1;
    } else {
      const m = /^\d+(\.\d+)?/.exec(src.slice(i));
      if (!m) throw new Error('atom at ' + src.slice(i, i + 8));
      v = Number(m[0]);
      i += m[0].length;
    }
    while (peek() === '⁻' || peek() in SUPD) v = Math.pow(v, supNum());
    return v;
  };
  const unary = () => {
    if (peek() === '-') {
      i += 1;
      return -unary();
    }
    return atom();
  };
  const term = () => {
    let v = unary();
    while (peek() === '*' || peek() === '/') {
      const op = src[i];
      i += 1;
      const r = unary();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  };
  const expr = () => {
    let v = term();
    while (peek() === '+' || peek() === '-') {
      const op = src[i];
      i += 1;
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  const v = expr();
  if (i !== src.length) throw new Error('trailing ' + src.slice(i));
  return v;
}
const answerNumber = (a) =>
  a.includes('/') ? Number(a.split('/')[0]) / Number(a.split('/')[1]) : Number(a);
const disp = (a) => a.replace(/^-/, '−');

async function main() {
  const { readAnswer, checkAnswer } = await import(
    pathToFileURL(path.join(ROOT, 'packages/math-check/dist/index.js')).href
  );
  const problems = [];
  const all = {};
  let textChecked = 0;
  const seen = new Set();
  for (const [id, make] of ORDER) {
    const list = make().map((p) => ({ ...p }));
    if (list.length !== 50) problems.push(`${id} has ${list.length}`);
    list.forEach((p, i) => {
      const where = `${id}#${i + 1}`;
      if (/undefined|NaN|null|\[object|Infinity/.test(JSON.stringify([p.q, p.a, p.steps])))
        problems.push(`${where} bad token: ${p.q}`);
      if (seen.has(p.q)) problems.push(`${where} repeats a question: ${p.q}`);
      seen.add(p.q);
      if (p._node && !L.checkExpr(p))
        problems.push(`${where} numeric substitution disagrees: ${p.q}`);
      const m = /^(?:Assume [^.]*\. )?What is ([^a-zA-Z]+)\?$/.exec(p.q);
      if (m && !/when|Type/.test(p.q)) {
        try {
          const v = evalText(m[1]);
          textChecked += 1;
          const a = answerNumber(p.a);
          if (Math.abs(v - a) > 1e-9 * Math.max(1, Math.abs(v)))
            problems.push(`${where} text says ${v}, answer ${p.a}: ${p.q}`);
        } catch (e) {
          problems.push(`${where} could not read the question text (${e.message}): ${p.q}`);
        }
      }
      const r = readAnswer(p.a);
      if (!r.ok) problems.push(`${where} answer "${p.a}" unreadable: ${r.message}`);
      else if (checkAnswer(p.a, [p.a], p.form ?? 'any').status !== 'correct')
        problems.push(`${where} answer "${p.a}" does not check`);
      if (isBanned(p.q)) problems.push(`${where} uses a video example: ${p.q}`);
      if (p.steps.some((s) => s.trim() === '' || s.includes('  ')))
        problems.push(`${where} empty or double-spaced step`);
      if (p.steps.length < 2) problems.push(`${where} too few steps`);
    });
    all[id] = list.map((p) => ({
      q: p.q,
      a: p.a,
      ...(p.form ? { form: p.form } : {}),
      steps: [...p.steps, `Answer: ${disp(p.a)}`],
    }));
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
  }
  const dir = path.join(ROOT, 'apps/web/features/math');
  fs.writeFileSync(
    path.join(dir, 'psat-exponent-rules-problems.ts'),
    `import type { GuideProblem } from './guide-problem';\n\n/**\n * 50 problems per Exponent Rules chapter, simple to complex (1–16 warm-up, 17–34 core, 35–50 challenge), and a\n * 50-problem final test that mixes every rule. Generated from small templates, so every answer is computed.\n */\nexport const EXPONENT_RULES_PROBLEMS: Record<string, GuideProblem[]> = ${JSON.stringify(all, null, 1)};\n`,
  );
  console.log(
    'written; problems found:',
    problems.length,
    '| question texts re-evaluated:',
    textChecked,
  );
}
main();
