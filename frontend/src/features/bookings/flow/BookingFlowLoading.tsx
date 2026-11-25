import { cn } from '@/shared/lib/utils';
import {
  Skeleton,
  SkeletonChipRow,
  SkeletonSelectionList,
  SkeletonText,
} from '@/shared/ui/composites/loading';
import { Card } from '@/shared/ui/primitives/card';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

export const bookingSurfaceClassName =
  'rounded-xl border-border/70 bg-card/85 p-4 shadow-sm backdrop-blur-sm';

export function BookingSectionSkeleton({
  className,
  fieldCount = 3,
  showActions = false,
}: {
  className?: string;
  fieldCount?: number;
  showActions?: boolean;
}) {
  return (
    <Card className={cn(bookingSurfaceClassName, 'space-y-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-64 max-w-full rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div
            key={index}
            className={cn('space-y-2', index === fieldCount - 1 ? 'md:col-span-2' : '')}
          >
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
      {showActions ? (
        <div className="flex justify-end gap-2 pt-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      ) : null}
    </Card>
  );
}

export function BookingQuoteSkeleton({ className }: { className?: string; loadingLabel?: string }) {
  return (
    <Card className={cn(bookingSurfaceClassName, 'space-y-4', className)}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--skeleton-card-border)] p-3">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </Card>
  );
}

export function AddressPickerModalSkeleton() {
  return (
    <Dialog open>
      <DialogContent size="xl" scroll="content" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Chargement de la carte</DialogTitle>
          <DialogDescription>Préparation du sélecteur d'adresse.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 w-28 rounded-lg" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
          <Skeleton className="h-[320px] min-h-[320px] w-full rounded-xl" />
          <div className="space-y-3">
            <div className="rounded-lg border border-border/70 p-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3.5 w-56 max-w-full rounded" />
                </div>
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export function BookingOptionListSkeleton({
  className,
  items = 3,
  leading = 'icon',
  showHeaderAction = true,
}: {
  className?: string;
  items?: number;
  leading?: 'icon' | 'media' | 'none';
  showHeaderAction?: boolean;
}) {
  return (
    <Card className={cn(bookingSurfaceClassName, className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-64 max-w-full rounded" />
        </div>
        {showHeaderAction ? <Skeleton className="h-10 w-28 rounded-lg" /> : null}
      </div>
      <SkeletonSelectionList items={items} className="space-y-3" leading={leading} />
    </Card>
  );
}

export function BookingPageSkeleton({
  className,
  accentClassName,
}: {
  className?: string;
  accentClassName?: string;
}) {
  return (
    <div className={cn('min-h-screen px-4 py-6 md:px-6', className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className={cn(bookingSurfaceClassName, 'space-y-4')}>
          <div className="flex items-start gap-4">
            <Skeleton className={cn('h-12 w-12 rounded-2xl', accentClassName)} />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-64 max-w-full rounded" />
              <SkeletonText lines={2} lineHeight="h-4" />
            </div>
          </div>
          <SkeletonChipRow items={4} chipClassName="h-8 rounded-full" />
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <BookingOptionListSkeleton />
            <BookingSectionSkeleton fieldCount={4} showActions />
          </div>
          <div className="space-y-6">
            <BookingQuoteSkeleton />
            <Card className={cn(bookingSurfaceClassName, 'space-y-4')}>
              <Skeleton className="h-5 w-32 rounded" />
              <SkeletonText lines={3} lineHeight="h-3.5" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
