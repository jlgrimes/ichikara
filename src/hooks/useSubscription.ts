/**
 * useSubscription — subscription status hook.
 *
 * v0: localStorage stub (free only).
 * QRT-201 will replace this with StoreKit 2 / Supabase subscription_status table.
 *
 * Usage:
 *   const { isPremium, tier, loading } = useSubscription();
 */

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionState {
  tier: SubscriptionTier;
  isPremium: boolean;
  /** ISO date string, null for free users */
  expiresAt: string | null;
  loading: boolean;
}

const DEFAULT_STATE: SubscriptionState = {
  tier:      'free',
  isPremium: false,
  expiresAt: null,
  loading:   true,
};

/**
 * Check subscription status from Supabase user metadata.
 *
 * Supabase user_metadata.subscription_tier = 'premium' | 'free'
 * Set by Supabase Edge Function after StoreKit receipt validation (QRT-201).
 */
async function fetchSubscriptionStatus(userId: string): Promise<Omit<SubscriptionState, 'loading'>> {
  try {
    // Check user metadata (fast path — already cached in session)
    const { data: { user } } = await supabase.auth.getUser();
    const meta = user?.user_metadata;
    if (meta?.subscription_tier === 'premium') {
      return {
        tier:      'premium',
        isPremium: true,
        expiresAt: meta.subscription_expires_at ?? null,
      };
    }

    // Fallback: check subscription table (once QRT-201 creates it)
    const { data } = await supabase
      .from('subscriptions')
      .select('tier, expires_at')
      .eq('user_id', userId)
      .single();

    if (data?.tier === 'premium') {
      return {
        tier:      'premium',
        isPremium: true,
        expiresAt: data.expires_at ?? null,
      };
    }
  } catch {
    // Table might not exist yet — that's fine, default to free
  }

  return { tier: 'free', isPremium: false, expiresAt: null };
}

export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setState({ ...DEFAULT_STATE, loading: false });
        return;
      }
      fetchSubscriptionStatus(session.user.id).then(result => {
        setState({ ...result, loading: false });
      });
    });
  }, []);

  return state;
}
