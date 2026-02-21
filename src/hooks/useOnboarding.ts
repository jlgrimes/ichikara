/**
 * Onboarding state — localStorage-backed.
 *
 * Keys:
 *   ichikara_onboarded  'true' | absent
 *   ichikara_jlpt_start 'N5' | 'N4' | 'N3' | 'skip'
 */

const KEY_DONE  = 'ichikara_onboarded';
const KEY_LEVEL = 'ichikara_jlpt_start';

export type JLPTStart = 'N5' | 'N4' | 'N3' | 'skip';

export function isOnboarded(): boolean {
  try { return localStorage.getItem(KEY_DONE) === 'true'; }
  catch { return false; }
}

export function markOnboarded(level: JLPTStart): void {
  try {
    localStorage.setItem(KEY_DONE, 'true');
    localStorage.setItem(KEY_LEVEL, level);
  } catch { /* ignore */ }
}

export function getStartLevel(): JLPTStart {
  try {
    return (localStorage.getItem(KEY_LEVEL) as JLPTStart | null) ?? 'N5';
  } catch { return 'N5'; }
}
