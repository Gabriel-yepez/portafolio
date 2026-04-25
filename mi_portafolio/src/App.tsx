import { Suspense, lazy } from "react";
import Skeleton from "@mui/material/Skeleton";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SectionSkeleton } from "./components/ui/Skeleton";

const AboutSection = lazy(() => import("./components/About").then((module) => ({
  default: module.About,
})));

const TechnologiesSection = lazy(() => import("./components/Technologies").then((module) => ({
  default: module.Technologies,
})));

const CertificationsSection = lazy(() => import("./components/Certifications").then((module) => ({
  default: module.Certifications,
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


function App() {

  return (
    <QueryClientProvider client={queryClient}>
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
        <Suspense fallback={<SectionSkeleton title="Certificaciones" isAltBackground />}>
          <CertificationsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Contacto" />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense
        fallback={(
          <footer className="py-10 text-center text-muted-foreground" role="status">
            <div className="container mx-auto space-y-2">
              <Skeleton variant="text" width="40%" sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="30%" sx={{ mx: "auto" }} />
            </div>
          </footer>
        )}
      >
        <FooterSection />
      </Suspense>
    </QueryClientProvider>
  )
}

export default App
