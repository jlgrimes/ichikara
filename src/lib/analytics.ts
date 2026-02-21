/**
 * PostHog product analytics
 *
 * Keys: VITE_POSTHOG_KEY, VITE_POSTHOG_HOST (defaults to US cloud)
 * Docs: https://posthog.com/docs/libraries/js
 *
 * Lazy-loaded — does NOT block initial render.
 * No PII tracked beyond a stable user ID.
 *
 * Event names match the monitor.{} helpers in monitoring.ts so both
 * Highlight.io custom events and PostHog events stay in sync.
 */

import posthog from 'posthog-js';

const KEY  = import.meta.env.VITE_POSTHOG_KEY  as string | undefined;
const HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined ?? 'https://us.i.posthog.com';

let initialised = false;

// ── Init ──────────────────────────────────────────────────────────────────────

export function initAnalytics(): void {
  if (!KEY || typeof window === 'undefined') return;
  if (initialised) return;

  posthog.init(KEY, {
    api_host:             HOST,
    capture_pageview:     false,  // SPA — we track screens manually
    capture_pageleave:    true,   // session duration via page leave events
    autocapture:          false,  // explicit tracking only — no noise
    persistence:          'localStorage',
    disable_session_recording: import.meta.env.DEV,
    loaded(ph) {
      if (import.meta.env.DEV) ph.debug();
    },
  });

  initialised = true;
}

// ── Identify ──────────────────────────────────────────────────────────────────

export function identifyAnalyticsUser(userId: string, properties?: Record<string, string>): void {
  if (!initialised) return;
  posthog.identify(userId, properties);
}

export function resetAnalyticsUser(): void {
  if (!initialised) return;
  posthog.reset();
}

// ── Core track ────────────────────────────────────────────────────────────────

export function track(event: string, properties?: Record<string, unknown>): void {
  if (!initialised) return;
  posthog.capture(event, properties);
}

// ── Named event helpers ───────────────────────────────────────────────────────

export const analytics = {

  // ── Grammar lessons ──────────────────────────────────────────────────────

  lessonOpened(lessonId: string, module: number, title: string) {
    track('lesson_opened', { lesson_id: lessonId, module, title });
  },

  lessonCompleted(lessonId: string, module: number) {
    track('lesson_completed', { lesson_id: lessonId, module });
  },

  lessonUnmarked(lessonId: string) {
    track('lesson_unmarked', { lesson_id: lessonId });
  },

  // ── Quiz / spaced repetition ─────────────────────────────────────────────

  quizStarted(lessonId: string, cardCount: number) {
    track('quiz_started', { lesson_id: lessonId, card_count: cardCount });
  },

  quizCompleted(lessonId: string, mastery: number, sessionCardCount: number) {
    track('quiz_completed', { lesson_id: lessonId, mastery_pct: mastery, cards_reviewed: sessionCardCount });
  },

  quizAnswer(lessonId: string, cardId: string, correct: boolean) {
    track('quiz_answer', { lesson_id: lessonId, card_id: cardId, correct });
  },

  // ── SOS phrases ──────────────────────────────────────────────────────────

  sosCategoryOpened(categoryId: string, categoryName: string) {
    track('sos_category_opened', { category_id: categoryId, category_name: categoryName });
  },

  sosPhraseAudio(categoryId: string, phraseTarget: string) {
    track('sos_phrase_audio', { category_id: categoryId, phrase: phraseTarget });
  },

  sosPhraseFullscreen(categoryId: string) {
    track('sos_phrase_fullscreen', { category_id: categoryId });
  },

  // ── Search ───────────────────────────────────────────────────────────────

  searchPerformed(queryLength: number, lessonResults: number, phraseResults: number) {
    track('search_performed', { query_length: queryLength, lesson_results: lessonResults, phrase_results: phraseResults });
  },

  // ── Bookmarks ────────────────────────────────────────────────────────────

  bookmarkAdded(itemType: 'lesson' | 'phrase', itemId: string) {
    track('bookmark_added', { item_type: itemType, item_id: itemId });
  },

  bookmarkRemoved(itemType: 'lesson' | 'phrase', itemId: string) {
    track('bookmark_removed', { item_type: itemType, item_id: itemId });
  },

  // ── Onboarding ───────────────────────────────────────────────────────────

  onboardingCompleted(startLevel: string) {
    track('onboarding_completed', { start_level: startLevel });
  },

  onboardingSkipped() {
    track('onboarding_skipped');
  },

  // ── Navigation ───────────────────────────────────────────────────────────

  tabSwitched(tab: string) {
    track('tab_switched', { tab });
  },

  screenViewed(screen: string, properties?: Record<string, unknown>) {
    track('screen_viewed', { screen, ...properties });
  },

  // ── Audio ─────────────────────────────────────────────────────────────────

  audioPlayed(context: 'lesson_quiz' | 'sos_detail' | 'sos_search' | 'saved') {
    track('audio_played', { context });
  },
};
