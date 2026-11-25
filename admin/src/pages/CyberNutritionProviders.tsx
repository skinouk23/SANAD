import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  UtensilsCrossed,
  ChefHat,
  Award,
  Phone,
  Calendar,
  CheckCircle2,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNutritionProviders } from '../hooks/useProviders';
export function CyberNutritionProviders() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'all' | 'restaurants' | 'chefs' | 'nutritionists'>(
    'all');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const { data: providers, loading } = useNutritionProviders(
    selectedZone ?
    {
      city: selectedZone
    } :
    undefined
  );
  const dietTypes = [
  {
    id: 'diabetic',
    label: 'Diabétique',
    icon: '🩺'
  },
  {
    id: 'low-salt',
    label: 'Pauvre en sel',
    icon: '🧂'
  },
  {
    id: 'post-surgery',
    label: 'Post-hospitalisation',
    icon: '🏥'
  },
  {
    id: 'cardiac',
    label: 'Cardiaque',
    icon: '❤️'
  },
  {
    id: 'renal',
    label: 'Rénal',
    icon: '💧'
  },
  {
    id: 'vegetarian',
    label: 'Végétarien',
    icon: '🥗'
  }];

  const zones = [
  'Tunis',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous'];

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
  const filteredProviders = providers.filter((provider) => {
    const providerType = (provider as any).type || 'nutritionist';
    if (activeTab !== 'all' && providerType !== activeTab.replace('s', ''))
    return false;
    if (
    selectedDiet &&
    (provider as any).dietTypes &&
    !(provider as any).dietTypes.includes(selectedDiet))

    return false;
    return true;
  });
  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with WOW effect */}
          <div className="relative rounded-[16px] p-[2px] overflow-hidden shadow-sm mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div
              className={`relative rounded-[14px] p-4 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xl">
                  🍽️
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Nutrition & Repas Adaptés
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Repas diabétiques, pauvres en sel, post-hospitalisation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Type de régime
                </label>
                <select
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                  
                  <option value="">Tous les régimes</option>
                  {dietTypes.map((diet) =>
                  <option key={diet.id} value={diet.id}>
                      {diet.icon} {diet.label}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Zone géographique
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                  
                  <option value="">Toutes les zones</option>
                  {zones.map((zone) =>
                  <option key={zone} value={zone}>
                      {zone}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Rechercher
                </label>
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  
                  <input
                    type="text"
                    placeholder="Nom, spécialité..."
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                  
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`backdrop-blur-sm border rounded-xl mb-3 overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <div
              className={`flex border-b overflow-x-auto gap-2 p-1.5 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              
              {[
              {
                id: 'all',
                label: 'Tous',
                count: providers.length
              },
              {
                id: 'restaurants',
                label: 'Restaurants',
                icon: UtensilsCrossed,
                count: providers.filter((p: any) => p.type === 'restaurant').
                length
              },
              {
                id: 'chefs',
                label: 'Chefs',
                icon: ChefHat,
                count: providers.filter((p: any) => p.type === 'chef').length
              },
              {
                id: 'nutritionists',
                label: 'Nutritionnistes',
                icon: Award,
                count: providers.filter((p: any) => p.type === 'nutritionist').
                length
              }].
              map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-0 px-3 py-2 font-semibold text-xs sm:text-sm transition-colors relative whitespace-nowrap rounded-lg ${activeTab === tab.id ? 'text-orange-500 bg-orange-500/10' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                
                  {tab.icon &&
                <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline-block mr-1" />
                }
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              <span
                className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredProviders.length}
              </span>{' '}
              professionnel{filteredProviders.length > 1 ? 's' : ''} disponible
              {filteredProviders.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Providers List */}
          {loading ?
          <div className="flex justify-center items-center py-6">
              <Loader2
              className={`h-8 w-8 animate-spin ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((provider) => {
              const type = (provider as any).type || 'nutritionist';
              const ProviderIcon = getTypeIcon(type);
              return (
                <div
                  key={provider.id}
                  className={`backdrop-blur-sm border rounded-xl overflow-hidden transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-orange-500/50' : 'bg-white/80 border-slate-200 hover:border-orange-500/50 shadow-sm'}`}>
                  
                    <div className="h-32 relative">
                      {provider.imageUrl ?
                    <img
                      src={provider.imageUrl}
                      alt={provider.name}
                      className="w-full h-full object-cover" /> :


                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                          <ProviderIcon className="h-10 w-10 text-white opacity-50" />
                        </div>
                    }
                      <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {provider.rating}
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[10px] font-medium text-white flex items-center gap-1">
                        <ProviderIcon className="h-3 w-3" />
                        {getTypeLabel(type)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3
                      className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {provider.name}
                      </h3>
                      <div
                      className={`flex items-center gap-1 text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        <MapPin className="h-3 w-3" />
                        <span>{provider.location.city}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {(provider as any).dietTypes?.map((dietId: string) => {
                        const dietInfo = dietTypes.find(
                          (d) => d.id === dietId
                        );
                        if (!dietInfo) return null;
                        return (
                          <span
                            key={dietId}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            
                              {dietInfo.icon} {dietInfo.label}
                            </span>);

                      })}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <button
                        onClick={() =>
                        navigate('/nutrition-booking', {
                          state: {
                            provider
                          }
                        })
                        }
                        className="flex-1 relative group overflow-hidden">
                        
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                          <div className="relative px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 group-hover:scale-105 transition-transform">
                            <Calendar className="h-3 w-3" /> Commander
                          </div>
                        </button>
                        <button
                        onClick={() =>
                        window.location.href = `tel:${provider.phone}`
                        }
                        className={`p-1.5 border rounded-lg transition-all flex items-center justify-center ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                        
                          <Phone className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          }
        </div>
      </div>
    </div>);

}