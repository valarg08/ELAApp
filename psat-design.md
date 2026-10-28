# PSAT Math track: design (source of truth)

The fifth learning track: preparation for the math section of the PSAT/NMSQT, for students aged about 14–16. It runs on the Math engine (`isMathTrack`), like Math (AMC 10) and Mental Math, and must not change the other tracks.

## 1. What the student gets

- **Tab:** "PSAT Math" 🎯 in `TrackTabs`, a card on `/start`, the home page `/psat`.
- **`/psat`:** intro, the track tabs, "Keep going" (the current unit), the PSAT review sheet tile, an "About the test" box (two modules, 44 questions, 70 minutes; four-choice and typed-answer questions; calculator on every question; no penalty for a wrong answer) and the unit cards.
- **Units:** one for each of the PSAT's four math areas. Every published unit is open from the start (like Math (AMC 10)); lessons inside a unit open in order.
  1. **Algebra** (`psat-algebra`): Linear Equations, Linear Functions & Graphs, Systems & Inequalities.
  2. **Advanced Math** (`psat-advanced-math`): Quadratics, Exponents & Exponential Models, Functions & Equations.
  3. **Problem-Solving & Data Analysis** (`psat-data-analysis`): Ratios, Rates & Percents; Statistics & Data; Probability & Two-Way Tables.
  4. **Geometry & Trigonometry** (`psat-geometry-trig`): Angles, Area & Volume; Right Triangles & Trigonometry; Circles.
- **Each lesson** (the five-step lesson player):
  - Hook: a real-life question.
  - Learn: definition cards that teach the topic and worked examples that open step by step, with "your turn" steps checked by math-check.
  - Practice (`PROBLEMS`): 4 typed-answer problems with hints, wrong-answer notes and a worked solution.
  - Challenge (`PROBLEM_SET`): 4 four-choice PSAT-style questions, easiest first, marked on hand-in, with a note for each tempting wrong choice and a worked solution.
  - Reflect: one prompt and the confidence check.
- **PSAT review sheet:** `/psat/review` (the same sheet as `/math/facts/psat`, from `content/math/psat-facts.json`), linked from the home page and from the Progress panel (`PsatReviewLink`).
- **Quill** uses the `psat` audience line (a PSAT student; four-choice and typed answers; calculator allowed).
- **Teachers:** the class progress page's PSAT Math tab shows the lesson heatmap (no skills view yet).

## 2. Content

- `content/psat/unit-XX` (unit.json, activities.json, lessons/*.json), activity keys `p01.`, slugs `psat-`.
- `content/psat/skills.json`: the PSAT skills (the Math skill format); content:check checks that every problem and lesson focus skill names one.
- **Four-choice answers:** `ChoiceAnswer` takes five choices (AMC, A–E) or four (PSAT, A–D); content:check rejects a right letter with no choice.
- Every computable answer carries `compute`, which content:check verifies.
- **Original problems only:** never copy or reword College Board PSAT/SAT questions, and no College Board logos or endorsement claims.

## 3. Engine notes

- Track `PSAT` (Prisma enum, `TRACKS`, `UNIT_WORD` "PSAT Unit", `TRACK_HOME` `/psat`, `TRACK_NAMES` "PSAT Math").
- `trackKeyFilter('PSAT')` keeps PSAT answers (keys starting `p`) out of the AMC error log, review and mastery, and out of Mental Math's.
- `classAvailability` opens every published PSAT unit.

## 4. Phases

- **PS0 + PS1 (built):** the track, `/psat`, the review sheet in the track, Units 1–4 with 3 lessons each (12 lessons, 48 practice problems, 48 PSAT-style questions).
- **Later:** a PSAT error log and daily review on the shared engine, timed practice modules (22 questions, 35 minutes) and a full practice test, typed-answer questions in the challenge sets, more lessons per unit, a teacher skills view.

## 5. Tests owed

- `classAvailability` (every published PSAT unit open), `trackKeyFilter('PSAT')` (PSAT rows never in the Math or Mental Math lists, and the other way round), the four-choice `ChoiceAnswer` and its letter check, the loader checks for `content/psat` (missing skills.json, unknown skills), the `/psat` and `/psat/review` pages (axe), one Playwright run through a PSAT lesson and its challenge set.
