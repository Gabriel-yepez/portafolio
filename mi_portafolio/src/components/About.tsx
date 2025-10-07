import { Code, Lightbulb, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function About() {
  const highlights = [
    {
      icon: Code,
      title: "Desarrollo",
      description: "Experiencia en desarrollo frontend y backend con las últimas tecnologías",
    },
    {
      icon: Lightbulb,
      title: "Creatividad",
      description: "Soluciones innovadoras para problemas complejos",
    },
    {
      icon: Users,
      title: "Colaboración",
      description: "Trabajo en equipo y comunicación efectiva",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4">Sobre mí</h2>
          <p className="text-lg text-muted-foreground">
            Soy un desarrollador apasionado con experiencia en la creación de aplicaciones web modernas.
            Me encanta aprender nuevas tecnologías y enfrentar desafíos que me permitan crecer profesionalmente.
            Mi objetivo es crear productos que no solo funcionen bien, sino que también brinden una excelente
            experiencia de usuario.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {highlights.map((item, index) => (
            <Card key={index} className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3>{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}