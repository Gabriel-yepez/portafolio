import type {
  Hero, About, Contact, Footer, Global, Project, TechCategory, Certification,
} from '../types/cms'

const BASE = import.meta.env.VITE_STRAPI_URL

// Normaliza la URL de un asset de Strapi hacia el BASE actual:
// - relativa (/uploads/..)            -> antepone BASE
// - absoluta a localhost/127.0.0.1    -> reescribe el path sobre BASE (dato viejo)
// - absoluta a otro host (CDN, S3..)  -> se deja intacta
export const assetUrl = (url: string) => {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
      const { pathname, search } = new URL(url)
      return `${BASE}${pathname}${search}`
    }
    return url
  }
  return `${BASE}${url}`
}

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
    get<Project[]>(
      '/api/projects?populate[technologies][fields][0]=name&populate[technologies][fields][1]=slug&populate[image][fields][0]=url&populate[image][fields][1]=formats&sort=order:asc',
    ),
  categories: () =>
    get<TechCategory[]>(
      '/api/tech-categories?populate[technologies][populate]=icon&sort=order:asc',
    ),
  certifications: () =>
    get<Certification[]>('/api/certifications?sort=order:asc'),
}
