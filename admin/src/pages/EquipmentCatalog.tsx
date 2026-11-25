import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Package,
  Building2,
  MapPin,
  Phone,
  Mail,
  X,
  Clock,
  Loader2 } from
'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EquipmentCard } from '../components/EquipmentCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import {
  useEquipmentCategories2,
  useEquipmentCities,
  useEquipmentProviderFilters,
  useEquipmentProviderInfo,
  useCatalogEquipment } from
'../hooks/useEquipmentCatalog';
export function EquipmentCatalog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderInfoId, setSelectedProviderInfoId] = useState<
    string | undefined>(
    undefined);
  // Hooks for data
  const { data: categories, loading: catLoading } = useEquipmentCategories2();
  const { data: cities, loading: citiesLoading } = useEquipmentCities();
  const { data: providers, loading: provLoading } =
  useEquipmentProviderFilters();
  const { data: equipment, loading: eqLoading } = useCatalogEquipment();
  const { data: selectedProviderInfo } = useEquipmentProviderInfo(
    selectedProviderInfoId
  );
  const isLoggedIn = isAuthenticated;
  const loading = catLoading || citiesLoading || provLoading || eqLoading;
  const filteredEquipment = useMemo(() => {
    if (!equipment) return [];
    return equipment.filter((item) => {
      const matchesSearch = item.name.
      toLowerCase().
      includes(searchQuery.toLowerCase());
      const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesProvider =
      selectedProvider === 'all' || item.providerId === selectedProvider;
      const matchesCity = selectedCity === 'all' || item.city === selectedCity;
      return matchesSearch && matchesCategory && matchesProvider && matchesCity;
    });
  }, [equipment, searchQuery, selectedCategory, selectedProvider, selectedCity]);
  const groupedByProvider = useMemo(() => {
    if (!providers) return [];
    return providers.
    filter((p) => p.id !== 'all').
    map((provider) => ({
      ...provider,
      equipment: filteredEquipment.filter(
        (eq) => eq.providerId === provider.id
      )
    })).
    filter((group) => group.equipment.length > 0);
  }, [providers, filteredEquipment]);
  const handleViewProfile = (providerId: string) => {
    setSelectedProviderInfoId(providerId);
    setShowProviderModal(true);
  };
  const handleEquipmentClick = (equipmentId: number) => {
    if (!isAuthenticated) {
      navigate('/auth/login', {
        state: {
          returnTo: location.pathname,
          equipmentId
        }
      });
      return;
    }
    navigate(`/equipment/${equipmentId}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>);

  }
  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Location de Matériel Médical
          </h1>
          <p className="text-gray-600">
            Louez du matériel médical certifié auprès de parapharmacies et
            agences spécialisées
          </p>
        </div>

        <div className="mb-8 space-y-4">
          {/* Search and City Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white" />
              
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                
                {(cities || []).map((city) =>
                <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                )}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Catégories
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(categories || []).map((cat) =>
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-teal-300'}`}>
                
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Fournisseurs
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(providers || []).map((provider) =>
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedProvider === provider.id ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-rose-300'}`}>
                
                  <Building2 className="h-4 w-4" />
                  {provider.name}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-5 w-5 text-teal-600" />
            <span className="font-medium">
              {filteredEquipment.length} équipements disponibles
            </span>
          </div>
        </div>

        {selectedProvider === 'all' && filteredEquipment.length > 0 ?
        <div className="space-y-12">
            {groupedByProvider.map((group) =>
          <div key={group.id}>
                <Card className="mb-6 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {group.name}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {group.type === 'parapharmacie' ?
                    '🏪 Parapharmacie' :
                    '🏢 Agence de location'}
                        {' • '}
                        {group.equipment.length} équipement
                        {group.equipment.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(group.id)}>
                  
                      Voir le profil
                    </Button>
                  </div>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.equipment.map((item) =>
              <EquipmentCard
                key={item.id}
                name={item.name}
                category={item.category}
                pricePerDay={item.pricePerDay}
                imageUrl={item.imageUrl}
                provider={item.provider}
                location={item.location}
                available={item.available}
                onClick={() => handleEquipmentClick(item.id)} />

              )}
                </div>
              </div>
          )}
          </div> :
        filteredEquipment.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) =>
          <EquipmentCard
            key={item.id}
            name={item.name}
            category={item.category}
            pricePerDay={item.pricePerDay}
            imageUrl={item.imageUrl}
            provider={item.provider}
            location={item.location}
            available={item.available}
            onClick={() => handleEquipmentClick(item.id)} />

          )}
          </div> :

        <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun équipement trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        }
      </div>

      {/* Provider Profile Modal */}
      {showProviderModal && selectedProviderInfo &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProviderInfo.name}
              </h2>
              <button
              onClick={() => setShowProviderModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  {selectedProviderInfo.type === 'parapharmacie' ? '🏪' : '🏢'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedProviderInfo.type === 'parapharmacie' ?
                  'Parapharmacie' :
                  'Agence de location'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedProviderInfo.description}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Adresse
                    </div>
                    <div className="text-gray-600">
                      {selectedProviderInfo.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Téléphone
                    </div>
                    <a
                    href={`tel:${selectedProviderInfo.phone}`}
                    className="text-teal-600 hover:underline">
                    
                      {selectedProviderInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Email
                    </div>
                    <a
                    href={`mailto:${selectedProviderInfo.email}`}
                    className="text-teal-600 hover:underline">
                    
                      {selectedProviderInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Horaires
                    </div>
                    <div className="text-gray-600">
                      {selectedProviderInfo.hours}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <Button
                fullWidth
                size="lg"
                onClick={() => setShowProviderModal(false)}>
                
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}