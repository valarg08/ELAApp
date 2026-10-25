# Mental Math track — design (source of truth)

The fourth learning track: **Mental Math** (number sense), for ages 7–14. It runs on the Math engine
(math-design.md) but has its own tab, levels, cheat sheets and pattern tips. Math (AMC 10), Story
Writing and Essay Writing are not changed by this track.

**Principle: teach patterns, not tricks.** Every shortcut is shown with *why* it works (a picture, a
bond, or a line of algebra for older students) before it is practised.

---

## PART 1 — Curriculum: the 15 topics

| # | Unit | Level | The pattern |
|---|------|-------|-------------|
| 1 | Number Bonds | 1 | Pairs that make 10, 20, 100; make 10 first when crossing a ten |
| 2 | Doubling & Halving | 1 | Doubles, near doubles; double one factor, halve the other |
| 3 | Compensation | 1 | Round to a friendly number, then fix: 38 + 27 = 40 + 27 − 2 |
| 4 | Front-End Adding & Subtracting | 2 | Work from the left: hundreds, then tens, then ones |
| 5 | Multiplication Anchors | 2 | Build unknown facts from ×2, ×5, ×10: 7 × 6 = 5 × 6 + 2 × 6 |
| 6 | Benchmark Numbers | 2 | Think with 10, 25, 50, 100: ×25 = ×100 ÷ 4 |
| 7 | Missing Number Thinking | 2 | Balance: what makes both sides equal? Inverse operations |
| 8 | Fractions, Decimals & Percentages | 3 | ½ = 0.5 = 50%; 10% and 1% as building blocks |
| 9 | Divisibility Rules 2–11 | 3 | Last digits, digit sums (3, 9), alternating sums (11) |
| 10 | Estimation | 3 | Round first, check the size of the answer |
| 11 | Smart Multiplication | 3 | ×9 = ×10 − 1; ×11 digit pattern; ×99 = ×100 − 1; ×999 |
| 12 | Squares 1² to 30² | 4 | Know to 15², build to 30²: (a + b)² and ending-in-5 squares |
| 13 | Difference of Squares | 4 | a² − b² = (a + b)(a − b): 48 × 52 = 50² − 2² |
| 14 | Vedic Patterns | 4 | "All from 9, last from 10", vertically and crosswise — each proved with algebra |
| 15 | Speed & Accuracy Systems | 4 | Sprints, spaced review, error tracking, checking habits |

## PART 2 — Age groups (the four levels)

- **Level 1 · Number Friends · ages 7–8** — units 1–3. Concrete pictures (fingers, ten frames, number lines), small numbers, short sessions (15–20 min).
- **Level 2 · Pattern Spotters · ages 9–10** — units 4–7. Place value, times tables as anchors, word problems.
- **Level 3 · Number Sense Builders · ages 11–12** — units 8–11. Fractions, divisibility, estimation, multiplication patterns.
- **Level 4 · Pattern Masters · ages 13–14** — units 12–15. Algebra explains the shortcuts; speed with accuracy.
- A student may start at any level: units open in order inside the track (self-paced: finish the unit before).

## PART 3 — 36-week roadmap (about 2–3 lessons a week)

- Weeks 1–3: Unit 1 Number Bonds · Weeks 4–5: Unit 2 · Weeks 6–7: Unit 3 · Week 8: Level 1 review.
- Weeks 9–10: Unit 4 · 11–12: Unit 5 · 13–14: Unit 6 · 15–16: Unit 7 · Week 17: Level 2 review.
- Weeks 18–19: Unit 8 · 20–21: Unit 9 · 22–23: Unit 10 · 24–25: Unit 11 · Week 26: Level 3 review.
- Weeks 27–28: Unit 12 · 29–30: Unit 13 · 31–32: Unit 14 · 33–34: Unit 15 · Weeks 35–36: final review and challenge.
- Older students skip ahead; younger students repeat a level's units until the unit check passes.

## PART 4 — Lesson structure (the five steps)

Every lesson uses the platform's five steps (DESIGN.md §9.4):

1. **Hook** — a quick question to try before the lesson (fingers, change from 100…).
2. **Learn** — 3–6 cards: the pattern, *why it works*, a worked example with "try it" steps the student types, and the common trap.
3. **Practice** — typed problems from easy to hard, with hints and wrong-answer notes; numbers change on every try (templates).
4. **Challenge** — a marked problem set with typed answers, no hints.
5. **Reflect** — one or two prompts and the confidence check.

The last lesson of each unit is the **⭐ unit check**: a warm-up, then 8 typed questions; pass at 100%.

## PART 5 — Gamification and motivation

- Built now: progress bars per unit and level, ✓ Done badges, "Keep going" card, tip of the day, confidence check.
- Later (MN-later): streaks and the daily review for Mental Math, speed sprints (Unit 15), personal-best times, level badges.
- No leaderboards between students: compare only with your own past results.

## PART 6 — Assessment

- Practice is not marked; the challenge sets and unit checks are (QuizAttempt, like Math problem sets).
- Unit check: 8 questions drawn from a larger pool, 100% to pass, new numbers on each try.
- Every answer goes to the answer record (MathAnswerLog) with its skill, so mastery per skill can be shown later.
- Later: a level check at the end of each level and a placement check to choose a starting level.

