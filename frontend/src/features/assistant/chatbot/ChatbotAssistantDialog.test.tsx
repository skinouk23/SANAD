import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChatbotAssistantPanel } from '@/features/assistant/chatbot/ChatbotAssistantDialog';
import { englishTranslations } from '@/i18n/translations/en';
import { renderWithProviders } from '@/test/renderWithProviders';

const { mockNavigate, mockUseAuth, mockLogout } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAuth: vi.fn(),
  mockLogout: vi.fn(),
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

async function resolveAssistantStep() {
  await act(async () => {
    vi.advanceTimersByTime(800);
  });
}

describe('ChatbotAssistantPanel role-aware account shortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'patient-1',
        role: 'patient',
        backendRole: 'patient',
        name: 'Patient User',
        avatar: null,
      },
      logout: mockLogout,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('routes patient account shortcuts to patient destinations', async () => {
    renderWithProviders(<ChatbotAssistantPanel />, {
      locale: 'en-GB',
    });

    await resolveAssistantStep();
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(englishTranslations.chatbot.myAccount, 'i') }),
    );
    await resolveAssistantStep();
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(englishTranslations.chatbot.myProfile, 'i') }),
    );
    await resolveAssistantStep();

    expect(mockNavigate).toHaveBeenCalledWith('/patient/profile');
  });

  it('removes role-dependent account shortcuts for authenticated users without a supported runtime role', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'unknown-1',
        role: 'unknown',
        backendRole: 'unknown',
        name: 'Unknown User',
        avatar: null,
      },
      logout: mockLogout,
    });

    renderWithProviders(<ChatbotAssistantPanel />, {
      locale: 'en-GB',
    });

    await resolveAssistantStep();
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(englishTranslations.chatbot.myAccount, 'i') }),
    );
    await resolveAssistantStep();

    expect(
      screen.queryByRole('button', {
        name: new RegExp(englishTranslations.chatbot.myProfile, 'i'),
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: new RegExp(englishTranslations.chatbot.myAppointments, 'i'),
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: new RegExp(englishTranslations.chatbot.messagesOption, 'i'),
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: new RegExp(englishTranslations.chatbot.signOut, 'i') }),
    ).toBeInTheDocument();
  });
});
