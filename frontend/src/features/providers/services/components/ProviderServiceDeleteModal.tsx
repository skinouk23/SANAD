import { ConfirmDialog } from '@/shared/ui/composites/confirm-dialog';
import type { ServiceView } from '@/features/providers/services/serviceManagement.types';

interface ProviderServiceDeleteModalProps {
  open: boolean;
  selectedService: ServiceView | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProviderServiceDeleteModal({
  open,
  selectedService,
  onClose,
  onConfirm,
}: ProviderServiceDeleteModalProps) {
  return (
    <ConfirmDialog
      open={open && Boolean(selectedService)}
      title="Supprimer le service ?"
      description={
        selectedService
          ? `Êtes-vous sûr de vouloir supprimer "${selectedService.name}" ? Cette action est irréversible.`
          : undefined
      }
      confirmLabel="Supprimer"
      cancelLabel="Annuler"
      destructive
      onConfirm={onConfirm}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    />
  );
}
