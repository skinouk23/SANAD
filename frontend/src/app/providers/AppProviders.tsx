import { lazy, Suspense } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from '@tanstack/react-query';

import { ErrorFallback } from '@/app/errors/ErrorFallback';
import { AppToaster } from '@/app/providers/AppToaster';
import { env } from '@/config/env';
import { AuthProvider } from '@/contexts/AuthContext';
import { runtimeDiagnostics } from '@/shared/lib/monitoring';
import { LanguageProvider } from '@/shared/lib/i18n/language-context';
import { queryClient } from '@/shared/lib/query/client';
import { ThemeProvider } from '@/shared/lib/theme/theme-context';
import { auditLogger } from '@/utils/audit-logger';
import type { I18nState } from '@/shared/lib/i18n/locale-loader';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

interface AppProvidersProps {
  children: ReactNode;
  initialI18nState: I18nState;
  initialLanguageCode: LanguageCode;
}

function logBoundaryError(error: unknown, info: ErrorInfo) {
  const diagnostic = runtimeDiagnostics.captureReactBoundaryError(error, info);

  auditLogger.log('ERROR', 'Application error caught by boundary', {
    severity: 'error',
    details: {
      diagnosticId: diagnostic.id,
      path: diagnostic.route?.path,
    },
  });
}

export function AppProviders({
  children,
  initialI18nState,
  initialLanguageCode,
}: AppProvidersProps) {
  const showQueryDevtools = import.meta.env.DEV && env.SHOW_QUERY_DEVTOOLS;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logBoundaryError}>
      <ThemeProvider>
        <LanguageProvider
          initialI18nState={initialI18nState}
          initialLanguageCode={initialLanguageCode}
        >
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <AppToaster />
              {showQueryDevtools && (
                <Suspense fallback={null}>
                  <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
              )}
            </QueryClientProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
