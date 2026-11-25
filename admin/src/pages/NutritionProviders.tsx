import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  UtensilsCrossed,
  ChefHat,
  Award,
  Heart,
  Leaf,
  Users,
  Phone,
  Calendar } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  useNutritionDietTypes,
  useNutritionZones,
  useNutritionProvidersList } from
'../hooks/useNutrition';
export function NutritionProviders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'all' | 'restaurants' | 'chefs' | 'nutritionists'>(
    'all');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  // Hook-based data fetching
  const { data: dietTypes } = useNutritionDietTypes();
  const { data: zones } = useNutritionZones();
  const { data: providers } = useNutritionProvidersList();
  const safeDietTypes = dietTypes ?? [];
  const safeZones = zones ?? [];
  const safeProviders = providers ?? [];
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'Restaurant';
      case 'chef':
        return 'Chef à domicile';
      case 'nutritionist':
        return 'Nutritionniste';
      default:
        return type;
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return UtensilsCrossed;
      case 'chef':
        return ChefHat;
      case 'nutritionist':
        return Award;
      default:
        return UtensilsCrossed;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'chef':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'nutritionist':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const filteredProviders = safeProviders.filter((provider) => {
    if (activeTab !== 'all' && provider.type !== activeTab.replace('s', ''))
    return false;
    if (selectedDiet && !provider.dietTypes.includes(selectedDiet)) return false;
    if (selectedZone && provider.zone !== selectedZone) return false;
    return true;
  });
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux services
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nutrition & Repas Adaptés
              </h1>
            </div>
            <p className="text-gray-600">
              Repas diabétiques, pauvres en sel, post-hospitalisation
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Diet Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Type de régime
              </label>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                
                <option value="">Tous les régimes</option>
                {safeDietTypes.map((diet) =>
                <option key={diet.id} value={diet.id}>
                    {diet.icon} {diet.label}
                  </option>
                )}
              </select>
            </div>

            {/* Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Zone géographique
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                
                <option value="">Toutes les zones</option>
                {safeZones.map((zone) =>
                <option key={zone} value={zone}>
                    {zone}
                  </option>
                )}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, spécialité..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card className="mb-6 p-0 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'all' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              Tous ({safeProviders.length})
              {activeTab === 'all' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'restaurants' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              <UtensilsCrossed className="h-4 w-4 inline-block mr-2" />
              Restaurants (
              {safeProviders.filter((p) => p.type === 'restaurant').length})
              {activeTab === 'restaurants' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('chefs')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'chefs' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              <ChefHat className="h-4 w-4 inline-block mr-2" />
              Chefs ({safeProviders.filter((p) => p.type === 'chef').length})
              {activeTab === 'chefs' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('nutritionists')}
              className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'nutritionists' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              <Award className="h-4 w-4 inline-block mr-2" />
              Nutritionnistes (
              {safeProviders.filter((p) => p.type === 'nutritionist').length})
              {activeTab === 'nutritionists' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              }
            </button>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">
              {filteredProviders.length}
            </span>{' '}
            professionnel{filteredProviders.length > 1 ? 's' : ''} disponible
            {filteredProviders.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Providers List */}
        <div className="space-y-6">
          {filteredProviders.map((provider) => {
            const TypeIcon = getTypeIcon(provider.type);
            return (
              <Card
                key={provider.id}
                className="hover:shadow-lg transition-shadow">
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-4xl">
                      {provider.image}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {provider.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getTypeColor(provider.type)}`}>
                            
                            <TypeIcon className="h-3 w-3" />
                            {getTypeLabel(provider.type)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {provider.specialty}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {provider.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold">
                              {provider.rating}
                            </span>
                            <span>({provider.reviews} avis)</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{provider.zone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {provider.price} TND
                        </p>
                        <p className="text-xs text-gray-500">
                          {provider.type === 'nutritionist' ?
                          'par consultation' :
                          'par repas'}
                        </p>
                      </div>
                    </div>

                    {/* Diet Types */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.dietTypes.map((dietId) => {
                        const diet = dietTypes.find((d) => d.id === dietId);
                        return diet ?
                        <span
                          key={dietId}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                          
                            {diet.icon} {diet.label}
                          </span> :
                        null;
                      })}
                      {provider.delivery &&
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                          🚚 Livraison
                        </span>
                      }
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.certifications.map((cert, index) =>
                      <span
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        
                          <Award className="h-3 w-3" />
                          {cert}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() =>
                        navigate('/nutrition-booking', {
                          state: {
                            provider
                          }
                        })
                        }>
                        
                        <Calendar className="h-4 w-4 mr-2" />
                        {provider.type === 'nutritionist' ?
                        'Prendre rendez-vous' :
                        'Commander'}
                      </Button>
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                      <Button variant="outline">Voir le profil</Button>
                    </div>
                  </div>
                </div>
              </Card>);

          })}
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">
                💡 Besoin d'un accompagnement personnalisé ?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Notre concierge santé peut vous aider à choisir le professionnel
                le plus adapté à votre régime alimentaire et coordonner vos
                repas thérapeutiques.
              </p>
              <Button variant="primary">Contacter le concierge santé</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}