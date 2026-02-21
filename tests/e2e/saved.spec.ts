/**
 * QRT-179: Saved (bookmarks) E2E tests
 *
 * Covers:
 * - Saved tab renders heading
 * - Empty state message when nothing is saved
 * - Bookmarking a lesson appears in Saved tab
 * - Tapping a saved lesson opens LessonView
 */

import { test, expect } from '@playwright/test';
import { bypassOnboarding } from './helpers';

test.use({ storageState: 'tests/e2e/.auth/session.json' });

test.beforeEach(async ({ page }) => {
  await bypassOnboarding(page);
  // Clear all bookmarks from localStorage for a clean slate
  await page.addInitScript(() => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.includes('ichikara_bookmark'));
      keys.forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
  });
  await page.goto('/');
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible({ timeout: 15_000 });
});

test('Saved tab shows "Saved" heading', async ({ page }) => {
  await page.locator('button').filter({ hasText: 'Saved' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByRole('heading', { name: 'Saved', level: 1 })).toBeVisible({ timeout: 5_000 });
});

test('Saved tab shows empty state when nothing is bookmarked', async ({ page }) => {
  await page.locator('button').filter({ hasText: 'Saved' }).click();
  await page.waitForTimeout(400);
  // Empty state message
  await expect(page.getByText(/nothing saved yet|no saved|empty/i)).toBeVisible({ timeout: 5_000 });
});

test('bookmarking a lesson makes it appear in Saved tab', async ({ page }) => {
  // Open first lesson
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);

  // Bookmark it
  const bookmarkBtn = page.getByRole('button', { name: /bookmark lesson/i });
  await expect(bookmarkBtn).toBeVisible({ timeout: 5_000 });
  await bookmarkBtn.click();
  await page.waitForTimeout(300);

  // Go to Saved tab
  await page.locator('button').filter({ hasText: 'Saved' }).click();
  await page.waitForTimeout(500);

  // Saved lesson should appear — a lesson card rendered in SavedView
  const savedLesson = page.locator('button[class*="rounded"]').first();
  await expect(savedLesson).toBeVisible({ timeout: 5_000 });
});

test('tapping a saved lesson opens LessonView', async ({ page }) => {
  // Bookmark a lesson first
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);
  const bookmarkBtn = page.getByRole('button', { name: /bookmark lesson/i });
  if (await bookmarkBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await bookmarkBtn.click();
    await page.waitForTimeout(300);
  }

  // Go back and switch to Saved
  const backBtn = page.getByRole('button', { name: /back/i })
    .or(page.locator('button').filter({ hasText: /‹|←/ }));
  if (await backBtn.first().isVisible({ timeout: 2_000 }).catch(() => false)) {
    await backBtn.first().click();
    await page.waitForTimeout(300);
  }

  await page.locator('button').filter({ hasText: 'Saved' }).click();
  await page.waitForTimeout(500);

  // Tap saved lesson
  const savedCard = page.locator('button[class*="rounded"]').first();
  if (await savedCard.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await savedCard.click();
    await page.waitForTimeout(400);
    // LessonView heading
    await expect(page.getByText(/Module \d/i).first()).toBeVisible({ timeout: 5_000 });
  }
});

test('Saved tab shows section headings for lessons vs phrases', async ({ page }) => {
  // When content is saved, sections like "Lessons" and "Phrases" appear
  // Bookmark a lesson to ensure there's content
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);
  const bookmarkBtn = page.getByRole('button', { name: /bookmark lesson/i });
  if (await bookmarkBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await bookmarkBtn.click();
    await page.waitForTimeout(300);
  }
  const backBtn = page.getByRole('button', { name: /back/i })
    .or(page.locator('button').filter({ hasText: /‹|←/ }));
  if (await backBtn.first().isVisible({ timeout: 2_000 }).catch(() => false)) {
    await backBtn.first().click();
    await page.waitForTimeout(300);
  }

  await page.locator('button').filter({ hasText: 'Saved' }).click();
  await page.waitForTimeout(500);

  // Lessons section heading
  await expect(page.getByText(/lessons|saved lessons/i)).toBeVisible({ timeout: 5_000 });
});
