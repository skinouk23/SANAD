import { Zap } from 'lucide-react';
import { PROVIDER_SUPPORT } from '@/config/providerSupport';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

export function ProviderDashboardSupportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent
        size="md"
        scroll="content"
        className="border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/20">
            <Zap className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <DialogTitle className="mb-1.5 text-xl font-bold text-slate-900 dark:text-white">
            {t.provider.supportModalTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 dark:text-slate-400">
            {t.provider.supportModalSubtitle}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            <p className="mb-1.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
              {t.provider.supportOtherContactMethods}
            </p>
            <div className="space-y-1 text-[10px]">
              <p className="text-slate-600 dark:text-slate-400">Tel: {PROVIDER_SUPPORT.phone}</p>
              <p className="text-slate-600 dark:text-slate-400">Email: {PROVIDER_SUPPORT.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 active:scale-[0.98]"
          >
            {t.common.close}
          </button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
