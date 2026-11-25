import { Fragment } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

export interface StepProgressStep {
  number: number;
  title: ReactNode;
}

interface StepProgressProps {
  className?: string;
  currentStep: number;
  steps: readonly StepProgressStep[];
  variant: 'inline' | 'track';
}

export function StepProgress({ className, currentStep, steps, variant }: StepProgressProps) {
  if (variant === 'track') {
    const progressWidth = Math.min(
      100,
      Math.max(0, steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0),
    );

    return (
      <div className={className}>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
          <div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 transition-[width] duration-500"
            style={{ width: `${progressWidth}%` }}
          />
          {steps.map((step) => (
            <div
              key={step.number}
              aria-current={currentStep === step.number ? 'step' : undefined}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500',
                currentStep >= step.number
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
              )}
            >
              {currentStep > step.number ? <CheckCircle2 className="h-5 w-5" /> : step.number}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between px-1">
          {steps.map((step) => (
            <span
              key={step.number}
              className={cn(
                'text-xs font-medium',
                currentStep >= step.number
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-slate-400 dark:text-slate-500',
              )}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <Fragment key={step.number}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                aria-current={currentStep === step.number ? 'step' : undefined}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-8 sm:w-8',
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                )}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  currentStep >= step.number
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500',
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={cn(
                  'mx-1.5 h-0.5 flex-1 rounded-full transition-all sm:mx-3',
                  currentStep > step.number
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-slate-300 dark:bg-slate-700',
                )}
              />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
