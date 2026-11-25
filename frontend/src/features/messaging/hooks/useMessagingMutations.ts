/**
 * Messaging Mutation Hooks (TanStack Query)
 *
 * useSendMessage uses optimistic updates to append the new message
 * to the conversation cache immediately, with rollback on failure.
 */

import { useCallback, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { AuthUser } from '@/contexts/AuthContext';
import { messagingKeys } from '@/features/messaging/keys';
import {
  buildOptimisticTextMessage,
  type AuthenticatedMessagingUser,
} from '@/features/messaging/optimistic';
import {
  getOrCreateConversation,
  markAsRead,
  sendTextMessage,
  type GetOrCreateConversationRequest,
} from '@/features/messaging/service';
import type { ConversationMessagesResponse } from '@/features/messaging/schema';

interface SendMessageVariables {
  conversationId: string;
  content: string;
}

function getAuthenticatedMessagingUser(user: AuthUser | null): AuthenticatedMessagingUser {
  if (!user || (user.role !== 'patient' && user.role !== 'provider')) {
    throw new Error('Authenticated messaging user is unavailable.');
  }

  return {
    id: user.id,
    role: user.role,
    name: user.name,
    avatar: null,
  };
}

// ============================================
// SEND MESSAGE (with optimistic update)
// ============================================

export function useSendMessage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const defaultMessageFilters = { page: 1, limit: 30 } as const;
  const pendingOptimisticSendsRef = useRef(new Map<string, number>());
  const [, setPendingOptimisticSendsVersion] = useState(0);

  const notifyPendingOptimisticSendsChanged = useCallback(() => {
    setPendingOptimisticSendsVersion((currentVersion) => currentVersion + 1);
  }, []);

  const trackPendingOptimisticSend = useCallback(
    (conversationId: string): void => {
      const currentPendingSends = pendingOptimisticSendsRef.current.get(conversationId) ?? 0;

      pendingOptimisticSendsRef.current.set(conversationId, currentPendingSends + 1);
      notifyPendingOptimisticSendsChanged();
    },
    [notifyPendingOptimisticSendsChanged],
  );

  const settlePendingOptimisticSend = useCallback(
    (conversationId: string): boolean => {
      const currentPendingSends = pendingOptimisticSendsRef.current.get(conversationId) ?? 0;

      if (currentPendingSends <= 1) {
        pendingOptimisticSendsRef.current.delete(conversationId);
        notifyPendingOptimisticSendsChanged();
        return true;
      }

      pendingOptimisticSendsRef.current.set(conversationId, currentPendingSends - 1);
      notifyPendingOptimisticSendsChanged();
      return false;
    },
    [notifyPendingOptimisticSendsChanged],
  );

  const isSendingConversation = useCallback(
    (conversationId: string): boolean =>
      (pendingOptimisticSendsRef.current.get(conversationId) ?? 0) > 0,
    [],
  );

  const mutation = useMutation({
    mutationFn: ({ conversationId, content }: SendMessageVariables) =>
      sendTextMessage(conversationId, { content }),

    onMutate: async ({ conversationId, content }: SendMessageVariables) => {
      const authenticatedUser = getAuthenticatedMessagingUser(user);
      const messageKey = messagingKeys.messages(conversationId, defaultMessageFilters);

      await qc.cancelQueries({
        queryKey: messageKey,
      });

      const optimisticMessage = buildOptimisticTextMessage({
        conversationId,
        content,
        authenticatedUser,
      });

      qc.setQueryData<ConversationMessagesResponse>(messageKey, (old) => {
        const oldItems = old?.items ?? [];
        const total = (old?.pagination?.total ?? oldItems.length) + 1;
        const limit = old?.pagination?.limit ?? 30;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const items = [optimisticMessage, ...oldItems];
        return {
          items,
          pagination: {
            page: old?.pagination?.page ?? 1,
            limit,
            total,
            totalPages,
          },
        };
      });
      trackPendingOptimisticSend(conversationId);

      return { messageKey, optimisticMessageId: optimisticMessage.id };
    },

    onError: (_err, _vars, context) => {
      if (!context?.messageKey) {
        return;
      }

      qc.setQueryData<ConversationMessagesResponse>(context.messageKey, (current) => {
        if (!current) {
          return current;
        }

        const currentItems = current.items ?? [];
        const items = currentItems.filter((message) => message.id !== context.optimisticMessageId);

        if (items.length === currentItems.length) {
          return current;
        }

        const total = Math.max(0, current.pagination.total - 1);
        const totalPages = total === 0 ? 0 : Math.ceil(total / current.pagination.limit);

        return {
          items,
          pagination: {
            ...current.pagination,
            total,
            totalPages,
          },
        };
      });
    },

    onSettled: (_data, _err, variables) => {
      const invalidations: Promise<unknown>[] = [
        qc.invalidateQueries({
          queryKey: [...messagingKeys.all, 'conversations'] as const,
        }),
        qc.invalidateQueries({
          queryKey: messagingKeys.conversation(variables.conversationId),
        }),
        qc.invalidateQueries({
          queryKey: messagingKeys.unreadCount(),
        }),
      ];

      if (settlePendingOptimisticSend(variables.conversationId)) {
        invalidations.unshift(
          qc.invalidateQueries({
            queryKey: [...messagingKeys.all, 'messages', variables.conversationId] as const,
          }),
        );
      }

      return Promise.all(invalidations);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: pendingOptimisticSendsRef.current.size > 0,
    isSendingConversation,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// MARK AS READ
// ============================================

export function useMarkAsRead() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (conversationId: string) => markAsRead(conversationId),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: [...messagingKeys.all, 'conversations'] as const,
      });
      void qc.invalidateQueries({
        queryKey: messagingKeys.unreadCount(),
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// GET OR CREATE CONVERSATION
// ============================================

export function useGetOrCreateConversation() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: GetOrCreateConversationRequest) => getOrCreateConversation(request),
    onSuccess: (conversation) => {
      void qc.invalidateQueries({
        queryKey: [...messagingKeys.all, 'conversations'] as const,
      });
      void qc.invalidateQueries({
        queryKey: [...messagingKeys.all, 'messages', conversation.id] as const,
      });
      qc.setQueryData(messagingKeys.conversation(conversation.id), conversation);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
