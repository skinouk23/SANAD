import { api } from '@/api/client';
import { FinanceTimelineResponseSchema } from '@/features/finance-timeline/schema';

import type { FinanceTimelineResponse } from '@/features/finance-timeline/schema';

export const financeTimelineSortOptions = {
  occurredAtDesc: 'occurredAt desc',
  createdAtDesc: 'createdAt desc',
} as const;

export type FinanceTimelineSort =
  (typeof financeTimelineSortOptions)[keyof typeof financeTimelineSortOptions];

export interface FinanceTimelineFilters {
  providerId?: string;
  bookingId?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sort?: FinanceTimelineSort;
}

export async function getMyFinanceTimeline(
  filters?: FinanceTimelineFilters,
): Promise<FinanceTimelineResponse> {
  const raw = await api.get<FinanceTimelineResponse>('/me/finance/timeline', {
    params: filters,
  });

  return FinanceTimelineResponseSchema.parse(raw);
}

export async function getBookingFinanceTimeline(
  bookingId: string,
  filters?: Omit<FinanceTimelineFilters, 'bookingId'>,
): Promise<FinanceTimelineResponse> {
  const raw = await api.get<FinanceTimelineResponse>(`/bookings/${bookingId}/finance/timeline`, {
    params: filters,
  });

  return FinanceTimelineResponseSchema.parse(raw);
}

export const financeTimelineService = {
  getMyFinanceTimeline,
  getBookingFinanceTimeline,
};
