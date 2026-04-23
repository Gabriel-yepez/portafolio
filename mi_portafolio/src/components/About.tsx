import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useAbout } from "../hooks/useAbout";
import { ICON_MAP } from "../lib/icons";

export function About() {
  const { data, isError } = useAbout();

  if (isError || !data) return null;

  const cvUrl = data.cvUrl ?? import.meta.env.VITE_CV_URL ?? "/cv.pdf";

  return (
    <section id="about" className="pt-20 px-4 bg-muted/30 defer-section">
      <div className="container mx-auto">
        <article className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl font-semibold">{data.title}</h2>
          <p className="text-lg text-muted-foreground">{data.description}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Ve mi Curricullum sin compromiso!!
            </span>
            <Button
              asChild
              size="lg"
              className="bg-black rounded-lg text-white hover:bg-black/85 cursor-pointer transition-colors"
            >
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                Ver CV
              </a>
            </Button>
          </div>
        </article>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.highlights.map((item, index) => {
            const Icon = ICON_MAP[item.iconName];
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
