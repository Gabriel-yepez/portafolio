# Portfolio Visual Redesign — "Obsidian & Electric"

## Overview

A full visual overhaul of `mi_portafolio` (Vite + React + Tailwind 4) from the current beige/sky-blue light design to a dark-first premium aesthetic inspired by Apple's spatial minimalism and Google Material You's expressive color. No structural or data-fetching changes — all logic, hooks, API calls, and TypeScript types remain untouched.

**Goal:** Make the portfolio feel like a premium SaaS product page (Vercel, Linear, Stripe) — high contrast, purposeful animation, technically polished.

**Approved by user:** 2026-04-23

---

## Design Principles

1. **Dark-first, dark-only.** The beige light mode is removed entirely. One mode done perfectly beats two modes done poorly.
2. **Space is luxury.** Generous padding and whitespace signal confidence.
3. **Purposeful animation.** Every animation serves comprehension or delight — none are gratuitous.
4. **Glass, not flat.** Cards use glassmorphism (`rgba(255,255,255,0.05)` + `backdrop-blur`) instead of opaque white.
5. **Gradient as identity.** The indigo→cyan gradient is the visual signature across the hero name, CTA button, and accent elements.

---

## Color System

All tokens are defined in `globals.css` under `:root` (dark-only, `.dark` class removed).

| CSS Variable | Value | Purpose |
|---|---|---|
| `--background` | `#050A14` | Deep space base |
| `--foreground` | `#F8FAFC` | Primary text / headings |
| `--card` | `rgba(255,255,255,0.05)` | Glass card surface |
| `--card-foreground` | `#F8FAFC` | Text on cards |
| `--primary` | `#6366f1` | Indigo — buttons, active states |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--accent` | `#22d3ee` | Cyan — gradient pair, decorative |
| `--muted` | `rgba(255,255,255,0.04)` | Subtle backgrounds |
| `--muted-foreground` | `#94a3b8` | Body text, captions |
| `--border` | `rgba(255,255,255,0.08)` | Card / input borders |
| `--ring` | `rgba(99,102,241,0.4)` | Focus ring |
| `--radius` | `0.75rem` | Base border radius |

**Gradient tokens (new):**

```css
--gradient-brand: linear-gradient(135deg, #6366f1 0%, #22d3ee 100%);
--gradient-mesh-1: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%);
--gradient-mesh-2: radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.10) 0%, transparent 55%);
--glow-primary: 0 0 40px rgba(99,102,241,0.25);
--glow-accent: 0 0 40px rgba(34,211,238,0.2);
```

---

## Typography

**Font family:** `Inter` (Google Fonts, weights 400/500/600/700/800). Loaded via `@import` in `globals.css`.

| Element | Size | Weight | Color |
|---|---|---|---|
| Hero name | `clamp(3.5rem, 7vw, 5.5rem)` | 800 | Gradient indigo→cyan |
| Hero role | `1.5rem` | 500 | `--muted-foreground` |
| Section heading | `2.5rem` | 700 | `--foreground` |
| Card heading | `1.125rem` | 600 | `--foreground` |
| Body / description | `1rem` | 400 | `--muted-foreground` |
| Badge / caption | `0.8125rem` | 500 | `--muted-foreground` |

---

## Animation System

All scroll-triggered animations use a single `useInView` hook based on `IntersectionObserver` (no library, ~20 lines). **`framer-motion`** is added for staggered card entrance animations where precise control is needed.

| Animation | Mechanism | Duration |
|---|---|---|
| Section fade-in-up | `framer-motion` `AnimatePresence` + `useInView` | 600ms ease-out |
| Card stagger | `framer-motion` `staggerChildren: 0.1` | 400ms |
| Hero gradient mesh | CSS `@keyframes` (infinite) | 8s ease-in-out |
| Photo ring rotation | CSS `@keyframes rotate` (infinite) | 6s linear |
| Card hover lift | CSS `transition: transform 200ms, box-shadow 200ms` | 200ms |
| Nav pill indicator | CSS `transition: all 250ms cubic-bezier(.4,0,.2,1)` | 250ms |

