/**
 * Services Feature — API Service
 *
 * Pure Axios calls for the public service catalog.
 * Zero mock branching — MSW handles interception during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';

import {
  PatientServiceCatalogResponseSchema,
  PatientServiceDetailResponseSchema,
  ServiceCategoryGroupResponseSchema,
} from './schema';

import type {
  PatientServiceCatalogResponse,
  PatientServiceDetailResponse,
  ServiceCategoryGroupResponse,
} from './schema';

// ============================================
// PARAM TYPES
// ============================================

export interface CatalogParams {
  displayGroup?: string;
  category?: string;
  providerId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDesc?: boolean;
  page?: number;
  limit?: number;
}

// ============================================
// CATALOG QUERIES
// ============================================

/** Paginated service catalog — GET /service-catalog */
export async function getServiceCatalog(
  params?: CatalogParams,
): Promise<PatientServiceCatalogResponse> {
  const raw = await api.get<PatientServiceCatalogResponse>('/service-catalog', {
    params: {
      displayGroup: params?.displayGroup,
      category: params?.category,
      providerId: params?.providerId,
      search: params?.search,
      minPrice: params?.minPrice,
      maxPrice: params?.maxPrice,
      sortBy: params?.sortBy ?? 'createdAt',
      sortDesc: params?.sortDesc ?? true,
      page: params?.page ?? 1,
      limit: params?.limit ?? 12,
    },
  });
  return PatientServiceCatalogResponseSchema.parse(raw);
}

/** Single service detail — GET /service-catalog/:id */
export async function getServiceDetail(serviceId: string): Promise<PatientServiceDetailResponse> {
  const raw = await api.get<PatientServiceDetailResponse>(`/service-catalog/${serviceId}`);
  return PatientServiceDetailResponseSchema.parse(raw);
}

/** Category groups — GET /service-catalog/categories */
export async function getServiceCategories(): Promise<ServiceCategoryGroupResponse[]> {
  const raw = await api.get<ServiceCategoryGroupResponse[]>('/service-catalog/categories');
  return z.array(ServiceCategoryGroupResponseSchema).parse(raw);
}

/** Services by type — delegates to catalog query with category filter. */
export async function getServicesByType(
  serviceType: string,
): Promise<PatientServiceCatalogResponse> {
  return getServiceCatalog({ category: serviceType });
}

/** Services with optional category filter — GET /service-catalog?category=... */
export async function getServices(category?: string): Promise<PatientServiceCatalogResponse> {
  const raw = await api.get<PatientServiceCatalogResponse>('/service-catalog', {
    params: category ? { category, page: 1, limit: 50 } : { page: 1, limit: 50 },
  });
  return PatientServiceCatalogResponseSchema.parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const serviceService = {
  getServiceCatalog,
  getServiceDetail,
  getServiceCategories,
  getServicesByType,
  getServices,
};
