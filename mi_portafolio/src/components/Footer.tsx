import { Github, Linkedin } from "lucide-react";
import type React from "react";
import { useFooter } from "../hooks/useFooter";

const SOCIAL_ICON: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
};

export function Footer() {
  const { data } = useFooter();
  const year = new Date().getFullYear();
  const name = data?.copyrightName ?? "Gabriel Yépez";
  const links = data?.socialLinks ?? [];

  return (
    <footer className="border-t border-white/6 py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {year} {name}. Todos los derechos reservados.
        </p>

        <div className="flex gap-5">
          {links.map((link) => {
            const Icon = SOCIAL_ICON[link.platform];
            if (!Icon) return null;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
