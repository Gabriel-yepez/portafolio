import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useCertifications } from '../hooks/useCertifications'
import { CertificationsSkeleton } from './ui/skeleton'

export function Certifications() {
  const { data, isLoading, isError } = useCertifications()

  if (isLoading) return <CertificationsSkeleton />
  if (isError)
    return (
      <section
        id="certifications"
        className="py-20 px-4 flex items-center justify-center"
      >
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    )

  if (!data) return null

  return (
    <section id="certifications" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Certificaciones</h2>
          <p className="text-lg text-muted-foreground">
            Reconocimientos que avalan mi formación continua y habilidades técnicas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.map((cert) => (
            <Card
              key={cert.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="space-y-1">
                  <h3 className="font-semibold leading-snug">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <Badge variant="secondary" className="w-fit mt-2">
                  {cert.issueDate}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {cert.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(cert.topics ?? []).map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
                {cert.credentialId && (
                  <span className="text-xs text-muted-foreground">
                    ID: <span className="font-semibold">{cert.credentialId}</span>
                  </span>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver credencial
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
