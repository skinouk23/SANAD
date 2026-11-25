import type { LoaderFunctionArgs } from 'react-router-dom';

import {
  myProviderPlanningOptions,
  myProviderProfileOptions,
  ProviderScheduleManagementScreen,
} from '@/features/providers';
import { queryClient } from '@/shared/lib/query/client';

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  const today = toLocalIsoDate(new Date());

  void Promise.all([
    queryClient.prefetchQuery(myProviderProfileOptions()),
    queryClient.prefetchQuery(
      myProviderPlanningOptions({
        from: today,
        to: today,
      }),
    ),
  ]).catch(() => undefined);

  return null;
};

export { ProviderScheduleManagementScreen as ScheduleManagementPage };
