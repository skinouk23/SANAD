import {
  Briefcase,
  Building2,
  Dumbbell,
  FlaskConical,
  Heart,
  PawPrint,
  Pill,
  Scan,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ProviderCategory } from '@/features/providers/providerAuthoring';
import type { TranslationKeys } from '@/i18n/types';

export interface AuthProviderServiceOption {
  icon: string;
  label: string;
  serviceType: ProviderCategory;
}

export interface AuthOnboardingOption {
  description: string;
  features: string[];
  icon: LucideIcon;
  id:
    | 'patient'
    | 'professional'
    | 'equipment'
    | 'laboratory'
    | 'radiology'
    | 'gym'
    | 'pharmacy'
    | 'funeral'
    | 'veterinary';
  signUpPath: string;
  title: string;
}

export function getLoginProviderServiceOptions(t: TranslationKeys): AuthProviderServiceOption[] {
  return [
    { icon: '💉', label: t.services.nursing, serviceType: 'nursing' },
    {
      icon: '👴',
      label: t.services.elderly_care,
      serviceType: 'elderly_care',
    },
    {
      icon: '🏃',
      label: t.services.physiotherapy,
      serviceType: 'physiotherapy',
    },
    {
      icon: '👶',
      label: t.services.maternityService,
      serviceType: 'maternity',
    },
    {
      icon: '🌙',
      label: t.services.nightGuard,
      serviceType: 'night_care',
    },
    {
      icon: '🩺',
      label: t.services.doctorHome,
      serviceType: 'doctor',
    },
    {
      icon: '🧠',
      label: t.services.psychology,
      serviceType: 'psychology',
    },
    { icon: '🥗', label: t.services.nutrition, serviceType: 'nutrition' },
    {
      icon: '🔬',
      label: t.services.laboratory,
      serviceType: 'laboratory',
    },
    {
      icon: '🩻',
      label: t.services.radiology,
      serviceType: 'radiology',
    },
    {
      icon: '🏥',
      label: t.nav.equipment,
      serviceType: 'equipment_rental',
    },
    {
      icon: '🧒',
      label: t.services.babysitting,
      serviceType: 'babysitting',
    },
    {
      icon: '🚑',
      label: t.services.ambulance,
      serviceType: 'ambulance',
    },
    {
      icon: '📋',
      label: 'Bilan Santé',
      serviceType: 'checkup',
    },
    {
      icon: '💊',
      label: 'Soins Chroniques',
      serviceType: 'chronic_care',
    },
    {
      icon: '🤝',
      label: 'Accompagnement',
      serviceType: 'medical_companion',
    },
    { icon: '💊', label: 'Pharmacie', serviceType: 'pharmacy' },
    { icon: '🏋️', label: 'Salles de Sport', serviceType: 'gym' },
    {
      icon: '🕊️',
      label: 'Services Funéraires',
      serviceType: 'funeral',
    },
    { icon: '🐾', label: 'Vétérinaire', serviceType: 'veterinary' },
  ];
}

export function getProfessionalProviderServiceOptions(
  t: TranslationKeys,
): AuthProviderServiceOption[] {
  return [
    { icon: '💉', label: t.signup.nursingCare, serviceType: 'nursing' },
    {
      icon: '👴',
      label: t.signup.seniorCare,
      serviceType: 'elderly_care',
    },
    {
      icon: '🏃',
      label: t.signup.physiotherapy,
      serviceType: 'physiotherapy',
    },
    {
      icon: '👶',
      label: t.signup.maternityCare,
      serviceType: 'maternity',
    },
    {
      icon: '🌙',
      label: t.signup.nightGuard,
      serviceType: 'night_care',
    },
    {
      icon: '🩺',
      label: t.signup.homeDoctor,
      serviceType: 'doctor',
    },
    {
      icon: '🧠',
      label: t.signup.psychology,
      serviceType: 'psychology',
    },
    { icon: '🥗', label: t.signup.nutrition, serviceType: 'nutrition' },
    {
      icon: '🩼',
      label: 'Équipement médical',
      serviceType: 'equipment_rental',
    },
    {
      icon: '👶',
      label: "Garde d'enfants",
      serviceType: 'babysitting',
    },
    {
      icon: '🚑',
      label: 'Ambulance privée',
      serviceType: 'ambulance',
    },
    { icon: '📋', label: 'Bilan de santé', serviceType: 'checkup' },
    {
      icon: '💊',
      label: 'Soins chroniques',
      serviceType: 'chronic_care',
    },
    {
      icon: '🤝',
      label: 'Accompagnement médical',
      serviceType: 'medical_companion',
    },
    { icon: '💊', label: 'Pharmacie', serviceType: 'pharmacy' },
    {
      icon: '🕯️',
      label: 'Services funéraires',
      serviceType: 'funeral',
    },
  ];
}

