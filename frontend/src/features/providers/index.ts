/**
 * Providers Feature — public API
 *
 * Consumers import from here or from the hooks barrel.
 */

export * from './hooks';
export * from './providerAuthoring';
export * from './providerAuthoringConfig';
export { providerKeys } from './keys';
export { providerService, requestMyProviderVerification } from './service';
export {
  providerPreferencesService,
  getMyProviderPreferences,
  updateMyProviderPreferences,
} from './preferences-service';
export type {
  ProviderFilters,
  ReviewParams,
  PaginatedProviders,
  ProviderScheduleSlot,
  ProviderMonthAvailabilityParams,
  ProviderRangeAvailabilityParams,
  ProviderPlanningParams,
  ProviderUnavailabilityListParams,
} from './service';
export type {
  ProviderResponse,
  ProviderFilterOptionsResponse,
  ProviderAvailabilityInterval,
  ProviderMonthAvailabilityDayResponse,
  ProviderRangeAvailabilityResponse,
  ProviderPlanningResponse,
  ProviderPlanningBookingResponse,
  ProviderProfileResponse,
  ProviderScheduleInterval,
  ProviderVerificationRequestResponse,
  ProviderVerificationStatus,
  UpsertProviderScheduleInterval,
  ProviderUnavailabilityResponse,
  CreateProviderUnavailabilityRequest,
  UpdateProviderUnavailabilityRequest,
} from './schema';
export type {
  ProviderPreferencesResponse,
  UpdateProviderPreferencesRequest,
} from './preferences-schema';
export {
  getProviderDisplayName,
  getProviderLocation,
  getProviderImageUrl,
} from './display-helpers';
export { ProviderContactModal } from './public/ProviderContactModal';
export { ProviderRouteHeader } from './shared/ui/ProviderRouteHeader';
export { ProviderVerificationBadge } from './verification';
export {
  applyProviderServicePresetToFormValues,
  buildCreatePayload,
  buildServiceManagementUpdatePayload,
  createFreshProviderServiceFormValues,
  createProviderServiceFormSchema,
  createServiceManagementEditDefaults,
  getServiceLocationLabel,
  getServiceManagementEditFields,
  ProviderServiceAuthoringFields,
  type ProviderServiceFormValues,
  type ProviderServiceManagementEditSource,
  type ProviderServicePresetDraftOverrides,
} from './providerServiceForm';
export * from './schedule-planning';
export {
  providerListOptions,
  providerDetailOptions,
  providerSearchOptions,
  providerFilterOptionsOptions,
  providersByCategoryOptions,
  providersByServiceTypeOptions,
  availableProvidersOptions,
  topRatedProvidersOptions,
  providerScheduleOptions,
  providerMonthAvailabilityOptions,
  providerRangeAvailabilityOptions,
  myProviderProfileOptions,
  myProviderPreferencesOptions,
  providerDashboardOptions,
  myProviderReviewsOptions,
  myProviderAvailabilityOptions,
  myProviderPlanningOptions,
  myProviderSchedulesOptions,
  myProviderUnavailabilitiesOptions,
  myServicesOptions,
  myServicePresetsOptions,
  myServiceDetailOptions,
  myServiceStatsOptions,
  activeProvidersOptions,
} from './options';
