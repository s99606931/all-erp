import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'hrMfe',
      filename: 'remoteEntry.js',
      // Shell 앱에 노출할 모듈
      exposes: {
        './routes': './src/routes.tsx',
      },
      // Shell 앱과 공유할 라이브러리
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3101,
    strictPort: true,
    host: true, // Docker 환경
    cors: true, // CORS 활성화
  },
});
