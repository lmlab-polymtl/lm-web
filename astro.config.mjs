import { defineConfig } from "astro/config";

const base = process.env.ASTRO_BASE ?? "/";
const site = process.env.ASTRO_SITE ?? "https://lmlab.ca";

export default defineConfig({
  site,
  base,
});
