import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useAbout } from "../hooks/useAbout";
import { ICON_MAP } from "../lib/icons";
import { MotionSection } from "./ui/MotionSection";
import { motion, type Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay: i * 0.12 },
  }),
};

export function About() {
  const { data, isError } = useAbout();

  if (isError || !data) return null;

  const cvUrl = data.cvUrl ?? import.meta.env.VITE_CV_URL ?? "/cv.pdf";

  return (
    <MotionSection id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

          {/* Left: text + CV button */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">{data.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Ve mi Curriculum sin compromiso</span>
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="w-fit rounded-full cursor-pointer"
              >
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  Ver CV
                </a>
              </Button>
            </div>
          </div>

          {/* Right: highlight cards */}
          <div className="flex flex-col gap-4">
            {data.highlights.map((item, i) => {
              const Icon = ICON_MAP[item.iconName];
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="hover:border-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300">
                    <CardContent className="pt-6 flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
