import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockCreateBooking } = vi.hoisted(() => ({
  mockCreateBooking: vi.fn(),
}));

vi.mock('@/features/bookings/service', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings/service')>(
    '@/features/bookings/service',
  );

  return {
    ...actual,
    createBooking: mockCreateBooking,
  };
});

import { useCreateAppointment } from '@/features/bookings/hooks/useBookingMutations';
import { bookingKeys } from '@/features/bookings/keys';
import { deliveryKeys } from '@/features/delivery/keys';
import { equipmentKeys } from '@/features/equipment/keys';
import { providerKeys } from '@/features/providers/keys';
import type { CreateBookingRequest, CreateBookingResponse } from '@/features/bookings/schema';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createQueryClient();

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  mockCreateBooking.mockReset();
});

describe('useCreateAppointment', () => {
  it('invalidates dashboard-relevant booking caches without invalidating quotes', async () => {
    const queryClient = createQueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined);
    const request = {
      providerId: 'provider-1',
      serviceItems: [{ serviceId: 'service-1', quantity: 1 }],
      startDate: '2026-04-18',
      endDate: '2026-04-18',
      dailyStartTime: '10:00',
      paymentMethod: 'card',
      address: {
        line1: 'Rue de Tunis',
        city: 'Tunis',
        postalCode: '1000',
      },
    } satisfies CreateBookingRequest;

    mockCreateBooking.mockResolvedValue({ id: 'booking-1' } as CreateBookingResponse);

    const { result } = renderHook(() => useCreateAppointment(), {
      wrapper: createQueryWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(request);
    });

    expect(mockCreateBooking).toHaveBeenCalledWith(request, { silentError: false });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: bookingKeys.lists() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: bookingKeys.details() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: bookingKeys.stats() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: bookingKeys.upcoming() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: bookingKeys.today() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: bookingKeys.providerDashboardToday(),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: bookingKeys.past() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: providerKeys.dashboard() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: deliveryKeys.requests() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: equipmentKeys.lists() });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: equipmentKeys.details() });
    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({ queryKey: bookingKeys.all });

    const invalidatedKeys = invalidateQueriesSpy.mock.calls.map(([arg]) => arg?.queryKey ?? null);
    expect(invalidatedKeys).not.toContainEqual(['bookings', 'quote', expect.anything()]);
  });
});
