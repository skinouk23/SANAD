import type { RouteObject } from 'react-router-dom';

import { PatientProviderRoute } from '@/app/router/guards/PatientProviderRoute';
import { L, h } from '@/app/router/helpers';

export const sharedMessagingRoutes: RouteObject = {
  element: <PatientProviderRoute />,
  children: [
    {
      path: 'messages',
      ...L(() => import('@/pages/messaging/MessagesPage'), 'MessagesPage'),
    },
    {
      path: 'messages/:conversationId',
      ...L(() => import('@/pages/messaging/MessageChatPage'), 'MessageChatPage'),
      ...h('/messages'),
    },
  ],
};
