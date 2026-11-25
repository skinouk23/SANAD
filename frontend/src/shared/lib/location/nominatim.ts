export interface ReverseGeocodedAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
}

interface NominatimReverseGeocodeResult {
  display_name?: string;
  address?: Record<string, string>;
}

const STREET_PLACE_FIELDS = [
  'road',
  'pedestrian',
  'footway',
  'path',
  'neighbourhood',
  'suburb',
  'quarter',
  'city_district',
  'residential',
  'locality',
  'hamlet',
  'village',
  'amenity',
  'building',
  'shop',
  'office',
  'leisure',
  'tourism',
] as const;

const CITY_LOCALITY_FIELDS = [
  'city',
  'town',
  'municipality',
  'village',
  'locality',
  'suburb',
  'city_district',
  'state_district',
  'county',
  'state',
  'governorate',
] as const;

function getFirstAddressField(address: Record<string, string>, fields: readonly string[]): string {
  for (const field of fields) {
    const value = address[field]?.trim();

    if (value) {
      return value;
    }
  }

  return '';
}

function hasUsableAddress(address?: Record<string, string>): address is Record<string, string> {
  return Boolean(address && Object.values(address).some((value) => value.trim()));
}

function buildStreet(address: Record<string, string>, displayName: string): string {
  const houseNumber = address.house_number?.trim();
  const road = address.road?.trim();
  const houseNumberAndRoad = [houseNumber, road].filter(Boolean).join(' ');

  return houseNumberAndRoad || getFirstAddressField(address, STREET_PLACE_FIELDS) || displayName;
}

export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodedAddress> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
    {
      headers: {
        'Accept-Language': 'fr',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`La recherche de l'adresse a échoué (${response.status}).`);
  }

  const data = (await response.json()) as NominatimReverseGeocodeResult;
  const displayName = data.display_name?.trim() || '';
  const hasAddress = hasUsableAddress(data.address);

  if (!hasAddress && !displayName) {
    throw new Error("La position détectée ne contient pas d'adresse utilisable.");
  }

  const address = data.address || {};
  const street = buildStreet(address, displayName);
  const city = getFirstAddressField(address, CITY_LOCALITY_FIELDS);
  const fullAddress = displayName || [street, city, address.country].filter(Boolean).join(', ');

  return {
    street,
    city,
    region: address.state || address.governorate || address.county || '',
    postalCode: address.postcode?.trim() || '',
    country: address.country?.trim() || 'Tunisie',
    latitude,
    longitude,
    fullAddress,
  };
}
