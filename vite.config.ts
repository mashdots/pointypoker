import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.svg'],
  build: {
    outDir: 'public',
  },
  resolve: {
    alias: {
      assets: '/src/assets',
      components: '/src/components',
      modules: '/src/modules',
      services: '/src/services',
      types: '/src/types',
      utils: '/src/utils',
    },
  },
  plugins: [ react(), svgr() ],
});

/// <reference types="vite-plugin-svgr/client" />
