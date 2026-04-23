# Portfolio Visual Redesign — "Obsidian & Electric" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `mi_portafolio` from beige/sky-blue to a dark-first premium aesthetic (deep space background, indigo→cyan gradient identity, glassmorphism cards, Inter typography, framer-motion animations) without touching any data-fetching logic.

**Architecture:** Pure styling overhaul — replace CSS tokens in `globals.css`, restyle all 8 section components and shared UI primitives, add `framer-motion` for scroll-triggered and stagger animations. All hooks, types, services, and API calls are untouched.

**Tech Stack:** React 19, Tailwind 4, framer-motion v11, Inter (Google Fonts), Vite, pnpm

---

## File Map

**Create:**
- `mi_portafolio/src/hooks/useInView.ts` — IntersectionObserver hook (one-time fire, disconnect after trigger)
- `mi_portafolio/src/components/ui/MotionSection.tsx` — `motion.section` wrapper with fade-in-up defaults

**Modify:**
- `mi_portafolio/src/styles/globals.css` — full token replacement, font import, utility classes, keyframes
- `mi_portafolio/src/components/ui/card.tsx` — glass background + rounded-2xl
- `mi_portafolio/src/components/ui/button-variants.ts` — add `gradient` variant, clean `dark:` prefixes
- `mi_portafolio/src/components/ui/badge-variants.ts` — add `tech` variant
- `mi_portafolio/src/components/ui/input.tsx` — dark glass style
- `mi_portafolio/src/components/ui/textarea.tsx` — dark glass style
- `mi_portafolio/src/components/Header.tsx` — floating centered pill nav
- `mi_portafolio/src/components/Hero.tsx` — gradient mesh bg, gradient text name, animated photo ring
- `mi_portafolio/src/components/About.tsx` — 2-col layout, glass cards, gradient CV button
- `mi_portafolio/src/components/Technologies.tsx` — glass chips, accent category labels
- `mi_portafolio/src/components/Projects.tsx` — 2-col glass cards, image overlay, stagger animation
- `mi_portafolio/src/components/Certifications.tsx` — glass Swiper cards + glass nav buttons
- `mi_portafolio/src/components/Contact.tsx` — glass cards, dark inputs, gradient submit, dark alerts
- `mi_portafolio/src/components/Footer.tsx` — minimal single-row footer

---

## Task 1: Install framer-motion and create animation utilities

**Files:**
- Create: `mi_portafolio/src/hooks/useInView.ts`
- Create: `mi_portafolio/src/components/ui/MotionSection.tsx`

- [ ] **Step 1: Install framer-motion**

```bash
cd mi_portafolio && pnpm add framer-motion
```

Expected: framer-motion added to `package.json` dependencies, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Create `src/hooks/useInView.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}
```

- [ ] **Step 3: Create `src/components/ui/MotionSection.tsx`**

```tsx
import { motion } from 'framer-motion'
import type React from 'react'
import { useInView } from '../../hooks/useInView'

interface MotionSectionProps extends React.ComponentProps<'section'> {
  delay?: number
}

export function MotionSection({ children, delay = 0, className, ...props }: MotionSectionProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd mi_portafolio && pnpm build 2>&1 | tail -20
```

Expected: no TypeScript errors related to the two new files.

- [ ] **Step 5: Commit**

```bash
git add mi_portafolio/src/hooks/useInView.ts mi_portafolio/src/components/ui/MotionSection.tsx mi_portafolio/package.json mi_portafolio/pnpm-lock.yaml
git commit -m "feat(design): add framer-motion + useInView hook + MotionSection wrapper"
```

---

## Task 2: Replace design tokens in globals.css

**Files:**
- Modify: `mi_portafolio/src/styles/globals.css`

This is the foundation. Everything else builds on these tokens.

