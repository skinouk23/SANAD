import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react';
import { Check, MapPin, Video, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/primitives/badge';
import { Button } from '@/shared/ui/primitives/button';
import { Spinner } from '@/shared/ui/primitives/spinner';
import type {
  AppointmentStatusLabels,
  CalendarAppointment,
} from '@/features/providers/schedule-planning/types';
import { getAppointmentStatusConfig } from '@/features/providers/schedule-planning/utils';

interface AppointmentCardProps {
  appointment: CalendarAppointment;
  approveLoading: boolean;
  compact?: boolean;
  rejectLoading: boolean;
  locale: string;
  onApprove: (id: string) => Promise<void>;
  onOpenDelivery: (id: string) => void;
  onReject: (id: string) => Promise<void>;
  statusLabels: AppointmentStatusLabels;
}

export function AppointmentCard({
  appointment,
  approveLoading,
  compact = false,
  rejectLoading,
  locale,
  onApprove,
  onOpenDelivery,
  onReject,
  statusLabels,
}: AppointmentCardProps) {
  const config = getAppointmentStatusConfig(appointment.status, statusLabels);
  const StatusIcon = config.icon;

  const handleCardClick = () => {
    if (appointment.canOpenDelivery && appointment.sessionId) {
      onOpenDelivery(appointment.sessionId);
    }
  };

  const handleCardKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!appointment.canOpenDelivery || !appointment.sessionId) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleApprove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void onApprove(appointment.sessionId);
  };

  const handleReject = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void onReject(appointment.sessionId);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleCardClick}
        disabled={!appointment.canOpenDelivery || !appointment.sessionId}
        className={cn(
          'w-full rounded-md border px-1.5 py-1 text-left text-[10px] shadow-sm backdrop-blur-sm transition-all',
          config.colorClassName,
          appointment.canOpenDelivery && appointment.sessionId
            ? 'cursor-pointer hover:scale-[1.01] hover:opacity-80'
            : 'cursor-default disabled:opacity-100',
        )}
      >
        <span className="font-medium text-slate-900 dark:text-white">{appointment.timeLabel}</span>
        <span className="ml-1 truncate text-slate-600 dark:text-slate-300">
          {appointment.patientName}
        </span>
      </button>
    );
  }

  return (
    <div
      role={appointment.canOpenDelivery && appointment.sessionId ? 'button' : undefined}
      tabIndex={appointment.canOpenDelivery && appointment.sessionId ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cn(
        'flex h-full w-full flex-col rounded-lg border-2 px-3 py-2 text-left shadow-sm backdrop-blur-sm transition-all',
        config.colorClassName,
        appointment.canOpenDelivery && appointment.sessionId
          ? 'cursor-pointer hover:scale-[1.01] hover:opacity-90'
          : 'cursor-default',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <StatusIcon className={cn('h-3.5 w-3.5 shrink-0', config.iconClassName)} />
            <span className="truncate text-xs font-semibold text-slate-900 dark:text-white">
              {appointment.timeLabel} - {appointment.patientName}
            </span>
          </div>
        </div>
        <div className="ml-2 flex shrink-0 items-center gap-1">
          {appointment.canApprove || appointment.canReject ? (
            <div className="flex items-center gap-1">
              {appointment.canApprove ? (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleApprove}
                  disabled={approveLoading || rejectLoading}
                  aria-busy={approveLoading || undefined}
                  aria-label={statusLabels.approve}
                  title={statusLabels.approve}
                  className="size-6 rounded-full border border-green-500/50 bg-green-500/20 text-green-500 hover:bg-green-500/40"
                >
                  {approveLoading ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </Button>
              ) : null}
              {appointment.canReject ? (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleReject}
                  disabled={approveLoading || rejectLoading}
                  aria-busy={rejectLoading || undefined}
                  aria-label={statusLabels.reject}
                  title={statusLabels.reject}
                  className="size-6 rounded-full border border-red-500/50 bg-red-500/20 text-red-500 hover:bg-red-500/40 dark:text-rose-400"
                >
                  {rejectLoading ? <Spinner data-icon="inline-start" /> : <X className="h-3 w-3" />}
                </Button>
              ) : null}
            </div>
          ) : (
            <Badge
              variant={config.badgeVariant}
              className={cn(
                'border px-1.5 py-0.5 text-[10px]',
                config.colorClassName,
                config.iconClassName,
              )}
            >
              {config.label}
            </Badge>
          )}
        </div>
      </div>
      <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300">
        {appointment.type === 'home' ? (
          <MapPin className="h-3 w-3 shrink-0 text-cyan-600 dark:text-cyan-400" />
        ) : (
          <Video className="h-3 w-3 shrink-0 text-cyan-600 dark:text-cyan-400" />
        )}
        <span className="truncate">{appointment.service}</span>
        <span aria-hidden="true">•</span>
        <span>{appointment.durationMinutes} min</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="truncate">{appointment.location}</span>
        {appointment.canOpenDelivery ? (
          <Badge
            variant="secondary"
            className="shrink-0 border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400"
          >
            {statusLabels.startDelivery}
          </Badge>
        ) : null}
      </div>
      <span className="sr-only">
        {appointment.date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' })}
      </span>
    </div>
  );
}
