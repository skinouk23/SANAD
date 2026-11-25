import { useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, Building2, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useFileBlobUrl } from '@/features/files';
import {
  isNutritionProviderCategory,
  useMyProviderProfile,
  useProviderPreferences,
  useRequestProviderVerification,
  useUpdateMyProviderProfile,
  useUpdateProviderPreferences,
  type ProviderVerificationStatus,
  type UpdateProviderPreferencesRequest,
} from '@/features/providers';
import {
  ProviderAccountFormSchema,
  ProviderProfileFormSchema,
  type ProviderAccountFormValues,
  type ProviderProfileFormValues,
} from '@/features/providers/schema';
import {
  ProviderPreferencesFormSchema,
  type ProviderPreferencesFormValues,
} from '@/features/providers/preferences-schema';
import { useAvatarUpload, useDeleteAccount, useUpdateAccountProfile } from '@/features/auth';
import {
  DeleteAccountDialog,
  ProfileDangerZone,
  type DeleteAccountDialogConfirmPayload,
} from '@/shared/ui/composites/profile-account';
import { type ProfileTabItem } from '@/shared/ui/composites/profile-tabs';
import { showErrorToast, showSuccessToast } from '@/shared/lib/notifications/toast';
import { useTheme } from '@/shared/lib/theme/theme-context';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import { ProviderAccountTab } from '@/features/providers/profile/components/ProviderAccountTab';
import { ProviderPreferencesTab } from '@/features/providers/profile/components/ProviderPreferencesTab';
import { ProviderProfessionalTab } from '@/features/providers/profile/components/ProviderProfessionalTab';
import {
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  PROVIDER_PROFILE_TAB_ID_BASE,
  buildAccountProviderUpdatePayload,
  buildUpdatePayload,
  createProviderAccountFormValues,
  createProviderPreferencesFormValues,
  createProviderProfileFormValues,
  formatLastUpdated,
  formatMemberSince,
  formatProfileVisibilityLabel,
  formatProviderCategoryLabel,
  getNutritionSubtypeLabel,
  getPersonalName,
  getProviderDisplayName,
  getProviderDisplayNameFromDraft,
  type PreferenceToggleConfig,
  type ProviderProfileTab,
  type ToggleablePreferenceKey,
} from './providerProfile.utils';

import type { ChangeEvent, ComponentProps, FormEventHandler, RefObject } from 'react';

function resolveProviderVerificationStatus(
  status: ProviderVerificationStatus | null | undefined,
  isVerified: boolean | null | undefined,
): ProviderVerificationStatus {
  if (status) {
    return status;
  }

  return isVerified ? 'approved' : 'not_requested';
}

function getProviderVerificationCopy(
  status: ProviderVerificationStatus,
  t: ReturnType<typeof useLanguage>['t'],
) {
  const labels: Record<ProviderVerificationStatus, string> = {
    not_requested: t.provider.verificationStatusNotRequested,
    requested: t.provider.verificationStatusRequested,
    ai_prechecked: t.provider.verificationStatusAiPrechecked,
    approved: t.provider.verificationStatusApproved,
    rejected: t.provider.verificationStatusRejected,
  };
  const descriptions: Record<ProviderVerificationStatus, string> = {
    not_requested: t.provider.verificationStatusNotRequestedDescription,
    requested: t.provider.verificationStatusRequestedDescription,
    ai_prechecked: t.provider.verificationStatusAiPrecheckedDescription,
    approved: t.provider.verificationStatusApprovedDescription,
    rejected: t.provider.verificationStatusRejectedDescription,
  };

  return {
    label: labels[status],
    description: descriptions[status],
  };
}

