import { Head } from 'vite-react-ssg/single-page'
import { useHero } from '../hooks/useHero'
import { useProjects } from '../hooks/useProjects'
import {
  SITE_URL,
  buildTitle,
  buildDescription,
  buildPersonSchema,
  buildWebSiteSchema,
  buildProjectListSchema,
} from './seo-schemas'

const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export function SEO() {
  const { data: hero } = useHero()
  const { data: projects } = useProjects()

  const title       = buildTitle(hero)
  const description = buildDescription(hero)
  const name        = hero?.name ?? 'Gabriel Yépez'

  const personSchema      = buildPersonSchema(hero)
  const websiteSchema     = buildWebSiteSchema(name)
  const projectListSchema = buildProjectListSchema(projects, name)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* JSON-LD schemas */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      {projectListSchema && (
        <script type="application/ld+json">{JSON.stringify(projectListSchema)}</script>
      )}
    </Head>
  )
}
