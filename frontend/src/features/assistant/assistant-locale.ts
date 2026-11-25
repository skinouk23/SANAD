import { AMBULANCE_SERVICE_ROUTE } from '@/features/assistant/routes';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

type AssistantServiceKey = 'nursing' | 'elderly_care' | 'physiotherapy';

export type AssistantVoiceIntentId =
  | 'appointments'
  | 'services'
  | 'medicines'
  | 'emergency'
  | 'messages'
  | 'home';

interface AssistantPaymentMethod {
  id: string;
  label: string;
  description: string;
}

interface AssistantTextTriggers {
  emergency: readonly string[];
  payment: readonly string[];
  search: readonly string[];
  account: readonly string[];
}

export interface AssistantSubService {
  id: string;
  name: string;
  description: string;
}

export interface AssistantVoiceIntent {
  id: AssistantVoiceIntentId;
  keywords: readonly string[];
  response: string;
  route: string;
  label: string;
}

export interface AssistantVoiceQuickSuggestion {
  id: string;
  label: string;
  query: string;
  intentId: AssistantVoiceIntentId;
}

interface AssistantSpeechConfig {
  recognitionLocale: string;
  synthesisLocales: readonly string[];
  fallbackSynthesisLocale: string;
}

interface AssistantChatbotLocaleConfig {
  openLabel: string;
  closeLabel: string;
  subServicePrompt: string;
  providerNamePlaceholder: string;
  providerFallbackName: string;
  paymentMethods: readonly AssistantPaymentMethod[];
  paymentInfoSuffix: string;
  textTriggers: AssistantTextTriggers;
  regions: readonly string[];
  subServices: Record<AssistantServiceKey, readonly AssistantSubService[]>;
}

interface AssistantVoiceLocaleConfig {
  triggerLabel: string;
  openLabel: string;
  closeLabel: string;
  panelTitle: string;
  panelSubtitle: string;
  stateLabels: {
    listening: string;
    speaking: string;
    processing: string;
    error: string;
    idle: string;
  };
  transcriptLabel: string;
  responseLabel: string;
  errorLabel: string;
  quickSuggestionsLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  stopLabel: string;
  speakingActionLabel: string;
  speakAgainLabel: string;
  unsupportedBrowserMessage: string;
  microphoneDeniedMessage: string;
  microphoneRetryMessage: string;
  fallbackResponse: string;
  quickSuggestions: readonly AssistantVoiceQuickSuggestion[];
  intents: readonly AssistantVoiceIntent[];
  speech: AssistantSpeechConfig;
}

export interface AssistantLocaleConfig {
  chatbot: AssistantChatbotLocaleConfig;
  voice: AssistantVoiceLocaleConfig;
}

interface LocalizedAssistantConfig {
  chatbot: Omit<AssistantChatbotLocaleConfig, 'regions'>;
  voice: Omit<AssistantVoiceLocaleConfig, 'speech'>;
}

const REGIONS = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Sousse',
  'Sfax',
  'Nabeul',
  'Bizerte',
  'Monastir',
  'Kairouan',
] as const;

const SPEECH_CONFIGS = {
  'ar-TN': {
    recognitionLocale: 'ar-TN',
    synthesisLocales: ['ar-TN', 'ar-SA', 'ar-EG', 'ar'],
    fallbackSynthesisLocale: 'ar-SA',
  },
  'de-DE': {
    recognitionLocale: 'de-DE',
    synthesisLocales: ['de-DE', 'de'],
    fallbackSynthesisLocale: 'de-DE',
  },
  'en-GB': {
    recognitionLocale: 'en-GB',
    synthesisLocales: ['en-GB', 'en-US', 'en'],
    fallbackSynthesisLocale: 'en-GB',
  },
  'fr-FR': {
    recognitionLocale: 'fr-FR',
    synthesisLocales: ['fr-FR', 'fr-TN', 'fr-CA', 'fr'],
    fallbackSynthesisLocale: 'fr-FR',
  },
  'nl-NL': {
    recognitionLocale: 'nl-NL',
    synthesisLocales: ['nl-NL', 'nl-BE', 'nl'],
    fallbackSynthesisLocale: 'nl-NL',
  },
} satisfies Record<LanguageCode, AssistantSpeechConfig>;

