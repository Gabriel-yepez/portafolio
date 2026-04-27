# SEO Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio SPA into an SSG-rendered site with complete SEO metadata so Google can index bio, projects, and skills.

**Architecture:** `vite-ssg` pre-renders the single `/` route at build time by prefetching all CMS data into the singleton React Query client before `renderToString` runs — so crawlers see real HTML content, not an empty `<div id="root">`. `react-helmet-async` manages all dynamic `<head>` content (title, canonical, OG, JSON-LD). Netlify continues deploying static files with no runtime changes.

**Tech Stack:** vite-ssg, react-router-dom (vite-ssg peer dep), react-helmet-async, vite-plugin-sitemap

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `mi_portafolio/src/main.tsx` | Modify | ViteSSG entry; prefetch CMS data into queryClient during SSG |
| `mi_portafolio/src/App.tsx` | Modify | Add HelmetProvider wrapper; render SEO component |
| `mi_portafolio/src/components/SEO.tsx` | Create | All `<head>` tags: title, canonical, OG, Twitter, 3× JSON-LD |
| `mi_portafolio/vite.config.ts` | Modify | Add ssgOptions + vite-plugin-sitemap |
| `mi_portafolio/index.html` | Modify | Remove OG/Twitter (moved to SEO.tsx); add manifest link |
| `mi_portafolio/public/robots.txt` | Create | Allow all crawlers; point to sitemap |
| `mi_portafolio/public/manifest.json` | Create | PWA metadata |
| `mi_portafolio/public/og-image.jpg` | Create | 1200×630 social preview — manual step |
| `mi_portafolio/public/icons/icon-192.png` | Create | PWA icon |
| `mi_portafolio/public/icons/icon-512.png` | Create | PWA icon |
| `mi_portafolio/package.json` | Modify | Update build script to `vite-ssg build`; add deps |

---

## Task 1: Install dependencies and update build script

**Files:**
- Modify: `mi_portafolio/package.json`
- Modify: `mi_portafolio/pnpm-lock.yaml`

- [ ] **Step 1: Install runtime packages**

```bash
cd mi_portafolio
pnpm add vite-ssg react-router-dom react-helmet-async
```

Expected: Three packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Install dev packages**

```bash
cd mi_portafolio
pnpm add -D vite-plugin-sitemap
```

Expected: `vite-plugin-sitemap` added to `devDependencies`.

- [ ] **Step 3: Update build script in package.json**

Change only the `"build"` line — keep all other scripts unchanged:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite-ssg build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- [ ] **Step 4: Verify TypeScript sees the new types**

