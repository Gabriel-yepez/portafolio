import { highlights } from "../util/about";
import { Card, CardContent } from "./ui/card";

export function About() {
  
  return (
    <section id="about" className="pt-20 px-4 bg-muted/30 defer-section">
      <div className="container mx-auto">
        <article className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">Sobre mí</h2>
          <p className="text-lg text-muted-foreground">
            Soy un desarrollador apasionado con experiencia en desarrollo frontend y backend con
            <strong className="text-black"> 1 año de experiencia</strong>, he participado en la
            creación de aplicaciones web modernas,aplicaiones de escritorio y aplicaciones con integraciones 
            de inteligencia artificial. Me encanta aprender nuevas tecnologías y enfrentar desafíos que me 
            permitan crecer profesionalmente. Mi objetivo es crear productos que no solo funcionen bien, sino
            que también brinden una excelente experiencia de usuario y den un valor agregado. Soy una persona proactiva,
            autodidacta, responsable, con capacidad de hacer relaciones interpersonales.
          </p>
        </article>

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