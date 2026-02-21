/**
 * Shared test helpers for the Ichikara E2E suite.
 *
 * Import these in every spec file that needs a pre-authenticated,
 * post-onboarding app state.
 */

import type { Page } from '@playwright/test';

/**
 * Inject localStorage keys that bypass onboarding.
 * Call BEFORE `page.goto()`.
 */
export async function bypassOnboarding(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ichikara_onboarded', 'true');
      localStorage.setItem('ichikara_jlpt_start', 'N5');
    } catch {
      // ignore — will hit onboarding but tests can handle it
    }
  });
}

/**
 * Wait for the main app shell to be ready (grammar tab visible).
 * Use after goto('/') when auth state is injected.
 */
export async function waitForAppShell(page: Page, timeout = 15_000): Promise<void> {
  await page.waitForFunction(
    () => !!document.querySelector('[data-testid="tab-grammar"], [role="tablist"]'),
    undefined,
    { timeout },
  );
}

/**
 * Switch to a tab by its label text.
 * Works with the TabBar's button elements.
 */
export async function switchTab(page: Page, label: 'Grammar' | 'SOS' | 'Saved' | 'Settings'): Promise<void> {
  await page.getByRole('button', { name: label, exact: true }).click();
  // Brief pause for slide animation
  await page.waitForTimeout(350);
}
