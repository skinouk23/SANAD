import type { LoaderFunctionArgs } from 'react-router-dom';

import { upcomingBookingSessionsOptions, pastBookingSessionsOptions } from '@/features/bookings';
import { PatientAppointmentsScreen } from '@/features/patient/appointments';
import { queryClient } from '@/shared/lib/query/client';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(upcomingBookingSessionsOptions());
  void queryClient.prefetchQuery(pastBookingSessionsOptions());

  return null;
};
export function PatientAppointmentsPage() {
  return <PatientAppointmentsScreen />;
}
