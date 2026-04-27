import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { fileURLToPath, URL } from 'node:url'

/// <reference types="vitest" />

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
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        include: ['src/components/seo-schemas.ts'],
        thresholds: { lines: 90, functions: 90, branches: 80 },
      },
    },
  }
})
