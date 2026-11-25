/**
 * Providers Service
 * Handles all provider-related API calls with fallback to mock data
 */

import { api } from '../api/client';
import { env } from '../config/env';
import {
  providersData,
  getProvidersByCountry,
  getProviderById as getProviderByIdFromData,
  filterProviders as filterProvidersFromData,
  searchProviders as searchProvidersFromData,
  getAvailableProviders as getAvailableProvidersFromData,
  getTopRatedProviders as getTopRatedProvidersFromData } from
'../data/providers.data';
import type {
  Provider,
  ProviderFilters,
  ServiceType,
  PaginatedResponse } from
'../types';

/**
 * Get all providers with optional filters
 */
export async function getProviders(
filters?: ProviderFilters)
: Promise<Provider[]> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return filterProvidersFromData(filters || {}, env.COUNTRY_CODE);
  }

  try {
    const response = await api.get<Provider[]>('/providers', {
      params: {
        countryCode: env.COUNTRY_CODE,
        ...filters
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return filterProvidersFromData(filters || {}, env.COUNTRY_CODE);
  }
}

/**
 * Get paginated providers
 */
export async function getProvidersPaginated(
filters?: ProviderFilters)
: Promise<PaginatedResponse<Provider>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    const allProviders = filterProvidersFromData(
      { ...filters, page: undefined, limit: undefined },
      env.COUNTRY_CODE
    );
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
    const response = await api.get<PaginatedResponse<Provider>>('/providers', {
      params: {
        countryCode: env.COUNTRY_CODE,
        page,
        limit,
        ...filters
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);

    const allProviders = filterProvidersFromData(
      { ...filters, page: undefined, limit: undefined },
      env.COUNTRY_CODE
    );
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

/**
 * Get a single provider by ID
 */
export async function getProviderById(
providerId: string)
: Promise<Provider | null> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getProviderByIdFromData(providerId) || null;
  }

  try {
    const response = await api.get<Provider>(`/providers/${providerId}`);
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getProviderByIdFromData(providerId) || null;
  }
}

/**
 * Get providers by service type
 */
export async function getProvidersByServiceType(
serviceType: ServiceType)
: Promise<Provider[]> {
  return getProviders({ serviceType });
}

/**
 * Search providers by name or specialty
 */
export async function searchProviders(query: string): Promise<Provider[]> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return searchProvidersFromData(query, env.COUNTRY_CODE);
  }

  try {
    const response = await api.get<Provider[]>('/providers/search', {
      params: {
        q: query,
        countryCode: env.COUNTRY_CODE
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return searchProvidersFromData(query, env.COUNTRY_CODE);
  }
}

/**
 * Get available providers for a service type
 */
export async function getAvailableProviders(
serviceType: ServiceType)
: Promise<Provider[]> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getAvailableProvidersFromData(serviceType, env.COUNTRY_CODE);
  }

  try {
    const response = await api.get<Provider[]>('/providers/available', {
      params: {
        serviceType,
        countryCode: env.COUNTRY_CODE
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getAvailableProvidersFromData(serviceType, env.COUNTRY_CODE);
  }
}

/**
 * Get top-rated providers
 */
export async function getTopRatedProviders(
limit: number = 5)
: Promise<Provider[]> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getTopRatedProvidersFromData(limit, env.COUNTRY_CODE);
  }

  try {
    const response = await api.get<Provider[]>('/providers/top-rated', {
      params: {
        limit,
        countryCode: env.COUNTRY_CODE
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getTopRatedProvidersFromData(limit, env.COUNTRY_CODE);
  }
}

/**
 * Get nearby providers (requires geolocation)
 */
export async function getNearbyProviders(
latitude: number,
longitude: number,
radiusKm: number = 10,
serviceType?: ServiceType)
: Promise<Provider[]> {
  // For mock data, just return filtered providers (no real geolocation)
  if (env.ENABLE_MOCK_DATA) {
    return getProviders({ serviceType, available: true });
  }

  try {
    const response = await api.get<Provider[]>('/providers/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
        serviceType,
        countryCode: env.COUNTRY_CODE
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getProviders({ serviceType, available: true });
  }
}

/**
 * Update provider availability status
 */
export async function updateProviderAvailability(
providerId: string,
available: boolean)
: Promise<Provider | null> {
  // Mock data doesn't support updates
  if (env.ENABLE_MOCK_DATA) {
    const provider = getProviderByIdFromData(providerId);
    if (provider) {
      return { ...provider, available };
    }
    return null;
  }

  try {
    const response = await api.patch<Provider>(
      `/providers/${providerId}/availability`,
      {
        available
      }
    );
    return response;
  } catch (error) {
    console.warn('API call failed:', error);
    // Return mock updated provider
    const provider = getProviderByIdFromData(providerId);
    if (provider) {
      return { ...provider, available };
    }
    return null;
  }
}

/**
 * Get provider schedule/availability slots
 */
export async function getProviderSchedule(
providerId: string,
startDate: string,
endDate: string)
: Promise<any[]> {
  // Mock schedule data
  if (env.ENABLE_MOCK_DATA) {
    return generateMockSchedule(startDate, endDate);
  }

  try {
    const response = await api.get<any[]>(`/providers/${providerId}/schedule`, {
      params: { startDate, endDate }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return generateMockSchedule(startDate, endDate);
  }
}

/**
 * Generate mock schedule data
 */
function generateMockSchedule(startDate: string, endDate: string): any[] {
  const slots = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0) continue;

    const dateStr = d.toISOString().split('T')[0];

    // Morning slots
    slots.push({ date: dateStr, time: '09:00', available: Math.random() > 0.3 });
    slots.push({ date: dateStr, time: '10:00', available: Math.random() > 0.3 });
    slots.push({ date: dateStr, time: '11:00', available: Math.random() > 0.3 });

    // Afternoon slots
    slots.push({ date: dateStr, time: '14:00', available: Math.random() > 0.3 });
    slots.push({ date: dateStr, time: '15:00', available: Math.random() > 0.3 });
    slots.push({ date: dateStr, time: '16:00', available: Math.random() > 0.3 });
    slots.push({ date: dateStr, time: '17:00', available: Math.random() > 0.3 });
  }

  return slots;
}

/**
 * Get ambulance providers
 */
export async function getAmbulanceProviders(
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'ambulance' });
}

/**
 * Get laboratory providers
 */
export async function getLaboratories(
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'laboratory' });
}

/**
 * Get radiology centers
 */
export async function getRadiologyCenters(
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'radiology' });
}

