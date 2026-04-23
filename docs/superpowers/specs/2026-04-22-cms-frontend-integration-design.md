# CMS ↔ Frontend Integration Design
**Date:** 2026-04-22
**Scope:** Connect Vite/React frontend (`mi_portafolio/`) to Strapi v5 CMS (`cms-strapi-portafolio/`) endpoints

---

## 1. Architecture

### New files
```
mi_portafolio/
├── .env.local                                   VITE_STRAPI_URL=http://localhost:1337
├── .env.example                                 same, committed for documentation
└── src/
    ├── lib/
    │   ├── queryClient.ts                       TanStack QueryClient (shared config)
    │   └── icons.ts                             ICON_MAP: string → LucideIcon
    ├── types/
    │   └── cms.ts                               TypeScript types for Strapi v5 responses
    ├── services/
    │   └── api.ts                               Typed fetch functions + assetUrl helper
    ├── hooks/
    │   ├── useHero.ts
    │   ├── useAbout.ts
    │   ├── useTechnologies.ts
    │   ├── useProjects.ts
    │   ├── useContact.ts
    │   ├── useFooter.ts
    │   └── useGlobal.ts
    └── components/
        └── ui/
            └── skeleton.tsx                     Base Skeleton + per-section skeletons
```

### Modified files
```
src/App.tsx                   wrap with QueryClientProvider
src/components/Header.tsx     useGlobal()
src/components/Hero.tsx       useHero()
src/components/About.tsx      useAbout()
src/components/Technologies.tsx  useTechnologies()
src/components/Projects.tsx   useProjects()
src/components/Contact.tsx    useContact()
src/components/Footer.tsx     useFooter()
```

### Data flow
All 7 fetches fire **in parallel** when components mount. TanStack Query deduplicates
identical keys and serves cached data on subsequent renders.

```
App (QueryClientProvider)
 ├─ Header      → useGlobal()        → GET /api/global?populate=*
 ├─ Hero        → useHero()          → GET /api/hero?populate=*
 ├─ About       → useAbout()         → GET /api/about?populate=*
 ├─ Technologies → useTechnologies() → GET /api/tech-categories?populate[technologies][populate]=icon&sort=order:asc
 ├─ Projects    → useProjects()      → GET /api/projects?populate[technologies]=*&sort=order:asc
 ├─ Contact     → useContact()       → GET /api/contact?populate=*
 └─ Footer      → useFooter()        → GET /api/footer?populate=*
```

---

## 2. TypeScript Types (`src/types/cms.ts`)

Strapi v5 returns **flat responses** (no `attributes` wrapper).

```typescript
type StrapiResponse<T> = { data: T; meta: Record<string, unknown> }
type StrapiList<T>     = { data: T[]; meta: { pagination: { total: number } } }

interface StrapiMedia      { id: number; url: string; name: string; mime: string }
interface SocialLink       { platform: string; url: string; label: string }
interface CtaButton        { label: string; targetSectionId: string; variant: string }
interface Highlight        { iconName: string; title: string; description: string }
interface ContactInfoItem  { iconName: string; title: string; value: string; link?: string }
interface NavItem          { label: string; targetSectionId: string }
interface Seo              { metaTitle: string; metaDescription: string }

interface Hero    { greeting: string; name: string; role: string; bio: string;
                   profileImage: StrapiMedia; primaryCta: CtaButton;
                   secondaryCta: CtaButton; socialLinks: SocialLink[] }
interface About   { title: string; description: string; highlights: Highlight[] }
interface Contact { title: string; description: string; formEnabled: boolean;
                   infoItems: ContactInfoItem[] }
interface Footer  { copyrightName: string; socialLinks: SocialLink[] }
interface Global  { siteTitle: string; navItems: NavItem[]; seo: Seo }

interface Technology   { id: number; name: string; slug: string; order: number;
                         icon: StrapiMedia }
interface TechCategory { id: number; title: string; slug: string; order: number;
                         technologies: Technology[] }
interface Project      { id: number; title: string; slug: string; description: string;
                         liveUrl: string; githubUrl: string; order: number;
                         featured: boolean; technologies: Technology[] }
```

---

## 3. API Service + QueryClient

### `src/lib/queryClient.ts`
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min — portfolio content is stable
      gcTime: 10 * 60 * 1000,          // 10 min — keep in cache after unmount
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
```

### `src/services/api.ts`
```typescript
const BASE = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`CMS ${res.status}: ${path}`)
  return (await res.json()).data
}

