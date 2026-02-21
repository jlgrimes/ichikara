/**
 * Haptics utility — Capacitor Haptics with graceful web fallback.
 *
 * On iOS (Capacitor): uses @capacitor/haptics for native haptic feedback.
 * On web/unsupported: silently no-ops (no errors thrown).
 *
 * All functions are fire-and-forget — never awaited at call sites.
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

function safe(fn: () => Promise<void>): void {
  fn().catch(() => {/* no-op on web or when haptics unavailable */});
}

// ── Impact variants (physical feel) ──────────────────────────────────────────

/** Subtle tap — nav push, search input focus, small UI interactions. */
export function hapticLight(): void {
  safe(() => Haptics.impact({ style: ImpactStyle.Light }));
}

/** Medium tap — tab switch, swipe-back complete, button presses. */
export function hapticMedium(): void {
  safe(() => Haptics.impact({ style: ImpactStyle.Medium }));
}

/** Strong tap — destructive action, error. */
export function hapticHeavy(): void {
  safe(() => Haptics.impact({ style: ImpactStyle.Heavy }));
}

// ── Notification variants (semantic) ─────────────────────────────────────────

/** Success celebration — lesson complete, quiz "Got it". */
export function hapticSuccess(): void {
  safe(() => Haptics.notification({ type: NotificationType.Success }));
}

/** Warning — quiz "Again" (not wrong, but retry needed). */
export function hapticWarning(): void {
  safe(() => Haptics.notification({ type: NotificationType.Warning }));
}

/** Error — generic failure. */
export function hapticError(): void {
  safe(() => Haptics.notification({ type: NotificationType.Error }));
}
