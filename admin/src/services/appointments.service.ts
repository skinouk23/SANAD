/**
 * Appointments Service
 * Handles all appointment-related API calls
 */

import { api } from '../api/client';
import { env } from '../config/env';
import {
  generateAppointments,
  generateAppointment,
  generatePatients,
  generateProviders } from
'../data/mock/generators';
import type {
  Appointment,
  AppointmentStatus,
  PaginatedResponse,
  PaginationParams } from
'../types/api.types';

// ============================================
// MOCK DATA CACHE
// ============================================

let mockAppointments: Appointment[] | null = null;

function getMockAppointments(): Appointment[] {
  if (!mockAppointments) {
    const patients = generatePatients(20);
    const providers = generateProviders(10);
    mockAppointments = generateAppointments(50, patients, providers);
  }
  return mockAppointments;
}

// ============================================
// FILTERS
// ============================================

export interface AppointmentFilters extends PaginationParams {
  status?: AppointmentStatus | AppointmentStatus[];
  patientId?: string;
  providerId?: string;
  startDate?: string;
  endDate?: string;
  upcoming?: boolean;
  past?: boolean;
}

// ============================================
// APPOINTMENT ENDPOINTS
// ============================================

export async function getAppointments(
filters?: AppointmentFilters)
: Promise<Appointment[]> {
  if (env.ENABLE_MOCK_DATA) {
    let appointments = [...getMockAppointments()];
    const now = new Date();

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ?
      filters.status :
      [filters.status];
      appointments = appointments.filter((a) => statuses.includes(a.status));
    }

    // For mock data, skip patientId/providerId filtering if it's a generic user ID
    // This allows mock data to be displayed for demo purposes
    if (filters?.patientId && filters.patientId !== 'current-user') {
      appointments = appointments.filter(
        (a) => a.patientId === filters.patientId
      );
    }

    if (filters?.providerId && filters.providerId !== 'current-provider') {
      appointments = appointments.filter(
        (a) => a.providerId === filters.providerId
      );
    }

    if (filters?.upcoming) {
      appointments = appointments.filter((a) => new Date(a.scheduledAt) > now);
    }

    if (filters?.past) {
      appointments = appointments.filter((a) => new Date(a.scheduledAt) <= now);
    }

    if (filters?.startDate) {
      appointments = appointments.filter(
        (a) => new Date(a.scheduledAt) >= new Date(filters.startDate!)
      );
    }

    if (filters?.endDate) {
      appointments = appointments.filter(
        (a) => new Date(a.scheduledAt) <= new Date(filters.endDate!)
      );
    }

    // Sort by scheduled date
    appointments.sort(
      (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

    console.log('[Mock] getAppointments:', {
      filters,
      count: appointments.length
    });
    return appointments;
  }

  try {
    console.log('[API] Fetching appointments:', filters);
    return await api.get<Appointment[]>('/appointments', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockAppointments();
  }
}

export async function getAppointmentsPaginated(
filters?: AppointmentFilters)
: Promise<PaginatedResponse<Appointment>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  const allAppointments = await getAppointments(filters);
  const total = allAppointments.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = allAppointments.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function getAppointmentById(
appointmentId: string)
: Promise<Appointment | null> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockAppointments().find((a) => a.id === appointmentId) || null;
  }

  try {
    return await api.get<Appointment>(`/appointments/${appointmentId}`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockAppointments().find((a) => a.id === appointmentId) || null;
  }
}

export async function getUpcomingAppointments(
userId: string,
role: 'patient' | 'provider')
: Promise<Appointment[]> {
  const filters: AppointmentFilters = {
    upcoming: true,
    status: ['pending', 'confirmed']
  };

  if (role === 'patient') {
    filters.patientId = userId;
  } else {
    filters.providerId = userId;
  }

  console.log('[Service] getUpcomingAppointments:', { userId, role, filters });
  return getAppointments(filters);
}

export async function getTodayAppointments(
providerId: string)
: Promise<Appointment[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getAppointments({
    providerId,
    startDate: today.toISOString(),
    endDate: tomorrow.toISOString()
  });
}

export async function getPastAppointments(
userId: string,
role: 'patient' | 'provider')
: Promise<Appointment[]> {
  const filters: AppointmentFilters = {
    past: true,
    status: ['completed', 'cancelled', 'no_show']
  };

  if (role === 'patient') {
    filters.patientId = userId;
  } else {
    filters.providerId = userId;
  }

  console.log('[Service] getPastAppointments:', { userId, role, filters });
  return getAppointments(filters);
}

// ============================================
// APPOINTMENT ACTIONS
// ============================================

export async function createAppointment(data: {
  patientId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  address?: string;
  notes?: string;
}): Promise<Appointment | null> {
  if (env.ENABLE_MOCK_DATA) {
    const newAppointment = generateAppointment(undefined, undefined, {
      ...data,
      status: 'pending',
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    getMockAppointments().push(newAppointment);
    return newAppointment;
  }

  try {
    return await api.post<Appointment>('/appointments', data);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function updateAppointment(
appointmentId: string,
data: Partial<Appointment>)
: Promise<Appointment | null> {
  if (env.ENABLE_MOCK_DATA) {
    const appointments = getMockAppointments();
    const index = appointments.findIndex((a) => a.id === appointmentId);
    if (index !== -1) {
      appointments[index] = {
        ...appointments[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return appointments[index];
    }
    return null;
  }

  try {
    return await api.patch<Appointment>(`/appointments/${appointmentId}`, data);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function confirmAppointment(
appointmentId: string)
: Promise<Appointment | null> {
  const validationCode = Math.floor(1000 + Math.random() * 9000).toString();
  return updateAppointment(appointmentId, {
    status: 'confirmed',
    validationCode
  });
}

export async function startAppointment(
appointmentId: string)
: Promise<Appointment | null> {
  return updateAppointment(appointmentId, {
    status: 'in_progress'
  });
}

export async function completeAppointment(
appointmentId: string,
validationCode: string)
: Promise<Appointment | null> {
  if (env.ENABLE_MOCK_DATA) {
    const appointment = getMockAppointments().find(
      (a) => a.id === appointmentId
    );
    if (appointment && appointment.validationCode === validationCode) {
      return updateAppointment(appointmentId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        validatedAt: new Date().toISOString()
      });
    }
    return null;
  }

  try {
    return await api.post<Appointment>(
      `/appointments/${appointmentId}/complete`,
      { validationCode }
    );
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function cancelAppointment(
appointmentId: string,
reason?: string)
: Promise<Appointment | null> {
  return updateAppointment(appointmentId, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason
  });
}

export async function rateAppointment(
appointmentId: string,
rating: number,
review?: string)
: Promise<Appointment | null> {
  return updateAppointment(appointmentId, {
    rating,
    review
  });
}

// ============================================
// APPOINTMENT STATS
// ============================================

export interface AppointmentStats {
  total: number;
  completed: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  noShow: number;
  todayCount: number;
  weekCount: number;
  completionRate: number;
}

export async function getAppointmentStats(
userId?: string,
role?: 'patient' | 'provider')
: Promise<AppointmentStats> {
  const filters: AppointmentFilters = {};
  if (userId && role) {
    if (role === 'patient') {
      filters.patientId = userId;
    } else {
      filters.providerId = userId;
    }
  }

  const appointments = await getAppointments(filters);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const completed = appointments.filter((a) => a.status === 'completed').length;
  const total = appointments.length;

  return {
    total,
    completed,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    noShow: appointments.filter((a) => a.status === 'no_show').length,
    todayCount: appointments.filter((a) => new Date(a.scheduledAt) >= today).
    length,
    weekCount: appointments.filter((a) => new Date(a.scheduledAt) >= weekAgo).
    length,
    completionRate: total > 0 ? Math.round(completed / total * 100) : 0
  };
}

// ============================================
// SERVICE EXPORT
// ============================================

export const appointmentsService = {
  getAll: getAppointments,
  getPaginated: getAppointmentsPaginated,
  getById: getAppointmentById,
  getUpcoming: getUpcomingAppointments,
  getToday: getTodayAppointments,
  getPast: getPastAppointments,
  create: createAppointment,
  update: updateAppointment,
  confirm: confirmAppointment,
  start: startAppointment,
  complete: completeAppointment,
  cancel: cancelAppointment,
  rate: rateAppointment,
  getStats: getAppointmentStats
};

export default appointmentsService;