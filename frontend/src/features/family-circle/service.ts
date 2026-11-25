/**
 * Family Circle Service
 *
 * Pure API client for the family-circle domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';
import { FamilyMemberResponseSchema } from './schema';
import type { FamilyMemberResponse, AddFamilyMemberRequest } from './schema';

// ============================================
// FAMILY CIRCLE QUERIES
// ============================================

/** Fetch family circle members for the current patient. */
export async function getFamilyMembers(): Promise<FamilyMemberResponse[]> {
  const raw = await api.get<FamilyMemberResponse[]>('/patients/me/family-circle');
  return z.array(FamilyMemberResponseSchema).parse(raw);
}

/** Add a new family member. */
export async function addFamilyMember(data: AddFamilyMemberRequest): Promise<FamilyMemberResponse> {
  const raw = await api.post<FamilyMemberResponse>('/patients/me/family-circle', data);
  return FamilyMemberResponseSchema.parse(raw);
}

/** Remove a family member by ID. */
export async function removeFamilyMember(memberId: string): Promise<void> {
  await api.delete(`/patients/me/family-circle/${memberId}`);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const familyCircleService = {
  getFamilyMembers,
  addFamilyMember,
  removeFamilyMember,
};
