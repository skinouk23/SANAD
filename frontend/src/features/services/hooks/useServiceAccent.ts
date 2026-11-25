import { useMemo } from 'react';

import {
  createServiceAccentStyles,
  createServiceAccentVariables,
  resolveServiceAccent,
} from '@/features/services/service-colors';

import { useServiceCategories } from './useServiceQueries';

/**
 * Resolves a service accent from backend category colors with category fallbacks.
 */
export function useServiceAccent(categoryCode?: string | null) {
  const { allCategories } = useServiceCategories();
  const normalizedCategoryCode = categoryCode?.trim().toLowerCase() ?? '';

  const categoryColor = useMemo(() => {
    if (!normalizedCategoryCode) {
      return null;
    }

    return (
      allCategories.find(
        (category) => category.code?.trim().toLowerCase() === normalizedCategoryCode,
      )?.color ?? null
    );
  }, [allCategories, normalizedCategoryCode]);

  const accent = useMemo(
    () => resolveServiceAccent(categoryColor, categoryCode),
    [categoryColor, categoryCode],
  );
  const styles = useMemo(() => createServiceAccentStyles(accent), [accent]);
  const variables = useMemo(() => createServiceAccentVariables(accent), [accent]);

  return { accent, styles, variables };
}
