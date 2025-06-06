import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// DEBUGGING VERCEL
console.warn("Vercel Build - VITE_GRAPHQL_API_URI:", process.env.VITE_GRAPHQL_API_URI);

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],

	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
