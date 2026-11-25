/**
 * Analytics Feature — public API
 *
 * Consumers import from here or from the hooks barrel.
 */

export * from './hooks';
export { analyticsKeys } from './keys';
export { analyticsService } from './service';
export { providerAnalyticsOptions } from './options';
export { ProviderAnalyticsScreen, loader as providerAnalyticsLoader } from './provider-analytics';
