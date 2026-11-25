import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PawPrint,
  Upload,
  CheckCircle,
  MapPin,
  Shield,
  FileText } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
export function CyberSignUpVeterinary() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clinicName: '',
    vetName: '',
    orderNumber: '',
    email: '',
    phone: '',
    address: '',
    services: [] as string[]
  });
  const vetServices = [
  'Consultation générale',
  'Vaccination',
  'Chirurgie',
  'Stérilisation',
  'Détartrage',
  'Urgences 24h/24',
  'Toilettage',
  'Pension / Garde',
  'Analyses de laboratoire',
  'Radiographie / Échographie',
  'Dermatologie',
  'Ophtalmologie',
  'NAC (Nouveaux Animaux de Compagnie)',
  'Visites à domicile'];

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service) ?
      prev.services.filter((s) => s !== service) :
      [...prev.services, service]
    }));
  };
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-10 border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
        
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() =>
            step === 1 ? navigate('/auth/signup') : handleBack()
            }
            className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
              <PawPrint className="h-5 w-5" />
            </div>
            <span
              className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Inscription Clinique Vétérinaire
            </span>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
            {[
            {
              num: 1,
              label: 'Informations'
            },
            {
              num: 2,
              label: 'Services'
            },
            {
              num: 3,
              label: 'Documents'
            },
            {
              num: 4,
              label: 'Validation'
            }].
            map((s) =>
            <div
              key={s.num}
              className="flex flex-col items-center gap-2 bg-inherit">
              
                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s.num ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : isDark ? 'bg-slate-800 text-slate-500 border-2 border-slate-700' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                
                  {step > s.num ? <CheckCircle className="h-6 w-6" /> : s.num}
                </div>
                <span
                className={`text-xs font-medium ${step >= s.num ? isDark ? 'text-white' : 'text-slate-900' : 'text-slate-500'}`}>
                
                  {s.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div
          className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          {/* STEP 1: Basic Info */}
          {step === 1 &&
          <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Informations de la clinique
                </h2>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Commencez par les informations générales de votre
                  établissement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Nom de la clinique vétérinaire
                  </label>
                  <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    clinicName: e.target.value
                  })
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Ex: Clinique Vétérinaire Carthage" />
                
                </div>
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Nom du vétérinaire responsable
                  </label>
                  <input
                  type="text"
                  value={formData.vetName}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    vetName: e.target.value
                  })
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Dr. Prénom Nom" />
                
                </div>
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Numéro d'ordre (Ordre des Vétérinaires)
                  </label>
                  <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    orderNumber: e.target.value
                  })
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Numéro officiel" />
                
                </div>
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Téléphone professionnel
                  </label>
                  <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="+216 XX XXX XXX" />
                
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Adresse complète
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value
                    })
                    }
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Adresse, Ville, Code postal" />
                  
                  </div>
                </div>
              </div>
            </div>
          }

          {/* STEP 2: Services */}
          {step === 2 &&
          <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Services proposés
                </h2>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Sélectionnez les services disponibles dans votre clinique
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vetServices.map((service) =>
              <button
                key={service}
                onClick={() => handleServiceToggle(service)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${formData.services.includes(service) ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500' : isDark ? 'border-slate-700 hover:border-orange-500/50 hover:bg-slate-700/50' : 'border-slate-200 hover:border-orange-500/50 hover:bg-slate-50'}`}>
                
                    <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${formData.services.includes(service) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-400'}`}>
                  
                      {formData.services.includes(service) &&
                  <CheckCircle className="h-4 w-4" />
                  }
                    </div>
                    <span
                  className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      {service}
                    </span>
                  </button>
              )}
              </div>
            </div>
          }

          {/* STEP 3: Documents */}
          {step === 3 &&
          <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Documents justificatifs
                </h2>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Veuillez télécharger les documents officiels pour validation
                </p>
              </div>

              <div className="space-y-4">
                {[
              'Diplôme de Docteur Vétérinaire',
              "Inscription à l'Ordre des Vétérinaires",
              "Autorisation d'exercice",
              "Carte d'identité nationale",
              'Assurance responsabilité civile professionnelle'].
              map((doc, index) =>
              <div
                key={index}
                className={`p-4 rounded-xl border border-dashed ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
                
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                      
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p
                        className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {doc}
                          </p>
                          <p className="text-xs text-slate-500">
                            PDF, JPG ou PNG (max 5MB)
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Importer
                      </Button>
                    </div>
                  </div>
              )}
              </div>

              <div
              className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
              
                <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Vos documents sont stockés de manière sécurisée et ne sont
                  accessibles qu'à notre équipe de validation.
                </p>
              </div>
            </div>
          }

          {/* STEP 4: Confirmation */}
          {step === 4 &&
          <div className="text-center py-8">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-orange-600" />
              </div>
              <h2
              className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Demande envoyée !
              </h2>
              <p
              className={`text-lg mb-8 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Votre demande d'inscription a bien été reçue. Notre équipe va
                vérifier vos documents et activera votre compte sous 24-48h.
              </p>
              <Button
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
              onClick={() => navigate('/')}>
              
                Retour à l'accueil
              </Button>
            </div>
          }

          {/* Navigation Buttons */}
          {step < 4 &&
          <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              {step > 1 &&
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1">
              
                  Précédent
                </Button>
            }
              <Button
              className={`flex-1 bg-orange-600 hover:bg-orange-700 text-white ${step === 1 ? 'w-full' : ''}`}
              onClick={handleNext}>
              
                {step === 3 ? 'Soumettre la demande' : 'Suivant'}
              </Button>
            </div>
          }
        </div>
      </div>
    </div>);

}