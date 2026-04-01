import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { ImageCarouselHero } from "@/components/ui/image-carousel-hero";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MapPreviewSection } from "@/components/landing/MapPreviewSection";
import { RoleSelectionDialog } from "@/components/landing/RoleSelectionDialog";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0", "blur-0");
            entry.target.classList.remove("opacity-0", "translate-y-3", "blur-[4px]");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const heroImages = [
  { id: "1", src: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=60&w=900", alt: "Community volunteers", rotation: -15 },
  { id: "2", src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=60&w=900", alt: "Disaster relief", rotation: -8 },
  { id: "3", src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=60&w=900", alt: "Helping hands", rotation: 5 },
  { id: "4", src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=60&w=900", alt: "NGO fieldwork", rotation: 12 },
  { id: "5", src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=60&w=900", alt: "Community building", rotation: -12 },
  { id: "6", src: "https://images.unsplash.com/photo-1559024094-4a1e4495c3c1?auto=format&fit=crop&q=60&w=900", alt: "Relief coordination", rotation: 8 },
  { id: "7", src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=60&w=900", alt: "Volunteer teamwork", rotation: -5 },
  { id: "8", src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=60&w=900", alt: "Community meeting", rotation: 10 },
];

const heroFeatures = [
  { title: "AI-Powered Matching", description: "Smart algorithms connect the right responders to critical issues." },
  { title: "Real-Time Coordination", description: "Live tracking of deployments and issue resolution." },
  { title: "Community Driven", description: "Empowering citizens, NGOs, and volunteers together." },
];

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={() => setModalOpen(true)} />

      <ImageCarouselHero
        title="Connecting Communities with NGOs and Volunteers using AI"
        subtitle="SahyogAI Platform"
        description="SahyogAI bridges the gap between those who need help and those who can provide it — powered by intelligent matching and real-time coordination."
        ctaText="Get Started"
        onCtaClick={() => setModalOpen(true)}
        images={heroImages}
        features={heroFeatures}
      />

      {/* About */}
      <section className="border-t py-20">
        <div
          data-reveal
          className="mx-auto max-w-3xl px-4 text-center opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
        >
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Why SahyogAI?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            In times of crisis, coordination is everything. SahyogAI uses artificial intelligence to instantly match verified community issues with the closest, most capable responders — reducing response time and maximizing impact.
          </p>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <MapPreviewSection />

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 SahyogAI. Built to connect communities.
          </p>
        </div>
      </footer>

      <RoleSelectionDialog open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
