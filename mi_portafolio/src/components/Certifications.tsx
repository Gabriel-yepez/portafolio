import { useId } from "react";
import { ExternalLink, MoveLeft, MoveRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCertifications } from "../hooks/useCertifications";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CardContent, CardFooter, CardHeader } from "./ui/card";
import { MotionSection } from "./ui/MotionSection";

export function Certifications() {
  const prevButtonId = useId();
  const nextButtonId = useId();
  const { data, isError } = useCertifications();

  if (isError || !data) return null;

  return (
    <MotionSection id="certifications" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Certificaciones</h2>
          <p className="text-xl text-muted-foreground">
            Reconocimientos que avalan mi formación continua y habilidades técnicas
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation={{ prevEl: `#${prevButtonId}`, nextEl: `#${nextButtonId}` }}
          autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
          spaceBetween={32}
          slidesPerView={1}
          loop
          centeredSlides
          grabCursor
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== "boolean") {
              nav.prevEl = `#${prevButtonId}`;
              nav.nextEl = `#${nextButtonId}`;
            }
          }}
          className="pb-16 rounded-2xl"
        >
          {data.map((cert) => (
            <SwiperSlide key={`${cert.title}-${cert.issuer}`} className="h-full">
              {/* Glass card manually (not using Card component to avoid double-glass) */}
              <div className="glass rounded-2xl h-full flex flex-col">
                <CardHeader>
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-lg font-semibold text-foreground">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <span className="inline-flex w-fit mt-2 rounded-full border border-accent/20 bg-accent/10 text-accent text-xs font-medium px-3 py-0.5">
                    {cert.issueDate}
                  </span>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(cert.topics ?? []).map((topic) => (
                      <Badge key={topic} variant="tech">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
                  {cert.credentialId && (
                    <span className="text-xs text-muted-foreground">
                      ID: <span className="font-semibold text-foreground">{cert.credentialId}</span>
                    </span>
                  )}
                  <Button variant="outline" size="sm" asChild className="rounded-lg">
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Ver credencial
                    </a>
                  </Button>
                </CardFooter>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nav buttons */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            id={prevButtonId}
            aria-label="Ver certificación anterior"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <MoveLeft className="h-5 w-5" />
          </button>
          <button
            id={nextButtonId}
            aria-label="Ver certificación siguiente"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <MoveRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </MotionSection>
  );
}
