import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests run their own API (port 4100) and web app (port 3100) against the TEST database,
 * so they never touch development data and can run while `pnpm dev` is up.
 */
const root = fileURLToPath(new URL('../..', import.meta.url));
try {
  process.loadEnvFile(`${root}/.env`);
} catch {
  // CI provides the variables directly.
}
const testDb = process.env.DATABASE_TEST_URL;
if (!testDb) throw new Error('DATABASE_TEST_URL is not set (see .env.example).');

const API_PORT = 4100;
const WEB_PORT = 3100;
const WEB_URL = `http://localhost:${WEB_PORT}`;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node dist/main.js',
      cwd: `${root}/apps/api`,
      url: `http://localhost:${API_PORT}/api/v1/health`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        NODE_ENV: 'test',
        API_PORT: String(API_PORT),
        WEB_ORIGIN: WEB_URL,
        DATABASE_URL: testDb,
        JWT_ACCESS_SECRET: 'e2e-only-signing-secret-that-is-long-enough',
      },
    },
    {
      command: `pnpm exec next dev --port ${WEB_PORT}`,
      cwd: `${root}/apps/web`,
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        API_INTERNAL_URL: `http://localhost:${API_PORT}`,
        NEXT_TELEMETRY_DISABLED: '1',
        NEXT_DIST_DIR: '.next-e2e',
      },
    },
  ],
});
