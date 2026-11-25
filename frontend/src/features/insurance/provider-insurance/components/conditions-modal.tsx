import { CheckCircle2, Info, Shield, X } from 'lucide-react';

import { INSURANCE_CONDITIONS } from '@/features/insurance/provider-insurance/providerInsurance.hooks';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

export function ProviderInsuranceConditionsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        size="lg"
        scroll="content"
        className="border-slate-200 bg-white/95 text-slate-900 shadow-2xl shadow-cyan-500/10 ring-1 ring-cyan-500/10 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/95 dark:text-white"
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Conditions Générales d'Assurance
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 dark:text-slate-400">
                Responsabilité Civile Professionnelle
              </DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer les conditions générales d'assurance"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-cyan-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        <DialogBody>
          <div className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 dark:border-blue-500/30 dark:from-blue-500/10 dark:to-cyan-500/10">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="mb-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                  Document légal
                </p>
                <p className="text-[10px] text-slate-700 dark:text-slate-300">
                  Ces conditions sont conformes à la législation tunisienne et au Code des
                  Assurances. Elles définissent vos droits et obligations en tant qu'assuré.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {INSURANCE_CONDITIONS.map((section, index) => (
              <div
                key={section.category}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50"
              >
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-bold text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                    {index + 1}
                  </span>
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-1.5 rounded-md border border-slate-200 bg-white/80 p-2 text-[11px] text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
