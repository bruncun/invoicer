import { vitePlugin as remix } from "@remix-run/dev";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(root, "app"),
      "@components": path.resolve(root, "app/components"),
      "@contexts": path.resolve(root, "app/contexts"),
      "@styles": path.resolve(root, "app/styles"),
      "@public": path.resolve(root, "public"),
    },
  },
  server: {
    port: 3000,
  },
  plugins: [remix()],
});