export interface ProviderProfileScreenViewModel {
  accountForm: ReturnType<typeof useForm<ProviderAccountFormValues>>;
  accountSaveDisabled: boolean;
  accountSaving: boolean;
  activeTab: ProviderProfileTab;
  avatarUploading: boolean;
  currentLanguageCode: ReturnType<typeof useLanguage>['currentLanguage']['code'];
  deletingAccount: boolean;
  avatarInputRef: RefObject<HTMLInputElement>;
  deleteDialogProps: ComponentProps<typeof DeleteAccountDialog>;
  dangerZoneProps: ComponentProps<typeof ProfileDangerZone>;
  displayEmail: string;
  fetchErrorMessage: string | null;
  hasAvatarImage: boolean;
  heroProps: {
    avatarInitial: string;
    avatarUploading: boolean;
    avatarUrl: string | null | undefined;
    categoryLabel: string;
    displayName: string;
    email: string;
    hasAvatarImage: boolean;
    memberSinceText: string;
    mutedTextClassName: string;
    onAvatarClick: () => void;
    onAvatarError: () => void;
    onRequestVerification: () => void;
    title: string;
    verificationCanRequest: boolean;
    verificationIsVerified: boolean;
    verificationRequestPending: boolean;
    verificationRequestLabel: string;
    verificationStatusDescription: string;
    verificationStatusLabel: string;
    verificationTitle: string;
  };
  idBase: string;
  isDeleteDialogOpen: boolean;
  isNutritionProvider: boolean;
  isProfileLoadingState: boolean;
  isThemeDark: boolean;
  mutedTextClassName: string;
  notificationToggleConfigs: PreferenceToggleConfig[];
  preferencesDisabled: boolean;
  preferencesErrorMessage: string | null;
  preferencesForm: ReturnType<typeof useForm<ProviderPreferencesFormValues>>;
  preferencesLoading: boolean;
  preferencesRefreshing: boolean;
  preferencesTabErrorMessage: string | null;
  preferencesVisibilityLabel: string;
  privacyToggleConfigs: PreferenceToggleConfig[];
  professionalForm: ReturnType<typeof useForm<ProviderProfileFormValues>>;
  professionalSaveDisabled: boolean;
  profile: NonNullable<ReturnType<typeof useMyProviderProfile>['data']> | null;
  profileLoading: boolean;
  profileRefreshing: boolean;
  profileSaving: boolean;
  providerCategoryLabel: string;
  providerPreferences: ReturnType<typeof useProviderPreferences>['data'] | null | undefined;
  tabs: ProfileTabItem<ProviderProfileTab>[];
  text: {
    accountTab: string;
    address: string;
    bio: string;
    businessName: string;
    cancel: string;
    city: string;
    darkTheme: string;
    email: string;
    error: string;
    language: string;
    lastName: string;
    lastSynced: string;
    lightTheme: string;
    loading: string;
    noData: string;
    notifications: string;
    phone: string;
    postalCode: string;
    preferences: string;
    professionalTab: string;
    profileTitle: string;
    profileVisibility: string;
    providerCategory: string;
    retry: string;
    saveChanges: string;
    saved: string;
    saving: string;
    security: string;
    serviceRadius: string;
    specialization: string;
    theme: string;
    nutritionSubtype: string;
    firstName: string;
    conversations: string;
  };
  onAccountSubmit: FormEventHandler<HTMLFormElement>;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCloseDeleteDialog: () => void;
  onDeleteAccountConfirm: (payload: DeleteAccountDialogConfirmPayload) => Promise<void>;
  onLanguageChange: ReturnType<typeof useLanguage>['setLanguage'];
  onLogout: () => void;
  onOpenDeleteDialog: () => void;
  onPreferenceToggle: (field: ToggleablePreferenceKey, value: boolean) => Promise<void>;
  onProfessionalReset: () => void;
  onProfessionalSubmit: FormEventHandler<HTMLFormElement>;
  onRequestVerification: () => Promise<void>;
  onRetryProfile: () => void;
  onRetryPreferences: () => void;
  onSetActiveTab: (tab: ProviderProfileTab) => void;
  onToggleTheme: () => void;
  onUpdateProfessionalField: () => void;
  profileTabContent: {
    accountSection: ComponentProps<typeof ProviderAccountTab>;
    preferencesSection: ComponentProps<typeof ProviderPreferencesTab>;
    professionalSection: ComponentProps<typeof ProviderProfessionalTab>;
    securitySection: {
      tabId: 'securite';
    };
  };
  providerMissingTitle: string;
}

