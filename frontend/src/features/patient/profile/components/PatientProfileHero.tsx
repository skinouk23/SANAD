import { Camera, RefreshCw } from 'lucide-react';

interface PatientProfileHeroProps {
  displayName: string;
  email: string;
  roleLabel: string;
  memberSinceText: string;
  changePhotoLabel: string;
  avatarUrl?: string | null;
  avatarInitial: string;
  hasAvatarImage: boolean;
  avatarUploading: boolean;
  mutedTextClassName: string;
  onAvatarClick: () => void;
  onAvatarError: () => void;
}

export function PatientProfileHero({
  displayName,
  email,
  roleLabel,
  memberSinceText,
  changePhotoLabel,
  avatarUrl,
  avatarInitial,
  hasAvatarImage,
  avatarUploading,
  onAvatarClick,
  onAvatarError,
}: PatientProfileHeroProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={onAvatarClick}
          disabled={avatarUploading}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-80 sm:h-24 sm:w-24 sm:text-3xl"
          aria-label={changePhotoLabel}
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
          <span className="rounded-full border border-cyan-200 bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-400">
            {roleLabel}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{memberSinceText}</span>
        </div>
      </div>
    </div>
  );
}
