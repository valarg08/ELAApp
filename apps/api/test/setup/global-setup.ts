import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { testEnv } from './test-env.js';

/** Bring the test database schema up to date once before any test file runs. */
export default function setup(): void {
  const env = testEnv();
  const dbPackage = fileURLToPath(new URL('../../../../packages/db', import.meta.url));
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
    cwd: dbPackage,
    env: { ...process.env, DATABASE_URL: env.DATABASE_URL },
    stdio: 'pipe',
    shell: process.platform === 'win32',
  });
}
