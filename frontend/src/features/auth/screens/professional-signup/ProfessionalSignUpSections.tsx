import {
  Award,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Star,
  User,
  Upload,
  X,
} from 'lucide-react';
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import {
  AuthCheckboxField,
  AuthInputField,
  AuthSelectField,
  PasswordStrengthMeter,
  PasswordToggle,
} from '@/features/auth/components/AuthFormControls';
import type { AuthProviderServiceOption } from '@/features/auth/config/authCatalog';
import { getErrorMessage, sanitizeTextValue } from '@/features/auth/screens/authFlow.helpers';
import type { ProfessionalPlanOption } from '@/features/auth/screens/professional-signup/professionalSignUp.config';
import type { ProfessionalSignUpFormValues } from '@/features/auth/schema';
import type { NutritionProviderSubtype, ProviderCategory } from '@/features/providers';
import type { TranslationKeys } from '@/i18n/types';
import { cn } from '@/shared/lib/utils';
import { FormField, FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import { TUNISIA_PHONE_PLACEHOLDER } from '@/utils/input-validation';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/ui/primitives/field';
import { Switch } from '@/shared/ui/primitives/switch';

const professionalLabelClassName =
  'mb-1 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400';

const professionalInputClassName =
  'rounded-lg border-slate-300 bg-white text-sm text-slate-900 focus-within:border-cyan-500 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white';

const professionalGlassPanelClassName =
  'rounded-2xl border border-cyan-400/20 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-slate-900/50';

const professionalDocumentAccept = '.pdf,.jpg,.jpeg,.png';

interface FileUploadTriggerProps {
  fileName: string;
  id: string;
  onChange: (file: File | null) => void;
  placeholder: string;
}

function FileUploadTrigger({ fileName, id, onChange, placeholder }: FileUploadTriggerProps) {
  const hasFile = Boolean(fileName);

  return (
    <div className="relative">
      <input
        accept={professionalDocumentAccept}
        className="hidden"
        id={id}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        type="file"
      />

      <label
        className={cn(
          'flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-all',
          hasFile
            ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-600 shadow-emerald-500/10 dark:text-emerald-300'
            : 'border-cyan-400/35 bg-white/70 text-slate-500 hover:border-cyan-400 hover:bg-cyan-50/70 hover:text-cyan-600 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-cyan-950/25 dark:hover:text-cyan-300',
        )}
        htmlFor={id}
      >
        <Upload className="h-4 w-4" />
        <span className="truncate">{fileName || placeholder}</span>
      </label>
    </div>
  );
}

export function ProfessionalSignUpStepper({
  step,
  t,
}: {
  step: 1 | 2 | 3 | 4;
  t: TranslationKeys;
}) {
  return (
    <div className="mb-5 flex items-center justify-center">
      <div className="flex items-center gap-1.5 sm:gap-3">
        {[
          { label: t.signup.stepInformation, num: 1 },
          { label: t.signup.stepServices, num: 2 },
          { label: t.signup.stepDocuments, num: 3 },
          { label: 'Abonnement', num: 4 },
        ].map((stepItem, index) => (
          <div className="contents" key={stepItem.num}>
            <div
              className={cn(
                'flex flex-col items-center gap-0.5 transition-colors',
                step >= stepItem.num
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-slate-400 dark:text-slate-500',
              )}
            >
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-all',
                  step >= stepItem.num
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-cyan-500/25'
                    : 'border border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500',
                )}
              >
                {step > stepItem.num ? <CheckCircle2 className="h-4 w-4" /> : stepItem.num}
              </div>
              <span className="hidden text-[9px] font-semibold sm:block">{stepItem.label}</span>
            </div>

            {index < 3 ? (
              <div
                className={cn(
                  'h-0.5 w-6 rounded-full sm:w-10',
                  step > stepItem.num
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    : 'bg-slate-200 dark:bg-slate-700',
                )}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProfessionalAccountStepProps {
  clearSubmitError: () => void;
  errors: FieldErrors<ProfessionalSignUpFormValues>;
  hasPassword: boolean;
  passwordStrengthScore: number;
  register: UseFormRegister<ProfessionalSignUpFormValues>;
  setValue: UseFormSetValue<ProfessionalSignUpFormValues>;
  showPassword: boolean;
  t: TranslationKeys;
  togglePassword: () => void;
  useSameAccount: boolean;
}

export function ProfessionalAccountStep({
  clearSubmitError,
  errors,
  hasPassword,
  passwordStrengthScore,
  register,
  setValue,
  showPassword,
  t,
  togglePassword,
  useSameAccount,
}: ProfessionalAccountStepProps) {
  return (
    <FieldGroup className="gap-4">
      <Field
        className="rounded-2xl border border-cyan-400/20 bg-cyan-50/50 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-cyan-950/20"
        orientation="horizontal"
      >
        <FieldContent className="gap-1">
          <FieldLabel
            className="text-sm font-semibold text-slate-900 dark:text-white"
            htmlFor="professional-use-same-account"
          >
            Utiliser le même compte patient
          </FieldLabel>
          <FieldDescription className="text-xs text-slate-500 dark:text-slate-400">
            Pré-remplir avec votre compte existant
          </FieldDescription>
        </FieldContent>

        <Switch
          aria-label="Utiliser le même compte patient"
          checked={useSameAccount}
          id="professional-use-same-account"
          onCheckedChange={(checked) => {
            clearSubmitError();
            setValue('useSameAccount', checked, {
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
        />
      </Field>

      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthInputField
          autoComplete="given-name"
          error={errors.firstName?.message}
          icon={<User />}
          id="professional-first-name"
          label={t.signup.firstName}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder={t.signup.firstName}
          required
          {...register('firstName', {
            onChange: clearSubmitError,
            setValueAs: sanitizeTextValue,
          })}
        />

        <AuthInputField
          autoComplete="family-name"
          error={errors.lastName?.message}
          id="professional-last-name"
          label={t.signup.lastName}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder={t.signup.lastName}
          required
          {...register('lastName', {
            onChange: clearSubmitError,
            setValueAs: sanitizeTextValue,
          })}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthInputField
          autoComplete="email"
          error={errors.email?.message}
          icon={<Mail />}
          id="professional-email"
          label={t.auth.email}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder="votre@email.com"
          required
          type="email"
          {...register('email', {
            onChange: clearSubmitError,
            setValueAs: sanitizeTextValue,
          })}
        />

        <AuthInputField
          autoComplete="tel"
          error={errors.phone?.message}
          icon={<Phone />}
          id="professional-phone"
          label={t.signup.phone}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder={TUNISIA_PHONE_PLACEHOLDER}
          required
          type="tel"
          {...register('phone', { onChange: clearSubmitError })}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthInputField
          error={errors.city?.message}
          icon={<MapPin />}
          id="professional-city"
          label={t.signup.city}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder={t.signup.city}
          required
          {...register('city', {
            onChange: clearSubmitError,
            setValueAs: sanitizeTextValue,
          })}
        />

        <AuthInputField
          autoComplete="street-address"
          error={errors.address?.message}
          icon={<MapPin />}
          id="professional-address"
          label={`${t.signup.address} (optionnelle)`}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder="Rue, quartier, bâtiment"
          hint="Vous pourrez préciser votre position exacte plus tard depuis le tableau de bord."
          {...register('address', {
            onChange: clearSubmitError,
            setValueAs: sanitizeTextValue,
          })}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthInputField
          error={errors.experience?.message}
          id="professional-experience"
          label={t.signup.yearsExperience}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder="0"
          required
          type="number"
          {...register('experience', { onChange: clearSubmitError })}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <AuthInputField
            autoComplete="new-password"
            endAdornment={<PasswordToggle onToggle={togglePassword} visible={showPassword} />}
            error={errors.password?.message}
            icon={<Lock />}
            id="professional-password"
            label={t.auth.password}
            labelClassName={professionalLabelClassName}
            contentClassName={professionalInputClassName}
            placeholder="••••••••"
            required
            type={showPassword ? 'text' : 'password'}
            {...register('password', { onChange: clearSubmitError })}
          />
          <PasswordStrengthMeter empty={!hasPassword} score={passwordStrengthScore} />
        </div>

        <AuthInputField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          icon={<Lock />}
          id="professional-confirm-password"
          label={t.signup.confirmPassword}
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          placeholder="••••••••"
          required
          type={showPassword ? 'text' : 'password'}
          {...register('confirmPassword', { onChange: clearSubmitError })}
        />
      </FieldGroup>
    </FieldGroup>
  );
}

interface ProfessionalServiceStepProps {
  availableServices: AuthProviderServiceOption[];
  clearSubmitError: () => void;
  errors: FieldErrors<ProfessionalSignUpFormValues>;
  isNutritionProvider: boolean;
  nutritionProviderSubtype: NutritionProviderSubtype | '';
  nutritionSubtypeOptions: Array<{ label: string; value: NutritionProviderSubtype }>;
  onSelectNutritionSubtype: (value: NutritionProviderSubtype) => void;
  onSelectServiceType: (serviceType: ProviderCategory) => void;
  selectedServiceType: ProfessionalSignUpFormValues['serviceType'];
  t: TranslationKeys;
}

export function ProfessionalServiceStep({
  availableServices,
  clearSubmitError: _clearSubmitError,
  errors,
  isNutritionProvider,
  nutritionProviderSubtype,
  nutritionSubtypeOptions,
  onSelectNutritionSubtype,
  onSelectServiceType,
  selectedServiceType,
  t,
}: ProfessionalServiceStepProps) {
  return (
    <FieldGroup className="gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t.signup.selectServices}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sélectionnez la catégorie principale qui décrit votre activité. Une seule catégorie peut
          être publiée lors de l&apos;inscription.
        </p>
      </div>

      <div className="grid max-h-[280px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
        {availableServices.map((service) => {
          const isSelected = selectedServiceType === service.serviceType;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                'group rounded-xl border px-2.5 py-3 text-center shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5',
                isSelected
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 shadow-cyan-500/20 ring-1 ring-cyan-400/30 dark:from-cyan-400/15 dark:to-blue-500/15'
                  : 'border-slate-200 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/60 dark:border-slate-700 dark:bg-slate-800/45 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/25',
              )}
              key={service.serviceType}
              onClick={() => onSelectServiceType(service.serviceType)}
              type="button"
            >
              <div className="mb-1 flex items-center justify-center gap-1">
                <span className="text-lg transition-transform group-hover:scale-110">
                  {service.icon}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
                ) : null}
              </div>
              <div className="text-[10px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-cyan-700 dark:text-slate-200 dark:group-hover:text-cyan-300">
                {service.label}
              </div>
            </button>
          );
        })}
      </div>

      {errors.serviceType?.message ? (
        <FormStatusMessage>{errors.serviceType.message}</FormStatusMessage>
      ) : null}

      {isNutritionProvider ? (
        <AuthSelectField
          error={errors.nutritionProviderSubtype?.message}
          id="professional-nutrition-subtype"
          label="Sous-type nutrition"
          labelClassName={professionalLabelClassName}
          contentClassName={professionalInputClassName}
          options={[
            { label: 'Sélectionnez un sous-type nutrition', value: '' },
            ...nutritionSubtypeOptions,
          ]}
          required
          value={nutritionProviderSubtype}
          onChange={(event) => {
            onSelectNutritionSubtype(event.target.value as NutritionProviderSubtype);
          }}
        />
      ) : null}
    </FieldGroup>
  );
}

interface ProfessionalDocumentsStepProps {
  certificationFields: FieldArrayWithId<ProfessionalSignUpFormValues, 'certifications', 'id'>[];
  certifications: ProfessionalSignUpFormValues['certifications'];
  clearSubmitError: () => void;
  diplomaFields: FieldArrayWithId<ProfessionalSignUpFormValues, 'diplomas', 'id'>[];
  diplomas: ProfessionalSignUpFormValues['diplomas'];
  errors: FieldErrors<ProfessionalSignUpFormValues>;
  identityFileName: string;
  licenseFileName: string;
  onAddCertification: () => void;
  onAddDiploma: () => void;
  onRemoveCertification: (index: number) => void;
  onRemoveDiploma: (index: number) => void;
  register: UseFormRegister<ProfessionalSignUpFormValues>;
  setValue: UseFormSetValue<ProfessionalSignUpFormValues>;
  t: TranslationKeys;
  verificationConsentGiven: boolean;
}

export function ProfessionalDocumentsStep({
  certificationFields,
  certifications,
  clearSubmitError,
  diplomaFields,
  diplomas,
  errors,
  identityFileName,
  licenseFileName,
  onAddCertification,
  onAddDiploma,
  onRemoveCertification,
  onRemoveDiploma,
  register,
  setValue,
  t,
  verificationConsentGiven,
}: ProfessionalDocumentsStepProps) {
  return (
    <FieldGroup className="gap-4">
      <FormStatusMessage
        className="border-cyan-400/25 bg-cyan-50/70 text-cyan-700 backdrop-blur-sm dark:border-cyan-400/20 dark:bg-cyan-950/25 dark:text-cyan-300"
        tone="info"
      >
        📋 {t.signup.documentsNotice}
      </FormStatusMessage>

      <div className={professionalGlassPanelClassName}>
        <AuthCheckboxField
          checked={verificationConsentGiven}
          contentClassName="gap-1"
          hint="Sanad AI peut pre-controler vos documents pour accelerer la verification de votre profil."
          id="professional-verification-consent"
          label={t.signup.verificationConsentLabel}
          labelClassName="font-semibold text-slate-900 dark:text-white"
          onCheckedChange={(checked) => {
            clearSubmitError();
            setValue('verificationConsentGiven', checked, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
      </div>

      {!verificationConsentGiven ? (
        <FormStatusMessage
          className="border-amber-400/25 bg-amber-50/80 text-amber-800 backdrop-blur-sm dark:border-amber-400/20 dark:bg-amber-950/25 dark:text-amber-200"
          tone="info"
        >
          Les documents restent obligatoires. Sanad les examinera manuellement, et votre profil
          public affichera un badge non verifie tant que la verification n'est pas terminee.
        </FormStatusMessage>
      ) : null}

      <FormField
        error={getErrorMessage(errors.licenseFile)}
        hint="Obligatoire pour completer votre dossier professionnel."
        labelClassName={professionalLabelClassName}
        label={
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {t.signup.professionalLicense}
          </span>
        }
      >
        <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInputField
            error={errors.license?.message}
            contentClassName={professionalInputClassName}
            id="professional-license"
            placeholder={t.signup.licenseNumber}
            {...register('license', {
              setValueAs: sanitizeTextValue,
            })}
          />

          <FileUploadTrigger
            fileName={licenseFileName}
            id="professional-license-file"
            onChange={(file) => {
              clearSubmitError();
              setValue('licenseFile', file, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              setValue('licenseFileName', file?.name ?? '', {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
            placeholder={t.signup.uploadDocument}
          />
        </FieldGroup>
      </FormField>

      <FormField
        error={getErrorMessage(errors.identityFile)}
        hint="Carte nationale d'identite ou passeport du responsable."
        labelClassName={professionalLabelClassName}
        label={
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Piece d'identite *
          </span>
        }
      >
        <FileUploadTrigger
          fileName={identityFileName}
          id="professional-identity-file"
          onChange={(file) => {
            clearSubmitError();
            setValue('identityFile', file, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
            setValue('identityFileName', file?.name ?? '', {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
          placeholder="Piece d'identite"
        />
      </FormField>

      <div className="flex items-center justify-between gap-3">
        <FormField
          labelClassName={professionalLabelClassName}
          label={
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              {t.signup.diplomasRequired}
            </span>
          }
        />
        <Button
          className="rounded-xl border-cyan-400/30 bg-white/60 text-cyan-700 shadow-none hover:border-cyan-400 hover:bg-cyan-50 dark:bg-slate-900/50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
          onClick={onAddDiploma}
          size="sm"
          variant="outline"
        >
          <Plus data-icon="inline-start" />
          {t.signup.addDiploma}
        </Button>
      </div>

      {diplomaFields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-cyan-400/35 bg-white/50 px-4 py-6 text-center dark:bg-slate-900/40">
          <GraduationCap className="mx-auto mb-2 h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.signup.noDiplomasAdded}</p>
          <Button
            className="mt-2 px-0 font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            onClick={onAddDiploma}
            variant="link"
          >
            + {t.signup.addDiploma}
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {diplomaFields.map((field, index) => {
          const diploma = diplomas[index];

          return (
            <div
              className="rounded-xl border border-cyan-400/20 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-slate-800/45"
              key={field.id}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t.signup.diplomas} {index + 1}
                </span>
                <Button
                  aria-label={`${t.signup.diplomas} ${index + 1} supprimer`}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onRemoveDiploma(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X />
                </Button>
              </div>

              <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AuthInputField
                  error={errors.diplomas?.[index]?.name?.message}
                  id={`diploma-name-${field.id}`}
                  label={t.signup.diplomaName}
                  labelClassName={professionalLabelClassName}
                  contentClassName={professionalInputClassName}
                  placeholder={t.signup.diplomaName}
                  {...register(`diplomas.${index}.name`, {
                    setValueAs: sanitizeTextValue,
                  })}
                />

                <AuthInputField
                  error={errors.diplomas?.[index]?.institution?.message}
                  id={`diploma-institution-${field.id}`}
                  label={t.signup.institution}
                  labelClassName={professionalLabelClassName}
                  contentClassName={professionalInputClassName}
                  placeholder={t.signup.institution}
                  {...register(`diplomas.${index}.institution`, {
                    setValueAs: sanitizeTextValue,
                  })}
                />

                <AuthInputField
                  error={errors.diplomas?.[index]?.year?.message}
                  id={`diploma-year-${field.id}`}
                  label={t.signup.yearObtained}
                  labelClassName={professionalLabelClassName}
                  contentClassName={professionalInputClassName}
                  placeholder={t.signup.yearObtained}
                  {...register(`diplomas.${index}.year`, {
                    setValueAs: sanitizeTextValue,
                  })}
                />

                <FormField
                  error={
                    errors.diplomas?.[index]?.fileName?.message ||
                    getErrorMessage(errors.diplomas?.[index]?.file)
                  }
                  labelClassName={professionalLabelClassName}
                  label={t.signup.documentRequired}
                >
                  <FileUploadTrigger
                    fileName={diploma?.fileName ?? ''}
                    id={`diploma-file-${field.id}`}
                    onChange={(file) => {
                      clearSubmitError();
                      setValue(`diplomas.${index}.file`, file, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      setValue(`diplomas.${index}.fileName`, file?.name ?? '', {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    placeholder={t.signup.documentRequired}
                  />
                </FormField>
              </FieldGroup>
            </div>
          );
        })}
      </div>

      {getErrorMessage(errors.diplomas) ? (
        <FormStatusMessage>{getErrorMessage(errors.diplomas)}</FormStatusMessage>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <FormField
          hint="Optionnel"
          labelClassName={professionalLabelClassName}
          label={
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              {t.signup.certificationsOptional}
            </span>
          }
        />
        <Button
          className="rounded-xl border-cyan-400/30 bg-white/60 text-cyan-700 shadow-none hover:border-cyan-400 hover:bg-cyan-50 dark:bg-slate-900/50 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
          onClick={onAddCertification}
          size="sm"
          variant="outline"
        >
          <Plus data-icon="inline-start" />
          {t.signup.addCertification}
        </Button>
      </div>

      {certificationFields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-cyan-400/35 bg-white/50 px-4 py-5 text-center text-sm text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
          {t.signup.noCertificationsAdded}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {certificationFields.map((field, index) => {
          const certification = certifications[index];

          return (
            <div
              className="rounded-xl border border-cyan-400/20 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-400/15 dark:bg-slate-800/45"
              key={field.id}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t.signup.certifications} {index + 1}
                </span>
                <Button
                  aria-label={`${t.signup.certifications} ${index + 1} supprimer`}
                  className="text-destructive hover:text-destructive"
                  onClick={() => onRemoveCertification(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X />
                </Button>
              </div>

              <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AuthInputField
                  error={errors.certifications?.[index]?.name?.message}
                  id={`certification-name-${field.id}`}
                  label={t.signup.certificationName}
                  labelClassName={professionalLabelClassName}
                  contentClassName={professionalInputClassName}
                  placeholder={t.signup.certificationName}
                  {...register(`certifications.${index}.name`, {
                    setValueAs: sanitizeTextValue,
                  })}
                />

                <FormField
                  error={
                    errors.certifications?.[index]?.fileName?.message ||
                    getErrorMessage(errors.certifications?.[index]?.file)
                  }
                  labelClassName={professionalLabelClassName}
                  label={t.signup.uploadDocument}
                >
                  <FileUploadTrigger
                    fileName={certification?.fileName ?? ''}
                    id={`certification-file-${field.id}`}
                    onChange={(file) => {
                      clearSubmitError();
                      setValue(`certifications.${index}.file`, file, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      setValue(`certifications.${index}.fileName`, file?.name ?? '', {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    placeholder={t.signup.uploadDocument}
                  />
                </FormField>
              </FieldGroup>
            </div>
          );
        })}
      </div>
    </FieldGroup>
  );
}

interface ProfessionalSubscriptionStepProps {
  clearSubmitError: () => void;
  errors: FieldErrors<ProfessionalSignUpFormValues>;
  onSelectPlan: (planId: ProfessionalPlanOption['id']) => void;
  onTermsAcceptedChange: (checked: boolean) => void;
  plans: readonly ProfessionalPlanOption[];
  selectedPlan: ProfessionalSignUpFormValues['subscriptionPlan'];
  t: TranslationKeys;
  termsAccepted: boolean;
}

export function ProfessionalSubscriptionStep({
  clearSubmitError: _clearSubmitError,
  errors,
  onSelectPlan,
  onTermsAcceptedChange,
  plans,
  selectedPlan,
  t,
  termsAccepted,
}: ProfessionalSubscriptionStepProps) {
  return (
    <FieldGroup className="gap-4">
      <div className="text-center">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Choisissez votre plan
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Sélectionnez l&apos;offre qui correspond à votre activité
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                'group relative rounded-2xl border p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1',
                isSelected
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/15 via-white/80 to-blue-500/15 shadow-cyan-500/20 ring-1 ring-cyan-400/30 dark:via-slate-900/65'
                  : 'border-slate-200 bg-white/70 hover:border-cyan-400 hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-800/45 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/25',
              )}
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              type="button"
            >
              {plan.popular ? (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-cyan-500/25">
                    <Star className="h-2.5 w-2.5 fill-current" /> POPULAIRE
                  </div>
                </div>
              ) : null}

              {isSelected ? (
                <div className="absolute right-3 top-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-0.5 text-white shadow-sm">
                  <Check className="h-3 w-3" />
                </div>
              ) : null}

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-600 transition-transform group-hover:scale-105 dark:text-cyan-300">
                <plan.icon className="h-4 w-4" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{plan.name}</h4>
              <p className="mb-2 text-[10px] text-slate-500 dark:text-slate-400">
                {plan.description}
              </p>

              <div className="mb-3 flex items-baseline gap-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  TND/{plan.period}
                </span>
              </div>

              <div className="mb-3 rounded-xl border border-cyan-400/20 bg-cyan-50/80 p-2 text-center text-xs font-semibold text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-300">
                Commission: {plan.commission}
              </div>

              <ul className="mb-3 flex flex-col gap-1.5">
                {plan.features.map((feature) => (
                  <li className="flex items-start gap-1.5" key={feature}>
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-cyan-600 dark:text-cyan-300" />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className={cn(
                  'rounded-xl py-2 text-center text-xs font-bold transition-colors',
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-100 text-slate-500 group-hover:text-cyan-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-cyan-300',
                )}
              >
                {isSelected ? 'Sélectionné' : 'Sélectionner'}
              </div>
            </button>
          );
        })}
      </div>

      {errors.subscriptionPlan?.message ? (
        <FormStatusMessage>{errors.subscriptionPlan.message}</FormStatusMessage>
      ) : null}

      <div className="border-t border-cyan-400/20 pt-3">
        <AuthCheckboxField
          checked={termsAccepted}
          className="pt-1"
          contentClassName="gap-0.5"
          error={errors.termsAccepted?.message}
          id="professional-terms"
          label={t.signup.acceptTermsAndAuthenticity}
          labelClassName="block text-[11px] leading-tight text-slate-600 dark:text-slate-400"
          onCheckedChange={onTermsAcceptedChange}
        />
      </div>
    </FieldGroup>
  );
}
