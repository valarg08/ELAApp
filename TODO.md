# StoryForge — development to-do

What is left to build, in suggested order. DESIGN.md is the source of truth for every item; section numbers point there.
Tick an item when it is done, and update DESIGN.md §14.2 and the "Current phase" line in CLAUDE.md as usual.

Last updated: 2026-10-28 (PSAT Math track: PS0 + PS1, four units with lessons, practice and four-choice PSAT questions).

## Done so far

- [x] P0–P4: foundation, auth, classes, lesson engine, writing workspace, AI feedback
- [x] SL1–SL7: self-paced learning with the AI tutor, Story Writing Units 1–7 (§9.5–§9.11)
- [x] E0–E15: the whole Essay Writing track (§9.12)
- [x] P5a: teacher progress views: the class heatmap and the student profile (§11.3)
- [x] M0: the Math track engine (math-design.md §2)
- [x] M0.5 and M1–M15: the Math practice upgrade, Math Units 1–15, checkpoint mocks 1 and 2, mocks A–C and the final mock, the AMC-score estimate and the past-paper log (math-design.md §3, §4.1–§4.15)
- [x] MN0–MN1: the Mental Math track (fourth tab, levels, cheat sheets, tips) and Unit 1 Number Bonds (mental-math-design.md)
- [x] MN2–MN15: Mental Math Units 2–15 (all 15 units built)
- [x] MN-practice: Mental Math daily review and streaks, speed sprints, level and placement checks, parent guide, skill mastery
- [x] PS0 + PS1: the PSAT Math track (fifth tab, `/psat`, the review sheet) and Units 1–4, 3 lessons each (psat-design.md)

## 1. Story Writing content (SL8–SL12): next up

One unit per phase, in the 5-step lesson format, each with the tools and AI checks it needs (§10).

- [ ] **SL8: Unit 8 Dialogue.** Dialogue punctuation checker, subtext meter, voice consistency analyzer, scene writer.
- [ ] **SL9: Unit 9 Personal Narrative.** Memory timeline (`TIMELINE` artifact), reflection prompts, emotional arc analyzer. Personal pieces are private by default.
- [ ] **SL10: Unit 10 Genre.** Genre selector, conventions and tropes library (`/content/genres/*.json`), genre tone/style analyzer.
- [ ] **SL11: Unit 11 Revision.** Revision checklist engine, grammar and sentence-variety analyzer, before/after diff viewer, peer review (Glow / Grow / Question).
- [ ] **SL12: Unit 12 Portfolio & Showcase.** The final unit; it leads into the portfolio (P9).

## 1b. Math track: AMC 10 preparation (math-design.md)

A third track inside StoryForge for AMC 10 practice (grades 9–10). Answers are checked in code; Quill only explains. **Original AMC-style problems only**: never copy past AMC problems (© MAA). Math work never changes the Story or Essay tracks.

- [x] **Decisions confirmed** (math-design.md): 100% unit check pass mark (was 70%), authored hints on practice problems, typed answers in practice, three mocks plus the final.
- [x] **M0 Foundation** (done; see math-design.md §2):
  - track `MATH` (`content/math`, `m01.` keys, `/math`, third track tab, strand badges);
  - KaTeX rendering and the answer box with helper buttons and a live preview;
  - SVG figures with alt text;
  - `packages/math-check` (`readAnswer`, exact `checkAnswer` with answer forms, safe `evaluate` for `compute`) and content:check answer verification;
  - `PROBLEMS` practice and the `PROBLEM_SET` marked challenge and unit check;
  - the error log;
  - Quill `math-explain` in explain and mistake modes (verdict never changed by AI).
- [x] **M0.5 Math practice upgrade** (done; math-design.md §3; Math only; tests owed listed in §3.6):
  - Part A, content format: skill list (`skills.json`), problem templates with verified variants and "Try a similar one", wrong-answer notes (`answer.why`, `mistakes`), worked-example cards with faded steps, figure scale flag and zoom;
  - Part B, practice: the answer record (`MathAnswerLog`), skill mastery and difficulty, the daily mixed review with spacing, sprints with AMC scoring, confidence and calibration, scratchpad and typed working;
  - Part C: Quill nudges, the math Learn-card tutor, the trap picker in Reflect, plainer tone for 14–16, the teacher skills view;
  - Part D, tests and final prep: the `MOCK_TEST` engine (moved from M15: skip, flag, the 2-minute rule, mistake analysis, time sinks), the diagnostic test (25 problems, report, starting skill levels), checkpoint slots, the danger-zone report, fact sheets (`facts.json`), light review, the four stage labels on `/math` (unit order unchanged).
