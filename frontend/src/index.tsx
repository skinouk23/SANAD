import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { initializeRuntime } from '@/app/bootstrap/runtime';
import { runtimeDiagnostics } from '@/shared/lib/monitoring';

/**
 * Async boot sequence.
 *
 * When mock data is enabled, MSW must be started and its service
 * worker registered *before* React renders. Otherwise early API
 * calls from hooks would hit the real (non-existent) backend and
 * fail before MSW has a chance to intercept.
 */
async function boot() {
  const bootstrapState = await initializeRuntime();

  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');
  const root = createRoot(container);
  root.render(
    <App
      initialI18nState={bootstrapState.initialI18nState}
      initialLanguageCode={bootstrapState.initialLanguageCode}
    />,
  );
}

function renderBootFailure(error: unknown): void {
  const diagnostic = runtimeDiagnostics.captureBootstrapFailure(error, { phase: 'boot-render' });
  const container = document.getElementById('root');
  const message = error instanceof Error ? error.message : 'Unknown bootstrap error';

  if (import.meta.env.DEV) {
    console.error('[boot] Failed to start application', error);
  }

  if (!container) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.fontFamily = 'system-ui, sans-serif';
  wrapper.style.whiteSpace = 'pre-wrap';

  const title = document.createElement('h1');
  title.textContent = 'Application failed to start';

  const summary = document.createElement('p');
  summary.textContent =
    'The application could not start safely. Reload the page or contact support with the reference below.';

  const reference = document.createElement('p');
  reference.textContent = `Reference: ${diagnostic.id}`;
  reference.style.marginTop = '12px';
  reference.style.fontFamily = 'ui-monospace, SFMono-Regular, monospace';

  const details = document.createElement('pre');
  details.textContent = import.meta.env.DEV
    ? message
    : 'Bootstrap diagnostics were captured locally.';
  details.style.marginTop = '12px';
  details.style.fontFamily = 'ui-monospace, SFMono-Regular, monospace';

  wrapper.append(title, summary, reference, details);
  container.replaceChildren(wrapper);
}

void boot().catch(renderBootFailure);
