import React, { useEffect, useState, createContext, useContext } from 'react';
import type { TranslationKeys } from '../i18n/types';
import { frenchTranslations } from '../i18n/translations/fr';
import { englishTranslations } from '../i18n/translations/en';
import { dutchTranslations } from '../i18n/translations/nl';
import { arabicTranslations } from '../i18n/translations/ar';
export type LanguageCode = 'ar-TN' | 'en-GB' | 'fr-FR' | 'de-DE' | 'nl-NL';
interface Language {
  code: LanguageCode;
  name: string;
  shortCode: string;
  colors: string[];
  dir: 'ltr' | 'rtl';
}
export const languages: Language[] = [
{
  code: 'ar-TN',
  name: 'العربية',
  shortCode: 'TN',
  colors: ['#E70013', '#FFFFFF'],
  dir: 'rtl'
},
{
  code: 'en-GB',
  name: 'English',
  shortCode: 'GB',
  colors: ['#012169', '#C8102E'],
  dir: 'ltr'
},
{
  code: 'fr-FR',
  name: 'Français',
  shortCode: 'FR',
  colors: ['#002395', '#ED2939'],
  dir: 'ltr'
},
{
  code: 'de-DE',
  name: 'Deutsch',
  shortCode: 'DE',
  colors: ['#000000', '#FFCC00'],
  dir: 'ltr'
},
{
  code: 'nl-NL',
  name: 'Nederlands',
  shortCode: 'NL',
  colors: ['#AE1C28', '#21468B'],
  dir: 'ltr'
}];

