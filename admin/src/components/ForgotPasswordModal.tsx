import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Mail,
  KeyRound,
  CheckCircle,
  ArrowLeft,
  RefreshCw } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { validateEmail } from '../utils/input-validation';
import { maskEmail, sanitizeHtml } from '../utils/security';
type Step = 'email' | 'code' | 'newPassword' | 'success';
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function ForgotPasswordModal({
  isOpen,
  onClose
}: ForgotPasswordModalProps) {
  const { isDark } = useTheme();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Timer for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'code' && resendTimer > 0) {
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
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setEmail('');
      setEmailError('');
      setCode(['', '', '', '', '', '']);
      setCodeError('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setResendTimer(60);
      setCanResend(false);
    }
  }, [isOpen]);
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Email invalide');
      return;
    }
    setEmailError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
      setResendTimer(60);
      setCanResend(false);
    }, 1000);
  };
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      codeInputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value.replace(/\D/g, '');
      setCode(newCode);
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
    }
    setCodeError('');
  };
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setCodeError('Veuillez entrer le code complet à 6 chiffres');
      return;
    }
    setCodeError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('newPassword');
    }, 1000);
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    setPasswordError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1000);
  };
  const handleResendCode = () => {
    if (!canResend) return;
    setResendTimer(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    // In real app, trigger resend API
  };
  const handleBack = () => {
    if (step === 'code') {
      setStep('email');
      setCode(['', '', '', '', '', '']);
      setCodeError('');
    } else if (step === 'newPassword') {
      setStep('code');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
          
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
              
              {step === 'success' ?
              <CheckCircle
                className={`h-8 w-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} /> :

              step === 'code' ?
              <KeyRound
                className={`h-8 w-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} /> :


              <Mail
                className={`h-8 w-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />

              }
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {step === 'success' ?
              'Mot de passe réinitialisé' :
              step === 'newPassword' ?
              'Nouveau mot de passe' :
              step === 'code' ?
              'Code de vérification' :
              'Mot de passe oublié'}
            </h2>
            <p
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {step === 'success' ?
              'Votre mot de passe a été réinitialisé avec succès' :
              step === 'newPassword' ?
              'Choisissez un nouveau mot de passe sécurisé' :
              step === 'code' ?
              `Code envoyé à ${maskEmail(email)}` :
              'Entrez votre email pour recevoir un code de réinitialisation'}
            </p>
          </div>

          {/* Back button for code and newPassword steps */}
          {(step === 'code' || step === 'newPassword') &&
          <button
            onClick={handleBack}
            className={`flex items-center mb-4 text-sm font-medium transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>
          }

          {/* Email Step */}
          {step === 'email' &&
          <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Adresse email
                </label>
                <div className="relative">
                  <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                  <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(sanitizeHtml(e.target.value));
                    setEmailError('');
                  }}
                  placeholder="votre@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all ${emailError ? 'border-red-500' : isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
                </div>
                {emailError &&
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
              }
              </div>

              <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
              
                {isLoading ? 'Envoi...' : 'Envoyer le code'}
              </button>
            </form>
          }

          {/* Code Step */}
          {step === 'code' &&
          <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label
                className={`block text-sm font-medium mb-4 text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Entrez le code à 6 chiffres
                </label>
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) =>
                <input
                  key={index}
                  ref={(el) => codeInputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'} ${codeError ? 'border-red-500' : ''}`} />

                )}
                </div>
                {codeError &&
              <p className="text-red-500 text-sm text-center mt-2">
                    {codeError}
                  </p>
              }
              </div>

              <div className="text-center">
                <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Code non reçu ?{' '}
                  {canResend ?
                <button
                  type="button"
                  onClick={handleResendCode}
                  className={`font-semibold inline-flex items-center gap-1 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                  
                      <RefreshCw className="h-3 w-3" />
                      Renvoyer
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
              disabled={isLoading || code.join('').length !== 6}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
              
                {isLoading ? 'Vérification...' : 'Vérifier le code'}
              </button>
            </form>
          }

          {/* New Password Step */}
          {step === 'newPassword' &&
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Nouveau mot de passe
                </label>
                <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg transition-all ${passwordError ? 'border-red-500' : isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Confirmer le mot de passe
                </label>
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg transition-all ${passwordError ? 'border-red-500' : isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
              
                {passwordError &&
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              }
              </div>

              <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
              
                {isLoading ?
              'Réinitialisation...' :
              'Réinitialiser le mot de passe'}
              </button>
            </form>
          }

          {/* Success Step */}
          {step === 'success' &&
          <div className="text-center space-y-4">
              <p
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
                Vous pouvez maintenant vous connecter avec votre nouveau mot de
                passe
              </p>
              <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:scale-[1.02] transition-transform">
              
                Retour à la connexion
              </button>
            </div>
          }
        </div>
      </div>
    </div>);

}