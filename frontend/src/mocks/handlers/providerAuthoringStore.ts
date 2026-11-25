import { providersData } from '@/data/providers.data';
import {
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  normalizeProviderCategory,
} from '@/features/providers/providerAuthoring';
import type {
  NutritionProviderSubtype,
  ProviderCategory,
} from '@/features/providers/providerAuthoring';
import type { ProviderPreferencesResponse } from '@/features/providers/preferences-schema';
import type {
  ProviderProfileResponse,
  ProviderVerificationStatus,
} from '@/features/providers/schema';
import type {
  ServiceDetailResponse,
  ServicePhotoResponse,
  ServiceSummaryResponse,
} from '@/features/services/schema';
import type { UserResponse } from '@/features/auth/schema';

interface SetCurrentMockProviderContextOptions {
  serviceType?: string | null;
  nutritionProviderSubtype?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  businessName?: string | null;
  address?: string | null;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  seedServices?: boolean;
  verificationConsentGiven?: boolean | null;
}

interface UpdateProviderAuthAccountRequest {
  phone?: string | null;
  avatarFileId?: string | null;
}

interface MockProviderAuthProfileState extends UserResponse {
  updatedAt: string;
}

interface MockProviderAuthoringState {
  profile: ProviderProfileResponse;
  preferences: ProviderPreferencesResponse;
  services: ServiceDetailResponse[];
  authProfile: MockProviderAuthProfileState;
}

interface MutableServicePayload {
  name?: unknown;
  description?: unknown;
  shortDescription?: unknown;
  price?: unknown;
  priceType?: unknown;
  currency?: unknown;
  minPrice?: unknown;
  maxPrice?: unknown;
  durationMinutes?: unknown;
  minDurationMinutes?: unknown;
  maxDurationMinutes?: unknown;
  serviceLocation?: unknown;
  requiresPrescription?: unknown;
  isUrgent?: unknown;
  requiresMedicalHistory?: unknown;
  ageRestrictionMin?: unknown;
  ageRestrictionMax?: unknown;
  typeConfig?: unknown;
}

export const mockAmbulanceServiceTypeLookups = [
  {
    code: 'emergency',
    label: 'Urgence',
    icon: 'ambulance',
    color: '#ef4444',
  },
  {
    code: 'inter_hospital',
    label: 'Inter-hospitalier',
    icon: 'building-2',
    color: '#3b82f6',
  },
  {
    code: 'repatriation',
    label: 'Rapatriement',
    icon: 'plane',
    color: '#8b5cf6',
  },
  {
    code: 'event_assistance',
    label: 'Assistance événementielle',
    icon: 'shield-plus',
    color: '#f59e0b',
  },
] as const;

export const mockVeterinaryAnimalTypeLookups = [
  {
    code: 'dog',
    label: 'Chien',
    icon: 'paw-print',
    color: '#f59e0b',
  },
  {
    code: 'cat',
    label: 'Chat',
    icon: 'cat',
    color: '#8b5cf6',
  },
  {
    code: 'bird',
    label: 'Oiseau',
    icon: 'bird',
    color: '#06b6d4',
  },
  {
    code: 'reptile',
    label: 'Reptile',
    icon: 'turtle',
    color: '#22c55e',
  },
  {
    code: 'nac',
    label: 'NAC',
    icon: 'rabbit',
    color: '#ec4899',
  },
  {
    code: 'horse',
    label: 'Cheval',
    icon: 'badge-plus',
    color: '#a16207',
  },
] as const;

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function hasOwn<T extends object>(value: T, key: keyof T): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function normalizeNullableString(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function toAuthProfileResponse(authProfile: MockProviderAuthProfileState): UserResponse {
  const authProfileResponse = cloneDeep(authProfile) as Partial<MockProviderAuthProfileState>;

  delete authProfileResponse.updatedAt;

  return authProfileResponse as UserResponse;
}

function createMockUuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
}

function normalizeNutritionSubtype(
  value: string | null | undefined,
): NutritionProviderSubtype | null {
  if (!value) {
    return null;
  }

  return NUTRITION_PROVIDER_SUBTYPE_VALUES.includes(value as NutritionProviderSubtype)
    ? (value as NutritionProviderSubtype)
    : null;
}

function findSeedProvider(category: ProviderCategory) {
  return (
    providersData.find((provider) => provider.serviceCategory === category) ?? providersData[0]
  );
}

