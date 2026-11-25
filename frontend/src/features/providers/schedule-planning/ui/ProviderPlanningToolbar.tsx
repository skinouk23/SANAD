import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionCard } from '@/shared/ui/composites/section-card';
import { Button } from '@/shared/ui/primitives/button';
import type { ViewMode } from '@/features/providers/schedule-planning/types';
import type { NavigationLabels } from './types';

interface ProviderPlanningToolbarProps {
  labels: NavigationLabels;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  title: string;
  viewMode: ViewMode;
}

export function ProviderPlanningToolbar({
  labels,
  onNext,
  onPrevious,
  onToday,
  onViewModeChange,
  title,
  viewMode,
}: ProviderPlanningToolbarProps) {
  return (
    <SectionCard
      className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
      contentClassName="space-y-4 pt-3"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50 xl:justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            aria-label={labels.previous}
            title={labels.previous}
            className="size-9 rounded-lg text-slate-500 hover:bg-white hover:text-cyan-600 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-cyan-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0 px-2 text-center xl:min-w-[17rem]">
            <h2 className="truncate text-sm font-bold capitalize text-slate-900 dark:text-white sm:text-base">
              {title}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            aria-label={labels.next}
            title={labels.next}
            className="size-9 rounded-lg text-slate-500 hover:bg-white hover:text-cyan-600 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-cyan-400"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="border-slate-200 bg-white text-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:bg-slate-700 dark:hover:text-cyan-400"
          >
            {labels.today}
          </Button>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(mode)}
                className={
                  viewMode === mode
                    ? 'rounded-lg border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/20 hover:brightness-110'
                    : 'rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'
                }
              >
                {mode === 'day' ? labels.day : null}
                {mode === 'week' ? labels.week : null}
                {mode === 'month' ? labels.month : null}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
