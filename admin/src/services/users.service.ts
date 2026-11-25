/**
 * Users Service
 * Handles all user-related API calls (patients, providers, admins)
 */

import { api } from '../api/client';
import { env } from '../config/env';
import {
  generatePatients,
  generateProviders,
  generatePatient,
  generateProvider } from
'../data/mock/generators';
import type {
  User,
  Patient,
  Provider,
  UserRole,
  UserStatus,
  UserSegment,
  PaginatedResponse,
  PaginationParams } from
'../types/api.types';

// ============================================
// MOCK DATA CACHE
// ============================================

let mockPatients: Patient[] | null = null;
let mockProviders: Provider[] | null = null;

function getMockPatients(): Patient[] {
  if (!mockPatients) {
    mockPatients = generatePatients(50);
  }
  return mockPatients;
}

function getMockProviders(): Provider[] {
  if (!mockProviders) {
    mockProviders = generateProviders(30);
  }
  return mockProviders;
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

// ============================================
// PATIENT ENDPOINTS
// ============================================

export async function getPatients(filters?: UserFilters): Promise<Patient[]> {
  if (env.ENABLE_MOCK_DATA) {
    let patients = getMockPatients();

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      patients = patients.filter(
        (p) =>
        p.name.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search)
      );
    }

    if (filters?.status) {
      patients = patients.filter((p) => p.status === filters.status);
    }

    if (filters?.segment) {
      patients = patients.filter((p) => p.segment === filters.segment);
    }

    return patients;
  }

  try {
    return await api.get<Patient[]>('/patients', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockPatients();
  }
}

