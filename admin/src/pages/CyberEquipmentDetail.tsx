import React, { useState, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Shield,
  Truck,
  Calendar,
  CheckCircle,
  Phone,
  Star,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  useEquipmentItem,
  useRentalPrice,
  useEquipmentAvailability,
  useEquipmentCategoryIcon } from
'../hooks/useEquipment';
function SpecItem({
  label,
  value,
  isDark




}: {label: string;value: string;isDark: boolean;}) {
  return (
    <div
      className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
      
      <div
        className={`text-[10px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        
        {label}
      </div>
      <div
        className={`font-medium text-xs break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
        
        {value}
      </div>
    </div>);

}
function FeatureItem({ text, isDark }: {text: string;isDark: boolean;}) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle
        className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
      
      <span
        className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        
        {text}
      </span>
    </li>);

}
function EquipmentDetailSkeleton({ isDark }: {isDark: boolean;}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div
            className={`rounded-xl overflow-hidden animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            
            <div className="w-full h-64" />
          </div>
          <div
            className={`rounded-xl p-4 animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            
            <div
              className={`w-24 h-5 rounded-full mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            
            <div
              className={`w-3/4 h-6 rounded mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            
            <div
              className={`w-full h-16 rounded mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) =>
              <div
                key={i}
                className={`h-12 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div
            className={`rounded-xl p-4 animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            
            <div
              className={`w-28 h-5 rounded mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            
            <div className="space-y-2">
              {[1, 2, 3].map((i) =>
              <div
                key={i}
                className={`h-16 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}
export function CyberEquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedDuration, setSelectedDuration] = useState<
    'daily' | 'weekly' | 'monthly'>(
    'daily');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { data: equipment, loading, error } = useEquipmentItem(id);
  const rentalPrice = useRentalPrice(equipment, startDate, endDate);
  const availability = useEquipmentAvailability(equipment);
  const categoryIcon = useEquipmentCategoryIcon(equipment?.category || '');
  const handleBooking = () => {
    if (equipment) {
      navigate('/equipment-booking', {
        state: {
          equipmentId: equipment.id,
          equipment,
          duration: selectedDuration
        }
      });
    }
  };
  const defaultFeatures = [
  'Installation et formation incluses',
  'Maintenance préventive gratuite',
  'Remplacement en cas de panne sous 24h',
  'Livraison et retour gratuits (Grand Tunis)',
  'Assistance téléphonique 24/7'];

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="relative z-10">
          <div
            className={`backdrop-blur-sm border-b py-3 px-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            
            <div className="max-w-7xl mx-auto" />
          </div>
          <EquipmentDetailSkeleton isDark={isDark} />
        </div>
      </div>);

  }
  if (error || !equipment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p
          className={`text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          Équipement non trouvé
        </p>
        <button
          onClick={() => navigate('/equipment')}
          className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700' : 'bg-white text-cyan-600 hover:bg-slate-100 border border-slate-200'}`}>
          
          Voir le catalogue
        </button>
      </div>);

  }
  const specifications = equipment.specifications ?
  Object.entries(equipment.specifications).map(([label, value]) => ({
    label,
    value: String(value)
  })) :
  [
  {
    label: 'Marque',
    value: equipment.brand || 'N/A'
  },
  {
    label: 'Modèle',
    value: equipment.model || 'N/A'
  },
  {
    label: 'Quantité disponible',
    value: `${equipment.availableQuantity || 0} unités`
  }];

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* WOW Header */}
        <div
          className={`backdrop-blur-sm border-b py-3 px-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-[14px] p-[2px] overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
              <div
                className={`relative rounded-[12px] px-4 py-2.5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                
                <h2
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {equipment.name}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image */}
              <div
                className={`backdrop-blur-sm border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                {equipment.images && equipment.images.length > 0 ?
                <img
                  src={equipment.images[0]}
                  alt={equipment.name}
                  className="w-full h-64 object-cover" /> :


                <div
                  className={`w-full h-64 flex items-center justify-center text-6xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  
                    {categoryIcon}
                  </div>
                }
              </div>

              {/* Info */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold rounded-full">
                        {categoryIcon} {equipment.category}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${availability.bgColor} ${availability.color}`}>
                        
                        {availability.label}
                      </span>
                    </div>
                    <h1
                      className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      {equipment.name}
                    </h1>
                    {equipment.rating &&
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span
                        className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {equipment.rating}
                        </span>
                        <span
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          ({equipment.reviewCount} avis)
                        </span>
                      </div>
                    }
                  </div>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  {equipment.description}
                </p>

                {/* Provider Info */}
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border mb-3 ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                  
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-1.5">
                      <h3
                        className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        Fournisseur vérifié
                      </h3>
                      <CheckCircle
                        className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      
                    </div>
                    <div
                      className={`flex items-center text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                      Tunis, Tunisie
                    </div>
                  </div>
                  <button
                    className={`p-1.5 border rounded-lg transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
                    title="Contacter">
                    
                    <Phone className="h-4 w-4" />
                  </button>
                </div>

                {/* Specifications */}
                <div className="mb-3">
                  <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Caractéristiques techniques
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {specifications.map((spec, i) =>
                    <SpecItem
                      key={i}
                      label={spec.label}
                      value={spec.value}
                      isDark={isDark} />

                    )}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3
                    className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Services inclus
                  </h3>
                  <ul className="space-y-2">
                    {defaultFeatures.map((feature, i) =>
                    <FeatureItem key={i} text={feature} isDark={isDark} />
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div
                  className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-white/80 border-cyan-500/30 shadow-sm'}`}>
                  
                  <h3
                    className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    Tarifs de location
                  </h3>

                  <div className="space-y-2 mb-3">
                    {[
                    {
                      id: 'daily',
                      label: 'Par jour',
                      price: equipment.pricePerDay,
                      unit: '/jour'
                    },
                    {
                      id: 'weekly',
                      label: 'Par semaine',
                      price: equipment.pricePerWeek,
                      unit: '/semaine',
                      badge: '-10%'
                    },
                    {
                      id: 'monthly',
                      label: 'Par mois',
                      price: equipment.pricePerMonth,
                      unit: '/mois',
                      badge: '-20%'
                    }].
                    map((option) =>
                    <button
                      key={option.id}
                      onClick={() => setSelectedDuration(option.id as any)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all relative ${selectedDuration === option.id ? 'border-cyan-500 bg-cyan-500/10' : isDark ? 'border-slate-700 hover:border-cyan-500/50' : 'border-slate-200 hover:border-cyan-500/50'}`}>
                      
                        {option.badge &&
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-green-500/20 border border-green-500/50 text-green-500 text-[10px] font-bold rounded-full">
                            {option.badge}
                          </span>
                      }
                        <div
                        className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {option.label}
                        </div>
                        <div
                        className={`text-lg font-bold mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                          {option.price} TND
                          <span
                          className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                            {option.unit}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>

                  <div
                    className={`border-t pt-3 mb-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        
                        Dépôt de garantie
                      </span>
                      <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {equipment.deposit} TND
                      </span>
                    </div>
                    <p
                      className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      
                      Remboursé au retour du matériel
                    </p>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!availability.available}
                    className="w-full mb-3 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    <div className="relative px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-1.5 group-hover:scale-105 transition-transform group-disabled:hover:scale-100">
                      <Calendar className="h-4 w-4" />
                      {availability.available ?
                      'Réserver maintenant' :
                      'Indisponible'}
                    </div>
                  </button>

                  <div
                    className={`space-y-2 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                    {[
                    {
                      icon: Truck,
                      text: 'Livraison gratuite (Grand Tunis)'
                    },
                    {
                      icon: Shield,
                      text: 'Matériel certifié et entretenu'
                    },
                    {
                      icon: CheckCircle,
                      text: 'Installation et formation incluses'
                    }].
                    map((item, i) =>
                    <div
                      key={i}
                      className={`flex items-center text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                        <item.icon
                        className={`h-3.5 w-3.5 mr-1.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      
                        {item.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}