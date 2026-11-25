export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface DrivingRoute {
  coordinates: [number, number][];
  distanceKm: string;
  durationMinutes: string;
}

interface OsrmResponse {
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: { coordinates: [number, number][] };
  }>;
}

export async function getDrivingRoute(start: RoutePoint, end: RoutePoint): Promise<DrivingRoute> {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,
  );

  if (!response.ok) {
    throw new Error('OSRM route request failed');
  }

  const payload = (await response.json()) as OsrmResponse;
  const route = payload.routes?.[0];

  if (!route) {
    throw new Error('No route returned');
  }

  return {
    coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]),
    distanceKm: `${(route.distance / 1000).toFixed(1)} km`,
    durationMinutes: `${Math.ceil(route.duration / 60)} min`,
  };
}
