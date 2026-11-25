import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader } from '@/shared/ui/primitives/card';
import { Skeleton as PrimitiveSkeleton } from '@/shared/ui/primitives/skeleton';

export { PrimitiveSkeleton as Skeleton };

const Skeleton = PrimitiveSkeleton;

const BADGE_WIDTHS = ['w-14', 'w-16', 'w-20'] as const;
const CHIP_WIDTHS = ['w-16', 'w-20', 'w-24', 'w-20'] as const;

const LINE_WIDTHS = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];

export function SkeletonText({
  lines = 3,
  className = '',
  lineHeight = 'h-3',
}: {
  lines?: number;
  className?: string;
  lineHeight?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <PrimitiveSkeleton
          key={index}
          className={`${lineHeight} rounded ${LINE_WIDTHS[index % LINE_WIDTHS.length]}`}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const avatarSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };

  return <PrimitiveSkeleton className={`rounded-full ${avatarSizes[size]} ${className}`} />;
}

export function SkeletonCard({
  className = '',
  children,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <Card className={cn('sk-card border p-4 backdrop-blur-sm', className)}>{children}</Card>;
}

export function SkeletonChipRow({
  items = 4,
  className = '',
  chipClassName = 'h-7 rounded-full',
  widths = CHIP_WIDTHS,
}: {
  items?: number;
  className?: string;
  chipClassName?: string;
  widths?: readonly string[];
}) {
  return (
    <div className={`flex gap-1.5 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <PrimitiveSkeleton
          key={index}
          className={`${chipClassName} ${widths[index % widths.length]}`}
        />
      ))}
    </div>
  );
}

export function SkeletonListingSection({
  items = 3,
  badgeCount = 2,
  className = 'space-y-3',
  actionWidths = ['flex-1', 'w-24'],
}: {
  items?: number;
  badgeCount?: number;
  className?: string;
  actionWidths?: readonly string[];
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <PrimitiveSkeleton className="h-14 w-14 flex-shrink-0 rounded-xl" />
            <div className="flex-1">
              <PrimitiveSkeleton className="mb-2 h-3.5 w-40 rounded" />
              <PrimitiveSkeleton className="mb-2 h-3 w-32 rounded" />
              <PrimitiveSkeleton className="mb-2 h-3 w-48 rounded" />
              <div className="mb-2 flex gap-1.5">
                {Array.from({ length: badgeCount }).map((_, badgeIndex) => (
                  <PrimitiveSkeleton
                    key={badgeIndex}
                    className={`h-5 rounded-full ${BADGE_WIDTHS[badgeIndex % BADGE_WIDTHS.length]}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {actionWidths.map((actionWidth, actionIndex) => (
              <PrimitiveSkeleton key={actionIndex} className={`h-8 rounded-lg ${actionWidth}`} />
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonMetricGrid({
  items = 4,
  className = 'grid grid-cols-2 gap-4 lg:grid-cols-4',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mb-2 h-3 w-24 rounded" />
          <Skeleton className="h-7 w-20 rounded" />
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonCompactList({
  items = 3,
  className = 'space-y-3',
  statusWidth = 'w-20',
}: {
  items?: number;
  className?: string;
  statusWidth?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="mb-2 h-5 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className={`h-6 rounded-full ${statusWidth}`} />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonConversationList({
  items = 4,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="border-b border-[var(--skeleton-card-border)] p-3">
          <div className="flex items-start gap-2.5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-2.5 w-10 rounded" />
              </div>
              <Skeleton className="h-2.5 w-40 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonAppointmentCards({
  items = 2,
  className = 'space-y-2',
  actionLayout = 'triple',
}: {
  items?: number;
  className?: string;
  actionLayout?: 'triple' | 'double';
}) {
  const actionWidths =
    actionLayout === 'double' ? ['flex-1', 'flex-1'] : ['flex-1', 'flex-1', 'w-16'];

  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="mb-2 h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-3">
            <Skeleton className="h-5 rounded" />
            <Skeleton className="h-5 rounded" />
          </div>
          <div className="flex gap-2">
            {actionWidths.map((width, actionIndex) => (
              <Skeleton key={actionIndex} className={`h-8 rounded-lg ${width}`} />
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonTimelineList({
  items = 3,
  className = 'space-y-3',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="relative flex gap-3">
          <div className="w-16 flex-shrink-0 pt-1">
            <div className="mx-auto w-fit text-center">
              <Skeleton className="h-3 w-10 rounded" />
              <Skeleton className="mx-auto mt-1.5 h-2.5 w-2.5 rounded-full" />
            </div>
          </div>
          <SkeletonCard className="flex-grow p-3">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <Skeleton className="mb-1.5 h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-40 rounded" />
          </SkeletonCard>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTransactionTableRows({
  rows = 5,
  className = '',
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className={className}>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="mb-1.5 h-3 w-14 rounded" />
                <Skeleton className="h-2.5 w-20 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <Skeleton className="mb-1.5 h-3.5 w-32 rounded" />
            <Skeleton className="h-2.5 w-24 rounded" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-3 w-28 rounded" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td className="px-4 py-3 text-right">
            <Skeleton className="ml-auto h-4 w-24 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function SkeletonProviderGrid({
  items = 6,
  badgeCount = 2,
  className = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
  mediaClassName = 'mb-3 h-24 w-full rounded-lg',
  secondaryAction = 'icon',
}: {
  items?: number;
  badgeCount?: number;
  className?: string;
  mediaClassName?: string;
  secondaryAction?: 'button' | 'icon' | 'none';
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="overflow-hidden">
          <Skeleton className={mediaClassName} />
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-1 h-3.5 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <div className="mb-3 flex gap-1.5">
            {Array.from({ length: badgeCount }).map((_, badgeIndex) => (
              <Skeleton
                key={badgeIndex}
                className={`h-5 rounded-full ${BADGE_WIDTHS[badgeIndex % BADGE_WIDTHS.length]}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            {secondaryAction === 'icon' ? <Skeleton className="h-8 w-8 rounded-lg" /> : null}
            {secondaryAction === 'button' ? <Skeleton className="h-8 w-24 rounded-lg" /> : null}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonServiceGrid({
  items = 8,
  className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index}>
          <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
          <Skeleton className="mb-1 h-3.5 w-3/4 rounded" />
          <Skeleton className="mb-1 h-3 w-full rounded" />
          <Skeleton className="mb-3 h-3 w-2/3 rounded" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonCatalogGrid({
  items = 8,
  className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="overflow-hidden rounded-xl">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-1.5 p-3">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="h-5 w-1/3 rounded" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonCatalogList({
  items = 12,
  className = 'grid grid-cols-1 gap-3',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="overflow-hidden rounded-xl p-0">
          <div className="flex min-h-36">
            <Skeleton className="w-40 shrink-0 sm:w-48" />
            <div className="flex min-w-0 flex-1 flex-col p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <Skeleton className="h-4 w-16 shrink-0 rounded" />
              </div>
              <Skeleton className="mt-3 h-5 w-24 rounded-full" />
              <div className="mt-auto pt-5">
                <Skeleton className="h-5 w-20 rounded" />
              </div>
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-8 w-64 rounded" />
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function TableSkeleton({
  className,
  columns = 4,
  rows = 5,
}: {
  className?: string;
  columns?: number;
  rows?: number;
}) {
  return (
    <Card className={className}>
      <CardHeader className="gap-3">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={index} className="h-4 rounded" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <Skeleton key={columnIndex} className="h-10 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FormSkeleton({ className, fields = 4 }: { className?: string; fields?: number }) {
  return (
    <Card className={className}>
      <CardHeader className="gap-3">
        <Skeleton className="h-6 w-36 rounded" />
        <Skeleton className="h-4 w-52 rounded" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ListSkeleton({ className, items = 4 }: { className?: string; items?: number }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 pt-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-64 rounded" />
            </div>
            <Skeleton className="h-9 w-20 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatsGridSkeleton({
  className,
  items = 4,
}: {
  className?: string;
  items?: number;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SkeletonCardGrid({
  items = 6,
  className = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3',
  showMedia = true,
  actionCount = 1,
}: {
  items?: number;
  className?: string;
  showMedia?: boolean;
  actionCount?: number;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="space-y-4 overflow-hidden p-4">
          {showMedia ? <Skeleton className="aspect-[4/3] w-full rounded-xl" /> : null}
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: actionCount }).map((__, actionIndex) => (
              <Skeleton key={actionIndex} className="h-9 flex-1 rounded-lg" />
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonModalContent({
  className,
  lines = 4,
  showFooter = true,
}: {
  className?: string;
  lines?: number;
  showFooter?: boolean;
}) {
  return (
    <Card className={cn('border-border/70 bg-card/90 shadow-sm', className)}>
      <CardHeader className="gap-3">
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn('h-10 rounded-lg', index === lines - 1 ? 'w-4/5' : 'w-full')}
            />
          ))}
        </div>
        {showFooter ? (
          <div className="flex justify-end gap-2 pt-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SkeletonProfileHeader({
  className,
  chipCount = 3,
  statCount = 3,
}: {
  className?: string;
  chipCount?: number;
  statCount?: number;
}) {
  return (
    <SkeletonCard className={cn('space-y-5 p-5', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-56 rounded" />
            <SkeletonChipRow items={chipCount} className="pt-1" chipClassName="h-6 rounded-full" />
          </div>
        </div>
        <div className="md:ml-auto md:w-56">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: statCount }).map((_, index) => (
          <div key={index} className="rounded-xl border border-[var(--skeleton-card-border)] p-3">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="mt-2 h-6 w-16 rounded" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

export function SkeletonProfilePage({
  className,
  sectionCount = 2,
  includeSidebar = true,
}: {
  className?: string;
  sectionCount?: number;
  includeSidebar?: boolean;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <SkeletonProfileHeader />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SkeletonChipRow items={4} chipClassName="h-9 rounded-lg" />
          {Array.from({ length: sectionCount }).map((_, index) => (
            <FormSkeleton key={index} fields={3} />
          ))}
        </div>
        {includeSidebar ? (
          <div className="space-y-6">
            <ListSkeleton items={3} />
            <SkeletonCompactList items={2} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SkeletonSelectionList({
  items = 4,
  className = 'space-y-3',
  leading = 'icon',
  showMeta = true,
  actionCount = 2,
}: {
  items?: number;
  className?: string;
  leading?: 'icon' | 'media' | 'none';
  showMeta?: boolean;
  actionCount?: number;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {leading === 'icon' ? <Skeleton className="h-12 w-12 rounded-xl" /> : null}
            {leading === 'media' ? <Skeleton className="h-20 w-full rounded-xl sm:w-32" /> : null}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-3 w-full max-w-md rounded" />
                </div>
                {showMeta ? <Skeleton className="h-6 w-20 rounded-full" /> : null}
              </div>
              {showMeta ? <SkeletonChipRow items={3} chipClassName="h-5 rounded-full" /> : null}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: actionCount }).map((__, actionIndex) => (
              <Skeleton key={actionIndex} className="h-9 w-28 rounded-lg" />
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonDeliveryList({
  items = 4,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return <SkeletonSelectionList items={items} className={className} leading="icon" />;
}

export function SkeletonEquipmentList({
  items = 4,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return <SkeletonSelectionList items={items} className={className} leading="media" />;
}
