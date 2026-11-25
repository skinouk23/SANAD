/**
 * Laboratory Schemas
 * Zod schemas for laboratory listing and test types.
 * Matches: Laboratory and PopularTest from useLaboratory.ts.
 */

import { z } from 'zod';

// ============================================
// LABORATORY
// ============================================

export const LaboratorySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  distance: z.string(),
  rating: z.number(),
  reviews: z.number(),
  phone: z.string(),
  hours: z.string(),
  services: z.array(z.string()),
  priceRange: z.string(),
  image: z.string(),
  homeService: z.boolean(),
});

// ============================================
// POPULAR TEST
// ============================================

export const PopularTestSchema = z.object({
  name: z.string(),
  price: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type Laboratory = z.infer<typeof LaboratorySchema>;
export type PopularTest = z.infer<typeof PopularTestSchema>;
