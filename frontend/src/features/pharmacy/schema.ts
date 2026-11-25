/**
 * Pharmacy Schemas
 * Zod schemas for pharmacy order types.
 * Combines patient-side (usePharmacy.ts) and provider-side (usePharmacyOrders.ts) shapes.
 */

import { z } from 'zod';
import { uuidSchema } from '@/shared/schemas/common';

// ============================================
// PATIENT-SIDE ORDER (from usePharmacy.ts)
// ============================================

export const PharmacyOrderStatusSchema = z.enum(['pending', 'processing', 'delivery', 'completed']);

export const PharmacyOrderSchema = z.object({
  id: z.string(),
  pharmacyName: z.string(),
  date: z.string(),
  status: PharmacyOrderStatusSchema,
  amount: z.string().optional(),
  items: z.string(),
  prescriptionPreview: z.string().optional(),
});

// ============================================
// PATIENT-SIDE ORDER STATS
// ============================================

export const PharmacyOrderStatsSchema = z.object({
  activeCount: z.number(),
  completedCount: z.number(),
  totalSpent: z.string(),
});

// ============================================
// PROVIDER-SIDE ORDER (from usePharmacyOrders.ts)
// ============================================

export const ProviderPharmacyOrderSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  date: z.string(),
  status: z.string(),
  items: z.string(),
  prescriptionFileId: uuidSchema,
  address: z.string(),
  phone: z.string(),
  amount: z.string().optional(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type PharmacyOrder = z.infer<typeof PharmacyOrderSchema>;
export type PharmacyOrderStats = z.infer<typeof PharmacyOrderStatsSchema>;
export type ProviderPharmacyOrder = z.infer<typeof ProviderPharmacyOrderSchema>;
