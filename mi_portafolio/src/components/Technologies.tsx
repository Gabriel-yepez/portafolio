import { Badge } from "./ui/badge";

export function Technologies() {
  const categories = [
    {
      title: "Frontend",
      technologies: [
        "React",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "JavaScript",
      ],
    },
    {
      title: "Backend",
      technologies: [
        "Node.js",
        "Express",
        "Python",
        "Django",
        "REST API",
        "GraphQL",
      ],
    },
    {
      title: "Bases de Datos",
      technologies: [
        "PostgreSQL",
        "MongoDB",
        "MySQL",
        "Redis",
        "Firebase",
      ],
    },
    {
      title: "Herramientas",
      technologies: [
        "Git",
        "Docker",
        "AWS",
        "Figma",
        "VS Code",
        "Postman",
      ],
    },
  ];

  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3>{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}