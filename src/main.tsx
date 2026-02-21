import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Render the app immediately — don't block on monitoring init
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Lazy-load monitoring after initial paint — keeps critical bundle small
// Highlight.io (rrweb ~680KB) and PostHog are deferred to separate chunks

if (import.meta.env.VITE_HIGHLIGHT_PROJECT_ID) {
  import('./lib/monitoring').then(({ initMonitoring }) => initMonitoring());
}

if (import.meta.env.VITE_POSTHOG_KEY) {
  import('./lib/analytics').then(({ initAnalytics }) => initAnalytics());
}
