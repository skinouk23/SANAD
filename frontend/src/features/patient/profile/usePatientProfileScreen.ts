import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, HeartPulse, Mail, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { APP_FEATURE_CODES, useAppFeatures } from '@/features/app-features';
import { useFileBlobUrl } from '@/features/files';
import {
  useAvatarUpload,
  useDeleteAccount,
  useProfile,
  useUpdateAccountProfile,
} from '@/features/auth';
import { PatientAccountTab } from '@/features/patient/profile/components/PatientAccountTab';
import { PatientHealthTab } from '@/features/patient/profile/components/PatientHealthTab';
import { PatientPreferencesTab } from '@/features/patient/profile/components/PatientPreferencesTab';
import { PatientProfileHero } from '@/features/patient/profile/components/PatientProfileHero';
import {
  PATIENT_PROFILE_TAB_ID_BASE,
  createPatientAccountFormValues,
  createPatientPreferencesFormValues,
  createPatientProfileFormValues,
  formatMemberSince,
  getDisplayName,
  getPatientProfileName,
  toAccountProfileUpdateRequest,
  toUpdateRequest,
  type PatientProfileTab,
  type PreferenceToggleConfig,
  type ToggleablePreferenceKey,
} from '@/features/patient/profile/patientProfile.utils';
import {
  useCurrentPatient,
  usePatientPreferences,
  useUpdatePatientProfile,
  useUpdatePreferences,
} from '@/features/users';
import {
  DeleteAccountDialog,
  ProfileDangerZone,
  type DeleteAccountDialogConfirmPayload,
} from '@/shared/ui/composites/profile-account';
import { type ProfileTabItem } from '@/shared/ui/composites/profile-tabs';
import { showErrorToast, showSuccessToast } from '@/shared/lib/notifications/toast';
import { useTheme } from '@/shared/lib/theme/theme-context';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { createDefaultTunisiaPhoneValue } from '@/utils/input-validation';
import {
  PatientAccountFormSchema,
  PatientPreferencesFormSchema,
  PatientProfileFormSchema,
  type PatientAccountFormValues,
  type PatientPreferencesFormValues,
  type PatientProfileFormValues,
  type UpdatePatientPreferencesRequest,
} from '@/features/family-circle/schema';

import type { ChangeEvent, ComponentProps, FormEventHandler, RefObject } from 'react';

export interface PatientProfileScreenViewModel {
  activeTab: PatientProfileTab;
  avatarInputRef: RefObject<HTMLInputElement>;
  deleteDialogProps: ComponentProps<typeof DeleteAccountDialog>;
  dangerZoneProps: ComponentProps<typeof ProfileDangerZone>;
  heroProps: ComponentProps<typeof PatientProfileHero>;
  idBase: string;
  isProfileInitialLoading: boolean;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRetryProfileInitialLoad: () => void;
  onSetActiveTab: (tab: PatientProfileTab) => void;
  profile: NonNullable<ReturnType<typeof useCurrentPatient>['data']> | null;
  profileInitialLoadError: string | null;
  profileRefreshing: boolean;
  profileTabContent: {
    accountSection: ComponentProps<typeof PatientAccountTab>;
    healthSection: ComponentProps<typeof PatientHealthTab>;
    preferencesSection: ComponentProps<typeof PatientPreferencesTab>;
    securitySection: {
      tabId: 'securite';
    };
  };
  tabAriaLabel: string;
  tabs: ProfileTabItem<PatientProfileTab>[];
  text: ReturnType<typeof useLanguage>['t'];
}

