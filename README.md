# Tarquitet Commissions

[![English](https://img.shields.io/badge/README-English-111827?style=for-the-badge&logo=readme&logoColor=white)](README.md)
[![Español](https://img.shields.io/badge/README-Espa%C3%B1ol-b91c1c?style=for-the-badge&logo=readme&logoColor=white)](README.es.md)
[![Astro](https://img.shields.io/badge/Astro-6-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

Professional portfolio and commission website for **Tarquitet**, a digital artist and multimedia engineer. The site presents the artist's work, commission options, service guidelines, terms of service, and contact channels in a focused, responsive experience.

**Live website:** [art.tarquitet.com](https://art.tarquitet.com)

## Features

- Artist introduction and creative process overview.
- Commission portfolio with custom commission and YCH/pose categories.
- Interactive commission configurator with available versions and details.
- Scope guidelines describing accepted and unavailable requests.
- Terms of service section with the latest legal information.
- Contact section with Discord, email, social networks, and request form links.
- Responsive layout with animated content reveals, social metadata, canonical URLs, and sitemap support.

## Tech stack

- [Astro](https://astro.build/) for the site framework and page delivery.
- [React](https://react.dev/) for interactive UI components.
- [Tailwind CSS](https://tailwindcss.com/) through the Vite integration for styling.
- [Lucide React](https://lucide.dev/) for interface icons.
- TypeScript for typed component and content definitions.

## Getting started

### Requirements

- Node.js `>=22.12.0`, as specified in `package.json`.
- npm or [Bun](https://bun.sh/).

### Installation

From this project directory:

```bash
npm install
```

With Bun:

```bash
bun install
```

### Development

Start the local development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### Production build

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
├── components/   # Astro and React UI components
├── data/         # Site content, sections, payments, and social links
├── layouts/      # Shared document layout and metadata
├── pages/        # Astro pages and routes
├── styles/       # Global styles and design tokens
└── utils/        # Shared helpers for formatting and media
public/           # Static assets, icons, favicon, and robots.txt
```

The main page is assembled from `src/pages/index.astro`, while editable site copy is centralized in `src/data/content.ts`.

## Available scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start the local development server.     |
| `npm run build`   | Build the production site into `dist/`. |
| `npm run preview` | Preview the production build locally.   |
| `npm run astro`   | Run the Astro CLI.                      |

## Content and configuration

- Update interface copy in `src/data/content.ts`.
- Update section registration in `src/data/sections.ts`.
- Add or replace static media in `public/` and `src/assets/`.
- Update the canonical site URL in `astro.config.mjs` when changing deployment targets.

## License

No open-source license has been declared for this project. Unless otherwise stated, the source code, artwork, and brand assets remain the property of Tarquitet.

## Language

See the [Spanish README](README.es.md).
