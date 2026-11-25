import { ProviderRouteHeader } from '@/features/providers/shared/ui/ProviderRouteHeader';
import {
  type ProviderServiceFormValues,
  type ProviderServicePresetDraftOverrides,
} from '@/features/providers/providerServiceForm';
import { ProviderNewServiceFormPanel } from '@/features/providers/services/components/ProviderNewServiceFormPanel';
import { ProviderServicePresetsPanel } from '@/features/providers/services/components/ProviderServicePresetsPanel';
import { useProviderNewServiceFlow } from '@/features/providers/services/useProviderNewServiceFlow';

// eslint-disable-next-line react-refresh/only-export-components
export { buildCreatePayload } from '@/features/providers/providerServiceForm';
export type { ProviderServiceFormValues, ProviderServicePresetDraftOverrides };

export function ProviderNewServiceScreen() {
  const screen = useProviderNewServiceFlow();

  if (screen.contentState) {
    return screen.contentState;
  }

  const config = screen.config;

  if (!config) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderRouteHeader containerClassName="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${screen.configGradient}`}
          >
            <screen.Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Nouveau Service</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{config.title}</p>
          </div>
        </div>
      </ProviderRouteHeader>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProviderNewServiceFormPanel
              form={screen.form}
              fields={screen.effectiveFields}
              configGradient={screen.configGradient}
              lookupErrorMessage={screen.lookupErrorMessage}
              lookupStatusMessage={screen.lookupStatusMessage}
              onRetryLookups={screen.handleRetryLookups}
              onCancel={screen.onCancel}
              onEquipmentImageChange={screen.onEquipmentImageChange}
              onRetryEquipmentImageUpload={screen.onRetryEquipmentImageUpload}
              onSubmit={screen.onSubmit}
              equipmentImageFile={screen.equipmentImageFile}
              equipmentImagePreviewUrl={screen.equipmentImagePreviewUrl}
              equipmentImageRetryAvailable={screen.equipmentImageRetryAvailable}
              equipmentImageUploadError={screen.equipmentImageUploadError}
              isEquipmentProvider={screen.isEquipmentProvider}
              submitDisabled={screen.submitDisabled}
              submitLabel={screen.submitLabel}
            />
          </div>

          <div>
            <ProviderServicePresetsPanel
              presets={screen.presets}
              loading={screen.presetsLoading}
              description={screen.presetPanelDescription}
              onApply={screen.handlePresetApply}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
