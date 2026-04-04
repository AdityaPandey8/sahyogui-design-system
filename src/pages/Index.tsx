import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import HeroSection from "@/components/ui/hero-section";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MapPreviewSection } from "@/components/landing/MapPreviewSection";
import { RoleSelectionDialog } from "@/components/landing/RoleSelectionDialog";
import { LiveActivityTicker } from "@/components/landing/LiveActivityTicker";
import { Users, Building2, Heart } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={() => setModalOpen(true)} />
      
      <div className="pt-16 md:pt-20">
        <LiveActivityTicker />
      </div>

      <HeroSection
        title={
          <>
            Connecting Communities with NGOs & Volunteers using{" "}
            <span className="text-primary">AI</span>
          </>
        }

        subtitle="SahyogAI bridges the gap between those who need help and those who can provide it — powered by intelligent matching and real-time coordination."
        actions={[
          { text: "Get Started", onClick: () => setModalOpen(true), variant: "default" },
          { text: "Learn More", onClick: scrollToFeatures, variant: "outline" },
        ]}
        stats={[
          { value: "15K+", label: "Active Volunteers", icon: <Users className="h-5 w-5" /> },
          { value: "200+", label: "Partner NGOs", icon: <Building2 className="h-5 w-5" /> },
          { value: "50K+", label: "Issues Resolved", icon: <Heart className="h-5 w-5" /> },
        ]}
        images={[
          "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=900",
        ]}
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

      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="map">
        <MapPreviewSection />
      </div>

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
