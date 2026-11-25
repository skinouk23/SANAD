import {
  CampaignBasicsStep,
  CampaignBudgetStep,
  CampaignContentStep,
  CampaignReviewStep,
  NewCampaignHeader,
  NewCampaignProgress,
} from './newCampaign.sections';
import { useNewCampaignScreen } from './newCampaign.hooks';

export function NewCampaign() {
  const screen = useNewCampaignScreen();

  return (
    <div className="min-h-screen pb-20">
      <NewCampaignHeader />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <NewCampaignProgress currentStep={screen.currentStep} steps={screen.steps} />

        {screen.currentStep === 1 ? (
          <CampaignBasicsStep
            campaignObjectives={screen.campaignObjectives}
            campaignTypes={screen.campaignTypes}
            formData={screen.formData}
            inputClass={screen.inputClass}
            onNext={screen.handleNext}
            onObjectiveChange={screen.setObjective}
            onTypeChange={screen.setType}
            onUpdateField={screen.updateField}
          />
        ) : null}

        {screen.currentStep === 2 ? (
          <CampaignBudgetStep
            campaignInterests={screen.campaignInterests}
            formData={screen.formData}
            inputClass={screen.inputClass}
            onBack={screen.handleBack}
            onNext={screen.handleNext}
            onToggleInterest={screen.toggleInterest}
            onUpdateField={screen.updateField}
            onUpdateTargetAudience={screen.updateTargetAudience}
          />
        ) : null}

        {screen.currentStep === 3 ? (
          <CampaignContentStep
            formData={screen.formData}
            inputClass={screen.inputClass}
            onBack={screen.handleBack}
            onNext={screen.handleNext}
            onUpdateContent={screen.updateContent}
          />
        ) : null}

        {screen.currentStep === 4 ? (
          <CampaignReviewStep
            formData={screen.formData}
            onBack={screen.handleBack}
            onSubmit={screen.handleSubmit}
          />
        ) : null}
      </div>
    </div>
  );
}