## PART 7 — Parent guide (to be written as a page, MN-later)

- 10 minutes a day beats an hour on Sunday.
- Ask "how did you think it?" rather than "what's the answer?".
- Praise the strategy, not the speed; speed comes with practice.
- Everyday chances: change at the shop, sharing snacks, times on the clock, scores in games.

## PART 8 — Exam pathway

- Levels 1–2 support school number fluency (times tables, written-method checks).
- Level 3 supports entrance and competition arithmetic (fractions, divisibility, estimation).
- Level 4 links to the Math (AMC 10) track: squares, difference of squares and divisibility are used in AMC Units 2, 4, 7 and 8.

## PART 9 — Teacher guide

- Teachers see Mental Math in the class progress heatmap like the other tracks (the track switch on `/classes/[classId]/progress`).
- Suggested use: a 10-minute warm-up at the start of a maths lesson; one lesson per week in class, the rest at home.
- Watch the unit check results: a student who fails twice should redo the practice of the lesson with the weakest skill.

## PART 10 — Content rules

- **Original problems only.** No copied worksheets or competition problems.
- Every computable answer has `compute`, checked by `pnpm content:check`.
- Ages 7–10 (Levels 1–2): whole numbers, short sentences, everyday contexts, no algebra symbols.
- Ages 11–14 (Levels 3–4): algebra may explain *why*; answers stay numbers.
- Never call a pattern "magic": always say why it works.

---

## App mapping

- **Track:** `MENTAL` (Prisma `Track` enum, `TRACKS` in packages/shared). Tab "🧠 Mental Math" in `TrackTabs`; card on `/start`.
- **Engine:** `isMathTrack(track)` (MATH or MENTAL) allows problems, worked-example cards, problem-set challenges and KaTeX checks. The trap picker, mock tests, the AMC diagnostic, sprints and the AMC skills view stay MATH only.
- **Content:** `content/mental/` — `skills.json` (same format as Math skills), `levels.json` (exactly 4 levels, units numbered 1, 2, 3… in order; planned units without a folder show as "coming soon"), and `unit-XX/` with `unit.json` (plus `tips`, up to 12 pattern tips), `facts.json` (the cheat sheet, Math fact-sheet format), `lessons/`, `activities.json`. Keys `n01.`, slugs `mental-`.
- **Database:** `Unit.tips` (JSON array). Track-wide content in `MathContent` under `mental:skills`, `mental:levels`, `mental:facts:N`.
- **API:** `MentalModule` — `GET /mental/home` (students: levels, cheat sheets, tips), `GET /mental/cheat-sheets/:unitNumber` (unpublished units for teachers only). Lessons, practice, problem sets and Quill use the Math endpoints.
- **Quill:** the Math analyzers take an `audience` (`amc` or `mental`); Mental Math gets short sentences and small friendly numbers for ages 7–14.
- **Web:** `/mental` (CourseShell, levels with unit cards, Keep going, pattern tip), `/mental/cheat-sheets/[unit]` (printable), the unit page shows "💡 Pattern tips", CourseShell's Progress panel shows the tip of the day and the cheat sheets on every Mental Math page. The answer box hides the √ π / ^ helpers in Mental Math lessons (`SimpleAnswers`).

## Phases

- **MN0 (done):** the track, tab, `/mental` home, levels, cheat sheets, tips, loader/sync, API, Quill audience.
- **MN1 (done):** Unit 1 Number Bonds — 5 lessons (Bonds to 10, Bonds to 20, Make 10 First, Bonds to 100, ⭐ Unit Check), 10 activities, cheat sheet, 5 tips.
- **MN4–MN7 (done):** Level 2 — Unit 4 Front-End Adding & Subtracting, Unit 5 Multiplication Anchors, Unit 6 Benchmark Numbers, Unit 7 Missing Number Thinking.
- **MN8–MN11 (done):** Level 3 — Unit 8 Fractions, Decimals & Percentages, Unit 9 Divisibility Rules 2–11, Unit 10 Estimation, Unit 11 Smart Multiplication (×9, ×99, ×999, ×98, ×11, ×101, ×1001).
- **MN12–MN15 (done):** Level 4 — Unit 12 Squares (to $15^2$, ending in $5$, next square, $16^2$–$30^2$), Unit 13 Difference of Squares, Unit 14 Vedic Tricks, Explained (complements, near a base, vertically and crosswise, other bases, each with its algebra), Unit 15 Speed & Accuracy (inverse checks, casting out nines, picking a strategy, mixed sprints).
- Each of Units 4–15 has the Unit 1 format: 4 lessons (hook, 3 cards with a worked example, 5 typed practice problems with hints and wrong-answer notes, a 5-question challenge without hints, reflection) and the ⭐ check (8 questions, 100%), a cheat sheet and 5 tips.
- A locked Mental Math card names the last built unit before it ("Finish Mental Math Unit 1 first" on Unit 4) while Units 2–3 are not built.
- **MN2–MN3 (done):** Level 1 — Unit 2 Doubling & Halving (doubles, near doubles, halves, double one and halve the other), Unit 3 Compensation (add 9 and 19, add near a ten, take away near a ten, same difference), in the same format. All 15 units are now built.
- **MN-later:** daily review and streaks for Mental Math, speed sprints, level checks and placement, the parent guide page, mastery per Mental Math skill.
