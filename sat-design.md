# SAT Math (design source of truth for the SAT track)

SAT Math is a sixth tab (track `SAT`, `/sat`, 🏆). It gives students in grades 8–10 a full SAT Math section to take every week, built to the rules of the digital SAT, with worked solutions and results by skill. Work on it must not change the Story, Essay, Math (AMC 10), Mental Math or PSAT tracks. Every question is ours: never copy, reword or renumber College Board questions, and make no College Board endorsement claims.

## 1. The test (follows the College Board's digital SAT)

- Math only: 2 modules × 22 questions, 35 minutes each, 44 questions in 70 minutes. No break. (The real test adds unscored trial questions; ours has none.)
- Adaptive: module 2 is easier or harder depending on the module 1 result (§5). Inside a module, questions run from easier to harder.
- About 75% multiple choice with four choices (A–D), about 25% student-produced responses (typed): 11 typed questions a week.
- Within a module: move freely between questions, mark for review, cross out choices, change answers until the module is submitted. After submitting module 1 there is no way back. When the 35 minutes end the module is submitted. The clock can be hidden but returns at 5 minutes left.
- No penalty for wrong answers. A calculator is allowed throughout; a reference sheet (area, volume, triangle facts) is always on screen.
- About 30% of questions are in real-life, science or social-studies contexts.
- Typed answers: whole number, decimal or fraction (`12`, `0.75`, `-3.5`, `7/4`); at most 5 characters (6 if negative); no mixed numbers, percent signs, units or commas; a long decimal is rounded or cut to fill the space; if there are several right answers, any one counts.
- Score: an estimate on the 200–800 Math scale (the real conversion is secret), shown with a note to trust the trend.

The rules are `SAT_RULES` in `packages/shared/src/curriculum/sat.ts`. They open the `/sat` page and are shown again before every test starts.

## 2. Content areas and weights (set by the product owner; no trigonometry, for grades 8–10)

| Area | Weight | Skills |
|---|---|---|
| Algebra | 42.5% | linear equations in 1 variable; linear equations in 2 variables; linear functions; systems of 2 linear equations in 2 variables; linear inequalities in 1 or 2 variables |
| Advanced Math | 20% | equivalent expressions; nonlinear equations in 1 variable and systems of equations in 2 variables; nonlinear functions |
| Problem-Solving and Data Analysis | 25% | ratios, rates, proportional relationships and units; percentages; one-variable data (distributions, center, spread); two-variable data (models, scatterplots); probability and conditional probability |
| Geometry | 12.5% | area and volume; lines, angles and triangles, including right triangles |

The College Board's own weights are about 35 / 35 / 15 / 15 with a Geometry and Trigonometry area; ours differ on purpose.

A week's 44 questions: odd weeks 19 / 9 / 11 / 5, even weeks 18 / 9 / 11 / 6 (Algebra / Advanced / Data / Geometry), so two weeks average the weights. Per module of 22: odd weeks 10·5·5·2 then 9·4·6·3; even weeks 9·4·6·3 then 9·5·5·3 (`satWeekPlan`). Every skill appears at least once every two weeks.

## 3. Weekly rhythm

One full test per week (week 1, 2, 3, …), one scored attempt per student per week, then a review of every question with its worked solution. Teachers set a class's start date; a week unlocks seven days after the previous one. The student's page shows this week's test, past weeks' scores and the trend.

## 4. Content

- Per week: module 1 (22), an easier module 2 (22) and a harder module 2 (22) = 66 original questions, kept in `content/sat/week-XX/` (keys `s01.` …, slugs `sat-`).
- Every question has a skill, a difficulty (1–3), a form (choice or typed), the answer, `compute` for computable answers (verified by `content:check`), and worked steps shown in the review.
- Figures use the shared figure specs (`guide-problem.ts` `Figure`), data tables use the table component, formulas use KaTeX `MathText`.

## 5. Adaptive rule (to be tuned)

Module 1 raw score ≥ 14 of 22 → harder module 2; otherwise the easier one. The score estimate uses both modules (a harder module 2 allows a higher ceiling).

## 6. Build order

- **S0** (done): the tab, `/sat`, `/start` card, track `SAT` in the database and shared constants, this document, the rules page.
- **S1** (done): the test player and its engine.
  - Table `SatAttempt` (one per student per week, `state` checked with Zod); API at `/sat/*` (`SatModule`: weeks, start, get, autosave, hand in); students only, other students' attempts answer 404.
  - Content: `content/sat/week-XX/{week.json, module-1.json, module-2-easy.json, module-2-hard.json, figures/}` read on the server (`SatContentService`, 30 s cache), never copied to the database, checked by `content:check` (Math problem checks, four choices, easier-to-harder order, and for a real week 22 questions per module in the week's area plan). Week 1 is a short sample (`"sample": true`, 6/5/5 questions, 12 minutes) for trying the player.
  - Rules in code: the clock is the server's; any request after a module's deadline hands that module in (module 2 then opens with a fresh clock); typed answers follow `satTypedError`/`satTypedMatches` (5 characters, 6 if negative, no mixed numbers, a decimal of 3+ places may be rounded or cut); answers and solutions are sent only after the test.
  - Pages: `/sat` (weeks), `/sat/week/[week]` (the rules, then Start/Continue), `/sat/test/[id]` (player, then result with the raw score by module and every question's solution).
  - Player: question list and check-your-work screen, mark for review, cross out choices, hide the clock (it returns at 5 minutes), reference sheet, calculator, rules dialog, autosave.
- **S2** the 200–800 estimate, results by area and skill, review with worked solutions, the mistakes list.
- **S3** weekly schedule and the teacher start date.
- **S4+** content, one week at a time (weeks 1–4 first).
- **S-teacher** class results by area and skill.
