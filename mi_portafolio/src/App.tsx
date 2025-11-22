import { Suspense, lazy } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

const AboutSection = lazy(() => import("./components/About").then((module) => ({
  default: module.About,
})));

const TechnologiesSection = lazy(() => import("./components/Technologies").then((module) => ({
  default: module.Technologies,
})));

const ProjectsSection = lazy(() => import("./components/Projects").then((module) => ({
  default: module.Projects,
})));

const ContactSection = lazy(() => import("./components/Contact").then((module) => ({
  default: module.Contact,
})));

const FooterSection = lazy(() => import("./components/Footer").then((module) => ({
  default: module.Footer,
})));

type SectionSkeletonProps = {
  title: string;
  isAltBackground?: boolean;
};

const SectionSkeleton = ({ title, isAltBackground }: SectionSkeletonProps) => (
  <section
    aria-label={`Cargando ${title}`}
    className={`py-20 px-4 animate-pulse ${isAltBackground ? "bg-muted/30" : ""}`}
  >
    <div className="container mx-auto">
      <div className="h-6 w-48 bg-muted rounded mb-4" />
      <div className="h-4 w-full max-w-2xl bg-muted rounded" />
    </div>
  </section>
);

function App() {

  return (
    <>
      <Header />
      <main>
        <Hero/>
        <Suspense fallback={<SectionSkeleton title="Sobre mí" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Tecnologías" />}>
          <TechnologiesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Proyectos" isAltBackground />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Contacto" />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<footer className="py-10 text-center text-muted-foreground">Cargando pie de página...</footer>}>
        <FooterSection />
      </Suspense>
    </>
  )
}

export default App
