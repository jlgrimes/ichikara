/**
 * usePremiumGate — feature gating driven by subscription status (QRT-203)
 *
 * Usage:
 *   const { isPremium, requirePremium } = usePremiumGate();
 *
 *   // In a component:
 *   const canUseAudio = requirePremium('audio'); // returns true if premium
 *
 * Gate map (free tier gets these, premium unlocks the rest):
 *   FREE:    Full Japanese beginner content (N5/N4 lessons), SOS phrases (read-only)
 *   PREMIUM: Audio TTS, AI explanations, advanced lessons (N3+), all languages
 *
 * QRT-201 (StoreKit) will update useSubscription to read real purchase state.
 */

import { useCallback } from 'react';
import { useSubscription } from './useSubscription';

export type GatedFeature =
  | 'audio'             // TTS playback in SOS / LessonView
  | 'ai_explanation'    // AI sentence breakdown in LessonView
  | 'advanced_lessons'  // Lessons with module > 8 (N3+)
  | 'language_packs'    // Non-Japanese languages (future)
  | 'unlimited_bookmarks'; // More than 10 bookmarks (future)

// Premium feature definitions for UI display
export const GATED_FEATURE_META: Record<GatedFeature, { title: string; icon: string }> = {
  audio:               { title: 'Audio pronunciation', icon: '🔊' },
  ai_explanation:      { title: 'AI sentence explanations', icon: '✦' },
  advanced_lessons:    { title: 'Advanced lessons (N3+)', icon: '📚' },
  language_packs:      { title: 'All language packs', icon: '🌍' },
  unlimited_bookmarks: { title: 'Unlimited bookmarks', icon: '★' },
};

export interface PremiumGate {
  isPremium: boolean;
  loading: boolean;
  /** Returns true if user can access the feature, false if gated. */
  canAccess: (feature: GatedFeature) => boolean;
}

export function usePremiumGate(): PremiumGate {
  const { isPremium, loading } = useSubscription();

  const canAccess = useCallback((feature: GatedFeature): boolean => {
    if (isPremium) return true;

    // Free tier access list
    switch (feature) {
      case 'audio':               return false; // premium only
      case 'ai_explanation':      return false; // premium only
      case 'advanced_lessons':    return false; // premium only
      case 'language_packs':      return false; // premium only
      case 'unlimited_bookmarks': return false; // premium only
      default:                    return true;
    }
  }, [isPremium]);

  return { isPremium, loading, canAccess };
}
