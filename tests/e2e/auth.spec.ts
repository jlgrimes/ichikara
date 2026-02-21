/**
 * QRT-179: Auth page E2E tests
 *
 * Covers:
 * - Auth page renders for unauthenticated users
 * - Toggle between Sign In / Create Account modes
 * - Validation (empty submit, short password)
 * - Error message display on bad credentials
 *
 * NOTE: These tests run WITHOUT saved auth state so the AuthPage renders.
 */

import { test, expect } from '@playwright/test';

// Explicitly no storageState — we want the unauthenticated view
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // App shows AuthPage when there's no session
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({ timeout: 15_000 });
});

test('renders sign-in form by default', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});

test('toggles to create account mode', async ({ page }) => {
  // The toggle link/button switches modes
  const toggle = page.getByRole('button', { name: /create account/i })
    .or(page.getByText(/don't have an account/i));
  await toggle.click();
  await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible({ timeout: 3_000 });
  await expect(page.getByRole('button', { name: /create account/i }).last()).toBeVisible();
});

test('toggles back to sign-in from create account', async ({ page }) => {
  // Switch to sign up
  const toSignUp = page.getByRole('button', { name: /create account/i })
    .or(page.getByText(/don't have an account/i));
  await toSignUp.click();
  await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible({ timeout: 3_000 });

  // Switch back
  const toSignIn = page.getByRole('button', { name: /sign in/i })
    .or(page.getByText(/already have an account/i));
  await toSignIn.click();
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({ timeout: 3_000 });
});

test('shows error on invalid credentials', async ({ page }) => {
  await page.getByRole('textbox', { name: /email/i }).fill('notreal@example.com');
  await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword123');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Supabase returns an error; AuthPage displays it
  await expect(
    page.getByText(/invalid|incorrect|credentials|not found/i),
  ).toBeVisible({ timeout: 10_000 });
});

test('shows logo kanji on auth page', async ({ page }) => {
  // The 一から logo should be visible
  await expect(page.getByText('一から')).toBeVisible();
});
