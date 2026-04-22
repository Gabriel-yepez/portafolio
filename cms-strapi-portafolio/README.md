# CMS Strapi — Portafolio

CMS headless en **Strapi v5** que sirve el contenido del portafolio personal de Gabriel Yépez.
Vive como carpeta hermana de `mi_portafolio/` (el frontend Vite + React) dentro del mismo
repositorio.

## Stack

- Strapi v5 (TypeScript)
- Node >= 20
- SQLite (archivo en `.tmp/data.db`)
- npm

## Estructura

- `src/api/` — Content Types (Single: hero, about, technology-section, contact, footer, global; Collections: project, technology, tech-category)
- `src/components/shared/` — Componentes reutilizables
- `src/index.ts` — Hook `bootstrap` que configura permisos del rol `public`
- `scripts/seed.ts` — Script idempotente que siembra el contenido inicial
- `data/assets/` — SVGs de tecnologías e imagen de perfil usados por el seed

## Comandos

```bash
npm install          # instalar dependencias
npm run develop      # Strapi en modo desarrollo (http://localhost:1337)
npm run build        # compilar admin
npm run start        # arrancar en modo producción
npm run seed         # sembrar contenido inicial (idempotente)
```

## Primera vez

1. `npm install`
2. `npm run develop` — crea el admin en la primera ejecución; registra un usuario admin en
   `http://localhost:1337/admin`
3. En otra terminal: `npm run seed` para poblar el CMS con el contenido actual del portafolio

## API pública

El rol `public` tiene permisos `find` / `findOne` sobre todos los endpoints listados a continuación.
Ejemplos:

- `GET /api/hero?populate=*`
- `GET /api/about?populate=*`
- `GET /api/technology-section`
- `GET /api/contact?populate=*`
- `GET /api/footer?populate=*`
- `GET /api/global?populate=*`
- `GET /api/projects?populate=*`
- `GET /api/technologies?populate=*`
- `GET /api/tech-categories?populate=*`

## Consumo desde el frontend Vite

El frontend vive en `../mi_portafolio` (mismo repositorio) y consumirá estos endpoints en una
iteración posterior.
