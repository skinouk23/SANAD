/**
 * Users Service
 * Handles patient and provider API calls used by this frontend.
 *
 * Mock data is provided by MSW handlers (src/mocks/handlers/users.ts).
 * This module contains only real API calls — no inline mock branching.
 */

import { z } from 'zod';
import type { SilentErrorConfig } from '@/api/client';

import { api } from '@/api/client';
import {
  MyPatientProfileResponseSchema,
  PatientStatsResponseSchema,
  PatientPreferencesResponseSchema,
  PatientFavoriteResponseSchema,
  PatientFavoriteSlimResponseSchema,
  FamilyMemberResponseSchema,
} from '@/features/family-circle/schema';
import { AdminPatientSchema, AdminProviderSchema } from '@/features/users/schema';
import { ProviderProfileResponseSchema } from '@/features/providers/schema';
import { safeParseResponse } from '@/shared/schemas/api.schema';
import type {
  MyPatientProfileResponse,
  PatientStatsResponse,
  PatientPreferencesResponse,
  PatientFavoriteResponse,
  PatientFavoriteSlimResponse,
  AddFavoriteRequest,
  UpdatePatientPreferencesRequest,
  FamilyMemberResponse,
  AddFamilyMemberRequest,
  UpdatePatientProfileRequest,
} from '@/features/family-circle/schema';
import type { ProviderProfileResponse } from '@/features/providers/schema';
import type { AdminPatient, AdminProvider } from '@/features/users/schema';
import type {
  UserRole,
  UserStatus,
  UserSegment,
  PaginatedResponse,
  PaginationParams,
} from '@/shared/schemas';
import { paginatedResponseSchema } from '@/shared/schemas/common';

function createSilentMutationConfig(): SilentErrorConfig {
  return { _silentError: true };
}

// ============================================
// USER FILTERS
// ============================================

export interface UserFilters extends PaginationParams {
  role?: UserRole;
  status?: UserStatus;
  segment?: UserSegment;
  search?: string;
}

export interface ProviderFilters extends UserFilters {
  providerType?: string;
  available?: boolean;
  minRating?: number;
  city?: string;
}

// ============================================
// PATIENT SELF-SERVICE ENDPOINTS
// ============================================

export async function getCurrentPatient(): Promise<MyPatientProfileResponse | null> {
  const raw = await api.get<MyPatientProfileResponse>('/patients/me');
  return raw ? MyPatientProfileResponseSchema.parse(raw) : null;
}

export async function updateCurrentPatient(
  data: UpdatePatientProfileRequest,
): Promise<MyPatientProfileResponse | null> {
  const raw = await api.put<MyPatientProfileResponse>(
    '/patients/me',
    data,
    createSilentMutationConfig(),
  );
  return raw ? MyPatientProfileResponseSchema.parse(raw) : null;
}

/** @deprecated Use updateCurrentPatient instead */
export async function updatePatient(
  patientId: string,
  data: Partial<AdminPatient>,
): Promise<AdminPatient | null> {
  const raw = await api.patch<AdminPatient>(`/patients/${patientId}`, data);
  return raw ? AdminPatientSchema.parse(raw) : null;
}

export async function getPatientStats(): Promise<PatientStatsResponse | null> {
  const raw = await api.get<PatientStatsResponse>('/patients/me/stats');
  return raw ? PatientStatsResponseSchema.parse(raw) : null;
}

export async function getPatientFavorites(): Promise<PatientFavoriteResponse[]> {
  const raw = await api.get<PatientFavoriteResponse[]>('/patients/me/favorites');
  return z.array(PatientFavoriteResponseSchema).parse(raw);
}

export async function addPatientFavorite(
  request: AddFavoriteRequest,
): Promise<PatientFavoriteSlimResponse | null> {
  const raw = await api.post<PatientFavoriteSlimResponse>('/patients/me/favorites', request);
  return raw ? PatientFavoriteSlimResponseSchema.parse(raw) : null;
}

export async function removePatientFavorite(providerId: string): Promise<void> {
  await api.delete(`/patients/me/favorites/${providerId}`);
}

export async function getPatientPreferences(): Promise<PatientPreferencesResponse | null> {
  const raw = await api.get<PatientPreferencesResponse>('/patients/me/preferences');
  return raw ? PatientPreferencesResponseSchema.parse(raw) : null;
}

export async function updatePatientPreferences(
  data: UpdatePatientPreferencesRequest,
): Promise<PatientPreferencesResponse | null> {
  const raw = await api.put<PatientPreferencesResponse>(
    '/patients/me/preferences',
    data,
    createSilentMutationConfig(),
  );
  return raw ? PatientPreferencesResponseSchema.parse(raw) : null;
}

