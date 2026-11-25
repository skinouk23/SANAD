import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, Banknote, Check, CreditCard, Lock, Shield, Smartphone } from 'lucide-react';

import { BookingNeutralPanel, BookingSelectableCard } from './BookingSelectionCards';
import { APP_FEATURE_CODES, useAppFeatures } from '@/features/app-features';
import {
  bookingCyanActionButtonClassName,
  bookingPaymentOptionDisabledClassName,
  bookingSelectableCardIconClassName,
  bookingSelectableCardNeutralIconClassName,
  bookingSelectableCardSelectedIconClassName,
} from '@/features/bookings/flow/BookingFlowUi';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { cn } from '@/shared/lib/utils';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';
import { auditLogger } from '@/utils/audit-logger';
import { createDefaultTunisiaPhoneValue, validatePhone } from '@/utils/input-validation';
import type { BookingPaymentMethod } from '@/features/bookings/schema';

interface PaymentStepProps {
  totalPrice?: number;
  /** Alias for totalPrice - used by some booking pages. */
  amount?: number;
  onPaymentComplete: (method: BookingPaymentMethod) => void;
  isSubmitting?: boolean;
  providerName?: string;
  serviceName?: string;
  date?: string;
  time?: string;
  /** Optional back handler used by some booking flows. */
  onBack?: () => void;
  cashAvailable?: boolean;
  paymentSummary?: ReactNode;
  className?: string;
  panelClassName?: string;
  noticeClassName?: string;
  optionClassName?: string;
  optionSelectedClassName?: string;
  actionClassName?: string;
}

