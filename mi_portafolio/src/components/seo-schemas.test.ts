import { describe, it, expect } from 'vitest'
import {
  buildTitle,
  buildDescription,
  buildPersonSchema,
  buildWebSiteSchema,
  buildProjectListSchema,
  SITE_URL,
} from './seo-schemas'
import type { Hero, Project } from '../types/cms'

const mockHero: Hero = {
  greeting: 'Hola, soy',
  name: 'Gabriel Yépez',
  role: 'Desarrollador Full Stack',
  bio: 'Desarrollador de software especializado en React y Node.js.',
  profileImage: null,
  primaryCta: { label: 'Ver proyectos', targetSectionId: 'projects', variant: 'gradient' },
  secondaryCta: { label: 'Contactar', targetSectionId: 'contact', variant: 'outline' },
  socialLinks: [
    { platform: 'github',   url: 'https://github.com/gabriel',       label: 'GitHub' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/gabriel',   label: 'LinkedIn' },
  ],
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Proyecto Alpha',
    slug: 'proyecto-alpha',
    description: 'Una aplicación web',
    liveUrl: 'https://alpha.example.com',
    githubUrl: 'https://github.com/gabriel/alpha',
    order: 1,
    featured: true,
    image: null,
    technologies: [],
  },
  {
    id: 2,
    title: 'Proyecto Beta',
    slug: 'proyecto-beta',
    description: 'Otra aplicación',
    liveUrl: 'https://beta.example.com',
    githubUrl: 'https://github.com/gabriel/beta',
    order: 2,
    featured: false,
    image: null,
    technologies: [],
  },
]

// ─────────────────────────────────────────────
// buildTitle
// ─────────────────────────────────────────────
describe('buildTitle', () => {
  it('builds title from hero name and role', () => {
    expect(buildTitle(mockHero)).toBe('Gabriel Yépez — Desarrollador Full Stack')
  })

  it('returns fallback title when hero is undefined', () => {
    const title = buildTitle(undefined)
    expect(title).toMatch(/Gabriel Yépez/)
    expect(title).toMatch(/Desarrollador Full Stack/)
  })
})

// ─────────────────────────────────────────────
// buildDescription
// ─────────────────────────────────────────────
describe('buildDescription', () => {
  it('returns hero bio as description', () => {
    expect(buildDescription(mockHero)).toBe(mockHero.bio)
  })

  it('returns non-empty fallback when hero is undefined', () => {
    const desc = buildDescription(undefined)
    expect(desc.length).toBeGreaterThan(10)
  })
})

// ─────────────────────────────────────────────
// buildPersonSchema
// ─────────────────────────────────────────────
describe('buildPersonSchema', () => {
  it('has correct @context and @type', () => {
    const schema = buildPersonSchema(mockHero)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Person')
  })

  it('includes name and jobTitle from hero', () => {
    const schema = buildPersonSchema(mockHero)
    expect(schema.name).toBe('Gabriel Yépez')
    expect(schema.jobTitle).toBe('Desarrollador Full Stack')
  })

  it('sets portfolio URL', () => {
    const schema = buildPersonSchema(mockHero)
    expect(schema.url).toBe(SITE_URL)
  })

  it('includes github and linkedin in sameAs', () => {
    const schema = buildPersonSchema(mockHero)
    expect(schema.sameAs).toContain('https://github.com/gabriel')
    expect(schema.sameAs).toContain('https://linkedin.com/in/gabriel')
  })

  it('filters out platforms without URL', () => {
    const heroNoLinks: Hero = { ...mockHero, socialLinks: [] }
    const schema = buildPersonSchema(heroNoLinks)
    expect(schema.sameAs).toHaveLength(0)
  })

  it('only includes github and linkedin (ignores other platforms)', () => {
    const heroExtra: Hero = {
      ...mockHero,
      socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/gabriel', label: 'Twitter' },
        { platform: 'github',  url: 'https://github.com/gabriel',  label: 'GitHub' },
      ],
    }
    const schema = buildPersonSchema(heroExtra)
    expect(schema.sameAs).toContain('https://github.com/gabriel')
    expect(schema.sameAs).not.toContain('https://twitter.com/gabriel')
  })

  it('uses fallback name when hero is undefined', () => {
    const schema = buildPersonSchema(undefined)
    expect(schema.name).toBeTruthy()
    expect(schema['@type']).toBe('Person')
  })
})

// ─────────────────────────────────────────────
// buildWebSiteSchema
// ─────────────────────────────────────────────
describe('buildWebSiteSchema', () => {
  it('has correct @context and @type', () => {
    const schema = buildWebSiteSchema('Gabriel Yépez')
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('WebSite')
  })

  it('includes the portfolio URL', () => {
    const schema = buildWebSiteSchema('Gabriel Yépez')
    expect(schema.url).toBe(SITE_URL)
  })

  it('includes the site name', () => {
    const schema = buildWebSiteSchema('Gabriel Yépez')
    expect(schema.name).toContain('Gabriel Yépez')
  })
})

// ─────────────────────────────────────────────
// buildProjectListSchema
// ─────────────────────────────────────────────
describe('buildProjectListSchema', () => {
  it('returns null when projects is undefined', () => {
    expect(buildProjectListSchema(undefined, 'Gabriel Yépez')).toBeNull()
  })

  it('returns null when projects array is empty', () => {
    expect(buildProjectListSchema([], 'Gabriel Yépez')).toBeNull()
  })

  it('has correct @context and @type', () => {
    const schema = buildProjectListSchema(mockProjects, 'Gabriel Yépez')
    expect(schema?.['@context']).toBe('https://schema.org')
    expect(schema?.['@type']).toBe('ItemList')
  })

  it('maps projects to ListItems with correct position', () => {
    const schema = buildProjectListSchema(mockProjects, 'Gabriel Yépez')
    expect(schema?.itemListElement).toHaveLength(2)
    expect(schema?.itemListElement[0].position).toBe(1)
    expect(schema?.itemListElement[1].position).toBe(2)
  })

  it('includes project title and liveUrl in each ListItem', () => {
    const schema = buildProjectListSchema(mockProjects, 'Gabriel Yépez')
    const first = schema?.itemListElement[0]
    expect(first?.['@type']).toBe('ListItem')
    expect(first?.name).toBe('Proyecto Alpha')
    expect(first?.url).toBe('https://alpha.example.com')
  })
})
