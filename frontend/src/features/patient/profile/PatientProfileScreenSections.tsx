import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { AccountSecuritySection } from '@/features/auth';
import { PatientAccountTab } from '@/features/patient/profile/components/PatientAccountTab';
import { PatientHealthTab } from '@/features/patient/profile/components/PatientHealthTab';
import { PatientPreferencesTab } from '@/features/patient/profile/components/PatientPreferencesTab';
import { FormActions } from '@/shared/ui/composites/form-field';
import {
  FormSkeleton,
  SkeletonChipRow,
  SkeletonProfileHeader,
} from '@/shared/ui/composites/loading';
import { ProfilePanel } from '@/shared/ui/composites/profile-surface';

import type { PatientProfileScreenViewModel } from '@/features/patient/profile/usePatientProfileScreen';
import type { ReactNode } from 'react';

export function PatientProfileLoadingState({ loadingLabel }: { loadingLabel: string }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 pb-24">
        <div aria-live="polite" className="space-y-6">
          <span className="sr-only">{loadingLabel}</span>
          <SkeletonProfileHeader chipCount={1} statCount={2} />
          <div className="space-y-6">
            <SkeletonChipRow items={4} chipClassName="h-10 rounded-xl" />
            <div className="space-y-4">
              <FormSkeleton className="border-border/70 bg-card/95 shadow-sm" fields={6} />
              <FormActions className="border-t border-border/70 pt-5">
                <div className="flex w-full justify-end gap-3">
                  <div className="h-10 w-24 rounded-xl bg-muted" />
                  <div className="h-10 w-32 rounded-xl bg-muted" />
                </div>
              </FormActions>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PatientProfileErrorState({ screen }: { screen: PatientProfileScreenViewModel }) {
  const errorMessage = screen.profileInitialLoadError ?? screen.text.common.loadingError;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 pb-24">
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {screen.text.profile.title}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{screen.text.auth.patient}</h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" role="alert">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {screen.text.common.loadingError}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
              </div>

              <button
                type="button"
                onClick={screen.onRetryProfileInitialLoad}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                {screen.text.common.retry}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PatientProfileTabContent({ screen }: { screen: PatientProfileScreenViewModel }) {
  let content: ReactNode = null;

  if (screen.activeTab === 'compte') {
    content = <PatientAccountTab {...screen.profileTabContent.accountSection} />;
  }

  if (screen.activeTab === 'sante') {
    content = <PatientHealthTab {...screen.profileTabContent.healthSection} />;
  }

  if (screen.activeTab === 'preferences') {
    content = <PatientPreferencesTab {...screen.profileTabContent.preferencesSection} />;
  }

  if (screen.activeTab === 'securite') {
    content = (
      <ProfilePanel idBase={screen.idBase} tabId={screen.profileTabContent.securitySection.tabId}>
        <AccountSecuritySection />
      </ProfilePanel>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen.activeTab}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        exit={{ opacity: 0, y: -10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
