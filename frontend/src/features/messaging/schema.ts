/**
 * Messaging Schemas
 * Zod schemas for conversation and message DTOs.
 * Matches: ConversationResponse, ConversationsResponse,
 *          MessageResponse, ConversationMessagesResponse,
 *          SendMessageRequest, UnreadCountResponse, MarkAsReadResponse
 */

import { z } from 'zod';
import {
  uuidSchema,
  dateTimeSchema,
  nullableDateTime,
  PaginationMetadataSchema,
} from '@/shared/schemas/common';

// ============================================
// CONVERSATION SUB-SCHEMAS
// ============================================

export const ConversationPatientResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const ConversationProviderResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string().nullable().optional(),
  specialty: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const MessagingBlockedReasonSchema = z.enum([
  'patient_disabled_provider_messages',
  'provider_disabled_patient_messages',
  'no_active_reservation',
]);

export const ConversationEntryStatusResponseSchema = z.object({
  providerId: uuidSchema,
  existingConversationId: uuidSchema.nullable().optional(),
  canOpenConversation: z.boolean(),
  canCreateConversation: z.boolean(),
  canSendMessage: z.boolean(),
  messagingBlockedReason: MessagingBlockedReasonSchema.nullable().optional(),
});

// ============================================
// CONVERSATION RESPONSE
// ============================================

export const ConversationResponseSchema = z.object({
  id: uuidSchema,
  isActive: z.boolean(),
  patient: ConversationPatientResponseSchema.optional(),
  provider: ConversationProviderResponseSchema.optional(),
  lastMessageAt: nullableDateTime,
  lastMessagePreview: z.string().nullable().optional(),
  lastMessageBy: uuidSchema.nullable().optional(),
  unreadCount: z.number().int(),
  canSendMessage: z.boolean(),
  messagingBlockedReason: MessagingBlockedReasonSchema.nullable().optional(),
  updatedAt: dateTimeSchema,
});

export const ConversationsResponseSchema = z.object({
  items: z.array(ConversationResponseSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
});

// ============================================
// MESSAGE
// ============================================

export const MessageSenderResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const MessageResponseSchema = z.object({
  id: uuidSchema,
  conversationId: uuidSchema,
  senderId: uuidSchema,
  sender: MessageSenderResponseSchema.optional(),
  messageType: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
  attachmentName: z.string().nullable().optional(),
  attachmentSizeBytes: z.number().int().nullable().optional(),
  attachmentMimeType: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  isRead: z.boolean(),
  readAt: nullableDateTime,
  metadata: z.string().nullable().optional(),
  createdAt: dateTimeSchema,
});

export const ConversationMessagesResponseSchema = z.object({
  items: z.array(MessageResponseSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
});

// ============================================
// SEND MESSAGE
// ============================================

export const SendMessageRequestSchema = z.object({
  messageType: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
  attachmentName: z.string().nullable().optional(),
  attachmentSizeBytes: z.number().int().nullable().optional(),
  attachmentMimeType: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

// ============================================
// UNREAD COUNT
// ============================================

export const UnreadCountResponseSchema = z.object({
  count: z.number().int(),
});

// ============================================
// MARK AS READ
// ============================================

export const MarkAsReadResponseSchema = z.object({
  conversationId: uuidSchema,
  markedCount: z.number().int(),
});

export const GetOrCreateConversationRequestSchema = z.union([
  z.object({
    providerId: uuidSchema,
    patientId: z.never().optional(),
  }),
  z.object({
    patientId: uuidSchema,
    providerId: z.never().optional(),
  }),
]);

// ============================================
// INFERRED TYPES
// ============================================

export type MessagingBlockedReason = z.infer<typeof MessagingBlockedReasonSchema>;
export type ConversationEntryStatusResponse = z.infer<typeof ConversationEntryStatusResponseSchema>;
export type ConversationResponse = z.infer<typeof ConversationResponseSchema>;
export type ConversationsResponse = z.infer<typeof ConversationsResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type ConversationMessagesResponse = z.infer<typeof ConversationMessagesResponseSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>;
export type MarkAsReadResponse = z.infer<typeof MarkAsReadResponseSchema>;
export type GetOrCreateConversationRequest = z.infer<typeof GetOrCreateConversationRequestSchema>;
