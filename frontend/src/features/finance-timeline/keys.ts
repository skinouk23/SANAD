import type { FinanceTimelineFilters } from '@/features/finance-timeline/service';

export const financeTimelineKeys = {
  all: ['finance-timeline'] as const,
  myRoot: () => [...financeTimelineKeys.all, 'me'] as const,
  my: (filters?: FinanceTimelineFilters) =>
    [...financeTimelineKeys.myRoot(), filters ?? {}] as const,
  adminRoot: () => [...financeTimelineKeys.all, 'admin'] as const,
  admin: (filters?: FinanceTimelineFilters) =>
    [...financeTimelineKeys.adminRoot(), filters ?? {}] as const,
  bookingRoot: (bookingId: string) => [...financeTimelineKeys.all, 'booking', bookingId] as const,
  booking: (bookingId: string, filters?: Omit<FinanceTimelineFilters, 'bookingId'>) =>
    [...financeTimelineKeys.bookingRoot(bookingId), filters ?? {}] as const,
} as const;
