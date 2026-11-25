import type { LoaderFunctionArgs } from 'react-router-dom';

import { appFeaturesOptions } from '@/features/app-features';
import { authProfileOptions } from '@/features/auth';
import { PatientProfileScreen } from '@/features/patient/profile';
import { myPatientProfileOptions, patientPreferencesOptions } from '@/features/users';
import { queryClient } from '@/shared/lib/query/client';

// ============================================
// ROUTE LOADER
// ============================================

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(appFeaturesOptions());
  void queryClient.prefetchQuery(authProfileOptions());
  void queryClient.prefetchQuery(myPatientProfileOptions());
  void queryClient.prefetchQuery(patientPreferencesOptions());

  return null;
};

export function PatientProfilePage() {
  return <PatientProfileScreen />;
}
