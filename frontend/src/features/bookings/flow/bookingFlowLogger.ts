import { isDevelopment } from '@/config/env';

type BookingFlowLogValue = boolean | number | string | null | undefined;

type BookingFlowLogContext = Record<string, BookingFlowLogValue>;

function hasLogContext(
  context: BookingFlowLogContext | undefined,
): context is BookingFlowLogContext {
  return Boolean(context && Object.keys(context).length > 0);
}

function logBookingFlow(
  level: 'warn' | 'error',
  message: string,
  context?: BookingFlowLogContext,
): void {
  if (!isDevelopment()) {
    return;
  }

  const prefixedMessage = `[booking-flow] ${message}`;
  const logger = level === 'error' ? console.error : console.warn;

  if (!hasLogContext(context)) {
    logger(prefixedMessage);
    return;
  }

  logger(prefixedMessage, context);
}

export function logBookingFlowWarning(message: string, context?: BookingFlowLogContext): void {
  logBookingFlow('warn', message, context);
}

export function logBookingFlowError(message: string, context?: BookingFlowLogContext): void {
  logBookingFlow('error', message, context);
}
