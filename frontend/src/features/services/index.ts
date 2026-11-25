/**
 * Services Feature Module — Barrel Export
 *
 * Re-exports everything consumers need from the services domain:
 * service functions, keys, options, and hooks.
 */

// Service API functions
export {
  getServiceCatalog,
  getServiceDetail,
  getServiceCategories,
  getServicesByType,
  getServices,
  serviceService,
} from './service';
export type { CatalogParams } from './service';

// Query key factory
export { serviceKeys } from './keys';

// Query options
export {
  serviceCatalogOptions,
  serviceDetailOptions,
  serviceCategoriesOptions,
  servicesByTypeOptions,
  servicesOptions,
} from './options';

// Hooks
export {
  useServiceCatalog,
  useServiceDetail,
  useServiceCategories,
  useServiceByType,
  useServiceAccent,
} from './hooks';

// Feature UI
export { ServiceProviderListing } from './ui';

// Accent color utilities
export {
  createServiceAccentStyles,
  createServiceAccentVariables,
  getFallbackServiceAccent,
  hexToRgb,
  parseServiceAccent,
  resolveServiceAccent,
  toRgba,
} from './service-colors';
export type { ServiceAccent, ServiceAccentStyles } from './service-colors';

// Category code → route map
export { CATEGORY_CODE_TO_ROUTE, getCategoryRoute } from './category-map';

// Schema types
export type {
  AttachServicePhotoRequest,
  PatientServiceItemResponse,
  ServiceCategoryResponse,
  ServicePhotoResponse,
} from './schema';
