import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auditLogger } from '@/utils/audit-logger';
import { AppStartupLoader } from '@/app/shell/AppShell';

export function ProviderRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  if (isLoading) {
    return <AppStartupLoader subtitle="Validation de votre session professionnelle." />;
  }

  // Redirect to login if not authenticated (preserve intended destination)
  if (!isAuthenticated) {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unauthenticated access attempt to provider route',
      {
        severity: 'warning',
        resource: 'provider_route',
      },
    );
    return <Navigate to="/auth/login" state={{ returnTo }} replace />;
  }

  // Redirect to patient dashboard if user is a patient
  if (user?.role === 'patient') {
    auditLogger.log('SECURITY_SUSPICIOUS_ACTIVITY', 'Patient attempted to access provider route', {
      severity: 'warning',
      resource: 'provider_route',
      details: {
        userRole: user.role,
      },
    });
    return <Navigate to="/patient-dashboard" replace />;
  }

  if (user?.role !== 'provider') {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unexpected user attempted to access provider route',
      {
        severity: 'warning',
        resource: 'provider_route',
        details: {
          userRole: user?.role,
        },
      },
    );

    return <Navigate to="/auth/login" replace />;
  }

  // Allow access for providers only
  return <Outlet />;
}
