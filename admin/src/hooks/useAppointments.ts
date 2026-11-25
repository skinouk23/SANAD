/**
 * Appointment Hooks
 * Custom React hooks for appointment data fetching and management
 */

import { useCallback, useMemo, useRef } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import {
  appointmentsService,
  AppointmentFilters } from
'../services/appointments.service';
import type { Appointment, AppointmentStatus } from '../types/api.types';

// ============================================
// FETCH HOOKS
// ============================================

/**
 * Hook for fetching appointments with filters
 */
export function useAppointments(filters?: AppointmentFilters) {
  const filtersKey = JSON.stringify(filters);

  return useApi<Appointment[]>(
    () => appointmentsService.getAll(filters),
    [filtersKey]
  );
}

/**
 * Hook for fetching paginated appointments
 */
export function usePaginatedAppointments(initialFilters?: AppointmentFilters) {
  return usePaginatedApi<Appointment, AppointmentFilters>(
    appointmentsService.getPaginated,
    initialFilters || { page: 1, limit: 10 }
  );
}

/**
 * Hook for fetching a single appointment by ID
 */
export function useAppointment(appointmentId: string | undefined) {
  return useApi<Appointment | null>(
    () =>
    appointmentId ?
    appointmentsService.getById(appointmentId) :
    Promise.resolve(null),
    [appointmentId],
    { immediate: !!appointmentId }
  );
}

/**
 * Hook for fetching upcoming appointments for a user
 * Parameters are optional - defaults to current user as patient
 */
export function useUpcomingAppointments(
userId?: string,
role: 'patient' | 'provider' = 'patient')
{
  const result = useApi<Appointment[]>(
    () => appointmentsService.getUpcoming(userId || 'current-user', role),
    [userId, role]
  );

  // Sort by date and limit to next few
  const sortedData = useMemo(() => {
    if (!result.data) return [];
    return [...result.data].sort(
      (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }, [result.data]);

  return {
    ...result,
    data: sortedData
  };
}

/**
 * Hook for fetching today's appointments for a provider
 */
export function useTodayAppointments(providerId?: string) {
  const stableProviderId = providerId || 'current-provider';

  const result = useApi<Appointment[]>(
    () => appointmentsService.getToday(stableProviderId),
    [stableProviderId]
  );

  // Sort by time
  const sortedData = useMemo(() => {
    if (!result.data) return [];
    return [...result.data].sort(
      (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }, [result.data]);

  // Group by status
  const groupedData = useMemo(() => {
    const completed = sortedData.filter((a) => a.status === 'completed');
    const upcoming = sortedData.filter((a) =>
    ['pending', 'confirmed', 'in_progress'].includes(a.status)
    );
    return { completed, upcoming, all: sortedData };
  }, [sortedData]);

  return {
    ...result,
    data: sortedData,
    grouped: groupedData
  };
}

/**
 * Hook for fetching past appointments
 * Parameters are optional - defaults to current user as patient
 */
export function usePastAppointments(
userId?: string,
role: 'patient' | 'provider' = 'patient')
{
  return useApi<Appointment[]>(
    () => appointmentsService.getPast(userId || 'current-user', role),
    [userId, role]
  );
}

/**
 * Hook for fetching appointment stats
 */
export function useAppointmentStats(
userId?: string,
role?: 'patient' | 'provider')
{
  return useApi(
    () => appointmentsService.getStats(userId, role),
    [userId, role]
  );
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Hook for creating a new appointment
 */
export function useCreateAppointment() {
  return useMutation(appointmentsService.create);
}

/**
 * Hook for updating an appointment
 */
export function useUpdateAppointment() {
  return useMutation(
    ({ id, data }: {id: string;data: Partial<Appointment>;}) =>
    appointmentsService.update(id, data)
  );
}

/**
 * Hook for confirming an appointment
 */
export function useConfirmAppointment() {
  return useMutation(appointmentsService.confirm);
}

/**
 * Hook for starting an appointment
 */
export function useStartAppointment() {
  return useMutation(appointmentsService.start);
}

/**
 * Hook for completing an appointment
 */
export function useCompleteAppointment() {
  return useMutation(
    ({ id, validationCode }: {id: string;validationCode: string;}) =>
    appointmentsService.complete(id, validationCode)
  );
}

/**
 * Hook for cancelling an appointment
 */
export function useCancelAppointment() {
  return useMutation(({ id, reason }: {id: string;reason?: string;}) =>
  appointmentsService.cancel(id, reason)
  );
}

/**
 * Hook for rating an appointment
 */
export function useRateAppointment() {
  return useMutation(
    ({ id, rating, review }: {id: string;rating: number;review?: string;}) =>
    appointmentsService.rate(id, rating, review)
  );
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook for appointment status helpers
 */
export function useAppointmentStatus(status: AppointmentStatus) {
  return useMemo(() => {
    const statusConfig: Record<
      AppointmentStatus,
      {
        label: string;
        color: string;
        bgColor: string;
        borderColor: string;
      }> =
    {
      pending: {
        label: 'En attente',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/50'
      },
      confirmed: {
        label: 'Confirmé',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/50'
      },
      in_progress: {
        label: 'En cours',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500/50'
      },
      completed: {
        label: 'Terminé',
        color: 'text-green-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/50'
      },
      cancelled: {
        label: 'Annulé',
        color: 'text-red-500',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50'
      },
      no_show: {
        label: 'Absent',
        color: 'text-slate-500',
        bgColor: 'bg-slate-500/20',
        borderColor: 'border-slate-500/50'
      }
    };

    return statusConfig[status] || statusConfig.pending;
  }, [status]);
}

/**
 * Hook for formatting appointment date/time
 */
export function useAppointmentDateTime(scheduledAt: string) {
  return useMemo(() => {
    const date = new Date(scheduledAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    let dateLabel: string;
    if (appointmentDate.getTime() === today.getTime()) {
      dateLabel = "Aujourd'hui";
    } else if (appointmentDate.getTime() === tomorrow.getTime()) {
      dateLabel = 'Demain';
    } else {
      dateLabel = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }

    const timeLabel = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const isPast = date < now;
    const isToday = appointmentDate.getTime() === today.getTime();
    const isTomorrow = appointmentDate.getTime() === tomorrow.getTime();

    return {
      date,
      dateLabel,
      timeLabel,
      fullLabel: `${dateLabel} à ${timeLabel}`,
      isPast,
      isToday,
      isTomorrow,
      isUpcoming: !isPast
    };
  }, [scheduledAt]);
}