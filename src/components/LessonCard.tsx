import type { Lesson } from '../data/curriculum';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  completed?: boolean;
}

const MODULE_COLORS: Record<number, { dot: string; label: string }> = {
  0: { dot: 'bg-emerald-400', label: 'text-emerald-600' },
  1: { dot: 'bg-blue-400',    label: 'text-blue-600' },
  2: { dot: 'bg-purple-400',  label: 'text-purple-600' },
  3: { dot: 'bg-orange-400',  label: 'text-orange-600' },
  4: { dot: 'bg-pink-400',    label: 'text-pink-600' },
  5: { dot: 'bg-cyan-400',    label: 'text-cyan-600' },
};

export function LessonCard({ lesson, onClick, completed = false }: LessonCardProps) {
  const colors = MODULE_COLORS[lesson.module] ?? { dot: 'bg-gray-400', label: 'text-gray-500' };

  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left',
        'bg-white/80 backdrop-blur-sm',
        'rounded-3xl border border-white/60',
        'shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        'p-5',
        'active:scale-[0.97] active:shadow-none active:bg-white/60',
        'transition-all duration-150 ease-out',
        'select-none',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Module dot + label */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
            <span className={`text-[11px] font-mono uppercase tracking-widest ${colors.label}`}>
              Module {lesson.module}
            </span>
            {completed && (
              <span className="text-[11px] text-emerald-500 font-medium">✓</span>
            )}
          </div>

          <h3 className="font-bold text-[var(--color-ink)] text-[17px] leading-snug">
            {lesson.title}
          </h3>
          <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">{lesson.subtitle}</p>
        </div>

        {/* Chevron */}
        <span className="text-gray-300 text-xl shrink-0 leading-none">›</span>
      </div>
    </button>
  );
}
