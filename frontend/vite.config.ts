import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import fs from 'node:fs';
// import path from 'node:path';

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
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'ssl/private.key')),  // Utiliser le chemin absolu
    //   cert: fs.readFileSync(path.resolve(__dirname, 'ssl/certificate.crt')),  // Utiliser le chemin absolu
    // },
  },
  build: {
    outDir: 'dist',  // Vérifie que cette option est bien définie
  },
});
