import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | void>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prevState => ({
        ...prevState,
        loading: true,
        error: null,
      }));

      try {
        const data = await asyncFunction(...args);
        setState({
          data,
          loading: false,
          error: null,
        });
        return data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail ||
                           error.response?.data?.message ||
                           error.message ||
                           'An unexpected error occurred';

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        // Re-throw for component-level error handling
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Execute immediately if requested
  if (immediate) {
    execute();
  }

  return {
    ...state,
    execute,
    reset,
  };
}
