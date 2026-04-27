import type { Hero, Project } from '../types/cms'

export const SITE_URL = 'https://gabrielportafoliodev.netlify.app'

const FALLBACK_NAME = 'Gabriel Yépez'
const FALLBACK_ROLE = 'Desarrollador Full Stack'
const FALLBACK_DESC =
  'Portafolio de Gabriel Yépez, desarrollador de software especializado en frontend y backend con React, TypeScript y Node.js.'

export function buildTitle(hero: Hero | undefined): string {
  const name = hero?.name ?? FALLBACK_NAME
  const role = hero?.role ?? FALLBACK_ROLE
  return `${name} — ${role}`
}

export function buildDescription(hero: Hero | undefined): string {
  return hero?.bio ?? FALLBACK_DESC
}

export function buildPersonSchema(hero: Hero | undefined) {
  const name = hero?.name ?? FALLBACK_NAME
  const role = hero?.role ?? FALLBACK_ROLE
  const github  = hero?.socialLinks.find((l) => l.platform === 'github')?.url  ?? ''
  const linkedin = hero?.socialLinks.find((l) => l.platform === 'linkedin')?.url ?? ''

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    url: SITE_URL,
    email: 'gabrielyepez04@gmail.com',
    sameAs: [github, linkedin].filter(Boolean),
  }
}

export function buildWebSiteSchema(name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `Portafolio ${name}`,
    url: SITE_URL,
  }
}

export function buildProjectListSchema(
  projects: Project[] | undefined,
  ownerName: string,
) {
  if (!projects?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Proyectos de ${ownerName}`,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: p.liveUrl,
    })),
  }
}
