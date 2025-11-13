import { Badge } from "./ui/badge";
import { categories } from "../util/technologies";

export function Technologies() {

  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </section>

        <article className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3>{category.title}</h3>
              <div className="flex flex-wrap gap-2">
              {category.technologies.map((tech, techIndex) => (
                <Badge
                key={techIndex}
                variant="secondary"
                className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default flex items-center"
                >
                {tech.svg && (
                  <img
                  src={tech.svg}
                  alt={tech.name}
                  className="w-6 h-6 mr-2 inline-block"
                  />
                )}
                {tech.name}
                </Badge>
              ))}
              </div>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}