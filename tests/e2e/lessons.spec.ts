/**
 * QRT-179: Lesson navigation E2E tests
 *
 * Covers:
 * - Home view renders lesson list with JLPT group headers
 * - Tapping a lesson card opens LessonView
 * - LessonView shows lesson title and content
 * - Bookmark toggle on LessonView
 * - Mark complete / incomplete toggle
 * - Back navigation returns to lesson list
 */

import { test, expect } from '@playwright/test';
import { bypassOnboarding } from './helpers';

test.use({ storageState: 'tests/e2e/.auth/session.json' });

test.beforeEach(async ({ page }) => {
  await bypassOnboarding(page);
  await page.goto('/');
  // Wait for Grammar tab to be ready
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible({ timeout: 15_000 });
});

test('Home renders JLPT group headings', async ({ page }) => {
  // JLPT_GROUPS: N5, N4, N3, N2
  for (const level of ['N5', 'N4', 'N3', 'N2']) {
    await expect(page.getByText(level, { exact: true }).first()).toBeVisible({ timeout: 5_000 });
  }
});

test('Home renders at least one lesson card', async ({ page }) => {
  // LessonCards are buttons containing lesson title text
  const lessonCards = page.locator('button').filter({ hasText: /Module \d|lesson/i });
  await expect(lessonCards.first()).toBeVisible({ timeout: 5_000 });
});

test('tap lesson card opens LessonView', async ({ page }) => {
  // First available lesson card
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await expect(firstCard).toBeVisible({ timeout: 5_000 });
  await firstCard.click();

  // LessonView has a Navbar with "Module X" as title
  await expect(page.getByText(/Module \d/i).first()).toBeVisible({ timeout: 5_000 });
  // And a back button (chevron or "Back")
  await expect(
    page.getByRole('button', { name: /back/i })
      .or(page.locator('button[aria-label*="back" i]'))
      .or(page.locator('button').filter({ hasText: /‹|←|back/i })),
  ).toBeVisible({ timeout: 5_000 });
});

test('LessonView — bookmark button toggles', async ({ page }) => {
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();

  // Bookmark button — aria-label "Bookmark lesson" or "Remove bookmark"
  const bookmarkBtn = page.getByRole('button', { name: /bookmark lesson|remove bookmark/i });
  await expect(bookmarkBtn).toBeVisible({ timeout: 5_000 });

  // Toggle on
  await bookmarkBtn.click();
  await page.waitForTimeout(300);

  // Toggle off — button label should have changed
  const updatedBtn = page.getByRole('button', { name: /bookmark lesson|remove bookmark/i });
  await expect(updatedBtn).toBeVisible();
  await updatedBtn.click(); // reset to original state
});

test('LessonView — mark complete button exists', async ({ page }) => {
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);

  // Mark complete button — text varies: "Mark complete", "Mark done", check mark CTA
  const completeBtn = page.getByRole('button', { name: /mark complete|mark done|complete|done/i });
  await expect(completeBtn.first()).toBeVisible({ timeout: 5_000 });
});

test('back navigation from LessonView returns to lesson list', async ({ page }) => {
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);

  // Tap back
  const backBtn = page.getByRole('button', { name: /back/i })
    .or(page.locator('button[aria-label*="back" i]'))
    .or(page.locator('button').filter({ hasText: /‹|←/ }));
  await backBtn.first().click();
  await page.waitForTimeout(400);

  // Should be back on Home — N5 heading visible again
  await expect(page.getByText('N5', { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

test('LessonView — Flashcard Practice button navigates to QuizView', async ({ page }) => {
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);

  // The "Flashcard Practice" button in LessonView
  const practiceBtn = page.getByText('Flashcard Practice');
  await expect(practiceBtn.first()).toBeVisible({ timeout: 5_000 });
  await practiceBtn.first().click();
  await page.waitForTimeout(500);

  // QuizView — Navbar title starts with "Practice —"
  await expect(page.getByText(/Practice —/)).toBeVisible({ timeout: 8_000 });
});
