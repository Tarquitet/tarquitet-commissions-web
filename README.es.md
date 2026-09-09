# Comisiones de Tarquitet

[![English](https://img.shields.io/badge/README-English-111827?style=for-the-badge&logo=readme&logoColor=white)](README.md)
[![Español](https://img.shields.io/badge/README-Espa%C3%B1ol-b91c1c?style=for-the-badge&logo=readme&logoColor=white)](README.es.md)
[![Astro](https://img.shields.io/badge/Astro-6-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

Portfolio profesional y sitio de comisiones de **Tarquitet**, artista digital e ingeniero multimedia. El sitio presenta su trabajo, opciones de comisión, alcance de los servicios, términos de servicio y canales de contacto en una experiencia enfocada y adaptable.

**Sitio web:** [art.tarquitet.com](https://art.tarquitet.com)

## Funcionalidades

- Presentación del artista y explicación de su proceso creativo.
- Galería de comisiones con categorías de comisiones personalizadas y YCH/poses.
- Configurador interactivo con versiones y detalles disponibles.
- Guías de alcance con solicitudes aceptadas y no disponibles.
- Sección de términos de servicio con la información legal más reciente.
- Sección de contacto con Discord, correo electrónico, redes sociales y formulario de solicitudes.
- Diseño adaptable con animaciones de entrada, metadatos sociales, URLs canónicas y soporte para sitemap.

## Tecnologías

- [Astro](https://astro.build/) para el framework y la entrega de páginas.
- [React](https://react.dev/) para los componentes interactivos.
- [Tailwind CSS](https://tailwindcss.com/) mediante la integración de Vite para los estilos.
- [Lucide React](https://lucide.dev/) para los iconos de la interfaz.
- TypeScript para las definiciones tipadas de componentes y contenido.

## Primeros pasos

### Requisitos

- Node.js `>=22.12.0`, según lo especificado en `package.json`.
- npm o [Bun](https://bun.sh/).

### Instalación

Desde el directorio del proyecto:

```bash
npm install
```

Con Bun:

```bash
bun install
```

### Desarrollo

Inicia el servidor de desarrollo local:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321`.

### Compilación de producción

Genera y previsualiza una compilación de producción:

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```text
src/
├── components/   # Componentes de interfaz Astro y React
├── data/         # Contenido, secciones, pagos y enlaces sociales
├── layouts/      # Layout compartido y metadatos del documento
├── pages/        # Páginas y rutas de Astro
├── styles/       # Estilos globales y tokens de diseño
└── utils/        # Utilidades para formatos y recursos multimedia
public/           # Recursos estáticos, iconos, favicon y robots.txt
```

La página principal se compone desde `src/pages/index.astro`, mientras que los textos editables del sitio están centralizados en `src/data/content.ts`.

## Scripts disponibles

| Comando           | Descripción                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo local.               |
| `npm run build`   | Genera el sitio de producción en `dist/`.             |
| `npm run preview` | Previsualiza localmente la compilación de producción. |
| `npm run astro`   | Ejecuta la CLI de Astro.                              |

## Contenido y configuración

- Actualiza los textos de la interfaz en `src/data/content.ts`.
- Actualiza el registro de secciones en `src/data/sections.ts`.
- Añade o reemplaza recursos estáticos en `public/` y `src/assets/`.
- Actualiza la URL canónica en `astro.config.mjs` si cambia el destino del despliegue.

## Licencia

Este proyecto no declara actualmente una licencia de código abierto. Salvo que se indique lo contrario, el código fuente, las ilustraciones y los recursos de marca pertenecen a Tarquitet.

## Idioma

Consulta el [README en inglés](README.md).
