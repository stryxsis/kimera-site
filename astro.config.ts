// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO(FASE 9): placeholder — nessun dominio confermato dal cliente (PROGRESS.md, questione #9).
  // Sostituire con il dominio reale (custom o sottodominio Netlify) prima del deploy.
  site: 'https://kimere.placeholder.dev',
  output: 'static',
  trailingSlash: 'always',
  // Il default 'jsx' (Astro 7) mangia gli spazi tra testo e tag inline su interruzioni di
  // riga (es. "within<a href…>" invece di "within <a href…>") — verificato in build di test.
  // true preserva la spaziatura autentica, essenziale per il copy con link/enfasi inline.
  compressHTML: true,
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