export async function getFamilyCircle(): Promise<FamilyMemberResponse[]> {
  const raw = await api.get<FamilyMemberResponse[]>('/patients/me/family-circle');
  return z.array(FamilyMemberResponseSchema).parse(raw);
}

export async function addFamilyMember(
  data: AddFamilyMemberRequest,
): Promise<FamilyMemberResponse | null> {
  const raw = await api.post<FamilyMemberResponse>('/patients/me/family-circle', data);
  return raw ? FamilyMemberResponseSchema.parse(raw) : null;
}

export async function removeFamilyMember(memberId: string): Promise<void> {
  await api.delete(`/patients/me/family-circle/${memberId}`);
}

// ============================================
// PATIENT DIRECTORY ENDPOINTS
// ============================================

export async function getPatients(filters?: UserFilters): Promise<AdminPatient[]> {
  const raw = await api.get<AdminPatient[]>('/patients', { params: filters });
  return z.array(AdminPatientSchema).parse(raw);
}

export async function getPatientsPaginated(
  filters?: UserFilters,
): Promise<PaginatedResponse<AdminPatient>> {
  const raw = await api.get<PaginatedResponse<AdminPatient>>('/patients', {
    params: { ...filters, page: filters?.page || 1, limit: filters?.limit || 10 },
  });
  return paginatedResponseSchema(AdminPatientSchema).parse(raw) as PaginatedResponse<AdminPatient>;
}

export async function getPatientById(patientId: string): Promise<AdminPatient | null> {
  const raw = await api.get<AdminPatient>(`/patients/${patientId}`);
  return raw ? AdminPatientSchema.parse(raw) : null;
}

// ============================================
// PROVIDER DIRECTORY ENDPOINTS
// ============================================

export async function getProvidersList(filters?: ProviderFilters): Promise<AdminProvider[]> {
  const raw = await api.get<AdminProvider[]>('/providers', { params: filters });
  return z.array(AdminProviderSchema).parse(raw);
}

export async function getProvidersPaginatedList(
  filters?: ProviderFilters,
): Promise<PaginatedResponse<AdminProvider>> {
  const raw = await api.get<PaginatedResponse<AdminProvider>>('/providers', {
    params: { ...filters, page: filters?.page || 1, limit: filters?.limit || 10 },
  });
  return paginatedResponseSchema(AdminProviderSchema).parse(
    raw,
  ) as PaginatedResponse<AdminProvider>;
}

export async function getProviderByIdFromService(
  providerId: string,
): Promise<AdminProvider | null> {
  const raw = await api.get<AdminProvider>(`/providers/${providerId}`);
  return raw ? AdminProviderSchema.parse(raw) : null;
}

/**
 * @deprecated Prefer `getMyProviderProfile()` from `@/features/providers/service`.
 * This function validates against the backend's actual ProviderProfileResponse shape
 * using safeParseResponse so callers don't break during the transition (fixes #4).
 */
export async function getCurrentProvider(): Promise<ProviderProfileResponse | null> {
  const raw = await api.get<ProviderProfileResponse>('/providers/me');
  return raw
    ? safeParseResponse<ProviderProfileResponse>(
        ProviderProfileResponseSchema,
        raw,
        'getCurrentProvider',
      )
    : null;
}

export async function updateProvider(
  providerId: string,
  data: Partial<AdminProvider>,
): Promise<AdminProvider | null> {
  const raw = await api.patch<AdminProvider>(`/providers/${providerId}`, data);
  return raw ? AdminProviderSchema.parse(raw) : null;
}

export async function updateProviderAvailabilityStatus(
  providerId: string,
  available: boolean,
): Promise<AdminProvider | null> {
  return updateProvider(providerId, { available });
}

// ============================================
// SERVICE EXPORT
// ============================================

export const usersService = {
  // Patient self-service
  getCurrentPatient,
  updateCurrentPatient,
  getPatientStats,
  getPatientFavorites,
  addPatientFavorite,
  removePatientFavorite,
  getPatientPreferences,
  updatePatientPreferences,
  getFamilyCircle,
  addFamilyMember,
  removeFamilyMember,

  // Admin patient list
  getPatients,
  getPatientsPaginated,
  getPatientById,
  updatePatient,

  // Providers
  getProviders: getProvidersList,
  getProvidersPaginated: getProvidersPaginatedList,
  getProviderById: getProviderByIdFromService,
  getCurrentProvider,
  updateProvider,
  updateProviderAvailability: updateProviderAvailabilityStatus,
};

export default usersService;
