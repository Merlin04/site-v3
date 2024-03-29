import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [/*react(), */image(), mdx(), tailwind({
    config: { applyBaseStyles: false }
  })],
  output: "server",
  adapter: vercel()
});