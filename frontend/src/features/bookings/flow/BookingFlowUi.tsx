import { AlertCircle, ArrowLeft } from 'lucide-react';
import {
  BookingPageSkeleton,
  BookingQuoteSkeleton,
  bookingSurfaceClassName,
} from '@/features/bookings/flow/BookingFlowLoading';
import { cn } from '@/shared/lib/utils';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import type { HTMLAttributes, ReactNode } from 'react';

export const summaryServiceRowClassName = 'grid-cols-[minmax(0,1fr)_auto]';
export const summaryServiceValueClassName = 'whitespace-nowrap text-right font-normal tabular-nums';
export const bookingNeutralPanelClassName =
  'rounded-xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/70';
export const bookingNeutralSurfaceClassName =
  'rounded-2xl border border-slate-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/70';
export const bookingNeutralSuccessCardClassName =
  'rounded-lg border border-slate-200/80 bg-white/85 px-4 py-3 text-left text-xs text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300';
export const bookingCyanTotalClassName = 'text-cyan-600 dark:text-cyan-400';
export const bookingNeutralBackButtonClassName =
  'h-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white';
export const bookingCyanActionButtonClassName =
  'h-auto rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100';
export const bookingNeutralPaymentOptionClassName =
  'border-slate-200 bg-white/80 hover:border-cyan-500/50 hover:bg-cyan-50/70 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/10';
export const bookingCyanPaymentOptionSelectedBaseClassName = 'border-cyan-500 bg-cyan-500/10';
export const bookingCyanPaymentOptionSelectedClassName =
  'border-cyan-500 bg-cyan-500/10 [&_.text-primary]:text-cyan-600 dark:[&_.text-primary]:text-cyan-400';
export const bookingAccentSelectedOptionClassName =
  'border-[color:var(--service-accent-border)] bg-[color:var(--service-accent-soft)] ring-1 ring-[color:var(--service-accent-border)]';
export const bookingAccentInactiveOptionClassName =
  'border-slate-200 bg-white/80 hover:border-[color:var(--service-accent-border)] hover:bg-[color:var(--service-accent-hover)] dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-[color:var(--service-accent-border)] dark:hover:bg-[color:var(--service-accent-hover)]';
export const bookingSelectableCardBaseClassName =
  'relative overflow-hidden rounded-lg border-2 p-3 text-left transition-colors';
export const bookingSelectableCardSelectedIndicatorClassName =
  'absolute right-1.5 top-1.5 text-cyan-600 dark:text-cyan-400';
export const bookingSelectableCardIconClassName = 'h-6 w-6';
export const bookingSelectableCardSelectedIconClassName = 'text-cyan-600 dark:text-cyan-400';
export const bookingSelectableCardNeutralIconClassName = 'text-muted-foreground';
export const bookingPaymentOptionDisabledClassName =
  'cursor-not-allowed opacity-50 hover:border-slate-200 hover:bg-white/80 dark:hover:border-slate-700 dark:hover:bg-slate-900/50';
export const bookingHomeLocationBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-emerald-300/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300';
export const bookingProviderLocationBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-blue-300/70 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300';
export const bookingBothLocationBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-cyan-300/70 bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300';
export const bookingPrescriptionRequiredBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300';
export const bookingPrescriptionUploadedBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-emerald-300/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300';
export const bookingPrescriptionOptionalBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300';
export const bookingUploadDropzoneClassName =
  'rounded-xl border-2 border-dashed border-cyan-300/80 bg-cyan-50/40 p-8 text-center shadow-sm backdrop-blur-sm transition-colors hover:border-cyan-500/70 hover:bg-cyan-50/70 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:hover:border-cyan-400/70';
export const bookingUploadIconClassName =
  'flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-300';
export const bookingUploadSuccessClassName = 'text-emerald-600 dark:text-emerald-400';
export const bookingUploadErrorClassName = 'text-destructive';
export const bookingDurationBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-indigo-300/70 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300';
export const bookingMetadataBadgeClassName =
  'inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300';

interface BookingSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function BookingSurface({ children, className, ...props }: BookingSurfaceProps) {
  return (
    <Card className={cn(bookingSurfaceClassName, className)} {...props}>
      {children}
    </Card>
  );
}

