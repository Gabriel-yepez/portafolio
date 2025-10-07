import { Header } from "./components/Header";
import { About } from "./components/About"
import { Hero } from "./components/Hero";
import { Technologies } from "./components/Technologies";

function App() {

  return (
    <>
      <Header />
      <main>
        <Hero/>
        <About />
        <Technologies />
      </main>
    </>
  )
}

export default App
