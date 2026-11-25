import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createDeliveryMap,
  createPatientMarkerIcon,
  createProviderMarkerIcon,
  drawProviderRoute,
  fitProviderDeliveryBounds,
  type DeliveryMapPoint,
  upsertMarker,
} from '@/integrations/maps/provider-delivery-map';
import { getDrivingRoute } from '@/integrations/routing/osrm';

interface ProviderDeliveryTrackingState {
  distance: string;
  duration: string;
  loading: boolean;
  routeError: string | null;
  geoError: string | null;
}

interface ProviderDeliveryTrackingMapProps {
  patientCoordinates: DeliveryMapPoint;
  isDark: boolean;
  trackingEnabled: boolean;
  routeUnavailableLabel: string;
  geoUnavailableLabel: string;
  onStateChange: (state: ProviderDeliveryTrackingState) => void;
}

const DEFAULT_TRACKING_STATE: ProviderDeliveryTrackingState = {
  distance: '',
  duration: '',
  loading: true,
  routeError: null,
  geoError: null,
};

const GEOLOCATION_MAXIMUM_AGE_MS = 5000;
const ROUTE_REFRESH_INTERVAL_MS = 15000;
const ROUTE_REFRESH_DISTANCE_METERS = 50;
const EARTH_RADIUS_METERS = 6371000;

