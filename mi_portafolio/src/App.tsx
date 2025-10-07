import { Header } from "./components/Header";
import { About } from "./components/About"
import { Hero } from "./components/Hero";

function App() {

  return (
    <>
      <Header />
      <main>
        <Hero/>
        <About />
      </main>
    </>
  )
}

export default App
