import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Image as ImageIcon,
  Megaphone,
  Sparkles,
} from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/primitives/radio-group';
import { DatePickerField } from '@/shared/ui/composites/date-picker-field';
import { StepProgress } from '@/shared/ui/composites/step-progress';

import type {
  CampaignObjectiveDefinition,
  CampaignStepDefinition,
  CampaignTypeDefinition,
  NewCampaignFormData,
} from './newCampaign.hooks';

const LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300';
const MUTED_TEXT_CLASS = 'text-slate-600 dark:text-slate-400';
const SECTION_TITLE_CLASS = 'mb-4 text-base font-bold text-slate-900 dark:text-white sm:text-lg';

function getCampaignControlId(prefix: string, value: string): string {
  return `${prefix}-${value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;
}

export function NewCampaignHeader() {
  return (
    <ProviderRouteHeader containerClassName="mx-auto max-w-4xl px-4 py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 sm:h-10 sm:w-10">
          <Megaphone className="h-4 w-4 text-white sm:h-5 sm:w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Nouvelle campagne
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Configurez votre campagne marketing
          </p>
        </div>
      </div>
    </ProviderRouteHeader>
  );
}

export function NewCampaignProgress({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: CampaignStepDefinition[];
}) {
  return (
    <StepProgress
      className="mb-4 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
      currentStep={currentStep}
      steps={steps}
      variant="inline"
    />
  );
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
      {children}
    </div>
  );
}

function StepFooter({
  onBack,
  onNext,
  nextLabel = 'Suivant',
  submit,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  submit?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
      {onBack ? (
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-200 bg-slate-200/80 px-3 py-2 text-sm font-medium text-slate-900 transition-all hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-700/80 dark:text-white dark:hover:border-cyan-500 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
        >
          Retour
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 ${submit ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
      >
        {submit ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
        {nextLabel}
        {!submit ? <ChevronRight className="h-3.5 w-3.5" /> : null}
      </button>
    </div>
  );
}

export function CampaignBasicsStep({
  campaignObjectives,
  campaignTypes,
  formData,
  inputClass,
  onNext,
  onObjectiveChange,
  onTypeChange,
  onUpdateField,
}: {
  campaignObjectives: CampaignObjectiveDefinition[];
  campaignTypes: CampaignTypeDefinition[];
  formData: NewCampaignFormData;
  inputClass: string;
  onNext: () => void;
  onObjectiveChange: (objective: NewCampaignFormData['objective']) => void;
  onTypeChange: (type: NewCampaignFormData['type']) => void;
  onUpdateField: <Key extends keyof NewCampaignFormData>(
    key: Key,
    value: NewCampaignFormData[Key],
  ) => void;
}) {
  return (
    <StepContainer>
      <h2 className={SECTION_TITLE_CLASS}>Informations de base</h2>

      <div className="space-y-4">
        <div>
          <label className={LABEL_CLASS}>Nom de la campagne *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => onUpdateField('name', event.target.value)}
            placeholder="Ex: Promotion Soins à Domicile - Février"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
            Type de campagne *
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {campaignTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`rounded-lg border-2 p-3 text-left transition-all ${formData.type === type.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br ${type.gradient}`}
                  >
                    <type.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {type.name}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
            Objectif *
          </label>
          <RadioGroup
            className="flex flex-col gap-1.5"
            value={formData.objective}
            onValueChange={(value) => onObjectiveChange(value as NewCampaignFormData['objective'])}
          >
            {campaignObjectives.map((objective) => {
              const objectiveId = getCampaignControlId('campaign-objective', objective.id);

              return (
                <div
                  key={objective.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 p-2.5 transition-all ${formData.objective === objective.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
                  onClick={() => onObjectiveChange(objective.id)}
                >
                  <RadioGroupItem
                    id={objectiveId}
                    value={objective.id}
                    className="size-3.5 border-slate-300 text-cyan-500 dark:border-slate-600"
                  />
                  <label htmlFor={objectiveId} className="cursor-pointer">
                    <p className="text-xs font-medium text-slate-900 dark:text-white">
                      {objective.name}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">
                      {objective.description}
                    </p>
                  </label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DatePickerField
            id="campaign-start-date"
            label="Date de début *"
            value={formData.startDate}
            onChange={(value) => onUpdateField('startDate', value)}
            className="gap-1.5"
            labelClassName={LABEL_CLASS}
            triggerClassName={`${inputClass} h-10`}
            required
          />
          <DatePickerField
            id="campaign-end-date"
            label="Date de fin *"
            value={formData.endDate}
            onChange={(value) => onUpdateField('endDate', value)}
            className="gap-1.5"
            labelClassName={LABEL_CLASS}
            triggerClassName={`${inputClass} h-10`}
            required
          />
        </div>
      </div>

      <StepFooter onNext={onNext} />
    </StepContainer>
  );
}

export function CampaignBudgetStep({
  campaignInterests,
  formData,
  inputClass,
  onBack,
  onNext,
  onToggleInterest,
  onUpdateField,
  onUpdateTargetAudience,
}: {
  campaignInterests: string[];
  formData: NewCampaignFormData;
  inputClass: string;
  onBack: () => void;
  onNext: () => void;
  onToggleInterest: (interest: string) => void;
  onUpdateField: <Key extends keyof NewCampaignFormData>(
    key: Key,
    value: NewCampaignFormData[Key],
  ) => void;
  onUpdateTargetAudience: (
    key: keyof NewCampaignFormData['targetAudience'],
    value: string | string[],
  ) => void;
}) {
  return (
    <StepContainer>
      <h2 className={SECTION_TITLE_CLASS}>Budget et ciblage</h2>

      <div className="space-y-4">
        <div>
          <label className={LABEL_CLASS}>Budget total (TND) *</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              value={formData.budget}
              onChange={(event) => onUpdateField('budget', event.target.value)}
              placeholder="150"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Estimation de portée
              </p>
              <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                Avec {formData.budget || '0'} TND, vous pouvez atteindre environ{' '}
                {Math.round((Number(formData.budget) || 0) * 80)} personnes
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
            Tranche d'âge
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] text-slate-500 dark:text-slate-400">
                Âge minimum
              </label>
              <input
                type="number"
                value={formData.targetAudience.ageMin}
                onChange={(event) => onUpdateTargetAudience('ageMin', event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-slate-500 dark:text-slate-400">
                Âge maximum
              </label>
              <input
                type="number"
                value={formData.targetAudience.ageMax}
                onChange={(event) => onUpdateTargetAudience('ageMax', event.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
            Centres d'intérêt
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {campaignInterests.map((interest, index) => {
              const isSelected = formData.targetAudience.interests.includes(interest);
              const interestId = getCampaignControlId('campaign-interest', `${index}-${interest}`);

              return (
                <div
                  key={interest}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg border p-2 text-[10px] transition-all sm:text-xs ${isSelected ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-white' : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'}`}
                >
                  <Checkbox
                    id={interestId}
                    checked={isSelected}
                    className="size-3 border-slate-300 text-cyan-500 dark:border-slate-600"
                    onCheckedChange={() => onToggleInterest(interest)}
                  />
                  <label htmlFor={interestId} className="min-w-0 flex-1 cursor-pointer truncate">
                    {interest}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} />
    </StepContainer>
  );
}

