import {
  Skeleton,
  SkeletonListingSection,
  SkeletonMetricGrid,
} from '@/shared/ui/composites/loading';

export function ProviderServiceManagementContentSkeleton({ gradient }: { gradient: string }) {
  return (
    <>
      <SkeletonMetricGrid className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3" items={3} />

      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className={`h-4 w-4 rounded-full bg-gradient-to-r ${gradient}`} />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <SkeletonListingSection
          items={3}
          badgeCount={2}
          className="space-y-3"
          actionWidths={['w-8', 'w-8', 'w-8']}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-40 rounded" />
        </div>
        <SkeletonListingSection
          items={2}
          badgeCount={2}
          className="space-y-3"
          actionWidths={['w-8', 'w-8', 'w-8']}
        />
      </div>
    </>
  );
}
