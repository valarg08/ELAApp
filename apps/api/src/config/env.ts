import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/** Load the repo-root `.env` (if present) and validate the environment. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (source === process.env) {
    try {
      // src/config/env.ts and dist/config/env.js are both four directories below the repo root.
      process.loadEnvFile(new URL('../../../../.env', import.meta.url));
    } catch {
      // No .env file: rely on the real environment.
    }
  }
  return EnvSchema.parse(source);
}
