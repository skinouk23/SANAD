import type { RouteObject } from 'react-router-dom';

import { L, h } from '@/app/router/helpers';

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    ...L(() => import('@/pages/landing/LandingPage'), 'LandingPage'),
  },
  {
    path: 'services',
    ...L(() => import('@/pages/services/ServiceSelectionPage'), 'ServiceSelectionPage'),
  },
  {
    path: 'how-it-works',
    ...L(() => import('@/pages/landing/HowItWorksPage'), 'HowItWorksPage'),
    ...h('/services'),
  },
  {
    path: 'subscriptions',
    ...L(() => import('@/pages/services/SubscriptionsPage'), 'SubscriptionsPage'),
    ...h('/services'),
  },
  {
    path: 'auth/onboarding',
    ...L(() => import('@/pages/auth/OnboardingPage'), 'OnboardingPage'),
  },
  {
    path: 'auth/login',
    ...L(() => import('@/pages/auth/LoginPage'), 'LoginPage'),
  },
  {
    path: 'auth/signup',
    ...L(() => import('@/pages/auth/SignUpPage'), 'SignUpPage'),
  },
  {
    path: 'auth/signup/professional',
    ...L(() => import('@/pages/auth/ProfessionalSignUpPage'), 'ProfessionalSignUpPage'),
  },
  {
    path: 'auth/signup/provider-pending',
    ...L(() => import('@/pages/auth/ProviderPendingApprovalPage'), 'ProviderPendingApprovalPage'),
  },
  {
    path: 'auth/signup/equipment',
    ...L(() => import('@/pages/auth/EquipmentSignUpPage'), 'EquipmentSignUpPage'),
  },
  {
    path: 'auth/signup/laboratory',
    ...L(() => import('@/pages/auth/LaboratorySignUpPage'), 'LaboratorySignUpPage'),
  },
  {
    path: 'auth/signup/radiology',
    ...L(() => import('@/pages/auth/RadiologySignUpPage'), 'RadiologySignUpPage'),
  },
  {
    path: 'auth/signup/pharmacy',
    ...L(() => import('@/pages/auth/PharmacySignUpPage'), 'PharmacySignUpPage'),
  },
  {
    path: 'auth/signup/funeral',
    ...L(() => import('@/pages/auth/FuneralSignUpPage'), 'FuneralSignUpPage'),
  },
  {
    path: 'auth/signup/veterinary',
    ...L(() => import('@/pages/auth/VeterinarySignUpPage'), 'VeterinarySignUpPage'),
  },
  {
    path: 'auth/signup/gym',
    ...L(() => import('@/pages/auth/GymSignUpPage'), 'GymSignUpPage'),
  },
];
