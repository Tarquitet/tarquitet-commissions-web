import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Importamos el nuevo plugin de Vite

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Mantenemos solo React en integrations
  integrations: [react()],

  // Agregamos Tailwind a través de la configuración de Vite
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});