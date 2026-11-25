import type { ReactNode } from 'react';

import { getDeterministicAvatarGradient } from './avatar-gradient';

const AVATAR_CONTAINER_CLASSES = {
  conversationList:
    'flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-bold',
  chatHeader:
    'relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg text-base font-bold',
} as const;

export type MessagingAvatarVariant = keyof typeof AVATAR_CONTAINER_CLASSES;

interface MessagingAvatarProps {
  avatarUrl: string | null | undefined;
  children?: ReactNode;
  displayName: string;
  seed: string;
  variant: MessagingAvatarVariant;
}

export function MessagingAvatar({
  avatarUrl,
  children,
  displayName,
  seed,
  variant,
}: MessagingAvatarProps) {
  const avatarGradient = getDeterministicAvatarGradient(seed);

  return (
    <div
      className={`${AVATAR_CONTAINER_CLASSES[variant]} ${
        avatarUrl
          ? 'border border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
          : `bg-gradient-to-br ${avatarGradient} text-white shadow-sm`
      }`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
      ) : (
        displayName.charAt(0).toUpperCase()
      )}
      {children}
    </div>
  );
}
