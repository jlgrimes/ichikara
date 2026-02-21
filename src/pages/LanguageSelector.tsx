import { Page, PageContent } from '../lib/ui';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSelector() {
  const { setLanguageId } = useLanguage();

  return (
    <Page>
      <div className="shrink-0 bg-[var(--color-paper)]" style={{ height: 'env(safe-area-inset-top)' }} />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 space-y-8">

          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              Language
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1.5">choose what you want to learn</p>
          </div>

          {/* Japanese — the only available language */}
          <button
            onClick={() => setLanguageId('japanese')}
            className={[
              'w-full text-left rounded-3xl p-5 select-none',
              'flex items-center gap-4',
              'bg-[var(--color-ink)] shadow-[0_4px_24px_rgba(26,26,46,0.18)]',
              'transition-all duration-150 active:scale-[0.97]',
            ].join(' ')}
          >
            <span className="text-4xl leading-none">🇯🇵</span>
            <div>
              <p className="text-[17px] font-bold text-white leading-snug">Japanese</p>
              <p className="text-sm text-white/60 mt-0.5">日本語</p>
            </div>
            <span className="ml-auto text-white/50 text-sm font-mono">learning</span>
          </button>

          {/* Coming soon — single card, no list */}
          <div className="bg-white/50 rounded-3xl p-6 flex flex-col items-center gap-2 opacity-60">
            <p className="text-2xl">🌍</p>
            <p className="text-sm font-bold text-[var(--color-ink)]">More languages coming soon</p>
            <p className="text-xs text-gray-400 font-mono text-center">Spanish, Mandarin, French, Korean + many more</p>
          </div>

        </div>
      </PageContent>
    </Page>
  );
}
