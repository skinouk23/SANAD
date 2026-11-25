import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const metricCardGlassSurfaceClassName =
  'rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50';

const defaultMetricIconClassName =
  'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br';

const defaultMetricIconGradient = 'from-cyan-500 to-blue-500';

export interface MetricCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  auxiliary?: React.ReactNode;
  icon?: React.ElementType<{ className?: string }>;
  iconClassName?: string;
  iconGradient?: string;
  iconRowClassName?: string;
  iconSvgClassName?: string;
  label: React.ReactNode;
  labelClassName?: string;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  trailing?: React.ReactNode;
  value: React.ReactNode;
  valueClassName?: string;
  valueSuffix?: React.ReactNode;
  valueSuffixClassName?: string;
  valueWrapperClassName?: string;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(function MetricCard(
  {
    auxiliary,
    className,
    icon: Icon,
    iconClassName,
    iconGradient = defaultMetricIconGradient,
    iconRowClassName,
    iconSvgClassName,
    label,
    labelClassName,
    subtitle,
    subtitleClassName,
    trailing,
    value,
    valueClassName,
    valueSuffix,
    valueSuffixClassName,
    valueWrapperClassName,
    ...props
  },
  ref,
) {
  const hasSubtitle = subtitle !== undefined && subtitle !== null;
  const hasValueSuffix = valueSuffix !== undefined && valueSuffix !== null;
  const shouldRenderIconRow = Icon || trailing;
  const shouldWrapValue = hasValueSuffix || valueWrapperClassName;

  return (
    <div
      ref={ref}
      data-slot="metric-card"
      className={cn(metricCardGlassSurfaceClassName, className)}
      {...props}
    >
      {shouldRenderIconRow ? (
        <div className={iconRowClassName}>
          {Icon ? (
            <div className={cn(iconClassName ?? defaultMetricIconClassName, iconGradient)}>
              <Icon className={iconSvgClassName} />
            </div>
          ) : null}
          {trailing}
        </div>
      ) : null}

      <p className={labelClassName}>{label}</p>
      {shouldWrapValue ? (
        <div className={valueWrapperClassName}>
          <span className={valueClassName}>{value}</span>
          {hasValueSuffix ? <span className={valueSuffixClassName}>{valueSuffix}</span> : null}
        </div>
      ) : (
        <p className={valueClassName}>{value}</p>
      )}
      {hasSubtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
      {auxiliary}
    </div>
  );
});
