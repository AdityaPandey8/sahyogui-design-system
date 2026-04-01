import { Brain, MapPin, Users, BarChart3 } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Matching", desc: "Smart algorithms connect the right volunteers and NGOs to critical issues." },
  { icon: MapPin, title: "Real-Time Tracking", desc: "Monitor issue status and volunteer deployment on a live map." },
  { icon: Users, title: "Community Engagement", desc: "Empower citizens to report and track issues in their neighborhoods." },
  { icon: BarChart3, title: "Impact Analytics", desc: "Measure outcomes and resource allocation with actionable dashboards." },
];

export function FeaturesSection() {
  return (
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
              className="group rounded-lg border bg-card p-6 shadow-sm opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out hover:shadow-md hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-card-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
