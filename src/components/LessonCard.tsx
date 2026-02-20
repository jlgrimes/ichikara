import type { Lesson } from '../data/curriculum';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  completed?: boolean;
}

const MODULE_COLORS: Record<number, string> = {
  0: 'bg-emerald-100 text-emerald-700',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-purple-100 text-purple-700',
  3: 'bg-orange-100 text-orange-700',
};

export function LessonCard({ lesson, onClick, completed = false }: LessonCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${MODULE_COLORS[lesson.module] ?? 'bg-gray-100 text-gray-600'}`}>
              Module {lesson.module}
            </span>
            {completed && (
              <span className="text-xs text-emerald-600 font-medium">✓ done</span>
            )}
          </div>
          <h3 className="font-bold text-[var(--color-ink)] text-lg">{lesson.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{lesson.subtitle}</p>
        </div>
        <span className="text-gray-300 text-xl mt-1">→</span>
      </div>
    </button>
  );
}