- [x] **M1** Unit 1 Problem Solving & the AMC 10: finish the lessons after the sample lesson (incl. smart guessing & the 2-minute rule), the ⭐ check (100%), publish the unit, in the M0.5 format
- [x] Math extras noted in M0: `$…$` display math (math-design.md §4.16)
- [x] **M2** Unit 2 Arithmetic & Number Sense: 5 lessons and the ⭐ check (100%), published, with its fact sheet
- [x] **M3** Unit 3 Linear Equations & Word Problems: 5 lessons and the ⭐ check (100%), published, with its fact sheet
- [x] **M4** Unit 4 Quadratics & Polynomials: 5 lessons and the ⭐ check (100%), published, with its fact sheet
- [x] **M5** Unit 5 Functions & Inequalities: 5 lessons and the ⭐ check (100%), published, with its fact sheet
- [x] **M6** Unit 6 Sequences & Patterns: 5 lessons and the ⭐ check (100%), published, with its fact sheet
- [x] **M7** Unit 7 Number Theory I: 5 lessons and the ⭐ check (100%), published, with its fact sheet
- [x] **M8** Unit 8 Number Theory II: 5 lessons and the ⭐ check (100%), published, with its fact sheet, plus checkpoint mock 1 (25 problems: algebra and number theory)
- [x] **M9** Unit 9 Counting I
- [x] **M10** Unit 10 Counting II & Probability
- [x] **M11** Unit 11 Geometry I: Triangles & Polygons (incl. angle chasing)
- [x] **M12** Unit 12 Geometry II: Circles
- [x] **M13** Unit 13 Geometry III: Coordinates & Solids, plus checkpoint mock 2 (25 problems: everything so far)
- [x] **M14** Unit 14 Logic & Mixed Strategies
- [x] **M15** Unit 15 Mock Exams & Final Review (10 lessons): pacing & the 2-minute rule, mocks A–C with mistake analysis, algebra / geometry / counting & number theory refreshes, danger zones, light review & confidence, the final mock & test-day plan; the AMC-score estimate; the past-paper log (answer letters only, never problem text)
- [x] Every unit M1–M14 ships its fact sheet (`facts.json`)

## 1c. Mental Math track (mental-math-design.md)

Number sense for ages 7–14, one unit per phase. Original problems only; typed whole-number answers in Levels 1–2.

- [x] **MN0** Foundation: track `MENTAL`, `/mental`, levels, cheat sheets, pattern tips, `MentalModule`, Quill audience
- [x] **MN1** Unit 1 Number Bonds (4 lessons and the ⭐ check at 100%, published)
- [x] **MN2** Unit 2 Doubling & Halving
- [x] **MN3** Unit 3 Compensation
- [x] **MN4–MN7** Level 2: Front-End, Multiplication Anchors, Benchmarks, Missing Number Thinking
- [x] **MN8–MN11** Level 3: Fractions/Decimals/Percentages, Divisibility 2–11, Estimation, Smart Multiplication
- [x] **MN12–MN15** Level 4: Squares to 30², Difference of Squares, Vedic Patterns, Speed & Accuracy Systems
- [x] **MN-unit-tests** A timed test after every unit: 20 questions in 25 minutes, the timer in the side panel
- [x] **MN-teacher** The teacher's Mental Math skills & practice view (class progress page: practice table, weakest skills, skills grid)
- [x] **MN-practice** Daily review and streaks, speed sprints with personal bests, level checks with badges, the placement check, the parent guide page, mastery per Mental Math skill, a separate Mental Math mistakes list

## 1d. PSAT Math track (psat-design.md)

- [x] **PS0** Foundation: track `PSAT`, `/psat`, four-choice answers, `content/psat/skills.json`, the review sheet in the track, Quill audience
- [x] **PS1** Units 1–4 (Algebra, Advanced Math, Problem-Solving & Data Analysis, Geometry & Trigonometry), 3 lessons each, published
- [ ] Later: a PSAT error log and daily review, timed practice modules and a full practice test, typed answers in the challenge sets, more lessons, a teacher skills view

## 2. Teacher dashboard: rest of P5 (§11)

- [ ] **Review queue** (§11.4): tabs for AI drafts to approve, projects to grade, returned for revision, and peer reviews to moderate; flagged items first.
- [ ] **Submission review** (§6.5, §11.4): student text with inline comments, a version compare, AI levels beside the teacher's levels, and editable summary, strengths and next steps. Actions: Approve AI, Edit & release, Hide AI, Return for revision. Shortcuts: J/K, 1–4, A, R. Acceptance: the teacher overrides an AI score, the student sees only the teacher version, and an audit log entry exists.
- [ ] **Custom rubric builder** (§11.5): templates, criteria, level descriptors, weights, exemplars, preview, and assigning a rubric to an activity.
- [ ] **Concept mastery** (§11.3): per focus skill, per class and per student, from analyzer pass rates, rubric levels and quiz items.
- [ ] **Class list counts** (§11.1): active today, items to review, open flags.
- [ ] **Roster extras** (§11.2): move a student between classes, remove a student, private teacher notes, and an XP/badge timeline (after P6).
- [ ] **Class settings** (§11.8): streak rule, holidays, leaderboard, peer review, constraint defaults, export formats.
- [ ] **CSV export** of progress and results.

