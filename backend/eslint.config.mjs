import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ajouter l'environnement Node.js et Jest
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Ajout des globals pour Node.js
        ...globals.jest // Ajout des globals pour Jest
      }
    }
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error"
    }
  },
  pluginJs.configs.recommended,
];
