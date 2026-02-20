import { LessonCard } from '../components/LessonCard';
import { CURRICULUM } from '../data/curriculum';

interface HomeProps {
  onSelectLesson: (id: string) => void;
  onGoToParticles: () => void;
}

export function Home({ onSelectLesson, onGoToParticles }: HomeProps) {
  const modules: Array<{ id: number; label: string }> = [
    { id: 0, label: 'Primitives' },
    { id: 1, label: 'Particle Type System' },
    { id: 2, label: 'Verb System' },
    { id: 3, label: 'Adjectives' },
    { id: 4, label: 'Extended Particles' },
    { id: 5, label: 'Clauses & Nominalization' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-[var(--color-ink)] tracking-tight">
          一から
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Japanese — structural, from the ground up.
        </p>
      </div>

      {/* Quick access: Particle type system */}
      <button
        onClick={onGoToParticles}
        className="w-full bg-[var(--color-ink)] text-white rounded-2xl p-5 text-left hover:opacity-90 transition-opacity"
      >
        <p className="text-xs font-mono opacity-60 mb-1">CORE REFERENCE</p>
        <h2 className="text-xl font-bold">Particle Type System</h2>
        <p className="text-sm opacity-70 mt-1">
          は　が　を　に　で　の — the skeleton of every sentence
        </p>
      </button>

      {/* Curriculum */}
      {modules.map(({ id: mod, label }) => {
        const lessons = CURRICULUM.filter((l) => l.module === mod);
        return (
          <div key={mod}>
            <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Module {mod} — {label}
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
    </div>
  );
}
