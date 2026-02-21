/**
 * Apple Sign In — Capacitor wrapper with web fallback.
 *
 * Native (iOS): Uses @capacitor-community/apple-sign-in
 * Web / simulator: Falls back to Supabase OAuth redirect flow
 *
 * ## Xcode setup required (one-time, by Jared):
 * 1. Xcode → Target → Signing & Capabilities → + Capability → "Sign In with Apple"
 * 2. App Store Connect → Identifiers → your app ID → enable "Sign In with Apple"
 * 3. Supabase Dashboard → Authentication → Providers → Apple → enable,
 *    paste your Apple Services ID and client secret JWT
 *
 * ## nonce
 * A SHA-256 hashed nonce is sent to Apple, and the raw nonce is sent to
 * Supabase via signInWithIdToken. This prevents replay attacks.
 */

import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';

// Lazy import to avoid crashing on web where the plugin is unavailable
type ApplePlugin = typeof import('@capacitor-community/apple-sign-in');

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/** Generate a random nonce string. */
function generateNonce(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    arr.forEach(n => { result += chars[n % chars.length]; });
  } else {
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** SHA-256 hash a string. Returns hex string. */
async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data    = encoder.encode(str);
  const buffer  = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export type AppleSignInResult =
  | { ok: true; email: string | null }
  | { ok: false; error: string };

/**
 * Trigger Apple Sign In. On iOS native: uses the system sheet.
 * On web: falls back to Supabase OAuth (opens system browser).
 */
export async function signInWithApple(): Promise<AppleSignInResult> {
  if (isNative()) {
    return signInWithAppleNative();
  }
  return signInWithAppleWeb();
}

/** True if the current platform supports the native Apple Sign In sheet. */
export function isAppleSignInAvailable(): boolean {
  return isNative() && Capacitor.getPlatform() === 'ios';
}

// ── Native flow (iOS) ─────────────────────────────────────────────────────────

async function signInWithAppleNative(): Promise<AppleSignInResult> {
  try {
    const { SignInWithApple }: ApplePlugin = await import('@capacitor-community/apple-sign-in');

    const rawNonce    = generateNonce();
    const hashedNonce = await sha256(rawNonce);

    const result = await SignInWithApple.authorize({
      clientId:    'app.ichikara.ichikara',
      redirectURI: 'https://ichikara.app/auth/callback', // required by ASAuthorizationAppleIDRequest
      scopes:      'email name',
      state:       generateNonce(16),
      nonce:       hashedNonce,
    });

    const { identityToken, email } = result.response;

    if (!identityToken) {
      return { ok: false, error: 'Apple did not return an identity token.' };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token:    identityToken,
      nonce:    rawNonce,
    });

    if (error) return { ok: false, error: error.message };

    return { ok: true, email: email ?? null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // User cancelled — don't treat as an error to surface to the UI
    if (msg.includes('1001') || msg.toLowerCase().includes('cancel')) {
      return { ok: false, error: 'cancelled' };
    }
    console.error('[appleSignIn] native error:', err);
    return { ok: false, error: msg };
  }
}

// ── Web / simulator fallback ──────────────────────────────────────────────────

async function signInWithAppleWeb(): Promise<AppleSignInResult> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) return { ok: false, error: error.message };
    // OAuth redirects the page — control flow doesn't continue here
    return { ok: true, email: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}
