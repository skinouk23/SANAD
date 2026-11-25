import { AppStartupLoader } from '@/app/shell/AppShell';

/**
 * Full-page loader used only before the router is ready on first load.
 */
export function RouterFallback() {
  return (
    <AppStartupLoader subtitle="Connexion aux services securises et chargement de votre experience Care@Home." />
  );
}
