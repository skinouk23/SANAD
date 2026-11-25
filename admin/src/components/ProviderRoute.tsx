import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auditLogger } from '../utils/audit-logger';
interface ProviderRouteProps {
  children: React.ReactNode;
}
export function ProviderRoute({ children }: ProviderRouteProps) {
  const { isAuthenticated, user } = useAuth();
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Unauthenticated access attempt to provider route',
      {
        severity: 'warning',
        resource: 'provider_route'
      }
    );
    return <Navigate to="/auth/login" replace />;
  }
  // Redirect to patient dashboard if user is a patient
  if (user?.role === 'patient') {
    auditLogger.log(
      'SECURITY_SUSPICIOUS_ACTIVITY',
      'Patient attempted to access provider route',
      {
        severity: 'warning',
        resource: 'provider_route',
        details: {
          userRole: user.role
        }
      }
    );
    return <Navigate to="/patient-dashboard" replace />;
  }
  // Allow access for providers and admins
  return <>{children}</>;
}