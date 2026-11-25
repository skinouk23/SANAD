import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import {
  bookingCyanPaymentOptionSelectedClassName,
  bookingNeutralPanelClassName,
  bookingNeutralPaymentOptionClassName,
  bookingSelectableCardBaseClassName,
  bookingSelectableCardSelectedIndicatorClassName,
} from '@/features/bookings/flow/BookingFlowUi';
import { cn } from '@/shared/lib/utils';

interface BookingNeutralPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface BookingSelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  selected: boolean;
  selectedClassName?: string;
  selectedIndicator?: ReactNode;
  disabledClassName?: string;
}

export function BookingNeutralPanel({ children, className, ...props }: BookingNeutralPanelProps) {
  return (
    <div className={cn(bookingNeutralPanelClassName, className)} {...props}>
      {children}
    </div>
  );
}

export function BookingSelectableCard({
  children,
  className,
  disabled,
  disabledClassName,
  selected,
  selectedClassName,
  selectedIndicator,
  type = 'button',
  ...props
}: BookingSelectableCardProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cn(
        bookingSelectableCardBaseClassName,
        selected ? bookingCyanPaymentOptionSelectedClassName : bookingNeutralPaymentOptionClassName,
        className,
        selected ? selectedClassName : null,
        disabled ? disabledClassName : null,
      )}
    >
      {selected && selectedIndicator ? (
        <div className={bookingSelectableCardSelectedIndicatorClassName}>{selectedIndicator}</div>
      ) : null}
      {children}
    </button>
  );
}
