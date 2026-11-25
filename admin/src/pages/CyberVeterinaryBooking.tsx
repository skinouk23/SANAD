import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  MapPin,
  Upload,
  AlertCircle,
  Home,
  Building2,
  PawPrint,
  Stethoscope,
  Syringe,
  Scissors,
  Activity,
  Scan,
  FileText } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
export function CyberVeterinaryBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const provider = location.state?.provider || {
    name: 'Clinique Vétérinaire',
    address: 'Tunis'
  };
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [animalInfo, setAnimalInfo] = useState({
    type: '',
    name: '',
    age: '',
    weight: '',
    breed: '',
    sterilized: false,
    vaccinated: false
  });
  const [selectedLocation, setSelectedLocation] = useState<
    'clinique' | 'domicile' | null>(
    null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [details, setDetails] = useState({
    notes: '',
    aggressive: false,
    hasMedicalRecord: false
  });
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'd17' | 'cash' | null>(
    null);
  const services = [
  {
    id: 'consultation',
    name: 'Consultation générale',
    price: '45 TND',
    duration: '30 min',
    description: 'Examen complet de santé pour votre animal',
    locationType: 'both' as const,
    icon: Stethoscope
  },
  {
    id: 'vaccination',
    name: 'Vaccination',
    price: '35 TND',
    duration: '20 min',
    description: 'Rappels annuels ou première vaccination',
    locationType: 'both' as const,
    icon: Syringe
  },
  {
    id: 'sterilisation-chat',
    name: 'Stérilisation chat',
    price: '100 TND',
    duration: '60 min',
    description: 'Chirurgie de convenance pour chat/chatte',
    locationType: 'clinique' as const,
    icon: Scissors
  },
  {
    id: 'sterilisation-chien',
    name: 'Stérilisation chien',
    price: '200 TND',
    duration: '90 min',
    description: 'Chirurgie de convenance pour chien/chienne',
    locationType: 'clinique' as const,
    icon: Scissors
  },
  {
    id: 'detartrage',
    name: 'Détartrage',
    price: '80 TND',
    duration: '45 min',
    description: 'Soins dentaires sous anesthésie',
    locationType: 'clinique' as const,
    icon: Activity
  },
  {
    id: 'urgence',
    name: 'Urgence vétérinaire',
    price: '120 TND',
    duration: '60 min',
    description: 'Prise en charge immédiate',
    locationType: 'both' as const,
    icon: AlertCircle
  },
  {
    id: 'toilettage',
    name: 'Toilettage complet',
    price: '35 TND',
    duration: '60 min',
    description: 'Bain, tonte, coupe des griffes',
    locationType: 'both' as const,
    icon: Scissors
  },
  {
    id: 'analyses',
    name: 'Analyses sanguines',
    price: '60 TND',
    duration: '20 min',
    description: 'Bilan sanguin complet',
    locationType: 'clinique' as const,
    icon: Activity
  },
  {
    id: 'radiographie',
    name: 'Radiographie',
    price: '75 TND',
    duration: '30 min',
    description: 'Imagerie médicale',
    locationType: 'clinique' as const,
    icon: Scan
  },
  {
    id: 'chirurgie',
    name: 'Chirurgie',
    price: '300 TND',
    duration: '120 min',
    description: 'Intervention chirurgicale spécialisée',
    locationType: 'clinique' as const,
    icon: Activity
  },
  {
    id: 'pension',
    name: 'Pension / Garde',
    price: '30 TND/jour',
    duration: 'Variable',
    description: 'Hébergement sécurisé pour votre animal',
    locationType: 'clinique' as const,
    icon: Home
  },
  {
    id: 'identification',
    name: 'Identification (puce)',
    price: '50 TND',
    duration: '15 min',
    description: 'Pose de puce électronique',
    locationType: 'clinique' as const,
    icon: FileText
  }];

  const animalTypes = [
  {
    id: 'chien',
    label: 'Chien',
    emoji: '🐕'
  },
  {
    id: 'chat',
    label: 'Chat',
    emoji: '🐈'
  },
  {
    id: 'oiseau',
    label: 'Oiseau',
    emoji: '🐦'
  },
  {
    id: 'nac',
    label: 'NAC',
    emoji: '🐰'
  },
  {
    id: 'reptile',
    label: 'Reptile',
    emoji: '🐢'
  },
  {
    id: 'cheval',
    label: 'Cheval',
    emoji: '🐴'
  },
  {
    id: 'vache',
    label: 'Vache',
    emoji: '🐄'
  },
  {
    id: 'mouton',
    label: 'Mouton',
    emoji: '🐑'
  },
  {
    id: 'rat',
    label: 'Rat',
    emoji: '🐀'
  },
  {
    id: 'poisson',
    label: 'Poisson',
    emoji: '🐟'
  },
  {
    id: 'hamster',
    label: 'Hamster',
    emoji: '🐹'
  },
  {
    id: 'autre',
    label: 'Autre',
    emoji: '🐾'
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

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
    prev.includes(serviceId) ?
    prev.filter((id) => id !== serviceId) :
    [...prev, serviceId]
    );
  };
  const getSelectedServiceObjects = () =>
  services.filter((s) => selectedServices.includes(s.id));
  const needsLocationSelection = () => {
    const selected = getSelectedServiceObjects();
    return selected.some((s) => s.locationType === 'both');
  };
  const allClinicOnly = () => {
    const selected = getSelectedServiceObjects();
    return (
      selected.length > 0 &&
      selected.every((s) => s.locationType === 'clinique'));

  };
  const handleNext = () => {
    if (step === 1 && allClinicOnly()) {
      setSelectedLocation('clinique');
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
  const getServicePrice = (service: (typeof services)[0]) => {
    const price = parseInt(service.price.replace(/\D/g, ''));
    return isNaN(price) ? 0 : price;
  };
  const getTotalServicesPrice = () => {
    return getSelectedServiceObjects().reduce(
      (sum, s) => sum + getServicePrice(s),
      0
    );
  };
  const getTotalPrice = () => {
    return getTotalServicesPrice() + (selectedLocation === 'domicile' ? 15 : 0);
  };
  // Steps: 1-Service, 2-Animal, 3-Location(optional), 4-DateTime, 5-Details, 6-Payment, 7-Confirmation
  const getStepContent = () => {
    if (step === 1) return 'service';
    if (step === 2) return 'animal';
    const needsLoc = needsLocationSelection();
    if (needsLoc) {
      if (step === 3) return 'location';
      if (step === 4) return 'datetime';
      if (step === 5) return 'details';
      if (step === 6) return 'payment';
      if (step === 7) return 'confirmation';
    } else {
      if (step === 3) return 'datetime';
      if (step === 4) return 'details';
      if (step === 5) return 'payment';
      if (step === 6) return 'confirmation';
    }
    return 'service';
  };
  const currentContent = getStepContent();
  const totalSteps = needsLocationSelection() ? 7 : 6;
  const getStepLabels = () => {
    if (needsLocationSelection()) {
      return [
      'Service',
      'Animal',
      'Lieu',
      'Date',
      'Détails',
      'Paiement',
      'Confirmation'];

    }
    return ['Service', 'Animal', 'Date', 'Détails', 'Paiement', 'Confirmation'];
  };
  const stepLabels = getStepLabels();
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Réservation Vétérinaire
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
            <PawPrint className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{provider.name}</span>
            <span>•</span>
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {provider.location?.address || provider.address || 'Tunis'}
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-4 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
          {Array.from(
            {
              length: totalSteps
            },
            (_, i) => i + 1
          ).map((s) =>
          <div key={s} className="flex flex-col items-center gap-1">
              <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s <= step ? 'bg-orange-500 text-white' : isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-white text-slate-400 border border-slate-200'}`}>
              
                {s}
              </div>
              <span
              className={`text-[9px] font-medium whitespace-nowrap ${s <= step ? isDark ? 'text-orange-400' : 'text-orange-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                {stepLabels[s - 1]}
              </span>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div
          className={`border rounded-2xl p-6 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          {/* STEP: Service Selection */}
          {currentContent === 'service' &&
          <div className="space-y-6">
              <div>
                <h2
                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Choisissez vos services
                </h2>
                <p
                className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                  Vous pouvez sélectionner plusieurs services
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${isSelected ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500' : isDark ? 'border-slate-700 hover:border-orange-500/50 hover:bg-slate-700/50' : 'border-slate-200 hover:border-orange-500/50 hover:bg-slate-50'}`}>
                    
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <service.icon
                          className={`h-5 w-5 ${isSelected ? 'text-orange-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        
                          <span
                          className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {service.name}
                          </span>
                        </div>
                        <span
                        className={`text-sm font-semibold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        
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
                        <div className="flex items-center gap-2">
                          {service.locationType === 'both' ?
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500 font-bold border border-purple-500/30">
                              Clinique ou Domicile
                            </span> :

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-bold border border-blue-500/30">
                              En clinique
                            </span>
                        }
                          {isSelected &&
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        }
                        </div>
                      </div>
                    </button>);

              })}
              </div>
              {selectedServices.length > 0 &&
            <div
              className={`p-4 rounded-xl border ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
              
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                        {selectedServices.length} service
                        {selectedServices.length > 1 ? 's' : ''} sélectionné
                        {selectedServices.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getSelectedServiceObjects().map((s) =>
                    <span
                      key={s.id}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      
                            {s.name}
                          </span>
                    )}
                      </div>
                    </div>
                    <p
                  className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  
                      {getTotalServicesPrice()} TND
                    </p>
                  </div>
                </div>
            }
            </div>
          }

          {/* STEP: Animal Info */}
          {currentContent === 'animal' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Informations sur l'animal
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                  className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Type d'animal
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pb-2">
                    {animalTypes.map((type) =>
                  <button
                    key={type.id}
                    onClick={() =>
                    setAnimalInfo({
                      ...animalInfo,
                      type: type.id
                    })
                    }
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${animalInfo.type === type.id ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500' : isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                    
                        <span className="text-xl">{type.emoji}</span>
                        <span
                      className={`text-[10px] font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {type.label}
                        </span>
                      </button>
                  )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      Nom de l'animal
                    </label>
                    <input
                    type="text"
                    value={animalInfo.name}
                    onChange={(e) =>
                    setAnimalInfo({
                      ...animalInfo,
                      name: e.target.value
                    })
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Ex: Rex" />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      Race (optionnel)
                    </label>
                    <input
                    type="text"
                    value={animalInfo.breed}
                    onChange={(e) =>
                    setAnimalInfo({
                      ...animalInfo,
                      breed: e.target.value
                    })
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Ex: Labrador" />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      Âge
                    </label>
                    <input
                    type="text"
                    value={animalInfo.age}
                    onChange={(e) =>
                    setAnimalInfo({
                      ...animalInfo,
                      age: e.target.value
                    })
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Ex: 2 ans" />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      Poids (kg)
                    </label>
                    <input
                    type="number"
                    value={animalInfo.weight}
                    onChange={(e) =>
                    setAnimalInfo({
                      ...animalInfo,
                      weight: e.target.value
                    })
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Ex: 15" />
                  
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={animalInfo.sterilized}
                    onChange={(e) =>
                    setAnimalInfo({
                      ...animalInfo,
                      sterilized: e.target.checked
                    })
                    }
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  
                    <span
                    className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      Stérilisé(e)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={animalInfo.vaccinated}
                    onChange={(e) =>
                    setAnimalInfo({
                      ...animalInfo,
                      vaccinated: e.target.checked
                    })
                    }
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  
                    <span
                    className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      Vacciné(e) à jour
                    </span>
                  </label>
                </div>
              </div>
            </div>
          }

          {/* STEP: Location Selection */}
          {currentContent === 'location' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Lieu de consultation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                onClick={() => setSelectedLocation('clinique')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${selectedLocation === 'clinique' ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500' : isDark ? 'border-slate-700 hover:border-blue-500/50' : 'border-slate-200 hover:border-blue-500/50'}`}>
                
                  <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${selectedLocation === 'clinique' ? 'bg-blue-500' : isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  
                    <Building2
                    className={`h-7 w-7 ${selectedLocation === 'clinique' ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  
                  </div>
                  <h3
                  className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    En clinique
                  </h3>
                  <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    Rendez-vous au cabinet vétérinaire
                  </p>
                  <p
                  className={`text-xs mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  
                    Pas de frais supplémentaires
                  </p>
                </button>
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
                  
                    Le vétérinaire se déplace chez vous
                  </p>
                  <p
                  className={`text-xs mt-2 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                  
                    +15 TND frais de déplacement
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
                  return (
                    <button
                      key={day}
                      onClick={() => !isSunday && setSelectedDate(dateIso)}
                      disabled={isSunday}
                      className={`flex-shrink-0 px-4 py-3 rounded-xl border text-center min-w-[100px] transition-all ${isSelected ? 'bg-orange-500 text-white border-orange-500' : isSunday ? isDark ? 'bg-slate-800/50 border-red-900/30 text-red-500 cursor-not-allowed opacity-50' : 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed opacity-50' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-500/50' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-500/50'}`}>
                      
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
              <div className="space-y-3">
                <label
                className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Heure
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {timeSlots.map((time) =>
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-2 py-2 rounded-lg text-sm font-medium border transition-all ${selectedTime === time ? 'bg-orange-500 text-white border-orange-500' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-500/50' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-500/50'}`}>
                  
                      {time}
                    </button>
                )}
                </div>
              </div>
            </div>
          }

          {/* STEP: Details */}
          {currentContent === 'details' &&
          <div className="space-y-6">
              <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Détails complémentaires
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Notes pour le vétérinaire
                  </label>
                  <textarea
                  rows={3}
                  value={details.notes}
                  onChange={(e) =>
                  setDetails({
                    ...details,
                    notes: e.target.value
                  })
                  }
                  className={`w-full rounded-lg border p-3 text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Symptômes, comportement inhabituel, allergies connues...">
                </textarea>
                </div>
                <div
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                  <div className="flex items-center gap-3 mb-4">
                    <input
                    type="checkbox"
                    id="aggressive"
                    checked={details.aggressive}
                    onChange={(e) =>
                    setDetails({
                      ...details,
                      aggressive: e.target.checked
                    })
                    }
                    className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  
                    <label
                    htmlFor="aggressive"
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Mon animal est agressif / craintif (nécessite précautions)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                    type="checkbox"
                    id="medicalRecord"
                    checked={details.hasMedicalRecord}
                    onChange={(e) =>
                    setDetails({
                      ...details,
                      hasMedicalRecord: e.target.checked
                    })
                    }
                    className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  
                    <label
                    htmlFor="medicalRecord"
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      J'ai le carnet de santé / vaccination
                    </label>
                  </div>
                </div>
                {details.hasMedicalRecord &&
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDark ? 'border-slate-700 hover:border-orange-500/50' : 'border-slate-300 hover:border-orange-500/50'}`}>
                
                    <div className="flex flex-col items-center gap-2">
                      <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    
                        <Upload className="h-5 w-5" />
                      </div>
                      <p
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Télécharger le carnet (optionnel)
                      </p>
                      <Button variant="outline" size="sm">
                        Parcourir
                      </Button>
                    </div>
                  </div>
              }
              </div>
            </div>
          }

          {/* STEP: Payment */}
          {currentContent === 'payment' &&
          <CyberPaymentStep
            totalPrice={getTotalPrice()}
            onPaymentComplete={handlePaymentComplete}
            providerName={provider.name}
            serviceName={getSelectedServiceObjects().
            map((s) => s.name).
            join(', ')}
            date={selectedDate || ''}
            time={selectedTime || ''} />

          }

          {/* STEP: Confirmation */}
          {currentContent === 'confirmation' &&
          <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-orange-600" />
              </div>
              <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Rendez-vous confirmé !
              </h2>
              <p
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Votre rendez-vous pour {animalInfo.name || 'votre animal'} a été
                enregistré. Vous recevrez un SMS de confirmation.
              </p>
              <div
              className={`text-left p-4 rounded-xl border mt-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex-shrink-0">
                      Service(s)
                    </span>
                    <span
                    className={`font-medium text-right ml-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {getSelectedServiceObjects().
                    map((s) => s.name).
                    join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex-shrink-0">Animal</span>
                    <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {animalInfo.name}
                      {animalInfo.type ? ` (${animalInfo.type})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex-shrink-0">Lieu</span>
                    <span
                    className={`font-medium flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {selectedLocation === 'domicile' ?
                    <>
                          <Home className="h-3 w-3" /> À domicile
                        </> :

                    <>
                          <Building2 className="h-3 w-3" /> En clinique
                        </>
                    }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex-shrink-0">
                      Date & Heure
                    </span>
                    <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {selectedDate} à {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex-shrink-0">
                      Paiement
                    </span>
                    <span
                    className={`font-medium capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {paymentMethod === 'card' ?
                    'Carte Bancaire' :
                    paymentMethod === 'd17' ?
                    'D17 / Sobflous' :
                    'Espèces'}
                    </span>
                  </div>
                  {getSelectedServiceObjects().map((s) =>
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs">
                  
                      <span className="text-slate-500 flex-shrink-0">
                        {s.name}
                      </span>
                      <span
                    className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        {s.price}
                      </span>
                    </div>
                )}
                  {selectedLocation === 'domicile' &&
                <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex-shrink-0">
                        Frais déplacement
                      </span>
                      <span
                    className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        15 TND
                      </span>
                    </div>
                }
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span
                    className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Total à payer
                    </span>
                    <span
                    className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                    
                      {getTotalPrice()} TND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {currentContent !== 'payment' && currentContent !== 'confirmation' ?
          <>
              {step > 1 &&
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1">
              
                  Retour
                </Button>
            }
              <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleNext}
              disabled={
              currentContent === 'service' &&
              selectedServices.length === 0 ||
              currentContent === 'animal' && (
              !animalInfo.type || !animalInfo.name) ||
              currentContent === 'location' && !selectedLocation ||
              currentContent === 'datetime' && (
              !selectedDate || !selectedTime)
              }>
              
                Continuer
              </Button>
            </> :
          currentContent === 'confirmation' ?
          <Button
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => navigate('/patient-dashboard')}>
            
              Aller au tableau de bord
            </Button> :
          null}
        </div>
      </div>
    </div>);

}