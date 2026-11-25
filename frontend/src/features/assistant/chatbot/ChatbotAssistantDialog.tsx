import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  LogOut,
  MessageSquare,
  Phone,
  Search,
  Send,
  Sparkles,
  Star,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { getAssistantLocale, normalizeAssistantText } from '@/features/assistant/assistant-locale';
import { AMBULANCE_SERVICE_ROUTE } from '@/features/assistant/routes';
import { financeTimelineSortOptions, myFinanceTimelineOptions } from '@/features/finance-timeline';
import {
  providerWalletStatsOptions,
  providerWalletSummaryOptions,
} from '@/features/provider-wallet';
import { useLanguage } from '@/shared/lib/i18n/language-context';

interface QuickReply {
  id: string;
  label: string;
  icon?: ElementType;
  action: string;
  payload?: Record<string, string | number> | string;
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: ReactNode;
  options?: QuickReply[];
  timestamp: Date;
}

export function ChatbotAssistantPanel() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentInputAction, setCurrentInputAction] = useState<string | null>(null);
  const [currentInputPayload, setCurrentInputPayload] = useState<
    Record<string, string | number> | string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageSequenceRef = useRef(0);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const isPatient = user?.role === 'patient';
  const isProvider = user?.role === 'provider';
  const assistantLocale = useMemo(
    () => getAssistantLocale(currentLanguage.code),
    [currentLanguage.code],
  );
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(currentLanguage.code),
    [currentLanguage.code],
  );
  const isProviderFinanceEnabled = isAuthenticated && isProvider;

  const providerWalletSummaryQuery = useQuery({
    ...providerWalletSummaryOptions(),
    enabled: isProviderFinanceEnabled,
  });
  const providerWalletStatsQuery = useQuery({
    ...providerWalletStatsOptions(),
    enabled: isProviderFinanceEnabled,
  });
  const providerFinanceTimelineQuery = useQuery({
    ...myFinanceTimelineOptions({
      page: 1,
      limit: 3,
      sort: financeTimelineSortOptions.occurredAtDesc,
    }),
    enabled: isProviderFinanceEnabled,
  });

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat(currentLanguage.code, {
        style: 'currency',
        currency: 'TND',
        maximumFractionDigits: 0,
      }).format(value),
    [currentLanguage.code],
  );

  const serviceNames = useMemo<Record<string, string>>(
    () => ({
      nursing: t.services.nursing,
      elderly_care: t.services.elderly_care,
      physiotherapy: t.services.physiotherapy,
      maternity: t.services.maternityService,
      night_care: t.services.nightGuard,
      doctor: t.services.doctorHome,
      psychology: t.services.psychology,
      nutrition: t.services.nutrition,
      laboratory: t.services.laboratory,
      radiology: t.services.radiology,
      equipment: t.nav.equipment,
      babysitting: t.services.babysitting,
      ambulance: t.services.ambulance,
    }),
    [t],
  );

  const providerFinanceQuickReplies = useMemo<QuickReply[]>(
    () => [
      {
        id: 'history',
        label: `📋 ${t.chatbot.fullHistory}`,
        icon: FileText,
        action: 'navigate',
        payload: '/provider/transactions',
      },
      {
        id: 'balance',
        label: `💼 ${t.provider.balanceTitle}`,
        icon: DollarSign,
        action: 'navigate',
        payload: '/provider/balance',
      },
      {
        id: 'billing',
        label: `🧾 ${t.provider.billing}`,
        icon: CreditCard,
        action: 'navigate',
        payload: '/provider/billing',
      },
      {
        id: 'back',
        label: `← ${t.common.back}`,
        icon: ArrowLeft,
        action: 'welcome',
      },
    ],
    [t],
  );

  const providerFinanceSnapshot = useMemo(() => {
    if (!isProviderFinanceEnabled) {
      return null;
    }

    const walletSummary = providerWalletSummaryQuery.data;
    const walletStats = providerWalletStatsQuery.data;
    const timelineItems = providerFinanceTimelineQuery.data?.items ?? [];
    const currency = walletSummary?.currency ?? walletStats?.currency ?? timelineItems[0]?.currency;

    if (!walletSummary && !walletStats && timelineItems.length === 0) {
      return null;
    }

    return {
      currentMonthDeposits: walletStats?.currentMonthDeposits ?? null,
      currentMonthDeductions: walletStats?.currentMonthDeductions ?? null,
      recentItems: timelineItems.map((item) => ({
        amount: formatCurrency(item.amount),
        date: new Date(item.occurredAt).toLocaleDateString(currentLanguage.code, {
          day: '2-digit',
          month: 'short',
        }),
        id: item.id,
        title: item.title,
      })),
      usableBalance: walletSummary?.usableBalance ?? null,
      walletCurrency: currency ?? 'TND',
    };
  }, [
    currentLanguage.code,
    formatCurrency,
    isProviderFinanceEnabled,
    providerFinanceTimelineQuery.data,
    providerWalletStatsQuery.data,
    providerWalletSummaryQuery.data,
  ]);

  const providerFinanceFallbackLabel =
    providerWalletSummaryQuery.isLoading ||
    providerWalletStatsQuery.isLoading ||
    providerFinanceTimelineQuery.isLoading
      ? t.common.loading
      : t.common.noData;

  const resetConversation = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setIsTyping(false);
    setMessages([]);
    setInputValue('');
    setCurrentInputAction(null);
    setCurrentInputPayload(null);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    resetConversation();
  }, [currentLanguage.code, resetConversation]);

  const addMessage = useCallback(
    (
      type: 'bot' | 'user',
      content: ReactNode,
      options?: QuickReply[],
      inputConfig?: {
        type: 'text';
        placeholder: string;
        action: string;
        payload?: Record<string, string | number> | string;
      },
    ) => {
      const newMessage: Message = {
        id: `${Date.now()}-${messageSequenceRef.current++}`,
        type,
        content,
        options,
        timestamp: new Date(),
      };

      setMessages((previous) => [...previous, newMessage]);

      if (inputConfig) {
        setCurrentInputAction(inputConfig.action);
        setCurrentInputPayload(inputConfig.payload ?? null);
        return;
      }

      setCurrentInputAction(null);
      setCurrentInputPayload(null);
    },
    [],
  );

  const simulateTyping = useCallback((callback: () => void) => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    setIsTyping(true);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      typingTimerRef.current = null;
      callback();
    }, 800);
  }, []);

  const handleFlow = useCallback(
    (action: string, rawPayload?: Record<string, string | number> | string) => {
      const payload: Record<string, string | number> =
        typeof rawPayload === 'object' && rawPayload !== null ? rawPayload : {};
      const payloadStr = typeof rawPayload === 'string' ? rawPayload : '';

      simulateTyping(() => {
        switch (action) {
          case 'welcome':
            addMessage(
              'bot',
              `${t.chatbot.greeting}${user?.name ? ` ${user.name}` : ''} ! 👋 ${t.chatbot.howCanIHelp}`,
              [
                {
                  id: 'search',
                  label: `🔍 ${t.chatbot.searchPro}`,
                  icon: Search,
                  action: 'search_start',
                },
                {
                  id: 'services',
                  label: `📋 ${t.chatbot.availableServices}`,
                  icon: Briefcase,
                  action: 'list_services',
                },
                {
                  id: 'how',
                  label: `❓ ${t.chatbot.howItWorksOption}`,
                  icon: HelpCircle,
                  action: 'how_it_works',
                },
                {
                  id: 'payment',
                  label: `💳 ${t.chatbot.payments}`,
                  icon: CreditCard,
                  action: 'payment_methods',
                },
                {
                  id: 'account',
                  label: `👤 ${t.chatbot.myAccount}`,
                  icon: User,
                  action: 'my_account',
                },
                {
                  id: 'emergency',
                  label: `🆘 ${t.chatbot.emergencyOption}`,
                  icon: AlertCircle,
                  action: 'emergency',
                },
                ...(isProvider
                  ? [
                      {
                        id: 'prov_payments',
                        label: `💰 ${t.chatbot.myPaymentsPro}`,
                        icon: DollarSign,
                        action: 'provider_payments',
                      },
                    ]
                  : []),
              ],
            );
            break;

          case 'search_start':
          case 'list_services':
            addMessage('bot', t.chatbot.whatServiceLooking, [
              {
                id: 'nursing',
                label: `💉 ${t.services.nursing}`,
                action: 'show_subservices',
                payload: { service: 'nursing' },
              },
              {
                id: 'elderly_care',
                label: `👴 ${t.services.elderly_care}`,
                action: 'show_subservices',
                payload: { service: 'elderly_care' },
              },
              {
                id: 'physiotherapy',
                label: `🏃 ${t.services.physiotherapy}`,
                action: 'show_subservices',
                payload: { service: 'physiotherapy' },
              },
              {
                id: 'back',
                label: `← ${t.common.back}`,
                icon: ArrowLeft,
                action: 'welcome',
              },
            ]);
            break;

          case 'show_subservices': {
            const serviceKey = String(payload.service ?? '');
            const subServices =
              assistantLocale.chatbot.subServices[
                serviceKey as keyof typeof assistantLocale.chatbot.subServices
              ] ?? [];
            const serviceName = serviceNames[serviceKey] || serviceKey;

            addMessage(
              'bot',
              <div>
                <p className="mb-2 font-semibold text-primary">📋 {serviceName}</p>
                <p>{assistantLocale.chatbot.subServicePrompt}</p>
              </div>,
              [
                ...subServices.map((sub) => ({
                  id: sub.id,
                  label: sub.name,
                  action: 'ask_preferred_provider',
                  payload: {
                    ...payload,
                    subService: sub.id,
                    subServiceName: sub.name,
                  },
                })),
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'list_services',
                },
              ],
            );
            break;
          }

          case 'ask_preferred_provider':
            addMessage(
              'bot',
              <div>
                <p className="mb-2 font-semibold">✅ {payload.subServiceName}</p>
                <p>{t.chatbot.preferredProvider}</p>
              </div>,
              [
                {
                  id: 'yes_preferred',
                  label: `✓ ${t.chatbot.yesPreferred}`,
                  icon: UserCheck,
                  action: 'enter_provider_name',
                  payload,
                },
                {
                  id: 'no_preferred',
                  label: `✗ ${t.chatbot.noSearchForMe}`,
                  icon: Users,
                  action: 'search_criteria_rating',
                  payload,
                },
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'show_subservices',
                  payload: {
                    service: String(payload.service ?? ''),
                  },
                },
              ],
            );
            break;

          case 'enter_provider_name':
            addMessage(
              'bot',
              t.chatbot.enterProviderName,
              [
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'ask_preferred_provider',
                  payload,
                },
              ],
              {
                type: 'text',
                placeholder: assistantLocale.chatbot.providerNamePlaceholder,
                action: 'search_provider_by_name',
                payload,
              },
            );
            break;

          case 'search_provider_by_name': {
            const providerName = String(
              payload.providerName ?? assistantLocale.chatbot.providerFallbackName,
            );
            const serviceKey = String(payload.service ?? '');

            addMessage(
              'bot',
              <div className="space-y-2">
                <p className="font-semibold text-success">✅ {t.chatbot.providerFound}</p>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="font-medium text-foreground">{providerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {serviceNames[serviceKey]} - {payload.subServiceName}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-yellow-500">4.8</span>
                    <span className="text-xs text-muted-foreground">
                      • {numberFormatter.format(127)} {t.provider.reviews}
                    </span>
                  </div>
                </div>
              </div>,
              [
                {
                  id: 'book',
                  label: `📅 ${t.chatbot.bookNow}`,
                  icon: Calendar,
                  action: 'navigate_booking',
                  payload: {
                    ...payload,
                    providerName,
                  },
                },
                {
                  id: 'other',
                  label: `🔍 ${t.chatbot.searchAnother}`,
                  icon: Search,
                  action: 'search_criteria_rating',
                  payload,
                },
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'ask_preferred_provider',
                  payload,
                },
              ],
            );
            break;
          }

          case 'search_criteria_rating':
            addMessage('bot', `⭐ ${t.chatbot.minRating}`, [
              {
                id: 'r5',
                label: `⭐⭐⭐⭐⭐ 5 ${t.chatbot.stars}`,
                action: 'search_criteria_region',
                payload: {
                  ...payload,
                  minRating: 5,
                },
              },
              {
                id: 'r4',
                label: `⭐⭐⭐⭐ 4+ ${t.chatbot.stars}`,
                action: 'search_criteria_region',
                payload: {
                  ...payload,
                  minRating: 4,
                },
              },
              {
                id: 'any',
                label: t.chatbot.anyRating,
                action: 'search_criteria_region',
                payload: {
                  ...payload,
                  minRating: 0,
                },
              },
              {
                id: 'back',
                label: `← ${t.common.back}`,
                icon: ArrowLeft,
                action: 'ask_preferred_provider',
                payload,
              },
            ]);
            break;

          case 'search_criteria_region':
            addMessage('bot', `📍 ${t.chatbot.whichRegion}`, [
              ...assistantLocale.chatbot.regions.slice(0, 6).map((region) => ({
                id: region.toLowerCase(),
                label: region,
                action: 'show_search_results',
                payload: {
                  ...payload,
                  region,
                },
              })),
              {
                id: 'back',
                label: `← ${t.common.back}`,
                icon: ArrowLeft,
                action: 'search_criteria_rating',
                payload,
              },
            ]);
            break;

          case 'show_search_results': {
            const serviceKey = String(payload.service ?? '');
            const mockProviders = [
              {
                name: 'Sami Ben Ali',
                rating: 4.9,
                reviews: 156,
                price: 80,
              },
              {
                name: 'Fatma Trabelsi',
                rating: 4.7,
                reviews: 89,
                price: 65,
              },
            ];

            addMessage(
              'bot',
              <div className="space-y-3">
                <p className="font-semibold text-primary">
                  🎯 {mockProviders.length} {t.chatbot.professionalsFound}
                </p>
                <div className="mb-2 text-xs text-muted-foreground">
                  {serviceNames[serviceKey]} • {payload.region}
                </div>
                <div className="space-y-2">
                  {mockProviders.map((provider, index) => (
                    <div key={index} className="rounded-lg border border-border bg-muted/40 p-2">
                      <p className="text-sm font-medium text-foreground">{provider.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-yellow-500">{provider.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({numberFormatter.format(provider.reviews)})
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          {formatCurrency(provider.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>,
              [
                {
                  id: 'book_first',
                  label: `📅 ${t.chatbot.bookNow}`,
                  icon: Calendar,
                  action: 'navigate_booking',
                  payload: {
                    ...payload,
                    providerName: mockProviders[0].name,
                  },
                },
                {
                  id: 'view_all',
                  label: `👀 ${t.chatbot.viewAllResults}`,
                  icon: Search,
                  action: 'navigate',
                  payload: `/care/${serviceKey}`,
                },
                {
                  id: 'back',
                  label: `← ${t.chatbot.mainMenu}`,
                  icon: ArrowLeft,
                  action: 'welcome',
                },
              ],
            );
            break;
          }

          case 'navigate_booking': {
            const serviceKey = String(payload.service ?? '');

            addMessage(
              'bot',
              <div className="space-y-2">
                <p className="font-semibold text-success">✅ {t.common.success}</p>
                <p>{t.chatbot.redirectingToBooking}</p>
                <div className="rounded-lg border border-success/30 bg-success/10 p-3">
                  <p className="text-sm text-foreground">{payload.subServiceName}</p>
                  {payload.providerName ? (
                    <p className="text-xs text-primary">{payload.providerName}</p>
                  ) : null}
                </div>
              </div>,
              [
                {
                  id: 'go',
                  label: `🚀 ${t.chatbot.goToBooking}`,
                  icon: Calendar,
                  action: 'navigate',
                  payload: `/care/${serviceKey}`,
                },
                {
                  id: 'back',
                  label: `← ${t.chatbot.cancelAction}`,
                  icon: ArrowLeft,
                  action: 'welcome',
                },
              ],
            );
            break;
          }

          case 'how_it_works':
            addMessage(
              'bot',
              <div className="space-y-3">
                <p className="font-semibold">{t.howItWorks.title}</p>
                <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                  <li>{t.howItWorks.step1}</li>
                  <li>{t.howItWorks.step2}</li>
                  <li>{t.howItWorks.step3}</li>
                  <li>{t.howItWorks.step4}</li>
                </ol>
              </div>,
              [
                {
                  id: 'more',
                  label: t.common.seeMore,
                  icon: HelpCircle,
                  action: 'navigate',
                  payload: '/how-it-works',
                },
                {
                  id: 'book',
                  label: t.chatbot.bookNow,
                  icon: Calendar,
                  action: 'list_services',
                },
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'welcome',
                },
              ],
            );
            break;

          case 'payment_methods':
            addMessage('bot', t.howItWorks.securePaymentMethod, [
              ...assistantLocale.chatbot.paymentMethods.map((method) => ({
                id: method.id,
                label: method.label,
                action: 'payment_info',
                payload: method.description,
              })),
              {
                id: 'back',
                label: `← ${t.common.back}`,
                icon: ArrowLeft,
                action: 'welcome',
              },
            ]);
            break;

          case 'payment_info':
            addMessage('bot', `✅ ${payloadStr} - ${assistantLocale.chatbot.paymentInfoSuffix}`, [
              {
                id: 'book',
                label: t.chatbot.bookNow,
                icon: Calendar,
                action: 'list_services',
              },
              {
                id: 'back',
                label: `← ${t.common.back}`,
                icon: ArrowLeft,
                action: 'payment_methods',
              },
            ]);
            break;

          case 'my_account':
            if (!user) {
              addMessage('bot', t.chatbot.notConnected, [
                {
                  id: 'login',
                  label: t.auth.signIn,
                  icon: User,
                  action: 'navigate',
                  payload: '/auth/login',
                },
                {
                  id: 'signup',
                  label: t.auth.signUp,
                  icon: User,
                  action: 'navigate',
                  payload: '/auth/onboarding',
                },
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'welcome',
                },
              ]);
            } else {
              addMessage('bot', t.chatbot.accountManagement, [
                ...(isPatient || isProvider
                  ? [
                      {
                        id: 'profile',
                        label: `👤 ${t.chatbot.myProfile}`,
                        icon: User,
                        action: 'navigate',
                        payload: isProvider ? '/provider/profile' : '/patient/profile',
                      },
                      {
                        id: 'appointments',
                        label: `📅 ${t.chatbot.myAppointments}`,
                        icon: Calendar,
                        action: 'navigate',
                        payload: isProvider ? '/provider/schedule' : '/mon-espace',
                      },
                      {
                        id: 'messages',
                        label: `💬 ${t.chatbot.messagesOption}`,
                        icon: MessageSquare,
                        action: 'navigate',
                        payload: '/messages',
                      },
                    ]
                  : []),
                {
                  id: 'logout',
                  label: `🚪 ${t.chatbot.signOut}`,
                  icon: LogOut,
                  action: 'logout',
                },
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'welcome',
                },
              ]);
            }
            break;

          case 'provider_payments': {
            if (!providerFinanceSnapshot) {
              addMessage(
                'bot',
                <div className="space-y-2">
                  <p className="font-semibold text-primary">💰 {t.chatbot.myPaymentsPro}</p>
                  <p className="text-sm text-muted-foreground">{providerFinanceFallbackLabel}</p>
                </div>,
                providerFinanceQuickReplies,
              );
              break;
            }

            addMessage(
              'bot',
              <div className="space-y-3">
                <p className="font-semibold text-primary">💰 {t.chatbot.myPaymentsPro}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {providerFinanceSnapshot.usableBalance !== null ? (
                    <div className="rounded-lg border border-border bg-muted/40 p-2">
                      <p className="text-muted-foreground">{t.provider.usableBalance}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatCurrency(providerFinanceSnapshot.usableBalance)}
                      </p>
                    </div>
                  ) : null}
                  {providerFinanceSnapshot.currentMonthDeposits !== null ? (
                    <div className="rounded-lg border border-border bg-muted/40 p-2">
                      <p className="text-muted-foreground">{t.provider.currentMonthDeposits}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatCurrency(providerFinanceSnapshot.currentMonthDeposits)}
                      </p>
                    </div>
                  ) : null}
                  {providerFinanceSnapshot.currentMonthDeductions !== null ? (
                    <div className="rounded-lg border border-border bg-muted/40 p-2">
                      <p className="text-muted-foreground">{t.provider.currentMonthDeductions}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatCurrency(providerFinanceSnapshot.currentMonthDeductions)}
                      </p>
                    </div>
                  ) : null}
                </div>

                {providerFinanceSnapshot.recentItems.length > 0 ? (
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">
                      {t.provider.paymentHistory}
                    </p>
                    <div className="space-y-2">
                      {providerFinanceSnapshot.recentItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{item.title}</p>
                            <p className="text-muted-foreground">{item.date}</p>
                          </div>
                          <span className="whitespace-nowrap font-semibold text-primary">
                            {item.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>,
              providerFinanceQuickReplies,
            );
            break;
          }

          case 'emergency':
            addMessage(
              'bot',
              <div className="space-y-2">
                <p className="flex items-center gap-2 font-bold text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  {t.chatbot.medicalEmergency}
                </p>
                <p className="text-sm">{t.chatbot.ifVitalEmergency}</p>
              </div>,
              [
                {
                  id: 'samu',
                  label: `📞 ${t.chatbot.callSamu}`,
                  icon: Phone,
                  action: 'call',
                  payload: '190',
                },
                {
                  id: 'ambulance',
                  label: `🚑 ${t.chatbot.bookAmbulance}`,
                  action: 'navigate',
                  payload: AMBULANCE_SERVICE_ROUTE,
                },
                {
                  id: 'back',
                  label: `← ${t.common.back}`,
                  icon: ArrowLeft,
                  action: 'welcome',
                },
              ],
            );
            break;

          case 'navigate':
            navigate(payloadStr);
            break;

          case 'call':
            window.location.href = `tel:${payloadStr}`;
            break;

          case 'logout':
            void logout();
            navigate('/auth/login');
            break;

          default:
            addMessage('bot', t.chatbot.notSureUnderstand, [
              {
                id: 'menu',
                label: t.chatbot.mainMenu,
                icon: ArrowLeft,
                action: 'welcome',
              },
            ]);
        }
      });
    },
    [
      addMessage,
      assistantLocale,
      formatCurrency,
      isPatient,
      isProvider,
      logout,
      navigate,
      numberFormatter,
      providerFinanceFallbackLabel,
      providerFinanceQuickReplies,
      providerFinanceSnapshot,
      serviceNames,
      simulateTyping,
      t,
      user,
    ],
  );

  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      handleFlow('welcome');
    }
  }, [handleFlow, isAuthenticated, messages.length]);

  const handleUserAction = useCallback(
    (option: QuickReply) => {
      addMessage('user', option.label);
      handleFlow(option.action, option.payload);
    },
    [addMessage, handleFlow],
  );

  const handleTextSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!inputValue.trim()) {
        return;
      }

      addMessage('user', inputValue);

      if (currentInputAction) {
        handleFlow(currentInputAction, {
          ...((currentInputPayload as Record<string, string | number> | null) ?? {}),
          providerName: inputValue,
        });
        setInputValue('');
        return;
      }

      setInputValue('');

      const text = normalizeAssistantText(inputValue);

      if (
        assistantLocale.chatbot.textTriggers.emergency.some((keyword) => text.includes(keyword))
      ) {
        handleFlow('emergency');
      } else if (
        assistantLocale.chatbot.textTriggers.payment.some((keyword) => text.includes(keyword))
      ) {
        handleFlow('payment_methods');
      } else if (
        assistantLocale.chatbot.textTriggers.search.some((keyword) => text.includes(keyword))
      ) {
        handleFlow('list_services');
      } else if (
        assistantLocale.chatbot.textTriggers.account.some((keyword) => text.includes(keyword))
      ) {
        handleFlow('my_account');
      } else {
        handleFlow('welcome');
      }
    },
    [assistantLocale, addMessage, currentInputAction, currentInputPayload, handleFlow, inputValue],
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-app-screen min-h-0 flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white">
      <div className="sticky top-0 z-20 shrink-0 border-b border-slate-200 bg-white/95 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/95">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Sanad Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">{t.chatbot.online}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  message.type === 'user'
                    ? 'rounded-tr-none bg-cyan-600 text-white'
                    : 'rounded-tl-none border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {message.content}
              </div>

              {message.options ? (
                <div className="mt-3 flex max-w-full flex-wrap gap-2">
                  {message.options.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleUserAction(option)}
                        className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-white px-3 py-1.5 text-xs font-medium text-cyan-600 shadow-sm transition-all hover:border-cyan-500 hover:bg-slate-50 dark:bg-slate-800 dark:text-cyan-400 dark:hover:bg-slate-700"
                      >
                        {Icon ? <Icon className="h-3 w-3" /> : null}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <span className="mt-1 px-1 text-[10px] text-slate-400 dark:text-slate-500">
                {message.timestamp.toLocaleTimeString(currentLanguage.code, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}

          {isTyping ? (
            <div className="flex w-16 items-center gap-1 rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleTextSubmit}
        className="sticky bottom-0 z-20 shrink-0 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
      >
        <div className="mx-auto flex max-w-4xl items-center gap-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={
              currentInputAction
                ? assistantLocale.chatbot.providerNamePlaceholder
                : t.chatbot.writeMessage
            }
            className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
