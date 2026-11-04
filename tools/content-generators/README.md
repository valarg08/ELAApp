# Content generators

Scripts that produced generated content. The output is already committed; keep these so the content can be
extended, regenerated or audited. Plain Node (no dependencies), run from the repo root. They are not part of
`pnpm check`.

## SAT weeks (`sat/`)

Each `gen-week-0N.cjs` writes one week of SAT Math (66 original questions, the odd/even-week plan in
`sat-design.md`) to the folder you give it:

```bash
node tools/content-generators/sat/gen-week-04.cjs content/sat/week-04
pnpm exec prettier --write content/sat
pnpm content:check
```

- `gen-figs.cjs`: the SVG builders for the question pictures (`plot`, `barchart`, `dotplots`, `shape`,
  `transversal`, `squareQuarter`; `plot` also takes `fn` for a curve). Figures are plain SVG: no script, links or images.
- `verify-symbolic.cjs`: a read-only check of non-numeric answer choices.
- In a week file, `ch(skill, difficulty, prompt, correct, wrongs, solution, compute)` is a multiple-choice question
  (the correct letter rotates), `ty(...)` a typed answer and `fg(question, file, alt, svg)` attaches a picture.
  `compute` is checked by `pnpm content:check` and must give a plain number.
- Rules used for every week: 22 questions per module in the week's plan, easier to harder, about 6 typed answers per
  module, letters balanced over the test, the easier module 2 has no difficulty 3, the harder module 2 is about
  80% difficulty 3, and no near-twin of a question in an earlier week. A new week should be compared with all earlier
  weeks before it is committed. Re-running a script reproduces the committed JSON exactly (apart from formatting).
- Weeks need a human teacher's read before students use them.

## PSAT Quadratics guide (`quadratics/`)

Generates the problem files and diagrams of `/psat/quadratics`:

```bash
node tools/content-generators/quadratics/build.cjs   # writes psat-quadratics-problems.ts and psat-quadratics-algebra1.ts
pnpm exec prettier --write apps/web/features/math/psat-quadratics-*.ts
node tools/content-generators/quadratics/figs.cjs    # writes public/guides/quadratics/*.svg
node tools/content-generators/quadratics/verify.cjs  # re-derives answers from the question text
node tools/content-generators/quadratics/verify2.cjs
```

- `types.cjs`: the problem templates (every answer is computed, with worked steps). `lib.cjs`: formatting and
  figure helpers.
- `psat-a.cjs`, `psat-b.cjs`: the PSAT level, 25 per chapter. `alg1.cjs`: the Algebra 1 (grade 9) level, tagged with
  Florida B.E.S.T. Algebra 1 benchmarks (the codes come from a third-party list; a teacher should check them).
- `build.cjs` checks every set (25 per chapter, answers readable by math-check, no repeated questions).

## PSAT Factoring guide (`factoring/`)

Generates the problem files and diagrams of `/psat/factoring` (the average method):

```bash
node tools/content-generators/factoring/build.cjs   # writes psat-factoring-problems.ts and psat-factoring-algebra1.ts
pnpm exec prettier --write apps/web/features/math/psat-factoring-*.ts
node tools/content-generators/factoring/figs.cjs    # writes public/guides/factoring/*.svg
```

- Six chapters, 25 problems each at Algebra 1 and at PSAT. Every answer is computed and checked with math-check.
- Algebra 1 problems are tagged MA.912.AR.1.7; a teacher should check that code.
- The video's six examples stay in the notes. Practice problems are separate.

## PSAT Inequalities guide (`inequalities/`)

Generates the problem files and diagrams of `/psat/inequalities`:

```bash
node tools/content-generators/inequalities/build.cjs   # writes psat-inequalities-problems.ts and psat-inequalities-algebra1.ts
pnpm exec prettier --write apps/web/features/math/psat-inequalities-*.ts
node tools/content-generators/inequalities/figs.cjs    # writes public/guides/inequalities/*.svg
```

- Ten chapters, 25 problems each at Algebra 1 and at PSAT. Every answer is computed and checked with math-check.
- Algebra 1 problems are tagged MA.912.AR.2.5 (one-variable), AR.2.7 (two-variable), AR.2.8 (systems), AR.5.4 (polynomial) and AR.8.3 (rational); a teacher should check those codes.
- The video's examples stay in the notes. Practice problems are separate.

## PSAT Radicals guide (`radicals/`)

Generates the problem files and diagrams of `/psat/radicals`:

```bash
node tools/content-generators/radicals/build.cjs   # writes psat-radicals-problems.ts and psat-radicals-algebra1.ts
pnpm exec prettier --write apps/web/features/math/psat-radicals-*.ts
node tools/content-generators/radicals/figs.cjs    # writes public/guides/radicals/*.svg
```

- Ten chapters, 25 problems each at Algebra 1 and at PSAT. Every answer is computed, then checked a second way with a float, and with math-check (`radical` and `fraction` forms).
- Only square roots are exact in math-check, so cube-root simplification is asked as integer parts (c and r).
- Algebra 1 problems are tagged MA.912.NSO.1.1, NSO.1.2, AR.9.1, F.1.2 and NSO.1.4; a teacher should check those codes.
- The video's examples stay in the notes. Practice problems are separate (the generator has a ban list).

## PSAT Functions guide (`functions/`)

Generates the problem files and diagrams of `/psat/functions`:

```bash
node tools/content-generators/functions/build.cjs   # writes psat-functions-problems.ts and psat-functions-algebra1.ts
pnpm exec prettier --write apps/web/features/math/psat-functions-*.ts
node tools/content-generators/functions/figs.cjs    # writes public/guides/functions/*.svg
```

