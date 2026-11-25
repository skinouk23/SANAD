/**
 * Equipment Service
 *
 * Pure API client for the equipment domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';

import {
  EquipmentCategoryResponseSchema,
  EquipmentCatalogResponseSchema,
  EquipmentDetailResponseSchema,
} from './schema';

import type {
  EquipmentCategoryResponse,
  EquipmentResponse,
  EquipmentCatalogResponse,
  EquipmentDetailResponse,
} from './schema';

// ============================================
// FILTER TYPES
// ============================================

export interface EquipmentFilters {
  page?: number;
  limit?: number;
  category?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

// ============================================
// EQUIPMENT QUERIES
// ============================================

/** Fetch a flat list of equipment (unwraps paginated items). */
export async function getEquipment(filters?: EquipmentFilters): Promise<EquipmentResponse[]> {
  const raw = await api.get<EquipmentCatalogResponse>('/equipment/catalog', {
    params: {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 12,
      category: filters?.category,
      search: filters?.search,
      sortBy: filters?.sortBy,
      sortDesc: filters?.sortDesc,
      available: filters?.available,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
    },
  });
  const parsed = EquipmentCatalogResponseSchema.parse(raw);
  return parsed.items;
}

/** Fetch paginated equipment catalog. */
export async function getEquipmentPaginated(
  filters?: EquipmentFilters,
): Promise<EquipmentCatalogResponse> {
  const raw = await api.get<EquipmentCatalogResponse>('/equipment/catalog', {
    params: {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 12,
      category: filters?.category,
      search: filters?.search,
      sortBy: filters?.sortBy,
      sortDesc: filters?.sortDesc,
      available: filters?.available,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
    },
  });
  return EquipmentCatalogResponseSchema.parse(raw);
}

/** Fetch a single equipment item by ID. */
export async function getEquipmentItem(id: string): Promise<EquipmentDetailResponse> {
  const raw = await api.get<EquipmentDetailResponse>(`/equipment/${id}`);
  return EquipmentDetailResponseSchema.parse(raw);
}

/** Fetch equipment categories. */
export async function getEquipmentCategories(): Promise<EquipmentCategoryResponse[]> {
  const raw = await api.get<EquipmentCategoryResponse[]>('/equipment/categories');
  return z.array(EquipmentCategoryResponseSchema).parse(raw);
}

/** Fetch featured / top-rated equipment. */
export async function getFeaturedEquipment(): Promise<EquipmentResponse[]> {
  const raw = await api.get<EquipmentCatalogResponse>('/equipment/catalog', {
    params: {
      page: 1,
      limit: 6,
      sortBy: 'rating',
      sortDesc: true,
      available: true,
    },
  });
  const parsed = EquipmentCatalogResponseSchema.parse(raw);
  return parsed.items;
}

/** Search equipment by text query. */
export async function searchEquipment(query: string): Promise<EquipmentResponse[]> {
  return getEquipment({ search: query });
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const equipmentService = {
  getEquipment,
  getEquipmentPaginated,
  getEquipmentItem,
  getEquipmentCategories,
  getFeaturedEquipment,
  searchEquipment,
};
