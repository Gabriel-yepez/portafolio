# SEO — Portafolio Vite/React (SPA → SSG)

**Fecha:** 2026-04-26  
**URL de producción:** https://gabrielportafoliodev.netlify.app  
**Objetivo:** Aparecer en búsquedas por nombre ("Gabriel Yépez desarrollador") y por rol/skills ("desarrollador React TypeScript")

---

## Contexto

El portafolio es una SPA React pura con Vite. El contenido (bio, proyectos, certificaciones) se carga desde Strapi CMS vía React Query en el cliente. Los crawlers de Google no ven ese contenido porque el HTML inicial es un `<div id="root"></div>` vacío.

Hay meta tags OG/Twitter y verificación de Google Search Console en `index.html`, pero falta: `og-image.jpg` real, `robots.txt`, `sitemap.xml`, JSON-LD y canonical.

---

## Estrategia: vite-ssg + archivos estáticos SEO

### Enfoque elegido

`vite-ssg` convierte el build en un proceso SSG: fetcha el CMS en tiempo de build, renderiza React a HTML estático, e inyecta el estado de React Query en el HTML para hidratación del cliente. Netlify sigue recibiendo archivos estáticos — sin cambios en el pipeline de deploy.

**Fallback si CMS falla durante build:** `prefetchQuery` no lanza excepciones; la sección queda vacía en el HTML pre-renderizado y React la carga normalmente en el cliente. El build no se rompe.

---

## Dependencias nuevas

| Paquete | Rol |
|---------|-----|
| `vite-ssg` | Motor SSG — pre-renderiza la ruta `/` a HTML estático |
| `react-router-dom` | Requerido por `vite-ssg/react` (single route `/`) |
| `react-helmet-async` | Gestión dinámica del `<head>` (title, canonical, JSON-LD) |
| `vite-plugin-sitemap` | Genera `sitemap.xml` automáticamente en cada build |

---

## Arquitectura

### Pipeline de build

```
pnpm build
  └─ tsc -b
  └─ vite build (con vite-ssg)
       ├─ Setup callback: prefetch CMS data → React Query
       ├─ renderToString(<App />) → HTML con contenido real
       ├─ Dehydrate React Query state → serializado en HTML
       ├─ vite-plugin-sitemap → dist/sitemap.xml
       └─ dist/index.html (HTML completo + estado embebido)
```

### Flujo cliente (hydration)

```
Browser carga dist/index.html
  └─ HTML ya tiene el contenido visible (SEO ✓)
  └─ JS bundle descarga
  └─ HydrationBoundary rehidrata React Query desde estado embebido
  └─ Sin petición extra al CMS — datos ya disponibles
```

---

## Archivos a modificar

### `src/main.tsx`

Cambiar de `createRoot` a `ViteSSG`. Añadir prefetch de todas las queries del CMS en el callback de setup.

```tsx
import { ViteSSG } from 'vite-ssg/react'
import { QueryClient } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import {
  fetchHero, fetchAbout, fetchProjects,
  fetchCertifications, fetchTechnologies,
} from './services/queries'

export const createApp = ViteSSG(
  App,
  { routes: [{ path: '/' }] },
  async ({ app, router, initialState }) => {
    const queryClient = new QueryClient()

    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ['hero'],           queryFn: fetchHero }),
      queryClient.prefetchQuery({ queryKey: ['about'],          queryFn: fetchAbout }),
      queryClient.prefetchQuery({ queryKey: ['projects'],       queryFn: fetchProjects }),
      queryClient.prefetchQuery({ queryKey: ['certifications'], queryFn: fetchCertifications }),
      queryClient.prefetchQuery({ queryKey: ['technologies'],   queryFn: fetchTechnologies }),
    ])

    // Serializar estado para HydrationBoundary en el cliente
    // Nota: la key exacta del initialState y la API de vite-ssg/react
    // deben verificarse contra la documentación de la versión instalada.
    initialState.reactQueryState = dehydrate(queryClient)
  }
)
```

`App.tsx` se envuelve en `<HelmetProvider>` y `<HydrationBoundary>`.

### `vite.config.ts`

Añadir opciones SSG:

```ts
ssgOptions: {
  script: 'async',
  formatting: 'minify',
  onFinished() { /* hook post-build opcional */ },
}
```

Añadir `vite-plugin-sitemap` al array de plugins:

