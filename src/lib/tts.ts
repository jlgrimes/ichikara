/**
 * Text-to-speech utility — wraps Web Speech API (SpeechSynthesis).
 *
 * SpeechSynthesis is available in iOS 7+ WebKit / WKWebView and all
 * modern browsers. No native Capacitor plugin needed.
 *
 * Key iOS constraint: speak() must be called from inside a user-gesture
 * handler. All call sites meet this requirement (button onClick).
 */

/** True if speech synthesis is available and non-null in this environment. */
export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

interface SpeakOptions {
  lang?: string;   // BCP-47 language tag, e.g. 'ja-JP'
  rate?: number;   // 0.1–10, default 1.0
  pitch?: number;  // 0–2, default 1.0
}

/**
 * Speak the given text. Cancels any currently-playing utterance first.
 * Returns immediately — audio plays asynchronously.
 *
 * iOS WKWebView note: calling speak() synchronously after cancel() can
 * silently drop the utterance. We use a 50ms buffer to let the engine
 * flush before queuing the next utterance.
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!isTTSAvailable()) return;

  window.speechSynthesis.cancel();

  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = options.lang  ?? 'ja-JP';
    utterance.rate  = options.rate  ?? 0.85;  // slightly slower — clarity for learners
    utterance.pitch = options.pitch ?? 1.0;

    // Prefer a Japanese voice if available (iOS bundles one).
    // getVoices() may return an empty array on first call — that's fine,
    // the engine will use the system default which handles ja-JP.
    const voices  = window.speechSynthesis.getVoices();
    const jpVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jpVoice) utterance.voice = jpVoice;

    window.speechSynthesis.speak(utterance);
  };

  // 50ms buffer satisfies the iOS WKWebView cancel→speak flush requirement
  setTimeout(doSpeak, 50);
}

/** Stop any currently-playing utterance. */
export function stopSpeaking(): void {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();
}

/** True if speech is currently in progress. */
export function isSpeaking(): boolean {
  if (!isTTSAvailable()) return false;
  return window.speechSynthesis.speaking;
}
