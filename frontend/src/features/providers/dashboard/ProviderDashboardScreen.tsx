import { providerDashboardTodayBookingsOptions } from '@/features/bookings';
import { providerDashboardOptions } from '@/features/providers';
import { queryClient } from '@/shared/lib/query/client';
import {
  ProviderDashboardHeader,
  ProviderNotificationsPanel,
  ProviderDashboardQuickActionsSection,
  ProviderDashboardScheduleSection,
  ProviderDashboardStatsSection,
  ProviderDashboardSupportModal,
} from './ProviderDashboardSections';
import { useProviderDashboardScreen } from './useProviderDashboardScreen';
import type { LoaderFunctionArgs } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(providerDashboardTodayBookingsOptions());
  void queryClient.prefetchQuery(providerDashboardOptions());

  return null;
};
export function ProviderDashboardScreen() {
  const dashboard = useProviderDashboardScreen();

  return (
    <div className="min-h-screen">
      <ProviderDashboardHeader
        availabilityPending={dashboard.availabilityPending}
        currentProviderName={dashboard.currentProviderName}
        currentProviderSubtitle={dashboard.currentProviderSubtitle}
        dashboardLoading={dashboard.dashboardLoading}
        isAvailable={dashboard.isAvailable}
        notificationsLoading={dashboard.notificationsLoading}
        notificationsUnreadCount={dashboard.notificationsUnreadCount}
        onOpenNotificationsPanel={dashboard.onOpenNotificationsPanel}
        onToggleAvailability={dashboard.onToggleAvailability}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 pb-20">
        <ProviderDashboardStatsSection
          dashboardError={dashboard.dashboardError}
          dashboardLoading={dashboard.dashboardLoading}
          dashboardRefreshing={dashboard.dashboardRefreshing || dashboard.dashboardPlaceholderData}
          onRetry={() => void dashboard.refetchDashboard()}
          stats={dashboard.stats}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProviderDashboardScheduleSection
            appointmentsInitialLoadError={dashboard.appointmentsInitialLoadError}
            appointmentsLoading={dashboard.appointmentsLoading}
            appointmentsRefreshing={
              dashboard.appointmentsRefreshing || dashboard.appointmentsPlaceholderData
            }
            canMessagePatients={dashboard.canMessagePatients}
            onMessagePatient={dashboard.onMessagePatient}
            onRetry={() => void dashboard.refetchAppointments()}
            openingConversation={dashboard.openingConversation}
            todayAppointments={dashboard.todayAppointments}
          />

          <ProviderDashboardQuickActionsSection
            dashboardLoading={dashboard.dashboardLoading}
            dashboardRefreshing={
              dashboard.dashboardRefreshing || dashboard.dashboardPlaceholderData
            }
            onOpenSupportModal={dashboard.onOpenSupportModal}
            quickActions={dashboard.quickActions}
          />
        </div>
      </div>

      <ProviderDashboardSupportModal
        isOpen={dashboard.showSupportModal}
        onClose={dashboard.onCloseSupportModal}
      />
      <ProviderNotificationsPanel
        isOpen={dashboard.showNotificationsPanel}
        onClose={dashboard.onCloseNotificationsPanel}
      />
    </div>
  );
}