function inferNutritionSubtype(seedName: string | null | undefined): NutritionProviderSubtype {
  const normalizedName = seedName?.toLowerCase() ?? '';

  if (normalizedName.includes('restaurant')) {
    return 'Restaurant';
  }

  if (normalizedName.includes('chef')) {
    return 'Chef';
  }

  return 'Nutritionist';
}

function toNullableString(value: unknown, fallback: string | null): string | null {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function toOptionalNumber(value: unknown, fallback: number | null = null): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return fallback;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeTypeConfig(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return cloneDeep(value as Record<string, unknown>);
}

function createSeedService(
  profile: ProviderProfileResponse,
  serviceName: string,
  price: number,
  index: number,
): ServiceDetailResponse {
  const now = new Date().toISOString();

  return {
    id: createMockUuid(),
    providerId: profile.id,
    category: profile.serviceType ?? 'nursing',
    name: serviceName,
    description: null,
    shortDescription: null,
    price,
    priceType: 'fixed',
    currency: 'TND',
    minPrice: null,
    maxPrice: null,
    durationMinutes: 30 + index * 15,
    minDurationMinutes: null,
    maxDurationMinutes: null,
    serviceLocation: 'home',
    isActive: true,
    isFeatured: index === 0,
    requiresPrescription: false,
    isUrgent: false,
    requiresMedicalHistory: false,
    ageRestrictionMin: null,
    ageRestrictionMax: null,
    imageUrl: null,
    galleryUrls: [],
    bookingCount: index * 3,
    availableQuantity: null,
    typeConfig: null,
    subServices: [],
    createdAt: now,
    updatedAt: now,
  };
}

function createProfileState(
  options: SetCurrentMockProviderContextOptions,
): MockProviderAuthoringState {
  const normalizedCategory = normalizeProviderCategory(options.serviceType) ?? 'nursing';
  const seedProvider = findSeedProvider(normalizedCategory);
  const now = new Date().toISOString();
  const createdAt = seedProvider.createdAt ?? now;
  const verificationConsentGiven = options.verificationConsentGiven ?? true;
  const verificationStatus: ProviderVerificationStatus = verificationConsentGiven
    ? 'requested'
    : 'not_requested';
  const nutritionProviderSubtype =
    normalizedCategory === 'nutrition'
      ? (normalizeNutritionSubtype(options.nutritionProviderSubtype) ??
        inferNutritionSubtype(
          options.businessName ?? seedProvider.businessName ?? seedProvider.displayName,
        ))
      : null;

  const profile: ProviderProfileResponse = {
    id: seedProvider.id,
    userId: createMockUuid(),
    serviceType: normalizedCategory,
    nutritionProviderSubtype,
    businessName: toNullableString(options.businessName, seedProvider.businessName ?? null),
    firstName: toNullableString(options.firstName, seedProvider.firstName ?? null),
    lastName: toNullableString(options.lastName, seedProvider.lastName ?? null),
    licenseNumber: `MOCK-${normalizedCategory.toUpperCase()}-001`,
    specialization: seedProvider.specialties[0] ?? null,
    yearsOfExperience: seedProvider.experience ?? 0,
    bio: seedProvider.bio ?? null,
    address: toNullableString(options.address, seedProvider.addressLine1 ?? null),
    city: toNullableString(options.city, seedProvider.city ?? null),
    postalCode: '1000',
    latitude: null,
    longitude: null,
    serviceRadius: 20,
    rating: seedProvider.ratingAverage ?? 0,
    totalReviews: seedProvider.ratingCount ?? 0,
    totalBookings: (seedProvider.pricing?.length ?? 0) * 8,
    isApproved: true,
    isVerified: false,
    verificationConsentGiven,
    verificationStatus,
    verificationRequestedAt: verificationConsentGiven ? now : null,
    verificationReviewedAt: null,
    canRequestVerification: !verificationConsentGiven,
    approvalDate: createdAt,
    subscriptionTier: seedProvider.subscriptionPlan ?? null,
    profilePictureUrl: seedProvider.profilePictureUrl ?? null,
    coverImageUrl: null,
    isOnline: seedProvider.isAvailable ?? false,
    responseRate: 95,
    averageResponseTimeMinutes: 12,
    completionRate: 94,
    createdAt,
    updatedAt: now,
  };

  const authProfile: MockProviderAuthProfileState = {
    id: profile.userId,
    email:
      options.email !== undefined
        ? (normalizeNullableString(options.email) ?? seedProvider.email)
        : seedProvider.email,
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    phoneNumber:
      options.phone !== undefined ? normalizeNullableString(options.phone) : seedProvider.phone,
    avatar: null,
    avatarFileId: null,
    role: 'provider',
    isActive: true,
    createdAt,
    updatedAt: now,
  };

  const services =
    options.seedServices === false
      ? []
      : (seedProvider.pricing ?? []).map((pricing, index) =>
          createSeedService(profile, pricing.serviceName, pricing.price, index),
        );

  const preferences: ProviderPreferencesResponse = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    allowPatientMessages: true,
    profileVisibility: 'public',
    updatedAt: now,
  };

  return {
    profile,
    preferences,
    services,
    authProfile,
  };
}

