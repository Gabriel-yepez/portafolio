# V1 ↔ CMS Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the Strapi CMS with a `certification` collection type and a `cvUrl` field, seed all missing data (certifications, n8n tech, ActionMetrics project), then connect every section of the v1 frontend to live Strapi APIs using TanStack Query while preserving all v1-specific patterns (lazy loading, Swiper carousel, EmailJS form, MUI Skeleton).

**Architecture:** Phase 1 modifies Strapi schemas and the seed script, then requires a manual permissions step in the admin panel. Phase 2 works entirely on the v1 branch — installs TanStack Query, creates a typed API layer (`strapiApi.ts`), and replaces every hardcoded util import with a CMS hook. Component structure, animations, and third-party integrations (Swiper, EmailJS) are preserved unchanged.

**Tech Stack:** Strapi v5, React 19, TypeScript strict, TanStack Query v5, Vite, Tailwind CSS v4, Swiper 11, EmailJS, MUI Skeleton, Lucide React, native `fetch`.

> **No test runner configured.** Each task ends with a manual CLI or browser verification step.

> **Prerequisite:** Strapi must be running on `http://localhost:1337` whenever seeding or testing the frontend. Start it with `npm run dev` from `cms-strapi-portafolio/`.

> **Branch:** All frontend work targets **v1**. Before Task 6, run:
> ```bash
> git checkout -b v1-cms-integration origin/v1
> ```

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `cms-strapi-portafolio/src/api/certification/content-types/certification/schema.json` | Create | Certification collection type schema |
| `cms-strapi-portafolio/src/api/certification/controllers/certification.ts` | Create | Strapi core controller |
| `cms-strapi-portafolio/src/api/certification/routes/certification.ts` | Create | Strapi core router |
| `cms-strapi-portafolio/src/api/certification/services/certification.ts` | Create | Strapi core service |
| `cms-strapi-portafolio/src/api/about/content-types/about/schema.json` | Modify | Add `cvUrl` string field |
| `cms-strapi-portafolio/scripts/seed.js` | Modify | Add certifications, n8n tech, ActionMetrics project |
| `mi_portafolio/.env.local` | Create | `VITE_STRAPI_URL` for local dev (gitignored) |
| `mi_portafolio/.env.example` | Create | Documents required env vars |
| `mi_portafolio/src/types/cms.ts` | Create | TypeScript types for all Strapi v5 responses |
| `mi_portafolio/src/lib/queryClient.ts` | Create | TanStack QueryClient singleton |
| `mi_portafolio/src/lib/icons.ts` | Create | String → LucideIcon map |
| `mi_portafolio/src/services/strapiApi.ts` | Create | Typed fetch functions + `assetUrl` helper |
| `mi_portafolio/src/hooks/useHero.ts` | Create | Query hook for Hero |
| `mi_portafolio/src/hooks/useAbout.ts` | Create | Query hook for About |
| `mi_portafolio/src/hooks/useTechnologies.ts` | Create | Query hook for tech categories |
| `mi_portafolio/src/hooks/useProjects.ts` | Create | Query hook for projects |
| `mi_portafolio/src/hooks/useCertifications.ts` | Create | Query hook for certifications |
| `mi_portafolio/src/hooks/useContact.ts` | Create | Query hook for Contact |
| `mi_portafolio/src/hooks/useFooter.ts` | Create | Query hook for Footer |
| `mi_portafolio/src/hooks/useGlobal.ts` | Create | Query hook for Global |
| `mi_portafolio/src/App.tsx` | Modify | Add QueryClientProvider wrapper |
| `mi_portafolio/src/components/Header.tsx` | Modify | Dynamic nav from `useGlobal()` |
| `mi_portafolio/src/components/Hero.tsx` | Modify | All content from `useHero()`, preserve image preload |
| `mi_portafolio/src/components/About.tsx` | Modify | Dynamic content from `useAbout()`, CV URL from `data.cvUrl` |
| `mi_portafolio/src/components/Technologies.tsx` | Modify | CMS tech categories from `useTechnologies()` |
| `mi_portafolio/src/components/Certifications.tsx` | Modify | CMS certifications from `useCertifications()`, keep Swiper |
| `mi_portafolio/src/components/Projects.tsx` | Modify | Dynamic projects from `useProjects()` |
| `mi_portafolio/src/components/Contact.tsx` | Modify | CMS contact info from `useContact()`, keep EmailJS |
| `mi_portafolio/src/components/Footer.tsx` | Modify | CMS data from `useFooter()` |

---

## PHASE 1 — CMS

### Task 1: Create `certification` collection type

**Files:**
- Create: `cms-strapi-portafolio/src/api/certification/content-types/certification/schema.json`
- Create: `cms-strapi-portafolio/src/api/certification/controllers/certification.ts`
- Create: `cms-strapi-portafolio/src/api/certification/routes/certification.ts`
- Create: `cms-strapi-portafolio/src/api/certification/services/certification.ts`

- [ ] **Step 1: Create schema**

