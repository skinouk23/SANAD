// ============================================
// TIMEZONE HELPERS
// ============================================

export interface LocalTimeConversion {
  localLabel: string;
  rawValue: string;
}

interface ParsedTimeValue {
  hour: number;
  minute: number;
  second: number;
}

function parseDateValue(date: string): [number, number, number] {
  const [year, month, day] = date.split('-').map(Number);
  return [year, month, day];
}

function parseTimeValue(time: string): ParsedTimeValue {
  const [hour, minute, second = '0'] = time.split(':');

  return {
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const values = formatter.formatToParts(date).reduce<Record<string, string>>((parts, part) => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }

    return parts;
  }, {});

  const zonedUtcTime = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return zonedUtcTime - date.getTime();
}

function getProviderInstant(providerTimezone: string, date: string, time: string): Date {
  const [year, month, day] = parseDateValue(date);
  const { hour, minute, second } = parseTimeValue(time);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);

  let providerInstant = utcGuess;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    providerInstant = utcGuess - getTimeZoneOffsetMs(new Date(providerInstant), providerTimezone);
  }

  return new Date(providerInstant);
}

function normalizeTimezone(timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone }).resolvedOptions().timeZone;
}

export function getPatientTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function convertProviderTimeToLocal(
  providerTimezone: string,
  date: string,
  time: string,
): LocalTimeConversion {
  const patientTimezone = getPatientTimezone();
  const providerInstant = getProviderInstant(providerTimezone, date, time);
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: patientTimezone,
  });

  return {
    localLabel: formatter.format(providerInstant),
    rawValue: time,
  };
}

export function isSameTimezone(tz1: string, tz2: string): boolean {
  if (!tz1 || !tz2) {
    return false;
  }

  try {
    return normalizeTimezone(tz1) === normalizeTimezone(tz2);
  } catch {
    return tz1.trim().toLowerCase() === tz2.trim().toLowerCase();
  }
}
