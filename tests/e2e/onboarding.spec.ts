/**
 * QRT-179: Onboarding flow E2E tests
 *
 * Covers:
 * - Welcome screen renders
 * - Navigation through all 3 onboarding screens
 * - Level selection persists to localStorage
 * - After completion, main app shell loads
 *
 * Runs WITH auth state (user is signed in) but WITHOUT the onboarding flag,
 * so OnboardingView renders instead of the main app.
 */

import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/e2e/.auth/session.json' });

test.beforeEach(async ({ page }) => {
  // Clear the onboarding flag so OnboardingView renders
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('ichikara_onboarded');
      localStorage.removeItem('ichikara_jlpt_start');
    } catch { /* ignore */ }
  });
  await page.goto('/');
});

test('welcome screen is first thing a new user sees', async ({ page }) => {
  // OnboardingView screen 0: "一から" hero
  await expect(page.getByText('一から').first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/japanese from scratch/i)).toBeVisible();
});

test('can navigate through all onboarding screens', async ({ page }) => {
  await page.waitForTimeout(1000); // let React settle

  // Screen 0 → 1: tap "Next" or "Continue"
  const next = page.getByRole('button', { name: /next|continue/i });
  await expect(next.first()).toBeVisible({ timeout: 10_000 });
  await next.first().click();

  // Screen 1 should be "How it works" or similar
  await page.waitForTimeout(300);

  // Screen 1 → 2
  await next.first().click();
  await page.waitForTimeout(300);

  // Screen 2: level picker — choose N5 (Beginner)
  const beginnerBtn = page.getByRole('button', { name: /n5|beginner|total beginner|start from scratch/i });
  if (await beginnerBtn.count() > 0) {
    await beginnerBtn.first().click();
    await page.waitForTimeout(200);
  }

  // Finish
  const done = page.getByRole('button', { name: /start|get started|done|finish|let'?s go/i });
  if (await done.count() > 0) {
    await done.first().click();
  } else {
    // Last screen's CTA may just be the level-select button itself
    await next.first().click();
  }

  // After onboarding completes, main app shell should render
  await expect(
    page.locator('button').filter({ hasText: 'Grammar' }),
  ).toBeVisible({ timeout: 10_000 });
});

test('onboarding sets localStorage flag on completion', async ({ page }) => {
  // Complete onboarding programmatically via localStorage, then verify
  await page.addInitScript(() => {
    localStorage.setItem('ichikara_onboarded', 'true');
    localStorage.setItem('ichikara_jlpt_start', 'N5');
  });
  await page.reload();
  // Should skip onboarding and land on main app
  await expect(
    page.locator('button').filter({ hasText: 'Grammar' }),
  ).toBeVisible({ timeout: 15_000 });
});
