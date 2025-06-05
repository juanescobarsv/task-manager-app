import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import { fixupConfigAsPlugin } from "@eslint/compat";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
	{
		ignores: ["node_modules/", "dist/", "build/", "src/graphql/generated/"],
	},
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs["recommended-type-checked"],
			...tseslint.configs.stylistic,
			...tseslint.configs["stylistic-type-checked"],
			eslintConfigPrettier,
		],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: "latest",
				sourceType: "module",
				project: ["./tsconfig.json"],
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			react: fixupConfigAsPlugin(reactPlugin),
			"react-hooks": fixupConfigAsPlugin(reactHooks),
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
			...reactPlugin.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/no-explicit-any": "warn",
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"no-console": "warn",
			"max-len": ["warn", { code: 120, tabWidth: 2, ignoreComments: true, ignoreUrls: true }],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
);
