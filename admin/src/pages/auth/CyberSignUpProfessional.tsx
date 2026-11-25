import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Upload,
  X,
  Plus,
  FileText,
  Award,
  GraduationCap,
  Crown,
  Percent,
  Star,
  Check,
  Zap,
  Shield } from
'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
interface Certification {
  id: string;
  name: string;
  file: File | null;
  fileName: string;
}
interface Diploma {
  id: string;
  name: string;
  institution: string;
  year: string;
  file: File | null;
  fileName: string;
}
export function CyberSignUpProfessional() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    license: '',
    specialization: '',
    experience: '',
    services: [] as string[],
    subscriptionPlan: ''
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseFileName, setLicenseFileName] = useState('');
  const [useSameAccount, setUseSameAccount] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const availableServices = [
  {
    id: 'nursing',
    name: t.signup.nursingCare,
    icon: '💉'
  },
  {
    id: 'elderly',
    name: t.signup.seniorCare,
    icon: '👴'
  },
  {
    id: 'physio',
    name: t.signup.physiotherapy,
    icon: '🏃'
  },
  {
    id: 'maternity',
    name: t.signup.maternityCare,
    icon: '👶'
  },
  {
    id: 'night',
    name: t.signup.nightGuard,
    icon: '🌙'
  },
  {
    id: 'doctor',
    name: t.signup.homeDoctor,
    icon: '🩺'
  },
  {
    id: 'psychology',
    name: t.signup.psychology,
    icon: '🧠'
  },
  {
    id: 'nutrition',
    name: t.signup.nutrition,
    icon: '🥗'
  },
  {
    id: 'physiotherapy',
    name: 'Physiothérapie',
    icon: '🦵'
  },
  {
    id: 'equipment',
    name: 'Équipement médical',
    icon: '🩼'
  },
  {
    id: 'babysitting',
    name: "Garde d'enfants",
    icon: '👶'
  },
  {
    id: 'ambulance',
    name: 'Ambulance privée',
    icon: '🚑'
  },
  {
    id: 'checkup',
    name: 'Bilan de santé',
    icon: '📋'
  },
  {
    id: 'chronic',
    name: 'Soins chroniques',
    icon: '💊'
  },
  {
    id: 'accompagnement',
    name: 'Accompagnement médical',
    icon: '🤝'
  },
  {
    id: 'pharmacy',
    name: 'Pharmacie',
    icon: '💊'
  },
  {
    id: 'funeral',
    name: 'Services funéraires',
    icon: '🕯️'
  }];

  const plans = [
  {
    id: 'commission',
    name: 'Commission',
    price: '0',
    period: 'mois',
    commission: '20%',
    description: 'Commission sur chaque opération',
    icon: Percent,
    gradient: 'from-slate-600 to-slate-700',
    popular: false,
    features: [
    'Pas de frais mensuels',
    '20% commission',
    'Profil basique',
    'Support standard']

  },
  {
    id: 'standard',
    name: 'Standard',
    price: '100',
    period: 'mois',
    commission: '0%',
    description: 'Le plus populaire',
    icon: Star,
    gradient: 'from-blue-500 to-cyan-500',
    popular: true,
    features: [
    'Aucune commission',
    'Badge vérifié',
    'Visibilité prioritaire',
    'Analytics',
    'Support prioritaire']

  },
  {
    id: 'elite',
    name: 'Elite',
    price: '200',
    period: 'mois',
    commission: '0%',
    description: 'Pour les leaders',
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    popular: false,
    features: [
    'Aucune commission',
    'Position top',
    'Badge Elite',
    'Marketing inclus',
    'Assurance RC',
    'Support VIP 24/7']

  }];

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId) ?
      prev.services.filter((id) => id !== serviceId) :
      [...prev.services, serviceId]
    }));
  };
  const addCertification = () => {
    setCertifications([
    ...certifications,
    {
      id: Date.now().toString(),
      name: '',
      file: null,
      fileName: ''
    }]
    );
  };
  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };
  const updateCertification = (
  id: string,
  field: string,
  value: string | File | null) =>
  {
    setCertifications(
      certifications.map((c) =>
      c.id === id ?
      {
        ...c,
        [field]: value,
        ...(field === 'file' && value instanceof File ?
        {
          fileName: value.name
        } :
        {})
      } :
      c
      )
    );
  };
  const addDiploma = () => {
    setDiplomas([
    ...diplomas,
    {
      id: Date.now().toString(),
      name: '',
      institution: '',
      year: '',
      file: null,
      fileName: ''
    }]
    );
  };
  const removeDiploma = (id: string) => {
    setDiplomas(diplomas.filter((d) => d.id !== id));
  };
  const updateDiploma = (
  id: string,
  field: string,
  value: string | File | null) =>
  {
    setDiplomas(
      diplomas.map((d) =>
      d.id === id ?
      {
        ...d,
        [field]: value,
        ...(field === 'file' && value instanceof File ?
        {
          fileName: value.name
        } :
        {})
      } :
      d
      )
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/provider-dashboard');
    }, 1500);
  };
  const canProceedStep3 = () => {
    const hasValidDiploma = diplomas.some((d) => d.name && d.file);
    return hasValidDiploma;
  };
  const canProceedStep4 = () => {
    return formData.subscriptionPlan !== '';
  };
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/auth/onboarding');
    }
  };
  const inputCls = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  const labelCls = `block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`;
  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>

      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
      
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`} />
      
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`} />
      

      <div
        className={`relative z-10 w-full px-4 py-4 ${step === 4 ? 'max-w-5xl' : 'max-w-xl'}`}>
        
        <button
          onClick={goBack}
          className={`flex items-center mb-3 text-sm font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
          
          <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          {t.signup.back}
        </button>

        {/* WOW EFFECT: Animated Gradient Border */}
        <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-2xl">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#8b5cf6_100%)]" />

          <div
            className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
            
            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h2
                className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.signup.professionalTitle}
              </h2>
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {t.signup.professionalSubtitle}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-5">
              <div className="flex items-center gap-1.5 sm:gap-3">
                {[
                {
                  num: 1,
                  label: t.signup.stepInformation
                },
                {
                  num: 2,
                  label: t.signup.stepServices
                },
                {
                  num: 3,
                  label: t.signup.stepDocuments
                },
                {
                  num: 4,
                  label: 'Abonnement'
                }].
                map((s, i) =>
                <Fragment key={s.num}>
                    <div
                    className={`flex flex-col items-center gap-0.5 ${step >= s.num ? isDark ? 'text-blue-400' : 'text-blue-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                      <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= s.num ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      
                        {step > s.num ?
                      <CheckCircle2 className="h-4 w-4" /> :

                      s.num
                      }
                      </div>
                      <span className="text-[9px] font-medium hidden sm:block">
                        {s.label}
                      </span>
                    </div>
                    {i < 3 &&
                  <div
                    className={`w-6 sm:w-10 h-0.5 ${step > s.num ? 'bg-gradient-to-r from-blue-500 to-purple-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                  }
                  </Fragment>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Step 1: Personal Info */}
              {step === 1 &&
              <>
                  {/* Use same account toggle */}
                  <div
                  className={`p-3 border rounded-xl ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p
                        className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Utiliser le même compte patient
                        </p>
                        <p
                        className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          Pré-remplir avec votre compte existant
                        </p>
                      </div>
                      <button
                      type="button"
                      onClick={() => setUseSameAccount(!useSameAccount)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${useSameAccount ? 'bg-blue-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                      
                        <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${useSameAccount ? 'translate-x-4' : 'translate-x-0'}`} />
                      
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>{t.signup.firstName}</label>
                      <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value
                      })
                      }
                      required
                      className={inputCls} />
                    
                    </div>
                    <div>
                      <label className={labelCls}>{t.signup.lastName}</label>
                      <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName: e.target.value
                      })
                      }
                      required
                      className={inputCls} />
                    
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>{t.auth.email}</label>
                      <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value
                      })
                      }
                      required
                      className={inputCls} />
                    
                    </div>
                    <div>
                      <label className={labelCls}>{t.signup.phone}</label>
                      <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value
                      })
                      }
                      placeholder="+216 XX XXX XXX"
                      required
                      className={inputCls} />
                    
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>{t.signup.city}</label>
                      <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value
                      })
                      }
                      required
                      className={inputCls} />
                    
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t.signup.yearsExperience}
                      </label>
                      <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: e.target.value
                      })
                      }
                      required
                      className={inputCls} />
                    
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{t.auth.password}</label>
                    <div className="relative">
                      <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value
                      })
                      }
                      required
                      className={inputCls} />
                    
                      <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-400 hover:text-cyan-600'}`}>
                      
                        {showPassword ?
                      <EyeOff className="h-4 w-4" /> :

                      <Eye className="h-4 w-4" />
                      }
                      </button>
                    </div>
                  </div>
                </>
              }

              {/* Step 2: Services */}
              {step === 2 &&
              <div>
                  <h3
                  className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {t.signup.selectServices}
                  </h3>
                  <p
                  className={`text-[11px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    {t.signup.selectAtLeastOneService}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                    {availableServices.map((service) =>
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`p-2.5 rounded-lg border-2 transition-all text-center ${formData.services.includes(service.id) ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-lg">{service.icon}</span>
                          {formData.services.includes(service.id) &&
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                      }
                        </div>
                        <div
                      className={`text-[10px] font-medium leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {service.name}
                        </div>
                      </button>
                  )}
                  </div>
                  {formData.services.length === 0 &&
                <p className="text-[11px] text-amber-500 mt-2">
                      ⚠️ {t.signup.selectAtLeastOneService}
                    </p>
                }
                </div>
              }

              {/* Step 3: Documents */}
              {step === 3 &&
              <div className="space-y-4">
                  <div
                  className={`border rounded-lg p-3 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                  
                    <p
                    className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    
                      📋 {t.signup.documentsNotice}
                    </p>
                  </div>

                  {/* Professional License */}
                  <div>
                    <label className={labelCls}>
                      <FileText className="inline h-3.5 w-3.5 mr-1" />
                      {t.signup.professionalLicense}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                      type="text"
                      value={formData.license}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        license: e.target.value
                      })
                      }
                      placeholder={t.signup.licenseNumber}
                      className={inputCls} />
                    
                      <div className="relative">
                        <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLicenseFile(file);
                            setLicenseFileName(file.name);
                          }
                        }}
                        className="hidden"
                        id="license-file" />
                      
                        <label
                        htmlFor="license-file"
                        className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 border border-dashed rounded-lg cursor-pointer text-xs transition-all ${licenseFile ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-cyan-500 text-slate-400' : 'border-slate-300 hover:border-cyan-500 text-slate-500'}`}>
                        
                          <Upload className="h-3.5 w-3.5" />
                          <span className="truncate">
                            {licenseFileName || t.signup.uploadDocument}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Diplomas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls}>
                        <GraduationCap className="inline h-3.5 w-3.5 mr-1" />
                        {t.signup.diplomasRequired}
                      </label>
                      <button
                      type="button"
                      onClick={addDiploma}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-500 text-[10px] hover:bg-blue-500/30 transition-all">
                      
                        <Plus className="h-3 w-3" /> {t.signup.addDiploma}
                      </button>
                    </div>

                    {diplomas.length === 0 &&
                  <div
                    className={`text-center py-4 border border-dashed rounded-lg ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                    
                        <GraduationCap
                      className={`h-6 w-6 mx-auto mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    
                        <p
                      className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      
                          {t.signup.noDiplomasAdded}
                        </p>
                        <button
                      type="button"
                      onClick={addDiploma}
                      className={`mt-1 text-[11px] ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                          + {t.signup.addDiploma}
                        </button>
                      </div>
                  }

                    <div className="space-y-2">
                      {diplomas.map((diploma, index) =>
                    <div
                      key={diploma.id}
                      className={`p-3 border rounded-lg ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      
                          <div className="flex items-center justify-between mb-2">
                            <span
                          className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {t.signup.diplomas} {index + 1}
                            </span>
                            <button
                          type="button"
                          onClick={() => removeDiploma(diploma.id)}
                          className="text-red-500 hover:text-red-400">
                          
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                          type="text"
                          value={diploma.name}
                          onChange={(e) =>
                          updateDiploma(
                            diploma.id,
                            'name',
                            e.target.value
                          )
                          }
                          placeholder={t.signup.diplomaName}
                          className={`${inputCls} text-xs`} />
                        
                            <input
                          type="text"
                          value={diploma.institution}
                          onChange={(e) =>
                          updateDiploma(
                            diploma.id,
                            'institution',
                            e.target.value
                          )
                          }
                          placeholder={t.signup.institution}
                          className={`${inputCls} text-xs`} />
                        
                            <input
                          type="text"
                          value={diploma.year}
                          onChange={(e) =>
                          updateDiploma(
                            diploma.id,
                            'year',
                            e.target.value
                          )
                          }
                          placeholder={t.signup.yearObtained}
                          className={`${inputCls} text-xs`} />
                        
                            <div className="relative">
                              <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                              updateDiploma(diploma.id, 'file', file);
                            }}
                            className="hidden"
                            id={`diploma-file-${diploma.id}`} />
                          
                              <label
                            htmlFor={`diploma-file-${diploma.id}`}
                            className={`flex items-center justify-center gap-1 w-full px-2 py-2 border border-dashed rounded-lg cursor-pointer text-[11px] transition-all ${diploma.file ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-cyan-500 text-slate-400' : 'border-slate-300 hover:border-cyan-500 text-slate-500'}`}>
                            
                                <Upload className="h-3 w-3" />
                                <span className="truncate">
                                  {diploma.fileName ||
                              t.signup.documentRequired}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls}>
                        <Award className="inline h-3.5 w-3.5 mr-1" />
                        {t.signup.certificationsOptional}
                      </label>
                      <button
                      type="button"
                      onClick={addCertification}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-500 text-[10px] hover:bg-purple-500/30 transition-all">
                      
                        <Plus className="h-3 w-3" /> {t.signup.addCertification}
                      </button>
                    </div>

                    {certifications.length === 0 &&
                  <div
                    className={`text-center py-3 border border-dashed rounded-lg ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                    
                        <p
                      className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      
                          {t.signup.noCertificationsAdded}
                        </p>
                      </div>
                  }

                    <div className="space-y-2">
                      {certifications.map((cert, index) =>
                    <div
                      key={cert.id}
                      className={`p-3 border rounded-lg ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      
                          <div className="flex items-center justify-between mb-2">
                            <span
                          className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {t.signup.certifications} {index + 1}
                            </span>
                            <button
                          type="button"
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-500 hover:text-red-400">
                          
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                          updateCertification(
                            cert.id,
                            'name',
                            e.target.value
                          )
                          }
                          placeholder={t.signup.certificationName}
                          className={`${inputCls} text-xs`} />
                        
                            <div className="relative">
                              <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                              updateCertification(cert.id, 'file', file);
                            }}
                            className="hidden"
                            id={`cert-file-${cert.id}`} />
                          
                              <label
                            htmlFor={`cert-file-${cert.id}`}
                            className={`flex items-center justify-center gap-1 w-full px-2 py-2 border border-dashed rounded-lg cursor-pointer text-[11px] transition-all ${cert.file ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-cyan-500 text-slate-400' : 'border-slate-300 hover:border-cyan-500 text-slate-500'}`}>
                            
                                <Upload className="h-3 w-3" />
                                <span className="truncate">
                                  {cert.fileName || t.signup.uploadDocument}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>

                  {!canProceedStep3() &&
                <p className="text-[11px] text-amber-500">
                      ⚠️ {t.signup.addAtLeastOneDiploma}
                    </p>
                }
                </div>
              }

              {/* Step 4: Subscription */}
              {step === 4 &&
              <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3
                    className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Choisissez votre plan
                    </h3>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      Sélectionnez l'offre qui correspond à votre activité
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plans.map((plan) =>
                  <div
                    key={plan.id}
                    onClick={() =>
                    setFormData({
                      ...formData,
                      subscriptionPlan: plan.id
                    })
                    }
                    className={`relative group cursor-pointer transition-all duration-300 ${formData.subscriptionPlan === plan.id ? `transform scale-[1.03] ring-2 ring-cyan-500 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl shadow-cyan-500/20` : `${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/80 hover:bg-white'} hover:shadow-lg`} border rounded-xl p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                        {plan.popular &&
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                              <Star className="h-2.5 w-2.5 fill-current" />{' '}
                              POPULAIRE
                            </div>
                          </div>
                    }

                        {formData.subscriptionPlan === plan.id &&
                    <div className="absolute top-3 right-3">
                            <div className="bg-cyan-500 rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                    }

                        <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-3 text-white`}>
                      
                          <plan.icon className="h-4 w-4" />
                        </div>

                        <h4
                      className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {plan.name}
                        </h4>
                        <p
                      className={`text-[10px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                          {plan.description}
                        </p>

                        <div className="mb-2">
                          <div className="flex items-baseline gap-0.5">
                            <span
                          className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {plan.price}
                            </span>
                            <span
                          className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                              TND/{plan.period}
                            </span>
                          </div>
                        </div>

                        <div
                      className={`p-2 rounded-lg mb-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      
                          <p
                        className={`text-xs font-semibold text-center ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                            Commission: {plan.commission}
                          </p>
                        </div>

                        <ul className="space-y-1.5 mb-3">
                          {plan.features.map((feature, idx) =>
                      <li key={idx} className="flex items-start gap-1.5">
                              <Check
                          className={`h-3 w-3 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        
                              <span
                          className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          
                                {feature}
                              </span>
                            </li>
                      )}
                        </ul>

                        <div
                      className={`w-full py-1.5 rounded-lg text-xs font-bold text-center transition-colors ${formData.subscriptionPlan === plan.id ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-300 group-hover:bg-slate-600' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
                      
                          {formData.subscriptionPlan === plan.id ?
                      'Sélectionné' :
                      'Sélectionner'}
                        </div>
                      </div>
                  )}
                  </div>

                  <div className="flex items-start gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <input
                    type="checkbox"
                    required
                    className={`mt-0.5 h-3.5 w-3.5 text-blue-500 rounded ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                  
                    <label
                    className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {t.signup.acceptTermsAndAuthenticity}
                    </label>
                  </div>
                </div>
              }

              <button
                type="submit"
                disabled={
                step === 2 && formData.services.length === 0 ||
                step === 3 && !canProceedStep3() ||
                step === 4 && !canProceedStep4() ||
                isLoading
                }
                className="relative w-full group overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                <div className="relative w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {isLoading ?
                  t.signup.creating :
                  step === 4 ?
                  t.signup.createMyAccount :
                  t.signup.continue}
                </div>
              </button>
            </form>

            <div className="mt-4 text-center">
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {t.signup.alreadyHaveAccount}{' '}
                <button
                  onClick={() => navigate('/auth/login')}
                  className={`font-semibold underline ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                  {t.auth.signIn}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>);

}