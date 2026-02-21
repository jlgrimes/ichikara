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
// Both Highlight.io (rrweb ~500KB) and PostHog are deferred to a separate chunk
if (import.meta.env.VITE_HIGHLIGHT_PROJECT_ID) {
  import('./lib/monitoring').then(({ initMonitoring }) => initMonitoring());
}
