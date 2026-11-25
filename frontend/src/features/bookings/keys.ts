/**
 * Booking Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   bookingKeys.all        → invalidate everything booking-related
 *   bookingKeys.lists()    → invalidate all list queries
 *   bookingKeys.list(f)    → invalidate one filtered list
 *   bookingKeys.details()  → invalidate all detail queries
 *   bookingKeys.detail(id) → invalidate one detail
 */

import type { BookingFilters, BookingSessionFilters } from './service';

export const bookingKeys = {
  all: ['bookings'] as const,

  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters?: BookingFilters) => [...bookingKeys.lists(), filters ?? {}] as const,

  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,

  quotes: () => [...bookingKeys.all, 'quote'] as const,
  quote: (request: Record<string, unknown>) => [...bookingKeys.quotes(), request] as const,

  stats: () => [...bookingKeys.all, 'stats'] as const,

  upcoming: () => [...bookingKeys.all, 'upcoming'] as const,

  upcomingSessions: () => [...bookingKeys.upcoming(), 'session'] as const,

  today: () => [...bookingKeys.all, 'today'] as const,

  providerDashboardToday: () => [...bookingKeys.all, 'providerDashboardToday'] as const,

  sessions: () => [...bookingKeys.all, 'session'] as const,
  sessionLists: () => [...bookingKeys.sessions(), 'list'] as const,
  sessionList: (filters?: BookingSessionFilters) =>
    [...bookingKeys.sessionLists(), filters ?? {}] as const,
  sessionDetails: () => [...bookingKeys.sessions(), 'detail'] as const,
  sessionDetail: (id: string) => [...bookingKeys.sessionDetails(), id] as const,
  providerSessionDeliveries: () => [...bookingKeys.sessions(), 'providerDelivery'] as const,
  providerSessionDelivery: (id: string) =>
    [...bookingKeys.providerSessionDeliveries(), id] as const,

  past: () => [...bookingKeys.all, 'past'] as const,

  pastSessions: () => [...bookingKeys.past(), 'session'] as const,
} as const;
