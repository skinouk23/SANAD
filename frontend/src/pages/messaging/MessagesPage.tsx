import { useCallback, useMemo, useState } from 'react';
import { useNavigate, type LoaderFunctionArgs } from 'react-router-dom';
import { Check, CheckCheck, MessageCircle, Search } from 'lucide-react';

import { Skeleton, SkeletonConversationList } from '@/shared/ui/composites/loading';
import { useAuth } from '@/contexts/AuthContext';
import { isSupportedRuntimeRole } from '@/features/auth/role-policy';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  conversationListOptions,
  formatConversationTime,
  getConversationCounterpart,
  getProviderCategoryLabel,
  unreadCountOptions,
  useConversations,
  useUnreadCount,
  MessagingAvatar,
  type ConversationResponse,
} from '@/features/messaging';
import { useServiceCategories } from '@/features/services';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { queryClient } from '@/shared/lib/query/client';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void Promise.all([
    queryClient.prefetchQuery(conversationListOptions({ page: 1, limit: 20 })),
    queryClient.prefetchQuery(unreadCountOptions()),
  ]).catch(() => undefined);

  return null;
};

type ConversationViewerRole = 'patient' | 'provider';

interface ConversationItemProps {
  conversation: ConversationResponse;
  onClick: () => void;
  locale: string;
  currentRole: ConversationViewerRole;
  categoryLabels: Map<string, string>;
  professionalFallback: string;
  patientLabel: string;
  timeLabels: {
    justNow: string;
    formatMinutesAgo: (count: number) => string;
    formatHoursAgo: (count: number) => string;
    formatDaysAgo: (count: number) => string;
  };
}

