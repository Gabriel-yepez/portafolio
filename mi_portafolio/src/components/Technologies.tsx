import { useTechnologies } from "../hooks/useTechnologies";
import { assetUrl } from "../services/api";
import { MotionSection } from "./ui/MotionSection";

export function Technologies() {
  const { data, isError } = useTechnologies();

  if (isError || !data) return null;

  return (
    <MotionSection id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {data.map((category) => (
            <div key={category.id} className="space-y-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-accent">
                {category.title}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {category.technologies.map((tech) => (
                  <div key={tech.id} className="tech-chip">
                    {tech.icon && (
                      <img
                        src={assetUrl(tech.icon.url)}
                        alt={tech.name}
                        className="w-5 h-5 object-contain flex-shrink-0"
                      />
                    )}
                    <span className="truncate">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
