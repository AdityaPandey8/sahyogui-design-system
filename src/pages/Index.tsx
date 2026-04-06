import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { ImageCarouselHero } from "@/components/ui/image-carousel-hero";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MapPreviewSection } from "@/components/landing/MapPreviewSection";
import { ImpactStatsSection } from "@/components/landing/ImpactStatsSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { Footer } from "@/components/landing/Footer";
import { RoleSelectionDialog } from "@/components/landing/RoleSelectionDialog";
import { LiveActivityTicker } from "@/components/landing/LiveActivityTicker";
import { Users, Building2, Heart, ShieldAlert, Zap, Globe } from "lucide-react";

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

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  useScrollReveal();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const heroImages = [
    { id: "1", src: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=400", alt: "Relief coordination", rotation: -5 },
    { id: "2", src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=400", alt: "Volunteers helping", rotation: 8 },
    { id: "3", src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=400", alt: "NGO support", rotation: -12 },
    { id: "4", src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400", alt: "Community aid", rotation: 15 },
    { id: "5", src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400", alt: "Emergency response", rotation: -3 },
    { id: "6", src: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400", alt: "Medical help", rotation: 10 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={() => setModalOpen(true)} />
      
      <div className="pt-14 sm:pt-16 md:pt-20">
        <LiveActivityTicker />
      </div>

      <ImageCarouselHero
        title="Connecting Communities with NGOs & Volunteers using AI"
        subtitle="AI-Powered Crisis Coordination for a Safer Tomorrow"
        description="SahyogUI bridges the gap between those who need help and those who can provide it — powered by intelligent matching and real-time coordination."
        ctaText="Get Started"
        onCtaClick={() => setModalOpen(true)}
        secondaryCtaText="Learn More"
        onSecondaryCtaClick={() => scrollToFeatures()}
        images={heroImages}
        features={[
          { title: "AI Prioritization", description: "Instantly rank issues by urgency and impact." },
          { title: "Real-time Map", description: "Visualize crisis zones and response units live." },
          { title: "Verified NGOs", description: "Trust-based network of certified aid organizations." },
        ]}
      />

      {/* About */}
      <section className="border-t py-12 sm:py-16 md:py-20">
        <div
          data-reveal
          className="mx-auto max-w-3xl px-4 text-center opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground sm:text-3xl">Why SahyogAI?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground">
            In times of crisis, coordination is everything. SahyogAI uses artificial intelligence to instantly match verified community issues with the closest, most capable responders — reducing response time and maximizing impact.
          </p>
        </div>
      </section>

      <div id="features">
        <FeaturesSection />
      </div>
      <HowItWorksSection />
      <ImpactStatsSection />
      <div id="use-cases">
        <UseCasesSection />
      </div>
      <div id="roadmap">
        <RoadmapSection />
      </div>
      <TestimonialsSection />
      <PartnersSection />
      <div id="map">
        <MapPreviewSection />
      </div>

      <Footer />

      <RoleSelectionDialog open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
