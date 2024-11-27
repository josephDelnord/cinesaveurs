import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import './src/styles/global.scss';`, // Exemples de données additionnelles à inclure
        silenceDeprecations: ['legacy-js-api'], // Désactiver les avertissements de dépréciation
      },
    },
  },
  server: {
    port: 3000, // Définir le port sur 3000
  },
});
  