export function usePatientProfileScreen(): PatientProfileScreenViewModel {
  const navigate = useNavigate();
  const { isAuthenticated, logout, updateUser, user } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { isDark: isThemeDark, toggleTheme } = useTheme();
  const { isFeatureActive } = useAppFeatures();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<PatientProfileTab>('compte');
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const accountForm = useForm<PatientAccountFormValues>({
    resolver: zodResolver(PatientAccountFormSchema),
    defaultValues: createPatientAccountFormValues(null, user?.phone),
  });
  const profileForm = useForm<PatientProfileFormValues>({
    resolver: zodResolver(PatientProfileFormSchema),
    defaultValues: {
      medicalHistory: '',
      allergies: '',
      currentMedications: '',
      insuranceProvider: '',
      insuranceNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: createDefaultTunisiaPhoneValue(),
      emergencyContactRelationship: '',
    },
  });
  const preferencesForm = useForm<PatientPreferencesFormValues>({
    resolver: zodResolver(PatientPreferencesFormSchema),
    defaultValues: {
      emailNotifications: false,
      smsNotifications: false,
      pushNotifications: false,
      marketingEmails: false,
      autoValidationEnabled: false,
      shareWithFamily: false,
      allowProviderMessages: false,
    },
  });

  const tabs = useMemo<ProfileTabItem<PatientProfileTab>[]>(
    () => [
      { id: 'compte', label: t.profile.accountTab, icon: Mail },
      { id: 'sante', label: t.profile.healthTab, icon: HeartPulse },
      { id: 'preferences', label: t.profile.preferences, icon: BellRing },
      { id: 'securite', label: t.profile.security, icon: ShieldCheck },
    ],
    [t],
  );
  const preferenceToggleConfigs = useMemo<PreferenceToggleConfig[]>(() => {
    const configs: PreferenceToggleConfig[] = [
      { key: 'emailNotifications', label: `${t.auth.email} ${t.profile.notifications}` },
      { key: 'smsNotifications', label: `SMS ${t.profile.notifications}` },
      { key: 'pushNotifications', label: `Push ${t.profile.notifications}` },
      { key: 'marketingEmails', label: `${t.provider.marketing} ${t.auth.email}` },
      { key: 'autoValidationEnabled', label: t.mySpace.autoValidation },
      { key: 'shareWithFamily', label: t.dashboard.familyCircle },
      { key: 'allowProviderMessages', label: t.messages.conversations },
    ];

    return configs.filter(
      (config) =>
        config.key !== 'shareWithFamily' || isFeatureActive(APP_FEATURE_CODES.familyCircle),
    );
  }, [isFeatureActive, t]);

  const {
    data: profile,
    loading: profileLoading,
    isRefreshing: profileRefreshing,
    error: profileError,
    refetch: refetchProfile,
  } = useCurrentPatient();
  const {
    data: patientPreferences,
    loading: preferencesLoading,
    isInitialLoading: preferencesInitialLoading,
    isRefreshing: preferencesRefreshing,
    error: preferencesError,
    refetch: refetchPreferences,
  } = usePatientPreferences();
  const { data: accountProfile, isLoading: accountProfileLoading } = useProfile(isAuthenticated);
  const { objectUrl: avatarUrl } = useFileBlobUrl(user?.avatarFileId);
  const {
    mutateAsync: updateAccountProfile,
    isPending: accountSaving,
    reset: resetAccountMutation,
  } = useUpdateAccountProfile();
  const {
    mutateAsync: updatePatientProfile,
    isPending: profileSaving,
    reset: resetProfileMutation,
  } = useUpdatePatientProfile();
  const { mutateAsync: updatePreferences, isPending: preferencesSaving } = useUpdatePreferences();
  const { mutateAsync: deleteAccount, isPending: deletingAccount } = useDeleteAccount();
  const { upload: uploadAvatar, uploading: avatarUploading } = useAvatarUpload();

  const displayName = getDisplayName(profile, user?.name, t.auth.patient);
  const displayEmail = user?.email?.trim() || t.common.noData;
  const memberSinceLabel = formatMemberSince(
    accountProfile?.createdAt,
    currentLanguage.code,
    t.common.noData,
  );
  const memberSinceText =
    accountProfileLoading && !accountProfile
      ? t.common.loading
      : `${t.profile.memberSince} ${memberSinceLabel}`;
  const hasAvatarImage = Boolean(avatarUrl) && !avatarLoadFailed;
  const accountSaveDisabled =
    accountSaving || profileSaving || avatarUploading || !accountForm.formState.isDirty;
  const accountDirtyFields = accountForm.formState.dirtyFields;
  const profileSaveDisabled =
    profileSaving || profileLoading || !profile || !profileForm.formState.isDirty;
  const preferencesDisabled = preferencesInitialLoading || !patientPreferences || preferencesSaving;
  const isProfileInitialLoading = profileLoading && !profile;

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatarFileId, avatarUrl]);

  useEffect(() => {
    if (!accountForm.formState.isDirty) {
      accountForm.reset(createPatientAccountFormValues(profile, user?.phone));
    }
  }, [accountForm, profile, user?.phone]);

  useEffect(() => {
    if (profile && !profileForm.formState.isDirty) {
      profileForm.reset(createPatientProfileFormValues(profile));
    }
  }, [profile, profileForm]);

  useEffect(() => {
    if (patientPreferences) {
      preferencesForm.reset(createPatientPreferencesFormValues(patientPreferences));
    }
  }, [patientPreferences, preferencesForm]);

  const handleAccountSubmit: FormEventHandler<HTMLFormElement> = accountForm.handleSubmit(
    async (values) => {
      resetAccountMutation();
      resetProfileMutation();

      try {
        const shouldUpdateAccount = Boolean(accountDirtyFields.phone);
        const shouldUpdatePatient = Boolean(
          accountDirtyFields.firstName ||
          accountDirtyFields.lastName ||
          accountDirtyFields.address ||
          accountDirtyFields.city ||
          accountDirtyFields.postalCode,
        );
        const updatedAccount = shouldUpdateAccount
          ? await updateAccountProfile({
              phone: values.phone.trim(),
            })
          : null;
        const updatedProfile = shouldUpdatePatient
          ? await updatePatientProfile(toAccountProfileUpdateRequest(values))
          : null;
        const nextPhone = updatedAccount?.phoneNumber ?? user?.phone;
        const nextAccountValues = updatedProfile
          ? createPatientAccountFormValues(updatedProfile, nextPhone)
          : {
              ...values,
              phone: createDefaultTunisiaPhoneValue(nextPhone),
            };

        accountForm.reset(nextAccountValues);

        if (shouldUpdatePatient) {
          const currentProfileFullName = getPatientProfileName(
            profile?.firstName,
            profile?.lastName,
          );
          const nextProfileFullName = getPatientProfileName(
            updatedProfile?.firstName ?? values.firstName,
            updatedProfile?.lastName ?? values.lastName,
          );

          if (nextProfileFullName !== currentProfileFullName) {
            updateUser({ name: nextProfileFullName });
          }
        }

        showSuccessToast(t.profile.saved);
      } catch (submitError) {
        showErrorToast(submitError, t.common.error);
      }
    },
  );

  const handleProfileSubmit: FormEventHandler<HTMLFormElement> = profileForm.handleSubmit(
    async (values) => {
      resetProfileMutation();

      try {
        const updatedProfile = await updatePatientProfile(toUpdateRequest(values));

        if (updatedProfile) {
          profileForm.reset(createPatientProfileFormValues(updatedProfile));
        } else if (profile) {
          profileForm.reset(values);
        }

        showSuccessToast(t.profile.saved);
      } catch (submitError) {
        showErrorToast(submitError, t.common.error);
      }
    },
  );

  async function handlePreferenceToggle(
    field: ToggleablePreferenceKey,
    value: boolean,
  ): Promise<void> {
    if (!patientPreferences || preferencesSaving) {
      return;
    }

    preferencesForm.setValue(field, value, {
      shouldDirty: false,
      shouldTouch: true,
      shouldValidate: false,
    });

    const patch = { [field]: value } as UpdatePatientPreferencesRequest;

    try {
      await updatePreferences(patch);
      showSuccessToast(t.profile.saved);
    } catch (updatePreferenceError) {
      preferencesForm.setValue(field, patientPreferences[field], {
        shouldDirty: false,
        shouldTouch: true,
        shouldValidate: false,
      });
      showErrorToast(updatePreferenceError, t.common.error);
    }
  }

  const handleAvatarClick = () => {
    if (avatarUploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';

    if (!selectedFile) {
      return;
    }

    try {
      const updatedAccount = await uploadAvatar(selectedFile);

      if (updatedAccount?.avatarFileId) {
        setAvatarLoadFailed(false);
        showSuccessToast(t.profile.saved);
        return;
      }

      showErrorToast(null, t.common.error);
    } catch (uploadError) {
      showErrorToast(uploadError, t.common.error);
    }
  }

  const handleLogout = () => {
    void logout();
    navigate('/auth/login');
  };

  async function handleDeleteAccountConfirm({
    currentPassword,
  }: DeleteAccountDialogConfirmPayload): Promise<void> {
    try {
      await deleteAccount({ currentPassword });
      setIsDeleteDialogOpen(false);
      showSuccessToast(t.profile.deleteAccountSuccess);
      void logout();
      navigate('/auth/login');
    } catch (error) {
      showErrorToast(error, t.profile.deleteAccountError);
    }
  }

  const profileErrorMessage = profileError
    ? getApiErrorMessage(profileError, t.common.loadingError)
    : null;
  const profileInitialLoadError = profileError && !profile ? profileErrorMessage : null;
  const preferencesErrorMessage = preferencesError
    ? getApiErrorMessage(preferencesError, t.common.loadingError)
    : null;

  return {
    activeTab,
    avatarInputRef: fileInputRef,
    deleteDialogProps: {
      acknowledgeLabel: t.profile.deleteAccountAcknowledge,
      cancelLabel: t.common.cancel,
      confirmLabel: t.profile.deleteAccountConfirm,
      currentPasswordLabel: t.profile.currentPassword,
      description: t.profile.deleteAccountDescription,
      isOpen: isDeleteDialogOpen,
      keywordLabel: t.profile.deleteAccountKeywordLabel,
      keywordValue: t.profile.deleteAccountKeywordValue,
      onClose: () => {
        setIsDeleteDialogOpen(false);
      },
      onConfirm: handleDeleteAccountConfirm,
      submitting: deletingAccount,
      title: t.profile.deleteAccountTitle,
    },
    dangerZoneProps: {
      className: 'mt-6',
      deleteLabel: t.profile.deleteAccount,
      logoutLabel: t.profile.logout,
      onDeleteAccount: () => {
        setIsDeleteDialogOpen(true);
      },
      onLogout: handleLogout,
      title: t.profile.dangerZone,
    },
    heroProps: {
      avatarInitial: displayName.charAt(0).toUpperCase() || 'P',
      avatarUploading,
      avatarUrl,
      changePhotoLabel: t.profile.changePhoto,
      displayName,
      email: displayEmail,
      hasAvatarImage,
      memberSinceText,
      mutedTextClassName: 'text-muted-foreground',
      onAvatarClick: handleAvatarClick,
      onAvatarError: () => {
        setAvatarLoadFailed(true);
      },
      roleLabel: t.auth.patient,
    },
    idBase: PATIENT_PROFILE_TAB_ID_BASE,
    isProfileInitialLoading,
    onAvatarChange: handleAvatarChange,
    onRetryProfileInitialLoad: () => {
      void refetchProfile();
    },
    onSetActiveTab: setActiveTab,
    profile,
    profileInitialLoadError,
    profileRefreshing,
    profileTabContent: {
      accountSection: {
        description: t.profile.contactInfo,
        email: displayEmail,
        emailLabel: t.auth.email,
        firstNameLabel: t.signup.firstName,
        form: accountForm,
        idBase: PATIENT_PROFILE_TAB_ID_BASE,
        addressLabel: t.signup.address,
        cityLabel: t.signup.city,
        lastNameLabel: t.signup.lastName,
        onFieldChange: () => {
          resetAccountMutation();
          resetProfileMutation();
        },
        onSubmit: handleAccountSubmit,
        phoneLabel: t.profile.phone,
        postalCodeLabel: t.profile.postalCode,
        saveDisabled: accountSaveDisabled,
        saveLabel: t.profile.saveChanges,
        saving: accountSaving || profileSaving,
        savingLabel: t.profile.saving,
        title: t.profile.accountInfo,
      },
      healthSection: {
        allergiesLabel: t.profile.allergies,
        description: t.profile.medicalHistory,
        emergencyContactLabel: t.profile.emergencyContact,
        emergencyContactNameLabel: t.profile.emergencyContactName,
        emergencyContactPhoneLabel: t.profile.emergencyContactPhone,
        emergencyContactRelationshipLabel: t.profile.emergencyContactRelationship,
        errorMessage: profileErrorMessage,
        form: profileForm,
        idBase: PATIENT_PROFILE_TAB_ID_BASE,
        insuranceNumberLabel: t.profile.insuranceNumber,
        insuranceProviderLabel: t.profile.insuranceProvider,
        loading: profileLoading,
        medicalHistoryLabel: t.profile.medicalHistory,
        medicationsLabel: t.profile.medications,
        noDataLabel: t.common.noData,
        onFieldChange: resetProfileMutation,
        onRetry: () => {
          void refetchProfile();
        },
        onSubmit: handleProfileSubmit,
        profileAvailable: Boolean(profile),
        refreshing: profileRefreshing,
        retryLabel: t.common.retry,
        saveDisabled: profileSaveDisabled,
        saveLabel: t.profile.saveChanges,
        saving: profileSaving,
        savingLabel: t.profile.saving,
        title: t.profile.medicalInfo,
      },
      preferencesSection: {
        currentLanguageCode: currentLanguage.code,
        darkLabel: t.profile.darkTheme,
        description: t.profile.notifications,
        disabled: preferencesDisabled,
        errorMessage: preferencesErrorMessage,
        form: preferencesForm,
        idBase: PATIENT_PROFILE_TAB_ID_BASE,
        isThemeDark,
        languageLabel: t.profile.language,
        lightLabel: t.profile.lightTheme,
        loading: preferencesLoading,
        mutedTextClassName: 'text-muted-foreground',
        noDataLabel: t.common.noData,
        onLanguageChange: setLanguage,
        onPreferenceToggle: handlePreferenceToggle,
        onRetry: () => {
          void refetchPreferences();
        },
        onToggleTheme: toggleTheme,
        patientPreferences,
        refreshing: preferencesRefreshing,
        retryLabel: t.common.retry,
        themeLabel: t.profile.theme,
        title: t.profile.preferences,
        toggleConfigs: preferenceToggleConfigs,
      },
      securitySection: {
        tabId: 'securite',
      },
    },
    tabAriaLabel: t.profile.title,
    tabs,
    text: t,
  };
}
