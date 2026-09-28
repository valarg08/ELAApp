import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    // e2e/ holds Playwright browser tests, run with `pnpm test:e2e`.
    exclude: ['node_modules', '.next', 'e2e'],
  },
});
