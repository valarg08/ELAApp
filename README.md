# StoryForge

An interactive creative writing platform for middle school (grades 6–8). The full design is in [DESIGN.md](DESIGN.md).

## Requirements

- Node.js 24 LTS (`.nvmrc`)
- pnpm 12 (`npm install -g pnpm`)
- PostgreSQL 16+ (from Phase P1) and Redis 7 (from Phase P4), installed natively

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- Web app: http://localhost:3000
- API health: http://localhost:4000/api/v1/health (also reachable through the web app at http://localhost:3000/api/v1/health)

## Useful commands

| Command | What it does |
|---|---|
| `pnpm dev` | Run the web app, API and package watchers |
| `pnpm check` | Everything CI runs: format check, lint, typecheck, tests, build |
| `pnpm test` | Unit and API tests (Vitest) |
| `pnpm db:validate` | Validate the Prisma schema |

## Repository layout

```
apps/web         Next.js frontend
apps/api         NestJS REST API
packages/shared  Zod contracts and constants shared by web and API
packages/db      Prisma schema and client
packages/config  Shared TypeScript configs
```