## 3. Student extras

- [ ] **P6 Gamification** (§7): XP events, levels, streaks with freezes, the badge engine and seed catalogue, missions, unlocks, dashboard widgets, optional leaderboard.
- [ ] **P7/P8 tool gaps** (§10): the tools from §10 not yet built for Units 1–7 (for example the poetry collection builder, the free-verse "read with pauses" audio, the "describe without naming" guessing game); the Unit 8–11 tools are covered by SL8–SL11 above.
- [ ] **P9 Portfolio** (§12): 7 slots with validation, a writer's reflection, a cover designer, teacher approval, and HTML/PDF export. Needs SL8–SL12 first.
- [ ] **P10 Concept tests** (§11.6): teacher test builder, AI question generation (draft until published), the student test-taker, auto-grading, results and item analysis.

## 4. Platform

- [ ] **P11 Hardening** (§13): Postgres row-level security, a full script CSP with nonces, k6 load tests, an accessibility audit, observability dashboards. Done for the trial: basic security headers, sign-in rate limits, closed teacher sign-up with `user:create`, `/privacy`, nightly backups and a restore note (deploy/windows/README.md).
- [ ] **Email for teachers and admins** (staff only; students never get email, §13.3): an email module in the API with a no-op stand-in for development and tests (like the fake AiGateway), sending from `no-reply@owleryacademy.com` through a transactional provider (Resend suggested; Postmark or Amazon SES also fit), with its SPF/DKIM records in Cloudflare DNS and the API key in the production `.env` (and `globalPassThroughEnv`). Features: (1) a welcome email when the admin adds a teacher, with an expiring one-time "set your password" link instead of the admin passing on a password; (2) "Forgot password?" on the teacher login page (expiring, single-use reset tokens stored as hashes; the same answer whether or not the email exists); (3) alerts to the admin when a school reaches its daily AI budget. Until then the admin hands out passwords with **Add a teacher** and **Reset password** (`/admin/schools`).
- [x] **Admin role** (§1, DESIGN.md §11.9): schools and teachers, platform analytics, AI usage with per-school daily budgets that pause live checks, curriculum status and sync, a seeded dev admin. Later: the curriculum editor, prompt versions and evals, budget alert emails.

## 5. Tests owed

Development since P4a ran without new tests (by agreement). Every phase in DESIGN.md has a **"Tests owed"** list; search for that phrase to find them all.

