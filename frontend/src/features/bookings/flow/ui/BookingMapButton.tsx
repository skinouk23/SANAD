import { Map } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button, type ButtonProps } from '@/shared/ui/primitives/button';

interface BookingMapButtonProps extends Omit<ButtonProps, 'children' | 'type'> {
  label: string;
}

export function BookingMapButton({ className, label, ...props }: BookingMapButtonProps) {
  return (
    <Button
      type="button"
      title={label}
      aria-label={label}
      variant="ghost"
      className={cn(
        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-cyan-500/50 bg-cyan-50 p-0 text-cyan-600 shadow-none transition-all hover:scale-105 hover:bg-cyan-100 active:scale-[0.98] dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20',
        className,
      )}
      {...props}
    >
      <Map className="h-4 w-4" />
    </Button>
  );
}
