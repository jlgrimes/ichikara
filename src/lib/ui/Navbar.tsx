import type { NavbarProps } from './types';
import { useNavigation, usePageDepth } from './NavigationStack';

export function Navbar({ title, left, right }: NavbarProps) {
  const { pop } = useNavigation();

  // Depth is set per-page by NavigationStack — not reactive to state changes.
  // Home is always depth 0, lesson pages are depth > 0.
  // This means the back button never flickers onto the home Navbar during transitions.
  const depth = usePageDepth();
  const showBack = depth > 0;

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
        <div className="w-24 flex items-center">
          {left !== undefined ? left : showBack ? backButton : null}
        </div>
        <div className="flex-1 text-center">
          <span className="text-[15px] font-semibold text-[var(--color-ink)] truncate">
            {title}
          </span>
        </div>
        <div className="w-24 flex items-center justify-end">
          {right}
        </div>
      </div>
      <div className="h-px bg-black/[0.06]" />
    </header>
  );
}