// German translations - uses English as base with key German overrides
const germanTranslations: TranslationKeys = {
  ...englishTranslations,
  nav: {
    home: 'Startseite',
    dashboard: 'Dashboard',
    services: 'Dienste',
    equipment: 'Ausrüstung',
    mySpace: 'Mein Bereich',
    messages: 'Nachrichten',
    help: 'Hilfe',
    logout: 'Abmelden',
    login: 'Anmelden',
    howItWorks: 'So funktioniert es',
    schedule: 'Zeitplan',
    analytics: 'Statistiken',
    finances: 'Finanzen'
  },
  common: {
    ...englishTranslations.common,
    welcome: 'Willkommen',
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    save: 'Speichern',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Zurück',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    noResults: 'Keine Ergebnisse',
    seeAll: 'Alle anzeigen',
    seeMore: 'Mehr anzeigen',
    close: 'Schließen',
    submit: 'Absenden',
    selectLanguage: 'Sprache wählen',
    call: 'Anrufen',
    follow: 'Verfolgen',
    details: 'Details',
    available: 'Verfügbar',
    unavailable: 'Nicht verfügbar',
    pricePerDay: 'Preis pro Tag',
    from: 'Ab',
    online: 'Online',
    offline: 'Offline',
    all: 'Alle',
    unread: 'Ungelesen',
    retry: 'Erneut versuchen',
    loadingError: 'Ladefehler',
    noData: 'Keine Daten',
    yes: 'Ja',
    no: 'Nein',
    brandName: 'Sanad'
  },
  auth: {
    ...englishTranslations.auth,
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    forgotPassword: 'Passwort vergessen?',
    rememberMe: 'Angemeldet bleiben',
    noAccount: 'Noch kein Konto?',
    hasAccount: 'Bereits ein Konto?',
    createAccount: 'Konto erstellen',
    secureLogin: 'Sichere Anmeldung',
    selectProfile: 'Ihr Profil',
    patient: 'Patient',
    professional: 'Fachkraft',
    continue: 'Fortfahren'
  },
  home: {
    ...englishTranslations.home,
    heroTitle1: 'Häusliche Pflege',
    heroTitle2: 'menschlich und professionell',
    heroSubtitle:
    'Finden Sie die ideale Pflegekraft für Ihre Angehörigen mit nur wenigen Klicks.',
    findCaregiver: 'Pflegekraft finden',
    howItWorksBtn: 'Wie funktioniert es?',
    trustBadge: 'Über 5000 Familien vertrauen uns',
    verified: '100% Verifiziert',
    verifiedDesc: 'Diplome und Identitäten überprüft',
    available247: '24/7 Verfügbar',
    available247Desc: 'Schnelle Intervention in 2h',
    personalizedCare: 'Persönliche Betreuung',
    personalizedCareDesc: 'Familienkoordination',
    ourServices: 'UNSERE DIENSTE',
    careServices: 'Pflegedienste',
    careServicesDesc:
    'Ein komplettes Angebot an Diensten für alle häuslichen Pflegebedürfnisse.',
    nursingCare: 'Krankenpflege',
    nursingCareDesc: 'Injektionen, Verbände, Infusionen',
    seniorAssistance: 'Seniorenbetreuung',
    seniorAssistanceDesc: 'Baden, Mahlzeiten, Gesellschaft',
    viewAllServices: 'Alle Dienste anzeigen',
    readyToStart: 'Bereit anzufangen?',
    joinFamilies:
    'Schließen Sie sich Tausenden von Familien an, die Sanad vertrauen'
  },
  services: {
    ...englishTranslations.services,
    title: 'UNSERE DIENSTE',
    subtitle:
    'Wählen Sie eine Kategorie, um den richtigen Spezialisten zu finden',
    whatCareNeeded: 'Welche Pflege benötigen Sie?',
    selectCategory: 'Kategorie auswählen',
    nursing: 'Krankenpflege',
    nursingDesc: 'Injektionen, Verbände, Infusionen',
    elderly: 'Seniorenbetreuung',
    elderlyDesc: 'Baden, Ankleiden, Mahlzeiten, Gesellschaft',
    notFound: 'Nicht gefunden, was Sie suchen?',
    contactUs: 'Kontaktieren Sie uns',
    all: 'Alle',
    medicalCare: 'Medizinische Versorgung',
    dailyHelp: 'Tägliche Hilfe',
    rehabilitation: 'Rehabilitation'
  },
  dashboard: {
    ...englishTranslations.dashboard,
    hello: 'HALLO',
    healthTracking: 'Hier ist Ihre Gesundheitsübersicht für heute',
    book: 'Buchen',
    findProfessional: 'Fachkraft finden',
    emergencyBtn: 'Notfall',
    quickAssistance: 'Schnelle Hilfe',
    upcomingAppointments: 'Kommende Termine',
    recentActivity: 'Letzte Aktivität',
    lastConsultation: 'Letzte Konsultation',
    daysAgo: 'vor {n} Tagen',
    today: 'Heute',
    tomorrow: 'Morgen',
    yourTracking: 'Ihre Verfolgung',
    daysStreak: 'Tage',
    continuousTracking: 'kontinuierliche Verfolgung',
    familyCircle: 'Familienkreis',
    sharedWith: 'Geteilt mit',
    members: 'Mitglieder',
    manageAccess: 'Zugang verwalten',
    addMember: 'Mitglied hinzufügen',
    newMessages: 'neu',
    points: 'Punkte',
    healthConcierge: 'Gesundheits-Concierge',
    assistance247: '24/7 Unterstützung',
    confirmed: 'Bestätigt',
    pending: 'Ausstehend',
    noUpcomingAppointments: 'Keine kommenden Termine',
    bookNow: 'Jetzt buchen',
    rewards: 'Belohnungen'
  },
  emergency: {
    ...englishTranslations.emergency,
    title: 'Notfall',
    medicalEmergency: 'Medizinischer Notfall',
    police: 'Polizei',
    securityEmergency: 'Sicherheitsnotfall',
    firefighters: 'Feuerwehr',
    fireRescue: 'Feuer & Rettung',
    civilProtection: 'Zivilschutz',
    naturalDisasters: 'Naturkatastrophen',
    warning: 'Warnung',
    onlyCallIfReal: 'Rufen Sie nur im echten Notfall an'
  },
  mySpace: {
    ...englishTranslations.mySpace,
    title: 'MEIN BEREICH',
    serviceHistory: 'Diensthistorie',
    upcomingAppointments: 'Kommende Termine',
    historyTab: 'Diensthistorie',
    pendingValidation: 'Ausstehende Validierung',
    validateNow: 'Jetzt validieren',
    yourReview: 'Ihre Bewertung',
    giveReview: 'Bewertung abgeben',
    addToFavorites: 'Zu Favoriten hinzufügen',
    removeFromFavorites: 'Aus Favoriten entfernen',
    atHome: 'Zu Hause',
    videoConsultation: 'Videokonsultation',
    cancelAppointment: 'Termin stornieren'
  },
  messages: {
    ...englishTranslations.messages,
    title: 'NACHRICHTEN',
    subtitle: 'Sichere Kommunikation mit Ihren Fachkräften',
    searchPlaceholder: 'Gespräch suchen...',
    newMessage: 'Neue Nachricht',
    typeMessage: 'Nachricht eingeben...',
    send: 'Senden',
    conversations: 'Gespräche',
    noMessages: 'Keine Nachrichten',
    all: 'Alle',
    unread: 'Ungelesen',
    noConversations: 'Keine Gespräche',
    justNow: 'Gerade eben'
  },
  help: {
    ...englishTranslations.help,
    title: 'HILFEZENTRUM',
    subtitle: 'Wie können wir Ihnen helfen?',
    searchPlaceholder: 'Hilfe durchsuchen...',
    findAnswers: 'Finden Sie schnell Antworten auf Ihre Fragen',
    contactUs: 'Kontaktieren Sie uns',
    liveChat: 'Live-Chat',
    immediateResponse: 'Sofortige Antwort',
    phone: 'Telefon',
    emailContact: 'E-Mail',
    startChat: 'Starten',
    callNow: 'Anrufen',
    sendEmail: 'Senden',
    faq: 'FAQ',
    booking: 'Buchung',
    payment: 'Zahlung',
    servicesCategory: 'Dienste',
    account: 'Konto',
    noResultsFound: 'Keine Ergebnisse',
    tryOtherKeywords:
    'Versuchen Sie andere Suchbegriffe oder kontaktieren Sie uns direkt'
  },
  familyCircle: {
    ...englishTranslations.familyCircle,
    title: 'Familienkreis-Verwaltung',
    secureSharing: 'Sicheres Teilen',
    secureDesc:
    'Mitglieder können Ihre Termine einsehen und die Pflege koordinieren',
    membersCount: 'Mitglieder',
    addMemberBtn: 'Mitglied hinzufügen',
    fullName: 'Vollständiger Name',
    relation: 'Beziehung',
    selectRelation: 'Auswählen...',
    spouse: 'Ehepartner',
    son: 'Sohn',
    daughter: 'Tochter',
    brother: 'Bruder',
    sister: 'Schwester',
    parent: 'Elternteil',
    other: 'Andere',
    invitationEmail: 'Eine Einladungs-E-Mail wird an diese Adresse gesendet',
    sendInvitation: 'Einladung senden'
  },
  rating: {
    ...englishTranslations.rating,
    title: 'Bewertung abgeben',
    howWasService: 'Wie bewerten Sie diesen Service?',
    shareExperience: 'Teilen Sie Ihre Erfahrung (optional)',
    sendReview: 'Senden'
  },
  signup: {
    ...englishTranslations.signup,
    registration: 'REGISTRIERUNG',
    createPatientAccount: 'Patientenkonto erstellen',
    createProfessionalAccount: 'Fachkraftkonto erstellen',
    accessBestCare: 'Zugang zur besten häuslichen Pflege',
    growYourBusiness: 'Erweitern Sie Ihr Geschäft',
    firstName: 'Vorname',
    lastName: 'Nachname',
    phone: 'Telefon',
    city: 'Stadt',
    selectCity: 'Stadt auswählen',
    confirmPassword: 'Passwort bestätigen',
    acceptTerms: 'Ich akzeptiere die',
    termsOfUse: 'Nutzungsbedingungen',
    and: 'und die',
    privacyPolicy: 'Datenschutzrichtlinie',
    creating: 'Erstellen...',
    createMyAccount: 'Mein Konto erstellen',
    alreadyHaveAccount: 'Bereits ein Konto?',
    secureRegistration: 'SSL 256-bit sichere Registrierung',
    back: 'Zurück',
    continue: 'Fortfahren'
  },
  onboarding: {
    ...englishTranslations.onboarding,
    welcomeToSanad: 'WILLKOMMEN BEI SANAD',
    chooseProfile: 'Wählen Sie Ihr Profil',
    selectAccountType: 'Wählen Sie Ihren Kontotyp, um zu beginnen',
    patient: 'Patient',
    patientDesc: 'Ich suche häusliche Pflege',
    professional: 'Gesundheitsfachkraft',
    professionalDesc: 'Ich biete meine Dienste an',
    continue: 'Fortfahren',
    alreadyHaveAccount: 'Bereits ein Konto?',
    signIn: 'Anmelden',
    securePlatform: 'Sichere Plattform',
    quickRegistration: 'Schnelle Registrierung'
  },
  payment: {
    ...englishTranslations.payment,
    summary: 'Zusammenfassung',
    provider: 'Fachkraft',
    service: 'Dienst',
    date: 'Datum',
    time: 'Zeit',
    total: 'Gesamtbetrag',
    securePayment: 'Sichere Zahlung',
    bankCard: 'Bankkarte',
    bankCardDesc: 'Visa, Mastercard',
    cash: 'Bargeld',
    cashDesc: 'Vor Ort bezahlen',
    cardNumber: 'Kartennummer',
    expiryDate: 'Ablaufdatum',
    cardHolder: 'Karteninhaber',
    phoneNumber: 'Telefonnummer',
    securePaymentNotice: 'Ihre Zahlungsdaten sind verschlüsselt und sicher',
    confirm: 'Buchung bestätigen',
    pay: 'Jetzt bezahlen',
    processing: 'Verarbeitung...'
  },
  booking: {
    ...englishTranslations.booking,
    selectDate: 'Datum auswählen',
    selectTime: 'Zeit auswählen',
    selectProvider: 'Fachkraft wählen',
    confirmBooking: 'Buchung bestätigen',
    bookingConfirmed: 'Buchung bestätigt',
    bookingDetails: 'Buchungsdetails',
    additionalNotes: 'Zusätzliche Notizen (optional)',
    notesPlaceholder: 'Wichtige Informationen für die Fachkraft...',
    availableSlots: 'Verfügbare Zeitfenster',
    noSlotsAvailable: 'Keine Zeitfenster für dieses Datum verfügbar',
    selectAnotherDate: 'Anderes Datum wählen',
    morning: 'Morgen',
    afternoon: 'Nachmittag',
    evening: 'Abend',
    duration: 'Dauer',
    price: 'Preis',
    address: 'Adresse',
    changeAddress: 'Adresse ändern',
    useCurrentLocation: 'Meinen aktuellen Standort verwenden',
    enterAddress: 'Adresse eingeben'
  },
  notifications: {
    ...englishTranslations.notifications,
    title: 'Benachrichtigungen',
    markAllRead: 'Alle als gelesen markieren',
    noNotifications: 'Keine Benachrichtigungen',
    appointmentReminder: 'Terminerinnerung',
    appointmentConfirmed: 'Termin bestätigt',
    appointmentCancelled: 'Termin storniert',
    newMessage: 'Neue Nachricht',
    paymentReceived: 'Zahlung erhalten',
    reviewRequest: 'Bewertung abgeben'
  },
  profile: {
    ...englishTranslations.profile,
    title: 'Mein Profil',
    personalInfo: 'Persönliche Informationen',
    contactInfo: 'Kontaktinformationen',
    medicalInfo: 'Medizinische Informationen',
    preferences: 'Einstellungen',
    security: 'Sicherheit',
    editProfile: 'Profil bearbeiten',
    changePassword: 'Passwort ändern',
    deleteAccount: 'Konto löschen',
    logout: 'Abmelden',
    language: 'Sprache',
    notifications: 'Benachrichtigungen',
    darkMode: 'Dunkelmodus',
    bloodType: 'Blutgruppe',
    allergies: 'Allergien',
    medications: 'Medikamente',
    emergencyContact: 'Notfallkontakt'
  },
  provider: {
    ...englishTranslations.provider,
    greeting: 'Hallo',
    nurseTitle: 'Krankenschwester',
    online: 'Online',
    offline: 'Offline',
    revenue: 'EINNAHMEN',
    thisWeek: 'Diese Woche',
    appointments: 'TERMINE',
    rating: 'BEWERTUNG',
    reviews: 'Bewertungen',
    growth: 'WACHSTUM',
    successRate: 'Erfolgsquote',
    todaySchedule: 'Heutiger Zeitplan',
    completed: 'Abgeschlossen',
    planning: 'Planung',
    manageAppointments: 'Termine verwalten',
    statistics: 'Statistiken',
    thisMonth: 'diesen Monat',
    marketing: 'Marketing',
    activeCampaigns: 'aktive Kampagnen',
    insurance: 'Haftpflichtversicherung',
    coverage: 'Deckung',
    billing: 'Abrechnung',
    proSupport: 'Pro-Support',
    needHelpIntervention: 'Hilfe bei einem Einsatz benötigt?',
    contactSupport: 'Support kontaktieren',
    backToDashboard: 'Zurück zum Dashboard',
    scheduleManagement: 'Terminverwaltung',
    organizeAppointments: 'Organisieren Sie Ihre Termine und Verfügbarkeit',
    newAppointment: 'Neuer Termin',
    today: 'Heute',
    confirmed: 'Bestätigt',
    pending: 'Ausstehend',
    rejected: 'Abgelehnt',
    cancelled: 'Storniert',
    hours: 'Stunden',
    day: 'Tag',
    week: 'Woche',
    month: 'Monat',
    quickActions: 'Schnellaktionen',
    blockSlot: 'Zeitfenster blockieren',
    setAvailability: 'Verfügbarkeit festlegen',
    blockedSlots: 'Blockierte Zeitfenster',
    legend: 'Legende',
    upcomingAppointments: 'Kommende Termine',
    date: 'Datum',
    startTime: 'Startzeit',
    endTime: 'Endzeit',
    reasonOptional: 'Grund (optional)',
    blockThisSlot: 'Dieses Zeitfenster blockieren',
    setAvailabilities: 'Verfügbarkeiten festlegen',
    saveAvailabilities: 'Verfügbarkeiten speichern',
    approve: 'Genehmigen',
    reject: 'Ablehnen',
    lunchBreak: 'Mittagspause',
    teleconsultation: 'Telekonsultation',
    slotBlocked: 'Zeitfenster blockiert',
    to: 'bis',
    analytics: 'ANALYTICS',
    statisticsAnalytics: 'Statistiken & Analytics',
    analyzePerformance: 'Analysieren Sie Ihre Leistung',
    patients: 'PATIENTEN',
    revenueEvolution: 'Einnahmenentwicklung',
    topZones: 'Top-Zonen',
    weekShort: 'Woche',
    monthShort: 'Monat',
    yearShort: 'Jahr',
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mär',
    apr: 'Apr',
    may: 'Mai',
    finances: 'Finanzen',
    myTransactions: 'Meine Transaktionen',
    paymentHistory: 'Zahlungsverlauf',
    export: 'Exportieren',
    totalRevenue: 'Gesamteinnahmen',
    pendingAmount: 'Ausstehender Betrag',
    completedCount: 'Abgeschlossene Anzahl',
    average: 'Durchschnitt',
    processing: 'Verarbeitung',
    searchByIdPatient: 'Nach ID oder Patient suchen',
    allStatuses: 'Alle Status',
    amount: 'Betrag',
    commission: 'Provision',
    net: 'Netto',
    homeInjection: 'Hausbesuch-Injektion',
    complexBandage: 'Komplexer Verband',
    bankCard: 'Bankkarte'
  },
  equipment: {
    ...englishTranslations.equipment,
    title: 'GERÄTEVERLEIH',
    subtitle:
    'Mieten Sie zertifizierte medizinische Geräte von Apotheken und spezialisierten Agenturen',
    rentalTitle: 'Medizinischer Geräteverleih',
    searchPlaceholder: 'Geräte suchen...',
    categories: 'Kategorien',
    all: 'Alle',
    mobility: 'Mobilität',
    respiratory: 'Atmung',
    bedMattress: 'Bett & Matratze',
    monitoring: 'Überwachung',
    suppliers: 'Lieferanten',
    allSuppliers: 'Alle Lieferanten',
    equipmentAvailable: 'Geräte verfügbar',
    noEquipmentFound: 'Keine Geräte gefunden',
    tryDifferentCriteria: 'Versuchen Sie andere Suchkriterien'
  },
  tracking: {
    ...englishTranslations.tracking,
    title: 'Echtzeit-Verfolgung',
    onTheWay: 'Unterwegs',
    estimatedArrival: 'Geschätzte Ankunft',
    min: 'Min',
    professionalOnWay: 'Fachkraft unterwegs',
    arrivedDestination: 'Am Ziel angekommen',
    serviceCompleted: 'Dienst abgeschlossen'
  },
  appointmentDetails: {
    ...englishTranslations.appointmentDetails,
    title: 'Termindetails',
    date: 'Datum',
    time: 'Zeit',
    type: 'Typ',
    status: 'Status'
  },
  validation: {
    ...englishTranslations.validation,
    title: 'Ausstehende Validierung',
    pendingValidation: 'Ausstehende Validierung',
    service: 'Dienst',
    price: 'Preis'
  },
  chatbot: {
    ...englishTranslations.chatbot,
    greeting: 'Hallo',
    howCanIHelp: 'Ich bin Sanad Assistent. Wie kann ich Ihnen helfen?',
    searchPro: 'Fachkraft suchen',
    availableServices: 'Verfügbare Dienste',
    howItWorksOption: 'So funktioniert es',
    payments: 'Zahlungen',
    myAccount: 'Mein Konto',
    emergencyOption: 'Notfall',
    bookNow: 'Jetzt buchen',
    mainMenu: 'Hauptmenü',
    online: 'Online'
  },
  howItWorks: {
    ...englishTranslations.howItWorks,
    title: 'Wie funktioniert es?',
    subtitle: 'Buchen Sie häusliche Pflege einfach und sicher',
    forPatients: 'FÜR PATIENTEN',
    simpleSteps: '4 einfache Schritte',
    step1: 'Wählen Sie Ihren Dienst',
    step1Desc: 'Wählen Sie die Art der Pflege',
    step2: 'Finden Sie eine Fachkraft',
    step2Desc: 'Sehen Sie Profile und Bewertungen',
    step3: 'Online bezahlen',
    step3Desc: 'Sichere Zahlung',
    step4: 'Erhalten Sie Ihre Pflege',
    step4Desc: 'Zu Hause, pünktlich',
    securePayment: 'SICHERE ZAHLUNG',
    forProfessionals: 'FÜR FACHKRÄFTE',
    joinNetwork: 'Treten Sie unserem Netzwerk bei',
    findProfessional: 'Fachkraft finden'
  }
};
// Create translations object
const translations: Record<LanguageCode, TranslationKeys> = {
  'fr-FR': frenchTranslations,
  'en-GB': englishTranslations,
  'nl-NL': dutchTranslations,
  'ar-TN': arabicTranslations,
  'de-DE': germanTranslations
};
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: LanguageCode) => void;
  t: TranslationKeys;
  dir: 'ltr' | 'rtl';
}
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
export function LanguageProvider({ children }: {children: ReactNode;}) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[2]); // Default to French
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as LanguageCode;
      if (savedLang) {
        const lang = languages.find((l) => l.code === savedLang);
        if (lang) setCurrentLanguage(lang);
      }
    }
  }, []);
  useEffect(() => {
    document.documentElement.dir = currentLanguage.dir;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);
  const setLanguage = (code: LanguageCode) => {
    const lang = languages.find((l) => l.code === code);
    if (lang) {
      setCurrentLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', code);
      }
    }
  };
  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage.code],
    dir: currentLanguage.dir
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>);

}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}