export interface StrapiMedia {
  id: number
  url: string
  name: string
  mime: string
}

export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface CtaButton {
  label: string
  targetSectionId: string
  variant: string
}

export interface Highlight {
  iconName: string
  title: string
  description: string
}

export interface ContactInfoItem {
  iconName: string
  title: string
  value: string
  link?: string
}

export interface NavItem {
  label: string
  targetSectionId: string
}

export interface Seo {
  metaTitle: string
  metaDescription: string
}

export interface Hero {
  greeting: string
  name: string
  role: string
  bio: string
  profileImage: StrapiMedia | null
  primaryCta: CtaButton
  secondaryCta: CtaButton
  socialLinks: SocialLink[]
}

export interface About {
  title: string
  description: string
  highlights: Highlight[]
}

export interface Contact {
  title: string
  description: string
  formEnabled: boolean
  infoItems: ContactInfoItem[]
}

export interface Footer {
  copyrightName: string
  socialLinks: SocialLink[]
}

export interface Global {
  siteTitle: string
  navItems: NavItem[]
  seo: Seo
}

export interface Technology {
  id: number
  name: string
  slug: string
  order: number
  icon: StrapiMedia | null
}

export interface TechCategory {
  id: number
  title: string
  slug: string
  order: number
  technologies: Technology[]
}

export interface Project {
  id: number
  title: string
  slug: string
  description: string
  liveUrl: string
  githubUrl: string
  order: number
  featured: boolean
  image: StrapiMedia | null
  technologies: Technology[]
}
