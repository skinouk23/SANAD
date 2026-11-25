const AVATAR_GRADIENTS = [
  'from-cyan-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-red-500',
] as const;

export function getDeterministicAvatarGradient(seed: string): string {
  let hash = 0;

  for (const character of seed) {
    hash = (hash + character.charCodeAt(0)) % AVATAR_GRADIENTS.length;
  }

  return AVATAR_GRADIENTS[hash];
}
