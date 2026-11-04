import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// No GitHub Pages o site fica em https://<usuario>.github.io/<repositorio>/.
// O workflow de CI define BASE_PATH e SITE_URL; localmente o site roda na raiz.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.github.io',
  base: process.env.BASE_PATH ?? '/',
  integrations: [react()],
});
