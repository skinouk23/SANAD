import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { useNavigate, useParams, type LoaderFunctionArgs } from 'react-router-dom';
import { Check, CheckCircle2, Loader2, MoreVertical, Phone, Send, Video } from 'lucide-react';

import { Skeleton, SkeletonAvatar } from '@/shared/ui/composites/loading';
import { useAuth } from '@/contexts/AuthContext';
import { isSupportedRuntimeRole } from '@/features/auth/role-policy';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  conversationDetailOptions,
  getConversationCounterpart,
  getProviderCategoryLabel,
  groupMessagesByDate,
  messagesOptions,
  useChat,
  useConversation,
  MessagingAvatar,
  type MessageResponse,
} from '@/features/messaging';
import { useServiceCategories } from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = ({ params }: LoaderFunctionArgs) => {
  if (params.conversationId) {
    void Promise.all([
      queryClient.prefetchQuery(conversationDetailOptions(params.conversationId)),
      queryClient.prefetchQuery(messagesOptions(params.conversationId)),
    ]).catch(() => undefined);
  }
  return null;
};

const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  locale,
}: {
  message: MessageResponse;
  isOwn: boolean;
  locale: string;
}) {
  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={`mb-2.5 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
          isOwn
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
            : 'border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content ?? ''}</p>
        <div className="mt-0.5 flex items-center justify-end gap-1">
          <p
            className={`text-xs ${isOwn ? 'text-cyan-100' : 'text-slate-400 dark:text-slate-500'}`}
          >
            {formatTime(message.createdAt)}
          </p>
          {isOwn &&
            (message.isRead ? (
              <CheckCircle2 className="h-3 w-3 text-cyan-100" />
            ) : (
              <Check className="h-3 w-3 text-cyan-200" />
            ))}
        </div>
      </div>
    </div>
  );
});

const DateSeparator = memo(function DateSeparator({ date }: { date: string }) {
  return (
    <div className="my-3 flex items-center justify-center">
      <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {date}
      </div>
    </div>
  );
});

interface ConversationComposerState {
  draft: string;
  sendFailed: boolean;
}

const EMPTY_COMPOSER_STATE: ConversationComposerState = {
  draft: '',
  sendFailed: false,
};

type ConversationViewerRole = 'patient' | 'provider';

type GroupedMessages = ReturnType<typeof groupMessagesByDate>;

interface ChatHeaderLabels {
  onlineNow: string;
  voiceCall: string;
  videoCall: string;
  details: string;
}

interface ChatHeaderProps {
  avatarUrl: string | null;
  conversationId: string | undefined;
  displayName: string;
  labels: ChatHeaderLabels;
  secondaryLabel: string;
}

const ChatHeader = memo(function ChatHeader({
  avatarUrl,
  conversationId,
  displayName,
  labels,
  secondaryLabel,
}: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/95">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessagingAvatar
              avatarUrl={avatarUrl}
              displayName={displayName}
              seed={`${conversationId ?? ''}:${displayName}`}
              variant="chatHeader"
            >
              <div
                className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-green-500 dark:border-slate-800"
                title={labels.onlineNow}
                aria-label={labels.onlineNow}
              />
            </MessagingAvatar>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{displayName}</h3>
              {secondaryLabel ? (
                <p className="text-xs text-slate-600 dark:text-slate-400">{secondaryLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="cursor-default rounded-lg p-1.5 text-slate-500 opacity-70 transition-colors hover:bg-slate-100 disabled:cursor-default disabled:opacity-70 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-700 dark:disabled:hover:bg-transparent"
              title={labels.voiceCall}
              aria-label={labels.voiceCall}
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              className="cursor-default rounded-lg p-1.5 text-slate-500 opacity-70 transition-colors hover:bg-slate-100 disabled:cursor-default disabled:opacity-70 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-700 dark:disabled:hover:bg-transparent"
              title={labels.videoCall}
              aria-label={labels.videoCall}
            >
              <Video className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              className="cursor-default rounded-lg p-1.5 text-slate-500 opacity-70 transition-colors hover:bg-slate-100 disabled:cursor-default disabled:opacity-70 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-700 dark:disabled:hover:bg-transparent"
              title={labels.details}
              aria-label={labels.details}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const ChatHeaderSkeleton = memo(function ChatHeaderSkeleton() {
  return (
    <div className="sticky top-0 z-20 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/95">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonAvatar size="md" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
});

interface MessageListLabels {
  loadOlderMessages: string;
  loadingError: string;
  retry: string;
  startNewConversation: string;
}

interface MessageListProps {
  blockedReason: string | null;
  currentUserId: string;
  groupedMessages: GroupedMessages;
  hasOlderMessages: boolean;
  loadingOlderMessages: boolean;
  locale: string;
  messages: MessageResponse[];
  messagesEndRef: RefObject<HTMLDivElement>;
  messagesInitialLoadError: unknown;
  messagesLoading: boolean;
  messagesRefreshing: boolean;
  olderHistoryLoadFailed: boolean;
  labels: MessageListLabels;
  onLoadOlderHistory: () => void;
  onRetryMessages: () => void;
}

const MessageList = memo(function MessageList({
  blockedReason,
  currentUserId,
  groupedMessages,
  hasOlderMessages,
  labels,
  loadingOlderMessages,
  locale,
  messages,
  messagesEndRef,
  messagesInitialLoadError,
  messagesLoading,
  messagesRefreshing,
  olderHistoryLoadFailed,
  onLoadOlderHistory,
  onRetryMessages,
}: MessageListProps) {
  const messagesInitialLoading = messagesLoading && messages.length === 0;
  const messagesUpdating = messagesRefreshing && messages.length > 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-4xl">
        {blockedReason ? (
          <div className="mb-3 rounded-xl border border-amber-300/60 bg-amber-50/90 p-3 text-sm text-amber-700 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {blockedReason}
          </div>
        ) : null}

        {olderHistoryLoadFailed ? (
          <div
            className="mb-3 rounded-xl border border-red-300/60 bg-red-50/90 px-3 py-2 text-xs text-red-600 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {labels.loadingError}
          </div>
        ) : null}

        {hasOlderMessages && messages.length > 0 ? (
          <button
            type="button"
            onClick={onLoadOlderHistory}
            disabled={loadingOlderMessages}
            className="mb-3 text-xs font-medium text-cyan-600 hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            {labels.loadOlderMessages}
          </button>
        ) : null}

        {messagesUpdating ? (
          <div className="mb-3 flex justify-center">
            <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
              Mise à jour...
            </span>
          </div>
        ) : null}

        {messagesInitialLoading ? (
          <div className="min-h-[10rem]" aria-live="polite" role="status">
            <span className="sr-only">Chargement des messages...</span>
          </div>
        ) : messagesInitialLoadError ? (
          <div className="py-10 text-center">
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {labels.loadingError}
            </p>
            <button
              type="button"
              onClick={onRetryMessages}
              className="mt-3 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              {labels.retry}
            </button>
          </div>
        ) : messages.length > 0 ? (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <DateSeparator date={group.date} />
              {group.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  locale={locale}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {labels.startNewConversation}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

interface MessageComposerLabels {
  composerPlaceholder: string;
  messageSendFailed: string;
  send: string;
}

interface MessageComposerProps {
  composerDisabled: boolean;
  labels: MessageComposerLabels;
  messageText: string;
  sendFailed: boolean;
  sending: boolean;
  onDraftChange: (nextDraft: string) => void;
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
}

const MessageComposer = memo(function MessageComposer({
  composerDisabled,
  labels,
  messageText,
  sendFailed,
  sending,
  onDraftChange,
  onKeyPress,
  onSendMessage,
}: MessageComposerProps) {
  return (
    <div className="sticky bottom-0 z-20 shrink-0 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            value={messageText}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyPress={onKeyPress}
            placeholder={labels.composerPlaceholder}
            aria-label={labels.composerPlaceholder}
            disabled={composerDisabled}
            className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
          />

          <button
            type="button"
            onClick={onSendMessage}
            disabled={composerDisabled || !messageText.trim()}
            aria-label={labels.send}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        {sendFailed ? (
          <div className="mt-2 min-h-[2.5rem]" aria-live="polite">
            <div
              className="rounded-xl border border-red-300/60 bg-red-50/90 px-3 py-2 text-xs text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              role="alert"
            >
              {labels.messageSendFailed}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export function MessageChatPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [composerStateByConversationId, setComposerStateByConversationId] = useState<
    Record<string, ConversationComposerState>
  >({});
  const [olderHistoryFailedByConversationId, setOlderHistoryFailedByConversationId] = useState<
    Record<string, boolean>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const { allCategories } = useServiceCategories();
  const currentUserId = user?.id ?? '';
  const currentRole: ConversationViewerRole | null = isSupportedRuntimeRole(user?.role)
    ? user.role
    : null;
  const categoryLabels = useMemo(
    () =>
      new Map(
        allCategories.map((category) => [
          category.code ?? '',
          category.label ?? category.code ?? '',
        ]),
      ),
    [allCategories],
  );

  const {
    data: conversation,
    loading: conversationLoading,
    initialLoadError: conversationInitialLoadError,
    refetch: refetchConversation,
  } = useConversation(conversationId);
  const {
    messages,
    loading: messagesLoading,
    initialLoadError: messagesInitialLoadError,
    sending,
    sendMessage: send,
    isRefreshing: messagesRefreshing,
    isPlaceholderData: messagesPlaceholderData,
    refetch: refetchMessages,
    hasOlderMessages,
    loadingOlderMessages,
    loadOlderMessages,
  } = useChat(conversationId, { page: 1, limit: 30 });

  const counterpart = conversation
    ? currentRole
      ? getConversationCounterpart(conversation, currentRole)
      : undefined
    : undefined;
  const counterpartDisplayName =
    counterpart?.fullName?.trim() ||
    (currentRole === 'patient'
      ? t.auth.professional
      : currentRole === 'provider'
        ? t.messages.patientLabel
        : '');
  const counterpartSecondaryLabelCandidate =
    currentRole === 'patient'
      ? getProviderCategoryLabel(conversation?.provider?.specialty, categoryLabels)
      : currentRole === 'provider'
        ? t.messages.patientLabel
        : '';
  const counterpartSecondaryLabel =
    counterpartSecondaryLabelCandidate &&
    counterpartSecondaryLabelCandidate !== counterpartDisplayName
      ? counterpartSecondaryLabelCandidate
      : '';
  const counterpartAvatarUrl = counterpart?.avatarUrl ?? null;
  const blockedReason =
    conversation?.messagingBlockedReason === 'patient_disabled_provider_messages'
      ? t.messages.blockedByPatientPreference
      : conversation?.messagingBlockedReason === 'provider_disabled_patient_messages'
        ? t.messages.blockedByProviderPreference
        : conversation?.messagingBlockedReason === 'no_active_reservation'
          ? t.messages.blockedByReservationRequirement
          : conversation?.canSendMessage === false
            ? t.messages.messagingUnavailable
            : null;
  const canSendMessage = conversation?.canSendMessage ?? true;

  const activeComposerState = conversationId
    ? (composerStateByConversationId[conversationId] ?? EMPTY_COMPOSER_STATE)
    : EMPTY_COMPOSER_STATE;
  const messageText = activeComposerState.draft;
  const sendFailed = activeComposerState.sendFailed;
  const olderHistoryLoadFailed = conversationId
    ? Boolean(olderHistoryFailedByConversationId[conversationId])
    : false;
  const composerDisabled =
    sending ||
    (messagesLoading && messages.length === 0) ||
    conversationLoading ||
    Boolean(messagesInitialLoadError) ||
    !canSendMessage;
  const lastMessageId = messages[messages.length - 1]?.id ?? null;
  const previousLastMessageIdRef = useRef<string | null>(null);
  const previousMessageCountRef = useRef(0);

  useEffect(() => {
    previousLastMessageIdRef.current = null;
    previousMessageCountRef.current = 0;
  }, [conversationId]);

  useEffect(() => {
    if (!lastMessageId) {
      previousLastMessageIdRef.current = null;
      previousMessageCountRef.current = 0;
      return;
    }

    const hadNoMessages = previousMessageCountRef.current === 0;
    const tailAdvanced =
      messages.length > previousMessageCountRef.current &&
      previousLastMessageIdRef.current !== lastMessageId;

    if (hadNoMessages || tailAdvanced) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    previousLastMessageIdRef.current = lastMessageId;
    previousMessageCountRef.current = messages.length;
  }, [conversationId, lastMessageId, messages.length]);

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages, currentLanguage.code),
    [currentLanguage.code, messages],
  );
  const chatHeaderLabels = useMemo(
    () => ({
      details: t.common.details,
      onlineNow: t.messages.onlineNow,
      videoCall: t.messages.videoCall,
      voiceCall: t.messages.voiceCall,
    }),
    [t.common.details, t.messages.onlineNow, t.messages.videoCall, t.messages.voiceCall],
  );
  const messageListLabels = useMemo(
    () => ({
      loadOlderMessages: t.messages.loadOlderMessages,
      loadingError: t.common.loadingError,
      retry: t.common.retry,
      startNewConversation: t.messages.startNewConversation,
    }),
    [
      t.common.loadingError,
      t.common.retry,
      t.messages.loadOlderMessages,
      t.messages.startNewConversation,
    ],
  );
  const messageComposerLabels = useMemo(
    () => ({
      composerPlaceholder: t.messages.composerPlaceholder,
      messageSendFailed: t.messages.messageSendFailed,
      send: t.messages.send,
    }),
    [t.messages.composerPlaceholder, t.messages.messageSendFailed, t.messages.send],
  );

  const updateComposerState = useCallback(
    (
      targetConversationId: string | undefined,
      updater: (state: ConversationComposerState) => ConversationComposerState,
    ) => {
      if (!targetConversationId) {
        return;
      }

      setComposerStateByConversationId((previousState) => {
        const currentState = previousState[targetConversationId] ?? EMPTY_COMPOSER_STATE;
        const nextState = updater(currentState);

        if (nextState.draft === '' && !nextState.sendFailed) {
          if (!(targetConversationId in previousState)) {
            return previousState;
          }

          const trimmedState = { ...previousState };
          delete trimmedState[targetConversationId];
          return trimmedState;
        }

        if (
          currentState.draft === nextState.draft &&
          currentState.sendFailed === nextState.sendFailed
        ) {
          return previousState;
        }

        return {
          ...previousState,
          [targetConversationId]: nextState,
        };
      });
    },
    [],
  );

  const setOlderHistoryLoadFailed = useCallback(
    (targetConversationId: string | undefined, failed: boolean) => {
      if (!targetConversationId) {
        return;
      }

      setOlderHistoryFailedByConversationId((previousState) => {
        const currentFailed = Boolean(previousState[targetConversationId]);

        if (currentFailed === failed) {
          return previousState;
        }

        if (!failed) {
          if (!(targetConversationId in previousState)) {
            return previousState;
          }

          const nextState = { ...previousState };
          delete nextState[targetConversationId];
          return nextState;
        }

        return {
          ...previousState,
          [targetConversationId]: true,
        };
      });
    },
    [],
  );

  const handleDraftChange = useCallback(
    (nextDraft: string) => {
      updateComposerState(conversationId, (currentState) => ({
        ...currentState,
        draft: nextDraft,
      }));
    },
    [conversationId, updateComposerState],
  );

  const handleSendMessage = useCallback(async () => {
    if (!conversationId) {
      return;
    }

    const text = messageText.trim();

    if (!text || composerDisabled) {
      return;
    }

    updateComposerState(conversationId, (currentState) => ({
      ...currentState,
      sendFailed: false,
    }));

    try {
      const sentMessage = await send(text);

      if (sentMessage) {
        updateComposerState(conversationId, () => EMPTY_COMPOSER_STATE);
      }
    } catch {
      updateComposerState(conversationId, (currentState) => ({
        ...currentState,
        sendFailed: true,
      }));
    }
  }, [composerDisabled, conversationId, messageText, send, updateComposerState]);

  const handleLoadOlderHistory = useCallback(async () => {
    if (!conversationId) {
      return;
    }

    setOlderHistoryLoadFailed(conversationId, false);

    try {
      await loadOlderMessages();
    } catch {
      setOlderHistoryLoadFailed(conversationId, true);
    }
  }, [conversationId, loadOlderMessages, setOlderHistoryLoadFailed]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleRetryMessages = useCallback(() => {
    void refetchMessages();
  }, [refetchMessages]);

  const handleComposerSend = useCallback(() => {
    void handleSendMessage();
  }, [handleSendMessage]);

  const handleMessageListLoadOlderHistory = useCallback(() => {
    void handleLoadOlderHistory();
  }, [handleLoadOlderHistory]);

  if (currentRole === null) {
    return (
      <div className="flex min-h-app-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 text-center dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <p className="text-sm text-slate-900 dark:text-white">
          {user ? t.messages.messagingUnavailable : t.chatbot.notConnected}
        </p>
      </div>
    );
  }

  if (conversationInitialLoadError && !conversationLoading) {
    return (
      <div className="flex min-h-app-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <p className="mb-3 text-sm text-red-600 dark:text-red-400">{t.common.loadingError}</p>
        <button
          type="button"
          onClick={() => void refetchConversation()}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
        >
          {t.common.retry}
        </button>
      </div>
    );
  }

  if (!conversation && !conversationLoading) {
    return (
      <div className="flex min-h-app-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <p className="mb-3 text-sm text-slate-900 dark:text-white">
          {t.messages.conversationNotFound}
        </p>
        <button
          type="button"
          onClick={() => navigate('/messages')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-cyan-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-400 dark:hover:bg-slate-700"
        >
          {t.messages.backToInbox}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-app-screen min-h-0 flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white">
      {conversationLoading || !conversation ? (
        <ChatHeaderSkeleton />
      ) : (
        <ChatHeader
          avatarUrl={counterpartAvatarUrl}
          conversationId={conversationId}
          displayName={counterpartDisplayName}
          labels={chatHeaderLabels}
          secondaryLabel={counterpartSecondaryLabel}
        />
      )}
      <MessageList
        blockedReason={blockedReason}
        currentUserId={currentUserId}
        groupedMessages={groupedMessages}
        hasOlderMessages={hasOlderMessages}
        labels={messageListLabels}
        loadingOlderMessages={loadingOlderMessages}
        locale={currentLanguage.code}
        messages={messages}
        messagesEndRef={messagesEndRef}
        messagesInitialLoadError={messagesInitialLoadError}
        messagesLoading={messagesLoading}
        messagesRefreshing={messagesRefreshing || messagesPlaceholderData}
        olderHistoryLoadFailed={olderHistoryLoadFailed}
        onLoadOlderHistory={handleMessageListLoadOlderHistory}
        onRetryMessages={handleRetryMessages}
      />
      <MessageComposer
        composerDisabled={composerDisabled}
        labels={messageComposerLabels}
        messageText={messageText}
        sendFailed={sendFailed}
        sending={sending}
        onDraftChange={handleDraftChange}
        onKeyPress={handleKeyPress}
        onSendMessage={handleComposerSend}
      />
    </div>
  );
}
