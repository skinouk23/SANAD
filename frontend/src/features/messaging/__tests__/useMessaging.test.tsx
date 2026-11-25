import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockGetConversationMessages,
  mockIsSendingConversation,
  mockMarkAsReadAsync,
  mockSendLoading,
  mockSendMessageAsync,
} = vi.hoisted(() => ({
  mockGetConversationMessages: vi.fn(),
  mockIsSendingConversation: vi.fn(),
  mockMarkAsReadAsync: vi.fn(),
  mockSendLoading: vi.fn(),
  mockSendMessageAsync: vi.fn(),
}));

vi.mock('@/features/messaging/service', async () => {
  const actual = await vi.importActual<typeof import('@/features/messaging/service')>(
    '@/features/messaging/service',
  );

  return {
    ...actual,
    getConversationMessages: mockGetConversationMessages,
  };
});

vi.mock('@/features/messaging/hooks/useMessagingMutations', () => ({
  useSendMessage: () => ({
    mutateAsync: mockSendMessageAsync,
    loading: mockSendLoading(),
    error: null,
    isSendingConversation: mockIsSendingConversation,
  }),
  useMarkAsRead: () => ({
    mutateAsync: mockMarkAsReadAsync,
    loading: false,
    error: null,
  }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'patient-1',
      role: 'patient',
      name: 'Patient User',
      avatar: null,
    },
  }),
}));

import { messagesOptions } from '@/features/messaging';
import { useChat } from '@/features/messaging/hooks/useMessaging';
import type { ConversationMessagesResponse } from '@/features/messaging/schema';

const CONVERSATION_ID = '10000000-0000-4000-8000-000000000001';
const OTHER_CONVERSATION_ID = '10000000-0000-4000-8000-000000000002';
const CURRENT_USER_ID = 'patient-1';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createQueryClient();

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

