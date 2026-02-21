import { Page, PageContent } from '../lib/ui';
import { LANGUAGE_META } from '../data/languages/index';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSelector() {
  const { languageId, setLanguageId } = useLanguage();

  const available  = LANGUAGE_META.filter(l => l.available);
  const comingSoon = LANGUAGE_META.filter(l => !l.available);

  return (
    <Page>
      {/* Safe area fill */}
      <div className="shrink-0 bg-[var(--color-paper)]" style={{ height: 'env(safe-area-inset-top)' }} />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 space-y-8">

          {/* Large title */}
          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              Language
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1.5">choose what you want to learn</p>
          </div>

          {/* Available */}
          <div className="space-y-3">
            {available.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguageId(lang.id)}
                className={[
                  'w-full text-left rounded-3xl p-5 select-none',
                  'flex items-center gap-4',
                  'transition-all duration-150 active:scale-[0.97]',
                  languageId === lang.id
                    ? 'bg-[var(--color-ink)] shadow-[0_4px_24px_rgba(26,26,46,0.18)]'
                    : 'bg-[var(--surface-bg)] backdrop-blur-sm border border-[var(--surface-border)] shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
                ].join(' ')}
              >
                <span className="text-4xl leading-none">{lang.flag}</span>
                <div>
                  <p className={`text-[17px] font-bold leading-snug ${languageId === lang.id ? 'text-white' : 'text-[var(--color-ink)]'}`}>
                    {lang.name}
                  </p>
                  <p className={`text-sm mt-0.5 ${languageId === lang.id ? 'text-white/60' : 'text-gray-500'}`}>
                    {lang.nativeName}
                  </p>
                </div>
                {languageId === lang.id && (
                  <span className="ml-auto text-white/60 text-sm font-mono">learning</span>
                )}
              </button>
            ))}
          </div>

          {/* Coming soon */}
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Coming soon</p>
            <div className="grid grid-cols-3 gap-2">
              {comingSoon.map(lang => (
                <div
                  key={lang.id}
                  className="flex flex-col items-center gap-1.5 bg-[var(--surface-bg)] rounded-2xl p-4 opacity-60"
                >
                  <span className="text-2xl leading-none">{lang.flag}</span>
                  <p className="text-[11px] font-medium text-[var(--color-ink)] text-center leading-tight">{lang.name}</p>
                  <p className="text-[10px] text-gray-400 text-center leading-tight">{lang.nativeName}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageContent>
    </Page>
  );
}