### `useInView` hook (shared)

```ts
// src/hooks/useInView.ts
import { useEffect, useRef, useState } from 'react'
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}
```

---

## Component Specifications

### 1. `globals.css`

**Changes:**
- Remove `.dark` block entirely
- Replace `:root` with dark-only tokens above
- Add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap')` at top
- Add `font-family: 'Inter', sans-serif` to `body`
- Add gradient tokens as CSS custom properties
- Add `.glass` utility class:
  ```css
  .glass {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
  }
  ```
- Add `.gradient-text` utility:
  ```css
  .gradient-text {
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  ```
- Add `@keyframes mesh-drift` for hero background
- Add `@keyframes ring-spin` for photo border
- Add `@keyframes fade-up` for fallback skeleton

---

### 2. `Header.tsx`

**Current:** Full-width bar `bg-background/80 backdrop-blur-sm border-b`

**New:** Floating centered pill `position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%)`

```
┌─────────────────────────────────────────────────┐
│  Mi Portafolio   Sobre mí  Tecnologías  ...  [Contacto]  │
└─────────────────────────────────────────────────┘
```

- Container: `max-w-fit mx-auto px-6 py-3 rounded-full glass shadow-lg`
- Logo: `font-semibold text-foreground`, click scrolls to hero
- Nav links: `text-sm text-muted-foreground hover:text-foreground transition-colors`
- Active link: detects current section via `IntersectionObserver`; active link gets `text-foreground font-medium`
- CTA "Contacto": pill button `bg-primary text-white px-4 py-1.5 rounded-full text-sm`
- Mobile: below `md`, pill becomes full-width bottom-bar with 4 icon-only nav items + hamburger for full menu sliding from bottom

---

### 3. `Hero.tsx`

**Current:** Two-column grid, circular photo, simple text, two buttons.

**New layout:**

```
[Animated gradient mesh background — full viewport]

  Hola, soy
  Gabriel Yepez          ← clamp(3.5rem–5.5rem), weight 800, gradient-text
  Backend Developer       ← 1.5rem, muted-foreground

  [Brief bio — one sentence, slate-400]

  [Ver Proyectos ▶]  [Sobre mí]    ← buttons
  [GitHub icon]  [LinkedIn icon]   ← social links

                 ╭──────────────╮
                 │   [photo]    │  ← circular, 320×320, with animated
                 │              │    gradient ring border (ring-spin)
                 ╰──────────────╯

  ↓ scroll indicator (animated bounce)
```

**Photo ring implementation:**
```css
.photo-ring {
  background: var(--gradient-brand);
  border-radius: 50%;
  padding: 3px;
  animation: ring-spin 6s linear infinite;
}
```

**Primary button:**
- `background: var(--gradient-brand); color: white; border-radius: 9999px; px-8 py-3`
- Hover: `opacity: 0.9; transform: translateY(-2px); box-shadow: var(--glow-primary)`

**Secondary button:** `variant="outline"` glass style: `border border-white/20 text-foreground hover:border-primary/50`

**Gradient mesh background:**
```css
.hero-bg {
  background: var(--background);
  position: relative;
}
.hero-bg::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--gradient-mesh-1), var(--gradient-mesh-2);
  animation: mesh-drift 8s ease-in-out infinite alternate;
  pointer-events: none;
}
```

---

### 4. `About.tsx`

**Current:** Centered text + 3 cards below, muted bg.

**New:** 2-column layout, no muted background, glass cards with glow hover.

```
[Section enters with fade-in-up]

  Sobre mí                     ← left-aligned heading
  ─────────────────────────────

  [Long bio text...]           ┃  ╭──────────────╮
  [Ver CV →]                   ┃  │  🏆 Highlight│  ← glass card
                               ┃  │  title        │    hover: glow-primary
                               ┃  ╰──────────────╯
                                   ╭──────────────╮
                                   │  💻 Highlight│
                                   ╰──────────────╯
                                   ╭──────────────╮
                                   │  🚀 Highlight│
                                   ╰──────────────╯
```