export function CampaignContentStep({
  formData,
  inputClass,
  onBack,
  onNext,
  onUpdateContent,
}: {
  formData: NewCampaignFormData;
  inputClass: string;
  onBack: () => void;
  onNext: () => void;
  onUpdateContent: (key: keyof NewCampaignFormData['content'], value: string) => void;
}) {
  return (
    <StepContainer>
      <h2 className={SECTION_TITLE_CLASS}>Contenu de la campagne</h2>

      <div className="space-y-4">
        <div>
          <label className={LABEL_CLASS}>Titre principal *</label>
          <input
            type="text"
            value={formData.content.headline}
            onChange={(event) => onUpdateContent('headline', event.target.value)}
            placeholder="Ex: Soins infirmiers à domicile - 15% de réduction"
            maxLength={60}
            className={inputClass}
          />
          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
            {formData.content.headline.length}/60
          </p>
        </div>

        <div>
          <label className={LABEL_CLASS}>Description *</label>
          <textarea
            value={formData.content.description}
            onChange={(event) => onUpdateContent('description', event.target.value)}
            placeholder="Décrivez votre offre en détail..."
            rows={3}
            maxLength={200}
            className={`${inputClass} resize-none`}
          />
          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
            {formData.content.description.length}/200
          </p>
        </div>

        <div>
          <label className={LABEL_CLASS}>Appel à l'action *</label>
          <input
            type="text"
            value={formData.content.cta}
            onChange={(event) => onUpdateContent('cta', event.target.value)}
            placeholder="Ex: Réserver maintenant"
            maxLength={30}
            className={inputClass}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Image</label>
          <div className="group cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-cyan-500 dark:border-slate-600 dark:hover:border-cyan-500 sm:p-6">
            <ImageIcon className="mx-auto mb-2 h-8 w-8 text-slate-400 transition-colors group-hover:text-cyan-500 dark:text-slate-500" />
            <p className="mb-0.5 text-xs font-medium text-slate-900 dark:text-white">
              Cliquez pour télécharger
            </p>
            <p className="text-[10px] text-slate-500">PNG, JPG • 1200x628px</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/50">
          <p className={`mb-2 text-xs font-medium ${MUTED_TEXT_CLASS}`}>Aperçu</p>
          <div className="rounded-md border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="mb-2 flex h-24 w-full items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700">
              <ImageIcon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="mb-1 text-xs font-bold text-slate-900 dark:text-white">
              {formData.content.headline || 'Votre titre ici'}
            </h3>
            <p className="mb-2 text-[10px] text-slate-600 dark:text-slate-400">
              {formData.content.description || 'Votre description apparaîtra ici'}
            </p>
            <button className="w-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 py-1.5 text-xs font-semibold text-white">
              {formData.content.cta || "Appel à l'action"}
            </button>
          </div>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} />
    </StepContainer>
  );
}

