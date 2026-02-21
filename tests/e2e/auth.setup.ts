/**
 * Auth setup — runs once before all E2E tests.
 * Signs in with test credentials from .env.test, saves session state.
 *
 * Create `.env.test` in repo root:
 *   E2E_EMAIL=your-test-user@example.com
 *   E2E_PASSWORD=your-test-password
 *
 * The saved session JSON is reused by all tests so we only authenticate once.
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const SESSION_FILE = path.join(import.meta.dirname, '.auth/session.json');

setup('authenticate', async ({ page }) => {
  const email    = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'E2E_EMAIL and E2E_PASSWORD must be set in .env.test\n' +
      'Create a test Supabase user and set credentials.\n' +
      'Run: cp .env.test.example .env.test && fill in values.',
    );
  }

  await page.goto('/');

  // Wait for auth page — the app redirects here when unauthenticated
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible({ timeout: 10_000 });

  // Fill credentials
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button',  { name: /sign in/i }).click();

  // Wait for the app shell to load (grammar tab visible)
  await expect(page.getByRole('tabpanel')).toBeVisible({ timeout: 15_000 });

  // Save session state (cookies + localStorage) for all subsequent tests
  await page.context().storageState({ path: SESSION_FILE });
});
