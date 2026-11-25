import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auditLogger } from '@/utils/audit-logger';
import { AppStartupLoader } from '@/app/shell/AppShell';

export function PatientRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  if (isLoading) {
    return <AppStartupLoader subtitle="Validation de votre session securisee." />;
  }

  // Redirect to login if not authenticated (preserve intended destination)
  if (!isAuthenticated) {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unauthenticated access attempt to patient route',
      {
        severity: 'warning',
        resource: 'patient_route',
      },
    );
    return <Navigate to="/auth/login" state={{ returnTo }} replace />;
  }

  // Redirect providers to their dashboard (providers shouldn't access patient pages)
  if (user?.role === 'provider') {
    auditLogger.log('SECURITY_SUSPICIOUS_ACTIVITY', 'Provider attempted to access patient route', {
      severity: 'warning',
      resource: 'patient_route',
      details: {
        userRole: user.role,
      },
    });
    return <Navigate to="/provider-dashboard" replace />;
  }

  if (user?.role !== 'patient') {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unexpected user attempted to access patient route',
      {
        severity: 'warning',
        resource: 'patient_route',
        details: {
          userRole: user?.role,
        },
      },
    );

    return <Navigate to="/auth/login" replace />;
  }

  // Allow access for patients only
  return <Outlet />;
}
