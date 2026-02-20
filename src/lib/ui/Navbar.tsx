import type { NavbarProps } from './types';
import { useNavigation } from './NavigationStack';

export function Navbar({ title, left, right }: NavbarProps) {
  const { canGoBack, pop } = useNavigation();

  const backButton = (
    <button
      onClick={pop}
      className="flex items-center gap-1 text-[var(--color-accent)] font-mono text-xs tracking-wider min-h-[44px] min-w-[44px] active:opacity-40 transition-opacity"
    >
      ← back
    </button>
  );

  return (
    <header
      className="shrink-0 bg-white/70 backdrop-blur-2xl flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="h-11 flex items-center px-3 gap-1">
        {/* Left slot */}
        <div className="w-24 flex items-center">
          {left !== undefined ? left : canGoBack ? backButton : null}
        </div>

        {/* Title — centered */}
        <div className="flex-1 text-center">
          <span className="text-[15px] font-semibold text-[var(--color-ink)] truncate">
            {title}
          </span>
        </div>

        {/* Right slot */}
        <div className="w-24 flex items-center justify-end">
          {right}
        </div>
      </div>

      {/* Thin separator — very subtle, iOS 26 style */}
      <div className="h-px bg-black/[0.06] mx-0" />
    </header>
  );
}
