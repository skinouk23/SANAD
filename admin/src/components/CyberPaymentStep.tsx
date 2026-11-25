import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Lock,
  AlertCircle,
  Shield,
  Check } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { sanitizeHtml } from '../utils/security';
import { validatePhone } from '../utils/input-validation';
import { auditLogger } from '../utils/audit-logger';
interface CyberPaymentStepProps {
  totalPrice: number;
  onPaymentComplete: (method: 'card' | 'd17' | 'cash') => void;
  isSubmitting?: boolean;
  providerName?: string;
  serviceName?: string;
  date?: string;
  time?: string;
}
export function CyberPaymentStep({
  totalPrice,
  onPaymentComplete,
  isSubmitting = false,
  providerName,
  serviceName,
  date,
  time
}: CyberPaymentStepProps) {
  const { t, dir } = useLanguage();
  const { isDark } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'd17' | 'cash' | ''>(
    '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');
  const [d17Phone, setD17Phone] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const canProceed = () => {
    if (paymentMethod === 'card')
    return cardNumber && cardExpiry && cardCVC && cardName;
    if (paymentMethod === 'd17') return d17Phone;
    if (paymentMethod === 'cash') return true;
    return false;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    if (paymentMethod === 'd17') {
      const phoneResult = validatePhone(d17Phone);
      if (!phoneResult.isValid) {
        setPaymentError(phoneResult.error || 'Numéro invalide');
        return;
      }
    }
    if (canProceed() && paymentMethod) {
      auditLogger.log('PAYMENT_INITIATED', `Payment via ${paymentMethod}`, {
        severity: 'info',
        resource: 'payment',
        details: {
          method: paymentMethod,
          amount: totalPrice,
          currency: 'TND'
        }
      });
      onPaymentComplete(paymentMethod);
    }
  };
  const inputCls = `w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  return (
    <div className="space-y-3">
      {/* Summary Card */}
      <div
        className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        
        <h2
          className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          {t.payment.summary}
        </h2>
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            
            <div className="space-y-1.5 text-xs">
              {providerName &&
              <div className="flex justify-between">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.payment.provider}
                  </span>
                  <span
                  className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {providerName}
                  </span>
                </div>
              }
              {serviceName &&
              <div className="flex justify-between">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.payment.service}
                  </span>
                  <span
                  className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {serviceName}
                  </span>
                </div>
              }
              {date &&
              <div className="flex justify-between">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.payment.date}
                  </span>
                  <span
                  className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {date}
                  </span>
                </div>
              }
              {time &&
              <div className="flex justify-between">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.payment.time}
                  </span>
                  <span
                  className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {time}
                  </span>
                </div>
              }
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${isDark ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'}`}>
            
            <div className="flex justify-between items-center">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.payment.total}
              </span>
              <span
                className={`text-xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {totalPrice} DT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div
        className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        
        <h2
          className={`text-base font-bold mb-3 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          <Lock
            className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          
          {t.payment.securePayment}
        </h2>

        <div
          className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
          
          <div className="flex items-start gap-2">
            <AlertCircle
              className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            
            <div
              className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              
              <p className="font-semibold mb-0.5">{t.payment.escrowNotice}</p>
              <p className={isDark ? 'text-amber-300/80' : 'text-amber-700'}>
                {t.payment.escrowDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 rounded-lg border-2 transition-all text-left relative overflow-hidden ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
            
            {paymentMethod === 'card' &&
            <div className="absolute top-1.5 right-1.5 text-cyan-500">
                <Check className="h-3.5 w-3.5" />
              </div>
            }
            <div className="flex flex-col items-center text-center gap-2">
              <CreditCard
                className={`h-6 w-6 ${paymentMethod === 'card' ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              
              <div>
                <h3
                  className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.payment.bankCard}
                </h3>
                <p
                  className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                  {t.payment.bankCardDesc}
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('d17')}
            className={`p-3 rounded-lg border-2 transition-all text-left relative overflow-hidden ${paymentMethod === 'd17' ? 'border-purple-500 bg-purple-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
            
            {paymentMethod === 'd17' &&
            <div className="absolute top-1.5 right-1.5 text-purple-500">
                <Check className="h-3.5 w-3.5" />
              </div>
            }
            <div className="flex flex-col items-center text-center gap-2">
              <Smartphone
                className={`h-6 w-6 ${paymentMethod === 'd17' ? isDark ? 'text-purple-400' : 'text-purple-600' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              
              <div>
                <h3
                  className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.payment.d17Sobflous}
                </h3>
                <p
                  className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                  {t.payment.d17SobflousDesc}
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`p-3 rounded-lg border-2 transition-all text-left relative overflow-hidden ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
            
            {paymentMethod === 'cash' &&
            <div className="absolute top-1.5 right-1.5 text-emerald-500">
                <Check className="h-3.5 w-3.5" />
              </div>
            }
            <div className="flex flex-col items-center text-center gap-2">
              <Banknote
                className={`h-6 w-6 ${paymentMethod === 'cash' ? isDark ? 'text-emerald-400' : 'text-emerald-600' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              
              <div>
                <h3
                  className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.payment.cash}
                </h3>
                <p
                  className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                  {t.payment.cashDesc}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Card Form */}
        {paymentMethod === 'card' &&
        <div className="space-y-3 animate-fadeIn">
            <div>
              <label
              className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {t.payment.cardNumber}
              </label>
              <input
              type="text"
              value={cardNumber}
              onChange={(e) =>
              setCardNumber(
                sanitizeHtml(e.target.value.replace(/[^0-9\s]/g, ''))
              )
              }
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className={inputCls} />
            
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.payment.expiryDate}
                </label>
                <input
                type="text"
                value={cardExpiry}
                onChange={(e) =>
                setCardExpiry(
                  sanitizeHtml(e.target.value.replace(/[^0-9/]/g, ''))
                )
                }
                placeholder="MM/YY"
                maxLength={5}
                className={inputCls} />
              
              </div>
              <div>
                <label
                className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.payment.cvv}
                </label>
                <input
                type="text"
                value={cardCVC}
                onChange={(e) =>
                setCardCVC(
                  sanitizeHtml(e.target.value.replace(/[^0-9]/g, ''))
                )
                }
                placeholder="123"
                maxLength={4}
                className={inputCls} />
              
              </div>
            </div>
            <div>
              <label
              className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {t.payment.cardHolder}
              </label>
              <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(sanitizeHtml(e.target.value))}
              placeholder="Nom complet"
              className={inputCls} />
            
            </div>
          </div>
        }

        {/* D17 Form */}
        {paymentMethod === 'd17' &&
        <div className="space-y-3 animate-fadeIn">
            <div>
              <label
              className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {t.payment.phoneNumber}
              </label>
              <input
              type="tel"
              value={d17Phone}
              onChange={(e) => {
                setD17Phone(e.target.value);
                setPaymentError('');
              }}
              placeholder="+216 XX XXX XXX"
              className={`${inputCls} ${paymentError ? '!border-red-500' : ''}`} />
            
            </div>
            {paymentError &&
          <p className="text-red-500 text-[10px]">{paymentError}</p>
          }
            <p
            className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
              Vous recevrez une notification sur votre application D17 pour
              valider le paiement.
            </p>
          </div>
        }

        {/* Cash Info */}
        {paymentMethod === 'cash' &&
        <div
          className={`p-3 rounded-lg border animate-fadeIn ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
          
            <p
            className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            
              Vous paierez en espèces directement au professionnel lors de la
              prestation.
            </p>
          </div>
        }

        <div
          className={`mt-4 pt-4 border-t flex items-center gap-1.5 text-[10px] ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          
          <Shield className="h-3.5 w-3.5" />
          {t.payment.securePaymentNotice}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canProceed() || isSubmitting}
        className="w-full px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/20">
        
        {isSubmitting ?
        'Traitement...' :
        paymentMethod === 'cash' ?
        t.payment.confirm :
        t.payment.pay}
      </button>
    </div>);

}