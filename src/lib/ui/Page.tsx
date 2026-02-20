import type { PageProps } from './types';

/** Full-height page shell. Pair with <PageContent> for the scrollable area. */
export function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`h-full flex flex-col bg-[var(--color-paper)] ${className}`}>
      {children}
    </div>
  );
}

/** The scrollable body of a page. Fills remaining height after Navbar. */
export function PageContent({ children, className = '' }: PageProps) {
  return (
    <div className={`flex-1 overflow-y-auto overscroll-none ${className}`}>
      {children}
    </div>
  );
}
