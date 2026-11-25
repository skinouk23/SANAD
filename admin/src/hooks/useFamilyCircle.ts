/**
 * Family Circle Hooks
 * Custom React hooks for family circle/sharing data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useState, useCallback } from 'react';
import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface FamilyMember {
  id: string;
  name: string;
  initial: string;
  email: string;
  role: string;
  color: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockFamilyMembers: FamilyMember[] = [
{
  id: '1',
  name: 'Myriam',
  initial: 'M',
  email: 'myriam@example.com',
  role: 'Fille',
  color: 'from-cyan-500 to-blue-500'
},
{
  id: '2',
  name: 'Sami',
  initial: 'S',
  email: 'sami@example.com',
  role: 'Fils',
  color: 'from-rose-500 to-pink-500'
}];


// ============================================
// HOOKS
// ============================================

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  const addMember = useCallback(
    (member: Omit<FamilyMember, 'id' | 'initial'>) => {
      const newMember: FamilyMember = {
        ...member,
        id: Date.now().toString(),
        initial: member.name.charAt(0).toUpperCase()
      };
      setMembers((prev) => [...prev, newMember]);
      return newMember;
    },
    []
  );

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    data: members,
    loading: false,
    error: null,
    addMember,
    removeMember
  };
}