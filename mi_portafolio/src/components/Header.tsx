import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { useGlobal } from '../hooks/useGlobal'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data } = useGlobal()

  const siteTitle = data?.siteTitle ?? 'Mi Portafolio'
  const navItems = data?.navItems ?? []
  const mainItems = navItems.slice(0, -1)
  const lastItem = navItems[navItems.length - 1]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            {siteTitle}
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {mainItems.map((item) => (
              <button
                key={item.targetSectionId}
                onClick={() => scrollToSection(item.targetSectionId)}
                className="hover:text-primary transition-colors underline-offset-2 hover:underline decoration-[1.5px] hover:cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            {lastItem && (
              <Button
                onClick={() => scrollToSection(lastItem.targetSectionId)}
                className="hover:cursor-pointer hover:bg-switch-background"
              >
                {lastItem.label}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {mainItems.map((item) => (
              <button
                key={item.targetSectionId}
                onClick={() => scrollToSection(item.targetSectionId)}
                className="text-left hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            {lastItem && (
              <Button onClick={() => scrollToSection(lastItem.targetSectionId)}>
                {lastItem.label}
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