```ts
import sitemap from 'vite-plugin-sitemap'

sitemap({
  hostname: 'https://gabrielportafoliodev.netlify.app',
  dynamicRoutes: ['/'],
})
```

### `index.html`

- Eliminar los meta tags `og:*` y `twitter:*` (pasan a `<SEO />` para evitar duplicados).
- Mantener: charset, viewport, theme-color, google-site-verification, favicon.
- Añadir `<link rel="manifest" href="/manifest.json">`.

---

## Archivos a crear

### `src/services/queries.ts`

Extrae las `queryFn` de los hooks existentes a un módulo compartido. Los hooks (`useHero`, `useProjects`, etc.) importan desde aquí — sin cambios en su interfaz pública.

```ts
export const fetchHero = () => api.get<HeroData>('/hero').then(r => r.data)
export const fetchAbout = () => api.get<AboutData>('/about').then(r => r.data)
// ... resto de secciones
```

### `src/components/SEO.tsx`

Componente que gestiona el `<head>` completo. Se renderiza dentro de `<App />` una sola vez.

**Responsabilidades:**
- `<title>` — formato: `{nombre} — {rol} | Desarrollador Full Stack`
- `<meta name="description">` dinámica
- `<link rel="canonical">`
- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags
- JSON-LD `Person` (estático)
- JSON-LD `WebSite` (estático)
- JSON-LD `ItemList` de proyectos (dinámico, desde datos prefetcheados)

**Schemas JSON-LD:**

`Person`:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Gabriel Yépez",
  "jobTitle": "Desarrollador Full Stack",
  "url": "https://gabrielportafoliodev.netlify.app",
  "email": "gabrielyepez04@gmail.com",
  "sameAs": [
    "https://github.com/{handle}",
    "https://linkedin.com/in/{handle}"
  ]
}
```

`WebSite`:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Portafolio Gabriel Yépez",
  "url": "https://gabrielportafoliodev.netlify.app"
}
```

`ItemList` (proyectos — generado desde CMS data):
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Nombre del proyecto",
      "url": "https://url-del-proyecto.com"
    }
  ]
}
```

Los handles de GitHub/LinkedIn se toman de los datos del CMS (`useHero` devuelve `socialLinks`).

### Archivos en `/public/`

| Archivo | Descripción |
|---------|-------------|
| `robots.txt` | Permite todo, apunta al sitemap |
| `sitemap.xml` | Generado por `vite-plugin-sitemap` en cada build |
| `og-image.jpg` | 1200×630px — generada con script Node usando `satori` (fondo oscuro, nombre, rol, stack) |
| `manifest.json` | PWA básico: name, short_name, theme_color, icons |
| `icons/icon-192.png` | Icono PWA 192×192px generado desde favicon |
| `icons/icon-512.png` | Icono PWA 512×512px generado desde favicon |

**`/public/robots.txt`:**
```
User-agent: *
Allow: /
Sitemap: https://gabrielportafoliodev.netlify.app/sitemap.xml
```

**`/public/manifest.json`:**
```json
{
  "name": "Portafolio Gabriel Yépez",
  "short_name": "Gabriel Yépez",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**`og-image.jpg`:** Se genera con un script `scripts/generate-og-image.ts` que usa `satori` + `sharp`. El script corre una vez (o en CI). Fondo `#0f172a`, texto "Gabriel Yépez / Desarrollador Full Stack / React · TypeScript · Node.js" con la paleta de colores del portafolio.

---

## Resumen de impacto esperado

| Mejora | Impacto SEO |
|--------|-------------|
| HTML pre-renderizado con contenido CMS | Alto — proyectos y bio indexables |
| JSON-LD Person + WebSite + ItemList | Alto — rich results, Knowledge Panel |
| og-image real | Medio — mejor CTR en redes sociales |
| robots.txt + sitemap.xml | Medio — crawl budget optimizado |
| canonical tag | Medio — evita contenido duplicado |
| manifest.json | Bajo — mejora señales de calidad |

---

## Constraints

- Strapi CMS debe ser accesible desde los servidores de Netlify durante el build.
- Las `VITE_*` env vars del CMS deben estar configuradas en el dashboard de Netlify.
- `react-router-dom` se añade solo para satisfacer `vite-ssg/react` — el app no usa routing real.
- La `og-image.jpg` se genera una vez y se commitea a `/public/`; no se regenera en cada build a menos que se configure en CI.
