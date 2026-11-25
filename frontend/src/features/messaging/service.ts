/**
 * Messaging Service
 *
 * Pure API client for the messaging domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { api } from '@/api/client';
import {
  ConversationResponseSchema,
  ConversationsResponseSchema,
  MessageResponseSchema,
  ConversationMessagesResponseSchema,
  ConversationEntryStatusResponseSchema,
  UnreadCountResponseSchema,
  MarkAsReadResponseSchema,
  GetOrCreateConversationRequestSchema,
} from './schema';
import type {
  ConversationResponse,
  ConversationsResponse,
  ConversationEntryStatusResponse,
  MessageResponse,
  ConversationMessagesResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  GetOrCreateConversationRequest,
} from './schema';

// ============================================
// FILTER TYPES
// ============================================

export interface ConversationFilters {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  includeInactive?: boolean;
  searchQuery?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface MessageFilters {
  page?: number;
  limit?: number;
  before?: string;
}

export interface SendTextMessageRequest {
  content: string;
}

// ============================================
// CONVERSATION QUERIES
// ============================================

/** Fetch a paginated list of conversations. */
export async function getConversations(
  filters?: ConversationFilters,
): Promise<ConversationsResponse> {
  const raw = await api.get<ConversationsResponse>('/conversations', {
    params: filters,
  });

  return ConversationsResponseSchema.parse(raw);
}

/** Fetch a single conversation by ID. */
export async function getConversation(id: string): Promise<ConversationResponse> {
  const raw = await api.get<ConversationResponse>(`/conversations/${id}`);
  return ConversationResponseSchema.parse(raw);
}

/** Fetch patient entry status for opening or creating a provider conversation. */
export async function getConversationEntryStatus(
  providerId: string,
): Promise<ConversationEntryStatusResponse> {
  const raw = await api.get<ConversationEntryStatusResponse>('/conversations/entry-status', {
    params: { providerId },
  });

  return ConversationEntryStatusResponseSchema.parse(raw);
}

/** Fetch a paginated list of messages for one conversation. */
export async function getConversationMessages(
  conversationId: string,
  filters: MessageFilters = { page: 1, limit: 30 },
): Promise<ConversationMessagesResponse> {
  const raw = await api.get<ConversationMessagesResponse>(
    `/conversations/${conversationId}/messages`,
    {
      params: filters,
    },
  );

  return ConversationMessagesResponseSchema.parse(raw);
}

/** Get total unread message count for the authenticated user. */
export async function getUnreadCount(): Promise<number> {
  const raw = await api.get<UnreadCountResponse>('/conversations/unread-count');
  const parsed = UnreadCountResponseSchema.parse(raw);
  return parsed.count;
}

// ============================================
// MUTATIONS
// ============================================

/** Send a text message to a conversation. */
export async function sendTextMessage(
  conversationId: string,
  request: SendTextMessageRequest,
): Promise<MessageResponse> {
  const raw = await api.post<MessageResponse>(`/conversations/${conversationId}/messages`, {
    messageType: 'text',
    content: request.content,
  });

  return MessageResponseSchema.parse(raw);
}

/** Mark all messages in a conversation as read. */
export async function markAsRead(conversationId: string): Promise<MarkAsReadResponse> {
  const raw = await api.post<MarkAsReadResponse>(`/conversations/${conversationId}/read`);
  return MarkAsReadResponseSchema.parse(raw);
}

/** Returns the existing conversation for the requested counterpart or creates it. */
export async function getOrCreateConversation(
  request: GetOrCreateConversationRequest,
): Promise<ConversationResponse> {
  const payload = GetOrCreateConversationRequestSchema.parse(request);
  const raw = await api.post<ConversationResponse>('/conversations', payload);
  return ConversationResponseSchema.parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const messagingService = {
  getConversations,
  getConversation,
  getConversationEntryStatus,
  getConversationMessages,
  getUnreadCount,
  sendTextMessage,
  markAsRead,
  getOrCreateConversation,
};

export type { GetOrCreateConversationRequest } from './schema';
