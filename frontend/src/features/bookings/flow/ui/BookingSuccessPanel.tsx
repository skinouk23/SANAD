import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';

interface BookingSuccessPanelProps {
  bookingNumber?: string | null;
  onGoToDashboard: () => void;
  onViewServices: () => void;
  children?: ReactNode;
}

export function BookingSuccessPanel({
  bookingNumber,
  onGoToDashboard,
  onViewServices,
  children,
}: BookingSuccessPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
        <Check className="h-6 w-6 text-primary-foreground" />
      </div>

      <h2 className="mb-2 text-lg font-bold text-foreground">{t.bookingFlow.bookingSuccess}</h2>

      {bookingNumber ? (
        <div className="mt-4">
          <p className="mb-1 text-sm text-muted-foreground">{t.bookingFlow.bookingNumberLabel} :</p>
          <p className="text-base font-bold text-primary">{bookingNumber}</p>
        </div>
      ) : null}

      {children ? <div className="mt-4 space-y-4">{children}</div> : null}

      <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onGoToDashboard}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t.bookingFlow.goToDashboard}
        </button>
        <button
          type="button"
          onClick={onViewServices}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {t.serviceListing.viewServices}
        </button>
      </div>
    </div>
  );
}
