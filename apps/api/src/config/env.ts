import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  /** Claude API key. Without it (or with AI_PROVIDER=fake) the offline fake gateway is used. */
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  /** Needed when the API key isn't scoped to a workspace (sent as anthropic-workspace-id). */
  ANTHROPIC_WORKSPACE_ID: z.string().min(1).optional(),
  AI_PROVIDER: z.enum(['anthropic', 'fake']).optional(),
  AI_MODEL: z.string().min(1).default('claude-opus-5-5'),
  /** Run the feedback worker inside this process. Defaults to on in development only. */
  AI_WORKER: z.enum(['true', 'false']).optional(),
  /** Teacher self sign-up (POST /auth/register). Defaults to open, and to closed in production. */
  TEACHER_SIGNUP: z.enum(['open', 'closed']).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

let envFileLoaded = false;

/** Load the repo-root `.env` once (existing variables win). */
export function loadEnvFile(): void {
  if (envFileLoaded) return;
  envFileLoaded = true;
  try {
    // src/config/env.ts and dist/config/env.js are both four directories below the repo root.
    process.loadEnvFile(new URL('../../../../.env', import.meta.url));
  } catch {
    // No .env file: rely on the real environment.
  }
}

/** Validate the environment. With no argument, reads `process.env` after loading `.env`. */
export function loadEnv(source?: NodeJS.ProcessEnv): Env {
  if (!source) loadEnvFile();
  return EnvSchema.parse(source ?? process.env);
}
