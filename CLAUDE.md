# StoryForge — notes for Claude Code

- Design spec: DESIGN.md (source of truth). Update it when a design decision changes.
- Stack: pnpm + Turborepo, Node 24, TypeScript 6, Next.js 16 (apps/web), NestJS 12 ESM (apps/api; the AI feedback worker is apps/api/src/worker.ts),
  Prisma 7 + PostgreSQL (packages/db), Zod contracts (packages/shared), shared tsconfigs (packages/config).
  Deterministic analyzers + coach report (packages/writing-analysis, no deps; shared depends on it).
  Claude integration (packages/ai, server only; fake gateway without ANTHROPIC_API_KEY). Later: packages/ui.
- Commands: `pnpm dev`, `pnpm check` (format, lint, typecheck, test, build — same as CI), `pnpm test`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test:e2e` (Playwright, own servers on ports 3100/4100 + test DB), `pnpm db:migrate`,
  `pnpm db:generate`, `pnpm db:validate`, `pnpm content:check`, `pnpm content:sync`, `pnpm db:seed` (default dev teacher, see README). Later:
  `pnpm ai:eval` (costs money; run only when asked).
- Local services run natively (no Docker): PostgreSQL only (it also holds the pg-boss job queue; no Redis). Config lives in the root `.env`
  (copy `.env.example`).
- ESM everywhere. In apps/api and packages/*, relative imports need the `.js` extension (`module: nodenext`).
- Workspace packages build to `dist/`; turbo runs `^build` before dev/typecheck/test.
- Rules: every endpoint needs an authorisation test; never log student text; never call the real Claude API in tests
  (use the fake AiGateway); validate all JSON columns with Zod before writes; UI must be keyboard accessible and pass axe.
- Lint is oxlint (`.oxlintrc.json`), formatting is Prettier. Markdown files are excluded from Prettier.
- Current phase: see DESIGN.md §14.2. P0–P4, SL1 (self-paced learning + AI tutor, DESIGN.md §9.5), SL2 (Unit 2 lessons, trait picker, §9.6), SL3 (Unit 3 lessons, mood picker, §9.7), SL4 (Unit 4 lessons, story mountain, conflict selector, pacing, §9.8), SL5 (Unit 5 lessons, POV simulator, multi-perspective rewrite, tone sliders, §9.9), SL6 (Unit 6 lessons, sensory lab + word bank, comparison helper, figurative check, §9.10) and SL7 (Unit 7 lessons, haiku syllable counter, line-break view, rhythm mode, sound devices, §9.11) are done; next is SL8+ (Units 8–12 lessons, one unit at a time). The separate Essay Writing track (§9.12) has its foundation (E0: tracks, `/essays`, progress tracker, marked quizzes, transformer) E1 (Unit 1 Nouns & Pronouns: fill the blank, error hunt, sentence sets, grammar Coach checks, `grammar-check`, grammar rubric) and E2 (Unit 2 Verbs & Tenses: verb features and the `verbs` Coach check); next is E3–E15, one essay unit at a time. Essay content lives in `content/essay/unit-XX` (keys `e01.`, `e02.`…). P5 (teacher dashboard) is deferred.
- Tests: API tests hit the real `storyforge_test` database (DATABASE_TEST_URL, never the dev DB) and run files serially.
  Auth: global guards (AuthGuard → CsrfGuard → RolesGuard); mark open routes `@Public()`, restrict with `@Roles()`.
  Ownership checks live in ClassAccessService; other teachers' resources answer 404.
- Next.js 16: middleware is now `proxy.ts`; read `apps/web/node_modules/next/dist/docs/` before using unfamiliar APIs.
- Curriculum content is JSON in /content (format: DESIGN.md §9.4). After editing it run `pnpm content:check`, then
  `pnpm content:sync` to load it into the dev database. API tests seed it with `seedContent()` after `resetDatabase()`.
- turbo only passes env vars listed in `globalPassThroughEnv` (turbo.json) to tasks — add new env vars there or CI breaks.
- Writing workspace (DESIGN.md §5.4.1): drafts are plain text. Autosave logic is the framework-free `AutosaveController`
  (apps/web/features/writing/autosave.ts), unit-tested with fake timers. Playwright tests call `expectAccessible(page)`
  (axe) from apps/web/e2e/helpers.ts.
