/**
 * Insurance Service
 *
 * Pure API client for the insurance domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';
import {
  CoverageSectionSchema,
  InsuranceClaimSchema,
  InsuranceDocumentSchema,
  InsuranceStatsSchema,
} from './schema';
import type { CoverageSection, InsuranceClaim, InsuranceDocument, InsuranceStats } from './schema';

// ============================================
// INSURANCE QUERIES
// ============================================

/** Fetch insurance coverage details. */
export async function getInsuranceCoverage(): Promise<CoverageSection[]> {
  const raw = await api.get<CoverageSection[]>('/insurance/coverage');
  return z.array(CoverageSectionSchema).parse(raw);
}

/** Fetch insurance claims. */
export async function getInsuranceClaims(): Promise<InsuranceClaim[]> {
  const raw = await api.get<InsuranceClaim[]>('/insurance/claims');
  return z.array(InsuranceClaimSchema).parse(raw);
}

/** Fetch insurance documents. */
export async function getInsuranceDocuments(): Promise<InsuranceDocument[]> {
  const raw = await api.get<InsuranceDocument[]>('/insurance/documents');
  return z.array(InsuranceDocumentSchema).parse(raw);
}

/** Fetch insurance stats. */
export async function getInsuranceStats(): Promise<InsuranceStats> {
  const raw = await api.get<InsuranceStats>('/insurance/stats');
  return InsuranceStatsSchema.parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const insuranceService = {
  getInsuranceCoverage,
  getInsuranceClaims,
  getInsuranceDocuments,
  getInsuranceStats,
};
