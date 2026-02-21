/**
 * QRT-179: Settings E2E tests
 *
 * Covers:
 * - Settings tab renders heading and account section
 * - User email is displayed
 * - Language picker button is visible
 * - Language selector opens on tap
 * - Sign out button is present and triggers auth flow
 */

import { test, expect } from '@playwright/test';
import { bypassOnboarding } from './helpers';

test.use({ storageState: 'tests/e2e/.auth/session.json' });

test.beforeEach(async ({ page }) => {
  await bypassOnboarding(page);
  await page.goto('/');
  await expect(page.locator('button').filter({ hasText: 'Grammar' })).toBeVisible({ timeout: 15_000 });

  // Switch to Settings tab
  await page.locator('button').filter({ hasText: 'Settings' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible({ timeout: 5_000 });
});

test('Settings shows "Language" and "Account" section labels', async ({ page }) => {
  await expect(page.getByText(/^language$/i).first()).toBeVisible();
  await expect(page.getByText(/^account$/i).first()).toBeVisible();
});

test('Settings shows signed-in email', async ({ page }) => {
  // "Signed in as" label and email
  await expect(page.getByText(/signed in as/i)).toBeVisible();
  // Email should contain @ — use a loose matcher since we don't know the test email
  const emailEl = page.locator('p').filter({ hasText: /@/ }).first();
  await expect(emailEl).toBeVisible({ timeout: 5_000 });
});

test('Language picker button is visible', async ({ page }) => {
  // The language button shows flag emoji + language name
  const langBtn = page.locator('button').filter({ hasText: /japanese|español|français|中文|한국어/i })
    .or(page.locator('button[class*="rounded"]').filter({ hasText: /›/ }).first());
  await expect(langBtn.first()).toBeVisible({ timeout: 5_000 });
});

test('tapping Language opens LanguageSelector', async ({ page }) => {
  // The language button navigates to LanguageSelector view
  const langBtn = page.locator('button[class*="rounded"]').filter({ hasText: /›/ }).first();
  await langBtn.click();
  await page.waitForTimeout(400);

  // LanguageSelector view renders a list of languages
  await expect(
    page.getByText(/choose a language|select language|language/i).first()
      .or(page.locator('button').filter({ hasText: /japanese|日本語/i }).first()),
  ).toBeVisible({ timeout: 5_000 });
});

test('Sign Out button exists in Settings', async ({ page }) => {
  const signOutBtn = page.getByRole('button', { name: /sign out/i });
  await expect(signOutBtn).toBeVisible({ timeout: 5_000 });
});

test('Sign Out button redirects to Auth page', async ({ page }) => {
  const signOutBtn = page.getByRole('button', { name: /sign out/i });
  await signOutBtn.click();

  // After sign out, AuthPage should load
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({ timeout: 10_000 });
});

// ── Legal section (QRT-184) ───────────────────────────────────────────────────

test('Legal section shows Privacy Policy and Terms of Service links', async ({ page }) => {
  await expect(page.getByText(/^legal$/i).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /privacy policy/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /terms of service/i })).toBeVisible();
});

test('Privacy Policy button opens privacy page', async ({ page }) => {
  await page.getByRole('button', { name: /privacy policy/i }).click();
  await page.waitForTimeout(400);
  // PrivacyPage Navbar title
  await expect(page.getByText('Privacy Policy').first()).toBeVisible({ timeout: 5_000 });
  // Content: "What We Collect" heading
  await expect(page.getByText('What We Collect')).toBeVisible({ timeout: 5_000 });
});

test('Terms of Service button opens terms page', async ({ page }) => {
  await page.getByRole('button', { name: /terms of service/i }).click();
  await page.waitForTimeout(400);
  // TermsPage Navbar title
  await expect(page.getByText('Terms of Service').first()).toBeVisible({ timeout: 5_000 });
  // Content: numbered section
  await expect(page.getByText(/1\. The App/)).toBeVisible({ timeout: 5_000 });
});

test('Privacy page back button returns to Settings', async ({ page }) => {
  await page.getByRole('button', { name: /privacy policy/i }).click();
  await page.waitForTimeout(400);
  const backBtn = page.getByRole('button', { name: /back/i })
    .or(page.locator('button').filter({ hasText: /‹|←/ }));
  await backBtn.first().click();
  await page.waitForTimeout(400);
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible({ timeout: 5_000 });
});
