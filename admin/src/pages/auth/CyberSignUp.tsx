import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  CheckCircle,
  Shield } from
'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  getPasswordStrength } from
'../../utils/input-validation';
import { sanitizeHtml } from '../../utils/security';
import { auditLogger } from '../../utils/audit-logger';
import { consentManager } from '../../utils/consent-manager';
export function CyberSignUp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'patient';
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const firstNameResult = validateName(formData.firstName, 'Prénom');
    if (!firstNameResult.isValid) newErrors.firstName = firstNameResult.error!;
    const lastNameResult = validateName(formData.lastName, 'Nom');
    if (!lastNameResult.isValid) newErrors.lastName = lastNameResult.error!;
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) newErrors.email = emailResult.error!;
    const phoneResult = validatePhone(formData.phone);
    if (!phoneResult.isValid) newErrors.phone = phoneResult.error!;
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) newErrors.password = passwordResult.error!;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!formData.city) {
      newErrors.city = 'Veuillez sélectionner une ville';
    }
    if (!termsAccepted) {
      newErrors.terms = 'Vous devez accepter les conditions';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      auditLogger.log('AUTH_LOGIN_FAILURE', 'Signup validation failed', {
        severity: 'info',
        details: {
          errorFields: Object.keys(newErrors)
        }
      });
      return;
    }
    consentManager.grantConsent('essential', 'explicit');
    consentManager.grantConsent('health_data', 'explicit');
    auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Signup form submitted', {
      severity: 'info',
      details: {
        userType,
        city: formData.city
      }
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      auditLogger.log('AUTH_LOGIN_SUCCESS', 'Account created successfully', {
        severity: 'info'
      });
      if (userType === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/provider-dashboard');
      }
    }, 1500);
  };
  const handlePasswordChange = (value: string) => {
    setFormData({
      ...formData,
      password: value
    });
    setPasswordStrength(getPasswordStrength(value));
    if (errors.password)
    setErrors({
      ...errors,
      password: ''
    });
  };
  const config = {
    patient: {
      title: t.signup.createPatientAccount,
      subtitle: t.signup.accessBestCare,
      gradient: 'from-cyan-500 to-blue-500',
      icon: '👤'
    },
    professional: {
      title: t.signup.createProfessionalAccount,
      subtitle: t.signup.growYourBusiness,
      gradient: 'from-blue-500 to-purple-500',
      icon: '💼'
    }
  };
  const currentConfig =
  config[userType as keyof typeof config] || config.patient;
  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>

      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`} />
      
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse`} />
      
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000`} />
      

      <div className="relative z-10 w-full max-w-xl px-4 py-4">
        <button
          onClick={() => navigate('/auth/onboarding')}
          className={`flex items-center mb-3 text-sm font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
          
          <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          {t.common.back}
        </button>

        {/* WOW EFFECT: Animated Gradient Border Wrapper */}
        <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-2xl">
          <div
            className={`absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,${userType === 'professional' ? '#8b5cf6' : '#06b6d4'}_100%)]`} />
          

          <div
            className={`relative rounded-[18px] p-5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
            
            {/* Header */}
            <div className="text-center mb-5">
              <div className="relative w-14 h-14 mx-auto mb-3">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentConfig.gradient} rounded-xl blur-md opacity-40 animate-pulse`} />
                
                <div
                  className={`relative w-14 h-14 bg-gradient-to-br ${currentConfig.gradient} rounded-xl flex items-center justify-center`}>
                  
                  <span className="text-2xl">{currentConfig.icon}</span>
                </div>
              </div>
              <p
                className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.signup.registration}
              </p>
              <h2
                className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {currentConfig.title}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Row 1: Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                    {t.signup.firstName}
                  </label>
                  <div className="relative group">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                    
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          firstName: sanitizeHtml(e.target.value)
                        });
                        if (errors.firstName)
                        setErrors({
                          ...errors,
                          firstName: ''
                        });
                      }}
                      placeholder="Jean"
                      required
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${errors.firstName ? 'border-red-500' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                    
                  </div>
                  {errors.firstName &&
                  <p className="text-red-500 text-[10px] mt-1">
                      {errors.firstName}
                    </p>
                  }
                </div>

                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                    {t.signup.lastName}
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        lastName: sanitizeHtml(e.target.value)
                      });
                      if (errors.lastName)
                      setErrors({
                        ...errors,
                        lastName: ''
                      });
                    }}
                    placeholder="Dupont"
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-all ${errors.lastName ? 'border-red-500' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                  
                  {errors.lastName &&
                  <p className="text-red-500 text-[10px] mt-1">
                      {errors.lastName}
                    </p>
                  }
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                    {t.auth.email}
                  </label>
                  <div className="relative group">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                    
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          email: sanitizeHtml(e.target.value)
                        });
                        if (errors.email)
                        setErrors({
                          ...errors,
                          email: ''
                        });
                      }}
                      placeholder="votre@email.com"
                      required
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${errors.email ? 'border-red-500' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                    
                  </div>
                  {errors.email &&
                  <p className="text-red-500 text-[10px] mt-1">
                      {errors.email}
                    </p>
                  }
                </div>

                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                    {t.signup.phone}
                  </label>
                  <div className="relative group">
                    <Phone
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                    
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          phone: e.target.value
                        });
                        if (errors.phone)
                        setErrors({
                          ...errors,
                          phone: ''
                        });
                      }}
                      placeholder="+216 XX XXX XXX"
                      required
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${errors.phone ? 'border-red-500' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                    
                  </div>
                  {errors.phone &&
                  <p className="text-red-500 text-[10px] mt-1">
                      {errors.phone}
                    </p>
                  }
                </div>
              </div>

              {/* Row 3: Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                    {t.auth.password}
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                    
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg transition-all ${errors.password ? 'border-red-500' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                    
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
                  {errors.password &&
                  <p className="text-red-500 text-[10px] mt-1">
                      {errors.password}
                    </p>
                  }
                  {formData.password &&
                  <div className="mt-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) =>
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.score ? passwordStrength.score <= 1 ? 'bg-red-500' : passwordStrength.score === 2 ? 'bg-yellow-500' : passwordStrength.score === 3 ? 'bg-green-500' : 'bg-emerald-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                      )}
                      </div>
                    </div>
                  }
                </div>

                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    
                    {t.signup.confirmPassword}
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                    
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value
                        });
                        if (errors.confirmPassword)
                        setErrors({
                          ...errors,
                          confirmPassword: ''
                        });
                      }}
                      placeholder="••••••••"
                      required
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all ${errors.confirmPassword ? 'border-red-500' : isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`} />
                    
                  </div>
                  {errors.confirmPassword &&
                  <p className="text-red-500 text-[10px] mt-1">
                      {errors.confirmPassword}
                    </p>
                  }
                </div>
              </div>

              {/* Row 4: City */}
              <div>
                <label
                  className={`block text-[10px] font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                  {t.signup.city}
                </label>
                <div className="relative group">
                  <MapPin
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
                  
                  <select
                    value={formData.city}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value
                    })
                    }
                    required
                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all appearance-none ${isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'}`}>
                    
                    <option value="">{t.signup.selectCity}</option>
                    <option value="tunis">Tunis</option>
                    <option value="sfax">Sfax</option>
                    <option value="sousse">Sousse</option>
                    <option value="ariana">Ariana</option>
                    <option value="ben-arous">Ben Arous</option>
                  </select>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms)
                    setErrors({
                      ...errors,
                      terms: ''
                    });
                  }}
                  required
                  className={`mt-0.5 w-3.5 h-3.5 rounded text-cyan-500 focus:ring-cyan-500 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`} />
                
                <div>
                  <label
                    className={`text-[11px] leading-tight block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    {t.signup.acceptTerms}{' '}
                    <a
                      href="#"
                      className={`underline ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                      
                      {t.signup.termsOfUse}
                    </a>{' '}
                    {t.signup.and}{' '}
                    <a
                      href="#"
                      className={`underline ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                      
                      {t.signup.privacyPolicy}
                    </a>
                  </label>
                  {errors.terms &&
                  <p className="text-red-500 text-[10px] mt-0.5">
                      {errors.terms}
                    </p>
                  }
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group/btn overflow-hidden mt-2">
                
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${currentConfig.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity blur-md`} />
                
                <div
                  className={`relative w-full py-2.5 bg-gradient-to-r ${currentConfig.gradient} rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 group-hover/btn:scale-[1.02] transition-transform`}>
                  
                  {isLoading ?
                  <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{' '}
                      {t.signup.creating}
                    </> :

                  <>
                      <CheckCircle className="h-4 w-4" />{' '}
                      {t.signup.createMyAccount}
                    </>
                  }
                </div>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {t.signup.alreadyHaveAccount}{' '}
                <button
                  onClick={() => navigate('/auth/login')}
                  className={`font-semibold underline transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                  {t.auth.signIn}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div
          className={`mt-4 flex items-center justify-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          
          <Shield
            className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          
          <span>{t.signup.secureRegistration}</span>
        </div>
      </div>
    </div>);

}