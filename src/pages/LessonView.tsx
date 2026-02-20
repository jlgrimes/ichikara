import { CURRICULUM } from '../data/curriculum';

interface LessonViewProps {
  lessonId: string;
  onBack: () => void;
}

export function LessonView({ lessonId, onBack }: LessonViewProps) {
  const lesson = CURRICULUM.find((l) => l.id === lessonId);
  if (!lesson) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-700 mb-8 flex items-center gap-1 transition-colors"
      >
        ← back
      </button>

      {/* Module badge */}
      <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
        Module {lesson.module}
      </p>

      {/* Title */}
      <h1 className="text-3xl font-black text-[var(--color-ink)] mb-1">{lesson.title}</h1>
      <p className="text-gray-500 mb-8">{lesson.subtitle}</p>

      {/* Structural concept */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
          Structural Concept
        </p>
        <p className="text-gray-800 leading-relaxed">{lesson.concept}</p>
      </div>

      {/* Key points */}
      <div>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
          Key Points
        </p>
        <ul className="space-y-3">
          {lesson.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-[var(--color-accent)] font-bold mt-0.5">→</span>
              <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
