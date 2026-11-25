import type { FormEventHandler } from 'react';
import { Save } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import {
  ProviderServiceAuthoringFields,
  type ProviderServiceFormValues,
} from '@/features/providers/providerServiceForm';
import { FormActions, FormField, FormStatusMessage } from '@/shared/ui/composites/form-field';
import type { ServiceView } from '@/features/providers/services/serviceManagement.types';
import { ProviderEquipmentMainImageField } from './ProviderEquipmentMainImageField';
import { ProviderServiceDialogShell } from './ProviderServiceDialogShell';

interface ProviderServiceEditModalProps {
  open: boolean;
  selectedService: ServiceView | null;
  primaryFields: Parameters<typeof ProviderServiceAuthoringFields>[0]['fields'];
  extraFields: Parameters<typeof ProviderServiceAuthoringFields>[0]['fields'];
  form: UseFormReturn<ProviderServiceFormValues>;
  equipmentImageFile: File | null;
  equipmentImagePreviewUrl: string | null;
  equipmentImageRetryAvailable: boolean;
  equipmentImageUploadError: string | null;
  isEquipmentProvider: boolean;
  submitDisabled: boolean;
  onClose: () => void;
  onEquipmentImageChange: (file: File | null) => void;
  onRetryEquipmentImageUpload: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

function ProviderServiceExtraFieldsSection({
  extraFields,
  form,
}: {
  extraFields: Parameters<typeof ProviderServiceAuthoringFields>[0]['fields'];
  form: UseFormReturn<ProviderServiceFormValues>;
}) {
  if (extraFields.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
      <FormField
        label="Services inclus"
        labelClassName="mb-2 block text-xs font-medium normal-case tracking-normal text-slate-700 dark:text-slate-300"
      />
      <ProviderServiceAuthoringFields fields={extraFields} form={form} includeEmptyOption={false} />
    </div>
  );
}

export function ProviderServiceEditModal({
  open,
  selectedService,
  primaryFields,
  extraFields,
  form,
  equipmentImageFile,
  equipmentImagePreviewUrl,
  equipmentImageRetryAvailable,
  equipmentImageUploadError,
  isEquipmentProvider,
  submitDisabled,
  onClose,
  onEquipmentImageChange,
  onRetryEquipmentImageUpload,
  onSubmit,
}: ProviderServiceEditModalProps) {
  if (!selectedService) {
    return null;
  }

  return (
    <ProviderServiceDialogShell
      open={open}
      onClose={onClose}
      title="Modifier le service"
      size="md"
      scroll="content"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <ProviderServiceAuthoringFields
          fields={primaryFields}
          form={form}
          includeEmptyOption={false}
        />

        <ProviderServiceExtraFieldsSection extraFields={extraFields} form={form} />

        {isEquipmentProvider ? (
          <ProviderEquipmentMainImageField
            currentImageUrl={selectedService.imageUrl}
            disabled={submitDisabled}
            file={equipmentImageFile}
            inputId={`provider-edit-equipment-main-image-${selectedService.id}`}
            previewUrl={equipmentImagePreviewUrl}
            retryAvailable={equipmentImageRetryAvailable}
            onChange={onEquipmentImageChange}
            onRetry={onRetryEquipmentImageUpload}
          />
        ) : null}

        {equipmentImageUploadError ? (
          <FormStatusMessage role="alert">{equipmentImageUploadError}</FormStatusMessage>
        ) : null}

        <FormActions className="mt-6">
          <button
            type="button"
            disabled={submitDisabled}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitDisabled}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </FormActions>
      </form>
    </ProviderServiceDialogShell>
  );
}
