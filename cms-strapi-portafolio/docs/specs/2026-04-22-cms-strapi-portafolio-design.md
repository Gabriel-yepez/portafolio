# CMS Strapi para portafolio — Diseño

**Fecha:** 2026-04-22
**Autor:** Gabriel Yépez (con Claude)
**Estado:** Aprobado — listo para implementación

## Contexto

El portafolio personal vive en `/Users/gabrielyepez/proyectos-sodtware/portafolio/mi_portafolio`
(Vite + React + TypeScript + Tailwind v4). Hoy todo el contenido (bio, highlights, tecnologías,
proyectos, datos de contacto) está **hardcodeado** en componentes. El objetivo es crear un CMS
headless (Strapi v5) independiente que exponga ese contenido por API REST para que el Vite pueda
consumirlo sin redeploy cuando cambie la información.

## Objetivo de esta sesión

Entregar un proyecto Strapi v5 completamente configurado, con schema definido, seed del contenido
actual del Vite, permisos públicos de lectura listos, compilando limpio y comiteado al repo
existente `Gabriel-yepez/portafolio` como carpeta hermana de `mi_portafolio/`.
**NO se modifica el frontend Vite en esta sesión** — eso queda para un trabajo posterior cuando el
schema esté estable.

## No objetivos

- Cablear el frontend Vite al CMS (sesión futura).
- Desplegar Strapi a producción.
- Migrar a PostgreSQL (SQLite es suficiente para empezar; Strapi v5 permite migrar después).
- Autenticación/roles más allá del rol `public`.

## Decisiones clave

1. **Projects y Technologies son Collection Types**, no campos repetibles dentro de un Single Type.
   Razón: facilita agregar/quitar entradas, ordenar, y en el futuro filtrar por `featured`.
2. **SQLite** como DB (archivo `.tmp/data.db`, driver `better-sqlite3`).
3. **Alcance limitado al CMS.** El frontend Vite no se toca.
4. **Monorepo**: el CMS vive como carpeta `cms-strapi-portafolio/` dentro del repositorio existente
   `Gabriel-yepez/portafolio` (junto a `mi_portafolio/`). NO se crea un repo nuevo en GitHub.

## Stack

- Strapi v5 (última disponible vía `npx create-strapi@latest`)
- TypeScript
- SQLite (better-sqlite3)
- npm (default de create-strapi)
- Node >= 20 (requerido por Strapi v5)

## Ubicación

- Proyecto nuevo: `/Users/gabrielyepez/proyectos-sodtware/portafolio/cms-strapi-portafolio`
- Repo git compartido: el `.git` existente en `/Users/gabrielyepez/proyectos-sodtware/portafolio/`
  (remoto `https://github.com/Gabriel-yepez/portafolio.git`)
- Spec (este doc): se copia dentro del monorepo en
  `portafolio/cms-strapi-portafolio/docs/specs/2026-04-22-cms-strapi-portafolio-design.md`
  después del scaffold

## Modelo de contenidos

### Single Types

| UID | Propósito |
|---|---|
| `api::hero.hero` | Contenido de la sección Hero |
| `api::about.about` | Contenido de la sección About |
| `api::technology-section.technology-section` | Título/descripción del bloque Technologies |
| `api::contact.contact` | Contenido de la sección Contact |
| `api::footer.footer` | Footer |
| `api::global.global` | Meta global del sitio (título, nav, SEO) |

#### `hero`
- `greeting: string` — default "Hola, soy"
- `name: string` — "Gabriel Yépez"
- `role: string` — "Desarrollador de Software"
- `bio: text` — bio corta
- `profileImage: media (single, images)`
- `primaryCta: shared.cta-button`
- `secondaryCta: shared.cta-button`
- `socialLinks: shared.social-link (repeatable)`

#### `about`
- `title: string` — "Sobre mí"
- `description: text (long)` — párrafo introductorio
- `highlights: shared.highlight (repeatable)` — mínimo 1, máximo 12

#### `technology-section`
- `title: string` — "Tecnologías"
- `description: text` — subtítulo

#### `contact`
- `title: string`
- `description: text`
- `infoItems: shared.contact-info (repeatable)`
- `formEnabled: boolean` — default `true`

