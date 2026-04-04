import { Button } from "@/components/ui/button";
import { ShieldCheck, Activity, Globe2, Sparkles } from "lucide-react";

const stats = [
  { icon: ShieldCheck, value: "98%", label: "Verified response accuracy" },
  { icon: Activity, value: "24/7", label: "Active monitoring" },
  { icon: Globe2, value: "12", label: "Regional response hubs" },
  { icon: Sparkles, value: "30K+", label: "Coordinated relief actions" },
];

export function ImpactStatsSection() {
  return (
    <section className="border-t bg-background/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Version 2.0</p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-foreground sm:text-4xl">
              Next-level coordination with a human-centered experience.
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-muted-foreground">
              SahyogAI now delivers improved UX, richer dashboards, and deeper community insights — so help reaches the right place faster.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full sm:w-auto">
                Explore the platform
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="w-full sm:w-auto">
                View roadmap
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 sm:mb-4">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
