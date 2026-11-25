import { Fragment } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/primitives/card';

interface BookingStepIndicatorProps {
  currentStep: number;
  stepLabels: string[];
  className?: string;
}

export function BookingStepIndicator({
  className,
  currentStep,
  stepLabels,
}: BookingStepIndicatorProps) {
  const totalSteps = stepLabels.length;

  return (
    <Card
      className={cn(
        'mb-4 rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/80',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isComplete = currentStep > stepNumber;
          const hasConnector = stepNumber < totalSteps;

          return (
            <Fragment key={`${label}-${stepNumber}`}>
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                <div
                  aria-current={currentStep === stepNumber ? 'step' : undefined}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-colors ${isActive ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
                </div>
                <p
                  className={`text-[10px] font-semibold sm:text-xs ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  {label}
                </p>
              </div>
              {hasConnector && (
                <div
                  aria-hidden="true"
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-colors sm:mx-3 ${isComplete ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </Card>
  );
}