- Ten chapters, 25 problems each at Algebra 1 and at PSAT. Every answer is computed from the functions themselves, then checked a second way with a float, and with math-check.
- Typed answers are whole numbers or fractions (yes/no is 1/0, even/odd/neither is 1/2/0, +∞/−∞ is 1/−1).
- Algebra 1 problems are tagged MA.912.F.1.1–F.1.6, F.2.1 and F.2.2; the codes were assigned from memory, so a teacher should check them.
- The video's examples stay in the notes. Practice problems are separate (the generator has a ban list).

## PSAT Powers and Scientific Notation guide (`powers/`)

Generates the problem files and diagrams of `/psat/powers`:

```bash
node tools/content-generators/powers/build.cjs   # writes psat-powers-problems.ts and psat-powers-middle.ts
node tools/content-generators/powers/build.cjs --list   # prints every question and answer for a read-through
pnpm exec prettier --write apps/web/features/math/psat-powers-*.ts
node tools/content-generators/powers/figs.cjs    # writes public/guides/powers/*.svg
```

- Eight chapters, 25 problems each at middle-school level and at PSAT level. Every answer is computed, then checked a second way with a float, and with math-check (`fraction` and `decimal` forms).
- Questions are unique across all chapters of a level.
- Middle-school problems are tagged MA.7.NSO.1.1, MA.8.NSO.1.3, MA.8.NSO.1.4 and MA.8.NSO.1.7 (checked against the FLDOE Grade 8 guide); a teacher should check that each chapter fits its code.
- The video's examples stay in the notes. Practice problems are separate (the generator has a ban list).

- `sci-ops.cjs` builds two chapters that are not in the video, Multiplying and Dividing scientific notation (50 problems each, `psat-powers-sci-ops.ts`): `node tools/content-generators/powers/sci-ops.cjs` (add `--list` to print every question and answer), then `pnpm exec prettier --write apps/web/features/math/psat-powers-sci-ops.ts`. `sci-ops-figs.cjs` draws their two diagrams. Coefficients are exact fractions, then every answer is re-checked with floating-point arithmetic and math-check.

## PSAT Exponent Rules guide (`exponent-rules/`)

Generates the problem file and diagrams of `/psat/exponent-rules` (nine rules and a final test, 50 problems each):

```bash
node tools/content-generators/exponent-rules/build.cjs   # writes psat-exponent-rules-problems.ts
pnpm exec prettier --write apps/web/features/math/psat-exponent-rules-problems.ts
node tools/content-generators/exponent-rules/figs.cjs    # writes public/guides/exponent-rules/*.svg
```

- `lib.cjs`: a tiny expression tree that prints with superscripts and is solved by exact monomial arithmetic, plus the step writer (it names the rule used at each node). `chapters.cjs`: the ten chapters, 1–16 warm-up, 17–34 core, 35–50 challenge.
- `build.cjs` checks every problem three ways (numeric substitution, an independent evaluation of the question text, math-check), plus 50 per chapter, no repeated questions and none of the video's own examples.
- Answers are numbers (math-check has no variables), so letter problems ask for an exponent, the coefficient, c + n or m + n, or the numerator and denominator numbers.

## PSAT Parallel Lines and Angles guide (`parallel-lines/`)

Generates the problem file and diagrams of `/psat/parallel-lines` (ten chapters and a final test, 50 problems each):

```bash
node tools/content-generators/parallel-lines/build.cjs   # writes psat-parallel-lines-problems.ts (--list prints every question and answer)
pnpm exec prettier --write apps/web/features/math/psat-parallel-lines-problems.ts
node tools/content-generators/parallel-lines/figs.cjs    # writes public/guides/parallel-lines/*.svg
```

- `lib.cjs`: the eight angles of a transversal (which angle is which, how any two are related, and a geometric measure from the rays for checking), exact fractions and the worded steps. `chapters.cjs`: the problem families (transversal, algebra with x, complementary and supplementary, polygons, slopes). `plans.cjs`: the tiers of each chapter, 1–16 warm-up, 17–34 core, 35–50 challenge.
- `build.cjs` runs every problem's own check (an independent angle measure, or the solution substituted back) and math-check, and enforces 50 per chapter and no repeated question across the guide.
- Transversal problems use the `transversal` figure with the angles numbered 1–8, leaning like ∠2.

## Guide diagrams (`guide-diagrams/`)

`alg-svg.mjs`, `geo-svg.mjs`, `ns-svg.mjs` (with `svg-kit.mjs`) drew the diagrams of the PSAT Algebra, Geometry
and Number Sense guides. Each takes the output folder as its first argument (see `apps/web/public/guides/`).
These were copied as they were and have not been re-run since.

## PSAT Equations with Fractions guide (`fraction-equations/`)

Generates the problem files and diagrams of `/psat/fraction-equations`:

```bash
node tools/content-generators/fraction-equations/build.cjs   # writes psat-fraction-equations-problems.ts and psat-fraction-equations-middle.ts
node tools/content-generators/fraction-equations/build.cjs --list   # prints every question and answer for a read-through
pnpm exec prettier --write apps/web/features/math/psat-fraction-equations-*.ts
node tools/content-generators/fraction-equations/figs.cjs    # writes public/guides/fraction-equations/*.svg
```

- Seven chapters, 25 problems each at middle-school level and at PSAT level. Each equation is built from a chosen solution, solved again with exact fractions, and the answer is plugged into both sides; math-check also accepts it (`fraction` form).
- Typed answers are whole numbers or fractions (yes/no is 1/0).
- Middle-school problems are tagged MA.6.NSO.3.1 (LCM chapter) and MA.8.AR.2.1 (the rest); a teacher should check that each chapter fits its code.
- The video's examples stay in the notes. Practice problems are separate (the generator has a ban list).
