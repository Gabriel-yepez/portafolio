import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { Header } from './components/Header'
import { About } from './components/About'
import { Hero } from './components/Hero'
import { Technologies } from './components/Technologies'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main>
        <Hero />
        <About />
        <Technologies />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </QueryClientProvider>
  )
}

export default App
