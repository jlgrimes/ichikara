import { defineConfig, devices } from '@playwright/test';

/**
 * Ichikara E2E Test Suite — Playwright (web)
 *
 * ## Setup
 * 1. Copy `.env.test.example` to `.env.test` and fill in credentials
 * 2. Run `npx playwright install --with-deps chromium`
 * 3. `npm run test:e2e`
 *
 * ## Auth strategy
 * `tests/auth.setup.ts` signs in once and saves session state to
 * `tests/.auth/session.json` — all other tests reuse this saved state
 * so we only hit the Supabase auth endpoint once per run.
 *
 * ## Detox (iOS native)
 * iOS E2E via Detox is separate and lives in `tests/detox/`.
 * See `tests/detox/README.md` for setup.
 */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/e2e/.results',

  /* Maximum time per test including all retries. */
  timeout: 30_000,

  expect: {
    /** Visual assertion timeout */
    timeout: 5_000,
  },

  /* Fail fast on CI; continue locally for easier debugging */
  forbidOnly: !!process.env.CI,
  retries:    process.env.CI ? 2 : 0,
  workers:    process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/e2e/.report', open: 'never' }],
  ],

  use: {
    /* Dev server base URL */
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',

    /* Collect trace on first retry for debugging */
    trace: 'on-first-retry',

    /* Emulate iPhone 14 viewport (most common Ichikara device) */
    ...devices['iPhone 14'],
  },

  projects: [
    /* Auth setup — runs once before all tests */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /* Main test suite — reuses auth state */
    {
      name: 'chromium',
      use: {
        ...devices['iPhone 14'],
        storageState: 'tests/e2e/.auth/session.json',
      },
      dependencies: ['setup'],
    },

    /* iPad landscape — verifies QRT-104 layout */
    {
      name: 'ipad',
      use: {
        ...devices['iPad Pro 11'],
        storageState: 'tests/e2e/.auth/session.json',
      },
      dependencies: ['setup'],
    },
  ],

  /* Start dev server automatically if not already running */
  webServer: {
    command: 'npm run dev',
    url:     'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
