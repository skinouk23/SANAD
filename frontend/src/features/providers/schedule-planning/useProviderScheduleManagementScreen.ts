import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useProviderSchedulePlanning } from './useProviderSchedulePlanning';
import type { AppointmentStatusLabels } from './types';

export function useProviderScheduleManagementScreen() {
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.code === 'ar-TN' ? 'ar-TN' : currentLanguage.code;

  const dayLabels = useMemo(
    () => ({
      0: t.provider.sunday,
      1: t.provider.monday,
      2: t.provider.tuesday,
      3: t.provider.wednesday,
      4: t.provider.thursday,
      5: t.provider.friday,
      6: t.provider.saturday,
    }),
    [t.provider],
  );

  const statusLabels = useMemo<AppointmentStatusLabels>(
    () => ({
      approve: t.provider.approve,
      cancelled: t.provider.cancelled,
      completed: t.provider.completed,
      confirmed: t.provider.confirmed,
      disputed: t.provider.deliveryOpenDispute,
      noShow: t.provider.deliveryMarkNoShow,
      pending: t.provider.pending,
      reject: t.provider.reject,
      rejected: t.provider.rejected,
      startDelivery: t.provider.startDelivery,
    }),
    [t.provider],
  );

  const planning = useProviderSchedulePlanning({
    labels: {
      blocked: t.provider.blockedSlots,
      commonError: t.common.error,
      commonNoData: t.common.noData,
      confirmed: t.provider.confirmed,
      dayLabels,
      invalidTimeRange: t.provider.invalidTimeRange,
      pending: t.provider.pending,
      slotBlocked: t.provider.slotBlocked,
      teleconsultation: t.provider.teleconsultation,
      today: t.provider.today,
    },
    locale,
  });

  return {
    dayLabels,
    locale,
    planning,
    sidebarLabels: {
      addInterval: t.provider.addInterval,
      availabilityDayOff: t.provider.availabilityDayOff,
      blockReasonPlaceholder: t.provider.blockReasonPlaceholder,
      blockSlot: t.provider.blockSlot,
      blockThisSlot: t.provider.blockThisSlot,
      blockedSlots: t.provider.blockedSlots,
      date: t.provider.date,
      delete: t.common.delete,
      endTime: t.provider.endTime,
      legend: t.provider.legend,
      noBlockedSlots: t.provider.noBlockedSlots,
      noUpcomingProviderAppointments: t.provider.noUpcomingProviderAppointments,
      quickActions: t.provider.quickActions,
      reasonOptional: t.provider.reasonOptional,
      removeInterval: t.provider.removeInterval,
      saveAvailabilities: t.provider.saveAvailabilities,
      setAvailabilities: t.provider.setAvailabilities,
      setAvailability: t.provider.setAvailability,
      slotBlocked: t.provider.slotBlocked,
      startTime: t.provider.startTime,
      to: t.provider.to,
      upcomingAppointments: t.provider.upcomingAppointments,
    },
    statusLabels,
    selectedDayLabels: {
      blockedSlots: t.provider.blockedSlots,
      noCalendarEvents: t.provider.noCalendarEvents,
    },
    titleLabels: {
      description: t.provider.organizeAppointments,
      eyebrow: t.provider.planning,
      title: t.provider.scheduleManagement,
    },
    toolbarLabels: {
      day: t.provider.day,
      month: t.provider.month,
      next: t.common.next,
      previous: t.common.previous,
      today: t.provider.today,
      week: t.provider.week,
    },
    calendarLabels: {
      hours: t.provider.hours,
      loading: t.common.loading,
      loadingError: t.common.loadingError,
      noCalendarEvents: t.provider.noCalendarEvents,
      retry: t.common.retry,
    },
    dialogLabels: {
      addInterval: t.provider.addInterval,
      availabilityDayOff: t.provider.availabilityDayOff,
      blockReasonPlaceholder: t.provider.blockReasonPlaceholder,
      blockSlot: t.provider.blockSlot,
      blockThisSlot: t.provider.blockThisSlot,
      blockedSlots: t.provider.blockedSlots,
      cancel: t.common.cancel,
      date: t.provider.date,
      delete: t.common.delete,
      endTime: t.provider.endTime,
      legend: t.provider.legend,
      loading: t.common.loading,
      loadingError: t.common.loadingError,
      noBlockedSlots: t.provider.noBlockedSlots,
      noUpcomingProviderAppointments: t.provider.noUpcomingProviderAppointments,
      quickActions: t.provider.quickActions,
      reasonOptional: t.provider.reasonOptional,
      removeInterval: t.provider.removeInterval,
      retry: t.common.retry,
      saveAvailabilities: t.provider.saveAvailabilities,
      setAvailabilities: t.provider.setAvailabilities,
      setAvailability: t.provider.setAvailability,
      slotBlocked: t.provider.slotBlocked,
      startTime: t.provider.startTime,
      to: t.provider.to,
      upcomingAppointments: t.provider.upcomingAppointments,
      dayLabels,
      invalidTimeRange: t.provider.invalidTimeRange,
    },
    onOpenDelivery: (id: string) => navigate(`/provider/active-delivery/${id}`),
  };
}
