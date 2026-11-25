/**
 * Delivery Service
 *
 * Pure API client for the delivery domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { getProviderSessionDelivery } from '@/features/bookings/service';
import { ProviderDeliverySchema } from './schema';
import type { ProviderDelivery } from './schema';

// ============================================
// DELIVERY QUERIES
// ============================================

/** Fetch provider delivery aggregate details for a booking session. */
export async function getProviderDelivery(sessionId: string): Promise<ProviderDelivery> {
  const raw = await getProviderSessionDelivery(sessionId);
  return ProviderDeliverySchema.parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const deliveryService = {
  getProviderDelivery,
};
