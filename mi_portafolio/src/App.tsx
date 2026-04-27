import { Suspense, lazy } from "react";
import Skeleton from "@mui/material/Skeleton";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SEO } from "./components/SEO";
import { SectionSkeleton } from "./components/ui/Skeleton";

const AboutSection = lazy(() =>
  import("./components/About").then((m) => ({ default: m.About }))
);
const TechnologiesSection = lazy(() =>
  import("./components/Technologies").then((m) => ({ default: m.Technologies }))
);
const CertificationsSection = lazy(() =>
  import("./components/Certifications").then((m) => ({ default: m.Certifications }))
);
const ProjectsSection = lazy(() =>
  import("./components/Projects").then((m) => ({ default: m.Projects }))
);
const ContactSection = lazy(() =>
  import("./components/Contact").then((m) => ({ default: m.Contact }))
);
const FooterSection = lazy(() =>
  import("./components/Footer").then((m) => ({ default: m.Footer }))
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SEO />
      <Header />
      <main>
        <Hero />
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
        fallback={
          <footer className="py-10 text-center text-muted-foreground" role="status">
            <div className="container mx-auto space-y-2">
              <Skeleton variant="text" width="40%" sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="30%" sx={{ mx: "auto" }} />
            </div>
          </footer>
        }
      >
        <FooterSection />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
