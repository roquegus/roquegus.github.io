import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Bundles src/embed/render.tsx for the design picker on callenueve.com/design.
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    lib: { entry: "src/embed/render.tsx", name: "C9Render", formats: ["iife"], fileName: () => "c9-render.js" },
    outDir: "../callenueve-web/design",
    emptyOutDir: false,
    minify: true,
  },
});
