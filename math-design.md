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

**Plan: 15 units, about 90 lessons.** Every unit ends with a ⭐ unit check: a marked set of AMC-style problems (pass mark below).

| Unit | Lessons |
|---|---|
| 1 Problem Solving & the AMC 10 | The AMC 10 (format, scoring, timing) · Read carefully & draw it · Work backwards & test the choices · Estimate & eliminate · Smart guessing (the value of a blank vs a guess) · ⭐ check |
| 2 Arithmetic & Number Sense | Fractions, decimals & percents · Ratios, rates & proportions · Averages & weighted averages · Exponents & roots · Clever arithmetic (factoring, difference of squares) · ⭐ check |
| 3 Linear Equations & Word Problems | Linear equations · Systems of equations · Distance, rate & time · Work & mixtures · Ages, coins & money · ⭐ check |
| 4 Quadratics & Polynomials | Factoring · Quadratic formula & discriminant · Vieta's formulas · Completing the square & the vertex · Polynomial remainders · ⭐ check |
| 5 Functions & Inequalities | Functions & notation · Graphs & transformations · Absolute value · Inequalities & AM–GM · Floor, ceiling & piecewise · ⭐ check |
| 6 Sequences & Patterns | Arithmetic sequences · Geometric sequences & series · Recursion · Telescoping & clever sums · Finding the pattern · ⭐ check |
| 7 Number Theory I | Divisibility rules · Primes & factorization · GCD & LCM · Counting divisors · Factorials & trailing zeros · ⭐ check |
| 8 Number Theory II | Remainders & modular arithmetic · Units digits & cycles · Number bases · Digit problems · Integer equations · ⭐ check |
| 9 Counting I | Multiplication principle · Permutations · Combinations · Casework · Complementary counting · ⭐ check |
| 10 Counting II & Probability | Stars & bars · Inclusion–exclusion · Probability · Geometric probability · Expected value · ⭐ check |
| 11 Geometry I: Triangles & Polygons | Angles & parallel lines · Pythagoras & special right triangles · Similar triangles · Area (including Heron's formula) · Polygons & angle sums · ⭐ check |
| 12 Geometry II: Circles | Arcs, chords & inscribed angles · Tangents · Power of a point · Inscribed & circumscribed circles · Areas with circles · ⭐ check |
| 13 Geometry III: Coordinates & Solids | Coordinate geometry · Areas on the grid (shoelace, Pick's theorem) · Transformations & symmetry · 3D solids · Nets & space diagonals · ⭐ check |
| 14 Logic & Mixed Strategies | Logic puzzles · Invariants & parity · Games & strategy · Clocks, calendars & time · Mixed sets by difficulty · ⭐ check |
| 15 Mock Exams & Final Review | A pacing plan · Mock AMC 10 A · Learning from the error log · Mock AMC 10 B · Mock AMC 10 C · 🏆 Final mock & test-day plan |

Strands (progress badges): **Strategy** (1, 14, 15), **Algebra** (2–6), **Number Theory** (7–8), **Counting & Probability** (9–10), **Geometry** (11–13).

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
  - `MOCK_TEST` (built in M15): 25 problems, a server-side 75-minute timer (handed in automatically when time runs out), AMC scoring, then a review by question, by strand and by difficulty.
- **Error log:** every wrong or "Show me" problem goes to *My error log* by skill. Students redo them later (a problem leaves the log after two correct redos on different days). Unit 15 has a lesson on using it.
- **Quill for math** (packages/ai; fake gateway in tests):
  - `math-explain` ("Explain it another way"): explains the given solution differently, step by step.
  - `math-mistake` ("Why was mine wrong?"): suggests the likely mistake from the student's answer and, optionally, their typed working.
  - Both receive the problem, the authored solution and the answer. They are told never to change the verdict or reveal a different answer, and their output is checked: a number in Quill's text that contradicts the authored answer is dropped.
  - "Try a similar one" comes from the bank (same skill and difficulty, not seen yet), not from AI-generated problems, because generated problems can't be guaranteed correct.
- **Progress & teacher views:** the Math tracker shows lessons, unit checks, accuracy per strand and, after M15, mock scores with an AMC-score estimate. The P5a heatmap works unchanged (`?track=math`).

**Decisions (accepted by the project owner with "start M0", 2026-10-16):**
1. **Unit check pass mark: 70%**, since AMC-style problems are harder than the essay quizzes (Essay uses 80%).
2. **Hints: authored hints on practice problems** (none during unit checks and mocks). The Story track chose "no practice hints", but stepped hints are standard in math practice.
3. **Answer format in practice: mostly typed answers**, so guessing doesn't count. Choices (A)–(E) appear in unit checks and mocks, as on the AMC.
4. **Mocks: three full original mocks** (A, B, C) plus the final.

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

## 3. M0.5 Math practice upgrade (plan)

M0 reused the writing app's shapes: units in a straight line, text-only Learn cards, free-text reflections, AI as the main source of feedback, and a lessons × students heatmap. These suit writing, not contest math. M0.5 adds the habits that AMC preparation needs, **before** unit content is written, because parts A and B change the problem format.

**Rule: the Story Writing and Essay Writing tracks do not change.** Everything in M0.5 is Math-only:
- New schema fields and card kinds are optional and additive. content:check rejects them outside `content/math`.
- Shared components get a Math branch only behind `track === 'MATH'`. Story and Essay content, UI copy, AI prompts, rubrics, routes and progress views stay exactly as they are.
- New tables, endpoints and pages live under the Math module and `/math`.

M0.5 has three parts, built in order. Each part is usable on its own.

### 3.1 Part A: the content format (before any unit content)

**A1. Skill list** (`content/math/skills.json`)
- About 60 AMC skills, e.g. `{ "id": "casework", "label": "Casework", "strand": "counting", "units": [9] }`.
- `problem.skill` must be one of these ids (content:check). The strand comes from the skill, so strand accuracy needs no extra field.
- Lesson `focusSkills` in Math lessons must be skill ids too.

**A2. Problem templates: verified variants**
- A problem may carry `template`:
  ```json
  "template": {
    "vars": { "a": { "from": 3, "to": 12 }, "b": { "choose": [2, 3, 5] } },
    "where": ["a != b", "gcd(a, b) == 1"]
  }
  ```
- `{expr}` placeholders in the prompt, hints, solution, choices and accepted answers are filled per variant: `"A rectangle is {a} by {b}…"`, `"accepted": ["{a*b}"]`.
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
- **"Try a similar one"** (practice and the error log) shows the same template with a new seed. A problem without a template falls back to another problem of the same skill and difficulty that the student hasn't seen yet.

**A3. Why each wrong answer is wrong (no AI needed)**
- Choice problems: `answer.why: { "B": "You counted the blanks as 1 point each, not 1.5." }`, written for the plausible wrong choices.
- Typed problems: `mistakes: [{ "value": "90", "why": "That's only the points from right answers." }]`. A wrong answer equal (by math-check) to a listed value gets that note.
- Both may use `{expr}` placeholders in templates.
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
- Interactive geometry (dragging points) waits for M11–M13.

### 3.2 Part B: how students practise

**B1. The answer record** (the base for B2–B5 and C4)
- A new table, `MathAnswerLog`: `studentId`, `source` (practice | set | review | sprint | redo), `lessonId?`, `activityKey?`, `problemId`, `seed?`, `skill`, `difficulty`, `verdict`, `seconds?`, `confidence?`, `createdAt`.
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

**B3. Daily mixed review** (`/math/review`)
- About 6 problems a day:
  - error-log redos that are due come first;
  - then skills that are due, from finished units only.
- **Spacing** per skill (`MathSkillState`: `box`, `dueAt`): a right answer moves the skill up a box, and a wrong one moves it back to box 1. The boxes are 1, 2, 4, 8, 16 and 30 days.
- Problems are mixed across skills (interleaved), never blocked by topic. Templates give fresh numbers.
- The `/math` home page shows "Today's review: 6 problems" and a gentle streak count. The streak is display only; P6 gamification decides more later.

**B4. Speed: timers and sprints**
- **Practice timer:** an optional per-problem stopwatch, off by default; the setting is kept in the browser (`localStorage`). Seconds per problem go into the answer record whether or not the stopwatch is shown.
- **Sprint** (`/math/sprint`):
  - 10 choice problems in 20 minutes, from finished units, rising in difficulty;
  - AMC scoring (6 / 1.5 / 0) and a countdown that hands in at zero;
  - afterwards, time per problem against the AMC pace (about 3 minutes);
  - an `attempt` row per sprint (reusing `QuizAttempt` with `activityKey` `sprint:<date>`), problems chosen on the server.
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
- A new analyzer, `math-card`, replaces the hidden writing tutor on Math Learn cards. It runs "Explain it another way" for definition and example cards, with the M0 math guard: steps stating a different result than the card are dropped.
- The writing tutor (`explain-card`) is unchanged and is still used for Story and Essay cards.

**C3. A math Reflect step**
- Math lessons' Reflect steps may set `trapPicker: true`:
  - "Which problem tricked you?" lists the problems the student missed in this lesson, or all of them if none were missed.
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

### 3.4 M0.5 data and endpoints (summary)

| New | What |
|---|---|
| `content/math/skills.json` | Skill list (A1) |
| Problem fields | `template`, `answer.why`, `mistakes`, `figure.scale` (A2, A3, A5) |
| Learn card | `worked-example` (Math only, A4) |
| Reflect | `trapPicker` (Math only, C3) |
| Tables | `MathAnswerLog` (B1), `MathSkillState` (B3) |
| Endpoints | `POST /math/answers`, `GET /math/skills` (mastery), `GET /math/review`, `POST /math/review/answer`, `POST /math/sprints`, `POST /math/sprints/:id/submit`, `POST /ai/math/nudge`, `POST /ai/math/card`, `GET /teacher/classes/:classId/math-skills` |
| Pages | `/math/review`, `/math/sprint`, the skills and calibration sections of `/math/progress`, the teacher skills view |

### 3.5 M0.5 acceptance

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
- **Everywhere:** axe passes on every new page; the Story and Essay tracks look and behave exactly as before.

**Tests owed (M0.5):**
- math-check variables, comparisons and template expansion;
- template, `why` and `mistakes` checks in `problemErrors`;
- `POST /math/answers` re-marking;
- mastery levels and review spacing (pure functions, unit-testable);
- authorisation for every new endpoint;
- a Playwright run of the daily review and a sprint with `expectAccessible`.

## 4. Phases

| Phase | Scope | Acceptance |
|---|---|---|
| **M0 Math track foundation** ✅ | Track `MATH`, `/math`, KaTeX, SVG figures, `packages/math-check`, the problem format, `PROBLEMS` and `PROBLEM_SET`, the error log, Quill explanations (§2) | A sample problem set renders, checks typed answers exactly and is marked on the server; content:check rejects a `compute` that disagrees with the answer; axe passes |
| **M0.5 Math practice upgrade** | Part A (skills, templates, wrong-answer notes, worked examples, figure flags), Part B (answer record, mastery, daily review, sprints, confidence, scratchpad), Part C (Quill nudges, the math card tutor, the trap picker, tone, teacher skills view) (§3) | §3.5 |
| **M1–M14 Math units** | One AMC 10 unit per phase (§1 plan), written in the M0.5 format, with the tools each unit needs (for example a counting tree builder or a number line) | Each unit playable end to end; every computable answer and every template variant verified by content:check |
| **M15 Mock exams** | `MOCK_TEST` (25 problems, 75-minute server timer, AMC scoring 6 / 1.5 / 0), three mocks and the final, strand and difficulty breakdown, AMC-score estimate, error-log review | A mock hands itself in when time runs out; scores match AMC scoring |
