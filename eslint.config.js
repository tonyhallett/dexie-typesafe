// @ts-check
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";

export default [
  // Files/folders to ignore
  {
    ignores: [
      "node_modules",
      "coverage",
      ".dist",
      ".DS_Store",
      "dist",
      "types",
      "demo/dist",
      "demo/.parcel-cache",
      "readme-assets",
      "Dexie-typesafe-recorder",
    ],
  },

  // Base JS config
  js.configs.recommended,

  // TypeScript parser and plugin (minimal rules to avoid TS version coupling)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Disable core rules that duplicate TS checks or cause noise in this repo
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Allow TS overloads / declaration merging
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": ["error", { ignoreDeclarationMerge: true }],
    },
  },

  // Global rules/plugins applied to all files
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // React in demo folder
  {
    files: ["demo/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-undef": "off",
    },
  },

  // Node/CommonJS config files
  {
    files: ["jest.config.cjs"],
    rules: {
      "no-undef": "off",
    },
    languageOptions: {
      sourceType: "commonjs",
    },
  },

  // Jest globals for tests
  {
    files: ["**/__tests__/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        // Common Jest globals
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
];
