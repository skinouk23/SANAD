import { queryOptions } from '@tanstack/react-query';

import { appFeatureKeys } from './keys';
import { getAppFeatures } from './service';

export function appFeaturesOptions() {
  return queryOptions({
    queryKey: appFeatureKeys.list(),
    queryFn: getAppFeatures,
  });
}
