import type { CardProps } from './types';

export function Card({ children, className = '', onClick }: CardProps) {
  const interactive = !!onClick;
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white rounded-2xl border border-gray-100 shadow-sm p-5',
        interactive
          ? 'cursor-pointer active:scale-[0.98] active:shadow-none active:bg-gray-50 transition-all select-none'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
