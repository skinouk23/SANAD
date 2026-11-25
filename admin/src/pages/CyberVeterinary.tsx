import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PawPrint,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  Search,
  Shield,
  AlertCircle,
  Loader2,
  Stethoscope,
  Heart } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useProviders } from '../hooks/useProviders';
export function CyberVeterinary() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: providers, loading } = useProviders({
    serviceType: 'veterinary' as any
  });
  const displayProviders =
  providers.length > 0 ?
  providers :
  [
  {
    id: 'vet-1',
    name: 'Clinique Vétérinaire de Carthage',
    rating: 4.9,
    reviewCount: 128,
    location: {
      address: 'Rue de la République, Carthage',
      distance: '1.2 km'
    },
    phone: '+216 71 123 456',
    specialties: ['Chirurgie', 'Radiologie', 'Urgences 24/7'],
    available: true,
    imageUrl: null
  },
  {
    id: 'vet-2',
    name: 'Cabinet Dr. Ben Ahmed',
    rating: 4.7,
    reviewCount: 85,
    location: {
      address: 'Av. Habib Bourguiba, Marsa',
      distance: '3.5 km'
    },
    phone: '+216 71 987 654',
    specialties: ['Médecine générale', 'Vaccination', 'NAC'],
    available: true,
    imageUrl: null
  },
  {
    id: 'vet-3',
    name: 'SOS Vétérinaire Tunis',
    rating: 4.8,
    reviewCount: 210,
    location: {
      address: 'Centre Urbain Nord, Tunis',
      distance: '5.0 km'
    },
    phone: '+216 71 555 555',
    specialties: ['Urgences 24/7', 'Hospitalisation', 'Laboratoire'],
    available: true,
    imageUrl: null
  },
  {
    id: 'vet-4',
    name: 'Clinique Vétérinaire Les Berges du Lac',
    rating: 4.6,
    reviewCount: 62,
    location: {
      address: 'Rue du Lac Léman, Les Berges du Lac',
      distance: '4.2 km'
    },
    phone: '+216 71 444 333',
    specialties: ['Dermatologie', 'Toilettage', 'Pension'],
    available: false,
    imageUrl: null
  }];

  const popularServices = [
  {
    name: 'Consultation générale',
    price: '45 TND'
  },
  {
    name: 'Vaccination',
    price: '35 TND'
  },
  {
    name: 'Stérilisation chat',
    price: '100 TND'
  },
  {
    name: 'Détartrage',
    price: '80 TND'
  },
  {
    name: 'Toilettage',
    price: '35 TND'
  },
  {
    name: 'Urgence vétérinaire',
    price: '120 TND'
  }];

  const animalTypes = [
  {
    name: 'Chiens',
    emoji: '🐕'
  },
  {
    name: 'Chats',
    emoji: '🐈'
  },
  {
    name: 'Oiseaux',
    emoji: '🐦'
  },
  {
    name: 'NAC',
    emoji: '🐰'
  },
  {
    name: 'Reptiles',
    emoji: '🐢'
  }];

  const filteredProviders = displayProviders.filter(
    (provider: any) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.location.address.
    toLowerCase().
    includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* WOW EFFECT: Animated Gradient Border Header */}
          <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-xl mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#f59e0b_100%)]" />
            <div
              className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <PawPrint className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Vétérinaires & Cliniques Animales
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Soins experts pour vos compagnons à poils, à plumes et à
                    écailles
                  </p>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg border mb-3 ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                
                <p
                  className={`text-xs ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                  
                  Nos vétérinaires partenaires prennent soin de vos compagnons à
                  quatre pattes. Consultations en clinique ou à domicile
                  disponibles.
                </p>
              </div>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher un vétérinaire, une clinique..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm'}`} />
                
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <h2
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredProviders.length} vétérinaire
                {filteredProviders.length > 1 ? 's' : ''} disponible
                {filteredProviders.length > 1 ? 's' : ''}
              </h2>
              {loading ?
              <div className="flex justify-center items-center py-6">
                  <Loader2
                  className={`h-8 w-8 animate-spin ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                
                </div> :

              filteredProviders.map((provider: any) =>
              <div
                key={provider.id}
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-orange-500/50' : 'bg-white/80 border-slate-200 hover:border-orange-500/50 shadow-sm'}`}>
                
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-between sm:flex-col sm:items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                            <PawPrint className="h-6 w-6 text-white" />
                          </div>
                          {provider.available &&
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 border border-green-500/50 text-green-500 text-[10px] rounded-full font-bold">
                              <Clock className="h-2.5 w-2.5" />
                              Ouvert
                            </span>
                      }
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3
                          className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {provider.name}
                            </h3>
                            {provider.specialties?.some((s: string) =>
                        s.includes('Urgences')
                        ) &&
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500/20 border border-red-500/50 text-red-500 text-[9px] rounded-full font-bold">
                                <AlertCircle className="h-2.5 w-2.5" />
                                Urgences 24h/24
                              </span>
                        }
                          </div>
                          <div
                        className={`flex items-center gap-2 text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <div className="flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                              <span
                            className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                                {provider.rating}
                              </span>
                              <span>({provider.reviewCount})</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              <span>
                                {provider.location?.distance || '2.5 km'}
                              </span>
                            </div>
                          </div>
                          <p
                        className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {provider.location?.address}
                          </p>
                          <div
                        className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        
                            <MapPin className="h-2.5 w-2.5" />
                            <span className="font-medium">
                              Visites à domicile disponibles
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {provider.specialties?.map(
                        (specialty: string, index: number) =>
                        <span
                          key={index}
                          className={`px-1.5 py-0.5 text-[9px] rounded-full font-semibold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                          
                                {specialty}
                              </span>

                      )}
                        </div>
                        <div className="flex gap-2">
                          <button
                        onClick={() =>
                        navigate('/veterinary/booking', {
                          state: {
                            provider
                          }
                        })
                        }
                        className="flex-1 relative group overflow-hidden">
                        
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            <div className="relative px-2 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg text-[11px] font-medium text-white flex items-center justify-center gap-1 group-hover:scale-[1.02] transition-transform">
                              <Calendar className="h-3 w-3" />
                              Réserver
                            </div>
                          </button>
                          <button
                        onClick={() =>
                        window.location.href = `tel:${provider.phone}`
                        }
                        className={`px-2 py-1.5 border rounded-lg transition-all flex items-center gap-1 text-[11px] ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                        
                            <Phone className="h-3 w-3" />
                            Appeler
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              )
              }
            </div>

            <div className="space-y-3">
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <h3
                  className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Services populaires
                </h3>
                <div className="space-y-1.5">
                  {popularServices.map((service, index) =>
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3 w-3 text-orange-500" />
                        <span
                        className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {service.name}
                        </span>
                      </div>
                      <span
                      className={`text-xs font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                      
                        {service.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                
                <h3
                  className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Types d'animaux acceptés
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {animalTypes.map((animal, index) =>
                  <div key={index} className="flex items-center gap-1.5">
                      <span className="text-sm">{animal.emoji}</span>
                      <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      
                        {animal.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield
                    className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  
                  <h3
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Urgences vétérinaires
                  </h3>
                </div>
                <p
                  className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  En cas d'urgence vitale pour votre animal, nos cliniques
                  partenaires assurent une permanence 24h/24 et 7j/7.
                </p>
                <a
                  href="tel:+21671000000"
                  className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 hover:scale-105 transition-transform">
                  
                  <Phone className="h-3.5 w-3.5" />
                  Appeler les urgences
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}