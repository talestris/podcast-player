import { defineConfig } from "vite";

export default defineConfig({
  base: "/podcast-player/",

  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
