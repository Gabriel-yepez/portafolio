import { Badge } from './ui/badge'
import { useTechnologies } from '../hooks/useTechnologies'
import { assetUrl } from '../services/api'
import { TechnologiesSkeleton } from './ui/skeleton'

export function Technologies() {
  const { data, isLoading, isError } = useTechnologies()

  if (isLoading) return <TechnologiesSkeleton />
  if (isError)
    return (
      <section
        id="technologies"
        className="py-20 px-4 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  if (!data) return null

  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que
            trabajo
          </p>
        </section>

        <article className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {data.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3>{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default flex items-center"
                  >
                    {tech.icon && (
                      <img
                        src={assetUrl(tech.icon.url)}
                        alt={tech.name}
                        className="w-6 h-6 mr-2 inline-block"
                      />
                    )}
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </article>
      </div>
    </section>
  )
}
