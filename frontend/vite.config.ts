import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import './src/styles/style.scss';`, // Exemples de données additionnelles à inclure
        silenceDeprecations: ["legacy-js-api"], // Désactiver les avertissements de dépréciation
      },
    },
  },
  server: {
    port: 3000, // Définir le port sur 3000
  },
  build: {
    outDir: "dist", // Vérifie que cette option est bien définie
  },
});
