import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import {
  getConversationMessages,
  getConversations,
  getOrCreateConversation,
  sendTextMessage,
} from '@/features/messaging/service';

const CONVERSATION_ID = '10000000-0000-4000-8000-000000000001';
const PATIENT_ID = '20000000-0000-4000-8000-000000000001';
const PROVIDER_ID = '30000000-0000-4000-8000-000000000001';
const MESSAGE_ID = '40000000-0000-4000-8000-000000000001';

const VALID_CONVERSATION_RESPONSE = {
  id: CONVERSATION_ID,
  isActive: true,
  patient: {
    id: PATIENT_ID,
    fullName: 'Mohamed Ali',
    avatarUrl: null,
  },
  provider: {
    id: PROVIDER_ID,
    fullName: 'Dr Fatma',
    specialty: 'nursing',
    avatarUrl: null,
  },
  lastMessageAt: '2026-04-15T09:30:00Z',
  lastMessagePreview: 'Bonjour',
  lastMessageBy: PATIENT_ID,
  unreadCount: 1,
  canSendMessage: false,
  messagingBlockedReason: 'provider_disabled_patient_messages',
  updatedAt: '2026-04-15T09:30:00Z',
} as const;

const VALID_MESSAGE_RESPONSE = {
  id: MESSAGE_ID,
  conversationId: CONVERSATION_ID,
  senderId: PATIENT_ID,
  sender: {
    id: PATIENT_ID,
    fullName: 'Mohamed Ali',
    role: 'patient',
    avatarUrl: null,
  },
  messageType: 'text',
  content: 'Bonjour',
  attachmentUrl: null,
  attachmentName: null,
  attachmentSizeBytes: null,
  attachmentMimeType: null,
  latitude: null,
  longitude: null,
  isRead: false,
  readAt: null,
  metadata: null,
  createdAt: '2026-04-15T09:31:00Z',
} as const;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('messaging service contract', () => {
  it('preserves conversations pagination and sendability metadata', async () => {
    const apiGetSpy = vi.spyOn(api, 'get').mockResolvedValueOnce({
      items: [VALID_CONVERSATION_RESPONSE],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const result = await getConversations({ unreadOnly: true, searchQuery: 'fatma' });

    expect(apiGetSpy).toHaveBeenCalledWith('/conversations', {
      params: { unreadOnly: true, searchQuery: 'fatma' },
    });
    expect(result.pagination.total).toBe(1);
    expect(result.items?.[0]).toMatchObject({
      canSendMessage: false,
      messagingBlockedReason: 'provider_disabled_patient_messages',
    });
  });

  it('forwards page, limit, and before to the messages endpoint', async () => {
    const apiGetSpy = vi.spyOn(api, 'get').mockResolvedValueOnce({
      items: [],
      pagination: { page: 2, limit: 30, total: 0, totalPages: 0 },
    });

    await getConversationMessages(CONVERSATION_ID, {
      page: 2,
      limit: 30,
      before: '2026-04-14T08:00:00Z',
    });

    expect(apiGetSpy).toHaveBeenCalledWith(`/conversations/${CONVERSATION_ID}/messages`, {
      params: { page: 2, limit: 30, before: '2026-04-14T08:00:00Z' },
    });
  });

  it.each([[{ providerId: PROVIDER_ID }], [{ patientId: PATIENT_ID }]])(
    'posts get-or-create request as %o without participantIds wrapper',
    async (request) => {
      const apiPostSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
        ...VALID_CONVERSATION_RESPONSE,
        canSendMessage: true,
        messagingBlockedReason: null,
        unreadCount: 0,
        lastMessageAt: null,
        lastMessagePreview: null,
        lastMessageBy: null,
      });

      await getOrCreateConversation(request);

      expect(apiPostSpy).toHaveBeenCalledWith('/conversations', request);
    },
  );
  it('rejects get-or-create requests that omit both counterpart ids', async () => {
    const apiPostSpy = vi.spyOn(api, 'post');

    await expect(getOrCreateConversation({} as never)).rejects.toThrow();
    expect(apiPostSpy).not.toHaveBeenCalled();
  });

  it('rejects get-or-create requests that provide both counterpart ids', async () => {
    const apiPostSpy = vi.spyOn(api, 'post');

    await expect(
      getOrCreateConversation({ providerId: PROVIDER_ID, patientId: PATIENT_ID } as never),
    ).rejects.toThrow();
    expect(apiPostSpy).not.toHaveBeenCalled();
  });

  it('posts text messages with explicit text message type', async () => {
    const apiPostSpy = vi.spyOn(api, 'post').mockResolvedValueOnce(VALID_MESSAGE_RESPONSE);

    await expect(
      sendTextMessage(CONVERSATION_ID, {
        content: 'Bonjour',
      }),
    ).resolves.toMatchObject({
      id: MESSAGE_ID,
      messageType: 'text',
      content: 'Bonjour',
    });

    expect(apiPostSpy).toHaveBeenCalledWith(`/conversations/${CONVERSATION_ID}/messages`, {
      messageType: 'text',
      content: 'Bonjour',
    });
  });
});
