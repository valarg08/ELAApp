import path from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma 7 does not load .env files itself; the repo keeps one .env at the root.
config({ path: path.resolve(import.meta.dirname, '../../.env'), quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // A fallback lets `prisma generate` / `validate` run in CI without a database.
    url: process.env.DATABASE_URL ?? 'postgresql://storyforge:storyforge@localhost:5432/storyforge',
  },
});
