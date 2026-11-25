import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import type { ProviderDetailResponse } from '@/features/providers/schema';
import { ProviderContactModal } from '@/features/providers/public/ProviderContactModal';
import { englishTranslations } from '@/i18n/translations/en';
import { renderWithProviders } from '@/test/renderWithProviders';

const {
  mockNavigate,
  mockUseAuth,
  mockUseConversationEntryStatus,
  mockUsePublicProvider,
  mockUseGetOrCreateConversation,
  mockShowErrorToast,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAuth: vi.fn(),
  mockUseConversationEntryStatus: vi.fn(),
  mockUsePublicProvider: vi.fn(),
  mockUseGetOrCreateConversation: vi.fn(),
  mockShowErrorToast: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/features/providers/hooks', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers/hooks')>('@/features/providers/hooks');

  return {
    ...actual,
    usePublicProvider: mockUsePublicProvider,
  };
});

vi.mock('@/features/messaging', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/messaging')>('@/features/messaging');

  return {
    ...actual,
    useConversationEntryStatus: mockUseConversationEntryStatus,
    useGetOrCreateConversation: mockUseGetOrCreateConversation,
  };
});

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
}));

const BASE_PROVIDER: ProviderDetailResponse = {
  id: 'provider-1',
  serviceCategory: 'nursing',
  nutritionProviderSubtype: null,
  isIndividual: true,
  businessName: 'Dr Fatma Ben Said',
  firstName: 'Fatma',
  lastName: 'Ben Said',
  bio: null,
  shortDescription: null,
  addressLine1: '10 Rue de Tunis',
  city: 'Tunis',
  countryCode: 'TN',
  ratingAverage: 4.8,
  ratingCount: 12,
  isVerified: true,
  isAvailable: true,
  availabilityStatus: 'available',
  profilePictureUrl: null,
  createdAt: '2026-04-15T08:00:00.000Z',
  minPrice: null,
  serviceCount: 3,
  specialties: ['Nursing'],
  yearsOfExperience: 10,
  phone: '+21612345678',
};

describe('ProviderContactModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePublicProvider.mockReturnValue({
      data: BASE_PROVIDER,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseConversationEntryStatus.mockReturnValue({
      data: null,
      loading: false,
      isFetching: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
    });
    mockUseGetOrCreateConversation.mockReturnValue({
      mutateAsync: vi.fn(),
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'patient-1', role: 'patient', name: 'Patient User', avatar: null },
    });
  });

  it('starts or reopens a conversation and navigates to the returned id', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue({ id: 'conversation-42' });
    mockUseGetOrCreateConversation.mockReturnValue({
      mutateAsync,
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    renderWithProviders(<ProviderContactModal providerId="provider-1" onClose={onClose} />, {
      locale: 'en-GB',
    });

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.messages.messageProvider }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({ providerId: 'provider-1' });
    expect(mockNavigate).toHaveBeenCalledWith('/messages/conversation-42');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not keep messaging blocked while a stale entry-status denial is refreshing', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue({ id: 'conversation-99' });

    mockUseConversationEntryStatus.mockReturnValue({
      data: {
        providerId: 'provider-1',
        existingConversationId: null,
        canOpenConversation: false,
        canCreateConversation: false,
        canSendMessage: false,
        messagingBlockedReason: 'no_active_reservation',
      },
      loading: false,
      isFetching: true,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
    });
    mockUseGetOrCreateConversation.mockReturnValue({
      mutateAsync,
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    renderWithProviders(<ProviderContactModal providerId="provider-1" onClose={onClose} />, {
      locale: 'en-GB',
    });

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.messages.messageProvider }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({ providerId: 'provider-1' });
    expect(mockNavigate).toHaveBeenCalledWith('/messages/conversation-99');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an action error and does not navigate when opening a conversation fails', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const error = new Error('Provider has disabled patient messages.');
    const mutateAsync = vi.fn().mockRejectedValue(error);
    mockUseGetOrCreateConversation.mockReturnValue({
      mutateAsync,
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    renderWithProviders(<ProviderContactModal providerId="provider-1" onClose={onClose} />, {
      locale: 'en-GB',
    });

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.messages.messageProvider }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({ providerId: 'provider-1' });
    expect(mockShowErrorToast).toHaveBeenCalledWith(
      error,
      englishTranslations.messages.messageEntryFailed,
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('hides the message action for unauthenticated users', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithProviders(<ProviderContactModal providerId="provider-1" onClose={vi.fn()} />, {
      locale: 'en-GB',
    });

    expect(await screen.findByText(BASE_PROVIDER.businessName ?? '')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: englishTranslations.messages.messageProvider }),
    ).not.toBeInTheDocument();
  });
});
