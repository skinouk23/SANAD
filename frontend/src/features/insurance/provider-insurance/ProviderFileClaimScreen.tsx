import { useProviderFileClaimScreen } from './providerFileClaim.hooks';
import {
  ClaimAttachmentsStep,
  ClaimDescriptionStep,
  ClaimDetailsStep,
  ClaimSuccessStep,
  ProviderFileClaimHeader,
  ProviderFileClaimProgress,
} from './providerFileClaim.sections';

export function FileClaim() {
  const screen = useProviderFileClaimScreen();

  return (
    <div className="min-h-screen pb-24">
      <ProviderFileClaimHeader onBack={() => screen.navigate('/provider/insurance')} />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-8 sm:px-6">
        <ProviderFileClaimProgress step={screen.step} />
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-8">
          {screen.step === 1 ? (
            <ClaimDetailsStep
              formData={screen.formData}
              inputClass={screen.inputClass}
              labelClass={screen.labelClass}
              onNext={() => screen.setStep(2)}
              onUpdate={screen.updateField}
            />
          ) : null}
          {screen.step === 2 ? (
            <ClaimDescriptionStep
              formData={screen.formData}
              inputClass={screen.inputClass}
              isSubmitting={screen.isSubmitting}
              labelClass={screen.labelClass}
              onBack={() => screen.setStep(1)}
              onNext={() => screen.setStep(3)}
              onUpdate={screen.updateField}
            />
          ) : null}
          {screen.step === 3 ? (
            <ClaimAttachmentsStep
              fileError={screen.fileError}
              files={screen.files}
              handleFileChange={screen.handleFileChange}
              isSubmitting={screen.isSubmitting}
              onBack={() => screen.setStep(2)}
              onRemoveFile={screen.removeFile}
              onSubmit={() => void screen.handleSubmit()}
              submitError={screen.submitError}
            />
          ) : null}
          {screen.step === 4 ? (
            <ClaimSuccessStep onReturn={() => screen.navigate('/provider/insurance')} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