export function useProviderProfileScreen(): ProviderProfileScreenViewModel {
  const navigate = useNavigate();
  const { logout, updateUser, user } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { isDark: isThemeDark, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ProviderProfileTab>('compte');
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const accountForm = useForm<ProviderAccountFormValues>({
    resolver: zodResolver(ProviderAccountFormSchema),
    defaultValues: createProviderAccountFormValues(null, user?.phone),
  });
  const professionalForm = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(ProviderProfileFormSchema),
    defaultValues: {
      businessName: '',
      specialization: '',
      nutritionProviderSubtype: '',
      bio: '',
      serviceRadius: '',
    },
  });
  const preferencesForm = useForm<ProviderPreferencesFormValues>({
    resolver: zodResolver(ProviderPreferencesFormSchema),
    defaultValues: {
      emailNotifications: false,
      smsNotifications: false,
      pushNotifications: false,
      marketingEmails: false,
      allowPatientMessages: false,
      profileVisibility: '',
    },
  });

  const tabs = useMemo<ProfileTabItem<ProviderProfileTab>[]>(
    () => [
      { id: 'compte', label: t.profile.accountTab, icon: UserRound },
      { id: 'professionnel', label: t.profile.professionalTab, icon: Building2 },
      { id: 'preferences', label: t.profile.preferences, icon: BellRing },
      { id: 'securite', label: t.profile.security, icon: ShieldCheck },
    ],
    [t],
  );
  const notificationToggleConfigs = useMemo<PreferenceToggleConfig[]>(
    () => [
      { key: 'emailNotifications', label: `${t.auth.email} ${t.profile.notifications}` },
      { key: 'smsNotifications', label: `SMS ${t.profile.notifications}` },
      { key: 'pushNotifications', label: `Push ${t.profile.notifications}` },
      { key: 'marketingEmails', label: `${t.provider.marketing} ${t.auth.email}` },
    ],
    [t],
  );
  const privacyToggleConfigs = useMemo<PreferenceToggleConfig[]>(
    () => [{ key: 'allowPatientMessages', label: t.messages.conversations }],
    [t],
  );

  const {
    data: profile,
    loading: profileLoading,
    isRefreshing: profileRefreshing,
    error: profileError,
    refetch: refetchProfile,
  } = useMyProviderProfile();
  const {
    data: providerPreferences,
    loading: preferencesLoading,
    isInitialLoading: preferencesInitialLoading,
    isRefreshing: preferencesRefreshing,
    error: preferencesError,
    refetch: refetchPreferences,
  } = useProviderPreferences();
  const {
    mutateAsync: updateAccountProfile,
    isPending: accountSaving,
    reset: resetAccountMutation,
  } = useUpdateAccountProfile();
  const {
    mutateAsync: updateProfile,
    loading: profileSaving,
    reset: resetUpdateProfile,
  } = useUpdateMyProviderProfile();
  const { mutateAsync: requestVerification, loading: verificationRequestPending } =
    useRequestProviderVerification();
  const updatePreferencesMutation = useUpdateProviderPreferences();
  const { upload: uploadAvatar, uploading: avatarUploading } = useAvatarUpload('ProviderAvatar');
  const { mutateAsync: deleteAccount, isPending: deletingAccount } = useDeleteAccount();
  const { objectUrl: avatarUrl } = useFileBlobUrl(user?.avatarFileId);

  const isNutritionProvider = isNutritionProviderCategory(profile?.serviceType);
  const watchedBusinessName = professionalForm.watch('businessName');
  const watchedFirstName = accountForm.watch('firstName');
  const watchedLastName = accountForm.watch('lastName');
  const providerDisplayName =
    accountForm.formState.isDirty || professionalForm.formState.isDirty
      ? getProviderDisplayNameFromDraft(
          {
            ...accountForm.getValues(),
            firstName: watchedFirstName,
            lastName: watchedLastName,
          },
          {
            ...professionalForm.getValues(),
            businessName: watchedBusinessName,
          },
          profile,
          t.profile.professionalTab,
        )
      : getProviderDisplayName(profile, t.profile.professionalTab);
  const providerCategoryLabel = formatProviderCategoryLabel(profile?.serviceType, t);
  const displayEmail = user?.email?.trim() || t.common.noData;
  const userInitial = providerDisplayName.charAt(0).toUpperCase() || 'P';
  const memberSinceText = `${t.profile.memberSince} ${formatMemberSince(
    profile?.createdAt,
    currentLanguage.code,
    t.common.noData,
  )}`;
  const hasAvatarImage = Boolean(avatarUrl) && !avatarLoadFailed;
  const accountSubmitting = accountSaving || profileSaving;
  const accountSaveDisabled =
    accountSubmitting || avatarUploading || !accountForm.formState.isDirty;
  const accountDirtyFields = accountForm.formState.dirtyFields;
  const professionalSaveDisabled =
    profileLoading || profileSaving || !professionalForm.formState.isDirty || !profile;
  const preferencesDisabled =
    preferencesInitialLoading || !providerPreferences || updatePreferencesMutation.isPending;
  const fetchErrorMessage = profileError
    ? getApiErrorMessage(profileError, t.common.loadingError)
    : null;
  const preferencesErrorMessage = preferencesError
    ? getApiErrorMessage(preferencesError, t.common.loadingError)
    : null;
  const preferencesVisibilityLabel = formatProfileVisibilityLabel(
    providerPreferences?.profileVisibility,
    t.profile,
  );
  const verificationStatus = resolveProviderVerificationStatus(
    profile?.verificationStatus,
    profile?.isVerified,
  );
  const verificationCopy = getProviderVerificationCopy(verificationStatus, t);
  const verificationCanRequest =
    profile?.canRequestVerification ??
    (verificationStatus === 'not_requested' || verificationStatus === 'rejected');
  const mutedTextClassName = 'text-muted-foreground';

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatarFileId, avatarUrl]);

  useEffect(() => {
    if (profile && !accountForm.formState.isDirty) {
      accountForm.reset(createProviderAccountFormValues(profile, user?.phone));
    }
  }, [accountForm, profile, user?.phone]);

  useEffect(() => {
    if (profile && !professionalForm.formState.isDirty) {
      professionalForm.reset(createProviderProfileFormValues(profile));
    }
  }, [profile, professionalForm]);

  useEffect(() => {
    if (providerPreferences) {
      preferencesForm.reset(createProviderPreferencesFormValues(providerPreferences));
    }
  }, [preferencesForm, providerPreferences]);

  const onProfessionalReset = () => {
    if (!profile) {
      return;
    }

    professionalForm.reset(createProviderProfileFormValues(profile));
    resetUpdateProfile();
  };

  const onAccountSubmit = accountForm.handleSubmit(async (values) => {
    resetAccountMutation();
    resetUpdateProfile();

    try {
      const shouldUpdateAccount = Boolean(accountDirtyFields.phone);
      const shouldUpdateProvider = Boolean(
        accountDirtyFields.firstName ||
        accountDirtyFields.lastName ||
        accountDirtyFields.address ||
        accountDirtyFields.city ||
        accountDirtyFields.postalCode,
      );
      const shouldUpdateProviderName = Boolean(
        accountDirtyFields.firstName || accountDirtyFields.lastName,
      );
      const updatedAccount = shouldUpdateAccount
        ? await updateAccountProfile({
            phone: values.phone.trim(),
          })
        : null;
      const updatedProfile = shouldUpdateProvider
        ? await updateProfile(buildAccountProviderUpdatePayload(values))
        : null;
      const resolvedProfile = updatedProfile ?? profile;
      const nextPhone = updatedAccount?.phoneNumber ?? user?.phone;

      accountForm.reset(createProviderAccountFormValues(resolvedProfile, nextPhone));

      if (shouldUpdateProviderName && resolvedProfile) {
        const currentProfileFullName = getPersonalName(profile?.firstName, profile?.lastName);
        const nextProfileFullName = getPersonalName(
          resolvedProfile.firstName,
          resolvedProfile.lastName,
        );

        if (nextProfileFullName !== currentProfileFullName) {
          updateUser({ name: nextProfileFullName });
        }
      }

      showSuccessToast(t.profile.saved);
    } catch (submitError) {
      showErrorToast(submitError, t.common.error);
    }
  });

  const onProfessionalSubmit = professionalForm.handleSubmit(async (values) => {
    resetUpdateProfile();

    try {
      const updatedProfile = await updateProfile(buildUpdatePayload(values, isNutritionProvider));
      const resolvedProfile = updatedProfile ?? profile;

      if (resolvedProfile) {
        professionalForm.reset(createProviderProfileFormValues(resolvedProfile));
      } else {
        professionalForm.reset(values);
      }

      showSuccessToast(t.profile.saved);
    } catch (submitError) {
      showErrorToast(submitError, t.common.error);
    }
  });

  const onPreferenceToggle = async (field: ToggleablePreferenceKey, value: boolean) => {
    if (!providerPreferences || updatePreferencesMutation.isPending) {
      return;
    }

    preferencesForm.setValue(field, value, {
      shouldDirty: false,
      shouldTouch: true,
      shouldValidate: false,
    });

    const patch = { [field]: value } as UpdateProviderPreferencesRequest;

    try {
      await updatePreferencesMutation.mutateAsync(patch);
      showSuccessToast(t.profile.saved);
    } catch (updatePreferenceError) {
      preferencesForm.setValue(field, providerPreferences[field], {
        shouldDirty: false,
        shouldTouch: true,
        shouldValidate: false,
      });
      showErrorToast(updatePreferenceError, t.common.error);
    }
  };

  const onAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
  };

  const onRequestVerification = async () => {
    if (!profile || verificationRequestPending || !verificationCanRequest) {
      return;
    }

    try {
      await requestVerification();
      showSuccessToast(t.profile.saved);
    } catch (requestError) {
      showErrorToast(requestError, t.common.error);
    }
  };

  const onLogout = () => {
    void logout();
    navigate('/auth/login');
  };

  const onDeleteAccountConfirm = async ({ currentPassword }: DeleteAccountDialogConfirmPayload) => {
    try {
      await deleteAccount({ currentPassword });
      setIsDeleteDialogOpen(false);
      showSuccessToast(t.profile.deleteAccountSuccess);
      void logout();
      navigate('/auth/login');
    } catch {
      showErrorToast(null, t.profile.deleteAccountError);
    }
  };

  return {
    accountForm,
    accountSaveDisabled,
    accountSaving: accountSubmitting,
    activeTab,
    avatarInputRef: fileInputRef,
    avatarUploading,
    currentLanguageCode: currentLanguage.code,
    deletingAccount,
    deleteDialogProps: {
      acknowledgeLabel: t.profile.deleteAccountAcknowledge,
      cancelLabel: t.common.cancel,
      confirmLabel: t.profile.deleteAccountConfirm,
      currentPasswordLabel: t.profile.currentPassword,
      description: t.profile.deleteAccountDescription,
      isOpen: isDeleteDialogOpen,
      keywordLabel: t.profile.deleteAccountKeywordLabel,
      keywordValue: t.profile.deleteAccountKeywordValue,
      onClose: () => setIsDeleteDialogOpen(false),
      onConfirm: onDeleteAccountConfirm,
      submitting: deletingAccount,
      title: t.profile.deleteAccountTitle,
    },
    dangerZoneProps: {
      className: 'mt-6',
      deleteLabel: t.profile.deleteAccount,
      logoutLabel: t.profile.logout,
      onDeleteAccount: () => setIsDeleteDialogOpen(true),
      onLogout,
      title: t.profile.dangerZone,
    },
    displayEmail,
    fetchErrorMessage,
    hasAvatarImage,
    heroProps: {
      avatarInitial: userInitial,
      avatarUploading,
      avatarUrl,
      categoryLabel: providerCategoryLabel,
      displayName: providerDisplayName,
      email: displayEmail,
      hasAvatarImage,
      memberSinceText,
      mutedTextClassName,
      onAvatarClick: () => {
        if (!avatarUploading) {
          fileInputRef.current?.click();
        }
      },
      onAvatarError: () => setAvatarLoadFailed(true),
      onRequestVerification: () => {
        void onRequestVerification();
      },
      title: t.profile.title,
      verificationCanRequest,
      verificationIsVerified: profile?.isVerified ?? verificationStatus === 'approved',
      verificationRequestPending,
      verificationRequestLabel: t.provider.requestVerification,
      verificationStatusDescription: verificationCopy.description,
      verificationStatusLabel: verificationCopy.label,
      verificationTitle: t.provider.verificationTitle,
    },
    idBase: PROVIDER_PROFILE_TAB_ID_BASE,
    isDeleteDialogOpen,
    isNutritionProvider,
    isProfileLoadingState: profileLoading && !profile,
    isThemeDark,
    mutedTextClassName,
    notificationToggleConfigs,
    onAccountSubmit,
    onAvatarChange,
    onCloseDeleteDialog: () => setIsDeleteDialogOpen(false),
    onDeleteAccountConfirm,
    onLanguageChange: setLanguage,
    onLogout,
    onOpenDeleteDialog: () => setIsDeleteDialogOpen(true),
    onPreferenceToggle,
    onProfessionalReset,
    onProfessionalSubmit,
    onRequestVerification,
    onRetryPreferences: () => {
      void refetchPreferences();
    },
    onRetryProfile: () => {
      void refetchProfile();
    },
    onSetActiveTab: setActiveTab,
    onToggleTheme: toggleTheme,
    onUpdateProfessionalField: resetUpdateProfile,
    preferencesDisabled,
    preferencesErrorMessage,
    preferencesForm,
    preferencesLoading,
    preferencesRefreshing,
    preferencesTabErrorMessage:
      preferencesError && !providerPreferences ? (preferencesErrorMessage ?? t.common.error) : null,
    preferencesVisibilityLabel,
    privacyToggleConfigs,
    professionalForm,
    professionalSaveDisabled,
    profile,
    profileLoading,
    profileRefreshing,
    profileSaving,
    profileTabContent: {
      accountSection: {
        email: displayEmail,
        emailLabel: t.auth.email,
        addressLabel: t.signup.address,
        cityLabel: t.signup.city,
        firstNameLabel: t.signup.firstName,
        form: accountForm,
        idBase: PROVIDER_PROFILE_TAB_ID_BASE,
        lastNameLabel: t.signup.lastName,
        onFieldChange: () => {
          resetAccountMutation();
          resetUpdateProfile();
        },
        onSubmit: onAccountSubmit,
        phoneLabel: t.profile.phone,
        postalCodeLabel: t.profile.postalCode,
        saveDisabled: accountSaveDisabled,
        saveLabel: t.profile.saveChanges,
        saving: accountSubmitting,
        savingLabel: t.profile.saving,
        title: t.profile.accountTab,
      },
      preferencesSection: {
        currentLanguageCode: currentLanguage.code,
        darkLabel: t.profile.darkTheme,
        disabled: preferencesDisabled,
        errorMessage:
          preferencesError && !providerPreferences
            ? (preferencesErrorMessage ?? t.common.error)
            : null,
        form: preferencesForm,
        formatLastUpdatedLabel: () =>
          providerPreferences
            ? formatLastUpdated(
                providerPreferences.updatedAt,
                currentLanguage.code,
                t.common.noData,
              )
            : t.common.noData,
        idBase: PROVIDER_PROFILE_TAB_ID_BASE,
        isThemeDark,
        languageLabel: t.profile.language,
        lastSyncedLabel: t.profile.lastSynced,
        lightLabel: t.profile.lightTheme,
        loading: preferencesLoading,
        loadingLabel: t.common.loading,
        mutedTextClassName,
        noDataLabel: t.common.noData,
        notificationToggleConfigs,
        notificationsLabel: t.profile.notifications,
        onLanguageChange: setLanguage,
        onPreferenceToggle,
        onRetry: () => {
          void refetchPreferences();
        },
        onToggleTheme: toggleTheme,
        preferencesVisibilityLabel,
        privacyToggleConfigs,
        profileVisibilityLabel: t.profile.profileVisibility,
        providerPreferences: providerPreferences
          ? createProviderPreferencesFormValues(providerPreferences)
          : null,
        refreshing: preferencesRefreshing,
        retryLabel: t.common.retry,
        themeLabel: t.profile.theme,
        title: t.profile.preferences,
        conversationsLabel: t.messages.conversations,
      },
      professionalSection: {
        bioLabel: t.profile.bio,
        businessNameLabel: t.profile.businessName,
        cancelLabel: t.common.cancel,
        form: professionalForm,
        idBase: PROVIDER_PROFILE_TAB_ID_BASE,
        isNutritionProvider,
        nutritionSubtypeLabel: t.profile.nutritionSubtype,
        nutritionSubtypeOptions: NUTRITION_PROVIDER_SUBTYPE_VALUES.map((subtype) => ({
          value: subtype,
          label: getNutritionSubtypeLabel(subtype, t) ?? subtype,
        })),
        noDataLabel: t.common.noData,
        onFieldChange: resetUpdateProfile,
        onReset: onProfessionalReset,
        onSubmit: onProfessionalSubmit,
        providerCategoryFieldLabel: t.profile.providerCategory,
        providerCategoryLabel,
        refreshing: profileRefreshing,
        saveDisabled: professionalSaveDisabled,
        saveLabel: t.profile.saveChanges,
        saving: profileSaving,
        savingLabel: t.profile.saving,
        serviceRadiusLabel: t.profile.serviceRadius,
        specializationLabel: t.profile.specialization,
        title: t.profile.professionalTab,
      },
      securitySection: {
        tabId: 'securite',
      },
    },
    providerCategoryLabel,
    providerMissingTitle: t.profile.professionalTab,
    providerPreferences,
    tabs,
    text: {
      accountTab: t.profile.accountTab,
      address: t.signup.address,
      bio: t.profile.bio,
      businessName: t.profile.businessName,
      cancel: t.common.cancel,
      city: t.signup.city,
      conversations: t.messages.conversations,
      darkTheme: t.profile.darkTheme,
      email: t.auth.email,
      error: t.common.error,
      firstName: t.signup.firstName,
      language: t.profile.language,
      lastName: t.signup.lastName,
      lastSynced: t.profile.lastSynced,
      lightTheme: t.profile.lightTheme,
      loading: t.common.loading,
      noData: t.common.noData,
      notifications: t.profile.notifications,
      nutritionSubtype: t.profile.nutritionSubtype,
      phone: t.profile.phone,
      postalCode: t.profile.postalCode,
      preferences: t.profile.preferences,
      professionalTab: t.profile.professionalTab,
      profileTitle: t.profile.title,
      profileVisibility: t.profile.profileVisibility,
      providerCategory: t.profile.providerCategory,
      retry: t.common.retry,
      saveChanges: t.profile.saveChanges,
      saved: t.profile.saved,
      saving: t.profile.saving,
      security: t.profile.security,
      serviceRadius: t.profile.serviceRadius,
      specialization: t.profile.specialization,
      theme: t.profile.theme,
    },
  };
}