- [ ] **Step 1: Replace the full contents of `src/styles/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #050A14;
  --foreground: #F8FAFC;
  --card: rgba(255, 255, 255, 0.05);
  --card-foreground: #F8FAFC;
  --popover: rgba(255, 255, 255, 0.06);
  --popover-foreground: #F8FAFC;
  --primary: #6366f1;
  --primary-foreground: #ffffff;
  --secondary: #22d3ee;
  --secondary-foreground: #050A14;
  --muted: rgba(255, 255, 255, 0.04);
  --muted-foreground: #94a3b8;
  --accent: #22d3ee;
  --accent-foreground: #050A14;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.05);
  --input-background: rgba(255, 255, 255, 0.05);
  --ring: rgba(99, 102, 241, 0.4);
  --radius: 0.75rem;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --gradient-brand: linear-gradient(135deg, #6366f1 0%, #22d3ee 100%);
  --gradient-mesh-1: radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%);
  --gradient-mesh-2: radial-gradient(ellipse at 80% 20%, rgba(34, 211, 238, 0.10) 0%, transparent 55%);
  --glow-primary: 0 0 40px rgba(99, 102, 241, 0.25);
  --glow-accent: 0 0 40px rgba(34, 211, 238, 0.2);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }
}

/* ── Utility classes ─────────────────────────────────── */

.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gradient-text {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tech-chip {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 200ms, box-shadow 200ms, color 200ms;
  cursor: default;
}

.tech-chip:hover {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  color: var(--primary);
}

/* Hero gradient mesh background */
.hero-bg {
  position: relative;
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-mesh-1), var(--gradient-mesh-2);
  animation: mesh-drift 8s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}

.defer-section {
  content-visibility: auto;
  contain-intrinsic-size: 600px;
}

/* Link animation */
.link-animated {
  display: inline-block;
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: transform 260ms cubic-bezier(.2, .8, .2, 1),
    color 200ms ease,
    box-shadow 260ms cubic-bezier(.2, .8, .2, 1),
    opacity 150ms ease;
  will-change: transform, box-shadow, opacity;
}

.link-animated:hover,
.link-animated:focus {
  transform: translateY(-3px);
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.2);
  opacity: 0.98;
}

.link-animated:active {
  transform: translateY(-1px);
}

/* ── Keyframes ───────────────────────────────────────── */

@keyframes mesh-drift {
  from { transform: scale(1) translateX(0); }
  to   { transform: scale(1.05) translateX(2%); }
}

@keyframes ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Base typography ─────────────────────────────────── */
@layer base {
  :where(:not(:has([class*=" text-"]), :not(:has([class^="text-"])))) {
    h1 {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h4 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    p {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
    }

    label {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    button {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    input {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
    }
  }
}

html {
  font-size: var(--font-size);
}

/* ── Reduced motion ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .link-animated {
    transition: none !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .hero-bg::before {
    animation: none !important;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Start dev server and verify**

```bash
cd mi_portafolio && pnpm dev
```

Open http://localhost:5173. Check:
- Background is `#050A14` (near-black, not beige)
- Body font is Inter (check in browser DevTools → Computed → font-family)
- No console errors

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/styles/globals.css
git commit -m "feat(design): replace design tokens with Obsidian & Electric dark system"
```

---

## Task 3: Update shared UI components

**Files:**
- Modify: `mi_portafolio/src/components/ui/card.tsx`
- Modify: `mi_portafolio/src/components/ui/button-variants.ts`
- Modify: `mi_portafolio/src/components/ui/badge-variants.ts`
- Modify: `mi_portafolio/src/components/ui/input.tsx`
- Modify: `mi_portafolio/src/components/ui/textarea.tsx`

- [ ] **Step 1: Update `src/components/ui/card.tsx`**

Replace the `Card` function's className string only. Keep all other functions identical.

```tsx
import * as React from "react";
import { cn } from "./utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "glass text-card-foreground flex flex-col gap-6 rounded-2xl",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
```

- [ ] **Step 2: Update `src/components/ui/button-variants.ts`**

Add the `gradient` variant. Remove all `dark:` prefixes (we're dark-only now).

```ts
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        gradient:
          "bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-white hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-white/20 bg-transparent text-foreground hover:border-primary/50 hover:text-primary",
        secondary:
          "bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20",
        ghost:
          "hover:bg-white/10 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants };
