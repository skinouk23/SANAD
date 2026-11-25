import { useEffect, useState } from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { runtimeDiagnostics } from '@/shared/lib/monitoring';

function useRouteDiagnosticReference(): string | null {
  const routeError = useRouteError();
  const [referenceId, setReferenceId] = useState<string | null>(() =>
    runtimeDiagnostics.getLatestReferenceId('router.error'),
  );

  useEffect(() => {
    const event = isRouteErrorResponse(routeError)
      ? runtimeDiagnostics.captureRouterError(routeError.data ?? routeError.statusText, {
          scope: 'app',
          statusCode: routeError.status,
        })
      : runtimeDiagnostics.captureRouterError(routeError, { scope: 'app' });

    setReferenceId(event.id);
  }, [routeError]);

  return referenceId;
}

export function RouteErrorPage() {
  const referenceId = useRouteDiagnosticReference();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
      <div className="max-w-lg text-center">
        <h1 className="mb-4 text-2xl font-bold text-destructive">Erreur</h1>
        <p className="mb-4 text-muted-foreground">Une erreur s&apos;est produite.</p>
        {referenceId && <p className="text-xs text-muted-foreground">Reference: {referenceId}</p>}
        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
