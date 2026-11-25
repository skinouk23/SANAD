import { useMemo } from 'react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import { getPatientTimezone, isSameTimezone } from '@/utils/timezone';

interface DaySlot {
  value: string;
  label: string;
}

interface DaySlotPickerProps {
  slots: DaySlot[];
  selectedSlot: string | null;
  onSelectSlot: (value: string) => void;
  loading?: boolean;
  providerTimezone?: string | null;
  emptyMessage?: string;
}

function resolvePatientTimezone(): string | null {
  try {
    return getPatientTimezone();
  } catch {
    return null;
  }
}

export function DaySlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  loading = false,
  providerTimezone = null,
  emptyMessage,
}: DaySlotPickerProps) {
  const { dir, t } = useLanguage();
  const patientTimezone = useMemo(() => resolvePatientTimezone(), []);

  const showTimezoneNote = Boolean(
    providerTimezone && patientTimezone && !isSameTimezone(providerTimezone, patientTimezone),
  );

  const timezoneNote = patientTimezone
    ? t.bookingFlow.calendarTimezoneNote.replace('{timezone}', patientTimezone)
    : t.bookingFlow.calendarTimezoneNote.replace('{timezone}', 'UTC');

  const resolvedEmptyMessage = emptyMessage ?? t.bookingFlow.calendarNoAvailability;

  return (
    <section
      dir={dir}
      aria-label={t.bookingFlow.selectTime}
      aria-busy={loading}
      className="space-y-3"
    >
      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={`slot-skeleton-${index}`}
              className="h-11 animate-pulse rounded-lg bg-muted sm:h-9"
            />
          ))}
        </div>
      ) : slots.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.value;

            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => onSelectSlot(slot.value)}
                aria-pressed={isSelected}
                className={`min-h-11 touch-manipulation rounded-lg border-2 px-2 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:min-h-0 sm:py-2 sm:text-xs ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:border-border/80 hover:bg-accent/40'}`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 text-center text-sm leading-relaxed text-muted-foreground sm:py-6">
          {resolvedEmptyMessage}
        </div>
      )}

      {showTimezoneNote && !loading ? (
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-[11px]">
          {timezoneNote}
        </p>
      ) : null}
    </section>
  );
}