export function PaymentStep({
  totalPrice: totalPriceProp,
  amount,
  onPaymentComplete,
  paymentSummary,
  className,
  isSubmitting = false,
  cashAvailable = true,
  panelClassName,
  noticeClassName,
  optionClassName,
  optionSelectedClassName,
  actionClassName,
}: PaymentStepProps) {
  const totalPrice = totalPriceProp ?? amount ?? 0;
  const { t } = useLanguage();
  const { isFeatureActive } = useAppFeatures();
  const [paymentMethod, setPaymentMethod] = useState<BookingPaymentMethod | ''>('');
  const [d17Phone, setD17Phone] = useState(createDefaultTunisiaPhoneValue);
  const [paymentError, setPaymentError] = useState('');
  const cardPaymentEnabled = isFeatureActive(APP_FEATURE_CODES.bookingPaymentCard);
  const d17PaymentEnabled = isFeatureActive(APP_FEATURE_CODES.bookingPaymentD17);
  const paymentOptionCount = Number(cardPaymentEnabled) + Number(d17PaymentEnabled) + 1;
  const paymentOptionsGridClassName =
    paymentOptionCount >= 3
      ? 'sm:grid-cols-3'
      : paymentOptionCount === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-1';
  const selectedPaymentMethodAvailable =
    paymentMethod === 'card'
      ? cardPaymentEnabled
      : paymentMethod === 'd17'
        ? d17PaymentEnabled
        : paymentMethod === 'cash'
          ? cashAvailable
          : true;

  useEffect(() => {
    if (paymentMethod && !selectedPaymentMethodAvailable) {
      setPaymentMethod('');
      setPaymentError('');
    }
  }, [paymentMethod, selectedPaymentMethodAvailable]);

  const canProceed = () => {
    if (paymentMethod === 'card') return cardPaymentEnabled;
    if (paymentMethod === 'd17') return d17PaymentEnabled && d17Phone.trim().length > 0;
    if (paymentMethod === 'cash') return cashAvailable;
    return false;
  };

  const handlePaymentMethodSelect = (method: BookingPaymentMethod) => {
    if (method === 'card' && !cardPaymentEnabled) {
      return;
    }

    if (method === 'd17' && !d17PaymentEnabled) {
      return;
    }

    if (method === 'cash' && !cashAvailable) {
      return;
    }

    setPaymentMethod(method);
    setPaymentError('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setPaymentError('');

    if (!paymentMethod || !canProceed()) {
      return;
    }

    if (paymentMethod === 'd17') {
      const phoneResult = validatePhone(d17Phone);
      if (!phoneResult.isValid) {
        setPaymentError(phoneResult.error || 'Numéro invalide');
        return;
      }
    }

    auditLogger.log('PAYMENT_INITIATED', `Payment via ${paymentMethod}`, {
      severity: 'info',
      resource: 'payment',
      details: {
        method: paymentMethod,
        amount: totalPrice,
        currency: 'TND',
      },
    });
    onPaymentComplete(paymentMethod);
  };

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500';

  return (
    <div className={cn('space-y-3', className)}>
      {paymentSummary}

      {/* Payment Method Selection */}
      <BookingNeutralPanel className={panelClassName}>
        <h2 className="mb-3 flex items-center gap-1.5 text-base font-bold text-foreground">
          <Lock className="h-4 w-4 text-muted-foreground" />

          {t.payment.securePayment}
        </h2>

        <div
          className={cn(
            'mb-3 rounded-lg border border-cyan-300/70 bg-cyan-50/70 p-3 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300',
            noticeClassName,
          )}
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-300" />

            <div className="text-xs text-cyan-700 dark:text-cyan-300">
              <p className="mb-0.5 font-semibold">{t.payment.escrowNotice}</p>
              <p>{t.payment.escrowDesc}</p>
            </div>
          </div>
        </div>

        <div className={cn('mb-3 grid grid-cols-1 gap-3', paymentOptionsGridClassName)}>
          {cardPaymentEnabled ? (
            <BookingSelectableCard
              onClick={() => handlePaymentMethodSelect('card')}
              selected={paymentMethod === 'card'}
              className={optionClassName}
              selectedClassName={optionSelectedClassName}
              selectedIndicator={<Check className="h-3.5 w-3.5" />}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <CreditCard
                  className={cn(
                    bookingSelectableCardIconClassName,
                    paymentMethod === 'card'
                      ? bookingSelectableCardSelectedIconClassName
                      : bookingSelectableCardNeutralIconClassName,
                  )}
                />

                <div>
                  <h3 className="text-xs font-bold text-foreground">{t.payment.bankCard}</h3>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {t.payment.bankCardDesc}
                  </p>
                </div>
              </div>
            </BookingSelectableCard>
          ) : null}

          {d17PaymentEnabled ? (
            <BookingSelectableCard
              onClick={() => handlePaymentMethodSelect('d17')}
              selected={paymentMethod === 'd17'}
              className={optionClassName}
              selectedClassName={optionSelectedClassName}
              selectedIndicator={<Check className="h-3.5 w-3.5" />}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <Smartphone
                  className={cn(
                    bookingSelectableCardIconClassName,
                    paymentMethod === 'd17'
                      ? bookingSelectableCardSelectedIconClassName
                      : bookingSelectableCardNeutralIconClassName,
                  )}
                />

                <div>
                  <h3 className="text-xs font-bold text-foreground">{t.payment.d17Sobflous}</h3>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {t.payment.d17SobflousDesc}
                  </p>
                </div>
              </div>
            </BookingSelectableCard>
          ) : null}

          <BookingSelectableCard
            onClick={() => handlePaymentMethodSelect('cash')}
            disabled={!cashAvailable}
            selected={paymentMethod === 'cash'}
            className={optionClassName}
            selectedClassName={optionSelectedClassName}
            disabledClassName={bookingPaymentOptionDisabledClassName}
            selectedIndicator={<Check className="h-3.5 w-3.5" />}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <Banknote
                className={cn(
                  bookingSelectableCardIconClassName,
                  paymentMethod === 'cash'
                    ? bookingSelectableCardSelectedIconClassName
                    : bookingSelectableCardNeutralIconClassName,
                )}
              />

              <div>
                <h3 className="text-xs font-bold text-foreground">{t.payment.cash}</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{t.payment.cashDesc}</p>
              </div>
            </div>
          </BookingSelectableCard>
        </div>

        {!cashAvailable ? (
          <div className="mb-3 rounded-lg border border-warning/30 bg-warning/10 p-3">
            <p className="text-xs font-medium text-warning">{t.bookingFlow.cashUnavailable}</p>
          </div>
        ) : null}

        {/* Card Selection Placeholder */}
        {paymentMethod === 'card' && cardPaymentEnabled ? (
          <div className="animate-fadeIn rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-foreground">{t.payment.bankCard}</p>
                <p className="text-muted-foreground">{t.payment.bankCardDesc}</p>
                <p className="text-muted-foreground">{t.payment.securePaymentNotice}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* D17 Form */}
        {paymentMethod === 'd17' && d17PaymentEnabled ? (
          <div className="animate-fadeIn space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                {t.payment.phoneNumber}
              </label>
              <TunisiaPhoneInput
                value={d17Phone}
                onValueChange={(phone) => {
                  setD17Phone(phone);
                  setPaymentError('');
                }}
                aria-invalid={paymentError ? true : undefined}
                className={`${inputCls} ${paymentError ? '!border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
              />
            </div>
            {paymentError && <p className="text-[10px] text-destructive">{paymentError}</p>}
            <p className="text-xs text-muted-foreground">
              Vous recevrez une notification sur votre application D17 pour valider le paiement.
            </p>
          </div>
        ) : null}

        {/* Cash Info */}
        {paymentMethod === 'cash' && cashAvailable && (
          <div className="animate-fadeIn rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium text-foreground">
              Vous paierez en espèces directement au professionnel lors de la prestation.
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-[10px] text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          {t.payment.securePaymentNotice}
        </div>
      </BookingNeutralPanel>

      <button
        onClick={handleSubmit}
        disabled={!canProceed() || isSubmitting}
        className={cn(
          'w-full rounded-xl px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50',
          bookingCyanActionButtonClassName,
          actionClassName,
        )}
      >
        {isSubmitting
          ? 'Traitement...'
          : paymentMethod === 'cash'
            ? t.payment.confirm
            : t.payment.pay}
      </button>
    </div>
  );
}
