/**
 * Messaging Query Options
 *
 * Pre-built queryOptions for every messaging query.
 * The messages query includes refetchInterval: 5000 to replace
 * the old manual setInterval polling.
 */

import { queryOptions } from '@tanstack/react-query';
import { messagingKeys } from './keys';
import {
  getConversations,
  getConversation,
  getConversationEntryStatus,
  getConversationMessages,
  getUnreadCount,
} from './service';
import type { ConversationFilters, MessageFilters } from './service';

export function conversationListOptions(filters?: ConversationFilters) {
  return queryOptions({
    queryKey: messagingKeys.conversationList(filters),
    queryFn: () => getConversations(filters),
  });
}

export function conversationDetailOptions(id: string) {
  return queryOptions({
    queryKey: messagingKeys.conversation(id),
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
}

export function conversationEntryStatusOptions(providerId: string) {
  return queryOptions({
    queryKey: messagingKeys.conversationEntryStatus(providerId),
    queryFn: () => getConversationEntryStatus(providerId),
    enabled: !!providerId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function messagesOptions(conversationId: string, filters?: MessageFilters) {
  return queryOptions({
    queryKey: messagingKeys.messages(conversationId, filters),
    queryFn: () => getConversationMessages(conversationId, filters),
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
}

export function unreadCountOptions() {
  return queryOptions({
    queryKey: messagingKeys.unreadCount(),
    queryFn: () => getUnreadCount(),
  });
}
