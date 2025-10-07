import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="cursor-pointer" onClick={() => scrollToSection("hero")}>
            Mi Portafolio
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-primary transition-colors"
            >
              Sobre mí
            </button>
            <button
              onClick={() => scrollToSection("technologies")}
              className="hover:text-primary transition-colors"
            >
              Tecnologías
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="hover:text-primary transition-colors"
            >
              Proyectos
            </button>
            <Button onClick={() => scrollToSection("contact")}>Contacto</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("about")}
              className="text-left hover:text-primary transition-colors"
            >
              Sobre mí
            </button>
            <button
              onClick={() => scrollToSection("technologies")}
              className="text-left hover:text-primary transition-colors"
            >
              Tecnologías
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-left hover:text-primary transition-colors"
            >
              Proyectos
            </button>
            <Button onClick={() => scrollToSection("contact")}>Contacto</Button>
          </div>
        )}
      </nav>
    </header>
  );
}