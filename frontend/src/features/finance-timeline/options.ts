import { queryOptions } from '@tanstack/react-query';

import { financeTimelineKeys } from '@/features/finance-timeline/keys';
import {
  financeTimelineSortOptions,
  getBookingFinanceTimeline,
  getMyFinanceTimeline,
} from '@/features/finance-timeline/service';

import type {
  FinanceTimelineFilters,
  FinanceTimelineSort,
} from '@/features/finance-timeline/service';

export const defaultFinanceTimelineFilters: Required<
  Pick<FinanceTimelineFilters, 'page' | 'limit' | 'sort'>
> = {
  page: 1,
  limit: 20,
  sort: financeTimelineSortOptions.occurredAtDesc,
};

function normalizeFilterValue(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeSort(sort?: FinanceTimelineSort): FinanceTimelineSort {
  if (!sort) {
    return defaultFinanceTimelineFilters.sort;
  }

  return sort === financeTimelineSortOptions.createdAtDesc
    ? financeTimelineSortOptions.createdAtDesc
    : financeTimelineSortOptions.occurredAtDesc;
}

export function normalizeFinanceTimelineFilters(
  filters?: FinanceTimelineFilters,
): FinanceTimelineFilters {
  const page =
    filters?.page && filters.page > 0 ? filters.page : defaultFinanceTimelineFilters.page;
  const limit =
    filters?.limit && filters.limit > 0 ? filters.limit : defaultFinanceTimelineFilters.limit;

  return {
    page,
    limit,
    sort: normalizeSort(filters?.sort),
    ...(normalizeFilterValue(filters?.providerId)
      ? { providerId: normalizeFilterValue(filters?.providerId) }
      : {}),
    ...(normalizeFilterValue(filters?.bookingId)
      ? { bookingId: normalizeFilterValue(filters?.bookingId) }
      : {}),
    ...(normalizeFilterValue(filters?.type) ? { type: normalizeFilterValue(filters?.type) } : {}),
    ...(normalizeFilterValue(filters?.status)
      ? { status: normalizeFilterValue(filters?.status) }
      : {}),
    ...(normalizeFilterValue(filters?.dateFrom)
      ? { dateFrom: normalizeFilterValue(filters?.dateFrom) }
      : {}),
    ...(normalizeFilterValue(filters?.dateTo)
      ? { dateTo: normalizeFilterValue(filters?.dateTo) }
      : {}),
  };
}

export function myFinanceTimelineOptions(filters?: FinanceTimelineFilters) {
  const normalizedFilters = normalizeFinanceTimelineFilters(filters);

  return queryOptions({
    queryKey: financeTimelineKeys.my(normalizedFilters),
    queryFn: () => getMyFinanceTimeline(normalizedFilters),
  });
}

export function bookingFinanceTimelineOptions(
  bookingId: string,
  filters?: Omit<FinanceTimelineFilters, 'bookingId'>,
) {
  const normalizedFilters = normalizeFinanceTimelineFilters(filters);

  return queryOptions({
    queryKey: financeTimelineKeys.booking(bookingId, normalizedFilters),
    queryFn: () => getBookingFinanceTimeline(bookingId, normalizedFilters),
    enabled: Boolean(bookingId),
  });
}
