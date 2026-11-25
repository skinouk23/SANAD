import { api } from '@/api/client';
import {
  CreateAndSubmitProviderWalletTopUpInputSchema,
  ProviderWalletPaginatedMovementsSchema,
  ProviderWalletLedgerEntrySchema,
  ProviderWalletStatsSchema,
  ProviderWalletSummarySchema,
  ProviderWalletTopUpRequestSchema,
} from '@/features/provider-wallet/schema';

import type {
  CreateAndSubmitProviderWalletTopUpInput,
  ProviderWalletLedgerEntry,
  ProviderWalletMovementType,
  ProviderWalletPaginatedMovements,
  ProviderWalletStats,
  ProviderWalletSummary,
  ProviderWalletTopUpRequest,
} from '@/features/provider-wallet/schema';

// ============================================
// FILTER TYPES
// ============================================

export interface ProviderWalletMovementsFilters {
  page?: number;
  limit?: number;
  type?: ProviderWalletMovementType;
  search?: string;
  month?: number;
  year?: number;
}

// ============================================
// QUERIES
// ============================================

export async function getProviderWalletSummary(): Promise<ProviderWalletSummary> {
  const raw = await api.get<ProviderWalletSummary>('/providers/me/wallet');
  return ProviderWalletSummarySchema.parse(raw);
}

export async function getProviderWalletStats(): Promise<ProviderWalletStats> {
  const raw = await api.get<ProviderWalletStats>('/providers/me/wallet/stats');
  return ProviderWalletStatsSchema.parse(raw);
}

export async function getProviderWalletTopUps(): Promise<ProviderWalletTopUpRequest[]> {
  const raw = await api.get<ProviderWalletTopUpRequest[]>('/providers/me/wallet/top-ups');
  return ProviderWalletTopUpRequestSchema.array().parse(raw);
}

export async function getProviderWalletLedger(): Promise<ProviderWalletLedgerEntry[]> {
  const raw = await api.get<ProviderWalletLedgerEntry[]>('/providers/me/wallet/ledger');
  return ProviderWalletLedgerEntrySchema.array().parse(raw);
}

export async function getProviderWalletMovements(
  filters?: ProviderWalletMovementsFilters,
): Promise<ProviderWalletPaginatedMovements> {
  const raw = await api.get<ProviderWalletPaginatedMovements>('/providers/me/wallet/movements', {
    params: filters,
  });

  return ProviderWalletPaginatedMovementsSchema.parse(raw);
}

// ============================================
// MUTATIONS
// ============================================

export async function createAndSubmitProviderWalletTopUp(
  input: CreateAndSubmitProviderWalletTopUpInput,
  idempotencyKey: string,
): Promise<ProviderWalletTopUpRequest> {
  const payload = CreateAndSubmitProviderWalletTopUpInputSchema.parse({
    ...input,
    currency: 'TND',
  });
  const raw = await api.post<ProviderWalletTopUpRequest>(
    '/providers/me/wallet/top-ups/submit',
    payload,
    {
      headers: { 'Idempotency-Key': idempotencyKey },
    },
  );

  return ProviderWalletTopUpRequestSchema.parse(raw);
}

// ============================================
// SERVICE OBJECT
// ============================================

export const providerWalletService = {
  getProviderWalletSummary,
  getProviderWalletStats,
  getProviderWalletTopUps,
  getProviderWalletLedger,
  getProviderWalletMovements,
  createAndSubmitProviderWalletTopUp,
};
