import { ExternalLink, Github } from "lucide-react";
import { CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useProjects } from "../hooks/useProjects";
import { assetUrl } from "../services/api";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export function Projects() {
  const { data, isError } = useProjects();

  if (isError || !data) return null;

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Proyectos</h2>
          <p className="text-xl text-muted-foreground">
            Algunos de los proyectos en los que he trabajado
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {data.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              className="glass rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-52 overflow-hidden bg-white/5">
                <ImageWithFallback
                  src={project.image ? assetUrl(project.image.url) : ""}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050A14]/80 to-transparent pointer-events-none" />
              </div>

              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id} variant="tech">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-0">
                <Button variant="gradient" size="sm" className="flex-1 rounded-lg" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-lg" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    Código
                  </a>
                </Button>
              </CardFooter>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
