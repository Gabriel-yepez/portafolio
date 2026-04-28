# CMS ↔ Frontend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Vite/React frontend (`mi_portafolio/`) to the Strapi v5 CMS endpoints, replacing all hardcoded data with live API data fetched via TanStack Query v5.

**Architecture:** Seven component-level hooks fire in parallel on mount, each backed by a typed `api.*` function. TanStack QueryClient caches responses for 5 minutes, preventing redundant requests. Skeleton components match the shape of each section and display while data loads.

**Tech Stack:** React 19, TypeScript strict, TanStack Query v5, Vite, Tailwind CSS v4, Lucide React, native `fetch`

> **Note:** No test runner is configured in this project. Each task ends with a manual browser verification step instead of automated tests.

> **Prerequisite:** Strapi CMS must be running on `http://localhost:1337` before starting the dev server. Run `npm run dev` from `cms-strapi-portafolio/` in a separate terminal.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `mi_portafolio/.env.local` | Create | Strapi base URL for local dev |
| `mi_portafolio/.env.example` | Create | Documents required env vars |
| `src/types/cms.ts` | Create | TypeScript types for all Strapi v5 responses |
| `src/lib/queryClient.ts` | Create | TanStack QueryClient singleton with shared config |
| `src/lib/icons.ts` | Create | Static map: CMS iconName string → Lucide component |
| `src/services/api.ts` | Create | Typed fetch functions + `assetUrl` helper |
| `src/hooks/useHero.ts` | Create | Fetches hero single type |
| `src/hooks/useAbout.ts` | Create | Fetches about single type |
| `src/hooks/useTechnologies.ts` | Create | Fetches tech-categories with populated technologies |
| `src/hooks/useProjects.ts` | Create | Fetches projects collection |
| `src/hooks/useContact.ts` | Create | Fetches contact single type |
| `src/hooks/useFooter.ts` | Create | Fetches footer single type |
| `src/hooks/useGlobal.ts` | Create | Fetches global single type (nav, SEO) |
| `src/components/ui/skeleton.tsx` | Create | Base Skeleton + 6 per-section skeletons |
| `src/App.tsx` | Modify | Add QueryClientProvider wrapper |
| `src/components/Header.tsx` | Modify | Dynamic siteTitle + navItems from CMS |
| `src/components/Hero.tsx` | Modify | All content from CMS including profile image |
| `src/components/About.tsx` | Modify | Dynamic highlights with ICON_MAP |
| `src/components/Technologies.tsx` | Modify | Remove 21 local SVG imports, use CMS icon URLs |
| `src/components/Projects.tsx` | Modify | Dynamic projects list |
| `src/components/Contact.tsx` | Modify | Dynamic infoItems with ICON_MAP |
| `src/components/Footer.tsx` | Modify | Dynamic copyright + social links |

---

### Task 1: Install TanStack Query + environment files

**Files:**
- Create: `mi_portafolio/.env.local`
- Create: `mi_portafolio/.env.example`

- [ ] **Step 1: Install TanStack Query v5**

Run from `mi_portafolio/`:
```bash
cd mi_portafolio && pnpm add @tanstack/react-query
```
Expected: `dependencies: + @tanstack/react-query X.X.X` in output, no errors.

- [ ] **Step 2: Create `.env.local`**

```
VITE_STRAPI_URL=http://localhost:1337
```

- [ ] **Step 3: Create `.env.example`**

```
VITE_STRAPI_URL=http://localhost:1337
```

- [ ] **Step 4: Commit**

```bash
git add mi_portafolio/package.json mi_portafolio/pnpm-lock.yaml mi_portafolio/.env.example
git commit -m "chore(frontend): install TanStack Query v5 and add env config"
```

---

### Task 2: TypeScript types

**Files:**
- Create: `mi_portafolio/src/types/cms.ts`

