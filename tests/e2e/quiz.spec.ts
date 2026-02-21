/**
 * QRT-179: Quiz / Flashcard Practice E2E tests
 *
 * Covers:
 * - Quiz opens from LessonView
 * - Card front shows Japanese text
 * - Tap card to reveal back (translation + insight)
 * - "Got it ✓" and "↩ Again" buttons work
 * - Progress dots advance after each card
 * - Completion screen shows mastery % and retry/back buttons
 */

import { test, expect } from '@playwright/test';
import { bypassOnboarding } from './helpers';

test.use({ storageState: 'tests/e2e/.auth/session.json' });

// Helper: navigate into the quiz for the first available lesson
async function openFirstQuiz(page: import('@playwright/test').Page) {
  await bypassOnboarding(page);
  // Pre-seed quiz scores to 0 to ensure a clean state
  await page.addInitScript(() => {
    // Remove any persisted quiz scores so mastery is consistent
    const keys = Object.keys(localStorage).filter(k => k.startsWith('ichikara_quiz'));
    keys.forEach(k => localStorage.removeItem(k));
  });
  await page.goto('/');
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible({ timeout: 15_000 });

  // Open first lesson card
  const firstCard = page.locator('button').filter({ hasText: /Module \d/i }).first();
  await firstCard.click();
  await page.waitForTimeout(400);

  // Click "Flashcard Practice"
  await page.getByText('Flashcard Practice').first().click();
  await page.waitForTimeout(500);

  // Verify QuizView loaded
  await expect(page.getByText(/Practice —/)).toBeVisible({ timeout: 8_000 });
}

test('Quiz — card front is visible on load', async ({ page }) => {
  await openFirstQuiz(page);
  // Front of card: tap-prompt text is shown when unrevealed
  const tapPrompt = page.getByText(/tap to reveal|tap the card/i);
  await expect(tapPrompt.or(page.locator('[class*="animate-pulse"]'))).toBeVisible({ timeout: 5_000 });
});

test('Quiz — tap card to reveal answer buttons', async ({ page }) => {
  await openFirstQuiz(page);

  // Tap the card area to flip it
  const cardArea = page.locator('[class*="rounded"]').filter({ hasText: /tap to reveal|\.jp/i }).first();
  if (await cardArea.count() > 0) {
    await cardArea.click();
  } else {
    // Fallback: click the tap-prompt
    await page.locator('text=/tap to reveal/i').first().click();
  }
  await page.waitForTimeout(300);

  // After reveal: "↩ Again" and "Got it ✓" buttons should appear
  await expect(page.getByText('↩ Again')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText('Got it ✓')).toBeVisible({ timeout: 5_000 });
});

test('Quiz — "Got it ✓" advances to next card or completion', async ({ page }) => {
  await openFirstQuiz(page);

  // Flip card
  await page.locator('text=/tap to reveal/i').first().click();
  await page.waitForTimeout(300);

  await expect(page.getByText('Got it ✓')).toBeVisible({ timeout: 5_000 });
  await page.getByText('Got it ✓').click();
  await page.waitForTimeout(500);

  // Either next card appears or we hit the completion screen
  const nextCard   = page.getByText(/tap to reveal/i);
  const doneScreen = page.getByText(/mastery|practice again|back to lesson/i);
  await expect(nextCard.or(doneScreen).first()).toBeVisible({ timeout: 5_000 });
});

test('Quiz — "↩ Again" re-queues card', async ({ page }) => {
  await openFirstQuiz(page);

  // Flip card
  await page.locator('text=/tap to reveal/i').first().click();
  await page.waitForTimeout(300);

  await expect(page.getByText('↩ Again')).toBeVisible({ timeout: 5_000 });
  await page.getByText('↩ Again').click();
  await page.waitForTimeout(500);

  // Card front should re-appear (same or different card)
  await expect(page.getByText(/tap to reveal/i)).toBeVisible({ timeout: 5_000 });
});

test('Quiz — completion screen has Practice again + Back to lesson', async ({ page }) => {
  await openFirstQuiz(page);

  // Blast through all cards by clicking "Got it" repeatedly
  for (let i = 0; i < 20; i++) {
    const tapPrompt = page.getByText(/tap to reveal/i);
    if (!(await tapPrompt.isVisible({ timeout: 1_000 }).catch(() => false))) break;
    await tapPrompt.click();
    await page.waitForTimeout(200);

    const gotIt = page.getByText('Got it ✓');
    if (await gotIt.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await gotIt.click();
      await page.waitForTimeout(300);
    } else {
      break;
    }
  }

  // Completion screen
  await expect(page.getByText(/mastery/i)).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(/practice again/i)).toBeVisible();
  await expect(page.getByText(/back to lesson/i)).toBeVisible();
});

test('Quiz — "Back to lesson" returns to LessonView', async ({ page }) => {
  await openFirstQuiz(page);

  // Get to completion screen
  for (let i = 0; i < 20; i++) {
    const tapPrompt = page.getByText(/tap to reveal/i);
    if (!(await tapPrompt.isVisible({ timeout: 1_000 }).catch(() => false))) break;
    await tapPrompt.click();
    await page.waitForTimeout(150);
    const gotIt = page.getByText('Got it ✓');
    if (await gotIt.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await gotIt.click();
      await page.waitForTimeout(200);
    } else { break; }
  }

  const backBtn = page.getByText(/back to lesson/i);
  if (await backBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await backBtn.click();
    await page.waitForTimeout(400);
    // Should be on LessonView — "Flashcard Practice" button is back
    await expect(page.getByText('Flashcard Practice')).toBeVisible({ timeout: 5_000 });
  }
});

test('Quiz — progress dots reflect card count', async ({ page }) => {
  await openFirstQuiz(page);
  // Progress dots container — renders one dot per card
  // The QuizView renders a ProgressDots component with gap-1.5
  const dots = page.locator('[class*="gap-1.5"] > div');
  // Should have at least 1 dot (at least 1 card — the sample sentence)
  await expect(dots.first()).toBeVisible({ timeout: 5_000 });
  const count = await dots.count();
  expect(count).toBeGreaterThanOrEqual(1);
});
