# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The actual application lives in `mi_portafolio/`, not at the repo root. Run all package/build commands from that subdirectory. The repo root only holds the top-level `README.md` (in Spanish) and `.claude/` settings.

## Commands

`pnpm` is the package manager (see `mi_portafolio/pnpm-lock.yaml`). From `mi_portafolio/`:

- `pnpm dev` — Vite dev server (default http://localhost:5173)
- `pnpm build` — typecheck (`tsc -b`) then build; the TS step will fail on unused locals/params (`noUnusedLocals`/`noUnusedParameters` are on)
- `pnpm lint` — ESLint across `**/*.{ts,tsx}`
- `pnpm preview` — preview the production build

No test runner is configured.

## Architecture

Single-page portfolio. `src/main.tsx` mounts `<App />`, which renders a fixed `Header` followed by a `<main>` containing section components in order: `Hero`, `About`, `Technologies`, `Projects`, `Contact`, then `Footer`.

**Navigation is anchor-scroll based, not routed.** `Header` (and `Hero`) call `document.getElementById(id).scrollIntoView()`. Section components set matching `id` attributes (`hero`, `about`, `technologies`, `projects`, `contact`). When renaming or adding a section, update both the section's `id` and every `scrollToSection` call site.

**Theming lives in `src/styles/globals.css`.** Color tokens are declared as CSS custom properties on `:root` (light) and `.dark` (dark), then exposed to Tailwind v4 utilities through an `@theme inline` block that maps `--color-*` → `var(--*)`. This means `bg-primary`, `text-foreground`, `border-border`, etc. are driven entirely by those variables — change the variable, not component classes, to re-skin. `--input` intentionally aliases `--border` so inputs get a visible border by default.

**Tailwind v4 is integrated via the Vite plugin** (`@tailwindcss/vite`) — there is no `tailwind.config.js`. Global styles and `@theme` configuration go in `globals.css`.

**React Compiler is enabled** through `babel-plugin-react-compiler` in `vite.config.ts`. Don't hand-add `useMemo`/`useCallback`/`React.memo` unless profiling shows the compiler didn't handle it; this also affects dev/build performance.

**UI primitives under `src/components/ui/`** follow a shadcn-style split: the component (`button.tsx`, `badge.tsx`) is separate from its CVA variants file (`button-variants.ts`, `badge-variants.ts`) so React Fast Refresh stays clean. Merge classes with the `cn()` helper in `src/components/ui/utils.ts` (clsx + tailwind-merge). `Button` supports `asChild` via `@radix-ui/react-slot`.

**Images:** `src/components/figma/ImageWithFallback.tsx` wraps `<img>` with an inline SVG fallback on error — use it instead of raw `<img>` when the source could fail. Static assets (tech logos, profile photo) live in `src/assets/` and are imported as ES modules.

## Conventions

- Spanish is the primary UI language (`lang="es"` in `index.html`, copy in components).
- TypeScript is strict with `verbatimModuleSyntax` — type-only imports must use `import type`.
- The `.link-animated` utility class in `globals.css` provides the standard hover/focus animation for links and honors `prefers-reduced-motion`.