export const api = {
  hero:       () => get<Hero>('/api/hero?populate=*'),
  about:      () => get<About>('/api/about?populate=*'),
  contact:    () => get<Contact>('/api/contact?populate=*'),
  footer:     () => get<Footer>('/api/footer?populate=*'),
  global:     () => get<Global>('/api/global?populate=*'),
  projects:   () => get<Project[]>(
    '/api/projects?populate[technologies]=*&sort=order:asc'
  ),
  categories: () => get<TechCategory[]>(
    '/api/tech-categories?populate[technologies][populate]=icon&sort=order:asc'
  ),
}
```

### `src/App.tsx` change
Wrap with `<QueryClientProvider client={queryClient}>`. No other changes to App.

---

## 4. Hooks (`src/hooks/`)

One hook per resource, uniform pattern:

```typescript
// Example — all 7 hooks follow this exact shape
export function useHero() {
  return useQuery({ queryKey: ['hero'], queryFn: api.hero })
}
```

| Hook | queryKey | queryFn |
|---|---|---|
| `useHero` | `['hero']` | `api.hero` |
| `useAbout` | `['about']` | `api.about` |
| `useTechnologies` | `['tech-categories']` | `api.categories` |
| `useProjects` | `['projects']` | `api.projects` |
| `useContact` | `['contact']` | `api.contact` |
| `useFooter` | `['footer']` | `api.footer` |
| `useGlobal` | `['global']` | `api.global` |

---

## 5. Component Changes

### Uniform pattern in every component
```tsx
export function ComponentName() {
  const { data, isLoading, isError } = useXxx()
  if (isLoading) return <XxxSkeleton />
  if (isError)   return <ErrorMessage />
  // render with data
}
```

### Shared helpers

**`src/services/api.ts`** — export alongside `api` object (shares the same `BASE`):
```typescript
export const assetUrl = (url: string) =>
  `${import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'}${url}`
```

**`src/lib/icons.ts`** — new file, used by `About` and `Contact`:
```typescript
import { Code, Lightbulb, Users, BookOpenText, CheckCircle,
         BookmarkCheck, Mail, Phone, MapPin, type LucideIcon } from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Code, Lightbulb, Users, BookOpenText,
  CheckCircleIcon: CheckCircle,
  BookmarkCheck, Mail, Phone, MapPin,
}
```

### Per-component data mapping

| Component | Hook | Key mappings |
|---|---|---|
| `Header` | `useGlobal()` | `data.siteTitle`, `data.navItems[]` → scroll nav |
| `Hero` | `useHero()` | `data.name/role/bio`, `assetUrl(data.profileImage.url)`, `data.socialLinks[]` |
| `About` | `useAbout()` | `data.description`, `data.highlights[]` + `ICON_MAP[h.iconName]` |
| `Technologies` | `useTechnologies()` | categories → `assetUrl(tech.icon.url)` for SVG icons |
| `Projects` | `useProjects()` | `project.technologies[].name` as Badge text |
| `Contact` | `useContact()` | `data.infoItems[]` + `ICON_MAP[item.iconName]` |
| `Footer` | `useFooter()` | `data.copyrightName`, `data.socialLinks[]` |

**Note on Technologies:** `assetUrl(tech.icon.url)` replaces local ES module SVG imports.
The `src/assets/*.svg` files can be removed after migration.

**Note on Projects:** project image field is null in the seeded data. The component
renders without an image until real project images are uploaded in the CMS admin.

---

## 6. Skeleton Components (`src/components/ui/skeleton.tsx`)

### Base primitive
```tsx
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}
```

### Per-section skeletons (same file or co-located)

```tsx
export function HeroSkeleton() {
  return (
    <section className="flex flex-col items-center gap-4 py-20">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-80" />
    </section>
  )
}

export function AboutSkeleton() {
  return (
    <section className="py-16">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </section>
  )
}

export function TechnologiesSkeleton() {
  return (
    <section className="py-16">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </section>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  )
}

export function ContactSkeleton() {
  return (
    <section className="py-16">
      <Skeleton className="h-6 w-40 mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full mb-2" />
      ))}
    </section>
  )
}

export function FooterSkeleton() {
  return <Skeleton className="h-16 w-full" />
}

export function HeaderSkeleton() {
  return <Skeleton className="h-16 w-full" />
}
```

### Error state (inline, per section)
```tsx
<section id={sectionId} className="flex items-center justify-center py-20">
  <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
</section>
```

---

## 7. Environment Config

**`.env.local`** (gitignored — local dev only):
```
VITE_STRAPI_URL=http://localhost:1337
```

**`.env.example`** (committed — documents required vars):
```
VITE_STRAPI_URL=http://localhost:1337
```

Vite exposes `VITE_*` vars to the browser via `import.meta.env` automatically.
For production: set `VITE_STRAPI_URL` to the deployed CMS domain in the hosting environment.

---

## Dependencies to install

```bash
pnpm add @tanstack/react-query
```

No other new dependencies. Native `fetch` is used (no axios).

---

## Out of scope

- Contact form submission — currently logs to console, no backend endpoint. A future
  task can integrate Formspree, EmailJS, or a Strapi custom route.
- SEO meta tags from `global.seo` — can be wired to `<title>` and `<meta>` in a follow-up.
- Dark/light theme toggle — existing feature, not touched.
