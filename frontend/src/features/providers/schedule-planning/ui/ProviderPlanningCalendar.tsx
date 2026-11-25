import { Ban, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { SectionCard } from '@/shared/ui/composites/section-card';
import { Skeleton } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';
import type {
  AppointmentStatusLabels,
  CalendarAppointment,
  CalendarBlockedInterval,
  ViewMode,
} from '@/features/providers/schedule-planning/types';
import {
  clampMinutes,
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  formatMinutes,
  getAppointmentStatusConfig,
  getDayLabel,
  isSameDay,
  ORDERED_DAYS,
  SLOT_HEIGHT,
  SLOT_MINUTES,
  TIME_COLUMN_WIDTH,
  toIsoDate,
} from '@/features/providers/schedule-planning/utils';
import { AppointmentCard } from './AppointmentCard';
import type { CalendarStateLabels } from './types';

function PlanningCalendarError({
  onRetry,
  retryLabel,
  title,
}: {
  onRetry: () => void;
  retryLabel: string;
  title: string;
}) {
  return (
    <div className="p-6">
      <EmptyState
        title={title}
        action={
          <Button
            variant="destructive"
            size="sm"
            onClick={onRetry}
            className="border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
          >
            {retryLabel}
          </Button>
        }
      />
    </div>
  );
}

function PlanningCalendarSkeleton({
  dayLabels,
  locale,
  monthDaysCount,
  timeSlots,
  viewMode,
  weekDays,
}: {
  dayLabels: Record<number, string>;
  locale: string;
  monthDaysCount: number;
  timeSlots: number[];
  viewMode: ViewMode;
  weekDays: Date[];
}) {
  if (viewMode === 'day') {
    return (
      <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700/50">
        <div className="min-w-[360px]">
          <div className="relative" style={{ height: `${timeSlots.length * SLOT_HEIGHT}px` }}>
            {timeSlots.map((slot, index) => (
              <div
                key={slot}
                className="absolute inset-x-0 flex border-b border-slate-200 transition-colors dark:border-slate-700/50"
                style={{ top: `${index * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
              >
                <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50/70 p-2 text-[10px] font-medium text-slate-500 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-400">
                  {formatMinutes(slot, locale)}
                </div>
                <div className="flex-1 bg-white/30 dark:bg-slate-900/10" />
              </div>
            ))}

            <div className="absolute inset-y-0 right-0" style={{ left: `${TIME_COLUMN_WIDTH}px` }}>
              {[
                { className: 'left-1 right-12', height: 72, top: SLOT_HEIGHT * 2 },
                { className: 'left-8 right-1', height: 64, top: SLOT_HEIGHT * 7 },
                { className: 'left-1 right-20', height: 56, top: SLOT_HEIGHT * 12 },
              ].map((block, index) => (
                <Skeleton
                  key={index}
                  className={cn('absolute rounded-lg', block.className)}
                  style={{ height: `${block.height}px`, top: `${block.top}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'week') {
    const weekSkeletonBlocks = [
      { dayIndex: 0, height: 40, top: SLOT_HEIGHT * 3 },
      { dayIndex: 2, height: 56, top: SLOT_HEIGHT * 6 },
      { dayIndex: 4, height: 48, top: SLOT_HEIGHT * 10 },
      { dayIndex: 6, height: 64, top: SLOT_HEIGHT * 13 },
    ];

    return (
      <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700/50">
        <div className="min-w-[860px]">
          <div
            className="grid border-b border-slate-200 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-900/50"
            style={{ gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))' }}
          >
            <div />
            {weekDays.map((day) => (
              <div key={toIsoDate(day)} className="p-1">
                <div className="rounded-xl px-2 py-2">
                  <Skeleton className="mx-auto mb-1 h-2.5 w-8 rounded" />
                  <Skeleton className="mx-auto h-4 w-5 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex">
            <div
              className="relative w-16 border-r border-slate-200 bg-slate-50/60 dark:border-slate-700/50 dark:bg-slate-900/30"
              style={{ height: `${timeSlots.length * SLOT_HEIGHT}px` }}
            >
              {timeSlots.map((slot, index) => (
                <div
                  key={slot}
                  className="absolute inset-x-0 border-b border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 dark:border-slate-700/50 dark:text-slate-400"
                  style={{ top: `${index * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
                >
                  {formatMinutes(slot, locale)}
                </div>
              ))}
            </div>

            <div className="grid flex-1 grid-cols-7">
              {weekDays.map((day, dayIndex) => {
                const dateKey = toIsoDate(day);

                return (
                  <div
                    key={dateKey}
                    className="relative border-r border-slate-200 bg-white/20 dark:border-slate-700/50 dark:bg-slate-900/10"
                    style={{ height: `${timeSlots.length * SLOT_HEIGHT}px` }}
                  >
                    {timeSlots.map((slot, index) => (
                      <div
                        key={`${dateKey}-${slot}`}
                        className="absolute inset-x-0 border-b border-slate-200/80 dark:border-slate-700/40"
                        style={{ top: `${index * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
                      />
                    ))}

                    {weekSkeletonBlocks
                      .filter((block) => block.dayIndex === dayIndex)
                      .map((block, index) => (
                        <Skeleton
                          key={index}
                          className="absolute left-0.5 right-0.5 rounded-lg"
                          style={{ height: `${block.height}px`, top: `${block.top}px` }}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1 border-y border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700/50 dark:bg-slate-900/50">
        {ORDERED_DAYS.map((dayOfWeek) => (
          <div
            key={dayOfWeek}
            className="p-1 text-center text-[10px] font-medium text-slate-500 dark:text-slate-400"
          >
            {getDayLabel(dayOfWeek, dayLabels).slice(0, 3)}
          </div>
        ))}
      </div>

      <div className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthDaysCount }).map((_, index) => (
            <div
              key={index}
              className="min-h-[86px] rounded-xl border border-slate-200 bg-white/70 p-2 dark:border-slate-700/30 dark:bg-slate-800/30"
            >
              <Skeleton className="mb-2 h-3 w-5 rounded" />
              {index % 3 === 0 ? <Skeleton className="mb-1 h-4 w-full rounded-md" /> : null}
              {index % 5 === 0 ? <Skeleton className="h-4 w-3/4 rounded-md" /> : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function BlockedOverlay({
  blockedSlot,
  minHeight,
}: {
  blockedSlot: CalendarBlockedInterval;
  minHeight: number;
}) {
  const top =
    ((clampMinutes(blockedSlot.startMinutes) - DAY_START_MINUTES) / SLOT_MINUTES) * SLOT_HEIGHT;
  const height =
    ((clampMinutes(blockedSlot.endMinutes) - clampMinutes(blockedSlot.startMinutes)) /
      SLOT_MINUTES) *
    SLOT_HEIGHT;

  if (height <= 0) {
    return null;
  }

  return (
    <div
      className="absolute left-1 right-1 overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-red-600 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:bg-slate-700/40 dark:text-rose-400"
      style={{ top: `${top}px`, height: `${Math.max(height, minHeight)}px` }}
    >
      <div className="flex items-center gap-1 text-[10px] font-medium">
        <Ban className="h-3 w-3 shrink-0" />
        <span className="truncate">{blockedSlot.reason}</span>
      </div>
    </div>
  );
}

interface ProviderPlanningCalendarProps {
  activeBookingActionId: string | null;
  activeBookingActionType: 'approve' | 'reject' | null;
  appointmentsByDate: Map<string, CalendarAppointment[]>;
  blockedByDate: Map<string, CalendarBlockedInterval[]>;
  confirmLoading: boolean;
  dayAppointments: CalendarAppointment[];
  dayBlockedSlots: CalendarBlockedInterval[];
  dayLabels: Record<number, string>;
  declineLoading: boolean;
  hasVisibleEntries: boolean;
  labels: CalendarStateLabels;
  locale: string;
  monthGrid: { days: Array<{ date: Date; isCurrentMonth: boolean }> };
  onApproveAppointment: (id: string) => Promise<void>;
  onOpenDelivery: (id: string) => void;
  onRejectAppointment: (id: string) => Promise<void>;
  onRetry: () => void;
  onSelectMonthDay: (date: Date) => void;
  onSelectWeekDay: (date: Date) => void;
  planningError: unknown;
  planningLoading: boolean;
  selectedDate: Date;
  statusLabels: AppointmentStatusLabels;
  timeSlots: number[];
  viewMode: ViewMode;
  weekDays: Date[];
}

export function ProviderPlanningCalendar({
  activeBookingActionId,
  activeBookingActionType,
  appointmentsByDate,
  blockedByDate,
  confirmLoading,
  dayAppointments,
  dayBlockedSlots,
  dayLabels,
  declineLoading,
  labels,
  locale,
  monthGrid,
  onApproveAppointment,
  onOpenDelivery,
  onRejectAppointment,
  onRetry,
  onSelectMonthDay,
  onSelectWeekDay,
  planningError,
  planningLoading,
  selectedDate,
  statusLabels,
  timeSlots,
  viewMode,
  weekDays,
}: ProviderPlanningCalendarProps) {
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
      className="overflow-hidden border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
      title={<span className="text-slate-900 dark:text-white">{labels.hours}</span>}
      description={
        <span className="text-slate-500 dark:text-slate-400">
          {formatMinutes(DAY_START_MINUTES, locale)} - {formatMinutes(DAY_END_MINUTES, locale)}
        </span>
      }
      actions={<Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
      contentClassName="px-0 pb-0"
    >
      {planningLoading ? (
        <>
          <span className="sr-only">{labels.loading}</span>
          <PlanningCalendarSkeleton
            dayLabels={dayLabels}
            locale={locale}
            monthDaysCount={monthGrid.days.length}
            timeSlots={timeSlots}
            viewMode={viewMode}
            weekDays={weekDays}
          />
        </>
      ) : null}

      {!planningLoading && planningError ? (
        <PlanningCalendarError
          onRetry={onRetry}
          retryLabel={labels.retry}
          title={labels.loadingError}
        />
      ) : null}

      {!planningLoading && !planningError ? (
        <>
          {viewMode === 'day' ? (
            <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700/50">
              <div className="min-w-[360px]">
                <div className="relative" style={{ height: `${timeSlots.length * SLOT_HEIGHT}px` }}>
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot}
                      className="absolute inset-x-0 flex border-b border-slate-200 transition-colors dark:border-slate-700/50"
                      style={{ top: `${index * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
                    >
                      <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50/70 p-2 text-[10px] font-medium text-slate-500 dark:border-slate-700/50 dark:bg-slate-900/30 dark:text-slate-400">
                        {formatMinutes(slot, locale)}
                      </div>
                      <div className="flex-1 bg-white/30 dark:bg-slate-900/10" />
                    </div>
                  ))}

                  <div
                    className="absolute inset-y-0 right-0"
                    style={{ left: `${TIME_COLUMN_WIDTH}px` }}
                  >
                    {dayBlockedSlots.map((blockedSlot) => (
                      <BlockedOverlay
                        key={blockedSlot.id}
                        blockedSlot={blockedSlot}
                        minHeight={36}
                      />
                    ))}

                    {dayAppointments.map((appointment) => {
                      const top =
                        ((clampMinutes(appointment.startMinutes) - DAY_START_MINUTES) /
                          SLOT_MINUTES) *
                        SLOT_HEIGHT;
                      const height =
                        ((clampMinutes(appointment.endMinutes) -
                          clampMinutes(appointment.startMinutes)) /
                          SLOT_MINUTES) *
                        SLOT_HEIGHT;

                      return (
                        <div
                          key={`${appointment.id}-${toIsoDate(appointment.date)}-${appointment.startMinutes}`}
                          className="absolute left-1 right-1"
                          style={{ top: `${top}px`, height: `${Math.max(height, 56)}px` }}
                        >
                          <AppointmentCard
                            appointment={appointment}
                            approveLoading={getApproveLoading(appointment.sessionId)}
                            locale={locale}
                            onApprove={onApproveAppointment}
                            onOpenDelivery={onOpenDelivery}
                            onReject={onRejectAppointment}
                            rejectLoading={getRejectLoading(appointment.sessionId)}
                            statusLabels={statusLabels}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {viewMode === 'week' ? (
            <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700/50">
              <div className="min-w-[860px]">
                <div
                  className="grid border-b border-slate-200 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-900/50"
                  style={{ gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))' }}
                >
                  <div />
                  {weekDays.map((day) => {
                    const isToday = isSameDay(day, new Date());
                    const isSelected = isSameDay(day, selectedDate);

                    return (
                      <div
                        key={toIsoDate(day)}
                        className={cn('p-1', isSelected || isToday ? 'bg-cyan-500/10' : undefined)}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectWeekDay(day)}
                          className={cn(
                            'w-full rounded-xl px-2 py-2 text-center transition-colors hover:bg-white dark:hover:bg-slate-700/50',
                            isSelected
                              ? 'border border-cyan-500/40 bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                              : isToday
                                ? 'border border-cyan-500/40 bg-cyan-500/10'
                                : undefined,
                          )}
                        >
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {getDayLabel(day.getDay(), dayLabels).slice(0, 3)}
                          </div>
                          <div
                            className={cn(
                              'text-sm font-semibold text-slate-900 dark:text-white',
                              (isToday || isSelected) && 'text-cyan-600 dark:text-cyan-400',
                            )}
                          >
                            {day.getDate()}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex">
                  <div
                    className="relative w-16 border-r border-slate-200 bg-slate-50/60 dark:border-slate-700/50 dark:bg-slate-900/30"
                    style={{ height: `${timeSlots.length * SLOT_HEIGHT}px` }}
                  >
                    {timeSlots.map((slot, index) => (
                      <div
                        key={slot}
                        className="absolute inset-x-0 border-b border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 dark:border-slate-700/50 dark:text-slate-400"
                        style={{ top: `${index * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
                      >
                        {formatMinutes(slot, locale)}
                      </div>
                    ))}
                  </div>

                  <div className="grid flex-1 grid-cols-7">
                    {weekDays.map((day) => {
                      const dateKey = toIsoDate(day);
                      const appointmentsForDay = appointmentsByDate.get(dateKey) ?? [];
                      const blockedForDay = blockedByDate.get(dateKey) ?? [];
                      const isSelected = isSameDay(day, selectedDate);

                      return (
                        <div
                          key={dateKey}
                          className={cn(
                            'relative border-r border-slate-200 bg-white/20 dark:border-slate-700/50 dark:bg-slate-900/10',
                            isSelected ? 'bg-cyan-500/10 dark:bg-cyan-500/10' : undefined,
                          )}
                          style={{ height: `${timeSlots.length * SLOT_HEIGHT}px` }}
                        >
                          {timeSlots.map((slot, index) => (
                            <div
                              key={`${dateKey}-${slot}`}
                              className="absolute inset-x-0 border-b border-slate-200/80 dark:border-slate-700/40"
                              style={{
                                top: `${index * SLOT_HEIGHT}px`,
                                height: `${SLOT_HEIGHT}px`,
                              }}
                            />
                          ))}

                          {blockedForDay.map((blockedSlot) => (
                            <BlockedOverlay
                              key={blockedSlot.id}
                              blockedSlot={blockedSlot}
                              minHeight={22}
                            />
                          ))}

                          {appointmentsForDay.map((appointment) => {
                            const top =
                              ((clampMinutes(appointment.startMinutes) - DAY_START_MINUTES) /
                                SLOT_MINUTES) *
                              SLOT_HEIGHT;
                            const height =
                              ((clampMinutes(appointment.endMinutes) -
                                clampMinutes(appointment.startMinutes)) /
                                SLOT_MINUTES) *
                              SLOT_HEIGHT;

                            return (
                              <div
                                key={`${appointment.id}-${dateKey}-${appointment.startMinutes}`}
                                className="absolute left-0.5 right-0.5"
                                style={{ top: `${top}px`, height: `${Math.max(height, 32)}px` }}
                              >
                                <AppointmentCard
                                  appointment={appointment}
                                  approveLoading={getApproveLoading(appointment.sessionId)}
                                  compact
                                  locale={locale}
                                  onApprove={onApproveAppointment}
                                  onOpenDelivery={onOpenDelivery}
                                  onReject={onRejectAppointment}
                                  rejectLoading={getRejectLoading(appointment.sessionId)}
                                  statusLabels={statusLabels}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {viewMode === 'month' ? (
            <>
              <div className="grid grid-cols-7 gap-1 border-y border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700/50 dark:bg-slate-900/50">
                {ORDERED_DAYS.map((dayOfWeek) => (
                  <div
                    key={dayOfWeek}
                    className="p-1 text-center text-[10px] font-medium text-slate-500 dark:text-slate-400"
                  >
                    {getDayLabel(dayOfWeek, dayLabels).slice(0, 3)}
                  </div>
                ))}
              </div>

              <div className="p-3">
                <div className="grid grid-cols-7 gap-1">
                  {monthGrid.days.map((dayInfo) => {
                    const dateKey = toIsoDate(dayInfo.date);
                    const appointmentsForDay = appointmentsByDate.get(dateKey) ?? [];
                    const isToday = isSameDay(dayInfo.date, new Date());
                    const isSelected = isSameDay(dayInfo.date, selectedDate);

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => onSelectMonthDay(dayInfo.date)}
                        className={cn(
                          'min-h-[86px] rounded-xl border p-2 text-left backdrop-blur-sm transition-all hover:border-cyan-500/50',
                          isSelected
                            ? 'border-cyan-500/50 bg-cyan-500/10 ring-1 ring-cyan-500/30'
                            : isToday
                              ? 'border-cyan-500/40 bg-cyan-500/10'
                              : dayInfo.isCurrentMonth
                                ? 'border-slate-200 bg-white/70 dark:border-slate-700/30 dark:bg-slate-800/30'
                                : 'border-slate-100 bg-slate-50/80 text-slate-400 dark:border-slate-800/30 dark:bg-slate-900/30 dark:text-slate-600',
                        )}
                      >
                        <div
                          className={cn(
                            'mb-2 text-xs font-medium',
                            isSelected || isToday
                              ? 'text-cyan-600 dark:text-cyan-400'
                              : dayInfo.isCurrentMonth
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400 dark:text-slate-600',
                          )}
                        >
                          {dayInfo.date.getDate()}
                        </div>

                        {appointmentsForDay.slice(0, 2).map((appointment) => {
                          const config = getAppointmentStatusConfig(
                            appointment.status,
                            statusLabels,
                          );

                          return (
                            <div
                              key={`${appointment.id}-${appointment.startMinutes}`}
                              className={cn(
                                'mb-1 truncate rounded-md px-1.5 py-0.5 text-[9px]',
                                config.colorClassName,
                              )}
                            >
                              {appointment.timeLabel}
                            </div>
                          );
                        })}

                        {appointmentsForDay.length > 2 ? (
                          <div className="text-[9px] text-slate-500 dark:text-slate-400">
                            +{appointmentsForDay.length - 2}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </SectionCard>
  );
}
