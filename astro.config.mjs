// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: "standalone",
  }),
  server: {
    host: "0.0.0.0",
    port: 4321,
  },
});
