import type { RouteObject } from 'react-router-dom';

import { PatientRoute } from '@/app/router/guards/PatientRoute';
import { L, h } from '@/app/router/helpers';

export const serviceRoutes: RouteObject[] = [
  {
    path: 'equipment',
    ...L(() => import('@/pages/equipment/EquipmentCatalogPage'), 'EquipmentCatalogPage'),
    ...h('/services'),
  },
  {
    element: <PatientRoute />,
    children: [
      {
        path: 'equipment/:id',
        ...L(() => import('@/pages/equipment/EquipmentDetailPage'), 'EquipmentDetailPage'),
        ...h('/equipment'),
      },
    ],
  },
  {
    path: 'laboratory',
    ...L(() => import('@/pages/services/LaboratoryPage'), 'LaboratoryPage'),
    ...h('/services'),
  },
  {
    path: 'radiology',
    ...L(() => import('@/pages/services/RadiologyPage'), 'RadiologyPage'),
    ...h('/services'),
  },
  {
    path: 'pharmacy',
    ...L(() => import('@/pages/services/PharmacyPage'), 'PharmacyPage'),
    ...h('/services'),
  },
  {
    path: 'funeral',
    ...L(() => import('@/pages/services/FuneralServicesPage'), 'FuneralServicesPage'),
    ...h('/services'),
  },
  {
    path: 'veterinary',
    ...L(() => import('@/pages/services/VeterinaryPage'), 'VeterinaryPage'),
    ...h('/services'),
  },
  {
    path: 'nutrition-providers',
    ...L(() => import('@/pages/services/NutritionProvidersPage'), 'NutritionProvidersPage'),
    ...h('/services'),
  },
  {
    path: 'ambulance',
    ...L(() => import('@/pages/services/AmbulanceServicePage'), 'AmbulanceServicePage'),
    ...h('/services'),
  },
  {
    path: 'care/:serviceId',
    ...L(() => import('@/pages/services/CareServicePage'), 'CareServicePage'),
    ...h('/services'),
  },
  {
    path: 'gym',
    ...L(() => import('@/pages/services/Gym'), 'Gym'),
    ...h('/services'),
  },
];
