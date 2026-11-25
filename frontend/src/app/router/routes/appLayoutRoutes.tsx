import type { RouteObject } from 'react-router-dom';

import { NotFoundPage } from '@/app/errors/NotFoundPage';
import { RouteErrorPage } from '@/app/router/error-elements';
import { L } from '@/app/router/helpers';
import { patientRoutes } from '@/app/router/routes/patientRoutes';
import { providerRoutes } from '@/app/router/routes/providerRoutes';
import { publicRoutes } from '@/app/router/routes/publicRoutes';
import { serviceRoutes } from '@/app/router/routes/serviceRoutes';
import { sharedAssistantRoutes } from '@/app/router/routes/sharedAssistantRoutes';
import { sharedHelpRoutes } from '@/app/router/routes/sharedHelpRoutes';
import { sharedMessagingRoutes } from '@/app/router/routes/sharedMessagingRoutes';

export const appLayoutRoutes: RouteObject = {
  ...L(() => import('@/pages/app/AppLayoutRoute'), 'AppLayoutRoute'),
  errorElement: <RouteErrorPage />,
  children: [
    ...publicRoutes,
    ...serviceRoutes,
    patientRoutes,
    sharedMessagingRoutes,
    sharedAssistantRoutes,
    sharedHelpRoutes,
    providerRoutes,
    { path: '*', element: <NotFoundPage /> },
  ],
};
