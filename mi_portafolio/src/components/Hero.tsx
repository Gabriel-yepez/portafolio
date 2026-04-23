import { useEffect } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useHero } from "../hooks/useHero";
import { assetUrl } from "../services/api";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";

const SOCIAL_SVG: Record<string, string> = { github, linkedin };

export function Hero() {
  const { data, isLoading, isError } = useHero();

  useEffect(() => {
    if (!data?.profileImage?.url) return;
    if (typeof document === "undefined") return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = assetUrl(data.profileImage.url);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [data?.profileImage?.url]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading)
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </section>
    );

  if (isError || !data)
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    );

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-18 md:pt-8 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xl">{data.greeting}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">{data.name}</h1>
              <h2 className="text-2xl md:text-3xl">{data.role}</h2>
            </div>

            <p className="text-xl text-muted-foreground">{data.bio}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollToSection(data.primaryCta.targetSectionId)}
                size="lg"
                className="hover:scale-105 transition-transform cursor-pointer hover:bg-switch-background"
              >
                {data.primaryCta.label}
              </Button>
              <Button
                onClick={() => scrollToSection(data.secondaryCta.targetSectionId)}
                variant="outline"
                size="lg"
                className="hover:scale-105 border border-gray-400 transition-transform cursor-pointer"
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
                    <img src={SOCIAL_SVG[link.platform]} alt={link.label} className="w-12 h-12" />
                  </a>
                ) : null
              )}
            </div>
          </section>

          <section className="flex justify-center">
            <picture className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={data.profileImage ? assetUrl(data.profileImage.url) : ""}
                alt={`Retrato de ${data.name}`}
                width={512}
                height={512}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                sizes="(min-width: 768px) 20rem, 16rem"
                className="w-full h-full object-cover"
              />
            </picture>
          </section>
        </div>
      </div>
    </section>
  );
}
