import React, { useState, Fragment } from 'react';
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
  Scan,
  Upload,
  X,
  Plus,
  FileText,
  Shield,
  Award,
  Crown,
  Percent,
  Star,
  Check } from
'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
interface Document {
  id: string;
  name: string;
  file: File | null;
  fileName: string;
}
export function CyberSignUpRadiology() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    centerName: '',
    managerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    license: '',
    yearsInOperation: '',
    equipment: [] as string[],
    subscriptionPlan: ''
  });
  const [accreditationFile, setAccreditationFile] = useState<File | null>(null);
  const [accreditationFileName, setAccreditationFileName] = useState('');
  const [radiationSafetyFile, setRadiationSafetyFile] = useState<File | null>(
    null
  );
  const [radiationSafetyFileName, setRadiationSafetyFileName] = useState('');
  const [directorCredentials, setDirectorCredentials] = useState<File | null>(
    null
  );
  const [directorCredentialsName, setDirectorCredentialsName] = useState('');
  const [equipmentCertifications, setEquipmentCertifications] = useState<
    Document[]>(
    []);
  const availableEquipment = [
  {
    id: 'xray',
    name: t.signup.standardXray,
    icon: '📷'
  },
  {
    id: 'echo',
    name: t.signup.ultrasound,
    icon: '🔊'
  },
  {
    id: 'scanner',
    name: t.signup.ctScan,
    icon: '🔬'
  },
  {
    id: 'mri',
    name: t.signup.mri,
    icon: '🧲'
  },
  {
    id: 'mammo',
    name: t.signup.mammography,
    icon: '🩺'
  },
  {
    id: 'doppler',
    name: t.signup.vascularDoppler,
    icon: '💓'
  },
  {
    id: 'dental',
    name: t.signup.dentalRadiology,
    icon: '🦷'
  },
  {
    id: 'osteo',
    name: t.signup.boneDensitometry,
    icon: '🦴'
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
    '20% commission sur chaque réservation',
    'Profil basique',
    'Support standard',
    'Visibilité limitée']

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
    'Profil premium avec badge vérifié',
    'Visibilité prioritaire',
    'Planning avancé et rappels',
    'Analytics et statistiques',
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
    'Tous les avantages Standard',
    'Position top dans les résultats',
    'Badge Elite exclusif',
    'Marketing et promotion',
    'Assurance responsabilité civile',
    'Formation continue gratuite',
    'Support VIP 24/7']

  }];

  const toggleEquipment = (equipmentId: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId) ?
      prev.equipment.filter((id) => id !== equipmentId) :
      [...prev.equipment, equipmentId]
    }));
  };
  const addEquipmentCertification = () => {
    setEquipmentCertifications([
    ...equipmentCertifications,
    {
      id: Date.now().toString(),
      name: '',
      file: null,
      fileName: ''
    }]
    );
  };
  const removeEquipmentCertification = (id: string) => {
    setEquipmentCertifications(
      equipmentCertifications.filter((c) => c.id !== id)
    );
  };
  const updateEquipmentCertification = (
  id: string,
  field: string,
  value: string | File | null) =>
  {
    setEquipmentCertifications(
      equipmentCertifications.map((c) =>
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/login?type=professional');
    }, 1500);
  };
  const canProceedStep3 = () =>
  accreditationFile !== null && radiationSafetyFile !== null;
  const canProceedStep4 = () => {
    return formData.subscriptionPlan !== '';
  };
  const goBack = () => {
    if (step > 1) setStep(step - 1);else
    navigate('/auth/onboarding');
  };
  const inputClass = `w-full px-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'}`;
  const inputWithIconClass = `w-full pl-10 pr-4 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'}`;
  return (
    <div
      className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>

      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-pink-500/10' : 'bg-pink-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-rose-500/10' : 'bg-rose-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`w-full ${step === 4 ? 'max-w-6xl' : 'max-w-2xl'}`}>
          <button
            onClick={goBack}
            className={`flex items-center mb-8 font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.signup.back}
          </button>

          <div
            className={`backdrop-blur-xl border rounded-2xl p-8 shadow-2xl ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scan className="h-8 w-8 text-white" />
              </div>
              <h2
                className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.signup.radiologyTitle}
              </h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {t.signup.radiologySubtitle}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2 sm:gap-4">
                {[
                {
                  num: 1,
                  label: t.signup.stepInformation
                },
                {
                  num: 2,
                  label: t.signup.stepEquipment
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
                    className={`flex flex-col items-center gap-1 ${step >= s.num ? isDark ? 'text-pink-400' : 'text-pink-600' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                      <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      
                        {step > s.num ?
                      <CheckCircle2 className="h-5 w-5" /> :

                      s.num
                      }
                      </div>
                      <span className="text-xs font-medium hidden sm:block">
                        {s.label}
                      </span>
                    </div>
                    {i < 3 &&
                  <div
                    className={`w-8 sm:w-12 h-0.5 ${step > s.num ? 'bg-gradient-to-r from-pink-500 to-rose-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                  }
                  </Fragment>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 &&
              <>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.signup.centerName}
                    </label>
                    <div className="relative">
                      <Building2
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
                      <input
                      type="text"
                      value={formData.centerName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        centerName: e.target.value
                      })
                      }
                      placeholder="Centre Radiologie Moderne"
                      required
                      className={inputWithIconClass} />
                    
                    </div>
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.signup.medicalDirector}
                    </label>
                    <div className="relative">
                      <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
                      <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        managerName: e.target.value
                      })
                      }
                      placeholder="Dr. Fatma Trabelsi"
                      required
                      className={inputWithIconClass} />
                    
                    </div>
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.signup.professionalEmail}
                    </label>
                    <div className="relative">
                      <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
                      <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value
                      })
                      }
                      placeholder="contact@radiologie.tn"
                      required
                      className={inputWithIconClass} />
                    
                    </div>
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.signup.phone}
                    </label>
                    <div className="relative">
                      <Phone
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
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
                      className={inputWithIconClass} />
                    
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                      className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {t.signup.address}
                      </label>
                      <div className="relative">
                        <MapPin
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      
                        <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value
                        })
                        }
                        placeholder="Avenue de la République"
                        required
                        className={inputWithIconClass} />
                      
                      </div>
                    </div>
                    <div>
                      <label
                      className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {t.signup.city}
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
                      className={inputClass} />
                    
                    </div>
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.signup.yearsInOperation}
                    </label>
                    <input
                    type="number"
                    value={formData.yearsInOperation}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsInOperation: e.target.value
                    })
                    }
                    placeholder="10"
                    required
                    className={inputClass} />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.auth.password}
                    </label>
                    <div className="relative">
                      <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
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
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'}`} />
                    
                      <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-pink-400' : 'text-slate-400 hover:text-pink-600'}`}>
                      
                        {showPassword ?
                      <EyeOff className="h-5 w-5" /> :

                      <Eye className="h-5 w-5" />
                      }
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      {t.signup.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    
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
                      className={inputWithIconClass} />
                    
                    </div>
                  </div>
                </>
              }

              {step === 2 &&
              <div>
                  <h3
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {t.signup.selectExams}
                  </h3>
                  <p
                  className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {t.signup.selectAtLeastOneExam}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableEquipment.map((equipment) =>
                  <button
                    key={equipment.id}
                    type="button"
                    onClick={() => toggleEquipment(equipment.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${formData.equipment.includes(equipment.id) ? 'border-pink-500 bg-pink-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{equipment.icon}</span>
                          {formData.equipment.includes(equipment.id) &&
                      <CheckCircle2 className="h-5 w-5 text-pink-500" />
                      }
                        </div>
                        <div
                      className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {equipment.name}
                        </div>
                      </button>
                  )}
                  </div>
                  {formData.equipment.length === 0 &&
                <p className="text-sm text-amber-500 mt-4">
                      ⚠️ {t.signup.selectAtLeastOneExam}
                    </p>
                }
                </div>
              }

              {step === 3 &&
              <div className="space-y-6">
                  <div
                  className={`border rounded-lg p-4 mb-6 ${isDark ? 'bg-pink-500/10 border-pink-500/30' : 'bg-pink-50 border-pink-200'}`}>
                  
                    <p
                    className={`text-sm ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>
                    
                      📋 {t.signup.documentsNotice}
                    </p>
                  </div>

                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      <Award className="inline h-4 w-4 mr-2" />
                      {t.signup.radiologyAccreditation} *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                      type="text"
                      value={formData.license}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        license: e.target.value
                      })
                      }
                      placeholder={t.signup.accreditationNumber}
                      className={inputClass} />
                    
                      <div className="relative">
                        <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAccreditationFile(file);
                            setAccreditationFileName(file.name);
                          }
                        }}
                        className="hidden"
                        id="accreditation-file" />
                      
                        <label
                        htmlFor="accreditation-file"
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 border border-dashed rounded-lg cursor-pointer transition-all ${accreditationFile ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-pink-500 text-slate-400 hover:text-pink-400' : 'border-slate-300 hover:border-pink-500 text-slate-500 hover:text-pink-600'}`}>
                        
                          <Upload className="h-5 w-5" />
                          <span className="text-sm truncate">
                            {accreditationFileName ||
                          t.signup.documentRequired + ' *'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      <Shield className="inline h-4 w-4 mr-2" />
                      {t.signup.radiationSafetyCertificate} *
                    </label>
                    <div className="relative">
                      <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setRadiationSafetyFile(file);
                          setRadiationSafetyFileName(file.name);
                        }
                      }}
                      className="hidden"
                      id="radiation-safety-file" />
                    
                      <label
                      htmlFor="radiation-safety-file"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border border-dashed rounded-lg cursor-pointer transition-all ${radiationSafetyFile ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-pink-500 text-slate-400 hover:text-pink-400' : 'border-slate-300 hover:border-pink-500 text-slate-500 hover:text-pink-600'}`}>
                      
                        <Upload className="h-5 w-5" />
                        <span className="text-sm truncate">
                          {radiationSafetyFileName ||
                        t.signup.uploadDocument + ' *'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                    className={`block text-sm font-medium mb-2 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      <FileText className="inline h-4 w-4 mr-2" />
                      {t.signup.directorDiploma} (optionnel)
                    </label>
                    <div className="relative">
                      <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDirectorCredentials(file);
                          setDirectorCredentialsName(file.name);
                        }
                      }}
                      className="hidden"
                      id="director-credentials-file" />
                    
                      <label
                      htmlFor="director-credentials-file"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border border-dashed rounded-lg cursor-pointer transition-all ${directorCredentials ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-pink-500 text-slate-400 hover:text-pink-400' : 'border-slate-300 hover:border-pink-500 text-slate-500 hover:text-pink-600'}`}>
                      
                        <Upload className="h-5 w-5" />
                        <span className="text-sm truncate">
                          {directorCredentialsName || t.signup.uploadDocument}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label
                      className={`text-sm font-medium uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        <Scan className="inline h-4 w-4 mr-2" />
                        {t.signup.equipmentCertifications} (optionnel)
                      </label>
                      <button
                      type="button"
                      onClick={addEquipmentCertification}
                      className="flex items-center gap-1 px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-lg text-pink-500 text-sm hover:bg-pink-500/30 transition-all">
                      
                        <Plus className="h-4 w-4" />
                        {t.signup.addCertification}
                      </button>
                    </div>
                    {equipmentCertifications.length === 0 &&
                  <div
                    className={`text-center py-4 border border-dashed rounded-lg ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                    
                        <p
                      className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      
                          {t.signup.noEquipmentCertifications}
                        </p>
                      </div>
                  }
                    <div className="space-y-3">
                      {equipmentCertifications.map((cert, index) =>
                    <div
                      key={cert.id}
                      className={`p-4 border rounded-lg ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      
                          <div className="flex items-center justify-between mb-3">
                            <span
                          className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {t.signup.certifications} {index + 1}
                            </span>
                            <button
                          type="button"
                          onClick={() =>
                          removeEquipmentCertification(cert.id)
                          }
                          className="text-red-500 hover:text-red-400">
                          
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                          updateEquipmentCertification(
                            cert.id,
                            'name',
                            e.target.value
                          )
                          }
                          placeholder={t.signup.certificationName}
                          className={`w-full px-3 py-2 border rounded-lg text-sm ${isDark ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-pink-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-pink-500'}`} />
                        
                            <div className="relative">
                              <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                              updateEquipmentCertification(
                                cert.id,
                                'file',
                                file
                              );
                            }}
                            className="hidden"
                            id={`equip-cert-file-${cert.id}`} />
                          
                              <label
                            htmlFor={`equip-cert-file-${cert.id}`}
                            className={`flex items-center justify-center gap-2 w-full px-3 py-2 border border-dashed rounded-lg cursor-pointer text-sm transition-all ${cert.file ? 'border-green-500 bg-green-500/10 text-green-500' : isDark ? 'border-slate-600 hover:border-pink-500 text-slate-400' : 'border-slate-300 hover:border-pink-500 text-slate-500'}`}>
                            
                                <Upload className="h-4 w-4" />
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
                <p className="text-sm text-amber-500">
                      ⚠️ {t.signup.radiationSafetyRequired}
                    </p>
                }
                </div>
              }

              {step === 4 &&
              <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3
                    className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Choisissez votre plan
                    </h3>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      Sélectionnez l'offre qui correspond le mieux à votre
                      activité
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) =>
                  <div
                    key={plan.id}
                    onClick={() =>
                    setFormData({
                      ...formData,
                      subscriptionPlan: plan.id
                    })
                    }
                    className={`relative group cursor-pointer transition-all duration-300 ${formData.subscriptionPlan === plan.id ? `transform scale-105 ring-2 ring-cyan-500 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl shadow-cyan-500/20` : `${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/80 hover:bg-white'} hover:shadow-lg`} border rounded-2xl p-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    
                        {plan.popular &&
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                              <Star className="h-3 w-3 fill-current" />
                              POPULAIRE
                            </div>
                          </div>
                    }

                        {formData.subscriptionPlan === plan.id &&
                    <div className="absolute top-4 right-4">
                            <div className="bg-cyan-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                    }

                        <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 text-white`}>
                      
                          <plan.icon className="h-6 w-6" />
                        </div>

                        <h4
                      className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {plan.name}
                        </h4>
                        <p
                      className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                          {plan.description}
                        </p>

                        <div className="mb-4">
                          <div className="flex items-baseline gap-1">
                            <span
                          className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {plan.price}
                            </span>
                            <span
                          className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                              TND
                            </span>
                          </div>
                          <p
                        className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        
                            /{plan.period}
                          </p>
                        </div>

                        <div
                      className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      
                          <p
                        className={`text-sm font-semibold text-center ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                            Commission: {plan.commission}
                          </p>
                        </div>

                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, idx) =>
                      <li key={idx} className="flex items-start gap-2">
                              <Check
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        
                              <span
                          className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          
                                {feature}
                              </span>
                            </li>
                      )}
                        </ul>

                        <div
                      className={`w-full py-2 rounded-lg text-sm font-bold text-center transition-colors ${formData.subscriptionPlan === plan.id ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-300 group-hover:bg-slate-600' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
                      
                          {formData.subscriptionPlan === plan.id ?
                      'Sélectionné' :
                      'Sélectionner'}
                        </div>
                      </div>
                  )}
                  </div>

                  <div className="flex items-start gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <input
                    type="checkbox"
                    required
                    className={`mt-1 h-4 w-4 text-pink-500 rounded ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                  
                    <label
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {t.signup.acceptTermsAndAuthenticity}
                    </label>
                  </div>
                </div>
              }

              <button
                type="submit"
                disabled={
                step === 2 && formData.equipment.length === 0 ||
                step === 3 && !canProceedStep3() ||
                step === 4 && !canProceedStep4() ||
                isLoading
                }
                className="relative w-full group overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {isLoading ?
                  t.signup.creating :
                  step === 4 ?
                  t.signup.createMyAccount :
                  t.signup.continue}
                </div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
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
    </div>);

}