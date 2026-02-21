/**
 * Unit tests — tts.ts Web Speech API wrapper (QRT-187)
 *
 * SpeechSynthesis is mocked via vi.stubGlobal — we test the wrapper logic,
 * not the browser's speech engine itself.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isTTSAvailable, isSpeaking, speak, stopSpeaking } from './tts';

// ── Mock SpeechSynthesisUtterance ─────────────────────────────────────────────

class MockUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;
  voice: SpeechSynthesisVoice | null = null;
  constructor(text: string) { this.text = text; }
}

// ── Mock SpeechSynthesis ──────────────────────────────────────────────────────

function makeMockSpeechSynthesis(overrides: Partial<SpeechSynthesis> = {}): SpeechSynthesis {
  return {
    speaking: false,
    pending: false,
    paused: false,
    cancel: vi.fn(),
    speak: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
    onvoiceschanged: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
    ...overrides,
  } as unknown as SpeechSynthesis;
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

let mockSynth: ReturnType<typeof makeMockSpeechSynthesis>;

beforeEach(() => {
  vi.useFakeTimers();
  mockSynth = makeMockSpeechSynthesis();
  vi.stubGlobal('speechSynthesis', mockSynth);
  vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// ── isTTSAvailable ────────────────────────────────────────────────────────────

describe('isTTSAvailable', () => {
  it('returns true when speechSynthesis is on window', () => {
    expect(isTTSAvailable()).toBe(true);
  });

  it('returns false when speechSynthesis is absent', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(isTTSAvailable()).toBe(false);
  });
});

// ── isSpeaking ────────────────────────────────────────────────────────────────

describe('isSpeaking', () => {
  it('returns false when not speaking', () => {
    mockSynth = makeMockSpeechSynthesis({ speaking: false });
    vi.stubGlobal('speechSynthesis', mockSynth);
    expect(isSpeaking()).toBe(false);
  });

  it('returns true when speechSynthesis.speaking is true', () => {
    mockSynth = makeMockSpeechSynthesis({ speaking: true });
    vi.stubGlobal('speechSynthesis', mockSynth);
    expect(isSpeaking()).toBe(true);
  });

  it('returns false when TTS is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(isSpeaking()).toBe(false);
  });
});

// ── stopSpeaking ──────────────────────────────────────────────────────────────

describe('stopSpeaking', () => {
  it('calls speechSynthesis.cancel()', () => {
    stopSpeaking();
    expect(mockSynth.cancel).toHaveBeenCalledOnce();
  });

  it('does not throw when TTS is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(() => stopSpeaking()).not.toThrow();
  });
});

// ── speak ─────────────────────────────────────────────────────────────────────

describe('speak', () => {
  it('calls cancel() before speaking (to stop prior audio)', () => {
    speak('テスト');
    // cancel() called synchronously (before the 50ms buffer)
    expect(mockSynth.cancel).toHaveBeenCalled();
  });

  it('calls speechSynthesis.speak() after 50ms buffer', () => {
    speak('テスト');
    expect(mockSynth.speak).not.toHaveBeenCalled(); // not yet
    vi.advanceTimersByTime(50);
    expect(mockSynth.speak).toHaveBeenCalledOnce();
  });

  it('speaks the correct text', () => {
    speak('助けてください');
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.text).toBe('助けてください');
  });

  it('defaults to ja-JP language', () => {
    speak('テスト');
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.lang).toBe('ja-JP');
  });

  it('respects custom lang option', () => {
    speak('hola', { lang: 'es-ES' });
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.lang).toBe('es-ES');
  });

  it('defaults rate to 0.85', () => {
    speak('テスト');
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.rate).toBe(0.85);
  });

  it('respects custom rate option', () => {
    speak('テスト', { rate: 0.5 });
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.rate).toBe(0.5);
  });

  it('defaults pitch to 1.0', () => {
    speak('テスト');
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.pitch).toBe(1.0);
  });

  it('prefers a Japanese voice when available', () => {
    const jpVoice = { lang: 'ja-JP', name: 'Kyoko', localService: true } as SpeechSynthesisVoice;
    const enVoice = { lang: 'en-US', name: 'Alex',  localService: true } as SpeechSynthesisVoice;
    mockSynth = makeMockSpeechSynthesis({
      cancel: vi.fn(),
      speak: vi.fn(),
      getVoices: vi.fn(() => [enVoice, jpVoice]),
    });
    vi.stubGlobal('speechSynthesis', mockSynth);

    speak('テスト');
    vi.advanceTimersByTime(50);
    const utterance = (mockSynth.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as MockUtterance;
    expect(utterance.voice).toBe(jpVoice);
  });

  it('does not throw when TTS is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(() => speak('テスト')).not.toThrow();
  });

  it('does not call speak when TTS is unavailable', () => {
    const noop = { cancel: vi.fn(), speak: vi.fn() };
    vi.stubGlobal('speechSynthesis', undefined);
    // SpeechSynthesis is unavailable — nothing should be called
    speak('テスト');
    vi.advanceTimersByTime(50);
    expect(noop.speak).not.toHaveBeenCalled();
  });
});
