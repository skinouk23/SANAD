import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { auditLogger } from '@/utils/audit-logger';
import { AppStartupLoader } from '@/app/shell/AppShell';

export function PatientProviderRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (isLoading) {
    return <AppStartupLoader subtitle={t.common.loading} />;
  }

  if (!isAuthenticated) {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unauthenticated access attempt to shared patient/provider route',
      {
        severity: 'warning',
        resource: 'patient_provider_route',
      },
    );

    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/auth/login" state={{ returnTo }} replace />;
  }

  if (user?.role !== 'patient' && user?.role !== 'provider') {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unexpected authenticated user attempted to access shared patient/provider route',
      {
        severity: 'warning',
        resource: 'patient_provider_route',
        details: {
          userRole: user?.role,
        },
      },
    );

    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
