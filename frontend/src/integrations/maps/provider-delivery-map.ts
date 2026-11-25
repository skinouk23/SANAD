import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface DeliveryMapPoint {
  lat: number;
  lng: number;
}

export function createDeliveryMap(
  container: HTMLDivElement,
  isDark: boolean,
  patient: DeliveryMapPoint,
): L.Map {
  const map = L.map(container, {
    zoomControl: false,
    attributionControl: false,
  }).setView([patient.lat, patient.lng], 14);

  L.control.zoom({ position: 'topright' }).addTo(map);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

  return map;
}

export function createProviderMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 44px;
          height: 44px;
          background: #1d4ed8;
          border-radius: 9999px;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg style="width: 22px; height: 22px; fill: white;" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
}

export function createPatientMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 40px;
          height: 40px;
          background: #0f766e;
          border-radius: 9999px;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
}

export function upsertMarker(
  map: L.Map,
  marker: L.Marker | null,
  point: DeliveryMapPoint,
  icon: L.DivIcon,
): L.Marker {
  if (!marker) {
    return L.marker([point.lat, point.lng], { icon }).addTo(map);
  }

  marker.setLatLng([point.lat, point.lng]);
  return marker;
}

export function fitProviderDeliveryBounds(
  map: L.Map,
  provider: DeliveryMapPoint,
  patient: DeliveryMapPoint,
): void {
  const bounds = L.latLngBounds([
    [provider.lat, provider.lng],
    [patient.lat, patient.lng],
  ]);

  map.fitBounds(bounds, { padding: [60, 60] });
}

export function drawProviderRoute(
  map: L.Map,
  currentRouteLayer: L.Polyline | null,
  coordinates: [number, number][],
): L.Polyline {
  if (currentRouteLayer) {
    map.removeLayer(currentRouteLayer);
  }

  return L.polyline(coordinates, {
    color: '#3b82f6',
    weight: 5,
    opacity: 0.8,
    dashArray: '10, 10',
    lineCap: 'round',
  }).addTo(map);
}
