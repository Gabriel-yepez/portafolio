import { cn } from './utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

export function HeroSkeleton() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-10 px-4"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-14 w-64" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-6 w-80" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-28" />
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center">
            <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutSkeleton() {
  return (
    <section id="about" className="py-10 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function TechnologiesSkeleton() {
  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-40 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-9 w-24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectsSkeleton() {
  return (
    <section id="projects" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSkeleton() {
  return (
    <section id="contact" className="py-10 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </section>
  )
}
