import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FlaskConical } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
export function SignUpLaboratory() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    labName: '',
    managerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    license: '',
    services: [] as string[]
  });
  const availableServices = [
  {
    id: 'blood',
    name: 'Analyses sanguines',
    icon: '🩸'
  },
  {
    id: 'urine',
    name: 'Analyses urinaires',
    icon: '💧'
  },
  {
    id: 'hormones',
    name: 'Bilans hormonaux',
    icon: '🧬'
  },
  {
    id: 'genetics',
    name: 'Tests génétiques',
    icon: '🔬'
  },
  {
    id: 'covid',
    name: 'Tests COVID-19',
    icon: '🦠'
  },
  {
    id: 'preop',
    name: 'Bilans pré-opératoires',
    icon: '⚕️'
  },
  {
    id: 'home',
    name: 'Prélèvements à domicile',
    icon: '🏠'
  },
  {
    id: 'express',
    name: 'Résultats express',
    icon: '⚡'
  }];

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId) ?
      prev.services.filter((id) => id !== serviceId) :
      [...prev.services, serviceId]
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/patient-dashboard');
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() =>
          step === 2 ? setStep(1) : navigate('/auth/onboarding')
          }
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 font-medium">
          
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>

        <Card className="shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Inscription Laboratoire
            </h2>
            <p className="text-gray-600">
              Rejoignez notre réseau de laboratoires partenaires
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                  
                  1
                </div>
                <span className="text-sm font-medium">Informations</span>
              </div>
              <div
                className={`w-12 h-0.5 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              
              <div
                className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                  
                  2
                </div>
                <span className="text-sm font-medium">Services</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 &&
            <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du laboratoire
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type="text"
                    value={formData.labName}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      labName: e.target.value
                    })
                    }
                    placeholder="Laboratoire Central"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du responsable
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      managerName: e.target.value
                    })
                    }
                    placeholder="Dr. Ahmed Ben Ali"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email professionnel
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                    }
                    placeholder="contact@laboratoire.tn"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value
                    })
                    }
                    placeholder="+216 71 XXX XXX"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value
                      })
                      }
                      placeholder="Avenue Bourguiba"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value
                    })
                    }
                    placeholder="Tunis"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro d'agrément
                  </label>
                  <input
                  type="text"
                  value={formData.license}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    license: e.target.value
                  })
                  }
                  placeholder="LAB-TN-2024-XXXX"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value
                    })
                    }
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    
                      {showPassword ?
                    <EyeOff className="h-5 w-5" /> :

                    <Eye className="h-5 w-5" />
                    }
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })
                    }
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  
                  </div>
                </div>
              </>
            }

            {step === 2 &&
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quels services proposez-vous ?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Sélectionnez les analyses et services disponibles
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {availableServices.map((service) =>
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${formData.services.includes(service.id) ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{service.icon}</span>
                        {formData.services.includes(service.id) &&
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    }
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {service.name}
                      </div>
                    </button>
                )}
                </div>
                {formData.services.length === 0 &&
              <p className="text-sm text-amber-600 mt-4">
                    ⚠️ Veuillez sélectionner au moins un service
                  </p>
              }
              </div>
            }

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              
              <label className="text-sm text-gray-600">
                J'accepte les{' '}
                <a href="#" className="text-indigo-600 underline">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-indigo-600 underline">
                  charte qualité laboratoire
                </a>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={step === 2 && formData.services.length === 0}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:opacity-90">
              
              {step === 2 ? 'Créer mon compte' : 'Continuer'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 underline">
                
                Se connecter
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>);

}