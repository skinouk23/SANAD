/**
 * App-level error fallback.
 *
 * Shown when an unhandled error crashes a React subtree.
 * Provides a human-readable message and a retry button.
 */

import { AlertTriangle, RotateCcw } from 'lucide-react';

import { runtimeDiagnostics } from '@/shared/lib/monitoring';

interface Props {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: Props) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const referenceId = runtimeDiagnostics.getLatestReferenceId('react.boundary.error');

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or refresh the page.
        </p>
        {referenceId && <p className="text-xs text-muted-foreground">Reference: {referenceId}</p>}
        {import.meta.env.DEV && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-destructive/15 bg-muted p-3 text-left text-xs text-destructive">
            {errorMessage}
          </pre>
        )}
      </div>

      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
