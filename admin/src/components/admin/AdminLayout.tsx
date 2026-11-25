import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAuth } from '../../contexts/AuthContext';
import {
  AdminPendingApprovalsProvider,
  useAdminPendingApprovals
} from '../../contexts/AdminPendingApprovalsContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !isAdmin) {
      navigate('/login', {
        state: {
          from: location
        },
        replace: true
      });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <AdminPendingApprovalsProvider>
      <AdminLayoutShell
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      >
        {children}
      </AdminLayoutShell>
    </AdminPendingApprovalsProvider>
  );
}

interface AdminLayoutShellProps {
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AdminLayoutShell({
  collapsed,
  onToggle,
  children
}: AdminLayoutShellProps) {
  const { pendingApprovalsCount } = useAdminPendingApprovals();

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={onToggle}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
