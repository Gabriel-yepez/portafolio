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
