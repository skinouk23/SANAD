import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Scan,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Search,
  Zap,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRadiologyCenters } from '../hooks/useProviders';
export function CyberRadiology() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: radiologyCenters, loading } = useRadiologyCenters();
  const examTypes = [
  {
    name: 'Radiographie standard',
    price: '50-80 TND',
    duration: '15 min'
  },
  {
    name: 'Échographie abdominale',
    price: '80-120 TND',
    duration: '30 min'
  },
  {
    name: 'Scanner thoracique',
    price: '180-250 TND',
    duration: '20 min'
  },
  {
    name: 'IRM cérébrale',
    price: '250-350 TND',
    duration: '45 min'
  },
  {
    name: 'Mammographie',
    price: '100-150 TND',
    duration: '20 min'
  },
  {
    name: 'Doppler vasculaire',
    price: '120-180 TND',
    duration: '30 min'
  }];

  const filteredCenters = radiologyCenters.filter(
    (center) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with WOW effect */}
          <div className="relative rounded-[16px] p-[2px] overflow-hidden shadow-sm mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div
              className={`relative rounded-[14px] p-4 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl">
                  🩻
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Centres de Radiologie
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Imagerie médicale et diagnostics rapides
                  </p>
                </div>
              </div>

              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher un centre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm'}`} />
                
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Centers List */}
            <div className="lg:col-span-2 space-y-3">
              <h2
                className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredCenters.length} centre
                {filteredCenters.length > 1 ? 's' : ''} disponible
                {filteredCenters.length > 1 ? 's' : ''}
              </h2>

              {loading ?
              <div className="flex justify-center items-center py-6">
                  <Loader2
                  className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                </div> :

              filteredCenters.map((center) =>
              <div
                key={center.id}
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
                
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-between md:flex-col md:items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-2xl overflow-hidden">
                            {center.imageUrl ?
                        <img
                          src={center.imageUrl}
                          alt={center.name}
                          className="w-full h-full object-cover" /> :


                        '🩻'
                        }
                          </div>
                          <div className="text-right md:text-center">
                            <p
                          className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          
                              {center.pricing?.[0]?.price || '50-300'} TND
                            </p>
                            <p
                          className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          
                              tarifs
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                          className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {center.name}
                            </h3>
                            {(center as any).fastAppointment &&
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/50 text-purple-500 text-[10px] rounded-full font-bold">
                                <Zap className="h-3 w-3" /> RDV rapide
                              </span>
                        }
                          </div>
                          <div
                        className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span
                            className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                                {center.rating}
                              </span>
                              <span>({center.reviewCount})</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{center.location.city}</span>
                            </div>
                          </div>
                          <p
                        className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {center.location.address}
                          </p>
                          <div
                        className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <Clock className="h-3 w-3" />
                            <span>Lun-Sam: 8h-18h</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {center.specialties.map((service, index) =>
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 text-purple-500 text-[10px] rounded-full font-semibold">
                        
                              {service}
                            </span>
                      )}
                        </div>

                        <div className="flex gap-2">
                          <button
                        onClick={() =>
                        navigate('/radiology/booking', {
                          state: {
                            center
                          }
                        })
                        }
                        className="flex-1 relative group overflow-hidden">
                        
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                            <div className="relative px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 group-hover:scale-105 transition-transform">
                              <Calendar className="h-3 w-3" /> Réserver
                            </div>
                          </button>
                          <button
                        onClick={() =>
                        window.location.href = `tel:${center.phone}`
                        }
                        className={`px-3 py-1.5 border rounded-lg transition-all flex items-center gap-1.5 text-xs ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                        
                            <Phone className="h-3 w-3" /> Appeler
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              )
              }
            </div>

            {/* Sidebar */}
            <div className="space-y-3">
              {/* Exam Types */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <h3
                  className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Types d'examens
                </h3>
                <div className="space-y-2">
                  {examTypes.map((exam, index) =>
                  <div
                    key={index}
                    className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                      <div className="flex items-center justify-between mb-1">
                        <span
                        className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {exam.name}
                        </span>
                        <span className="text-xs text-purple-500 font-bold">
                          {exam.price}
                        </span>
                      </div>
                      <div
                      className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      
                        <Clock className="h-3 w-3" />
                        {exam.duration}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                
                <h3
                  className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Rendez-vous rapides
                </h3>
                <p
                  className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  Certains centres proposent des créneaux en urgence pour les
                  examens prioritaires.
                </p>
                <div
                  className={`flex items-start gap-1.5 text-xs ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  
                  <Zap className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <p>Disponibilités sous 24-48h selon l'examen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}