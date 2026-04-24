import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
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
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = assetUrl(data.profileImage.url);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [data?.profileImage?.url]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (isLoading)
    return (
      <section id="hero" className="hero-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </section>
    );

  if (isError || !data)
    return (
      <section id="hero" className="hero-bg min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No se pudo cargar esta sección.</p>
      </section>
    );

  return (
    <section id="hero" className="hero-bg min-h-screen flex items-center justify-center pt-24 md:pt-8 px-4">
      {/* All content must be relative + z-10 to sit above the ::before mesh */}
      <div className="relative z-10 container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text column */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-muted-foreground text-lg">{data.greeting}</p>
              <h1
                className="gradient-text font-extrabold leading-tight"
                style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              >
                {data.name}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">{data.role}</p>
            </div>

            <p className="text-lg text-muted-foreground max-w-md">{data.bio}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollTo(data.primaryCta.targetSectionId)}
                variant="gradient"
                size="lg"
                className="rounded-full cursor-pointer hover:scale-105 transition-transform"
              >
                {data.primaryCta.label}
              </Button>
              <Button
                onClick={() => scrollTo(data.secondaryCta.targetSectionId)}
                variant="outline"
                size="lg"
                className="rounded-full cursor-pointer"
              >
                {data.secondaryCta.label}
              </Button>
            </div>

            <div className="flex gap-4 pt-2">
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
                    <img src={SOCIAL_SVG[link.platform]} alt={link.label} className="w-10 h-10 opacity-80 hover:opacity-100 transition-opacity" />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Photo column */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Animated gradient ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-4px",
                  background: "conic-gradient(from 0deg, #6366f1, #22d3ee, #6366f1)",
                  animation: "ring-spin 6s linear infinite",
                }}
              />
              {/* Photo on top */}
              <picture className="absolute inset-0 rounded-full overflow-hidden">
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
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground animate-bounce z-10">
        <span className="text-xs tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