export function CampaignReviewStep({
  formData,
  onBack,
  onSubmit,
}: {
  formData: NewCampaignFormData;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <StepContainer>
      <h2 className={SECTION_TITLE_CLASS}>Révision et lancement</h2>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { label: 'Nom', value: formData.name },
            {
              label: 'Type',
              value: formData.type === 'social' ? 'Réseaux sociaux' : 'Email marketing',
            },
            { label: 'Période', value: `${formData.startDate} - ${formData.endDate}` },
            { label: 'Budget', value: `${formData.budget} TND` },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 dark:border-slate-700 dark:bg-slate-900/50"
            >
              <p className="mb-0.5 text-[10px] text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="text-xs font-medium text-slate-900 dark:text-white">
                {item.value || '-'}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-cyan-200 bg-cyan-50/80 p-3 dark:border-cyan-500/30 dark:bg-cyan-500/10">
          <p className="mb-1.5 text-xs font-semibold text-slate-900 dark:text-white">Ciblage</p>
          <div className="space-y-0.5 text-[10px] text-slate-600 dark:text-slate-300">
            <p>
              • Âge: {formData.targetAudience.ageMin}-{formData.targetAudience.ageMax} ans
            </p>
            <p>
              • Intérêts:{' '}
              {formData.targetAudience.interests.length > 0
                ? formData.targetAudience.interests.join(', ')
                : 'Aucun'}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-cyan-200 bg-cyan-50/80 p-3 dark:border-cyan-500/30 dark:bg-cyan-500/10">
          <p className="mb-1.5 text-xs font-semibold text-slate-900 dark:text-white">Contenu</p>
          <div className="space-y-0.5 text-[10px] text-slate-600 dark:text-slate-300">
            <p>
              <strong>Titre:</strong> {formData.content.headline}
            </p>
            <p>
              <strong>Description:</strong> {formData.content.description}
            </p>
            <p>
              <strong>CTA:</strong> {formData.content.cta}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Avant de lancer
              </p>
              <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                Vérifiez que toutes les informations sont correctes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onSubmit} nextLabel="Lancer la campagne" submit />
    </StepContainer>
  );
}
