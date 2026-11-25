/**
 * Provider Helper / Convenience Hooks
 *
 * Thin wrappers around useProviders that pre-set serviceCategory filters.
 * These replace the specialized hooks from the old useProviders.ts.
 */

import { useProviders } from './useProviderQueries';
import { useToggleAvailability } from './useProviderMutations';
import type { ProviderFilters } from '@/features/providers/service';

// ============================================
// SERVICE-CATEGORY WRAPPERS
// ============================================

/** Ambulance providers. */
export function useAmbulanceProviders(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'ambulance' });
}

/** Laboratory providers. */
export function useLaboratories(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'laboratory' });
}

/** Radiology centers. */
export function useRadiologyCenters(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'radiology' });
}

/** Pharmacies. */
export function usePharmacies(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'pharmacy' });
}

/** Nutrition providers. */
export function useNutritionProviders(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'nutrition' });
}

/** Funeral services. */
export function useFuneralServices(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'funeral' });
}

/** Veterinary providers. */
export function useVeterinaryProviders(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'veterinary' });
}

/** Gyms. */
export function useGyms(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory: 'gym' });
}

// ============================================
// GENERIC SERVICE-CATEGORY WRAPPER
// ============================================

/**
 * Generic care providers by service category.
 * Convenience wrapper when serviceCategory comes from a variable.
 */
export function useCareProviders(serviceCategory?: string, filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceCategory });
}

// ============================================
// ALIASES
// ============================================

/**
 * Alias for useToggleAvailability for backward compatibility.
 */
export const useProviderAvailabilityToggle = useToggleAvailability;
