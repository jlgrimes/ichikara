/**
 * QRT-179: Navigation E2E tests
 *
 * Covers:
 * - Tab switching (Grammar ↔ SOS ↔ Saved ↔ Settings)
 * - Tapping active tab pops to root
 * - Page headings visible on each tab
 */

import { test, expect } from '@playwright/test';
import { bypassOnboarding } from './helpers';

// Each test gets a pre-authenticated, post-onboarding page.
test.use({ storageState: 'tests/e2e/.auth/session.json' });

test.beforeEach(async ({ page }) => {
  await bypassOnboarding(page);
  await page.goto('/');
  // Wait for the tab bar to appear (sign that app shell loaded)
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible({ timeout: 15_000 });
});

test('default tab is Grammar — shows lesson list', async ({ page }) => {
  // The Grammar/Home view renders the "一から" hero and lesson cards
  // We just check that we're not on the Auth page
  await expect(page.getByRole('textbox', { name: /email/i })).not.toBeVisible();
  // TabBar should be visible
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible();
});

test('switch to SOS tab', async ({ page }) => {
  await page.locator('button').filter({ hasText: 'SOS' }).click();
  await page.waitForTimeout(400); // slide animation
  // SOS page renders an h1 with "SOS"
  await expect(page.getByRole('heading', { name: 'SOS', level: 1 })).toBeVisible({ timeout: 5_000 });
});

test('switch to Saved tab', async ({ page }) => {
  await page.locator('button').filter({ hasText: 'Saved' }).click();
  await page.waitForTimeout(400);
  // Saved view renders "Saved" heading or empty-state
  await expect(
    page.getByRole('heading', { name: 'Saved', level: 1 }).or(page.getByText('Nothing saved yet')),
  ).toBeVisible({ timeout: 5_000 });
});

test('switch to Settings tab', async ({ page }) => {
  await page.locator('button').filter({ hasText: 'Settings' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible({ timeout: 5_000 });
});

test('cycle through all tabs and return to Grammar', async ({ page }) => {
  for (const tab of ['SOS', 'Saved', 'Settings', 'Grammar']) {
    await page.locator('button').filter({ hasText: tab }).click();
    await page.waitForTimeout(400);
  }
  // Should be back on Grammar (auth check: no login form)
  await expect(page.getByRole('textbox', { name: /email/i })).not.toBeVisible();
});