function buildConversationMessagesResponse(
  conversationId: string = CONVERSATION_ID,
): ConversationMessagesResponse {
  return {
    items: [
      {
        id: '40000000-0000-4000-8000-000000000001',
        conversationId,
        senderId: '30000000-0000-4000-8000-000000000001',
        sender: {
          id: '30000000-0000-4000-8000-000000000001',
          fullName: 'Dr Fatma Ben Said',
          role: 'provider',
          avatarUrl: 'https://example.com/provider.png',
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
        createdAt: '2026-04-15T12:00:00.000Z',
      },
    ],
    pagination: {
      page: 1,
      limit: 30,
      total: 1,
      totalPages: 1,
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  mockGetConversationMessages.mockReset();
  mockIsSendingConversation.mockReset();
  mockMarkAsReadAsync.mockReset();
  mockSendLoading.mockReset();
  mockSendMessageAsync.mockReset();
});

beforeEach(() => {
  mockIsSendingConversation.mockReturnValue(false);
  mockMarkAsReadAsync.mockResolvedValue(undefined);
  mockSendLoading.mockReturnValue(false);
  mockSendMessageAsync.mockResolvedValue(null);
});

describe('useChat', () => {
  it('does not mark a conversation as read when the initial message load fails', async () => {
    mockGetConversationMessages.mockRejectedValueOnce(new Error('messages unavailable'));

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.initialLoadError).toBeInstanceOf(Error);
    });

    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
  });

  it('marks a conversation as read only after the initial message load succeeds', async () => {
    mockGetConversationMessages.mockResolvedValueOnce(buildConversationMessagesResponse());
    mockMarkAsReadAsync.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });

    await waitFor(() => {
      expect(mockMarkAsReadAsync).toHaveBeenCalledWith(CONVERSATION_ID);
    });
  });

  it('reports sending only for the active conversation pending sends', async () => {
    mockGetConversationMessages.mockResolvedValueOnce(
      buildConversationMessagesResponse(OTHER_CONVERSATION_ID),
    );
    mockSendLoading.mockReturnValue(true);
    mockIsSendingConversation.mockImplementation(
      (conversationId: string) => conversationId === CONVERSATION_ID,
    );

    const { result } = renderHook(() => useChat(OTHER_CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });

    expect(result.current.sending).toBe(false);
  });

  it('suppresses active conversation polling while it still has a pending optimistic send', async () => {
    vi.useFakeTimers();

    let hasPendingOptimisticSend = true;
    mockGetConversationMessages.mockResolvedValue(buildConversationMessagesResponse());
    mockSendLoading.mockImplementation(() => hasPendingOptimisticSend);
    mockIsSendingConversation.mockImplementation(
      (conversationId: string) => conversationId === CONVERSATION_ID && hasPendingOptimisticSend,
    );

    const { result, rerender } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await Promise.resolve();
      await vi.runOnlyPendingTimersAsync();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(mockGetConversationMessages).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(mockGetConversationMessages).toHaveBeenCalledTimes(1);

    hasPendingOptimisticSend = false;
    rerender();

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(mockGetConversationMessages.mock.calls.length).toBeGreaterThan(1);
  });

  it('marks the conversation as read when the first visible message arrives after an initially empty load', async () => {
    const emptyResponse: ConversationMessagesResponse = {
      items: [],
      pagination: {
        page: 1,
        limit: 30,
        total: 0,
        totalPages: 0,
      },
    };

    mockGetConversationMessages
      .mockResolvedValueOnce(emptyResponse)
      .mockResolvedValueOnce(buildConversationMessagesResponse());
    mockMarkAsReadAsync.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(0);
    });
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });
    await waitFor(() => {
      expect(mockMarkAsReadAsync).toHaveBeenCalledWith(CONVERSATION_ID);
    });
  });

  it('retries mark-as-read for the same visible unread message after a transient failure', async () => {
    mockGetConversationMessages
      .mockResolvedValueOnce(buildConversationMessagesResponse())
      .mockResolvedValueOnce(buildConversationMessagesResponse());
    mockMarkAsReadAsync
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });
    await waitFor(() => {
      expect(mockMarkAsReadAsync).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(mockMarkAsReadAsync).toHaveBeenCalledTimes(2);
      expect(mockMarkAsReadAsync).toHaveBeenLastCalledWith(CONVERSATION_ID);
    });
  });

  it('marks a conversation as read when a later visible unread inbound message arrives after an outbound-only history', async () => {
    const [baseInboundMessage] = buildConversationMessagesResponse().items ?? [];

    if (!baseInboundMessage) {
      throw new Error('Expected a base inbound message fixture.');
    }

    const outboundOnlyMessage = {
      ...baseInboundMessage,
      senderId: CURRENT_USER_ID,
      sender: {
        id: CURRENT_USER_ID,
        fullName: 'Patient User',
        role: 'patient',
        avatarUrl: null,
      },
      content: 'Initial outbound message',
    };

    const outboundOnlyHistory: ConversationMessagesResponse = {
      items: [outboundOnlyMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    };

    const inboundReplyHistory: ConversationMessagesResponse = {
      items: [
        outboundOnlyMessage,
        {
          ...baseInboundMessage,
          id: '40000000-0000-4000-8000-000000000002',
          content: 'Unread inbound reply',
          createdAt: '2026-04-15T12:01:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 30,
        total: 2,
        totalPages: 1,
      },
    };

    mockGetConversationMessages
      .mockResolvedValueOnce(outboundOnlyHistory)
      .mockResolvedValueOnce(inboundReplyHistory);

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
    });
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });
    await waitFor(() => {
      expect(mockMarkAsReadAsync).toHaveBeenCalledWith(CONVERSATION_ID);
    });
    expect(mockMarkAsReadAsync).toHaveBeenCalledTimes(1);
  });

  it('prepends older history without replacing the visible conversation', async () => {
    const patientSender = {
      id: CURRENT_USER_ID,
      fullName: 'Patient User',
      role: 'patient',
      avatarUrl: null,
    };
    const olderMessage = {
      ...buildConversationMessagesResponse().items![0],
      id: '40000000-0000-4000-8000-000000000010',
      senderId: CURRENT_USER_ID,
      sender: patientSender,
      content: 'Older message',
      isRead: true,
      readAt: '2026-04-15T11:01:00.000Z',
      createdAt: '2026-04-15T11:00:00.000Z',
    };
    const recentMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000011',
      content: 'Recent message',
      createdAt: '2026-04-15T12:00:00.000Z',
    };
    const latestMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000012',
      content: 'Latest message',
      createdAt: '2026-04-15T12:05:00.000Z',
    };

    const latestHistory: ConversationMessagesResponse = {
      items: [latestMessage, recentMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 3,
        totalPages: 1,
      },
    };
    const olderHistory: ConversationMessagesResponse = {
      items: [olderMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    };

    mockGetConversationMessages
      .mockResolvedValueOnce(latestHistory)
      .mockResolvedValueOnce(olderHistory);

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Recent message',
        'Latest message',
      ]);
    });

    await act(async () => {
      await result.current.loadOlderMessages();
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Older message',
        'Recent message',
        'Latest message',
      ]);
    });
    expect(result.current.hasOlderMessages).toBe(false);
    expect(mockGetConversationMessages).toHaveBeenNthCalledWith(2, CONVERSATION_ID, {
      page: 1,
      limit: 30,
      before: '2026-04-15T12:00:00.001Z',
    });
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
  });

  it('ignores a stale older-history response after switching conversations', async () => {
    const patientSender = {
      id: CURRENT_USER_ID,
      fullName: 'Patient User',
      role: 'patient',
      avatarUrl: null,
    };
    const currentConversationLatest: ConversationMessagesResponse = {
      items: [
        {
          ...buildConversationMessagesResponse(CONVERSATION_ID).items![0],
          id: '40000000-0000-4000-8000-000000000020',
          senderId: CURRENT_USER_ID,
          sender: patientSender,
          content: 'Current conversation latest',
          isRead: true,
          readAt: '2026-04-15T12:11:00.000Z',
          createdAt: '2026-04-15T12:10:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 30,
        total: 2,
        totalPages: 1,
      },
    };
    const currentConversationOlder: ConversationMessagesResponse = {
      items: [
        {
          ...buildConversationMessagesResponse(CONVERSATION_ID).items![0],
          id: '40000000-0000-4000-8000-000000000021',
          senderId: CURRENT_USER_ID,
          sender: patientSender,
          content: 'Current conversation older',
          isRead: true,
          readAt: '2026-04-15T11:01:00.000Z',
          createdAt: '2026-04-15T11:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    };
    const otherConversationLatest: ConversationMessagesResponse = {
      items: [
        {
          ...buildConversationMessagesResponse(OTHER_CONVERSATION_ID).items![0],
          id: '40000000-0000-4000-8000-000000000022',
          conversationId: OTHER_CONVERSATION_ID,
          senderId: CURRENT_USER_ID,
          sender: patientSender,
          content: 'Other conversation latest',
          isRead: true,
          readAt: '2026-04-15T13:01:00.000Z',
          createdAt: '2026-04-15T13:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    };

    let resolveOlderHistory!: (value: ConversationMessagesResponse) => void;
    const olderHistoryPromise = new Promise<ConversationMessagesResponse>((resolve) => {
      resolveOlderHistory = resolve;
    });

    mockGetConversationMessages
      .mockResolvedValueOnce(currentConversationLatest)
      .mockImplementationOnce(() => olderHistoryPromise)
      .mockResolvedValueOnce(otherConversationLatest);

    let activeConversationId = CONVERSATION_ID;
    const { result, rerender } = renderHook(() => useChat(activeConversationId), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Current conversation latest',
      ]);
    });

    const loadOlderPromise = result.current.loadOlderMessages();

    activeConversationId = OTHER_CONVERSATION_ID;
    rerender();

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Other conversation latest',
      ]);
    });

    resolveOlderHistory(currentConversationOlder);
    await act(async () => {
      await loadOlderPromise;
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Other conversation latest',
      ]);
      expect(result.current.loadingOlderMessages).toBe(false);
    });
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
  });

  it('does not mix retained history into another cached conversation when switching threads', async () => {
    const patientSender = {
      id: CURRENT_USER_ID,
      fullName: 'Patient User',
      role: 'patient',
      avatarUrl: null,
    };
    const currentConversationLatest: ConversationMessagesResponse = {
      items: [
        {
          ...buildConversationMessagesResponse(CONVERSATION_ID).items![0],
          id: '40000000-0000-4000-8000-000000000028',
          senderId: CURRENT_USER_ID,
          sender: patientSender,
          content: 'Current conversation latest',
          isRead: true,
          readAt: '2026-04-15T12:11:00.000Z',
          createdAt: '2026-04-15T12:10:00.000Z',
        },
      ],
      pagination: { page: 1, limit: 30, total: 2, totalPages: 1 },
    };
    const currentConversationOlder: ConversationMessagesResponse = {
      items: [
        {
          ...buildConversationMessagesResponse(CONVERSATION_ID).items![0],
          id: '40000000-0000-4000-8000-000000000029',
          senderId: CURRENT_USER_ID,
          sender: patientSender,
          content: 'Current conversation older',
          isRead: true,
          readAt: '2026-04-15T11:01:00.000Z',
          createdAt: '2026-04-15T11:00:00.000Z',
        },
      ],
      pagination: { page: 1, limit: 30, total: 1, totalPages: 1 },
    };
    const otherConversationLatest: ConversationMessagesResponse = {
      items: [
        {
          ...buildConversationMessagesResponse(OTHER_CONVERSATION_ID).items![0],
          id: '40000000-0000-4000-8000-00000000002a',
          conversationId: OTHER_CONVERSATION_ID,
          senderId: CURRENT_USER_ID,
          sender: patientSender,
          content: 'Other conversation latest',
          isRead: true,
          readAt: '2026-04-15T13:01:00.000Z',
          createdAt: '2026-04-15T13:00:00.000Z',
        },
      ],
      pagination: { page: 1, limit: 30, total: 1, totalPages: 1 },
    };

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
          refetchOnWindowFocus: false,
          staleTime: Infinity,
        },
        mutations: { retry: false },
      },
    });
    queryClient.setQueryData(
      messagesOptions(OTHER_CONVERSATION_ID, { page: 1, limit: 30 }).queryKey,
      otherConversationLatest,
    );

    mockGetConversationMessages
      .mockResolvedValueOnce(currentConversationLatest)
      .mockResolvedValueOnce(currentConversationOlder);

    let activeConversationId = CONVERSATION_ID;
    const { result, rerender } = renderHook(() => useChat(activeConversationId), {
      wrapper: createQueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Current conversation latest',
      ]);
    });

    await act(async () => {
      await result.current.loadOlderMessages();
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Current conversation older',
        'Current conversation latest',
      ]);
    });

    activeConversationId = OTHER_CONVERSATION_ID;
    rerender();

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Other conversation latest',
      ]);
    });
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
  });

  it('retains already visible boundary messages when the latest page window advances', async () => {
    const patientSender = {
      id: CURRENT_USER_ID,
      fullName: 'Patient User',
      role: 'patient',
      avatarUrl: null,
    };
    const olderMessage = {
      ...buildConversationMessagesResponse().items![0],
      id: '40000000-0000-4000-8000-000000000030',
      senderId: CURRENT_USER_ID,
      sender: patientSender,
      content: 'Older message',
      isRead: true,
      readAt: '2026-04-15T11:01:00.000Z',
      createdAt: '2026-04-15T11:00:00.000Z',
    };
    const boundaryMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000031',
      content: 'Boundary message',
      createdAt: '2026-04-15T12:00:00.000Z',
    };
    const latestMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000032',
      content: 'Latest message',
      createdAt: '2026-04-15T12:05:00.000Z',
    };
    const newestMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000033',
      content: 'Newest message',
      createdAt: '2026-04-15T12:10:00.000Z',
    };

    const initialLatestWindow: ConversationMessagesResponse = {
      items: [latestMessage, boundaryMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 3,
        totalPages: 1,
      },
    };
    const olderHistory: ConversationMessagesResponse = {
      items: [olderMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    };
    const advancedLatestWindow: ConversationMessagesResponse = {
      items: [newestMessage, latestMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 4,
        totalPages: 1,
      },
    };

    mockGetConversationMessages
      .mockResolvedValueOnce(initialLatestWindow)
      .mockResolvedValueOnce(olderHistory)
      .mockResolvedValueOnce(advancedLatestWindow);

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Boundary message',
        'Latest message',
      ]);
    });

    await act(async () => {
      await result.current.loadOlderMessages();
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Older message',
        'Boundary message',
        'Latest message',
      ]);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.messages.map((message) => message.content)).toEqual([
        'Older message',
        'Boundary message',
        'Latest message',
        'Newest message',
      ]);
    });
    expect(result.current.hasOlderMessages).toBe(false);
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
  });

  it('retains dropped boundary messages even when page-window timestamps tie', async () => {
    const patientSender = {
      id: CURRENT_USER_ID,
      fullName: 'Patient User',
      role: 'patient',
      avatarUrl: null,
    };
    const olderMessage = {
      ...buildConversationMessagesResponse().items![0],
      id: '40000000-0000-4000-8000-000000000040',
      senderId: CURRENT_USER_ID,
      sender: patientSender,
      content: 'Older message',
      isRead: true,
      readAt: '2026-04-15T11:01:00.000Z',
      createdAt: '2026-04-15T11:00:00.000Z',
    };
    const boundaryMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000041',
      content: 'Boundary message',
      createdAt: '2026-04-15T12:05:00.000Z',
    };
    const latestMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000042',
      content: 'Latest message',
      createdAt: '2026-04-15T12:05:00.000Z',
    };
    const newestMessage = {
      ...olderMessage,
      id: '40000000-0000-4000-8000-000000000043',
      content: 'Newest message',
      createdAt: '2026-04-15T12:10:00.000Z',
    };

    mockGetConversationMessages
      .mockResolvedValueOnce({
        items: [latestMessage, boundaryMessage],
        pagination: { page: 1, limit: 30, total: 3, totalPages: 1 },
      })
      .mockResolvedValueOnce({
        items: [olderMessage],
        pagination: { page: 1, limit: 30, total: 1, totalPages: 1 },
      })
      .mockResolvedValueOnce({
        items: [newestMessage, latestMessage],
        pagination: { page: 1, limit: 30, total: 4, totalPages: 1 },
      });

    const { result } = renderHook(() => useChat(CONVERSATION_ID), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    await act(async () => {
      await result.current.loadOlderMessages();
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(4);
      expect(result.current.messages.map((message) => message.content)).toEqual(
        expect.arrayContaining([
          'Older message',
          'Boundary message',
          'Latest message',
          'Newest message',
        ]),
      );
    });
    expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
  });
});

