import { type ReactElement, useState } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConversationResponse, MessageResponse } from '@/features/messaging/schema';
import { englishTranslations } from '@/i18n/translations/en';
import { germanTranslations } from '@/i18n/translations/de';
import { MessageChatPage } from '@/pages/messaging/MessageChatPage';
import { MessagesPage } from '@/pages/messaging/MessagesPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const {
  mockNavigate,
  mockUseAuth,
  mockUseConversations,
  mockUseUnreadCount,
  mockUseConversation,
  mockUseChat,
  mockUseServiceCategories,
  mockSendMessage,
  mockLoadOlderMessages,
  mockGroupMessagesByDate,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAuth: vi.fn(),
  mockUseConversations: vi.fn(),
  mockUseUnreadCount: vi.fn(),
  mockUseConversation: vi.fn(),
  mockUseChat: vi.fn(),
  mockUseServiceCategories: vi.fn(),
  mockSendMessage: vi.fn(),
  mockLoadOlderMessages: vi.fn(),
  mockGroupMessagesByDate: vi.fn(),
}));

let currentConversationId = 'conversation-1';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ conversationId: currentConversationId }),
  };
});

vi.mock('@/contexts/ThemeContext', async () => {
  const actual =
    await vi.importActual<typeof import('@/contexts/ThemeContext')>('@/contexts/ThemeContext');

  return {
    ...actual,
    useTheme: () => ({ isDark: false }),
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/features/messaging', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/messaging')>('@/features/messaging');

  return {
    ...actual,
    useConversations: mockUseConversations,
    useUnreadCount: mockUseUnreadCount,
    useConversation: mockUseConversation,
    useChat: mockUseChat,
    groupMessagesByDate: mockGroupMessagesByDate,
  };
});

vi.mock('@/features/services', () => ({
  useServiceCategories: mockUseServiceCategories,
}));

function buildMessageResponse(
  overrides: Pick<MessageResponse, 'id' | 'conversationId' | 'senderId' | 'content' | 'createdAt'> &
    Partial<MessageResponse>,
): MessageResponse {
  return {
    id: overrides.id,
    conversationId: overrides.conversationId,
    senderId: overrides.senderId,
    sender: overrides.sender,
    messageType: overrides.messageType ?? 'text',
    content: overrides.content,
    attachmentUrl: overrides.attachmentUrl ?? null,
    attachmentName: overrides.attachmentName ?? null,
    attachmentSizeBytes: overrides.attachmentSizeBytes ?? null,
    attachmentMimeType: overrides.attachmentMimeType ?? null,
    latitude: overrides.latitude ?? null,
    longitude: overrides.longitude ?? null,
    isRead: overrides.isRead ?? false,
    readAt: overrides.readAt ?? null,
    metadata: overrides.metadata ?? null,
    createdAt: overrides.createdAt,
  };
}

function buildConversationResponse(
  overrides: Partial<ConversationResponse> = {},
): ConversationResponse {
  return {
    id: 'conversation-1',
    isActive: true,
    patient: {
      id: 'patient-1',
      fullName: 'Mohamed Ali',
      avatarUrl: null,
    },
    provider: {
      id: 'provider-1',
      fullName: 'Dr Fatma Ben Said',
      specialty: 'nursing',
      avatarUrl: null,
    },
    lastMessageAt: '2026-04-15T08:00:00.000Z',
    lastMessagePreview: 'Bonjour',
    lastMessageBy: 'provider-1',
    unreadCount: 0,
    canSendMessage: true,
    messagingBlockedReason: null,
    updatedAt: '2026-04-15T08:00:00.000Z',
    ...overrides,
  };
}

function renderMessagingUi(ui: ReactElement, locale: 'en-GB' | 'de-DE' = 'en-GB') {
  return renderWithProviders(ui, { locale });
}

