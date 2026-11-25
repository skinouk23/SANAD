import { afterEach, describe, expect, it, vi } from 'vitest';

import * as messagingHelpers from '@/features/messaging/hooks/useMessagingHelpers';
import type { MessageResponse } from '@/features/messaging/schema';

interface RelativeTimeLabels {
  justNow: string;
  formatMinutesAgo: (count: number) => string;
  formatHoursAgo: (count: number) => string;
  formatDaysAgo: (count: number) => string;
}

type FormatConversationTime = (
  createdAt: string,
  locale: string,
  labels: RelativeTimeLabels,
) => string;

type GroupMessagesByDate = (
  messages: MessageResponse[],
  locale: string,
) => { date: string; messages: MessageResponse[] }[];

const RELATIVE_LABELS: RelativeTimeLabels = {
  justNow: 'Just now',
  formatMinutesAgo: (count) => `${count} minute${count === 1 ? '' : 's'} ago`,
  formatHoursAgo: (count) => `${count} hour${count === 1 ? '' : 's'} ago`,
  formatDaysAgo: (count) => `${count} day${count === 1 ? '' : 's'} ago`,
};

function requireHelper<T>(helper: T | undefined, name: string): T {
  expect(helper, `${name} should be exported`).toBeTypeOf('function');

  return helper as T;
}

function getFormatConversationTime(): FormatConversationTime {
  return requireHelper(
    (messagingHelpers as { formatConversationTime?: FormatConversationTime })
      .formatConversationTime,
    'formatConversationTime',
  );
}

function getGroupMessagesByDate(): GroupMessagesByDate {
  return requireHelper(
    (messagingHelpers as { groupMessagesByDate?: GroupMessagesByDate }).groupMessagesByDate,
    'groupMessagesByDate',
  );
}

function buildMessage(id: string, createdAt: string, content: string): MessageResponse {
  return {
    id,
    conversationId: '10000000-0000-4000-8000-000000000001',
    senderId: '20000000-0000-4000-8000-000000000001',
    sender: {
      id: '20000000-0000-4000-8000-000000000001',
      fullName: 'Patient Example',
      role: 'patient',
      avatarUrl: null,
    },
    messageType: 'text',
    content,
    attachmentUrl: null,
    attachmentName: null,
    attachmentSizeBytes: null,
    attachmentMimeType: null,
    latitude: null,
    longitude: null,
    isRead: false,
    readAt: null,
    metadata: null,
    createdAt,
  };
}

function formatExpectedDateLabel(
  locale: string,
  createdAt: string,
  referenceDate = new Date(),
): string {
  const createdAtDate = new Date(createdAt);
  const includeYear = createdAtDate.getFullYear() !== referenceDate.getFullYear();

  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(includeYear ? { year: 'numeric' as const } : {}),
  }).format(createdAtDate);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('messaging helper time formatting', () => {
  it('returns the provided justNow label for timestamps younger than one minute', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:30.000Z'));

    expect(getFormatConversationTime()('2026-04-15T12:00:00.000Z', 'en-GB', RELATIVE_LABELS)).toBe(
      'Just now',
    );
  });

  it('formats minute, hour, and day thresholds with locale-aware label callbacks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const formatConversationTime = getFormatConversationTime();

    expect(formatConversationTime('2026-04-15T11:59:00.000Z', 'en-GB', RELATIVE_LABELS)).toBe(
      '1 minute ago',
    );
    expect(formatConversationTime('2026-04-15T09:00:00.000Z', 'en-GB', RELATIVE_LABELS)).toBe(
      '3 hours ago',
    );
    expect(formatConversationTime('2026-04-14T12:00:00.000Z', 'en-GB', RELATIVE_LABELS)).toBe(
      '1 day ago',
    );
  });
});

describe('messaging helper message grouping', () => {
  it('returns an empty array when there are no messages', () => {
    expect(getGroupMessagesByDate()([], 'en-GB')).toEqual([]);
  });

  it('groups consecutive messages by calendar date using the requested locale', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const messages = [
      buildMessage('30000000-0000-4000-8000-000000000001', '2026-04-14T09:00:00.000Z', 'First'),
      buildMessage('30000000-0000-4000-8000-000000000002', '2026-04-14T10:00:00.000Z', 'Second'),
      buildMessage('30000000-0000-4000-8000-000000000003', '2026-04-15T08:30:00.000Z', 'Third'),
    ];

    const groupMessagesByDate = getGroupMessagesByDate();
    const englishGroups = groupMessagesByDate(messages, 'en-GB');
    const frenchGroups = groupMessagesByDate(messages, 'fr-FR');

    expect(englishGroups).toEqual([
      {
        date: formatExpectedDateLabel('en-GB', '2026-04-14T09:00:00.000Z'),
        messages: [messages[0], messages[1]],
      },
      {
        date: formatExpectedDateLabel('en-GB', '2026-04-15T08:30:00.000Z'),
        messages: [messages[2]],
      },
    ]);
    expect(frenchGroups).toEqual([
      {
        date: formatExpectedDateLabel('fr-FR', '2026-04-14T09:00:00.000Z'),
        messages: [messages[0], messages[1]],
      },
      {
        date: formatExpectedDateLabel('fr-FR', '2026-04-15T08:30:00.000Z'),
        messages: [messages[2]],
      },
    ]);
  });

  it('renders year-aware labels for separate groups from different calendar years', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const messages = [
      buildMessage(
        '30000000-0000-4000-8000-000000000004',
        '2023-04-14T09:00:00.000Z',
        'Older year',
      ),
      buildMessage(
        '30000000-0000-4000-8000-000000000005',
        '2028-04-14T10:00:00.000Z',
        'Future year',
      ),
    ];

    const groups = getGroupMessagesByDate()(messages, 'en-GB');

    expect(groups).toHaveLength(2);
    expect(groups[0]).toEqual({
      date: formatExpectedDateLabel('en-GB', '2023-04-14T09:00:00.000Z'),
      messages: [messages[0]],
    });
    expect(groups[1]).toEqual({
      date: formatExpectedDateLabel('en-GB', '2028-04-14T10:00:00.000Z'),
      messages: [messages[1]],
    });
    expect(groups[0].date).not.toEqual(groups[1].date);
  });
});
