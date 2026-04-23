import { Badge } from "./ui/badge";
import { useTechnologies } from "../hooks/useTechnologies";
import { assetUrl } from "../services/api";

export function Technologies() {
  const { data, isError } = useTechnologies();

  if (isError || !data) return null;

  return (
    <section id="technologies" className="py-8 md:py-20 px-4 defer-section">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </section>

        <article className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-8 md:px-20">
          {data.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-center">{category.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-2">
                {category.technologies.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="px-4 py-2 hover:bg-primary hover:text-primary-foreground
                    transition-colors cursor-default flex justify-center items-center w-full"
                  >
                    {tech.icon && (
                      <img
                        src={assetUrl(tech.icon.url)}
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
