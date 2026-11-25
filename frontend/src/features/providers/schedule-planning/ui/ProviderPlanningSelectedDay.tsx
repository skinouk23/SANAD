import { Ban, CalendarDays } from 'lucide-react';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { SectionCard } from '@/shared/ui/composites/section-card';
import type {
  AppointmentStatusLabels,
  CalendarAppointment,
  CalendarBlockedInterval,
} from '@/features/providers/schedule-planning/types';
import { formatMinutes } from '@/features/providers/schedule-planning/utils';
import { AppointmentCard } from './AppointmentCard';
import type { SelectedDayLabels } from './types';

interface ProviderPlanningSelectedDayProps {
  activeBookingActionId: string | null;
  activeBookingActionType: 'approve' | 'reject' | null;
  appointmentActionError: string | null;
  appointments: CalendarAppointment[];
  blockedSlots: CalendarBlockedInterval[];
  confirmLoading: boolean;
  declineLoading: boolean;
  labels: SelectedDayLabels;
  locale: string;
  onApproveAppointment: (id: string) => Promise<void>;
  onOpenDelivery: (id: string) => void;
  onRejectAppointment: (id: string) => Promise<void>;
  selectedDateTitle: string;
  statusLabels: AppointmentStatusLabels;
}

export function ProviderPlanningSelectedDay({
  activeBookingActionId,
  activeBookingActionType,
  appointmentActionError,
  appointments,
  blockedSlots,
  confirmLoading,
  declineLoading,
  labels,
  locale,
  onApproveAppointment,
  onOpenDelivery,
  onRejectAppointment,
  selectedDateTitle,
  statusLabels,
}: ProviderPlanningSelectedDayProps) {
  const getApproveLoading = (appointmentId: string) => {
    return (
      confirmLoading &&
      activeBookingActionId === appointmentId &&
      activeBookingActionType === 'approve'
    );
  };

  const getRejectLoading = (appointmentId: string) => {
    return (
      declineLoading &&
      activeBookingActionId === appointmentId &&
      activeBookingActionType === 'reject'
    );
  };

  return (
    <SectionCard
      className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
      title={<span className="text-slate-900 dark:text-white">{selectedDateTitle}</span>}
      actions={
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
            <CalendarDays className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            {appointments.length}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
            <Ban className="h-3.5 w-3.5 text-red-500 dark:text-rose-400" />
            {blockedSlots.length}
          </span>
        </div>
      }
      contentClassName="space-y-4"
    >
      {appointmentActionError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {appointmentActionError}
        </div>
      ) : null}

      {appointments.length === 0 && blockedSlots.length === 0 ? (
        <EmptyState title={labels.noCalendarEvents} />
      ) : null}

      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={`${appointment.id}-${appointment.startMinutes}`}
              appointment={appointment}
              approveLoading={getApproveLoading(appointment.sessionId)}
              locale={locale}
              onApprove={onApproveAppointment}
              onOpenDelivery={onOpenDelivery}
              onReject={onRejectAppointment}
              rejectLoading={getRejectLoading(appointment.sessionId)}
              statusLabels={statusLabels}
            />
          ))}
        </div>
      ) : null}

      {blockedSlots.length > 0 ? (
        <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Ban className="h-4 w-4 text-red-500 dark:text-rose-400" />
            {labels.blockedSlots}
          </div>

          <div className="space-y-2">
            {blockedSlots.map((blockedSlot) => (
              <div
                key={blockedSlot.id}
                className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 backdrop-blur-sm dark:border-red-500/20 dark:bg-slate-700/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {blockedSlot.reason}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatMinutes(blockedSlot.startMinutes, locale)} -{' '}
                      {formatMinutes(blockedSlot.endMinutes, locale)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}