#### `footer`
- `copyrightName: string` — "Gabriel Yépez"
- `socialLinks: shared.social-link (repeatable)`

#### `global`
- `siteTitle: string` — "Mi Portafolio"
- `navItems: shared.nav-item (repeatable)`
- `seo: shared.seo`

### Collection Types

#### `project`
- `title: string (required)`
- `slug: uid (targetField: title)`
- `description: text (required)`
- `image: media (single, images)`
- `liveUrl: string`
- `githubUrl: string`
- `technologies: relation manyToMany → api::technology.technology`
- `order: integer (default 0)`
- `featured: boolean (default false)`
- Draft & Publish: ON

#### `technology`
- `name: string (required, unique)`
- `slug: uid (targetField: name)`
- `icon: media (single, images, acepta SVG)`
- `category: relation manyToOne → api::tech-category.tech-category`
- `order: integer (default 0)`
- Draft & Publish: OFF (son catálogo simple)

#### `tech-category`
- `title: string (required)` — "Frontend", "Backend", "Bases de Datos", "Herramientas"
- `slug: uid (targetField: title)`
- `order: integer (default 0)`
- `technologies: relation oneToMany → api::technology.technology (mappedBy: category)`
- Draft & Publish: OFF

### Components (namespace `shared`)

- **`shared.social-link`**
  - `platform: enum [github, linkedin, twitter, x, instagram, other]`
  - `url: string (required)`
  - `label: string`
- **`shared.cta-button`**
  - `label: string (required)`
  - `targetSectionId: string` — ID del section del Vite (ej. `projects`, `contact`)
  - `externalUrl: string` — alternativa a targetSectionId
  - `variant: enum [primary, outline]` default `primary`
- **`shared.highlight`**
  - `iconName: enum [Code, Lightbulb, Users, CheckCircleIcon, BookOpenText, BookmarkCheck]` — extensible después
  - `title: string`
  - `description: text`
- **`shared.contact-info`**
  - `iconName: enum [Mail, Phone, MapPin]`
  - `title: string`
  - `value: string`
  - `link: string (opcional)`
- **`shared.nav-item`**
  - `label: string`
  - `targetSectionId: string`
- **`shared.seo`**
  - `metaTitle: string`
  - `metaDescription: text`
  - `ogImage: media (single)`

## Permisos

Se configura el rol **Public** vía `src/index.ts` (hook `bootstrap`) para otorgar `find` y `findOne`
sobre todas las Content Types listadas arriba. El resto de permisos queda sin cambios. Esto se hace
programáticamente para que al clonar el repo + correr `npm run develop` el API quede servible sin
pasos manuales en el admin.

## Seed

Script `scripts/seed.ts` ejecutable con `npm run seed`. Idempotente: verifica `strapi.entityService.count()`
antes de crear. Datos sembrados:

- **Tech categories (4):** Frontend, Backend, Bases de Datos, Herramientas
- **Technologies (21):** React, TypeScript, Next.js, Tailwind CSS, HTML5, CSS3, JavaScript, Node.js,
  Express, Python, FastAPI, PostgreSQL, MongoDB, SQLServer, Redis, Firebase, Git, Docker, Google Cloud,
  Figma, Postman — con SVGs copiados desde `portafolio/mi_portafolio/src/assets/*.svg` y subidos a Media Library
- **Projects (3):** los 3 placeholder del Vite (E-commerce Platform, Task Management App, Weather Dashboard)
  con sus URLs de Unsplash como imágenes
- **Hero:** strings exactos del Vite + foto `imagenPerfil.webp`
- **About:** título "Sobre mí", descripción exacta, 6 highlights con iconNames del Vite
- **Contact:** 3 infoItems (email gabrielyepez04@gmail.com, teléfono, ubicación Caracas, Venezuela)
- **Footer:** copyrightName + 2 socialLinks (GitHub Gabriel-yepez, LinkedIn)
- **Global:** siteTitle, navItems (about, technologies, projects, contact)

## Git y GitHub

- **No se inicializa un repo nuevo.** Se reutiliza el `.git` existente en
  `/Users/gabrielyepez/proyectos-sodtware/portafolio/`.
