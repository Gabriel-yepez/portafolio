import { Head } from 'vite-react-ssg/single-page'
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
    <Head>
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
    </Head>
  )
}
