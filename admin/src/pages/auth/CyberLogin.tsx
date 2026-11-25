import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Briefcase,
  Shield,
  Activity,
  KeyRound,
  RefreshCw,
  CheckCircle } from
'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { ComplianceBadges } from '../../components/ComplianceBadges';
import { ForgotPasswordModal } from '../../components/ForgotPasswordModal';
import { validateEmail } from '../../utils/input-validation';
import { maskEmail, sanitizeHtml, checkRateLimit } from '../../utils/security';
import { auditLogger } from '../../utils/audit-logger';
const SANAD_LOGO_URL = "/logosanad.png";

type AccountType = 'patient' | 'professional';
type Step = 'select' | 'login' | 'mfa';
export function CyberLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const searchParams = new URLSearchParams(location.search);
  const urlType = searchParams.get('type');
  const [step, setStep] = useState<Step>(
    urlType === 'professional' ? 'select' : 'select'
  );
  const [accountType, setAccountType] = useState<AccountType>(
    urlType === 'professional' ? 'professional' : 'patient'
  );
  const [selectedService, setSelectedService] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // MFA state
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [mfaError, setMfaError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [emailError, setEmailError] = useState('');
  const mfaInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const returnTo = (location.state as any)?.returnTo;
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // Timer for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'mfa' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);
  const services = [
  {
    id: 'nursing',
    name: t.services.nursing,
    icon: '💉',
    color: 'cyan'
  },
  {
    id: 'elderly',
    name: t.services.elderly,
    icon: '👴',
    color: 'purple'
  },
  {
    id: 'physio',
    name: t.services.physio,
    icon: '🏃',
    color: 'blue'
  },
  {
    id: 'maternity',
    name: t.services.maternityService,
    icon: '👶',
    color: 'pink'
  },
  {
    id: 'night',
    name: t.services.nightGuard,
    icon: '🌙',
    color: 'indigo'
  },
  {
    id: 'doctor',
    name: t.services.doctorHome,
    icon: '🩺',
    color: 'teal'
  },
  {
    id: 'psychology',
    name: t.services.psychology,
    icon: '🧠',
    color: 'violet'
  },
  {
    id: 'nutrition',
    name: t.services.nutrition,
    icon: '🥗',
    color: 'green'
  },
  {
    id: 'laboratory',
    name: t.services.laboratory,
    icon: '🔬',
    color: 'indigo'
  },
  {
    id: 'radiology',
    name: t.services.radiology,
    icon: '🔬',
    color: 'pink'
  },
  {
    id: 'equipment',
    name: t.nav.equipment,
    icon: '🏥',
    color: 'purple'
  },
  {
    id: 'babysitting',
    name: t.services.babysitting,
    icon: '🧒',
    color: 'amber'
  },
  {
    id: 'ambulance',
    name: t.services.ambulance,
    icon: '🚑',
    color: 'red'
  },
  {
    id: 'veterinary',
    name: 'Vétérinaire',
    icon: '🐾',
    color: 'orange'
  },
  {
    id: 'checkup',
    name: 'Bilan Santé',
    icon: '🩺',
    color: 'green'
  },
  {
    id: 'chronic-care',
    name: 'Soins Chroniques',
    icon: '💊',
    color: 'purple'
  },
  {
    id: 'medical-companion',
    name: 'Accompagnement',
    icon: '🤝',
    color: 'teal'
  },
  {
    id: 'pharmacy',
    name: 'Pharmacie',
    icon: '💊',
    color: 'emerald'
  },
  {
    id: 'gym',
    name: 'Salles de Sport',
    icon: '🏋️',
    color: 'orange'
  },
  {
    id: 'funeral',
    name: 'Services Funéraires',
    icon: '🕊️',
    color: 'slate'
  }];

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    if (type === 'patient') {
      setSelectedService('');
      setStep('login');
    }
  };
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setAccountType('professional');
    setStep('login');
  };
  const handleBack = () => {
    if (step === 'mfa') {
      setStep('login');
      setMfaCode(['', '', '', '', '', '']);
      setMfaError('');
    } else if (
    step === 'login' && (
    accountType === 'professional' || urlType === 'professional'))
    {
      setStep('select');
      setEmail('');
      setPassword('');
      setSelectedService('');
    } else if (step === 'login') {
      setStep('select');
      setEmail('');
      setPassword('');
    } else {
      navigate('/auth/onboarding');
    }
  };
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Email invalide');
      return;
    }
    setEmailError('');
    if (!checkRateLimit('login_submit', 5, 60000)) {
      setEmailError('Trop de tentatives. Veuillez patienter.');
      auditLogger.log('SECURITY_RATE_LIMITED', 'Login form rate limited', {
        severity: 'warning'
      });
      return;
    }
    auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Login form submitted', {
      severity: 'info',
      details: {
        accountType,
        hasService: !!selectedService
      }
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      auditLogger.log('AUTH_MFA_SENT', 'MFA code sent to email', {
        severity: 'info',
        details: {
          maskedEmail: maskEmail(email)
        }
      });
      setStep('mfa');
      setResendTimer(60);
      setCanResend(false);
    }, 1000);
  };
  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...mfaCode];
      digits.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setMfaCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      mfaInputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...mfaCode];
      newCode[index] = value.replace(/\D/g, '');
      setMfaCode(newCode);
      if (value && index < 5) {
        mfaInputRefs.current[index + 1]?.focus();
      }
    }
    setMfaError('');
  };
  const handleMfaKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) {
      mfaInputRefs.current[index - 1]?.focus();
    }
  };
  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = mfaCode.join('');
    if (code.length !== 6) {
      setMfaError('Veuillez entrer le code complet à 6 chiffres');
      auditLogger.log('AUTH_MFA_FAILED', 'Incomplete MFA code', {
        severity: 'warning'
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      auditLogger.log('AUTH_MFA_VERIFIED', 'MFA verification successful', {
        severity: 'info'
      });
      login(email, password, selectedService);
      if (email === 'admin@gmail.com' && password === 'admin') {
        navigate('/admin/dashboard');
      } else if (returnTo) {
        navigate(returnTo);
      } else if (accountType === 'professional') {
        navigate('/provider-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }, 1500);
  };
  const handleResendCode = () => {
    if (!canResend) return;
    setResendTimer(60);
    setCanResend(false);
    setMfaCode(['', '', '', '', '', '']);
  };
  const getSelectedServiceInfo = () =>
  services.find((s) => s.id === selectedService);
  const getMaskedEmail = () => maskEmail(email);
  const handleGoogleLogin = () => {
    auditLogger.log('AUTH_OAUTH_ATTEMPT', 'Google OAuth login initiated', {
      severity: 'info',
      details: {
        provider: 'google'
      }
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('google-user@gmail.com', 'google-oauth', selectedService);
      if (accountType === 'professional') {
        navigate('/provider-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }, 1500);
  };
  const handleFacebookLogin = () => {
    auditLogger.log('AUTH_OAUTH_ATTEMPT', 'Facebook OAuth login initiated', {
      severity: 'info',
      details: {
        provider: 'facebook'
      }
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('facebook-user@facebook.com', 'facebook-oauth', selectedService);
      if (accountType === 'professional') {
        navigate('/provider-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }, 1500);
  };
  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>

      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]`} />
      
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse`} />
      
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000`} />
      

      <div className="relative z-10 w-full max-w-xl px-4 py-4">
        {(step === 'login' || step === 'mfa') &&
        <button
          onClick={handleBack}
          className={`flex items-center mb-3 text-sm font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
          
            <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            {step === 'mfa' ? 'Retour' : t.auth.change}
          </button>
        }

        {/* WOW EFFECT: Animated Gradient Border Wrapper */}
        <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-2xl">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

          <div
            className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
            
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className={`relative mx-auto mb-3 ${language === 'ar' ? 'w-20 h-14' : 'w-24 h-12'}`}>
                
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 blur-md opacity-40 animate-pulse rounded-xl`} />
                
                <div
                  className={`relative h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center rounded-xl px-3 py-1.5 gap-1.5`}>
                  
                  <img
                    src={SANAD_LOGO_URL}
                    alt="Sanad Logo"
                    className="object-contain h-8 w-auto" />
                  
                  <span className="font-bold text-white text-base">
                    {t.common.brandName || 'Sanad'}
                  </span>
                </div>
              </div>

              <h2
                className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {step === 'select' ?
                urlType === 'professional' ?
                t.services.title :
                t.auth.selectProfile :
                step === 'login' ?
                t.auth.secureLogin :
                'Vérification'}
              </h2>
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {step === 'select' ?
                urlType === 'professional' ?
                t.services.subtitle :
                t.auth.selectProfile :
                step === 'login' ?
                accountType === 'patient' ?
                t.auth.accessHealthServices :
                `Espace ${getSelectedServiceInfo()?.name || t.auth.professional}` :
                `Code envoyé à ${getMaskedEmail()}`}
              </p>
            </div>

            {/* Step 1: Account Type Selection */}
            {step === 'select' &&
            <div className="space-y-3">
                <button
                onClick={() => handleAccountTypeSelect('patient')}
                className="w-full group relative overflow-hidden">
                
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                  className={`relative border-2 rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500' : 'bg-slate-50 border-slate-200 group-hover:border-cyan-500'}`}>
                  
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3
                        className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {t.auth.patient}
                        </h3>
                        <p
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          {t.auth.accessHealthServices}
                        </p>
                      </div>
                      <ArrowLeft
                      className={`h-5 w-5 rotate-180 group-hover:translate-x-1 transition-all ${isDark ? 'text-slate-600 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-cyan-600'}`} />
                    
                    </div>
                  </div>
                </button>

                <div
                className={`border-2 rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3
                      className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {t.auth.professional}
                      </h3>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                        {t.auth.selectSpecialty}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                    {services.map((service) =>
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className="group relative overflow-hidden rounded-lg">
                    
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all" />
                        <div
                      className={`relative border rounded-lg p-2.5 flex flex-col items-center text-center transition-all h-full ${isDark ? 'bg-slate-900/50 border-slate-700 group-hover:border-cyan-500' : 'bg-white border-slate-200 group-hover:border-cyan-500'}`}>
                      
                          <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                            {service.icon}
                          </span>
                          <span
                        className={`text-[10px] font-medium leading-tight ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        
                            {service.name}
                          </span>
                        </div>
                      </button>
                  )}
                  </div>
                </div>
              </div>
            }

            {/* Step 2: Login Form */}
            {step === 'login' &&
            <form onSubmit={handleLoginSubmit} className="space-y-3">
                {accountType === 'professional' && selectedService &&
              <div
                className={`border rounded-xl p-3 flex items-center gap-3 ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-lg">
                      {getSelectedServiceInfo()?.icon}
                    </div>
                    <div className="flex-1">
                      <p
                    className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                        {t.auth.loginAs}
                      </p>
                      <p
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {getSelectedServiceInfo()?.name}
                      </p>
                    </div>
                    <button
                  type="button"
                  onClick={() => setStep('select')}
                  className={`text-xs font-semibold ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                      {t.auth.change}
                    </button>
                  </div>
              }

                {accountType === 'patient' &&
              <div
                className={`border rounded-xl p-3 flex items-center gap-3 ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p
                    className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                        {t.auth.loginAs}
                      </p>
                      <p
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {t.auth.patient}
                      </p>
                    </div>
                    <button
                  type="button"
                  onClick={() => setStep('select')}
                  className={`text-xs font-semibold ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                      {t.auth.change}
                    </button>
                  </div>
              }

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    {t.auth.email}
                  </label>
                  <div className="relative group">
                    <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                  
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(sanitizeHtml(e.target.value));
                      setEmailError('');
                    }}
                    placeholder="votre@email.com"
                    required
                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${emailError ? 'border-red-500 focus:ring-red-500/20' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                  
                  </div>
                  {emailError &&
                <p className="text-red-500 text-[10px] mt-1">
                      {emailError}
                    </p>
                }
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    {t.auth.password}
                  </label>
                  <div className="relative group">
                    <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                  
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                  
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-400 hover:text-cyan-600'}`}>
                    
                      {showPassword ?
                    <EyeOff className="h-4 w-4" /> :

                    <Eye className="h-4 w-4" />
                    }
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center group cursor-pointer">
                    <input
                    type="checkbox"
                    className={`w-3.5 h-3.5 border rounded focus:ring-cyan-500 ${isDark ? 'bg-slate-800 border-slate-700 text-cyan-500' : 'bg-white border-slate-300 text-cyan-500'}`} />
                  
                    <span
                    className={`ml-2 text-xs transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    
                      {t.auth.rememberMe}
                    </span>
                  </label>
                  <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className={`text-xs font-semibold transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                    {t.auth.forgotPassword}
                  </button>
                </div>

                <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group overflow-hidden mt-2">
                
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                  <div className="relative w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                    {isLoading ?
                  <>
                        <Activity className="h-4 w-4 animate-spin" />{' '}
                        {t.common.loading}
                      </> :

                  <>
                        <Shield className="h-4 w-4" /> Continuer
                      </>
                  }
                  </div>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div
                    className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />
                  
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span
                    className={`px-3 ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-500'}`}>
                    
                      {t.auth.orContinueWith}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-all group ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500' : 'bg-white border-slate-200 hover:border-cyan-500'} disabled:opacity-50`}>
                  
                    <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-4 h-4" />
                  
                    <span
                    className={`text-xs font-medium ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    
                      Google
                    </span>
                  </button>
                  <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-all group ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500' : 'bg-white border-slate-200 hover:border-cyan-500'} disabled:opacity-50`}>
                  
                    <img
                    src="https://www.facebook.com/favicon.ico"
                    alt="Facebook"
                    className="w-4 h-4" />
                  
                    <span
                    className={`text-xs font-medium ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    
                      Facebook
                    </span>
                  </button>
                </div>
              </form>
            }

            {/* Step 3: MFA Verification */}
            {step === 'mfa' &&
            <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div
                className={`border rounded-xl p-3 flex items-center gap-3 ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p
                    className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                      Authentification à deux facteurs
                    </p>
                    <p
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      Vérification par code
                    </p>
                  </div>
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-3 text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                    Entrez le code à 6 chiffres envoyé à votre email
                  </label>
                  <div className="flex justify-center gap-2">
                    {mfaCode.map((digit, index) =>
                  <input
                    key={index}
                    ref={(el) => mfaInputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleMfaChange(index, e.target.value)}
                    onKeyDown={(e) => handleMfaKeyDown(index, e)}
                    className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold border-2 rounded-lg transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'} ${mfaError ? 'border-red-500' : ''}`} />

                  )}
                  </div>
                  {mfaError &&
                <p className="text-red-500 text-xs text-center mt-2">
                      {mfaError}
                    </p>
                }
                </div>

                <div className="text-center">
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Vous n'avez pas reçu le code ?{' '}
                    {canResend ?
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className={`font-semibold inline-flex items-center gap-1 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                    
                        <RefreshCw className="h-3 w-3" /> Renvoyer
                      </button> :

                  <span
                    className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    
                        Renvoyer dans {resendTimer}s
                      </span>
                  }
                  </p>
                </div>

                <button
                type="submit"
                disabled={isLoading || mfaCode.join('').length !== 6}
                className="relative w-full group overflow-hidden">
                
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                  <div className="relative w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ?
                  <>
                        <Activity className="h-4 w-4 animate-spin" />{' '}
                        {t.common.loading}
                      </> :

                  <>
                        <CheckCircle className="h-4 w-4" /> Vérifier
                      </>
                  }
                  </div>
                </button>

                <div
                className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                
                  <p
                  className={`text-[10px] text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    💡 Pour la démo, entrez n'importe quel code à 6 chiffres
                    (ex: 123456)
                  </p>
                </div>
              </form>
            }

            {/* Sign Up Link */}
            <div className="mt-5 text-center">
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {t.auth.noAccount}{' '}
                <button
                  onClick={() => navigate('/auth/onboarding')}
                  className={`font-semibold underline transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                  {t.auth.signUp}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 flex flex-col items-center justify-center gap-3 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          
          <div className="flex items-center gap-1.5">
            <Shield
              className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            <span>{t.auth.sslSecure}</span>
          </div>
          <div className="scale-90 origin-top">
            <ComplianceBadges />
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)} />
      

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>);

}