export function getOnboardingOptions(t: TranslationKeys): AuthOnboardingOption[] {
  return [
    {
      description: t.onboarding.patientDesc,
      features: [
        t.onboarding.bookCare,
        t.onboarding.findProfessionals,
        t.onboarding.manageAppointments,
      ],
      icon: User,
      id: 'patient',
      signUpPath: '/auth/signup?type=patient',
      title: t.onboarding.patient,
    },
    {
      description: t.onboarding.professionalDesc,
      features: [
        t.onboarding.manageSchedule,
        t.onboarding.receiveRequests,
        t.onboarding.growBusiness,
      ],
      icon: Briefcase,
      id: 'professional',
      signUpPath: '/auth/signup/professional',
      title: t.onboarding.professional,
    },
    {
      description: t.onboarding.agencyDesc,
      features: [
        t.onboarding.manageInventory,
        t.onboarding.receiveBookings,
        t.onboarding.trackRentals,
      ],
      icon: Building2,
      id: 'equipment',
      signUpPath: '/auth/signup/equipment',
      title: t.onboarding.agency,
    },
    {
      description: t.onboarding.laboratoryDesc,
      features: [
        t.onboarding.manageAnalyses,
        t.onboarding.homeSampling,
        t.onboarding.onlineResults,
      ],
      icon: FlaskConical,
      id: 'laboratory',
      signUpPath: '/auth/signup/laboratory',
      title: t.onboarding.laboratory,
    },
    {
      description: t.onboarding.radiologyDesc,
      features: [t.onboarding.manageSlots, t.onboarding.radioMriCt, t.onboarding.quickAppointments],
      icon: Scan,
      id: 'radiology',
      signUpPath: '/auth/signup/radiology',
      title: t.onboarding.radiology,
    },
    {
      description: t.onboarding.gymDesc,
      features: [
        t.onboarding.manageSubscriptions,
        t.onboarding.groupClasses,
        t.onboarding.memberTracking,
      ],
      icon: Dumbbell,
      id: 'gym',
      signUpPath: '/auth/signup/gym',
      title: t.onboarding.gym,
    },
    {
      description: t.onboarding.pharmacyDesc,
      features: [t.onboarding.manageOrders, t.onboarding.homeDelivery, t.onboarding.pharmacyAdvice],
      icon: Pill,
      id: 'pharmacy',
      signUpPath: '/auth/signup/pharmacy',
      title: t.onboarding.pharmacy,
    },
    {
      description: t.onboarding.funeralDesc,
      features: [t.onboarding.manageServices, t.onboarding.familySupport, t.onboarding.adminTasks],
      icon: Heart,
      id: 'funeral',
      signUpPath: '/auth/signup/funeral',
      title: t.onboarding.funeral,
    },
    {
      description: t.serviceListing.veterinarySubtitle,
      features: [
        'Consultations et vaccination',
        'Chirurgie et soins',
        'Urgences et visites à domicile',
      ],
      icon: PawPrint,
      id: 'veterinary',
      signUpPath: '/auth/signup/veterinary',
      title: t.serviceListing.veterinaryTitle,
    },
  ];
}
