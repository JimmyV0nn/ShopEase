import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration for ShopEase React Frontend
 *
 * Features:
 *  - React plugin with Fast Refresh for hot module reloading
 *  - API proxy: redirects /api requests to Express backend during dev
 *  - In production: build outputs to dist/ (served by Express)
 */
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api requests to Express backend during development
    // This avoids CORS issues when frontend and backend run on different ports
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Express server port (or read from env)
        changeOrigin: true,
      },
    },
  },
});
