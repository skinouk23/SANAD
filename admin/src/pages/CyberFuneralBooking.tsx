import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Heart,
  MapPin,
  FileText,
  Upload,
  AlertCircle,
  User,
  Phone,
  Mail,
  Home,
  Globe,
  Users,
  Flower2,
  Car } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { CyberPaymentStep } from '../components/CyberPaymentStep';
export function CyberFuneralBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const provider = location.state?.provider || {
    name: 'Services Funéraires',
    address: 'Tunis'
  };
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    deceasedName: '',
    deceasedBirthDate: '',
    deceasedDeathDate: '',
    deathPlace: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    relationship: '',
    ceremonyType: '',
    burialType: '',
    repatriation: false,
    repatriationCountry: '',
    ceremonyDate: '',
    ceremonyTime: '',
    ceremonyLocation: '',
    floralArrangements: false,
    transport: false,
    adminAssistance: true,
    griefSupport: false
  });
  const totalSteps = 6;
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleNext = () => setStep(step + 1);
  const handleBack = () => {
    if (step > 1) setStep(step - 1);else
    navigate(-1);
  };
  const handlePaymentComplete = () => handleNext();
  const getEstimatedPrice = () => {
    let base = 2500;
    if (formData.repatriation) base += 3000;
    if (formData.floralArrangements) base += 200;
    if (formData.transport) base += 150;
    if (formData.griefSupport) base += 100;
    return base;
  };
  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-3xl mx-auto px-6 py-4">
        {/* Header with WOW effect */}
        <div className="relative rounded-[16px] p-[2px] overflow-hidden shadow-sm mb-4">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
          <div
            className={`relative rounded-[14px] p-4 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
            
            <h1
              className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Organisation des Obsèques
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Heart className="h-3 w-3" />
              <span>{provider.name}</span>
              <span>•</span>
              <MapPin className="h-3 w-3" />
              <span>{provider.address}</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
          {Array.from(
            {
              length: totalSteps
            },
            (_, i) => i + 1
          ).map((s) =>
          <div
            key={s}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s <= step ? 'bg-slate-700 text-white' : isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-white text-slate-400 border border-slate-200'}`}>
            
              {s}
            </div>
          )}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mb-4 text-[10px] text-slate-500">
          <span
            className={
            step === 1 ?
            isDark ?
            'text-white font-semibold' :
            'text-slate-900 font-semibold' :
            ''
            }>
            
            Défunt
          </span>
          <span
            className={
            step === 2 ?
            isDark ?
            'text-white font-semibold' :
            'text-slate-900 font-semibold' :
            ''
            }>
            
            Contact
          </span>
          <span
            className={
            step === 3 ?
            isDark ?
            'text-white font-semibold' :
            'text-slate-900 font-semibold' :
            ''
            }>
            
            Services
          </span>
          <span
            className={
            step === 4 ?
            isDark ?
            'text-white font-semibold' :
            'text-slate-900 font-semibold' :
            ''
            }>
            
            Cérémonie
          </span>
          <span
            className={
            step === 5 ?
            isDark ?
            'text-white font-semibold' :
            'text-slate-900 font-semibold' :
            ''
            }>
            
            Paiement
          </span>
          <span
            className={
            step === 6 ?
            isDark ?
            'text-white font-semibold' :
            'text-slate-900 font-semibold' :
            ''
            }>
            
            Confirmation
          </span>
        </div>

        {/* Step Content */}
        <div
          className={`border rounded-2xl p-4 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          {/* STEP 1: Deceased Information */}
          {step === 1 &&
          <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Informations du défunt
                  </h2>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Ces informations sont nécessaires pour les démarches
                    administratives
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Nom complet du défunt *
                  </label>
                  <input
                  type="text"
                  value={formData.deceasedName}
                  onChange={(e) =>
                  handleInputChange('deceasedName', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  placeholder="Prénom et nom" />
                
                </div>
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Date de naissance
                  </label>
                  <input
                  type="date"
                  value={formData.deceasedBirthDate}
                  onChange={(e) =>
                  handleInputChange('deceasedBirthDate', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                
                </div>
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Date du décès *
                  </label>
                  <input
                  type="date"
                  value={formData.deceasedDeathDate}
                  onChange={(e) =>
                  handleInputChange('deceasedDeathDate', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                
                </div>
                <div className="md:col-span-2">
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Lieu du décès
                  </label>
                  <input
                  type="text"
                  value={formData.deathPlace}
                  onChange={(e) =>
                  handleInputChange('deathPlace', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  placeholder="Hôpital, domicile, etc." />
                
                </div>
              </div>

              <div
              className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
              
                <div className="flex gap-2">
                  <AlertCircle
                  className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                
                  <p
                  className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  
                    Le certificat médical de décès doit être établi par un
                    médecin. La déclaration en mairie doit être faite dans les
                    24 heures suivant le décès.
                  </p>
                </div>
              </div>
            </div>
          }

          {/* STEP 2: Contact Information */}
          {step === 2 &&
          <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Personne de contact
                  </h2>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Vos coordonnées pour le suivi du dossier
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Votre nom complet *
                  </label>
                  <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) =>
                  handleInputChange('contactName', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  placeholder="Prénom et nom" />
                
                </div>
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Téléphone *
                  </label>
                  <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                  handleInputChange('contactPhone', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  placeholder="+216 XX XXX XXX" />
                
                </div>
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Email
                  </label>
                  <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                  handleInputChange('contactEmail', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  placeholder="votre@email.com" />
                
                </div>
                <div className="md:col-span-2">
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Lien de parenté
                  </label>
                  <select
                  value={formData.relationship}
                  onChange={(e) =>
                  handleInputChange('relationship', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                  
                    <option value="">Sélectionner...</option>
                    <option value="spouse">Conjoint(e)</option>
                    <option value="child">Enfant</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Frère / Sœur</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          }

          {/* STEP 3: Services */}
          {step === 3 &&
          <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Choix des prestations
                  </h2>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Sélectionnez les services souhaités
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3
                  className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Type d'obsèques
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                    onClick={() =>
                    handleInputChange('burialType', 'inhumation')
                    }
                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.burialType === 'inhumation' ? 'border-slate-700 bg-slate-700/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <div className="flex items-center gap-2 mb-1">
                        <Home
                        className={`h-4 w-4 ${formData.burialType === 'inhumation' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`} />
                      
                        <span
                        className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Inhumation
                        </span>
                      </div>
                      <p
                      className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Enterrement classique
                      </p>
                    </button>
                    <button
                    onClick={() =>
                    handleInputChange('burialType', 'cremation')
                    }
                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.burialType === 'cremation' ? 'border-slate-700 bg-slate-700/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle
                        className={`h-4 w-4 ${formData.burialType === 'cremation' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`} />
                      
                        <span
                        className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Crémation
                        </span>
                      </div>
                      <p
                      className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        Incinération
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <h3
                  className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Rapatriement
                  </h3>
                  <div
                  className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={formData.repatriation}
                      onChange={(e) =>
                      handleInputChange('repatriation', e.target.checked)
                      }
                      className="rounded text-slate-700 focus:ring-slate-700" />
                    
                      <span
                      className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        Nécessite un rapatriement de corps
                      </span>
                    </label>
                    {formData.repatriation &&
                  <div className="mt-2 pl-6">
                        <input
                      type="text"
                      value={formData.repatriationCountry}
                      onChange={(e) =>
                      handleInputChange(
                        'repatriationCountry',
                        e.target.value
                      )
                      }
                      placeholder="Pays de provenance / destination"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                    
                      </div>
                  }
                  </div>
                </div>

                <div>
                  <h3
                  className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Services additionnels
                  </h3>
                  <div className="space-y-2">
                    {[
                  {
                    id: 'adminAssistance',
                    label: 'Assistance administrative (Inclus)',
                    icon: FileText
                  },
                  {
                    id: 'floralArrangements',
                    label: 'Compositions florales',
                    icon: Flower2
                  },
                  {
                    id: 'transport',
                    label: 'Transport de la famille',
                    icon: Car
                  },
                  {
                    id: 'griefSupport',
                    label: 'Soutien psychologique',
                    icon: Heart
                  }].
                  map((service) =>
                  <label
                    key={service.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData[service.id as keyof typeof formData] ? 'border-slate-700 bg-slate-700/5' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                    
                        <input
                      type="checkbox"
                      checked={
                      formData[
                      service.id as keyof typeof formData] as
                      boolean
                      }
                      onChange={(e) =>
                      handleInputChange(service.id, e.target.checked)
                      }
                      disabled={service.id === 'adminAssistance'}
                      className="rounded text-slate-700 focus:ring-slate-700" />
                    
                        <service.icon
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    
                        <span
                      className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {service.label}
                        </span>
                      </label>
                  )}
                  </div>
                </div>
              </div>
            </div>
          }

          {/* STEP 4: Ceremony Details */}
          {step === 4 &&
          <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Détails de la cérémonie
                  </h2>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Organisation du recueillement
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Type de cérémonie
                  </label>
                  <select
                  value={formData.ceremonyType}
                  onChange={(e) =>
                  handleInputChange('ceremonyType', e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                  
                    <option value="">Sélectionner...</option>
                    <option value="religious">Religieuse</option>
                    <option value="civil">Civile</option>
                    <option value="none">Pas de cérémonie</option>
                  </select>
                </div>

                {formData.ceremonyType !== 'none' &&
              <>
                    <div>
                      <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Date souhaitée
                      </label>
                      <input
                    type="date"
                    value={formData.ceremonyDate}
                    onChange={(e) =>
                    handleInputChange('ceremonyDate', e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                  
                    </div>
                    <div>
                      <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Heure souhaitée
                      </label>
                      <input
                    type="time"
                    value={formData.ceremonyTime}
                    onChange={(e) =>
                    handleInputChange('ceremonyTime', e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                  
                    </div>
                    <div className="md:col-span-2">
                      <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        Lieu de la cérémonie
                      </label>
                      <input
                    type="text"
                    value={formData.ceremonyLocation}
                    onChange={(e) =>
                    handleInputChange('ceremonyLocation', e.target.value)
                    }
                    placeholder="Lieu de culte, cimetière, crématorium..."
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                  
                    </div>
                  </>
              }
              </div>
            </div>
          }

          {/* STEP 5: Payment */}
          {step === 5 &&
          <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Devis estimatif
                  </h2>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Un acompte est requis pour valider la commande
                  </p>
                </div>
              </div>

              <div
              className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-900/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
              
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span
                    className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    
                      Prestations de base
                    </span>
                    <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      2500 TND
                    </span>
                  </div>
                  {formData.repatriation &&
                <div className="flex justify-between text-xs">
                      <span
                    className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    
                        Rapatriement
                      </span>
                      <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        3000 TND
                      </span>
                    </div>
                }
                  {formData.floralArrangements &&
                <div className="flex justify-between text-xs">
                      <span
                    className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    
                        Compositions florales
                      </span>
                      <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        200 TND
                      </span>
                    </div>
                }
                  {formData.transport &&
                <div className="flex justify-between text-xs">
                      <span
                    className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    
                        Transport famille
                      </span>
                      <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        150 TND
                      </span>
                    </div>
                }
                  {formData.griefSupport &&
                <div className="flex justify-between text-xs">
                      <span
                    className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    
                        Soutien psychologique
                      </span>
                      <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        100 TND
                      </span>
                    </div>
                }
                </div>
                <div
                className={`pt-3 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                
                  <span
                  className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Total estimé
                  </span>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    {getEstimatedPrice()} TND
                  </span>
                </div>
              </div>

              <CyberPaymentStep
              amount={getEstimatedPrice() * 0.3} // 30% deposit
              onPaymentComplete={handlePaymentComplete}
              onBack={handleBack}
              isSubmitting={false} />
            
            </div>
          }

          {/* STEP 6: Confirmation */}
          {step === 6 &&
          <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h2
              className={`text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Demande confirmée
              </h2>
              <p
              className={`text-sm mb-4 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Nous vous présentons nos sincères condoléances. Un conseiller
                funéraire va vous contacter dans les plus brefs délais pour
                finaliser l'organisation.
              </p>
              <Button
              onClick={() => navigate('/patient-dashboard')}
              className="w-full sm:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
              
                Retour à l'accueil
              </Button>
            </div>
          }
        </div>

        {/* Navigation Buttons */}
        {step < 5 &&
        <div className="flex gap-3">
            <Button
            variant="outline"
            onClick={handleBack}
            className={`flex-1 py-2 rounded-xl text-sm ${isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            
              Retour
            </Button>
            <Button
            onClick={handleNext}
            className="flex-[2] py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold">
            
              Continuer
            </Button>
          </div>
        }
      </div>
    </div>);

}