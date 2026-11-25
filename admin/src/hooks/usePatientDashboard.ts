/**
 * Patient Dashboard Hooks
 * Custom React hooks for patient dashboard data (validations, family members)
 */

import { useState, useCallback } from 'react';

// ============================================
// TYPES
// ============================================

export interface PendingValidation {
  id: string;
  providerName: string;
  providerImage: string;
  serviceName: string;
  amount: number;
  date: string;
  time: string;
  hoursAgo: number;
  autoValidationIn: string;
}

export interface PatientFamilyMember {
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

const MOCK_PENDING_VALIDATIONS: PendingValidation[] = [
{
  id: 'apt_123',
  providerName: 'Amira Mansour',
  providerImage: '👩‍⚕️',
  serviceName: 'Soins Infirmiers - Injection',
  amount: 40,
  date: '15 Jan 2025',
  time: '14:30',
  hoursAgo: 2,
  autoValidationIn: '46h'
},
{
  id: 'apt_124',
  providerName: 'Dr. Karim Jebali',
  providerImage: '👨‍⚕️',
  serviceName: 'Kinésithérapie',
  amount: 65,
  date: '14 Jan 2025',
  time: '10:00',
  hoursAgo: 26,
  autoValidationIn: '22h'
}];


const MOCK_PATIENT_FAMILY: PatientFamilyMember[] = [
{
  id: '1',
  name: 'Myriam',
  initial: 'M',
  email: 'myriam@example.com',
  role: 'Fille',
  color: 'bg-white text-teal-600'
},
{
  id: '2',
  name: 'Sami',
  initial: 'S',
  email: 'sami@example.com',
  role: 'Fils',
  color: 'bg-rose-100 text-rose-600'
}];


// ============================================
// HOOKS
// ============================================

/**
 * Hook for managing pending validations with validate/remove mutations
 */
export function usePendingValidations() {
  const [validations, setValidations] = useState<PendingValidation[]>(
    MOCK_PENDING_VALIDATIONS
  );

  const removeValidation = useCallback((id: string) => {
    setValidations((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const getValidation = useCallback(
    (id: string) => {
      return validations.find((v) => v.id === id) || null;
    },
    [validations]
  );

  return {
    data: validations,
    loading: false,
    error: null,
    removeValidation,
    getValidation
  };
}

/**
 * Hook for managing patient family members (non-cyber version)
 */
export function usePatientFamilyMembers() {
  const [members, setMembers] =
  useState<PatientFamilyMember[]>(MOCK_PATIENT_FAMILY);

  const addMember = useCallback(
    (member: Omit<PatientFamilyMember, 'id' | 'initial'>) => {
      const colors = [
      'bg-blue-100 text-blue-600',
      'bg-purple-100 text-purple-600',
      'bg-amber-100 text-amber-600',
      'bg-green-100 text-green-600'];

      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newMember: PatientFamilyMember = {
        id: Date.now().toString(),
        name: member.name,
        initial: member.name.charAt(0).toUpperCase(),
        email: member.email,
        role: member.role,
        color: randomColor
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
    members,
    loading: false,
    error: null,
    addMember,
    removeMember
  };
}