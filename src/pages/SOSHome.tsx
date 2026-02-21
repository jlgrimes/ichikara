import { Page, PageContent, useNavigation } from '../lib/ui';
import { SOS_CATEGORIES } from '../data/sos';
import { SOSDetail } from './SOSDetail';

export function SOSHome() {
  const { push } = useNavigation();

  return (
    <Page>
      {/* Safe area fill — matches Home style */}
      <div
        className="shrink-0 bg-[var(--color-paper)]"
        style={{ height: 'env(safe-area-inset-top)' }}
      />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 space-y-8">

          {/* iOS 26 large title */}
          <div className="pt-6 pb-2">
            <h1 className="text-[42px] font-black text-[var(--color-ink)] tracking-tight leading-none">
              SOS
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1.5">
              tap a card · show your phone
            </p>
          </div>

          {/* Category cards — same visual treatment as LessonCard */}
          <div className="space-y-3">
            {SOS_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => push(<SOSDetail categoryId={cat.id} />)}
                className={[
                  'w-full text-left',
                  'bg-white/80 backdrop-blur-sm',
                  'rounded-3xl border border-white/60',
                  'shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
                  'p-5',
                  'active:scale-[0.97] active:shadow-none active:bg-white/60',
                  'transition-all duration-150 ease-out select-none',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    {/* Emoji in a soft pill */}
                    <span className="text-3xl leading-none">{cat.emoji}</span>
                    <div>
                      <p className="text-[17px] font-bold text-[var(--color-ink)] leading-snug">
                        {cat.name}
                      </p>
                      <p className="text-[13px] text-gray-500 mt-0.5">
                        {cat.phrases.length} phrases
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-xl shrink-0 leading-none">›</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
