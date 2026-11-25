import React, { useEffect, Component } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation } from
'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { auditLogger } from './utils/audit-logger';
// Admin imports
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfessionalManagement } from './pages/admin/ProfessionalManagement';
import { PatientManagement } from './pages/admin/PatientManagement';
import { PatientReservations } from './pages/admin/PatientReservations';
import { ProviderHistory } from './pages/admin/ProviderHistory';
import { PendingRegistrations } from './pages/admin/PendingRegistrations';
import { FinanceDashboard } from './pages/admin/FinanceDashboard';
import { ProviderWallets } from './pages/admin/ProviderWallets';
import { AdminSettings } from './pages/admin/AdminSettings';
import { CancellationManagement } from './pages/admin/CancellationManagement';
import { AuditLogs } from './pages/admin/AuditLogs';
import { Reports } from './pages/admin/Reports';
import { TransactionList } from './pages/admin/TransactionList';
// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends Component<
  {
    children: ReactNode;
  },
  ErrorBoundaryState>
{
  constructor(props: {children: ReactNode;}) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    auditLogger.log('ERROR', 'Application error caught by boundary', {
      severity: 'error',
      details: {
        message: error.message,
        componentStack: errorInfo.componentStack?.slice(0, 200)
      }
    });
    console.error('Error caught by boundary:', error.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8">
          <div className="max-w-lg text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-500">
              Something went wrong
            </h1>
            <p className="text-slate-400 mb-4">
              An unexpected error occurred. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-teal-600 rounded hover:bg-teal-700">
              
              Reload Page
            </button>
          </div>
        </div>);

    }
    return this.props.children;
  }
}
function ScrollToTopWrapper() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    auditLogger.log('NAVIGATION', `Navigated to ${pathname}`, {
      severity: 'info',
      details: {
        path: pathname
      }
    });
  }, [pathname]);
  return null;
}
export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <ScrollToTopWrapper />
              <Routes>
                {/* Login */}
                <Route path="/login" element={<AdminLogin />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                  <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/professionals"
                  element={
                  <AdminLayout>
                      <ProfessionalManagement />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/professionals/:providerId/history"
                  element={
                  <AdminLayout>
                      <ProviderHistory />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/patients"
                  element={
                  <AdminLayout>
                      <PatientManagement />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/patients/:patientId/reservations"
                  element={
                  <AdminLayout>
                      <PatientReservations />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/pending"
                  element={
                  <AdminLayout>
                      <PendingRegistrations />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/finance"
                  element={
                  <AdminLayout>
                      <FinanceDashboard />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/wallets"
                  element={
                  <AdminLayout>
                      <ProviderWallets />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/settings"
                  element={
                  <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/cancellations"
                  element={
                  <AdminLayout>
                      <CancellationManagement />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/audit"
                  element={
                  <AdminLayout>
                      <AuditLogs />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/reports"
                  element={
                  <AdminLayout>
                      <Reports />
                    </AdminLayout>
                  } />
                
                <Route
                  path="/admin/transactions"
                  element={
                  <AdminLayout>
                      <TransactionList />
                    </AdminLayout>
                  } />
                

                {/* Redirect root and any unknown routes to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>);

}