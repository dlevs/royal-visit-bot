import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	// For assets to resolve correctly on https://dlevs.github.io/tug-of-war/
	base: "/tug-of-war/",
});
