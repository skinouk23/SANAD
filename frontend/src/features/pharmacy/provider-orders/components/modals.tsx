import { ExternalLink, FileText, Loader2, Upload, X } from 'lucide-react';

import type { ProviderPharmacyOrder } from '@/features/pharmacy';
import { useProviderPharmacyOrderPrescriptionContent } from '@/features/pharmacy/hooks';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

function getPrescriptionPreviewKind(
  contentType: string | null | undefined,
  fileName: string | null | undefined,
): 'image' | 'pdf' | 'fallback' {
  const normalizedContentType = contentType?.toLowerCase() ?? '';
  const normalizedFileName = fileName?.toLowerCase() ?? '';

  if (normalizedContentType.startsWith('image/')) {
    return 'image';
  }

  if (normalizedContentType === 'application/pdf' || normalizedFileName.endsWith('.pdf')) {
    return 'pdf';
  }

  return 'fallback';
}

export function ProviderPrescriptionModal({
  onClose,
  order,
  open,
}: {
  onClose: () => void;
  order: ProviderPharmacyOrder | null;
  open: boolean;
}) {
  const fileQuery = useProviderPharmacyOrderPrescriptionContent(open ? order?.id : null);

  if (!open || !order) {
    return null;
  }

  const previewKind = fileQuery.objectUrl
    ? getPrescriptionPreviewKind(fileQuery.contentType, fileQuery.fileName)
    : 'fallback';

  const openDownload = () => {
    if (!fileQuery.objectUrl) {
      return;
    }

    window.open(fileQuery.objectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="lg" scroll="content">
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-border pb-4">
          <DialogTitle className="font-bold text-foreground">
            Ordonnance - {order.patientName}
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer l'ordonnance"
              className="rounded-full p-1 transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        <DialogBody className="flex min-h-[320px] justify-center bg-muted p-4">
          {fileQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement de l'ordonnance...
            </div>
          ) : null}

          {fileQuery.error ? (
            <div className="flex max-w-md flex-col items-center justify-center gap-3 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Impossible de charger l'ordonnance.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void fileQuery.refetch();
                }}
              >
                Reessayer
              </Button>
            </div>
          ) : null}

          {fileQuery.objectUrl && previewKind === 'image' ? (
            <img
              src={fileQuery.objectUrl}
              alt="Ordonnance"
              className="max-h-[70vh] rounded object-contain shadow-lg"
            />
          ) : null}

          {fileQuery.objectUrl && previewKind === 'pdf' ? (
            <iframe
              title={`Ordonnance - ${order.patientName}`}
              src={fileQuery.objectUrl}
              className="h-[70vh] w-full rounded border border-border bg-background shadow-lg"
            />
          ) : null}

          {fileQuery.objectUrl && previewKind === 'fallback' ? (
            <div className="flex max-w-md flex-col items-center justify-center gap-3 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Le format de ce document ne peut pas etre previsualise dans l'application.
              </p>
              <Button type="button" onClick={openDownload}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir le document
              </Button>
            </div>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export function ProviderDeliveryPreparationModal({
  amount,
  onAmountChange,
  onClose,
  onConfirm,
  open,
}: {
  amount: string;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
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
      <DialogContent showCloseButton={false} size="md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Preparer la livraison
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Montant total des medicaments (TND)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0.000"
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Facture / Ticket de caisse
            </label>
            <div className="cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted p-6 text-center transition-colors hover:border-border-strong">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cliquez pour ajouter une photo</p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch [&>*]:flex-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button
            className="flex-1 bg-success text-success-foreground hover:bg-success/90"
            onClick={onConfirm}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
