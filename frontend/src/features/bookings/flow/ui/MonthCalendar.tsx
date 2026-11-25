import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';

// ============================================
// TYPES
// ============================================

interface MonthCalendarDay {
  date: string;
  slotCount: number;
}

interface CalendarCell {
  key: string;
  date: string | null;
  slotCount: number;
  dayLabel: string | null;
  spokenDateLabel: string | null;
}

interface MonthCalendarProps {
  year: number;
  month: number;
  days: MonthCalendarDay[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
  loading?: boolean;
  disabled?: boolean;
  maxDate?: string;
  mode?: 'single' | 'range';
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  onRangeSelect?: (startDate: string, endDate: string | null) => void;
  rangeHelperText?: string;
}

// ============================================
// HELPERS
// ============================================

function padNumber(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function getDateParts(dateKey: string): [number, number, number] {
  const [year, month, day] = dateKey.split('-').map(Number);

  return [year, month, day];
}

function getInclusiveDayCount(startDate: string, endDate: string): number {
  const [startYear, startMonth, startDay] = getDateParts(startDate);
  const [endYear, endMonth, endDay] = getDateParts(endDate);
  const startTimestamp = Date.UTC(startYear, startMonth - 1, startDay);
  const endTimestamp = Date.UTC(endYear, endMonth - 1, endDay);

  return Math.floor((endTimestamp - startTimestamp) / 86_400_000) + 1;
}

function getShiftedMonth(
  year: number,
  month: number,
  delta: number,
): {
  year: number;
  month: number;
} {
  const shiftedDate = new Date(year, month - 1 + delta, 1);

  return {
    year: shiftedDate.getFullYear(),
    month: shiftedDate.getMonth() + 1,
  };
}

function formatWeekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(2024, 0, index + 1)),
  ).map((label) => label.replace(/\./g, ''));
}

// ============================================
// COMPONENT
// ============================================

