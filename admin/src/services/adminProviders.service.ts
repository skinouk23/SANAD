import { api } from '../api/client';
import type {
  AdminProviderCategoryOption,
  AdminProviderDetail,
  AdminProviderListFilters,
  AdminProviderListResult,
  AdminProviderRow,
  AdminProviderStatusAction,
  AdminProviderUpdatePayload
} from '../types/admin-providers.types';

interface AdminProviderListApiResponse {
  items: AdminProviderRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ServiceCategoryGroupResponse {
  displayGroup: string;
  categories: Array<{
    code: string;
    label: string;
  }>;
}

const FALLBACK_SERVICE_CATEGORIES: AdminProviderCategoryOption[] = [
  { code: 'nursing', label: 'Nursing', group: 'Medical' },
  { code: 'physio', label: 'Physiotherapy', group: 'Rehabilitation' },
  { code: 'laboratory', label: 'Laboratory', group: 'Medical' },
  { code: 'radiology', label: 'Radiology', group: 'Medical' },
  { code: 'pharmacy', label: 'Pharmacy', group: 'Medical' },
  { code: 'nutrition', label: 'Nutrition', group: 'Wellness' }
];

export async function getAdminProviders(
  filters: AdminProviderListFilters
): Promise<AdminProviderListResult> {
  const response = await api.get<AdminProviderListApiResponse>('/admin/providers', {
    params: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search || undefined,
      serviceCategory: filters.serviceCategory || undefined,
      status: filters.status || undefined,
      city: filters.city || undefined,
      sortBy: filters.sortBy || undefined,
      sortDesc: filters.sortDesc ?? undefined
    }
  });

  return response;
}

export async function getAdminProviderById(id: string): Promise<AdminProviderDetail> {
  return api.get<AdminProviderDetail>(`/admin/providers/${id}`);
}

export async function updateAdminProvider(
  id: string,
  payload: AdminProviderUpdatePayload
): Promise<AdminProviderDetail> {
  return api.put<AdminProviderDetail>(`/admin/providers/${id}`, payload);
}

export async function updateAdminProviderStatus(
  id: string,
  action: AdminProviderStatusAction,
  reason?: string
): Promise<AdminProviderDetail> {
  return api.patch<AdminProviderDetail>(`/admin/providers/${id}/status`, {
    action,
    reason: reason || undefined
  });
}

export async function deleteAdminProvider(id: string): Promise<void> {
  await api.delete(`/admin/providers/${id}`);
}

export async function getAdminProviderCategories(): Promise<AdminProviderCategoryOption[]> {
  try {
    const response = await api.get<ServiceCategoryGroupResponse[]>('/service-catalog/categories');
    return response.flatMap((group) =>
      group.categories.map((category) => ({
        code: category.code,
        label: category.label,
        group: group.displayGroup
      }))
    );
  } catch {
    return FALLBACK_SERVICE_CATEGORIES;
  }
}

export const adminProvidersService = {
  getAdminProviders,
  getAdminProviderById,
  updateAdminProvider,
  updateAdminProviderStatus,
  deleteAdminProvider,
  getAdminProviderCategories
};
