import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  CalendarCheck,
  DollarSign,
  FileText,
  Megaphone,
  Shield,
  Star,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useProviderDashboardTodayBookings } from '@/features/bookings';
import { useGetOrCreateConversation } from '@/features/messaging';
import { useProviderDashboard, useToggleAvailability } from '@/features/providers';
import { showErrorToast } from '@/shared/lib/notifications/toast';
import { useNotificationsUnreadCount } from '@/shared/lib/notifications/unread-count';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import type { LucideIcon } from 'lucide-react';

export interface ProviderDashboardStat {
  gradient?: string;
  icon: LucideIcon;
  label: string;
  subtitle: string;
  unit: string;
  value: string;
}

export interface ProviderDashboardQuickAction {
  description: string;
  descriptionLoading?: boolean;
  gradient?: string;
  icon: LucideIcon;
  link: string;
  title: string;
}

export interface ProviderDashboardScreenViewModel {
  appointmentsInitialLoadError: unknown;
  appointmentsLoading: boolean;
  appointmentsPlaceholderData: boolean;
  appointmentsRefreshing: boolean;
  availabilityPending: boolean;
  canMessagePatients: boolean;
  currentProviderName: string;
  currentProviderSubtitle: string;
  dashboardError: unknown;
  dashboardLoading: boolean;
  dashboardPlaceholderData: boolean;
  dashboardRefreshing: boolean;
  isAvailable: boolean;
  notificationsLoading: boolean;
  notificationsUnreadCount: number;
  openingConversation: boolean;
  quickActions: ProviderDashboardQuickAction[];
  refetchAppointments: () => Promise<unknown>;
  refetchDashboard: () => Promise<unknown>;
  showNotificationsPanel: boolean;
  showSupportModal: boolean;
  stats: ProviderDashboardStat[];
  todayAppointments: BookingListItemResponse[];
  onCloseNotificationsPanel: () => void;
  onCloseSupportModal: () => void;
  onMessagePatient: (patientId: string | null | undefined) => Promise<void>;
  onOpenNotificationsPanel: () => void;
  onOpenSupportModal: () => void;
  onToggleAvailability: () => Promise<void>;
}