- [ ] **Step 1: Create `src/types/cms.ts`**

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
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/types/cms.ts
git commit -m "feat(frontend): add TypeScript types for Strapi v5 CMS responses"
```

---

### Task 3: QueryClient + icons library

**Files:**
- Create: `mi_portafolio/src/lib/queryClient.ts`
- Create: `mi_portafolio/src/lib/icons.ts`

- [ ] **Step 1: Create `src/lib/queryClient.ts`**

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

- [ ] **Step 2: Create `src/lib/icons.ts`**

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
git add mi_portafolio/src/lib/queryClient.ts mi_portafolio/src/lib/icons.ts
git commit -m "feat(frontend): add QueryClient config and icon map"
```

---

### Task 4: API service

**Files:**
- Create: `mi_portafolio/src/services/api.ts`

- [ ] **Step 1: Create `src/services/api.ts`**

```typescript
import type {
  Hero, About, Contact, Footer, Global, Project, TechCategory,
} from '../types/cms'

const BASE = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'

export const assetUrl = (url: string) => `${BASE}${url}`

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`CMS ${res.status}: ${path}`)
  return (await res.json()).data as T
}

export const api = {
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
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/services/api.ts
git commit -m "feat(frontend): add typed API service with assetUrl helper"
```

---

### Task 5: React hooks

**Files:**
- Create: `mi_portafolio/src/hooks/useHero.ts`
- Create: `mi_portafolio/src/hooks/useAbout.ts`
- Create: `mi_portafolio/src/hooks/useTechnologies.ts`
- Create: `mi_portafolio/src/hooks/useProjects.ts`
- Create: `mi_portafolio/src/hooks/useContact.ts`
- Create: `mi_portafolio/src/hooks/useFooter.ts`
- Create: `mi_portafolio/src/hooks/useGlobal.ts`

- [ ] **Step 1: Create `src/hooks/useHero.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useHero() {
  return useQuery({ queryKey: ['hero'], queryFn: api.hero })
}
```

- [ ] **Step 2: Create `src/hooks/useAbout.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useAbout() {
  return useQuery({ queryKey: ['about'], queryFn: api.about })
}
```

- [ ] **Step 3: Create `src/hooks/useTechnologies.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useTechnologies() {
  return useQuery({ queryKey: ['tech-categories'], queryFn: api.categories })
}
```

- [ ] **Step 4: Create `src/hooks/useProjects.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: api.projects })
}
```

- [ ] **Step 5: Create `src/hooks/useContact.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useContact() {
  return useQuery({ queryKey: ['contact'], queryFn: api.contact })
}
```

- [ ] **Step 6: Create `src/hooks/useFooter.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useFooter() {
  return useQuery({ queryKey: ['footer'], queryFn: api.footer })
}
```

- [ ] **Step 7: Create `src/hooks/useGlobal.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useGlobal() {
  return useQuery({ queryKey: ['global'], queryFn: api.global })
}
```

- [ ] **Step 8: Commit**

```bash
git add mi_portafolio/src/hooks/
git commit -m "feat(frontend): add 7 TanStack Query hooks for CMS endpoints"
```

---

### Task 6: Skeleton components

**Files:**
- Create: `mi_portafolio/src/components/ui/skeleton.tsx`

- [ ] **Step 1: Create `src/components/ui/skeleton.tsx`**

```tsx
import { cn } from './utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

export function HeroSkeleton() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-10 px-4"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-14 w-64" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-6 w-80" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-28" />
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center">
            <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutSkeleton() {
  return (
    <section id="about" className="py-10 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function TechnologiesSkeleton() {
  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-40 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-9 w-24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectsSkeleton() {
  return (
    <section id="projects" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSkeleton() {
  return (
    <section id="contact" className="py-10 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add mi_portafolio/src/components/ui/skeleton.tsx
git commit -m "feat(frontend): add Skeleton base component and per-section skeletons"
```

---

### Task 7: Wire QueryClientProvider in App.tsx

**Files:**
- Modify: `mi_portafolio/src/App.tsx`

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { Header } from './components/Header'
import { About } from './components/About'
import { Hero } from './components/Hero'
import { Technologies } from './components/Technologies'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main>
        <Hero />
        <About />
        <Technologies />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </QueryClientProvider>
  )
}

