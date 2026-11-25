import type { ComponentProps } from 'react';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

function Spinner({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 motion-safe:animate-spin text-primary', className)}
      {...props}
    />
  );
}

export { Spinner };
