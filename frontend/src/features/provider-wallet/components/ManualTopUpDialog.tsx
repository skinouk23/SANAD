import { AlertTriangle, Copy, CreditCard, Landmark } from 'lucide-react';

import { providerWalletManualTopUpConfig } from '@/features/provider-wallet/manualTopUp.config';
import { formatCurrency } from '@/shared/lib/i18n/formatting';
import { Button } from '@/shared/ui/primitives/button';
import { Spinner } from '@/shared/ui/primitives/spinner';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Input } from '@/shared/ui/primitives/input';

import type { ProviderWalletPaymentChannel } from '@/features/provider-wallet/schema';

interface ManualTopUpDialogProps {
  currency: string;
  errorMessage: string | null;
  onClose: () => void;
  onCopy: (value: string, successMessage?: string) => void;
  onCreate: () => void;
  onPaymentChannelChange: (value: ProviderWalletPaymentChannel) => void;
  onProviderTransferReferenceChange: (value: string) => void;
  onTopUpAmountChange: (value: string) => void;
  open: boolean;
  parsedTopUpAmount: number | null;
  providerTransferReference: string;
  selectedPaymentChannel: ProviderWalletPaymentChannel;
  submitting: boolean;
  topUpAmount: string;
}

function formatAmount(value: number, currency: string) {
  return formatCurrency(value, currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function ManualTopUpDialog({
  currency,
  errorMessage,
  onClose,
  onCopy,
  onCreate,
  onPaymentChannelChange,
  onProviderTransferReferenceChange,
  onTopUpAmountChange,
  open,
  parsedTopUpAmount,
  providerTransferReference,
  selectedPaymentChannel,
  submitting,
  topUpAmount,
}: ManualTopUpDialogProps) {
  const channelConfig = providerWalletManualTopUpConfig.channels[selectedPaymentChannel];
  const transferReferenceIsValid = providerTransferReference.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <DialogContent
        className="border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:text-white [&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:hover:text-slate-900 dark:[&_[data-slot=dialog-close]]:text-slate-400 dark:[&_[data-slot=dialog-close]]:hover:text-white"
        size="md"
        scroll="content"
      >
        <DialogHeader className="border-b border-slate-200 pb-3 dark:border-slate-700">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Recharger mon solde
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="space-y-4">
            <div>
              <label
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
                htmlFor="provider-wallet-top-up-amount"
              >
                Montant a recharger ({currency})
              </label>
              <div className="relative">
                <Input
                  className="h-12 rounded-xl border-slate-200 bg-white pr-14 text-base font-bold text-slate-900 placeholder:text-slate-400 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
                  id="provider-wallet-top-up-amount"
                  inputMode="decimal"
                  onChange={(event) => onTopUpAmountChange(event.target.value)}
                  placeholder="0.00"
                  value={topUpAmount}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-slate-500">
                  {currency}
                </span>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                Methode de paiement
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(providerWalletManualTopUpConfig.channels).map(([key, config]) => {
                  const channel = key as ProviderWalletPaymentChannel;
                  const isSelected = channel === selectedPaymentChannel;
                  const ChannelIcon = channel === 'bank_transfer' ? Landmark : CreditCard;

                  return (
                    <button
                      className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors active:scale-[0.98] ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-slate-600'
                      }`}
                      key={channel}
                      onClick={() => onPaymentChannelChange(channel)}
                      type="button"
                    >
                      <ChannelIcon className="h-5 w-5" />
                      <span className="text-xs font-medium">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
                htmlFor="provider-wallet-create-transfer-reference"
              >
                Reference du transfert
              </label>
              <Input
                className="h-12 border-slate-200 bg-white text-base text-slate-900 placeholder:text-slate-400 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
                id="provider-wallet-create-transfer-reference"
                maxLength={120}
                onChange={(event) => onProviderTransferReferenceChange(event.target.value)}
                placeholder="Ex: VIR-20260425-001"
                value={providerTransferReference}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-900 dark:text-white">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-bold text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                  i
                </span>
                Instructions
              </h4>

              <div className="space-y-1.5 text-xs">
                {channelConfig.instructions.map((instruction, index) => (
                  <div
                    className={`flex justify-between gap-3 py-1 ${
                      index < channelConfig.instructions.length - 1
                        ? 'border-b border-slate-200 dark:border-slate-700/50'
                        : ''
                    }`}
                    key={instruction.label}
                  >
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {instruction.label}
                    </span>

                    <span className="flex min-w-0 items-center gap-1.5 text-right text-[10px] font-medium text-slate-900 dark:text-white">
                      <span className="break-words">{instruction.value}</span>

                      {instruction.copyValue ? (
                        <button
                          aria-label={`Copier ${instruction.label}`}
                          className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                          onClick={() =>
                            onCopy(instruction.copyValue, `${instruction.label} copie.`)
                          }
                          type="button"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[10px] text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  <p>
                    Incluez votre reference de transfert pour accelerer la validation du
                    rechargement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {parsedTopUpAmount && parsedTopUpAmount > 0 ? (
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-3 text-xs text-cyan-700 backdrop-blur-sm dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
              Montant a soumettre:{' '}
              <strong className="text-cyan-700 dark:text-white">
                {formatAmount(parsedTopUpAmount, currency)}
              </strong>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-xs text-red-600 backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter className="mt-0 block border-t border-slate-200 bg-slate-50 pt-4 dark:border-slate-700 dark:bg-slate-800/50">
          <Button
            className="min-h-11 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:text-white disabled:opacity-50 disabled:hover:scale-100"
            variant="ghost"
            disabled={
              !parsedTopUpAmount ||
              parsedTopUpAmount <= 0 ||
              !transferReferenceIsValid ||
              submitting
            }
            aria-busy={submitting || undefined}
            onClick={onCreate}
          >
            {submitting ? <Spinner data-icon="inline-start" /> : null}
            Confirmer la recharge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
