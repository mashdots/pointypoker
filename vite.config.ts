import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.svg'],
  build: {
    outDir: 'public',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) return id.toString().split('node_modules/')[ 1 ].split('/')[ 0 ].toString();
        },
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@yappy/types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  plugins: [react(), svgr()],
});

/// <reference types="vite-plugin-svgr/client" />