function toServiceSummary(service: ServiceDetailResponse): ServiceSummaryResponse {
  return {
    id: service.id,
    name: service.name,
    shortDescription: service.shortDescription,
    description: service.description,
    serviceLocation: service.serviceLocation,
    category: service.category,
    price: service.price,
    priceType: service.priceType,
    currency: service.currency,
    durationMinutes: service.durationMinutes,
    isActive: service.isActive,
    isFeatured: service.isFeatured,
    isUrgent: service.isUrgent,
    requiresPrescription: service.requiresPrescription,
    imageUrl: service.imageUrl,
    bookingCount: service.bookingCount,
    availableQuantity: service.availableQuantity,
    typeConfig: cloneDeep(service.typeConfig ?? null),
    subServiceCount: service.subServices?.length ?? 0,
    createdAt: service.createdAt,
  };
}

let currentProviderAuthoringState = createProfileState({
  serviceType: 'nursing',
  seedServices: true,
});

export function setCurrentMockProviderContext(options: SetCurrentMockProviderContextOptions): void {
  currentProviderAuthoringState = createProfileState(options);
}

export function getCurrentMockProviderProfile(): ProviderProfileResponse {
  return cloneDeep(currentProviderAuthoringState.profile);
}

export function updateCurrentMockProviderProfile(
  updates: Partial<ProviderProfileResponse>,
): ProviderProfileResponse {
  const updatedAt = new Date().toISOString();
  const nextProfile: ProviderProfileResponse = {
    ...currentProviderAuthoringState.profile,
    ...cloneDeep(updates),
    updatedAt,
  };
  const nextAuthProfile = cloneDeep(currentProviderAuthoringState.authProfile);

  if (hasOwn(updates, 'firstName')) {
    nextAuthProfile.firstName = normalizeNullableString(updates.firstName) ?? '';
  }

  if (hasOwn(updates, 'lastName')) {
    nextAuthProfile.lastName = normalizeNullableString(updates.lastName) ?? '';
  }

  if (hasOwn(updates, 'profilePictureUrl')) {
    nextAuthProfile.avatar = normalizeNullableString(updates.profilePictureUrl);
  }

  nextAuthProfile.updatedAt = updatedAt;

  currentProviderAuthoringState = {
    ...currentProviderAuthoringState,
    profile: nextProfile,
    authProfile: nextAuthProfile,
  };

  return getCurrentMockProviderProfile();
}

export function getProviderAuthProfile(): UserResponse {
  return toAuthProfileResponse(currentProviderAuthoringState.authProfile);
}

export function updateProviderAuthAccount(patch: UpdateProviderAuthAccountRequest): UserResponse {
  const updatedAt = new Date().toISOString();
  const nextAuthProfile = cloneDeep(currentProviderAuthoringState.authProfile);
  const nextProfile = cloneDeep(currentProviderAuthoringState.profile);

  if (hasOwn(patch, 'phone')) {
    nextAuthProfile.phoneNumber = normalizeNullableString(patch.phone);
  }

  if (hasOwn(patch, 'avatarFileId')) {
    const avatarFileId = normalizeNullableString(patch.avatarFileId);

    nextAuthProfile.avatar = null;
    nextAuthProfile.avatarFileId = avatarFileId;
    nextProfile.profilePictureUrl = null;
  }

  nextAuthProfile.updatedAt = updatedAt;
  nextProfile.updatedAt = updatedAt;

  currentProviderAuthoringState = {
    ...currentProviderAuthoringState,
    authProfile: nextAuthProfile,
    profile: nextProfile,
  };

  return getProviderAuthProfile();
}

export function getCurrentMockProviderPreferences(): ProviderPreferencesResponse {
  return cloneDeep(currentProviderAuthoringState.preferences);
}

export function updateCurrentMockProviderPreferences(
  updates: Partial<Omit<ProviderPreferencesResponse, 'updatedAt'>>,
): ProviderPreferencesResponse {
  currentProviderAuthoringState.preferences = {
    ...currentProviderAuthoringState.preferences,
    ...cloneDeep(updates),
    updatedAt: new Date().toISOString(),
  };

  return getCurrentMockProviderPreferences();
}

