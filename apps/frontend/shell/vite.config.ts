import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        // System 도메인
        systemMfe: 'http://localhost:3100/assets/remoteEntry.js',
        
        // HR 도메인
        hrMfe: 'http://localhost:3101/assets/remoteEntry.js',
        payrollMfe: 'http://localhost:3102/assets/remoteEntry.js',
        attendanceMfe: 'http://localhost:3103/assets/remoteEntry.js',
        
        // Finance 도메인
        budgetMfe: 'http://localhost:3104/assets/remoteEntry.js',
        treasuryMfe: 'http://localhost:3105/assets/remoteEntry.js',
        accountingMfe: 'http://localhost:3106/assets/remoteEntry.js',
        
        // General 도메인
        assetMfe: 'http://localhost:3107/assets/remoteEntry.js',
        inventoryMfe: 'http://localhost:3108/assets/remoteEntry.js',
        generalAffairsMfe: 'http://localhost:3109/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        zustand: { singleton: true },
      },
    }),
  ],
  resolve: {
    alias: {
      '@all-erp/ui-design': '../../../libs/shared/ui-design/src/index.ts',
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true, // Docker 환경을 위한 설정
  },
});
