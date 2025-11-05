import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import github from "../assets/github.svg"
import linkedin from "../assets/linkedin.svg"
import imagenPerfil from "../assets/imagenPerfil.webp"

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-10 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">Hola, soy</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">
                Gabriel Yépez
              </h1>
              <h2 className="text-2xl md:text-3xl">
                Desarrollador de Software
              </h2> 
            </div>
            
            <p className="text-lg text-muted-foreground">
              Apasionado por crear soluciones digitales innovadoras y experiencias de usuario excepcionales.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollToSection("projects")} size="lg" className="hover:scale-105 transition-transform cursor-pointer hover:bg-switch-background">
                Ver proyectos
              </Button>
              <Button onClick={() => scrollToSection("contact")} variant="outline" size="lg" className="hover:scale-105 transition-transform cursor-pointer">
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
          </div>

          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
              <ImageWithFallback
                src={imagenPerfil}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}