```

- [ ] **Step 3: Update `src/components/ui/badge-variants.ts`**

Add the `tech` variant.

```ts
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-white/10 bg-white/8 text-muted-foreground [a&]:hover:bg-white/15",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border-white/15 text-muted-foreground [a&]:hover:border-primary/40 [a&]:hover:text-primary",
        tech:
          "border-primary/20 bg-primary/10 text-primary rounded-full [a&]:hover:bg-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export { badgeVariants };
```

- [ ] **Step 4: Update `src/components/ui/input.tsx`**

```tsx
import * as React from "react";
import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none",
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
```

- [ ] **Step 5: Update `src/components/ui/textarea.tsx`**

```tsx
import * as React from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none flex field-sizing-content min-h-16 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none",
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
```

- [ ] **Step 6: Verify no TypeScript errors**

```bash
cd mi_portafolio && pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add mi_portafolio/src/components/ui/card.tsx \
        mi_portafolio/src/components/ui/button-variants.ts \
        mi_portafolio/src/components/ui/badge-variants.ts \
        mi_portafolio/src/components/ui/input.tsx \
        mi_portafolio/src/components/ui/textarea.tsx
git commit -m "feat(design): restyle shared UI components — glass card, gradient button, tech badge, dark inputs"
```

---

## Task 4: Restyle Header — floating pill nav

**Files:**
- Modify: `mi_portafolio/src/components/Header.tsx`

- [ ] **Step 1: Replace `src/components/Header.tsx`**

```tsx
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "about", label: "Sobre mí" },
  { id: "technologies", label: "Tecnologías" },
  { id: "projects", label: "Proyectos" },
  { id: "certifications", label: "Certificaciones" },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = ["hero", "about", "technologies", "projects", "certifications", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating pill — desktop */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav className="glass rounded-full px-6 py-3 flex items-center gap-6 shadow-xl shadow-black/30">
          <button
            onClick={() => scrollTo("hero")}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Mi Portafolio
          </button>

          <div className="flex items-center gap-5">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm transition-colors cursor-pointer ${
                  activeSection === id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("contact")}
            className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Contacto
          </button>
        </nav>
      </header>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden glass border-b border-white/8">
        <nav className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => scrollTo("hero")}
            className="text-sm font-semibold text-foreground cursor-pointer"
          >
            Mi Portafolio
          </button>
          <button
            className="text-foreground cursor-pointer"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="flex flex-col gap-1 px-4 pb-4">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="mt-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer text-center"
            >
              Contacto
            </button>
          </div>
        )}
      </header>
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:5173. Check:
- Desktop: a floating pill nav is visible centered at the top — it should be narrow (not full-width), with glass background
- Mobile (resize to 375px): a full-width glass header bar with hamburger icon
- Clicking nav items scrolls to the correct section
- Active section link is slightly brighter than inactive links

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Header.tsx
git commit -m "feat(design): floating pill nav with active section detection"
```

---

## Task 5: Restyle Hero section

**Files:**
- Modify: `mi_portafolio/src/components/Hero.tsx`

- [ ] **Step 1: Replace `src/components/Hero.tsx`**

```tsx
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useHero } from "../hooks/useHero";
import { assetUrl } from "../services/api";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";

const SOCIAL_SVG: Record<string, string> = { github, linkedin };

