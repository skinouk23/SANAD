import type { RouteObject } from 'react-router-dom';

import { PatientRoute } from '@/app/router/guards/PatientRoute';
import { L, h } from '@/app/router/helpers';

export const patientRoutes: RouteObject = {
  element: <PatientRoute />,
  children: [
    {
      path: 'patient-dashboard',
      ...L(() => import('@/pages/patient/PatientDashboardPage'), 'PatientDashboardPage'),
    },
    {
      path: 'patient/profile',
      ...L(() => import('@/pages/patient/PatientProfilePage'), 'PatientProfilePage'),
      ...h('/patient-dashboard'),
    },
    {
      path: 'mon-espace',
      ...L(() => import('@/pages/patient/PatientAppointmentsPage'), 'PatientAppointmentsPage'),
      ...h('/patient-dashboard'),
    },
    {
      path: 'medicaments',
      ...L(() => import('@/pages/patient/PatientMedicationsPage'), 'PatientMedicationsPage'),
      ...h('/patient-dashboard'),
    },
    {
      path: 'donation-medicaments',
      ...L(() => import('@/pages/patient/MedicationDonationPage'), 'MedicationDonationPage'),
      ...h('/medicaments'),
    },
    {
      path: 'health',
      ...L(() => import('@/pages/patient/HealthTracking'), 'HealthTracking'),
      ...h('/patient-dashboard'),
    },
    {
      path: 'health/activity',
      ...L(() => import('@/pages/health/ActivityTracking'), 'ActivityTracking'),
      ...h('/health'),
    },
    {
      path: 'health/hydration',
      ...L(() => import('@/pages/health/HydrationTracking'), 'HydrationTracking'),
      ...h('/health'),
    },
    {
      path: 'health/nutrition',
      ...L(() => import('@/pages/health/NutritionTracking'), 'NutritionTracking'),
      ...h('/health'),
    },
    {
      path: 'health/nutrition/profile',
      ...L(() => import('@/pages/health/NutritionProfile'), 'NutritionProfile'),
      ...h('/health/nutrition'),
    },
    {
      path: 'health-concierge',
      ...L(() => import('@/pages/patient/HealthConcierge'), 'HealthConcierge'),
      ...h('/patient-dashboard'),
    },
    {
      path: 'concierge/coordinate-appointment',
      ...L(() => import('@/pages/concierge/CoordinateAppointment'), 'CoordinateAppointment'),
      ...h('/health-concierge'),
    },
    {
      path: 'concierge/manage-documents',
      ...L(() => import('@/pages/concierge/ManageDocuments'), 'ManageDocuments'),
      ...h('/health-concierge'),
    },
    {
      path: 'concierge/care-plan',
      ...L(() => import('@/pages/concierge/CarePlan'), 'CarePlan'),
      ...h('/health-concierge'),
    },
    {
      path: 'concierge/emergency',
      ...L(() => import('@/pages/concierge/EmergencyHealth'), 'EmergencyHealth'),
      ...h('/health-concierge'),
    },
    {
      path: 'equipment/booking/:equipmentId',
      ...L(() => import('@/pages/bookings/EquipmentBookingPage'), 'EquipmentBookingPage'),
      ...h('/equipment'),
    },
    {
      path: 'laboratory/booking/:providerId',
      ...L(() => import('@/pages/bookings/LaboratoryBookingPage'), 'LaboratoryBookingPage'),
      ...h('/laboratory'),
    },
    {
      path: 'radiology/booking/:providerId',
      ...L(() => import('@/pages/bookings/RadiologyBookingPage'), 'RadiologyBookingPage'),
      ...h('/radiology'),
    },
    {
      path: 'pharmacy/booking/:providerId',
      ...L(() => import('@/pages/bookings/PharmacyBookingPage'), 'PharmacyBookingPage'),
      ...h('/pharmacy'),
    },
    {
      path: 'funeral/booking/:providerId',
      ...L(() => import('@/pages/bookings/FuneralBookingPage'), 'FuneralBookingPage'),
      ...h('/funeral'),
    },
    {
      path: 'veterinary/booking/:providerId',
      ...L(() => import('@/pages/bookings/VeterinaryBookingPage'), 'VeterinaryBookingPage'),
      ...h('/veterinary'),
    },
    {
      path: 'nutrition/booking/:providerId',
      ...L(() => import('@/pages/bookings/NutritionBookingPage'), 'NutritionBookingPage'),
      ...h('/nutrition-providers'),
    },
    {
      path: 'ambulance/booking/:providerId',
      ...L(() => import('@/pages/bookings/AmbulanceBookingPage'), 'AmbulanceBookingPage'),
      ...h('/ambulance'),
    },
    {
      path: 'care/:serviceId/booking/:providerId',
      ...L(() => import('@/pages/bookings/CareBookingPage'), 'CareBookingPage'),
      ...h((params: Record<string, string>) => `/care/${params.serviceId}`),
    },
    {
      path: 'gym/booking/:providerId',
      ...L(() => import('@/pages/bookings/GymBooking'), 'GymBooking'),
      ...h('/gym'),
    },
  ],
};
