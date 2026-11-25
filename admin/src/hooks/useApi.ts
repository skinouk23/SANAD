/**
 * API Hooks
 * Custom React hooks for data fetching with loading states and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// GENERIC FETCH HOOK
// ============================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
fetchFn: () => Promise<T>,
deps: any[] = [],
options: UseApiOptions = {})
{
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const mountedRef = useRef(true);
  const fetchFnRef = useRef(fetchFn);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Update refs on each render
  fetchFnRef.current = fetchFn;
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFnRef.current();
      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null });
        onSuccessRef.current?.(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, loading: false, error }));
        onErrorRef.current?.(error);
      }
      throw error;
    }
  }, []); // No dependencies - uses refs

  // Stringify deps for stable comparison
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      execute().catch(() => {});
    }
    return () => {
      mountedRef.current = false;
    };
  }, [execute, immediate, depsKey]);

  return {
    ...state,
    refetch: execute,
    setData: (data: T | null) => setState((prev) => ({ ...prev, data }))
  };
}

// ============================================
// PAGINATED FETCH HOOK
// ============================================

interface UsePaginatedApiState<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  loading: boolean;
  error: Error | null;
}

export function usePaginatedApi<T, F extends {page?: number;limit?: number;}>(
fetchFn: (filters: F) => Promise<{items: T[];pagination: any;}>,
initialFilters: F,
deps: any[] = [])
{
  const [filters, setFilters] = useState<F>(initialFilters);
  const [state, setState] = useState<UsePaginatedApiState<T>>({
    data: [],
    pagination: null,
    loading: true,
    error: null
  });

  const mountedRef = useRef(true);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const execute = useCallback(async (currentFilters: F) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFnRef.current(currentFilters);
      if (mountedRef.current) {
        setState({
          data: result.items,
          pagination: result.pagination,
          loading: false,
          error: null
        });
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, loading: false, error }));
      }
      throw error;
    }
  }, []);

  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    mountedRef.current = true;
    execute(filters).catch(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, [filters, execute, depsKey]);

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    if (state.pagination?.hasNext) {
      setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [state.pagination?.hasNext]);

  const prevPage = useCallback(() => {
    if (state.pagination?.hasPrev) {
      setFilters((prev) => ({
        ...prev,
        page: Math.max(1, (prev.page || 1) - 1)
      }));
    }
  }, [state.pagination?.hasPrev]);

  const updateFilters = useCallback((newFilters: Partial<F>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    return execute(filters);
  }, [execute, filters]);

  return {
    ...state,
    filters,
    setFilters: updateFilters,
    goToPage,
    nextPage,
    prevPage,
    refetch
  };
}

// ============================================
// MUTATION HOOK
// ============================================

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useMutation<T, P = void>(
mutationFn: (params: P) => Promise<T>,
options: {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
} = {})
{
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const mutationFnRef = useRef(mutationFn);
  const optionsRef = useRef(options);
  mutationFnRef.current = mutationFn;
  optionsRef.current = options;

  const execute = useCallback(async (params: P) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await mutationFnRef.current(params);
      setState({ data: result, loading: false, error: null });
      optionsRef.current.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setState({ data: null, loading: false, error });
      optionsRef.current.onError?.(error);
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate: execute,
    reset
  };
}

// ============================================
// POLLING HOOK
// ============================================

export function usePolling<T>(
fetchFn: () => Promise<T>,
interval: number,
enabled: boolean = true)
{
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const mountedRef = useRef(true);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  useEffect(() => {
    mountedRef.current = true;

    const execute = async () => {
      try {
        const result = await fetchFnRef.current();
        if (mountedRef.current) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (err) {
        const error =
        err instanceof Error ? err : new Error('An error occurred');
        if (mountedRef.current) {
          setState((prev) => ({ ...prev, loading: false, error }));
        }
      }
    };

    if (enabled) {
      execute();
      const intervalId = setInterval(execute, interval);
      return () => {
        mountedRef.current = false;
        clearInterval(intervalId);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [interval, enabled]);

  return state;
}

// ============================================
// DEBOUNCED SEARCH HOOK
// ============================================

export function useDebouncedSearch<T>(
searchFn: (query: string) => Promise<T[]>,
delay: number = 300)
{
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [state, setState] = useState<{
    data: T[];
    loading: boolean;
    error: Error | null;
  }>({
    data: [],
    loading: false,
    error: null
  });

  const searchFnRef = useRef(searchFn);
  searchFnRef.current = searchFn;

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  // Execute search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    searchFnRef.
    current(debouncedQuery).
    then((data) => setState({ data, loading: false, error: null })).
    catch((err) =>
    setState((prev) => ({
      ...prev,
      loading: false,
      error: err instanceof Error ? err : new Error('Search failed')
    }))
    );
  }, [debouncedQuery]);

  return {
    ...state,
    query,
    setQuery
  };
}