function ConversationItem({
  conversation,
  onClick,
  locale,
  currentRole,
  categoryLabels,
  professionalFallback,
  patientLabel,
  timeLabels,
}: ConversationItemProps) {
  const counterpart = getConversationCounterpart(conversation, currentRole);
  const fallbackName = currentRole === 'patient' ? professionalFallback : patientLabel;
  const displayName = counterpart?.fullName?.trim() || fallbackName;
  const avatarUrl = counterpart?.avatarUrl ?? null;
  const secondaryLabelCandidate =
    currentRole === 'patient'
      ? getProviderCategoryLabel(conversation.provider?.specialty, categoryLabels)
      : patientLabel;
  const secondaryLabel =
    secondaryLabelCandidate && secondaryLabelCandidate !== displayName
      ? secondaryLabelCandidate
      : '';
  const previewTime = conversation.lastMessageAt
    ? formatConversationTime(conversation.lastMessageAt, locale, timeLabels)
    : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-b border-slate-200 p-3 text-left transition-colors hover:bg-slate-50/90 dark:border-slate-700/50 dark:hover:bg-slate-800/50"
    >
      <div className="flex items-start gap-2.5">
        <div className="relative">
          <MessagingAvatar
            avatarUrl={avatarUrl}
            displayName={displayName}
            seed={`${conversation.id}:${displayName}`}
            variant="conversationList"
          />
          {conversation.unreadCount > 0 && (
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white">
              {conversation.unreadCount}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {displayName}
              </h3>
              {secondaryLabel && (
                <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {secondaryLabel}
                </p>
              )}
            </div>
            <span className="flex-shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
              {previewTime}
            </span>
          </div>

          {conversation.lastMessagePreview && (
            <div className="flex items-center gap-1.5">
              <p
                className={`flex-1 truncate text-xs ${
                  conversation.unreadCount > 0
                    ? 'font-medium text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {conversation.lastMessagePreview}
              </p>
              {conversation.unreadCount === 0 ? (
                <CheckCheck className="h-3.5 w-3.5 flex-shrink-0 text-cyan-500 dark:text-cyan-400" />
              ) : (
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const { allCategories } = useServiceCategories();
  const currentRole: ConversationViewerRole | null = isSupportedRuntimeRole(user?.role)
    ? user.role
    : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
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
  const trimmedSearchQuery = searchQuery.trim();
  const trimmedDebouncedSearchQuery = debouncedSearchQuery.trim();
  const conversationFilters = useMemo(
    () => ({
      unreadOnly: filter === 'unread',
      searchQuery: trimmedDebouncedSearchQuery || undefined,
      page: 1,
      limit: 20,
    }),
    [filter, trimmedDebouncedSearchQuery],
  );
  const {
    items: conversations,
    loading,
    isRefreshing,
    isPlaceholderData,
    initialLoadError,
    refetch,
  } = useConversations(conversationFilters);
  const {
    data: totalUnread,
    loading: unreadLoading,
    error: unreadError,
    refetch: refetchUnread,
  } = useUnreadCount();
  const unreadCount = totalUnread ?? 0;
  const conversationsInitialLoading = loading && conversations.length === 0;
  const conversationsUpdating = (isRefreshing || isPlaceholderData) && conversations.length > 0;
  const unavailableStateMessage = user ? t.messages.messagingUnavailable : t.chatbot.notConnected;

  const timeLabels = useMemo(
    () => ({
      justNow: t.messages.justNow,
      formatMinutesAgo: (count: number) => `${count}${t.messages.minutesSuffix}`,
      formatHoursAgo: (count: number) => `${count}${t.messages.hoursSuffix}`,
      formatDaysAgo: (count: number) => `${count}${t.messages.daysSuffix}`,
    }),
    [t.messages.daysSuffix, t.messages.hoursSuffix, t.messages.justNow, t.messages.minutesSuffix],
  );

  const handleConversationClick = useCallback(
    (conversationId: string) => {
      navigate(`/messages/${conversationId}`);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-2 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white">
      <div className="border-b border-slate-200 bg-white/80 text-slate-900 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-white">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="relative mb-2 overflow-hidden rounded-[14px] p-[2px]">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div className="relative rounded-[12px] bg-white/95 px-4 py-3 backdrop-blur-xl dark:bg-slate-900/95">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <h1 className="text-base font-bold text-slate-900 dark:text-white">
                      {t.messages.title}
                    </h1>
                    {currentRole !== null ? (
                      unreadLoading ? (
                        <Skeleton className="mt-1 h-3 w-24 rounded bg-cyan-100 dark:bg-cyan-500/20" />
                      ) : unreadError ? (
                        <button
                          type="button"
                          onClick={() => {
                            void refetchUnread();
                          }}
                          className="mt-1 text-[10px] font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                          Recharger les non lus
                        </button>
                      ) : unreadCount > 0 ? (
                        <p className="text-[10px] text-cyan-600 dark:text-cyan-400">
                          {unreadCount}{' '}
                          {unreadCount === 1
                            ? t.messages.unreadCount
                            : t.messages.unreadCountPlural}
                        </p>
                      ) : null
                    ) : null}
                  </div>
                </div>
              </div>

              {currentRole !== null ? (
                <>
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      placeholder={t.messages.searchPlaceholder}
                      aria-label={t.messages.searchPlaceholder}
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white/90 py-2 pl-8 pr-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFilter('all')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === 'all'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t.common.all}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('unread')}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === 'unread'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t.common.unread}
                      {unreadLoading ? (
                        <span className="h-4 w-5 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-500/20" />
                      ) : unreadCount > 0 ? (
                        <span
                          className={`rounded-full px-1 py-0.5 text-[9px] ${
                            filter === 'unread'
                              ? 'bg-white/20 text-white'
                              : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400'
                          }`}
                        >
                          {unreadCount}
                        </span>
                      ) : null}
                    </button>
                  </div>

                  {conversationsUpdating ? (
                    <div className="mt-2">
                      <span
                        aria-live="polite"
                        className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400"
                      >
                        Mise à jour...
                      </span>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        {currentRole === null ? (
          <div className="p-4 text-center">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {unavailableStateMessage}
            </p>
          </div>
        ) : conversationsInitialLoading ? (
          <SkeletonConversationList />
        ) : initialLoadError && conversations.length === 0 ? (
          <div className="p-4 text-center">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.common.loadingError}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="text-xs font-medium text-cyan-500 hover:text-cyan-400"
            >
              {t.common.retry}
            </button>
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={() => handleConversationClick(conversation.id)}
              locale={currentLanguage.code}
              currentRole={currentRole}
              categoryLabels={categoryLabels}
              professionalFallback={t.auth.professional}
              patientLabel={t.messages.patientLabel}
              timeLabels={timeLabels}
            />
          ))
        ) : (
          <div className="p-4 text-center">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {trimmedSearchQuery
                ? t.common.noResults
                : filter === 'unread'
                  ? t.messages.noUnreadMessages
                  : t.messages.noConversations}
            </p>
            {!trimmedSearchQuery ? (
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {filter === 'unread' ? t.messages.allMessagesRead : t.messages.startNewConversation}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
