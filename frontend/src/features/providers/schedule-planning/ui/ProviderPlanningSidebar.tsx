import { Ban, CalendarClock, Clock3, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { SectionCard } from '@/shared/ui/composites/section-card';
import { Button } from '@/shared/ui/primitives/button';
import { Spinner } from '@/shared/ui/primitives/spinner';
import type {
  AppointmentStatusLabels,
  CalendarAppointment,
} from '@/features/providers/schedule-planning/types';
import {
  getAppointmentStatusConfig,
  toIsoDate,
} from '@/features/providers/schedule-planning/utils';
import type { SidebarLabels } from './types';

interface ProviderPlanningSidebarProps {
  activeBlockedSlotId: string | null;
  blockedList: Array<{
    endDatetime: string;
    id: string;
    reason?: string | null;
    startDatetime: string;
  }>;
  blockMutationError: string | null;
  deletingUnavailability: boolean;
  labels: SidebarLabels;
  locale: string;
  onOpenAvailabilityModal: () => void;
  onOpenBlockModal: () => void;
  onRemoveBlockedSlot: (id: string) => Promise<void>;
  statusLabels: AppointmentStatusLabels;
  upcomingAppointments: CalendarAppointment[];
}

export function ProviderPlanningSidebar({
  activeBlockedSlotId,
  blockedList,
  blockMutationError,
  deletingUnavailability,
  labels,
  locale,
  onOpenAvailabilityModal,
  onOpenBlockModal,
  onRemoveBlockedSlot,
  statusLabels,
  upcomingAppointments,
}: ProviderPlanningSidebarProps) {
  return (
    <div className="space-y-4">
      {blockMutationError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {blockMutationError}
        </div>
      ) : null}

      <SectionCard
        title={<span className="text-slate-900 dark:text-white">{labels.quickActions}</span>}
        className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        contentClassName="space-y-2"
      >
        <Button
          variant="outline"
          className="flex w-full items-center justify-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:bg-slate-700"
          onClick={onOpenBlockModal}
        >
          <Ban className="h-3.5 w-3.5 text-red-500" />
          {labels.blockSlot}
        </Button>

        <Button
          variant="outline"
          className="flex w-full items-center justify-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:bg-slate-700"
          onClick={onOpenAvailabilityModal}
        >
          <CalendarClock className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
          {labels.setAvailability}
        </Button>
      </SectionCard>

      <SectionCard
        title={<span className="text-slate-900 dark:text-white">{labels.blockedSlots}</span>}
        className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        contentClassName="space-y-3"
      >
        {blockedList.length > 0 ? (
          blockedList.map((blockedSlot) => {
            const start = new Date(blockedSlot.startDatetime);
            const end = new Date(blockedSlot.endDatetime);
            const isDeleting = deletingUnavailability && activeBlockedSlotId === blockedSlot.id;

            return (
              <div
                key={blockedSlot.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-700/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {blockedSlot.reason?.trim() || labels.slotBlocked}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {start.toLocaleDateString(locale)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void onRemoveBlockedSlot(blockedSlot.id)}
                    disabled={isDeleting}
                    aria-busy={isDeleting || undefined}
                    aria-label={`${labels.delete}: ${blockedSlot.reason?.trim() || labels.slotBlocked}`}
                    className="size-8 rounded-full text-red-500 hover:bg-red-500/10 dark:text-rose-400"
                  >
                    {isDeleting ? <Spinner data-icon="inline-start" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState title={labels.noBlockedSlots} />
        )}
      </SectionCard>

      <SectionCard
        title={
          <span className="text-slate-900 dark:text-white">{labels.upcomingAppointments}</span>
        }
        className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        contentClassName="space-y-3"
      >
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => {
            const config = getAppointmentStatusConfig(appointment.status, statusLabels);

            return (
              <div
                key={`${appointment.id}-${toIsoDate(appointment.date)}`}
                className={cn(
                  'rounded-xl border p-3 shadow-sm backdrop-blur-sm',
                  config.colorClassName,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {appointment.patientName}
                    </div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {appointment.service}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Clock3 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{appointment.timeLabel}</span>
                      <span aria-hidden="true">•</span>
                      <span>
                        {appointment.date.toLocaleDateString(locale, {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <span className={cn('shrink-0 text-[11px] font-medium', config.iconClassName)}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState title={labels.noUpcomingProviderAppointments} />
        )}
      </SectionCard>
    </div>
  );
}
