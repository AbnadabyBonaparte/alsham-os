import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import path from "path";
import { fileURLToPath } from "url";

// Corrige __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
    vitePluginManusRuntime(),
  ],

  // ALIAS CORRETOS — ESSA É A CHAVE DO SUCESSO
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      // Adiciona esses dois pra garantir que funcione em qualquer lugar
      "@/components": path.resolve(__dirname, "client/src/components"),
      "@/lib": path.resolve(__dirname, "client/src/lib"),
    },
  },

  envDir: __dirname,
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client/public"),

  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    host: true,
    open: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
      "/trpc": { target: "http://localhost:3001", changeOrigin: true },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});