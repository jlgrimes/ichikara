/**
 * Vitest config — unit tests for core lib files (QRT-187)
 *
 * Runs separately from Playwright E2E tests.
 * Uses jsdom for localStorage / window simulation.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**'],
      exclude: ['src/lib/ui/**', 'src/lib/monitoring.ts', 'src/lib/analytics.ts'],
      thresholds: {
        lines:      80,
        functions:  80,
        branches:   75,
        statements: 80,
      },
    },
  },
});
