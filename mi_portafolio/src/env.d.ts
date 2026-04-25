/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_STRAPI_URL?: string
  readonly VITE_DEV_PORT?: string
  readonly VITE_STRICT_PORT?: string
  readonly VITE_OPEN_BROWSER?: string
  readonly VITE_BUILD_TARGET?: string
  readonly VITE_CSS_MINIFY?: 'esbuild' | 'lightningcss' | 'false'
  readonly VITE_CSS_DEV_SOURCEMAP?: 'true' | 'false'
  readonly PUBLIC_ANALYTICS_KEY?: string
  readonly VITE_CV_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
