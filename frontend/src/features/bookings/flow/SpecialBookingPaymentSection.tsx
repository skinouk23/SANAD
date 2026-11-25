import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

import { BookingQuotePanel, bookingNeutralBackButtonClassName } from './BookingFlowUi';

import { PaymentStep } from '@/features/bookings/flow/ui';
import type { BookingPaymentMethod } from '@/features/bookings/schema';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';

interface SpecialBookingPaymentSectionProps {
  backLabel: string;
  onBack: () => void;
  quoteLoading: boolean;
  quoteError: unknown;
  quoteReady: boolean;
  quoteErrorMessage: string;
  loadingLabel: string;
  retryLabel: string;
  errorTitle: string;
  onRetry: () => void;
  totalPrice: number;
  onPaymentComplete: (method: BookingPaymentMethod) => void;
  isSubmitting: boolean;
  providerName: string;
  serviceName?: string;
  date: string;
  time: string;
  cashAvailable?: boolean;
  paymentSummary?: ReactNode;
  backButtonClassName?: string;
  paymentClassName?: string;
  paymentPanelClassName?: string;
  paymentNoticeClassName?: string;
  paymentOptionClassName?: string;
  paymentOptionSelectedClassName?: string;
  paymentActionClassName?: string;
}

export function SpecialBookingPaymentSection({
  backLabel,
  backButtonClassName,
  date,
  errorTitle,
  isSubmitting,
  loadingLabel,
  onBack,
  onPaymentComplete,
  onRetry,
  providerName,
  quoteError,
  quoteErrorMessage,
  quoteLoading,
  quoteReady,
  retryLabel,
  serviceName,
  time,
  totalPrice,
  cashAvailable = true,
  paymentSummary,
  paymentClassName,
  paymentPanelClassName,
  paymentNoticeClassName,
  paymentOptionClassName,
  paymentOptionSelectedClassName,
  paymentActionClassName,
}: SpecialBookingPaymentSectionProps) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className={cn(
          'group min-h-0 gap-2',
          bookingNeutralBackButtonClassName,
          backButtonClassName,
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        {backLabel}
      </Button>

      <BookingQuotePanel
        error={quoteReady ? quoteError : (quoteError ?? new Error(quoteErrorMessage))}
        errorMessage={quoteErrorMessage}
        errorTitle={errorTitle}
        loading={quoteLoading}
        loadingLabel={loadingLabel}
        onRetry={onRetry}
        retryLabel={retryLabel}
      >
        <PaymentStep
          totalPrice={totalPrice}
          onPaymentComplete={onPaymentComplete}
          isSubmitting={isSubmitting}
          providerName={providerName}
          serviceName={serviceName}
          date={date}
          time={time}
          cashAvailable={cashAvailable}
          paymentSummary={paymentSummary}
          className={paymentClassName}
          panelClassName={paymentPanelClassName}
          noticeClassName={paymentNoticeClassName}
          optionClassName={paymentOptionClassName}
          optionSelectedClassName={paymentOptionSelectedClassName}
          actionClassName={paymentActionClassName}
        />
      </BookingQuotePanel>
    </div>
  );
}
