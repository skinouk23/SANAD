import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Grid,
  List,
  SlidersHorizontal,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { PageContainer } from '@/shared/ui/composites/layout';
import {
  SkeletonCatalogGrid,
  SkeletonCatalogList,
  SkeletonChipRow,
} from '@/shared/ui/composites/loading';
import { Badge } from '@/shared/ui/primitives/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import {
  usePaginatedEquipment,
  useEquipmentCategories,
  useEquipmentAvailability,
  useEquipmentCategoryIcon,
  equipmentCategoriesOptions,
  equipmentPaginatedOptions,
  type EquipmentResponse,
} from '@/features/equipment';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  void Promise.all([
    queryClient.prefetchQuery(equipmentCategoriesOptions()),
    queryClient.prefetchQuery(equipmentPaginatedOptions({ page: 1, limit: 12 })),
  ]).catch(() => undefined);
  return null;
};

// ============================================
// Helpers
// ============================================

/** Sliding window of page numbers centered on `current`. */
function getPageRange(current: number, total: number, maxVisible = 5): number[] {
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getAvailabilityBadgeVariant(
  availableQuantity: number,
): 'success' | 'warning' | 'destructive' {
  if (availableQuantity === 0) return 'destructive';
  if (availableQuantity <= 2) return 'warning';
  return 'success';
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const message = 'message' in error ? (error as { message?: unknown }).message : null;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return error instanceof Error ? error.message : fallback;
}

// ============================================
// EquipmentCard
// ============================================

function EquipmentCard({
  equipment,
  categoryLabel,
  onClick,
  variant = 'grid',
}: {
  equipment: EquipmentResponse;
  categoryLabel: string;
  onClick: () => void;
  variant?: 'grid' | 'list';
}) {
  const { t } = useLanguage();
  const availability = useEquipmentAvailability(equipment);
  const availabilityVariant = getAvailabilityBadgeVariant(equipment.availableQuantity);
  const categoryIcon = useEquipmentCategoryIcon(equipment.categoryCode);

  const imageContent = equipment.imageUrl ? (
    <img
      src={equipment.imageUrl}
      alt={equipment.name}
      width={variant === 'list' ? 192 : 400}
      height={variant === 'list' ? 144 : 300}
      loading="lazy"
      decoding="async"
      sizes={
        variant === 'list'
          ? '(min-width: 640px) 12rem, 10rem'
          : '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
      }
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-700">
      <span className="text-5xl opacity-30">{categoryIcon}</span>
    </div>
  );

  // --- List variant ---
  if (variant === 'list') {
    return (
      <div
        onClick={onClick}
        className="group flex cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-cyan-500/50 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none"
      >
        {/* Image — fixed width */}
        <div className="relative w-40 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700 sm:w-48">
          {imageContent}
          <Badge
            variant={availabilityVariant}
            className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold"
          >
            {availability.label}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-cyan-500">
                {equipment.name}
              </h3>
              <p className={`text-xs line-clamp-1 mt-0.5 h-4 text-muted-foreground`}>
                {equipment.brand}
                {equipment.brand && equipment.provider.city && ` \u00b7 ${equipment.provider.city}`}
              </p>
            </div>
            {/* Rating — right-aligned in list mode */}
            {equipment.rating > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className={`text-xs font-medium text-foreground`}>{equipment.rating}</span>
                <span className={`text-xs text-muted-foreground`}>({equipment.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Category badge — inline in list mode */}
          <div className="mt-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-foreground`}
            >
              {categoryIcon} {categoryLabel}
            </span>
          </div>

          {/* Price pinned to bottom */}
          <div className="flex items-baseline gap-1 mt-auto pt-2">
            <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
              {equipment.pricePerDay}
            </span>
            <span className={`text-xs text-muted-foreground`}>{t.equipment.currencyPerDay}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Grid variant (default) ---
  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-cyan-500/50 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
        {imageContent}
        <Badge
          variant={availabilityVariant}
          className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold"
        >
          {availability.label}
        </Badge>
        <div className="absolute top-2 left-2 rounded-full bg-card/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
          {categoryIcon} {categoryLabel}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-cyan-500">
          {equipment.name}
        </h3>
        {/* Brand + location — always rendered for uniform height */}
        <p className={`text-xs line-clamp-1 mt-0.5 h-4 text-muted-foreground`}>
          {equipment.brand}
          {equipment.brand && equipment.provider.city && ` \u00b7 ${equipment.provider.city}`}
        </p>
        {/* Rating — always rendered for uniform height */}
        <div className="flex items-center gap-1 mt-1.5 h-4">
          {equipment.rating > 0 ? (
            <>
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className={`text-xs font-medium text-foreground`}>{equipment.rating}</span>
              <span className={`text-xs text-muted-foreground`}>({equipment.reviewCount})</span>
            </>
          ) : (
            <span className={`text-xs text-muted-foreground`}>{'\u2014'}</span>
          )}
        </div>
        {/* Price — pinned to bottom */}
        <div className="flex items-baseline gap-1 mt-auto pt-2">
          <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
            {equipment.pricePerDay}
          </span>
          <span className={`text-xs text-muted-foreground`}>{t.equipment.currencyPerDay}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CategoryButton
// ============================================

function CategoryButton({
  label,
  code,
  selected,
  onClick,
}: {
  label: string;
  code: string;
  selected: boolean;
  onClick: () => void;
}) {
  const icon = useEquipmentCategoryIcon(code);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${selected ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'}`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ============================================
// Types & Defaults
// ============================================

interface PanelFilters {
  category: string | null;
  sortBy: string;
  availableFilter: string;
  minPrice: string;
  maxPrice: string;
}

const ALL_EQUIPMENT_CATEGORIES_VALUE = '__all_equipment_categories__';
const ALL_EQUIPMENT_AVAILABILITY_VALUE = '__all_equipment_availability__';

const defaultPanelFilters: PanelFilters = {
  category: null,
  sortBy: 'relevance',
  availableFilter: 'all',
  minPrice: '',
  maxPrice: '',
};

// ============================================
// EquipmentCatalogPage
// ============================================

export function EquipmentCatalogPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<PanelFilters>({ ...defaultPanelFilters });
  const [draftFilters, setDraftFilters] = useState<PanelFilters>({ ...defaultPanelFilters });

  // Debounce search: only the settled value feeds the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const sortParams = useMemo(() => {
    switch (appliedFilters.sortBy) {
      case 'price_asc':
        return { sortBy: 'pricePerDay', sortDesc: false };
      case 'price_desc':
        return { sortBy: 'pricePerDay', sortDesc: true };
      case 'rating':
        return { sortBy: 'rating', sortDesc: true };
      default:
        return {};
    }
  }, [appliedFilters.sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.category) count++;
    if (appliedFilters.sortBy !== 'relevance') count++;
    if (appliedFilters.availableFilter !== 'all') count++;
    if (appliedFilters.minPrice) count++;
    if (appliedFilters.maxPrice) count++;
    if (debouncedSearch) count++;
    return count;
  }, [appliedFilters, debouncedSearch]);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useEquipmentCategories();
  const {
    data: equipment,
    loading: equipmentLoading,
    pagination,
    error: equipmentError,
    refetch: refetchEquipment,
    isRefreshing: equipmentRefreshing,
    isPlaceholderData: equipmentPlaceholderData,
  } = usePaginatedEquipment({
    page: currentPage,
    limit: 12,
    category: appliedFilters.category || undefined,
    search: debouncedSearch || undefined,
    ...sortParams,
    available: appliedFilters.availableFilter === 'available' ? true : undefined,
    minPrice: appliedFilters.minPrice ? Number(appliedFilters.minPrice) : undefined,
    maxPrice: appliedFilters.maxPrice ? Number(appliedFilters.maxPrice) : undefined,
  });
  const showEquipmentUpdating = equipmentRefreshing || equipmentPlaceholderData;

  const handleCategorySelect = (category: string | null) => {
    setAppliedFilters((prev) => ({ ...prev, category }));
    if (showFilters) {
      setDraftFilters((prev) => ({ ...prev, category }));
    }
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  const handleOpenFilters = () => {
    setDraftFilters({ ...appliedFilters });
    setShowFilters(true);
  };

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...draftFilters });
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const reset = { ...defaultPanelFilters };
    setDraftFilters(reset);
    setAppliedFilters(reset);
    handleClearSearch();
  };

  const handleEquipmentClick = (equipmentId: string) => {
    navigate(`/equipment/${equipmentId}`);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <div className="relative z-10 py-4 px-6 pb-12">
        <PageContainer size="wide" padding="none">
          <div className="relative mb-4 overflow-hidden rounded-[14px] p-[2px]">
            <div
              aria-hidden="true"
              className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]"
            />
            <div className="relative rounded-[12px] bg-white/95 px-4 py-2.5 backdrop-blur-xl dark:bg-slate-900/95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold text-foreground`}>{t.equipment.pageTitle}</h1>
                    <p className={`text-sm text-muted-foreground`}>
                      {pagination ? `${pagination.total} ${t.equipment.itemsAvailable}` : '\u00A0'}
                    </p>
                    {showEquipmentUpdating ? (
                      <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                        {t.common.loading}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className={`p-1.5 rounded-lg transition-colors hover:bg-accent text-muted-foreground`}
                  >
                    {viewMode === 'grid' ? (
                      <List className="h-4 w-4" />
                    ) : (
                      <Grid className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={showFilters ? handleCloseFilters : handleOpenFilters}
                    className={`relative rounded-lg p-1.5 transition-colors ${showFilters ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFilterCount > 0 && !showFilters && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search & category chips card */}
          <div className={`border rounded-xl p-3 mb-3 bg-card border-border shadow-sm`}>
            <div className="relative mb-2">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
              />
              <input
                type="text"
                placeholder={t.equipment.searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-colors bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20`}
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-accent text-muted-foreground`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${!appliedFilters.category ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'}`}
              >
                {t.equipment.filterCategoryAll}
              </button>
              {categoriesLoading ? (
                <SkeletonChipRow items={4} />
              ) : categoriesError ? (
                <div className="flex min-w-0 items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
                  <span className="truncate">
                    {getErrorMessage(categoriesError, t.common.loadingError)}
                  </span>
                  <button
                    type="button"
                    onClick={() => void refetchCategories()}
                    className="shrink-0 rounded-full px-2 py-1 font-medium transition-colors hover:bg-destructive/10"
                  >
                    {t.common.retry}
                  </button>
                </div>
              ) : (
                categories?.map((category) => (
                  <CategoryButton
                    key={category.code}
                    label={category.label}
                    code={category.code}
                    selected={appliedFilters.category === category.code}
                    onClick={() => handleCategorySelect(category.code)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Advanced filter card */}
          {showFilters && (
            <div className={`border rounded-xl p-3 mb-3 bg-card border-border shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xs font-bold text-foreground`}>
                  {t.equipment.filterAdvanced}
                </h3>
                <button
                  onClick={handleCloseFilters}
                  className="rounded-lg p-0.5 text-muted-foreground hover:bg-accent"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 text-muted-foreground`}
                    htmlFor="equipment-filter-category"
                  >
                    {t.equipment.filterCategory}
                  </label>
                  <Select
                    value={draftFilters.category || ALL_EQUIPMENT_CATEGORIES_VALUE}
                    onValueChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        category: value === ALL_EQUIPMENT_CATEGORIES_VALUE ? null : value,
                      }))
                    }
                  >
                    <SelectTrigger id="equipment-filter-category" className="w-full" size="sm">
                      <SelectValue placeholder={t.equipment.filterCategoryAll} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={ALL_EQUIPMENT_CATEGORIES_VALUE}>
                          {t.equipment.filterCategoryAll}
                        </SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.code} value={cat.code}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 text-muted-foreground`}
                    htmlFor="equipment-filter-sort"
                  >
                    {t.equipment.filterSortBy}
                  </label>
                  <Select
                    value={draftFilters.sortBy}
                    onValueChange={(value) =>
                      setDraftFilters((prev) => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger id="equipment-filter-sort" className="w-full" size="sm">
                      <SelectValue placeholder={t.equipment.filterSortBy} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="relevance">{t.equipment.filterSortRelevance}</SelectItem>
                        <SelectItem value="price_asc">{t.equipment.filterSortPriceAsc}</SelectItem>
                        <SelectItem value="price_desc">
                          {t.equipment.filterSortPriceDesc}
                        </SelectItem>
                        <SelectItem value="rating">{t.equipment.filterSortRating}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    className={`block text-[10px] font-medium mb-1 text-muted-foreground`}
                    htmlFor="equipment-filter-availability"
                  >
                    {t.equipment.filterAvailability}
                  </label>
                  <Select
                    value={
                      draftFilters.availableFilter === 'all'
                        ? ALL_EQUIPMENT_AVAILABILITY_VALUE
                        : draftFilters.availableFilter
                    }
                    onValueChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        availableFilter: value === ALL_EQUIPMENT_AVAILABILITY_VALUE ? 'all' : value,
                      }))
                    }
                  >
                    <SelectTrigger id="equipment-filter-availability" className="w-full" size="sm">
                      <SelectValue placeholder={t.equipment.filterAvailability} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={ALL_EQUIPMENT_AVAILABILITY_VALUE}>
                          {t.equipment.filterAvailabilityAll}
                        </SelectItem>
                        <SelectItem value="available">{t.equipment.filterAvailable}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={`block text-[10px] font-medium mb-1 text-muted-foreground`}>
                    {t.equipment.filterPriceRange}
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="0"
                      placeholder={t.equipment.filterPriceMin}
                      value={draftFilters.minPrice}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                      }
                      className="w-1/2 rounded-lg border border-border bg-input px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder={t.equipment.filterPriceMax}
                      value={draftFilters.maxPrice}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                      className="w-1/2 rounded-lg border border-border bg-input px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleResetFilters}
                  className="rounded-lg px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-accent"
                >
                  {t.equipment.filterReset}
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t.equipment.filterApply}
                </button>
              </div>
            </div>
          )}

          {/* Active filter tags */}
          {(appliedFilters.category || debouncedSearch) && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              <span className={`text-xs text-muted-foreground`}>{t.equipment.filters}</span>
              {appliedFilters.category && (
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {categories?.find((c) => c.code === appliedFilters.category)?.label ??
                    appliedFilters.category}
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
              {debouncedSearch && (
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  "{debouncedSearch}"<X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          )}

          {/* Content: skeleton / grid / empty */}
          <div className="relative">
            {showEquipmentUpdating && equipment.length > 0 ? (
              <div className="mb-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                {t.common.loading}
              </div>
            ) : null}

            {equipmentLoading ? (
              viewMode === 'grid' ? (
                <SkeletonCatalogGrid
                  items={12}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                />
              ) : (
                <SkeletonCatalogList items={12} />
              )
            ) : equipmentError && equipment.length === 0 ? (
              <EmptyState
                title={t.common.loadingError}
                description={getErrorMessage(equipmentError, t.common.loadingError)}
                icon={<Package className="h-5 w-5" />}
                action={
                  <button
                    type="button"
                    onClick={() => void refetchEquipment()}
                    className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t.common.retry}
                  </button>
                }
                className="py-8"
              />
            ) : equipment && equipment.length > 0 ? (
              <>
                <div
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'grid-cols-1 gap-3'}`}
                >
                  {equipment.map((item) => (
                    <EquipmentCard
                      key={item.id}
                      equipment={item}
                      categoryLabel={item.categoryName || item.categoryCode}
                      variant={viewMode}
                      onClick={() => handleEquipmentClick(item.id)}
                    />
                  ))}
                </div>
                {equipmentError ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <span>{getErrorMessage(equipmentError, t.common.loadingError)}</span>
                    <button
                      type="button"
                      onClick={() => void refetchEquipment()}
                      className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-destructive/10"
                    >
                      {t.common.retry}
                    </button>
                  </div>
                ) : null}
                {pagination ? (
                  <div className="mt-4 min-h-12">
                    {pagination.totalPages > 1 ? (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className={`text-xs text-muted-foreground`}>
                          {t.equipment.paginationPage} {pagination.page} {t.equipment.paginationOf}{' '}
                          {pagination.totalPages}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1 || equipmentPlaceholderData}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent text-muted-foreground`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          {getPageRange(currentPage, pagination.totalPages).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              disabled={equipmentPlaceholderData}
                              className={`h-10 min-w-10 rounded-lg px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${page === currentPage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={
                              currentPage >= pagination.totalPages || equipmentPlaceholderData
                            }
                            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent text-muted-foreground`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                title={t.equipment.noResults}
                description={t.equipment.noResultsHint}
                icon={<Search className="h-5 w-5" />}
                action={
                  appliedFilters.category || debouncedSearch ? (
                    <button
                      onClick={() => {
                        handleCategorySelect(null);
                        handleClearSearch();
                      }}
                      className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                      {t.equipment.resetFilters}
                    </button>
                  ) : undefined
                }
                className="py-8"
              />
            )}
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
