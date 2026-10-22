# StoryForge Math track: AMC 10 practice (design)

The source of truth for the Math track. The rest of the platform (auth, classes, the lesson player, the AI gateway, the database) is described in DESIGN.md; the Math track was math-design.md there and moved here on 2026-10-16. Update this file when a Math design decision changes.

**Ground rules**
- **Original AMC-style problems only.** Never copy, reword or renumber past AMC problems (© MAA). No MAA logos or claims of endorsement.
- **Answers are checked in code** (packages/math-check). Quill only explains; it never decides or changes a verdict.
- **The English tracks don't change.** Math work never changes how Story Writing or Essay Writing behave: their content, UI copy, AI prompts, rubrics, routes and progress views stay as they are. Shared code gets Math branches only behind `track === 'MATH'`, and Math-only schema fields are rejected outside `content/math`.

## 1. Plan

A third learning track beside Story Writing and Essay Writing: problem solving for the **AMC 10** (grades 9–10 level). It uses the same structure (units → lessons → Hook, Learn, Practice, Challenge, Reflect), lesson player, progress tracker, Quill tutor and teacher heatmap. Decisions (project owner, 2026-10-15): **a track inside StoryForge** (not a separate app); **grades 9–10, aimed at the AMC 10**; **answers are checked deterministically in code; Quill (AI) only explains** and never decides whether an answer is right.

**About the AMC 10** (what the track prepares for): 25 multiple-choice questions, five choices (A)–(E), 75 minutes, no calculator. Scoring: 6 points for a correct answer, 1.5 for a blank, 0 for a wrong answer (150 maximum). Topics: algebra, geometry, number theory, counting and probability, and logic. No trigonometry or calculus. Questions get harder through the paper: roughly 1–10 easier, 11–20 medium, 21–25 hard.

**Content rule: original problems only.** AMC problems are © the Mathematical Association of America. The track uses **original AMC-style problems written for StoryForge**: never copied, reworded or renumbered past contest problems. Pages say "AMC 10 practice" (descriptive use only), with no MAA logos or claims of endorsement. Students who own official past papers practise those outside the platform.

**Plan: 15 units, about 94 lessons, a diagnostic test and two checkpoint mocks.** Every unit ends with a ⭐ unit check: a marked set of AMC-style problems (pass mark below).