export default App
```

- [ ] **Step 2: Start dev server and verify no console errors**

Run from `mi_portafolio/`:
```bash
pnpm dev
```
Open `http://localhost:5173`. Expected: page loads, no red errors in browser console. Components still render hardcoded data (hooks not yet wired in components).

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/App.tsx
git commit -m "feat(frontend): wrap app with QueryClientProvider"
```

---

### Task 8: Header — useGlobal()

**Files:**
- Modify: `mi_portafolio/src/components/Header.tsx`

- [ ] **Step 1: Replace `src/components/Header.tsx`**

```tsx
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { useGlobal } from '../hooks/useGlobal'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data } = useGlobal()

  const siteTitle = data?.siteTitle ?? 'Mi Portafolio'
  const navItems = data?.navItems ?? []
  const mainItems = navItems.slice(0, -1)
  const lastItem = navItems[navItems.length - 1]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            {siteTitle}
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {mainItems.map((item) => (
              <button
                key={item.targetSectionId}
                onClick={() => scrollToSection(item.targetSectionId)}
                className="hover:text-primary transition-colors underline-offset-2 hover:underline decoration-[1.5px] hover:cursor-pointer"
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
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

- [ ] **Step 2: Verify in browser**

With Strapi running and dev server running: reload `http://localhost:5173`. Expected: nav items ("Sobre mí", "Tecnologías", "Proyectos", "Contacto") and site title ("Mi Portafolio") come from the CMS. Clicking each item scrolls to the correct section.

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Header.tsx
git commit -m "feat(frontend): wire Header to useGlobal() CMS endpoint"
```

---

### Task 9: Hero — useHero()

**Files:**
- Modify: `mi_portafolio/src/components/Hero.tsx`

- [ ] **Step 1: Replace `src/components/Hero.tsx`**

```tsx
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useHero } from '../hooks/useHero'
import { assetUrl } from '../services/api'
import { HeroSkeleton } from './ui/skeleton'
import github from '../assets/github.svg'
import linkedin from '../assets/linkedin.svg'

const SOCIAL_SVG: Record<string, string> = {
  github,
  linkedin,
}

export function Hero() {
  const { data, isLoading, isError } = useHero()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  if (isLoading) return <HeroSkeleton />
  if (isError)
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-10 px-4"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">{data.greeting}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">{data.name}</h1>
              <h2 className="text-2xl md:text-3xl">{data.role}</h2>
            </div>

            <p className="text-lg text-muted-foreground">{data.bio}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() =>
                  scrollToSection(data.primaryCta.targetSectionId)
                }
                size="lg"
                className="hover:scale-105 transition-transform cursor-pointer hover:bg-switch-background"
              >
                {data.primaryCta.label}
              </Button>
              <Button
                onClick={() =>
                  scrollToSection(data.secondaryCta.targetSectionId)
                }
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform cursor-pointer"
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
                    <img
                      src={SOCIAL_SVG[link.platform]}
                      alt={link.label}
                      className="w-12 h-12"
                    />
                  </a>
                ) : null,
              )}
            </div>
          </section>

          <section className="flex justify-center">
            <picture className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
              <ImageWithFallback
                src={data.profileImage ? assetUrl(data.profileImage.url) : ''}
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

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:5173`. Expected: hero section shows name "Gabriel Yépez", role, bio, and profile photo from Strapi uploads. Social links visible and clickable. Skeleton appears briefly if CMS is slow.

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Hero.tsx
git commit -m "feat(frontend): wire Hero to useHero() CMS endpoint"
```

---

### Task 10: About — useAbout()

**Files:**
- Modify: `mi_portafolio/src/components/About.tsx`

- [ ] **Step 1: Replace `src/components/About.tsx`**

