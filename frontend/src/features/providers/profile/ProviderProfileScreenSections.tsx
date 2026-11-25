import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { ProviderAccountTab } from '@/features/providers/profile/components/ProviderAccountTab';
import { ProviderPreferencesTab } from '@/features/providers/profile/components/ProviderPreferencesTab';
import { ProviderProfessionalTab } from '@/features/providers/profile/components/ProviderProfessionalTab';
import { AccountSecuritySection } from '@/features/auth';
import { FormActions } from '@/shared/ui/composites/form-field';
import {
  FormSkeleton,
  SkeletonChipRow,
  SkeletonProfileHeader,
} from '@/shared/ui/composites/loading';
import { ProfilePanel } from '@/shared/ui/composites/profile-surface';

import type { ProviderProfileScreenViewModel } from './useProviderProfileScreen';
import type { ReactNode } from 'react';

export function ProviderProfileLoadingState({ loadingLabel }: { loadingLabel: string }) {
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

export function ProviderProfileErrorState({
  errorMessage,
  mutedTextClassName,
  onRetry,
  retryLabel,
  title,
  heading,
}: {
  errorMessage: string | null;
  mutedTextClassName: string;
  onRetry: () => void;
  retryLabel: string;
  title: string;
  heading: string;
}) {
  const cardClassName = 'rounded-2xl border border-border bg-card p-5 shadow-sm';

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 pb-24">
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <p className={`text-xs uppercase tracking-[0.2em] ${mutedTextClassName}`}>{title}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{heading}</h1>
        </div>
        <div className={cardClassName} role="alert">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
                <p className={`mt-1 text-sm ${mutedTextClassName}`}>{errorMessage}</p>
              </div>

              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                {retryLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProviderProfileTabContent({ screen }: { screen: ProviderProfileScreenViewModel }) {
  let content: ReactNode = null;

  if (screen.activeTab === 'compte') {
    content = <ProviderAccountTab {...screen.profileTabContent.accountSection} />;
  }

  if (screen.activeTab === 'professionnel') {
    content = <ProviderProfessionalTab {...screen.profileTabContent.professionalSection} />;
  }

  if (screen.activeTab === 'preferences') {
    content = <ProviderPreferencesTab {...screen.profileTabContent.preferencesSection} />;
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
