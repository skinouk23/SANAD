import React, {
  useEffect,
  useState,
  useRef,
  createElement,
  Component } from
'react';
import { X, MapPin, Search, Loader2, Navigation, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
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
export function AddressPickerModal({
  isOpen,
  onClose,
  onSelectAddress,
  initialLatitude = 36.8065,
  initialLongitude = 10.1815
}: AddressPickerModalProps) {
  const { isDark } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  // Load Leaflet dynamically
  useEffect(() => {
    if (!isOpen) return;
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if ((window as any).L) {
        setMapLoaded(true);
        return;
      }
      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);
      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };
    loadLeaflet();
  }, [isOpen]);
  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapLoaded || !mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;
    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    // Create map
    const map = L.map(mapRef.current).setView(
      [initialLatitude, initialLongitude],
      13
    );
    mapInstanceRef.current = map;
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 18px;
        ">📍</div>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    // Add click handler
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedPosition({
        lat,
        lng
      });
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: customIcon
        }).addTo(map);
      }
      // Reverse geocode
      await reverseGeocode(lat, lng);
    });
    // Add initial marker if position exists
    if (selectedPosition) {
      markerRef.current = L.marker(
        [selectedPosition.lat, selectedPosition.lng],
        {
          icon: customIcon
        }
      ).addTo(map);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, mapLoaded, initialLatitude, initialLongitude]);
  // Reverse geocode using Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const result: AddressResult = {
          street:
          [addr.house_number, addr.road].filter(Boolean).join(' ') ||
          addr.neighbourhood ||
          '',
          city:
          addr.city || addr.town || addr.village || addr.municipality || '',
          region: addr.state || addr.county || '',
          postalCode: addr.postcode || '',
          country: addr.country || 'Tunisie',
          latitude: lat,
          longitude: lng,
          fullAddress: data.display_name || ''
        };
        setSelectedAddress(result);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
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
            'Accept-Language': 'fr'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  // Handle search result selection
  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSelectedPosition({
      lat,
      lng
    });
    setSearchResults([]);
    setSearchQuery('');
    // Update map view and marker
    if (mapInstanceRef.current) {
      const L = (window as any).L;
      mapInstanceRef.current.setView([lat, lng], 16);
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 18px;
          ">📍</div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: customIcon
        }).addTo(mapInstanceRef.current);
      }
    }
    // Reverse geocode to get full address details
    reverseGeocode(lat, lng);
  };
  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition({
          lat: latitude,
          lng: longitude
        });
        // Update map
        if (mapInstanceRef.current) {
          const L = (window as any).L;
          mapInstanceRef.current.setView([latitude, longitude], 16);
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #06b6d4, #3b82f6);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-size: 18px;
              ">📍</div>
            </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          });
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude], {
              icon: customIcon
            }).addTo(mapInstanceRef.current);
          }
        }
        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoading(false);
        alert("Impossible d'obtenir votre position");
      },
      {
        enableHighAccuracy: true
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose} />
      

      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Sélectionner une adresse
              </h2>
              <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                Cliquez sur la carte ou recherchez une adresse
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search bar */}
        <div
          className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une adresse..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'}`} />
              
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              
              {isSearching ?
              <Loader2 className="h-5 w-5 animate-spin" /> :

              'Rechercher'
              }
            </button>
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              title="Ma position">
              
              <Navigation className="h-5 w-5" />
            </button>
          </div>

          {/* Search results */}
          {searchResults.length > 0 &&
          <div
            className={`mt-2 rounded-lg border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              {searchResults.map((result, index) =>
            <button
              key={index}
              onClick={() => handleSelectSearchResult(result)}
              className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 ${isDark ? 'hover:bg-slate-800 border-b border-slate-700 last:border-0' : 'hover:bg-slate-50 border-b border-slate-100 last:border-0'}`}>
              
                  <MapPin
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              
                  <span
                className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    {result.display_name}
                  </span>
                </button>
            )}
            </div>
          }
        </div>

        {/* Map */}
        <div className="relative h-[220px]">
          {!mapLoaded &&
          <div
            className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            
              <Loader2
              className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            </div>
          }
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Selected address */}
        <div
          className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          
          {isLoading ?
          <div className="flex items-center gap-3">
              <Loader2
              className={`h-5 w-5 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Recherche de l'adresse...
              </span>
            </div> :
          selectedAddress ?
          <div className="space-y-3">
              <div
              className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              
                <div className="flex items-start gap-3">
                  <MapPin
                  className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                  <div>
                    <p
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {selectedAddress.street || 'Adresse'}
                    </p>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      {[
                    selectedAddress.postalCode,
                    selectedAddress.city,
                    selectedAddress.region].

                    filter(Boolean).
                    join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              <button
              onClick={handleConfirm}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              
                <Check className="h-5 w-5" />
                Confirmer cette adresse
              </button>
            </div> :

          <p
            className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            
              Cliquez sur la carte pour sélectionner une adresse
            </p>
          }
        </div>
      </div>
    </div>);

}