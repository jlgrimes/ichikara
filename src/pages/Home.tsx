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
            className="text-xs text-gray-400 active:opacity-50 font-mono min-h-[44px] px-1"
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
            className="w-full bg-[var(--color-ink)] text-white rounded-2xl p-5 text-left active:opacity-80 transition-opacity select-none"
          >
            <p className="text-xs font-mono opacity-60 mb-1 uppercase tracking-widest">Core Reference</p>
            <h2 className="text-xl font-bold">Particle Type System</h2>
            <p className="text-sm opacity-70 mt-1">
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
