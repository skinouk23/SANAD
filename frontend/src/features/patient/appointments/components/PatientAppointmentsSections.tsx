import type { ReactNode } from 'react';

import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  Heart,
  MapPin,
  Phone,
  RefreshCw,
  Star,
  type LucideIcon,
} from 'lucide-react';

import {
  canRateAppointment,
  isRatedAppointment,
  type PatientAppointmentsScreenViewModel,
} from '@/features/patient/appointments/usePatientAppointmentsScreen';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  type AppointmentGroup,
} from '@/features/patient/appointments/patientAppointments.utils';
import { useAppointmentStatus } from '@/features/bookings';
import type { BookingListItemResponse } from '@/features/bookings/schema';

const glassCardClassName =
  'rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none';

const upcomingProviderGradients = [
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-purple-500 to-pink-500',
] as const;

const historyProviderGradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-green-500 to-emerald-500',
] as const;

function getStableGradient(seed: string | undefined, gradients: readonly string[]): string {
  const charCode = seed?.charCodeAt(0) ?? 0;

  return gradients[Math.abs(charCode) % gradients.length] ?? gradients[0] ?? '';
}

function AppointmentCardsSkeleton({
  items = 2,
  actionLayout = 'triple',
}: {
  items?: number;
  actionLayout?: 'triple' | 'double';
}) {
  const actionWidths =
    actionLayout === 'double' ? ['flex-1', 'flex-1'] : ['flex-1', 'flex-1', 'w-16'];

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className={`${glassCardClassName} animate-pulse p-4`}>
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="mb-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
            <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-3">
            <div className="h-5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="flex gap-2">
            {actionWidths.map((width, actionIndex) => (
              <div
                key={actionIndex}
                className={`h-8 rounded-lg bg-slate-200 dark:bg-slate-700 ${width}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface AppointmentsStateCardProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'error' | 'neutral';
}

function AppointmentsStateCard({
  icon: Icon,
  message,
  actionLabel,
  onAction,
  tone = 'neutral',
}: AppointmentsStateCardProps) {
  const iconClassName = tone === 'error' ? 'text-red-500' : 'text-slate-300 dark:text-slate-600';
  const textClassName = tone === 'error' ? 'text-red-500' : 'text-slate-500 dark:text-slate-400';

  return (
    <div
      className={`${glassCardClassName} p-4 text-center ${tone === 'error' ? 'border-red-500/40' : ''}`}
    >
      <Icon className={`mx-auto mb-2 h-8 w-8 ${iconClassName}`} />
      <p className={textClassName}>{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${tone === 'error' ? 'border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'}`}
        >
          <RefreshCw className="h-3 w-3" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function UpcomingAppointmentCard({
  appointment,
  text,
  onCall,
  onTrack,
  onDetails,
}: {
  appointment: BookingListItemResponse;
  text: PatientAppointmentsScreenViewModel['text'];
  onCall: () => void;
  onTrack: (trackingId: string) => void;
  onDetails: () => void;
}) {
  const statusConfig = useAppointmentStatus(appointment.status ?? 'Pending');
  const trackingSessionId = appointment.sessionId;
  const totalSessions =
    appointment.totalSessions ?? appointment.sessionCounts?.totalSessions ?? null;
  const validatedSessions =
    appointment.validatedSessions ?? appointment.sessionCounts?.validatedSessions ?? null;
  const remainingSessions =
    appointment.remainingSessions ?? appointment.sessionCounts?.remainingSessions ?? null;
  const gradient = getStableGradient(
    appointment.provider?.name ?? appointment.id,
    upcomingProviderGradients,
  );

  return (
    <div
      className={`${glassCardClassName} gap-3 p-4 transition-all hover:border-cyan-500/50 dark:hover:border-cyan-500/50`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-2xl font-bold text-white shadow-sm`}
          >
            {appointment.provider?.name?.charAt(0) || '👨‍⚕️'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {appointment.service?.name || appointment.service?.category}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>{formatAppointmentDate(appointment.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>{formatAppointmentTime(appointment.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>
            {appointment.type === 'video' ? text.mySpace.videoConsultation : text.mySpace.atHome}
          </span>
        </div>
      </div>

      {totalSessions && totalSessions > 1 ? (
        <div className="mb-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
          {text.mySpace.sessionProgress
            .replace('{validated}', String(validatedSessions ?? 0))
            .replace('{total}', String(totalSessions))}
          {remainingSessions != null ? (
            <span className="ml-1 text-cyan-700/80 dark:text-cyan-200/80">
              {text.mySpace.remainingSessions.replace('{count}', String(remainingSessions))}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          onClick={onCall}
          className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          <Phone className="h-3 w-3" />
          {text.common.call}
        </button>
        <button
          type="button"
          onClick={() => {
            if (trackingSessionId) {
              onTrack(trackingSessionId);
            }
          }}
          disabled={!trackingSessionId}
          className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-xs font-medium text-white transition-all hover:scale-105 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <MapPin className="h-3 w-3" />
          {text.common.follow}
        </button>
        <button
          type="button"
          onClick={onDetails}
          className="col-span-2 min-h-10 rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-xs font-medium text-red-500 transition-all hover:bg-red-500/30 sm:col-span-1"
        >
          {text.common.details}
        </button>
      </div>
    </div>
  );
}

function HistoryAppointmentCard({
  appointment,
  text,
  isFavorite,
  onRate,
  onToggleFavorite,
}: {
  appointment: BookingListItemResponse;
  text: PatientAppointmentsScreenViewModel['text'];
  isFavorite: boolean;
  onRate: () => void;
  onToggleFavorite: () => void;
}) {
  const statusConfig = useAppointmentStatus(appointment.status ?? 'Pending');
  const gradient = getStableGradient(
    appointment.provider?.name ?? appointment.id,
    historyProviderGradients,
  );

  return (
    <div
      className={`${glassCardClassName} p-4 transition-all hover:border-cyan-500/50 dark:hover:border-cyan-500/50`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-2xl font-bold text-white shadow-sm`}
          >
            {appointment.provider?.name?.charAt(0) || '👨‍⚕️'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {appointment.service?.name || appointment.service?.category || 'Consultation'}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>{formatAppointmentDate(appointment.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>{formatAppointmentTime(appointment.scheduledAt)}</span>
        </div>
      </div>

      {isRatedAppointment(appointment) ? (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {text.mySpace.yourReview}:
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < (appointment.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
              />
            ))}
          </div>
        </div>
      ) : canRateAppointment(appointment) ? (
        <button
          type="button"
          onClick={onRate}
          className="flex items-center gap-2 text-sm text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          <Edit className="h-4 w-4" />
          {text.mySpace.giveReview}
        </button>
      ) : null}

      <button
        type="button"
        onClick={onToggleFavorite}
        className={`mt-2 flex items-center gap-1 text-sm transition-colors ${isFavorite ? 'text-pink-500 hover:text-pink-400' : 'text-slate-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400'}`}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-500' : ''}`} />
        {isFavorite ? text.mySpace.removeFromFavorites : text.mySpace.addToFavorites}
      </button>
    </div>
  );
}

function AppointmentGroupSection({
  children,
  group,
  text,
}: {
  children: ReactNode;
  group: AppointmentGroup;
  text: PatientAppointmentsScreenViewModel['text'];
}) {
  if (group.appointments.length <= 1) {
    return <>{children}</>;
  }

  return (
    <section className="rounded-2xl border border-cyan-200/70 bg-cyan-50/50 p-2 dark:border-cyan-500/20 dark:bg-cyan-500/5">
      <div className="mb-2 flex items-center justify-between gap-3 px-1 text-xs font-medium text-cyan-800 dark:text-cyan-200">
        <span>{group.bookingNumber ?? text.mySpace.multiSessionBooking}</span>
        <span>
          {text.mySpace.sessionCount.replace('{count}', String(group.appointments.length))}
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function PatientAppointmentsSections({
  screen,
}: {
  screen: PatientAppointmentsScreenViewModel;
}) {
  const { text } = screen;

  return (
    <div className="space-y-3">
      {screen.actionMessage ? (
        <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {screen.actionMessage}
        </div>
      ) : null}
      {screen.actionError ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {screen.actionError}
        </div>
      ) : null}

      {screen.activeTab === 'appointments' ? (
        <div>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
            {text.mySpace.upcomingAppointments}
          </h2>
          <div className="space-y-2">
            {screen.upcomingLoading ? (
              <AppointmentCardsSkeleton />
            ) : screen.upcomingError ? (
              <AppointmentsStateCard
                icon={AlertCircle}
                message="Une erreur est survenue lors du chargement des rendez-vous"
                actionLabel={text.common.retry}
                onAction={screen.onRetryUpcoming}
                tone="error"
              />
            ) : screen.actionableUpcomingGroups.length > 0 ? (
              screen.actionableUpcomingGroups.map((group) => (
                <AppointmentGroupSection key={group.bookingId} group={group} text={text}>
                  {group.appointments.map((appointment) => (
                    <UpcomingAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      text={text}
                      onCall={() => {
                        screen.onCall(appointment);
                      }}
                      onTrack={screen.onOpenTracking}
                      onDetails={() => {
                        screen.onOpenDetails(appointment.id);
                      }}
                    />
                  ))}
                </AppointmentGroupSection>
              ))
            ) : (
              <AppointmentsStateCard
                icon={Calendar}
                message={text.mySpace.noConfirmedAppointments}
              />
            )}
          </div>
        </div>
      ) : null}

      {screen.activeTab === 'history' ? (
        <div className="space-y-3">
          {screen.historyLoading ? (
            <AppointmentCardsSkeleton items={3} />
          ) : screen.historyError ? (
            <AppointmentsStateCard
              icon={AlertCircle}
              message="Une erreur est survenue lors du chargement de l'historique"
              actionLabel={text.common.retry}
              onAction={screen.onRetryHistory}
              tone="error"
            />
          ) : screen.historyGroups.length > 0 ? (
            screen.historyGroups.map((group) => (
              <AppointmentGroupSection key={group.bookingId} group={group} text={text}>
                {group.appointments.map((appointment) => (
                  <HistoryAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    text={text}
                    isFavorite={screen.isFavorite(appointment.id)}
                    onRate={() => {
                      screen.onOpenRating(appointment.id);
                    }}
                    onToggleFavorite={() => {
                      screen.onToggleFavorite(appointment.id);
                    }}
                  />
                ))}
              </AppointmentGroupSection>
            ))
          ) : (
            <AppointmentsStateCard icon={Clock} message={text.mySpace.noServiceHistory} />
          )}
        </div>
      ) : null}
    </div>
  );
}
