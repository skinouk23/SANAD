import type { UserRole } from '@/features/auth/service';
import type { MessageResponse } from '@/features/messaging/schema';

export type MessagingParticipantRole = Extract<UserRole, 'patient' | 'provider'>;

export interface AuthenticatedMessagingUser {
  id: string;
  role: MessagingParticipantRole;
  name: string;
  avatar?: string | null;
}

export interface BuildOptimisticTextMessageInput {
  conversationId: string;
  content: string;
  authenticatedUser: AuthenticatedMessagingUser;
}

function createOptimisticMessageId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const randomNibble = Math.floor(Math.random() * 16);
    const nibble = character === 'x' ? randomNibble : (randomNibble & 0x3) | 0x8;

    return nibble.toString(16);
  });
}

export function buildOptimisticTextMessage({
  conversationId,
  content,
  authenticatedUser,
}: BuildOptimisticTextMessageInput): MessageResponse {
  const now = new Date();

  return {
    id: createOptimisticMessageId(),
    conversationId,
    senderId: authenticatedUser.id,
    sender: {
      id: authenticatedUser.id,
      fullName: authenticatedUser.name,
      role: authenticatedUser.role,
      avatarUrl: authenticatedUser.avatar ?? null,
    },
    messageType: 'text',
    content,
    attachmentUrl: null,
    attachmentName: null,
    attachmentSizeBytes: null,
    attachmentMimeType: null,
    latitude: null,
    longitude: null,
    isRead: false,
    readAt: null,
    metadata: null,
    createdAt: now.toISOString(),
  };
}
