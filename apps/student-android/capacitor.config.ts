import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.truemuster.student',
  appName: 'TrueMuster Student',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
