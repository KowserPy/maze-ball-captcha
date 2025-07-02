import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: true,
		strictPort: true,
		allowedHosts: ["609e-103-152-147-204.ngrok-free.app"], // ← your ngrok domain
	},

	plugins: [react(), tailwindcss()],
});
