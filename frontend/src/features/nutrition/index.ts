/**
 * Nutrition Feature — public API
 *
 * Consumers import from here or from the hooks barrel.
 */

export * from './hooks';
export { nutritionKeys } from './keys';
export { nutritionService } from './service';
export {
  subcategoriesOptions,
  dietTypesOptions,
  nutritionZonesOptions,
  nutritionProvidersOptions,
  nutritionUserProfileOptions,
  mealRecommendationsOptions,
  foodsToAvoidOptions,
} from './options';
