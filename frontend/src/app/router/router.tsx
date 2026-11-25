import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/app/layouts/RootLayout';
import { appLayoutRoutes } from '@/app/router/routes/appLayoutRoutes';

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [appLayoutRoutes],
  },
]);
