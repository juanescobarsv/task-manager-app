import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // 1. Global ignores for build artifacts, node modules, and generated code
  {
    ignores: ["node_modules/", "dist/", "build/", "src/graphql/generated/"],
  },

  // 2. Recommended base JavaScript rules
  js.configs.recommended,

  // 3. Configuration for TypeScript and React files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        // Explicitly list all relevant tsconfig files for composite projects
        project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser, // Browser global variables (window, document, etc.)
        ...globals.node,    // Node.js global variables (process, require, etc.)
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      // TypeScript ESLint Recommended Rules
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended-type-checked"].rules, // Requires parserOptions.project
      ...tsPlugin.configs.stylistic.rules,                   // Optional stylistic rules
      ...tsPlugin.configs["stylistic-type-checked"].rules,   // Optional stylistic type-checked rules

      // React Recommended Rules (for JSX transform)
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules, // Specifically for the new JSX transform

      // React Hooks Rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Custom rules and overrides
      // Turn off base ESLint rule for no-unused-vars and use TypeScript version
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Warn on explicit 'any' usage
      "@typescript-eslint/no-explicit-any": "warn",

      // No need for 'import React' with new JSX transform
      "react/react-in-jsx-scope": "off",
      // Not needed with TypeScript for prop-types checking
      "react/prop-types": "off",

      // Convert console.log to warn, or remove it entirely
      "no-console": ["warn", { allow: ["warn", "error"] }], // Allow console.warn and console.error for debugging

      // Max line length (adjust 'code' value as per your team's preference)
      "max-len": ["warn", { "code": 120, "tabWidth": 2, "ignoreComments": true, "ignoreUrls": true }],

      // Prefer optional chaining for property access on potentially null/undefined values
      "@typescript-eslint/prefer-optional-chain": "error",

      // Prefer nullish coalescing (??) over logical OR (||) for null/undefined checks
      "@typescript-eslint/prefer-nullish-coalescing": "error",

      // Rules that might conflict with Codegen or common patterns
      // Set to "off" if you don't want to enforce these strictly or if they conflict with generated code
      "@typescript-eslint/consistent-indexed-object-style": "off", // Often conflicts with generated types
      "@typescript-eslint/consistent-type-definitions": "off",     // Allows 'type' aliases alongside 'interface'
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }], // Prefer `T[]` over `Array<T>`
      "@typescript-eslint/dot-notation": "warn", // Warn on bracket notation where dot notation is possible

      // Strict template expressions (often too strict for general usage with mixed types)
      "@typescript-eslint/restrict-template-expressions": ["warn", {
        allowNumber: true,
        allowBoolean: true,
        allowAny: true, // Allow 'any' in template literals if necessary for debugging
        allowNullish: true,
        allowRegExp: true
      }],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
  // 4. Override rules for generated GraphQL files (src/graphql/generated/graphql.ts)
  // We want to lint these files but disable rules that conflict with Codegen's output.
  {
    files: ["src/graphql/generated/graphql.ts"],
    rules: {
      "@typescript-eslint/consistent-indexed-object-style": "off", // Disable for generated files
      "@typescript-eslint/consistent-type-definitions": "off",     // Disable for generated files
      "@typescript-eslint/array-type": "off",                     // Disable for generated files
      // Add any other rules that conflict with generated code here
    },
  },
  // 5. Prettier config should be the last extension to disable formatting rules
  eslintConfigPrettier,
];
