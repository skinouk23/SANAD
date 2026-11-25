/**
 * Users Feature — public API
 */

export {
  usersService,
  getPatients,
  getPatientsPaginated,
  getPatientById,
  getCurrentPatient,
  updatePatient,
  getProvidersList,
  getProvidersPaginatedList,
  getProviderByIdFromService,
  getCurrentProvider,
  updateProvider,
  updateProviderAvailabilityStatus,
} from './service';

export type { UserFilters, ProviderFilters } from './service';
export type { AdminPatient, AdminProvider } from './schema';

export { usersKeys } from './keys';
export {
  myPatientProfileOptions,
  currentProviderOptions,
  patientFavoritesOptions,
  patientPreferencesOptions,
} from './options';

export {
  useCurrentPatient,
  useUpdatePatientProfile,
  usePatientFavorites,
  useAddFavorite,
  useRemoveFavorite,
  usePatientPreferences,
  useUpdatePreferences,
} from './hooks';
