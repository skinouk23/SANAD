import { Activity, Calendar, Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppointmentDateTime, useAppointmentStatus } from '@/features/bookings';
import { Skeleton } from '@/shared/ui/composites/loading';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import type { PatientDashboardScreenViewModel } from '@/features/patient/dashboard/usePatientDashboardScreen';

interface SectionStateCardProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const glassCardClassName =
  'rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none';

const appointmentGradients = [
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
] as const;

const quickAccessGradientsByRoute: Record<string, string> = {
  '/messages': 'from-cyan-500 to-blue-500',
  '/donation-medicaments': 'from-emerald-500 to-teal-500',
  '/health-concierge': 'from-amber-500 to-orange-500',
};

const fallbackQuickAccessGradients = [
  'from-cyan-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
] as const;

const familyAvatarGradients = [
  'from-cyan-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
] as const;

function getStableGradient(seed: string, gradients: readonly string[]): string {
  const charCode = seed.charCodeAt(0) || 0;

  return gradients[Math.abs(charCode) % gradients.length] ?? gradients[0] ?? '';
}

function FamilyCircleSkeleton() {
  return (
    <>
      <div className="mb-4 flex -space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800"
          />
        ))}
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </>
  );
}

function PatientDashboardAppointmentSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={`${glassCardClassName} p-4`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Skeleton className="h-10 w-10 flex-shrink-0 rounded-xl" />
              <div className="min-w-0">
                <Skeleton className="mb-2 h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 flex-shrink-0 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className={`${glassCardClassName} p-4`}>
      <div className="mb-3 flex items-center gap-2.5">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-2 h-3 w-28 rounded" />
          <Skeleton className="h-5 w-40 rounded" />
        </div>
      </div>
      <Skeleton className="h-3 w-52 max-w-full rounded" />
    </div>
  );
}

function TrackingCardSkeleton() {
  return (
    <div className={`${glassCardClassName} p-4 text-center`}>
      <Skeleton className="mx-auto mb-3 h-4 w-24 rounded" />
      <Skeleton className="mx-auto mb-1.5 h-10 w-10 rounded-full" />
      <Skeleton className="mx-auto mb-2 h-7 w-28 rounded" />
      <Skeleton className="mx-auto mb-4 h-3 w-40 rounded" />
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-8 rounded-full" />
        ))}
      </div>
    </div>
  );
}

