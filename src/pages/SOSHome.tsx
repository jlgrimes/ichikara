import { Navbar, Page, PageContent, useNavigation } from '../lib/ui';
import { SOS_CATEGORIES } from '../data/sos';
import { SOSDetail } from './SOSDetail';

export function SOSHome() {
  const { push } = useNavigation();

  return (
    <Page>
      <Navbar title="SOS" />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 py-6">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
            Quick Reference
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tap a category. Show your phone to locals.
          </p>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            {SOS_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => push(<SOSDetail categoryId={cat.id} />)}
                className={[
                  'flex flex-col items-center justify-center gap-2',
                  'rounded-3xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
                  'p-6 aspect-square select-none',
                  'active:scale-[0.95] active:shadow-none transition-all duration-150',
                  cat.color,
                ].join(' ')}
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="text-[13px] font-bold text-[var(--color-ink)] text-center leading-tight">
                  {cat.name}
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  {cat.phrases.length} phrases
                </span>
              </button>
            ))}
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
