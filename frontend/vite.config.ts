import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@lbr77/anisette-js": "@lbr77/anisette-js/browser",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/wisp": { target: "ws://localhost:8080", ws: true },
    },
  },
});
