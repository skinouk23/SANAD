const GOOGLE_MAPS_SEARCH_BASE_URL = 'https://www.google.com/maps/search/?api=1&query=';

export function buildGoogleMapsSearchUrl(query: string): string {
  return `${GOOGLE_MAPS_SEARCH_BASE_URL}${encodeURIComponent(query)}`;
}

export function openExternalMapSearch(query: string): void {
  window.open(buildGoogleMapsSearchUrl(query), '_blank');
}
