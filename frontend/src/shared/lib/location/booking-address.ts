export interface PatientProfileLocationSource {
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CachedAuthAddressSource {
  street?: string | null;
  city?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  fullAddress?: string | null;
}

export interface BookingAddressPrefill {
  line1: string;
  city: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  instructions: string | null;
  displayAddress: string;
  source: 'profile' | 'auth';
}

function cleanText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function cleanCoordinate(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function hasCoordinatePair(latitude: number | null, longitude: number | null): boolean {
  return latitude !== null && longitude !== null;
}

function formatProfileDisplayAddress(
  line1: string,
  city: string | null,
  postalCode: string | null,
): string {
  return [line1, postalCode, city].filter(Boolean).join(', ');
}

export function getPatientBookingAddressPrefill(
  profile: PatientProfileLocationSource | null | undefined,
  authAddress: CachedAuthAddressSource | null | undefined,
): BookingAddressPrefill | null {
  const profileLine1 = cleanText(profile?.address);
  const profileCity = cleanText(profile?.city);
  const profilePostalCode = cleanText(profile?.postalCode);
  const profileLatitude = cleanCoordinate(profile?.latitude);
  const profileLongitude = cleanCoordinate(profile?.longitude);

  if (profileLine1 || profileCity || hasCoordinatePair(profileLatitude, profileLongitude)) {
    const line1 = profileLine1 ?? profileCity ?? 'Adresse du profil';

    return {
      line1,
      city: profileCity,
      postalCode: profilePostalCode,
      latitude: profileLatitude,
      longitude: profileLongitude,
      instructions: null,
      displayAddress: formatProfileDisplayAddress(line1, profileCity, profilePostalCode),
      source: 'profile',
    };
  }

  const authDisplayAddress = cleanText(authAddress?.fullAddress);
  const authLine1 = cleanText(authAddress?.street) ?? authDisplayAddress;
  const authCity = cleanText(authAddress?.city);
  const authPostalCode = cleanText(authAddress?.postalCode);
  const authLatitude = cleanCoordinate(authAddress?.latitude);
  const authLongitude = cleanCoordinate(authAddress?.longitude);

  if (authLine1 || authCity || hasCoordinatePair(authLatitude, authLongitude)) {
    const line1 = authLine1 ?? authCity ?? 'Adresse du compte';

    return {
      line1,
      city: authCity,
      postalCode: authPostalCode,
      latitude: authLatitude,
      longitude: authLongitude,
      instructions: null,
      displayAddress:
        authDisplayAddress ?? formatProfileDisplayAddress(line1, authCity, authPostalCode),
      source: 'auth',
    };
  }

  return null;
}
