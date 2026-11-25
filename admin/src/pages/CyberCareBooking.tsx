import React, { useEffect, useMemo, useState, Fragment } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Check,
  Heart,
  Map,
  Star,
  Briefcase } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { AddressPickerModal } from '../components/AddressPickerModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
interface SubService {
  id: string;
  label: string;
  icon?: string;
  price: number;
  included: boolean;
}
export function CyberCareBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { serviceId } = useParams();
  const { provider, service } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [addressCoords, setAddressCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    medicalNotes: ''
  });
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const unavailableDates = ['2026-01-30', '2026-02-01'];
  const unavailableTimes = ['09:00', '14:00'];
  const timeSlots =
  serviceId === 'night' ?
  ['20:00', '21:00', '22:00', '23:00'] :
  [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'];

  const getSubServices = (): SubService[] => {
    if (serviceId === 'elderly') {
      return [
      {
        id: 'hygiene',
        label: 'Toilette et hygiène',
        icon: '🚿',
        price: 0,
        included: true
      },
      {
        id: 'dressing',
        label: 'Habillage',
        icon: '👔',
        price: 0,
        included: true
      },
      {
        id: 'meals',
        label: 'Préparation et aide aux repas',
        icon: '🍽️',
        price: 4,
        included: false
      },
      {
        id: 'mobility',
        label: 'Aide aux déplacements',
        icon: '🚶',
        price: 0,
        included: true
      },
      {
        id: 'company',
        label: 'Compagnie et stimulation',
        icon: '💬',
        price: 0,
        included: true
      },
      {
        id: 'medication',
        label: 'Gestion des médicaments',
        icon: '💊',
        price: 2,
        included: false
      }];

    }
    if (serviceId === 'nursing') {
      return [
      {
        id: 'injection',
        label: 'Injection / Perfusion',
        icon: '💉',
        price: 0,
        included: true
      },
      {
        id: 'dressing',
        label: 'Pansement',
        icon: '🩹',
        price: 0,
        included: true
      },
      {
        id: 'blood-test',
        label: 'Prise de sang',
        icon: '🩸',
        price: 5,
        included: false
      },
      {
        id: 'monitoring',
        label: 'Surveillance',
        icon: '📊',
        price: 3,
        included: false
      }];

    }
    if (serviceId === 'physio') {
      return [
      {
        id: 'motor',
        label: 'Rééducation motrice',
        icon: '🏃',
        price: 0,
        included: true
      },
      {
        id: 'respiratory',
        label: 'Rééducation respiratoire',
        icon: '🫁',
        price: 5,
        included: false
      },
      {
        id: 'massage',
        label: 'Massage thérapeutique',
        icon: '💆',
        price: 0,
        included: true
      },
      {
        id: 'sports',
        label: 'Rééducation sportive',
        icon: '⚽',
        price: 8,
        included: false
      }];

    }
    if (serviceId === 'checkup') {
      return [
      {
        id: 'blood-panel',
        label: 'Bilan sanguin complet',
        icon: '🩸',
        price: 0,
        included: true
      },
      {
        id: 'cardiac',
        label: 'Bilan cardiaque',
        icon: '❤️',
        price: 10,
        included: false
      },
      {
        id: 'vision',
        label: 'Contrôle de la vue',
        icon: '👁️',
        price: 5,
        included: false
      },
      {
        id: 'general',
        label: 'Examen clinique général',
        icon: '🩺',
        price: 0,
        included: true
      }];

    }
    if (serviceId === 'doctor-home' || serviceId === 'doctor') {
      return [
      {
        id: 'consultation',
        label: 'Consultation générale',
        icon: '🩺',
        price: 0,
        included: true
      },
      {
        id: 'prescription',
        label: 'Ordonnance médicale',
        icon: '📋',
        price: 0,
        included: true
      },
      {
        id: 'certificate',
        label: 'Certificat médical',
        icon: '📄',
        price: 5,
        included: false
      },
      {
        id: 'follow-up',
        label: 'Suivi post-opératoire',
        icon: '🏥',
        price: 8,
        included: false
      }];

    }
    if (serviceId === 'chronic-care') {
      return [
      {
        id: 'monitoring',
        label: 'Suivi des constantes',
        icon: '📊',
        price: 0,
        included: true
      },
      {
        id: 'medication',
        label: 'Gestion des médicaments',
        icon: '💊',
        price: 0,
        included: true
      },
      {
        id: 'nutrition',
        label: 'Conseils nutritionnels',
        icon: '🥗',
        price: 3,
        included: false
      },
      {
        id: 'exercise',
        label: "Programme d'exercices",
        icon: '🏋️',
        price: 5,
        included: false
      }];

    }
    if (serviceId === 'medical-companion') {
      return [
      {
        id: 'transport',
        label: 'Accompagnement transport',
        icon: '🚗',
        price: 0,
        included: true
      },
      {
        id: 'appointment',
        label: 'Accompagnement RDV médical',
        icon: '📅',
        price: 0,
        included: true
      },
      {
        id: 'admin',
        label: 'Aide administrative',
        icon: '📝',
        price: 3,
        included: false
      },
      {
        id: 'translation',
        label: 'Traduction médicale',
        icon: '🗣️',
        price: 5,
        included: false
      }];

    }
    if (serviceId === 'babysitting') {
      return [
      {
        id: 'daycare',
        label: 'Garde de jour',
        icon: '☀️',
        price: 0,
        included: true
      },
      {
        id: 'meals',
        label: 'Préparation des repas',
        icon: '🍼',
        price: 3,
        included: false
      },
      {
        id: 'homework',
        label: 'Aide aux devoirs',
        icon: '📚',
        price: 4,
        included: false
      },
      {
        id: 'activities',
        label: 'Activités ludiques',
        icon: '🎨',
        price: 0,
        included: true
      }];

    }
    if (serviceId === 'night') {
      return [
      {
        id: 'surveillance',
        label: 'Surveillance nocturne',
        icon: '🌙',
        price: 0,
        included: true
      },
      {
        id: 'medication',
        label: 'Administration médicaments',
        icon: '💊',
        price: 0,
        included: true
      },
      {
        id: 'emergency-response',
        label: "Intervention d'urgence",
        icon: '🚨',
        price: 0,
        included: true
      },
      {
        id: 'comfort',
        label: 'Soins de confort',
        icon: '🛏️',
        price: 3,
        included: false
      }];

    }
    if (serviceId === 'maternity') {
      return [
      {
        id: 'prenatal',
        label: 'Suivi prénatal',
        icon: '🤰',
        price: 0,
        included: true
      },
      {
        id: 'postnatal',
        label: 'Soins post-nataux',
        icon: '👶',
        price: 0,
        included: true
      },
      {
        id: 'breastfeeding',
        label: 'Conseil allaitement',
        icon: '🍼',
        price: 4,
        included: false
      },
      {
        id: 'newborn-care',
        label: 'Soins du nouveau-né',
        icon: '👣',
        price: 5,
        included: false
      }];

    }
    if (serviceId === 'psychology') {
      return [
      {
        id: 'individual',
        label: 'Séance individuelle',
        icon: '🧠',
        price: 0,
        included: true
      },
      {
        id: 'couple',
        label: 'Thérapie de couple',
        icon: '💑',
        price: 10,
        included: false
      },
      {
        id: 'family',
        label: 'Thérapie familiale',
        icon: '👨‍👩‍👧',
        price: 12,
        included: false
      },
      {
        id: 'stress',
        label: 'Gestion du stress',
        icon: '🧘',
        price: 0,
        included: true
      },
      {
        id: 'grief',
        label: 'Accompagnement au deuil',
        icon: '💙',
        price: 5,
        included: false
      }];

    }
    return [];
  };
  const subServices = getSubServices();
  useEffect(() => {
    if (subServices.length > 0) {
      const includedServices = subServices.
      filter((s) => s.included).
      map((s) => s.id);
      if (includedServices.length > 0 && selectedSubServices.length === 0) {
        setSelectedSubServices(includedServices);
      }
    }
  }, [serviceId]);
  useEffect(() => {
    if (user) {
      setPatientInfo((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
      if (user.address) {
        setAddress(user.address.fullAddress);
        if (user.address.latitude && user.address.longitude) {
          setAddressCoords({
            lat: user.address.latitude,
            lng: user.address.longitude
          });
        }
      }
    }
  }, [user]);
  const numberOfDays = useMemo(() => {
    if (!bookingDate || !bookingEndDate) return 1;
    const start = new Date(bookingDate);
    const end = new Date(bookingEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }, [bookingDate, bookingEndDate]);
  const totalPrice = useMemo(() => {
    let base = provider?.price || 0;
    let supplements = 0;
    selectedSubServices.forEach((sid) => {
      const subService = subServices.find((s) => s.id === sid);
      if (subService && !subService.included) supplements += subService.price;
    });
    return (base + supplements) * numberOfDays;
  }, [provider, selectedSubServices, subServices, numberOfDays]);
  const toggleSubService = (sid: string) => {
    setSelectedSubServices((prev) =>
    prev.includes(sid) ? prev.filter((id) => id !== sid) : [...prev, sid]
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePaymentComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCurrentStep(4);
      setIsSubmitting(false);
    }, 2000);
  };
  const canProceed = () => {
    if (currentStep === 1) {
      const hasDateTime = bookingDate && bookingEndDate && bookingTime;
      if (subServices.length > 0)
      return hasDateTime && selectedSubServices.length > 0;
      return hasDateTime;
    }
    if (currentStep === 2)
    return address && patientInfo.name && patientInfo.phone;
    return true;
  };
  if (!provider || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className={`border rounded-xl p-4 max-w-md text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
          
          <h2
            className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Erreur
          </h2>
          <p
            className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            
            Aucun professionnel sélectionné
          </p>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform">
            
            Retour aux services
          </button>
        </div>
      </div>);

  }
  const renderServiceFields = () => {
    if (subServices.length === 0) return null;
    return (
      <div className="space-y-3">
        {/* Total Card */}
        <div
          className={`border rounded-xl p-4 ${isDark ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'}`}>
          
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Total:
            </span>
            <span
              className={`text-xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
              {totalPrice} DT
            </span>
          </div>
          {numberOfDays > 1 &&
          <div className="text-right">
              <p
              className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                {Math.round(totalPrice / numberOfDays)} DT/jour × {numberOfDays}{' '}
                jour{numberOfDays > 1 ? 's' : ''}
              </p>
            </div>
          }
        </div>

        {/* Sub-services */}
        <div
          className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <h2
            className={`text-base font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            <Heart className="h-4 w-4 text-rose-500" />
            {service.title || service.name}
          </h2>
          <div className="space-y-2">
            {subServices.map((subService) =>
            <button
              key={subService.id}
              onClick={() => toggleSubService(subService.id)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedSubServices.includes(subService.id) ? 'border-cyan-500 bg-cyan-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
              
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{subService.icon}</span>
                    <span
                    className={`font-medium text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {subService.label}
                    </span>
                  </div>
                  <span
                  className={`text-xs font-bold whitespace-nowrap ${subService.included ? isDark ? 'text-slate-500' : 'text-slate-400' : isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    {subService.included ? '-' : `+${subService.price} DT`}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>);

  };
  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-4 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header with WOW effect */}
          <div className="relative rounded-[16px] p-[2px] overflow-hidden shadow-sm mb-4">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div
              className={`relative rounded-[14px] p-4 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xl overflow-hidden">
                  {provider.imageUrl ?
                  <img
                    src={provider.imageUrl}
                    alt={provider.name}
                    className="w-full h-full object-cover" /> :


                  provider.image || provider.name?.charAt(0)
                  }
                </div>
                <div>
                  <h1
                    className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    {provider.name}
                  </h1>
                  <div
                    className={`flex items-center gap-2 mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                    {(provider.experience || provider.experience === 0) &&
                    <div className="flex items-center gap-1 whitespace-nowrap">
                        <Briefcase
                        className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      
                        <span>{provider.experience} ans exp.</span>
                      </div>
                    }
                    {provider.rating &&
                    <>
                        <span
                        className={
                        isDark ? 'text-slate-600' : 'text-slate-300'
                        }>
                        
                          •
                        </span>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span
                          className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {provider.rating}
                          </span>
                          {(provider.reviewCount || provider.reviews) &&
                        <span>
                              ({provider.reviewCount || provider.reviews} avis)
                            </span>
                        }
                        </div>
                      </>
                    }
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    
                    {service.title || service.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          {currentStep !== 4 &&
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) =>
              <Fragment key={step}>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                    
                        {currentStep > step ?
                    <Check className="h-3.5 w-3.5" /> :

                    step
                    }
                      </div>
                      <p
                    className={`text-[10px] sm:text-xs font-semibold ${currentStep >= step ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                        {step === 1 ?
                    'Détails' :
                    step === 2 ?
                    'Infos' :
                    'Paiement'}
                      </p>
                    </div>
                    {step < 3 &&
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-all ${currentStep > step ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                }
                  </Fragment>
              )}
              </div>
            </div>
          }

          <form onSubmit={handleSubmit}>
            {currentStep === 1 &&
            <div className="space-y-3">
                {renderServiceFields()}

                {/* Date and Time */}
                <div
                className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <h2
                  className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Période de service
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label
                      className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Date de début *
                      </label>
                      <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => {
                        setBookingDate(e.target.value);
                        setBookingEndDate(e.target.value);
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}
                      style={{
                        colorScheme: isDark ? 'dark' : 'light'
                      }} />
                    
                    </div>
                    <div>
                      <label
                      className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Date de fin *
                      </label>
                      <input
                      type="date"
                      value={bookingEndDate}
                      onChange={(e) => setBookingEndDate(e.target.value)}
                      min={
                      bookingDate || new Date().toISOString().split('T')[0]
                      }
                      required
                      disabled={!bookingDate}
                      className={`w-full px-3 py-2 border rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}
                      style={{
                        colorScheme: isDark ? 'dark' : 'light'
                      }} />
                    
                    </div>
                  </div>

                  {bookingDate && bookingEndDate && numberOfDays > 1 &&
                <div
                  className={`mb-3 p-2 border rounded-lg ${isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                  
                      <p
                    className={`text-xs ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    
                        <span className="font-bold">{numberOfDays} jours</span>{' '}
                        de service sélectionnés
                      </p>
                    </div>
                }

                  <div>
                    <label
                    className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Heure de début *
                    </label>
                    <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                    
                      <option value="">Sélectionner</option>
                      {timeSlots.map((time) => {
                      const isUnavailable = unavailableTimes.includes(time);
                      return (
                        <option
                          key={time}
                          value={time}
                          disabled={isUnavailable}>
                          
                            {time} {isUnavailable ? '(Indisponible)' : ''}
                          </option>);

                    })}
                    </select>
                  </div>

                  {unavailableDates.length > 0 &&
                <p
                  className={`text-[10px] mt-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  
                      ⚠️ Dates indisponibles: {unavailableDates.join(', ')}
                    </p>
                }
                </div>
              </div>
            }

            {currentStep === 2 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <h2
                className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Informations
                </h2>
                <div className="space-y-3">
                  <div>
                    <label
                    className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Adresse *
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <MapPin
                        className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      
                        <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Adresse complète"
                        rows={2}
                        required
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm transition-all resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                      </textarea>
                      </div>
                      <button
                      type="button"
                      onClick={() => setShowAddressPicker(true)}
                      className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center transition-all hover:scale-105 ${isDark ? 'border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400' : 'border-cyan-500/50 bg-cyan-50 hover:bg-cyan-100 text-cyan-600'}`}
                      title="Sélectionner sur la carte">
                      
                        <Map className="h-4 w-4" />
                      </button>
                    </div>
                    {user?.address &&
                  <p
                    className={`text-[10px] mt-1.5 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                        <Check className="h-3 w-3 text-green-500" /> Adresse
                        pré-remplie depuis votre profil
                      </p>
                  }
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                      className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Nom complet *
                      </label>
                      <div className="relative">
                        <User
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      
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
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                      
                      </div>
                    </div>
                    <div>
                      <label
                      className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Téléphone *
                      </label>
                      <div className="relative">
                        <Phone
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      
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
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                      
                      </div>
                    </div>
                  </div>
                  {user &&
                <p
                  className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                      <Check className="h-3 w-3 text-green-500" /> Informations
                      pré-remplies depuis votre compte
                    </p>
                }
                </div>
              </div>
            }

            {currentStep === 3 &&
            <CyberPaymentStep
              totalPrice={totalPrice}
              onPaymentComplete={handlePaymentComplete}
              isSubmitting={isSubmitting}
              providerName={provider.name}
              serviceName={service.title}
              date={`${bookingDate} → ${bookingEndDate}`}
              time={bookingTime} />

            }

            {currentStep === 4 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-5 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h2
                className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Réservation confirmée !
                </h2>
                <p
                className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Numéro de réservation :
                </p>
                <p
                className={`text-base font-bold mb-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                  RES-2024-
                  {Math.floor(Math.random() * 10000).
                toString().
                padStart(4, '0')}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                  type="button"
                  onClick={() => navigate('/patient-dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform">
                  
                    Tableau de bord
                  </button>
                  <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                  
                    Nouveaux services
                  </button>
                </div>
              </div>
            }

            {currentStep < 3 &&
            <div className="flex items-center justify-end mt-4">
                {currentStep > 1 &&
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`mr-auto px-4 py-2 border rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
                
                    <ArrowLeft className="h-3.5 w-3.5" /> {t.common.back}
                  </button>
              }
                <button
                type="submit"
                disabled={!canProceed()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                
                  {t.common.next}
                </button>
              </div>
            }
          </form>
        </div>
      </div>

      <AddressPickerModal
        isOpen={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
        onSelectAddress={(selectedAddress) => {
          setAddress(selectedAddress.fullAddress);
          setAddressCoords({
            lat: selectedAddress.latitude,
            lng: selectedAddress.longitude
          });
        }}
        initialLatitude={
        addressCoords?.lat || user?.address?.latitude || 36.8065
        }
        initialLongitude={
        addressCoords?.lng || user?.address?.longitude || 10.1815
        } />
      

      <CyberBottomNav />
    </div>);

}