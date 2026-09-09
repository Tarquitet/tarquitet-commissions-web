import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Importamos el nuevo plugin de Vite

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://art.tarquitet.com',
  // Mantenemos solo React en integrations
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false, // '/about' es español, '/en/about' es inglés
    },
  },
  // Agregamos Tailwind a través de la configuración de Vite
  vite: {
    plugins: [tailwindcss()],
  },
});
