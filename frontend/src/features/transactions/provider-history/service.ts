import { api } from '@/api/client';
import {
  ProviderPaymentHistoryResponseSchema,
  ProviderPaymentHistoryStatsSchema,
} from '@/features/transactions/provider-history/schema';

import type {
  ProviderPaymentHistoryResponse,
  ProviderPaymentHistoryStats,
  ProviderPaymentHistoryStatus,
} from '@/features/transactions/provider-history/schema';

export const providerPaymentHistorySortOptions = {
  createdAtDesc: 'createdAt desc',
  processedAtDesc: 'processedAt desc',
} as const;

export type ProviderPaymentHistorySort =
  (typeof providerPaymentHistorySortOptions)[keyof typeof providerPaymentHistorySortOptions];

export interface ProviderPaymentHistoryFilters {
  page?: number;
  limit?: number;
  status?: ProviderPaymentHistoryStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: ProviderPaymentHistorySort;
}

export async function getMyProviderPaymentHistory(
  filters?: ProviderPaymentHistoryFilters,
): Promise<ProviderPaymentHistoryResponse> {
  const raw = await api.get<ProviderPaymentHistoryResponse>('/providers/me/payment-history', {
    params: filters,
  });

  return ProviderPaymentHistoryResponseSchema.parse(raw);
}

export async function getMyProviderPaymentHistoryStats(): Promise<ProviderPaymentHistoryStats> {
  const raw = await api.get<ProviderPaymentHistoryStats>('/providers/me/payment-history/stats');
  return ProviderPaymentHistoryStatsSchema.parse(raw);
}

export const providerPaymentHistoryService = {
  getMyProviderPaymentHistory,
  getMyProviderPaymentHistoryStats,
};
