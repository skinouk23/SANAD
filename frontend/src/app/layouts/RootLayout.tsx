import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigationType } from 'react-router-dom';
import { ConsentBanner } from '@/app/shell/ConsentBanner';
import { runtimeDiagnostics } from '@/shared/lib/monitoring';
import { auditLogger } from '@/utils/audit-logger';

// ============================================
// SCROLL RESTORATION
// Scrolls to top on forward pathname changes without hashes and logs navigation events.
// Lives in RootLayout so it fires once for every navigation,
// regardless of which route layout is active.
// ============================================
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const pathnameChanged = previousPathname !== pathname;
    const safeRoute = runtimeDiagnostics.setRouteContext({ pathname, search, hash });

    auditLogger.log('NAVIGATION', 'Navigated to route', {
      severity: 'info',
      details: {
        path: safeRoute?.path ?? pathname,
        ...(safeRoute?.queryKeys.length ? { queryKeys: safeRoute.queryKeys } : {}),
        hasHash: hash.length > 0,
      },
    });

    if (navigationType !== 'POP' && pathnameChanged && hash.length === 0) {
      window.scrollTo(0, 0);
    }

    previousPathnameRef.current = pathname;
  }, [hash, navigationType, pathname, search]);

  return null;
}

// ============================================
// ROOT LAYOUT
// Top-level layout route rendered by the data router.
// Contains cross-cutting concerns that apply to ALL routes.
// ============================================
export function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <ScrollRestoration />
      <ConsentBanner />
      <Outlet />
    </>
  );
}
