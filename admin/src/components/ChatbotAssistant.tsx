import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Search,
  CreditCard,
  User,
  HelpCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Briefcase,
  Phone,
  FileText,
  LogOut,
  Calendar,
  Sparkles,
  ArrowLeft,
  UserCheck,
  Users } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
interface QuickReply {
  id: string;
  label: string;
  icon?: React.ElementType;
  action: string;
  payload?: any;
}
interface Message {
  id: string;
  type: 'bot' | 'user';
  content: React.ReactNode;
  options?: QuickReply[];
  timestamp: Date;
  inputType?: 'text' | 'none';
  inputPlaceholder?: string;
  inputAction?: string;
  inputPayload?: any;
}
const subServicesData: Record<
  string,
  {
    id: string;
    name: string;
    description: string;
  }[]> =
{
  nursing: [
  {
    id: 'injection_im',
    name: 'Injection intramusculaire',
    description: "Administration d'injections IM"
  },
  {
    id: 'pansement_simple',
    name: 'Pansement simple',
    description: 'Réfection de pansement'
  },
  {
    id: 'perfusion',
    name: 'Perfusion à domicile',
    description: 'Pose et surveillance IV'
  }],

  elderly: [
  {
    id: 'toilette',
    name: 'Aide à la toilette',
    description: 'Assistance toilette quotidienne'
  },
  {
    id: 'repas',
    name: 'Aide aux repas',
    description: 'Préparation et aide repas'
  },
  {
    id: 'compagnie',
    name: 'Compagnie',
    description: 'Présence et stimulation'
  }],

  physio: [
  {
    id: 'ortho',
    name: 'Rééducation orthopédique',
    description: 'Post-fracture, entorse, prothèse'
  },
  {
    id: 'respi',
    name: 'Kinésithérapie respiratoire',
    description: 'Désencombrement bronchique'
  },
  {
    id: 'massage',
    name: 'Massage thérapeutique',
    description: 'Décontracturant, drainage'
  }]

};
const regions = [
'Tunis',
'Ariana',
'Ben Arous',
'Manouba',
'Sousse',
'Sfax',
'Nabeul',
'Bizerte',
'Monastir',
'Kairouan'];

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentInputAction, setCurrentInputAction] = useState<string | null>(
    null
  );
  const [currentInputPayload, setCurrentInputPayload] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const serviceNames: Record<string, string> = {
    nursing: t.services.nursing,
    elderly: t.services.elderly,
    physio: t.services.physio,
    maternity: t.services.maternityService,
    night: t.services.nightGuard,
    doctor: t.services.doctorHome,
    psychology: t.services.psychology,
    nutrition: t.services.nutrition,
    laboratory: t.services.laboratory,
    radiology: t.services.radiology,
    equipment: t.nav.equipment,
    babysitting: t.services.babysitting,
    ambulance: t.services.ambulance
  };
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleFlow('welcome');
    }
  }, [isOpen]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);
  const addMessage = (
  type: 'bot' | 'user',
  content: React.ReactNode,
  options?: QuickReply[],
  inputConfig?: {
    type: 'text';
    placeholder: string;
    action: string;
    payload?: any;
  }) =>
  {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      options,
      timestamp: new Date(),
      inputType: inputConfig?.type,
      inputPlaceholder: inputConfig?.placeholder,
      inputAction: inputConfig?.action,
      inputPayload: inputConfig?.payload
    };
    setMessages((prev) => [...prev, newMessage]);
    if (inputConfig) {
      setCurrentInputAction(inputConfig.action);
      setCurrentInputPayload(inputConfig.payload);
    } else {
      setCurrentInputAction(null);
      setCurrentInputPayload(null);
    }
  };
  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 800);
  };
  const handleFlow = (action: string, payload?: any) => {
    simulateTyping(() => {
      switch (action) {
        case 'welcome':
          addMessage(
            'bot',
            `${t.chatbot.greeting} ${user?.name || ''} ! 👋 ${t.chatbot.howCanIHelp}`,
            [
            {
              id: 'search',
              label: `🔍 ${t.chatbot.searchPro}`,
              icon: Search,
              action: 'search_start'
            },
            {
              id: 'services',
              label: `📋 ${t.chatbot.availableServices}`,
              icon: Briefcase,
              action: 'list_services'
            },
            {
              id: 'how',
              label: `❓ ${t.chatbot.howItWorksOption}`,
              icon: HelpCircle,
              action: 'how_it_works'
            },
            {
              id: 'payment',
              label: `💳 ${t.chatbot.payments}`,
              icon: CreditCard,
              action: 'payment_methods'
            },
            {
              id: 'account',
              label: `👤 ${t.chatbot.myAccount}`,
              icon: User,
              action: 'my_account'
            },
            {
              id: 'emergency',
              label: `🆘 ${t.chatbot.emergencyOption}`,
              icon: AlertCircle,
              action: 'emergency'
            },
            ...(user?.role === 'professional' ?
            [
            {
              id: 'prov_payments',
              label: `💰 ${t.chatbot.myPaymentsPro}`,
              icon: DollarSign,
              action: 'provider_payments'
            }] :

            [])]

          );
          break;
        case 'search_start':
        case 'list_services':
          addMessage('bot', t.chatbot.whatServiceLooking, [
          {
            id: 'nursing',
            label: `💉 ${t.services.nursing}`,
            action: 'show_subservices',
            payload: {
              service: 'nursing'
            }
          },
          {
            id: 'elderly',
            label: `👴 ${t.services.elderly}`,
            action: 'show_subservices',
            payload: {
              service: 'elderly'
            }
          },
          {
            id: 'physio',
            label: `🏃 ${t.services.physio}`,
            action: 'show_subservices',
            payload: {
              service: 'physio'
            }
          },
          {
            id: 'back',
            label: `← ${t.common.back}`,
            icon: ArrowLeft,
            action: 'welcome'
          }]
          );
          break;
        case 'show_subservices':
          const subServices = subServicesData[payload.service] || [];
          const serviceName = serviceNames[payload.service] || payload.service;
          addMessage(
            'bot',
            <div>
              <p
                className={`font-semibold mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                📋 {serviceName}
              </p>
              <p>Quel sous-service vous intéresse ?</p>
            </div>,
            [
            ...subServices.map((sub) => ({
              id: sub.id,
              label: sub.name,
              action: 'ask_preferred_provider',
              payload: {
                ...payload,
                subService: sub.id,
                subServiceName: sub.name
              }
            })),
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'list_services'
            }]

          );
          break;
        case 'ask_preferred_provider':
          addMessage(
            'bot',
            <div>
              <p className="font-semibold mb-2">✅ {payload.subServiceName}</p>
              <p>{t.chatbot.preferredProvider}</p>
            </div>,
            [
            {
              id: 'yes_preferred',
              label: `✓ ${t.chatbot.yesPreferred}`,
              icon: UserCheck,
              action: 'enter_provider_name',
              payload
            },
            {
              id: 'no_preferred',
              label: `✗ ${t.chatbot.noSearchForMe}`,
              icon: Users,
              action: 'search_criteria_rating',
              payload
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'show_subservices',
              payload: {
                service: payload.service
              }
            }]

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
              payload
            }],

            {
              type: 'text',
              placeholder: 'Nom du professionnel...',
              action: 'search_provider_by_name',
              payload
            }
          );
          break;
        case 'search_provider_by_name':
          const providerName = payload.providerName || 'Ce professionnel';
          addMessage(
            'bot',
            <div className="space-y-2">
              <p className="font-semibold text-green-500">
                ✅ {t.chatbot.providerFound}
              </p>
              <div
                className={`rounded-lg p-3 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                <p
                  className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {providerName}
                </p>
                <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                  {serviceNames[payload.service]} - {payload.subServiceName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-yellow-500">4.8</span>
                  <span
                    className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                    • 127 avis
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
                providerName
              }
            },
            {
              id: 'other',
              label: `🔍 ${t.chatbot.searchAnother}`,
              icon: Search,
              action: 'search_criteria_rating',
              payload
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'ask_preferred_provider',
              payload
            }]

          );
          break;
        case 'search_criteria_rating':
          addMessage('bot', `⭐ ${t.chatbot.minRating}`, [
          {
            id: 'r5',
            label: `⭐⭐⭐⭐⭐ 5 ${t.chatbot.stars}`,
            action: 'search_criteria_region',
            payload: {
              ...payload,
              minRating: 5
            }
          },
          {
            id: 'r4',
            label: `⭐⭐⭐⭐ 4+ ${t.chatbot.stars}`,
            action: 'search_criteria_region',
            payload: {
              ...payload,
              minRating: 4
            }
          },
          {
            id: 'any',
            label: t.chatbot.anyRating,
            action: 'search_criteria_region',
            payload: {
              ...payload,
              minRating: 0
            }
          },
          {
            id: 'back',
            label: `← ${t.common.back}`,
            icon: ArrowLeft,
            action: 'ask_preferred_provider',
            payload
          }]
          );
          break;
        case 'search_criteria_region':
          addMessage('bot', `📍 ${t.chatbot.whichRegion}`, [
          ...regions.slice(0, 6).map((region) => ({
            id: region.toLowerCase(),
            label: region,
            action: 'show_search_results',
            payload: {
              ...payload,
              region
            }
          })),
          {
            id: 'back',
            label: `← ${t.common.back}`,
            icon: ArrowLeft,
            action: 'search_criteria_rating',
            payload
          }]
          );
          break;
        case 'show_search_results':
          const mockProviders = [
          {
            name: 'Dr. Sami Ben Ali',
            rating: 4.9,
            reviews: 156,
            price: 80
          },
          {
            name: 'Mme. Fatma Trabelsi',
            rating: 4.7,
            reviews: 89,
            price: 65
          }];

          addMessage(
            'bot',
            <div className="space-y-3">
              <p
                className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                🎯 {mockProviders.length} {t.chatbot.professionalsFound}
              </p>
              <div
                className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {serviceNames[payload.service]} • {payload.region}
              </div>
              <div className="space-y-2">
                {mockProviders.map((prov, idx) =>
                <div
                  key={idx}
                  className={`rounded-lg p-2 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <p
                    className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {prov.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-yellow-500">
                          {prov.rating}
                        </span>
                        <span
                        className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        
                          ({prov.reviews})
                        </span>
                      </div>
                      <span
                      className={`text-xs font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {prov.price} TND
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>,
            [
            {
              id: 'book_first',
              label: `📅 Réserver ${mockProviders[0].name.split(' ')[1]}`,
              icon: Calendar,
              action: 'navigate_booking',
              payload: {
                ...payload,
                providerName: mockProviders[0].name
              }
            },
            {
              id: 'view_all',
              label: `👀 ${t.chatbot.viewAllResults}`,
              icon: Search,
              action: 'navigate',
              payload: `/care/${payload.service}`
            },
            {
              id: 'back',
              label: `← ${t.chatbot.mainMenu}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]

          );
          break;
        case 'navigate_booking':
          addMessage(
            'bot',
            <div className="space-y-2">
              <p className="font-semibold text-green-500">✅ Parfait !</p>
              <p>{t.chatbot.redirectingToBooking}</p>
              <div
                className={`rounded-lg p-3 border border-green-500/30 ${isDark ? 'bg-slate-800/50' : 'bg-green-50'}`}>
                
                <p
                  className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {payload.subServiceName}
                </p>
                {payload.providerName &&
                <p
                  className={`text-xs ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    avec {payload.providerName}
                  </p>
                }
              </div>
            </div>,
            [
            {
              id: 'go',
              label: `🚀 ${t.chatbot.goToBooking}`,
              icon: Calendar,
              action: 'navigate',
              payload: `/care-booking/${payload.service}`
            },
            {
              id: 'back',
              label: `← ${t.chatbot.cancelAction}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]

          );
          break;
        case 'how_it_works':
          addMessage(
            'bot',
            <div className="space-y-3">
              <p className="font-semibold">{t.howItWorks.title}</p>
              <ol
                className={`list-decimal list-inside space-y-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
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
              payload: '/how-it-works'
            },
            {
              id: 'book',
              label: t.chatbot.bookNow,
              icon: Calendar,
              action: 'list_services'
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]

          );
          break;
        case 'payment_methods':
          addMessage('bot', t.howItWorks.securePaymentMethod, [
          {
            id: 'card',
            label: '💳 Carte Bancaire',
            action: 'payment_info',
            payload: 'Visa, Mastercard acceptées'
          },
          {
            id: 'cash',
            label: '💵 Espèces',
            action: 'payment_info',
            payload: 'Paiement au professionnel'
          },
          {
            id: 'd17',
            label: '📱 D17 / Flouci',
            action: 'payment_info',
            payload: 'Paiement mobile'
          },
          {
            id: 'back',
            label: `← ${t.common.back}`,
            icon: ArrowLeft,
            action: 'welcome'
          }]
          );
          break;
        case 'payment_info':
          addMessage(
            'bot',
            `✅ ${payload} - Moyen de paiement sécurisé et pratique.`,
            [
            {
              id: 'book',
              label: t.chatbot.bookNow,
              icon: Calendar,
              action: 'list_services'
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'payment_methods'
            }]

          );
          break;
        case 'my_account':
          if (!user) {
            addMessage('bot', t.chatbot.notConnected, [
            {
              id: 'login',
              label: t.auth.signIn,
              icon: User,
              action: 'navigate',
              payload: '/auth/login'
            },
            {
              id: 'signup',
              label: t.auth.signUp,
              icon: User,
              action: 'navigate',
              payload: '/auth/onboarding'
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]
            );
          } else {
            addMessage('bot', t.chatbot.accountManagement, [
            {
              id: 'profile',
              label: `👤 ${t.chatbot.myProfile}`,
              icon: User,
              action: 'navigate',
              payload:
              user.role === 'professional' ?
              '/provider-dashboard' :
              '/patient-dashboard'
            },
            {
              id: 'appointments',
              label: `📅 ${t.chatbot.myAppointments}`,
              icon: Calendar,
              action: 'navigate',
              payload:
              user.role === 'professional' ?
              '/provider/schedule' :
              '/patient-dashboard'
            },
            {
              id: 'messages',
              label: `💬 ${t.chatbot.messagesOption}`,
              icon: MessageSquare,
              action: 'navigate',
              payload: '/messages'
            },
            {
              id: 'logout',
              label: `🚪 ${t.chatbot.signOut}`,
              icon: LogOut,
              action: 'logout'
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]
            );
          }
          break;
        case 'provider_payments':
          const pendingPayments = [
          {
            id: 1,
            patient: 'Ahmed B.',
            service: 'Soins Infirmiers',
            amount: 150
          },
          {
            id: 2,
            patient: 'Fatma S.',
            service: 'Pansement',
            amount: 80
          }];

          const totalAmount = pendingPayments.reduce(
            (sum, p) => sum + p.amount,
            0
          );
          addMessage(
            'bot',
            <div className="space-y-3">
              <p
                className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                💰 {t.chatbot.pendingPayments}
              </p>
              <div
                className={`rounded-lg p-3 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                <div
                  className={`flex justify-between items-center mb-2 pb-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  
                  <span
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                    {t.chatbot.total}
                  </span>
                  <span className="text-lg font-bold text-green-500">
                    {totalAmount} TND
                  </span>
                </div>
                <div className="space-y-2">
                  {pendingPayments.map((p) =>
                  <div key={p.id} className="flex justify-between text-xs">
                      <span
                      className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      
                        {p.patient} - {p.service}
                      </span>
                      <span
                      className={`font-medium ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {p.amount} TND
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            [
            {
              id: 'history',
              label: `📋 ${t.chatbot.fullHistory}`,
              icon: FileText,
              action: 'navigate',
              payload: '/provider/transactions'
            },
            {
              id: 'request',
              label: `💸 ${t.chatbot.requestTransfer}`,
              icon: DollarSign,
              action: 'navigate',
              payload: '/provider/billing'
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]

          );
          break;
        case 'emergency':
          addMessage(
            'bot',
            <div className="space-y-2">
              <p className="font-bold text-red-500 flex items-center gap-2">
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
              payload: '190'
            },
            {
              id: 'ambulance',
              label: `🚑 ${t.chatbot.bookAmbulance}`,
              action: 'navigate',
              payload: '/ambulance-booking'
            },
            {
              id: 'back',
              label: `← ${t.common.back}`,
              icon: ArrowLeft,
              action: 'welcome'
            }]

          );
          break;
        case 'navigate':
          navigate(payload);
          setIsOpen(false);
          break;
        case 'call':
          window.location.href = `tel:${payload}`;
          break;
        case 'logout':
          navigate('/auth/login');
          setIsOpen(false);
          break;
        default:
          addMessage('bot', t.chatbot.notSureUnderstand, [
          {
            id: 'menu',
            label: t.chatbot.mainMenu,
            icon: ArrowLeft,
            action: 'welcome'
          }]
          );
      }
    });
  };
  const handleUserAction = (option: QuickReply) => {
    addMessage('user', option.label);
    handleFlow(option.action, option.payload);
  };
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addMessage('user', inputValue);
    if (currentInputAction) {
      handleFlow(currentInputAction, {
        ...currentInputPayload,
        providerName: inputValue
      });
      setInputValue('');
      return;
    }
    setInputValue('');
    const text = inputValue.toLowerCase();
    if (text.includes('urgence') || text.includes('samu'))
    handleFlow('emergency');else
    if (text.includes('prix') || text.includes('paiement'))
    handleFlow('payment_methods');else
    if (text.includes('chercher') || text.includes('réserver'))
    handleFlow('list_services');else
    if (text.includes('compte') || text.includes('profil'))
    handleFlow('my_account');else
    handleFlow('welcome');
  };
  // Only render if user is authenticated
  if (!isAuthenticated) return null;
  return (
    <>
      {/* Floating Button */}
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          top: -400,
          left: -300,
          right: 20,
          bottom: 20
        }}
        initial={{
          scale: 0
        }}
        animate={{
          scale: 1
        }}
        whileHover={{
          scale: 1.1
        }}
        whileTap={{
          scale: 0.9
        }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors cursor-grab active:cursor-grabbing ${isOpen ? isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}
        style={{
          touchAction: 'none'
        }}>
        
        {isOpen ?
        <X className="h-6 w-6" /> :

        <>
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></span>
            <Bot className="h-7 w-7" />
          </>
        }
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          className={`fixed bottom-40 right-4 z-50 w-[calc(100%-2rem)] max-w-sm border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            {/* Header */}
            <div
            className={`backdrop-blur-md p-4 border-b flex items-center justify-between ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-800/80 border-slate-700' : 'bg-gradient-to-r from-slate-50 to-white border-slate-200'}`}>
            
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3
                  className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    Sanad Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      {t.chatbot.online}
                    </span>
                  </div>
                </div>
              </div>
              <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
              
                <X
                className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              
              </button>
            </div>

            {/* Messages Area */}
            <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px] ${isDark ? 'bg-slate-900/95' : 'bg-slate-50/95'}`}>
            
              {messages.map((msg) =>
            <motion.div
              key={msg.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              
                  <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : isDark ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'}`}>
                
                    {msg.content}
                  </div>
                  {msg.options &&
              <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                      {msg.options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleUserAction(option)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium rounded-full transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-cyan-500/30 hover:border-cyan-500 text-cyan-400' : 'bg-white hover:bg-slate-50 border-cyan-500/30 hover:border-cyan-500 text-cyan-600 shadow-sm'}`}>
                      
                            {Icon && <Icon className="h-3 w-3" />}
                            {option.label}
                          </button>);

                })}
                    </div>
              }
                  <span
                className={`text-[10px] mt-1 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                    {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </span>
                </motion.div>
            )}
              {isTyping &&
            <div
              className={`flex items-center gap-1 p-3 rounded-2xl rounded-tl-none w-16 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              
                  <div
                className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`}
                style={{
                  animationDelay: '0ms'
                }}>
              </div>
                  <div
                className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`}
                style={{
                  animationDelay: '150ms'
                }}>
              </div>
                  <div
                className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`}
                style={{
                  animationDelay: '300ms'
                }}>
              </div>
                </div>
            }
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
            onSubmit={handleTextSubmit}
            className={`p-3 border-t flex gap-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
              currentInputAction ?
              t.chatbot.enterProviderName :
              t.chatbot.writeMessage
              }
              className={`flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'}`} />
            
              <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}