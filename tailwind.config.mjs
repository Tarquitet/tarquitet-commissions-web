/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626', // Rojo principal para botones/acentos
          darkred: '#991b1b', // Rojo más oscuro para degradados
          black: '#0a0a0a', // Fondo principal
          gray: '#1f2937', // Secciones secundarias o cartas
          light: '#f3f4f6', // Textos (blanco/grisáceo para no cansar la vista)
        },
      },
    },
  },
  plugins: [],
};