```json
{
  "kind": "collectionType",
  "collectionName": "certifications",
  "info": {
    "singularName": "certification",
    "pluralName": "certifications",
    "displayName": "Certification",
    "description": "Professional certifications and badges"
  },
  "options": { "draftAndPublish": true },
  "pluginOptions": {},
  "attributes": {
    "title":         { "type": "string",  "required": true },
    "issuer":        { "type": "string",  "required": true },
    "issueDate":     { "type": "string",  "required": true },
    "description":   { "type": "text",    "required": true },
    "credentialId":  { "type": "string" },
    "credentialUrl": { "type": "string",  "required": true },
    "topics":        { "type": "json" },
    "order":         { "type": "integer", "default": 0 }
  }
}
```

- [ ] **Step 2: Create controller** (`cms-strapi-portafolio/src/api/certification/controllers/certification.ts`)

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::certification.certification');
```

- [ ] **Step 3: Create router** (`cms-strapi-portafolio/src/api/certification/routes/certification.ts`)

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::certification.certification');
```

- [ ] **Step 4: Create service** (`cms-strapi-portafolio/src/api/certification/services/certification.ts`)

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::certification.certification');
```

- [ ] **Step 5: Commit**

```bash
git add cms-strapi-portafolio/src/api/certification/
git commit -m "feat(cms): add certification collection type"
```

---

### Task 2: Add `cvUrl` field to About schema

**Files:**
- Modify: `cms-strapi-portafolio/src/api/about/content-types/about/schema.json`

- [ ] **Step 1: Read existing schema** — read `cms-strapi-portafolio/src/api/about/content-types/about/schema.json`.

- [ ] **Step 2: Add `cvUrl` field** — replace the `attributes` block with:

```json
"attributes": {
  "title": { "type": "string", "required": true, "default": "Sobre mí" },
  "description": { "type": "text", "required": true },
  "cvUrl": { "type": "string" },
  "highlights": {
    "type": "component",
    "repeatable": true,
    "component": "shared.highlight",
    "min": 1,
    "max": 12
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add cms-strapi-portafolio/src/api/about/content-types/about/schema.json
git commit -m "feat(cms): add cvUrl field to about schema"
```

---

### Task 3: Update seed script

**Files:**
- Modify: `cms-strapi-portafolio/scripts/seed.js`

- [ ] **Step 1: Read the existing seed.js** to understand the current structure and the end of the `TECHNOLOGIES` array and `PROJECTS` array.

- [ ] **Step 2: Add n8n to the TECHNOLOGIES array** — insert after the last Herramientas entry (after `Postman`):

```js
{ name: 'n8n', slug: 'n8n', icon: null, category: 'herramientas', order: 6 },
```

- [ ] **Step 3: Add Zustand and Sequelize** — insert after n8n (these are used by ActionMetrics):

```js
{ name: 'Zustand', slug: 'zustand', icon: null, category: 'frontend', order: 8 },
{ name: 'Sequelize', slug: 'sequelize', icon: null, category: 'backend', order: 5 },
```

- [ ] **Step 4: Add ActionMetrics to PROJECTS** — insert after the Task Management App entry:

```js
{
  title: 'ActionMetrics',
  slug: 'action-metrics',
  description:
    'Sistema de gestión de métricas y análisis de datos para mejorar el rendimiento del recurso humano a nivel empresarial.',
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/Gabriel-yepez/ActionMetrics',
  techSlugs: ['nextjs', 'express', 'tailwind-css', 'zustand', 'postgresql', 'sequelize'],
  order: 3,
  featured: false,
},
```

- [ ] **Step 5: Add CERTIFICATIONS data constant** — insert after the `PROJECTS` constant:

```js
const CERTIFICATIONS = [
  {
    title: 'Associate Cloud Engineer',
    issuer: 'Google Cloud',
    issueDate: 'Sep 2024',
    credentialId: '13366036-ed06-4f79-b557-02da4acd65c2',
    credentialUrl: 'https://www.credly.com/badges/13366036-ed06-4f79-b557-02da4acd65c2',
    description:
      'El proceso para obtener formalmente el título de Associate Cloud Engineer culminará con la aplicación práctica y la certificación oficial tras dominar los fundamentos teóricos que ya has revisado, los cuales incluyen el despliegue de soluciones, el monitoreo operativo, la gestión de IAM y la administración de redes y almacenamiento; la clave es transformar esa teoría en habilidad práctica a través del uso intensivo de la interfaz de línea de comandos (CLI) / gcloud SDK y la Cloud Console. Este camino de estudio y experiencia práctica finalizará con la inscripción y la aprobación satisfactoria del examen de certificación oficial de Google Cloud, validando tu capacidad para realizar tareas operativas esenciales y consolidando tu título como Associate Cloud Engineer.',
    topics: ['Cloud Architecture', 'Cloud Computing', 'DevOps', 'Iam', 'GKE', 'Networking', 'Google Cloud Platform'],
    order: 1,
  },
  {
    title: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
    issueDate: 'Aug 2025',
    credentialId: 'FDE-8217',
    credentialUrl: 'https://www.credly.com/earner/earned/badge/36d51470-cc8b-444f-b69a-7e2592336872',
    description:
      'Cisco, en colaboración con OpenEDG Python Institute, verifica que la persona que obtiene este distintivo ha completado con éxito el curso Python Essentials 1 y ha alcanzado las credenciales a nivel estudiantil. Los titulares tienen conocimientos sobre los conceptos de programación informática, la sintaxis y semántica del lenguaje Python, así como la capacidad de realizar tareas de codificación relacionadas con los fundamentos de la programación en Python y resolver desafíos de implementación utilizando la Biblioteca Estándar de Python.',
    topics: ['Python'],
    order: 2,
  },
  {
    title: 'Python Essentials 2',
    issuer: 'Cisco Networking Academy',
    issueDate: 'Nov 2025',
    credentialId: '9ec9fcc3-e553-43cf-8c55-0b631d376ad0',
    credentialUrl: 'https://www.credly.com/earner/earned/badge/9ec9fcc3-e553-43cf-8c55-0b631d376ad0',
    description:
      'Cisco, en colaboración con OpenEDG Python Institute, verifica que el titular de esta insignia completó con éxito el curso Python Essentials 2 y logró las credenciales a nivel estudiantil. Los titulares poseen conocimientos y habilidades en aspectos intermedios de la programación en Python, incluyendo módulos, paquetes, excepciones, procesamiento de archivos, así como técnicas generales de codificación y programación orientada a objetos (POO), y prepara al estudiante para la certificación PCAP – Certified Associate in Python Programming.',
    topics: ['Python'],
    order: 3,
  },
];
```

- [ ] **Step 6: Add the certifications seeding block** inside the `try` block of `main()`, right after the existing global seeding block (after the `globalExists` check closes) and before `strapi.log.info('[seed] done')`:

```js
    // Seed certifications
    for (const cert of CERTIFICATIONS) {
      const existing = await strapi.entityService.findMany('api::certification.certification', {
        filters: { credentialId: cert.credentialId },
        limit: 1,
      });
      if (existing && existing.length > 0) continue;
      await strapi.entityService.create('api::certification.certification', {
        data: {
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          description: cert.description,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl,
          topics: cert.topics,
          order: cert.order,
          publishedAt: new Date(),
        },
      });
    }

    // Add Certificaciones to global navItems if missing
    const globalData = await strapi.entityService.findMany('api::global.global', {
      populate: ['navItems'],
    });
    const globalRecord = Array.isArray(globalData) ? globalData[0] : globalData;
    if (globalRecord) {
      const navItems = globalRecord.navItems || [];
      if (!navItems.some((n) => n.targetSectionId === 'certifications')) {
        const withoutContact = navItems.filter((n) => n.targetSectionId !== 'contact');
        withoutContact.push({ label: 'Certificaciones', targetSectionId: 'certifications' });
        withoutContact.push({ label: 'Contacto', targetSectionId: 'contact' });
        await strapi.entityService.update('api::global.global', globalRecord.id, {
          data: { navItems: withoutContact },
        });
        strapi.log.info('[seed] added Certificaciones navItem');
      }
    }
```

- [ ] **Step 7: Handle icon: null for technologies without SVG** — in the `for (const tech of TECHNOLOGIES)` loop, the existing code calls `uploadAsset(strapi, tech.icon)`. When `tech.icon` is null, this will crash. Replace the icon upload line:

Find:
```js
      const icon = await uploadAsset(strapi, tech.icon);
```

Replace with:
```js
      const icon = tech.icon ? await uploadAsset(strapi, tech.icon) : null;
```

- [ ] **Step 8: Commit**

```bash
git add cms-strapi-portafolio/scripts/seed.js
git commit -m "feat(cms): add certifications, n8n, ActionMetrics to seed"
```

---

### Task 4: Restart Strapi + run seed + set permissions

- [ ] **Step 1: Stop Strapi** if running. Then restart it from `cms-strapi-portafolio/`:

```bash
npm run dev
```

Wait for `[INFO] Time: ...` in the output confirming Strapi has started with the new `certification` content type.

- [ ] **Step 2: Run the seed** from `cms-strapi-portafolio/`:

```bash
node scripts/seed.js
```

Expected output: `[seed] done` with no errors. If Strapi is already running you may get a port conflict — stop the dev server first, run the seed, then restart dev.

- [ ] **Step 3: Verify certifications in admin** — open `http://localhost:1337/admin` → Content Manager → Certification. You should see 3 certifications. Confirm all 3 are published (green Published badge).

- [ ] **Step 4: Grant public permissions** — in the Strapi admin:
  1. Go to **Settings → Users & Permissions plugin → Roles → Public**
  2. Scroll to **Certification**
  3. Check `find` and `findOne`
  4. Click **Save**

- [ ] **Step 5: Update about.cvUrl via admin** — in the Strapi admin:
  1. Go to **Content Manager → About**
  2. Set the `cvUrl` field to your CV link (e.g. a Google Drive share URL or Dropbox link)
  3. Click **Save**

- [ ] **Step 6: Verify the endpoint** — curl the certifications API:

```bash
curl -s "http://localhost:1337/api/certifications?sort=order:asc" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');const r=JSON.parse(d);console.log('count:', r.data.length, 'first:', r.data[0]?.title)"
```

Expected: `count: 3 first: Associate Cloud Engineer`

---

## PHASE 2 — FRONTEND (v1 branch)

> All steps below run from the `v1-cms-integration` branch, inside `mi_portafolio/` unless stated otherwise.

### Task 5: Checkout v1 + install deps + env files

**Files:**
- Modify: `mi_portafolio/package.json` (adds `@tanstack/react-query`)
- Create: `mi_portafolio/.env.local`
- Create: `mi_portafolio/.env.example`

- [ ] **Step 1: Checkout v1 branch**

```bash
git checkout -b v1-cms-integration origin/v1
```

Expected: `Switched to a new branch 'v1-cms-integration'`

- [ ] **Step 2: Install TanStack Query v5**

```bash
cd mi_portafolio && pnpm add @tanstack/react-query
```

Expected output includes: `+ @tanstack/react-query 5.x.x`

- [ ] **Step 3: Create `.env.local`** (gitignored, local dev only):

```
VITE_STRAPI_URL=http://localhost:1337
VITE_CV_URL=https://your-cv-link-here.com
```

- [ ] **Step 4: Create `.env.example`** (committed, documents vars):

```
VITE_STRAPI_URL=http://localhost:1337
VITE_CV_URL=https://your-cv-link-here.com
```

- [ ] **Step 5: Commit**

```bash
git add mi_portafolio/package.json mi_portafolio/pnpm-lock.yaml mi_portafolio/.env.example
git commit -m "chore(frontend/v1): install TanStack Query v5, add env config"
```

---

### Task 6: TypeScript types

**Files:**
- Create: `mi_portafolio/src/types/cms.ts`

- [ ] **Step 1: Create `src/types/cms.ts`**:

```typescript
export interface StrapiMedia {
  id: number
  url: string
  name: string
  mime: string
}

export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface CtaButton {
  label: string
  targetSectionId: string
  variant: string
}

export interface Highlight {
  iconName: string
  title: string
  description: string
}

export interface ContactInfoItem {
  iconName: string
  title: string
  value: string
  link?: string
}

export interface NavItem {
  label: string
  targetSectionId: string
}

export interface Seo {
  metaTitle: string
  metaDescription: string
}

export interface Hero {
  greeting: string
  name: string
  role: string
  bio: string
  profileImage: StrapiMedia | null
  primaryCta: CtaButton
  secondaryCta: CtaButton
  socialLinks: SocialLink[]
}

export interface About {
  title: string
  description: string
  cvUrl: string | null
  highlights: Highlight[]
}

export interface Contact {
  title: string
  description: string
  formEnabled: boolean
  infoItems: ContactInfoItem[]
}

export interface Footer {
  copyrightName: string
  socialLinks: SocialLink[]
}

export interface Global {
  siteTitle: string
  navItems: NavItem[]
  seo: Seo
}

export interface Technology {
  id: number
  name: string
  slug: string
  order: number
  icon: StrapiMedia | null
}

export interface TechCategory {
  id: number
  title: string
  slug: string
  order: number
  technologies: Technology[]
}

export interface Project {
  id: number
  title: string
  slug: string
  description: string
  liveUrl: string
  githubUrl: string
  order: number
  featured: boolean
  image: StrapiMedia | null
  technologies: Technology[]
}

export interface Certification {
  id: number
  title: string
  issuer: string
  issueDate: string
  description: string
  credentialId: string | null
  credentialUrl: string
  topics: string[] | null
  order: number
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/types/cms.ts
git commit -m "feat(frontend/v1): add TypeScript types for Strapi v5 responses"
```

---

### Task 7: QueryClient + icons map

**Files:**
- Create: `mi_portafolio/src/lib/queryClient.ts`
- Create: `mi_portafolio/src/lib/icons.ts`

- [ ] **Step 1: Create `src/lib/queryClient.ts`**:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
```

- [ ] **Step 2: Create `src/lib/icons.ts`**:

```typescript
import {
  Code,
  Lightbulb,
  Users,
  BookOpenText,
  CheckCircle,
  BookmarkCheck,
  Mail,
  Phone,
  MapPin,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Lightbulb,
  Users,
  BookOpenText,
  CheckCircleIcon: CheckCircle,
  BookmarkCheck,
  Mail,
  Phone,
  MapPin,
}
```

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/lib/
git commit -m "feat(frontend/v1): add QueryClient config and icon map"
```

---

### Task 8: API service

**Files:**
- Create: `mi_portafolio/src/services/strapiApi.ts`

Note: v1 already has `src/services/emailServices.ts` — do not touch it.

- [ ] **Step 1: Create `src/services/strapiApi.ts`**:

```typescript
import type {
  Hero, About, Contact, Footer, Global, Project, TechCategory, Certification,
} from '../types/cms'

const BASE = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'

export const assetUrl = (url: string) => `${BASE}${url}`

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`CMS ${res.status}: ${path}`)
  return (await res.json()).data as T
}

export const strapiApi = {
  hero: () => get<Hero>('/api/hero?populate=*'),
  about: () => get<About>('/api/about?populate=*'),
  contact: () => get<Contact>('/api/contact?populate=*'),
  footer: () => get<Footer>('/api/footer?populate=*'),
  global: () => get<Global>('/api/global?populate=*'),
  projects: () =>
    get<Project[]>('/api/projects?populate[technologies]=*&sort=order:asc'),
  categories: () =>
    get<TechCategory[]>(
      '/api/tech-categories?populate[technologies][populate]=icon&sort=order:asc',
    ),
  certifications: () =>
    get<Certification[]>('/api/certifications?sort=order:asc'),
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/services/strapiApi.ts
git commit -m "feat(frontend/v1): add typed Strapi API service"
```

---

### Task 9: TanStack Query hooks (8 hooks)

**Files:**
- Create: `mi_portafolio/src/hooks/useHero.ts`
- Create: `mi_portafolio/src/hooks/useAbout.ts`
- Create: `mi_portafolio/src/hooks/useTechnologies.ts`
- Create: `mi_portafolio/src/hooks/useProjects.ts`
- Create: `mi_portafolio/src/hooks/useCertifications.ts`
- Create: `mi_portafolio/src/hooks/useContact.ts`
- Create: `mi_portafolio/src/hooks/useFooter.ts`
- Create: `mi_portafolio/src/hooks/useGlobal.ts`

- [ ] **Step 1: Create `src/hooks/useHero.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useHero() {
  return useQuery({ queryKey: ['hero'], queryFn: strapiApi.hero })
}
```

- [ ] **Step 2: Create `src/hooks/useAbout.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useAbout() {
  return useQuery({ queryKey: ['about'], queryFn: strapiApi.about })
}
```

- [ ] **Step 3: Create `src/hooks/useTechnologies.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useTechnologies() {
  return useQuery({ queryKey: ['tech-categories'], queryFn: strapiApi.categories })
}
```

- [ ] **Step 4: Create `src/hooks/useProjects.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: strapiApi.projects })
}
```

- [ ] **Step 5: Create `src/hooks/useCertifications.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useCertifications() {
  return useQuery({ queryKey: ['certifications'], queryFn: strapiApi.certifications })
}
```

- [ ] **Step 6: Create `src/hooks/useContact.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useContact() {
  return useQuery({ queryKey: ['contact'], queryFn: strapiApi.contact })
}
```

- [ ] **Step 7: Create `src/hooks/useFooter.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useFooter() {
  return useQuery({ queryKey: ['footer'], queryFn: strapiApi.footer })
}
```

- [ ] **Step 8: Create `src/hooks/useGlobal.ts`**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { strapiApi } from '../services/strapiApi'

export function useGlobal() {
  return useQuery({ queryKey: ['global'], queryFn: strapiApi.global })
}
```

- [ ] **Step 9: Commit**

```bash
git add mi_portafolio/src/hooks/
git commit -m "feat(frontend/v1): add 8 TanStack Query hooks for CMS endpoints"
```

---

### Task 10: Wrap App.tsx with QueryClientProvider

**Files:**
- Modify: `mi_portafolio/src/App.tsx`

- [ ] **Step 1: Read the existing `src/App.tsx`** from origin/v1 (it uses `React.lazy` for all sections).

- [ ] **Step 2: Replace `src/App.tsx`** with the QueryClientProvider-wrapped version, keeping all lazy imports and Suspense boundaries intact:

```tsx
import { Suspense, lazy } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient"
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { SectionSkeleton } from "./components/ui/Skeleton"

const AboutSection = lazy(() =>
  import("./components/About").then((m) => ({ default: m.About }))
)
const TechnologiesSection = lazy(() =>
  import("./components/Technologies").then((m) => ({ default: m.Technologies }))
)
const CertificationsSection = lazy(() =>
  import("./components/Certifications").then((m) => ({ default: m.Certifications }))
)
const ProjectsSection = lazy(() =>
  import("./components/Projects").then((m) => ({ default: m.Projects }))
)
const ContactSection = lazy(() =>
  import("./components/Contact").then((m) => ({ default: m.Contact }))
)
const FooterSection = lazy(() =>
  import("./components/Footer").then((m) => ({ default: m.Footer }))
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <TechnologiesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <CertificationsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FooterSection />
        </Suspense>
      </main>
    </QueryClientProvider>
  )
}

export default App
```

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/App.tsx
git commit -m "feat(frontend/v1): wrap app with QueryClientProvider"
```

---

### Task 11: Header — useGlobal()

**Files:**
- Modify: `mi_portafolio/src/components/Header.tsx`

- [ ] **Step 1: Replace `src/components/Header.tsx`** — the new version reads navItems from CMS, uses the last item as a Button (preserves v1 style), and falls back to empty arrays while loading:

```tsx
import { Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { useGlobal } from "../hooks/useGlobal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data } = useGlobal()

  const siteTitle = data?.siteTitle ?? "Mi Portafolio"
  const navItems = data?.navItems ?? []
  const mainItems = navItems.slice(0, -1)
  const lastItem = navItems[navItems.length - 1]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="cursor-pointer" onClick={() => scrollToSection("hero")}>
            {siteTitle}
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {mainItems.map((item) => (
              <button
                key={item.targetSectionId}
                onClick={() => scrollToSection(item.targetSectionId)}
                className="hover:text-primary transition-colors underline-offset-2
                hover:underline decoration-[1.5px] hover:cursor-pointer
                focus:underline focus:text-primary"
              >
                {item.label}
              </button>
            ))}
            {lastItem && (
              <Button
                onClick={() => scrollToSection(lastItem.targetSectionId)}
                className="hover:cursor-pointer hover:bg-switch-background"
              >
                {lastItem.label}
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {mainItems.map((item) => (
              <button
                key={item.targetSectionId}
                onClick={() => scrollToSection(item.targetSectionId)}
                className="text-left hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            {lastItem && (
              <Button onClick={() => scrollToSection(lastItem.targetSectionId)}>
                {lastItem.label}
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Header.tsx
git commit -m "feat(frontend/v1): wire Header to useGlobal() CMS endpoint"
```

---

### Task 12: Hero — useHero()

**Files:**
- Modify: `mi_portafolio/src/components/Hero.tsx`

- [ ] **Step 1: Replace `src/components/Hero.tsx`** — preserves the `useEffect` preload and all v1 CSS classes, but replaces hardcoded data with CMS data:

```tsx
import { useEffect } from "react"
import { Button } from "./ui/button"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useHero } from "../hooks/useHero"
import { assetUrl } from "../services/strapiApi"
import github from "../assets/github.svg"
import linkedin from "../assets/linkedin.svg"

const SOCIAL_SVG: Record<string, string> = { github, linkedin }

export function Hero() {
  const { data, isLoading, isError } = useHero()

  useEffect(() => {
    if (!data?.profileImage?.url) return
    if (typeof document === "undefined") return
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = assetUrl(data.profileImage.url)
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [data?.profileImage?.url])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading)
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </section>
    )

  if (isError || !data)
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-18 md:pt-8 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xl">{data.greeting}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">{data.name}</h1>
              <h2 className="text-2xl md:text-3xl">{data.role}</h2>
            </div>

            <p className="text-xl text-muted-foreground">{data.bio}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollToSection(data.primaryCta.targetSectionId)}
                size="lg"
                className="hover:scale-105 transition-transform cursor-pointer hover:bg-switch-background"
              >
                {data.primaryCta.label}
              </Button>
              <Button
                onClick={() => scrollToSection(data.secondaryCta.targetSectionId)}
                variant="outline"
                size="lg"
                className="hover:scale-105 border border-gray-400 transition-transform cursor-pointer"
              >
                {data.secondaryCta.label}
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              {data.socialLinks.map((link) =>
                SOCIAL_SVG[link.platform] ? (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-animated rounded-full"
                    aria-label={link.label}
                  >
                    <img src={SOCIAL_SVG[link.platform]} alt={link.label} className="w-12 h-12" />
                  </a>
                ) : null
              )}
            </div>
          </section>

          <section className="flex justify-center">
            <picture className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={data.profileImage ? assetUrl(data.profileImage.url) : ""}
                alt={`Retrato de ${data.name}`}
                width={512}
                height={512}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                sizes="(min-width: 768px) 20rem, 16rem"
                className="w-full h-full object-cover"
              />
            </picture>
          </section>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Hero.tsx
git commit -m "feat(frontend/v1): wire Hero to useHero() CMS endpoint"
```

---

### Task 13: About — useAbout()

**Files:**
- Modify: `mi_portafolio/src/components/About.tsx`

- [ ] **Step 1: Replace `src/components/About.tsx`** — replaces `highlights` import with CMS data, uses `data.cvUrl` with env-var fallback for the CV button:

```tsx
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useAbout } from "../hooks/useAbout"
import { ICON_MAP } from "../lib/icons"

export function About() {
  const { data, isError } = useAbout()

  if (isError || !data) return null

  const cvUrl = data.cvUrl ?? import.meta.env.VITE_CV_URL ?? "/cv.pdf"

  return (
    <section id="about" className="pt-20 px-4 bg-muted/30 defer-section">
      <div className="container mx-auto">
        <article className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.description}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Ve mi Curricullum sin compromiso!!
            </span>
            <Button
              asChild
              size="lg"
              className="bg-black rounded-lg text-white hover:bg-black/85 cursor-pointer transition-colors"
            >
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                Ver CV
              </a>
            </Button>
          </div>
        </article>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.highlights.map((item, index) => {
            const Icon = ICON_MAP[item.iconName]
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/About.tsx
git commit -m "feat(frontend/v1): wire About to useAbout() CMS endpoint"
```

---

### Task 14: Technologies — useTechnologies()

**Files:**
- Modify: `mi_portafolio/src/components/Technologies.tsx`

- [ ] **Step 1: Replace `src/components/Technologies.tsx`** — replaces the hardcoded `categories` import; preserves v1's `grid-cols-2 md:grid-cols-3` tech grid layout and padding:

```tsx
import { Badge } from "./ui/badge"
import { useTechnologies } from "../hooks/useTechnologies"
import { assetUrl } from "../services/strapiApi"

export function Technologies() {
  const { data, isError } = useTechnologies()

  if (isError || !data) return null

  return (
    <section id="technologies" className="py-8 md:py-20 px-4 defer-section">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </section>

        <article className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-8 md:px-20">
          {data.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-center">{category.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-2">
                {category.technologies.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="px-4 py-2 hover:bg-primary hover:text-primary-foreground
                    transition-colors cursor-default flex justify-center items-center w-full"
                  >
                    {tech.icon && (
                      <img
                        src={assetUrl(tech.icon.url)}
                        alt={tech.name}
                        className="w-6 h-6 mr-2 inline-block"
                      />
                    )}
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </article>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Technologies.tsx
git commit -m "feat(frontend/v1): wire Technologies to useTechnologies(), use CMS icon URLs"
```

---

### Task 15: Certifications — useCertifications()

**Files:**
- Modify: `mi_portafolio/src/components/Certifications.tsx`

- [ ] **Step 1: Replace `src/components/Certifications.tsx`** — replaces the hardcoded `certifications` import with CMS data; keeps Swiper, navigation, and card structure exactly as in v1:

```tsx
import { useId } from "react"
import { ExternalLink, MoveLeft, MoveRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useCertifications } from "../hooks/useCertifications"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

export function Certifications() {
  const prevButtonId = useId()
  const nextButtonId = useId()
  const { data, isError } = useCertifications()

  if (isError || !data) return null

  return (
    <section id="certifications" className="py-8 md:py-20 px-4 defer-section">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">Certificaciones</h2>
          <p className="text-xl text-muted-foreground">
            Reconocimientos que avalan mi formación continua y habilidades técnicas
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation={{
            prevEl: `#${prevButtonId}`,
            nextEl: `#${nextButtonId}`,
          }}
          autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
          spaceBetween={32}
          slidesPerView={1}
          loop
          centeredSlides
          grabCursor
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation
            if (navigation && typeof navigation !== "boolean") {
              navigation.prevEl = `#${prevButtonId}`
              navigation.nextEl = `#${nextButtonId}`
            }
          }}
          className="pb-16 rounded-2xl"
        >
          {data.map((cert) => (
            <SwiperSlide key={`${cert.title}-${cert.issuer}`} className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-lg font-semibold">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <Badge variant="secondary" className="w-fit mt-2">
                    {cert.issueDate}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(cert.topics ?? []).map((topic) => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
                  {cert.credentialId && (
                    <span className="text-xs text-muted-foreground">
                      ID: <span className="font-semibold">{cert.credentialId}</span>
                    </span>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver credencial
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            id={prevButtonId}
            aria-label="Ver certificación anterior"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-background text-foreground shadow hover:bg-muted transition-colors"
          >
            <MoveLeft className="h-5 w-5" />
          </button>
          <button
            id={nextButtonId}
            aria-label="Ver certificación siguiente"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-background text-foreground shadow hover:bg-muted transition-colors"
          >
            <MoveRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Certifications.tsx
git commit -m "feat(frontend/v1): wire Certifications to useCertifications() CMS endpoint"
```

---

### Task 16: Projects — useProjects()

**Files:**
- Modify: `mi_portafolio/src/components/Projects.tsx`

- [ ] **Step 1: Replace `src/components/Projects.tsx`** — replaces `projects` util import; `project.technologies` is now `Technology[]`, so renders `tech.name`. Preserves v1 lazy image attributes:

```tsx
import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useProjects } from "../hooks/useProjects"
import { assetUrl } from "../services/strapiApi"

export function Projects() {
  const { data, isError } = useProjects()

  if (isError || !data) return null

  return (
    <section id="projects" className="py-8 md:py-20 px-4 bg-muted/30 defer-section">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">Proyectos</h2>
          <p className="text-xl text-muted-foreground">
            Algunos de los proyectos en los que he trabajado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={project.image ? assetUrl(project.image.url) : ""}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <h3 className="text-lg font-semibold">{project.title}</h3>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id} variant="outline">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Código
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Projects.tsx
git commit -m "feat(frontend/v1): wire Projects to useProjects() CMS endpoint"
```

---

### Task 17: Contact — useContact()

**Files:**
- Modify: `mi_portafolio/src/components/Contact.tsx`

- [ ] **Step 1: Replace `src/components/Contact.tsx`** — replaces the `contactInfo` util import with CMS data via `useContact()`; ALL EmailJS, Zod validation, and form submission logic is kept unchanged:

```tsx
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { Send } from "lucide-react"
import { sendEmail } from "../services/emailServices"
import { type ContactFormErrors, validateContactForm } from "../validation/validationForm"
import { useContact } from "../hooks/useContact"
import { ICON_MAP } from "../lib/icons"

export function Contact() {
  const { data, isError } = useContact()
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSending, setIsSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)
    const result = validateContactForm(formData)
    if (!result.isValid) {
      setFormErrors(result.errors)
      setErrorMessage("Por favor corrige los errores del formulario.")
      return
    }
    setFormErrors({})
    sendEmail(e.currentTarget, setIsSending, setFormData)
      .then(() => setSuccessMessage("Mensaje enviado correctamente. Gracias!"))
      .catch((err) => {
        setErrorMessage("Error enviando el mensaje. Intenta nuevamente más tarde.")
        console.error(err)
      })
  }

  if (isError || !data) return null

  return (
    <section id="contact" className="py-10 px-4 defer-section">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.description}</p>
        </section>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <section>
              <h3 className="mb-4 text-lg text-center">Información de contacto</h3>
              <p className="text-muted-foreground mb-6">
                No dudes en contactarme a través de cualquiera de estos medios.
                Respondo lo más rápido posible.
              </p>
            </section>
            <section className="space-y-4">
              {data.infoItems.map((item, index) => {
                const Icon = ICON_MAP[item.iconName]
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <picture className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-primary" />}
                        </picture>
                        <article>
                          <p className="text-muted-foreground">{item.title}</p>
                          {item.link ? (
                            <a href={item.link} className="hover:text-primary transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p>{item.value}</p>
                          )}
                        </article>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </section>
          </div>

          {/* Contact Form — EmailJS unchanged */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block mb-2">Nombre</label>
                  <Input
                    id="name" name="name" type="text" placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData((p) => ({ ...p, name: value }))
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }))
                    }}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">Email</label>
                  <Input
                    id="email" name="email" type="email" placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData((p) => ({ ...p, email: value }))
                      if (formErrors.email) setFormErrors((p) => ({ ...p, email: undefined }))
                    }}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2">Mensaje</label>
                  <Textarea
                    id="message" name="message" placeholder="Escribe tu mensaje aquí..."
                    rows={5} value={formData.message}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData((p) => ({ ...p, message: value }))
                      if (formErrors.message) setFormErrors((p) => ({ ...p, message: undefined }))
                    }}
                  />
                  {formErrors.message && <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>}
                </div>

                <Button
                  type="submit" disabled={isSending}
                  className="w-full cursor-pointer hover:bg-switch-background"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>

              {successMessage && (
                <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-green-800">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-800">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Contact.tsx
git commit -m "feat(frontend/v1): wire Contact to useContact(), preserve EmailJS"
```

---

### Task 18: Footer — useFooter()

**Files:**
- Modify: `mi_portafolio/src/components/Footer.tsx`

- [ ] **Step 1: Replace `src/components/Footer.tsx`**:

```tsx
import { Github, Linkedin, type LucideIcon } from "lucide-react"
import { useFooter } from "../hooks/useFooter"

const SOCIAL_ICON: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
}

export function Footer() {
  const { data } = useFooter()
  const currentYear = new Date().getFullYear()

  const copyrightName = data?.copyrightName ?? "Gabriel Yépez"
  const socialLinks = data?.socialLinks ?? []

  return (
    <footer className="bg-muted/30 border-t border-border py-8 px-4 defer-section">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © {currentYear} {copyrightName}. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICON[link.platform]
              if (!Icon) return null
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/Footer.tsx
git commit -m "feat(frontend/v1): wire Footer to useFooter() CMS endpoint"
```

---

### Task 19: TypeScript build verification + push

- [ ] **Step 1: Run TypeScript build** from `mi_portafolio/`:

```bash
pnpm build 2>&1
```

Expected: zero TypeScript errors, Vite bundles successfully (similar to ~1400 modules).

If errors appear, they will likely be:
- `'data' is possibly 'undefined'` → add `if (!data) return null` after the `isError` guard.
- `Property 'X' does not exist` → check the interface in `src/types/cms.ts` matches the field name used.

- [ ] **Step 2: Start both services** — in two terminals:

Terminal 1 (`cms-strapi-portafolio/`):
```bash
npm run dev
```

Terminal 2 (`mi_portafolio/`):
```bash
pnpm dev
```

- [ ] **Step 3: Manual verification checklist** — open `http://localhost:5173` and check each section:

| Section | What to verify |
|---|---|
| Header | Nav items from CMS: Sobre mí, Tecnologías, Proyectos, Certificaciones, Contacto |
| Hero | Name, role, bio, profile photo from Strapi; GitHub/LinkedIn icons visible |
| About | Title, description, 6 highlight cards with icons; "Ver CV" button visible |
| Technologies | 4 categories; n8n visible in Herramientas with no icon; all tech badges |
| Certifications | Swiper carousel with 3 certifications; prev/next buttons work; autoplay |
| Projects | 3 project cards (E-commerce, Task Management, ActionMetrics) |
| Contact | Title/description from CMS; 3 info cards; EmailJS form functional |
| Footer | Copyright name from CMS; GitHub/LinkedIn icons |

Open DevTools → Network → filter by `localhost:1337`. Confirm 8 API calls fire and return 200.

- [ ] **Step 4: Push v1 branch**

```bash
git push -u origin v1-cms-integration
```

---

## Out of scope (future tasks)

- Contact form email configuration: EmailJS credentials are stored in env vars — document `VITE_PUBLIC_KEY`, `VITE_SERVICE_ID`, `VITE_TEMPLATE_ID` in `.env.example`.
- SEO meta tags: `global.seo.metaTitle` / `metaDescription` can be wired to `<title>` and `<meta>` via `react-helmet-async`.
- Project images: upload real screenshots in Strapi admin under Content Manager → Project → image field.
- n8n/Zustand/Sequelize icons: upload SVGs via Strapi admin Media Library and link to their Technology records.
