import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import './src/styles/style.scss';`, // Exemples de données additionnelles à inclure
        silenceDeprecations: ['legacy-js-api'], // Désactiver les avertissements de dépréciation
      },
    },
  },
  server: {
    port: 3000, // Définir le port sur 3000
    https: {
      key: fs.readFileSync('./ssl/private.key'),
      cert: fs.readFileSync('./ssl/certificate.crt'),
    },
  },
});