beforeEach(() => {
  vi.clearAllMocks();
  currentConversationId = 'conversation-1';
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  mockUseAuth.mockReturnValue({
    user: {
      id: 'patient-1',
      role: 'patient',
      backendRole: 'patient',
      name: 'Patient User',
      avatar: null,
    },
  });
  mockUseConversations.mockReturnValue({
    data: [],
    items: [],
    pagination: null,
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  mockUseUnreadCount.mockReturnValue({
    data: 0,
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  mockUseConversation.mockReturnValue({
    data: buildConversationResponse(),
    loading: false,
    error: null,
    initialLoadError: null,
    refetch: vi.fn(),
  });
  mockUseServiceCategories.mockReturnValue({
    data: [],
    allCategories: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  mockGroupMessagesByDate.mockReturnValue([]);
  mockLoadOlderMessages.mockResolvedValue([]);
  mockSendMessage.mockResolvedValue(null);
  mockUseChat.mockReturnValue({
    messages: [],
    pagination: null,
    loading: false,
    error: null,
    initialLoadError: null,
    refetch: vi.fn(),
    sending: false,
    sendMessage: mockSendMessage,
    hasOlderMessages: false,
    loadingOlderMessages: false,
    loadOlderMessages: mockLoadOlderMessages,
  });
});

describe('MessagesPage role-aware UI', () => {
  it('renders the provider category label for patient viewers and navigates to the conversation', async () => {
    const user = userEvent.setup();
    mockUseServiceCategories.mockReturnValue({
      data: [],
      allCategories: [{ code: 'nursing', label: 'Nursing care' }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseConversations.mockReturnValue({
      data: [buildConversationResponse()],
      items: [buildConversationResponse()],
      pagination: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessagesPage />);

    expect(await screen.findByText('Dr Fatma Ben Said')).toBeInTheDocument();
    expect(screen.getByText('Nursing care')).toBeInTheDocument();

    const conversationButton = screen.getByText('Dr Fatma Ben Said').closest('button');
    expect(conversationButton).not.toBeNull();

    await user.click(conversationButton!);

    expect(mockNavigate).toHaveBeenCalledWith('/messages/conversation-1');
  });

  it('keeps loaded conversations visible when a background refetch fails', async () => {
    mockUseServiceCategories.mockReturnValue({
      data: [],
      allCategories: [{ code: 'nursing', label: 'Nursing care' }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseConversations.mockReturnValue({
      data: [buildConversationResponse()],
      items: [buildConversationResponse()],
      pagination: null,
      loading: false,
      error: new Error('background refetch failed'),
      initialLoadError: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessagesPage />);

    expect(await screen.findByText('Dr Fatma Ben Said')).toBeInTheDocument();
    expect(screen.getByText('Nursing care')).toBeInTheDocument();
    expect(screen.queryByText(englishTranslations.common.loadingError)).not.toBeInTheDocument();
  });

  it('renders the generic patient label for providers and forwards search and unread filters to the backend hook', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: {
        id: 'provider-1',
        role: 'provider',
        backendRole: 'provider',
        name: 'Provider User',
        avatar: null,
      },
    });
    mockUseConversations.mockReturnValue({
      data: [buildConversationResponse({ unreadCount: 2 })],
      items: [buildConversationResponse({ unreadCount: 2 })],
      pagination: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    renderMessagingUi(<MessagesPage />);

    expect(await screen.findByText('Mohamed Ali')).toBeInTheDocument();
    expect(screen.getByText(englishTranslations.messages.patientLabel)).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: englishTranslations.messages.searchPlaceholder }),
      'Mohamed',
    );

    await waitFor(() => {
      expect(mockUseConversations).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchQuery: 'Mohamed',
          unreadOnly: false,
          page: 1,
          limit: 20,
        }),
      );
    });

    await user.click(
      screen.getByRole('button', { name: new RegExp(englishTranslations.common.unread, 'i') }),
    );

    await waitFor(() => {
      expect(mockUseConversations).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchQuery: 'Mohamed',
          unreadOnly: true,
          page: 1,
          limit: 20,
        }),
      );
    });
  });

  it('shows an unauthenticated unavailable state instead of defaulting the inbox to patient', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
    });
    mockUseConversations.mockReturnValue({
      data: [buildConversationResponse()],
      items: [buildConversationResponse()],
      pagination: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessagesPage />);

    expect(await screen.findByText(englishTranslations.chatbot.notConnected)).toBeInTheDocument();
    expect(screen.queryByText('Dr Fatma Ben Said')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: englishTranslations.messages.searchPlaceholder }),
    ).not.toBeInTheDocument();
  });

  it('shows truthful no-results copy when an active search returns zero conversations', async () => {
    const user = userEvent.setup();
    mockUseConversations.mockReturnValue({
      data: [],
      items: [],
      pagination: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessagesPage />);

    await user.type(
      screen.getByRole('textbox', { name: englishTranslations.messages.searchPlaceholder }),
      'missing conversation',
    );

    expect(await screen.findByText(englishTranslations.common.noResults)).toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.noConversations),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.startNewConversation),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: new RegExp(englishTranslations.common.unread, 'i') }),
    );

    expect(await screen.findByText(englishTranslations.common.noResults)).toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.noUnreadMessages),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.allMessagesRead),
    ).not.toBeInTheDocument();
  });
});

