/**
 * Users Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   usersKeys.all                    → invalidate everything
 *   usersKeys.currentPatient()       → invalidate current patient profile
 *   usersKeys.currentProvider()      → invalidate current provider profile
 *   usersKeys.paginatedUsers(filters)→ invalidate paginated admin user list
 */

import type { UserFilters } from './service';

export const usersKeys = {
  all: ['users'] as const,

  currentPatient: () => [...usersKeys.all, 'current-patient'] as const,
  currentProvider: () => [...usersKeys.all, 'current-provider'] as const,
  patientFavorites: () => [...usersKeys.all, 'patient-favorites'] as const,
  patientPreferences: () => [...usersKeys.all, 'patient-preferences'] as const,
  paginatedUsersRoot: () => [...usersKeys.all, 'paginated'] as const,
  paginatedUsers: (filters?: UserFilters) =>
    [...usersKeys.paginatedUsersRoot(), filters ?? {}] as const,
} as const;
