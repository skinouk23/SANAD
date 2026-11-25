import { Star } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { bookingSurfaceClassName } from '@/features/bookings/flow/BookingFlowLoading';
import { BookingStepIndicator } from '@/features/bookings/flow/ui';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar';
import { Card } from '@/shared/ui/primitives/card';

export interface BookingFlowHeaderRating {
  average?: number | null;
  count?: number | null;
  reviewLabel: string;
}

export interface BookingFlowHeaderData {
  providerName: string;
  providerImageUrl?: string | null;
  providerImageAlt?: string;
  providerInitials?: string;
  rating?: BookingFlowHeaderRating | null;
  bookingTypeLabel?: string | null;
  locationLabel?: string | null;
  subtitle?: string | null;
}

interface BookingFlowHeaderCardProps {
  header: BookingFlowHeaderData;
  animatedBorderClassName?: string;
  animatedBorderStyle?: CSSProperties;
  avatarFallbackClassName?: string;
  avatarFallbackStyle?: CSSProperties;
  className?: string;
  innerClassName?: string;
}

interface BookingFlowChromeProps {
  children: ReactNode;
  currentStep: number;
  header: BookingFlowHeaderData;
  stepLabels: string[];
  showProgress?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  headerAnimatedBorderClassName?: string;
  headerAnimatedBorderStyle?: CSSProperties;
  headerInnerClassName?: string;
  headerAvatarFallbackClassName?: string;
  headerAvatarFallbackStyle?: CSSProperties;
  innerClassName?: string;
}

function hasPositiveFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function getDisplayText(value: string | null | undefined): string | null {
  const text = value?.trim();

  return text ? text : null;
}

function getProviderInitials(header: BookingFlowHeaderData): string {
  const explicitInitials = getDisplayText(header.providerInitials);

  if (explicitInitials) {
    return explicitInitials.slice(0, 2).toUpperCase();
  }

  const initials = header.providerName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return initials ? initials.toUpperCase() : '?';
}

function getHeaderDetailParts(header: BookingFlowHeaderData): string[] {
  return [
    getDisplayText(header.bookingTypeLabel),
    getDisplayText(header.locationLabel) ?? getDisplayText(header.subtitle),
  ].filter((part): part is string => Boolean(part));
}

export function BookingFlowHeaderCard({
  header,
  animatedBorderClassName,
  animatedBorderStyle,
  avatarFallbackClassName,
  avatarFallbackStyle,
  className,
  innerClassName,
}: BookingFlowHeaderCardProps) {
  const ratingAverage = header.rating?.average;
  const ratingCount = header.rating?.count;
  const reviewLabel = getDisplayText(header.rating?.reviewLabel);
  const showRating = hasPositiveFiniteNumber(ratingAverage);
  const showReviewCount = showRating && hasPositiveFiniteNumber(ratingCount) && reviewLabel;
  const displayRatingAverage = showRating ? ratingAverage.toFixed(1) : null;
  const detailParts = getHeaderDetailParts(header);
  const content = (
    <div className="flex items-start gap-3 sm:gap-4">
      <Avatar className="size-12 shrink-0 self-center rounded-2xl sm:size-14">
        {header.providerImageUrl ? (
          <AvatarImage
            src={header.providerImageUrl}
            alt={header.providerImageAlt ?? header.providerName}
            className="rounded-2xl"
          />
        ) : null}
        <AvatarFallback
          className={cn(
            'rounded-2xl bg-primary/10 font-semibold text-primary',
            avatarFallbackClassName,
          )}
          style={avatarFallbackStyle}
        >
          {getProviderInitials(header)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <h1 className="text-lg font-bold leading-tight text-foreground sm:text-2xl">
          {header.providerName}
        </h1>

        {showRating ? (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <Star aria-hidden="true" className="h-4 w-4 fill-current text-warning" />
            <span className="font-semibold text-foreground">{displayRatingAverage}</span>
            {showReviewCount ? (
              <span>
                ({ratingCount} {reviewLabel})
              </span>
            ) : null}
          </div>
        ) : null}

        {detailParts.length > 0 ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            {detailParts.map((part, index) => (
              <span key={`${part}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">•</span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </div>
  );

  if (animatedBorderClassName || animatedBorderStyle) {
    return (
      <div className={cn('relative overflow-hidden rounded-[20px] p-[2px] shadow-xl', className)}>
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-[-100%] animate-[spin_4s_linear_infinite]',
            animatedBorderClassName,
          )}
          style={animatedBorderStyle}
        />
        <Card
          className={cn(
            'relative rounded-[18px] border-0 bg-white/95 p-4 shadow-none backdrop-blur-xl dark:bg-slate-900/95 sm:p-5',
            innerClassName,
          )}
        >
          {content}
        </Card>
      </div>
    );
  }

  return <Card className={cn(bookingSurfaceClassName, className)}>{content}</Card>;
}

export function BookingFlowChrome({
  children,
  className,
  contentClassName,
  currentStep,
  header,
  headerAnimatedBorderClassName,
  headerAnimatedBorderStyle,
  headerAvatarFallbackClassName,
  headerAvatarFallbackStyle,
  headerClassName,
  headerInnerClassName,
  innerClassName,
  showProgress = true,
  stepLabels,
}: BookingFlowChromeProps) {
  return (
    <div
      className={cn(
        'min-h-[100dvh] px-3 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-4 sm:px-4 sm:pb-6 sm:pt-6 md:px-6',
        className,
      )}
    >
      <div className={cn('mx-auto flex w-full max-w-6xl flex-col gap-4', innerClassName)}>
        <BookingFlowHeaderCard
          header={header}
          animatedBorderClassName={headerAnimatedBorderClassName}
          animatedBorderStyle={headerAnimatedBorderStyle}
          avatarFallbackClassName={headerAvatarFallbackClassName}
          avatarFallbackStyle={headerAvatarFallbackStyle}
          className={headerClassName}
          innerClassName={headerInnerClassName}
        />

        {showProgress ? (
          <BookingStepIndicator
            currentStep={currentStep}
            stepLabels={stepLabels}
            className="mb-0"
          />
        ) : null}

        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
