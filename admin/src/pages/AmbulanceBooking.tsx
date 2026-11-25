import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Check,
  AlertCircle,
  Ambulance } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { MapAddressPicker } from '../components/MapAddressPicker';
export function AmbulanceBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const provider = location.state?.provider;
  const [currentStep, setCurrentStep] = useState(1);
  const [transportType, setTransportType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('scheduled');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  // Address states with coordinates
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // Map picker modals
  const [showPickupMapPicker, setShowPickupMapPicker] = useState(false);
  const [showDestinationMapPicker, setShowDestinationMapPicker] =
  useState(false);
  // Pricing calculation
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(
    null
  );
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  // Provider pricing (mock data - should come from provider service)
  const providerPricing = {
    basePrice: provider?.basePrice || 50,
    standardKilometers: provider?.standardKilometers || 10,
    pricePerExtraKm: provider?.pricePerExtraKm || 2
  };
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    medicalCondition: '',
    mobility: 'walking',
    oxygen: false,
    accompaniment: false
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const transportTypes = [
  {
    id: 'emergency',
    label: 'Urgence médicale',
    icon: '🚨'
  },
  {
    id: 'hospital-home',
    label: 'Hôpital → Domicile',
    icon: '🏥→🏠'
  },
  {
    id: 'home-hospital',
    label: 'Domicile → Hôpital',
    icon: '🏠→🏥'
  },
  {
    id: 'inter-clinic',
    label: 'Inter-cliniques',
    icon: '🏥→🏥'
  },
  {
    id: 'medical-appointment',
    label: 'Rendez-vous médical',
    icon: '📅'
  },
  {
    id: 'dialysis',
    label: 'Dialyse',
    icon: '💉'
  }];

  const timeSlots = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number)
  : number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  // Calculate price based on distance
  const calculatePrice = (distance: number): number => {
    const { basePrice, standardKilometers, pricePerExtraKm } = providerPricing;
    if (distance <= standardKilometers) {
      return basePrice;
    }
    const extraKm = distance - standardKilometers;
    return basePrice + extraKm * pricePerExtraKm;
  };
  // Update distance and price when both addresses are selected
  useEffect(() => {
    if (pickupCoordinates && destinationCoordinates) {
      const distance = calculateDistance(
        pickupCoordinates.lat,
        pickupCoordinates.lng,
        destinationCoordinates.lat,
        destinationCoordinates.lng
      );
      setCalculatedDistance(Math.round(distance * 10) / 10); // Round to 1 decimal
      setCalculatedPrice(Math.round(calculatePrice(distance)));
    } else {
      setCalculatedDistance(null);
      setCalculatedPrice(null);
    }
  }, [pickupCoordinates, destinationCoordinates]);
  const handleSelectPickupAddress = (address: {
    lat: number;
    lng: number;
    displayName: string;
  }) => {
    setPickupAddress(address.displayName);
    setPickupCoordinates({
      lat: address.lat,
      lng: address.lng
    });
    setShowPickupMapPicker(false);
  };
  const handleSelectDestinationAddress = (address: {
    lat: number;
    lng: number;
    displayName: string;
  }) => {
    setDestinationAddress(address.displayName);
    setDestinationCoordinates({
      lat: address.lat,
      lng: address.lng
    });
    setShowDestinationMapPicker(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Booking submitted');
      setCurrentStep(4);
    }
  };
  const canProceed = () => {
    if (currentStep === 1) {
      return (
        transportType && (
        urgencyLevel === 'immediate' || pickupDate && pickupTime));

    }
    if (currentStep === 2) {
      return (
        pickupAddress &&
        destinationAddress &&
        patientInfo.name &&
        patientInfo.phone);

    }
    return true;
  };
  if (!provider) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        
        <div
          className={`border rounded-xl p-8 max-w-md text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
          
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ambulance className="h-8 w-8 text-red-500" />
          </div>
          <h2
            className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Erreur
          </h2>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Aucun service sélectionné
          </p>
          <button
            onClick={() => navigate('/ambulance')}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
            
            Retour à la liste
          </button>
        </div>
      </div>);

  }
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`fixed top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse pointer-events-none ${isDark ? 'bg-red-500/10' : 'bg-red-500/5'}`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'}`}>
      </div>

      <div className="relative z-10 py-8 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/ambulance')}
              className={`flex items-center mb-4 font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour à la liste
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-3xl overflow-hidden">
                {provider.imageUrl ?
                <img
                  src={provider.imageUrl}
                  alt={provider.name}
                  className="w-full h-full object-cover" /> :


                provider.image
                }
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className={`text-xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {provider.name}
                </h1>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Réservation de transport médicalisé
                </p>
                {provider.price &&
                <p className="text-lg font-bold text-red-500 mt-1">
                    {provider.price} TND{' '}
                    <span className="text-xs font-normal text-slate-500">
                      / trajet estimé
                    </span>
                  </p>
                }
              </div>
            </div>
          </div>

          {currentStep !== 4 &&
          <>
              {/* Progress Steps */}
              <div
              className={`backdrop-blur-sm border rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) =>
                <Fragment key={step}>
                      <div className="flex items-center gap-3">
                        <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                      
                          {currentStep > step ?
                      <Check className="h-5 w-5" /> :

                      step
                      }
                        </div>
                        <div>
                          <p
                        className={`text-sm font-semibold ${currentStep >= step ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        
                            {step === 1 ?
                        'Type & Date' :
                        step === 2 ?
                        'Informations' :
                        'Confirmation'}
                          </p>
                        </div>
                      </div>
                      {step < 3 &&
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step ? 'bg-gradient-to-r from-red-500 to-orange-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  </div>
                  }
                    </Fragment>
                )}
                </div>
              </div>

              {/* Emergency Warning */}
              {urgencyLevel === 'immediate' &&
            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div>
                      <h3
                    className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Transport immédiat
                      </h3>
                      <p
                    className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        L'ambulance sera dépêchée dès confirmation de votre
                        réservation. Temps d'arrivée estimé :{' '}
                        <strong>{provider.responseTime}</strong>
                      </p>
                    </div>
                  </div>
                </div>
            }
            </>
          }

          <form onSubmit={handleSubmit}>
            {/* Step 1: Type & Schedule */}
            {currentStep === 1 &&
            <div className="space-y-6">
                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <h2
                  className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Type de transport
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {transportTypes.map((type) =>
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTransportType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${transportType === type.id ? 'border-red-500 bg-red-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <span
                        className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {type.label}
                          </span>
                        </div>
                      </button>
                  )}
                  </div>
                </div>

                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <h2
                  className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Urgence
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                    type="button"
                    onClick={() => setUrgencyLevel('scheduled')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${urgencyLevel === 'scheduled' ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <h3
                      className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Transport programmé
                      </h3>
                      <p
                      className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        Réservez à l'avance
                      </p>
                    </button>
                    <button
                    type="button"
                    onClick={() => setUrgencyLevel('immediate')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${urgencyLevel === 'immediate' ? 'border-red-500 bg-red-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <h3
                      className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Transport immédiat
                      </h3>
                      <p
                      className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        Départ dans {provider.responseTime}
                      </p>
                    </button>
                  </div>
                </div>

                {urgencyLevel === 'scheduled' &&
              <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                    <h2
                  className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      Date et heure
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Date *
                        </label>
                        <div className="relative">
                          <Calendar
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      
                          <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`}
                        style={{
                          colorScheme: isDark ? 'dark' : 'light'
                        }} />
                      
                        </div>
                      </div>
                      <div>
                        <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Heure *
                        </label>
                        <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                      className={`w-full px-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`}>
                      
                          <option value="">Sélectionner</option>
                          {timeSlots.map((time) =>
                      <option key={time} value={time}>
                              {time}
                            </option>
                      )}
                        </select>
                      </div>
                    </div>
                  </div>
              }
              </div>
            }

            {/* Step 2: Addresses & Patient Info */}
            {currentStep === 2 &&
            <div className="space-y-6">
                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <h2
                  className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Adresses
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Adresse de départ *
                      </label>
                      <button
                      type="button"
                      onClick={() => setShowPickupMapPicker(true)}
                      className={`w-full p-4 border-2 border-dashed rounded-lg transition-all text-left ${pickupAddress ? isDark ? 'bg-slate-900/50 border-cyan-500/50 hover:border-cyan-500' : 'bg-white border-cyan-500/50 hover:border-cyan-500' : isDark ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-500/50' : 'bg-white border-slate-300 hover:border-cyan-500/50'}`}>
                      
                        <div className="flex items-start gap-3">
                          <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${pickupAddress ? 'bg-cyan-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          
                            <MapPin
                            className={`h-5 w-5 ${pickupAddress ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          
                          </div>
                          <div className="flex-1 min-w-0">
                            {pickupAddress ?
                          <>
                                <p
                              className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              
                                  {pickupAddress}
                                </p>
                                {pickupCoordinates &&
                            <p
                              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              
                                    📍 {pickupCoordinates.lat.toFixed(4)},{' '}
                                    {pickupCoordinates.lng.toFixed(4)}
                                  </p>
                            }
                              </> :

                          <div>
                                <p
                              className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              
                                  Cliquez pour sélectionner sur la carte
                                </p>
                                <p
                              className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              
                                  📍 Utiliser la carte interactive
                                </p>
                              </div>
                          }
                          </div>
                        </div>
                      </button>
                    </div>

                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Adresse de destination *
                      </label>
                      <button
                      type="button"
                      onClick={() => setShowDestinationMapPicker(true)}
                      className={`w-full p-4 border-2 border-dashed rounded-lg transition-all text-left ${destinationAddress ? isDark ? 'bg-slate-900/50 border-orange-500/50 hover:border-orange-500' : 'bg-white border-orange-500/50 hover:border-orange-500' : isDark ? 'bg-slate-900/50 border-slate-700 hover:border-orange-500/50' : 'bg-white border-slate-300 hover:border-orange-500/50'}`}>
                      
                        <div className="flex items-start gap-3">
                          <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${destinationAddress ? 'bg-orange-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          
                            <MapPin
                            className={`h-5 w-5 ${destinationAddress ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          
                          </div>
                          <div className="flex-1 min-w-0">
                            {destinationAddress ?
                          <>
                                <p
                              className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              
                                  {destinationAddress}
                                </p>
                                {destinationCoordinates &&
                            <p
                              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              
                                    📍 {destinationCoordinates.lat.toFixed(4)},{' '}
                                    {destinationCoordinates.lng.toFixed(4)}
                                  </p>
                            }
                              </> :

                          <div>
                                <p
                              className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              
                                  Cliquez pour sélectionner sur la carte
                                </p>
                                <p
                              className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              
                                  📍 Utiliser la carte interactive
                                </p>
                              </div>
                          }
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Distance and Price Calculation */}
                    {calculatedDistance !== null &&
                  calculatedPrice !== null &&
                  <div
                    className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                    
                          <div className="flex items-start gap-3">
                            <Check
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      
                            <div className="flex-1">
                              <p
                          className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                          
                                Trajet calculé
                              </p>
                              <div
                          className={`text-sm mt-2 space-y-1 ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                          
                                <p>
                                  Distance:{' '}
                                  <strong>{calculatedDistance} km</strong>
                                </p>
                                <p>
                                  Prix de base (
                                  {providerPricing.standardKilometers} km):{' '}
                                  <strong>
                                    {providerPricing.basePrice} TND
                                  </strong>
                                </p>
                                {calculatedDistance >
                          providerPricing.standardKilometers &&
                          <p>
                                    Kilomètres supplémentaires:{' '}
                                    <strong>
                                      {(
                              calculatedDistance -
                              providerPricing.standardKilometers).
                              toFixed(1)}{' '}
                                      km × {providerPricing.pricePerExtraKm} TND
                                      ={' '}
                                      {(
                              (calculatedDistance -
                              providerPricing.standardKilometers) *
                              providerPricing.pricePerExtraKm).
                              toFixed(2)}{' '}
                                      TND
                                    </strong>
                                  </p>
                          }
                                <p className="text-base font-bold pt-2 border-t border-green-500/30">
                                  Prix total: {calculatedPrice} TND
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                  }
                  </div>
                </div>

                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <h2
                  className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Informations patient
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Nom complet *
                        </label>
                        <div className="relative">
                          <User
                          className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        
                          <input
                          type="text"
                          value={patientInfo.name}
                          onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            name: e.target.value
                          })
                          }
                          required
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`} />
                        
                        </div>
                      </div>
                      <div>
                        <label
                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Âge
                        </label>
                        <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          age: e.target.value
                        })
                        }
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`} />
                      
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone
                          className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        
                          <input
                          type="tel"
                          value={patientInfo.phone}
                          onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            phone: e.target.value
                          })
                          }
                          placeholder="+216 XX XXX XXX"
                          required
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`} />
                        
                        </div>
                      </div>
                      <div>
                        <label
                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Email
                        </label>
                        <div className="relative">
                          <Mail
                          className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        
                          <input
                          type="email"
                          value={patientInfo.email}
                          onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            email: e.target.value
                          })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`} />
                        
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        État médical / Raison du transport
                      </label>
                      <textarea
                      value={patientInfo.medicalCondition}
                      onChange={(e) =>
                      setPatientInfo({
                        ...patientInfo,
                        medicalCondition: e.target.value
                      })
                      }
                      placeholder="Décrivez brièvement l'état du patient"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg transition-all resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`}>
                    </textarea>
                    </div>

                    <div>
                      <label
                      className={`block text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Mobilité du patient
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                      {
                        id: 'walking',
                        label: 'Peut marcher'
                      },
                      {
                        id: 'wheelchair',
                        label: 'Fauteuil roulant'
                      },
                      {
                        id: 'stretcher',
                        label: 'Brancard'
                      }].
                      map((option) =>
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                        setPatientInfo({
                          ...patientInfo,
                          mobility: option.id
                        })
                        }
                        className={`p-3 rounded-lg border-2 transition-all font-medium ${patientInfo.mobility === option.id ? 'border-red-500 bg-red-500/10 text-red-500' : isDark ? 'border-slate-700 text-slate-300 hover:border-slate-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        
                            {option.label}
                          </button>
                      )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={patientInfo.oxygen}
                        onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          oxygen: e.target.checked
                        })
                        }
                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500" />
                      
                        <span
                        className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Oxygène nécessaire
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={patientInfo.accompaniment}
                        onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          accompaniment: e.target.checked
                        })
                        }
                        className="w-5 h-5 text-red-500 rounded focus:ring-red-500" />
                      
                        <span
                        className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Accompagnant (famille/proche)
                        </span>
                      </label>
                    </div>

                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Instructions spéciales
                      </label>
                      <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Allergies, médicaments, précautions particulières..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg transition-all resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`}>
                    </textarea>
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Step 3: Confirmation */}
            {currentStep === 3 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <h2
                className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Récapitulatif
                </h2>
                <div className="space-y-4">
                  <div
                  className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  
                    <h3
                    className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Service
                    </h3>
                    <div
                    className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                      <div className="flex justify-between">
                        <span>Prestataire</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {provider.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {
                        transportTypes.find((t) => t.id === transportType)?.
                        label
                        }
                        </span>
                      </div>
                      {urgencyLevel === 'scheduled' &&
                    <>
                          <div className="flex justify-between">
                            <span>Date</span>
                            <span
                          className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {pickupDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Heure</span>
                            <span
                          className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {pickupTime}
                            </span>
                          </div>
                        </>
                    }
                      {urgencyLevel === 'immediate' &&
                    <div className="flex justify-between">
                          <span>Urgence</span>
                          <span className="font-medium text-red-500">
                            Transport immédiat
                          </span>
                        </div>
                    }
                    </div>
                  </div>

                  <div
                  className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  
                    <h3
                    className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Trajet
                    </h3>
                    <div
                    className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                      <div>
                        <span className="block mb-1">Départ</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {pickupAddress}
                        </span>
                      </div>
                      <div>
                        <span className="block mb-1">Destination</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {destinationAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                  className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  
                    <h3
                    className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Patient
                    </h3>
                    <div
                    className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                      <div className="flex justify-between">
                        <span>Nom</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {patientInfo.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Téléphone</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {patientInfo.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobilité</span>
                        <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {patientInfo.mobility === 'walking' ?
                        'Peut marcher' :
                        patientInfo.mobility === 'wheelchair' ?
                        'Fauteuil roulant' :
                        'Brancard'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                  className={`p-6 rounded-lg border ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                  
                    <div className="flex justify-between items-center">
                      <span
                      className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Tarif estimé
                      </span>
                      <span className="text-3xl font-bold text-red-500">
                        {provider.price} TND
                      </span>
                    </div>
                    <p
                    className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      Le tarif final sera confirmé après évaluation du trajet
                    </p>
                  </div>
                </div>
              </div>
            }

            {/* Success Screen */}
            {currentStep === 4 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-12 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2
                className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Réservation confirmée !
                </h2>
                <p
                className={`mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Numéro de réservation :
                </p>
                <p className="text-xl font-bold text-red-500 mb-6">
                  AMB-2024-
                  {Math.floor(Math.random() * 10000).
                toString().
                padStart(4, '0')}
                </p>
                <div
                className={`rounded-lg p-4 mb-8 text-left max-w-md mx-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                
                  <h3
                  className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    📋 Prochaines étapes
                  </h3>
                  <ol
                  className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-500">1.</span>
                      <span>Vous recevrez une confirmation par SMS</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-500">2.</span>
                      <span>
                        L'ambulance vous contactera 30 min avant l'arrivée
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-500">3.</span>
                      <span>Préparez les documents médicaux nécessaires</span>
                    </li>
                  </ol>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                  type="button"
                  onClick={() => navigate('/patient-dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
                  
                    Tableau de bord
                  </button>
                  <button
                  type="button"
                  onClick={() => navigate('/ambulance')}
                  className={`px-6 py-3 border rounded-lg font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                  
                    Nouvelle réservation
                  </button>
                </div>
              </div>
            }

            {/* Navigation Buttons */}
            {currentStep < 4 &&
            <div className="flex items-center justify-between mt-8">
                {currentStep > 1 ?
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-6 py-3 border rounded-lg font-medium transition-all flex items-center gap-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </button> :

              <div></div>
              }
                <button
                type="submit"
                disabled={!canProceed()}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                
                  {currentStep === 3 ? 'Confirmer la réservation' : 'Continuer'}
                </button>
              </div>
            }
          </form>
        </div>
      </div>

      {/* Map Address Pickers */}
      <MapAddressPicker
        isOpen={showPickupMapPicker}
        onClose={() => setShowPickupMapPicker(false)}
        onSelectAddress={handleSelectPickupAddress}
        title="Sélectionner l'adresse de départ"
        isDark={isDark} />
      

      <MapAddressPicker
        isOpen={showDestinationMapPicker}
        onClose={() => setShowDestinationMapPicker(false)}
        onSelectAddress={handleSelectDestinationAddress}
        title="Sélectionner l'adresse de destination"
        isDark={isDark} />
      

      <CyberBottomNav />
    </div>);

}