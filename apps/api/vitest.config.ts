import { defineConfig } from 'vitest/config';
import { testEnv } from './test/setup/test-env.js';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    // API tests share one test database, so files run one at a time.
    fileParallelism: false,
    env: testEnv(),
    globalSetup: ['./test/setup/global-setup.ts'],
    testTimeout: 20_000,
    hookTimeout: 60_000,
  },
});
