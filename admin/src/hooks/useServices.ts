/**
 * Services Hooks
 * Custom React hooks for service data fetching and management
 */

import { useState, useEffect, useCallback } from 'react';
import { servicesService } from '../services/services.service';
import type { Service, ServiceType } from '../types';

/**
 * Hook for fetching all services
 */
export function useServices(category?: string) {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const services = category ?
      await servicesService.getByCategory(category) :
      await servicesService.getAll();
      setData(services);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch services')
      );
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { data, loading, error, refetch: fetchServices };
}

/**
 * Hook for fetching a single service by ID
 */
export function useService(serviceId: string | undefined) {
  const [data, setData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(!!serviceId);
  const [error, setError] = useState<Error | null>(null);

  const fetchService = useCallback(async () => {
    if (!serviceId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = await servicesService.getById(serviceId);
      setData(service);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch service')
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { data, loading, error, refetch: fetchService };
}

/**
 * Hook for fetching a single service by Type
 */
export function useServiceByType(serviceType: ServiceType | undefined) {
  const [data, setData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(!!serviceType);
  const [error, setError] = useState<Error | null>(null);

  const fetchService = useCallback(async () => {
    if (!serviceType) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = await servicesService.getByType(serviceType);
      setData(service);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch service')
      );
    } finally {
      setLoading(false);
    }
  }, [serviceType]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { data, loading, error, refetch: fetchService };
}