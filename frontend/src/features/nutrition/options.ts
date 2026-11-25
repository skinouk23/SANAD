/**
 * Nutrition Query Options
 *
 * Pre-built queryOptions for every nutrition query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { nutritionKeys } from './keys';
import {
  getSubcategories,
  getDietTypes,
  getZones,
  getProviders,
  getUserProfile,
  getMealRecommendations,
  getFoodsToAvoid,
} from './service';

export function subcategoriesOptions() {
  return queryOptions({
    queryKey: nutritionKeys.subcategories(),
    queryFn: getSubcategories,
  });
}

export function dietTypesOptions() {
  return queryOptions({
    queryKey: nutritionKeys.dietTypes(),
    queryFn: getDietTypes,
  });
}

export function nutritionZonesOptions() {
  return queryOptions({
    queryKey: nutritionKeys.zones(),
    queryFn: getZones,
  });
}

export function nutritionProvidersOptions() {
  return queryOptions({
    queryKey: nutritionKeys.providers(),
    queryFn: getProviders,
  });
}

export function nutritionUserProfileOptions() {
  return queryOptions({
    queryKey: nutritionKeys.userProfile(),
    queryFn: getUserProfile,
  });
}

export function mealRecommendationsOptions() {
  return queryOptions({
    queryKey: nutritionKeys.mealRecommendations(),
    queryFn: getMealRecommendations,
  });
}

export function foodsToAvoidOptions() {
  return queryOptions({
    queryKey: nutritionKeys.foodsToAvoid(),
    queryFn: getFoodsToAvoid,
  });
}