/**
 * Get pharmacy providers
 */
export async function getPharmacies(
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'pharmacy' });
}

/**
 * Get nutrition providers
 */
export async function getNutritionProviders(
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'nutrition' });
}

/**
 * Get funeral service providers
 */
export async function getFuneralServices(
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'funeral' });
}

/**
 * Get gym providers
 */
export async function getGyms(filters?: ProviderFilters): Promise<Provider[]> {
  return getProviders({ ...filters, serviceType: 'gym' });
}

/**
 * Get care providers by specific type
 */
export async function getCareProviders(
serviceType: ServiceType,
filters?: ProviderFilters)
: Promise<Provider[]> {
  return getProviders({ ...filters, serviceType });
}

/**
 * Providers service object for convenient access
 */
export const providersService = {
  getAll: getProviders,
  getPaginated: getProvidersPaginated,
  getById: getProviderById,
  getByServiceType: getProvidersByServiceType,
  search: searchProviders,
  getAvailable: getAvailableProviders,
  getTopRated: getTopRatedProviders,
  getNearby: getNearbyProviders,
  updateAvailability: updateProviderAvailability,
  getSchedule: getProviderSchedule,
  // Specialized getters
  getAmbulanceProviders,
  getLaboratories,
  getRadiologyCenters,
  getPharmacies,
  getNutritionProviders,
  getFuneralServices,
  getGyms,
  getCareProviders
};

export default providersService;