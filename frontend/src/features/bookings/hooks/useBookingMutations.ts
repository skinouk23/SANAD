/**
 * Booking Mutation Hooks (TanStack Query)
 *
 * Booking mutations. Cancel and Rate use optimistic updates with rollback.
 * Others invalidate related query views on success.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { bookingKeys } from '@/features/bookings/keys';
import { deliveryKeys } from '@/features/delivery/keys';
import { equipmentKeys } from '@/features/equipment/keys';
import { providerKeys } from '@/features/providers/keys';
import {
  createBooking,
  updateBooking,
  confirmBooking,
  declineBooking,
  cancelBooking,
  rateBookingSession,
  confirmBookingSession,
  startBookingSessionJourney,
  arriveBookingSession,
  startBookingSessionService,
  completeBookingSession,
  disputeBookingSession,
  cancelBookingSession,
  markBookingSessionNoShow,
} from '@/features/bookings/service';
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingListItemResponse,
  BookingSessionListItemResponse,
  CompleteBookingSessionRequest,
  DisputeBookingSessionRequest,
  CancelBookingSessionRequest,
  MarkBookingSessionNoShowRequest,
} from '@/features/bookings/schema';

interface UseCreateAppointmentOptions {
  silentError?: boolean;
}

interface CacheIdentity {
  bookingId?: string | null;
  itemId?: string | null;
  sessionId?: string | null;
}

interface IdentifiableProjection {
  id?: string | null;
  bookingId?: string | null;
  sessionId?: string | null;
  activeSessionId?: string | null;
  nextSessionId?: string | null;
}

type QuerySnapshot = [QueryKey, unknown | undefined];

function invalidateBookingViews(qc: QueryClient, appointmentId?: string) {
  void qc.invalidateQueries({ queryKey: bookingKeys.lists() });
  void qc.invalidateQueries({ queryKey: bookingKeys.details() });
  void qc.invalidateQueries({ queryKey: bookingKeys.stats() });
  void qc.invalidateQueries({ queryKey: bookingKeys.upcoming() });
  void qc.invalidateQueries({ queryKey: bookingKeys.upcomingSessions() });
  void qc.invalidateQueries({ queryKey: bookingKeys.today() });
  void qc.invalidateQueries({ queryKey: bookingKeys.lists() });
  void qc.invalidateQueries({ queryKey: bookingKeys.providerDashboardToday() });
  void qc.invalidateQueries({ queryKey: bookingKeys.past() });
  void qc.invalidateQueries({ queryKey: bookingKeys.pastSessions() });
  void qc.invalidateQueries({ queryKey: providerKeys.dashboard() });
  void qc.invalidateQueries({ queryKey: providerKeys.myPlanningRoot() });
  void qc.invalidateQueries({ queryKey: deliveryKeys.requests() });

  if (appointmentId) {
    void qc.invalidateQueries({ queryKey: bookingKeys.detail(appointmentId) });
    void qc.invalidateQueries({ queryKey: deliveryKeys.request(appointmentId) });
  }
}

function invalidateBookingSessionViews(qc: QueryClient, sessionId?: string, bookingId?: string) {
  void qc.invalidateQueries({ queryKey: bookingKeys.upcomingSessions() });
  void qc.invalidateQueries({ queryKey: bookingKeys.pastSessions() });
  void qc.invalidateQueries({ queryKey: bookingKeys.providerDashboardToday() });
  void qc.invalidateQueries({ queryKey: bookingKeys.sessionLists() });
  void qc.invalidateQueries({ queryKey: bookingKeys.today() });
  void qc.invalidateQueries({ queryKey: providerKeys.dashboard() });
  void qc.invalidateQueries({ queryKey: providerKeys.myPlanningRoot() });

  if (sessionId) {
    void qc.invalidateQueries({ queryKey: bookingKeys.sessionDetail(sessionId) });
    void qc.invalidateQueries({ queryKey: bookingKeys.providerSessionDelivery(sessionId) });
    void qc.invalidateQueries({ queryKey: deliveryKeys.request(sessionId) });
  }

  if (bookingId) {
    void qc.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
  }
}

function projectionMatches(item: IdentifiableProjection, identity: CacheIdentity): boolean {
  return (
    (Boolean(identity.itemId) && item.id === identity.itemId) ||
    (Boolean(identity.bookingId) && item.bookingId === identity.bookingId) ||
    (Boolean(identity.sessionId) &&
      [item.sessionId, item.activeSessionId, item.nextSessionId].some(
        (value) => value === identity.sessionId,
      ))
  );
}

function projectionHasIdentityFields(value: unknown): value is IdentifiableProjection {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'id' in value ||
    'bookingId' in value ||
    'sessionId' in value ||
    'activeSessionId' in value ||
    'nextSessionId' in value
  );
}

function patchProjectionData<TItem extends IdentifiableProjection>(
  data: unknown,
  identity: CacheIdentity,
  patchItem: (item: TItem) => TItem,
): unknown {
  if (Array.isArray(data)) {
    return data.map((item) =>
      projectionHasIdentityFields(item) && projectionMatches(item, identity)
        ? patchItem(item as TItem)
        : item,
    );
  }

  if (typeof data === 'object' && data !== null && 'items' in data) {
    const items = (data as { items?: unknown }).items;

    if (Array.isArray(items)) {
      return {
        ...data,
        items: items.map((item) =>
          projectionHasIdentityFields(item) && projectionMatches(item, identity)
            ? patchItem(item as TItem)
            : item,
        ),
      };
    }
  }

  return data;
}

function snapshotBookingProjectionQueries(qc: QueryClient): QuerySnapshot[] {
  const snapshots = [
    ...qc.getQueriesData<unknown>({ queryKey: bookingKeys.lists() }),
    ...qc.getQueriesData<unknown>({ queryKey: bookingKeys.upcoming(), exact: true }),
    ...qc.getQueriesData<unknown>({ queryKey: bookingKeys.past(), exact: true }),
    ...qc.getQueriesData<unknown>({ queryKey: bookingKeys.upcomingSessions(), exact: true }),
    ...qc.getQueriesData<unknown>({ queryKey: bookingKeys.pastSessions(), exact: true }),
    ...qc.getQueriesData<unknown>({ queryKey: bookingKeys.sessionLists() }),
  ];
  const uniqueSnapshots = new Map<string, QuerySnapshot>();

  for (const snapshot of snapshots) {
    uniqueSnapshots.set(JSON.stringify(snapshot[0]), snapshot);
  }

  return Array.from(uniqueSnapshots.values());
}

async function cancelBookingProjectionQueries(qc: QueryClient): Promise<void> {
  await Promise.all([
    qc.cancelQueries({ queryKey: bookingKeys.lists() }),
    qc.cancelQueries({ queryKey: bookingKeys.upcoming(), exact: true }),
    qc.cancelQueries({ queryKey: bookingKeys.past(), exact: true }),
    qc.cancelQueries({ queryKey: bookingKeys.upcomingSessions(), exact: true }),
    qc.cancelQueries({ queryKey: bookingKeys.pastSessions(), exact: true }),
    qc.cancelQueries({ queryKey: bookingKeys.sessionLists() }),
  ]);
}

function restoreQuerySnapshots(qc: QueryClient, snapshots?: QuerySnapshot[]): void {
  if (!snapshots) {
    return;
  }

  for (const [key, data] of snapshots) {
    qc.setQueryData(key, data);
  }
}

function patchBookingProjections(
  qc: QueryClient,
  identity: CacheIdentity,
  patchItem: (item: BookingListItemResponse) => BookingListItemResponse,
): void {
  qc.setQueriesData<unknown>({ queryKey: bookingKeys.lists() }, (old: unknown) =>
    patchProjectionData<BookingListItemResponse>(old, identity, patchItem),
  );
  qc.setQueriesData<unknown>({ queryKey: bookingKeys.upcoming(), exact: true }, (old: unknown) =>
    patchProjectionData<BookingListItemResponse>(old, identity, patchItem),
  );
  qc.setQueriesData<unknown>({ queryKey: bookingKeys.past(), exact: true }, (old: unknown) =>
    patchProjectionData<BookingListItemResponse>(old, identity, patchItem),
  );
}

function patchBookingSessionProjections(
  qc: QueryClient,
  identity: CacheIdentity,
  patchItem: (item: BookingSessionListItemResponse) => BookingSessionListItemResponse,
): void {
  qc.setQueriesData<unknown>(
    { queryKey: bookingKeys.upcomingSessions(), exact: true },
    (old: unknown) => patchProjectionData<BookingSessionListItemResponse>(old, identity, patchItem),
  );
  qc.setQueriesData<unknown>(
    { queryKey: bookingKeys.pastSessions(), exact: true },
    (old: unknown) => patchProjectionData<BookingSessionListItemResponse>(old, identity, patchItem),
  );
  qc.setQueriesData<unknown>({ queryKey: bookingKeys.sessionLists() }, (old: unknown) =>
    patchProjectionData<BookingSessionListItemResponse>(old, identity, patchItem),
  );
}

// ============================================
// SIMPLE MUTATIONS (invalidate on success)
// ============================================

export function useCreateAppointment(options?: UseCreateAppointmentOptions) {
  const qc = useQueryClient();
  const silentError = options?.silentError ?? false;

  const mutation = useMutation({
    mutationKey: ['createBooking', silentError ? 'silent' : 'default'],
    mutationFn: (data: CreateBookingRequest) => createBooking(data, { silentError }),
    onSuccess: () => {
      invalidateBookingViews(qc);
      // Equipment bookings decrement stock server-side; refresh equipment caches
      void qc.invalidateQueries({ queryKey: equipmentKeys.lists() });
      void qc.invalidateQueries({ queryKey: equipmentKeys.details() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) =>
      updateBooking(id, data),
    onSuccess: (_data, variables) => {
      invalidateBookingViews(qc, variables.id);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useConfirmAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (appointmentId: string) => confirmBooking(appointmentId),
    onSuccess: (_data, appointmentId) => {
      invalidateBookingViews(qc, appointmentId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useDeclineAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => declineBooking(id, reason),
    onSuccess: (_data, variables) => {
      invalidateBookingViews(qc, variables.id);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useConfirmBookingSession() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (sessionId: string) => confirmBookingSession(sessionId),
    onSuccess: (response, sessionId) => {
      invalidateBookingSessionViews(qc, sessionId, response.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useStartBookingSessionJourney() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (sessionId: string) => startBookingSessionJourney(sessionId),
    onSuccess: (data, sessionId) => {
      invalidateBookingSessionViews(qc, sessionId, data.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useArriveBookingSession() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (sessionId: string) => arriveBookingSession(sessionId),
    onSuccess: (data, sessionId) => {
      invalidateBookingSessionViews(qc, sessionId, data.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useStartBookingSessionService() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (sessionId: string) => startBookingSessionService(sessionId),
    onSuccess: (data, sessionId) => {
      invalidateBookingSessionViews(qc, sessionId, data.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useCompleteBookingSession() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: CompleteBookingSessionRequest }) =>
      completeBookingSession(sessionId, data),
    onSuccess: (response, variables) => {
      invalidateBookingSessionViews(qc, variables.sessionId, response.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useDisputeBookingSession() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: DisputeBookingSessionRequest }) =>
      disputeBookingSession(sessionId, data),
    onSuccess: (response, variables) => {
      invalidateBookingSessionViews(qc, variables.sessionId, response.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useCancelBookingSession() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data?: CancelBookingSessionRequest }) =>
      cancelBookingSession(sessionId, data),
    onMutate: async (variables) => {
      await cancelBookingProjectionQueries(qc);

      const previousProjections = snapshotBookingProjectionQueries(qc);
      const identity = { itemId: variables.sessionId, sessionId: variables.sessionId };

      patchBookingProjections(qc, identity, (item) => ({ ...item, status: 'Cancelled' }));
      patchBookingSessionProjections(qc, identity, (item) => ({ ...item, status: 'Cancelled' }));

      return { previousProjections };
    },
    onError: (_error, _variables, context) => {
      restoreQuerySnapshots(qc, context?.previousProjections);
    },
    onSuccess: (response, variables) => {
      const sessionId = response.sessionId ?? variables.sessionId;
      const identity = {
        itemId: sessionId,
        sessionId,
      };

      patchBookingProjections(qc, identity, (item) => ({
        ...item,
        status: response.status ?? item.status,
        cancelledAt: response.cancelledAt ?? item.cancelledAt,
        cancelledBy: response.cancelledBy ?? item.cancelledBy,
        cancellationReason: response.cancellationReason ?? item.cancellationReason,
      }));
      patchBookingSessionProjections(qc, identity, (item) => ({
        ...item,
        status: response.status ?? item.status,
        bookingStatus: response.bookingStatus ?? item.bookingStatus,
        parentStatus: response.parentStatus ?? item.parentStatus,
        cancelledAt: response.cancelledAt ?? item.cancelledAt,
        cancelledBy: response.cancelledBy ?? item.cancelledBy,
        cancellationReason: response.cancellationReason ?? item.cancellationReason,
      }));
      invalidateBookingSessionViews(qc, variables.sessionId, response.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useMarkBookingSessionNoShow() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data?: MarkBookingSessionNoShowRequest;
    }) => markBookingSessionNoShow(sessionId, data),
    onSuccess: (response, variables) => {
      invalidateBookingSessionViews(qc, variables.sessionId, response.bookingId);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// OPTIMISTIC MUTATIONS (cancel & rate)
// ============================================

export function useCancelAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBooking(id, reason),

    onMutate: async ({ id }) => {
      await cancelBookingProjectionQueries(qc);

      const previousProjections = snapshotBookingProjectionQueries(qc);
      const identity = { bookingId: id, itemId: id };

      patchBookingProjections(qc, identity, (item) => ({ ...item, status: 'Cancelled' }));
      patchBookingSessionProjections(qc, identity, (item) => ({ ...item, status: 'Cancelled' }));

      return { previousProjections };
    },

    onError: (_err, _vars, context) => {
      restoreQuerySnapshots(qc, context?.previousProjections);
    },

    onSuccess: (response, variables) => {
      const identity = { bookingId: variables.id, itemId: response.id };

      patchBookingProjections(qc, identity, (item) => ({
        ...item,
        status: response.status ?? item.status,
        cancelledAt: response.cancelledAt ?? item.cancelledAt,
        cancelledBy: response.cancelledBy ?? item.cancelledBy,
        cancellationReason: response.cancellationReason ?? item.cancellationReason,
      }));
      patchBookingSessionProjections(qc, identity, (item) => ({
        ...item,
        bookingStatus: response.status ?? item.bookingStatus,
        parentStatus: response.status ?? item.parentStatus,
        cancelledAt: response.cancelledAt ?? item.cancelledAt,
        cancelledBy: response.cancelledBy ?? item.cancelledBy,
        cancellationReason: response.cancellationReason ?? item.cancellationReason,
      }));
    },

    onSettled: (_data, _error, variables) => {
      invalidateBookingViews(qc, variables.id);
      // Cancellation restores equipment stock; refresh equipment caches
      void qc.invalidateQueries({ queryKey: equipmentKeys.lists() });
      void qc.invalidateQueries({ queryKey: equipmentKeys.details() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

export function useRateAppointment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      sessionId,
      rating,
      review,
    }: {
      sessionId: string;
      rating: number;
      review?: string;
    }) => rateBookingSession(sessionId, { rating, comment: review }),

    onMutate: async ({ sessionId, rating, review }) => {
      await cancelBookingProjectionQueries(qc);

      const previousProjections = snapshotBookingProjectionQueries(qc);
      const identity = { itemId: sessionId, sessionId };
      const reviewComment = review?.trim() || null;

      patchBookingSessionProjections(qc, identity, (item) => ({
        ...item,
        rating,
        reviewComment: reviewComment ?? item.reviewComment,
      }));

      return { previousProjections };
    },

    onError: (_err, _vars, context) => {
      restoreQuerySnapshots(qc, context?.previousProjections);
    },

    onSuccess: (response, variables) => {
      const identity = {
        itemId: response.bookingSessionId,
        sessionId: response.bookingSessionId,
      };
      const reviewComment = response.comment ?? variables.review?.trim() ?? null;

      patchBookingSessionProjections(qc, identity, (item) => ({
        ...item,
        rating: response.rating,
        reviewComment: reviewComment ?? item.reviewComment,
      }));
    },

    onSettled: (response, _error, variables) => {
      invalidateBookingSessionViews(
        qc,
        response?.bookingSessionId ?? variables.sessionId,
        response?.bookingId,
      );
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
