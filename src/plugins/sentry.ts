import { captureException, init, setTag } from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { App } from 'vue';
import { version } from '../../package.json';
import { isProductionMode } from './modes';

// Using Sentry's vanila JS package (@sentry/browser) here instead of
// the official vue package (@sentry/vue) because it doesn't support vue 3 yet.
// https://github.com/getsentry/sentry-javascript/issues/2925

function shouldInitSentry() {
  if (isProductionMode()) {
    if (!import.meta.env.VITE_SENTRY_AUTH_TOKEN) {
      console.warn(
        'Sentry disabled because VITE_SENTRY_AUTH_TOKEN env was not provided'
      );
      return false;
    }
    return true;
  }
  return false;
}

export default function initSentry(app: App) {
  if (shouldInitSentry()) {
    app.config.errorHandler = (error, _, info) => {
      try {
        setTag('info', info);
        captureException(error, {
          extra: {
            error: error,
          },
        });
      } catch (error) {
        console.error('Failed to send error to Sentry', error);
      }
    };

    init({
      dsn: 'https://231f98093d7341a68fded44e6ad93738@o4505603946315776.ingest.sentry.io/4505603947954176',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
      release: `frontend-v2@${version}`,
    });
  }
}
