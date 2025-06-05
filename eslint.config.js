import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	// Global ignores
	{
		ignores: ["node_modules/", "dist/", "build/", "src/graphql/generated/"],
	},
	// Recommended JavaScript rules
	js.configs.recommended,

	// Configuration for TypeScript and React files
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: "latest",
				sourceType: "module",
				// FIX: Use a more robust glob for project to ensure tsconfig.json is found
				// This will look for tsconfig.json in the current directory and any subdirectories.
				project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
			"react-refresh": reactRefreshPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			...tsPlugin.configs["recommended-type-checked"].rules,
			...tsPlugin.configs.stylistic.rules,
			...tsPlugin.configs["stylistic-type-checked"].rules,

			...reactPlugin.configs.recommended.rules,
			...reactPlugin.configs["jsx-runtime"].rules,
			...reactHooksPlugin.configs.recommended.rules,

			// Custom rules and overrides
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/no-explicit-any": "warn",
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"no-console": "warn",
			"max-len": ["warn", { code: 120, tabWidth: 2, ignoreComments: true, ignoreUrls: true }],
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	// Prettier config should be last to disable formatting rules
	eslintConfigPrettier,
];
