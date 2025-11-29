import { useId } from "react"
import { ExternalLink, MoveLeft, MoveRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { certifications } from "../util/certifications"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

export function Certifications() {
  const prevButtonId = useId()
  const nextButtonId = useId()

  return (
    <section id="certifications" className="py-8 md:py-20 px-4 defer-section">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">Certificaciones</h2>
          <p className="text-xl text-muted-foreground">
            Reconocimientos que avalan mi formación continua y habilidades técnicas
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation={{
            prevEl: `#${prevButtonId}`,
            nextEl: `#${nextButtonId}`,
          }}
          autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
          spaceBetween={32}
          slidesPerView={1}
          loop
          centeredSlides
          grabCursor
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation
            if (navigation && typeof navigation !== "boolean") {
              navigation.prevEl = `#${prevButtonId}`
              navigation.nextEl = `#${nextButtonId}`
            }
          }}
          className="pb-16 rounded-2xl"
        >
          {certifications.map((certification) => (
            <SwiperSlide key={`${certification.title}-${certification.issuer}`} className="h-full ">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-lg font-semibold">{certification.title}</h3>
                    <p className="text-sm text-muted-foreground">{certification.issuer}</p>
                  </div>
                  <Badge variant="secondary" className="w-fit mt-2">
                    {certification.issueDate}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {certification.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {certification.topics.map((topic) => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
                  {certification.credentialId && (
                    <span className="text-xs text-muted-foreground">
                      ID: <span className="font-semibold">{certification.credentialId}</span>
                    </span>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver credencial
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            id={prevButtonId}
            aria-label="Ver certificación anterior"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-background text-foreground shadow hover:bg-muted transition-colors"
          >
            <MoveLeft className="h-5 w-5" />
          </button>
          <button
            id={nextButtonId}
            aria-label="Ver certificación siguiente"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-background text-foreground shadow hover:bg-muted transition-colors"
          >
            <MoveRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
