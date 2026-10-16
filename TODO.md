# StoryForge — development to-do

What is left to build, in suggested order. DESIGN.md is the source of truth for every item; section numbers point there.
Tick an item when it is done, and update DESIGN.md §14.2 and the "Current phase" line in CLAUDE.md as usual.

Last updated: 2026-10-15 (after E15 and P5a were merged to main).

## Done so far

- [x] P0–P4: foundation, auth, classes, lesson engine, writing workspace, AI feedback
- [x] SL1–SL7: self-paced learning with the AI tutor, Story Writing Units 1–7 (§9.5–§9.11)
- [x] E0–E15: the whole Essay Writing track (§9.12)
- [x] P5a: teacher progress views: the class heatmap and the student profile (§11.3)

## 1. Story Writing content (SL8–SL12): next up

One unit per phase, in the 5-step lesson format, each with the tools and AI checks it needs (§10).

- [ ] **SL8: Unit 8 Dialogue.** Dialogue punctuation checker, subtext meter, voice consistency analyzer, scene writer.
- [ ] **SL9: Unit 9 Personal Narrative.** Memory timeline (`TIMELINE` artifact), reflection prompts, emotional arc analyzer. Personal pieces are private by default.
- [ ] **SL10: Unit 10 Genre.** Genre selector, conventions and tropes library (`/content/genres/*.json`), genre tone/style analyzer.
- [ ] **SL11: Unit 11 Revision.** Revision checklist engine, grammar and sentence-variety analyzer, before/after diff viewer, peer review (Glow / Grow / Question).
- [ ] **SL12: Unit 12 Portfolio & Showcase.** The final unit; it leads into the portfolio (P9).

## 1b. Math track: AMC 10 preparation (§9.13)

A third track inside StoryForge for AMC 10 practice (grades 9–10). Answers are checked in code; Quill only explains. **Original AMC-style problems only**: never copy past AMC problems (© MAA).

- [ ] **Confirm the open decisions** in §9.13: unit check pass mark (default 70%), authored hints on practice problems, typed answers in practice, three mocks plus the final.
- [ ] **M0 Foundation:**
  - track `MATH` (`content/math`, `m01.` keys, `/math`, third track tab, strand badges);
  - KaTeX rendering and the answer box with helper buttons and a live preview;
  - SVG figures with alt text;
  - `packages/math-check` (`parseAnswer`, exact `answersEqual`, safe `compute` evaluator) and content:check answer verification;
  - `PROBLEMS` practice and the `PROBLEM_SET` marked challenge and unit check;
  - the error log;
  - Quill `math-explain` and `math-mistake` (verdict never changed by AI).
- [ ] **M1** Unit 1 Problem Solving & the AMC 10
- [ ] **M2** Unit 2 Arithmetic & Number Sense
- [ ] **M3** Unit 3 Linear Equations & Word Problems
- [ ] **M4** Unit 4 Quadratics & Polynomials
- [ ] **M5** Unit 5 Functions & Inequalities
- [ ] **M6** Unit 6 Sequences & Patterns
- [ ] **M7** Unit 7 Number Theory I
- [ ] **M8** Unit 8 Number Theory II
- [ ] **M9** Unit 9 Counting I
- [ ] **M10** Unit 10 Counting II & Probability
- [ ] **M11** Unit 11 Geometry I: Triangles & Polygons
- [ ] **M12** Unit 12 Geometry II: Circles
- [ ] **M13** Unit 13 Geometry III: Coordinates & Solids
- [ ] **M14** Unit 14 Logic & Mixed Strategies
- [ ] **M15** Unit 15 Mock Exams & Final Review: `MOCK_TEST` (25 problems, 75-minute timer, AMC scoring 6 / 1.5 / 0), mocks A–C and the final, the AMC-score estimate, error-log review

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

- [ ] **P11 Hardening** (§13): Postgres row-level security, security headers, a rate-limit review, k6 load tests, an accessibility audit, observability dashboards, a backup/restore runbook.
- [ ] **Admin role** (§1): schools and teachers, curriculum editing, platform analytics, AI settings and budget caps.

## 5. Tests owed

Development since P4a ran without new tests (by agreement). Every phase in DESIGN.md has a **"Tests owed"** list; search for that phrase to find them all.

- [ ] **Authorisation tests for every endpoint** (a CLAUDE.md rule), most urgently:
  - `PUT /submissions/:id/outline`, `/checklist`, `/essay-type` and the other choice endpoints
  - the marked quiz endpoints (`/lessons/:id/quiz/...`)
  - `GET /teacher/classes/:classId/progress` and `GET /teacher/classes/:classId/students/:studentId/progress` (students 403; another teacher's class or a student outside the class 404)
- [ ] The analyzer, Coach and rubric unit tests listed under each E-phase (E1–E15) and SL-phase.
- [ ] Playwright happy paths with `expectAccessible(page)` for the essay workspace tools and the teacher progress pages.

## Known issues to revisit

The Known misses lists in DESIGN.md §9.12 record each Essay unit's analyzer limits. For example, the Coach misses subject–verb agreement after a long subject, and a narrative hook without a time phrase reads as plain.
