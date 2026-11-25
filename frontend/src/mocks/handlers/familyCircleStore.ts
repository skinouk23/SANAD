import type { AddFamilyMemberRequest, FamilyMemberResponse } from '@/features/family-circle/schema';

const seededFamilyMembers: FamilyMemberResponse[] = [
  {
    id: '60000000-0000-4000-8000-000000000001',
    firstName: 'Fatma',
    lastName: 'Ben Ali',
    relationship: 'Spouse',
    dateOfBirth: { year: 1982, month: 5, day: 15 },
    gender: 'female',
    email: 'fatma.benali@email.tn',
    medicalHistory: null,
    allergies: null,
    currentMedications: null,
    addedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '60000000-0000-4000-8000-000000000002',
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    relationship: 'Child',
    dateOfBirth: { year: 2005, month: 9, day: 20 },
    gender: 'male',
    email: null,
    medicalHistory: null,
    allergies: 'Arachides',
    currentMedications: null,
    addedAt: '2024-01-10T10:00:00Z',
  },
];

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function createMockUuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
}

function normalizeNullableString(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

let currentFamilyMembers = cloneDeep(seededFamilyMembers);

export function getFamilyCircleMembers(): FamilyMemberResponse[] {
  return cloneDeep(currentFamilyMembers);
}

export function addFamilyCircleMember(data: AddFamilyMemberRequest): FamilyMemberResponse {
  const nextMember: FamilyMemberResponse = {
    id: createMockUuid(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    relationship: data.relationship.trim(),
    email: normalizeNullableString(data.email),
    dateOfBirth: data.dateOfBirth ?? null,
    gender: normalizeNullableString(data.gender),
    medicalHistory: normalizeNullableString(data.medicalHistory),
    allergies: normalizeNullableString(data.allergies),
    currentMedications: normalizeNullableString(data.currentMedications),
    addedAt: new Date().toISOString(),
  };

  currentFamilyMembers = [...currentFamilyMembers, cloneDeep(nextMember)];

  return cloneDeep(nextMember);
}

export function removeFamilyCircleMember(memberId: string): boolean {
  const previousCount = currentFamilyMembers.length;
  currentFamilyMembers = currentFamilyMembers.filter((member) => member.id !== memberId);

  return currentFamilyMembers.length !== previousCount;
}
