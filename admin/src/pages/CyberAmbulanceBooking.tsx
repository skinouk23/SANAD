import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Check,
  AlertCircle,
  Ambulance } from
'lucide-react';
import { CyberBottomNav } from '../components/CyberBottomNav';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
import { useTheme } from '../contexts/ThemeContext';
export function CyberAmbulanceBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const provider = location.state?.provider;
  const [currentStep, setCurrentStep] = useState(1);
  const [transportType, setTransportType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('scheduled');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePaymentComplete = (method: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCurrentStep(4);
      setIsSubmitting(false);
    }, 2000);
  };
  const canProceed = () => {
    if (currentStep === 1)
    return (
      transportType && (
      urgencyLevel === 'immediate' || pickupDate && pickupTime));

    if (currentStep === 2)
    return (
      pickupAddress &&
      destinationAddress &&
      patientInfo.name &&
      patientInfo.phone);

    return true;
  };
  if (!provider) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        
        <div
          className={`border rounded-xl p-8 max-w-md text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
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
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:scale-105 transition-transform">
            
            Retour à la liste
          </button>
        </div>
      </div>);

  }
  const inputClass = `w-full px-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-red-500/10' : 'bg-red-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-orange-500/10' : 'bg-orange-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      <div className="relative z-10 py-8 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                {provider.imageUrl ?
                <img
                  src={provider.imageUrl}
                  alt={provider.name}
                  className="w-full h-full object-cover" /> :


                provider.image || '🚑'
                }
              </div>
              <div className="min-w-0">
                <h1
                  className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {provider.name}
                </h1>
                <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  Réservation de transport médicalisé
                </p>
              </div>
            </div>
          </div>

          {currentStep !== 4 &&
          <>
              <div
              className={`backdrop-blur-sm border rounded-xl p-6 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              
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
                        <div className="hidden sm:block">
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

              {urgencyLevel === 'immediate' &&
            <div
              className={`rounded-xl p-4 mb-8 ${isDark ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
              
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <h3
                    className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        Transport immédiat
                      </h3>
                      <p
                    className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        L'ambulance sera dépêchée dès confirmation. Arrivée
                        estimée : <strong>{provider.responseTime}</strong>
                      </p>
                    </div>
                  </div>
                </div>
            }
            </>
          }

          <form onSubmit={handleSubmit}>
            {currentStep === 1 &&
            <div className="space-y-6">
                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Type de transport
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {transportTypes.map((type) =>
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTransportType(type.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${transportType === type.id ? 'border-red-500 bg-red-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{type.icon}</span>
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
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Urgence
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                    type="button"
                    onClick={() => setUrgencyLevel('scheduled')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${urgencyLevel === 'scheduled' ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <h3
                      className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Transport programmé
                      </h3>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Réservez à l'avance
                      </p>
                    </button>
                    <button
                    type="button"
                    onClick={() => setUrgencyLevel('immediate')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${urgencyLevel === 'immediate' ? 'border-red-500 bg-red-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <h3
                      className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Transport immédiat
                      </h3>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Départ dans {provider.responseTime}
                      </p>
                    </button>
                  </div>
                </div>

                {urgencyLevel === 'scheduled' &&
              <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                    <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      Date et heure
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          Date *
                        </label>
                        <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className={inputClass}
                      style={{
                        colorScheme: isDark ? 'dark' : 'light'
                      }} />
                    
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
                      className={inputClass}>
                      
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

            {currentStep === 2 &&
            <div className="space-y-6">
                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Adresses
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Adresse de départ *
                      </label>
                      <textarea
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Adresse complète"
                      rows={2}
                      required
                      className={`${inputClass} resize-none`}>
                    </textarea>
                    </div>
                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Adresse de destination *
                      </label>
                      <textarea
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      placeholder="Adresse complète"
                      rows={2}
                      required
                      className={`${inputClass} resize-none`}>
                    </textarea>
                    </div>
                  </div>
                </div>

                <div
                className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                
                  <h2
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Informations patient
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Nom complet *
                        </label>
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
                        className={inputClass} />
                      
                      </div>
                      <div>
                        <label
                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Téléphone *
                        </label>
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
                        className={inputClass} />
                      
                      </div>
                    </div>

                    <div>
                      <label
                      className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Mobilité du patient
                      </label>
                      <div className="grid grid-cols-3 gap-2">
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
                        className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${patientInfo.mobility === option.id ? 'border-red-500 bg-red-500/10 text-red-500' : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        
                            {option.label}
                          </button>
                      )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={patientInfo.oxygen}
                        onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          oxygen: e.target.checked
                        })
                        }
                        className={`w-4 h-4 text-red-500 rounded ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                      
                        <span
                        className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Oxygène nécessaire
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={patientInfo.accompaniment}
                        onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          accompaniment: e.target.checked
                        })
                        }
                        className={`w-4 h-4 text-red-500 rounded ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                      
                        <span
                        className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Accompagnant
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            }

            {currentStep === 3 &&
            <CyberPaymentStep
              totalPrice={
              provider.price || provider.pricing?.[0]?.price || 80
              }
              onPaymentComplete={handlePaymentComplete}
              isSubmitting={isSubmitting}
              providerName={provider.name}
              serviceName={
              transportTypes.find((t) => t.id === transportType)?.label ||
              'Transport médicalisé'
              }
              date={urgencyLevel === 'scheduled' ? pickupDate : 'Immédiat'}
              time={urgencyLevel === 'scheduled' ? pickupTime : undefined} />

            }

            {currentStep === 4 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-12 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              
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
                <p
                className={`text-xl font-bold mb-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                  AMB-2024-
                  {Math.floor(Math.random() * 10000).
                toString().
                padStart(4, '0')}
                </p>
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

            {currentStep < 3 &&
            <div className="flex items-center justify-between mt-8">
                {currentStep > 1 ?
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-6 py-2 border rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </button> :

              <div></div>
              }
                <button
                type="submit"
                disabled={!canProceed()}
                className="px-8 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm">
                
                  Continuer
                </button>
              </div>
            }

            {currentStep === 3 &&
            <div className="mt-8">
                <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-6 py-2 border rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </button>
              </div>
            }
          </form>
        </div>
      </div>

      <CyberBottomNav />
    </div>);

}