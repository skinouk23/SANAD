import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AmbulanceServicePage } from '@/pages/services/AmbulanceServicePage';
import { CareServicePage } from '@/pages/services/CareServicePage';
import { FuneralServicesPage } from '@/pages/services/FuneralServicesPage';
import { VeterinaryPage } from '@/pages/services/VeterinaryPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { ProviderResponse } from '@/features/providers/schema';

const {
  mockUseAmbulanceProviders,
  mockUseCareProviders,
  mockUseFuneralServices,
  mockUseProviderFilterOptions,
  mockUseServiceCategories,
  mockUseVeterinaryProviders,
} = vi.hoisted(() => ({
  mockUseAmbulanceProviders: vi.fn(),
  mockUseCareProviders: vi.fn(),
  mockUseFuneralServices: vi.fn(),
  mockUseProviderFilterOptions: vi.fn(),
  mockUseServiceCategories: vi.fn(),
  mockUseVeterinaryProviders: vi.fn(),
}));

vi.mock('@/features/providers', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers')>('@/features/providers');

  return {
    ...actual,
    ProviderContactModal: ({
      providerId,
      onClose,
    }: {
      providerId: string | null;
      onClose: () => void;
    }) =>
      providerId ? (
        <div data-testid="provider-contact-modal">
          <span>{providerId}</span>
          <button type="button" onClick={onClose}>
            Fermer le contact
          </button>
        </div>
      ) : null,
    useAmbulanceProviders: mockUseAmbulanceProviders,
    useCareProviders: mockUseCareProviders,
    useFuneralServices: mockUseFuneralServices,
    useProviderFilterOptions: mockUseProviderFilterOptions,
    useVeterinaryProviders: mockUseVeterinaryProviders,
  };
});

vi.mock('@/features/services', async () => {
  const actual = await vi.importActual<typeof import('@/features/services')>('@/features/services');

  return {
    ...actual,
    useServiceCategories: mockUseServiceCategories,
  };
});

const BASE_PROVIDER: ProviderResponse = {
  id: '00000000-0000-0000-0000-000000000000',
  serviceCategory: 'doctor',
  nutritionProviderSubtype: null,
  isIndividual: false,
  businessName: 'Provider',
  firstName: null,
  lastName: null,
  bio: null,
  shortDescription: 'Prestataire publié.',
  addressLine1: '1 Rue Principale',
  city: 'Tunis',
  countryCode: 'TN',
  ratingAverage: 4.8,
  ratingCount: 12,
  isVerified: true,
  isAvailable: true,
  availabilityStatus: 'available',
  profilePictureUrl: null,
  createdAt: '2026-04-13T10:00:00Z',
  minPrice: 50,
  serviceCount: 2,
  specialties: [],
};

function createProvider(overrides: Partial<ProviderResponse>): ProviderResponse {
  return {
    ...BASE_PROVIDER,
    ...overrides,
  };
}

function createProvidersResult(providers: ProviderResponse[]) {
  return {
    providers,
    data: {
      items: providers,
      pagination: {
        page: 1,
        limit: 20,
        total: providers.length,
        totalPages: 1,
      },
    },
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    isRefreshing: false,
    isPlaceholderData: false,
  };
}

interface ProviderFilterOptionsTestData {
  cities: string[];
  specialties: string[];
  nutritionProviderSubtypes: string[];
}

