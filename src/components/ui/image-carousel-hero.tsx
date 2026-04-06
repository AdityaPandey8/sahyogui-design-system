import type React from "react"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageCard {
  id: string
  src: string
  alt: string
  rotation: number
}

interface ImageCarouselHeroProps {
  title: string
  subtitle: string
  description: string
  ctaText: string
  onCtaClick?: () => void
  secondaryCtaText?: string
  onSecondaryCtaClick?: () => void
  images: ImageCard[]
}

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  secondaryCtaText = "Learn More",
  onSecondaryCtaClick,
  images,
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovering, setIsHovering] = useState(false)

  const cards = images.slice(0, 3)
  const offsetX = (mousePosition.x - 0.5) * 15
  const offsetY = (mousePosition.y - 0.5) * 15

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
              SahyogAI Launch
            </span>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Connecting Communities with NGOs & Volunteers using <span className="text-primary">AI</span>
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                SahyogAI bridges the gap between those who need help and those who can provide it — powered by intelligent matching and real-time coordination.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="rounded-full px-8" onClick={onCtaClick}>
                {ctaText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                onClick={onSecondaryCtaClick}
              >
                {secondaryCtaText}
              </Button>
            </div>
          </div>

          <div
            className="relative mx-auto flex max-w-xl items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-2xl" />

            <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
              style={{ transform: isHovering ? `translate(${offsetX}px, ${offsetY}px)` : "none", transition: "transform 0.2s ease" }}
            >
              <div className="space-y-6">
                {cards.slice(0, 2).map((card, index) => (
                  <div
                    key={card.id}
                    className="overflow-hidden rounded-[2rem] border border-border/40 bg-card shadow-2xl shadow-slate-900/5"
                    style={{ transform: `translate(${index === 0 ? 0 : 20}px, ${index === 0 ? 0 : 24}px)` }}
                  >
                    <img src={card.src} alt={card.alt} className={index === 0 ? "h-[240px] w-full object-cover" : "h-[280px] w-full object-cover"} loading="lazy" />
                  </div>
                ))}
              </div>

              <div className="relative flex items-end justify-center">
                <div className="overflow-hidden rounded-[2.75rem] border border-border/40 bg-card shadow-2xl shadow-slate-900/5">
                  <img src={cards[2]?.src ?? images[0].src} alt={cards[2]?.alt ?? images[0].alt} className="h-[520px] w-full object-cover" loading="lazy" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
