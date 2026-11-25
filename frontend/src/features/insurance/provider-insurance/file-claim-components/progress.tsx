import { StepProgress } from '@/shared/ui/composites/step-progress';

const FILE_CLAIM_PROGRESS_STEPS = [
  { number: 1, title: 'Détails' },
  { number: 2, title: 'Description' },
  { number: 3, title: 'Pièces jointes' },
] as const;

export function ProviderFileClaimProgress({ step }: { step: number }) {
  if (step >= 4) {
    return null;
  }

  return (
    <StepProgress
      className="mb-6"
      currentStep={step}
      steps={FILE_CLAIM_PROGRESS_STEPS}
      variant="track"
    />
  );
}
