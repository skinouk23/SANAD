import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockUseAuth, mockSendTextMessage } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockSendTextMessage: vi.fn(),
}));

import { useSendMessage } from '@/features/messaging/hooks/useMessagingMutations';
import { messagingKeys } from '@/features/messaging/keys';
import type { ConversationMessagesResponse, MessageResponse } from '@/features/messaging/schema';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/features/messaging/service', async () => {
  const actual = await vi.importActual<typeof import('@/features/messaging/service')>(
    '@/features/messaging/service',
  );

  return {
    ...actual,
    sendTextMessage: mockSendTextMessage,
  };
});

const CONVERSATION_ID = '10000000-0000-4000-8000-000000000001';
const MESSAGE_KEY = messagingKeys.messages(CONVERSATION_ID, { page: 1, limit: 30 });
const OTHER_CONVERSATION_ID = '10000000-0000-4000-8000-000000000002';
const OTHER_MESSAGE_KEY = messagingKeys.messages(OTHER_CONVERSATION_ID, { page: 1, limit: 30 });
const BASE_CACHE: ConversationMessagesResponse = {
  items: [],
  pagination: {
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  },
};
const PROVIDER_USER = {
  id: '30000000-0000-4000-8000-000000000001',
  role: 'provider',
  name: 'Dr Fatma Ben Said',
};

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

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

