import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // `host: true` exposes the dev server on the LAN; add your own tunnel
    // hostname to `allowedHosts` if you serve it through one.
    host: true,
    cors: true,
  },
  build: {
    outDir: "dist",
  },
});
