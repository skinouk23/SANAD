import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pill,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Truck,
  Search,
  Syringe,
  Thermometer,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePharmacies } from '../hooks/useProviders';
export function CyberPharmacy() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: pharmacies, loading } = usePharmacies();
  const popularServices = [
  {
    name: 'Dépistage COVID-19',
    price: '25 TND'
  },
  {
    name: 'Livraison médicaments',
    price: '10-20 TND'
  },
  {
    name: 'Prise de tension',
    price: 'Gratuit'
  },
  {
    name: 'Test angine (TROD)',
    price: '15 TND'
  },
  {
    name: 'Mesure glycémie',
    price: '5 TND'
  },
  {
    name: 'Vaccination grippe',
    price: 'Selon vaccin'
  }];

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.location.address.
    toLowerCase().
    includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* WOW Header */}
          <div className="relative rounded-[18px] p-[2px] overflow-hidden shadow-lg mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#10b981_100%)]" />
            <div
              className={`relative rounded-[16px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Pharmacies & Services
                  </h1>
                  <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    Trouvez une pharmacie et réservez vos services de santé
                  </p>
                </div>
              </div>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher une pharmacie, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm'}`} />
                
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pharmacy List */}
            <div className="lg:col-span-2 space-y-3">
              <h2
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {filteredPharmacies.length} pharmacie
                {filteredPharmacies.length > 1 ? 's' : ''} disponible
                {filteredPharmacies.length > 1 ? 's' : ''}
              </h2>
              {loading ?
              <div className="flex justify-center items-center py-6">
                  <Loader2
                  className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                </div> :

              filteredPharmacies.map((pharmacy) =>
              <div
                key={pharmacy.id}
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50' : 'bg-white/80 border-slate-200 hover:border-emerald-500/50 shadow-sm'}`}>
                
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-between sm:flex-col sm:items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl overflow-hidden">
                            {pharmacy.imageUrl ?
                        <img
                          src={pharmacy.imageUrl}
                          alt={pharmacy.name}
                          className="w-full h-full object-cover" /> :


                        '💊'
                        }
                          </div>
                          <div className="text-right sm:text-center">
                            <p
                          className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          
                              Services variés
                            </p>
                            <p
                          className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          
                              sur rendez-vous
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                          className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {pharmacy.name}
                            </h3>
                            {(pharmacy as any).delivery &&
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-teal-500/20 border border-teal-500/50 text-teal-500 text-[9px] rounded-full font-bold">
                                <Truck className="h-2.5 w-2.5" /> Livraison
                              </span>
                        }
                          </div>
                          <div
                        className={`flex items-center gap-2 text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <div className="flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                              <span
                            className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                                {pharmacy.rating}
                              </span>
                              <span>({pharmacy.reviewCount})</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              <span>
                                {pharmacy.location.distance || '2.5 km'}
                              </span>
                            </div>
                          </div>
                          <p
                        className={`text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {pharmacy.location.address}
                          </p>
                          <div
                        className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            <Clock className="h-2.5 w-2.5" />
                            <span>Lun-Sam: 8h-20h</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {pharmacy.specialties.map((service, index) =>
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 text-[9px] rounded-full font-semibold">
                        
                              {service}
                            </span>
                      )}
                        </div>
                        <div className="flex gap-2">
                          <button
                        onClick={() =>
                        navigate('/pharmacy/booking', {
                          state: {
                            pharmacy
                          }
                        })
                        }
                        className="flex-1 relative group overflow-hidden">
                        
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            <div className="relative px-2 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-[11px] font-medium text-white flex items-center justify-center gap-1 group-hover:scale-[1.02] transition-transform">
                              <Calendar className="h-3 w-3" /> Réserver
                            </div>
                          </button>
                          <button
                        onClick={() =>
                        window.location.href = `tel:${pharmacy.phone}`
                        }
                        className={`px-2 py-1.5 border rounded-lg transition-all flex items-center gap-1 text-[11px] ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                        
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
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <span
                        className={`text-[10px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {service.name}
                        </span>
                      </div>
                      <span
                      className={`text-[10px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      
                        {service.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                
                <h3
                  className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Livraison de médicaments
                </h3>
                <p
                  className={`text-[10px] mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  Scannez votre ordonnance et faites-vous livrer vos médicaments
                  à domicile en toute sécurité.
                </p>
                <div
                  className={`flex items-start gap-1.5 text-[10px] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  
                  <Truck className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <p>Livraison express disponible (moins de 2h)</p>
                </div>
              </div>

              <div
                className={`border rounded-xl p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                
                <div className="flex items-center gap-1.5 mb-2">
                  <Syringe
                    className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  
                  <h3
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Vaccination & Tests
                  </h3>
                </div>
                <p
                  className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  Les pharmacies partenaires proposent la vaccination grippe et
                  COVID-19, ainsi que les tests antigéniques rapides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}