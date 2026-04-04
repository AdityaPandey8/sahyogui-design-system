import { ArrowUpRight, Calendar, Layers } from "lucide-react";

const roadmapPoints = [
  {
    icon: Calendar,
    title: "AI-assisted scheduling",
    description: "Automated availability matching and route planning for volunteers and response teams.",
  },
  {
    icon: Layers,
    title: "Expanded platform views",
    description: "Introduce role-specific dashboards for NGOs, volunteers, and community leaders.",
  },
  {
    icon: ArrowUpRight,
    title: "Stronger community impact",
    description: "Deliver data-driven insights that help organizations optimize response coverage.",
  },
];

export function RoadmapSection() {
  return (
    <section className="border-t bg-secondary/10 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What’s next</p>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">Roadmap for the next platform release</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            We’re evolving SahyogAI with more intelligence, clearer operations, and deeper collaboration across communities.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {roadmapPoints.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
