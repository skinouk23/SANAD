import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import { providerKeys } from '@/features/providers/keys';
import {
  useProviderPreferences,
  useUpdateProviderPreferences,
} from '@/features/providers/hooks/useProviderPreferences';
import { myProviderPreferencesOptions } from '@/features/providers/options';
import {
  getMyProviderPreferences,
  updateMyProviderPreferences,
} from '@/features/providers/preferences-service';
import {
  ProviderPreferencesResponseSchema,
  UpdateProviderPreferencesRequestSchema,
} from '@/features/providers/preferences-schema';

import type { ReactNode } from 'react';
import type { ProviderPreferencesResponse } from '@/features/providers/preferences-schema';

const VALID_PROVIDER_PREFERENCES_RESPONSE = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: false,
  allowPatientMessages: true,
  profileVisibility: 'public',
  updatedAt: '2026-04-13T10:00:00Z',
} as const;

function createQueryWrapper(queryClient?: QueryClient) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
      },
    });

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolver, rejecter) => {
    resolve = resolver;
    reject = rejecter;
  });

  return { promise, resolve, reject };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('providerPreferences contract', () => {
  it('matches the backend provider preferences dto shape', () => {
    const result = ProviderPreferencesResponseSchema.safeParse(VALID_PROVIDER_PREFERENCES_RESPONSE);

    expect(result.success).toBe(true);
  });

  it('allows nullable partial update fields for provider preferences', () => {
    const result = UpdateProviderPreferencesRequestSchema.safeParse({
      smsNotifications: null,
      allowPatientMessages: false,
      profileVisibility: null,
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed provider preferences responses', () => {
    const result = ProviderPreferencesResponseSchema.safeParse({
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      updatedAt: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });

  it('uses a dedicated provider preferences query key and options helper', () => {
    expect(providerKeys.myPreferences()).toEqual(['providers', 'myPreferences']);
    expect(myProviderPreferencesOptions().queryKey).toEqual(providerKeys.myPreferences());
  });

  it('fetches provider preferences from the correct endpoint with zod parsing', async () => {
    const apiGetSpy = vi
      .spyOn(api, 'get')
      .mockResolvedValueOnce(VALID_PROVIDER_PREFERENCES_RESPONSE);

    await expect(getMyProviderPreferences()).resolves.toEqual(
      ProviderPreferencesResponseSchema.parse(VALID_PROVIDER_PREFERENCES_RESPONSE),
    );
    expect(apiGetSpy).toHaveBeenCalledWith('/providers/me/preferences');
  });

  it('updates provider preferences via the correct endpoint with zod parsing', async () => {
    const updatedResponse = {
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      smsNotifications: true,
    };
    const apiPutSpy = vi.spyOn(api, 'put').mockResolvedValueOnce(updatedResponse);

    await expect(updateMyProviderPreferences({ smsNotifications: true })).resolves.toEqual(
      ProviderPreferencesResponseSchema.parse(updatedResponse),
    );
    expect(apiPutSpy).toHaveBeenCalledWith(
      '/providers/me/preferences',
      {
        smsNotifications: true,
      },
      expect.objectContaining({ _silentError: true }),
    );
  });

  it('rejects malformed provider preference payloads instead of accepting invalid contracts', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      profileVisibility: 42,
    } as unknown as ProviderPreferencesResponse);

    await expect(getMyProviderPreferences()).rejects.toThrow();
  });

  it('defaults the provider preferences hook to null while loading', async () => {
    const deferred = createDeferred<ProviderPreferencesResponse>();
    vi.spyOn(api, 'get').mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useProviderPreferences(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isInitialLoading).toBe(true);

    deferred.resolve(ProviderPreferencesResponseSchema.parse(VALID_PROVIDER_PREFERENCES_RESPONSE));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(VALID_PROVIDER_PREFERENCES_RESPONSE);
  });

  it('optimistically merges provider preference patches into the cache and invalidates after settle', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
      },
    });
    const cancelSpy = vi.spyOn(queryClient, 'cancelQueries');
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const deferred = createDeferred<ProviderPreferencesResponse>();

    queryClient.setQueryData(providerKeys.myPreferences(), VALID_PROVIDER_PREFERENCES_RESPONSE);
    vi.spyOn(api, 'put').mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useUpdateProviderPreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    const mutationPromise = result.current.mutateAsync({ smsNotifications: true });

    await waitFor(() => {
      expect(cancelSpy).toHaveBeenCalledWith({ queryKey: providerKeys.myPreferences() });
      expect(queryClient.getQueryData(providerKeys.myPreferences())).toEqual({
        ...VALID_PROVIDER_PREFERENCES_RESPONSE,
        smsNotifications: true,
      });
    });

    deferred.resolve({
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      smsNotifications: true,
      updatedAt: '2026-04-13T11:00:00Z',
    });

    await expect(mutationPromise).resolves.toEqual({
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      smsNotifications: true,
      updatedAt: '2026-04-13T11:00:00Z',
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: providerKeys.myPreferences() });
    });
  });

  it('rolls back optimistic provider preference patches on error and still invalidates after settle', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
      },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const deferred = createDeferred<ProviderPreferencesResponse>();
    const mutationError = new Error('Provider preferences update failed');

    queryClient.setQueryData(providerKeys.myPreferences(), VALID_PROVIDER_PREFERENCES_RESPONSE);
    vi.spyOn(api, 'put').mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useUpdateProviderPreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    const mutationPromise = result.current.mutateAsync({ smsNotifications: true });

    await waitFor(() => {
      expect(queryClient.getQueryData(providerKeys.myPreferences())).toEqual({
        ...VALID_PROVIDER_PREFERENCES_RESPONSE,
        smsNotifications: true,
      });
    });

    deferred.reject(mutationError);

    await expect(mutationPromise).rejects.toBe(mutationError);

    await waitFor(() => {
      expect(queryClient.getQueryData(providerKeys.myPreferences())).toEqual(
        VALID_PROVIDER_PREFERENCES_RESPONSE,
      );
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: providerKeys.myPreferences() });
    });
  });
  it('stays pending until provider preference invalidation completes', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
      },
    });
    const invalidateDeferred = createDeferred<void>();
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockReturnValueOnce(invalidateDeferred.promise);

    queryClient.setQueryData(providerKeys.myPreferences(), VALID_PROVIDER_PREFERENCES_RESPONSE);
    vi.spyOn(api, 'put').mockResolvedValueOnce({
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      smsNotifications: true,
      updatedAt: '2026-04-13T11:05:00Z',
    });

    const { result } = renderHook(() => useUpdateProviderPreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    const mutationPromise = result.current.mutateAsync({ smsNotifications: true });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: providerKeys.myPreferences() });
    });

    expect(result.current.isPending).toBe(true);

    invalidateDeferred.resolve(undefined);

    await expect(mutationPromise).resolves.toEqual({
      ...VALID_PROVIDER_PREFERENCES_RESPONSE,
      smsNotifications: true,
      updatedAt: '2026-04-13T11:05:00Z',
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
