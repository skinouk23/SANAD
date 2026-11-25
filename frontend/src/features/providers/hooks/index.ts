/**
 * Provider Hooks — barrel export
 *
 * Provider hooks re-exported from domain sub-modules.
 */

// Query hooks
export {
  useProviders,
  useActiveProviders,
  usePublicProvider,
  usePaginatedProviders,
  useProvidersByCategory,
  useProvidersByServiceType,
  useAvailableProviders,
  useTopRatedProviders,
  useProviderFilterOptions,
  useProviderSchedule,
  useProviderMonthAvailability,
  useProviderRangeAvailability,
} from './useProviderQueries';

// Self-service query hooks (8)
export {
  useMyProviderProfile,
  useProviderDashboard,
  useMyProviderReviews,
  useMyProviderPlanning,
  useMyProviderSchedules,
  useMyProviderUnavailabilities,
  useMyServices,
  useMyServicePresets,
  useMyServiceDetail,
  useMyServiceStats,
  useProviderAvailability,
} from './useProviderSelfService';
export { useProviderPreferences, useUpdateProviderPreferences } from './useProviderPreferences';

// Mutation hooks (6)
export {
  useUpdateMyProviderProfile,
  useToggleAvailability,
  useRequestProviderVerification,
  useReplaceProviderSchedules,
  useCreateProviderUnavailability,
  useUpdateProviderUnavailability,
  useDeleteProviderUnavailability,
  useAddService,
  useUpdateService,
  useUploadAndAttachServicePhoto,
  useRemoveService,
  useToggleService,
} from './useProviderMutations';

// Helper / convenience hooks (10)
export {
  useAmbulanceProviders,
  useLaboratories,
  useRadiologyCenters,
  usePharmacies,
  useNutritionProviders,
  useFuneralServices,
  useVeterinaryProviders,
  useGyms,
  useCareProviders,
  useProviderAvailabilityToggle,
} from './useProviderHelpers';
