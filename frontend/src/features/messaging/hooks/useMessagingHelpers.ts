/**
 * Messaging helper utilities.
 */

import type { MessageResponse } from '@/features/messaging/schema';

export interface ConversationTimeLabels {
  justNow: string;
  formatMinutesAgo: (count: number) => string;
  formatHoursAgo: (count: number) => string;
  formatDaysAgo: (count: number) => string;
}

export interface MessageDateGroup {
  date: string;
  messages: MessageResponse[];
}

function getLocalCalendarKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function formatConversationTime(
  createdAt: string,
  locale: string,
  labels: ConversationTimeLabels,
): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return labels.justNow;
  }

  if (diffMins < 60) {
    return labels.formatMinutesAgo(diffMins);
  }

  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours < 24) {
    return labels.formatHoursAgo(diffHours);
  }

  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 7) {
    return labels.formatDaysAgo(diffDays);
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function groupMessagesByDate(
  messages: MessageResponse[],
  locale: string,
): MessageDateGroup[] {
  if (messages.length === 0) {
    return [];
  }

  const currentYear = new Date().getFullYear();
  const currentYearFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const historicYearFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const groups: MessageDateGroup[] = [];
  let currentDateKey = '';

  for (const message of messages) {
    const createdAt = new Date(message.createdAt);
    const dateKey = getLocalCalendarKey(createdAt);
    const dateLabel =
      createdAt.getFullYear() === currentYear
        ? currentYearFormatter.format(createdAt)
        : historicYearFormatter.format(createdAt);

    if (dateKey !== currentDateKey) {
      currentDateKey = dateKey;
      groups.push({ date: dateLabel, messages: [message] });
      continue;
    }

    groups[groups.length - 1].messages.push(message);
  }

  return groups;
}
