import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usersKeys } from '@/features/users/keys';
import { useUpdatePreferences } from '@/features/users/hooks/usePatientPreferences';
import * as usersService from '@/features/users/service';

import type { ReactNode } from 'react';
import type { PatientPreferencesResponse } from '@/features/family-circle/schema';

const BASE_PREFERENCES: PatientPreferencesResponse = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: false,
  marketingEmails: false,
  autoValidationEnabled: true,
  validationReminderHours: 24,
  shareWithFamily: false,
  allowProviderMessages: true,
  updatedAt: '2026-04-14T10:00:00Z',
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
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

describe('useUpdatePreferences', () => {
  it('optimistically merges a patient preference patch into the cached preferences', async () => {
    const queryClient = createQueryClient();
    const deferred = createDeferred<PatientPreferencesResponse | null>();

    vi.spyOn(usersService, 'updatePatientPreferences').mockReturnValueOnce(deferred.promise);
    queryClient.setQueryData(usersKeys.patientPreferences(), BASE_PREFERENCES);

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ pushNotifications: true });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(usersKeys.patientPreferences())).toEqual({
        ...BASE_PREFERENCES,
        pushNotifications: true,
      });
    });

    expect(
      queryClient.getQueryData<PatientPreferencesResponse>(usersKeys.patientPreferences()),
    ).toMatchObject({
      validationReminderHours: 24,
      updatedAt: '2026-04-14T10:00:00Z',
      allowProviderMessages: true,
    });

    deferred.resolve({
      ...BASE_PREFERENCES,
      pushNotifications: true,
      updatedAt: '2026-04-14T11:00:00Z',
    });

    await waitFor(() => {
      expect(usersService.updatePatientPreferences).toHaveBeenCalledWith({
        pushNotifications: true,
      });
    });
  });

  it('rolls back only the attempted optimistic patient preference change when the save fails', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const deferred = createDeferred<PatientPreferencesResponse | null>();
    const saveError = new Error('save failed');

    vi.spyOn(usersService, 'updatePatientPreferences').mockReturnValueOnce(deferred.promise);
    queryClient.setQueryData(usersKeys.patientPreferences(), BASE_PREFERENCES);

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let mutationPromise!: Promise<PatientPreferencesResponse | null>;
    act(() => {
      mutationPromise = result.current.mutateAsync({ marketingEmails: true });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(usersKeys.patientPreferences())).toEqual({
        ...BASE_PREFERENCES,
        marketingEmails: true,
      });
    });

    deferred.reject(saveError);

    await expect(mutationPromise).rejects.toThrow('save failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(usersKeys.patientPreferences())).toEqual(BASE_PREFERENCES);
    });

    expect(
      queryClient.getQueryData<PatientPreferencesResponse>(usersKeys.patientPreferences()),
    ).toMatchObject({
      validationReminderHours: 24,
      pushNotifications: false,
      shareWithFamily: false,
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: usersKeys.patientPreferences() });
    });
  });

  it('invalidates the patient preferences query after a successful mutation settles', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    vi.spyOn(usersService, 'updatePatientPreferences').mockResolvedValueOnce({
      ...BASE_PREFERENCES,
      shareWithFamily: true,
      updatedAt: '2026-04-14T11:15:00Z',
    });
    queryClient.setQueryData(usersKeys.patientPreferences(), BASE_PREFERENCES);

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({ shareWithFamily: true });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: usersKeys.patientPreferences() });
  });
  it('stays pending until the invalidate promise resolves after a successful save', async () => {
    const queryClient = createQueryClient();
    const invalidateDeferred = createDeferred<void>();
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockReturnValueOnce(invalidateDeferred.promise);

    vi.spyOn(usersService, 'updatePatientPreferences').mockResolvedValueOnce({
      ...BASE_PREFERENCES,
      shareWithFamily: true,
      updatedAt: '2026-04-14T11:20:00Z',
    });
    queryClient.setQueryData(usersKeys.patientPreferences(), BASE_PREFERENCES);

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    let mutationPromise!: Promise<PatientPreferencesResponse | null>;
    act(() => {
      mutationPromise = result.current.mutateAsync({ shareWithFamily: true });
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: usersKeys.patientPreferences() });
    });

    expect(result.current.isPending).toBe(true);

    invalidateDeferred.resolve(undefined);

    await expect(mutationPromise).resolves.toEqual({
      ...BASE_PREFERENCES,
      shareWithFamily: true,
      updatedAt: '2026-04-14T11:20:00Z',
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
