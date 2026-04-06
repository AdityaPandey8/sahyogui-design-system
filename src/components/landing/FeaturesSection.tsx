import { Brain, MapPin, Users, BarChart3 } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Matching", desc: "Smart algorithms connect the right volunteers and NGOs to critical issues instantly." },
  { icon: MapPin, title: "Real-Time Tracking", desc: "Monitor issue status and volunteer deployment with live geospatial clarity." },
  { icon: Users, title: "Community Engagement", desc: "Empower citizens to report, verify, and stay informed during crises." },
  { icon: BarChart3, title: "Impact Analytics", desc: "Measure outcomes and resource allocation with actionable dashboards." },
];

export function FeaturesSection() {
  return (
    <section className="border-t bg-secondary/10 py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
            Key Features
          </div>
          <div className="space-y-4">
            <h2 className="max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
              Built to coordinate responders, nonprofits, and communities in real time.
            </h2>
            <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
              SahyogAI delivers an intuitive workflow for crisis response with fast discovery, clear collaboration, and measurable outcomes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm shadow-slate-900/5">
              <p className="text-sm font-semibold text-foreground">Fast onboarding</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Get teams and volunteers live in minutes, not hours, with guided setup and simplified workflows.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm shadow-slate-900/5">
              <p className="text-sm font-semibold text-foreground">Trusted coordination</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Keep issues centralized, verified, and prioritized so every action is aligned with local needs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-reveal
              className="group rounded-[2rem] border border-border/60 bg-card/95 p-6 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/20 transition duration-200 group-hover:bg-primary/15">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
