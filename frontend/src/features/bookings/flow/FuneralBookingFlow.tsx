import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  Home,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  Users,
} from 'lucide-react';
import {
  BookingSuccessPanel,
  DaySlotPicker,
  MonthCalendar,
  PaymentStep,
} from '@/features/bookings/flow/ui';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useAvailability,
  useBookingProvider,
  useBookingQuote,
  useBookingSubmission,
  useMonthAvailability,
  usePatientBookingAddressPrefill,
} from '@/features/bookings/hooks';
import {
  getProviderDisplayName,
  getProviderImageUrl,
  getProviderLocation,
} from '@/features/providers/public-api';
import {
  createServiceAccentVariables,
  useServiceAccent,
  useServiceCatalog,
} from '@/features/services';
import { DatePickerField } from '@/shared/ui/composites/date-picker-field';
import {
  BookingFlowBodyLayout,
  BookingFlowChrome,
  type BookingFlowHeaderData,
  BookingFlowSummary,
  type BookingFlowSummarySection,
  BookingInlineState,
  BookingOptionListSkeleton,
  BookingPageErrorState,
  BookingPageLoader,
  BookingQuotePanel,
  BookingStepActions,
  bookingAccentInactiveOptionClassName,
  bookingAccentSelectedOptionClassName,
  bookingBothLocationBadgeClassName,
  bookingCyanPaymentOptionSelectedBaseClassName,
  bookingCyanTotalClassName,
  bookingDurationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingMetadataBadgeClassName,
  bookingNeutralPaymentOptionClassName,
  bookingNeutralPanelClassName,
  bookingNeutralSuccessCardClassName,
  bookingNeutralSurfaceClassName,
  bookingProviderLocationBadgeClassName,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
} from './internal';
import { logBookingFlowWarning } from './bookingFlowLogger';
import { convertProviderTimeToLocal, getPatientTimezone, isSameTimezone } from '@/utils/timezone';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Field, FieldContent, FieldLabel } from '@/shared/ui/primitives/field';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';
import type { DateOnlyResponse } from '@/shared/schemas/common';
import { formatSelectedServicesDuration } from './utils';
import { createDefaultTunisiaPhoneValue } from '@/utils/input-validation';

// ============================================
// TYPES / CONSTANTS
// ============================================

type BurialType = '' | 'inhumation' | 'cremation';
type CeremonyType = '' | 'religious' | 'civil' | 'none';
type FuneralServiceLocation = 'home' | 'clinic' | 'both';
type FuneralAdditionalServiceField =
  | 'floralService'
  | 'transportService'
  | 'adminAssistance'
  | 'griefSupport';

interface FuneralFormState {
  deceasedName: string;
  deceasedAge: string;
  deceasedBirthDate: string;
  deceasedDeathDate: string;
  deathPlace: string;
  religion: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactRelationship: string;
  ceremonyType: CeremonyType;
  ceremonyLocation: string;
  burialType: BurialType;
  floralService: boolean;
  transportService: boolean;
  adminAssistance: boolean;
  griefSupport: boolean;
  requiresRepatriation: boolean;
  repatriationCountry: string;
  specialRequests: string;
}

interface FuneralTypeConfig {
  deceasedName: string;
  deceasedAge?: string;
  deceasedBirthDate?: string;
  deceasedDeathDate?: string;
  deathPlace?: string;
  religion?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  contactRelationship?: string;
  ceremonyType?: CeremonyType;
  ceremonyLocation?: string;
  burialType?: BurialType;
  floralService: boolean;
  transportService: boolean;
  adminAssistance: boolean;
  griefSupport: boolean;
  requiresRepatriation: boolean;
  repatriationCountry?: string;
  specialRequests?: string;
}

const ADDITIONAL_FUNERAL_SERVICES = [
  {
    field: 'floralService',
    label: 'Compositions florales',
    description: 'Arrangements et compositions florales pour la cérémonie',
    confirmationValue: 'Oui',
    included: false,
  },
  {
    field: 'transportService',
    label: 'Transport de la famille',
    description: 'Organisation du transport des proches vers le lieu de cérémonie',
    confirmationValue: 'Oui',
    included: false,
  },
  {
    field: 'adminAssistance',
    label: 'Assistance administrative',
    description: 'Prise en charge des démarches administratives (inclus)',
    confirmationValue: 'Inclus',
    included: true,
  },
  {
    field: 'griefSupport',
    label: 'Accompagnement au deuil',
    description: 'Soutien psychologique pour les proches',
    confirmationValue: 'Oui',
    included: false,
  },
] as const satisfies ReadonlyArray<{
  field: FuneralAdditionalServiceField;
  label: string;
  description: string;
  confirmationValue: string;
  included?: boolean;
}>;

const FINAL_STEP = 6;
const SUMMARY_REQUIRED_PLACEHOLDER = '_';
const EMPTY_FUNERAL_RELATIONSHIP_VALUE = '__empty_funeral_relationship__';
const EMPTY_FUNERAL_CEREMONY_TYPE_VALUE = '__empty_funeral_ceremony_type__';
const NO_FUNERAL_CEREMONY_VALUE = '__no_funeral_ceremony__';

// ============================================
// HELPERS
// ============================================

