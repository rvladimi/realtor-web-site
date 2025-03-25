import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    cors: true,
    proxy: {
      "/record": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/record/, ""),
      },
    },
  },
});
