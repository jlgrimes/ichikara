import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.ichikara.ichikara',
  appName: 'Ichikara',
  webDir: 'dist',
  ios: {
    contentInset: 'never', // we handle safe areas in CSS via env(safe-area-inset-*)
  },
};

export default config;
