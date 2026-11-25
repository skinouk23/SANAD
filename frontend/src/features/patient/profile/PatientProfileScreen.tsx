import { PatientProfileHero } from '@/features/patient/profile/components/PatientProfileHero';
import {
  PatientProfileErrorState,
  PatientProfileLoadingState,
  PatientProfileTabContent,
} from '@/features/patient/profile/PatientProfileScreenSections';
import { usePatientProfileScreen } from '@/features/patient/profile/usePatientProfileScreen';
import { DeleteAccountDialog, ProfileDangerZone } from '@/shared/ui/composites/profile-account';
import { ProfileTabBar } from '@/shared/ui/composites/profile-tabs';

export function PatientProfileScreen() {
  const screen = usePatientProfileScreen();

  if (screen.isProfileInitialLoading) {
    return <PatientProfileLoadingState loadingLabel={screen.text.common.loading} />;
  }

  if (!screen.profile) {
    return <PatientProfileErrorState screen={screen} />;
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-6 pb-24">
          <PatientProfileHero {...screen.heroProps} />

          <input
            ref={screen.avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              void screen.onAvatarChange(event);
            }}
          />

          <ProfileTabBar
            activeTab={screen.activeTab}
            ariaLabel={screen.tabAriaLabel}
            idBase={screen.idBase}
            onChange={screen.onSetActiveTab}
            tabs={screen.tabs}
          />

          <PatientProfileTabContent screen={screen} />

          <ProfileDangerZone {...screen.dangerZoneProps} />
        </div>
      </div>

      <DeleteAccountDialog {...screen.deleteDialogProps} />
    </>
  );
}
