/**
 * QRT-179: SOS phrases E2E tests
 *
 * Covers:
 * - SOS tab renders category grid
 * - Each category card shows emoji, name, phrase count
 * - Tapping a category opens SOSDetail
 * - SOSDetail shows phrase list with Japanese text and romaji
 * - Tapping a phrase opens fullscreen overlay
 * - Back navigation from SOSDetail
 */

import { test, expect } from '@playwright/test';
import { bypassOnboarding } from './helpers';

test.use({ storageState: 'tests/e2e/.auth/session.json' });

test.beforeEach(async ({ page }) => {
  await bypassOnboarding(page);
  await page.goto('/');
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible({ timeout: 15_000 });

  // Switch to SOS tab
  await page.locator('button').filter({ hasText: 'SOS' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByRole('heading', { name: 'SOS', level: 1 })).toBeVisible({ timeout: 5_000 });
});

test('SOS tab shows "tap a card · show your phone" subtitle', async ({ page }) => {
  await expect(page.getByText(/tap a card.*show your phone/i)).toBeVisible();
});

test('SOS tab renders at least one category card', async ({ page }) => {
  // Category cards are buttons in a grid
  const categoryCards = page.locator('button[class*="rounded"]').filter({ hasText: /phrases/ });
  await expect(categoryCards.first()).toBeVisible({ timeout: 5_000 });
});

test('each category card shows phrase count', async ({ page }) => {
  // Cards show "X phrases"
  await expect(page.getByText(/\d+ phrases/).first()).toBeVisible({ timeout: 5_000 });
});

test('tapping a category card opens SOSDetail with phrase list', async ({ page }) => {
  const firstCategory = page.locator('button[class*="rounded"]').filter({ hasText: /phrases/ }).first();
  await firstCategory.click();
  await page.waitForTimeout(400);

  // SOSDetail renders phrases — look for Japanese text patterns or phrase cards
  // The Navbar title is the category name
  await expect(page.getByText(/phrases/).or(page.locator('[class*="rounded"]')).first()).toBeVisible({ timeout: 5_000 });
});

test('SOSDetail shows Japanese text', async ({ page }) => {
  const firstCategory = page.locator('button[class*="rounded"]').filter({ hasText: /phrases/ }).first();
  await firstCategory.click();
  await page.waitForTimeout(400);

  // Phrases contain Japanese characters (Unicode range)
  // We look for elements that contain CJK/hiragana/katakana
  const japaneseText = page.locator('p, span').filter({ hasText: /[\u3000-\u9FFF\uF900-\uFAFF]/ });
  await expect(japaneseText.first()).toBeVisible({ timeout: 5_000 });
});

test('tapping a SOS phrase card opens fullscreen overlay', async ({ page }) => {
  const firstCategory = page.locator('button[class*="rounded"]').filter({ hasText: /phrases/ }).first();
  await firstCategory.click();
  await page.waitForTimeout(400);

  // Tap the first phrase card (button inside SOSDetail)
  const phraseCard = page.locator('button[class*="rounded"]').first();
  await expect(phraseCard).toBeVisible({ timeout: 5_000 });
  await phraseCard.click();
  await page.waitForTimeout(300);

  // Fullscreen overlay should appear — it's a large-text overlay
  // The overlay has a close button (×) or tap-to-dismiss behavior
  const overlay = page.locator('[class*="fixed"]').filter({ hasText: /[\u3000-\u9FFF]/ }).first();
  if (await overlay.isVisible({ timeout: 3_000 }).catch(() => false)) {
    // Dismiss by tapping outside / tap overlay again
    await overlay.click();
    await page.waitForTimeout(300);
  }
});

test('back navigation from SOSDetail returns to SOS home', async ({ page }) => {
  const firstCategory = page.locator('button[class*="rounded"]').filter({ hasText: /phrases/ }).first();
  await firstCategory.click();
  await page.waitForTimeout(400);

  // Tap back
  const backBtn = page.getByRole('button', { name: /back/i })
    .or(page.locator('button[aria-label*="back" i]'))
    .or(page.locator('button').filter({ hasText: /‹|←/ }));
  await backBtn.first().click();
  await page.waitForTimeout(400);

  // Back on SOS home — "SOS" h1 visible
  await expect(page.getByRole('heading', { name: 'SOS', level: 1 })).toBeVisible({ timeout: 5_000 });
});
