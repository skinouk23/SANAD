import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FlaskConical,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Home,
  Search,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLaboratories } from '../hooks/useProviders';
export function CyberLaboratory() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: laboratories, loading } = useLaboratories();
  const popularTests = [
  {
    name: 'Bilan sanguin complet',
    price: '45 TND'
  },
  {
    name: 'Glycémie',
    price: '15 TND'
  },
  {
    name: 'Cholestérol',
    price: '25 TND'
  },
  {
    name: 'Bilan hépatique',
    price: '60 TND'
  },
  {
    name: 'Bilan rénal',
    price: '55 TND'
  },
  {
    name: 'Hormones thyroïdiennes',
    price: '80 TND'
  }];

  const filteredLabs = laboratories.filter(
    (lab) =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.location.address.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl">
                  🔬
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Laboratoires d'Analyses
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Trouvez un laboratoire près de chez vous
                  </p>
                </div>
              </div>

              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher un laboratoire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm'}`} />
                
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Labs List */}
            <div className="lg:col-span-2 space-y-3">
              <h2
                className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredLabs.length} laboratoire
                {filteredLabs.length > 1 ? 's' : ''} disponible
                {filteredLabs.length > 1 ? 's' : ''}
              </h2>

              {loading ?
              <div className="flex justify-center items-center py-6">
                  <Loader2
                  className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                </div> :

              filteredLabs.map((lab) =>
              <div
                key={lab.id}
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
                
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-between md:flex-col md:items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-2xl overflow-hidden">
                            {lab.imageUrl ?
                        <img
                          src={lab.imageUrl}
                          alt={lab.name}
                          className="w-full h-full object-cover" /> :


                        '🔬'
                        }
                          </div>
                          <div className="text-right md:text-center">
                            <p
                          className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          
                              {lab.pricing?.[0]?.price || '15-150'} TND
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
                          
                              {lab.name}
                            </h3>
                            {(lab as any).homeService &&
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-teal-500/20 border border-teal-500/50 text-teal-500 text-[10px] rounded-full font-bold">
                                <Home className="h-3 w-3" /> À domicile
                              </span>
                        }
                          </div>
                          <div
                        className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span
                            className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                                {lab.rating}
                              </span>
                              <span>({lab.reviewCount})</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{lab.location.city}</span>
                            </div>
                          </div>
                          <p
                        className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {lab.location.address}
                          </p>
                          <div
                        className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <Clock className="h-3 w-3" />
                            <span>Lun-Sam: 7h-19h</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {lab.specialties.map((service, index) =>
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-500 text-[10px] rounded-full font-semibold">
                        
                              {service}
                            </span>
                      )}
                        </div>

                        <div className="flex gap-2">
                          <button
                        onClick={() =>
                        navigate('/laboratory/booking', {
                          state: {
                            laboratory: lab
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
                        window.location.href = `tel:${lab.phone}`
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
              {/* Popular Tests */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <h3
                  className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Analyses populaires
                </h3>
                <div className="space-y-2">
                  {popularTests.map((test, index) =>
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                        <span
                        className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {test.name}
                        </span>
                      </div>
                      <span
                      className={`text-xs font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {test.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                
                <h3
                  className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Prélèvement à domicile
                </h3>
                <p
                  className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  Certains laboratoires proposent un service de prélèvement à
                  domicile pour votre confort.
                </p>
                <div
                  className={`flex items-start gap-1.5 text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  
                  <Home className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <p>Supplément de 20-30 TND selon la distance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}