| Unit | Lessons |
|---|---|
| 1 Problem Solving & the AMC 10 | The AMC 10 (format, scoring, timing) · Read carefully & draw it · Work backwards & test the choices · Estimate & eliminate · Smart guessing & the 2-minute rule (the value of a blank vs a guess; skip and come back) · ⭐ check |
| 2 Arithmetic & Number Sense | Fractions, decimals & percents · Ratios, rates & proportions · Averages & weighted averages · Exponents & roots · Clever arithmetic (factoring, difference of squares) · ⭐ check |
| 3 Linear Equations & Word Problems | Linear equations · Systems of equations · Distance, rate & time · Work & mixtures · Ages, coins & money · ⭐ check |
| 4 Quadratics & Polynomials | Factoring · Quadratic formula & discriminant · Vieta's formulas · Completing the square & the vertex · Polynomial remainders · ⭐ check |
| 5 Functions & Inequalities | Functions & notation · Graphs & transformations · Absolute value · Inequalities & AM–GM · Floor, ceiling & piecewise · ⭐ check |
| 6 Sequences & Patterns | Arithmetic sequences · Geometric sequences & series · Recursion · Telescoping & clever sums · Finding the pattern · ⭐ check |
| 7 Number Theory I | Divisibility rules · Primes & factorization · GCD & LCM · Counting divisors · Factorials & trailing zeros · ⭐ check |
| 8 Number Theory II | Remainders & modular arithmetic · Units digits & cycles · Number bases · Digit problems · Integer equations · ⭐ check |
| 9 Counting I | Multiplication principle · Permutations · Combinations · Casework · Complementary counting · ⭐ check |
| 10 Counting II & Probability | Stars & bars · Inclusion–exclusion · Probability · Geometric probability · Expected value · ⭐ check |
| 11 Geometry I: Triangles & Polygons | Angles, parallel lines & angle chasing · Pythagoras & special right triangles · Similar triangles · Area (including Heron's formula) · Polygons & angle sums · ⭐ check |
| 12 Geometry II: Circles | Arcs, chords & inscribed angles · Tangents · Power of a point · Inscribed & circumscribed circles · Areas with circles · ⭐ check |
| 13 Geometry III: Coordinates & Solids | Coordinate geometry · Areas on the grid (shoelace, Pick's theorem) · Transformations & symmetry · 3D solids · Nets & space diagonals · ⭐ check |
| 14 Logic & Mixed Strategies | Logic puzzles · Invariants & parity · Games & strategy · Clocks, calendars & time · Mixed sets by difficulty · ⭐ check |
| 15 Mock Exams & Final Review | A pacing plan & the 2-minute rule · Mock AMC 10 A + mistake analysis · Algebra refresh (identities sheet, mixed set) · Geometry refresh (facts sheet, mixed set) · Mock AMC 10 B + mistake analysis · Counting & number theory refresh (counting shortcuts, modular-arithmetic patterns) · Danger zones: targeted fixes · Mock AMC 10 C + mistake analysis · Light review & confidence (short sets of mastered skills, test-day routines) · 🏆 Final mock & test-day plan |

Each mock lesson includes its mistake analysis: the review by question, strand and difficulty, time sinks, and adding misses to the error log.

Strands (progress badges): **Strategy** (1, 14, 15), **Algebra** (2–6), **Number Theory** (7–8), **Counting & Probability** (9–10), **Geometry** (11–13).

**Tests outside the units** (all original problems, the `MOCK_TEST` engine from M0.5 Part D):
- **Diagnostic test:** 25 mixed problems, untimed, on `/math` before Unit 1, and retakable any time to show growth. Its report (by strand, skill and difficulty) sets each skill's starting level and suggests the units to focus on. Units still unlock in order.
- **Checkpoint mock 1** after Unit 8 (algebra and number theory) and **checkpoint mock 2** after Unit 13 (everything so far): full 25-problem, 75-minute timed tests with mistake analysis, so full timed tests start well before Unit 15. They unlock with the unit before them and don't block the next unit.

**Stages** (labels only; the unit order stays as above). `/math` groups the units and tests under four stage headings, so students see where they are in the preparation:

| Stage | What's in it | Focus |
|---|---|---|
| 1 Core Skills + Diagnostics | Diagnostic test, Units 1–5 | Strategy habits; algebra fundamentals (systems, quadratics, factoring, inequalities) |
| 2 AMC Thinking + Speed | Units 6–10, checkpoint mock 1, sprints | Sequences, number theory (modular arithmetic), counting (casework, complementary counting), probability; timed mini-tests |
| 3 Strategy + Score Optimization | Units 11–14, checkpoint mock 2, Unit 15 lessons 1–7 | Geometry (similar triangles, angle chasing, power of a point, coordinates); timed performance, the 2-minute rule, refreshes, danger zones |
| 4 Final Prep + Confidence | Unit 15 lessons 8–10, light review, fact sheets | Light review, facts, identities, shortcuts and patterns; stability and confidence |

Geometry basics come in Stage 3 because the unit order is kept; the diagnostic shows students how they stand in geometry from the start.

**Past AMC problems:** never on the platform (© MAA). Students who work an official paper on their own can record it in the **past-paper log** (M15): only their answer letter or blank per question, the official answer letter and a topic tag, never the problem text. The app scores it with AMC scoring, feeds the danger-zone report, and lets misses go to the error log as "outside problem" (topic and skill only).

**How lessons work:**
- **Hook:** a short puzzle or a question ("How many handshakes…?").
- **Learn:** cards with the idea, worked examples and the common trap (math typeset with TeX).
- **Practice:** a problem set checked instantly in the browser. Each problem has up to 3 authored hints (nudge → method → nearly there), a worked solution, and "Try a similar one".
- **Challenge:** a marked problem set (answers stay on the server) of 6–10 problems in rising difficulty.
- **Reflect:** what you learned, a confidence check, and "add a problem to your error log".

**The engine (M0, built before the first unit):**
- **Track `MATH`:**
  - content in `content/math/unit-XX`, activity keys `m01.`, slugs starting `math-`;
  - always self-paced, like Essay;
  - a third tab, "Math (AMC 10)", in `TrackTabs`;
  - `/math` (Keep going, the 15 unit cards, My progress) and the progress tracker with the five strand badges.
- **Math rendering:** content and solutions use TeX between `$…$` / `$$…$$`, rendered with **KaTeX** (MathML output for screen readers; content:check rejects TeX that doesn't parse). Answers are typed in a plain box with helper buttons (√, π, fraction bar, ^) and a live typeset preview.
- **Figures:** geometry problems carry `figure: { file, alt }`, an SVG in `content/math/unit-XX/figures/`. Alt text is required. content:check rejects scripts, event handlers and external links in the SVG. Figures are drawn to scale only when the problem says so ("not drawn to scale" otherwise, as on the AMC).
- **Answer checking: new package `packages/math-check`** (no dependencies, like writing-analysis):
  - `parseAnswer` reads integers, decimals, fractions, mixed numbers, signs, `√` / `sqrt()`, `π` / `pi`, `^`, simple sums like `2+3√5`, and choices `A`–`E`.
  - `answersEqual(input, accepted)` compares exactly: rationals plus integer multiples of square roots and of π, in a normal form. Exact decimals equal their fraction. A numeric fallback with tolerance applies only when the problem allows it.
  - Problems state the form they want ("as a common fraction", "in simplest radical form"). A correct value in the wrong form gets "Right value; write it as …", not wrong.
- **Problem format** (one shape for practice, challenge, unit checks and mocks):
  - `id`, `prompt` (TeX), optional `figure`;
  - `answer`: either `{ kind: 'choice', choices: [5], correct }` or `{ kind: 'value', accepted: [...], form? }`;
  - `hints` (0–3), `solution` (TeX, required), `skill`, `difficulty` (1–5, from AMC questions 1–5 up to 21–25), `strand`;
  - optional `compute`.
- **Answer verification:** `compute` is an expression in math-check's safe evaluator (`binom(8,3) - binom(5,3)`, `gcd(84, 126)`, `(3/7)*(2/6)`, `sqrt(5^2+12^2)`; no variables, no loops). **`pnpm content:check` fails when `compute` doesn't equal the answer**, or when a choice problem's correct value is missing from its choices or appears twice. Every problem whose answer can be computed this way must carry `compute`. For proof-like problems the worked solution is reviewed by hand.
- **New activity types:**
  - `PROBLEMS`: practice; instant check, hints, solution after a correct answer or after "Show me".
  - `PROBLEM_SET`: the challenge and unit checks. It is marked on the server like `QUIZ` (an attempt, answers hidden until it's handed in, a review with solutions). The unit check passes at the track's pass mark; a lesson challenge completes once handed in.
  - `MOCK_TEST` (an activity type added in M15 for the Unit 15 mocks; it runs on the timed test engine built in M0.5 Part D, which the diagnostic and the checkpoints use directly): 25 problems, a server-side 75-minute timer (handed in automatically when time runs out), AMC scoring, then a review by question, by strand and by difficulty.
- **Error log:** every wrong or "Show me" problem goes to *My error log* by skill. Students redo them later (a problem leaves the log after two correct redos on different days). Unit 15 has a lesson on using it.
- **Quill for math** (packages/ai; fake gateway in tests):
  - `math-explain` ("Explain it another way"): explains the given solution differently, step by step.
  - `math-mistake` ("Why was mine wrong?"): suggests the likely mistake from the student's answer and, optionally, their typed working.
  - Both receive the problem, the authored solution and the answer. They are told never to change the verdict or reveal a different answer, and their output is checked: a number in Quill's text that contradicts the authored answer is dropped.
  - "Try a similar one" comes from the bank (same skill and difficulty, not seen yet), not from AI-generated problems, because generated problems can't be guaranteed correct.
- **Progress & teacher views:** the Math tracker shows lessons, unit checks, accuracy per strand and, after M15, mock scores with an AMC-score estimate. The P5a heatmap works unchanged (`?track=math`).

**Decisions (accepted by the project owner with "start M0", 2026-10-16):**
1. **Unit check pass mark: 100%** (changed from 70% by the project owner on 2026-10-16, during M1): every problem in the try must be right. A try is 8 problems, and each new try draws different problems and new template numbers. Essay keeps its 80%.
2. **Hints: authored hints on practice problems** (none during unit checks and mocks). The Story track chose "no practice hints", but stepped hints are standard in math practice.
3. **Answer format in practice: mostly typed answers**, so guessing doesn't count. Choices (A)–(E) appear in unit checks and mocks, as on the AMC.
4. **Mocks: three full original mocks** (A, B, C) plus the final.
5. **Added 2026-10-16:** a diagnostic test, two checkpoint mocks (after Units 8 and 13), the 2-minute rule, refresh lessons and a light-review lesson in Unit 15 (10 lessons), fact sheets, the danger-zone report, the past-paper log, and four stage labels **with the unit order unchanged**.

## 2. M0 as built

**packages/math-check** (no dependencies):
- **Exact values:** sums of rational multiples of √r·πᵖ, with r square-free. Anything else (a root of a sum, a non-integer power) falls back to a float compared with a relative tolerance of 1e-9.
- **Arithmetic:**
  - integer powers are exact up to |e| ≤ 4096 (square-and-multiply, so `2^100` stays exact);
  - half powers go through √;
  - `1/(a ± b√r)` is rationalised.
- **`evaluate(input, { functions })`:** a recursive-descent reader with no variables and no `eval`. It handles numbers as exact decimals, `+ − × ÷ ^`, implicit products (`2π`, `3√5`, `2(x+1)`), `!`, √/`sqrt()`, π/`pi`, and the aliases − × · ÷ [ ] { }. With `functions` (content only) it also has `binom gcd lcm floor ceil abs min max mod fact`.
- **`readAnswer`** reads a student's answer, including mixed numbers ("2 1/3") and grouped thousands ("1,024").
- **`texToExpression`** converts answer choices (`\frac`, `\sqrt`, `\pi`, `\cdot`, `%`). `choiceValue` gives a choice's value, or null for "none of these".
- **`checkAnswer(input, accepted, form)`** returns correct / form / wrong / invalid. The value decides. A right value in the wrong form is "form", with "Right value! Now write it as …". The forms are any, integer, fraction (lowest terms), mixed, decimal, radical (square-free, no root in a denominator) and pi.

**Shared** (`curriculum/math.ts`, `contracts/math.ts`):
- **Problem schema:** `MathProblem` = `id`, `prompt`, optional `figure {file, alt}`, `answer` (`choice` with five `choices` and `correct` A–E, or `value` with `accepted[]` and `form`), `hints` (0–3), `solution`, `skill`, `difficulty` 1–5, optional `compute`.
  - The planned `strand` field was dropped: strands come from the unit number (`MATH_STRANDS`).
- **Helpers:**
  - `splitMath` splits text into plain and `$…$` pieces; `\$` is a dollar sign.
  - `markAnswer(problem, given)` is used by browser practice, marked sets and redos.
  - `publicProblem` strips the answer, hints and solution.
  - `answerLabel` gives "(D) $2.5$" for a choice, or the first accepted value.
- **`problemErrors`** (run by content:check) fails when:
  - accepted answers disagree, or none has the asked-for form;
  - two choices are the same, or the right value appears in more than one choice;
  - `compute` ≠ the answer ("compute gives 5/2, but the answer is 3").
- **Track:** `TRACKS` has `MATH`. Keys are `m01.`, `MAX_UNITS.MATH` is 15, and the track has `UNIT_WORD` "Math Unit", `TRACK_NAMES` and `TRACK_HOME` `/math`.
- **Activities:**
  - `PROBLEMS` (practice; up to 12 problems, sent whole to the browser);
  - `PROBLEM_SET` (3–60 problems; optional `passPercent`, `problemsPerAttempt`, `timeLimitMinutes`; the lesson payload is `ProblemSetActivityPublic` without its problems).
  - `MARKED_ACTIVITY_TYPES` = QUIZ and PROBLEM_SET.
- **Bundle rules:**
  - problems belong to the Math track;
  - a Math lesson's challenge must be a PROBLEM_SET;
  - other tracks still need a writing challenge.

**Database:** enums `Track.MATH` and `ActivityType.PROBLEMS/PROBLEM_SET`, plus a new `MathErrorLog` table (unique student + activity + problem; `wrongTimes`, `correctRedos`, `lastRedoAt`, `resolvedAt`). Problem-set attempts reuse `QuizAttempt` (`questionIds` holds problem ids; `answers` maps id → letter or typed text).

**content:check** (`content/math/unit-XX`):
- the `problemErrors` above;
- KaTeX parses every `$…$` in problems (prompt, solution, hints, choices) and in Math lesson cards; an unclosed `$` fails.
- Figures are read from `figures/<file>.svg` and inlined. They must be at most 60 KB, start with `<svg`, and contain no script, foreignObject, iframe, image, use, `on…=` handlers, `href`, `url(` or DOCTYPE/ENTITY.

**API:**
- **MathModule:**
  - `GET /lessons/:id/problem-sets/:key` returns the status.
  - `POST …/attempts` starts a try (students): unseen problems first, then sorted easiest first.
  - `POST …/attempts/:attemptId/submit` marks the try with `markAnswer`. Blanks are allowed. "Form" counts as not right. `passed` means done: at the pass mark, or on handing in when the set has none. Every miss goes to the error log.
  - `GET /math/error-log`, `POST /math/error-log` (add from practice) and `POST /math/error-log/:id/redo` (students). One right redo counts per UTC day; two resolve the problem; a wrong redo resets the count.
- **Curriculum:**
  - Essay and Math are always self-paced (`isSelfPaced`: track ≠ STORY).
  - A PROBLEM_SET challenge needs a passed attempt.
  - Practice checks marked attempts for both quizzes and problem sets.
  - The student tracker and the teacher heatmap use a practice quiz, else a problem-set challenge, as the "quiz" column.
- **Quill:**
  - `POST /ai/math/explain` takes `mode` (`explain` or `mistake`) and runs the analyzer `math-explain` (one analyzer for both of the planned `math-explain` and `math-mistake`).
  - The correct answer and solution are given as facts.
  - Mistake mode only answers for a readable wrong answer (400 otherwise).
  - A marked set's problems are explained only after the student has submitted a try.
  - Steps that state a different final answer ("the answer is …", "(B)"), or that call a wrong answer right, are dropped.
  - Results are cached per problem, mode, normalised answer and attempt.
  - Uses the tutor rate limits.
  - Math activities never get AI extra practice.

**Web:**
- **Rendering:**
  - `MathText` uses KaTeX with MathML output (`math-style: normal` makes inline fractions readable).
  - `TrackText` makes Learn cards math-aware only in the Math track.
  - The card tutor ("Explain it another way" on Learn cards) is hidden in Math, because it is a writing tutor; Quill works per problem instead.
- **Answer box:** helper buttons √ π a/b xⁿ ( ) and a live "We read: …" from math-check.
- **`ProblemView`** shows the prompt, the figure and either the choices (radios, "Clear my choice" in marked sets) or the answer box.
  - Figures render as an `<img>` with a data: URI and the alt text on a white card, so an SVG can never run script and stays visible in dark mode.
- **`Problems` practice:** check, hints one at a time, and "Show me the solution" after a try or a hint. "Why was mine wrong?" appears after a readable wrong answer, "Explain it another way" after it is solved, and "Add to my error log" after a miss or after "Show me".
- **`ProblemSet`:**
  - status, start, all problems on one page and hand in;
  - a countdown that hands in at zero when there is a time limit;
  - the review shows each verdict, the right answer, the worked solution and both Quill buttons.
- **Challenge and pages:**
  - `ChallengeStep` renders a ProblemSet for Math challenges.
  - `TrackTabs` has the third tab "Math (AMC 10)".
  - New pages: `/math`, `/math/progress` (strand badges; problem-set column, no writing column) and `/math/error-log`.
  - The teacher heatmap with `?track=math` says "problem set".

**Content:** `content/math/unit-01…15/unit.json` (slugs `math-…`) are all unpublished. Unit 1 has a sample lesson, "The AMC 10: Format, Scoring & Timing": 5 typed practice problems and a 5-problem choice set with one figure. It was played end to end with the unit published temporarily. M1 finishes Unit 1 and publishes it.

**Not yet (later phases):**
- "Try a similar one" from the bank (M1, once units have more problems per skill);
- `$$…$$` display math;
- the server-side timer and AMC scoring (M15).

**Tests owed:**
- math-check: the value/parse/answer cases from the M0 scratch run (form vs wrong, rationalised denominators, `mod(2^100, 7)`, TeX choices).
- `problemErrors` and the figure sanitiser.
- Authorisation for every new endpoint:
  - problem sets: start and submit are student-only; another student's attempt answers 404;
  - the error log is student-only, and another student's entry answers 404;
  - `/ai/math/explain` is student-only, and a marked set is not explained before a submitted try.
- Playwright: a Math lesson end to end with `expectAccessible`.

## 3. M0.5 Math practice upgrade (built 2026-10-16)

M0 reused the writing app's shapes: units in a straight line, text-only Learn cards, free-text reflections, AI as the main source of feedback, and a lessons × students heatmap. These suit writing, not contest math. M0.5 adds the habits that AMC preparation needs, **before** unit content is written, because parts A and B change the problem format.

**Rule: the Story Writing and Essay Writing tracks do not change.** Everything in M0.5 is Math-only:
- New schema fields and card kinds are optional and additive. content:check rejects them outside `content/math`.
- Shared components get a Math branch only behind `track === 'MATH'`. Story and Essay content, UI copy, AI prompts, rubrics, routes and progress views stay exactly as they are.
- New tables, endpoints and pages live under the Math module and `/math`.

M0.5 has four parts, built in order. Each part is usable on its own.

### 3.1 Part A: the content format (before any unit content)

**A1. Skill list** (`content/math/skills.json`)
- About 60 AMC skills, e.g. `{ "id": "casework", "label": "Casework", "strand": "counting", "units": [9] }`.
- `problem.skill` must be one of these ids (content:check). The strand comes from the skill, so strand accuracy needs no extra field.
- Lesson `focusSkills` in Math lessons must be skill ids too.

**A2. Problem templates: verified variants**
- A problem may carry `template`:
  ```json
  "template": {
    "vars": { "a": { "from": 3, "to": 12 }, "b": { "choose": [2, 3, 5] }, "c": { "let": "a*b" } },
    "where": ["a != b", "gcd(a, b) == 1"]
  }
  ```
- A variable is a range (`from`, `to`, optional `step`), a list (`choose`) or a value worked out from the others (`let`). A template has 1–6 variables and at most 20,000 combinations.
- `[[expr]]` placeholders in the prompt, hints, solution, choices, accepted answers and notes are filled per variant: `"A rectangle is $[[a]]$ by $[[b]]$…"`, `"accepted": ["[[a*b]]"]`. Inside `$…$` a value is written as TeX (a fraction becomes `\frac{…}{…}`); `[[expr|decimal]]` writes a terminating decimal such as `7.5`. (Double brackets, because single braces are TeX.)
- math-check gains variables, comparisons (`== != < <= > >=`) and `and`/`or` for `where`. Content only: students' answers still have no variables.
- **content:check** builds every variant when there are at most 500, otherwise a fixed sample of 500. For each variant it runs the M0 problem checks:
  - `compute` = the answer;
  - choices are distinct and the right value appears exactly once;
  - the TeX parses.
  - A template must allow at least 5 variants.
- **Seeds:** a variant is `problemId#seed`.
  - Practice picks a new seed per showing.
  - Marked attempts store `id#seed` in `questionIds`, so the review shows the same numbers.
  - Error-log redos use a new seed each time, so students can't memorise the answer. The original seed is kept for "the one you missed".
- **"Try a similar one"** (practice) shows the same template with a new seed. A problem without a template falls back to another practice problem of the same skill and about the same difficulty, from a finished lesson, that the student hasn't answered yet (`GET /math/similar`). Error-log redos already get new numbers each time, and the entry shows "The one you missed".

**A3. Why each wrong answer is wrong (no AI needed)**
- Choice problems: `answer.why: { "B": "You counted the blanks as 1 point each, not 1.5." }`, written for the plausible wrong choices.
- Typed problems: `answer.mistakes: [{ "value": "90", "why": "That's only the points from right answers." }]`. A wrong answer equal (by math-check) to a listed value gets that note.
- Both may use `[[expr]]` placeholders in templates.
- The note shows in practice, in the review after a marked set, in error-log redos and in tests.
- content:check fails when:
  - a `why` key is the right letter;
  - a `mistakes` value equals the right answer;
  - two `mistakes` values are equal.
- **Feedback order on a wrong answer:**
  1. the authored note (instant, always right);
  2. otherwise "Not quite";
  3. "Why was mine wrong?" asks Quill only when there is no authored note.

**A4. Worked examples that unfold step by step** (a new Math-only Learn card)
- The card kind is `worked-example`:
  ```json
  { "kind": "worked-example", "title": "…", "problem": "…",
    "steps": [ { "text": "…" }, { "text": "…", "try": { "accepted": ["18"], "form": "any" } } ] }
  ```
- Steps open with "Show the next step". A step with `try` asks the student to do that step first: an answer box checked by math-check, with "Show me" after two tries.
- **Faded examples:** a lesson's first worked example usually has no `try` steps, and later ones ask for the last one or two steps.
- The card counts as done when every step is shown.
- content:check:
  - `try` answers parse;
  - a `try` with `compute` must match it;
  - `worked-example` cards are only allowed in Math units.

**A5. Figure flags and zoom**
- `figure.scale: "to-scale" | "not-to-scale"`, default `not-to-scale`. Unless the figure is to scale, a "Not drawn to scale" note appears under it, as on the AMC.
- "Enlarge" opens the figure in a dialog. It is keyboard accessible: Esc closes it and focus returns to the button.
- Interactive geometry (dragging points) is not built: the geometry units M11–M13 use static SVG figures.

### 3.2 Part B: how students practise

**B1. The answer record** (the base for B2–B5 and C4)
- A new table, `MathAnswerLog`: `studentId`, `source` (practice | set | review | sprint | test | redo), `lessonId?`, `activityKey?`, `problemId`, `seed?`, `skill`, `difficulty`, `verdict`, `hintsUsed`, `seconds?`, `confidence?`, `createdAt`. A practice answer that was right only after hints, or shown, counts for less in mastery.
- **Practice** (checked in the browser) posts one row per problem when it is solved or shown: `POST /math/answers` with a batch of up to 20.
  - Each row is validated with Zod.
  - The server re-marks the given answer with math-check when the answer is sent, so a row can't claim "correct" falsely.
- **Marked sets, review, sprint and redos** write rows on the server.
- **Privacy:** typed answers are stored only as the verdict, never the text. They are numbers anyway, but the rule keeps the table free of student text.

**B2. Skill mastery and difficulty**
- Mastery per skill is computed from recent rows (the last 12 per skill, newer weighted more, harder problems counting more), giving one of four levels:
  - **New:** fewer than 3 answers;
  - **Learning;**
  - **Strong:** at least 75% recent accuracy at difficulty ≥ 2;
  - **Mastered:** Strong, plus right answers at difficulty ≥ 3 on two different days.
- `/math/progress` gains a skills view: skills grouped by strand, with level and accuracy, and "Practise this" for weak ones.
- The next problem in review and sprint is chosen at about one difficulty step above the student's level in that skill.

**B3. Daily mixed review** (`/math/tests/review`)
- About 6 problems a day:
  - error-log redos that are due come first;
  - then skills that are due, from finished units only.
- **Spacing** per skill (`MathSkillState`: `box`, `dueAt`): a right answer moves the skill up a box, and a wrong one moves it back to box 1. The boxes are 1, 2, 4, 8, 16 and 30 days.
- Problems are mixed across skills (interleaved), never blocked by topic. Templates give fresh numbers.
- The `/math` home page shows "Today's review: 6 problems" and a gentle streak count. The streak is display only; P6 gamification decides more later.

**B4. Speed: timers and sprints**
- **Practice timer:** an optional per-problem stopwatch, off by default; the setting is kept in the browser (`localStorage`). Seconds per problem go into the answer record whether or not the stopwatch is shown.
- **Sprint** (`/math/tests/sprint`):
  - 10 choice problems in 20 minutes, from finished lessons, one per skill where possible, rising in difficulty;
  - AMC scoring (6 / 1.5 / 0) and a countdown that hands in at zero;
  - afterwards, time per problem against the AMC pace (about 3 minutes);
  - a `MathTestAttempt` row per sprint (kind `sprint`), problems chosen on the server; it needs at least 3 choice problems from finished lessons.
- This is the practice ground for the M15 mocks.

**B5. Confidence and when to guess**
- After answering in marked sets, review and sprints, the student taps **Sure / Think so / Guessing**.
- **Calibration** on `/math/progress`: accuracy per confidence level, plus advice. A guess pays only if the student is right more than 25% of the time (6 × p > 1.5). For example: "Your 'Guessing' answers are right 18% of the time: leave those blank."
- After an attempt, **"Your score if you had left your guesses blank"** shows what blanking guesses would have earned.

**B6. Scratchpad and typed working**
- **Scratchpad:** a drawing pad beside each problem (pen, mouse or touch, an eraser and Clear). It is kept in memory per problem and never saved or sent. A plain-text scratch box is offered beside it for keyboard users. The canvas is an aid, not a required control.
- **"My working"** is an optional text box (practice and the review after a marked set). It is sent only with "Why was mine wrong?", so Quill can point to the step that went wrong.
  - It is student text: never logged and never stored.
  - The AI cache is skipped for requests that include working.
  - It goes through the safety screen like writing.

### 3.3 Part C: Quill, reflection, tone and the teacher view

**C1. Quill nudges** (Socratic hints)
- In practice, after a wrong try, **"Give me a nudge"** asks Quill for one guiding question ("What does the height of the triangle have to do with M?"), not an explanation.
- **Guard:** a nudge may contain no number that isn't already in the prompt, and no answer choice letter. Otherwise it is dropped and Quill retries once. Failing that, the next authored hint is shown.
- Not available in marked sets, sprints or the daily review's first try.

**C2. A math tutor for Learn cards**
- A new analyzer, `math-card`, replaces the hidden writing tutor on Math Learn cards (`POST /ai/math/card`). It runs "Explain it another way" for every Math card (worked examples included), with the M0 math guard: steps stating a different result than the card are dropped.
- The writing tutor (`explain-card`) is unchanged and is still used for Story and Essay cards.

**C3. A math Reflect step**
- Math lessons' Reflect steps may set `trapPicker: true`:
  - "Which problem tricked you?" lists the lesson's practice and set problems, the ones the student missed first (`GET /math/lessons/:lessonId/trap-problems`, from `MathAnswerLog`).
  - Then one line: "What's the trap?"
  - The answer is stored with the step response, as now.
- The confidence check stays. Free-text `prompts` become optional for Math (at least a prompt or the trap picker).

**C4. Tone for 14–16-year-olds**
- Math pages and Math activity components use plainer copy: fewer emoji and no "🎉 You passed!". They say "Passed: 8 of 10 (80%)" instead.
- The Math wording lives in one module (`features/math/copy.ts`), so Story and Essay text is untouched.

**C5. Teacher skills view**
- On the class progress page, Math gets a second view, `?track=math&view=skills`: a skills × students grid of mastery levels, plus the class's five weakest skills.
- `GET /teacher/classes/:classId/math-skills` is teacher-only and enforces class ownership (another teacher's class answers 404).
- The Story and Essay views are unchanged.

### 3.4 Part D: tests, strategy and final prep

**D1. The timed test engine (`MOCK_TEST`)**, moved forward from M15 because the diagnostic and the checkpoints need it:
- 25 choice problems, a server-side timer (75 minutes; none for the diagnostic), handed in automatically at zero, AMC scoring (6 / 1.5 / 0).
- Attempts live in a new table, `MathTestAttempt` (`kind`: diagnostic, checkpoint, sprint, review or light-review; `testKey`; the items with their seeds; answers with seconds, confidence and flags per question), shared by tests, sprints and reviews. Answers are saved as they change and marked on the server at hand-in (reviews check each answer as it is given). A started test is continued, not restarted; past the time limit (plus 30 seconds' grace) it is handed in on the server.
- The test player (`/math/tests/[key]` to start, `/math/attempts/[id]` to play or review) is the same for every kind.
- **Skip and come back:** every question has "Skip" and "Come back later" (flag); a question map shows answered, blank and flagged ones, and a review list appears before handing in.
- **The 2-minute rule:** after 2 minutes on one question a polite prompt asks "2 minutes: skip and come back?" It is on by default, can be turned off (a browser setting) and never moves the student on its own. Sprints use it too.
- **Mistake analysis** after hand-in: points by question, strand and difficulty band (1–10, 11–20, 21–25); **time sinks** (questions that took over 4 minutes, and the points they cost); "your score if you had left your guesses blank" (B5); a button to add each miss to the error log.

**D2. Diagnostic test** (`/math/tests/diagnostic`)
- 25 original choice problems (`content/math/tests/diagnostic.json`: `key`, `title`, `instructions`, `timeLimitMinutes` (null), `afterUnit` (null), `problems`; verified by content:check), covering all five strands at rising difficulty. Untimed; offered on `/math` in Stage 1 and retakable any time.
- The report: AMC points, accuracy by strand and question position, the suggested focus units, and the change since the last diagnostic.
- Answers go to `MathAnswerLog` (`source: test`), so they set each skill's starting mastery level (B2). They don't unlock units.

**D3. Checkpoint mocks**
- `content/math/tests/checkpoint-1.json` (after Unit 8: algebra and number theory) and `checkpoint-2.json` (after Unit 13: everything so far), each 25 original problems in rising difficulty, verified by content:check. Figures go in `content/math/tests/figures/`.
- The engine is built in D1; the problems are written in phases M8 and M13. Each unlocks when the unit before it is passed and doesn't block the next unit.

**D4. Danger-zone report** (on `/math/progress`)
- One section that combines: the weakest skills (mastery), accuracy by question position from the diagnostic, checkpoints and mocks (1–10, 11–20, 21–25), slow skills (median seconds well above the AMC pace), and overconfident skills (often "Sure" but wrong).
- It ends with **"Your top 3 danger zones"**, each with "Practise this", which opens the unit that teaches the skill (a review set per skill can come later).
- From M15 the past-paper log feeds it too (positions and topics only).

**D5. Fact sheets**
- Each unit may have `facts.json`: a one-page summary of formulas, identities, shortcuts and patterns, written in TeX, grouped by skill (content:check: the TeX parses and the skill ids exist).
- `/math/facts/[unit]` shows it (by unit number), printable (print styles: no navigation, one page where possible). `/math` lists the units that have one.
- The fact sheets are written with each unit (M1–M14); the Unit 15 refresh lessons link to them.

**D6. Light review mode**
- "Light review" (`/math/tests/light-review`): 4 easy problems from Strong and Mastered skills (no new or weak skills, no timer), plus 3 fact-sheet cards. It is meant for the last days before the test and builds confidence without fatigue.
- The Unit 15 "Light review & confidence" lesson introduces it.

**D7. Stage labels**
- `content/math/stages.json` lists the four stages (§1) and what each holds: units, the diagnostic, the checkpoints, and Unit 15's lessons by number (lessons 1–7 in Stage 3, 8–10 in Stage 4).
- `/math` shows the units and tests under the stage headings, with "You are in Stage 2" from the student's progress. The unit order and unlocking don't change.
- content:check: every Math unit and test belongs to exactly one stage (Unit 15 by lesson).

### 3.5 M0.5 data and endpoints (summary)

| New | What |
|---|---|
| `content/math/skills.json` | Skill list (A1) |
| `content/math/tests/<key>.json` (`diagnostic`, later `checkpoint-1`, `checkpoint-2`), `stages.json`, `unit-XX/facts.json` | Diagnostic (D2), checkpoint mocks (D3), stages (D7), fact sheets (D5). content:sync stores them in `MathContent` (`skills`, `stages`, `test:<key>`, `facts:<n>`) |
| Problem fields | `template`, `answer.why`, `answer.mistakes`, `figure.scale` (A2, A3, A5) |
| Learn card | `worked-example` (Math only, A4) |
| Reflect | `trapPicker` (Math only, C3) |
| Tables | `MathAnswerLog` (B1), `MathSkillState` (B3), `MathTestAttempt` (B3, B4, D1), `MathContent`; `MathErrorLog.seed` |
| Endpoints | `POST /math/answers`, `GET /math/home`, `GET /math/skills` (mastery, calibration, positions, danger zones), `GET /math/facts/:unitNumber`, `GET /math/similar`, `GET /math/lessons/:lessonId/trap-problems`, `POST /math/tests/:key/start` (`diagnostic`, `checkpoint-1`, `checkpoint-2`, `sprint`, `review`, `light-review`), `GET /math/tests/attempts/:id`, `PUT /math/tests/attempts/:id/answer`, `POST /math/tests/attempts/:id/submit`, `GET /math/tests/attempts/:id/review`, `POST /ai/math/nudge`, `POST /ai/math/card`, `GET /teacher/classes/:classId/math-skills`. `POST /ai/math/explain` moved to the Math module (same route) and takes a problem locator with the seed and optional working |
| Pages | `/math` (stages, today's review, tests), `/math/tests/[key]` (start), `/math/attempts/[id]` (the test player and its review), `/math/facts/[unit]`, the skills, calibration and danger-zone sections of `/math/progress`, the teacher skills view (`?track=math&view=skills`) |

### 3.6 M0.5 acceptance

- **Part A:**
  - content:check verifies every template variant;
  - a wrong choice with a `why` shows it instantly;
  - a worked example with a `try` step checks the step;
  - the sample Unit 1 lesson uses skill ids, one template and `why` notes;
  - Story and Essay `content:check` results are unchanged.
- **Part B:**
  - practice answers reach `MathAnswerLog`, and the server rejects a false "correct";
  - mastery levels change as answers come in;
  - the daily review mixes due redos and due skills;
  - a sprint hands itself in at zero and shows AMC points;
  - calibration shows accuracy per confidence level.
- **Part C:**
  - a nudge never contains a new number;
  - Math Learn cards have a math tutor;
  - the trap picker lists the missed problems;
  - the teacher skills grid shows a student's levels and another teacher gets 404.
- **Part D:**
  - a timed test hands itself in at zero, scores match AMC scoring, and skipped and flagged questions show on the question map;
  - the 2-minute prompt appears and can be turned off;
  - the diagnostic report sets starting skill levels;
  - the danger-zone report lists the top 3 with "Practise this";
  - a fact sheet renders and prints;
  - light review only picks Strong and Mastered skills;
  - `/math` shows the four stage headings with the units in the current order.
- **Everywhere:** axe passes on every new page; the Story and Essay tracks look and behave exactly as before.

**Tests owed (M0.5):**
- math-check variables, comparisons and template expansion;
- template, `why` and `mistakes` checks in `problemErrors`;
- `POST /math/answers` re-marking;
- mastery levels and review spacing (pure functions, unit-testable);
- AMC scoring, time sinks and the danger-zone ranking (pure functions);
- authorisation for every new endpoint (answers, home, skills, facts, similar, trap-problems, the tests and attempts, nudge, card, the teacher skills grid), including that a student can't read another student's test attempt;
- content-loader specs: temp content roots with a `math` folder now need `skills.json`;
- a Playwright run of the daily review, a sprint and the diagnostic with `expectAccessible`.

## 4. Phases

| Phase | Scope | Acceptance |
|---|---|---|
| **M0 Math track foundation** ✅ | Track `MATH`, `/math`, KaTeX, SVG figures, `packages/math-check`, the problem format, `PROBLEMS` and `PROBLEM_SET`, the error log, Quill explanations (§2) | A sample problem set renders, checks typed answers exactly and is marked on the server; content:check rejects a `compute` that disagrees with the answer; axe passes |
| **M0.5 Math practice upgrade** ✅ | Part A (skills, templates, wrong-answer notes, worked examples, figure flags), Part B (answer record, mastery, daily review, sprints, confidence, scratchpad), Part C (Quill nudges, the math card tutor, the trap picker, tone, teacher skills view), Part D (the `MOCK_TEST` engine with skip, flag and the 2-minute rule, the diagnostic test with its 25 problems, checkpoint slots, the danger-zone report, fact sheets, light review, stage labels) (§3) | §3.6 |
| **M1 Unit 1 Problem Solving & the AMC 10** ✅ | 6 lessons (§4.1), published | Played end to end; content:check verifies every answer and variant |
| **M2 Unit 2 Arithmetic & Number Sense** ✅ | 6 lessons (§4.2), published | Played end to end; content:check verifies every answer and variant |
| **M3 Unit 3 Linear Equations & Word Problems** ✅ | 6 lessons (§4.3), published | Played end to end; content:check verifies every answer and variant |
| **M4 Unit 4 Quadratics & Polynomials** ✅ | 6 lessons (§4.4), published | Played end to end; content:check verifies every answer and variant |
| **M5 Unit 5 Functions & Inequalities** ✅ | 6 lessons (§4.5), published | Played end to end; content:check verifies every answer and variant |
| **M6 Unit 6 Sequences & Patterns** ✅ | 6 lessons (§4.6), published | Played end to end; content:check verifies every answer and variant |
| **M7 Unit 7 Number Theory I** ✅ | 6 lessons (§4.7), published | Played end to end; content:check verifies every answer and variant |
| **M8 Unit 8 Number Theory II** ✅ | 6 lessons (§4.8), published, and checkpoint mock 1 (`tests/checkpoint-1.json`, 25 problems, 75 minutes) | Played end to end; content:check verifies every answer and variant |
| **M9 Unit 9 Counting I** ✅ | 6 lessons (§4.9), published | Played end to end; content:check verifies every answer and variant |
| **M10 Unit 10 Counting II & Probability** ✅ | 6 lessons (§4.10), published | Played end to end; content:check verifies every answer and variant |
| **M11 Unit 11 Geometry I: Triangles & Polygons** ✅ | 6 lessons (§4.11), published, with SVG figures | Played end to end; content:check verifies every answer and variant |
| **M12 Unit 12 Geometry II: Circles** ✅ | 6 lessons (§4.12), published, with SVG figures | Played end to end; content:check verifies every answer and variant |
| **M13 Unit 13 Geometry III: Coordinates & Solids** ✅ | 6 lessons (§4.13), published, plus checkpoint mock 2 (25 problems on Units 1–13) | Played end to end; content:check verifies every answer and variant |
| **M14 Unit 14 Logic & Mixed Strategies** | One AMC 10 unit (§1 plan), written in the M0.5 format, with its fact sheet and the tools it needs | Each unit playable end to end; every computable answer and every template variant verified by content:check |
| **M15 Mock exams & final prep** | Unit 15's 10 lessons: the pacing plan and the 2-minute rule, mocks A, B and C with mistake analysis, algebra, geometry and counting & number theory refreshes, danger zones, light review & confidence, the final mock and test-day plan; the AMC-score estimate; the past-paper log (answer letters only, never problem text) | A mock hands itself in when time runs out; scores match AMC scoring; the past-paper log stores no problem text |

### 4.1 M1 as built (2026-10-16)

Unit 1 Problem Solving & the AMC 10 is published, with 6 lessons. Every lesson has a hook, Learn cards (worked examples fade: the first has no try steps, later ones ask for the last steps), typed practice with hints and wrong-answer notes, a 5-problem choice challenge with `why` notes, and a Reflect step with the trap picker.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | The AMC 10: Format, Scoring & Timing (from M0) | `m01.scoring-practice` | `m01.amc-rules-set` |
| 2 | Read Carefully & Draw It | `m01.read-draw-practice` (fence posts, inclusive counting, a walk, "how many more", the garden path figure) | `m01.read-draw-set` |
| 3 | Work Backwards & Test the Choices | `m01.backwards-practice` | `m01.backwards-set` |
| 4 | Estimate & Eliminate | `m01.estimate-practice` (squares, last digits, rounding, decimal size) | `m01.estimate-set` |
| 5 | Smart Guessing & the 2-Minute Rule | `m01.guessing-practice` (expected points, the guessing record, pacing, goal scores) | `m01.guessing-set` |
| 6 | ⭐ Unit Check | `m01.review-practice` (4-problem warm-up) | `m01.unit-check`: 8 of 17 problems per try, pass at 100% |

The fact sheet (`facts.json`) covers scoring, guessing, pacing, reading and drawing, working backwards, using the choices, and estimating and eliminating. "Closest to" answers use `compute` with `floor(x + 0.5)` rounding so content:check still verifies them.

### 4.2 M2 as built (2026-10-16)

Unit 2 Arithmetic & Number Sense is published, with 6 lessons in the same shape as Unit 1. No new tools were needed: typed practice uses the existing answer forms (`fraction` for decimal-to-fraction and ratio answers, `radical` for simplest radical form).

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Fractions, Decimals & Percents | `m02.fractions-practice` (sale prices, decimals to fractions, "what percent", up then down, "more than" vs "less than") | `m02.fractions-set` (two markdowns, a percent of a percent, a telescoping product, the price before a rise, a repeating decimal) |
| 2 | Ratios, Rates & Proportions | `m02.ratios-practice` (sharing by a ratio, km/h to m/min, machines, map scales, joining two ratios) | `m02.ratios-set` |
| 3 | Averages & Weighted Averages | `m02.averages-practice` (the next test, removing a number, two groups, average speed, the largest of five) | `m02.averages-set` |
| 4 | Exponents & Roots | `m02.exponents-practice` (common bases, adding equal powers, simplest radical form, negative and fractional exponents) | `m02.exponents-set` |
| 5 | Clever Arithmetic | `m02.clever-practice` (common factors, near a round number, difference of squares, $(a - b)^2$, a hidden square) | `m02.clever-set` |
| 6 | ⭐ Unit Check | `m02.review-practice` (5-problem warm-up, one per lesson) | `m02.unit-check`: 8 of 19 problems per try, pass at 100% |

The fact sheet covers all five skills. Templated choice problems list `where` conditions so no two choices can ever have the same value.

### 4.3 M3 as built (2026-10-21)

Unit 3 Linear Equations & Word Problems is published, with 6 lessons in the same shape. No new tools were needed. Work and rate answers may be fractions (typed as 12/7 or a decimal).

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Linear Equations | `m03.linear-practice` (two-step, both sides, clearing fractions, consecutive even numbers, "less than" phrases) | `m03.linear-set` (brackets, five consecutive numbers, a negative answer, pens and pencils, no solution) |
| 2 | Systems of Equations | `m03.systems-practice` (sum and difference, elimination, $x + y$ by adding, tickets, where two lines cross) | `m03.systems-set` |
| 3 | Distance, Rate & Time | `m03.drt-practice` (meeting, minutes to hours, a chase, late and early, up and down a trail) | `m03.drt-set` (two legs, head-on, catching up, the escalator, a river current) |
| 4 | Work & Mixtures | `m03.work-practice` (working together, a tap and a drain, adding water, mixing two strengths, worker-days) | `m03.work-set` |
| 5 | Ages, Coins & Money | `m03.ages-practice` (twice as old, years ago, nickels and dimes, a father and son, two kinds of stamps) | `m03.ages-set` |
| 6 | ⭐ Unit Check | `m03.review-practice` (5-problem warm-up) | `m03.unit-check`: 8 of 19 problems per try, pass at 100% |

Templates whose numbers name a quantity ("$a$ litres", "$h$ hours later") start at $2$ so the wording never reads "1 litres".

### 4.4 M4 as built (2026-10-21)

Unit 4 Quadratics & Polynomials is published, with 6 lessons in the same shape. No new tools were needed: roots like $2 + \sqrt{3}$ use the `radical` answer form, and "how many solutions" answers are computed from the discriminant with `min(max(D, -1), 1) + 1`. Templates keep every printed coefficient at least $2$ (never "$1x$") and positive, with the signs written in the text.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Factoring | `m04.factoring-practice` (the larger root, difference of squares, the lost root $x = 0$, $2x^2$ quadratics, the hidden rectangle) | `m04.factoring-set` (a positive root, $x^2 - y^2$, a quartic, $ab + a + b$, $x + \frac{1}{x}$) |
| 2 | Quadratic Formula & Discriminant | `m04.formula-practice` (the discriminant, how many solutions, exactly one solution, a radical root, no real solutions) | `m04.formula-set` |
| 3 | Vieta's Formulas | `m04.vieta-practice` (sum, product, $r^2 + t^2$, $\frac{1}{r} + \frac{1}{t}$, building from roots) | `m04.vieta-set` |
| 4 | Completing the Square & the Vertex | `m04.square-practice` (vertex form, the smallest value, the vertex $x$, the largest rectangle, solving by completing) | `m04.square-set` (a thrown ball, four brackets) |
| 5 | Polynomial Remainders | `m04.remainder-practice` (plug in $a$, plug in $-a$, making a factor, the sum of coefficients, a quadratic divisor) | `m04.remainder-set` |
| 6 | ⭐ Unit Check | `m04.review-practice` (5-problem warm-up, one per lesson) | `m04.unit-check`: 8 of 19 problems per try, pass at 100% |

Also fixed in M4 (Math only): the hook question, the reflect prompts and the instructions of `PROBLEMS` and `PROBLEM_SET` activities now render $…$ with KaTeX (they showed raw TeX in Units 1–3), and content:check checks their TeX. Hook placeholders stay plain text. A worked-example step's text appears after its try, so a step that only sets the scene ("Here $a = 1$…") has no try of its own.

### 4.5 M5 as built (2026-10-21)

Unit 5 Functions & Inequalities is published, with 6 lessons in the same shape and no new tools. Piecewise functions are written with TeX `cases`, and floor and ceiling answers are computed with `floor` and `ceil`. Template variable names are lowercase letters only (no digits).

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Functions & Notation | `m05.functions-practice` | `m05.functions-set` |
| 2 | Graphs & Transformations | `m05.graphs-practice` | `m05.graphs-set` |
| 3 | Absolute Value | `m05.abs-practice` | `m05.abs-set` |
| 4 | Inequalities & AM–GM | `m05.inequalities-practice` | `m05.inequalities-set` |
| 5 | Floor, Ceiling & Piecewise | `m05.floor-practice` | `m05.floor-set` |
| 6 | ⭐ Unit Check | `m05.review-practice` (5-problem warm-up, one per lesson) | `m05.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.6 M6 as built (2026-10-21)

Unit 6 Sequences & Patterns is published, with 6 lessons in the same shape and no new tools. Cycle answers ("remainder $0$ means the last item") are computed with `mod(n - 1, k) + 1`, and last digits with `mod(b^n, 10)`. Recursion templates avoid fixed points, so a wrong-answer note never equals the right answer.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Arithmetic Sequences | `m06.arith-practice` (term $n$, counting terms, $1 + \cdots + n$, a sum, two known terms) | `m06.arith-set` |
| 2 | Geometric Sequences & Series | `m06.geo-practice` (term $n$, the geometric middle, $1 + r + \cdots + r^n$, a forever sum, doubling) | `m06.geo-set` (a bouncing ball, a repeating decimal) |
| 3 | Recursion | `m06.recursion-practice` (step by step, Fibonacci-like, stairs, period $6$, growing steps) | `m06.recursion-set` (strings with no two A's) |
| 4 | Telescoping & Clever Sums | `m06.telescoping-practice` ($\frac{1}{k(k+1)}$, products, pairs, differences of squares, $\frac{1}{k(k+2)}$) | `m06.telescoping-set` ($\sqrt{k+1} - \sqrt{k}$, $k \cdot k!$) |
| 5 | Finding the Pattern | `m06.pattern-practice` (last digits, repeating sums, triangular numbers, remainder $0$, $n(n+1)$) | `m06.pattern-set` |
| 6 | ⭐ Unit Check | `m06.review-practice` (5-problem warm-up, one per lesson) | `m06.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.7 M7 as built (2026-10-21)

Unit 7 Number Theory I is published, with 6 lessons in the same shape and no new tools. Divisor counts are computed from the exponents (`(s + 1)*(t + 1)`), trailing zeros and prime powers in factorials with `floor` sums, and GCD/LCM answers with `gcd` and `lcm`. Choice texts must be plain numbers the checker can read (`$111111111$`, not `$111{,}111{,}111$`).

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Divisibility Rules | `m07.divisibility-practice` (a missing digit for $9$, by $4$ not $8$, a missing digit for $11$, by $4$ and $6$, remainder by $9$) | `m07.divisibility-set` |
| 2 | Primes & Factorization | `m07.primes-practice` (the largest prime factor, $2^a 3^b$, the smallest factor, distinct primes, two primes with an odd sum) | `m07.primes-set` |
| 3 | GCD & LCM | `m07.gcd-practice` (GCD, LCM, the missing number, blinking lights, square tiles) | `m07.gcd-set` |
| 4 | Counting Divisors | `m07.divisors-practice` (two and three primes, even divisors, the divisor sum, odd divisor counts) | `m07.divisors-set` |
| 5 | Factorials & Trailing Zeros | `m07.zeros-practice` (zeros of $n!$, powers of $2$ and $3$, $\frac{n!}{(n-2)!}$, zeros of a product) | `m07.zeros-set` |
| 6 | ⭐ Unit Check | `m07.review-practice` (5-problem warm-up, one per lesson) | `m07.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.8 M8 as built (2026-10-21)

Unit 8 Number Theory II is published, with 6 lessons in the same shape and no new tools, and checkpoint mock 1 is written: `content/math/tests/checkpoint-1.json`, 25 original problems on algebra and number theory (Units 2–8) in rising difficulty, 75 minutes, `afterUnit: 8`, run by the timed test engine from M0.5 Part D. A base-$b$ answer typed as digits is checked as the integer with those digits (`100*x + 10*y + z`). Templates stay under 20,000 combinations and give at least 5 variants.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Remainders & Modular Arithmetic | `m08.mod-practice` (a product, a known remainder, $(-1)^n$, days of the week, remainder $1$ for two divisors) | `m08.mod-set` |
| 2 | Units Digits & Cycles | `m08.units-practice` (a product, cycles of $4$ and $2$, $2^n + 3^n$, a sum of squares) | `m08.units-set` |
| 3 | Number Bases | `m08.bases-practice` (into and out of base ten, binary length, the largest three-digit number, a sum) | `m08.bases-set` |
| 4 | Digit Problems | `m08.digits-practice` (reversal gaps, finding the number, $10^n - k$, digit-sum counts, all the digits) | `m08.digits-set` |
| 5 | Integer Equations | `m08.integer-practice` ($x + y = n$, $ax + y = c$, $xy = n$, $(x - 1)(y - 1)$, $a^2 - b^2 = p$) | `m08.integer-set` |
| 6 | ⭐ Unit Check | `m08.review-practice` (5-problem warm-up, one per lesson) | `m08.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.9 M9 as built (2026-10-21)

Unit 9 Counting I is published, with 6 lessons in the same shape and no new tools (the counting tree builder stays an idea; the worked examples and casework tables cover it). Answers are whole numbers; `compute` uses `binom` and `fact`. Templates stay under 20,000 combinations and give at least 5 variants, and every mistake note differs from the answer in every variant.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | The Multiplication Principle | `m09.multiply-practice` (outfits, codes, digits up to $m$, "and" versus "or", no equal neighbours) | `m09.multiply-set` |
| 2 | Permutations | `m09.permutations-practice` (a line, medals, identical flags, a round table, a pair together) | `m09.permutations-set` |
| 3 | Combinations | `m09.combinations-practice` (committees, handshakes, grid paths, two and two, the captain) | `m09.combinations-set` |
| 4 | Casework | `m09.casework-practice` (digit sums, the largest middle digit, pairs $a < b$, triangles by perimeter, squares on a board) | `m09.casework-set` |
| 5 | Complementary Counting | `m09.complement-practice` (at least one $0$, at least one girl, at least one head, not together, at least two heads) | `m09.complement-set` |
| 6 | ⭐ Unit Check | `m09.review-practice` (5-problem warm-up, one per lesson) | `m09.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.10 M10 as built (2026-10-21)

Unit 10 Counting II & Probability is published, with 6 lessons in the same shape and no new tools. Probabilities are typed as fractions in lowest terms (`form: "fraction"`); expected values may be typed in any form (`form: "any"`). Choices with $pi$ are checked by value like any other choice.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Stars and Bars | `m10.stars-practice` (sweets, positive solutions, four variables, at least two each, doughnuts) | `m10.stars-set` |
| 2 | Inclusion–Exclusion | `m10.incl-practice` ($a$ or $b$, neither sport, the overlap, neither $2$ nor $3$, three divisors) | `m10.incl-set` |
| 3 | Probability | `m10.prob-practice` (dice sums, multiples, exactly $k$ heads, at least one head, two reds without replacement) | `m10.prob-set` |
| 4 | Geometric Probability | `m10.geo-practice` (a segment, closer to $0$, a square in a rectangle, a corner triangle, a dart) | `m10.geo-set` |
| 5 | Expected Value | `m10.ev-practice` (an $n$-sided die, a spinner, dice totals, counting sixes, a coin jar) | `m10.ev-set` |
| 6 | ⭐ Unit Check | `m10.review-practice` (5-problem warm-up, one per lesson) | `m10.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.11 M11 as built (2026-10-21)

Unit 11 Geometry I: Triangles & Polygons is published, with 6 lessons in the same shape and no new tools. Answers with square roots use `form: "radical"` (typed like 2√3). Three challenge and check problems have SVG figures in `content/math/unit-11/figures/` (a parallel cut, an isosceles triangle with a bisector, a hexagon diagonal), each marked "Not drawn to scale".

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Angles & Angle Chasing | `m11.angles-practice` (the third angle, base angles, an exterior angle, an angle ratio, co-interior angles) | `m11.angles-set` |
| 2 | Pythagoras & Special Right Triangles | `m11.pythagoras-practice` (a triple, a missing leg, $45$-$45$-$90$, $30$-$60$-$90$, an equilateral height) | `m11.pythagoras-set` |
| 3 | Similar Triangles | `m11.similar-practice` (a shadow, a parallel cut, area scale, a side from areas, the altitude to the hypotenuse) | `m11.similar-set` |
| 4 | Triangle Area | `m11.area-practice` (base and height, an isosceles triangle, a split base, the midpoint triangle, three sides) | `m11.area-set` |
| 5 | Polygons | `m11.polygons-practice` (angle sums, a regular interior angle, sides from an angle, diagonals, a hexagon's area) | `m11.polygons-set` |
| 6 | ⭐ Unit Check | `m11.review-practice` (5-problem warm-up, one per lesson) | `m11.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.12 M12 as built (2026-10-21)

Unit 12 Geometry II: Circles is published, with 6 lessons in the same shape and no new tools. Answers with $\pi$ use `form: "pi"` (typed like 5π/2) and square roots use `form: "radical"`. Figures in `content/math/unit-12/figures/`: two tangents from a point, two secants and two overlapping circles.

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Arcs, Chords & Inscribed Angles | `m12.angles-practice` (inscribed from central, an arc from an inscribed angle, a cyclic quadrilateral, chord distance, chord length) | `m12.angles-set` |
| 2 | Tangents | `m12.tangents-practice` (a tangent length, a tangent triangle, Pitot, an external tangent, a tangent angle) | `m12.tangents-set` |
| 3 | Power of a Point | `m12.power-practice` (crossing chords, a tangent from a secant, a secant from a tangent, two secants, a chord through a point) | `m12.power-set` |
| 4 | Inscribed & Circumscribed Circles | `m12.incircle-practice` (a right inradius and circumradius, inradius from area, equilateral circumradius and inradius) | `m12.incircle-set` |
| 5 | Areas with Circles | `m12.areas-practice` (area from a diameter, a sector, an arc length, a ring, a square minus a circle) | `m12.areas-set` |
| 6 | ⭐ Unit Check | `m12.review-practice` (5-problem warm-up, one per lesson) | `m12.unit-check`: 8 of 19 problems per try, pass at 100% |

### 4.13 M13 as built (2026-10-21)

Unit 13 Geometry III: Coordinates & Solids is published, with 6 lessons in the same shape and no new tools (interactive geometry stays out of scope). Figures in `content/math/unit-13/figures/`: an ant's path on a box and a grid triangle for Pick's theorem. Checkpoint mock 2 is `content/math/tests/checkpoint-2.json`: 25 original problems on Units 1–13 (algebra, number theory, counting, probability and geometry), 75 minutes, opening after Unit 13 (`stages.json` already places it).

| # | Lesson | Practice | Challenge |
|---|---|---|---|
| 1 | Coordinate Geometry | `m13.coordinates-practice` (distance, the midpoint, slope, a perpendicular slope, the intercept triangle) | `m13.coordinates-set` |
| 2 | Areas on the Grid | `m13.grid-practice` (a base on the axis, shoelace triangles and quadrilaterals, Pick's theorem, grid points on a segment) | `m13.grid-set` |
| 3 | Transformations & Symmetry | `m13.transform-practice` (a mirror line, a quarter turn, two mirrors, a half turn about a point, the mirror $y = x$) | `m13.transform-set` |
| 4 | 3D Solids | `m13.solids-practice` (box surface, cylinder, cone, sphere, the painted cube) | `m13.solids-set` |
| 5 | Nets & Space Diagonals | `m13.nets-practice` (box and cube diagonals, prism edges, a face diagonal, the ant's path) | `m13.nets-set` |
| 6 | ⭐ Unit Check | `m13.review-practice` (5-problem warm-up, one per lesson) | `m13.unit-check`: 8 of 19 problems per try, pass at 100% |