function getDistanceMeters(start: DeliveryMapPoint, end: DeliveryMapPoint): number {
  const startLat = (start.lat * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const deltaLat = ((end.lat - start.lat) * Math.PI) / 180;
  const deltaLng = ((end.lng - start.lng) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

export function ProviderDeliveryTrackingMap({
  patientCoordinates,
  isDark,
  trackingEnabled,
  routeUnavailableLabel,
  geoUnavailableLabel,
  onStateChange,
}: ProviderDeliveryTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof createDeliveryMap> | null>(null);
  const providerMarkerRef = useRef<ReturnType<typeof upsertMarker> | null>(null);
  const patientMarkerRef = useRef<ReturnType<typeof upsertMarker> | null>(null);
  const routeLayerRef = useRef<ReturnType<typeof drawProviderRoute> | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const routeRequestIdRef = useRef(0);
  const lastRouteOriginRef = useRef<DeliveryMapPoint | null>(null);
  const lastRouteRequestedAtRef = useRef(0);
  const hasFitInitialBoundsRef = useRef(false);
  const [providerLocation, setProviderLocation] = useState<DeliveryMapPoint | null>(null);
  const [trackingState, setTrackingState] =
    useState<ProviderDeliveryTrackingState>(DEFAULT_TRACKING_STATE);

  const updateTrackingState = useCallback((nextState: Partial<ProviderDeliveryTrackingState>) => {
    setTrackingState((currentState) => {
      const mergedState = {
        ...currentState,
        ...nextState,
      };

      if (
        mergedState.distance === currentState.distance &&
        mergedState.duration === currentState.duration &&
        mergedState.loading === currentState.loading &&
        mergedState.routeError === currentState.routeError &&
        mergedState.geoError === currentState.geoError
      ) {
        return currentState;
      }

      return mergedState;
    });
  }, []);

  const invalidateRouteRequests = useCallback(() => {
    routeRequestIdRef.current += 1;
  }, []);

  const resetRouteRefresh = useCallback(() => {
    lastRouteOriginRef.current = null;
    lastRouteRequestedAtRef.current = 0;
  }, []);

  const clearGeoWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const clearRoute = useCallback(() => {
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    invalidateRouteRequests();
  }, [invalidateRouteRequests]);

  const shouldRefreshRoute = useCallback((nextProviderLocation: DeliveryMapPoint) => {
    const previousRouteOrigin = lastRouteOriginRef.current;

    if (!previousRouteOrigin) {
      return true;
    }

    if (Date.now() - lastRouteRequestedAtRef.current >= ROUTE_REFRESH_INTERVAL_MS) {
      return true;
    }

    return (
      getDistanceMeters(previousRouteOrigin, nextProviderLocation) >= ROUTE_REFRESH_DISTANCE_METERS
    );
  }, []);

  const updateRoute = useCallback(
    async (start: DeliveryMapPoint, end: DeliveryMapPoint) => {
      const requestId = routeRequestIdRef.current + 1;
      routeRequestIdRef.current = requestId;
      lastRouteOriginRef.current = start;
      lastRouteRequestedAtRef.current = Date.now();

      try {
        updateTrackingState({ routeError: null });

        const route = await getDrivingRoute(start, end);

        if (requestId !== routeRequestIdRef.current) {
          return;
        }

        updateTrackingState({
          distance: route.distanceKm,
          duration: route.durationMinutes,
        });

        if (mapInstanceRef.current) {
          routeLayerRef.current = drawProviderRoute(
            mapInstanceRef.current,
            routeLayerRef.current,
            route.coordinates,
          );
        }
      } catch {
        if (requestId !== routeRequestIdRef.current) {
          return;
        }

        clearRoute();
        updateTrackingState({
          distance: '',
          duration: '',
          routeError: routeUnavailableLabel,
        });
      }
    },
    [clearRoute, routeUnavailableLabel, updateTrackingState],
  );

  useEffect(() => {
    onStateChange(trackingState);
  }, [onStateChange, trackingState]);

  useEffect(() => {
    updateTrackingState({ loading: true });
    resetRouteRefresh();
    hasFitInitialBoundsRef.current = false;
    invalidateRouteRequests();
  }, [invalidateRouteRequests, patientCoordinates, resetRouteRefresh, updateTrackingState]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (mapInstanceRef.current) {
      invalidateRouteRequests();
      resetRouteRefresh();
      hasFitInitialBoundsRef.current = false;
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      providerMarkerRef.current = null;
      patientMarkerRef.current = null;
      routeLayerRef.current = null;
    }

    mapInstanceRef.current = createDeliveryMap(mapRef.current, isDark, patientCoordinates);
    updateTrackingState({ loading: false });
  }, [invalidateRouteRequests, isDark, patientCoordinates, resetRouteRefresh, updateTrackingState]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    patientMarkerRef.current = upsertMarker(
      map,
      patientMarkerRef.current,
      patientCoordinates,
      createPatientMarkerIcon(),
    );

    if (!providerLocation) {
      map.setView([patientCoordinates.lat, patientCoordinates.lng], 14);
      clearRoute();
      resetRouteRefresh();
      hasFitInitialBoundsRef.current = false;
      updateTrackingState({ distance: '', duration: '', routeError: null });
      return;
    }

    providerMarkerRef.current = upsertMarker(
      map,
      providerMarkerRef.current,
      providerLocation,
      createProviderMarkerIcon(),
    );

    if (!hasFitInitialBoundsRef.current) {
      fitProviderDeliveryBounds(map, providerLocation, patientCoordinates);
      hasFitInitialBoundsRef.current = true;
    }

    if (shouldRefreshRoute(providerLocation)) {
      void updateRoute(providerLocation, patientCoordinates);
    }
  }, [
    clearRoute,
    patientCoordinates,
    providerLocation,
    resetRouteRefresh,
    shouldRefreshRoute,
    updateRoute,
    updateTrackingState,
  ]);

  useEffect(() => {
    if (!trackingEnabled) {
      clearGeoWatch();
      updateTrackingState({ geoError: null });
      return;
    }

    if (!('geolocation' in navigator)) {
      updateTrackingState({ geoError: geoUnavailableLabel });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setProviderLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        updateTrackingState({ geoError: null });
      },
      () => {
        updateTrackingState({ geoError: geoUnavailableLabel });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: GEOLOCATION_MAXIMUM_AGE_MS,
      },
    );

    return clearGeoWatch;
  }, [clearGeoWatch, geoUnavailableLabel, trackingEnabled, updateTrackingState]);

  useEffect(() => {
    return () => {
      invalidateRouteRequests();
      clearGeoWatch();

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [clearGeoWatch, invalidateRouteRequests]);

  return <div ref={mapRef} className="h-full w-full" />;
}

export type { ProviderDeliveryTrackingState };