export function Hero() {
  const { data, isLoading, isError } = useHero();

  useEffect(() => {
    if (!data?.profileImage?.url) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = assetUrl(data.profileImage.url);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [data?.profileImage?.url]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (isLoading)
    return (
      <section id="hero" className="hero-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </section>
    );

  if (isError || !data)
    return (
      <section id="hero" className="hero-bg min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    );

  return (
    <section id="hero" className="hero-bg min-h-screen flex items-center justify-center pt-24 md:pt-8 px-4">
      {/* All content must be relative + z-10 to sit above the ::before mesh */}
      <div className="relative z-10 container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text column */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-muted-foreground text-lg">{data.greeting}</p>
              <h1
                className="gradient-text font-extrabold leading-tight"
                style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              >
                {data.name}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">{data.role}</p>
            </div>

            <p className="text-lg text-muted-foreground max-w-md">{data.bio}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollTo(data.primaryCta.targetSectionId)}
                variant="gradient"
                size="lg"
                className="rounded-full cursor-pointer hover:scale-105 transition-transform"
              >
                {data.primaryCta.label}
              </Button>
              <Button
                onClick={() => scrollTo(data.secondaryCta.targetSectionId)}
                variant="outline"
                size="lg"
                className="rounded-full cursor-pointer"
              >
                {data.secondaryCta.label}
              </Button>
            </div>

            <div className="flex gap-4 pt-2">
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
                    <img src={SOCIAL_SVG[link.platform]} alt={link.label} className="w-10 h-10 opacity-80 hover:opacity-100 transition-opacity" />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Photo column */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Animated gradient ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-4px",
                  background: "conic-gradient(from 0deg, #6366f1, #22d3ee, #6366f1)",
                  animation: "ring-spin 6s linear infinite",
                }}
              />
              {/* Photo on top */}
              <picture className="absolute inset-0 rounded-full overflow-hidden">
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
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground animate-bounce z-10">
        <span className="text-xs tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:5173. Check:
- Background has subtle indigo/cyan colored blobs (the gradient mesh)
- Hero name is a visible indigo→cyan gradient (not white, not black)
- Photo has a spinning gradient ring around it
- "Scroll" bounce indicator is at the bottom of the viewport
- Primary button is gradient (indigo→cyan), secondary button is outlined with white border

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Hero.tsx
git commit -m "feat(design): hero — gradient mesh bg, gradient text name, animated photo ring"
```

---

## Task 6: Restyle About section

**Files:**
- Modify: `mi_portafolio/src/components/About.tsx`

- [ ] **Step 1: Replace `src/components/About.tsx`**

```tsx
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useAbout } from "../hooks/useAbout";
import { ICON_MAP } from "../lib/icons";
import { MotionSection } from "./ui/MotionSection";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.12 },
  }),
};

