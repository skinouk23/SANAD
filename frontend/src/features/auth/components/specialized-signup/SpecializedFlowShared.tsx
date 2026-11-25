import { CheckCircle2, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StepperProps {
  accentClassName: string;
  steps: string[];
  step: number;
}

export function SpecializedFlowStepper({ accentClassName, step, steps }: StepperProps) {
  return (
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center gap-1.5 sm:gap-3">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const active = step >= stepNumber;
          const completed = step > stepNumber;

          return (
            <div key={label} className="flex items-center gap-1.5 sm:gap-3">
              <div
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors',
                  active ? accentClassName : 'text-slate-400 dark:text-slate-500',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all sm:h-10 sm:w-10',
                    active
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-cyan-500/25'
                      : 'border border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500',
                  )}
                >
                  {completed ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
                </div>
                <span className="hidden text-xs font-semibold sm:block">{label}</span>
              </div>

              {stepNumber < steps.length ? (
                <div
                  className={cn(
                    'h-0.5 w-8 rounded-full sm:w-12',
                    completed
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                      : 'bg-slate-200 dark:bg-slate-700',
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface FileFieldProps {
  accept?: string;
  description?: string;
  error?: string;
  fileName: string;
  id: string;
  label: string;
  onChange: (file: File | null) => void;
}

export const specializedFileAccept = '.pdf,.jpg,.jpeg,.png';

export function SpecializedFileField({
  accept = specializedFileAccept,
  description,
  error,
  fileName,
  id,
  label,
  onChange,
}: FileFieldProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed p-4 shadow-sm backdrop-blur-sm transition-all',
        fileName
          ? 'border-emerald-400/60 bg-emerald-500/10 shadow-emerald-500/10'
          : 'border-cyan-400/35 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/70 dark:bg-slate-900/50 dark:hover:bg-cyan-950/25',
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              fileName
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                : 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-600 dark:text-cyan-300',
            )}
          >
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description ?? 'PDF, JPG ou PNG (max 5MB)'}
            </p>
            {fileName ? (
              <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                {fileName}
              </p>
            ) : null}
            {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
          </div>
        </div>

        <div>
          <input
            accept={accept}
            className="hidden"
            id={id}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            type="file"
          />
          <label
            className={cn(
              'inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5',
              fileName
                ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'
                : 'border-cyan-400/35 bg-white/80 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50 dark:bg-slate-900/60 dark:text-cyan-300 dark:hover:bg-cyan-950/30',
            )}
            htmlFor={id}
          >
            Importer
          </label>
        </div>
      </div>
    </div>
  );
}

interface AccentHeaderProps {
  iconBadge: string;
  subtitle: string;
  title: string;
}

export function SpecializedAccentHeader({ iconBadge, subtitle, title }: AccentHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <div className="relative mx-auto mb-4 h-16 w-16">
        <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 opacity-40 blur-md" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25">
          <span className="text-2xl transition-transform hover:scale-110">{iconBadge}</span>
        </div>
      </div>

      <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
        Inscription
      </p>
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
    </div>
  );
}
