/**
 * Insurance Schemas
 * Zod schemas for provider insurance types.
 * Matches: CoverageSection, InsuranceClaim, InsuranceDocument,
 * InsuranceStats from useInsurance.ts.
 */

import { z } from 'zod';

// ============================================
// COVERAGE
// ============================================

export const CoverageItemSchema = z.object({
  text: z.string(),
  limit: z.string(),
});

export const CoverageSectionSchema = z.object({
  category: z.string(),
  items: z.array(CoverageItemSchema),
});

// ============================================
// CLAIMS
// ============================================

export const InsuranceClaimStatusSchema = z.enum(['resolved', 'in-progress', 'pending']);

export const InsuranceClaimSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  type: z.string(),
  status: InsuranceClaimStatusSchema,
  amount: z.number(),
  description: z.string(),
});

// ============================================
// DOCUMENTS
// ============================================

export const InsuranceDocumentSchema = z.object({
  name: z.string(),
  size: z.string(),
  date: z.string(),
});

// ============================================
// STATS
// ============================================

export const InsuranceStatsSchema = z.object({
  status: z.string(),
  validUntil: z.string(),
  maxCoverage: z.string(),
  claimsCount: z.number(),
  franchise: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type CoverageItem = z.infer<typeof CoverageItemSchema>;
export type CoverageSection = z.infer<typeof CoverageSectionSchema>;
export type InsuranceClaim = z.infer<typeof InsuranceClaimSchema>;
export type InsuranceDocument = z.infer<typeof InsuranceDocumentSchema>;
export type InsuranceStats = z.infer<typeof InsuranceStatsSchema>;
