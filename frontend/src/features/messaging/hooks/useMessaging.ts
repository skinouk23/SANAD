/**
 * Messaging Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * useMessages replaces the manual setInterval with TQ's refetchInterval.
 * useChat is a composition wrapper for a single conversation view.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  conversationListOptions,
  conversationDetailOptions,
  conversationEntryStatusOptions,
  messagesOptions,
  unreadCountOptions,
} from '@/features/messaging/options';
import {
  getConversationMessages,
  type ConversationFilters,
  type MessageFilters,
} from '@/features/messaging/service';
import { useSendMessage, useMarkAsRead } from './useMessagingMutations';
import type {
  ConversationEntryStatusResponse,
  ConversationResponse,
  MessageResponse,
} from '@/features/messaging/schema';
import type { PaginationMetadata } from '@/shared/schemas/common';

interface PaginatedItemsResult<TItem> {
  data: TItem[];
  items: TItem[];
  pagination: PaginationMetadata | null;
  loading: boolean;
  isFetching: boolean;
  isRefreshing: boolean;
  isPlaceholderData: boolean;
  error: Error | null;
  refetch: ReturnType<typeof useQuery>['refetch'];
}
interface ConversationListResult extends PaginatedItemsResult<ConversationResponse> {
  initialLoadError: Error | null;
}
interface MessagesResult extends PaginatedItemsResult<MessageResponse> {
  initialLoadError: Error | null;
  dataUpdatedAt: number;
}

interface ConversationResult {
  data: ConversationResponse | null;
  loading: boolean;
  isFetching: boolean;
  error: Error | null;
  initialLoadError: Error | null;
  refetch: ReturnType<typeof useQuery>['refetch'];
}

interface ConversationEntryStatusResult {
  data: ConversationEntryStatusResponse | null;
  loading: boolean;
  isFetching: boolean;
  error: Error | null;
  initialLoadError: Error | null;
  refetch: ReturnType<typeof useQuery>['refetch'];
}

interface UnreadCountResult {
  data: number;
  loading: boolean;
  error: Error | null;
  refetch: ReturnType<typeof useQuery>['refetch'];
}

type ChatFilters = Pick<MessageFilters, 'page' | 'limit'>;
interface ChatResult {
  messages: MessageResponse[];
  pagination: PaginationMetadata | null;
  loading: boolean;
  error: Error | null;
  initialLoadError: Error | null;
  sendMessage: (content: string) => Promise<MessageResponse | null>;
  sending: boolean;
  isFetching: boolean;
  isRefreshing: boolean;
  isPlaceholderData: boolean;
  hasOlderMessages: boolean;
  loadingOlderMessages: boolean;
  loadOlderMessages: () => Promise<MessageResponse[]>;
  markAsRead: ReturnType<typeof useMarkAsRead>['mutateAsync'];
  refetch: ReturnType<typeof useQuery>['refetch'];
}

// ============================================
// CONVERSATION HOOKS
// ============================================

/**
 * Fetch a list of conversations, optionally filtered.
 */
export function useConversations(filters?: ConversationFilters): ConversationListResult {
  const query = useQuery({
    ...conversationListOptions(filters),
    placeholderData: keepPreviousData,
  });
  const items = query.data?.items ?? [];
  const initialLoadError = query.data === undefined ? query.error : null;

  return {
    data: items,
    items,
    pagination: query.data?.pagination ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    initialLoadError,
    refetch: query.refetch,
  };
}

/**
 * Fetch a single conversation by ID.
 */
export function useConversation(id: string | undefined): ConversationResult {
  const query = useQuery({
    ...conversationDetailOptions(id ?? ''),
    enabled: !!id,
  });
  const initialLoadError = query.data === undefined ? query.error : null;

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    initialLoadError,
    refetch: query.refetch,
  };
}

/**
 * Fetch advisory entry status for a patient opening a provider conversation.
 */
export function useConversationEntryStatus(
  providerId: string | undefined,
  enabled = true,
): ConversationEntryStatusResult {
  const query = useQuery({
    ...conversationEntryStatusOptions(providerId ?? ''),
    enabled: enabled && !!providerId,
  });
  const initialLoadError = query.data === undefined ? query.error : null;

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    initialLoadError,
    refetch: query.refetch,
  };
}

// ============================================
// MESSAGE HOOKS
// ============================================

/**
 * Fetch messages for a conversation.
 * Uses TQ's refetchInterval (5s) — no manual setInterval needed.
 */