function buildServerMessage(overrides: Partial<MessageResponse> = {}): MessageResponse {
  return {
    id: '40000000-0000-4000-8000-000000000001',
    conversationId: CONVERSATION_ID,
    senderId: PROVIDER_USER.id,
    sender: {
      id: PROVIDER_USER.id,
      fullName: PROVIDER_USER.name,
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
    ...overrides,
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  mockUseAuth.mockReset();
  mockSendTextMessage.mockReset();
});

describe('useSendMessage', () => {
  it('accepts only conversationId/content and derives optimistic sender metadata from the authenticated user', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const queryClient = createQueryClient();
    const deferred = createDeferred<MessageResponse>();

    queryClient.setQueryData(MESSAGE_KEY, BASE_CACHE);
    mockUseAuth.mockReturnValue({ user: PROVIDER_USER });
    mockSendTextMessage.mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let mutationPromise!: Promise<MessageResponse | null>;
    act(() => {
      mutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Je suis en route.',
      });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toMatchObject({
      items: [
        {
          conversationId: CONVERSATION_ID,
          senderId: PROVIDER_USER.id,
          sender: {
            id: PROVIDER_USER.id,
            fullName: PROVIDER_USER.name,
            role: 'provider',
            avatarUrl: null,
          },
          content: 'Je suis en route.',
          createdAt: '2026-04-15T12:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    });
    expect(mockSendTextMessage).toHaveBeenCalledWith(CONVERSATION_ID, {
      content: 'Je suis en route.',
    });

    deferred.resolve(buildServerMessage());
    await expect(mutationPromise).resolves.toMatchObject({
      id: '40000000-0000-4000-8000-000000000001',
    });
  });

  it('restores a full cached first page when an optimistic send fails', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const queryClient = createQueryClient();
    const deferred = createDeferred<MessageResponse>();
    const initialItems = Array.from({ length: 30 }, (_, index) =>
      buildServerMessage({
        id: `40000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
        content: `Message réel ${index + 1}`,
        createdAt: new Date(Date.UTC(2026, 3, 15, 12, 0, 30 - index)).toISOString(),
      }),
    );
    const initialCache: ConversationMessagesResponse = {
      items: initialItems,
      pagination: {
        page: 1,
        limit: 30,
        total: 30,
        totalPages: 1,
      },
    };

    queryClient.setQueryData(MESSAGE_KEY, initialCache);
    mockUseAuth.mockReturnValue({ user: PROVIDER_USER });
    mockSendTextMessage.mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let mutationPromise!: Promise<MessageResponse | null>;
    act(() => {
      mutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Nouveau message optimiste',
      });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toMatchObject({
      items: [{ content: 'Nouveau message optimiste' }, ...initialItems],
      pagination: {
        total: 31,
        totalPages: 2,
      },
    });

    deferred.reject(new Error('send failed'));
    await expect(mutationPromise).rejects.toThrow('send failed');

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toEqual(
      initialCache,
    );
  });

  it('rolls back only the failed optimistic message when overlapping sends reject independently', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const queryClient = createQueryClient();
    const firstDeferred = createDeferred<MessageResponse>();
    const secondDeferred = createDeferred<MessageResponse>();

    queryClient.setQueryData(MESSAGE_KEY, BASE_CACHE);
    mockUseAuth.mockReturnValue({ user: PROVIDER_USER });
    mockSendTextMessage
      .mockReturnValueOnce(firstDeferred.promise)
      .mockReturnValueOnce(secondDeferred.promise);

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let firstMutationPromise!: Promise<MessageResponse | null>;
    let secondMutationPromise!: Promise<MessageResponse | null>;

    act(() => {
      firstMutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Premier message',
      });
      secondMutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Deuxième message',
      });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toMatchObject({
      items: [{ content: 'Deuxième message' }, { content: 'Premier message' }],
      pagination: {
        total: 2,
        totalPages: 1,
      },
    });

    firstDeferred.reject(new Error('first failed'));
    await expect(firstMutationPromise).rejects.toThrow('first failed');

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toMatchObject({
      items: [{ content: 'Deuxième message' }],
      pagination: {
        total: 1,
        totalPages: 1,
      },
    });

    secondDeferred.reject(new Error('second failed'));
    await expect(secondMutationPromise).rejects.toThrow('second failed');

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toEqual(BASE_CACHE);
  });

  it('keeps a newer optimistic message visible when an older send settles before it', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const queryClient = createQueryClient();
    const firstDeferred = createDeferred<MessageResponse>();
    const secondDeferred = createDeferred<MessageResponse>();
    const serverFirstMessage = buildServerMessage({
      id: '40000000-0000-4000-8000-000000000010',
      content: 'Premier message',
      createdAt: '2026-04-15T12:00:00.000Z',
    });
    const serverSecondMessage = buildServerMessage({
      id: '40000000-0000-4000-8000-000000000011',
      content: 'Deuxième message',
      createdAt: '2026-04-15T12:00:01.000Z',
    });
    let refetchedMessages: ConversationMessagesResponse = {
      items: [serverFirstMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 1,
        totalPages: 1,
      },
    };

    const isMessageHistoryInvalidation = (
      filters: Parameters<typeof queryClient.invalidateQueries>[0] | undefined,
    ): boolean =>
      JSON.stringify(filters?.queryKey) ===
      JSON.stringify([...messagingKeys.all, 'messages', CONVERSATION_ID]);

    queryClient.setQueryData(MESSAGE_KEY, BASE_CACHE);
    mockUseAuth.mockReturnValue({ user: PROVIDER_USER });
    mockSendTextMessage
      .mockReturnValueOnce(firstDeferred.promise)
      .mockReturnValueOnce(secondDeferred.promise);

    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockImplementation(async (filters) => {
        if (isMessageHistoryInvalidation(filters)) {
          queryClient.setQueryData(MESSAGE_KEY, refetchedMessages);
        }

        return undefined;
      });

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let firstMutationPromise!: Promise<MessageResponse | null>;
    let secondMutationPromise!: Promise<MessageResponse | null>;

    act(() => {
      firstMutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Premier message',
      });
      secondMutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Deuxième message',
      });
    });

    await act(async () => {
      await Promise.resolve();
    });

    firstDeferred.resolve(serverFirstMessage);
    await expect(firstMutationPromise).resolves.toMatchObject({
      id: serverFirstMessage.id,
    });

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toMatchObject({
      items: [{ content: 'Deuxième message' }, { content: 'Premier message' }],
      pagination: {
        total: 2,
        totalPages: 1,
      },
    });
    expect(
      invalidateSpy.mock.calls.filter(([filters]) => isMessageHistoryInvalidation(filters)),
    ).toHaveLength(0);

    refetchedMessages = {
      items: [serverSecondMessage, serverFirstMessage],
      pagination: {
        page: 1,
        limit: 30,
        total: 2,
        totalPages: 1,
      },
    };

    secondDeferred.resolve(serverSecondMessage);
    await expect(secondMutationPromise).resolves.toMatchObject({
      id: serverSecondMessage.id,
    });

    expect(queryClient.getQueryData<ConversationMessagesResponse>(MESSAGE_KEY)).toEqual(
      refetchedMessages,
    );
    expect(
      invalidateSpy.mock.calls.filter(([filters]) => isMessageHistoryInvalidation(filters)),
    ).toHaveLength(1);
  });

  it('tracks pending optimistic sends by conversation instead of treating them as global', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const queryClient = createQueryClient();
    const deferred = createDeferred<MessageResponse>();

    queryClient.setQueryData(MESSAGE_KEY, BASE_CACHE);
    queryClient.setQueryData(OTHER_MESSAGE_KEY, BASE_CACHE);
    mockUseAuth.mockReturnValue({ user: PROVIDER_USER });
    mockSendTextMessage.mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let mutationPromise!: Promise<MessageResponse | null>;
    act(() => {
      mutationPromise = result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Premier message',
      });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isSendingConversation(CONVERSATION_ID)).toBe(true);
    expect(result.current.isSendingConversation(OTHER_CONVERSATION_ID)).toBe(false);

    await act(async () => {
      deferred.resolve(buildServerMessage({ content: 'Premier message' }));
      await expect(mutationPromise).resolves.toMatchObject({
        id: '40000000-0000-4000-8000-000000000001',
      });
    });

    expect(result.current.isSendingConversation(CONVERSATION_ID)).toBe(false);
  });
  it('fails truthfully when the authenticated user is not a patient or provider', async () => {
    const queryClient = createQueryClient();

    queryClient.setQueryData(MESSAGE_KEY, BASE_CACHE);
    mockUseAuth.mockReturnValue({
      user: {
        id: '50000000-0000-4000-8000-000000000001',
        role: 'admin',
        name: 'Admin User',
      },
    });

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createQueryWrapper(queryClient),
    });

    await expect(
      result.current.mutateAsync({
        conversationId: CONVERSATION_ID,
        content: 'Je suis en route.',
      }),
    ).rejects.toThrow('Authenticated messaging user is unavailable.');

    expect(queryClient.getQueryData(MESSAGE_KEY)).toEqual(BASE_CACHE);
    expect(mockSendTextMessage).not.toHaveBeenCalled();
  });
});
