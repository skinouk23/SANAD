
# Application Refactoring & API Integration Plan

## Executive Summary

This document outlines the comprehensive plan to refactor the Care@Home Tunisia healthcare platform and integrate real APIs with fallback mechanisms.

---

## Phase 1: Code Refactoring

### 1.1 New Folder Structure

```
src/
├── api/                          # API client and configuration
│   ├── client.ts                 # Axios instance with interceptors
│   ├── config.ts                 # API configuration
│   └── interceptors.ts           # Request/response interceptors
│
├── services/                     # Domain-specific API services
│   ├── auth.service.ts
│   ├── providers.service.ts
│   ├── equipment.service.ts
│   ├── appointments.service.ts
│   ├── services.service.ts
│   └── index.ts
│
├── types/                        # TypeScript interfaces
│   ├── user.types.ts
│   ├── provider.types.ts
│   ├── equipment.types.ts
│   ├── appointment.types.ts
│   ├── service.types.ts
│   ├── api.types.ts
│   └── index.ts
│
├── hooks/                        # Custom React hooks
│   ├── useApi.ts
│   ├── useCountry.ts
│   ├── useCurrency.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── index.ts
│
├── utils/                        # Utility functions
│   ├── currency.ts
│   ├── date.ts
│   ├── validation.ts
│   ├── storage.ts
│   └── index.ts
│
├── constants/                    # Application constants
│   ├── countries.ts
│   ├── services.ts
│   ├── routes.ts
│   └── index.ts
│
├── data/                         # Fallback/mock data
│   ├── providers.data.ts
│   ├── equipment.data.ts
│   ├── services.data.ts
│   ├── appointments.data.ts
│   └── index.ts
│
├── i18n/                         # Internationalization
│   ├── locales/
│   │   ├── ar-TN.json
│   │   ├── en-GB.json
│   │   ├── fr-FR.json
│   │   ├── de-DE.json
│   │   └── nl-NL.json
│   ├── config.ts
│   └── index.ts
│
├── config/                       # Application configuration
│   ├── env.ts                    # Environment variables
│   ├── queryClient.ts            # React Query configuration
│   └── index.ts
│
├── components/                   # (existing - reorganize)
├── contexts/                     # (existing - refactor)
├── pages/                        # (existing - add lazy loading)
└── docs/                         # Documentation
    └── apis/                     # API documentation
```

### 1.2 TypeScript Types to Create

```typescript
// types/user.types.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'provider' | 'admin';
  phone?: string;
  avatar?: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}

// types/provider.types.ts
interface Provider {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  specialties: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  available: boolean;
  location: Location;
  pricing: PricingTier[];
  subscriptionPlan: 'commission' | 'standard' | 'elite';
  status: 'active' | 'pending' | 'suspended';
  countryCode: string;
}

// types/equipment.types.ts
interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  deposit: number;
  available: boolean;
  providerId: string;
  providerName: string;
  location: Location;
  specifications: Specification[];
  features: string[];
  imageUrl: string;
  countryCode: string;
}

// types/appointment.types.ts
interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  serviceType: ServiceType;
  subService?: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location: Location;
  price: number;
  currency: string;
  notes?: string;
  countryCode: string;
}

// types/api.types.ts
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  pagination?: Pagination;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}
```

### 1.3 Route Lazy Loading

```typescript
// App.tsx - Refactored with lazy loading
import { lazy, Suspense } from 'react';
import { routeConfig } from './config/routes';

// Lazy load all page components
const CyberLandingPage = lazy(() => import('./pages/CyberLandingPage'));
const CyberServiceSelection = lazy(() => import('./pages/CyberServiceSelection'));
const CyberPatientDashboard = lazy(() => import('./pages/CyberPatientDashboard'));
// ... etc

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);
```

### 1.4 Custom Hooks

```typescript
// hooks/useApi.ts
export function useApi<T>(
  fetcher: () => Promise<T>,
  fallbackData: T,
  options?: UseApiOptions
) {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetcher();
        setData(result);
      } catch (err) {
        console.warn('API failed, using fallback:', err);
        setData(fallbackData);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error, refetch };
}

// hooks/useCurrency.ts
export function useCurrency() {
  const { countryCode } = useCountry();
  
  const formatCurrency = (amount: number): string => {
    const currency = getCurrencyByCountry(countryCode);
    return new Intl.NumberFormat(getLocale(countryCode), {
      style: 'currency',
      currency: currency.code,
    }).format(amount);
  };

  return { formatCurrency, currency: getCurrencyByCountry(countryCode) };
}
```

---

## Phase 2: API Integration

### 2.1 Environment Configuration

```typescript
// config/env.ts
export const env = {
  COUNTRY_CODE: import.meta.env.VITE_COUNTRY_CODE || 'TN',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.careathome.tn',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
};

// .env file
VITE_COUNTRY_CODE=TN
VITE_API_BASE_URL=https://api.careathome.tn
VITE_API_TIMEOUT=10000
VITE_ENABLE_MOCK_DATA=false
```

