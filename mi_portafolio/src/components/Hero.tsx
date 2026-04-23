import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useHero } from '../hooks/useHero'
import { assetUrl } from '../services/api'
import { HeroSkeleton } from './ui/skeleton'
import github from '../assets/github.svg'
import linkedin from '../assets/linkedin.svg'

const SOCIAL_SVG: Record<string, string> = {
  github,
  linkedin,
}

export function Hero() {
  const { data, isLoading, isError } = useHero()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  if (isLoading) return <HeroSkeleton />
  if (isError)
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  if (!data) return null

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-10 px-4"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">{data.greeting}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">{data.name}</h1>
              <h2 className="text-2xl md:text-3xl">{data.role}</h2>
            </div>

            <p className="text-lg text-muted-foreground">{data.bio}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() =>
                  scrollToSection(data.primaryCta.targetSectionId)
                }
                size="lg"
                className="hover:scale-105 transition-transform cursor-pointer hover:bg-switch-background"
              >
                {data.primaryCta.label}
              </Button>
              <Button
                onClick={() =>
                  scrollToSection(data.secondaryCta.targetSectionId)
                }
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform cursor-pointer"
              >
                {data.secondaryCta.label}
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              {data.socialLinks.map((link) =>
                SOCIAL_SVG[link.platform] ? (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-animated rounded-full"
                    aria-label={link.label}
                  >
                    <img
                      src={SOCIAL_SVG[link.platform]}
                      alt={link.label}
                      className="w-12 h-12"
                    />
                  </a>
                ) : null,
              )}
            </div>
          </section>

          <section className="flex justify-center">
            <picture className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
              <ImageWithFallback
                src={data.profileImage ? assetUrl(data.profileImage.url) : ''}
                className="w-full h-full object-cover"
              />
            </picture>
          </section>
        </div>
      </div>
    </section>
  )
}