function createFilterOptionsResult(overrides: Partial<ProviderFilterOptionsTestData> = {}) {
  const options: ProviderFilterOptionsTestData = {
    cities: [],
    specialties: [],
    nutritionProviderSubtypes: [],
    ...overrides,
  };

  return {
    data: options,
    cities: options.cities,
    specialties: options.specialties,
    nutritionProviderSubtypes: options.nutritionProviderSubtypes,
    loading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
}

function renderCareService() {
  return renderWithProviders(
    <Routes>
      <Route path="/care/:serviceId" element={<CareServicePage />} />
    </Routes>,
    { route: '/care/doctor' },
  );
}

describe('Service discovery honesty cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseProviderFilterOptions.mockReturnValue(createFilterOptionsResult());

    mockUseServiceCategories.mockReturnValue({
      allCategories: [
        {
          code: 'doctor',
          label: 'Médecins à domicile',
          description: 'Soins publiés selon le catalogue.',
          color: '#06b6d4,#3b82f6',
        },
      ],
    });
  });

  it('derives care zones and doctor specialities from the live provider list', async () => {
    mockUseProviderFilterOptions.mockReturnValue(
      createFilterOptionsResult({
        cities: ['Alpha City', 'Beta City'],
        specialties: ['Omega Care', 'Zeta Specialty'],
      }),
    );
    mockUseCareProviders.mockReturnValue(
      createProvidersResult([
        createProvider({
          id: 'care-alpha',
          businessName: 'Dr Alpha',
          city: 'Alpha City',
          specialties: ['Zeta Specialty'],
        }),
        createProvider({
          id: 'care-beta',
          businessName: 'Dr Beta',
          city: 'Beta City',
          specialties: ['Omega Care'],
        }),
      ]),
    );

    const { user } = renderCareService();

    const zoneCombobox = screen.getByRole('combobox', { name: 'Zone géographique' });
    fireEvent.keyDown(zoneCombobox, { key: 'ArrowDown' });
    const zoneOptions = (await screen.findAllByRole('option')).map((option) =>
      option.textContent?.trim(),
    );
    expect(zoneOptions).toHaveLength(3);
    expect(zoneOptions).toEqual(
      expect.arrayContaining(['Toutes les zones', 'Alpha City', 'Beta City']),
    );
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });

    await user.click(screen.getByRole('button', { name: 'Toutes les spécialités' }));
    await user.click(screen.getByRole('button', { name: 'Zeta Specialty' }));

    expect(screen.queryByRole('button', { name: 'Cardiologie' })).not.toBeInTheDocument();
    expect(screen.getByText('Dr Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Dr Beta')).not.toBeInTheDocument();
  });

  it('derives ambulance zones from the live provider list', async () => {
    mockUseProviderFilterOptions.mockReturnValue(
      createFilterOptionsResult({ cities: ['Gabes', 'Le Kef'] }),
    );
    mockUseAmbulanceProviders.mockReturnValue(
      createProvidersResult([
        createProvider({
          id: 'ambulance-gabes',
          businessName: 'Ambulance Gabes',
          serviceCategory: 'ambulance',
          city: 'Gabes',
        }),
        createProvider({
          id: 'ambulance-kef',
          businessName: 'Ambulance Le Kef',
          serviceCategory: 'ambulance',
          city: 'Le Kef',
        }),
      ]),
    );

    renderWithProviders(<AmbulanceServicePage />);

    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Zone géographique' }), {
      key: 'ArrowDown',
    });
    const zoneOptions = (await screen.findAllByRole('option')).map((option) =>
      option.textContent?.trim(),
    );
    expect(zoneOptions).toHaveLength(3);
    expect(zoneOptions).toEqual(expect.arrayContaining(['Toutes les zones', 'Gabes', 'Le Kef']));
  });

  it('keeps veterinary emergency contact disabled until a provider is explicitly selected', async () => {
    mockUseVeterinaryProviders.mockReturnValue(
      createProvidersResult([
        createProvider({
          id: 'vet-one',
          businessName: 'Clinique Vétérinaire One',
          serviceCategory: 'veterinary',
        }),
        createProvider({
          id: 'vet-two',
          businessName: 'Clinique Vétérinaire Two',
          serviceCategory: 'veterinary',
        }),
      ]),
    );

    const { user } = renderWithProviders(<VeterinaryPage />);

    const initialCallButtons = screen.getAllByRole('button', { name: 'Appeler' });
    const emergencyButton = initialCallButtons.at(-1);

    expect(emergencyButton).toBeDefined();
    expect(emergencyButton).toBeDisabled();

    await user.click(initialCallButtons[1]);
    expect(screen.getByTestId('provider-contact-modal')).toHaveTextContent('vet-two');

    await user.click(screen.getByRole('button', { name: 'Fermer le contact' }));

    const persistedEmergencyButton = screen.getAllByRole('button', { name: 'Appeler' }).at(-1);
    expect(persistedEmergencyButton).toBeDefined();
    expect(persistedEmergencyButton).toBeEnabled();

    await user.click(persistedEmergencyButton!);
    expect(screen.getByTestId('provider-contact-modal')).toHaveTextContent('vet-two');
  });

  it('keeps funeral direct assistance disabled until a provider is explicitly selected', async () => {
    mockUseFuneralServices.mockReturnValue(
      createProvidersResult([
        createProvider({
          id: 'funeral-one',
          businessName: 'Services Funéraires One',
          serviceCategory: 'funeral',
        }),
        createProvider({
          id: 'funeral-two',
          businessName: 'Services Funéraires Two',
          serviceCategory: 'funeral',
        }),
      ]),
    );

    const { user } = renderWithProviders(<FuneralServicesPage />);

    const initialCallButtons = screen.getAllByRole('button', { name: 'Appeler' });
    const directAssistanceButton = initialCallButtons.at(-1);

    expect(directAssistanceButton).toBeDefined();
    expect(directAssistanceButton).toBeDisabled();

    await user.click(initialCallButtons[1]);
    expect(screen.getByTestId('provider-contact-modal')).toHaveTextContent('funeral-two');

    await user.click(screen.getByRole('button', { name: 'Fermer le contact' }));

    const persistedDirectAssistanceButton = screen
      .getAllByRole('button', { name: 'Appeler' })
      .at(-1);
    expect(persistedDirectAssistanceButton).toBeDefined();
    expect(persistedDirectAssistanceButton).toBeEnabled();

    await user.click(persistedDirectAssistanceButton!);
    expect(screen.getByTestId('provider-contact-modal')).toHaveTextContent('funeral-two');
  });
});