export function getCurrentMockProviderServiceSummaries(): ServiceSummaryResponse[] {
  return currentProviderAuthoringState.services.map((service) => toServiceSummary(service));
}

export function getCurrentMockProviderServiceDetail(id: string): ServiceDetailResponse | null {
  const service = currentProviderAuthoringState.services.find((item) => item.id === id);
  return service ? cloneDeep(service) : null;
}

export function createCurrentMockProviderService(
  payload: MutableServicePayload,
): ServiceDetailResponse {
  const now = new Date().toISOString();
  const createdService: ServiceDetailResponse = {
    id: createMockUuid(),
    providerId: currentProviderAuthoringState.profile.id,
    category: currentProviderAuthoringState.profile.serviceType ?? 'nursing',
    name: toNullableString(payload.name, null) ?? 'Service mock',
    description: toNullableString(payload.description, null),
    shortDescription: toNullableString(payload.shortDescription, null),
    price: toOptionalNumber(payload.price, 0) ?? 0,
    priceType: toNullableString(payload.priceType, 'fixed') ?? 'fixed',
    currency: toNullableString(payload.currency, 'TND') ?? 'TND',
    minPrice: toOptionalNumber(payload.minPrice),
    maxPrice: toOptionalNumber(payload.maxPrice),
    durationMinutes: toOptionalNumber(payload.durationMinutes),
    minDurationMinutes: toOptionalNumber(payload.minDurationMinutes),
    maxDurationMinutes: toOptionalNumber(payload.maxDurationMinutes),
    serviceLocation: toNullableString(payload.serviceLocation, 'home') ?? 'home',
    isActive: true,
    isFeatured: false,
    requiresPrescription: toBoolean(payload.requiresPrescription, false),
    isUrgent: toBoolean(payload.isUrgent, false),
    requiresMedicalHistory: toBoolean(payload.requiresMedicalHistory, false),
    ageRestrictionMin: toOptionalNumber(payload.ageRestrictionMin),
    ageRestrictionMax: toOptionalNumber(payload.ageRestrictionMax),
    imageUrl: null,
    galleryUrls: [],
    bookingCount: 0,
    availableQuantity: null,
    typeConfig: normalizeTypeConfig(payload.typeConfig),
    subServices: [],
    createdAt: now,
    updatedAt: now,
  };

  currentProviderAuthoringState.services = [
    createdService,
    ...currentProviderAuthoringState.services,
  ];

  return cloneDeep(createdService);
}

