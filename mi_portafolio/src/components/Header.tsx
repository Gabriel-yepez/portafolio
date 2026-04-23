import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "about", label: "Sobre mí" },
  { id: "technologies", label: "Tecnologías" },
  { id: "projects", label: "Proyectos" },
  { id: "certifications", label: "Certificaciones" },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = ["hero", "about", "technologies", "projects", "certifications", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating pill — desktop */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav className="glass rounded-full px-6 py-3 flex items-center gap-6 shadow-xl shadow-black/30">
          <button
            onClick={() => scrollTo("hero")}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Mi Portafolio
          </button>

          <div className="flex items-center gap-5">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm transition-colors cursor-pointer ${
                  activeSection === id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("contact")}
            className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Contacto
          </button>
        </nav>
      </header>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden glass border-b border-white/8">
        <nav className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => scrollTo("hero")}
            className="text-sm font-semibold text-foreground cursor-pointer"
          >
            Mi Portafolio
          </button>
          <button
            className="text-foreground cursor-pointer"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="flex flex-col gap-1 px-4 pb-4">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="mt-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer text-center"
            >
              Contacto
            </button>
          </div>
        )}
      </header>
    </>
  );
}