function SectionStateCard({ message, actionLabel, onAction }: SectionStateCardProps) {
  return (
    <div className={`${glassCardClassName} p-4 text-slate-600 dark:text-slate-300`}>
      <p className="text-xs">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function PatientDashboardAppointmentCard({
  appointment,
}: {
  appointment: BookingListItemResponse;
}) {
  const statusConfig = useAppointmentStatus(appointment.status ?? 'pending');
  const dateTime = useAppointmentDateTime(appointment.scheduledAt);
  const gradient = getStableGradient(appointment.id, appointmentGradients);

  return (
    <div
      className={`${glassCardClassName} p-4 transition-colors hover:border-cyan-500/50 dark:hover:border-cyan-500/50`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-base font-bold text-white shadow-sm`}
          >
            {appointment.provider?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {appointment.service?.name || 'Consultation'}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}
        >
          {statusConfig.label}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span>📅 {dateTime.dateLabel}</span>
        <span>🕐 {dateTime.timeLabel}</span>
      </div>
    </div>
  );
}

export function PatientDashboardSections({ screen }: { screen: PatientDashboardScreenViewModel }) {
  const { text } = screen;
  const appointmentsInitialLoading = screen.appointmentsLoading && screen.appointments.length === 0;
  const statsInitialLoading = screen.appointmentStatsLoading && !screen.lastAppointmentLabel;
  const availableQuickAccessItems = screen.quickAccessItems.filter(
    (item) => item.to !== '/rewards',
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/services" className="group">
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-10" />
              <div
                className={`${glassCardClassName} relative p-4 transition-colors group-hover:border-cyan-500/50 dark:hover:border-cyan-500/50`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-sm">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">
                  {text.dashboard.book}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {text.dashboard.findProfessional}
                </p>
              </div>
            </div>
          </Link>

          <button type="button" onClick={screen.onOpenEmergencyModal} className="group text-left">
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-10" />
              <div
                className={`${glassCardClassName} relative p-4 transition-colors group-hover:border-rose-500/50 dark:hover:border-rose-500/50`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">
                  {text.dashboard.emergencyBtn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {text.dashboard.quickAssistance}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {text.dashboard.upcomingAppointments}
            </h2>
            <div className="flex items-center gap-3">
              {screen.appointmentsLoading ? (
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Mise a jour...
                </span>
              ) : null}
              <Link
                to="/mon-espace"
                className="text-xs font-medium text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                {text.common.seeAll}
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            {appointmentsInitialLoading ? (
              <PatientDashboardAppointmentSkeleton />
            ) : screen.appointmentsError && screen.appointments.length === 0 ? (
              <SectionStateCard
                message="Les rendez-vous n'ont pas pu etre charges pour le moment."
                actionLabel="Reessayer"
                onAction={screen.onRetryAppointments}
              />
            ) : screen.appointments.length === 0 ? (
              <SectionStateCard message="Aucun rendez-vous a venir pour le moment." />
            ) : (
              screen.appointments
                .slice(0, 3)
                .map((appointment) => (
                  <PatientDashboardAppointmentCard key={appointment.id} appointment={appointment} />
                ))
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {text.dashboard.recentActivity}
            </h2>
            {screen.appointmentStatsLoading && !statsInitialLoading ? (
              <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                Mise a jour...
              </span>
            ) : null}
          </div>

          {statsInitialLoading ? (
            <RecentActivitySkeleton />
          ) : screen.appointmentStatsError && !screen.lastAppointmentLabel ? (
            <SectionStateCard
              message="L'activité récente n'a pas pu etre chargee pour le moment."
              actionLabel="Reessayer"
              onAction={screen.onRetryAppointmentStats}
            />
          ) : (
            <div className={`${glassCardClassName} p-4`}>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-sm">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {text.dashboard.lastConsultation}
                  </p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {screen.lastAppointmentLabel ?? text.common.noData}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {screen.lastAppointmentLabel
                  ? text.dashboard.lastConsultation
                  : screen.patientStats.upcomingAppointments > 0
                    ? `${screen.patientStats.upcomingAppointments} rendez-vous à venir`
                    : 'Aucun rendez-vous prévu'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {screen.isHealthTrackingFeatureActive ? (
          statsInitialLoading ? (
            <TrackingCardSkeleton />
          ) : screen.appointmentStatsError ? (
            <SectionStateCard
              message="Votre suivi n'a pas pu etre charge pour le moment."
              actionLabel="Reessayer"
              onAction={screen.onRetryAppointmentStats}
            />
          ) : (
            <div className={`${glassCardClassName} p-4 text-center`}>
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                {text.dashboard.yourTracking}
              </h3>
              <div className="mb-1.5 text-4xl">🔥</div>
              <div className="mb-1 bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-2xl font-bold text-transparent">
                {screen.patientStats.streakDays} {text.dashboard.daysStreak}
              </div>
              <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
                {text.dashboard.continuousTracking}
              </p>
              <div className="flex justify-center gap-1.5">
                {['🌱', '⭐', '🏆'].map((emoji, index) => (
                  <div
                    key={emoji}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${index < 2 ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-slate-200 opacity-50 dark:bg-slate-700 dark:opacity-30'}`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          )
        ) : null}

        {screen.isFamilyCircleFeatureActive ? (
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
            <div className="relative rounded-xl border border-cyan-500/30 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-800/50 dark:shadow-none">
              <h3 className="mb-1.5 text-sm font-bold text-slate-900 dark:text-white">
                {text.dashboard.familyCircle}
              </h3>
              <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
                {text.dashboard.sharedWith} {screen.familyMembers.length} {text.dashboard.members}
              </p>
              {screen.familyInitialLoading ? (
                <FamilyCircleSkeleton />
              ) : screen.familyError ? (
                <SectionStateCard
                  message="Le cercle familial n'a pas pu etre charge pour le moment."
                  actionLabel="Reessayer"
                  onAction={screen.onRetryFamilyMembers}
                />
              ) : (
                <>
                  <div className="mb-4 flex -space-x-2">
                    {screen.familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${getStableGradient(member.id, familyAvatarGradients)} text-xs font-bold text-white dark:border-slate-800`}
                        title={member.name}
                      >
                        {member.initial}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={screen.onOpenAddMemberModal}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
                      title={text.dashboard.addMember}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={screen.onOpenFamilyModal}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-[0.96] disabled:hover:scale-100"
                  >
                    {screen.familyRefreshing ? 'Mise a jour...' : text.dashboard.manageAccess}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : null}

        <div className="space-y-2.5">
          {availableQuickAccessItems.map((item, index) => {
            const gradient =
              quickAccessGradientsByRoute[item.to] ??
              fallbackQuickAccessGradients[index % fallbackQuickAccessGradients.length] ??
              fallbackQuickAccessGradients[0];

            return (
              <Link key={item.to} to={item.to} className="group block">
                <div
                  className={`${glassCardClassName} p-3 transition-colors group-hover:border-cyan-500/50 dark:hover:border-cyan-500/50`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-sm`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
