/**
 * Provider Hooks
 * Custom React hooks for provider data fetching and management
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { providersService } from '../services/providers.service';
import type {
  Provider,
  ProviderFilters,
  ServiceType,
  PaginatedResponse } from
'../types';

/**
 * Hook state interface
 */
interface UseProvidersState {
  data: Provider[];
  loading: boolean;
  error: Error | null;
}

/**
 * Paginated hook state interface
 */
interface UsePaginatedProvidersState {
  data: Provider[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching providers with filters
 */
export function useProviders(filters?: ProviderFilters) {
  const [state, setState] = useState<UseProvidersState>({
    data: [],
    loading: true,
    error: null
  });

  const fetchProviders = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const providers = await providersService.getAll(filters);
      setState({ data: providers, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch providers')
      }));
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    ...state,
    refetch: fetchProviders
  };
}

/**
 * Hook for fetching paginated providers
 */
export function usePaginatedProviders(initialFilters?: ProviderFilters) {
  const [filters, setFilters] = useState<ProviderFilters>(
    initialFilters || { page: 1, limit: 10 }
  );
  const [state, setState] = useState<UsePaginatedProvidersState>({
    data: [],
    pagination: null,
    loading: true,
    error: null
  });

  const fetchProviders = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await providersService.getPaginated(filters);
      setState({
        data: response.items,
        pagination: response.pagination,
        loading: false,
        error: null
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch providers')
      }));
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    if (state.pagination?.hasNext) {
      setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [state.pagination?.hasNext]);

  const prevPage = useCallback(() => {
    if (state.pagination?.hasPrev) {
      setFilters((prev) => ({
        ...prev,
        page: Math.max(1, (prev.page || 1) - 1)
      }));
    }
  }, [state.pagination?.hasPrev]);

  const updateFilters = useCallback((newFilters: Partial<ProviderFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
  }, []);

  return {
    ...state,
    filters,
    setFilters: updateFilters,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchProviders
  };
}

/**
 * Hook for fetching a single provider by ID
 */
export function useProvider(providerId: string | undefined) {
  const [state, setState] = useState<{
    data: Provider | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: !!providerId,
    error: null
  });

  const fetchProvider = useCallback(async () => {
    if (!providerId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const provider = await providersService.getById(providerId);
      setState({ data: provider, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch provider')
      });
    }
  }, [providerId]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  return {
    ...state,
    refetch: fetchProvider
  };
}

/**
 * Hook for fetching providers by service type
 */
export function useProvidersByServiceType(
serviceType: ServiceType | undefined)
{
  const [state, setState] = useState<UseProvidersState>({
    data: [],
    loading: !!serviceType,
    error: null
  });

  const fetchProviders = useCallback(async () => {
    if (!serviceType) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const providers = await providersService.getByServiceType(serviceType);
      setState({ data: providers, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch providers')
      }));
    }
  }, [serviceType]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    ...state,
    refetch: fetchProviders
  };
}

/**
 * Hook for fetching ambulance providers
 */
export function useAmbulanceProviders(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'ambulance' });
}

/**
 * Hook for fetching laboratory providers
 */
export function useLaboratories(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'laboratory' });
}

/**
 * Hook for fetching radiology centers
 */
export function useRadiologyCenters(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'radiology' });
}

/**
 * Hook for fetching pharmacies
 */
export function usePharmacies(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'pharmacy' });
}

/**
 * Hook for fetching nutrition providers
 */
export function useNutritionProviders(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'nutrition' });
}

/**
 * Hook for fetching funeral services
 */
export function useFuneralServices(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'funeral' });
}

/**
 * Hook for fetching veterinary providers
 */
export function useVeterinaryProviders(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'veterinary' });
}

/**
 * Hook for fetching gyms
 */
export function useGyms(filters?: ProviderFilters) {
  return useProviders({ ...filters, serviceType: 'gym' });
}

/**
 * Hook for fetching care providers
 */
export function useCareProviders(
serviceType: ServiceType | undefined,
filters?: ProviderFilters)
{
  return useProviders({ ...filters, serviceType });
}

/**
 * Hook for searching providers
 */
export function useProviderSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [state, setState] = useState<UseProvidersState>({
    data: [],
    loading: false,
    error: null
  });

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchProviders = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const providers = await providersService.search(debouncedQuery);
      setState({ data: providers, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Search failed')
      }));
    }
  }, [debouncedQuery]);

  useEffect(() => {
    searchProviders();
  }, [searchProviders]);

  return {
    ...state,
    query,
    setQuery,
    refetch: searchProviders
  };
}

/**
 * Hook for fetching available providers
 */
export function useAvailableProviders(serviceType: ServiceType | undefined) {
  const [state, setState] = useState<UseProvidersState>({
    data: [],
    loading: !!serviceType,
    error: null
  });

  const fetchProviders = useCallback(async () => {
    if (!serviceType) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const providers = await providersService.getAvailable(serviceType);
      setState({ data: providers, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch available providers')
      }));
    }
  }, [serviceType]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    ...state,
    refetch: fetchProviders
  };
}

/**
 * Hook for fetching top-rated providers
 */
export function useTopRatedProviders(limit: number = 5) {
  const [state, setState] = useState<UseProvidersState>({
    data: [],
    loading: true,
    error: null
  });

  const fetchProviders = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const providers = await providersService.getTopRated(limit);
      setState({ data: providers, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch top-rated providers')
      }));
    }
  }, [limit]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    ...state,
    refetch: fetchProviders
  };
}

/**
 * Hook for managing provider availability toggle
 */
export function useProviderAvailability(
providerId: string,
initialAvailable: boolean = true)
{
  const [available, setAvailable] = useState(initialAvailable);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const updatedProvider = await providersService.updateAvailability(
        providerId,
        !available
      );
      if (updatedProvider) {
        setAvailable(updatedProvider.available);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to update availability')
      );
      // Optimistic update rollback is handled by not changing state on error
    } finally {
      setLoading(false);
    }
  }, [providerId, available]);

  const setAvailabilityStatus = useCallback(
    async (newStatus: boolean) => {
      if (newStatus === available) return;

      setLoading(true);
      setError(null);

      try {
        const updatedProvider = await providersService.updateAvailability(
          providerId,
          newStatus
        );
        if (updatedProvider) {
          setAvailable(updatedProvider.available);
        }
      } catch (err) {
        setError(
          err instanceof Error ?
          err :
          new Error('Failed to update availability')
        );
      } finally {
        setLoading(false);
      }
    },
    [providerId, available]
  );

  return {
    available,
    loading,
    error,
    toggleAvailability,
    setAvailability: setAvailabilityStatus
  };
}

/**
 * Hook for fetching provider schedule
 */
export function useProviderSchedule(
providerId: string | undefined,
startDate: string,
endDate: string)
{
  const [state, setState] = useState<{
    data: any[];
    loading: boolean;
    error: Error | null;
  }>({
    data: [],
    loading: !!providerId,
    error: null
  });

  const fetchSchedule = useCallback(async () => {
    if (!providerId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const schedule = await providersService.getSchedule(
        providerId,
        startDate,
        endDate
      );
      setState({ data: schedule, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error:
        error instanceof Error ?
        error :
        new Error('Failed to fetch schedule')
      });
    }
  }, [providerId, startDate, endDate]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Memoize available slots
  const availableSlots = useMemo(() => {
    return state.data.filter((slot) => slot.available);
  }, [state.data]);

  return {
    ...state,
    availableSlots,
    refetch: fetchSchedule
  };
}