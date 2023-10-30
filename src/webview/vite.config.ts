import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsDir: "",
    minify: false,
    rollupOptions: {
      input: "src/webview/src/index.tsx",
      output: {
        dir: "dist/webview",
        format: "iife",
        entryFileNames: "index.js",
        manualChunks: undefined,
      },
    },
  },
  test: {
    include: ["src/webview/tests/**"],
  }
});
