import type { Lesson } from '../types/language';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  completed?: boolean;
}

const MODULE_COLORS: Record<number, { dot: string; label: string }> = {
  // N5
  0:  { dot: 'bg-emerald-400', label: 'text-emerald-600' },
  1:  { dot: 'bg-teal-400',    label: 'text-teal-600' },
  2:  { dot: 'bg-green-400',   label: 'text-green-600' },
  3:  { dot: 'bg-lime-400',    label: 'text-lime-600' },
  // N4
  4:  { dot: 'bg-blue-400',    label: 'text-blue-600' },
  5:  { dot: 'bg-sky-400',     label: 'text-sky-600' },
  6:  { dot: 'bg-indigo-400',  label: 'text-indigo-600' },
  7:  { dot: 'bg-cyan-400',    label: 'text-cyan-600' },
  8:  { dot: 'bg-violet-400',  label: 'text-violet-600' },
  9:  { dot: 'bg-blue-300',    label: 'text-blue-500' },
  // N3
  10: { dot: 'bg-purple-400',  label: 'text-purple-600' },
  11: { dot: 'bg-fuchsia-400', label: 'text-fuchsia-600' },
  12: { dot: 'bg-pink-400',    label: 'text-pink-600' },
};

export function LessonCard({ lesson, onClick, completed = false }: LessonCardProps) {
  const colors = MODULE_COLORS[lesson.module] ?? { dot: 'bg-gray-400', label: 'text-gray-500' };

  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left',
        completed
          ? 'bg-emerald-50/70 backdrop-blur-sm border-emerald-100/80'
          : 'bg-white/80 backdrop-blur-sm border-white/60',
        'rounded-3xl border',
        'shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        'p-5',
        'active:scale-[0.97] active:shadow-none',
        completed ? 'active:bg-emerald-50/50' : 'active:bg-white/60',
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
          </div>

          <h3 className="font-bold text-[var(--color-ink)] text-[17px] leading-snug">
            {lesson.title}
          </h3>
          <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">{lesson.subtitle}</p>
        </div>

        {/* Completion badge OR chevron */}
        {completed ? (
          <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold leading-none">
            ✓
          </span>
        ) : (
          <span className="text-gray-300 text-xl shrink-0 leading-none">›</span>
        )}
      </div>
    </button>
  );
}
