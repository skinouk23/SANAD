import { Suspense, lazy } from 'react';

import { AppLayout } from '@/app/layouts/AppLayout';

const AssistantDock = lazy(() =>
  import('@/features/assistant').then((module) => ({ default: module.AssistantDock })),
);

export function AppLayoutRoute() {
  return (
    <AppLayout
      overlay={
        <Suspense fallback={null}>
          <AssistantDock />
        </Suspense>
      }
    />
  );
}