export function About() {
  const { data, isError } = useAbout();

  if (isError || !data) return null;

  const cvUrl = data.cvUrl ?? import.meta.env.VITE_CV_URL ?? "/cv.pdf";

  return (
    <MotionSection id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

          {/* Left: text + CV button */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">{data.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Ve mi Curriculum sin compromiso</span>
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="w-fit rounded-full cursor-pointer"
              >
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  Ver CV
                </a>
              </Button>
            </div>
          </div>

          {/* Right: highlight cards */}
          <div className="flex flex-col gap-4">
            {data.highlights.map((item, i) => {
              const Icon = ICON_MAP[item.iconName];
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="hover:border-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300">
                    <CardContent className="pt-6 flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to the About section. Check:
- Section fades in from below when it enters the viewport
- Layout is 2 columns on desktop: text left, stacked cards right
- Cards have glass appearance (semi-transparent, blurred backdrop)
- Cards glow subtly on hover
- "Ver CV" button has the gradient style

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/About.tsx
git commit -m "feat(design): about — 2-col layout, staggered glass highlight cards, gradient CV button"
```

---

## Task 7: Restyle Technologies section

**Files:**
- Modify: `mi_portafolio/src/components/Technologies.tsx`

- [ ] **Step 1: Replace `src/components/Technologies.tsx`**

```tsx
import { useTechnologies } from "../hooks/useTechnologies";
import { assetUrl } from "../services/api";
import { MotionSection } from "./ui/MotionSection";

export function Technologies() {
  const { data, isError } = useTechnologies();

  if (isError || !data) return null;

  return (
    <MotionSection id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {data.map((category) => (
            <div key={category.id} className="space-y-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-accent">
                {category.title}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {category.technologies.map((tech) => (
                  <div key={tech.id} className="tech-chip">
                    {tech.icon && (
                      <img
                        src={assetUrl(tech.icon.url)}
                        alt={tech.name}
                        className="w-5 h-5 object-contain flex-shrink-0"
                      />
                    )}
                    <span className="truncate">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Technologies. Check:
- Category labels are cyan (`#22d3ee`) with uppercase tracking
- Tech chips have glass appearance (dark, blurred, subtle border)
- Chips glow indigo on hover
- Section animates in from below

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Technologies.tsx
git commit -m "feat(design): technologies — glass chips with cyan category labels"
```

---

## Task 8: Restyle Projects section

**Files:**
- Modify: `mi_portafolio/src/components/Projects.tsx`

- [ ] **Step 1: Replace `src/components/Projects.tsx`**

```tsx
import { ExternalLink, Github } from "lucide-react";
import { CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useProjects } from "../hooks/useProjects";
import { assetUrl } from "../services/api";
import { useInView } from "../hooks/useInView";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function Projects() {
  const { data, isError } = useProjects();
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  if (isError || !data) return null;

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Proyectos</h2>
          <p className="text-xl text-muted-foreground">
            Algunos de los proyectos en los que he trabajado
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {data.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              className="glass rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-52 overflow-hidden bg-white/5">
                <ImageWithFallback
                  src={project.image ? assetUrl(project.image.url) : ""}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050A14]/80 to-transparent pointer-events-none" />
              </div>

              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id} variant="tech">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-0">
                <Button variant="gradient" size="sm" className="flex-1 rounded-lg" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-lg" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    Código
                  </a>
                </Button>
              </CardFooter>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Projects. Check:
- Cards are 2 columns on desktop
- Cards stagger in one by one when scrolled into view
- Tech badges are indigo tinted (bg-primary/10 border-primary/20)
- "Demo" button has gradient, "Código" button has outline style
- Cards lift slightly and glow on hover

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Projects.tsx
git commit -m "feat(design): projects — 2-col glass cards, framer-motion stagger, gradient overlay"
```

---

## Task 9: Restyle Certifications section

**Files:**
- Modify: `mi_portafolio/src/components/Certifications.tsx`

- [ ] **Step 1: Replace `src/components/Certifications.tsx`**

```tsx
import { useId } from "react";
import { ExternalLink, MoveLeft, MoveRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCertifications } from "../hooks/useCertifications";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CardContent, CardFooter, CardHeader } from "./ui/card";
import { MotionSection } from "./ui/MotionSection";

export function Certifications() {
  const prevButtonId = useId();
  const nextButtonId = useId();
  const { data, isError } = useCertifications();

  if (isError || !data) return null;

  return (
    <MotionSection id="certifications" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Certificaciones</h2>
          <p className="text-xl text-muted-foreground">
            Reconocimientos que avalan mi formación continua y habilidades técnicas
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation={{ prevEl: `#${prevButtonId}`, nextEl: `#${nextButtonId}` }}
          autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
          spaceBetween={32}
          slidesPerView={1}
          loop
          centeredSlides
          grabCursor
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== "boolean") {
              nav.prevEl = `#${prevButtonId}`;
              nav.nextEl = `#${nextButtonId}`;
            }
          }}
          className="pb-16 rounded-2xl"
        >
          {data.map((cert) => (
            <SwiperSlide key={`${cert.title}-${cert.issuer}`} className="h-full">
              {/* Glass card manually (not using Card component to avoid double-glass) */}
              <div className="glass rounded-2xl h-full flex flex-col">
                <CardHeader>
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-lg font-semibold text-foreground">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <span className="inline-flex w-fit mt-2 rounded-full border border-accent/20 bg-accent/10 text-accent text-xs font-medium px-3 py-0.5">
                    {cert.issueDate}
                  </span>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(cert.topics ?? []).map((topic) => (
                      <Badge key={topic} variant="tech">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
                  {cert.credentialId && (
                    <span className="text-xs text-muted-foreground">
                      ID: <span className="font-semibold text-foreground">{cert.credentialId}</span>
                    </span>
                  )}
                  <Button variant="outline" size="sm" asChild className="rounded-lg">
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Ver credencial
                    </a>
                  </Button>
                </CardFooter>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nav buttons */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            id={prevButtonId}
            aria-label="Ver certificación anterior"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <MoveLeft className="h-5 w-5" />
          </button>
          <button
            id={nextButtonId}
            aria-label="Ver certificación siguiente"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <MoveRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </MotionSection>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Certifications. Check:
- Cards inside the Swiper have glass appearance
- Date badge is cyan tinted
- Topic badges are indigo tinted
- Nav buttons are circular glass chips
- Auto-play carousel works; pause on hover works

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Certifications.tsx
git commit -m "feat(design): certifications — glass Swiper cards, cyan date badge, glass nav buttons"
```

---

## Task 10: Restyle Contact section

**Files:**
- Modify: `mi_portafolio/src/components/Contact.tsx`

- [ ] **Step 1: Replace `src/components/Contact.tsx`**

```tsx
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";
import { sendEmail } from "../services/emailServices";
import { type ContactFormErrors, validateContactForm } from "../validation/validationForm";
import { useContact } from "../hooks/useContact";
import { ICON_MAP } from "../lib/icons";
import { MotionSection } from "./ui/MotionSection";

export function Contact() {
  const { data, isError } = useContact();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    const result = validateContactForm(formData);
    if (!result.isValid) {
      setFormErrors(result.errors);
      setErrorMessage("Por favor corrige los errores del formulario.");
      return;
    }
    setFormErrors({});
    sendEmail(e.currentTarget, setIsSending, setFormData)
      .then(() => setSuccessMessage("Mensaje enviado correctamente. Gracias!"))
      .catch((err) => {
        setErrorMessage("Error enviando el mensaje. Intenta nuevamente más tarde.");
        console.error(err);
      });
  };

  if (isError || !data) return null;

  return (
    <MotionSection id="contact" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.description}</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Información de contacto</h3>
              <p className="text-sm text-muted-foreground">
                No dudes en contactarme a través de cualquiera de estos medios.
                Respondo lo más rápido posible.
              </p>
            </div>
            <div className="space-y-3">
              {data.infoItems.map((item, index) => {
                const Icon = ICON_MAP[item.iconName];
                return (
                  <Card key={index}>
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{item.title}</p>
                          {item.link ? (
                            <a href={item.link} className="text-sm text-foreground hover:text-accent transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm text-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }));
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                    }}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }));
                      if (formErrors.email) setFormErrors((p) => ({ ...p, email: undefined }));
                    }}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, message: e.target.value }));
                      if (formErrors.message) setFormErrors((p) => ({ ...p, message: undefined }));
                    }}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isSending}
                  className="w-full rounded-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>

              {successMessage && (
                <div className="mt-4 rounded-xl bg-green-900/20 border border-green-500/30 p-3 text-green-400 text-sm">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mt-4 rounded-xl bg-red-900/20 border border-red-500/30 p-3 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MotionSection>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Contact. Check:
- Info cards on the left have glass appearance
- Form card on the right has glass appearance
- Input fields have dark glass style (dark bg, subtle border, indigo focus ring)
- Submit button is gradient
- Success/error messages are dark-themed (not the previous light green/red backgrounds)

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Contact.tsx
git commit -m "feat(design): contact — glass 2-col layout, dark inputs, gradient submit, dark alerts"
```

---

## Task 11: Restyle Footer

**Files:**
- Modify: `mi_portafolio/src/components/Footer.tsx`

- [ ] **Step 1: Replace `src/components/Footer.tsx`**

```tsx
import { Github, Linkedin } from "lucide-react";
import { useFooter } from "../hooks/useFooter";

const SOCIAL_ICON: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
};

export function Footer() {
  const { data } = useFooter();
  const year = new Date().getFullYear();
  const name = data?.copyrightName ?? "Gabriel Yépez";
  const links = data?.socialLinks ?? [];

  return (
    <footer className="border-t border-white/6 py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {year} {name}. Todos los derechos reservados.
        </p>

        <div className="flex gap-5">
          {links.map((link) => {
            const Icon = SOCIAL_ICON[link.platform];
            if (!Icon) return null;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to the bottom. Check:
- Footer is a single minimal row
- Top border is a very subtle white line
- Social icons glow indigo on hover
- No bulky background — blends with the dark page

- [ ] **Step 3: Commit**

```bash
git add mi_portafolio/src/components/Footer.tsx
git commit -m "feat(design): footer — minimal single-row with subtle border"
```

---

## Task 12: Final polish and build check

**Files:**
- No new files — verify and fix any remaining issues

- [ ] **Step 1: Full visual review — desktop**

With `pnpm dev` running, open http://localhost:5173 in a browser at 1280px width. Scroll through all sections and confirm:
- [ ] Background is deep space (`#050A14`) throughout
- [ ] Hero gradient mesh is visible and animating
- [ ] Hero name is gradient text (indigo→cyan)
- [ ] Photo has spinning gradient ring
- [ ] Floating pill header visible at top center
- [ ] All section cards use glass style (no opaque white cards)
- [ ] Technologies chips glow on hover
- [ ] Projects cards stagger in on scroll
- [ ] Certifications Swiper works with glass nav buttons
- [ ] Contact form submits (test with dummy data — expected: EmailJS error or success depending on env)
- [ ] Footer is minimal single row

- [ ] **Step 2: Full visual review — mobile**

Resize browser to 375px width. Confirm:
- [ ] Mobile header bar replaces floating pill
- [ ] Hamburger menu opens correctly
- [ ] All sections stack to single column
- [ ] Hero photo ring is sized correctly (256px)
- [ ] Font sizes are readable

- [ ] **Step 3: Production build check**

```bash
cd mi_portafolio && pnpm build 2>&1
```

Expected: build succeeds with no TypeScript errors. If errors appear, fix them before proceeding.

Common fix for unused React import: if `Footer.tsx` or another file has `React.ElementType` without importing React, add `import type React from 'react'` at the top.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(design): complete Obsidian & Electric visual redesign — dark premium portfolio"
```

---

## Self-Review

**Spec coverage:**
- ✅ Color tokens (Task 2) — all `:root` vars replaced
- ✅ Typography Inter font (Task 2) — `@import` + `font-family` on body
- ✅ `.glass` utility (Task 2) — defined globally
- ✅ `.gradient-text` utility (Task 2) — defined globally
- ✅ `.tech-chip` utility (Task 2) — defined globally
- ✅ `@keyframes mesh-drift` (Task 2)
- ✅ `@keyframes ring-spin` (Task 2)
- ✅ `prefers-reduced-motion` (Task 2)
- ✅ `useInView` hook (Task 1)
- ✅ `MotionSection` component (Task 1)
- ✅ Card glass style (Task 3)
- ✅ Button `gradient` variant (Task 3)
- ✅ Badge `tech` variant (Task 3)
- ✅ Input dark glass (Task 3)
- ✅ Textarea dark glass (Task 3)
- ✅ Header floating pill (Task 4)
- ✅ Hero gradient mesh + gradient name + ring + scroll indicator (Task 5)
- ✅ About 2-col + glass cards + gradient CV (Task 6)
- ✅ Technologies glass chips + cyan labels (Task 7)
- ✅ Projects 2-col + stagger + image overlay + tech badges (Task 8)
- ✅ Certifications glass Swiper + glass nav + cyan date badge (Task 9)
- ✅ Contact glass 2-col + dark inputs + gradient submit + dark alerts (Task 10)
- ✅ Footer minimal (Task 11)

**No placeholders found.**

**Type consistency:**
- `useInView<T>` generic defined in Task 1, used correctly in Tasks 6, 7, 8, 9, 10, 11
- `MotionSection` defined in Task 1, imported and used in Tasks 6, 7, 9, 10
- `variant="gradient"` defined in Task 3, used in Tasks 5, 6, 8, 10
- `variant="tech"` defined in Task 3, used in Tasks 8, 9