const ASSISTANT_LOCALES = {
  'fr-FR': {
    chatbot: {
      openLabel: 'Ouvrir le chatbot',
      closeLabel: 'Fermer le chatbot',
      subServicePrompt: 'Quel sous-service vous intéresse ?',
      providerNamePlaceholder: 'Nom du professionnel...',
      providerFallbackName: 'Ce professionnel',
      paymentMethods: [
        {
          id: 'card',
          label: '💳 Carte bancaire',
          description: 'Visa et Mastercard acceptées',
        },
        {
          id: 'cash',
          label: '💵 Espèces',
          description: 'Paiement au professionnel',
        },
        {
          id: 'd17',
          label: '📱 D17 / Flouci',
          description: 'Paiement mobile',
        },
      ],
      paymentInfoSuffix: 'Moyen de paiement sécurisé et pratique.',
      textTriggers: {
        emergency: ['urgence', 'ambulance', 'samu', 'secours'],
        payment: ['prix', 'paiement', 'payer', 'carte'],
        search: ['chercher', 'rechercher', 'reserver', 'service', 'soin'],
        account: ['compte', 'profil', 'messages', 'rendez vous'],
      },
      subServices: {
        nursing: [
          {
            id: 'injection_im',
            name: 'Injection intramusculaire',
            description: "Administration d'injections IM",
          },
          {
            id: 'pansement_simple',
            name: 'Pansement simple',
            description: 'Réfection de pansement',
          },
          {
            id: 'perfusion',
            name: 'Perfusion à domicile',
            description: 'Pose et surveillance IV',
          },
        ],
        elderly_care: [
          {
            id: 'toilette',
            name: 'Aide à la toilette',
            description: 'Assistance toilette quotidienne',
          },
          {
            id: 'repas',
            name: 'Aide aux repas',
            description: 'Préparation et aide repas',
          },
          {
            id: 'compagnie',
            name: 'Compagnie',
            description: 'Présence et stimulation',
          },
        ],
        physiotherapy: [
          {
            id: 'ortho',
            name: 'Rééducation orthopédique',
            description: 'Post-fracture, entorse, prothèse',
          },
          {
            id: 'respi',
            name: 'Kinésithérapie respiratoire',
            description: 'Désencombrement bronchique',
          },
          {
            id: 'massage',
            name: 'Massage thérapeutique',
            description: 'Décontracturant, drainage',
          },
        ],
      },
    },
    voice: {
      triggerLabel: 'Aide vocale',
      openLabel: "Ouvrir l'assistant vocal",
      closeLabel: "Fermer l'assistant vocal",
      panelTitle: 'Assistant vocal',
      panelSubtitle: 'Sanad • Toujours là pour vous',
      stateLabels: {
        listening: 'Je vous écoute...',
        speaking: 'Je réponds...',
        processing: 'Je réfléchis...',
        error: 'Erreur',
        idle: 'Appuyez pour parler',
      },
      transcriptLabel: 'Vous avez dit',
      responseLabel: 'Réponse',
      errorLabel: 'Erreur',
      quickSuggestionsLabel: 'Suggestions rapides',
      muteLabel: 'Couper le son',
      unmuteLabel: 'Activer le son',
      stopLabel: 'Arrêter',
      speakingActionLabel: 'Je parle...',
      speakAgainLabel: 'Parler à nouveau',
      unsupportedBrowserMessage: "La reconnaissance vocale n'est pas disponible sur ce navigateur.",
      microphoneDeniedMessage: 'Accès au microphone refusé. Veuillez autoriser le microphone.',
      microphoneRetryMessage: 'Impossible de vous entendre. Veuillez réessayer.',
      fallbackResponse:
        "Je n'ai pas bien compris. Pouvez-vous répéter ? Par exemple : mes rendez-vous ou trouver un soin.",
      quickSuggestions: [
        {
          id: 'appointments',
          label: 'Mon prochain RDV',
          query: 'prochain rendez vous',
          intentId: 'appointments',
        },
        {
          id: 'services',
          label: 'Trouver un soin',
          query: 'soins infirmier',
          intentId: 'services',
        },
        {
          id: 'medicines',
          label: 'Mes médicaments',
          query: 'medicaments',
          intentId: 'medicines',
        },
        {
          id: 'emergency',
          label: 'Urgences',
          query: 'urgence',
          intentId: 'emergency',
        },
      ],
      intents: [
        {
          id: 'appointments',
          keywords: [
            'rendez vous',
            'rdv',
            'appointment',
            'prochain',
            'consultation',
            'planning',
            'agenda',
          ],
          response: 'Je vous emmène voir vos rendez-vous.',
          route: '/mon-espace',
          label: 'Mes rendez-vous',
        },
        {
          id: 'services',
          keywords: [
            'infirmier',
            'infirmiere',
            'soin',
            'soins',
            'service',
            'aide',
            'medecin',
            'docteur',
            'kine',
            'physio',
            'physiotherapie',
          ],
          response: 'Voici les services de santé disponibles.',
          route: '/services',
          label: 'Services de santé',
        },
        {
          id: 'medicines',
          keywords: ['medicament', 'pharmacie', 'ordonnance', 'pilule', 'traitement'],
          response: 'Je vous emmène vers vos médicaments.',
          route: '/medicaments',
          label: 'Mes médicaments',
        },
        {
          id: 'emergency',
          keywords: ['urgence', 'ambulance', 'secours', 'samu', 'aide urgente', 'appel'],
          response: 'Attention ! Je vous dirige vers les urgences.',
          route: AMBULANCE_SERVICE_ROUTE,
          label: 'Urgences',
        },
        {
          id: 'messages',
          keywords: ['message', 'messagerie', 'chat', 'ecrire', 'contacter'],
          response: 'Voici vos messages.',
          route: '/messages',
          label: 'Messages',
        },
        {
          id: 'home',
          keywords: ['accueil', 'tableau de bord', 'home', 'retour', 'principal'],
          response: "Retour à l'accueil.",
          route: '/patient-dashboard',
          label: 'Accueil',
        },
      ],
    },
  },
  'en-GB': {
    chatbot: {
      openLabel: 'Open chatbot',
      closeLabel: 'Close chatbot',
      subServicePrompt: 'Which sub-service are you interested in?',
      providerNamePlaceholder: 'Professional name...',
      providerFallbackName: 'This professional',
      paymentMethods: [
        {
          id: 'card',
          label: '💳 Bank card',
          description: 'Visa and Mastercard accepted',
        },
        {
          id: 'cash',
          label: '💵 Cash',
          description: 'Payment to the professional',
        },
        {
          id: 'd17',
          label: '📱 D17 / Flouci',
          description: 'Mobile payment',
        },
      ],
      paymentInfoSuffix: 'Secure and convenient payment method.',
      textTriggers: {
        emergency: ['emergency', 'ambulance', 'urgent', 'help'],
        payment: ['payment', 'price', 'pay', 'card'],
        search: ['search', 'book', 'service', 'care'],
        account: ['account', 'profile', 'appointments', 'messages'],
      },
      subServices: {
        nursing: [
          {
            id: 'injection_im',
            name: 'Intramuscular injection',
            description: 'IM injection administration',
          },
          {
            id: 'pansement_simple',
            name: 'Simple dressing',
            description: 'Dressing renewal',
          },
          {
            id: 'perfusion',
            name: 'Home infusion',
            description: 'IV setup and monitoring',
          },
        ],
        elderly_care: [
          {
            id: 'toilette',
            name: 'Personal hygiene assistance',
            description: 'Daily hygiene support',
          },
          {
            id: 'repas',
            name: 'Meal assistance',
            description: 'Meal preparation and support',
          },
          {
            id: 'compagnie',
            name: 'Companionship',
            description: 'Presence and social stimulation',
          },
        ],
        physiotherapy: [
          {
            id: 'ortho',
            name: 'Orthopaedic rehabilitation',
            description: 'Post-fracture, sprain, prosthesis',
          },
          {
            id: 'respi',
            name: 'Respiratory physiotherapy',
            description: 'Bronchial clearance support',
          },
          {
            id: 'massage',
            name: 'Therapeutic massage',
            description: 'Relaxation and drainage',
          },
        ],
      },
    },
    voice: {
      triggerLabel: 'Voice help',
      openLabel: 'Open voice assistant',
      closeLabel: 'Close voice assistant',
      panelTitle: 'Voice assistant',
      panelSubtitle: 'Sanad • Always here for you',
      stateLabels: {
        listening: 'I am listening...',
        speaking: 'I am replying...',
        processing: 'I am thinking...',
        error: 'Error',
        idle: 'Tap to speak',
      },
      transcriptLabel: 'You said',
      responseLabel: 'Response',
      errorLabel: 'Error',
      quickSuggestionsLabel: 'Quick suggestions',
      muteLabel: 'Mute sound',
      unmuteLabel: 'Turn sound on',
      stopLabel: 'Stop',
      speakingActionLabel: 'Speaking...',
      speakAgainLabel: 'Speak again',
      unsupportedBrowserMessage: 'Voice recognition is not available in this browser.',
      microphoneDeniedMessage: 'Microphone access was denied. Please allow microphone access.',
      microphoneRetryMessage: 'I could not hear you. Please try again.',
      fallbackResponse:
        'I did not catch that. Please repeat, for example: my appointments or find care.',
      quickSuggestions: [
        {
          id: 'appointments',
          label: 'My next appointment',
          query: 'next appointment',
          intentId: 'appointments',
        },
        {
          id: 'services',
          label: 'Find care',
          query: 'find care service',
          intentId: 'services',
        },
        {
          id: 'medicines',
          label: 'My medicines',
          query: 'my medicines',
          intentId: 'medicines',
        },
        {
          id: 'emergency',
          label: 'Emergency',
          query: 'emergency',
          intentId: 'emergency',
        },
      ],
      intents: [
        {
          id: 'appointments',
          keywords: ['appointment', 'appointments', 'next', 'consultation', 'schedule', 'agenda'],
          response: 'I am taking you to your appointments.',
          route: '/mon-espace',
          label: 'My appointments',
        },
        {
          id: 'services',
          keywords: ['care', 'service', 'services', 'nurse', 'doctor', 'physio', 'support'],
          response: 'Here are the available care services.',
          route: '/services',
          label: 'Care services',
        },
        {
          id: 'medicines',
          keywords: ['medicine', 'medicines', 'pharmacy', 'prescription', 'treatment'],
          response: 'I am taking you to your medicines.',
          route: '/medicaments',
          label: 'My medicines',
        },
        {
          id: 'emergency',
          keywords: ['emergency', 'ambulance', 'urgent', 'help', 'rescue'],
          response: 'Warning! I am directing you to emergency help.',
          route: AMBULANCE_SERVICE_ROUTE,
          label: 'Emergency help',
        },
        {
          id: 'messages',
          keywords: ['message', 'messages', 'chat', 'contact'],
          response: 'Here are your messages.',
          route: '/messages',
          label: 'Messages',
        },
        {
          id: 'home',
          keywords: ['home', 'dashboard', 'main', 'back'],
          response: 'Returning to your dashboard.',
          route: '/patient-dashboard',
          label: 'Dashboard',
        },
      ],
    },
  },
  'de-DE': {
    chatbot: {
      openLabel: 'Chatbot öffnen',
      closeLabel: 'Chatbot schließen',
      subServicePrompt: 'Für welchen Unterdienst interessieren Sie sich?',
      providerNamePlaceholder: 'Name der Fachkraft...',
      providerFallbackName: 'Diese Fachkraft',
      paymentMethods: [
        {
          id: 'card',
          label: '💳 Bankkarte',
          description: 'Visa und Mastercard werden akzeptiert',
        },
        {
          id: 'cash',
          label: '💵 Barzahlung',
          description: 'Zahlung an die Fachkraft',
        },
        {
          id: 'd17',
          label: '📱 D17 / Flouci',
          description: 'Mobile Zahlung',
        },
      ],
      paymentInfoSuffix: 'Sichere und praktische Zahlungsmethode.',
      textTriggers: {
        emergency: ['notfall', 'krankenwagen', 'rettung'],
        payment: ['zahlung', 'preis', 'bezahlen', 'karte'],
        search: ['suchen', 'buchen', 'dienst', 'pflege'],
        account: ['konto', 'profil', 'termine', 'nachrichten'],
      },
      subServices: {
        nursing: [
          {
            id: 'injection_im',
            name: 'Intramuskuläre Injektion',
            description: 'Verabreichung von IM-Injektionen',
          },
          {
            id: 'pansement_simple',
            name: 'Einfacher Verband',
            description: 'Verbandwechsel',
          },
          {
            id: 'perfusion',
            name: 'Infusion zu Hause',
            description: 'IV-Anlage und Überwachung',
          },
        ],
        elderly_care: [
          {
            id: 'toilette',
            name: 'Hilfe bei der Körperpflege',
            description: 'Unterstützung bei der täglichen Pflege',
          },
          {
            id: 'repas',
            name: 'Essenshilfe',
            description: 'Vorbereitung und Unterstützung bei Mahlzeiten',
          },
          {
            id: 'compagnie',
            name: 'Gesellschaft',
            description: 'Anwesenheit und soziale Aktivierung',
          },
        ],
        physiotherapy: [
          {
            id: 'ortho',
            name: 'Orthopädische Rehabilitation',
            description: 'Nach Fraktur, Verstauchung oder Prothese',
          },
          {
            id: 'respi',
            name: 'Atemphysiotherapie',
            description: 'Unterstützung der Bronchialreinigung',
          },
          {
            id: 'massage',
            name: 'Therapeutische Massage',
            description: 'Entspannung und Drainage',
          },
        ],
      },
    },
    voice: {
      triggerLabel: 'Sprachhilfe',
      openLabel: 'Sprachassistent öffnen',
      closeLabel: 'Sprachassistent schließen',
      panelTitle: 'Sprachassistent',
      panelSubtitle: 'Sanad • Immer für Sie da',
      stateLabels: {
        listening: 'Ich höre zu...',
        speaking: 'Ich antworte...',
        processing: 'Ich denke nach...',
        error: 'Fehler',
        idle: 'Tippen zum Sprechen',
      },
      transcriptLabel: 'Sie haben gesagt',
      responseLabel: 'Antwort',
      errorLabel: 'Fehler',
      quickSuggestionsLabel: 'Schnellvorschläge',
      muteLabel: 'Ton ausschalten',
      unmuteLabel: 'Ton einschalten',
      stopLabel: 'Stoppen',
      speakingActionLabel: 'Ich spreche...',
      speakAgainLabel: 'Erneut sprechen',
      unsupportedBrowserMessage: 'Spracherkennung ist in diesem Browser nicht verfügbar.',
      microphoneDeniedMessage:
        'Der Mikrofonzugriff wurde verweigert. Bitte erlauben Sie den Zugriff.',
      microphoneRetryMessage: 'Ich konnte Sie nicht hören. Bitte versuchen Sie es erneut.',
      fallbackResponse:
        'Ich habe das nicht verstanden. Bitte wiederholen Sie es, zum Beispiel: meine Termine oder Pflege finden.',
      quickSuggestions: [
        {
          id: 'appointments',
          label: 'Mein nächster Termin',
          query: 'nächster termin',
          intentId: 'appointments',
        },
        {
          id: 'services',
          label: 'Pflege finden',
          query: 'pflege dienst finden',
          intentId: 'services',
        },
        {
          id: 'medicines',
          label: 'Meine Medikamente',
          query: 'meine medikamente',
          intentId: 'medicines',
        },
        {
          id: 'emergency',
          label: 'Notfall',
          query: 'notfall',
          intentId: 'emergency',
        },
      ],
      intents: [
        {
          id: 'appointments',
          keywords: ['termin', 'termine', 'nächster', 'naechster', 'planung', 'agenda'],
          response: 'Ich bringe Sie zu Ihren Terminen.',
          route: '/mon-espace',
          label: 'Meine Termine',
        },
        {
          id: 'services',
          keywords: ['pflege', 'dienst', 'dienste', 'arzt', 'krankenschwester', 'physio', 'hilfe'],
          response: 'Hier sind die verfügbaren Gesundheitsdienste.',
          route: '/services',
          label: 'Gesundheitsdienste',
        },
        {
          id: 'medicines',
          keywords: ['medikament', 'medikamente', 'apotheke', 'rezept', 'behandlung'],
          response: 'Ich bringe Sie zu Ihren Medikamenten.',
          route: '/medicaments',
          label: 'Meine Medikamente',
        },
        {
          id: 'emergency',
          keywords: ['notfall', 'krankenwagen', 'rettung', 'hilfe'],
          response: 'Achtung! Ich leite Sie zur Notfallhilfe weiter.',
          route: AMBULANCE_SERVICE_ROUTE,
          label: 'Notfallhilfe',
        },
        {
          id: 'messages',
          keywords: ['nachricht', 'nachrichten', 'chat', 'kontakt'],
          response: 'Hier sind Ihre Nachrichten.',
          route: '/messages',
          label: 'Nachrichten',
        },
        {
          id: 'home',
          keywords: ['start', 'dashboard', 'zurück', 'hauptseite'],
          response: 'Zurück zu Ihrem Dashboard.',
          route: '/patient-dashboard',
          label: 'Dashboard',
        },
      ],
    },
  },
  'nl-NL': {
    chatbot: {
      openLabel: 'Chatbot openen',
      closeLabel: 'Chatbot sluiten',
      subServicePrompt: 'Voor welke subdienst bent u geïnteresseerd?',
      providerNamePlaceholder: 'Naam van de professional...',
      providerFallbackName: 'Deze professional',
      paymentMethods: [
        {
          id: 'card',
          label: '💳 Bankkaart',
          description: 'Visa en Mastercard worden aanvaard',
        },
        {
          id: 'cash',
          label: '💵 Contant',
          description: 'Betaling aan de professional',
        },
        {
          id: 'd17',
          label: '📱 D17 / Flouci',
          description: 'Mobiele betaling',
        },
      ],
      paymentInfoSuffix: 'Veilige en praktische betaalmethode.',
      textTriggers: {
        emergency: ['noodgeval', 'ambulance', 'spoed', 'hulp'],
        payment: ['betaling', 'prijs', 'betalen', 'kaart'],
        search: ['zoeken', 'boeken', 'dienst', 'zorg'],
        account: ['account', 'profiel', 'afspraken', 'berichten'],
      },
      subServices: {
        nursing: [
          {
            id: 'injection_im',
            name: 'Intramusculaire injectie',
            description: 'Toediening van IM-injecties',
          },
          {
            id: 'pansement_simple',
            name: 'Eenvoudig verband',
            description: 'Verband verversen',
          },
          {
            id: 'perfusion',
            name: 'Infuus aan huis',
            description: 'IV-plaatsing en opvolging',
          },
        ],
        elderly_care: [
          {
            id: 'toilette',
            name: 'Hulp bij persoonlijke verzorging',
            description: 'Dagelijkse hygiëneondersteuning',
          },
          {
            id: 'repas',
            name: 'Hulp bij maaltijden',
            description: 'Maaltijdvoorbereiding en ondersteuning',
          },
          {
            id: 'compagnie',
            name: 'Gezelschap',
            description: 'Aanwezigheid en sociale stimulatie',
          },
        ],
        physiotherapy: [
          {
            id: 'ortho',
            name: 'Orthopedische revalidatie',
            description: 'Na fractuur, verstuiking of prothese',
          },
          {
            id: 'respi',
            name: 'Ademhalingsfysiotherapie',
            description: 'Ondersteuning bij bronchiale reiniging',
          },
          {
            id: 'massage',
            name: 'Therapeutische massage',
            description: 'Ontspanning en drainage',
          },
        ],
      },
    },
    voice: {
      triggerLabel: 'Spraakhulp',
      openLabel: 'Spraakassistent openen',
      closeLabel: 'Spraakassistent sluiten',
      panelTitle: 'Spraakassistent',
      panelSubtitle: 'Sanad • Altijd voor u klaar',
      stateLabels: {
        listening: 'Ik luister...',
        speaking: 'Ik antwoord...',
        processing: 'Ik denk na...',
        error: 'Fout',
        idle: 'Tik om te spreken',
      },
      transcriptLabel: 'U zei',
      responseLabel: 'Antwoord',
      errorLabel: 'Fout',
      quickSuggestionsLabel: 'Snelle suggesties',
      muteLabel: 'Geluid uitzetten',
      unmuteLabel: 'Geluid aanzetten',
      stopLabel: 'Stoppen',
      speakingActionLabel: 'Ik spreek...',
      speakAgainLabel: 'Opnieuw spreken',
      unsupportedBrowserMessage: 'Spraakherkenning is niet beschikbaar in deze browser.',
      microphoneDeniedMessage:
        'Microfoontoegang is geweigerd. Geef alstublieft toegang tot de microfoon.',
      microphoneRetryMessage: 'Ik kon u niet horen. Probeer het opnieuw.',
      fallbackResponse:
        'Ik heb dat niet goed begrepen. Herhaal het alstublieft, bijvoorbeeld: mijn afspraken of zorg vinden.',
      quickSuggestions: [
        {
          id: 'appointments',
          label: 'Mijn volgende afspraak',
          query: 'volgende afspraak',
          intentId: 'appointments',
        },
        {
          id: 'services',
          label: 'Zorg vinden',
          query: 'zorg dienst vinden',
          intentId: 'services',
        },
        {
          id: 'medicines',
          label: 'Mijn medicijnen',
          query: 'mijn medicijnen',
          intentId: 'medicines',
        },
        {
          id: 'emergency',
          label: 'Noodgeval',
          query: 'noodgeval',
          intentId: 'emergency',
        },
      ],
      intents: [
        {
          id: 'appointments',
          keywords: ['afspraak', 'afspraken', 'volgende', 'planning', 'agenda'],
          response: 'Ik breng u naar uw afspraken.',
          route: '/mon-espace',
          label: 'Mijn afspraken',
        },
        {
          id: 'services',
          keywords: ['zorg', 'dienst', 'diensten', 'verpleegkundige', 'arts', 'physio', 'hulp'],
          response: 'Hier zijn de beschikbare zorgdiensten.',
          route: '/services',
          label: 'Zorgdiensten',
        },
        {
          id: 'medicines',
          keywords: ['medicijn', 'medicijnen', 'apotheek', 'voorschrift', 'behandeling'],
          response: 'Ik breng u naar uw medicijnen.',
          route: '/medicaments',
          label: 'Mijn medicijnen',
        },
        {
          id: 'emergency',
          keywords: ['noodgeval', 'ambulance', 'spoed', 'hulp'],
          response: 'Opgelet! Ik stuur u naar de noodhulp.',
          route: AMBULANCE_SERVICE_ROUTE,
          label: 'Noodhulp',
        },
        {
          id: 'messages',
          keywords: ['bericht', 'berichten', 'chat', 'contact'],
          response: 'Hier zijn uw berichten.',
          route: '/messages',
          label: 'Berichten',
        },
        {
          id: 'home',
          keywords: ['home', 'dashboard', 'terug', 'start'],
          response: 'Terug naar uw dashboard.',
          route: '/patient-dashboard',
          label: 'Dashboard',
        },
      ],
    },
  },
  'ar-TN': {
    chatbot: {
      openLabel: 'افتح الدردشة',
      closeLabel: 'أغلق الدردشة',
      subServicePrompt: 'ما الخدمة الفرعية التي تهمك؟',
      providerNamePlaceholder: 'اسم المهني...',
      providerFallbackName: 'هذا المهني',
      paymentMethods: [
        {
          id: 'card',
          label: '💳 بطاقة بنكية',
          description: 'نقبل Visa و Mastercard',
        },
        {
          id: 'cash',
          label: '💵 نقداً',
          description: 'الدفع مباشرة للمهني',
        },
        {
          id: 'd17',
          label: '📱 D17 / Flouci',
          description: 'دفع عبر الهاتف',
        },
      ],
      paymentInfoSuffix: 'طريقة دفع آمنة وعملية.',
      textTriggers: {
        emergency: ['طوارئ', 'اسعاف', 'إسعاف', 'سامو', 'نجدة'],
        payment: ['دفع', 'سعر', 'اسعار', 'أسعار', 'بطاقة'],
        search: ['ابحث', 'بحث', 'احجز', 'حجز', 'خدمة', 'رعاية'],
        account: ['حساب', 'ملف', 'مواعيد', 'رسائل'],
      },
      subServices: {
        nursing: [
          {
            id: 'injection_im',
            name: 'حقن عضلي',
            description: 'إعطاء حقن عضلية',
          },
          {
            id: 'pansement_simple',
            name: 'تضميد بسيط',
            description: 'تجديد الضماد',
          },
          {
            id: 'perfusion',
            name: 'مصل في المنزل',
            description: 'تركيب ومتابعة الحقن الوريدي',
          },
        ],
        elderly_care: [
          {
            id: 'toilette',
            name: 'مساعدة في النظافة',
            description: 'دعم يومي للنظافة الشخصية',
          },
          {
            id: 'repas',
            name: 'مساعدة في الوجبات',
            description: 'تحضير الوجبات والمساعدة فيها',
          },
          {
            id: 'compagnie',
            name: 'مرافقة',
            description: 'حضور ودعم اجتماعي',
          },
        ],
        physiotherapy: [
          {
            id: 'ortho',
            name: 'إعادة تأهيل عظام',
            description: 'بعد كسر أو التواء أو تركيب مفصل',
          },
          {
            id: 'respi',
            name: 'علاج طبيعي تنفسي',
            description: 'المساعدة على تنظيف الشعب الهوائية',
          },
          {
            id: 'massage',
            name: 'تدليك علاجي',
            description: 'استرخاء وتصريف',
          },
        ],
      },
    },
    voice: {
      triggerLabel: 'مساعدة صوتية',
      openLabel: 'افتح المساعد الصوتي',
      closeLabel: 'أغلق المساعد الصوتي',
      panelTitle: 'المساعد الصوتي',
      panelSubtitle: 'سند • هنا دائماً من أجلك',
      stateLabels: {
        listening: 'أنا أستمع...',
        speaking: 'أنا أجيب...',
        processing: 'أنا أفكر...',
        error: 'خطأ',
        idle: 'اضغط للتحدث',
      },
      transcriptLabel: 'لقد قلت',
      responseLabel: 'الرد',
      errorLabel: 'خطأ',
      quickSuggestionsLabel: 'اقتراحات سريعة',
      muteLabel: 'كتم الصوت',
      unmuteLabel: 'تشغيل الصوت',
      stopLabel: 'إيقاف',
      speakingActionLabel: 'أنا أتكلم...',
      speakAgainLabel: 'تحدث من جديد',
      unsupportedBrowserMessage: 'التعرف الصوتي غير متاح في هذا المتصفح.',
      microphoneDeniedMessage: 'تم رفض الوصول إلى الميكروفون. يرجى السماح باستخدامه.',
      microphoneRetryMessage: 'لم أسمعك جيداً. حاول مرة أخرى.',
      fallbackResponse: 'لم أفهم جيداً. أعد المحاولة مثلاً بقول: مواعيدي أو ابحث عن رعاية.',
      quickSuggestions: [
        {
          id: 'appointments',
          label: 'موعدي القادم',
          query: 'موعدي القادم',
          intentId: 'appointments',
        },
        {
          id: 'services',
          label: 'ابحث عن رعاية',
          query: 'ابحث عن خدمة رعاية',
          intentId: 'services',
        },
        {
          id: 'medicines',
          label: 'أدويتي',
          query: 'أدويتي',
          intentId: 'medicines',
        },
        {
          id: 'emergency',
          label: 'طوارئ',
          query: 'طوارئ',
          intentId: 'emergency',
        },
      ],
      intents: [
        {
          id: 'appointments',
          keywords: ['موعد', 'مواعيد', 'القادم', 'استشارة', 'جدول'],
          response: 'سأأخذك إلى مواعيدك.',
          route: '/mon-espace',
          label: 'مواعيدي',
        },
        {
          id: 'services',
          keywords: ['رعاية', 'خدمة', 'خدمات', 'ممرض', 'طبيب', 'علاج طبيعي', 'مساعدة'],
          response: 'هذه هي خدمات الرعاية المتاحة.',
          route: '/services',
          label: 'خدمات الرعاية',
        },
        {
          id: 'medicines',
          keywords: ['دواء', 'ادوية', 'أدوية', 'صيدلية', 'وصفة', 'علاج'],
          response: 'سأأخذك إلى أدويتك.',
          route: '/medicaments',
          label: 'أدويتي',
        },
        {
          id: 'emergency',
          keywords: ['طوارئ', 'اسعاف', 'إسعاف', 'نجدة', 'سامو'],
          response: 'انتباه! سأوجهك إلى خدمة الطوارئ.',
          route: AMBULANCE_SERVICE_ROUTE,
          label: 'الطوارئ',
        },
        {
          id: 'messages',
          keywords: ['رسالة', 'رسائل', 'دردشة', 'اتصال'],
          response: 'هذه هي رسائلك.',
          route: '/messages',
          label: 'الرسائل',
        },
        {
          id: 'home',
          keywords: ['الرئيسية', 'لوحة', 'عودة', 'الصفحة الرئيسية'],
          response: 'عودة إلى لوحة التحكم.',
          route: '/patient-dashboard',
          label: 'لوحة التحكم',
        },
      ],
    },
  },
} satisfies Record<LanguageCode, LocalizedAssistantConfig>;

export function getAssistantLocale(code: LanguageCode): AssistantLocaleConfig {
  const locale = ASSISTANT_LOCALES[code] ?? ASSISTANT_LOCALES['fr-FR'];

  return {
    chatbot: {
      ...locale.chatbot,
      regions: REGIONS,
    },
    voice: {
      ...locale.voice,
      speech: SPEECH_CONFIGS[code] ?? SPEECH_CONFIGS['fr-FR'],
    },
  };
}

export function normalizeAssistantText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[’'`-]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
