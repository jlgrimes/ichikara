import type { NavbarProps } from './types';
import { useNavigation } from './NavigationStack';

/**
 * iOS-style top bar. Auto-shows a back button when the nav stack has
 * a previous page. Override `left` to customize or suppress it.
 */
export function Navbar({ title, left, right }: NavbarProps) {
  const { canGoBack, pop } = useNavigation();

  const backButton = (
    <button
      onClick={pop}
      className="flex items-center gap-0.5 text-[var(--color-accent)] font-medium text-[15px] min-h-[44px] min-w-[44px] active:opacity-50 transition-opacity"
    >
      <span className="text-xl leading-none">‹</span>
      <span>Back</span>
    </button>
  );

  return (
    <header className="shrink-0 h-11 bg-[var(--color-paper)]/90 backdrop-blur-md border-b border-gray-100 flex items-center px-2 gap-1">
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
    </header>
  );
}
