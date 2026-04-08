import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Headers sans CSP : utilisés en dev où Vite/React Fast Refresh
// injectent des inline scripts (preamble HMR) incompatibles avec
// un script-src strict.
const devHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// CSP strict pour le build bundlé (vite preview) : aucun inline script
// n'est nécessaire après bundling. En déploiement réel, reproduire ces
// headers côté serveur (nginx, CDN, etc.).
const previewHeaders = {
  ...devHeaders,
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'",
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: devHeaders,
  },
  preview: {
    headers: previewHeaders,
  },
  build: {
    // Ne pas exposer les sources en production
    sourcemap: false,
  },
});
