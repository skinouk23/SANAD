import { AlertCircle, RefreshCw, Save } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormEventHandler } from 'react';

import {
  ProviderServiceAuthoringFields,
  type ProviderServiceFormValues,
} from '@/features/providers/providerServiceForm';
import { FormActions, FormStatusMessage } from '@/shared/ui/composites/form-field';
import { ProviderEquipmentMainImageField } from './ProviderEquipmentMainImageField';

interface ProviderNewServiceFormPanelProps {
  form: UseFormReturn<ProviderServiceFormValues>;
  fields: Parameters<typeof ProviderServiceAuthoringFields>[0]['fields'];
  configGradient: string;
  lookupErrorMessage: string | null;
  lookupStatusMessage: string | null;
  onRetryLookups: () => Promise<void>;
  onCancel: () => void;
  onEquipmentImageChange: (file: File | null) => void;
  onRetryEquipmentImageUpload: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  equipmentImageFile: File | null;
  equipmentImagePreviewUrl: string | null;
  equipmentImageRetryAvailable: boolean;
  equipmentImageUploadError: string | null;
  isEquipmentProvider: boolean;
  submitDisabled: boolean;
  submitLabel: string;
}

export function ProviderNewServiceFormPanel({
  form,
  fields,
  configGradient,
  lookupErrorMessage,
  lookupStatusMessage,
  onRetryLookups,
  onCancel,
  onEquipmentImageChange,
  onRetryEquipmentImageUpload,
  onSubmit,
  equipmentImageFile,
  equipmentImagePreviewUrl,
  equipmentImageRetryAvailable,
  equipmentImageUploadError,
  isEquipmentProvider,
  submitDisabled,
  submitLabel,
}: ProviderNewServiceFormPanelProps) {
  return (
    <form
      className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-4"
      onSubmit={onSubmit}
    >
      {lookupErrorMessage ? (
        <FormStatusMessage
          className="mb-4 border-red-200 bg-red-50/80 text-red-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500 dark:text-rose-300" />
              <span>{lookupErrorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                void onRetryLookups();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-rose-400/30 dark:text-rose-200 dark:hover:bg-rose-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réessayer
            </button>
          </div>
        </FormStatusMessage>
      ) : null}

      {lookupStatusMessage ? (
        <FormStatusMessage
          className="mb-4 border-cyan-200 bg-cyan-50/80 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200"
          role="status"
          tone="info"
        >
          {lookupStatusMessage}
        </FormStatusMessage>
      ) : null}

      <ProviderServiceAuthoringFields fields={fields} form={form} />

      {isEquipmentProvider ? (
        <ProviderEquipmentMainImageField
          disabled={submitDisabled}
          file={equipmentImageFile}
          inputId="provider-new-equipment-main-image"
          previewUrl={equipmentImagePreviewUrl}
          retryAvailable={equipmentImageRetryAvailable}
          onChange={onEquipmentImageChange}
          onRetry={onRetryEquipmentImageUpload}
        />
      ) : null}

      {equipmentImageUploadError ? (
        <FormStatusMessage className="mt-4" role="alert">
          {equipmentImageUploadError}
        </FormStatusMessage>
      ) : null}

      <FormActions className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitDisabled}
          className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${configGradient} px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50`}
        >
          <Save className="h-3.5 w-3.5" />
          {submitLabel}
        </button>
      </FormActions>
    </form>
  );
}
