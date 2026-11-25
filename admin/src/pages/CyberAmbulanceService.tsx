import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ambulance,
  MapPin,
  Star,
  Clock,
  Phone,
  Shield,
  Heart,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAmbulanceProviders } from '../hooks/useProviders';
export function CyberAmbulanceService() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedType, setSelectedType] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const { data: providers, loading } = useAmbulanceProviders(
    selectedZone ?
    {
      city: selectedZone
    } :
    undefined
  );
  const transportTypes = [
  {
    id: 'emergency',
    label: 'Urgence médicale',
    icon: '🚨'
  },
  {
    id: 'hospital-home',
    label: 'Hôpital → Domicile',
    icon: '🏥'
  },
  {
    id: 'home-hospital',
    label: 'Domicile → Hôpital',
    icon: '🏠'
  },
  {
    id: 'inter-clinic',
    label: 'Inter-cliniques',
    icon: '🏥'
  },
  {
    id: 'medical-appointment',
    label: 'Rendez-vous médical',
    icon: '📅'
  },
  {
    id: 'dialysis',
    label: 'Dialyse régulière',
    icon: '💉'
  }];

  const zones = [
  'Tunis',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous',
  'Sousse',
  'Sfax'];

  const filteredProviders = providers.filter((provider) => {
    if (selectedType && (provider as any).types) {
      return (provider as any).types.includes(selectedType);
    }
    return true;
  });
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
      
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-red-500/10' : 'bg-red-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`} />
      
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`} />
      

      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/services')}
            className={`flex items-center mb-3 text-sm font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Retour aux services
          </button>

          {/* WOW EFFECT: Animated Gradient Border Wrapper for Header */}
          <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-xl mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#ef4444_100%)]" />
            <div
              className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl">
                  🚑
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1
                      className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Ambulance Privée
                    </h1>
                    <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[9px] font-bold rounded-full">
                      ⭐ Populaire
                    </span>
                  </div>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Transport médicalisé, urgences et transferts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3
                  className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  🚨 Urgence vitale ?
                </h3>
                <p
                  className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                  En cas d'urgence vitale, appelez le{' '}
                  <span className="font-bold text-red-500">SAMU 190</span> ou
                  les{' '}
                  <span className="font-bold text-red-500">Pompiers 198</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:190"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors">
                    
                    <Phone className="h-3.5 w-3.5" /> SAMU - 190
                  </a>
                  <a
                    href="tel:198"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors">
                    
                    <Phone className="h-3.5 w-3.5" /> Pompiers - 198
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`backdrop-blur-sm border rounded-xl p-4 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Type de transport
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                  
                  <option value="">Tous les types</option>
                  {transportTypes.map((type) =>
                  <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
            {
              icon: Shield,
              title: 'Sécurité garantie',
              desc: 'Personnel qualifié',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Clock,
              title: 'Disponible 24/7',
              desc: 'Service jour et nuit',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: Heart,
              title: 'Prise en charge complète',
              desc: 'Transfert sécurisé',
              gradient: 'from-purple-500 to-pink-500'
            }].
            map((item, i) =>
            <div
              key={i}
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              
                <div className="flex items-center gap-3">
                  <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}>
                  
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3
                    className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {item.title}
                    </h3>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-3">
            <p
              className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {filteredProviders.length} service
              {filteredProviders.length > 1 ? 's' : ''} disponible
              {filteredProviders.length > 1 ? 's' : ''}
            </p>
          </div>

          {loading ?
          <div className="flex justify-center items-center py-8">
              <Loader2
              className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            </div> :

          <div className="space-y-3">
              {filteredProviders.map((provider) =>
            <div
              key={provider.id}
              className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500'}`}>
              
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-between sm:flex-col sm:items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl overflow-hidden">
                          {provider.imageUrl ?
                      <img
                        src={provider.imageUrl}
                        alt={provider.name}
                        className="w-full h-full object-cover" /> :


                      '🚑'
                      }
                        </div>
                        <div className="text-right sm:text-center">
                          <p
                        className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                            {provider.pricing?.[0]?.price || '80-150'} TND
                          </p>
                          <p
                        className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        
                            par transport
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                        className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {provider.name}
                          </h3>
                          {provider.available &&
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 border border-green-500/50 text-green-500 text-[9px] rounded-full font-bold">
                              <Clock className="h-2.5 w-2.5" /> 24/7
                            </span>
                      }
                        </div>
                        <div
                      className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
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
                            <Clock className="h-2.5 w-2.5" />
                            <span>15-20 min</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            <span>{provider.location.city}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {provider.specialties.map((feature, index) =>
                    <span
                      key={index}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-500 text-[9px] rounded-full font-semibold">
                      
                            <CheckCircle2 className="h-2 w-2" /> {feature}
                          </span>
                    )}
                      </div>

                      <div className="flex gap-2">
                        <button
                      onClick={() =>
                      navigate('/ambulance-booking', {
                        state: {
                          provider
                        }
                      })
                      }
                      className="flex-1 relative group overflow-hidden">
                      
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                          <div className="relative px-2 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-[11px] font-medium text-white flex items-center justify-center gap-1 group-hover:scale-[1.02] transition-transform">
                            <Calendar className="h-3 w-3" /> Réserver
                          </div>
                        </button>
                        <button
                      className={`px-2 py-1.5 border rounded-lg transition-all flex items-center gap-1 text-[11px] ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                      
                          <Phone className="h-3 w-3" /> Appeler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
            </div>
          }

          <div
            className={`mt-4 rounded-xl p-4 ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-bold mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  💡 Comment choisir ?
                </h3>
                <ul
                  className={`space-y-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong
                        className={isDark ? 'text-white' : 'text-slate-900'}>
                        
                        Urgence vitale :
                      </strong>{' '}
                      Appelez le SAMU 190
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong
                        className={isDark ? 'text-white' : 'text-slate-900'}>
                        
                        Transport programmé :
                      </strong>{' '}
                      Réservez à l'avance
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong
                        className={isDark ? 'text-white' : 'text-slate-900'}>
                        
                        Équipement :
                      </strong>{' '}
                      Vérifiez les équipements disponibles
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}