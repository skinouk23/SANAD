import * as React from 'react';
import {
  addYears,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';
import { Calendar } from '@/shared/ui/primitives/calendar';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/primitives/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover';

const DATE_VALUE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_START_YEAR_OFFSET = -120;
const DEFAULT_END_YEAR_OFFSET = 30;

type DatePickerBoundary = Date | string;

export interface DatePickerFieldProps {
  id?: string;
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  minDate?: DatePickerBoundary;
  maxDate?: DatePickerBoundary;
  startMonth?: DatePickerBoundary;
  endMonth?: DatePickerBoundary;
  reverseYears?: boolean;
  required?: boolean;
  labelClassName?: string;
  triggerClassName?: string;
}

function parseDateValue(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsedDate = parse(value, DATE_VALUE_FORMAT, 0);

  return isValid(parsedDate) ? parsedDate : undefined;
}

function normalizeBoundaryDate(value: DatePickerBoundary | undefined, boundary: 'min' | 'max') {
  if (!value) {
    return undefined;
  }

  const date = normalizeDateValue(value);

  if (!date) {
    return undefined;
  }

  return boundary === 'min' ? startOfDay(date) : endOfDay(date);
}

function normalizeDateValue(value: DatePickerBoundary) {
  const date = typeof value === 'string' ? parseDateValue(value) : value;

  return date && isValid(date) ? date : undefined;
}

function normalizeMonthBoundary(value: DatePickerBoundary | undefined, boundary: 'start' | 'end') {
  if (!value) {
    return undefined;
  }

  const date = normalizeDateValue(value);

  if (!date) {
    return undefined;
  }

  return boundary === 'start' ? startOfMonth(date) : endOfMonth(date);
}

function getFallbackDefaultMonth(minimumDate: Date | undefined, maximumDate: Date | undefined) {
  const today = startOfDay(new Date());

  if (minimumDate && isBefore(today, minimumDate)) {
    return minimumDate;
  }

  if (maximumDate && isAfter(today, maximumDate)) {
    return maximumDate;
  }

  return today;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Sélectionner une date',
  disabled,
  error,
  className,
  description,
  minDate,
  maxDate,
  startMonth,
  endMonth,
  reverseYears,
  required,
  labelClassName,
  triggerClassName,
}: DatePickerFieldProps) {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const selectedDate = parseDateValue(value);
  const minimumDate = normalizeBoundaryDate(minDate, 'min');
  const maximumDate = normalizeBoundaryDate(maxDate, 'max');
  const defaultMonth = selectedDate ?? getFallbackDefaultMonth(minimumDate, maximumDate);
  const calendarStartMonth =
    normalizeMonthBoundary(startMonth, 'start') ??
    (minimumDate
      ? startOfMonth(minimumDate)
      : startOfYear(addYears(defaultMonth, DEFAULT_START_YEAR_OFFSET)));
  const calendarEndMonth =
    normalizeMonthBoundary(endMonth, 'end') ??
    (maximumDate
      ? endOfMonth(maximumDate)
      : endOfYear(addYears(defaultMonth, DEFAULT_END_YEAR_OFFSET)));
  const hasError = Boolean(error);

  function handleSelect(date: Date | undefined) {
    onChange(date ? format(date, DATE_VALUE_FORMAT) : '');
  }

  function isDateDisabled(date: Date) {
    return Boolean(
      (minimumDate && isBefore(date, minimumDate)) || (maximumDate && isAfter(date, maximumDate)),
    );
  }

  return (
    <Field
      className={className}
      data-disabled={disabled ? true : undefined}
      data-invalid={hasError ? true : undefined}
    >
      {label ? (
        <FieldLabel className={labelClassName} htmlFor={fieldId}>
          {label}
        </FieldLabel>
      ) : null}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            variant="outline"
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={hasError ? true : undefined}
            aria-required={required ? true : undefined}
            className={cn(
              'h-10 w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              triggerClassName,
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {selectedDate ? format(selectedDate, DATE_VALUE_FORMAT) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            captionLayout="dropdown"
            navLayout="after"
            startMonth={calendarStartMonth}
            endMonth={calendarEndMonth}
            defaultMonth={defaultMonth}
            reverseYears={reverseYears}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}
