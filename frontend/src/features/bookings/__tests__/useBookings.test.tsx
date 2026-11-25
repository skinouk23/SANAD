import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetTodayBookings, mockGetProviderDashboardTodayBookings } = vi.hoisted(() => ({
  mockGetTodayBookings: vi.fn(),
  mockGetProviderDashboardTodayBookings: vi.fn(),
}));

vi.mock('@/features/bookings/service', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings/service')>(
    '@/features/bookings/service',
  );

  return {
    ...actual,
    getTodayBookings: mockGetTodayBookings,
    getProviderDashboardTodayBookings: mockGetProviderDashboardTodayBookings,
  };
});

import {
  useProviderDashboardTodayBookings,
  useTodayAppointments,
} from '@/features/bookings/hooks/useBookings';

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
  mockGetTodayBookings.mockReset();
  mockGetProviderDashboardTodayBookings.mockReset();
});

beforeEach(() => {
  mockGetTodayBookings.mockResolvedValue([]);
  mockGetProviderDashboardTodayBookings.mockResolvedValue([]);
});

describe('useTodayAppointments', () => {
  it('exposes initialLoadError when the first fetch fails', async () => {
    mockGetTodayBookings.mockRejectedValueOnce(new Error('appointments unavailable'));

    const { result } = renderHook(() => useTodayAppointments(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.initialLoadError).toBeInstanceOf(Error);
    });
    expect(result.current.data).toEqual([]);
  });

  it('keeps initialLoadError null when a later refetch fails after an empty successful load', async () => {
    mockGetTodayBookings
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce(new Error('refetch failed'));

    const { result } = renderHook(() => useTodayAppointments(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
    expect(result.current.initialLoadError).toBeNull();

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
      expect(result.current.initialLoadError).toBeNull();
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });
});

describe('useProviderDashboardTodayBookings', () => {
  it('uses the dedicated provider dashboard today bookings endpoint', async () => {
    mockGetProviderDashboardTodayBookings.mockResolvedValueOnce([]);

    renderHook(() => useProviderDashboardTodayBookings(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(mockGetProviderDashboardTodayBookings).toHaveBeenCalledTimes(1);
    });
    expect(mockGetTodayBookings).not.toHaveBeenCalled();
  });

  it('exposes initialLoadError when the dedicated endpoint fails on first load', async () => {
    mockGetProviderDashboardTodayBookings.mockRejectedValueOnce(
      new Error('dashboard bookings unavailable'),
    );

    const { result } = renderHook(() => useProviderDashboardTodayBookings(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.initialLoadError).toBeInstanceOf(Error);
    });
    expect(result.current.data).toEqual([]);
  });
});