```tsx
import { Card, CardContent } from './ui/card'
import { useAbout } from '../hooks/useAbout'
import { ICON_MAP } from '../lib/icons'
import { AboutSkeleton } from './ui/skeleton'

export function About() {
  const { data, isLoading, isError } = useAbout()

  if (isLoading) return <AboutSkeleton />
  if (isError)
    return (
      <section
        id="about"
        className="py-10 px-4 bg-muted/30 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  return (
    <section id="about" className="py-10 px-4 bg-muted/30">
      <div className="container mx-auto">
        <article className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.description}</p>
        </article>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.highlights.map((item, index) => {
            const Icon = ICON_MAP[item.iconName]
            return (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors"
              >
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

- [ ] **Step 2: Verify in browser**

Reload. Expected: "Sobre mí" section shows CMS description and 6 highlight cards with their icons (Code, Lightbulb, Users, BookOpenText, CheckCircle, BookmarkCheck).

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/About.tsx
git commit -m "feat(frontend): wire About to useAbout() CMS endpoint"
```

---

### Task 11: Technologies — useTechnologies()

**Files:**
- Modify: `mi_portafolio/src/components/Technologies.tsx`

- [ ] **Step 1: Replace `src/components/Technologies.tsx`**

Remove all 21 local SVG imports and replace with CMS icon URLs:

```tsx
import { Badge } from './ui/badge'
import { useTechnologies } from '../hooks/useTechnologies'
import { assetUrl } from '../services/api'
import { TechnologiesSkeleton } from './ui/skeleton'

export function Technologies() {
  const { data, isLoading, isError } = useTechnologies()

  if (isLoading) return <TechnologiesSkeleton />
  if (isError)
    return (
      <section
        id="technologies"
        className="py-20 px-4 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que
            trabajo
          </p>
        </section>

        <article className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {data.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3>{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default flex items-center"
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

- [ ] **Step 2: Verify in browser**

Reload. Expected: 4 categories (Frontend, Backend, Bases de Datos, Herramientas) with 21 technologies. Each badge shows the SVG icon loaded from Strapi uploads (`http://localhost:1337/uploads/react.svg` etc).

Open DevTools → Network. Filter by `localhost:1337`. Confirm tech icons are loaded from Strapi, not from the Vite bundle.

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Technologies.tsx
git commit -m "feat(frontend): wire Technologies to useTechnologies(), replace local SVG imports with CMS URLs"
```

---

### Task 12: Projects — useProjects()

**Files:**
- Modify: `mi_portafolio/src/components/Projects.tsx`

- [ ] **Step 1: Replace `src/components/Projects.tsx`**

```tsx
import { ExternalLink, Github } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useProjects } from '../hooks/useProjects'
import { assetUrl } from '../services/api'
import { ProjectsSkeleton } from './ui/skeleton'

export function Projects() {
  const { data, isLoading, isError } = useProjects()

  if (isLoading) return <ProjectsSkeleton />
  if (isError)
    return (
      <section
        id="projects"
        className="py-20 px-4 bg-muted/30 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  return (
    <section id="projects" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Proyectos</h2>
          <p className="text-lg text-muted-foreground">
            Algunos de los proyectos en los que he trabajado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={project.image ? assetUrl(project.image.url) : ''}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <h3>{project.title}</h3>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id} variant="outline">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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

- [ ] **Step 2: Verify in browser**

Reload. Expected: 3 project cards (E-commerce Platform, Task Management App, Weather Dashboard) with technology badges from the CMS. Image slot shows `ImageWithFallback`'s SVG placeholder (project images are null in the seed — this is correct behavior until real images are uploaded).

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Projects.tsx
git commit -m "feat(frontend): wire Projects to useProjects() CMS endpoint"
```

---

### Task 13: Contact — useContact()

**Files:**
- Modify: `mi_portafolio/src/components/Contact.tsx`

- [ ] **Step 1: Replace `src/components/Contact.tsx`**

```tsx
import { Send } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useState } from 'react'
import { useContact } from '../hooks/useContact'
import { ICON_MAP } from '../lib/icons'
import { ContactSkeleton } from './ui/skeleton'