**Highlight cards:** `.glass` class + `hover:border-primary/40 hover:shadow-[var(--glow-primary)] transition-all duration-300`

**Icon container:** `bg-primary/15 rounded-xl p-3` with `text-primary`

**CV Button:** `bg-primary text-white rounded-lg px-6 py-2.5` (no more `bg-black`)

---

### 5. `Technologies.tsx`

**Current:** Badge pills (secondary variant) in a grid.

**New:** Glass chip grid with icon + name, glowing hover, colored category label.

```
  Tecnologías
  ─────────────────────────────────────────────────

  ┌─ Frontend ───────────────────────────────────┐
  │  [⚛ React] [TS TypeScript] [Tailwind] ...   │  ← glass chips
  └──────────────────────────────────────────────┘

  ┌─ Backend ────────────────────────────────────┐
  │  [🐍 Python] [Node.js] [FastAPI] ...         │
  └──────────────────────────────────────────────┘
```

**Chip style:** 
```
.tech-chip {
  @apply glass rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium
         text-foreground transition-all duration-200
         hover:border-primary/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
         hover:text-primary cursor-default;
}
```

**Category label:** `text-xs font-semibold tracking-wider uppercase text-accent mb-3`

---

### 6. `Projects.tsx`

**Current:** 3-col card grid, image on top, description below, outline buttons.

**New:** 2-col grid on desktop, taller cards, gradient image overlay, improved buttons.

```
  Proyectos
  ──────────────────────────────────────

  ╭──────────────────────────╮  ╭──────────────────────────╮
  │  [project image]         │  │  [project image]         │
  │  ────────────────────    │  │                          │
  │  Project Title           │  │  Project Title           │
  │  Description text...     │  │  Description text...     │
  │                          │  │                          │
  │  [React] [Node] [TS]     │  │  [Python] [FastAPI]      │
  │                          │  │                          │
  │  [⬡ Demo]  [</> Código]  │  │  [⬡ Demo]  [</> Código]  │
  ╰──────────────────────────╯  ╰──────────────────────────╯
```

**Card:** `.glass rounded-2xl overflow-hidden flex flex-col` + `hover:translate-y-[-4px] hover:shadow-[var(--glow-primary)] transition-all duration-300`

**Image area:** `h-52 relative overflow-hidden` — image fills completely, with `::after` gradient overlay `from-transparent to-background/60` at bottom edge.

**Tech badges:** `bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-0.5 text-xs`

**Demo button:** `bg-gradient-brand text-white rounded-lg flex-1` (primary gradient)
**Código button:** `glass border-white/10 text-foreground rounded-lg flex-1 hover:border-primary/40`

**Stagger animation:** `framer-motion` with `staggerChildren: 0.1` on the grid container.

---

### 7. `Certifications.tsx`

**Current:** Swiper carousel (horizontal slider) with custom nav buttons. Cards show title, issuer, date badge, description, topic badges, and credential link.

**New:** Keep Swiper carousel structure — restyle cards and nav buttons with glass treatment.

**Card:** `.glass rounded-2xl` — same content structure. Badge `variant="secondary"` → `variant="tech"` for topic badges. Date badge: `bg-accent/10 text-accent border border-accent/20 rounded-full`.

**Nav buttons (prev/next):** 
```
className="inline-flex h-12 w-12 items-center justify-center rounded-full glass
           text-foreground hover:border-primary/40 hover:text-primary transition-all"
```
(Remove `bg-background`, `shadow`; add glass + hover glow)

**Credential button:** `variant="outline"` restyled to `glass border-white/10 hover:border-accent/40 hover:text-accent`

---

### 8. `Contact.tsx`

**Current:** 2-column layout — contact info cards (left) + form card (right). Cards use `Card` component. Form has Name, Email, Message fields and a Send button.

**New:** Keep 2-column layout. Apply glass treatment to all cards. Dark-themed inputs. Gradient submit button. Dark-aware success/error messages.

