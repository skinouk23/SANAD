import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { appFeaturesOptions } from '@/features/app-features/options';
import type { AppFeature, AppFeatureCode } from '@/features/app-features/schema';

const EMPTY_APP_FEATURES: AppFeature[] = [];

export function useAppFeatures() {
  const query = useQuery(appFeaturesOptions());
  const features = query.data ?? EMPTY_APP_FEATURES;

  const featureByCode = useMemo(
    () => new Map(features.map((feature) => [feature.code, feature])),
    [features],
  );
  const activeFeatureCodes = useMemo(
    () => new Set(features.filter((feature) => feature.isActive).map((feature) => feature.code)),
    [features],
  );

  const isFeatureActive = useCallback(
    (code: AppFeatureCode): boolean => {
      return query.isSuccess && !query.error && featureByCode.get(code)?.isActive === true;
    },
    [featureByCode, query.error, query.isSuccess],
  );

  return {
    features,
    activeFeatureCodes,
    isFeatureActive,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
