/**
 * Booking UI Helper Hooks
 *
 * Pure UI logic — no data fetching, no TanStack Query.
 * Status display config and date/time formatting.
 */

import { useMemo } from 'react';
import { normalizeBookingStatusKey } from '@/features/bookings/status';
import { formatDate, formatTime } from '@/shared/lib/i18n/formatting';
import type { BookingPaymentMethod } from '@/features/bookings/schema';

// ============================================
// STATUS DISPLAY
// Presentation maps use lower snake_case keys derived from PascalCase API values.
// ============================================

// ============================================
// STATUS DISPLAY
// ============================================

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: {
    label: 'En attente',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
  },
  confirmed: {
    label: 'Confirmé',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
  },
  provider_on_way: {
    label: 'En route',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/50',
  },
  arrived: {
    label: 'Arrivé',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
  },
  in_progress: {
    label: 'En cours',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/50',
  },
  completed: {
    label: 'Terminé',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
  },
  validated: {
    label: 'Validé',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
  },
  no_show: {
    label: 'Absent',
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-500/50',
  },
  disputed: {
    label: 'Litige',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
  },
};

const DEFAULT_STATUS_CONFIG = STATUS_CONFIG.pending;

interface PaymentStatusConfig {
  label: string;
  hint: string;
  toneClassName: string;
}

export interface BookingPaymentDisplayInput {
  paymentMethod?: BookingPaymentMethod | string | null;
  paymentMethodType?: string | null;
  paymentReferenceNumber?: string | null;
  paymentStatus?: string | null;
}

export interface BookingPaymentDisplay {
  badgeClassName: string;
  hint: string;
  methodLabel: string;
  normalizedStatus: string;
  referenceNumber: string | null;
  statusLabel: string;
}

const PAYMENT_STATUS_CONFIG: Record<string, PaymentStatusConfig> = {
  pending: {
    label: 'En attente',
    hint: 'Le paiement est cree mais attend encore une confirmation finale.',
    toneClassName: 'border-border bg-muted text-muted-foreground',
  },
  processing: {
    label: 'En traitement',
    hint: 'Le paiement est en cours de traitement par la plateforme.',
    toneClassName: 'border-primary/40 bg-primary/10 text-primary',
  },
  reserved: {
    label: 'Reserve',
    hint: 'Le montant est reserve, mais le reglement final n est pas encore clos.',
    toneClassName: 'border-border bg-muted text-muted-foreground',
  },
  settled: {
    label: 'Regle',
    hint: 'Le paiement a ete regle et la reservation ne depend plus d une selection de mode.',
    toneClassName: 'border-primary/40 bg-primary/10 text-primary',
  },
  failed: {
    label: 'Echoue',
    hint: 'Le paiement a echoue et peut necessiter une nouvelle tentative.',
    toneClassName: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  expired: {
    label: 'Expire',
    hint: 'La tentative de paiement a expire avant confirmation.',
    toneClassName: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  cancelled: {
    label: 'Annule',
    hint: 'Le paiement a ete annule ou relache suite a un changement de reservation.',
    toneClassName: 'border-border bg-muted text-muted-foreground',
  },
  unknown: {
    label: 'Statut inconnu',
    hint: 'Le backend n a pas encore fourni de statut de paiement exploitable.',
    toneClassName: 'border-border bg-muted text-muted-foreground',
  },
};

function humanizeToken(value: string): string {
  const normalized = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();

  if (!normalized.length) {
    return 'Inconnu';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function normalizeBookingPaymentStatus(status?: string | null): string {
  const normalized = normalizeBookingStatusKey(status ?? '');

  switch (normalized) {
    case 'completed':
    case 'confirmed':
    case 'paid':
    case 'succeeded':
    case 'success':
      return 'settled';
    case 'canceled':
      return 'cancelled';
    case 'in_progress':
      return 'processing';
    case 'hold':
    case 'held':
      return 'reserved';
    case '':
      return 'unknown';
    default:
      return normalized;
  }
}

export function formatBookingPaymentMethodLabel(method?: string | null): string {
  const normalized = normalizeBookingStatusKey(method ?? '');

  switch (normalized) {
    case 'card':
      return 'Carte bancaire';
    case 'd17':
      return 'D17';
    case 'cash':
      return 'Especes';
    case 'mobile_money':
      return 'Mobile money';
    case 'bank_transfer':
      return 'Virement bancaire';
    case '':
      return 'Mode a confirmer';
    default:
      return humanizeToken(normalized);
  }
}

export function getBookingPaymentDisplay(input: BookingPaymentDisplayInput): BookingPaymentDisplay {
  const normalizedStatus = normalizeBookingPaymentStatus(input.paymentStatus);
  const statusConfig = PAYMENT_STATUS_CONFIG[normalizedStatus] ?? {
    label: humanizeToken(normalizedStatus),
    hint: PAYMENT_STATUS_CONFIG.unknown.hint,
    toneClassName: PAYMENT_STATUS_CONFIG.unknown.toneClassName,
  };

  return {
    normalizedStatus,
    statusLabel: statusConfig.label,
    hint: statusConfig.hint,
    methodLabel: formatBookingPaymentMethodLabel(input.paymentMethodType ?? input.paymentMethod),
    referenceNumber: input.paymentReferenceNumber?.trim() || null,
    badgeClassName: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusConfig.toneClassName}`,
  };
}

export function useBookingPaymentDisplay(input: BookingPaymentDisplayInput): BookingPaymentDisplay {
  const { paymentMethod, paymentMethodType, paymentReferenceNumber, paymentStatus } = input;

  return useMemo(
    () =>
      getBookingPaymentDisplay({
        paymentMethod,
        paymentMethodType,
        paymentReferenceNumber,
        paymentStatus,
      }),
    [paymentMethod, paymentMethodType, paymentReferenceNumber, paymentStatus],
  );
}

/**
 * Status display helpers (label, color classes).
 * Normalizes PascalCase backend values to presentation keys before lookup.
 */
export function useAppointmentStatus(status: string) {
  const normalized = normalizeBookingStatusKey(status);
  return useMemo(() => STATUS_CONFIG[normalized] ?? DEFAULT_STATUS_CONFIG, [normalized]);
}

// ============================================
// DATE/TIME FORMATTING
// ============================================

/**
 * Format a scheduledAt ISO string into display labels.
 */
export function useAppointmentDateTime(scheduledAt: string) {
  return useMemo(() => {
    const date = new Date(scheduledAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let dateLabel: string;
    if (appointmentDate.getTime() === today.getTime()) {
      dateLabel = "Aujourd'hui";
    } else if (appointmentDate.getTime() === tomorrow.getTime()) {
      dateLabel = 'Demain';
    } else {
      dateLabel = formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }

    const timeLabel = formatTime(date, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isPast = date < now;
    const isToday = appointmentDate.getTime() === today.getTime();
    const isTomorrow = appointmentDate.getTime() === tomorrow.getTime();

    return {
      date,
      dateLabel,
      timeLabel,
      fullLabel: `${dateLabel} à ${timeLabel}`,
      isPast,
      isToday,
      isTomorrow,
      isUpcoming: !isPast,
    };
  }, [scheduledAt]);
}
