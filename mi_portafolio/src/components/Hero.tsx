import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">Hola, soy</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">
                Tu Nombre
              </h1>
              <h2 className="text-2xl md:text-3xl text-muted-foreground">
                Desarrollador Full Stack
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground">
              Apasionado por crear soluciones digitales innovadoras y experiencias de usuario excepcionales.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollToSection("projects")} size="lg">
                Ver proyectos
              </Button>
              <Button onClick={() => scrollToSection("contact")} variant="outline" size="lg">
                Contacto
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:tu@email.com"
                className="hover:text-primary transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk2NDgwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}