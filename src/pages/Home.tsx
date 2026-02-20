import { Navbar, Page, PageContent, useNavigation } from '../lib/ui';
import { LessonCard } from '../components/LessonCard';
import { CURRICULUM } from '../data/curriculum';
import { LessonView } from './LessonView';
import { ParticlesView } from './ParticlesView';

interface HomeProps {
  onSignOut: () => void;
}

const MODULE_LABELS: Record<number, string> = {
  0: 'Primitives',
  1: 'Particle Type System',
  2: 'Verb System',
  3: 'Adjectives',
  4: 'Extended Particles',
  5: 'Clauses & Nominalization',
};

export function Home({ onSignOut }: HomeProps) {
  const { push } = useNavigation();
  const modules = [0, 1, 2, 3, 4, 5];

  return (
    <Page>
      <Navbar
        title="一から"
        right={
          <button
            onClick={onSignOut}
            className="text-xs font-mono text-gray-400 tracking-wider min-h-[44px] px-1 active:opacity-40 transition-opacity"
          >
            sign out
          </button>
        }
      />

      <PageContent>
        <div className="max-w-lg mx-auto px-4 py-6 space-y-8">

          {/* Core reference shortcut */}
          <button
            onClick={() => push(<ParticlesView />)}
            className={[
              'w-full text-left',
              'bg-[var(--color-ink)]',
              'rounded-3xl p-6',
              'shadow-[0_4px_24px_rgba(26,26,46,0.18)]',
              'active:scale-[0.97] active:opacity-90',
              'transition-all duration-150 ease-out select-none',
            ].join(' ')}
          >
            <p className="text-[11px] font-mono text-white/50 mb-1.5 uppercase tracking-widest">
              Core Reference
            </p>
            <h2 className="text-[19px] font-bold text-white leading-snug">
              Particle Type System
            </h2>
            <p className="text-[13px] text-white/60 mt-1.5">
              は　が　を　に　で　の — the skeleton of every sentence
            </p>
          </button>

          {/* Curriculum modules */}
          {modules.map((mod) => {
            const lessons = CURRICULUM.filter((l) => l.module === mod);
            if (lessons.length === 0) return null;
            return (
              <div key={mod}>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                  Module {mod} — {MODULE_LABELS[mod]}
                </p>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      onClick={() => push(<LessonView lessonId={lesson.id} />)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-center text-gray-300 font-mono pb-4">一から — from scratch</p>
        </div>
      </PageContent>
    </Page>
  );
}