export function MonthCalendar({
  year,
  month,
  days,
  selectedDate,
  onSelectDate,
  onMonthChange,
  loading = false,
  disabled = false,
  maxDate,
  mode = 'single',
  rangeStartDate = null,
  rangeEndDate = null,
  onRangeSelect,
  rangeHelperText,
}: MonthCalendarProps) {
  const { currentLanguage, dir, t } = useLanguage();

  const todayKey = formatDateKey(new Date());
  const isRangeMode = mode === 'range';

  const weekdayLabels = useMemo(
    () => formatWeekdayLabels(currentLanguage.code),
    [currentLanguage.code],
  );

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLanguage.code, {
        month: 'long',
        year: 'numeric',
      }).format(new Date(year, month - 1, 1)),
    [currentLanguage.code, month, year],
  );

  const calendarCells = useMemo(() => {
    const dayFormatter = new Intl.DateTimeFormat(currentLanguage.code, { day: 'numeric' });
    const spokenDateFormatter = new Intl.DateTimeFormat(currentLanguage.code, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const slotCountByDate = new Map(days.map((day) => [day.date, day.slotCount]));
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const leadingBlankCells = (firstDayOfMonth.getDay() + 6) % 7;
    const totalGridCells = Math.ceil((leadingBlankCells + totalDaysInMonth) / 7) * 7;

    return Array.from({ length: totalGridCells }, (_, index): CalendarCell => {
      const dayNumber = index - leadingBlankCells + 1;

      if (dayNumber < 1 || dayNumber > totalDaysInMonth) {
        return {
          key: `placeholder-${index}`,
          date: null,
          slotCount: 0,
          dayLabel: null,
          spokenDateLabel: null,
        };
      }

      const currentDate = new Date(year, month - 1, dayNumber);
      const dateKey = formatDateKey(currentDate);

      return {
        key: dateKey,
        date: dateKey,
        slotCount: slotCountByDate.get(dateKey) ?? 0,
        dayLabel: dayFormatter.format(currentDate),
        spokenDateLabel: spokenDateFormatter.format(currentDate),
      };
    });
  }, [currentLanguage.code, days, month, year]);

  const hasSelectableDays = calendarCells.some(
    (cell) => cell.date !== null && cell.slotCount > 0 && cell.date >= todayKey,
  );

  const selectedRangeDayCount = useMemo(() => {
    if (!isRangeMode || !rangeStartDate || !rangeEndDate) {
      return null;
    }

    return getInclusiveDayCount(rangeStartDate, rangeEndDate);
  }, [isRangeMode, rangeEndDate, rangeStartDate]);

  const helperMessage = loading
    ? t.bookingFlow.calendarLoading
    : isRangeMode
      ? rangeStartDate && !rangeEndDate
        ? (rangeHelperText ?? t.bookingFlow.selectEndDate)
        : rangeStartDate && rangeEndDate && selectedRangeDayCount !== null
          ? t.bookingFlow.rangeAvailabilitySummary.replace('{count}', String(selectedRangeDayCount))
          : !hasSelectableDays
            ? t.bookingFlow.calendarNoAvailability
            : t.bookingFlow.calendarSelectDay
      : hasSelectableDays
        ? t.bookingFlow.calendarSelectDay
        : t.bookingFlow.calendarNoAvailability;

  const handleDateClick = (clickedDate: string) => {
    if (isRangeMode) {
      if (!onRangeSelect) {
        return;
      }

      if (!rangeStartDate || rangeEndDate) {
        onRangeSelect(clickedDate, null);
        return;
      }

      if (clickedDate === rangeStartDate) {
        onRangeSelect(clickedDate, clickedDate);
        return;
      }

      if (clickedDate > rangeStartDate) {
        onRangeSelect(rangeStartDate, clickedDate);
        return;
      }

      onRangeSelect(clickedDate, null);
      return;
    }

    onSelectDate(clickedDate);
  };

  const isNextMonthDisabled = useMemo(() => {
    if (!maxDate) {
      return false;
    }

    const [maxYear, maxMonth] = getDateParts(maxDate);

    if (Number.isNaN(maxYear) || Number.isNaN(maxMonth)) {
      return false;
    }

    const nextMonth = getShiftedMonth(year, month, 1);

    return nextMonth.year > maxYear || (nextMonth.year === maxYear && nextMonth.month > maxMonth);
  }, [maxDate, month, year]);

  const navButtonClassName =
    'inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50 hover:border-border/80 hover:bg-accent/40 sm:h-10 sm:w-10';

  const previousMonthButton = (
    <button
      type="button"
      onClick={() => {
        const nextMonth = getShiftedMonth(year, month, -1);
        onMonthChange(nextMonth.year, nextMonth.month);
      }}
      aria-label={t.bookingFlow.calendarPreviousMonth}
      title={t.bookingFlow.calendarPreviousMonth}
      disabled={disabled}
      className={navButtonClassName}
    >
      {dir === 'rtl' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </button>
  );

  const nextMonthButton = (
    <button
      type="button"
      onClick={() => {
        const nextMonth = getShiftedMonth(year, month, 1);
        onMonthChange(nextMonth.year, nextMonth.month);
      }}
      aria-label={t.bookingFlow.calendarNextMonth}
      title={t.bookingFlow.calendarNextMonth}
      disabled={disabled || isNextMonthDisabled}
      className={navButtonClassName}
    >
      {dir === 'rtl' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );

  return (
    <section
      dir={dir}
      aria-label={t.bookingFlow.calendarTitle}
      aria-busy={loading}
      className="space-y-3 sm:space-y-4"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {dir === 'rtl' ? nextMonthButton : previousMonthButton}
        <div className="flex-1 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t.bookingFlow.calendarTitle}
          </p>
          <h3 className="mt-1 text-sm font-bold capitalize text-foreground sm:text-base">
            {monthLabel}
          </h3>
        </div>
        {dir === 'rtl' ? previousMonthButton : nextMonthButton}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
        {weekdayLabels.map((weekday) => (
          <p
            key={weekday}
            className="text-[10px] font-semibold uppercase text-muted-foreground sm:text-[11px]"
          >
            {weekday}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {loading
          ? calendarCells.map((cell) => (
              <div
                key={cell.key}
                className="h-11 animate-pulse rounded-lg bg-muted sm:h-16 sm:rounded-xl"
              />
            ))
          : calendarCells.map((cell) => {
              if (!cell.date || !cell.dayLabel || !cell.spokenDateLabel) {
                return (
                  <div
                    key={cell.key}
                    aria-hidden="true"
                    className="h-11 rounded-lg opacity-0 sm:h-16 sm:rounded-xl"
                  />
                );
              }

              const dateValue = cell.date;
              const isPastDay = dateValue < todayKey;
              const isAvailableDay = cell.slotCount > 0;
              const isSelectedDay = selectedDate === dateValue;
              const isRangeStart = isRangeMode && rangeStartDate === dateValue;
              const isRangeEnd = isRangeMode && rangeEndDate === dateValue;
              const isInRange = Boolean(
                isRangeMode &&
                rangeStartDate &&
                rangeEndDate &&
                dateValue > rangeStartDate &&
                dateValue < rangeEndDate,
              );
              const isRangeBoundary = isRangeStart || isRangeEnd;
              const canSelectDay = !disabled && !isPastDay && isAvailableDay;
              const availabilityLabel = isAvailableDay
                ? t.bookingFlow.calendarSlotsAvailable.replace('{count}', String(cell.slotCount))
                : t.bookingFlow.calendarNoAvailability;
              const rangeStateLabel = isRangeMode
                ? isRangeStart && isRangeEnd
                  ? `${t.bookingFlow.selectDate}, ${t.bookingFlow.selectEndDate}`
                  : isRangeStart
                    ? t.bookingFlow.selectDate
                    : isRangeEnd
                      ? t.bookingFlow.selectEndDate
                      : isInRange
                        ? t.bookingFlow.daysBookedLabel
                        : null
                : null;
              const accessibilityLabel = rangeStateLabel
                ? `${cell.spokenDateLabel}: ${availabilityLabel}. ${rangeStateLabel}`
                : `${cell.spokenDateLabel}: ${availabilityLabel}`;
              const stateClassName = isRangeMode
                ? isRangeStart && isRangeEnd
                  ? 'border-primary bg-primary text-primary-foreground ring-2 ring-primary/40'
                  : isRangeStart
                    ? `border-primary bg-primary text-primary-foreground ring-2 ring-primary/40 ${
                        dir === 'rtl'
                          ? 'rounded-l-md rounded-r-2xl sm:rounded-l-md sm:rounded-r-2xl'
                          : 'rounded-l-2xl rounded-r-md sm:rounded-l-2xl sm:rounded-r-md'
                      }`
                    : isRangeEnd
                      ? `border-primary bg-primary text-primary-foreground ring-2 ring-primary/40 ${
                          dir === 'rtl'
                            ? 'rounded-l-2xl rounded-r-md sm:rounded-l-2xl sm:rounded-r-md'
                            : 'rounded-l-md rounded-r-2xl sm:rounded-l-md sm:rounded-r-2xl'
                        }`
                      : isInRange
                        ? 'border-primary/20 bg-primary/5 text-foreground'
                        : canSelectDay
                          ? 'border-border bg-background text-foreground hover:border-border/80 hover:bg-accent/40 hover:text-foreground'
                          : 'border-border bg-muted/40 text-muted-foreground'
                : isSelectedDay
                  ? 'border-primary bg-primary text-primary-foreground ring-2 ring-primary/40'
                  : canSelectDay
                    ? 'border-border bg-background text-foreground hover:border-border/80 hover:bg-accent/40 hover:text-foreground'
                    : 'border-border bg-muted/40 text-muted-foreground';
              const availabilityDotClassName = isRangeMode
                ? isRangeBoundary
                  ? 'bg-primary-foreground'
                  : isInRange
                    ? 'bg-primary'
                    : 'bg-muted-foreground'
                : isSelectedDay
                  ? 'bg-primary-foreground'
                  : 'bg-muted-foreground';

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => handleDateClick(dateValue)}
                  disabled={!canSelectDay}
                  aria-pressed={isRangeMode ? isRangeBoundary : isSelectedDay}
                  aria-label={accessibilityLabel}
                  title={accessibilityLabel}
                  className={`relative flex h-11 min-w-0 touch-manipulation flex-col items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed sm:h-16 sm:rounded-xl ${stateClassName}`}
                >
                  <span>{cell.dayLabel}</span>
                  {isAvailableDay ? (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full sm:bottom-2 ${availabilityDotClassName}`}
                    />
                  ) : null}
                </button>
              );
            })}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{helperMessage}</p>
    </section>
  );
}
