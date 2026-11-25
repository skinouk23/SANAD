import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Shield,
  CheckCircle2,
  Calendar,
  Phone,
  Award,
  Heart,
  User,
  X,
  MessageCircle,
  Loader2,
  Stethoscope,
  Filter } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCareProviders } from '../hooks/useProviders';
import { useServiceByType } from '../hooks/useServices';
import type { ServiceType } from '../types';
const doctorSpecialities = [
'Généraliste',
'Pédiatre',
'Cardiologue',
'Dermatologue',
'Gynécologue Obstétricien',
'Ophtalmologue',
'ORL',
'Psychiatre',
'Pneumologue',
'Gastro-Entérologue',
'Endocrinologue Diabétologue',
'Rhumatologue',
'Médecin interniste',
'Chirurgien Orthopédiste Traumatologue',
'Chirurgien Pédiatrique',
'Cancérologue',
'Radiothérapeute',
'Infectiologue',
'Neuropédiatre',
'Anesthésiste-Réanimateur',
'Angiologue',
'Dentiste',
'Orthodontiste',
'Audioprothésiste'];

export function CyberCareService() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{
    serviceId: ServiceType;
  }>();
  const { isDark } = useTheme();
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [showSpecialityFilter, setShowSpecialityFilter] = useState(false);
  const [showContactModal, setShowContactModal] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<string | null>(null);
  const isDoctor = serviceId === 'doctor-home';
  const { data: service, loading: serviceLoading } = useServiceByType(serviceId);
  const { data: providers, loading: providersLoading } = useCareProviders(
    serviceId,
    selectedZone ?
    {
      city: selectedZone
    } :
    undefined
  );
  const toggleSpeciality = (spec: string) => {
    setSelectedSpecialities((prev) =>
    prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };
  const clearSpecialities = () => setSelectedSpecialities([]);
  const filteredProviders = providers.filter((provider) => {
    if (!isDoctor || selectedSpecialities.length === 0) return true;
    return selectedSpecialities.some(
      (spec) =>
      provider.specialties?.some(
        (ps) =>
        ps.toLowerCase().includes(spec.toLowerCase()) ||
        spec.toLowerCase().includes(ps.toLowerCase())
      ) || provider.specialty?.toLowerCase().includes(spec.toLowerCase())
    );
  });
  const loading = serviceLoading || providersLoading;
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        
        <Loader2
          className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        
      </div>);

  }
  if (!service) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        
        <div
          className={`backdrop-blur-sm border rounded-xl p-6 max-w-md text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          
          <h2
            className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Service non trouvé
          </h2>
          <p
            className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            
            Ce service n'existe pas
          </p>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform">
            
            Voir les services
          </button>
        </div>
      </div>);

  }
  const zones = [
  'Tunis',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous',
  'Sousse',
  'Sfax'];

  const getIcon = () => {
    return <Heart className="h-5 w-5 text-white" />;
  };
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
      
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`} />
      
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`} />
      

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
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div
              className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                  
                  {getIcon()}
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    {service.name}
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
            {
              icon: Shield,
              title: 'Professionnels qualifiés',
              desc: 'Diplômés et expérimentés',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Clock,
              title: 'Disponibilité rapide',
              desc: 'Intervention sous 24-48h',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: Heart,
              title: 'Tarifs transparents',
              desc: `${service.basePrice} ${service.currency}`,
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
                    className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
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

          {/* Filters Section */}
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            
            <div
              className={`grid grid-cols-1 ${isDoctor ? 'md:grid-cols-2' : ''} gap-3`}>
              
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

              {/* Speciality Filter - Doctor only */}
              {isDoctor &&
              <div>
                  <label
                  className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Spécialité(s)
                    {selectedSpecialities.length > 0 &&
                  <span
                    className={`ml-1 text-[10px] font-normal ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                        ({selectedSpecialities.length} sélectionnée
                        {selectedSpecialities.length > 1 ? 's' : ''})
                      </span>
                  }
                  </label>
                  <button
                  onClick={() =>
                  setShowSpecialityFilter(!showSpecialityFilter)
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all text-left flex items-center justify-between ${isDark ? 'bg-slate-900/50 border-slate-700 text-white hover:border-cyan-500/50' : 'bg-white border-slate-200 text-slate-900 hover:border-cyan-500/50'}`}>
                  
                    <span
                    className={
                    selectedSpecialities.length === 0 ?
                    isDark ?
                    'text-slate-500' :
                    'text-slate-400' :
                    'truncate mr-2'
                    }>
                    
                      {selectedSpecialities.length === 0 ?
                    'Toutes les spécialités' :
                    selectedSpecialities.slice(0, 2).join(', ') + (
                    selectedSpecialities.length > 2 ?
                    ` +${selectedSpecialities.length - 2}` :
                    '')}
                    </span>
                    <Filter
                    className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  
                  </button>
                </div>
              }
            </div>

            {/* Speciality chips dropdown */}
            {isDoctor && showSpecialityFilter &&
            <div
              className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              
                <div className="flex items-center justify-between mb-2">
                  <p
                  className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    Sélectionnez une ou plusieurs spécialités
                  </p>
                  {selectedSpecialities.length > 0 &&
                <button
                  onClick={clearSpecialities}
                  className={`text-[10px] font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                  
                      Tout effacer
                    </button>
                }
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {doctorSpecialities.map((spec) => {
                  const isSelected = selectedSpecialities.includes(spec);
                  return (
                    <button
                      key={spec}
                      onClick={() => toggleSpeciality(spec)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all ${isSelected ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent' : isDark ? 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-500/50 hover:text-slate-900'}`}>
                      
                        {isSelected &&
                      <CheckCircle2 className="h-2.5 w-2.5 inline mr-1" />
                      }
                        {spec}
                      </button>);

                })}
                </div>
              </div>
            }

            {/* Selected specialities pills */}
            {isDoctor &&
            !showSpecialityFilter &&
            selectedSpecialities.length > 0 &&
            <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedSpecialities.map((spec) =>
              <span
                key={spec}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/50 text-cyan-500 text-[10px] rounded-full font-medium">
                
                      {spec}
                      <button
                  onClick={() => toggleSpeciality(spec)}
                  className="hover:text-white transition-colors">
                  
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
              )}
                  <button
                onClick={clearSpecialities}
                className={`px-2 py-0.5 text-[10px] rounded-full font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                    Tout effacer
                  </button>
                </div>
            }
          </div>

          <div className="mb-3">
            <h2
              className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {filteredProviders.length} professionnel
              {filteredProviders.length > 1 ? 's' : ''} disponible
              {filteredProviders.length > 1 ? 's' : ''}
            </h2>
          </div>

          <div className="space-y-3">
            {filteredProviders.map((provider) =>
            <div
              key={provider.id}
              className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500'}`}>
              
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between sm:flex-col sm:items-center gap-3">
                      <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-xl overflow-hidden`}>
                      
                        {provider.imageUrl ?
                      <img
                        src={provider.imageUrl}
                        alt={provider.name}
                        className="w-full h-full object-cover" /> :


                      <span className="text-xl">
                            {provider.name.charAt(0)}
                          </span>
                      }
                      </div>
                      <div className="text-right sm:text-center">
                        <p
                        className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                          {provider.pricing[0]?.price || service.basePrice}{' '}
                          {service.currency}
                        </p>
                        <p
                        className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        
                          par {service.priceUnit}
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
                      <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/50 text-green-500 text-[9px] font-bold rounded-full">
                            Disponible
                          </span>
                      }
                      </div>
                      <p
                      className={`text-xs mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        {provider.specialty}
                      </p>
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
                        <span>{provider.experience} ans</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          <span>{provider.location.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.specialties.slice(0, 3).map((spec, index) =>
                    <span
                      key={index}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-500 text-[9px] rounded-full font-semibold">
                      
                          <Award className="h-2 w-2" />
                          {spec}
                        </span>
                    )}
                    </div>

                    <div className="flex gap-2">
                      <button
                      onClick={() =>
                      navigate(`/care-booking/${serviceId}`, {
                        state: {
                          provider,
                          service
                        }
                      })
                      }
                      className="flex-1 relative group overflow-hidden">
                      
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                        <div className="relative px-2 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-[11px] font-medium text-white flex items-center justify-center gap-1 group-hover:scale-[1.02] transition-transform">
                          <Calendar className="h-3 w-3" />
                          Réserver
                        </div>
                      </button>
                      <button
                      onClick={() => setShowContactModal(provider.id)}
                      className={`px-2 py-1.5 border rounded-lg transition-all flex items-center gap-1 text-[11px] ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                      
                        <Phone className="h-3 w-3" />
                        Contacter
                      </button>
                      <button
                      onClick={() => setShowProfileModal(provider.id)}
                      className={`px-2 py-1.5 border rounded-lg transition-all flex items-center gap-1 text-[11px] ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                      
                        <User className="h-3 w-3" />
                        Profil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {filteredProviders.length === 0 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-6 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              
                <Stethoscope
                className={`h-8 w-8 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              
                <p
                className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
                  Aucun médecin trouvé
                </p>
                <p
                className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                
                  Essayez de modifier vos filtres de spécialité ou de zone
                </p>
                {selectedSpecialities.length > 0 &&
              <button
                onClick={clearSpecialities}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xs font-medium text-white hover:scale-105 transition-transform">
                
                    Effacer les filtres
                  </button>
              }
              </div>
            }
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-sm w-full p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            {(() => {
            const provider = providers.find((p) => p.id === showContactModal);
            if (!provider) return null;
            return (
              <>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                    className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Contacter
                    </h3>
                    <button
                    onClick={() => setShowContactModal(null)}
                    className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-xl overflow-hidden`}>
                    
                      {provider.imageUrl ?
                    <img
                      src={provider.imageUrl}
                      alt={provider.name}
                      className="w-full h-full object-cover" /> :


                    <span className="text-xl">
                          {provider.name.charAt(0)}
                        </span>
                    }
                    </div>
                    <div>
                      <h4
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {provider.name}
                      </h4>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        {provider.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a href={`tel:${provider.phone}`} className="block">
                      <div
                      className={`p-3 border rounded-lg transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                      
                        <div className="flex items-center gap-2.5">
                          <Phone
                          className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        
                          <div>
                            <p
                            className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            
                              Téléphone
                            </p>
                            <p
                            className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            
                              {provider.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                    <button
                    className={`w-full p-3 border rounded-lg transition-all text-left ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                    
                      <div className="flex items-center gap-2.5">
                        <MessageCircle
                        className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      
                        <div>
                          <p
                          className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                            Message
                          </p>
                          <p
                          className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            Envoyer un message
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>);

          })()}
          </div>
        </div>
      }

      {/* Profile Modal */}
      {showProfileModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-lg w-full p-4 max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            {(() => {
            const provider = providers.find((p) => p.id === showProfileModal);
            if (!provider) return null;
            return (
              <>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                    className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Profil professionnel
                    </h3>
                    <button
                    onClick={() => setShowProfileModal(null)}
                    className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-2xl overflow-hidden`}>
                    
                      {provider.imageUrl ?
                    <img
                      src={provider.imageUrl}
                      alt={provider.name}
                      className="w-full h-full object-cover" /> :


                    <span className="text-2xl">
                          {provider.name.charAt(0)}
                        </span>
                    }
                    </div>
                    <div>
                      <h4
                      className={`text-lg font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {provider.name}
                      </h4>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        {provider.specialty}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span
                        className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {provider.rating}
                        </span>
                        <span
                        className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          ({provider.reviewCount} avis)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div
                    className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                      <p
                      className={`text-[10px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Expérience
                      </p>
                      <p
                      className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {provider.experience} ans
                      </p>
                    </div>
                    <div
                    className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                      <p
                      className={`text-[10px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Zone
                      </p>
                      <p
                      className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {provider.location.city}
                      </p>
                    </div>
                    <div
                    className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    
                      <p
                      className={`text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Bio
                      </p>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      
                        {provider.bio}
                      </p>
                    </div>
                  </div>
                  <button
                  onClick={() => {
                    setShowProfileModal(null);
                    navigate(`/care-booking/${serviceId}`, {
                      state: {
                        provider,
                        service
                      }
                    });
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:scale-[1.02] transition-transform">
                  
                    Réserver avec ce professionnel
                  </button>
                </>);

          })()}
          </div>
        </div>
      }
    </div>);

}