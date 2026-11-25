let cachedToken: string | null = null;

export function setTokenCache(token: string | null): void {
  cachedToken = token;
}

export function getTokenCache(): string | null {
  return cachedToken;
}
