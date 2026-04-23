import { Github, Linkedin } from "lucide-react";
import { useFooter } from "../hooks/useFooter";

const SOCIAL_ICON: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
};

export function Footer() {
  const { data } = useFooter();
  const currentYear = new Date().getFullYear();
  const name = data?.copyrightName ?? "Gabriel Yépez";
  const socialLinks = data?.socialLinks ?? [];

  return (
    <footer className="bg-muted/30 border-t border-border py-8 px-4 defer-section">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © {currentYear} {name}. Todos los derechos reservados.
          </p>

          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICON[link.platform];
              if (!Icon) return null;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
