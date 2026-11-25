import { useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/auth-context';
import { myPatientProfileOptions } from '@/features/users/options';
import { getPatientBookingAddressPrefill } from '@/shared/lib/location/booking-address';

export function usePatientBookingAddressPrefill() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user ?? null;
  const query = useQuery({
    ...myPatientProfileOptions(),
    enabled: user?.role === 'patient',
  });
  const profile = user?.role === 'patient' ? (query.data ?? null) : null;
  const authAddress = user?.role === 'patient' ? user.address : null;
  const address = useMemo(
    () => getPatientBookingAddressPrefill(profile, authAddress),
    [authAddress, profile],
  );

  return {
    address,
    loading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
  };
}
