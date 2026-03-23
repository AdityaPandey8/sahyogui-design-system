import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Brain,
  MapPin,
  Users,
  BarChart3,
  Shield,
  Building2,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle2,
  Search,
  Send,
  Handshake,
} from "lucide-react";

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

const features = [
  { icon: Brain, title: "AI-Powered Matching", desc: "Smart algorithms connect the right volunteers and NGOs to critical issues." },
  { icon: MapPin, title: "Real-Time Tracking", desc: "Monitor issue status and volunteer deployment on a live map." },
  { icon: Users, title: "Community Engagement", desc: "Empower citizens to report and track issues in their neighborhoods." },
  { icon: BarChart3, title: "Impact Analytics", desc: "Measure outcomes and resource allocation with actionable dashboards." },
];

const steps = [
  { icon: Search, label: "Report", desc: "Citizens report community issues with location and details." },
  { icon: CheckCircle2, label: "Verify", desc: "Admins verify and prioritize incoming reports." },
  { icon: Send, label: "Dispatch", desc: "AI matches and dispatches the best-fit volunteers and NGOs." },
  { icon: Handshake, label: "Resolve", desc: "Teams collaborate on the ground to solve the issue." },
];

const roles = [
  { key: "admin", label: "Admin", icon: Shield, desc: "Manage & oversee", color: "bg-primary/10 text-primary" },
  { key: "ngo", label: "NGO", icon: Building2, desc: "Coordinate relief", color: "bg-success/10 text-success" },
  { key: "volunteer", label: "Volunteer", icon: Heart, desc: "Help on ground", color: "bg-warning/10 text-orange-700" },
  { key: "public", label: "Public", icon: Globe, desc: "Report issues", color: "bg-danger/10 text-danger" },
];

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Sahyog<span className="text-primary">AI</span>
          </span>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="animate-fade-in text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl" style={{ lineHeight: "1.1" }}>
            Connecting Communities with NGOs and Volunteers using AI
          </h1>
          <p className="mx-auto mt-5 max-w-lg animate-fade-in text-base text-muted-foreground [animation-delay:100ms] opacity-0">
            SahyogAI bridges the gap between those who need help and those who can provide it — powered by intelligent matching and real-time coordination.
          </p>
          <Button
            size="lg"
            className="mt-8 animate-fade-in [animation-delay:200ms] opacity-0"
            onClick={() => setModalOpen(true)}
          >
            Get Started <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>

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

      {/* Features */}
      <section className="border-t bg-secondary/30 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2
            data-reveal
            className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
          >
            Key Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.title}
                data-reveal
                className="rounded-lg border bg-card p-6 shadow-sm opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-sm font-bold text-card-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2
            data-reveal
            className="mb-14 text-center text-2xl font-bold text-foreground sm:text-3xl opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
          >
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                className="flex flex-col items-center text-center opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-bold text-foreground">{s.label}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="border-t bg-secondary/30 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2
            data-reveal
            className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
          >
            Live Issue Map
          </h2>
          <div
            data-reveal
            className="relative overflow-hidden rounded-xl border bg-card shadow-sm opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out [transition-delay:100ms]"
          >
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-primary/5 to-success/5 sm:h-80">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-10 w-10 text-primary/40" />
                <p className="text-sm font-medium text-muted-foreground">Interactive map coming soon</p>
              </div>
            </div>
            {/* Decorative pins */}
            <div className="absolute left-[20%] top-[30%] h-2.5 w-2.5 rounded-full bg-danger shadow-sm" />
            <div className="absolute left-[55%] top-[45%] h-2.5 w-2.5 rounded-full bg-warning shadow-sm" />
            <div className="absolute left-[70%] top-[25%] h-2.5 w-2.5 rounded-full bg-success shadow-sm" />
            <div className="absolute left-[35%] top-[60%] h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 SahyogAI. Built to connect communities.
          </p>
        </div>
      </footer>

      {/* Role Selection Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Who are you?</DialogTitle>
            <DialogDescription>Select your role to continue</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => {
                  setModalOpen(false);
                  navigate(`/dashboard/${role.key}`);
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border p-5 transition-all duration-200 hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${role.color}`}>
                  <role.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-foreground">{role.label}</span>
                <span className="text-[11px] text-muted-foreground">{role.desc}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
