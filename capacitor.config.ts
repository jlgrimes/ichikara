import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.ichikara.ichikara',
  appName: 'Ichikara',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
};

export default config;