export function updateCurrentMockProviderService(
  id: string,
  payload: MutableServicePayload,
): ServiceDetailResponse | null {
  const serviceIndex = currentProviderAuthoringState.services.findIndex(
    (service) => service.id === id,
  );

  if (serviceIndex === -1) {
    return null;
  }

  const currentService = currentProviderAuthoringState.services[serviceIndex];
  const updatedService: ServiceDetailResponse = {
    ...currentService,
    ...(payload.name !== undefined
      ? {
          name:
            toNullableString(payload.name, currentService.name ?? null) ??
            currentService.name ??
            'Service mock',
        }
      : {}),
    ...(payload.description !== undefined
      ? { description: toNullableString(payload.description, currentService.description ?? null) }
      : {}),
    ...(payload.shortDescription !== undefined
      ? {
          shortDescription: toNullableString(
            payload.shortDescription,
            currentService.shortDescription ?? null,
          ),
        }
      : {}),
    ...(payload.price !== undefined
      ? { price: toOptionalNumber(payload.price, currentService.price) ?? currentService.price }
      : {}),
    ...(payload.priceType !== undefined
      ? {
          priceType:
            toNullableString(payload.priceType, currentService.priceType ?? 'fixed') ??
            currentService.priceType,
        }
      : {}),
    ...(payload.currency !== undefined
      ? {
          currency:
            toNullableString(payload.currency, currentService.currency ?? 'TND') ??
            currentService.currency,
        }
      : {}),
    ...(payload.minPrice !== undefined
      ? { minPrice: toOptionalNumber(payload.minPrice, currentService.minPrice ?? null) }
      : {}),
    ...(payload.maxPrice !== undefined
      ? { maxPrice: toOptionalNumber(payload.maxPrice, currentService.maxPrice ?? null) }
      : {}),
    ...(payload.durationMinutes !== undefined
      ? {
          durationMinutes: toOptionalNumber(
            payload.durationMinutes,
            currentService.durationMinutes ?? null,
          ),
        }
      : {}),
    ...(payload.minDurationMinutes !== undefined
      ? {
          minDurationMinutes: toOptionalNumber(
            payload.minDurationMinutes,
            currentService.minDurationMinutes ?? null,
          ),
        }
      : {}),
    ...(payload.maxDurationMinutes !== undefined
      ? {
          maxDurationMinutes: toOptionalNumber(
            payload.maxDurationMinutes,
            currentService.maxDurationMinutes ?? null,
          ),
        }
      : {}),
    ...(payload.serviceLocation !== undefined
      ? {
          serviceLocation:
            toNullableString(payload.serviceLocation, currentService.serviceLocation ?? 'home') ??
            currentService.serviceLocation,
        }
      : {}),
    ...(payload.requiresPrescription !== undefined
      ? {
          requiresPrescription: toBoolean(
            payload.requiresPrescription,
            currentService.requiresPrescription,
          ),
        }
      : {}),
    ...(payload.isUrgent !== undefined
      ? {
          isUrgent: toBoolean(payload.isUrgent, currentService.isUrgent),
        }
      : {}),
    ...(payload.requiresMedicalHistory !== undefined
      ? {
          requiresMedicalHistory: toBoolean(
            payload.requiresMedicalHistory,
            currentService.requiresMedicalHistory,
          ),
        }
      : {}),
    ...(payload.ageRestrictionMin !== undefined
      ? {
          ageRestrictionMin: toOptionalNumber(
            payload.ageRestrictionMin,
            currentService.ageRestrictionMin ?? null,
          ),
        }
      : {}),
    ...(payload.ageRestrictionMax !== undefined
      ? {
          ageRestrictionMax: toOptionalNumber(
            payload.ageRestrictionMax,
            currentService.ageRestrictionMax ?? null,
          ),
        }
      : {}),
    ...(payload.typeConfig !== undefined
      ? { typeConfig: normalizeTypeConfig(payload.typeConfig) }
      : {}),
    updatedAt: new Date().toISOString(),
  };

  currentProviderAuthoringState.services[serviceIndex] = updatedService;
  return cloneDeep(updatedService);
}

export function attachCurrentMockProviderServicePhoto({
  serviceId,
  fileId,
  isMain,
  sortOrder,
}: {
  serviceId: string;
  fileId: string;
  isMain?: boolean;
  sortOrder?: number;
}): ServicePhotoResponse | null {
  const serviceIndex = currentProviderAuthoringState.services.findIndex(
    (service) => service.id === serviceId,
  );

  if (serviceIndex === -1) {
    return null;
  }

  const currentService = currentProviderAuthoringState.services[serviceIndex];
  const assetUrl = `/api/v1/files/${encodeURIComponent(fileId)}/content`;
  const nextGallery = [...(currentService.galleryUrls ?? [])];

  if (isMain || !currentService.imageUrl) {
    currentService.imageUrl = assetUrl;
  } else if (typeof sortOrder === 'number' && sortOrder >= 0 && sortOrder < nextGallery.length) {
    nextGallery.splice(sortOrder, 0, assetUrl);
  } else {
    nextGallery.push(assetUrl);
  }

  currentService.galleryUrls = nextGallery;
  currentService.updatedAt = new Date().toISOString();
  currentProviderAuthoringState.services[serviceIndex] = currentService;

  return {
    serviceId,
    imageUrl: currentService.imageUrl,
    galleryUrls: currentService.galleryUrls,
  };
}

export function toggleCurrentMockProviderService(id: string, isActive: boolean): boolean {
  const service = currentProviderAuthoringState.services.find((item) => item.id === id);

  if (!service) {
    return false;
  }

  service.isActive = isActive;
  service.updatedAt = new Date().toISOString();
  return true;
}

export function deleteCurrentMockProviderService(id: string): boolean {
  const originalLength = currentProviderAuthoringState.services.length;
  currentProviderAuthoringState.services = currentProviderAuthoringState.services.filter(
    (service) => service.id !== id,
  );

  return currentProviderAuthoringState.services.length < originalLength;
}

export function getCurrentMockProviderServiceStats() {
  const totalServices = currentProviderAuthoringState.services.length;
  const activeServices = currentProviderAuthoringState.services.filter(
    (service) => service.isActive,
  ).length;
  const inactiveServices = totalServices - activeServices;
  const totalBookings = currentProviderAuthoringState.services.reduce(
    (sum, service) => sum + service.bookingCount,
    0,
  );

  return {
    totalServices,
    activeServices,
    inactiveServices,
    totalBookings,
  };
}
