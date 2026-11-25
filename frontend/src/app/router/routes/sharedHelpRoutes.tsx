import type { RouteObject } from 'react-router-dom';

import { PatientProviderRoute } from '@/app/router/guards/PatientProviderRoute';
import { L, routeHandle } from '@/app/router/helpers';

export const sharedHelpRoutes: RouteObject = {
  element: <PatientProviderRoute />,
  children: [
    {
      path: 'aide',
      ...L(() => import('@/pages/landing/HelpPage'), 'HelpPage'),
      ...routeHandle({
        back: {
          type: 'history-first',
          fallbackByRole: {
            patient: '/patient-dashboard',
            provider: '/provider-dashboard',
          },
        },
      }),
    },
  ],
};
