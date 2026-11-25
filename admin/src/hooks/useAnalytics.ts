/**
 * Analytics Hooks
 * Custom React hooks for provider analytics data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface TopZone {
  city: string;
  count: number;
  percentage: number;
}

export interface RevenueDataPoint {
  month: string;
  value: number;
}

// ============================================
// MOCK DATA
// ============================================

const mockTopZones: TopZone[] = [
{ city: 'Tunis Centre', count: 15, percentage: 36 },
{ city: 'Ariana', count: 10, percentage: 24 },
{ city: 'Manouba', count: 8, percentage: 19 },
{ city: 'Ben Arous', count: 5, percentage: 12 },
{ city: 'La Marsa', count: 4, percentage: 9 }];


const mockRevenueData: RevenueDataPoint[] = [
{ month: 'Jan', value: 3200 },
{ month: 'Fév', value: 3500 },
{ month: 'Mar', value: 3800 },
{ month: 'Avr', value: 4100 },
{ month: 'Mai', value: 4250 }];


// ============================================
// HOOKS
// ============================================

export function useTopZones(providerId?: string) {
  return useApi<TopZone[]>(() => Promise.resolve(mockTopZones), [providerId]);
}

export function useRevenueData(providerId?: string, period?: string) {
  return useApi<RevenueDataPoint[]>(
    () => Promise.resolve(mockRevenueData),
    [providerId, period]
  );
}