export function useMessages(
  conversationId: string | undefined,
  filters?: MessageFilters,
  pausePolling = false,
): MessagesResult {
  const query = useQuery({
    ...messagesOptions(conversationId ?? '', filters),
    enabled: !!conversationId,
    refetchInterval: pausePolling ? false : 5000,
    placeholderData: keepPreviousData,
  });
  const items = useMemo(() => [...(query.data?.items ?? [])].reverse(), [query.data?.items]);
  const initialLoadError = query.data === undefined ? query.error : null;

  return {
    data: items,
    items,
    pagination: query.data?.pagination ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    initialLoadError,
    dataUpdatedAt: query.dataUpdatedAt,
    refetch: query.refetch,
  };
}

/**
 * Fetch total unread message count for the authenticated user.
 */
export function useUnreadCount(): UnreadCountResult {
  const query = useQuery(unreadCountOptions());

  return {
    data: query.data ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

function mergeChronologicalMessages(
  olderMessages: MessageResponse[],
  latestMessages: MessageResponse[],
): MessageResponse[] {
  const messagesById = new Map<string, MessageResponse>();

  for (const message of [...olderMessages, ...latestMessages]) {
    messagesById.set(message.id, message);
  }

  return [...messagesById.values()].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
}

const EMPTY_MESSAGE_LIST: MessageResponse[] = [];

// ============================================
// CHAT COMPOSITION HOOK
// ============================================

/**
 * Combined hook that wires together messages, send status, mark-as-read, and
 * older-history loading for a single conversation view.
 */
export function useChat(conversationId: string | undefined, filters?: ChatFilters): ChatResult {
  const { user } = useAuth();
  const currentUserId = user?.id ?? '';
  const latestMessageFilters = useMemo(
    () => ({
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 30,
    }),
    [filters?.limit, filters?.page],
  );
  const historyKey = useMemo(
    () =>
      `${conversationId ?? '__no-conversation__'}:${latestMessageFilters.page}:${latestMessageFilters.limit}`,
    [conversationId, latestMessageFilters.limit, latestMessageFilters.page],
  );
  const [historicalMessagesByKey, setHistoricalMessagesByKey] = useState<
    Record<string, MessageResponse[]>
  >({});
  const [loadingOlderHistoryKey, setLoadingOlderHistoryKey] = useState<string | null>(null);
  const historicalMessages = historicalMessagesByKey[historyKey] ?? EMPTY_MESSAGE_LIST;
  const loadingOlderMessages = loadingOlderHistoryKey === historyKey;
  const activeHistoryKeyRef = useRef(historyKey);
  const olderHistoryRequestIdRef = useRef(0);
  const previousVisibleMessagesRef = useRef<MessageResponse[]>([]);
  const { mutateAsync: sendMessageAsync, isSendingConversation } = useSendMessage();
  const sending = conversationId ? isSendingConversation(conversationId) : false;
  const {
    data: latestMessages,
    pagination,
    loading,
    error,
    initialLoadError,
    dataUpdatedAt,
    isFetching,
    isRefreshing,
    isPlaceholderData,
    refetch,
  } = useMessages(conversationId, latestMessageFilters, sending);
  const messages = useMemo(
    () => mergeChronologicalMessages(historicalMessages, latestMessages),
    [historicalMessages, latestMessages],
  );

  useEffect(() => {
    activeHistoryKeyRef.current = historyKey;
    olderHistoryRequestIdRef.current += 1;
    previousVisibleMessagesRef.current = [];
    setLoadingOlderHistoryKey((currentKey) => (currentKey === historyKey ? null : currentKey));
  }, [historyKey]);

  useEffect(() => {
    if (latestMessages.length === 0) {
      return;
    }

    const oldestLatestMessageTimestamp = new Date(latestMessages[0].createdAt).getTime();
    const latestMessageIds = new Set(latestMessages.map((message) => message.id));
    const retainedBoundaryMessages = previousVisibleMessagesRef.current.filter(
      (message) =>
        !latestMessageIds.has(message.id) &&
        new Date(message.createdAt).getTime() <= oldestLatestMessageTimestamp,
    );

    setHistoricalMessagesByKey((currentHistoricalMessagesByKey) => {
      const currentHistoricalMessages = currentHistoricalMessagesByKey[historyKey] ?? [];
      const nextHistoricalMessages = mergeChronologicalMessages(
        currentHistoricalMessages,
        retainedBoundaryMessages,
      );

      if (
        nextHistoricalMessages.length === currentHistoricalMessages.length &&
        nextHistoricalMessages.every(
          (message, index) => message.id === currentHistoricalMessages[index]?.id,
        )
      ) {
        return currentHistoricalMessagesByKey;
      }

      return {
        ...currentHistoricalMessagesByKey,
        [historyKey]: nextHistoricalMessages,
      };
    });
  }, [historyKey, latestMessages]);

  useEffect(() => {
    previousVisibleMessagesRef.current = messages;
  }, [messages]);

  const hasOlderMessages = (pagination?.total ?? messages.length) > messages.length;
  const oldestLoadedMessageCreatedAt = messages[0]?.createdAt ?? null;

  const loadOlderMessages = useCallback(async () => {
    if (
      !conversationId ||
      !oldestLoadedMessageCreatedAt ||
      loadingOlderMessages ||
      !hasOlderMessages
    ) {
      return [];
    }

    const requestConversationId = conversationId;
    const requestHistoryKey = historyKey;
    const requestId = olderHistoryRequestIdRef.current + 1;
    const olderHistoryCursor = new Date(
      new Date(oldestLoadedMessageCreatedAt).getTime() + 1,
    ).toISOString();
    olderHistoryRequestIdRef.current = requestId;
    setLoadingOlderHistoryKey(requestHistoryKey);

    try {
      const response = await getConversationMessages(requestConversationId, {
        page: 1,
        limit: latestMessageFilters.limit,
        before: olderHistoryCursor,
      });

      if (
        activeHistoryKeyRef.current !== requestHistoryKey ||
        olderHistoryRequestIdRef.current !== requestId
      ) {
        return [];
      }

      const olderBatch = [...(response.items ?? [])].reverse();

      setHistoricalMessagesByKey((currentHistoricalMessagesByKey) => {
        const currentHistoricalMessages = currentHistoricalMessagesByKey[requestHistoryKey] ?? [];
        const nextHistoricalMessages = mergeChronologicalMessages(
          currentHistoricalMessages,
          olderBatch,
        );

        if (
          nextHistoricalMessages.length === currentHistoricalMessages.length &&
          nextHistoricalMessages.every(
            (message, index) => message.id === currentHistoricalMessages[index]?.id,
          )
        ) {
          return currentHistoricalMessagesByKey;
        }

        return {
          ...currentHistoricalMessagesByKey,
          [requestHistoryKey]: nextHistoricalMessages,
        };
      });

      return olderBatch;
    } finally {
      if (
        activeHistoryKeyRef.current === requestHistoryKey &&
        olderHistoryRequestIdRef.current === requestId
      ) {
        setLoadingOlderHistoryKey((currentKey) =>
          currentKey === requestHistoryKey ? null : currentKey,
        );
      }
    }
  }, [
    conversationId,
    hasOlderMessages,
    historyKey,
    latestMessageFilters.limit,
    loadingOlderMessages,
    oldestLoadedMessageCreatedAt,
  ]);

  const { mutateAsync: markAsReadAsync } = useMarkAsRead();
  const latestVisibleUnreadInboundMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];

      if (!message.isRead && message.senderId !== currentUserId) {
        return message.id;
      }
    }

    return null;
  }, [currentUserId, messages]);
  const lastMarkedVisibleUnreadInboundMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    lastMarkedVisibleUnreadInboundMessageIdRef.current = null;
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !latestVisibleUnreadInboundMessageId) {
      return;
    }

    if (
      lastMarkedVisibleUnreadInboundMessageIdRef.current === latestVisibleUnreadInboundMessageId
    ) {
      return;
    }

    lastMarkedVisibleUnreadInboundMessageIdRef.current = latestVisibleUnreadInboundMessageId;
    void markAsReadAsync(conversationId).catch(() => {
      if (
        lastMarkedVisibleUnreadInboundMessageIdRef.current === latestVisibleUnreadInboundMessageId
      ) {
        lastMarkedVisibleUnreadInboundMessageIdRef.current = null;
      }
    });
  }, [conversationId, dataUpdatedAt, latestVisibleUnreadInboundMessageId, markAsReadAsync]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return null;

      const result = await sendMessageAsync({
        conversationId,
        content: content.trim(),
      });

      return result;
    },
    [conversationId, sendMessageAsync],
  );

  return {
    messages,
    pagination,
    loading,
    error,
    initialLoadError,
    sendMessage,
    sending,
    isFetching,
    isRefreshing,
    isPlaceholderData,
    hasOlderMessages,
    loadingOlderMessages,
    loadOlderMessages,
    markAsRead: markAsReadAsync,
    refetch,
  };
}
