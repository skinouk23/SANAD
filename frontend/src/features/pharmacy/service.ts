/**
 * Pharmacy Service
 *
 * Pure API client for the pharmacy domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 *
 * Combines patient-side orders (from usePharmacy.ts) and
 * provider-side orders (from usePharmacyOrders.ts).
 */

import { z } from 'zod';
import { api } from '@/api/client';
import { fetchAuthenticatedFileContentByPath } from '@/shared/lib/files/file-content';
import {
  PharmacyOrderSchema,
  PharmacyOrderStatsSchema,
  ProviderPharmacyOrderSchema,
} from './schema';
import type { PharmacyOrder, PharmacyOrderStats, ProviderPharmacyOrder } from './schema';
import type { FileContentResponse } from '@/shared/lib/files/file-content';

// ============================================
// FILTER TYPE
// ============================================

export type PharmacyOrderFilter = 'all' | 'active' | 'completed';

function encodeId(id: string): string {
  return encodeURIComponent(id);
}

// ============================================
// PATIENT-SIDE QUERIES
// ============================================

/** Fetch patient pharmacy orders, optionally filtered. */
export async function getPharmacyOrders(filter?: PharmacyOrderFilter): Promise<PharmacyOrder[]> {
  const params: Record<string, string> = {};
  if (filter && filter !== 'all') params.filter = filter;
  const raw = await api.get<PharmacyOrder[]>('/pharmacy/orders', { params });
  return z.array(PharmacyOrderSchema).parse(raw);
}

/** Fetch patient pharmacy order stats. */
export async function getPharmacyOrderStats(): Promise<PharmacyOrderStats> {
  const raw = await api.get<PharmacyOrderStats>('/pharmacy/orders/stats');
  return PharmacyOrderStatsSchema.parse(raw);
}

// ============================================
// PROVIDER-SIDE QUERIES
// ============================================

/** Fetch provider-side pharmacy orders list. */
export async function getPharmacyOrdersList(): Promise<ProviderPharmacyOrder[]> {
  const raw = await api.get<ProviderPharmacyOrder[]>('/pharmacy/provider-orders');
  return z.array(ProviderPharmacyOrderSchema).parse(raw);
}

/** Fetch the assigned provider's prescription content for one pharmacy order. */
export async function getProviderPharmacyOrderPrescriptionContent(
  orderId: string,
  signal?: AbortSignal,
): Promise<FileContentResponse> {
  return fetchAuthenticatedFileContentByPath(
    `/pharmacy/provider-orders/${encodeId(orderId)}/prescription/content`,
    signal,
  );
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const pharmacyService = {
  getPharmacyOrders,
  getPharmacyOrderStats,
  getPharmacyOrdersList,
  getProviderPharmacyOrderPrescriptionContent,
};
