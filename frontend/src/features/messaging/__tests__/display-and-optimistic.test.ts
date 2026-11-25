import { afterEach, describe, expect, it, vi } from 'vitest';

import { getConversationCounterpart, getProviderCategoryLabel } from '@/features/messaging/display';
import { buildOptimisticTextMessage } from '@/features/messaging/optimistic';
import type { ConversationResponse } from '@/features/messaging/schema';

const CONVERSATION_ID = '10000000-0000-4000-8000-000000000001';
const PATIENT_ID = '20000000-0000-4000-8000-000000000001';
const PROVIDER_ID = '30000000-0000-4000-8000-000000000001';

const BASE_CONVERSATION: ConversationResponse = {
  id: CONVERSATION_ID,
  isActive: true,
  patient: {
    id: PATIENT_ID,
    fullName: 'Mohamed Ali',
    avatarUrl: 'https://example.com/patient.png',
  },
  provider: {
    id: PROVIDER_ID,
    fullName: 'Dr Fatma Ben Said',
    specialty: 'nursing',
    avatarUrl: 'https://example.com/provider.png',
  },
  lastMessageAt: '2026-04-15T09:30:00Z',
  lastMessagePreview: 'Bonjour',
  lastMessageBy: PATIENT_ID,
  unreadCount: 1,
  canSendMessage: false,
  messagingBlockedReason: 'provider_disabled_patient_messages',
  updatedAt: '2026-04-15T09:30:00Z',
};

afterEach(() => {
  vi.useRealTimers();
});

describe('messaging display helpers', () => {
  it('returns the provider counterpart for a patient viewer', () => {
    expect(getConversationCounterpart(BASE_CONVERSATION, 'patient')).toEqual(
      BASE_CONVERSATION.provider,
    );
  });

  it('returns the patient counterpart for a provider viewer', () => {
    expect(getConversationCounterpart(BASE_CONVERSATION, 'provider')).toEqual(
      BASE_CONVERSATION.patient,
    );
  });

  it('returns the counterpart object as-is when it is omitted', () => {
    expect(
      getConversationCounterpart(
        {
          ...BASE_CONVERSATION,
          provider: undefined,
        },
        'patient',
      ),
    ).toBeUndefined();
  });

  it('maps provider category codes and falls back for unmapped or nullish values', () => {
    const categoryLabels = new Map<string, string>([
      ['nursing', 'Soins infirmiers'],
      ['physiotherapy', 'Kinésithérapie'],
    ]);

    expect(getProviderCategoryLabel('nursing', categoryLabels)).toBe('Soins infirmiers');
    expect(getProviderCategoryLabel('midwife', categoryLabels)).toBe('midwife');
    expect(getProviderCategoryLabel(null, categoryLabels)).toBe('');
    expect(getProviderCategoryLabel(undefined, categoryLabels)).toBe('');
  });
});

describe('messaging optimistic helper', () => {
  it('builds an optimistic text message from the authenticated sender without hardcoding patient role', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const optimisticMessage = buildOptimisticTextMessage({
      conversationId: CONVERSATION_ID,
      content: 'Je suis en route.',
      authenticatedUser: {
        id: PROVIDER_ID,
        role: 'provider',
        name: 'Dr Fatma Ben Said',
        avatar: null,
      },
    });

    expect(optimisticMessage).toMatchObject({
      conversationId: CONVERSATION_ID,
      senderId: PROVIDER_ID,
      sender: {
        id: PROVIDER_ID,
        fullName: 'Dr Fatma Ben Said',
        role: 'provider',
        avatarUrl: null,
      },
      messageType: 'text',
      content: 'Je suis en route.',
      attachmentUrl: null,
      attachmentName: null,
      attachmentSizeBytes: null,
      attachmentMimeType: null,
      latitude: null,
      longitude: null,
      isRead: false,
      readAt: null,
      metadata: null,
      createdAt: '2026-04-15T12:00:00.000Z',
    });
    expect(optimisticMessage.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
