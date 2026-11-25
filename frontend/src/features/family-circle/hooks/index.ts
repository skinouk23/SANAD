/**
 * Family Circle Hooks — barrel re-export
 */

export {
  useFamilyCircle,
  useFamilyMembers,
  useAddFamilyMember,
  useRemoveFamilyMember,
  usePatientFamilyMembers,
} from './useFamilyCircle';

// Re-export types for consumer convenience
export type { FamilyMemberView } from './useFamilyCircle';
export type { FamilyMemberResponse, AddFamilyMemberRequest } from '@/features/family-circle/schema';
