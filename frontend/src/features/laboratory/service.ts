/**
 * Laboratory Service
 *
 * Pure API client for the laboratory domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';
import { LaboratorySchema, PopularTestSchema } from './schema';
import type { Laboratory, PopularTest } from './schema';

// ============================================
// LABORATORY QUERIES
// ============================================

/** Fetch list of laboratories. */
export async function getLaboratoryList(): Promise<Laboratory[]> {
  const raw = await api.get<Laboratory[]>('/laboratory');
  return z.array(LaboratorySchema).parse(raw);
}

/** Fetch popular tests. */
export async function getPopularTests(): Promise<PopularTest[]> {
  const raw = await api.get<PopularTest[]>('/laboratory/popular-tests');
  return z.array(PopularTestSchema).parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const laboratoryService = {
  getLaboratoryList,
  getPopularTests,
};
