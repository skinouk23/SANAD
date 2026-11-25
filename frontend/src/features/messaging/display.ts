import type { ConversationResponse } from '@/features/messaging/schema';

export type ConversationViewerRole = 'patient' | 'provider';

export type ConversationCounterpart =
  | ConversationResponse['patient']
  | ConversationResponse['provider']
  | undefined;

export function getConversationCounterpart(
  conversation: ConversationResponse,
  viewerRole: ConversationViewerRole,
): ConversationCounterpart {
  return viewerRole === 'patient' ? conversation.provider : conversation.patient;
}

export function getProviderCategoryLabel(
  specialty: string | null | undefined,
  categoryLabels: Map<string, string>,
): string {
  if (!specialty) {
    return '';
  }

  return categoryLabels.get(specialty) ?? specialty;
}
