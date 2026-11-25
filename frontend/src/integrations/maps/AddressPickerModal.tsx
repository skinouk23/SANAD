import { useCallback, useEffect, useState, useRef } from 'react';
import { X, MapPin, Search, Loader2, Navigation, Check } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { reverseGeocodeCoordinates } from '@/shared/lib/location/nominatim';
import { showErrorToast, showInfoToast } from '@/shared/lib/notifications/toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

interface AddressResult {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
}
interface AddressPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: AddressResult) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
}

function getAddressPickerErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unknown error';
}

function logAddressPickerIssue(context: string, error?: unknown): void {
  if (!import.meta.env.DEV) {
    return;
  }

  const detail = error ? `: ${getAddressPickerErrorMessage(error)}` : '';
  console.warn(`[Maps] ${context}${detail}`);
}

function getGeolocationFailureMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "L'accès à votre position a été refusé.";
    case error.POSITION_UNAVAILABLE:
      return "Votre position n'est pas disponible pour le moment.";
    case error.TIMEOUT:
      return 'La géolocalisation a pris trop de temps.';
    default:
      return "Impossible d'obtenir votre position.";
  }
}

// Constant marker icon — no dependency on component state
const CUSTOM_ICON = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 40px;
    height: 40px;
    background: #0f172a;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="
      transform: rotate(45deg);
      font-size: 18px;
    ">📍</div>
  </div>`,
  iconSize: [40, 40] as L.PointExpression,
  iconAnchor: [20, 40] as L.PointExpression,
});

function refreshLeafletMap(map: L.Map | null): void {
  if (!map) return;

  requestAnimationFrame(() => {
    map.invalidateSize();

    window.setTimeout(() => {
      map.invalidateSize();
    }, 250);
  });
}

export function AddressPickerModal({
  isOpen,
  onClose,
  onSelectAddress,
  initialLatitude = 36.8065,
  initialLongitude = 10.1815,
}: AddressPickerModalProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimSearchResult[]>([]);
  // Track selectedPosition via ref so the init effect doesn't re-run on every click
  const selectedPositionRef = useRef(selectedPosition);
  selectedPositionRef.current = selectedPosition;

  const handleMapRef = useCallback((node: HTMLDivElement | null) => {
    mapRef.current = node;
    setMapElement(node);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapElement) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create map
    const map = L.map(mapElement).setView([initialLatitude, initialLongitude], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    refreshLeafletMap(map);
    map.whenReady(() => refreshLeafletMap(map));

    // Add click handler
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setSelectedPosition({
        lat,
        lng,
      });
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: CUSTOM_ICON,
        }).addTo(map);
      }

      refreshLeafletMap(map);

      // Reverse geocode
      await reverseGeocode(lat, lng);
    });
    // Add initial marker if position exists
    if (selectedPositionRef.current) {
      markerRef.current = L.marker(
        [selectedPositionRef.current.lat, selectedPositionRef.current.lng],
        {
          icon: CUSTOM_ICON,
        },
      ).addTo(map);

      refreshLeafletMap(map);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, mapElement, initialLatitude, initialLongitude]);
  // Reverse geocode using Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    setSelectedAddress(null);

    try {
      const geocoded = await reverseGeocodeCoordinates(lat, lng);
      const result: AddressResult = {
        street: geocoded.street,
        city: geocoded.city,
        region: geocoded.region,
        postalCode: geocoded.postalCode,
        country: geocoded.country,
        latitude: lat,
        longitude: lng,
        fullAddress: geocoded.fullAddress,
      };
      setSelectedAddress(result);
    } catch (error) {
      logAddressPickerIssue('Reverse geocoding failed', error);
      showErrorToast(error, "Impossible de récupérer l'adresse pour ce point.");
    } finally {
      setIsLoading(false);
    }
  };
  // Search for address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=tn&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Address search request failed (${response.status})`);
      }

      const data = (await response.json()) as NominatimSearchResult[];
      const nextResults = Array.isArray(data) ? data : [];
      setSearchResults(nextResults);

      if (nextResults.length === 0) {
        showInfoToast('Aucune adresse trouvée pour cette recherche.');
      }
    } catch (error) {
      logAddressPickerIssue('Address search failed', error);
      showErrorToast(error, "La recherche d'adresse a échoué. Réessayez.");
    } finally {
      setIsSearching(false);
    }
  };
  // Handle search result selection
  const handleSelectSearchResult = (result: NominatimSearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSelectedPosition({
      lat,
      lng,
    });
    setSearchResults([]);
    setSearchQuery('');
    // Update map view and marker
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: CUSTOM_ICON,
        }).addTo(mapInstanceRef.current);
      }

      refreshLeafletMap(mapInstanceRef.current);
    }
    // Reverse geocode to get full address details
    reverseGeocode(lat, lng);
  };
  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showInfoToast("La géolocalisation n'est pas prise en charge par votre navigateur.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition({
          lat: latitude,
          lng: longitude,
        });
        // Update map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude], {
              icon: CUSTOM_ICON,
            }).addTo(mapInstanceRef.current);
          }

          refreshLeafletMap(mapInstanceRef.current);
        }
        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        logAddressPickerIssue('Geolocation failed', error);
        setIsLoading(false);
        showErrorToast(error, getGeolocationFailureMessage(error));
      },
      {
        enableHighAccuracy: true,
      },
    );
  };
  // Confirm selection
  const handleConfirm = () => {
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] max-w-3xl gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 text-card-foreground shadow-xl"
      >
        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Sélectionner une adresse
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Cliquez sur la carte ou recherchez une adresse
              </DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer la sélection d'adresse"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Search bar */}
        <div className="border-b border-border p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une adresse..."
                className="w-full rounded-lg border border-input bg-input py-2.5 pl-10 pr-4 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Rechercher'}
            </button>
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Ma position"
            >
              <Navigation className="h-5 w-5" />
            </button>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-lg border border-border bg-background">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSearchResult(result)}
                  className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent/40"
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />

                  <span className="text-sm text-foreground">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="relative z-0 h-[320px] min-h-[320px] overflow-hidden bg-muted">
          <div ref={handleMapRef} className="h-full min-h-[320px] w-full" />
        </div>

        {/* Selected address */}
        <div className="border-t border-border p-4">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />

              <span className="text-muted-foreground">Recherche de l'adresse...</span>
            </div>
          ) : selectedAddress ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />

                  <div>
                    <p className="font-medium text-foreground">
                      {selectedAddress.street || 'Adresse'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {[selectedAddress.postalCode, selectedAddress.city, selectedAddress.region]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Check className="h-5 w-5" />
                Confirmer cette adresse
              </button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Cliquez sur la carte pour sélectionner une adresse
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
