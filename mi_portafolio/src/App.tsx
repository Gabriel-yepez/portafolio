import { Header } from "./components/Header";
import { About } from "./components/About"
import { Hero } from "./components/Hero";
import { Technologies } from "./components/Technologies";
import { Projects } from "./components/Projects";

function App() {

  return (
    <>
      <Header />
      <main>
        <Hero/>
        <About />
        <Technologies />
        <Projects />
      </main>
    </>
  )
}

export default App