**Contact info cards:** `.glass rounded-2xl` — icon container `bg-primary/15 rounded-xl`. Links `hover:text-accent`.

**Form card:** `.glass rounded-2xl` — inputs get dark glass style (see Input/Textarea spec above).

**Submit button:** full-width `variant="gradient"` button with `<Send />` icon.

**Success message:** `bg-green-900/20 border border-green-500/30 text-green-400 rounded-xl p-3`

**Error message:** `bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-3`

---

### 9. `Footer.tsx`

**Current:** (existing component)

**New:** Single centered row: `© 2024 Gabriel Yepez · GitHub · LinkedIn`. Muted text, minimal border-top `border-white/06`.

---

### 10. Shared UI Components

**`card.tsx`:** Add `.glass` class by default. Remove `bg-card` in favor of transparent glass.

**`button.tsx`:** Add `gradient` variant:
```ts
gradient: 'bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-white hover:opacity-90 shadow-lg shadow-primary/25'
```

**`badge.tsx`:** Add `tech` variant:
```ts
tech: 'bg-primary/10 text-primary border border-primary/20 rounded-full'
```

**`input.tsx` / `textarea.tsx`:** Dark glass style: `bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-primary/20`

---

## New Files

| File | Purpose |
|---|---|
| `src/hooks/useInView.ts` | Shared IntersectionObserver hook for scroll animations |
| `src/components/ui/MotionSection.tsx` | Wraps `framer-motion` `motion.section` with standard fade-in-up defaults |

## Modified Files

| File | Changes |
|---|---|
| `src/styles/globals.css` | Full token replacement, font import, utility classes, keyframes |
| `src/components/Header.tsx` | Floating pill nav, active section detection |
| `src/components/Hero.tsx` | Gradient mesh bg, gradient text name, animated photo ring, new button styles |
| `src/components/About.tsx` | 2-col layout, glass cards, gradient CV button |
| `src/components/Technologies.tsx` | Glass chips, accent category labels |
| `src/components/Projects.tsx` | 2-col cards, gradient overlay, tech badge + button restyle |
| `src/components/Certifications.tsx` | Glass card grid |
| `src/components/Contact.tsx` | Centered glass card, glow blob, dark inputs |
| `src/components/Footer.tsx` | Minimal one-row footer |
| `src/components/ui/card.tsx` | Glass default style |
| `src/components/ui/button.tsx` | `gradient` variant |
| `src/components/ui/badge.tsx` | `tech` variant |
| `src/components/ui/input.tsx` | Dark glass style |
| `src/components/ui/textarea.tsx` | Dark glass style |

## New Dependencies

| Package | Reason |
|---|---|
| `framer-motion` | Staggered card entrance animations, section fade-in-up |

---

## What Does NOT Change

- `src/services/api.ts` — all API calls
- `src/hooks/use*.ts` (except new `useInView`) — all data hooks
- `src/types/cms.ts` — all TypeScript types
- `src/util/*.ts` — all utility functions
- `src/lib/queryClient.ts`, `src/lib/icons.ts`
- `src/App.tsx` — section order, lazy loading, Suspense wrappers
- `src/validation/validationForm.ts`
- `src/services/emailServices.ts`
- CMS / Strapi — no backend changes

---

## Acceptance Criteria

- [ ] All 7 sections render correctly on desktop (1280px+) and mobile (375px)
- [ ] Hero name displays as indigo→cyan gradient text
- [ ] Header floating pill is visible and functional; hides behind glass on scroll
- [ ] All cards use glassmorphism style (no opaque white)
- [ ] Scroll-triggered fade-in-up plays once per section on first viewport entry
- [ ] Photo ring animation runs without jank
- [ ] Hero gradient mesh animation runs at 60fps (uses `will-change: transform`)
- [ ] All existing links, buttons, and form interactions still work
- [ ] `prefers-reduced-motion` disables all animations gracefully
- [ ] TypeScript compiles without errors (`pnpm build`)
