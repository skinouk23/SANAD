/**
 * Family Circle Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Uses real API calls through the feature service.
 * useMutation from TanStack Query for add/remove operations.
 */

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyMembersOptions } from '@/features/family-circle/options';
import { familyCircleKeys } from '@/features/family-circle/keys';
import { addFamilyMember, removeFamilyMember } from '@/features/family-circle/service';
import type { FamilyMemberResponse, AddFamilyMemberRequest } from '@/features/family-circle/schema';

// ============================================
// TYPES
// ============================================

export interface FamilyMemberView {
  id: string;
  name: string;
  initial: string;
  role: string;
  email?: string | null;
}

// ============================================
// HELPERS
// ============================================

function mapFamilyMember(member: FamilyMemberResponse): FamilyMemberView {
  const fullName = `${member.firstName} ${member.lastName}`.trim();

  return {
    id: member.id,
    name: fullName,
    initial: fullName.charAt(0).toUpperCase(),
    role: member.relationship,
    email: member.email ?? null,
  };
}

// ============================================
// HOOKS
// ============================================

/**
 * Fetch and manage family circle members.
 * Includes add/remove mutations with automatic cache invalidation.
 */
export function useFamilyCircle() {
  const queryClient = useQueryClient();
  const query = useQuery(familyMembersOptions());

  const addMemberMutation = useMutation({
    mutationFn: (data: AddFamilyMemberRequest) => addFamilyMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyCircleKeys.members() });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeFamilyMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyCircleKeys.members() });
    },
  });

  const members = useMemo(() => (query.data ?? []).map(mapFamilyMember), [query.data]);

  return {
    data: members,
    rawData: query.data ?? [],
    loading: query.isLoading,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
    refetch: query.refetch,
    addMember: addMemberMutation.mutate,
    addMemberLoading: addMemberMutation.isPending,
    addMemberError: addMemberMutation.error,
    removeMember: removeMemberMutation.mutate,
    removeMemberLoading: removeMemberMutation.isPending,
    removeMemberError: removeMemberMutation.error,
  };
}

/** Alias for backward compatibility. */
export const useFamilyMembers = useFamilyCircle;

/**
 * Add family member mutation hook (standalone).
 */
export function useAddFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFamilyMemberRequest) => addFamilyMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyCircleKeys.members() });
    },
  });
}

/**
 * Remove family member mutation hook (standalone).
 */
export function useRemoveFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeFamilyMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyCircleKeys.members() });
    },
  });
}

/**
 * Wrapper hook for patient family members.
 * Matches the old usePatientFamilyMembers signature.
 */
export function usePatientFamilyMembers() {
  const familyCircle = useFamilyCircle();

  const addMember = useCallback(
    async (member: { name: string; email?: string; role: string }) => {
      const parts = member.name.trim().split(/\s+/);
      const firstName = parts[0] ?? member.name;
      const lastName = parts.slice(1).join(' ') || firstName;

      familyCircle.addMember({
        firstName,
        lastName,
        relationship: member.role,
        email: member.email?.trim() ? member.email.trim() : null,
      });
    },
    [familyCircle],
  );

  const removeMember = useCallback(
    async (id: string) => {
      familyCircle.removeMember(id);
    },
    [familyCircle],
  );

  return {
    members: familyCircle.data,
    loading: familyCircle.loading,
    isInitialLoading: familyCircle.isInitialLoading,
    isRefreshing: familyCircle.isRefreshing,
    error: familyCircle.error,
    addMember,
    addMemberLoading: familyCircle.addMemberLoading,
    removeMember,
    removeMemberLoading: familyCircle.removeMemberLoading,
    refetch: familyCircle.refetch,
  };
}