it('uses a tie-safe cursor so older loads can recover same-timestamp siblings', async () => {
  const patientSender = {
    id: CURRENT_USER_ID,
    fullName: 'Patient User',
    role: 'patient',
    avatarUrl: null,
  };
  const olderMessage = {
    ...buildConversationMessagesResponse().items![0],
    id: '40000000-0000-4000-8000-000000000050',
    senderId: CURRENT_USER_ID,
    sender: patientSender,
    content: 'Older message',
    isRead: true,
    readAt: '2026-04-15T11:01:00.000Z',
    createdAt: '2026-04-15T11:00:00.000Z',
  };
  const visibleBoundaryMessage = {
    ...olderMessage,
    id: '40000000-0000-4000-8000-000000000051',
    content: 'Visible boundary message',
    createdAt: '2026-04-15T12:05:00.000Z',
  };
  const hiddenSiblingMessage = {
    ...olderMessage,
    id: '40000000-0000-4000-8000-000000000052',
    content: 'Hidden same-timestamp sibling',
    createdAt: '2026-04-15T12:05:00.000Z',
  };
  const latestMessage = {
    ...olderMessage,
    id: '40000000-0000-4000-8000-000000000053',
    content: 'Latest message',
    createdAt: '2026-04-15T12:06:00.000Z',
  };

  mockGetConversationMessages
    .mockResolvedValueOnce({
      items: [latestMessage, visibleBoundaryMessage],
      pagination: { page: 1, limit: 30, total: 4, totalPages: 1 },
    })
    .mockResolvedValueOnce({
      items: [hiddenSiblingMessage, olderMessage],
      pagination: { page: 1, limit: 30, total: 2, totalPages: 1 },
    });

  const { result } = renderHook(() => useChat(CONVERSATION_ID), {
    wrapper: createQueryWrapper(),
  });

  await waitFor(() => {
    expect(result.current.messages.map((message) => message.content)).toEqual([
      'Visible boundary message',
      'Latest message',
    ]);
  });

  await act(async () => {
    await result.current.loadOlderMessages();
  });

  await waitFor(() => {
    expect(result.current.messages).toHaveLength(4);
    expect(result.current.messages.map((message) => message.content)).toEqual(
      expect.arrayContaining([
        'Older message',
        'Visible boundary message',
        'Hidden same-timestamp sibling',
        'Latest message',
      ]),
    );
  });
  expect(mockGetConversationMessages).toHaveBeenNthCalledWith(2, CONVERSATION_ID, {
    page: 1,
    limit: 30,
    before: '2026-04-15T12:05:00.001Z',
  });
  expect(mockMarkAsReadAsync).not.toHaveBeenCalled();
});