export interface BookingFlowSummaryItem {
  label: ReactNode;
  value?: ReactNode;
  hidden?: boolean;
  valueTitle?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export interface BookingFlowSummarySection {
  title?: ReactNode;
  description?: ReactNode;
  items?: readonly BookingFlowSummaryItem[];
  hidden?: boolean;
  className?: string;
  contentClassName?: string;
}

export interface BookingFlowSummaryTotal {
  label: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
  hidden?: boolean;
  variant?: 'card' | 'line';
  valueTitle?: string;
  iconClassName?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export interface BookingFlowSummaryProps {
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  items?: readonly BookingFlowSummaryItem[];
  sections?: readonly BookingFlowSummarySection[];
  total?: BookingFlowSummaryTotal;
  notice?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  noticeClassName?: string;
}

export interface BookingFlowBodyLayoutProps {
  children: ReactNode;
  summary?: ReactNode;
  stickySummary?: boolean;
  className?: string;
  mainClassName?: string;
  summaryClassName?: string;
  summaryInnerClassName?: string;
}

function isEmptySummaryNode(value: ReactNode) {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'boolean' ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
}

function getSummaryNodeTitle(value: ReactNode) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function getVisibleSummaryItems(items?: readonly BookingFlowSummaryItem[]) {
  return items?.filter((item) => !item.hidden && !isEmptySummaryNode(item.value)) ?? [];
}

function BookingFlowSummaryRows({ items }: { items: readonly BookingFlowSummaryItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const valueTitle = item.valueTitle ?? getSummaryNodeTitle(item.value);

        return (
          <div
            key={index}
            className={cn(
              'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 text-xs',
              item.className,
            )}
          >
            <span className={cn('min-w-0 break-words text-muted-foreground', item.labelClassName)}>
              {item.label}
            </span>
            <span
              title={valueTitle}
              className={cn(
                'min-w-0 break-words text-right font-medium text-foreground',
                item.valueClassName,
              )}
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function BookingFlowSummary({
  actions,
  children,
  className,
  contentClassName,
  description,
  headerClassName,
  icon,
  iconClassName,
  items,
  notice,
  noticeClassName,
  sections,
  title,
  total,
}: BookingFlowSummaryProps) {
  const visibleItems = getVisibleSummaryItems(items);
  const visibleSections =
    sections
      ?.map((section) => ({ ...section, items: getVisibleSummaryItems(section.items) }))
      .filter((section) => !section.hidden && section.items.length > 0) ?? [];
  const visibleTotal =
    total && !total.hidden && !isEmptySummaryNode(total.value) ? total : undefined;
  const totalTitle = visibleTotal
    ? (visibleTotal.valueTitle ?? getSummaryNodeTitle(visibleTotal.value))
    : undefined;
  const totalVariant = visibleTotal?.variant ?? 'card';

  return (
    <BookingSurface role="complementary" className={cn('space-y-4', className)}>
      <div className={cn('flex items-start gap-3', headerClassName)}>
        {icon ? (
          <div
            className={cn(
              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:h-4 [&>svg]:w-4',
              iconClassName,
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      <div className={cn('space-y-3', contentClassName)}>
        {visibleItems.length > 0 ? (
          <div className="pl-3">
            <BookingFlowSummaryRows items={visibleItems} />
          </div>
        ) : null}

        {visibleSections.map((section, index) => (
          <section key={index} className={cn('space-y-2', section.className)}>
            {section.title || section.description ? (
              <div className="space-y-0.5">
                {section.title ? (
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    {section.title}
                  </h3>
                ) : null}
                {section.description ? (
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                ) : null}
              </div>
            ) : null}
            <div className={cn('pl-3', section.contentClassName)}>
              <BookingFlowSummaryRows items={section.items} />
            </div>
          </section>
        ))}

        {visibleTotal ? (
          <div
            className={cn(
              totalVariant === 'line'
                ? 'border-t border-border/70 bg-transparent px-0 pb-0 pt-4'
                : 'rounded-xl border border-primary/20 bg-primary/5 p-3',
              visibleTotal.className,
            )}
          >
            <div
              className={cn(
                'flex justify-between gap-3',
                totalVariant === 'line' ? 'items-center' : 'items-start',
              )}
            >
              <span
                className={cn('text-sm font-bold text-foreground', visibleTotal.labelClassName)}
              >
                {visibleTotal.label}
              </span>
              <span
                title={totalTitle}
                className={cn(
                  'min-w-0 text-right text-lg font-bold text-foreground',
                  visibleTotal.valueClassName,
                )}
              >
                {visibleTotal.value}
              </span>
            </div>
            {visibleTotal.description ? (
              <p className="mt-1 text-xs text-muted-foreground">{visibleTotal.description}</p>
            ) : null}
          </div>
        ) : null}

        {notice ? (
          <div
            className={cn(
              'rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground',
              noticeClassName,
            )}
          >
            {notice}
          </div>
        ) : null}

        {children ? <div>{children}</div> : null}

        {actions ? <div className="border-t border-border/70 pt-3">{actions}</div> : null}
      </div>
    </BookingSurface>
  );
}

export function BookingFlowBodyLayout({
  children,
  className,
  mainClassName,
  stickySummary = true,
  summary,
  summaryClassName,
  summaryInnerClassName,
}: BookingFlowBodyLayoutProps) {
  const hasSummary = summary !== null && summary !== undefined && summary !== false;

  return (
    <div
      className={cn(
        'grid gap-6',
        hasSummary ? 'lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start' : '',
        className,
      )}
    >
      <main className={cn('min-w-0', mainClassName)}>{children}</main>
      {hasSummary ? (
        <aside
          className={cn(
            'min-w-0 lg:self-start',
            stickySummary ? 'lg:sticky lg:top-24' : '',
            summaryClassName,
          )}
        >
          <div className={summaryInnerClassName}>{summary}</div>
        </aside>
      ) : null}
    </div>
  );
}

export function BookingPageLoader({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return <BookingPageSkeleton className={className} accentClassName={iconClassName} />;
}

interface BookingPageErrorStateProps {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
}

export function BookingPageErrorState({
  actionLabel,
  className,
  description,
  onAction,
  title,
}: BookingPageErrorStateProps) {
  return (
    <div className={cn('flex min-h-screen items-center justify-center px-6', className)}>
      <EmptyState
        title={title}
        description={description}
        icon={<AlertCircle className="h-6 w-6" />}
        action={<Button onClick={onAction}>{actionLabel}</Button>}
        className="w-full max-w-md border-destructive/30 bg-destructive/5"
      />
    </div>
  );
}

interface BookingInlineStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  tone?: 'danger' | 'info' | 'muted' | 'warning';
}

const toneClasses: Record<NonNullable<BookingInlineStateProps['tone']>, string> = {
  danger: 'border-destructive/30 bg-destructive/5 text-destructive',
  info: 'border-primary/25 bg-primary/5 text-foreground',
  muted: 'border-border bg-muted/40 text-muted-foreground',
  warning: 'border-warning/30 bg-warning/10 text-warning',
};

export function BookingInlineState({
  action,
  className,
  description,
  title,
  tone = 'info',
}: BookingInlineStateProps) {
  return (
    <div className={cn('rounded-xl border p-3', toneClasses[tone], className)}>
      <p className="text-xs font-semibold">{title}</p>
      {description ? <p className="mt-1 text-xs opacity-90">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

interface BookingQuotePanelProps {
  children: ReactNode;
  error: unknown;
  errorMessage: string;
  errorTitle?: string;
  loading: boolean;
  loadingLabel: string;
  onRetry: () => void;
  retryLabel: string;
}

export function BookingQuotePanel({
  children,
  error,
  errorMessage,
  errorTitle,
  loading,
  loadingLabel,
  onRetry,
  retryLabel,
}: BookingQuotePanelProps) {
  if (loading) {
    return <BookingQuoteSkeleton loadingLabel={loadingLabel} />;
  }

  if (error) {
    return (
      <BookingInlineState
        tone="danger"
        title={errorTitle ?? 'Error'}
        description={errorMessage}
        action={
          <Button variant="destructive" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}

interface BookingStepActionsProps {
  backLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
  nextType?: 'button' | 'submit';
  className?: string;
  backButtonClassName?: string;
  nextButtonClassName?: string;
}

export function BookingStepActions({
  backLabel,
  backButtonClassName,
  className,
  nextButtonClassName,
  nextDisabled,
  nextLabel,
  nextType,
  onBack,
  onNext,
}: BookingStepActionsProps) {
  const primaryType = nextType ?? (onNext ? 'button' : 'submit');

  return (
    <div className={cn('mt-4 border-t border-border/70 pt-4', className)}>
      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:items-center sm:gap-3">
        <div className="flex min-w-0 justify-start sm:order-1">
          {onBack ? (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className={cn(
                'group min-h-11 w-full gap-1.5 sm:min-h-0 sm:w-auto',
                bookingNeutralBackButtonClassName,
                backButtonClassName,
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              {backLabel}
            </Button>
          ) : null}
        </div>
        <div className="order-first flex min-w-0 justify-end sm:order-2">
          <Button
            type={primaryType}
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              'min-h-11 w-full sm:min-h-0 sm:w-auto',
              bookingCyanActionButtonClassName,
              nextButtonClassName,
            )}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
