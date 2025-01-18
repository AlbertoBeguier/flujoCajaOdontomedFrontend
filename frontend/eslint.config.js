import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] }, // Ignora la carpeta de salida
  {
    files: ["**/*.{js,jsx}"], // Aplica reglas a archivos JS y JSX
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser, // Soporte para el entorno del navegador
        ...globals.node, // Soporte para el entorno de Node.js
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } }, // Configuración para React
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // Reglas recomendadas para JS
      ...react.configs.recommended.rules, // Reglas recomendadas para React
      ...react.configs["jsx-runtime"].rules, // Reglas para el runtime de JSX
      ...reactHooks.configs.recommended.rules, // Reglas recomendadas para React Hooks
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-undef": "off", // Evita errores en variables globales como `process`
    },
  },
];