export function useProviderDashboardScreen(): ProviderDashboardScreenViewModel {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { mutateAsync: getOrCreateConversation, loading: openingConversation } =
    useGetOrCreateConversation();
  const { mutateAsync: toggleAvailability, loading: availabilityPending } = useToggleAvailability();
  const {
    data: dashboard,
    loading: dashboardLoading,
    isRefreshing: dashboardRefreshing,
    isPlaceholderData: dashboardPlaceholderData,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useProviderDashboard();
  const {
    data: todayAppointments = [],
    loading: appointmentsLoading,
    isRefreshing: appointmentsRefreshing,
    isPlaceholderData: appointmentsPlaceholderData,
    initialLoadError: appointmentsInitialLoadError,
    refetch: refetchAppointments,
  } = useProviderDashboardTodayBookings();
  const { data: unreadCountResponse, loading: notificationsLoading } = useNotificationsUnreadCount({
    enabled: user?.role === 'provider',
  });

  const currentProvider = dashboard?.provider ?? null;
  const appointmentStats = dashboard?.appointmentStats ?? null;
  const revenueStats = dashboard?.revenueStats ?? null;
  const canMessagePatients = user?.role === 'provider';
  const isAvailable = currentProvider?.available ?? false;

  const onMessagePatient = useCallback(
    async (patientId: string | null | undefined) => {
      if (!patientId) {
        return;
      }

      try {
        const conversation = await getOrCreateConversation({ patientId });
        navigate(`/messages/${conversation.id}`);
      } catch (entryError) {
        showErrorToast(entryError, t.messages.messageEntryFailed);
      }
    },
    [getOrCreateConversation, navigate, t.messages.messageEntryFailed],
  );

  const onToggleAvailability = useCallback(async () => {
    if (!currentProvider || availabilityPending) {
      return;
    }

    try {
      await toggleAvailability({ available: !currentProvider.available });
    } catch (toggleError) {
      showErrorToast(toggleError, t.common.error);
    }
  }, [availabilityPending, currentProvider, t.common.error, toggleAvailability]);

  const stats = useMemo<ProviderDashboardStat[]>(
    () => [
      {
        icon: DollarSign,
        label: t.provider.revenue,
        value: revenueStats?.thisWeekRevenue?.toString() || '0',
        unit: 'TND',
        subtitle: t.provider.thisWeek,
        gradient: 'from-green-500 to-emerald-500',
      },
      {
        icon: Calendar,
        label: t.provider.appointments,
        value: appointmentStats?.weekCount?.toString() || '0',
        unit: '',
        subtitle: t.provider.thisWeek,
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        icon: Star,
        label: t.provider.rating,
        value: currentProvider?.rating?.toFixed(1) || '0.0',
        unit: '/5',
        subtitle: `${currentProvider?.reviewCount || 0} ${t.provider.reviews}`,
        gradient: 'from-amber-500 to-orange-500',
      },
      {
        icon: TrendingUp,
        label: t.provider.growth,
        value: appointmentStats?.completionRate?.toString() || '0',
        unit: '%',
        subtitle: t.provider.successRate,
        gradient: 'from-purple-500 to-pink-500',
      },
    ],
    [appointmentStats, currentProvider, revenueStats, t],
  );

  const quickActions = useMemo<ProviderDashboardQuickAction[]>(
    () => [
      {
        title: t.provider.planning,
        description: t.provider.manageAppointments,
        gradient: 'from-blue-500 to-cyan-500',
        icon: CalendarCheck,
        link: '/provider/schedule',
      },
      {
        title: t.provider.balanceTitle,
        description: `${currentProvider?.availableBalance || 0} TND ${t.common.available.toLowerCase()}`,
        descriptionLoading: dashboardLoading,
        gradient: 'from-cyan-500 to-blue-600',
        icon: Wallet,
        link: '/provider/balance',
      },
      {
        title: t.provider.statistics,
        description: `${revenueStats?.thisMonthRevenue || 0} TND ${t.provider.thisMonth}`,
        descriptionLoading: dashboardLoading,
        gradient: 'from-green-500 to-emerald-500',
        icon: BarChart3,
        link: '/provider/analytics',
      },
      {
        title: t.provider.marketing,
        description: `2 ${t.provider.activeCampaigns}`,
        gradient: 'from-amber-500 to-orange-500',
        icon: Megaphone,
        link: '/provider/marketing',
      },
      {
        title: t.provider.insurance,
        description: `${t.provider.coverage} 500K TND`,
        gradient: 'from-purple-500 to-pink-500',
        icon: Shield,
        link: '/provider/insurance',
      },
      {
        title: t.provider.billing,
        description: `${revenueStats?.thisMonthRevenue || 0} TND ${t.provider.thisMonth}`,
        descriptionLoading: dashboardLoading,
        gradient: 'from-teal-500 to-cyan-500',
        icon: FileText,
        link: '/provider/billing',
      },
    ],
    [currentProvider, dashboardLoading, revenueStats, t],
  );

  return {
    appointmentsInitialLoadError,
    appointmentsLoading,
    appointmentsPlaceholderData,
    appointmentsRefreshing,
    availabilityPending,
    canMessagePatients,
    currentProviderName: currentProvider?.name || t.auth.professional,
    currentProviderSubtitle: `${currentProvider?.specialties?.[0] || currentProvider?.providerType || t.auth.professional} • Sanad Pro`,
    dashboardError,
    dashboardLoading,
    dashboardPlaceholderData,
    dashboardRefreshing,
    isAvailable,
    notificationsLoading,
    notificationsUnreadCount: unreadCountResponse?.count ?? 0,
    openingConversation,
    quickActions,
    refetchAppointments,
    refetchDashboard,
    showNotificationsPanel,
    showSupportModal,
    stats,
    todayAppointments,
    onCloseNotificationsPanel: () => setShowNotificationsPanel(false),
    onCloseSupportModal: () => setShowSupportModal(false),
    onMessagePatient,
    onOpenNotificationsPanel: () => setShowNotificationsPanel(true),
    onOpenSupportModal: () => setShowSupportModal(true),
    onToggleAvailability,
  };
}
