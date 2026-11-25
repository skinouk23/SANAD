import type { LucideIcon } from 'lucide-react';

export type ViewMode = 'day' | 'week' | 'month';
export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'rejected'
  | 'completed'
  | 'disputed'
  | 'no_show';
export type AppointmentType = 'home' | 'video';

export interface CalendarAppointment {
  id: string;
  bookingId: string;
  sessionId: string;
  date: Date;
  patientName: string;
  service: string;
  timeLabel: string;
  durationMinutes: number;
  startMinutes: number;
  endMinutes: number;
  status: AppointmentStatus;
  type: AppointmentType;
  location: string;
  canApprove: boolean;
  canReject: boolean;
  canOpenDelivery: boolean;
  totalSessions: number | null;
  validatedSessions: number | null;
  remainingSessions: number | null;
}

export interface CalendarBlockedInterval {
  id: string;
  date: Date;
  startMinutes: number;
  endMinutes: number;
  reason: string;
}

export interface ScheduleEditorInterval {
  localId: string;
  id?: string;
  serviceId?: string | null;
  startTime: string;
  endTime: string;
}

export interface ScheduleEditorDay {
  dayOfWeek: number;
  enabled: boolean;
  intervals: ScheduleEditorInterval[];
}

export interface ScheduleStat {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient?: string;
}

export interface AppointmentStatusLabels {
  approve: string;
  cancelled: string;
  completed: string;
  confirmed: string;
  disputed: string;
  noShow: string;
  pending: string;
  reject: string;
  rejected: string;
  startDelivery: string;
}

export interface SchedulePlanningLabels {
  blocked: string;
  commonError: string;
  commonNoData: string;
  dayLabels: Record<number, string>;
  pending: string;
  slotBlocked: string;
  teleconsultation: string;
  today: string;
  confirmed: string;
  invalidTimeRange: string;
}
