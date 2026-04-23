import { Card, CardContent } from './ui/card'
import { useAbout } from '../hooks/useAbout'
import { ICON_MAP } from '../lib/icons'
import { AboutSkeleton } from './ui/skeleton'

export function About() {
  const { data, isLoading, isError } = useAbout()

  if (isLoading) return <AboutSkeleton />
  if (isError)
    return (
      <section
        id="about"
        className="py-10 px-4 bg-muted/30 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  if (!data) return null

  return (
    <section id="about" className="py-10 px-4 bg-muted/30">
      <div className="container mx-auto">
        <article className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.description}</p>
        </article>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.highlights.map((item, index) => {
            const Icon = ICON_MAP[item.iconName]
            return (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors"
              >
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