function formatDateValue(value: DateOnlyResponse | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.includes('T') ? value.slice(0, 10) : value;
  return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

function formatDailyStartTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function formatBurialLabel(burialType: BurialType): string {
  switch (burialType) {
    case 'cremation':
      return 'Crémation';
    case 'inhumation':
      return 'Inhumation';
    default:
      return 'À confirmer';
  }
}

function formatCeremonyLabel(ceremonyType: CeremonyType): string {
  switch (ceremonyType) {
    case 'religious':
      return 'Religieuse';
    case 'civil':
      return 'Civile';
    case 'none':
      return 'Sans cérémonie';
    default:
      return 'À confirmer';
  }
}

function normalizeServiceLocation(
  serviceLocation: PatientServiceItemResponse['serviceLocation'],
): FuneralServiceLocation {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'home';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'clinic';
}

function getServiceLocationLabel(locationType: FuneralServiceLocation): string {
  if (locationType === 'home') {
    return 'À domicile';
  }

  if (locationType === 'both') {
    return 'Domicile ou agence';
  }

  return 'En agence';
}

function formatServiceDuration(
  durationMinutes: PatientServiceItemResponse['durationMinutes'],
): string {
  if (typeof durationMinutes === 'number' && durationMinutes > 0) {
    return `${durationMinutes} min`;
  }

  return 'Durée à confirmer';
}

function formatServicePrice(price: number, currency?: string | null): string {
  return `${price.toFixed(2)} ${currency ?? 'TND'}`;
}

// ============================================
// COMPONENT
// ============================================

export function FuneralBookingFlow() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const { t } = useLanguage();
  const { address: patientAddressPrefill } = usePatientBookingAddressPrefill();
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useBookingProvider(providerId);
  const {
    items: funeralServicesRaw,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'funeral',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('funeral');
  const accentVariables = createServiceAccentVariables(accent);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [formData, setFormData] = useState<FuneralFormState>({
    deceasedName: '',
    deceasedAge: '',
    deceasedBirthDate: '',
    deceasedDeathDate: '',
    deathPlace: '',
    religion: '',
    contactName: '',
    contactPhone: createDefaultTunisiaPhoneValue(),
    contactEmail: '',
    contactRelationship: '',
    ceremonyType: '',
    ceremonyLocation: '',
    burialType: '',
    floralService: false,
    transportService: false,
    adminAssistance: true,
    griefSupport: false,
    requiresRepatriation: false,
    repatriationCountry: '',
    specialRequests: '',
  });
  const [ceremonyLocationEdited, setCeremonyLocationEdited] = useState(false);

  const funeralServices = useMemo(
    () =>
      funeralServicesRaw.filter(
        (service) => typeof service.durationMinutes === 'number' && service.durationMinutes > 0,
      ),
    [funeralServicesRaw],
  );

  const filteredOutServiceCount = funeralServicesRaw.length - funeralServices.length;
  const selectedServiceItems = useMemo(
    () => funeralServices.filter((service) => selectedServiceIds.includes(service.id)),
    [funeralServices, selectedServiceIds],
  );
  const selectedServicesSubtotal = selectedServiceItems.reduce(
    (subtotal, service) => subtotal + service.price,
    0,
  );
  const currency = selectedServiceItems[0]?.currency ?? funeralServices[0]?.currency ?? 'TND';
  const defaultFailureMessage = t.bookingFlow.bookingErrorGeneric;

  const {
    days: monthAvailabilityDays,
    loading: monthLoading,
    timezone: providerTimezone,
    maxBookableDate: calendarMaxDate,
  } = useMonthAvailability(provider?.id, calendarYear, calendarMonth, selectedServiceIds);

  const availability = useAvailability(
    provider?.id,
    bookingDate && selectedServiceIds.length > 0
      ? {
          startDate: bookingDate,
          endDate: bookingDate,
          serviceIds: selectedServiceIds,
        }
      : null,
    defaultFailureMessage,
  );
  const { setBookingTime } = availability;

  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    const trimmedSpecialRequests = formData.specialRequests.trim();
    const trimmedCeremonyLocation =
      formData.ceremonyType !== 'none' ? formData.ceremonyLocation.trim() : '';
    const trimmedRepatriationCountry = formData.repatriationCountry.trim();

    if (
      currentStep < 5 ||
      !provider ||
      !bookingDate ||
      !availability.bookingTime ||
      !formData.burialType ||
      !formData.ceremonyType ||
      selectedServiceItems.length === 0 ||
      (formData.ceremonyType !== 'none' && !trimmedCeremonyLocation) ||
      (formData.requiresRepatriation && !trimmedRepatriationCountry)
    ) {
      return null;
    }

    const typeConfig: FuneralTypeConfig = {
      deceasedName: formData.deceasedName.trim(),
      deceasedAge: formData.deceasedAge.trim() || undefined,
      deceasedBirthDate: formData.deceasedBirthDate || undefined,
      deceasedDeathDate: formData.deceasedDeathDate || undefined,
      deathPlace: formData.deathPlace.trim() || undefined,
      religion: formData.religion.trim() || undefined,
      contactName: formData.contactName.trim(),
      contactPhone: formData.contactPhone.trim(),
      contactEmail: formData.contactEmail.trim() || undefined,
      contactRelationship: formData.contactRelationship.trim() || undefined,
      ceremonyType: formData.ceremonyType,
      ceremonyLocation: trimmedCeremonyLocation || undefined,
      burialType: formData.burialType,
      floralService: formData.floralService,
      transportService: formData.transportService,
      adminAssistance: formData.adminAssistance,
      griefSupport: formData.griefSupport,
      requiresRepatriation: formData.requiresRepatriation,
      repatriationCountry: formData.requiresRepatriation
        ? trimmedRepatriationCountry || undefined
        : undefined,
      specialRequests: trimmedSpecialRequests || undefined,
    };

    return {
      providerId: provider.id,
      serviceItems: selectedServiceItems.map((service) => ({
        serviceId: service.id,
        quantity: 1,
      })),
      startDate: bookingDate,
      endDate: bookingDate,
      dailyStartTime: formatDailyStartTime(availability.bookingTime),
      address: trimmedCeremonyLocation
        ? {
            line1: trimmedCeremonyLocation,
            city: ceremonyLocationEdited ? undefined : (patientAddressPrefill?.city ?? undefined),
            postalCode: ceremonyLocationEdited
              ? undefined
              : (patientAddressPrefill?.postalCode ?? undefined),
            latitude: ceremonyLocationEdited ? null : (patientAddressPrefill?.latitude ?? null),
            longitude: ceremonyLocationEdited ? null : (patientAddressPrefill?.longitude ?? null),
          }
        : undefined,
      patientNotes: trimmedSpecialRequests || undefined,
      typeConfig,
    };
  }, [
    availability.bookingTime,
    bookingDate,
    currentStep,
    ceremonyLocationEdited,
    formData,
    patientAddressPrefill,
    provider,
    selectedServiceItems,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);
  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const displayedBookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const displayedPlatformFee = quote?.pricing.platformFee ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? currency;
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(FINAL_STEP),
    onSlotConflict: () => {
      setCurrentStep(4);
      setBookingTime('');
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'FuneralBooking quote mismatch detected; refetching authoritative quote.',
        {
          hasMismatchDetails: Boolean(details),
        },
      );
      void refetchQuote();
    },
  });

  useEffect(() => {
    if (servicesLoading) {
      return;
    }

    setSelectedServiceIds((previous) => {
      const next = previous.filter((serviceId) =>
        funeralServices.some((service) => service.id === serviceId),
      );

      return next.length === previous.length ? previous : next;
    });
  }, [funeralServices, servicesLoading]);

  useEffect(() => {
    setBookingTime('');
  }, [selectedServiceIds, setBookingTime]);

  useEffect(() => {
    if (!formData.requiresRepatriation && formData.repatriationCountry) {
      setFormData((previous) => ({
        ...previous,
        repatriationCountry: '',
      }));
    }
  }, [formData.repatriationCountry, formData.requiresRepatriation]);

  useEffect(() => {
    if (formData.ceremonyType === 'none' && formData.ceremonyLocation) {
      setFormData((previous) => ({
        ...previous,
        ceremonyLocation: '',
      }));
    }
  }, [formData.ceremonyLocation, formData.ceremonyType]);

  useEffect(() => {
    if (!patientAddressPrefill || ceremonyLocationEdited || formData.ceremonyType === 'none') {
      return;
    }

    setFormData((previous) => {
      if (previous.ceremonyLocation) {
        return previous;
      }

      return {
        ...previous,
        ceremonyLocation: patientAddressPrefill.displayAddress,
      };
    });
  }, [ceremonyLocationEdited, formData.ceremonyType, patientAddressPrefill]);

  const patientTimezone = useMemo(() => {
    try {
      return getPatientTimezone();
    } catch {
      return null;
    }
  }, []);

  const providerPhone = useMemo(() => {
    if (!provider || typeof provider !== 'object' || !('phone' in provider)) {
      return null;
    }

    const phone = provider.phone;
    return typeof phone === 'string' && phone.trim() ? phone.trim() : null;
  }, [provider]);

  const monthDays = useMemo(
    () =>
      monthAvailabilityDays.reduce<Array<{ date: string; slotCount: number }>>((days, day) => {
        const date = formatDateValue(day.date);

        if (!date) {
          return days;
        }

        days.push({ date, slotCount: day.slotCount });
        return days;
      }, []),
    [monthAvailabilityDays],
  );

  const displaySlots = useMemo(() => {
    const shouldConvertTimezones = Boolean(
      bookingDate &&
      providerTimezone &&
      patientTimezone &&
      !isSameTimezone(providerTimezone, patientTimezone),
    );

    return availability.availableStartTimes.map((time) => {
      if (!shouldConvertTimezones || !bookingDate || !providerTimezone) {
        return { value: time, label: time };
      }

      try {
        const { localLabel, rawValue } = convertProviderTimeToLocal(
          providerTimezone,
          bookingDate,
          time,
        );
        return { value: rawValue, label: localLabel };
      } catch {
        return { value: time, label: time };
      }
    });
  }, [availability.availableStartTimes, bookingDate, patientTimezone, providerTimezone]);

  const selectedTimeLabel =
    displaySlots.find((slot) => slot.value === availability.bookingTime)?.label ??
    availability.bookingTime;
  const slotEmptyMessage =
    selectedServiceIds.length === 0
      ? 'Sélectionnez un ou plusieurs services funéraires pour afficher les créneaux disponibles.'
      : bookingDate
        ? t.bookingFlow.calendarNoAvailability
        : t.bookingFlow.calendarSelectDay;
  const selectedAdditionalServices = ADDITIONAL_FUNERAL_SERVICES.filter(
    (service) => formData[service.field],
  );
  const ceremonyLocationSummary =
    formData.ceremonyType !== 'none' && formData.ceremonyLocation.trim()
      ? formData.ceremonyLocation.trim()
      : (provider ? getProviderLocation(provider) : '') || 'À confirmer';
  const stepLabels = [
    'Défunt',
    'Contact',
    'Services',
    'Cérémonie',
    t.bookingFlow.stepPayment,
    t.bookingFlow.stepConfirmation,
  ];
  const inputClassName =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';
  const selectTriggerClassName =
    'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';
  const surfaceClassName = bookingNeutralSurfaceClassName;
  const funeralSectionIconClassName =
    'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 text-white';
  const funeralSuccessCardClassName = bookingNeutralSuccessCardClassName;
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const confirmedPricing = submission.bookingResult?.pricing ?? null;
  const confirmedServiceItems = submission.bookingResult?.serviceItems ?? null;
  const confirmedAmount = confirmedPricing
    ? formatServicePrice(confirmedPricing.totalAmount, confirmedPricing.currency ?? quoteCurrency)
    : formatServicePrice(totalPrice, quoteCurrency);
  const confirmedDate = formatDateValue(submission.bookingResult?.startDate) ?? bookingDate;
  const confirmedTime = selectedTimeLabel || availability.bookingTime;
  const deceasedNameSummary = formData.deceasedName.trim();
  const deceasedAgeSummary = formData.deceasedAge.trim();
  const deathPlaceSummary = formData.deathPlace.trim();
  const religionSummary = formData.religion.trim();
  const contactNameSummary = formData.contactName.trim();
  const contactPhoneSummary = formData.contactPhone.trim();
  const contactEmailSummary = formData.contactEmail.trim();
  const contactRelationshipSummary = formData.contactRelationship.trim();
  const ceremonyLocationValue = formData.ceremonyLocation.trim();
  const repatriationCountrySummary = formData.repatriationCountry.trim();
  const specialRequestsSummary = formData.specialRequests.trim();
  const additionalServicesSummary = selectedAdditionalServices
    .map((service) => service.label)
    .join(', ');
  const selectedServicesDurationSummary =
    formatSelectedServicesDuration(selectedServiceItems, 'Durée à confirmer') ?? '';
  const prestationMetadataDividerClassName =
    selectedServiceItems.length > 0
      ? 'border-t border-slate-200 pt-2 dark:border-slate-700'
      : undefined;
  const serviceSummaryRows: NonNullable<BookingFlowSummarySection['items']> =
    selectedServiceItems.length > 0
      ? selectedServiceItems.map((service) => {
          const serviceName = service.name ?? service.id;
          const servicePrice = formatServicePrice(service.price, service.currency);

          return {
            label: serviceName,
            value: servicePrice,
            valueTitle: servicePrice,
            className: summaryServiceRowClassName,
            valueClassName: summaryServiceValueClassName,
          };
        })
      : [
          {
            label: 'Prestations',
            value: SUMMARY_REQUIRED_PLACEHOLDER,
          },
        ];
  const bookingSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Défunt',
      items: [
        {
          label: 'Nom',
          value: deceasedNameSummary || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: deceasedNameSummary || SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Date du décès',
          value: formData.deceasedDeathDate || SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Âge',
          value: deceasedAgeSummary,
          valueTitle: deceasedAgeSummary,
          hidden: !deceasedAgeSummary,
        },
        {
          label: 'Religion',
          value: religionSummary,
          valueTitle: religionSummary,
          hidden: !religionSummary,
        },
        {
          label: 'Lieu du décès',
          value: deathPlaceSummary,
          valueTitle: deathPlaceSummary,
          hidden: !deathPlaceSummary,
        },
      ],
    },
    {
      title: 'Contact',
      items: [
        {
          label: 'Nom',
          value: contactNameSummary || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: contactNameSummary || SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Téléphone',
          value: contactPhoneSummary || SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Email',
          value: contactEmailSummary,
          valueTitle: contactEmailSummary,
          hidden: !contactEmailSummary,
        },
        {
          label: 'Lien',
          value: contactRelationshipSummary,
          valueTitle: contactRelationshipSummary,
          hidden: !contactRelationshipSummary,
        },
      ],
    },
    {
      title: 'Prestations',
      items: [
        ...serviceSummaryRows,
        {
          label: 'Durée',
          value: selectedServicesDurationSummary,
          valueTitle: selectedServicesDurationSummary,
          className: prestationMetadataDividerClassName,
          valueClassName: 'font-normal text-slate-700 dark:text-slate-300',
          hidden: selectedServiceItems.length === 0 || !selectedServicesDurationSummary,
        },
        {
          label: 'Compléments',
          value: additionalServicesSummary,
          valueTitle: additionalServicesSummary,
          className: selectedServicesDurationSummary
            ? undefined
            : prestationMetadataDividerClassName,
          hidden: !additionalServicesSummary,
        },
      ],
    },
    {
      title: 'Organisation',
      items: [
        {
          label: 'Cérémonie',
          value: formData.ceremonyType
            ? formatCeremonyLabel(formData.ceremonyType)
            : SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Lieu',
          value: ceremonyLocationValue || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: ceremonyLocationValue || SUMMARY_REQUIRED_PLACEHOLDER,
          hidden: formData.ceremonyType === 'none',
        },
        {
          label: 'Obsèques',
          value: formData.burialType
            ? formatBurialLabel(formData.burialType)
            : SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Date',
          value: bookingDate || SUMMARY_REQUIRED_PLACEHOLDER,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Heure',
          value: selectedTimeLabel || SUMMARY_REQUIRED_PLACEHOLDER,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Rapatriement',
          value: repatriationCountrySummary || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: repatriationCountrySummary || SUMMARY_REQUIRED_PLACEHOLDER,
          hidden: !formData.requiresRepatriation,
        },
        {
          label: 'Demandes',
          value: specialRequestsSummary,
          valueTitle: specialRequestsSummary,
          hidden: !specialRequestsSummary,
        },
      ],
    },
  ];
  const sideBookingSummarySections = bookingSummarySections.slice(0, Math.min(currentStep, 4));
  const paymentPricingSection: BookingFlowSummarySection = {
    title: 'Tarification',
    items: [
      {
        label: 'Montant des services',
        value: formatServicePrice(displayedBookingSubtotal, quoteCurrency),
      },
      {
        label: t.bookingFlow.serviceFees,
        value: formatServicePrice(displayedPlatformFee, quoteCurrency),
      },
    ],
  };
  const bookingSummary =
    currentStep !== 5 && currentStep !== FINAL_STEP ? (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart aria-hidden="true" />}
        className={bookingNeutralPanelClassName}
        iconClassName="bg-transparent text-slate-600 dark:text-slate-300"
        sections={sideBookingSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: formatServicePrice(selectedServicesSubtotal, currency),
          variant: 'line',
          className: 'border-slate-200 dark:border-slate-700',
          labelClassName:
            'text-base font-extrabold uppercase tracking-wide text-slate-900 dark:text-white',
          valueClassName: 'text-sm font-semibold text-muted-foreground',
        }}
      />
    ) : null;
  const paymentSummary = quote ? (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      icon={<FileText aria-hidden="true" />}
      className={bookingNeutralPanelClassName}
      iconClassName="bg-transparent text-slate-600 dark:text-slate-300"
      sections={[...bookingSummarySections, paymentPricingSection]}
      total={{
        label: t.bookingFlow.totalToPay,
        value: formatServicePrice(totalPrice, quoteCurrency),
        className: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50',
        labelClassName: 'text-slate-900 dark:text-white',
        valueClassName: bookingCyanTotalClassName,
      }}
    />
  ) : null;

  useEffect(() => {
    if (currentStep !== 5 || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('FuneralBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentStep, quote, quoteError, quoteLoading, quoteRequest]);

  const handleInputChange = <K extends keyof FuneralFormState>(
    field: K,
    value: FuneralFormState[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((previous) =>
      previous.includes(serviceId)
        ? previous.filter((id) => id !== serviceId)
        : [...previous, serviceId],
    );
  };

  const handleDaySelect = (date: string) => {
    setBookingDate(date);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.deceasedName.trim() && formData.deceasedDeathDate);
      case 2:
        return Boolean(formData.contactName.trim() && formData.contactPhone.trim());
      case 3:
        return Boolean(
          selectedServiceItems.length > 0 &&
          (!formData.requiresRepatriation || formData.repatriationCountry.trim()),
        );
      case 4:
        return Boolean(
          formData.burialType &&
          formData.ceremonyType &&
          bookingDate &&
          availability.bookingTime &&
          !availability.availabilityLoading &&
          !availability.availabilityError &&
          displaySlots.length > 0 &&
          (formData.ceremonyType === 'none' || formData.ceremonyLocation.trim()),
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceedToNextStep() || currentStep >= 5) {
      return;
    }

    setCurrentStep((previous) => previous + 1);
  };

  const handleBack = () => {
    setCurrentStep((previous) => (previous > 1 ? previous - 1 : previous));
  };

  const handlePaymentComplete = (paymentMethod: 'card' | 'd17' | 'cash') => {
    if (!quoteRequest || !quote) {
      return;
    }

    void submission
      .submit({
        ...quoteRequest,
        paymentMethod,
        expectedTotalAmount: quote.pricing.totalAmount,
      })
      .catch(() => undefined);
  };

  if (providerLoading) {
    return <BookingPageLoader iconClassName="text-muted-foreground" />;
  }

  if (providerError || !provider) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/funeral')}
      />
    );
  }

  const providerDisplayName = getProviderDisplayName(provider);
  const bookingHeader: BookingFlowHeaderData = {
    providerName: providerDisplayName,
    providerImageUrl: getProviderImageUrl(provider),
    rating: {
      average: provider.ratingAverage,
      count: provider.ratingCount,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: t.serviceListing.funeralTitle,
    locationLabel: getProviderLocation(provider),
  };

  return (
    <BookingFlowChrome
      header={bookingHeader}
      currentStep={currentStep}
      stepLabels={stepLabels}
      showProgress={currentStep !== FINAL_STEP}
      className="px-6 py-4 pb-10 text-slate-900 dark:text-white"
      headerClassName="relative overflow-hidden rounded-[16px] p-[2px] shadow-sm"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[14px] bg-white/95 p-4 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="max-w-5xl"
      contentClassName="space-y-4"
    >
      <BookingFlowBodyLayout summary={bookingSummary} mainClassName="space-y-4">
        <div className={surfaceClassName} style={accentVariables}>
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={funeralSectionIconClassName}>
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Informations du défunt
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ces informations facilitent l'organisation et les démarches.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    Nom complet du défunt *
                  </label>
                  <input
                    type="text"
                    value={formData.deceasedName}
                    onChange={(event) => handleInputChange('deceasedName', event.target.value)}
                    className={inputClassName}
                    placeholder="Prénom et nom"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    Âge
                  </label>
                  <input
                    type="text"
                    value={formData.deceasedAge}
                    onChange={(event) => handleInputChange('deceasedAge', event.target.value)}
                    className={inputClassName}
                    placeholder="Ex: 78 ans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(event) => handleInputChange('religion', event.target.value)}
                    className={inputClassName}
                    placeholder="Ex: musulmane"
                  />
                </div>

                <DatePickerField
                  id="funeral-deceased-birth-date"
                  label="Date de naissance"
                  value={formData.deceasedBirthDate}
                  onChange={(value) => handleInputChange('deceasedBirthDate', value)}
                  maxDate={new Date()}
                  className="gap-1.5"
                  labelClassName="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300"
                  triggerClassName={`${inputClassName} h-10`}
                />

                <DatePickerField
                  id="funeral-deceased-death-date"
                  label="Date du décès *"
                  value={formData.deceasedDeathDate}
                  onChange={(value) => handleInputChange('deceasedDeathDate', value)}
                  className="gap-1.5"
                  labelClassName="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300"
                  triggerClassName={`${inputClassName} h-10`}
                  required
                />

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    Lieu du décès
                  </label>
                  <input
                    type="text"
                    value={formData.deathPlace}
                    onChange={(event) => handleInputChange('deathPlace', event.target.value)}
                    className={inputClassName}
                    placeholder="Hôpital, domicile, clinique..."
                  />
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Le certificat médical de décès doit être établi par un médecin. La déclaration
                    en mairie doit être faite dans les 24 heures suivant le décès.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={funeralSectionIconClassName}>
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Personne de contact
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vos coordonnées serviront au suivi immédiat du dossier.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    {t.bookingFlow.fullName} *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(event) => handleInputChange('contactName', event.target.value)}
                    className={inputClassName}
                    placeholder="Prénom et nom"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    {t.bookingFlow.phone} *
                  </label>
                  <TunisiaPhoneInput
                    value={formData.contactPhone}
                    onValueChange={(contactPhone) =>
                      handleInputChange('contactPhone', contactPhone)
                    }
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    {t.bookingFlow.email}
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(event) => handleInputChange('contactEmail', event.target.value)}
                    className={inputClassName}
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel
                    className="mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                    htmlFor="funeral-contact-relationship"
                  >
                    Lien de parenté
                  </FieldLabel>
                  <Select
                    value={formData.contactRelationship || EMPTY_FUNERAL_RELATIONSHIP_VALUE}
                    onValueChange={(value) =>
                      handleInputChange(
                        'contactRelationship',
                        value === EMPTY_FUNERAL_RELATIONSHIP_VALUE ? '' : value,
                      )
                    }
                  >
                    <SelectTrigger
                      id="funeral-contact-relationship"
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={EMPTY_FUNERAL_RELATIONSHIP_VALUE}>
                          Sélectionner...
                        </SelectItem>
                        <SelectItem value="Conjoint(e)">Conjoint(e)</SelectItem>
                        <SelectItem value="Enfant">Enfant</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Frère / Sœur">Frère / Sœur</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={funeralSectionIconClassName}>
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Choix des prestations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sélectionnez une ou plusieurs prestations publiées par ce prestataire.
                  </p>
                </div>
              </div>

              {filteredOutServiceCount > 0 ? (
                <div className="rounded-xl border border-amber-300/70 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Certains services publiés n'ont pas de durée réservable en ligne et sont
                      masqués du catalogue de réservation.
                    </p>
                  </div>
                </div>
              ) : null}

              {servicesLoading && funeralServices.length === 0 ? (
                <BookingOptionListSkeleton items={4} />
              ) : null}

              {servicesError ? (
                <BookingInlineState
                  tone="danger"
                  title={t.common.loadingError}
                  description={servicesErrorMessage}
                />
              ) : null}

              {!servicesLoading && !servicesError && funeralServices.length === 0 ? (
                <div className={bookingNeutralPanelClassName}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Aucun service disponible pour la réservation en ligne.
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Veuillez contacter le prestataire directement.
                        </p>
                      </div>

                      {providerPhone ? (
                        <a
                          href={`tel:${providerPhone}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Appeler {providerPhone}
                        </a>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Utilisez les coordonnées du prestataire pour poursuivre hors ligne.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {!servicesLoading && !servicesError && funeralServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {funeralServices.map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    const locationType = normalizeServiceLocation(service.serviceLocation);

                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`rounded-xl border p-4 text-left transition-colors ${isSelected ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {service.name ?? service.id}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              {service.shortDescription ?? 'Aucune description fournie.'}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-sm font-bold text-[color:var(--service-accent-from)]">
                            {formatServicePrice(service.price, service.currency)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className={bookingDurationBadgeClassName}>
                            <Clock className="h-3 w-3" />
                            <span>{formatServiceDuration(service.durationMinutes)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={
                                locationType === 'home'
                                  ? bookingHomeLocationBadgeClassName
                                  : locationType === 'both'
                                    ? bookingBothLocationBadgeClassName
                                    : bookingProviderLocationBadgeClassName
                              }
                            >
                              {locationType === 'home' ? (
                                <Home className="h-3 w-3" />
                              ) : locationType === 'both' ? (
                                <MapPin className="h-3 w-3" />
                              ) : (
                                <Building2 className="h-3 w-3" />
                              )}
                              {getServiceLocationLabel(locationType)}
                            </span>
                            {isSelected ? (
                              <CheckCircle className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {!servicesLoading && !servicesError && funeralServices.length > 0 ? (
                <div className={bookingNeutralPanelClassName}>
                  <Field orientation="horizontal" className="items-start gap-2">
                    <Checkbox
                      id="funeral-repatriation"
                      checked={formData.requiresRepatriation}
                      onCheckedChange={(checked) =>
                        handleInputChange('requiresRepatriation', checked === true)
                      }
                      className="mt-0.5 rounded border-slate-300 text-slate-700 focus:ring-slate-700 dark:border-slate-600 dark:text-slate-300 dark:focus:ring-slate-300"
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="funeral-repatriation"
                        className="text-xs font-medium text-slate-900 dark:text-white"
                      >
                        Le dossier nécessite un rapatriement de corps
                      </FieldLabel>
                      <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Cette information est transmise au prestataire dans la demande sans créer de
                        tarification synthétique.
                      </span>
                    </FieldContent>
                  </Field>

                  {formData.requiresRepatriation ? (
                    <div className="mt-3 pl-6">
                      <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                        Pays de provenance / destination *
                      </label>
                      <input
                        type="text"
                        value={formData.repatriationCountry}
                        onChange={(event) =>
                          handleInputChange('repatriationCountry', event.target.value)
                        }
                        placeholder="Ex: Algérie → Tunisie"
                        className={inputClassName}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {!servicesLoading && !servicesError && funeralServices.length > 0 ? (
                <div className={bookingNeutralPanelClassName}>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Services complémentaires
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Ces options sont transmises au prestataire comme informations de prise en
                      charge et n'affectent pas le montant affiché.
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {ADDITIONAL_FUNERAL_SERVICES.map((service) => (
                      <Field
                        key={service.field}
                        orientation="horizontal"
                        className="items-start gap-2"
                      >
                        <Checkbox
                          id={`funeral-${service.field}`}
                          checked={formData[service.field]}
                          onCheckedChange={(checked) =>
                            handleInputChange(service.field, checked === true)
                          }
                          className="mt-0.5 rounded border-slate-300 text-slate-700 focus:ring-slate-700 dark:border-slate-600 dark:text-slate-300 dark:focus:ring-slate-300"
                        />
                        <FieldContent>
                          <div className="flex flex-wrap items-center gap-2">
                            <FieldLabel
                              htmlFor={`funeral-${service.field}`}
                              className="text-xs font-medium text-slate-900 dark:text-white"
                            >
                              {service.label}
                            </FieldLabel>
                            {service.included ? (
                              <span
                                className={`inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success`}
                              >
                                Inclus
                              </span>
                            ) : null}
                          </div>
                          <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {service.description}
                          </span>
                        </FieldContent>
                      </Field>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedServiceItems.length > 0 ? (
                <div className={bookingNeutralPanelClassName}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedServiceItems.length} service
                        {selectedServiceItems.length > 1 ? 's' : ''} sélectionné
                        {selectedServiceItems.length > 1 ? 's' : ''}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedServiceItems.map((service) => (
                          <span key={service.id} className={bookingMetadataBadgeClassName}>
                            {service.name ?? service.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={funeralSectionIconClassName}>
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Organisation et disponibilité
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Précisez le type d'obsèques, la cérémonie et le créneau souhaité.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Type d'obsèques *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        value: 'inhumation' as const,
                        label: 'Inhumation',
                        description: 'Enterrement classique avec coordination des démarches.',
                        icon: Home,
                      },
                      {
                        value: 'cremation' as const,
                        label: 'Crémation',
                        description: 'Organisation de la cérémonie et coordination du crématorium.',
                        icon: AlertCircle,
                      },
                    ].map((option) => {
                      const isSelected = formData.burialType === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('burialType', option.value)}
                          className={`rounded-xl border-2 p-3 text-left transition-colors ${isSelected ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                        >
                          <div className="flex items-center gap-2">
                            <option.icon
                              className={`h-4 w-4 ${
                                isSelected
                                  ? 'text-slate-700 dark:text-slate-300'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {option.label}
                            </span>
                          </div>
                          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <FieldLabel
                    className="mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                    htmlFor="funeral-ceremony-type"
                  >
                    Type de cérémonie *
                  </FieldLabel>
                  <Select
                    value={
                      formData.ceremonyType === 'none'
                        ? NO_FUNERAL_CEREMONY_VALUE
                        : formData.ceremonyType || EMPTY_FUNERAL_CEREMONY_TYPE_VALUE
                    }
                    onValueChange={(value) =>
                      handleInputChange(
                        'ceremonyType',
                        (value === EMPTY_FUNERAL_CEREMONY_TYPE_VALUE
                          ? ''
                          : value === NO_FUNERAL_CEREMONY_VALUE
                            ? 'none'
                            : value) as CeremonyType,
                      )
                    }
                  >
                    <SelectTrigger id="funeral-ceremony-type" className={selectTriggerClassName}>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={EMPTY_FUNERAL_CEREMONY_TYPE_VALUE}>
                          Sélectionner...
                        </SelectItem>
                        <SelectItem value="religious">Religieuse</SelectItem>
                        <SelectItem value="civil">Civile</SelectItem>
                        <SelectItem value={NO_FUNERAL_CEREMONY_VALUE}>Sans cérémonie</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {formData.ceremonyType && formData.ceremonyType !== 'none' ? (
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                      Lieu de la cérémonie *
                    </label>
                    <input
                      type="text"
                      value={formData.ceremonyLocation}
                      onChange={(event) => {
                        setCeremonyLocationEdited(true);
                        handleInputChange('ceremonyLocation', event.target.value);
                      }}
                      placeholder="Lieu de culte, cimetière, crématorium..."
                      className={inputClassName}
                    />
                  </div>
                ) : null}

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    Demandes particulières
                  </label>
                  <textarea
                    rows={4}
                    value={formData.specialRequests}
                    onChange={(event) => handleInputChange('specialRequests', event.target.value)}
                    className={`${inputClassName} resize-none`}
                    placeholder="Organisation du recueillement, invités, contraintes logistiques, préférences religieuses..."
                  />
                </div>
              </div>

              {selectedServiceItems.length > 0 ? (
                <div className={bookingNeutralPanelClassName}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Prestations sélectionnées
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedServiceItems.map((service) => (
                          <span key={service.id} className={bookingMetadataBadgeClassName}>
                            {service.name ?? service.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-900 dark:text-white">
                    {t.bookingFlow.selectDate} *
                  </label>
                  <MonthCalendar
                    year={calendarYear}
                    month={calendarMonth}
                    days={monthDays}
                    selectedDate={bookingDate || null}
                    onSelectDate={handleDaySelect}
                    onMonthChange={handleMonthChange}
                    loading={monthLoading}
                    maxDate={calendarMaxDate ?? undefined}
                    disabled={servicesLoading || selectedServiceIds.length === 0}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-900 dark:text-white">
                    {t.bookingFlow.selectTime} *
                  </label>
                  <DaySlotPicker
                    slots={displaySlots}
                    selectedSlot={availability.bookingTime}
                    onSelectSlot={availability.setBookingTime}
                    loading={availability.availabilityLoading}
                    providerTimezone={providerTimezone}
                    emptyMessage={slotEmptyMessage}
                  />
                </div>
              </div>

              {availability.availabilityError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                  <p className="text-xs font-semibold text-destructive">{t.bookingFlow.error}</p>
                  <p className="text-xs mt-1 text-destructive">
                    {availability.availabilityErrorMessage}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {currentStep === 5 ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBack}
                className="group inline-flex h-auto items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                {t.bookingFlow.previous}
              </button>

              <BookingQuotePanel
                loading={quoteLoading}
                error={quoteError || !quote}
                errorTitle={t.bookingFlow.error}
                errorMessage={quoteErrorMessage}
                loadingLabel={t.common.loading}
                retryLabel={t.common.retry}
                onRetry={() => void refetchQuote()}
              >
                {quote ? (
                  <PaymentStep
                    totalPrice={totalPrice}
                    onPaymentComplete={handlePaymentComplete}
                    isSubmitting={submission.isSubmitting}
                    providerName={getProviderDisplayName(provider)}
                    serviceName={selectedServiceItems
                      .map((service) => service.name ?? service.id)
                      .join(', ')}
                    date={bookingDate}
                    time={selectedTimeLabel}
                    cashAvailable={quote?.cashAvailable ?? true}
                    paymentSummary={paymentSummary}
                    panelClassName={bookingNeutralPanelClassName}
                    noticeClassName="border-cyan-300/70 bg-cyan-50/70 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
                    optionClassName={bookingNeutralPaymentOptionClassName}
                    optionSelectedClassName={bookingCyanPaymentOptionSelectedBaseClassName}
                  />
                ) : null}
              </BookingQuotePanel>
            </div>
          ) : null}

          {currentStep === FINAL_STEP ? (
            <BookingSuccessPanel
              bookingNumber={submission.bookingResult?.bookingNumber}
              onGoToDashboard={() => navigate('/patient-dashboard')}
              onViewServices={() => navigate('/funeral')}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nous vous présentons nos sincères condoléances. Un conseiller funéraire prendra
                contact avec vous pour finaliser l'organisation.
              </p>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${funeralSuccessCardClassName}`}
              >
                <p>
                  <span className="font-semibold">Type de cérémonie:</span>{' '}
                  {formatCeremonyLabel(formData.ceremonyType)}
                </p>
                <p>
                  <span className="font-semibold">Type d'obsèques:</span>{' '}
                  {formatBurialLabel(formData.burialType)}
                </p>
                <p>
                  <span className="font-semibold">Montant:</span>{' '}
                  <span className={bookingCyanTotalClassName}>{confirmedAmount}</span>
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectDate}:</span> {confirmedDate}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectTime}:</span> {confirmedTime}
                </p>
                <p className="sm:col-span-2">
                  <span className="font-semibold">Adresse:</span> {ceremonyLocationSummary}
                </p>
              </div>

              {selectedAdditionalServices.length > 0 ? (
                <div className={funeralSuccessCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Services complémentaires
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedAdditionalServices.map((service) => (
                      <p key={service.field}>
                        <span className="font-semibold">{service.label}:</span>{' '}
                        {service.confirmationValue}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={funeralSuccessCardClassName}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Prestations retenues
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  {confirmedServiceItems && confirmedServiceItems.length > 0
                    ? confirmedServiceItems.map((serviceItem) => (
                        <div
                          key={serviceItem.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold">
                              {serviceItem.serviceName ?? serviceItem.serviceId}
                            </p>
                            <p>Quantité confirmée: {serviceItem.quantity}</p>
                          </div>
                          <span className="font-semibold whitespace-nowrap text-[color:var(--service-accent-from)]">
                            {formatServicePrice(
                              serviceItem.subtotal,
                              serviceItem.currency ?? confirmedPricing?.currency ?? currency,
                            )}
                          </span>
                        </div>
                      ))
                    : selectedServiceItems.map((service) => (
                        <div key={service.id} className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{service.name ?? service.id}</p>
                            <p>{service.shortDescription ?? 'Aucune description fournie.'}</p>
                          </div>
                          <span className="font-semibold whitespace-nowrap text-[color:var(--service-accent-from)]">
                            {formatServicePrice(service.price, service.currency)}
                          </span>
                        </div>
                      ))}
                  {!confirmedPricing ? (
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 font-semibold dark:border-slate-700">
                      <span>Montant estimatif</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(totalPrice, quoteCurrency)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {confirmedPricing ? (
                <div className={funeralSuccessCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Tarification confirmée
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span>Montant des services</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.bookingSubtotal,
                          confirmedPricing.currency ?? currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{t.bookingFlow.serviceFees}</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.platformFee,
                          confirmedPricing.currency ?? currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 font-semibold">
                      <span>{t.bookingFlow.totalToPay}</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.totalAmount,
                          confirmedPricing.currency ?? currency,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className={funeralSuccessCardClassName}>
                <p>
                  <span className="font-semibold">Défunt:</span> {formData.deceasedName}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Date du décès:</span>{' '}
                  {formData.deceasedDeathDate || 'Non précisée'}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Religion:</span>{' '}
                  {formData.religion || 'Non précisée'}
                </p>
                {formData.requiresRepatriation ? (
                  <p className="mt-2">
                    <span className="font-semibold">Rapatriement:</span>{' '}
                    {formData.repatriationCountry || 'Oui'}
                  </p>
                ) : null}
              </div>

              <div className={funeralSuccessCardClassName}>
                <p>
                  <span className="font-semibold">Contact:</span> {formData.contactName} —{' '}
                  {formData.contactPhone}
                </p>
                {formData.contactEmail ? (
                  <p className="mt-2">
                    <span className="font-semibold">Email:</span> {formData.contactEmail}
                  </p>
                ) : null}
                {formData.contactRelationship ? (
                  <p className="mt-2">
                    <span className="font-semibold">Lien de parenté:</span>{' '}
                    {formData.contactRelationship}
                  </p>
                ) : null}
                {formData.specialRequests ? (
                  <p className="mt-2">
                    <span className="font-semibold">Demandes particulières:</span>{' '}
                    {formData.specialRequests}
                  </p>
                ) : null}
              </div>
            </BookingSuccessPanel>
          ) : null}
        </div>

        {currentStep < 5 ? (
          <BookingStepActions
            onBack={currentStep > 1 ? handleBack : undefined}
            backLabel={t.bookingFlow.previous}
            onNext={handleNext}
            nextType="button"
            nextDisabled={!canProceedToNextStep()}
            nextLabel={currentStep === 4 ? t.bookingFlow.continueToPayment : t.bookingFlow.next}
          />
        ) : null}
      </BookingFlowBodyLayout>
    </BookingFlowChrome>
  );
}
