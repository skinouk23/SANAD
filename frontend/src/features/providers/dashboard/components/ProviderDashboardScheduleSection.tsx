import { Link } from 'react-router-dom';
import { Calendar, CalendarCheck, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { cn } from '@/shared/lib/utils';
import { SkeletonTimelineList } from '@/shared/ui/composites/loading';
import { isTerminalBookingStatus, isUpcomingBookingStatus } from '@/features/bookings/status';
import {
  formatDashboardTime,
  getAppointmentSummary,
} from '@/features/providers/dashboard/providerDashboardSection.utils';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import type { ProviderDashboardScreenViewModel } from '@/features/providers/dashboard/useProviderDashboardScreen';

function AppointmentTimelineItem({
  appointment,
  isNext,
  isLast,
  onMessagePatient,
  openingConversation,
}: {
  appointment: BookingListItemResponse;
  isNext: boolean;
  isLast: boolean;
  onMessagePatient: (() => void) | null;
  openingConversation: boolean;
}) {
  const { currentLanguage, t } = useLanguage();
  const startTime = formatDashboardTime(appointment.dailyStartTime, currentLanguage.code);
  const endTime = appointment.dailyEndTime
    ? formatDashboardTime(appointment.dailyEndTime, currentLanguage.code)
    : null;
  const durationLabel = appointment.dailyDurationMinutes
    ? `${appointment.dailyDurationMinutes} ${t.tracking.min}`
    : null;
  const { addressLabel, isCompleted, patientName, serviceName } = getAppointmentSummary(
    appointment,
    t.messages.patientLabel,
    t.common.noData,
  );
  const isUpcoming =
    isUpcomingBookingStatus(appointment.status) && !isTerminalBookingStatus(appointment.status);
  const deliverySessionId = appointment.sessionId;

  return (
    <div className="relative flex gap-3">
      {!isLast ? (
        <div className="absolute bottom-[-0.75rem] left-[2.25rem] top-10 w-0.5 bg-slate-200 dark:bg-slate-700" />
      ) : null}

      <div
        className={cn(
          'flex w-16 flex-shrink-0 flex-col items-center pt-1',
          isCompleted && 'opacity-50',
        )}
      >
        <span
          className={cn(
            'text-xs font-bold tabular-nums',
            isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white',
          )}
        >
          {startTime}
        </span>
        <span
          className={cn(
            'relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full border-2',
            isCompleted
              ? 'border-white bg-slate-300 dark:border-slate-800 dark:bg-slate-600'
              : 'border-slate-800 bg-cyan-500',
          )}
        />
      </div>

      <article
        className={cn(
          'min-w-0 flex-grow rounded-xl border p-3 backdrop-blur-sm',
          isCompleted
            ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700/50 dark:bg-slate-800/50'
            : isNext || isUpcoming
              ? 'border-cyan-500/30 bg-white shadow-sm dark:bg-slate-800/50'
              : 'border-slate-200 bg-white/80 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50',
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={cn(
                  'min-w-0 truncate text-sm font-bold text-slate-900 dark:text-white',
                  isCompleted && 'text-slate-500 dark:text-slate-400',
                )}
              >
                {patientName}
              </h3>
              {isCompleted ? (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                  {t.provider.completed}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-400">
              {serviceName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 dark:text-slate-500">
              {endTime || durationLabel ? (
                <span className="shrink-0 font-medium tabular-nums text-slate-500 dark:text-slate-400">
                  {endTime ? `${startTime}-${endTime}` : startTime}
                  {durationLabel ? ` / ${durationLabel}` : null}
                </span>
              ) : null}
              <span className="flex min-w-0 items-center gap-1.5">
                <MapPin
                  className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-600"
                  aria-hidden="true"
                />
                <span className="truncate">{addressLabel}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 sm:shrink-0">
            {onMessagePatient ? (
              <button
                type="button"
                onClick={onMessagePatient}
                disabled={openingConversation}
                aria-label={t.messages.messagePatient}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-medium text-cyan-700 transition-all hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-500/50 dark:bg-cyan-500/20 dark:text-cyan-400 dark:hover:bg-cyan-500/30"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {t.messages.messagePatient}
              </button>
            ) : null}
            {isUpcoming && deliverySessionId ? (
              <Link
                to={`/provider/active-delivery/${deliverySessionId}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700 transition-all hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 active:scale-[0.96] dark:border-blue-500/50 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t.provider.startDelivery}
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}

export function ProviderDashboardScheduleSection({
  appointmentsInitialLoadError,
  appointmentsLoading,
  appointmentsRefreshing,
  canMessagePatients,
  onMessagePatient,
  onRetry,
  openingConversation,
  todayAppointments,
}: {
  appointmentsInitialLoadError: unknown;
  appointmentsLoading: boolean;
  appointmentsRefreshing: boolean;
  canMessagePatients: boolean;
  onMessagePatient: ProviderDashboardScreenViewModel['onMessagePatient'];
  onRetry: () => void;
  openingConversation: boolean;
  todayAppointments: BookingListItemResponse[];
}) {
  const { t } = useLanguage();
  const appointmentsInitialLoading = appointmentsLoading && todayAppointments.length === 0;
  const nextAppointmentId =
    todayAppointments.find((appointment) => isUpcomingBookingStatus(appointment.status))?.id ??
    null;

  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-balance text-lg font-bold text-slate-900 dark:text-white">
              {t.provider.todaySchedule}
            </h2>
            {appointmentsRefreshing ? (
              <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                Mise à jour...
              </span>
            ) : null}
          </div>
        </div>
        <Link
          to="/provider/schedule"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 active:scale-[0.96] dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:bg-slate-700"
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          {t.common.seeAll}
        </Link>
      </div>

      <div className="space-y-3">
        {appointmentsInitialLoading ? (
          <SkeletonTimelineList />
        ) : appointmentsInitialLoadError && todayAppointments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.common.loadingError}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-100 dark:border-cyan-500/50 dark:bg-cyan-500/20 dark:text-cyan-400 dark:hover:bg-cyan-500/30"
            >
              {t.common.retry}
            </button>
          </div>
        ) : todayAppointments.length > 0 ? (
          todayAppointments.map((appointment, index) => (
            <AppointmentTimelineItem
              key={appointment.id}
              appointment={appointment}
              isNext={appointment.id === nextAppointmentId}
              isLast={index === todayAppointments.length - 1}
              onMessagePatient={
                canMessagePatients && appointment.patient?.id
                  ? () => void onMessagePatient(appointment.patient?.id)
                  : null
              }
              openingConversation={openingConversation}
            />
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.provider.noAppointmentsToday}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">{t.provider.dayOffHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
