import { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar, Page, PageContent } from '../lib/ui';
import { useLanguage } from '../context/LanguageContext';
import { isTTSAvailable, speak, stopSpeaking } from '../lib/tts';
import type { SOSPhrase } from '../types/language';

interface SOSDetailProps {
  categoryId: string;
}

// ── Audio button ──────────────────────────────────────────────────────────────

interface AudioBtnProps {
  phrase: SOSPhrase;
  playing: boolean;
  onPlay: (phrase: SOSPhrase) => void;
  /** 'sm' for list cards, 'lg' for fullscreen overlay */
  size?: 'sm' | 'lg';
}

function AudioBtn({ phrase, playing, onPlay, size = 'sm' }: AudioBtnProps) {
  if (!isTTSAvailable()) return null;

  const sm = size === 'sm';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // don't open fullscreen when tapping audio
        onPlay(phrase);
      }}
      aria-label={`Play pronunciation: ${phrase.target}`}
      className={[
        'shrink-0 rounded-full flex items-center justify-center',
        'transition-all duration-150 select-none',
        sm
          ? 'w-9 h-9 active:scale-90'
          : 'w-16 h-16 active:scale-90',
        playing
          ? sm
            ? 'bg-[var(--color-accent)] text-white shadow-md'
            : 'bg-[var(--surface-solid)] text-[var(--color-ink)] shadow-lg'
          : sm
          ? 'bg-[var(--input-bg)] text-gray-400 active:opacity-70'
          : 'bg-white/20 text-white active:bg-white/30',
      ].join(' ')}
    >
      {playing ? (
        /* Animated speaker icon when playing */
        <span className={[sm ? 'text-base' : 'text-2xl', 'animate-pulse'].join(' ')}>
          🔊
        </span>
      ) : (
        <span className={sm ? 'text-base' : 'text-2xl'}>🔊</span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SOSDetail({ categoryId }: SOSDetailProps) {
  const { language }   = useLanguage();
  const category       = language.sosCategories.find(c => c.id === categoryId);
  const [fullscreen, setFullscreen]   = useState<SOSPhrase | null>(null);
  const [playingIdx, setPlayingIdx]   = useState<number | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!category) return null;

  // ── Speech ─────────────────────────────────────────────────────────────────

  const playPhrase = useCallback((phrase: SOSPhrase, idx: number) => {
    // Clear any pending "playing" reset
    if (playTimerRef.current) clearTimeout(playTimerRef.current);

    setPlayingIdx(idx);
    speak(phrase.target, { lang: 'ja-JP', rate: 0.8 });

    // Most Japanese phrases are < 4 seconds; reset icon after a safe window
    // (SpeechSynthesisUtterance.onend isn't reliable on iOS WKWebView)
    const estimatedMs = Math.max(1500, phrase.target.length * 200);
    playTimerRef.current = setTimeout(() => setPlayingIdx(null), estimatedMs);
  }, []);

  // Stop speech when navigating away
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, []);

  // Stop speech when fullscreen closes
  const closeFullscreen = useCallback(() => {
    setFullscreen(null);
  }, []);

  return (
    <Page>
      <Navbar title={`${category.emoji}  ${category.name}`} />

      <PageContent>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-xs font-mono text-gray-400 mb-5">
            tap phrase to show fullscreen · 🔊 to hear it
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.phrases.map((phrase, i) => (
              <div
                key={i}
                className={[
                  'w-full text-left',
                  'bg-[var(--surface-bg)] backdrop-blur-sm',
                  'rounded-3xl border border-[var(--surface-border)]',
                  'shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
                  'p-5',
                  'flex items-center gap-3',
                  playingIdx === i ? 'border-[var(--color-accent)]/30 bg-[var(--surface-solid)]' : '',
                  'transition-all duration-150',
                ].join(' ')}
              >
                {/* Text — tappable for fullscreen */}
                <button
                  onClick={() => setFullscreen(phrase)}
                  className="flex-1 text-left active:opacity-70 transition-opacity select-none"
                >
                  {/* Japanese — big, point-at-screen size */}
                  <p className="text-2xl font-black text-[var(--color-ink)] leading-snug mb-1.5">
                    {phrase.target}
                  </p>
                  {phrase.romaji && (
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-0.5">{phrase.romaji}</p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">{phrase.english}</p>
                </button>

                {/* Audio play button */}
                <AudioBtn
                  phrase={phrase}
                  playing={playingIdx === i}
                  onPlay={(p) => playPhrase(p, i)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </PageContent>

      {/* Fullscreen overlay — show to locals */}
      {fullscreen && (() => {
        // Find the index of the fullscreen phrase for audio state
        const fsIdx = category.phrases.indexOf(fullscreen);
        return (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-ink)] px-8"
            onClick={closeFullscreen}
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-12">
              tap anywhere to close
            </p>

            {/* Large Japanese text */}
            <p className="text-6xl font-black text-white text-center leading-tight mb-6">
              {fullscreen.target}
            </p>
            {fullscreen.romaji && (
              <p className="text-lg font-mono text-white/50 text-center mb-1">
                {fullscreen.romaji}
              </p>
            )}
            <p className="text-base text-white/40 text-center mb-10">
              {fullscreen.english}
            </p>

            {/* Large audio button in fullscreen */}
            <AudioBtn
              phrase={fullscreen}
              playing={playingIdx === fsIdx}
              onPlay={(p) => playPhrase(p, fsIdx)}
              size="lg"
            />
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-3">
              tap to hear
            </p>
          </div>
        );
      })()}
    </Page>
  );
}