export async function getPatientsPaginated(
filters?: UserFilters)
: Promise<PaginatedResponse<Patient>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  if (env.ENABLE_MOCK_DATA) {
    const allPatients = await getPatients(filters);
    const total = allPatients.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = allPatients.slice(start, start + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  try {
    return await api.get<PaginatedResponse<Patient>>('/patients', {
      params: { ...filters, page, limit }
    });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    const allPatients = await getPatients(filters);
    const total = allPatients.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = allPatients.slice(start, start + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}

export async function getPatientById(
patientId: string)
: Promise<Patient | null> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockPatients().find((p) => p.id === patientId) || null;
  }

  try {
    return await api.get<Patient>(`/patients/${patientId}`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockPatients().find((p) => p.id === patientId) || null;
  }
}

export async function getCurrentPatient(): Promise<Patient | null> {
  if (env.ENABLE_MOCK_DATA) {
    // Return a consistent "current user" for mock data
    const patients = getMockPatients();
    return (
      patients[0] ||
      generatePatient({ name: 'Mohamed Ben Ali', email: 'mohamed@email.com' }));

  }

  try {
    return await api.get<Patient>('/patients/me');
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return generatePatient({
      name: 'Mohamed Ben Ali',
      email: 'mohamed@email.com'
    });
  }
}

export async function updatePatient(
patientId: string,
data: Partial<Patient>)
: Promise<Patient | null> {
  if (env.ENABLE_MOCK_DATA) {
    const patients = getMockPatients();
    const index = patients.findIndex((p) => p.id === patientId);
    if (index !== -1) {
      patients[index] = {
        ...patients[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return patients[index];
    }
    return null;
  }

  try {
    return await api.patch<Patient>(`/patients/${patientId}`, data);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

// ============================================
// PROVIDER ENDPOINTS
// ============================================

export interface ProviderFilters extends UserFilters {
  providerType?: string;
  available?: boolean;
  minRating?: number;
  city?: string;
}

export async function getProvidersList(
filters?: ProviderFilters)
: Promise<Provider[]> {
  if (env.ENABLE_MOCK_DATA) {
    let providers = getMockProviders();

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      providers = providers.filter(
        (p) =>
        p.name.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        p.specialties.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (filters?.status) {
      providers = providers.filter((p) => p.status === filters.status);
    }

    if (filters?.providerType) {
      providers = providers.filter(
        (p) => p.providerType === filters.providerType
      );
    }

    if (filters?.available !== undefined) {
      providers = providers.filter((p) => p.available === filters.available);
    }

    if (filters?.minRating) {
      providers = providers.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters?.city) {
      providers = providers.filter((p) => p.location?.city === filters.city);
    }

    return providers;
  }

  try {
    return await api.get<Provider[]>('/providers', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockProviders();
  }
}

export async function getProvidersPaginatedList(
filters?: ProviderFilters)
: Promise<PaginatedResponse<Provider>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  if (env.ENABLE_MOCK_DATA) {
    const allProviders = await getProvidersList(filters);
    const total = allProviders.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = allProviders.slice(start, start + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  try {
    return await api.get<PaginatedResponse<Provider>>('/providers', {
      params: { ...filters, page, limit }
    });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    const allProviders = await getProvidersList(filters);
    const total = allProviders.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = allProviders.slice(start, start + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}

export async function getProviderByIdFromService(
providerId: string)
: Promise<Provider | null> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockProviders().find((p) => p.id === providerId) || null;
  }

  try {
    return await api.get<Provider>(`/providers/${providerId}`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockProviders().find((p) => p.id === providerId) || null;
  }
}

export async function getCurrentProvider(): Promise<Provider | null> {
  if (env.ENABLE_MOCK_DATA) {
    const providers = getMockProviders();
    return (
      providers[0] ||
      generateProvider({ name: 'Amel Ben Youssef', providerType: 'nurse' }));

  }

  try {
    return await api.get<Provider>('/providers/me');
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return generateProvider({ name: 'Amel Ben Youssef', providerType: 'nurse' });
  }
}

export async function updateProvider(
providerId: string,
data: Partial<Provider>)
: Promise<Provider | null> {
  if (env.ENABLE_MOCK_DATA) {
    const providers = getMockProviders();
    const index = providers.findIndex((p) => p.id === providerId);
    if (index !== -1) {
      providers[index] = {
        ...providers[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return providers[index];
    }
    return null;
  }

  try {
    return await api.patch<Provider>(`/providers/${providerId}`, data);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function updateProviderAvailabilityStatus(
providerId: string,
available: boolean)
: Promise<Provider | null> {
  return updateProvider(providerId, { available });
}

// ============================================
// ADMIN USER MANAGEMENT
// ============================================

export async function getAllUsers(filters?: UserFilters): Promise<User[]> {
  if (env.ENABLE_MOCK_DATA) {
    const patients = getMockPatients() as User[];
    const providers = getMockProviders() as User[];
    let users = [...patients, ...providers];

    if (filters?.role) {
      users = users.filter((u) => u.role === filters.role);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(
        (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    return users;
  }

  try {
    return await api.get<User[]>('/admin/users', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return [...getMockPatients(), ...getMockProviders()];
  }
}

export async function getUsersPaginated(
filters?: UserFilters)
: Promise<PaginatedResponse<User>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  const allUsers = await getAllUsers(filters);
  const total = allUsers.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = allUsers.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function suspendUser(
userId: string,
reason?: string)
: Promise<boolean> {
  if (env.ENABLE_MOCK_DATA) {
    // Simulate suspension
    return true;
  }

  try {
    await api.post(`/admin/users/${userId}/suspend`, { reason });
    return true;
  } catch (error) {
    console.warn('API call failed:', error);
    return false;
  }
}

export async function activateUser(userId: string): Promise<boolean> {
  if (env.ENABLE_MOCK_DATA) {
    return true;
  }

  try {
    await api.post(`/admin/users/${userId}/activate`);
    return true;
  } catch (error) {
    console.warn('API call failed:', error);
    return false;
  }
}

// ============================================
// SERVICE EXPORT
// ============================================

export const usersService = {
  // Patients
  getPatients,
  getPatientsPaginated,
  getPatientById,
  getCurrentPatient,
  updatePatient,

  // Providers
  getProviders: getProvidersList,
  getProvidersPaginated: getProvidersPaginatedList,
  getProviderById: getProviderByIdFromService,
  getCurrentProvider,
  updateProvider,
  updateProviderAvailability: updateProviderAvailabilityStatus,

  // Admin
  getAllUsers,
  getUsersPaginated,
  suspendUser,
  activateUser
};

export default usersService;