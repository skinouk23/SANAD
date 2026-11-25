/**
 * Messaging MSW Handlers
 *
 * Intercepts all /api/conversations/* requests during development
 * and returns realistic mock data matching the Zod schemas.
 * Replaces the in-code mock branching from messages.service.ts.
 *
 * Conversations are scoped to the authenticated mock participant.
 * Unread counts are derived from unread inbound messages for the active user.
 * Send/read operations are validated against preference state.
 */

import { http, HttpResponse } from 'msw';

import type {
  ConversationEntryStatusResponse,
  ConversationResponse,
  MessageResponse,
  MessagingBlockedReason,
} from '@/features/messaging/schema';
import { getCurrentMockRole } from '@/mocks/handlers/auth';
import { getAuthProfile, getPatientPreferences } from '@/mocks/handlers/patientProfileStore';
import {
  getCurrentMockProviderPreferences,
  getProviderAuthProfile,
} from '@/mocks/handlers/providerAuthoringStore';
import { apiOk, apiNotFound, randomId } from '@/mocks/utils';

// ============================================
// DETERMINISTIC UUIDs (stable across requests)
// ============================================

const IDS = {
  conv1: '10000000-0000-4000-8000-000000000001',
  conv2: '10000000-0000-4000-8000-000000000002',
  conv3: '10000000-0000-4000-8000-000000000003',
  patient1: '20000000-0000-4000-8000-000000000001',
  patient2: '20000000-0000-4000-8000-000000000002',
  patient3: '20000000-0000-4000-8000-000000000003',
  prov1: '30000000-0000-4000-8000-000000000001',
  prov2: '30000000-0000-4000-8000-000000000002',
  currentUser: '40000000-0000-4000-8000-000000000001',
  msg1: '50000000-0000-4000-8000-000000000001',
  msg2: '50000000-0000-4000-8000-000000000002',
  msg3: '50000000-0000-4000-8000-000000000003',
  msg4: '50000000-0000-4000-8000-000000000004',
  msg5: '50000000-0000-4000-8000-000000000005',
} as const;

const SEEDED_PARTICIPANTS = {
  patientId: IDS.patient1,
  providerId: IDS.prov1,
} as const;

// ============================================
// SESSION HELPERS
// ============================================

/**
 * Get the ID of the currently authenticated user based on role.
 */
function getCurrentUserId(): string {
  const role = getCurrentMockRole();
  if (role === 'provider') {
    return getProviderAuthProfile().id;
  }
  return getAuthProfile().id;
}

/**
 * Check if the current user is a patient.
 */
function isCurrentUserPatient(): boolean {
  return getCurrentMockRole() === 'patient';
}

/**
 * Determine if a conversation involves the current user.
 * For seeded test data, we map the seeded IDs to the current authenticated user.
 */
function isConversationParticipant(
  conversation: InternalConversation,
  isPatient: boolean,
): boolean {
  if (isPatient) {
    return conversation.patient?.id === SEEDED_PARTICIPANTS.patientId;
  }

  return conversation.provider?.id === SEEDED_PARTICIPANTS.providerId;
}

/**
 * Derive the unread count for the current user from actual message data.
 * Only unread inbound messages (from the counterpart) count.
 */
function deriveUnreadCount(conversationId: string, isPatient: boolean): number {
  const messages = mockMessages[conversationId] ?? [];
  if (!isPatient) {
    // Provider: count unread messages from patients
    return messages.filter((m) => m.sender?.role === 'patient' && !m.isRead).length;
  }
  // Patient: count unread messages from providers
  return messages.filter((m) => m.sender?.role === 'provider' && !m.isRead).length;
}

// ============================================
// MOCK DATA
// ============================================

interface InternalConversation {
  id: string;
  isActive: boolean;
  patient: { id: string; fullName: string | null; avatarUrl: string | null };
  provider: {
    id: string;
    fullName: string | null;
    specialty: string | null;
    avatarUrl: string | null;
  };
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastMessageBy: string | null;
  updatedAt: string;
}

