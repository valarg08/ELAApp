import { fileURLToPath } from 'node:url';

/**
 * Environment for API tests: always the separate test database (never the dev one),
 * and a fixed signing secret. Reads DATABASE_TEST_URL from the real env or the root .env.
 */
export function testEnv(): Record<string, string> {
  try {
    process.loadEnvFile(fileURLToPath(new URL('../../../../.env', import.meta.url)));
  } catch {
    // CI provides the variables directly.
  }
  const databaseUrl = process.env.DATABASE_TEST_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_TEST_URL is not set. Add it to .env (see .env.example).');
  }
  if (databaseUrl === process.env.DATABASE_URL) {
    throw new Error('DATABASE_TEST_URL must point to a different database than DATABASE_URL.');
  }
  return {
    NODE_ENV: 'test',
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: 'test-only-signing-secret-that-is-long-enough',
    WEB_ORIGIN: 'http://localhost:3000',
  };
}
