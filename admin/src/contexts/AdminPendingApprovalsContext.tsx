import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getPendingProviderApprovalsSummary } from '../services/adminPendingApprovals.service';

interface AdminPendingApprovalsContextValue {
  pendingApprovalsCount: number;
  isPendingApprovalsCountLoading: boolean;
  refreshPendingApprovalsCount: () => Promise<void>;
}

const AdminPendingApprovalsContext = createContext<AdminPendingApprovalsContextValue | undefined>(undefined);

interface AdminPendingApprovalsProviderProps {
  children: React.ReactNode;
}

export function AdminPendingApprovalsProvider({
  children
}: AdminPendingApprovalsProviderProps) {
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [isPendingApprovalsCountLoading, setIsPendingApprovalsCountLoading] = useState(true);

  const refreshPendingApprovalsCount = useCallback(async () => {
    setIsPendingApprovalsCountLoading(true);

    try {
      const response = await getPendingProviderApprovalsSummary();
      setPendingApprovalsCount(response.pendingCount);
    } catch {
      setPendingApprovalsCount(0);
    } finally {
      setIsPendingApprovalsCountLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPendingApprovalsCount();
  }, [refreshPendingApprovalsCount]);

  const value = useMemo(
    () => ({
      pendingApprovalsCount,
      isPendingApprovalsCountLoading,
      refreshPendingApprovalsCount
    }),
    [pendingApprovalsCount, isPendingApprovalsCountLoading, refreshPendingApprovalsCount]
  );

  return (
    <AdminPendingApprovalsContext.Provider value={value}>
      {children}
    </AdminPendingApprovalsContext.Provider>
  );
}

export function useAdminPendingApprovals(): AdminPendingApprovalsContextValue {
  const context = useContext(AdminPendingApprovalsContext);
  if (!context) {
    throw new Error('useAdminPendingApprovals must be used within AdminPendingApprovalsProvider.');
  }

  return context;
}
