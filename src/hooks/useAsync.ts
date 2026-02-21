/**
 * useAsync — managed async operation state.
 *
 * Provides clean { data, loading, error } states for any async fn.
 * Re-runs whenever deps change. Cancels stale responses on re-run.
 *
 * Usage:
 *   const { data, loading, error, reload } = useAsync(
 *     () => supabase.from('...').select(),
 *     [userId],
 *   );
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data:    T | null;
  loading: boolean;
  error:   Error | null;
  status:  AsyncStatus;
  reload:  () => void;
}

/**
 * @param fn   Async function that returns T
 * @param deps Dependency array — re-runs when any dep changes
 * @param opts.immediate  Whether to run immediately (default true)
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList,
  opts: { immediate?: boolean } = {},
): AsyncState<T> {
  const { immediate = true } = opts;

  const [state, setState] = useState<{
    data: T | null;
    status: AsyncStatus;
    error: Error | null;
  }>({ data: null, status: immediate ? 'loading' : 'idle', error: null });

  const cancelRef = useRef(false);
  const reloadRef = useRef(0); // increment to trigger manual reload

  const run = useCallback(async () => {
    cancelRef.current = false;
    setState(s => ({ ...s, status: 'loading', error: null }));
    try {
      const result = await fn();
      if (!cancelRef.current) {
        setState({ data: result, status: 'success', error: null });
      }
    } catch (err) {
      if (!cancelRef.current) {
        setState(s => ({
          ...s,
          status: 'error',
          error: err instanceof Error ? err : new Error(String(err)),
        }));
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!immediate && reloadRef.current === 0) return;
    run();
    return () => { cancelRef.current = true; };
  }, [run, reloadRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const reload = useCallback(() => {
    reloadRef.current += 1;
    run();
  }, [run]);

  return {
    data:    state.data,
    loading: state.status === 'loading',
    error:   state.error,
    status:  state.status,
    reload,
  };
}