### 2.2 API Client

```typescript
// api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '../config/env';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Country-Code': env.COUNTRY_CODE,
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Country-Code'] = env.COUNTRY_CODE;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    
    if (!config || config._retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount = config._retryCount || 0;

    if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
      config._retryCount += 1;
      const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);
```

### 2.3 Service Layer Pattern

```typescript
// services/providers.service.ts
import { apiClient } from '../api/client';
import { Provider } from '../types';
import { providersData } from '../data/providers.data';
import { env } from '../config/env';

export const providersService = {
  async getAll(filters?: ProviderFilters): Promise<Provider[]> {
    try {
      const response = await apiClient.get('/providers', {
        params: {
          countryCode: env.COUNTRY_CODE,
          ...filters,
        },
      });
      return response.data.data;
    } catch (error) {
      console.warn('API failed, using fallback data:', error);
      return providersData.filter(p => p.countryCode === env.COUNTRY_CODE);
    }
  },

  async getById(id: string): Promise<Provider | null> {
    try {
      const response = await apiClient.get(`/providers/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn('API failed, using fallback data:', error);
      return providersData.find(p => p.id === id) || null;
    }
  },

  async search(query: string): Promise<Provider[]> {
    try {
      const response = await apiClient.get('/providers', {
        params: { searchQuery: query, countryCode: env.COUNTRY_CODE },
      });
      return response.data.data;
    } catch (error) {
      console.warn('API failed, using fallback data:', error);
      return providersData.filter(p => 
        p.countryCode === env.COUNTRY_CODE &&
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
};
```

### 2.4 React Query Integration

```typescript
// config/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

// hooks/useProviders.ts
import { useQuery } from '@tanstack/react-query';
import { providersService } from '../services/providers.service';

export function useProviders(filters?: ProviderFilters) {
  return useQuery({
    queryKey: ['providers', filters],
    queryFn: () => providersService.getAll(filters),
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: () => providersService.getById(id),
    enabled: !!id,
  });
}
```

### 2.5 Currency by Country

```typescript
// constants/countries.ts
export const countries = {
  TN: { code: 'TN', name: 'Tunisia', currency: 'TND', locale: 'ar-TN' },
  MA: { code: 'MA', name: 'Morocco', currency: 'MAD', locale: 'ar-MA' },
  DZ: { code: 'DZ', name: 'Algeria', currency: 'DZD', locale: 'ar-DZ' },
  EG: { code: 'EG', name: 'Egypt', currency: 'EGP', locale: 'ar-EG' },
  SA: { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', locale: 'ar-SA' },
  AE: { code: 'AE', name: 'UAE', currency: 'AED', locale: 'ar-AE' },
  FR: { code: 'FR', name: 'France', currency: 'EUR', locale: 'fr-FR' },
  DE: { code: 'DE', name: 'Germany', currency: 'EUR', locale: 'de-DE' },
  NL: { code: 'NL', name: 'Netherlands', currency: 'EUR', locale: 'nl-NL' },
  GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
  US: { code: 'US', name: 'United States', currency: 'USD', locale: 'en-US' },
};

// utils/currency.ts
import { countries } from '../constants/countries';
import { env } from '../config/env';

export function formatPrice(amount: number, countryCode?: string): string {
  const code = countryCode || env.COUNTRY_CODE;
  const country = countries[code] || countries.TN;
  
  return new Intl.NumberFormat(country.locale, {
    style: 'currency',
    currency: country.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrency(countryCode?: string): string {
  const code = countryCode || env.COUNTRY_CODE;
  return countries[code]?.currency || 'TND';
}
```

---

## Implementation Order

### Week 1: Foundation
1. Create folder structure
2. Define TypeScript types
3. Extract mock data to /data folder
4. Create utility functions

### Week 2: Core Infrastructure
1. Set up environment configuration
2. Create API client with interceptors
3. Implement service layer with fallbacks
4. Add React Query

### Week 3: Context Refactoring
1. Split LanguageContext translations
2. Create CountryContext for global country/currency
3. Refactor AuthContext for API integration
4. Add error boundaries

### Week 4: Route Optimization
1. Implement lazy loading for all routes
2. Create route configuration
3. Add loading states and suspense boundaries
4. Performance testing

### Week 5: API Integration
1. Connect services to real APIs
2. Test fallback mechanisms
3. Add comprehensive error handling
4. Create API documentation

### Week 6: Testing & Polish
1. End-to-end testing
2. Performance optimization
3. Documentation completion
4. Final review

---

## Success Criteria

- [ ] All existing features work identically
- [ ] UI/UX design unchanged
- [ ] Code follows SOLID principles
- [ ] Comprehensive TypeScript types
- [ ] Lazy loading implemented
- [ ] API integration with fallbacks
- [ ] Country-based filtering works
- [ ] Dynamic currency display
- [ ] Complete API documentation
- [ ] Performance improved (bundle size, load time)