describe('MessageChatPage translations', () => {
  it('uses translated not-found copy instead of French fallback text', async () => {
    mockUseConversation.mockReturnValue({
      data: undefined,
      loading: false,
    });

    renderMessagingUi(<MessageChatPage />);

    expect(
      await screen.findByText(englishTranslations.messages.conversationNotFound),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.backToInbox }),
    ).toBeInTheDocument();
  });

  it('shows a retryable load error when conversation details fail instead of claiming not found', async () => {
    const user = userEvent.setup();
    const refetchConversation = vi.fn().mockResolvedValue(undefined);

    mockUseConversation.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('conversation unavailable'),
      initialLoadError: new Error('conversation unavailable'),
      refetch: refetchConversation,
    });

    renderMessagingUi(<MessageChatPage />);

    expect(screen.getByText(englishTranslations.common.loadingError)).toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.conversationNotFound),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: englishTranslations.common.retry }));

    expect(refetchConversation).toHaveBeenCalledTimes(1);
  });

  it('uses translated chat-page copy for provider fallbacks and retained controls', async () => {
    mockUseConversation.mockReturnValue({
      data: buildConversationResponse({
        provider: {
          id: 'provider-1',
          fullName: '',
          specialty: '',
          avatarUrl: null,
        },
      }),
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessageChatPage />);

    expect(await screen.findByText(englishTranslations.auth.professional)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.voiceCall }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.videoCall }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: englishTranslations.common.details })).toBeDisabled();
    expect(screen.getByTitle(englishTranslations.messages.onlineNow)).toBeInTheDocument();
    expect(screen.getByText(englishTranslations.messages.startNewConversation)).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.send }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(englishTranslations.messages.privacyHint)),
    ).toBeInTheDocument();
  });

  it('renders the provider category label for patient viewers in the chat header', async () => {
    mockUseServiceCategories.mockReturnValue({
      data: [],
      allCategories: [{ code: 'nursing', label: 'Nursing care' }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessageChatPage />);

    expect(await screen.findByText('Dr Fatma Ben Said')).toBeInTheDocument();
    expect(screen.getByText('Nursing care')).toBeInTheDocument();
  });

  it('renders the generic patient label for provider viewers in the chat header', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'provider-1',
        role: 'provider',
        backendRole: 'provider',
        name: 'Provider User',
        avatar: null,
      },
    });

    renderMessagingUi(<MessageChatPage />);

    expect(await screen.findByText('Mohamed Ali')).toBeInTheDocument();
    expect(screen.getByText(englishTranslations.messages.patientLabel)).toBeInTheDocument();
  });

  it('shows an unavailable chat state for invalid runtime roles instead of rendering patient fallbacks', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'unknown-1',
        role: 'unknown',
        backendRole: 'unknown',
        name: 'Unknown User',
        avatar: null,
      },
    });

    renderMessagingUi(<MessageChatPage />);

    expect(
      await screen.findByText(englishTranslations.messages.messagingUnavailable),
    ).toBeInTheDocument();
    expect(screen.queryByText('Dr Fatma Ben Said')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).not.toBeInTheDocument();
  });

  it('loads older history through the shared chat control', async () => {
    const user = userEvent.setup();
    const existingMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Latest visible message',
      createdAt: '2026-04-15T08:00:00.000Z',
    });
    mockUseChat.mockReturnValue({
      messages: [existingMessage],
      pagination: { page: 1, limit: 30, total: 35, totalPages: 2 },
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
      hasOlderMessages: true,
      loadingOlderMessages: false,
      loadOlderMessages: mockLoadOlderMessages,
    });
    mockGroupMessagesByDate.mockReturnValue([
      {
        date: '15 Apr 2026',
        messages: [existingMessage],
      },
    ]);

    renderMessagingUi(<MessageChatPage />);

    await user.click(
      screen.getByRole('button', { name: englishTranslations.messages.loadOlderMessages }),
    );

    expect(mockLoadOlderMessages).toHaveBeenCalledTimes(1);
  });

  it('shows a visible failure state when loading older history fails', async () => {
    const user = userEvent.setup();
    const existingMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Latest visible message',
      createdAt: '2026-04-15T08:00:00.000Z',
    });
    const failingLoadOlderMessages = vi.fn().mockRejectedValue(new Error('older history failed'));
    mockUseChat.mockReturnValue({
      messages: [existingMessage],
      pagination: { page: 1, limit: 30, total: 35, totalPages: 2 },
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
      hasOlderMessages: true,
      loadingOlderMessages: false,
      loadOlderMessages: failingLoadOlderMessages,
    });
    mockGroupMessagesByDate.mockReturnValue([
      {
        date: '15 Apr 2026',
        messages: [existingMessage],
      },
    ]);

    renderMessagingUi(<MessageChatPage />);

    await user.click(
      screen.getByRole('button', { name: englishTranslations.messages.loadOlderMessages }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      englishTranslations.common.loadingError,
    );
    expect(failingLoadOlderMessages).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.loadOlderMessages }),
    ).toBeInTheDocument();
  });

  it('disables the composer and keeps call and presence controls visible when messaging is blocked', async () => {
    mockUseConversation.mockReturnValue({
      data: buildConversationResponse({
        canSendMessage: false,
        messagingBlockedReason: 'provider_disabled_patient_messages',
      }),
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessageChatPage />);

    expect(
      await screen.findByText(englishTranslations.messages.blockedByProviderPreference),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: englishTranslations.messages.send })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.voiceCall }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: englishTranslations.messages.videoCall }),
    ).toBeDisabled();
    expect(screen.getByTitle(englishTranslations.messages.onlineNow)).toBeInTheDocument();
  });

  it('shows a generic blocked banner when sending is unavailable without a reason code', async () => {
    mockUseConversation.mockReturnValue({
      data: buildConversationResponse({
        canSendMessage: false,
        messagingBlockedReason: null,
      }),
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
    });

    renderMessagingUi(<MessageChatPage />);

    expect(
      await screen.findByText(englishTranslations.messages.messagingUnavailable),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toBeDisabled();
  });

  it('keeps the loaded conversation visible when conversation details hit a background refetch error', async () => {
    const existingMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Already loaded history',
      isRead: true,
      readAt: '2026-04-15T08:01:00.000Z',
      createdAt: '2026-04-15T08:00:00.000Z',
    });

    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
      error: new Error('background detail refetch failed'),
      initialLoadError: null,
      refetch: vi.fn(),
    });
    mockUseChat.mockReturnValue({
      messages: [existingMessage],
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
    });
    mockGroupMessagesByDate.mockReturnValue([
      {
        date: '15 Apr 2026',
        messages: [existingMessage],
      },
    ]);

    renderMessagingUi(<MessageChatPage />);

    expect(await screen.findByText('Dr Fatma Ben Said')).toBeInTheDocument();
    expect(screen.getByText('Already loaded history')).toBeInTheDocument();
    expect(screen.queryByText(englishTranslations.common.loadingError)).not.toBeInTheDocument();
  });

  it('keeps loaded messages visible when a background refetch fails', async () => {
    const existingMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Already loaded history',
      isRead: true,
      readAt: '2026-04-15T08:01:00.000Z',
      createdAt: '2026-04-15T08:00:00.000Z',
    });

    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockReturnValue({
      messages: [existingMessage],
      loading: false,
      error: new Error('background refetch failed'),
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
    });
    mockGroupMessagesByDate.mockReturnValue([
      {
        date: '15 Apr 2026',
        messages: [existingMessage],
      },
    ]);

    renderMessagingUi(<MessageChatPage />);

    expect(await screen.findByText('Already loaded history')).toBeInTheDocument();
    expect(screen.queryByText(englishTranslations.common.loadingError)).not.toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.startNewConversation),
    ).not.toBeInTheDocument();
  });

  it('shows a retryable localized error state when chat messages fail to load', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn().mockResolvedValue(undefined);

    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockReturnValue({
      messages: [],
      loading: false,
      error: new Error('messages unavailable'),
      initialLoadError: new Error('messages unavailable'),
      refetch,
      sending: false,
      sendMessage: mockSendMessage,
    });

    renderMessagingUi(<MessageChatPage />);

    expect(screen.getByText(englishTranslations.common.loadingError)).toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.messages.startNewConversation),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: englishTranslations.messages.send })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: englishTranslations.common.retry }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('disables the composer while the initial message load is still pending', async () => {
    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockReturnValue({
      messages: [],
      loading: true,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
    });

    renderMessagingUi(<MessageChatPage />);

    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: englishTranslations.messages.send })).toBeDisabled();
    expect(screen.queryByText(englishTranslations.common.loadingError)).not.toBeInTheDocument();
  });

  it('scrolls to the latest message on initial render and after a successful send', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const initialMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Bonjour',
      isRead: true,
      readAt: '2026-04-15T08:01:00.000Z',
      createdAt: '2026-04-15T08:00:00.000Z',
    });

    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockImplementation(() => {
      const [messages, setMessages] = useState<MessageResponse[]>([initialMessage]);

      return {
        messages,
        loading: false,
        error: null,
        initialLoadError: null,
        refetch: vi.fn(),
        sending: false,
        sendMessage: async (content: string) => {
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              ...initialMessage,
              id: `message-${currentMessages.length + 1}`,
              senderId: 'patient-1',
              content,
              readAt: null,
              isRead: false,
              createdAt: `2026-04-15T08:00:0${currentMessages.length + 1}.000Z`,
            },
          ]);

          return { id: 'sent-message' };
        },
      };
    });
    mockGroupMessagesByDate.mockImplementation((messages: MessageResponse[]) => [
      {
        date: '15 Apr 2026',
        messages,
      },
    ]);

    renderMessagingUi(<MessageChatPage />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
    });

    await user.type(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
      'Je suis en route',
    );
    await user.click(screen.getByRole('button', { name: englishTranslations.messages.send }));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Je suis en route')).toBeInTheDocument();
    });
  });

  it('does not auto-scroll when message metadata changes but the latest message stays the same', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const latestMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Latest message',
      isRead: false,
      readAt: null,
      createdAt: '2026-04-15T08:00:00.000Z',
    });
    let renderedMessages: MessageResponse[] = [latestMessage];

    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockImplementation(() => ({
      messages: renderedMessages,
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
    }));
    mockGroupMessagesByDate.mockImplementation((messages: MessageResponse[]) => [
      {
        date: '15 Apr 2026',
        messages,
      },
    ]);

    const view = renderMessagingUi(<MessageChatPage />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
    });

    renderedMessages = [{ ...latestMessage, isRead: true, readAt: '2026-04-15T08:01:00.000Z' }];
    view.rerender(<MessageChatPage />);

    await waitFor(() => {
      expect(screen.getByText('Latest message')).toBeInTheDocument();
    });
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('does not auto-scroll again when an optimistic tail is replaced by the confirmed server tail', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const baseMessage = buildMessageResponse({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'provider-1',
      content: 'Latest message',
      isRead: true,
      readAt: '2026-04-15T08:01:00.000Z',
      createdAt: '2026-04-15T08:00:00.000Z',
    });
    let renderedMessages: MessageResponse[] = [baseMessage];

    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockImplementation(() => ({
      messages: renderedMessages,
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
    }));
    mockGroupMessagesByDate.mockImplementation((messages: MessageResponse[]) => [
      {
        date: '15 Apr 2026',
        messages,
      },
    ]);

    const view = renderMessagingUi(<MessageChatPage />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
    });

    renderedMessages = [
      baseMessage,
      {
        ...baseMessage,
        id: 'optimistic-tail',
        senderId: 'patient-1',
        content: 'Je suis en route',
        isRead: false,
        readAt: null,
        createdAt: '2026-04-15T08:00:01.000Z',
      },
    ];
    view.rerender(<MessageChatPage />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(2);
    });

    renderedMessages = [
      baseMessage,
      {
        ...baseMessage,
        id: 'server-tail',
        senderId: 'patient-1',
        content: 'Je suis en route',
        isRead: false,
        readAt: null,
        createdAt: '2026-04-15T08:00:02.000Z',
      },
    ];
    view.rerender(<MessageChatPage />);

    await waitFor(() => {
      expect(screen.getByText('Je suis en route')).toBeInTheDocument();
    });
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it('auto-scrolls again when switching to another cached conversation', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const firstConversationMessages: MessageResponse[] = [
      buildMessageResponse({
        id: 'message-1',
        conversationId: 'conversation-1',
        senderId: 'provider-1',
        content: 'Conversation one latest',
        isRead: true,
        readAt: '2026-04-15T08:01:00.000Z',
        createdAt: '2026-04-15T08:00:00.000Z',
      }),
    ];
    const secondConversationMessages: MessageResponse[] = [
      buildMessageResponse({
        id: 'message-2',
        conversationId: 'conversation-2',
        senderId: 'provider-2',
        content: 'Conversation two oldest',
        isRead: true,
        readAt: '2026-04-15T09:01:00.000Z',
        createdAt: '2026-04-15T09:00:00.000Z',
      }),
      buildMessageResponse({
        id: 'message-3',
        conversationId: 'conversation-2',
        senderId: 'provider-2',
        content: 'Conversation two latest',
        isRead: true,
        readAt: '2026-04-15T09:02:00.000Z',
        createdAt: '2026-04-15T09:01:00.000Z',
      }),
    ];

    mockUseConversation.mockImplementation((conversationId?: string) => ({
      data: {
        provider: {
          fullName: conversationId === 'conversation-2' ? 'Dr Salma Jaziri' : 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    }));
    mockUseChat.mockImplementation(() => ({
      messages:
        currentConversationId === 'conversation-2'
          ? secondConversationMessages
          : firstConversationMessages,
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: mockSendMessage,
    }));
    mockGroupMessagesByDate.mockImplementation((messages: MessageResponse[]) => [
      {
        date: '15 Apr 2026',
        messages,
      },
    ]);

    const view = renderMessagingUi(<MessageChatPage />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Conversation one latest')).toBeInTheDocument();
    });

    currentConversationId = 'conversation-2';
    view.rerender(<MessageChatPage />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Conversation two latest')).toBeInTheDocument();
    });
  });

  it('preserves the draft and shows localized feedback when sending fails', async () => {
    const user = userEvent.setup();
    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    });
    mockUseChat.mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: vi.fn(async (content: string) => {
        mockSendMessage(content);
        throw new Error('send failed');
      }),
    });

    renderMessagingUi(<MessageChatPage />);

    expect(
      screen.queryByText(englishTranslations.messages.messageSendFailed),
    ).not.toBeInTheDocument();

    const composer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });
    await user.type(composer, '  Bonjour  ');
    await user.click(screen.getByRole('button', { name: englishTranslations.messages.send }));

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Bonjour');
    });
    expect(composer).toHaveValue('  Bonjour  ');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      englishTranslations.messages.messageSendFailed,
    );
  });

  it('keeps draft and failed-send feedback scoped to the active conversation', async () => {
    const user = userEvent.setup();

    mockUseConversation.mockImplementation((conversationId?: string) => ({
      data: {
        provider: {
          fullName: conversationId === 'conversation-2' ? 'Dr Salma Jaziri' : 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    }));
    mockUseChat.mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: vi.fn(async (content: string) => {
        mockSendMessage(content);
        throw new Error('send failed');
      }),
    });

    const view = renderMessagingUi(<MessageChatPage />);
    const composer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });

    await user.type(composer, '  Bonjour  ');
    await user.click(screen.getByRole('button', { name: englishTranslations.messages.send }));

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Bonjour');
    });
    expect(composer).toHaveValue('  Bonjour  ');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      englishTranslations.messages.messageSendFailed,
    );

    currentConversationId = 'conversation-2';
    view.rerender(<MessageChatPage />);

    const secondComposer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });
    expect(secondComposer).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    currentConversationId = 'conversation-1';
    view.rerender(<MessageChatPage />);

    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toHaveValue('  Bonjour  ');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      englishTranslations.messages.messageSendFailed,
    );
  });

  it('does not clear the new conversation draft when a previous conversation send resolves late', async () => {
    const user = userEvent.setup();
    let resolveSend!: () => void;
    const sendPromise = new Promise<{ id: string }>((resolve) => {
      resolveSend = () => resolve({ id: 'sent-message' });
    });

    mockUseConversation.mockImplementation((conversationId?: string) => ({
      data: {
        provider: {
          fullName: conversationId === 'conversation-2' ? 'Dr Salma Jaziri' : 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    }));
    mockUseChat.mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: vi.fn(() => sendPromise),
    });

    const view = renderMessagingUi(<MessageChatPage />);
    const composer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });

    await user.type(composer, 'Draft for conversation one');
    await user.click(screen.getByRole('button', { name: englishTranslations.messages.send }));

    currentConversationId = 'conversation-2';
    view.rerender(<MessageChatPage />);

    const nextComposer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });
    await user.type(nextComposer, 'Draft for conversation two');

    await act(async () => {
      resolveSend();
      await Promise.resolve();
    });

    expect(nextComposer).toHaveValue('Draft for conversation two');
  });

  it('restores the failed draft when a previous conversation send fails after the route changes', async () => {
    const user = userEvent.setup();
    let rejectSend!: () => void;
    const sendPromise = new Promise<never>((_, reject) => {
      rejectSend = () => reject(new Error('send failed'));
    });

    mockUseConversation.mockImplementation((conversationId?: string) => ({
      data: {
        provider: {
          fullName: conversationId === 'conversation-2' ? 'Dr Salma Jaziri' : 'Dr Fatma Ben Said',
          specialty: 'Nursing',
        },
      },
      loading: false,
    }));
    mockUseChat.mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
      sending: false,
      sendMessage: vi.fn((content: string) => {
        mockSendMessage(content);
        return sendPromise;
      }),
    });

    const view = renderMessagingUi(<MessageChatPage />);
    const composer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });

    await user.type(composer, 'Draft for conversation one');
    await user.click(screen.getByRole('button', { name: englishTranslations.messages.send }));

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Draft for conversation one');
    });

    currentConversationId = 'conversation-2';
    view.rerender(<MessageChatPage />);

    const nextComposer = screen.getByRole('textbox', {
      name: englishTranslations.messages.composerPlaceholder,
    });
    await user.type(nextComposer, 'Draft for conversation two');

    await act(async () => {
      rejectSend();
      await Promise.resolve();
    });

    expect(nextComposer).toHaveValue('Draft for conversation two');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    currentConversationId = 'conversation-1';
    view.rerender(<MessageChatPage />);

    expect(
      screen.getByRole('textbox', { name: englishTranslations.messages.composerPlaceholder }),
    ).toHaveValue('Draft for conversation one');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      englishTranslations.messages.messageSendFailed,
    );
  });

  it('uses localized empty-state copy for German users', async () => {
    mockUseConversation.mockReturnValue({
      data: {
        provider: {
          fullName: 'Dr Weber',
          specialty: 'Pflege',
        },
      },
      loading: false,
    });

    renderMessagingUi(<MessageChatPage />, 'de-DE');

    expect(
      await screen.findByText(germanTranslations.messages.startNewConversation),
    ).toBeInTheDocument();
  });
});