export function Contact() {
  const { data, isLoading, isError } = useContact()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    alert('Mensaje enviado! (Esta es una demostración)')
    setFormData({ name: '', email: '', message: '' })
  }

  if (isLoading) return <ContactSkeleton />
  if (isError)
    return (
      <section
        id="contact"
        className="py-10 px-4 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  return (
    <section id="contact" className="py-10 px-4">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.description}</p>
        </section>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <section>
              <h3 className="mb-4 text-center">Información de contacto</h3>
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
                          <p className="text-sm text-muted-foreground">
                            {item.title}
                          </p>
                          {item.link ? (
                            <a
                              href={item.link}
                              className="hover:text-primary transition-colors"
                            >
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

          {/* Contact Form — unchanged, form submission is out of scope */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer hover:bg-switch-background"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Reload. Expected: Contact section title "Contacto" and description from CMS. Three info cards show Mail, Phone, MapPin icons with values from the CMS. Contact form still works (submit → alert → reset).

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Contact.tsx
git commit -m "feat(frontend): wire Contact to useContact() CMS endpoint"
```

---

### Task 14: Footer — useFooter()

**Files:**
- Modify: `mi_portafolio/src/components/Footer.tsx`

- [ ] **Step 1: Replace `src/components/Footer.tsx`**

```tsx
import { Github, Linkedin, type LucideIcon } from 'lucide-react'
import { useFooter } from '../hooks/useFooter'

const SOCIAL_ICON: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
}

export function Footer() {
  const { data } = useFooter()
  const currentYear = new Date().getFullYear()

  const copyrightName = data?.copyrightName ?? 'Gabriel Yépez'
  const socialLinks = data?.socialLinks ?? []

  return (
    <footer className="bg-muted/30 border-t border-border py-8 px-4">
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

- [ ] **Step 2: Verify in browser**

Reload. Expected: footer shows "© 2026 Gabriel Yépez. Todos los derechos reservados." with GitHub and LinkedIn icons from the CMS social links.

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Footer.tsx
git commit -m "feat(frontend): wire Footer to useFooter() CMS endpoint"
```

---

### Task 15: Full verification + push

- [ ] **Step 1: Ensure Strapi is running**

In `cms-strapi-portafolio/`:
```bash
npm run dev
```
Confirm `http://localhost:1337/api/hero` returns 200.

- [ ] **Step 2: Start Vite dev server**

In `mi_portafolio/`:
```bash
pnpm dev
```

- [ ] **Step 3: Run through the full checklist in the browser**

Open `http://localhost:5173` and verify each item:

| Section | What to check |
|---|---|
| Header | Site title "Mi Portafolio", 4 nav items, scroll works |
| Hero | "Hola, soy" + "Gabriel Yépez", role, bio, profile photo, GitHub + LinkedIn icons |
| About | "Sobre mí" title, description, 6 highlight cards with correct icons |
| Technologies | 4 categories, 21 tech badges each with SVG icon from Strapi |
| Projects | 3 project cards, tech badges, Demo + Código buttons |
| Contact | "Contacto" title, 3 info cards (email, phone, location), form submits |
| Footer | Copyright with name, GitHub + LinkedIn icons |

Open DevTools → Network → filter by `1337`. Confirm all 7 API calls fire and complete with 200.

Open DevTools → Network → filter by `1337` again after a page refresh. Confirm **no additional requests** fire (TanStack cache active — stale time 5 min).

- [ ] **Step 4: Run TypeScript check**

From `mi_portafolio/`:
```bash
pnpm build
```
Expected: no TypeScript errors, build succeeds.

- [ ] **Step 5: Push to GitHub**

```bash
git push origin main
```

---

## Out of scope (future tasks)

- Contact form submission — currently logs to console. Future: integrate Formspree, EmailJS, or a Strapi custom route.
- SEO meta tags — `global.seo.metaTitle` and `global.seo.metaDescription` can be wired to `<title>` and `<meta>` tags via `react-helmet-async` or Vite's `index.html` template.
- Project images — upload real project screenshots in the Strapi admin under Content Manager → Project → image field.
