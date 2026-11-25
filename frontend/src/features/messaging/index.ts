/**
 * Messaging Feature — public API
 *
 * Consumers import from here or from the hooks barrel.
 */

export * from './hooks';
export { messagingKeys } from './keys';
export { messagingService } from './service';
export type { ConversationFilters } from './service';
export { getConversationCounterpart, getProviderCategoryLabel } from './display';
export type { ConversationCounterpart, ConversationViewerRole } from './display';
export { MessagingAvatar } from './ui';
export type { MessagingAvatarVariant } from './ui';
export type {
  ConversationResponse,
  ConversationEntryStatusResponse,
  ConversationMessagesResponse,
  MessageResponse,
  MessagingBlockedReason,
} from './schema';
export {
  conversationListOptions,
  conversationDetailOptions,
  conversationEntryStatusOptions,
  messagesOptions,
  unreadCountOptions,
} from './options';
