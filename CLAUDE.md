# StoryForge — notes for Claude Code

- Design spec: DESIGN.md (source of truth). Update it when a design decision changes.
- Stack: pnpm + Turborepo, Node 24, TypeScript 6, Next.js 16 (apps/web), NestJS 12 ESM (apps/api; apps/worker from P4),
  Prisma 7 + PostgreSQL (packages/db), Zod contracts (packages/shared), shared tsconfigs (packages/config).
  Deterministic analyzers + coach report (packages/writing-analysis, no deps; shared depends on it).
  Later: Claude integration (packages/ai), design system (packages/ui).
- Commands: `pnpm dev`, `pnpm check` (format, lint, typecheck, test, build — same as CI), `pnpm test`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test:e2e` (Playwright, own servers on ports 3100/4100 + test DB), `pnpm db:migrate`,
  `pnpm db:generate`, `pnpm db:validate`, `pnpm content:check`, `pnpm content:sync`. Later: `pnpm db:seed`,
  `pnpm ai:eval` (costs money; run only when asked).
- Local services run natively (no Docker): PostgreSQL is needed from P1, Redis from P4. Config lives in the root `.env`
  (copy `.env.example`).
- ESM everywhere. In apps/api and packages/*, relative imports need the `.js` extension (`module: nodenext`).
- Workspace packages build to `dist/`; turbo runs `^build` before dev/typecheck/test.
- Rules: every endpoint needs an authorisation test; never log student text; never call the real Claude API in tests
  (use the fake AiGateway); validate all JSON columns with Zod before writes; UI must be keyboard accessible and pass axe.
- Lint is oxlint (`.oxlintrc.json`), formatting is Prettier. Markdown files are excluded from Prettier.
- Current phase: see DESIGN.md §14.2. P0–P3 and P4a (writing analysis + Coach panel) are done; next is P4b (AI feedback).
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
