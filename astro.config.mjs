import { defineConfig } from "astro/config";

const base = process.env.ASTRO_BASE ?? "/";
const site = process.env.ASTRO_SITE ?? "https://lmlab-polymtl.github.io";

export default defineConfig({
  site,
  base,
});
