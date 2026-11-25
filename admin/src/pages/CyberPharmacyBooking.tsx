import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  Pill,
  MapPin,
  FileText,
  Upload,
  AlertCircle,
  Home,
  Building2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
export function CyberPharmacyBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const pharmacy = location.state?.pharmacy || {
    name: 'Pharmacie Centrale',
    address: 'Tunis',
    priceRange: 'Variable'
  };
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    'domicile' | 'pharmacie' | null>(
    null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [hasPrescription, setHasPrescription] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'd17' | 'cash' | null>(
    null);
  // Services with location availability
  // locationType: 'domicile' | 'pharmacie' | 'both'
  const services = [
  {
    id: 'covid-test',
    name: 'Dépistage COVID-19 (Antigénique)',
    price: '25 TND',
    duration: '15 min',
    description: 'Prélèvement naso-pharyngé avec résultat en 15 min',
    locationType: 'both' as const
  },
  {
    id: 'delivery',
    name: 'Livraison de médicaments',
    price: '10-20 TND',
    duration: 'N/A',
    description: 'Livraison à domicile selon ordonnance',
    requiresPrescription: true,
    locationType: 'domicile' as const // Always domicile
  },
  {
    id: 'trod-angine',
    name: 'Test TROD Angine',
    price: '15 TND',
    duration: '10 min',
    description: "Test rapide d'orientation diagnostique pour l'angine",
    locationType: 'pharmacie' as const
  },
  {
    id: 'cystite',
    name: 'Dépistage Infection Urinaire',
    price: '10 TND',
    duration: '10 min',
    description: 'Test par bandelette urinaire',
    locationType: 'pharmacie' as const
  },
  {
    id: 'tension',
    name: 'Prise de Tension Artérielle',
    price: 'Gratuit',
    duration: '5 min',
    description: 'Mesure et suivi de la tension',
    locationType: 'both' as const
  },
  {
    id: 'glycemie',
    name: 'Mesure de Glycémie',
    price: '5 TND',
    duration: '5 min',
    description: 'Contrôle du taux de sucre (à jeun recommandé)',
    locationType: 'both' as const
  },
  {
    id: 'bas-contention',
    name: 'Bas de Contention (Mesure)',
    price: 'Gratuit',
    duration: '15 min',
    description: 'Prise de mesures et conseils pour bas de contention',
    locationType: 'pharmacie' as const
  },
  {
    id: 'orthopedie',
    name: 'Orthèse sur-mesure',
    price: 'Sur devis',
    duration: '20 min',
    description: 'Hallux valgus, attelles, ceintures',
    locationType: 'pharmacie' as const
  },
  {
    id: 'entretien-femme-enceinte',
    name: 'Entretien Femme Enceinte',
    price: 'Gratuit',
    duration: '30 min',
    description: 'Conseils personnalisés grossesse et allaitement',
    locationType: 'both' as const
  },
  {
    id: 'vaccination',
    name: 'Vaccination (Grippe)',
    price: 'Acte gratuit',
    duration: '15 min',
    description: 'Injection du vaccin antigrippal (vaccin non inclus)',
    locationType: 'both' as const
  }];

  const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00'];

  const unavailableTimes = ['10:00', '14:30', '16:00'];
  const getSelectedService = () =>
  services.find((s) => s.id === selectedService);
  const getLocationBadge = (
  locationType: 'domicile' | 'pharmacie' | 'both') =>
  {
    if (locationType === 'domicile') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-teal-500/20 border border-teal-500/50 text-teal-500 text-[10px] rounded-full font-bold">
          <Home className="h-3 w-3" />
          Domicile
        </span>);

    }
    if (locationType === 'pharmacie') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-500 text-[10px] rounded-full font-bold">
          <Building2 className="h-3 w-3" />
          Pharmacie
        </span>);

    }
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 text-purple-500 text-[10px] rounded-full font-bold">
        <MapPin className="h-3 w-3" />
        Les deux
      </span>);

  };
  // Check if we need location selection step
  const needsLocationSelection = () => {
    const service = getSelectedService();
    return service && service.locationType === 'both';
  };
  // Total steps: 1-Service, 2-Location (if both), 3-DateTime, 4-Details, 5-Payment, 6-Confirmation
  // OR: 1-Service, 2-DateTime, 3-Details, 4-Payment, 5-Confirmation (if not both)
  const getTotalSteps = () => needsLocationSelection() ? 6 : 5;
  const handleNext = () => {
    const service = getSelectedService();
    // After service selection, auto-set location if not 'both'
    if (step === 1 && service) {
      if (service.locationType === 'domicile') {
        setSelectedLocation('domicile');
      } else if (service.locationType === 'pharmacie') {
        setSelectedLocation('pharmacie');
      }
    }
    setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);else
    navigate(-1);
  };
  const handlePaymentComplete = (method: 'card' | 'd17' | 'cash') => {
    setPaymentMethod(method);
    handleNext();
  };
  const getServicePrice = () => {
    const service = getSelectedService();
    if (!service) return 0;
    const price = parseInt(service.price.replace(/\D/g, ''));
    return isNaN(price) ? 0 : price;
  };
  // Determine which content to show based on step and whether location selection is needed
  const getStepContent = () => {
    const needsLoc = needsLocationSelection();
    if (step === 1) return 'service';
    if (needsLoc) {
      if (step === 2) return 'location';
      if (step === 3) return 'datetime';
      if (step === 4) return 'details';
      if (step === 5) return 'payment';
      if (step === 6) return 'confirmation';
    } else {
      if (step === 2) return 'datetime';
      if (step === 3) return 'details';
      if (step === 4) return 'payment';
      if (step === 5) return 'confirmation';
    }
    return 'service';
  };
  const currentContent = getStepContent();
  const totalSteps = getTotalSteps();
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Réservation Pharmacie
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Pill className="h-4 w-4" />
            <span>{pharmacy.name}</span>
            <span>•</span>
            <MapPin className="h-4 w-4" />
            <span>{pharmacy.address}</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
          {Array.from(
            {
              length: totalSteps
            },
            (_, i) => i + 1
          ).map((s) =>
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s <= step ? 'bg-emerald-500 text-white' : isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-white text-slate-400 border border-slate-200'}`}>
            
              {s}
            </div>
          )}
        </div>

        {/* Step Content */}
        <div
          className={`border rounded-2xl p-6 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          {/* STEP: Service Selection */}
          {currentContent === 'service' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Choisissez un service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) =>
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`text-left p-4 rounded-xl border transition-all ${selectedService === service.id ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : isDark ? 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50' : 'border-slate-200 hover:border-emerald-500/50 hover:bg-slate-50'}`}>
                
                    <div className="flex justify-between items-start mb-2">
                      <span
                    className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {service.name}
                      </span>
                      <span
                    className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    
                        {service.price}
                      </span>
                    </div>
                    <p
                  className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration}</span>
                      </div>
                      {getLocationBadge(service.locationType)}
                    </div>
                  </button>
              )}
              </div>
            </div>
          }

          {/* STEP: Location Selection (only if service supports both) */}
          {currentContent === 'location' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Où souhaitez-vous le service ?
              </h2>
              <p
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Ce service est disponible à domicile ou en pharmacie
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                onClick={() => setSelectedLocation('domicile')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${selectedLocation === 'domicile' ? 'border-teal-500 bg-teal-500/10 ring-1 ring-teal-500' : isDark ? 'border-slate-700 hover:border-teal-500/50' : 'border-slate-200 hover:border-teal-500/50'}`}>
                
                  <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${selectedLocation === 'domicile' ? 'bg-teal-500' : isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  
                    <Home
                    className={`h-7 w-7 ${selectedLocation === 'domicile' ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  
                  </div>
                  <h3
                  className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    À domicile
                  </h3>
                  <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    Un pharmacien se déplace chez vous
                  </p>
                  <p
                  className={`text-xs mt-2 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                  
                    +10 TND frais de déplacement
                  </p>
                </button>

                <button
                onClick={() => setSelectedLocation('pharmacie')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${selectedLocation === 'pharmacie' ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500' : isDark ? 'border-slate-700 hover:border-blue-500/50' : 'border-slate-200 hover:border-blue-500/50'}`}>
                
                  <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${selectedLocation === 'pharmacie' ? 'bg-blue-500' : isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  
                    <Building2
                    className={`h-7 w-7 ${selectedLocation === 'pharmacie' ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  
                  </div>
                  <h3
                  className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    En pharmacie
                  </h3>
                  <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    Rendez-vous à la pharmacie
                  </p>
                  <p
                  className={`text-xs mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  
                    Pas de frais supplémentaires
                  </p>
                </button>
              </div>
            </div>
          }

          {/* STEP: Date & Time */}
          {currentContent === 'datetime' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Date et Heure
              </h2>

              {/* Date Selection */}
              <div className="space-y-3">
                <label
                className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Date du rendez-vous
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const date = new Date();
                  date.setDate(date.getDate() + day);
                  const dateStr = date.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  });
                  const dateIso = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateIso;
                  const isSunday = date.getDay() === 0;
                  const isUnavailable = isSunday;
                  return (
                    <button
                      key={day}
                      onClick={() =>
                      !isUnavailable && setSelectedDate(dateIso)
                      }
                      disabled={isUnavailable}
                      className={`flex-shrink-0 px-4 py-3 rounded-xl border text-center min-w-[100px] transition-all ${isSelected ? 'bg-emerald-500 text-white border-emerald-500' : isUnavailable ? isDark ? 'bg-slate-800/50 border-red-900/30 text-red-500 cursor-not-allowed opacity-50' : 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed opacity-50' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500/50'}`}>
                      
                        <span className="block text-xs uppercase opacity-70 mb-1">
                          {dateStr.split(' ')[0]}
                        </span>
                        <span className="block font-bold">
                          {dateStr.split(' ')[1]} {dateStr.split(' ')[2]}
                        </span>
                      </button>);

                })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <label
                className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Heure
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {timeSlots.map((time) => {
                  const isUnavailable = unavailableTimes.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => !isUnavailable && setSelectedTime(time)}
                      disabled={isUnavailable}
                      className={`px-2 py-2 rounded-lg text-sm font-medium border transition-all ${selectedTime === time ? 'bg-emerald-500 text-white border-emerald-500' : isUnavailable ? isDark ? 'bg-slate-800/50 border-red-900/30 text-red-500 cursor-not-allowed opacity-50' : 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed opacity-50' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500/50'}`}>
                      
                        {time}
                      </button>);

                })}
                </div>
              </div>
            </div>
          }

          {/* STEP: Details & Prescription */}
          {currentContent === 'details' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Détails complémentaires
              </h2>

              {getSelectedService()?.requiresPrescription &&
            <div
              className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              
                  <div className="flex gap-3">
                    <AlertCircle
                  className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                
                    <div>
                      <h3
                    className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Ordonnance requise
                      </h3>
                      <p
                    className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                        Ce service nécessite une ordonnance médicale valide.
                      </p>
                    </div>
                  </div>
                </div>
            }

              {/* Location Summary */}
              <div
              className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <div className="flex items-center gap-3">
                  {selectedLocation === 'domicile' ?
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                      <Home className="h-5 w-5 text-white" />
                    </div> :

                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                }
                  <div>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Lieu du service
                    </p>
                    <p
                    className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {selectedLocation === 'domicile' ?
                    'À domicile' :
                    'En pharmacie'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                  type="checkbox"
                  id="prescription"
                  checked={hasPrescription}
                  onChange={(e) => setHasPrescription(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                
                  <label
                  htmlFor="prescription"
                  className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    J'ai une ordonnance médicale (si nécessaire)
                  </label>
                </div>

                {hasPrescription &&
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDark ? 'border-slate-700 hover:border-emerald-500/50' : 'border-slate-300 hover:border-emerald-500/50'}`}>
                
                    <div className="flex flex-col items-center gap-3">
                      <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    
                        <Upload className="h-6 w-6" />
                      </div>
                      <div>
                        <p
                      className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Télécharger l'ordonnance
                        </p>
                        <p
                      className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      
                          JPG, PNG ou PDF (max 5MB)
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Parcourir les fichiers
                      </Button>
                    </div>
                  </div>
              }

                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Notes pour le pharmacien (optionnel)
                  </label>
                  <textarea
                  rows={3}
                  className={`w-full rounded-lg border p-3 text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Allergies, symptômes, précisions...">
                </textarea>
                </div>
              </div>
            </div>
          }

          {/* STEP: Payment */}
          {currentContent === 'payment' &&
          <CyberPaymentStep
            totalPrice={
            getServicePrice() + (selectedLocation === 'domicile' ? 10 : 0)
            }
            onPaymentComplete={handlePaymentComplete}
            providerName={pharmacy.name}
            serviceName={getSelectedService()?.name}
            date={selectedDate || ''}
            time={selectedTime || ''} />

          }

          {/* STEP: Confirmation */}
          {currentContent === 'confirmation' &&
          <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>

              <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Réservation confirmée !
              </h2>

              <p
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Votre rendez-vous a été enregistré avec succès. Vous recevrez un
                SMS de confirmation.
              </p>

              <div
              className={`text-left p-4 rounded-xl border mt-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <span className="text-slate-500">Service</span>
                  <span
                  className={`font-medium text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {getSelectedService()?.name}
                  </span>

                  <span className="text-slate-500">Lieu</span>
                  <span
                  className={`font-medium flex items-center justify-end gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {selectedLocation === 'domicile' ?
                  <>
                        <Home className="h-4 w-4" /> À domicile
                      </> :

                  <>
                        <Building2 className="h-4 w-4" /> En pharmacie
                      </>
                  }
                  </span>

                  <span className="text-slate-500">Date & Heure</span>
                  <span
                  className={`font-medium text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {selectedDate} à {selectedTime}
                  </span>

                  <span className="text-slate-500">Pharmacie</span>
                  <span
                  className={`font-medium text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {pharmacy.name}
                  </span>

                  <span className="text-slate-500">Paiement</span>
                  <span
                  className={`font-medium capitalize text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {paymentMethod === 'card' ?
                  'Carte Bancaire' :
                  paymentMethod === 'd17' ?
                  'D17 / Sobflous' :
                  'Espèces'}
                  </span>

                  <span className="col-span-2 border-t border-slate-200 dark:border-slate-700"></span>

                  <span className="font-bold text-slate-500">Total</span>
                  <span
                  className={`font-bold text-right ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  
                    {getServicePrice() + (
                  selectedLocation === 'domicile' ? 10 : 0)}{' '}
                    TND
                  </span>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {currentContent !== 'payment' && currentContent !== 'confirmation' ?
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleNext}
            disabled={
            currentContent === 'service' && !selectedService ||
            currentContent === 'location' && !selectedLocation ||
            currentContent === 'datetime' && (
            !selectedDate || !selectedTime)
            }>
            
              Continuer
            </Button> :
          currentContent === 'confirmation' ?
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => navigate('/patient-dashboard')}>
            
              Aller au tableau de bord
            </Button> :
          null}
        </div>
      </div>
    </div>);

}