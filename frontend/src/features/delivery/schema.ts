/**
 * Delivery Schemas
 * Provider delivery types for the session-backed active delivery page.
 */

import { z } from 'zod';
import {
  ProviderDeliveryLocationSchema,
  ProviderSessionDeliveryResponseSchema,
} from '@/features/bookings/schema';

// ============================================
// PATIENT LOCATION
// ============================================

export const PatientLocationSchema = z.object({
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
});

// ============================================
// PROVIDER DELIVERY
// ============================================

export const ProviderDeliverySchema = ProviderSessionDeliveryResponseSchema.extend({
  location: ProviderDeliveryLocationSchema,
});

// ============================================
// INFERRED TYPES
// ============================================

export type PatientLocation = z.infer<typeof PatientLocationSchema>;
export type ProviderDelivery = z.infer<typeof ProviderDeliverySchema>;
