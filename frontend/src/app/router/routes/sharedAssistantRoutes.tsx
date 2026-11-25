import type { RouteObject } from 'react-router-dom';

import { PatientProviderRoute } from '@/app/router/guards/PatientProviderRoute';
import { L, routeHandle } from '@/app/router/helpers';

export const sharedAssistantRoutes: RouteObject = {
  element: <PatientProviderRoute />,
  children: [
    {
      path: 'assistant',
      ...L(() => import('@/pages/assistant/AssistantPage'), 'AssistantPage'),
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
