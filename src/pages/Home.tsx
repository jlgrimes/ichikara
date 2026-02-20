import { LessonCard } from '../components/LessonCard';
import { CURRICULUM } from '../data/curriculum';

interface HomeProps {
  onSelectLesson: (id: string) => void;
  onGoToParticles: () => void;
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

export function Home({ onSelectLesson, onGoToParticles, onSignOut }: HomeProps) {
  const modules = [0, 1, 2, 3, 4, 5];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-[var(--color-paper)]/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-black text-[var(--color-ink)] tracking-tight">一から</h1>
        <button
          onClick={onSignOut}
          className="text-xs text-gray-400 hover:text-gray-700 transition font-mono"
        >
          sign out
        </button>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-8 space-y-10">

          {/* Particle system shortcut */}
          <button
            onClick={onGoToParticles}
            className="w-full bg-[var(--color-ink)] text-white rounded-2xl p-5 text-left active:opacity-80 transition-opacity"
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
                <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                  Module {mod} — {MODULE_LABELS[mod]}
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      onClick={() => onSelectLesson(lesson.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-center text-gray-300 font-mono pb-4">一から — from scratch</p>
        </div>
      </div>
    </div>
  );
}
