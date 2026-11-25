import { Calendar, Check, CheckCircle2, Download, X } from 'lucide-react';

import { formatCurrency } from '@/shared/lib/i18n/formatting';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

import {
  getInvoiceStatusMeta,
  type CompletedAppointment,
  type Expense,
  type Invoice,
} from '@/features/transactions/provider-billing/providerBilling.hooks';

export function SelectOperationModal({
  additionalNotes,
  completedAppointments,
  exportBusy,
  onClose,
  onGenerate,
  onExportPreload,
  onNotesChange,
  onSelect,
  open,
  selectedOperation,
}: {
  additionalNotes: string;
  completedAppointments: CompletedAppointment[];
  exportBusy: boolean;
  onClose: () => void;
  onGenerate: () => void;
  onExportPreload: () => void;
  onNotesChange: (value: string) => void;
  onSelect: (operation: CompletedAppointment) => void;
  open: boolean;
  selectedOperation: CompletedAppointment | null;
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
      <DialogContent showCloseButton={false} size="xl" scroll="content">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Sélectionner une opération
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer la sélection d'opération"
              className="rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogClose>
        </DialogHeader>
        <DialogBody>
          {completedAppointments.length > 0 ? (
            <div className="mb-6 space-y-3">
              {completedAppointments.map((operation) => (
                <div
                  key={operation.id}
                  onClick={() => onSelect(operation)}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${selectedOperation?.id === operation.id ? 'border-ring bg-accent' : 'border-border bg-muted hover:border-border-strong'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{operation.patientName}</h3>
                        {selectedOperation?.id === operation.id ? (
                          <Check className="h-5 w-5 text-primary" />
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{operation.service}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground/70">
                          <Calendar className="h-3 w-3" />
                          {operation.date} à {operation.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(operation.amount, operation.currency, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground/70" />
              <p className="text-sm text-muted-foreground">Aucune opération terminée disponible</p>
            </div>
          )}

          {selectedOperation ? (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Notes additionnelles (optionnel)
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(event) => onNotesChange(event.target.value)}
                  rows={3}
                  placeholder="Ajoutez des informations supplémentaires si nécessaire..."
                  className="w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  aria-busy={exportBusy || undefined}
                  className="flex-1"
                  disabled={exportBusy}
                  onClick={onGenerate}
                  onFocus={onExportPreload}
                  onMouseEnter={onExportPreload}
                >
                  {exportBusy ? 'Generation...' : 'Générer la facture'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export function InvoiceDetailModal({
  exportBusy,
  invoice,
  onClose,
  onDownload,
  onExportPreload,
}: {
  exportBusy: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onDownload: (invoice: Invoice) => void;
  onExportPreload: () => void;
}) {
  if (!invoice) {
    return null;
  }

  const status = getInvoiceStatusMeta(invoice.status);

  return (
    <Dialog
      open={Boolean(invoice)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="lg" scroll="content">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Détails de la facture
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer les détails de la facture"
              className="rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogClose>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">N° Facture</p>
                <p className="font-mono font-bold text-foreground">{invoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold text-foreground">{invoice.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-semibold text-foreground">{invoice.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-semibold text-foreground">{invoice.patientPhone || '--'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paiement</p>
                <p className="font-semibold text-foreground">{invoice.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm text-muted-foreground">Service</p>
            <p className="font-semibold text-foreground">{invoice.service}</p>
            {invoice.paymentReferenceNumber ? (
              <p className="mt-2 font-mono text-xs text-muted-foreground/70">
                {invoice.paymentReferenceNumber}
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border border-warning/20 bg-warning/10 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Montant total</span>
              <span className="text-3xl font-bold text-warning">
                {formatCurrency(invoice.amount, invoice.currency, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              aria-busy={exportBusy || undefined}
              variant="outline"
              className="flex-1"
              disabled={exportBusy}
              onClick={() => onDownload(invoice)}
              onFocus={onExportPreload}
              onMouseEnter={onExportPreload}
            >
              <Download className="mr-2 h-4 w-4" />
              {exportBusy ? 'Export...' : 'Télécharger PDF'}
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export function ExpenseDetailModal({
  expense,
  onClose,
}: {
  expense: Expense | null;
  onClose: () => void;
}) {
  if (!expense) {
    return null;
  }

  return (
    <Dialog
      open={Boolean(expense)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="lg" scroll="content">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Détails de la dépense
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer les détails de la dépense"
              className="rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogClose>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">N° Dépense</p>
                <p className="font-mono font-bold text-foreground">{expense.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold text-foreground">{expense.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Catégorie</p>
                <p className="font-semibold text-foreground">{expense.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Justificatif</p>
                <p
                  className={`font-semibold ${expense.receipt ? 'text-success' : 'text-destructive'}`}
                >
                  {expense.receipt ? 'Oui' : 'Non'}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm text-muted-foreground">Description</p>
            <p className="font-semibold text-foreground">{expense.description}</p>
          </div>
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Montant</span>
              <span className="text-3xl font-bold text-destructive">
                {formatCurrency(expense.amount, 'TND', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
