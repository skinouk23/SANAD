import { Clock, DollarSign, List } from 'lucide-react';

import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';

interface ProviderServicePresetLike {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  description?: string | null;
  draft: {
    price: number;
    priceType: string;
    currency: string;
    serviceLocation: string;
    requiresPrescription: boolean;
    isUrgent: boolean;
    requiresMedicalHistory: boolean;
    durationMinutes?: number | null | undefined;
    typeConfig?: unknown;
  };
}

interface ProviderServicePresetsPanelProps {
  presets: ProviderServicePresetLike[];
  loading: boolean;
  description: string;
  onApply: (preset: ProviderServicePresetLike) => void;
}

function ProviderServicePresetsPanelSkeleton() {
  return (
    <div className="sticky top-24 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>

      <Skeleton className="mb-3 h-3 w-full rounded" />
      <Skeleton className="mb-3 h-3 w-4/5 rounded" />

      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/50"
          >
            <Skeleton className="mb-1.5 h-3.5 w-32 rounded" />
            <Skeleton className="mb-1 h-2.5 w-full rounded" />
            <Skeleton className="mb-2 h-2.5 w-3/4 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

export function ProviderServicePresetsPanel({
  presets,
  loading,
  description,
  onApply,
}: ProviderServicePresetsPanelProps) {
  if (loading && presets.length === 0) {
    return <ProviderServicePresetsPanelSkeleton />;
  }

  if (presets.length === 0) {
    return null;
  }

  return (
    <div
      className="sticky top-24 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-4"
      aria-busy={loading}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <List className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          Suggestions
        </h3>
        {loading ? (
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
            Mise à jour...
          </span>
        ) : null}
      </div>
      <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">{description}</p>
      <div className="custom-scrollbar max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        {presets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => onApply(preset)}
            className="group cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-2 transition-all hover:border-cyan-500/50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-cyan-500/50"
          >
            <h4 className="mb-0.5 text-xs font-semibold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
              {preset.name}
            </h4>
            <p className="mb-1.5 line-clamp-2 text-[10px] text-slate-500 dark:text-slate-400">
              {preset.description ?? ''}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-0.5">
                <DollarSign className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                {preset.draft.price} {preset.draft.currency}
              </span>
              {preset.draft.durationMinutes !== null &&
              preset.draft.durationMinutes !== undefined &&
              preset.draft.durationMinutes > 0 ? (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  {preset.draft.durationMinutes} min
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
