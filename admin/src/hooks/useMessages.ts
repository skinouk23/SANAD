/**
 * Messages Hooks
 * Custom React hooks for messaging and conversations
 */

import { useCallback, useState, useEffect, useRef } from 'react';
import { useApi, useMutation } from './useApi';
import {
  messagesService,
  ConversationFilters } from
'../services/messages.service';
import type { Conversation, Message } from '../types/api.types';

// ============================================
// CONVERSATION HOOKS
// ============================================

/**
 * Hook for fetching conversations
 */
export function useConversations(filters?: ConversationFilters) {
  const fetchFn = useCallback(
    () => messagesService.getConversations(filters),
    [JSON.stringify(filters)]
  );

  return useApi<Conversation[]>(fetchFn, [JSON.stringify(filters)]);
}

/**
 * Hook for fetching a single conversation
 */
export function useConversation(conversationId: string | undefined) {
  const fetchFn = useCallback(
    () =>
    conversationId ?
    messagesService.getConversationById(conversationId) :
    Promise.resolve(null),
    [conversationId]
  );

  return useApi<Conversation | null>(fetchFn, [conversationId], {
    immediate: !!conversationId
  });
}

/**
 * Hook for fetching unread message count
 */
export function useUnreadCount(userId: string) {
  const fetchFn = useCallback(
    () => messagesService.getUnreadCount(userId),
    [userId]
  );

  return useApi<number>(fetchFn, [userId]);
}

// ============================================
// MESSAGE HOOKS
// ============================================

/**
 * Hook for fetching messages in a conversation with polling
 */
export function useMessages(
conversationId: string | undefined,
pollInterval?: number)
{
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const result = await messagesService.getMessages(conversationId);
      if (mountedRef.current) {
        setMessages(result);
        setLoading(false);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch messages')
        );
        setLoading(false);
      }
    }
  }, [conversationId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchMessages();

    // Set up polling if interval provided
    let intervalId: NodeJS.Timeout | null = null;
    if (pollInterval && conversationId) {
      intervalId = setInterval(fetchMessages, pollInterval);
    }

    return () => {
      mountedRef.current = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchMessages, pollInterval, conversationId]);

  return {
    data: messages,
    loading,
    error,
    refetch: fetchMessages
  };
}

/**
 * Hook for sending a message
 */
export function useSendMessage() {
  return useMutation(
    ({
      conversationId,
      content,
      senderId




    }: {conversationId: string;content: string;senderId: string;}) => messagesService.sendMessage(conversationId, content, senderId)
  );
}

/**
 * Hook for marking messages as read
 */
export function useMarkAsRead() {
  return useMutation(messagesService.markAsRead);
}

/**
 * Hook for creating a new conversation
 */
export function useCreateConversation() {
  return useMutation(messagesService.createConversation);
}

// ============================================
// CHAT HOOK (COMBINED)
// ============================================

/**
 * Combined hook for chat functionality
 */
export function useChat(
conversationId: string | undefined,
currentUserId: string)
{
  const {
    data: messages,
    loading,
    error,
    refetch
  } = useMessages(conversationId, 5000);
  const { mutate: sendMessage, loading: sending } = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();

  // Mark as read when conversation opens
  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId).catch(() => {});
    }
  }, [conversationId, markAsRead]);

  const send = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return null;

      const result = await sendMessage({
        conversationId,
        content: content.trim(),
        senderId: currentUserId
      });

      // Refetch messages after sending
      await refetch();

      return result;
    },
    [conversationId, currentUserId, sendMessage, refetch]
  );

  return {
    messages,
    loading,
    error,
    sending,
    send,
    refetch
  };
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook for formatting message time
 */
export function useMessageTime(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Hook for grouping messages by date
 */
export function useGroupedMessages(messages: Message[]) {
  const groups: {date: string;messages: Message[];}[] = [];
  let currentDate = '';

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt).toLocaleDateString(
      'fr-FR',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }
    );

    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groups.push({ date: messageDate, messages: [message] });
    } else {
      groups[groups.length - 1].messages.push(message);
    }
  });

  return groups;
}