/**
 * Users Query Options
 *
 * Pre-built queryOptions for user-related queries.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { usersKeys } from './keys';
import {
  getCurrentPatient,
  getCurrentProvider,
  getPatientFavorites,
  getPatientPreferences,
} from './service';

export function myPatientProfileOptions() {
  return queryOptions({
    queryKey: usersKeys.currentPatient(),
    queryFn: getCurrentPatient,
  });
}

export function currentProviderOptions() {
  return queryOptions({
    queryKey: usersKeys.currentProvider(),
    queryFn: getCurrentProvider,
  });
}

export function patientFavoritesOptions() {
  return queryOptions({
    queryKey: usersKeys.patientFavorites(),
    queryFn: getPatientFavorites,
  });
}

export function patientPreferencesOptions() {
  return queryOptions({
    queryKey: usersKeys.patientPreferences(),
    queryFn: getPatientPreferences,
  });
}
