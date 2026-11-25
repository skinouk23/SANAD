import type { LoaderFunctionArgs } from 'react-router-dom';

import { appFeaturesOptions } from '@/features/app-features';
import { upcomingBookingsOptions, bookingStatsOptions } from '@/features/bookings';
import { familyMembersOptions } from '@/features/family-circle';
import { PatientDashboardScreen } from '@/features/patient/dashboard';
import { myPatientProfileOptions } from '@/features/users';
import { queryClient } from '@/shared/lib/query/client';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(appFeaturesOptions());
  void queryClient.prefetchQuery(upcomingBookingsOptions());
  void queryClient.prefetchQuery(bookingStatsOptions());
  void queryClient.prefetchQuery(familyMembersOptions());
  void queryClient.prefetchQuery(myPatientProfileOptions());

  return null;
};
export function PatientDashboardPage() {
  return <PatientDashboardScreen />;
}
