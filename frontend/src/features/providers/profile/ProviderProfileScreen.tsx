import { ProviderProfileHero } from '@/features/providers/profile/components/ProviderProfileHero';
import { DeleteAccountDialog, ProfileDangerZone } from '@/shared/ui/composites/profile-account';
import { ProfileTabBar } from '@/shared/ui/composites/profile-tabs';

import {
  ProviderProfileErrorState,
  ProviderProfileLoadingState,
  ProviderProfileTabContent,
} from './ProviderProfileScreenSections';
import { useProviderProfileScreen } from './useProviderProfileScreen';

export function ProviderProfileScreen() {
  const screen = useProviderProfileScreen();

  if (screen.isProfileLoadingState) {
    return <ProviderProfileLoadingState loadingLabel={screen.text.loading} />;
  }

  if (!screen.profile) {
    return (
      <ProviderProfileErrorState
        errorMessage={screen.fetchErrorMessage ?? screen.text.error}
        heading={screen.providerMissingTitle}
        mutedTextClassName={screen.mutedTextClassName}
        onRetry={screen.onRetryProfile}
        retryLabel={screen.text.retry}
        title={screen.text.profileTitle}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-6 pb-24">
          <ProviderProfileHero {...screen.heroProps} />

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
            ariaLabel={screen.text.profileTitle}
            idBase={screen.idBase}
            onChange={screen.onSetActiveTab}
            tabs={screen.tabs}
          />

          <ProviderProfileTabContent screen={screen} />

          <ProfileDangerZone {...screen.dangerZoneProps} />
        </div>
      </div>

      <DeleteAccountDialog {...screen.deleteDialogProps} />
    </>
  );
}
