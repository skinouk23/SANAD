/**
 * Services Service
 * Handles all service-related API calls with fallback to mock data
 */

import { api } from '../api/client';
import { env } from '../config/env';
import {
  servicesData,
  getServicesByCountry,
  getServiceById as getServiceByIdFromData,
  getServiceByType as getServiceByTypeFromData,
  getServicesByCategory as getServicesByCategoryFromData } from
'../data/services.data';
import type { Service, ServiceType } from '../types';

/**
 * Get all services
 */
export async function getServices(): Promise<Service[]> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getServicesByCountry(env.COUNTRY_CODE);
  }

  try {
    const response = await api.get<Service[]>('/services', {
      params: {
        countryCode: env.COUNTRY_CODE
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getServicesByCountry(env.COUNTRY_CODE);
  }
}

/**
 * Get service by ID
 */
export async function getServiceById(
serviceId: string)
: Promise<Service | null> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getServiceByIdFromData(serviceId) || null;
  }

  try {
    const response = await api.get<Service>(`/services/${serviceId}`);
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getServiceByIdFromData(serviceId) || null;
  }
}

/**
 * Get service by type
 */
export async function getServiceByType(
serviceType: ServiceType)
: Promise<Service | null> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getServiceByTypeFromData(serviceType) || null;
  }

  try {
    const response = await api.get<Service>(`/services/type/${serviceType}`);
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getServiceByTypeFromData(serviceType) || null;
  }
}

/**
 * Get services by category
 */
export async function getServicesByCategory(
category: string)
: Promise<Service[]> {
  // Use mock data if enabled
  if (env.ENABLE_MOCK_DATA) {
    return getServicesByCategoryFromData(category, env.COUNTRY_CODE);
  }

  try {
    const response = await api.get<Service[]>('/services', {
      params: {
        category,
        countryCode: env.COUNTRY_CODE
      }
    });
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getServicesByCategoryFromData(category, env.COUNTRY_CODE);
  }
}

export const servicesService = {
  getAll: getServices,
  getById: getServiceById,
  getByType: getServiceByType,
  getByCategory: getServicesByCategory
};

export default servicesService;