```bash
cd mi_portafolio
pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: No new errors (only pre-existing ones unrelated to these packages, if any).

- [ ] **Step 5: Commit**

```bash
git add mi_portafolio/package.json mi_portafolio/pnpm-lock.yaml
git commit -m "deps(seo): add vite-ssg, react-helmet-async, vite-plugin-sitemap"
```

---

## Task 2: Create static SEO files

**Files:**
- Create: `mi_portafolio/public/robots.txt`
- Create: `mi_portafolio/public/manifest.json`
- Create: `mi_portafolio/public/icons/` (directory + two PNG files)
- Create: `mi_portafolio/public/og-image.jpg` (manual step)

- [ ] **Step 1: Create robots.txt**

Create `mi_portafolio/public/robots.txt` with this exact content:

```
User-agent: *
Allow: /
Sitemap: https://gabrielportafoliodev.netlify.app/sitemap.xml
```

- [ ] **Step 2: Create manifest.json**

Create `mi_portafolio/public/manifest.json`:

```json
{
  "name": "Portafolio Gabriel Yépez",
  "short_name": "Gabriel Yépez",
  "description": "Portafolio de Gabriel Yépez, desarrollador Full Stack con React, TypeScript y Node.js.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "lang": "es",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

- [ ] **Step 3: Create PWA icons**

```bash
mkdir -p mi_portafolio/public/icons
```

Create two square PNG files: `public/icons/icon-192.png` (192×192px) and `public/icons/icon-512.png` (512×512px). Use any image editor, Figma, or the online converter at https://favicon.io/favicon-converter — upload `public/favicon.ico` and download the PNG variants.

Place both files at `mi_portafolio/public/icons/`.

- [ ] **Step 4: Create og-image**

Create a 1200×630px JPEG image and save it as `mi_portafolio/public/og-image.jpg`. Recommended content: your name, role ("Desarrollador Full Stack"), and tech stack (React · TypeScript · Node.js) on a dark background (`#0f172a`). Use Figma, Canva, or a screenshot of the portfolio hero section.

This is the image that appears when someone shares your portfolio link on WhatsApp, LinkedIn, or Twitter.

- [ ] **Step 5: Commit**

```bash
git add mi_portafolio/public/robots.txt mi_portafolio/public/manifest.json mi_portafolio/public/icons/ mi_portafolio/public/og-image.jpg
git commit -m "feat(seo): add robots.txt, manifest.json, PWA icons, og-image"
```

---

## Task 3: Create SEO component

**Files:**
- Create: `mi_portafolio/src/components/SEO.tsx`

This component runs inside `QueryClientProvider` so it can read hook data. During SSG the queryClient already has prefetched CMS data, so all three JSON-LD schemas render with real content.

- [ ] **Step 1: Create `src/components/SEO.tsx`**

```tsx
import { Helmet } from 'react-helmet-async'
import { useHero } from '../hooks/useHero'
import { useProjects } from '../hooks/useProjects'

const SITE_URL = 'https://gabrielportafoliodev.netlify.app'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export function SEO() {
  const { data: hero } = useHero()
  const { data: projects } = useProjects()

  const name = hero?.name ?? 'Gabriel Yépez'
  const role = hero?.role ?? 'Desarrollador Full Stack'
  const description =
    hero?.bio ??
    'Portafolio de Gabriel Yépez, desarrollador de software especializado en frontend y backend con React, TypeScript y Node.js.'

  const githubUrl = hero?.socialLinks.find((l) => l.platform === 'github')?.url ?? ''
  const linkedinUrl = hero?.socialLinks.find((l) => l.platform === 'linkedin')?.url ?? ''

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    url: SITE_URL,
    email: 'gabrielyepez04@gmail.com',
    sameAs: [githubUrl, linkedinUrl].filter(Boolean),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `Portafolio ${name}`,
    url: SITE_URL,
  }

  const projectListSchema = projects?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Proyectos de ${name}`,
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.title,
          url: p.liveUrl,
        })),
      }
    : null

  return (
    <Helmet>
      <title>{`${name} — ${role}`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${name} — ${role}`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${name} — ${role}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* JSON-LD schemas */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      {projectListSchema && (
        <script type="application/ld+json">{JSON.stringify(projectListSchema)}</script>
      )}
    </Helmet>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd mi_portafolio
pnpm exec tsc --noEmit 2>&1 | grep "SEO\|helmet"
```

Expected: No output (no errors).

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/SEO.tsx
git commit -m "feat(seo): add SEO component with canonical, OG, Twitter, and JSON-LD"
```

---

## Task 4: Refactor App.tsx

**Files:**
- Modify: `mi_portafolio/src/App.tsx`

Add `HelmetProvider` as the outermost wrapper and add `<SEO />` inside `QueryClientProvider` (so SEO can access React Query data).

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { Suspense, lazy } from "react";
import Skeleton from "@mui/material/Skeleton";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./lib/queryClient";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SEO } from "./components/SEO";
import { SectionSkeleton } from "./components/ui/Skeleton";

const AboutSection = lazy(() =>
  import("./components/About").then((m) => ({ default: m.About }))
);
const TechnologiesSection = lazy(() =>
  import("./components/Technologies").then((m) => ({ default: m.Technologies }))
);
const CertificationsSection = lazy(() =>
  import("./components/Certifications").then((m) => ({ default: m.Certifications }))
);
const ProjectsSection = lazy(() =>
  import("./components/Projects").then((m) => ({ default: m.Projects }))
);
const ContactSection = lazy(() =>
  import("./components/Contact").then((m) => ({ default: m.Contact }))
);
const FooterSection = lazy(() =>
  import("./components/Footer").then((m) => ({ default: m.Footer }))
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SEO />
        <Header />
        <main>
          <Hero />
          <Suspense fallback={<SectionSkeleton title="Sobre mí" />}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton title="Tecnologías" />}>
            <TechnologiesSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton title="Proyectos" isAltBackground />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton title="Certificaciones" isAltBackground />}>
            <CertificationsSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton title="Contacto" />}>
            <ContactSection />
          </Suspense>
        </main>
        <Suspense
          fallback={
            <footer className="py-10 text-center text-muted-foreground" role="status">
              <div className="container mx-auto space-y-2">
                <Skeleton variant="text" width="40%" sx={{ mx: "auto" }} />
                <Skeleton variant="text" width="30%" sx={{ mx: "auto" }} />
              </div>
            </footer>
          }
        >
          <FooterSection />
        </Suspense>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd mi_portafolio
pnpm exec tsc --noEmit 2>&1 | grep "App\|helmet\|SEO"
```

Expected: No output.

- [ ] **Step 3: Smoke test dev server**

```bash
cd mi_portafolio
pnpm dev &
sleep 5
curl -s http://localhost:5173 | grep -c "root"
kill %1
```

Expected: `1` (the `<div id="root">` is present — dev mode still works).

- [ ] **Step 4: Commit**

```bash
git add mi_portafolio/src/App.tsx
git commit -m "feat(seo): wrap App with HelmetProvider and add SEO component"
```

---

## Task 5: Refactor src/main.tsx to ViteSSG

**Files:**
- Modify: `mi_portafolio/src/main.tsx`

Change the entry from `createRoot` to `ViteSSG`. The SSG setup callback uses `isClient` to guard the prefetch so it only runs during server-side rendering, not in the browser.

- [ ] **Step 1: Check vite-ssg/react context type**

```bash
grep -A 20 "ViteSSGContext\|UserModule\|isClient" mi_portafolio/node_modules/vite-ssg/dist/types.d.ts 2>/dev/null | head -40
```

Note the property name for the SSR flag — it is either `isClient` or `ssr`. Use whichever the types declare.

- [ ] **Step 2: Replace `src/main.tsx`**

If the context uses `isClient` (most common):

```tsx
import { ViteSSG } from 'vite-ssg/react'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { api } from './services/api'
import './styles/globals.css'

export const createApp = ViteSSG(
  App,
  {},
  async ({ isClient }) => {
    if (isClient) return

    await Promise.allSettled([
      queryClient.prefetchQuery({ queryKey: ['hero'],            queryFn: api.hero }),
      queryClient.prefetchQuery({ queryKey: ['about'],           queryFn: api.about }),
      queryClient.prefetchQuery({ queryKey: ['projects'],        queryFn: api.projects }),
      queryClient.prefetchQuery({ queryKey: ['certifications'],  queryFn: api.certifications }),
      queryClient.prefetchQuery({ queryKey: ['tech-categories'], queryFn: api.categories }),
      queryClient.prefetchQuery({ queryKey: ['global'],          queryFn: api.global }),
    ])
  },
)
```

If the types show `ssr: boolean` instead of `isClient`, replace the guard with:

```tsx
async ({ ssr }) => {
  if (!ssr) return
  // ... same prefetch calls
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd mi_portafolio
pnpm exec tsc --noEmit 2>&1 | head -30
```

Expected: No errors. If you get "Property 'isClient' does not exist", fix per the type inspection in Step 1.

- [ ] **Step 4: Commit**

```bash
git add mi_portafolio/src/main.tsx
git commit -m "feat(seo): migrate entry to ViteSSG with CMS prefetch callback"
```

---

## Task 6: Update vite.config.ts

**Files:**
- Modify: `mi_portafolio/vite.config.ts`

Add `vite-plugin-sitemap` to the plugins array and add `ssgOptions`.

- [ ] **Step 1: Replace `vite.config.ts`**

```ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devPort = Number(env.VITE_DEV_PORT ?? 5173)
  const strictPort = env.VITE_STRICT_PORT === 'false' ? false : true

  const cssMinify = (() => {
    if (env.VITE_CSS_MINIFY === 'lightningcss') return 'lightningcss'
    if (env.VITE_CSS_MINIFY === 'false') return false
    return 'esbuild'
  })()
  const cssDevSourcemap = env.VITE_CSS_DEV_SOURCEMAP === 'false' ? false : true
  const openBrowser = env.VITE_OPEN_BROWSER === 'false' ? false : true

  return {
    plugins: [
      react(),
      tailwindcss(),
      sitemap({ hostname: 'https://gabrielportafoliodev.netlify.app' }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    envPrefix: ['VITE_', 'PUBLIC_'],
    server: {
      port: Number.isNaN(devPort) ? 5173 : devPort,
      open: openBrowser,
      strictPort,
    },
    build: {
      target: env.VITE_BUILD_TARGET ?? 'esnext',
      cssMinify,
    },
    css: {
      devSourcemap: cssDevSourcemap,
    },
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
    },
  }
})
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd mi_portafolio
pnpm exec tsc --noEmit 2>&1 | grep "vite.config\|sitemap\|ssg"
```

Expected: No output. If `ssgOptions` shows as an unknown property, check whether `vite-ssg` augments the Vite type via `/// <reference types="vite-ssg/client" />`. If needed, add that reference to `src/env.d.ts`.

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/vite.config.ts
git commit -m "feat(seo): add vite-plugin-sitemap and ssgOptions to vite config"
```

---

## Task 7: Update index.html

**Files:**
- Modify: `mi_portafolio/index.html`

Remove `og:*` and `twitter:*` meta tags (now managed by `SEO.tsx`) and the static `<meta name="description">` (also managed by SEO). Add `<link rel="manifest">`.

- [ ] **Step 1: Replace `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="author" content="Gabriel Yépez" />
    <meta name="keywords" content="desarrollador de software, portafolio, frontend, backend, react, node.js, typescript" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="google-site-verification" content="FzmY3mDSwcP9qQKKRpYGJF1nnwxJbBc2aSsYBIurUlo" />
    <link rel="manifest" href="/manifest.json" />
    <title>Portafolio Gabriel Yépez</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/index.html
git commit -m "feat(seo): clean index.html — OG/Twitter moved to SEO component, add manifest"
```

---

## Task 8: Full build and verification

- [ ] **Step 1: Run the full SSG build**

Make sure Strapi is running locally (or `VITE_STRAPI_URL` points to a live instance) before building:

```bash
cd mi_portafolio
pnpm build 2>&1
```

Expected: Build completes without errors. Watch for:
- `vite-ssg` context errors → fix `src/main.tsx` per Task 5 Step 1
- TypeScript errors → fix per the error message
- Missing env vars → ensure `VITE_STRAPI_URL` is set

- [ ] **Step 2: Verify CMS content is in the HTML**

```bash
grep -i "gabriel\|desarrollador\|proyect" mi_portafolio/dist/index.html | head -10
```

Expected: Lines containing real content from Strapi (your name, role, project titles). If the output is empty, the prefetch failed — check that Strapi was reachable during build.

- [ ] **Step 3: Verify SEO tags**

```bash
grep -E 'og:|twitter:|ld\+json|canonical|manifest' mi_portafolio/dist/index.html | head -20
```

Expected: OG properties, Twitter card tags, JSON-LD script blocks, canonical link, and manifest link all present.

- [ ] **Step 4: Verify sitemap**

```bash
cat mi_portafolio/dist/sitemap.xml
```

Expected:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gabrielportafoliodev.netlify.app/</loc>
    ...
  </url>
</urlset>
```

- [ ] **Step 5: Verify robots.txt is in dist**

```bash
cat mi_portafolio/dist/robots.txt
```

Expected: The robots.txt content with the sitemap URL.

- [ ] **Step 6: Preview and visual check**

```bash
cd mi_portafolio && pnpm preview
```

Open http://localhost:4173. Verify:
- Page renders correctly (no blank screen)
- Animations work (Framer Motion)
- Contact form is functional
- Navigation scrolls to sections

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat(seo): complete SSG + SEO — vite-ssg, JSON-LD, sitemap, manifest, robots"
```

---

## Post-deployment checklist

After deploying to Netlify:
1. Set `VITE_STRAPI_URL` in Netlify → Site settings → Environment variables
2. Trigger a new deploy (so the build runs with the env var set)
3. Submit `https://gabrielportafoliodev.netlify.app/sitemap.xml` to Google Search Console
4. Use the URL Inspection tool in Google Search Console to request indexing of `/`
5. Test OG image with https://www.opengraph.xyz

---

## Constraints

- `VITE_STRAPI_URL` must be set in Netlify environment variables; if missing, `api.*` calls use `http://localhost:1337` which fails in Netlify's build servers and the HTML pre-renders with empty content.
- `public/og-image.jpg` is a **manual step** — no script generates it automatically.
- `react-router-dom` is added solely as a peer dep for `vite-ssg/react` — no routing logic is added to the app.
- `dist/` is gitignored by default — skip adding dist files to git.