- `create-strapi` intentará ejecutar `git init` dentro de la carpeta del CMS; si lo hace, debemos
  borrar `cms-strapi-portafolio/.git/` para evitar un repo anidado.
- El `.gitignore` de Strapi (que cubre `.env`, `.tmp`, `build`, `node_modules`, etc.) se deja tal
  cual dentro de `cms-strapi-portafolio/` — git respeta `.gitignore` anidados.
- Commits descriptivos por cada gran cambio (scaffold, schemas, bootstrap permisos, seed, etc.)
- Push final al remote existente `origin/main` del repo `Gabriel-yepez/portafolio`.
- README del CMS en `portafolio/cms-strapi-portafolio/README.md` en español describiendo:
  propósito, stack, cómo correr local, cómo sembrar datos.

## Equipo de agentes

Flujo en 3 fases:

### Fase 1 — Diseño técnico detallado del schema (paralelo con scaffold)

- **Agente:** `backend-architect-expert`
- **Output:** archivos JSON de schema (`schema.json` de cada content-type y component) listos para pegar
  en el proyecto Strapi. Cada schema sigue el formato exacto que Strapi v5 espera en
  `src/api/<uid>/content-types/<uid>/schema.json` y `src/components/<category>/<name>.json`.
- **Entrada:** este spec

### Fase 2 — Scaffold y cableado (requiere Fase 1)

- **Agente:** `general-purpose`
- **Tareas:**
  1. `cd /Users/gabrielyepez/proyectos-sodtware && npx create-strapi@latest cms-strapi-portafolio --typescript --dbclient=sqlite --skip-cloud --install --no-run --no-example`
     (si alguno de esos flags no existe en la versión actual, se ajusta; el resultado requerido es un
     proyecto TS con SQLite sin datos de ejemplo)
  2. Crear directorios y pegar los schemas de la Fase 1
  3. Implementar `src/index.ts` con hook `bootstrap` que configura permisos del rol public
  4. Crear `scripts/seed.ts` con el contenido descrito y registrar `seed` en `package.json`
  5. Copiar SVGs desde `portafolio/mi_portafolio/src/assets` a `data/assets` (o similar)
  6. Escribir README en español
  7. `npm run build` para verificar compilación
  8. `git init`, commit inicial, `gh repo create ... --public --push`
  9. Arrancar `npm run develop` en background, probar `curl http://localhost:1337/api/hero?populate=*`,
     apagar

### Fase 3 — Review final

- **Agente:** `pr-review-toolkit:code-reviewer` (o `code-debugger-expert` si hay fallos)
- **Tareas:**
  - Revisar schemas contra este spec
  - Revisar idempotencia del seed
  - Revisar permisos (rol public correcto)
  - Confirmar que el `.gitignore` cubre `.env`, `.tmp`, `build`, `node_modules`

## Criterios de éxito

- [ ] Directorio `portafolio/cms-strapi-portafolio` existe con proyecto Strapi v5 válido
- [ ] `npm run build` pasa sin errores
- [ ] `npm run develop` arranca y responde 200 en `/api/hero?populate=*`, `/api/projects?populate=*`,
      `/api/technologies?populate=*`, `/api/tech-categories?populate=*`, `/api/about?populate=*`,
      `/api/contact?populate=*`, `/api/footer?populate=*`, `/api/global?populate=*`,
      `/api/technology-section`
- [ ] Seed reproduce exactamente el contenido del Vite (strings, highlights, 21 techs, 3 projects)
- [ ] Rol public tiene `find`/`findOne` en todas las colecciones y single types
- [ ] Commits del CMS pushed al repo existente `Gabriel-yepez/portafolio` en rama `main`

## Riesgos / notas

- **Versión de Strapi:** asumimos v5.x latest. Si cambiaron flags del CLI, el agente ajusta.
- **SVG uploads:** Strapi Media Library acepta SVG pero puede requerir habilitar el mime type en
  `config/plugins.ts`. El scaffold lo incluye.
- **Bootstrap permisos en sólo primera vez:** el hook debe ser idempotente (usar `upsert` o check
  `find` antes de `create`).