- [ ] **Authorisation tests for every endpoint** (a CLAUDE.md rule), most urgently:
  - `PUT /submissions/:id/outline`, `/checklist`, `/essay-type` and the other choice endpoints
  - the marked quiz endpoints (`/lessons/:id/quiz/...`)
  - `GET /teacher/classes/:classId/progress` and `GET /teacher/classes/:classId/students/:studentId/progress` (students 403; another teacher's class or a student outside the class 404)
  - the Math endpoints: `/lessons/:id/problem-sets/:key` (start/submit student-only; another student's attempt 404), `/math/error-log` (student-only; another student's entry 404), `/ai/math/explain` (student-only; a marked set not explained before a submitted try)
- [ ] Mental Math: `GET /mental/home` (students only; teachers 403), `GET /mental/cheat-sheets/:unitNumber` (unpublished units 404 for students), the loader checks for `content/mental` (levels order, unknown skills, cheat sheet of a missing unit), the Quill audience line in the three Math analyzers, `SimpleAnswers` in the answer box.
- [ ] Mental Math Units 4–15: `UnitCard` `previousNumber` (a locked unit names the last built unit before it), one Playwright run through a Level 4 unit check.
- [ ] Mental Math practice: `GET /mental/progress` (students only; teachers 403), the `mental-*` start keys on `/math/tests` (level check 403 until the level is done; review 409 on a second try the same day), `placementOutcome` and `MentalStart` (startUnit only goes up; `classAvailability` `openThrough`), `trackKeyFilter` (Mental Math mistakes never in the AMC error log or review, and the other way round), sprint best (most right, then fastest), `reviewStreak`, `currentUnit`; one Playwright run through a sprint and the placement check.
- [ ] Mental Math unit tests: `mental-unit-N` locked until the unit's lessons are done (403), 20 items from that unit only with a 25-minute limit, `practice.unitTests` best and open attempt, `mental.unitTest` (passed at 20/20, previousBest), the side timer (`SIDE_TIMER_ID`) shown from md up and the header clock on phones (axe).
- [ ] Mental Math teacher view: `GET /teacher/classes/:classId/mental-skills` (students 403; another teacher's class 404; only skills with answers; badges, streak, sprint best and start level per student), the class progress page's Mental Math "Skills & practice" view (axe).
- [ ] Math PSAT review sheet and open units: `GET /math/psat-facts` (signed out 401; students 404 until a Math unit is published), the loader checks for `content/math/psat-facts.json` (TeX, unknown skills), `classAvailability` (every published Math unit open; other tracks still in order).
- [ ] PSAT Math: the tests owed in psat-design.md §5 (open units, `trackKeyFilter('PSAT')`, four-choice answers, the loader checks, axe on `/psat`, one Playwright run).
- [ ] Admin: authorisation for every `/admin` endpoint, the AI budget pause on live checks, `estimateCostCents` (DESIGN.md §11.9).
- [ ] The analyzer, Coach and rubric unit tests listed under each E-phase (E1–E15) and SL-phase.
- [ ] math-check unit tests (values, parsing, answer forms, TeX choices) and `problemErrors` / figure-sanitiser tests (M0).
- [ ] Playwright happy paths with `expectAccessible(page)` for the essay workspace tools and the teacher progress pages.

## Known issues to revisit

The Known misses lists in DESIGN.md §9.12 record each Essay unit's analyzer limits. For example, the Coach misses subject–verb agreement after a long subject, and a narrative hook without a time phrase reads as plain.

- Tests owed (PSAT geometry study guide): axe on `/psat/geometry`, `/psat/algebra`, `/psat/number-sense` and a sub-module of each guide (e.g. `/psat/number-sense/fractions`, `/psat/geometry/circles`, `/psat/algebra/quadratics`); a unit test that every guide problem's answer (all three guides) passes `checkAnswer` (with its form) and its steps end with "Answer:"; a wrong answer shows the steps, a right one counts as solved; the Chapters menu shows "Study guides → Geometry" only on PSAT pages, marked current on the guide; the level tabs (Middle school / PSAT) switch with arrow keys, keep separate solved counts, and every middle-school problem has a B.E.S.T. benchmark tag and passes `checkAnswer`; every Geometry/Algebra figure renders (no exceptions) with a `figcaption`, and figure maps only name problems 1–25 of an existing chapter.

- Tests owed (SAT S0): axe on `/sat`; `/start?track=SAT` redirects to `/sat`; the SAT tab shows on every track tabs bar; `satWeekPlan` gives 44 questions per week (odd 19/9/11/5, even 18/9/11/6) and 22 per module; `ActivityKey` accepts "s01." keys.
- [ ] SAT S1–S4 and S-teacher (sat-design.md §6).
- Tests owed (SAT S1): an authorisation test for every `/sat/*` endpoint (student only; another student's attempt answers 404); `satTypedError`/`satTypedMatches` (5/6 characters, mixed numbers, 1/3 as .333); `satNextModule` (14 of 22 → harder); a module past its deadline is handed in on the next request and module 2 starts with a full clock; answers and solutions are absent from a module's JSON; axe on `/sat/week/1`, the player (question, check-your-work and dialogs) and the result; `loadSatContent` reports a wrong `compute`, a 3-choice question and a harder-then-easier module.
- Tests owed (SAT S2): `satScoreEstimate` (easier path 200–600, harder 400–800, rounded to 10, band 40; weighted points 10 of 17.5 on the hard path gives 630); the result's area and skill totals add up to the questions asked; `/sat/mistakes` lists a missed or blank question once, newest test first, and never a right one; its authorisation test (students only); axe on the result page and `/sat/mistakes`.
- Tests owed (SAT adaptive practice): `satPickNext` (never repeats an asked question, favours the weakest skill, avoids the same skill twice in a row, nearest level, prefers a previously missed question, null when the bank is used up); `satStartLevel` and `satNextLevel`; a set finishes after its size or when the bank runs out; a question not waiting for an answer answers 409; an invalid typed answer answers 400 and is not recorded; every `/sat/practice/*` endpoint's authorisation test (students only, another student's set 404); the answer and solution are absent from a question until it is answered; axe on `/sat/practice` and a set.
- Tests owed (SAT S3): `satWeekOpens`/`satWeekIsOpen`/`satToday` (week 2 opens 7 days after week 1; the class's time zone decides today); a locked week answers 403 on start but an attempt already started still opens; the newest open week is `current`; a class without a date has every week open; the teacher schedule endpoints' authorisation tests (teachers only; another teacher's class 404; a date that is not real answers 400); axe on the teacher SAT card and `/sat` with the score chart.
