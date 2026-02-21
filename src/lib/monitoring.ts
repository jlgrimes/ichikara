/**
 * Highlight.io error monitoring + session replay
 *
 * Project ID: VITE_HIGHLIGHT_PROJECT_ID env var (set in .env)
 * Docs: https://www.highlight.io/docs/getting-started/client-sdk/reactjs
 *
 * Capacitor / WKWebView compatibility:
 * - Error tracking + custom events: ✅ (Fetch + native JS)
 * - Session replay: partial — rrweb captures the React DOM tree correctly
 *   but native Capacitor views (e.g. camera) are not captured
 *
 * Safe to call in SSR / during build — all methods check environment first.
 */

import { H } from 'highlight.run';

const PROJECT_ID = import.meta.env.VITE_HIGHLIGHT_PROJECT_ID as string | undefined;

let initialised = false;

// ── Init ──────────────────────────────────────────────────────────────────────

export function initMonitoring(): void {
  if (!PROJECT_ID || typeof window === 'undefined') return;
  if (initialised) return;

  H.init(PROJECT_ID, {
    environment: import.meta.env.MODE,                // 'development' | 'production'
    version: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: false,                   // don't log request bodies (privacy)
    },
    // Disable session replay in development to avoid noise
    disableSessionRecording: import.meta.env.DEV,
    // Keep console errors / network errors
    tracingOrigins: true,
    reportConsoleErrors: true,
  });

  initialised = true;
}

// ── Identify user ─────────────────────────────────────────────────────────────

/**
 * Associate the Highlight session with the authenticated user.
 * Call after Supabase sign-in — do NOT pass sensitive PII (email is ok for support).
 */
export function identifyUser(userId: string, email?: string): void {
  if (!initialised) return;
  H.identify(userId, { email });
}

// ── Report errors manually ────────────────────────────────────────────────────

export function reportError(error: Error, metadata?: Record<string, string>): void {
  if (!initialised) return;
  H.consumeError(error, undefined, metadata);
}

// ── Track custom events ───────────────────────────────────────────────────────

export function trackEvent(name: string, metadata?: Record<string, unknown>): void {
  if (!initialised) return;
  H.track(name, metadata);
}

// ── Convenience event helpers (keep names consistent with PostHog events) ─────

export const monitor = {
  lessonOpened:      (lessonId: string, module: number) =>
    trackEvent('lesson_opened', { lessonId, module }),

  quizStarted:       (lessonId: string, cardCount: number) =>
    trackEvent('quiz_started', { lessonId, cardCount }),

  quizCompleted:     (lessonId: string, mastery: number) =>
    trackEvent('quiz_completed', { lessonId, mastery }),

  quizAnswer:        (lessonId: string, correct: boolean) =>
    trackEvent('quiz_answer', { lessonId, correct }),

  lessonCompleted:   (lessonId: string) =>
    trackEvent('lesson_completed', { lessonId }),

  sosOpened:         (categoryId: string) =>
    trackEvent('sos_opened', { categoryId }),

  sosPhraseAudio:    (categoryId: string) =>
    trackEvent('sos_phrase_audio', { categoryId }),

  searchPerformed:   (query: string, resultCount: number) =>
    trackEvent('search', { queryLength: query.length, resultCount }),

  bookmarkToggled:   (itemType: 'lesson' | 'phrase', added: boolean) =>
    trackEvent('bookmark_toggled', { itemType, added }),

  onboardingCompleted: (level: string) =>
    trackEvent('onboarding_completed', { level }),

  tabSwitched:       (tab: string) =>
    trackEvent('tab_switched', { tab }),
};

// Expose H directly for advanced usage (e.g. custom metrics)
export { H };
