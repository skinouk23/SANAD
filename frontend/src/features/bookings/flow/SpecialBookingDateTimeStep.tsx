import { BookingInlineState } from './BookingFlowUi';
import type { ReactNode } from 'react';

import { DaySlotPicker, MonthCalendar } from '@/features/bookings/flow/ui';

interface SpecialBookingDateTimeStepProps {
  title: string;
  dateLabel: string;
  timeLabel: string;
  bookingDate: string;
  calendarYear: number;
  calendarMonth: number;
  monthDays: Array<{ date: string; slotCount: number }>;
  onSelectDate: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
  monthLoading: boolean;
  maxDate?: string;
  selectedSlot: string | null;
  slots: Array<{ value: string; label: string }>;
  onSelectSlot: (slot: string) => void;
  slotLoading: boolean;
  providerTimezone: string | null;
  slotEmptyMessage: string;
  availabilityErrorTitle?: string;
  availabilityErrorMessage?: string | null;
  disabled?: boolean;
  beforeCalendar?: ReactNode;
  beforeSlots?: ReactNode;
  afterSlots?: ReactNode;
}

export function SpecialBookingDateTimeStep({
  afterSlots,
  availabilityErrorTitle,
  availabilityErrorMessage,
  beforeCalendar,
  beforeSlots,
  bookingDate,
  calendarMonth,
  calendarYear,
  dateLabel,
  disabled,
  maxDate,
  monthDays,
  monthLoading,
  onMonthChange,
  onSelectDate,
  onSelectSlot,
  providerTimezone,
  selectedSlot,
  slotEmptyMessage,
  slotLoading,
  slots,
  timeLabel,
  title,
}: SpecialBookingDateTimeStepProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>

      {beforeCalendar}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">{dateLabel} *</label>
        <MonthCalendar
          year={calendarYear}
          month={calendarMonth}
          days={monthDays}
          selectedDate={bookingDate || null}
          onSelectDate={onSelectDate}
          onMonthChange={onMonthChange}
          loading={monthLoading}
          maxDate={maxDate}
          disabled={disabled}
        />
      </div>

      {beforeSlots}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">{timeLabel} *</label>
        <DaySlotPicker
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          loading={slotLoading}
          providerTimezone={providerTimezone}
          emptyMessage={slotEmptyMessage}
        />
        {availabilityErrorMessage ? (
          <BookingInlineState
            tone="danger"
            title={availabilityErrorTitle ?? 'Availability error'}
            description={availabilityErrorMessage}
          />
        ) : null}
        {afterSlots}
      </div>
    </div>
  );
}
