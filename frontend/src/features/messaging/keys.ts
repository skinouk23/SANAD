/**
 * Messaging Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   messagingKeys.all                           → invalidate everything messaging-related
 *   messagingKeys.conversations()               → invalidate all conversation lists
 *   messagingKeys.conversationList(filters)     → cache one normalized conversation list
 *   messagingKeys.conversation(id)              → invalidate one conversation
 *   messagingKeys.messageHistory(id)            → target all cached message pages for a conversation
 *   messagingKeys.messages(id, filters)         → cache one normalized message page
 *   messagingKeys.unreadCount()                 → invalidate unread count
 */

import type { ConversationFilters, MessageFilters } from './service';

const DEFAULT_CONVERSATIONS_PAGE = 1;
const DEFAULT_CONVERSATIONS_LIMIT = 20;
const DEFAULT_MESSAGES_PAGE = 1;
const DEFAULT_MESSAGES_LIMIT = 30;

function normalizeSearchQuery(searchQuery?: string) {
  const trimmedQuery = searchQuery?.trim();

  return trimmedQuery ? trimmedQuery : undefined;
}

export function normalizeConversationFilters(filters?: ConversationFilters) {
  const sortBy = filters?.sortBy?.trim();

  return {
    page: filters?.page ?? DEFAULT_CONVERSATIONS_PAGE,
    limit: filters?.limit ?? DEFAULT_CONVERSATIONS_LIMIT,
    unreadOnly: filters?.unreadOnly ?? false,
    includeInactive: filters?.includeInactive ?? false,
    searchQuery: normalizeSearchQuery(filters?.searchQuery),
    sortBy: sortBy || undefined,
    sortDesc: sortBy ? (filters?.sortDesc ?? false) : undefined,
  } as const;
}

export function normalizeMessageFilters(filters?: MessageFilters) {
  const before = filters?.before?.trim();

  return {
    page: filters?.page ?? DEFAULT_MESSAGES_PAGE,
    limit: filters?.limit ?? DEFAULT_MESSAGES_LIMIT,
    before: before || undefined,
  } as const;
}

export const messagingKeys = {
  all: ['messaging'] as const,

  conversations: () => [...messagingKeys.all, 'conversations'] as const,
  conversationList: (filters?: ConversationFilters) =>
    [...messagingKeys.conversations(), normalizeConversationFilters(filters)] as const,
  conversation: (id: string) => [...messagingKeys.conversations(), id] as const,
  conversationEntryStatus: (providerId: string) =>
    [...messagingKeys.conversations(), 'entry-status', providerId] as const,

  messageHistory: (conversationId: string) =>
    [...messagingKeys.all, 'messages', conversationId] as const,
  messages: (conversationId: string, filters?: MessageFilters) =>
    [...messagingKeys.messageHistory(conversationId), normalizeMessageFilters(filters)] as const,

  unreadCount: () => [...messagingKeys.all, 'unread-count'] as const,
} as const;
