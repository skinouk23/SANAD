import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Upload,
  CheckCircle,
  MapPin,
  Shield,
  FileText,
  Clock,
  Globe } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
export function CyberSignUpFuneral() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: '',
    managerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    services: [] as string[],
    available24h: false,
    repatriation: false
  });
  const funeralServices = [
  'Organisation complète des obsèques',
  'Transport du défunt',
  'Préparation et présentation',
  'Cérémonie religieuse',
  'Cérémonie civile',
  'Inhumation',
  'Crémation',
  'Rapatriement international',
  'Assistance administrative',
  'Accompagnement au deuil',
  'Fleurs et couronnes',
  'Faire-part et remerciements'];

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
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white">
              <Heart className="h-5 w-5" />
            </div>
            <span
              className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Inscription Services Funéraires
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
              label: 'Établissement'
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
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s.num ? 'bg-slate-700 text-white shadow-lg' : isDark ? 'bg-slate-800 text-slate-500 border-2 border-slate-700' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                
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
          
          {/* STEP 1: Company Info */}
          {step === 1 &&
          <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Informations de l'établissement
                </h2>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Renseignez les informations de votre entreprise de pompes
                  funèbres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Nom de l'établissement
                  </label>
                  <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Ex: Pompes Funèbres Dignité" />
                
                </div>
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Nom du responsable
                  </label>
                  <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Prénom Nom" />
                
                </div>
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Numéro d'agrément
                  </label>
                  <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  placeholder="Numéro officiel" />
                
                </div>
                <div className="space-y-2">
                  <label
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Téléphone (24h/24)
                  </label>
                  <input
                  type="tel"
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
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    placeholder="Adresse, Ville, Code postal" />
                  
                  </div>
                </div>
              </div>

              {/* Special options */}
              <div className="space-y-3 pt-4">
                <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                
                  <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-slate-600" />
                
                  <Clock className="h-5 w-5 text-slate-500" />
                  <div>
                    <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Disponible 24h/24, 7j/7
                    </span>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Service d'urgence permanent
                    </p>
                  </div>
                </label>
                <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                
                  <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-slate-600" />
                
                  <Globe className="h-5 w-5 text-slate-500" />
                  <div>
                    <span
                    className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Rapatriement international
                    </span>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Transport vers l'étranger
                    </p>
                  </div>
                </label>
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
                  Sélectionnez les services que vous proposez
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {funeralServices.map((service) =>
              <button
                key={service}
                onClick={() => handleServiceToggle(service)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${formData.services.includes(service) ? 'border-slate-600 bg-slate-600/10 ring-1 ring-slate-600' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                
                    <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${formData.services.includes(service) ? 'bg-slate-600 border-slate-600 text-white' : 'border-slate-400'}`}>
                  
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
                  Documents requis pour l'agrément
                </p>
              </div>

              <div className="space-y-4">
                {[
              "Agrément préfectoral pour l'activité funéraire",
              'Attestation de capacité professionnelle',
              'Assurance responsabilité civile professionnelle',
              'Registre du commerce (K-bis)',
              "Pièce d'identité du responsable"].
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
              className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-slate-700/30 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              
                <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Vos documents sont traités de manière confidentielle et
                  sécurisée. Ils ne sont accessibles qu'à notre équipe de
                  vérification.
                </p>
              </div>
            </div>
          }

          {/* STEP 4: Confirmation */}
          {step === 4 &&
          <div className="text-center py-8">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-slate-600 dark:text-slate-300" />
              </div>
              <h2
              className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Demande envoyée
              </h2>
              <p
              className={`text-lg mb-8 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Votre demande d'inscription a été reçue. Notre équipe vérifiera
                vos documents et activera votre compte sous 48-72h.
              </p>
              <p
              className={`text-sm mb-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
                Vous recevrez un email de confirmation à l'adresse indiquée.
              </p>
              <Button
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3"
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
              className={`flex-1 bg-slate-700 hover:bg-slate-600 text-white ${step === 1 ? 'w-full' : ''}`}
              onClick={handleNext}>
              
                {step === 3 ? 'Soumettre la demande' : 'Suivant'}
              </Button>
            </div>
          }
        </div>
      </div>
    </div>);

}