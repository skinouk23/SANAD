/**
 * Conditional MSW startup.
 *
 * Dynamic import ensures MSW + handlers are tree-shaken from the
 * production bundle when ENABLE_MOCK_DATA is false. The caller in
 * index.tsx awaits this before rendering so no component fires a
 * real request before the service worker is ready.
 */
export async function setupMocks(): Promise<void> {
  const { worker } = await import('@/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });

  if (import.meta.env.DEV) {
    console.warn('[MSW] Mock service worker started — unhandled requests will pass through.');
  }
}
