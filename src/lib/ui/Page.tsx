import type { PageProps } from './types';

/** Full-height page shell. Pair with <PageContent> for the scrollable area. */
export function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`h-full flex flex-col bg-[var(--color-paper)] ${className}`}>
      {children}
    </div>
  );
}

/** Scrollable body of a page. Fills remaining height, respects home indicator. */
export function PageContent({ children, className = '' }: PageProps) {
  return (
    <div
      className={`flex-1 overflow-y-auto overscroll-none ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {children}
    </div>
  );
}
