import type { ProviderResponse } from './schema';

/**
 * Returns a display name for a provider.
 * Prefers businessName, falls back to firstName + lastName.
 */
export function getProviderDisplayName(provider: ProviderResponse): string {
  if (provider.businessName) return provider.businessName;
  return [provider.firstName, provider.lastName].filter(Boolean).join(' ') || 'Provider';
}

/**
 * Returns a formatted location string from flat address fields.
 */
export function getProviderLocation(provider: ProviderResponse): string | null {
  const parts = [provider.addressLine1, provider.city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

/**
 * Returns the provider's profile picture URL or null.
 */
export function getProviderImageUrl(provider: ProviderResponse): string | null {
  return provider.profilePictureUrl ?? null;
}
