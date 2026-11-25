/**
 * useServiceLocationChoice
 *
 * Normalizes selected services into the shared booking location contract.
 */

import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PatientServiceItemResponse } from '@/features/services/schema';

// ============================================
// TYPES
// ============================================

type NormalizedServiceLocation = 'home' | 'provider_site' | 'both';

export type ServiceLocation = 'home' | 'provider_site' | null;

interface UseServiceLocationChoiceResult {
  needsLocationSelection: boolean;
  effectiveLocation: ServiceLocation;
  selectedLocation: ServiceLocation;
  setSelectedLocation: Dispatch<SetStateAction<ServiceLocation>>;
  isLocationCompatible: boolean;
  allowsHome: boolean;
  allowsProviderSite: boolean;
  requiresAddress: boolean;
}

// ============================================
// HELPERS
// ============================================

function normalizeServiceLocation(
  serviceLocation: PatientServiceItemResponse['serviceLocation'],
): NormalizedServiceLocation {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'home';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'provider_site';
}

// ============================================
// HOOK
// ============================================

export function useServiceLocationChoice(
  selectedServices: PatientServiceItemResponse[],
): UseServiceLocationChoiceResult {
  const [selectedLocation, setSelectedLocation] = useState<ServiceLocation>(null);

  const locationCapabilities = useMemo(() => {
    if (selectedServices.length === 0) {
      return {
        allowsHome: false,
        allowsProviderSite: false,
      };
    }

    return selectedServices.reduce(
      (capabilities, service) => {
        const locationType = normalizeServiceLocation(service.serviceLocation);

        return {
          allowsHome: capabilities.allowsHome && locationType !== 'provider_site',
          allowsProviderSite: capabilities.allowsProviderSite && locationType !== 'home',
        };
      },
      {
        allowsHome: true,
        allowsProviderSite: true,
      },
    );
  }, [selectedServices]);

  const hasSelectedServices = selectedServices.length > 0;
  const isLocationCompatible =
    hasSelectedServices &&
    (locationCapabilities.allowsHome || locationCapabilities.allowsProviderSite);

  const needsLocationSelection =
    isLocationCompatible &&
    locationCapabilities.allowsHome &&
    locationCapabilities.allowsProviderSite;
  const returnedSelectedLocation = isLocationCompatible ? selectedLocation : null;

  useEffect(() => {
    if (!isLocationCompatible) {
      setSelectedLocation(null);
      return;
    }

    if (!locationCapabilities.allowsHome) {
      setSelectedLocation('provider_site');
      return;
    }

    if (!locationCapabilities.allowsProviderSite) {
      setSelectedLocation('home');
      return;
    }

    setSelectedLocation((current) =>
      current === 'home' || current === 'provider_site' ? current : null,
    );
  }, [
    isLocationCompatible,
    locationCapabilities.allowsHome,
    locationCapabilities.allowsProviderSite,
  ]);

  const effectiveLocation = useMemo<ServiceLocation>(() => {
    if (!isLocationCompatible) {
      return null;
    }

    if (needsLocationSelection) {
      return selectedLocation;
    }

    if (locationCapabilities.allowsHome) {
      return 'home';
    }

    if (locationCapabilities.allowsProviderSite) {
      return 'provider_site';
    }

    return null;
  }, [
    isLocationCompatible,
    locationCapabilities.allowsHome,
    locationCapabilities.allowsProviderSite,
    needsLocationSelection,
    selectedLocation,
  ]);

  return {
    needsLocationSelection,
    effectiveLocation,
    selectedLocation: returnedSelectedLocation,
    setSelectedLocation,
    isLocationCompatible,
    allowsHome: locationCapabilities.allowsHome,
    allowsProviderSite: locationCapabilities.allowsProviderSite,
    requiresAddress: effectiveLocation === 'home',
  };
}
