import type { CSSProperties } from 'react';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { cn } from '@/shared/lib/utils';

const sonnerStyle = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
} as CSSProperties;

const defaultIcons: ToasterProps['icons'] = {
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
};

function Toaster({
  className,
  closeButton = true,
  dir,
  duration = 5000,
  icons,
  position,
  richColors = true,
  style,
  theme,
  toastOptions,
  ...props
}: ToasterProps) {
  const resolvedPosition = position ?? (dir === 'rtl' ? 'bottom-left' : 'bottom-right');

  return (
    <Sonner
      theme={theme}
      dir={dir}
      position={resolvedPosition}
      richColors={richColors}
      closeButton={closeButton}
      duration={duration}
      className={cn('toaster group', className)}
      icons={{ ...defaultIcons, ...icons }}
      style={{ ...sonnerStyle, ...style }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn('font-sans', toastOptions?.classNames?.toast),
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
export type { ToasterProps };