const mockConversations: InternalConversation[] = [
  {
    id: IDS.conv1,
    isActive: true,
    patient: { id: SEEDED_PARTICIPANTS.patientId, fullName: 'Mohamed Ali', avatarUrl: null },
    provider: {
      id: SEEDED_PARTICIPANTS.providerId,
      fullName: 'Dr. Fatma Ben Said',
      specialty: 'Soins infirmiers',
      avatarUrl: null,
    },
    lastMessageAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    lastMessagePreview: 'Demain matin serait parfait si possible.',
    lastMessageBy: SEEDED_PARTICIPANTS.patientId,
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: IDS.conv2,
    isActive: true,
    patient: { id: IDS.patient2, fullName: 'Ahmed Trabelsi', avatarUrl: null },
    provider: {
      id: IDS.prov2,
      fullName: 'Dr. Sonia Khelifi',
      specialty: 'Kinésithérapie',
      avatarUrl: null,
    },
    lastMessageAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastMessagePreview: 'Merci pour la consultation !',
    lastMessageBy: IDS.patient2,
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: IDS.conv3,
    isActive: true,
    patient: { id: IDS.patient3, fullName: 'Leila Mansouri', avatarUrl: null },
    provider: {
      id: SEEDED_PARTICIPANTS.providerId,
      fullName: 'Dr. Fatma Ben Said',
      specialty: 'Soins infirmiers',
      avatarUrl: null,
    },
    lastMessageAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastMessagePreview: 'Le pansement a bien tenu.',
    lastMessageBy: IDS.patient3,
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const mockMessages: Record<string, MessageResponse[]> = {
  [IDS.conv1]: [
    {
      id: IDS.msg1,
      conversationId: IDS.conv1,
      senderId: SEEDED_PARTICIPANTS.patientId,
      sender: {
        id: SEEDED_PARTICIPANTS.patientId,
        fullName: 'Mohamed Ali',
        role: 'patient',
        avatarUrl: null,
      },
      messageType: 'text',
      content: 'Bonjour, je souhaite prendre rendez-vous pour une consultation.',
      attachmentUrl: null,
      attachmentName: null,
      isRead: true,
      readAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      metadata: null,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: IDS.msg2,
      conversationId: IDS.conv1,
      senderId: SEEDED_PARTICIPANTS.providerId,
      sender: {
        id: SEEDED_PARTICIPANTS.providerId,
        fullName: 'Dr. Fatma Ben Said',
        role: 'provider',
        avatarUrl: null,
      },
      messageType: 'text',
      content: 'Bonjour ! Bien sûr, quand êtes-vous disponible ?',
      attachmentUrl: null,
      attachmentName: null,
      isRead: true,
      readAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      metadata: null,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: IDS.msg3,
      conversationId: IDS.conv1,
      senderId: SEEDED_PARTICIPANTS.patientId,
      sender: {
        id: SEEDED_PARTICIPANTS.patientId,
        fullName: 'Mohamed Ali',
        role: 'patient',
        avatarUrl: null,
      },
      messageType: 'text',
      content: 'Demain matin serait parfait si possible.',
      attachmentUrl: null,
      attachmentName: null,
      isRead: false,
      readAt: null,
      metadata: null,
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  ],
  [IDS.conv2]: [
    {
      id: IDS.msg4,
      conversationId: IDS.conv2,
      senderId: IDS.patient2,
      sender: {
        id: IDS.patient2,
        fullName: 'Ahmed Trabelsi',
        role: 'patient',
        avatarUrl: null,
      },
      messageType: 'text',
      content: 'Merci pour la consultation !',
      attachmentUrl: null,
      attachmentName: null,
      isRead: true,
      readAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      metadata: null,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  [IDS.conv3]: [
    {
      id: IDS.msg5,
      conversationId: IDS.conv3,
      senderId: IDS.patient3,
      sender: {
        id: IDS.patient3,
        fullName: 'Leila Mansouri',
        role: 'patient',
        avatarUrl: null,
      },
      messageType: 'text',
      content: 'Le pansement a bien tenu.',
      attachmentUrl: null,
      attachmentName: null,
      isRead: false,
      readAt: null,
      metadata: null,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
};

/**
 * Filter conversations by search term.
 * Searches across provider name, patient name, and last message preview.
 */
function applySearch(
  searchQuery: string | null,
  items: InternalConversation[],
): InternalConversation[] {
  if (!searchQuery) return items;
  const needle = searchQuery.trim().toLowerCase();
  if (!needle) return items;

  return items.filter((conversation) => {
    const providerName = conversation.provider?.fullName?.toLowerCase() ?? '';
    const patientName = conversation.patient?.fullName?.toLowerCase() ?? '';
    const preview = conversation.lastMessagePreview?.toLowerCase() ?? '';
    return (
      providerName.includes(needle) || patientName.includes(needle) || preview.includes(needle)
    );
  });
}

/**
 * Determine if messaging is allowed for this conversation.
 * Checks:
 * 1. Conversation is active
 * 2. The counterpart allows messages (checks preferences)
 *
 * Returns the sendability state and reason if blocked.
 */
function checkMessagingAccess(
  isActive: boolean,
  isPatient: boolean,
): {
  canSendMessage: boolean;
  messagingBlockedReason: MessagingBlockedReason | null;
  blockedMessage: string | null;
} {
  if (!isActive) {
    return {
      canSendMessage: false,
      messagingBlockedReason: null,
      blockedMessage: 'This conversation has been closed and no longer accepts new messages.',
    };
  }

  const patientAllowsProviderMessages = getPatientPreferences().allowProviderMessages;
  const providerAllowsPatientMessages = getCurrentMockProviderPreferences().allowPatientMessages;

  if (isPatient) {
    return {
      canSendMessage: providerAllowsPatientMessages,
      messagingBlockedReason: providerAllowsPatientMessages
        ? null
        : 'provider_disabled_patient_messages',
      blockedMessage: providerAllowsPatientMessages
        ? null
        : 'Provider has disabled patient messages.',
    };
  }

  return {
    canSendMessage: patientAllowsProviderMessages,
    messagingBlockedReason: patientAllowsProviderMessages
      ? null
      : 'patient_disabled_provider_messages',
    blockedMessage: patientAllowsProviderMessages
      ? null
      : 'Patient has disabled provider messages.',
  };
}

/**
 * Convert an internal conversation to an API response scoped to the current session.
 * - Normalizes patient/provider IDs to match the authenticated user
 * - Includes derived unread count from actual messages
 * - Includes sendability state based on preferences
 */
function toSessionConversation(conversation: InternalConversation): ConversationResponse {
  const isPatient = isCurrentUserPatient();
  const currentUserId = getCurrentUserId();
  const access = checkMessagingAccess(conversation.isActive, isPatient);

  // When returning conversations, normalize the current user's ID to match their auth profile
  const normalizedPatient = isPatient
    ? { ...conversation.patient, id: currentUserId }
    : conversation.patient;
  const normalizedProvider = isPatient
    ? conversation.provider
    : { ...conversation.provider, id: currentUserId };

  const unreadCount = deriveUnreadCount(conversation.id, isPatient);

  return {
    id: conversation.id,
    isActive: conversation.isActive,
    patient: normalizedPatient,
    provider: normalizedProvider,
    lastMessageAt: conversation.lastMessageAt,
    lastMessagePreview: conversation.lastMessagePreview,
    lastMessageBy: conversation.lastMessageBy,
    unreadCount,
    canSendMessage: access.canSendMessage,
    messagingBlockedReason: access.messagingBlockedReason,
    updatedAt: conversation.updatedAt,
  };
}

function buildLockedEntryStatus(providerId: string): ConversationEntryStatusResponse {
  return {
    providerId,
    existingConversationId: null,
    canOpenConversation: false,
    canCreateConversation: false,
    canSendMessage: false,
    messagingBlockedReason: 'no_active_reservation',
  };
}

export const messagingHandlers = [
  // ── GET /api/conversations ──────────────────────────────────
  http.get('*/api/v1/conversations', ({ request }) => {
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';
    const searchQuery = url.searchParams.get('searchQuery');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const page = Number(url.searchParams.get('page') ?? '1');
    const isPatient = isCurrentUserPatient();

    let conversations = mockConversations.filter((c) => isConversationParticipant(c, isPatient));

    if (unreadOnly) {
      // Only include conversations with unread messages for the current user
      conversations = conversations.filter((c) => deriveUnreadCount(c.id, isPatient) > 0);
    }

    conversations = applySearch(searchQuery, conversations);
    conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const start = (page - 1) * limit;
    const sessionConversations = conversations.map(toSessionConversation);
    const items = sessionConversations.slice(start, start + limit);

    return apiOk({
      items,
      pagination: {
        page,
        limit,
        total: conversations.length,
        totalPages: conversations.length === 0 ? 0 : Math.ceil(conversations.length / limit),
      },
    });
  }),

  // ── GET /api/conversations/unread-count ─────────────────────
  http.get('*/api/v1/conversations/unread-count', () => {
    const isPatient = isCurrentUserPatient();

    const count = mockConversations
      .filter((c) => isConversationParticipant(c, isPatient))
      .reduce((sum, c) => sum + deriveUnreadCount(c.id, isPatient), 0);

    return apiOk({ count });
  }),

  // ── GET /api/conversations/entry-status ─────────────────────
  http.get('*/api/v1/conversations/entry-status', ({ request }) => {
    const url = new URL(request.url);
    const providerId = url.searchParams.get('providerId');

    if (!providerId) {
      return apiOk(buildLockedEntryStatus('00000000-0000-4000-8000-000000000000'));
    }

    const isPatient = isCurrentUserPatient();
    const existingConversation = mockConversations.find(
      (conversation) =>
        conversation.provider?.id === providerId &&
        isConversationParticipant(conversation, isPatient),
    );

    if (existingConversation) {
      const access = checkMessagingAccess(existingConversation.isActive, isPatient);

      return apiOk<ConversationEntryStatusResponse>({
        providerId,
        existingConversationId: existingConversation.id,
        canOpenConversation: true,
        canCreateConversation: false,
        canSendMessage: access.canSendMessage,
        messagingBlockedReason: access.messagingBlockedReason,
      });
    }

    return apiOk(buildLockedEntryStatus(providerId));
  }),

  // ── GET /api/conversations/:id ──────────────────────────────
  http.get('*/api/v1/conversations/:id', ({ params }) => {
    const { id } = params;

    // Guard: don't match routes like /conversations/unread-count
    if (id === 'unread-count') return undefined as never;

    const isPatient = isCurrentUserPatient();
    const found = mockConversations.find(
      (c) => c.id === id && isConversationParticipant(c, isPatient),
    );

    if (!found) return apiNotFound(`Conversation ${id as string} not found`);
    return apiOk(toSessionConversation(found));
  }),

  // ── GET /api/conversations/:id/messages ─────────────────────
  http.get('*/api/v1/conversations/:id/messages', ({ params, request }) => {
    const { id } = params;
    const conversationId = id as string;
    const url = new URL(request.url);
    const before = url.searchParams.get('before');
    const limit = Number(url.searchParams.get('limit') ?? '30');
    const page = Number(url.searchParams.get('page') ?? '1');
    const isPatient = isCurrentUserPatient();

    const conversation = mockConversations.find(
      (c) => c.id === conversationId && isConversationParticipant(c, isPatient),
    );
    if (!conversation) {
      return apiNotFound(`Conversation ${conversationId} not found`);
    }

    const allMessages = mockMessages[conversationId] ?? [];
    const filtered = before
      ? allMessages.filter((message) => new Date(message.createdAt) < new Date(before))
      : allMessages;
    const newestFirst = [...filtered].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
    const start = (page - 1) * limit;
    const items = newestFirst.slice(start, start + limit);

    return apiOk({
      items,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: filtered.length === 0 ? 0 : Math.ceil(filtered.length / limit),
      },
    });
  }),

  // ── POST /api/conversations/:id/messages (send) ────────────
  http.post('*/api/v1/conversations/:id/messages', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { content?: string };
    const conversationId = id as string;
    const isPatient = isCurrentUserPatient();
    const currentUserId = getCurrentUserId();
    const currentRole = getCurrentMockRole();

    const conversation = mockConversations.find(
      (item) => item.id === conversationId && isConversationParticipant(item, isPatient),
    );

    if (!conversation) {
      return apiNotFound(`Conversation ${conversationId} not found`);
    }

    const access = checkMessagingAccess(conversation.isActive, isPatient);
    if (!access.canSendMessage) {
      return HttpResponse.json(
        { success: false, data: null, status: 'error', message: access.blockedMessage },
        { status: 400 },
      );
    }

    const newMessage: MessageResponse = {
      id: randomId(),
      conversationId,
      senderId: currentUserId,
      sender: {
        id: currentUserId,
        fullName: 'Vous',
        role: currentRole === 'provider' ? 'provider' : 'patient',
        avatarUrl: null,
      },
      messageType: 'text',
      content: body.content ?? '',
      attachmentUrl: null,
      attachmentName: null,
      isRead: false,
      readAt: null,
      metadata: null,
      createdAt: new Date().toISOString(),
    };

    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    // Update conversation preview
    const convIdx = mockConversations.findIndex((c) => c.id === conversationId);
    if (convIdx !== -1) {
      mockConversations[convIdx] = {
        ...mockConversations[convIdx],
        lastMessageAt: newMessage.createdAt,
        lastMessagePreview: newMessage.content ?? null,
        lastMessageBy: newMessage.senderId,
        updatedAt: newMessage.createdAt,
      };
    }

    return apiOk(newMessage);
  }),

  // ── POST /api/conversations/:id/read (mark as read) ────────
  http.post('*/api/v1/conversations/:id/read', ({ params }) => {
    const { id } = params;
    const conversationId = id as string;
    const isPatient = isCurrentUserPatient();
    const currentUserId = getCurrentUserId();

    const conversation = mockConversations.find(
      (c) => c.id === conversationId && isConversationParticipant(c, isPatient),
    );
    if (!conversation) {
      return apiNotFound(`Conversation ${conversationId} not found`);
    }

    // Only mark unread inbound messages (from the counterpart) as read
    const messages = mockMessages[conversationId];
    let markedCount = 0;
    if (messages) {
      const now = new Date().toISOString();
      messages.forEach((m) => {
        // Mark as read only if:
        // 1. It's unread
        // 2. It's from the counterpart (not sent by current user)
        if (!m.isRead && m.senderId !== currentUserId) {
          m.isRead = true;
          m.readAt = now;
          markedCount++;
        }
      });
    }

    return apiOk({ conversationId, markedCount });
  }),

  // ── POST /api/conversations (create) ───────────────────────
  http.post('*/api/v1/conversations', async ({ request }) => {
    const body = (await request.json()) as { providerId?: string; patientId?: string };
    const hasProviderId = Boolean(body.providerId);
    const hasPatientId = Boolean(body.patientId);

    if (Number(hasProviderId) + Number(hasPatientId) !== 1) {
      throw new Error('Mock conversations handler requires exactly one counterpart id.');
    }

    const isPatient = isCurrentUserPatient();
    const access = checkMessagingAccess(true, isPatient);

    if (!access.canSendMessage) {
      return HttpResponse.json(
        { success: false, data: null, status: 'error', message: access.blockedMessage },
        { status: 400 },
      );
    }

    const patientId = body.providerId ? SEEDED_PARTICIPANTS.patientId : (body.patientId ?? null);
    const providerId = body.providerId ?? SEEDED_PARTICIPANTS.providerId;

    if (!patientId) {
      throw new Error('Mock conversations handler requires a patient id.');
    }

    // Check if a conversation already exists with these participants
    const existingConversation = mockConversations.find(
      (conversation) =>
        conversation.patient?.id === patientId && conversation.provider?.id === providerId,
    );

    if (existingConversation) {
      return apiOk(toSessionConversation(existingConversation));
    }

    // Create a new conversation
    const convId = randomId();
    const newConv: InternalConversation = {
      id: convId,
      isActive: true,
      patient: { id: patientId, fullName: null, avatarUrl: null },
      provider: {
        id: providerId,
        fullName: null,
        specialty: null,
        avatarUrl: null,
      },
      lastMessageAt: null,
      lastMessagePreview: null,
      lastMessageBy: null,
      updatedAt: new Date().toISOString(),
    };

    mockConversations.push(newConv);
    mockMessages[convId] = [];

    return apiOk(toSessionConversation(newConv));
  }),
];
