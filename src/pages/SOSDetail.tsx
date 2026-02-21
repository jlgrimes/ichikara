import { useState } from 'react';
import { Navbar, Page, PageContent } from '../lib/ui';
import { SOS_CATEGORIES, type SOSPhrase } from '../data/sos';

interface SOSDetailProps {
  categoryId: string;
}

export function SOSDetail({ categoryId }: SOSDetailProps) {
  const category = SOS_CATEGORIES.find(c => c.id === categoryId);
  const [fullscreen, setFullscreen] = useState<SOSPhrase | null>(null);

  if (!category) return null;

  return (
    <Page>
      <Navbar title={`${category.emoji} ${category.name}`} />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 py-4">
          <p className="text-xs font-mono text-gray-400 mb-5">
            Tap any phrase to show it fullscreen
          </p>

          <div className="space-y-3">
            {category.phrases.map((phrase, i) => (
              <button
                key={i}
                onClick={() => setFullscreen(phrase)}
                className={[
                  'w-full text-left rounded-3xl border border-white/60',
                  'shadow-[0_2px_12px_rgba(0,0,0,0.05)]',
                  'p-5 select-none',
                  'active:scale-[0.98] active:shadow-none transition-all duration-150',
                  category.color,
                ].join(' ')}
              >
                {/* Japanese — large, for showing to people */}
                <p className="text-2xl font-black text-[var(--color-ink)] leading-snug mb-1">
                  {phrase.japanese}
                </p>
                {/* Romaji */}
                <p className="text-xs font-mono text-gray-500 mb-1">{phrase.romaji}</p>
                {/* English */}
                <p className="text-sm text-gray-600">{phrase.english}</p>
              </button>
            ))}
          </div>
        </div>
      </PageContent>

      {/* Fullscreen overlay — show to locals */}
      {fullscreen && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-ink)] px-8"
          onClick={() => setFullscreen(null)}
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-12">
            tap anywhere to close
          </p>

          {/* Giant Japanese text — easy to read from a distance */}
          <p className="text-6xl font-black text-white text-center leading-tight mb-8">
            {fullscreen.japanese}
          </p>

          {/* Romaji + English below, smaller */}
          <p className="text-lg font-mono text-white/60 text-center mb-2">
            {fullscreen.romaji}
          </p>
          <p className="text-base text-white/50 text-center">
            {fullscreen.english}
          </p>
        </div>
      )}
    </Page>
  );
}
