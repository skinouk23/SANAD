import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Shield, Truck, Calendar, CheckCircle, Phone, Star } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { equipmentDetailOptions } from '@/features/equipment';
import { queryClient } from '@/shared/lib/query/client';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { Badge } from '@/shared/ui/primitives/badge';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id) {
    void queryClient.prefetchQuery(equipmentDetailOptions(params.id)).catch(() => undefined);
  }
  return null;
};
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { PageLoadingShell, PageLoadingTopBar } from '@/app/shell/AppShell';
import {
  useEquipmentItem,
  useEquipmentAvailability,
  useEquipmentCategoryIcon,
} from '@/features/equipment';
function getAvailabilityBadgeVariant(
  availableQuantity: number,
): 'success' | 'warning' | 'destructive' {
  if (availableQuantity === 0) return 'destructive';
  if (availableQuantity <= 2) return 'warning';
  return 'success';
}

function getErrorStatusCode(error: unknown): number | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const statusCode = 'statusCode' in error ? (error as { statusCode?: unknown }).statusCode : null;
  if (typeof statusCode === 'number') {
    return statusCode;
  }

  const status = 'status' in error ? (error as { status?: unknown }).status : null;
  if (typeof status === 'number') {
    return status;
  }

  const response = 'response' in error ? (error as { response?: unknown }).response : null;
  if (response && typeof response === 'object') {
    const responseStatus = 'status' in response ? (response as { status?: unknown }).status : null;
    if (typeof responseStatus === 'number') {
      return responseStatus;
    }
  }

  return null;
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

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-600 dark:bg-slate-700/50">
      <div className="mb-0.5 text-[10px] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="break-words text-xs font-medium text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 text-primary`} />

      <span className={`text-sm text-muted-foreground`}>{text}</span>
    </li>
  );
}
function EquipmentDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-full h-64 rounded-xl" />
          <SkeletonCard className="p-4 space-y-3">
            <Skeleton className="w-24 h-5 rounded-full" />
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-16" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </SkeletonCard>
        </div>
        <div className="lg:col-span-1">
          <SkeletonCard className="p-4 space-y-3">
            <Skeleton className="w-28 h-5" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
export function EquipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data: equipment, loading, error, refetch } = useEquipmentItem(id);
  const availability = useEquipmentAvailability(equipment);
  const availabilityVariant = equipment
    ? getAvailabilityBadgeVariant(equipment.availableQuantity)
    : 'destructive';
  const categoryIcon = useEquipmentCategoryIcon(equipment?.categoryCode || '');
  const categoryLabel = equipment?.categoryName || equipment?.categoryCode || '';
  const handleBooking = () => {
    if (equipment) {
      navigate(`/equipment/booking/${equipment.id}`, {
        state: {
          equipment,
          duration: selectedDuration,
        },
      });
    }
  };
  if (loading) {
    return (
      <PageLoadingShell
        variant="cyber"
        topBar={
          <PageLoadingTopBar variant="cyber" sticky={false}>
            <div className="mx-auto max-w-7xl px-6 py-3 animate-pulse">
              <Skeleton className="h-11 w-64 rounded-[14px]" />
            </div>
          </PageLoadingTopBar>
        }
        contentClassName=""
      >
        <EquipmentDetailSkeleton />
      </PageLoadingShell>
    );
  }
  if (error) {
    const isNotFound = getErrorStatusCode(error) === 404;

    if (!isNotFound) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className={`text-sm font-semibold mb-2 text-foreground`}>{t.common.loadingError}</p>
          <p className="mb-4 max-w-md text-sm text-muted-foreground">
            {getErrorMessage(error, t.common.loadingError)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => void refetch()}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.common.retry}
            </button>
            <button
              onClick={() => navigate('/equipment')}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-primary transition-colors hover:bg-accent"
            >
              {t.equipment.viewCatalog}
            </button>
          </div>
        </div>
      );
    }
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className={`text-sm mb-3 text-foreground`}>{t.equipment.notFound}</p>
        <button
          onClick={() => navigate('/equipment')}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-primary transition-colors hover:bg-accent"
        >
          {t.equipment.viewCatalog}
        </button>
      </div>
    );
  }
  const specifications = equipment.specifications
    ? Object.entries(equipment.specifications).map(([label, value]) => ({
        label,
        value: String(value),
      }))
    : [
        {
          label: t.equipment.brand,
          value: equipment.brand || 'N/A',
        },
        {
          label: t.equipment.model,
          value: equipment.model || 'N/A',
        },
        {
          label: t.equipment.quantityAvailable,
          value: `${equipment.availableQuantity || 0} ${t.equipment.units}`,
        },
      ];

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <div className="border-b border-slate-200 bg-white/80 px-6 py-3 text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:shadow-none">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-[14px] p-[2px]">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
              <div className="relative rounded-[12px] bg-white/95 px-4 py-2.5 backdrop-blur-xl dark:bg-slate-900/95">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {equipment.name}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 pb-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
                {equipment.images && equipment.images.length > 0 ? (
                  <img
                    src={equipment.images[0]}
                    alt={equipment.name}
                    width={960}
                    height={360}
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-slate-100 text-6xl text-slate-500 dark:bg-slate-900/40 dark:text-slate-300">
                    {categoryIcon}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`border rounded-xl p-4 bg-card border-border shadow-sm`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-cyan-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-emerald-500/20"
                      >
                        {categoryIcon} {categoryLabel}
                      </Badge>
                      <Badge
                        variant={availabilityVariant}
                        className="px-1.5 py-0.5 text-[10px] font-bold"
                      >
                        {availability.label}
                      </Badge>
                    </div>
                    <h1 className={`text-xl font-bold mb-1 text-foreground`}>{equipment.name}</h1>
                    {equipment.rating && (
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className={`text-sm font-medium text-foreground`}>
                          {equipment.rating}
                        </span>
                        <span className={`text-xs text-muted-foreground`}>
                          ({equipment.reviewCount} {t.equipment.reviews})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className={`text-sm leading-relaxed mb-3 text-muted-foreground`}>
                  {equipment.description}
                </p>

                {/* Provider Info */}
                <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {equipment.provider.name}
                      </h3>
                      {equipment.provider.verified && (
                        <CheckCircle className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      )}
                    </div>
                    <div className="flex items-center text-[10px] text-slate-500 dark:text-slate-400">
                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                      {equipment.provider.city}
                    </div>
                  </div>
                  {equipment.provider.phone ? (
                    <a
                      href={`tel:${equipment.provider.phone}`}
                      className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                      title={t.equipment.contact}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      title={t.equipment.phoneUnavailable}
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Specifications */}
                <div className="mb-3">
                  <h3 className={`text-sm font-bold mb-2 text-foreground`}>
                    {t.equipment.technicalSpecs}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {specifications.map((spec, i) => (
                      <SpecItem key={i} label={spec.label} value={spec.value} />
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className={`text-sm font-bold mb-2 text-foreground`}>
                    {t.equipment.includedServices}
                  </h3>
                  <ul className="space-y-2">
                    {equipment.features.length > 0 ? (
                      equipment.features.map((feature, i) => <FeatureItem key={i} text={feature} />)
                    ) : (
                      <li className={`text-sm italic text-muted-foreground`}>
                        {t.equipment.noSpecifications}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <aside className="lg:sticky lg:top-20 lg:col-span-1 lg:self-start">
              <div className="rounded-xl border border-cyan-500/30 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-800/50 dark:shadow-none">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.equipment.rentalRates}
                </h3>

                <div className="space-y-2 mb-3">
                  {(() => {
                    const weeklyDiscount =
                      equipment.pricePerDay > 0
                        ? Math.round(
                            (1 - equipment.pricePerWeek / (equipment.pricePerDay * 7)) * 100,
                          )
                        : 0;
                    const monthlyDiscount =
                      equipment.pricePerDay > 0
                        ? Math.round(
                            (1 - equipment.pricePerMonth / (equipment.pricePerDay * 30)) * 100,
                          )
                        : 0;
                    return [
                      {
                        id: 'daily',
                        label: t.equipment.byDay,
                        price: equipment.pricePerDay,
                        unit: t.equipment.perDay,
                      },
                      {
                        id: 'weekly',
                        label: t.equipment.byWeek,
                        price: equipment.pricePerWeek,
                        unit: t.equipment.perWeek,
                        badge: weeklyDiscount > 0 ? `-${weeklyDiscount}%` : undefined,
                      },
                      {
                        id: 'monthly',
                        label: t.equipment.byMonth,
                        price: equipment.pricePerMonth,
                        unit: t.equipment.perMonth,
                        badge: monthlyDiscount > 0 ? `-${monthlyDiscount}%` : undefined,
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setSelectedDuration(option.id as 'daily' | 'weekly' | 'monthly')
                        }
                        className={`relative w-full rounded-lg border-2 p-3 text-left transition-all ${selectedDuration === option.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 hover:border-cyan-500/50 dark:border-slate-700'}`}
                      >
                        {option.badge && (
                          <Badge
                            variant="success"
                            className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-bold"
                          >
                            {option.badge}
                          </Badge>
                        )}
                        <div className="text-xs font-medium text-slate-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="mt-0.5 text-lg font-bold text-cyan-600 dark:text-cyan-400">
                          {option.price} {t.equipment.currency}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            {option.unit}
                          </span>
                        </div>
                      </button>
                    ));
                  })()}
                </div>

                <div className={`border-t pt-3 mb-3 border-border`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t.equipment.depositGuarantee}</span>
                    <span className={`font-medium text-foreground`}>
                      {equipment.deposit} {t.equipment.currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{t.equipment.depositRefund}</p>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!availability.available}
                  className="mb-3 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-[box-shadow,filter,transform] hover:scale-[1.02] hover:brightness-110 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50 disabled:shadow-none"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {availability.available ? t.equipment.bookNow : t.equipment.unavailable}
                  </span>
                </button>

                <div className={`space-y-2 pt-3 border-t border-border`}>
                  {[
                    {
                      icon: Truck,
                      text: t.equipment.freeDelivery,
                    },
                    {
                      icon: Shield,
                      text: t.equipment.certifiedMaterial,
                    },
                    {
                      icon: CheckCircle,
                      text: t.equipment.installationIncluded,
                    },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center text-xs text-muted-foreground`}>
                      <item.icon className={`h-3.5 w-3.5 mr-1.5 text-primary`} />

                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
