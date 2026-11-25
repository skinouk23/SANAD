import type { ReactNode } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  type DialogContentProps,
} from '@/shared/ui/primitives/dialog';
import { cn } from '@/shared/lib/utils';

interface ProviderServiceDialogShellProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
  scroll?: DialogContentProps['scroll'];
  size?: DialogContentProps['size'];
  contentClassName?: string;
}

export function ProviderServiceDialogShell({
  children,
  contentClassName,
  onClose,
  open,
  scroll,
  size,
  title,
}: ProviderServiceDialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <DialogContent
        className={cn(
          'border-slate-200 bg-white/95 text-slate-900 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/95 dark:text-white',
          contentClassName,
        )}
        scroll={scroll}
        size={size}
        onPointerDownOutside={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        {scroll === 'content' ? <DialogBody>{children}</DialogBody> : children}
      </DialogContent>
    </Dialog>
  );
}
