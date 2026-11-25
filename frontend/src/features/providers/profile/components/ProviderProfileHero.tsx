import { Camera, RefreshCw, ShieldCheck, ShieldQuestion } from 'lucide-react';

import { Spinner } from '@/shared/ui/primitives/spinner';

interface ProviderProfileHeroProps {
  title: string;
  displayName: string;
  email: string;
  categoryLabel: string;
  memberSinceText: string;
  avatarUrl?: string | null;
  avatarInitial: string;
  hasAvatarImage: boolean;
  avatarUploading: boolean;
  verificationCanRequest: boolean;
  verificationIsVerified: boolean;
  verificationRequestPending: boolean;
  verificationRequestLabel: string;
  verificationStatusDescription: string;
  verificationStatusLabel: string;
  verificationTitle: string;
  mutedTextClassName: string;
  onAvatarClick: () => void;
  onAvatarError: () => void;
  onRequestVerification: () => void;
}

export function ProviderProfileHero({
  displayName,
  email,
  categoryLabel,
  memberSinceText,
  avatarUrl,
  avatarInitial,
  hasAvatarImage,
  avatarUploading,
  verificationCanRequest,
  verificationIsVerified,
  verificationRequestPending,
  verificationRequestLabel,
  verificationStatusDescription,
  verificationStatusLabel,
  verificationTitle,
  onAvatarClick,
  onAvatarError,
  onRequestVerification,
}: ProviderProfileHeroProps) {
  const VerificationIcon = verificationIsVerified ? ShieldCheck : ShieldQuestion;
  const verificationBadgeLabel = verificationCanRequest
    ? `${verificationTitle}: ${verificationStatusLabel}. ${verificationRequestLabel}`
    : `${verificationTitle}: ${verificationStatusLabel}. ${verificationStatusDescription}`;
  const verificationPillClasses = verificationIsVerified
    ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
    : 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400';
  const verificationPillContent = (
    <>
      {verificationRequestPending ? (
        <Spinner className="h-3.5 w-3.5 text-current" />
      ) : (
        <VerificationIcon className="h-3.5 w-3.5" />
      )}
      <span>{verificationCanRequest ? verificationRequestLabel : verificationStatusLabel}</span>
    </>
  );

  return (
    <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={onAvatarClick}
          disabled={avatarUploading}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-80 sm:h-24 sm:w-24 sm:text-3xl"
          aria-label="Changer la photo"
        >
          {hasAvatarImage ? (
            <img
              src={avatarUrl ?? undefined}
              alt=""
              className="h-full w-full object-cover"
              onError={onAvatarError}
            />
          ) : (
            <span>{avatarInitial}</span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white transition-colors group-hover:bg-black/35">
            <Camera className="h-5 w-5 opacity-0 drop-shadow-sm transition-opacity group-hover:opacity-100" />
          </span>
          {avatarUploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/45">
              <RefreshCw className="h-6 w-6 animate-spin text-white" />
            </span>
          ) : null}
        </button>
        <span className="pointer-events-none absolute bottom-0 right-0 rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm transition-colors hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white">
          <Camera className="h-4 w-4" />
        </span>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {displayName}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{email}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="rounded-full border border-purple-200 bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400">
            {categoryLabel}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{memberSinceText}</span>
          {verificationCanRequest ? (
            <button
              aria-label={verificationBadgeLabel}
              aria-live="polite"
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-80 ${verificationPillClasses}`}
              disabled={verificationRequestPending}
              onClick={onRequestVerification}
              title={verificationBadgeLabel}
              type="button"
            >
              {verificationPillContent}
            </button>
          ) : (
            <span
              aria-label={verificationBadgeLabel}
              aria-live="polite"
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${verificationPillClasses}`}
              role="status"
              title={verificationBadgeLabel}
            >
              {verificationPillContent}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
