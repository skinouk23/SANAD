import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  serviceCategoriesOptions,
  useServiceCategories,
  getCategoryRoute,
} from '@/features/services';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(serviceCategoriesOptions());

  return null;
};
import {
  Stethoscope,
  Baby,
  Heart,
  Activity,
  Thermometer,
  UserCheck,
  Grid3x3,
  HeartPulse,
  Users,
  Dumbbell,
  Ambulance,
  Calendar,
  HandHeart,
  UtensilsCrossed,
  Brain,
  FlaskConical,
  Scan,
  Trophy,
  Syringe,
  ArrowRight,
  Smile,
  Pill,
  Flower2,
  PawPrint,
  Sparkles,
  Accessibility,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { PageContainer } from '@/shared/ui/composites/layout';
import { SkeletonServiceGrid } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';

const FALLBACK_CATEGORY_COLOR_STOPS = ['#06b6d4', '#3b82f6'] as const;
const SAFE_HEX_COLOR_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;

interface CategoryColorStops {
  from: string;
  to: string;
}

function getFallbackCategoryColorStops(): CategoryColorStops {
  return {
    from: FALLBACK_CATEGORY_COLOR_STOPS[0],
    to: FALLBACK_CATEGORY_COLOR_STOPS[1],
  };
}

function isSafeHexColor(color: string | undefined): color is string {
  return Boolean(color && SAFE_HEX_COLOR_PATTERN.test(color));
}

function parseCategoryColorStops(color?: string | null): CategoryColorStops {
  if (!color) {
    return getFallbackCategoryColorStops();
  }

  const [from, to] = color.split(',', 2).map((stop) => stop.trim());

  if (!isSafeHexColor(from) || !isSafeHexColor(to)) {
    return getFallbackCategoryColorStops();
  }

  return { from, to };
}

function getCategoryGradient(color?: string | null): string {
  const { from, to } = parseCategoryColorStops(color);
  return `linear-gradient(135deg, ${from}, ${to})`;
}

function getCategoryGradientStyle(color?: string | null): CSSProperties {
  return { background: getCategoryGradient(color) };
}

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  syringe: Syringe,
  heart: Heart,
  activity: Activity,
  baby: Baby,
  thermometer: Thermometer,
  'user-check': UserCheck,
  ambulance: Ambulance,
  stethoscope: Stethoscope,
  calendar: Calendar,
  'hand-heart': HandHeart,
  smile: Smile,
  'utensils-crossed': UtensilsCrossed,
  brain: Brain,
  'flask-conical': FlaskConical,
  scan: Scan,
  pill: Pill,
  trophy: Trophy,
  'flower-2': Flower2,
  'paw-print': PawPrint,
  dumbbell: Dumbbell,
  accessibility: Accessibility,
};

// Map display group names to Lucide icons
const GROUP_ICONS: Record<string, LucideIcon> = {
  Medical: HeartPulse,
  Daily: Users,
  Rehabilitation: Dumbbell,
  Wellness: Sparkles,
};

export function ServiceSelectionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const {
    data: categoryGroups,
    error: categoriesError,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useServiceCategories();

  // ============================================
  // FILTERS — derived from backend category groups
  // ============================================

  const GROUP_LABELS: Record<string, string> = useMemo(
    () => ({
      Medical: t.services.medicalCare,
      Daily: t.services.dailyHelp,
      Rehabilitation: t.services.rehabilitation,
      Wellness: t.services.wellness,
    }),
    [t],
  );

  const filters = useMemo(() => {
    const baseFilters = [{ id: 'all', label: t.services.all, icon: Grid3x3 }];
    if (!categoryGroups || categoryGroups.length === 0) return baseFilters;

    // Deduplicate display groups (the API may return one entry per group)
    const seen = new Set<string>();
    const groupFilters: { id: string; label: string; icon: LucideIcon }[] = [];

    for (const g of categoryGroups) {
      const groupKey = g.displayGroup ?? 'other';
      if (seen.has(groupKey)) continue;
      seen.add(groupKey);
      groupFilters.push({
        id: groupKey,
        label: GROUP_LABELS[groupKey] ?? groupKey,
        icon: GROUP_ICONS[groupKey] ?? Grid3x3,
      });
    }

    return [...baseFilters, ...groupFilters];
  }, [categoryGroups, t, GROUP_LABELS]);

  // ============================================
  // FILTERED CATEGORIES — flat list from groups
  // ============================================

  const filteredCategories = useMemo(() => {
    if (!categoryGroups) return [];
    if (activeFilter === 'all') {
      return categoryGroups.flatMap((g) => g.categories ?? []);
    }
    const group = categoryGroups.find((g) => g.displayGroup === activeFilter);
    return group?.categories ?? [];
  }, [categoryGroups, activeFilter]);

  // ============================================
  // NAVIGATION
  // ============================================

  const handleServiceSelect = (categoryCode: string) => {
    navigate(getCategoryRoute(categoryCode));
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-10">
        <PageContainer size="wide" padding="none">
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              {t.services.title}
            </p>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              {t.services.whatCareNeeded}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t.services.subtitle}</p>
          </div>

          {/* Filters */}
          <div className="scrollbar-hide mb-6 overflow-x-auto pb-2">
            <div className="mx-auto flex w-max gap-2 px-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex min-h-11 touch-manipulation items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-medium transition-colors ${activeFilter === filter.id ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20' : 'border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur-sm hover:border-cyan-500/40 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:text-white'}`}
                >
                  <filter.icon className="h-3.5 w-3.5" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {categoriesLoading ? (
            <SkeletonServiceGrid items={8} />
          ) : categoriesError ? (
            <EmptyState
              title="Erreur de chargement"
              description="Impossible de charger les services. Veuillez réessayer."
              icon={<Grid3x3 className="h-5 w-5" />}
              className="py-12"
              action={
                <Button type="button" onClick={() => void refetchCategories()} className="min-h-11">
                  Réessayer
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredCategories.map((category) => {
                const code = category.code ?? '';
                const Icon = iconMap[category.icon ?? ''] ?? Activity;
                const gradientStyle = getCategoryGradientStyle(category.color);

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleServiceSelect(code)}
                    className="group relative overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                  >
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                      style={gradientStyle}
                    />
                    <div className="relative flex h-full min-h-[125px] flex-col rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all group-hover:border-cyan-500/50 dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="mb-2 flex items-start justify-between">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-lg shadow-cyan-500/20"
                          style={gradientStyle}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {category.badge && (
                          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:border-cyan-500/50 dark:bg-cyan-500/20 dark:text-cyan-400">
                            {category.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="mb-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                        {category.label ?? code}
                      </h3>

                      {category.description && (
                        <p className="mb-2 line-clamp-2 text-xs leading-tight text-slate-600 dark:text-slate-400">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                          {category.minPrice != null && category.minPrice > 0
                            ? `${t.services.fromPrice} ${category.minPrice} TND`
                            : category.minPrice != null
                              ? t.services.onQuote
                              : ''}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-cyan-600 dark:text-slate-500 dark:group-hover:text-cyan-400" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {filteredCategories.length === 0 && !categoriesLoading && !categoriesError && (
            <EmptyState
              title={t.services.noServicesFound}
              icon={<Grid3x3 className="h-5 w-5" />}
              className="py-12"
            />
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              {t.services.notFound}{' '}
              <a
                href="mailto:support@sanad.tn"
                className="font-semibold text-cyan-600 underline hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                {t.services.contactUs}
              </a>
            </p>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
