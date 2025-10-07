import { Header } from "./components/Header";
import { About } from "./components/About"
import { Hero } from "./components/Hero";
import { Technologies } from "./components/Technologies";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";

function App() {

  return (
    <>
      <Header />
      <main>
        <Hero/>
        <About />
        <Technologies />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default App
