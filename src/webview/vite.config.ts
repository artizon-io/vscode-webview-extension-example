import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsDir: "",
    minify: false,
    rollupOptions: {
      input: "src/webview/outline/index.tsx",
      output: {
        dir: "dist/webview/outline",
        format: "iife",
        entryFileNames: "index.js",
        manualChunks: undefined,
      },
    },
  },
});
