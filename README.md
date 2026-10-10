# StoryForge

An interactive creative writing platform for middle school (grades 6–8). The full design is in [DESIGN.md](DESIGN.md).

## Requirements

- Node.js 24 LTS (`.nvmrc`)
- pnpm 12 (`npm install -g pnpm`)
- PostgreSQL 16+ installed natively, with two databases: one for development and one for tests
- Optional: an Anthropic API key for real AI feedback (`ANTHROPIC_API_KEY` in `.env`); without it the app uses an offline fake AI

## Getting started

```bash
pnpm install
cp .env.example .env        # then fill in DATABASE_URL, DATABASE_TEST_URL and JWT_ACCESS_SECRET
pnpm db:migrate             # create the tables in the development database
pnpm content:sync           # load the lessons from /content into the database
pnpm dev
```

- Web app: http://localhost:3000 (create a teacher account, add a class and students, then try "I'm a student")
- API health: http://localhost:4000/api/v1/health
- System status page: http://localhost:3000/status

## Useful commands

| Command | What it does |
|---|---|
| `pnpm dev` | Run the web app, API and package watchers |
| `pnpm check` | Everything CI runs before the browser tests: format check, lint, typecheck, tests, build |
| `pnpm test` | Unit and API tests (Vitest). API tests use the test database from `DATABASE_TEST_URL` |
| `pnpm test:e2e` | Browser tests (Playwright). Starts its own API and web app on ports 4100/3100 against the test database |
| `pnpm db:migrate` | Create and apply a migration after changing `packages/db/prisma/schema.prisma` |
| `pnpm content:check` / `pnpm content:sync` | Validate the lesson files in `/content` / load them into the database |
| `pnpm ai:eval` | Run the AI golden set against the real Claude API (needs `ANTHROPIC_API_KEY`; costs money) |
| `pnpm db:validate` | Validate the Prisma schema |

First time running browser tests: `pnpm --filter @storyforge/web exec playwright install chromium`.

## Repository layout

```
apps/web         Next.js frontend (App Router, proxy.ts refreshes sessions)
apps/api         NestJS REST API (auth, classes, health)
packages/shared  Zod contracts and constants shared by web and API
packages/db      Prisma schema, migrations and client
packages/config  Shared TypeScript configs
```
