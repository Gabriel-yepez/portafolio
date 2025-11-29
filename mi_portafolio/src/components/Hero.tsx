import { useEffect } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import github from "../assets/github.svg"
import linkedin from "../assets/linkedin.svg"
import imagenPerfil from "../assets/imagenPerfil.webp"

export function Hero() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = imagenPerfil;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-18 md:pt-8 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xl">Hola, soy</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">
                Gabriel Yépez
              </h1>
              <h2 className="text-2xl md:text-3xl">
                Desarrollador de Software
              </h2> 
            </div>
            
            <p className="text-xl text-muted-foreground">
              Apasionado por crear soluciones digitales innovadoras y experiencias de usuario excepcionales.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollToSection("projects")} size="lg" className="hover:scale-105 transition-transform cursor-pointer hover:bg-switch-background">
                Ver proyectos
              </Button>
              <Button onClick={() => scrollToSection("contact")} variant="outline" size="lg" className="hover:scale-105 border border-gray-400 transition-transform cursor-pointer">
                Contacto
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com/Gabriel-yepez"
                target="_blank"
                rel="noopener noreferrer"
                className="link-animated rounded-full"
              >
                <img src={github} alt="GitHub" className="w-12 h-12" />
              </a>
              <a
                href="https://www.linkedin.com/in/gabriel-augusto-yepez-arenas-873b80263/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-animated rounded-full"
              >
                <img src={linkedin} alt="Linkedin" className="w-12 h-12"/>
              </a>
            </div>
          </section>

          <section className="flex justify-center">
            <picture className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={imagenPerfil}
                alt="Retrato de Gabriel Yépez"
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