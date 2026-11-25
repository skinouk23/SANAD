import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { Button } from './ui/Button';
interface MapAddressPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: {
    lat: number;
    lng: number;
    displayName: string;
  }) => void;
  title: string;
  isDark?: boolean;
}
export function MapAddressPicker({
  isOpen,
  onClose,
  onSelectAddress,
  title,
  isDark = false
}: MapAddressPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    displayName: string;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // Simulate OpenStreetMap Nominatim search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Mock search results for demonstration
    // In production, use: https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}
    setTimeout(() => {
      const mockResults = [
      {
        lat: 36.8065,
        lon: 10.1815,
        display_name: `${searchQuery}, Tunis, Tunisia`
      },
      {
        lat: 36.8189,
        lon: 10.1658,
        display_name: `${searchQuery}, La Marsa, Tunisia`
      },
      {
        lat: 36.8625,
        lon: 10.1956,
        display_name: `${searchQuery}, Carthage, Tunisia`
      }];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };
  const handleSelectLocation = (result: any) => {
    setSelectedLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name
    });
  };
  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectAddress(selectedLocation);
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} max-h-[85vh] overflow-hidden`}>
        
        {/* Header */}
        <div
          className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          
          <div className="flex items-center justify-between">
            <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div
          className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une adresse..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-red-500' : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'}`} />
              
            </div>
            <Button
              onClick={handleSearch}
              variant="primary"
              className="bg-gradient-to-r from-red-500 to-orange-500">
              
              Rechercher
            </Button>
          </div>
        </div>

        {/* Map Placeholder & Results */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {/* Map Placeholder */}
          <div
            className={`rounded-xl border-2 border-dashed mb-4 h-48 flex items-center justify-center ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-gray-300 bg-gray-50'}`}>
            
            <div className="text-center">
              <MapPin
                className={`h-12 w-12 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
              
              <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                
                Carte OpenStreetMap
              </p>
              <p
                className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                
                Sélectionnez une adresse ci-dessous
              </p>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 &&
          <div className="space-y-2">
              <h4
              className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Résultats de recherche
              </h4>
              {searchResults.map((result, index) =>
            <button
              key={index}
              onClick={() => handleSelectLocation(result)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedLocation?.displayName === result.display_name ? 'border-red-500 bg-red-500/10' : isDark ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              
                  <div className="flex items-start gap-3">
                    <MapPin
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${selectedLocation?.displayName === result.display_name ? 'text-red-500' : isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                
                    <div className="flex-1 min-w-0">
                      <p
                    className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                        {result.display_name}
                      </p>
                      <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    
                        Lat: {result.lat}, Lng: {result.lon}
                      </p>
                    </div>
                    {selectedLocation?.displayName === result.display_name &&
                <Check className="h-5 w-5 text-red-500 flex-shrink-0" />
                }
                  </div>
                </button>
            )}
            </div>
          }

          {isSearching &&
          <div className="text-center py-8">
              <div
              className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
            </div>
              <p
              className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
                Recherche en cours...
              </p>
            </div>
          }
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
              
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              variant="primary"
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
              
              <Check className="h-4 w-4 mr-2" />
              Confirmer
            </Button>
          </div>
        </div>
      </div>
    </div>);

}