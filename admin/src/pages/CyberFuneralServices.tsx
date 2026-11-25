import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Heart,
  Search,
  Shield,
  FileText,
  Truck,
  Users,
  Globe,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFuneralServices } from '../hooks/useProviders';
export function CyberFuneralServices() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: providers, loading } = useFuneralServices();
  const includedServices = [
  {
    icon: FileText,
    title: 'Démarches administratives',
    desc: "Déclaration de décès, permis d'inhumer, actes d'état civil"
  },
  {
    icon: Truck,
    title: 'Transport du défunt',
    desc: 'Prise en charge et transport vers le lieu de cérémonie'
  },
  {
    icon: Users,
    title: 'Organisation de la cérémonie',
    desc: 'Cérémonie religieuse ou civile selon vos souhaits'
  },
  {
    icon: Globe,
    title: 'Rapatriement international',
    desc: 'Coordination avec les autorités pour le rapatriement'
  }];

  const filteredProviders = providers.filter(
    (provider) =>
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
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#64748b_100%)]" />
            <div
              className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Services Funéraires
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Accompagnement et soutien dans ces moments difficiles
                  </p>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg border mb-3 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                
                <p
                  className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  Nous comprenons la difficulté de cette période. Nos
                  partenaires sont disponibles 24h/24 pour vous accompagner avec
                  dignité et respect dans toutes les démarches nécessaires.
                </p>
              </div>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher un prestataire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 shadow-sm'}`} />
                
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <h2
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredProviders.length} prestataire
                {filteredProviders.length > 1 ? 's' : ''} disponible
                {filteredProviders.length > 1 ? 's' : ''}
              </h2>
              {loading ?
              <div className="flex justify-center items-center py-6">
                  <Loader2
                  className={`h-8 w-8 animate-spin ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                
                </div> :

              filteredProviders.map((provider) =>
              <div
                key={provider.id}
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-between sm:flex-col sm:items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white" />
                          </div>
                          {provider.available &&
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 text-[10px] rounded-full font-bold">
                              <Clock className="h-2.5 w-2.5" />
                              24h/24
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
                            {(provider as any).repatriation &&
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-500 text-[9px] rounded-full font-bold">
                                <Globe className="h-2.5 w-2.5" />
                                Rapatriement
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
                                {provider.location.distance || '2.1 km'}
                              </span>
                            </div>
                          </div>
                          <p
                        className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {provider.location.address}
                          </p>
                          <div
                        className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        
                            <Clock className="h-2.5 w-2.5" />
                            <span className="font-medium">
                              Disponible 24h/24, 7j/7
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {provider.specialties.map((service, index) =>
                      <span
                        key={index}
                        className={`px-1.5 py-0.5 text-[9px] rounded-full font-semibold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        
                              {service}
                            </span>
                      )}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                        className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {provider.pricing?.[0]?.price ?
                        `À partir de ${provider.pricing[0].price} TND` :
                        'Sur devis'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                        onClick={() =>
                        navigate('/funeral/booking', {
                          state: {
                            provider
                          }
                        })
                        }
                        className="flex-1 relative group overflow-hidden">
                        
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            <div className="relative px-2 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg text-[11px] font-medium text-white flex items-center justify-center gap-1 group-hover:scale-[1.02] transition-transform">
                              <Calendar className="h-3 w-3" />
                              Prendre contact
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
                  
                  Services inclus
                </h3>
                <div className="space-y-3">
                  {includedServices.map((service, index) =>
                  <div key={index} className="flex items-start gap-2">
                      <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      
                        <service.icon
                        className={`h-3.5 w-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                      
                      </div>
                      <div>
                        <p
                        className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {service.title}
                        </p>
                        <p
                        className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-slate-700/30 border-slate-600/50' : 'bg-slate-50 border-slate-200'}`}>
                
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield
                    className={`h-4 w-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                  
                  <h3
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Assistance 24h/24
                  </h3>
                </div>
                <p
                  className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  En cas de décès, nos équipes sont disponibles à tout moment
                  pour vous accompagner.
                </p>
                <a
                  href="tel:+21671000000"
                  className="w-full px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 hover:scale-105 transition-transform">
                  
                  <Phone className="h-3.5 w-3.5" />
                  Appeler maintenant
                </a>
              </div>
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <h3
                  className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Documents à préparer
                </h3>
                <ul className="space-y-1.5">
                  {[
                  'Certificat médical de décès',
                  "Pièce d'identité du défunt",
                  'Livret de famille',
                  'Acte de naissance',
                  'Contrat obsèques (si existant)'].
                  map((doc, index) =>
                  <li key={index} className="flex items-center gap-1.5">
                      <CheckCircle
                      className={`h-3 w-3 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
                      <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                        {doc}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}