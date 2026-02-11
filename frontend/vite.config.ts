import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({typescript: true}),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@styles': resolve(__dirname, 'src/Styles'),
      '@ui': resolve(__dirname, 'src/Components/UI'),
      '@widgets': resolve(__dirname, 'src/Components/Widgets'),
      '@layouts': resolve(__dirname, 'src/Components/Layouts'),
      '@schemas' : resolve(__dirname, 'src/Schemas')
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        entryFileNames: `[name]-[hash].js`,
        chunkFileNames: `[name]-[hash].js`,
        assetFileNames: `[name]-[hash].[ext]`,
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            'recharts', 
            '@recharts/devtools',
            'react-datepicker',
            'react-toastify'
          ],
          'vendor-utils': [
            'lodash',
            'date-fns',
            'yup',
            'classnames',
            'class-variance-authority'
          ],
          'vendor-state': [
            '@tanstack/react-query',
            'axios',
            'react-hook-form',
            '@hookform/resolvers'
          ],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@styles/mixins.scss";',
        silenceDeprecations: ['import', 'legacy-js-api'],
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
});
