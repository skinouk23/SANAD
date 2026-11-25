import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { isSchemaValidationError, runtimeDiagnostics } from '@/shared/lib/monitoring';

function getQueryDomain(key: readonly unknown[] | undefined): string | undefined {
  if (!key || key.length === 0) {
    return undefined;
  }

  return typeof key[0] === 'string' ? key[0] : undefined;
}

function captureSchemaError(
  error: unknown,
  source: 'query' | 'mutation',
  key: readonly unknown[] | undefined,
): void {
  if (!isSchemaValidationError(error)) {
    return;
  }

  runtimeDiagnostics.captureSchemaParseFailure(error, {
    context: `react-query ${source}`,
    source: `react-query.${source}`,
    details: {
      domain: getQueryDomain(key),
      keySize: key?.length ?? 0,
    },
  });
}

/**
 * Singleton QueryClient shared across the app.
 *
 * - staleTime 5 min — avoids redundant refetches on remount
 * - gcTime 10 min — keeps inactive data around for back-navigation
 * - retry false — Axios interceptors already handle retry with backoff;
 *   doubling up causes cascading 401 loops (see D002 research)
 * - refetchOnWindowFocus false — healthcare data doesn't change by the
 *   second; explicit invalidation is more predictable
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      captureSchemaError(error, 'query', query.queryKey);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      captureSchemaError(error, 'mutation', mutation.options.mutationKey);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
