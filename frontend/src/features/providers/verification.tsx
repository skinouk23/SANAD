import { ShieldCheck, ShieldQuestion } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/primitives/badge';

interface ProviderVerificationBadgeProps {
  isVerified: boolean;
  notVerifiedLabel: string;
  verifiedLabel: string;
  className?: string;
}

export function ProviderVerificationBadge({
  className,
  isVerified,
  notVerifiedLabel,
  verifiedLabel,
}: ProviderVerificationBadgeProps) {
  const defaultClassName = isVerified
    ? 'px-1.5 py-0.5 text-[9px] font-bold'
    : 'border-amber-400/35 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-400/25 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/40';

  return (
    <Badge
      variant={isVerified ? 'success' : 'secondary'}
      className={cn(defaultClassName, className)}
      icon={
        isVerified ? (
          <ShieldCheck className="h-2.5 w-2.5" />
        ) : (
          <ShieldQuestion className="h-2.5 w-2.5" />
        )
      }
    >
      {isVerified ? verifiedLabel : notVerifiedLabel}
    </Badge>
  );
}
