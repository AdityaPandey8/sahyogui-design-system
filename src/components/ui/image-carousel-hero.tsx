import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
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
  images: ImageCard[]
  features?: Array<{
    title: string
    description: string
  }>
}

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  images,
  features = [
    {
      title: "Realistic Results",
      description: "Photos that look professionally crafted",
    },
    {
      title: "Fast Generation",
      description: "Turn ideas into images in seconds.",
    },
    {
      title: "Diverse Styles",
      description: "Choose from a wide range of artistic options.",
    },
  ],
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovering, setIsHovering] = useState(false)
  const [rotatingCards, setRotatingCards] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((v) => (v + 0.5) % 360))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)))
  }, [images])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 sm:py-24">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--primary) / 0.15), transparent)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* Carousel Container */}
        <div
          className="relative mx-auto mb-12 h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          </div>

          {/* Rotating Image Cards */}
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((image, index) => {
              const angle = (rotatingCards[index] || 0) * (Math.PI / 180)
              const radius = 140
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              const scale = 0.6 + (Math.sin(angle) + 1) * 0.2
              const zIndex = Math.round((Math.sin(angle) + 1) * 50)

              const perspectiveX = isHovering ? (mousePosition.x - 0.5) * 15 : 0
              const perspectiveY = isHovering ? (mousePosition.y - 0.5) * 15 : 0

              return (
                <div
                  key={image.id}
                  className="absolute transition-opacity duration-300"
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale}) perspective(800px) rotateY(${perspectiveX}deg) rotateX(${-perspectiveY}deg)`,
                    zIndex,
                    opacity: scale > 0.7 ? 1 : 0.5,
                  }}
                >
                  <div
                    className="h-20 w-20 overflow-hidden rounded-xl border border-border/50 shadow-lg sm:h-24 sm:w-24"
                    style={{ transform: `rotate(${image.rotation}deg)` }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {subtitle}
          </p>
          <h1
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
            style={{ lineHeight: "1.1" }}
          >
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
            {description}
          </p>

          {/* CTA Button */}
          <button
            onClick={onCtaClick}
            className={cn(
              "mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200",
              "hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card/60 p-5 text-center backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 text-sm font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
