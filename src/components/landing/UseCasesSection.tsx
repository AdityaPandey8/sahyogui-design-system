import { ShieldCheck, Users, HeartHandshake } from "lucide-react";

const useCases = [
  {
    icon: ShieldCheck,
    title: "Reliable Incident Verification",
    description: "Ensure every report is verified quickly so teams can act with confidence and reduce false alerts.",
  },
  {
    icon: Users,
    title: "Smart Volunteer Mobilization",
    description: "Match volunteers by skill and proximity to crises, helping the right people arrive faster.",
  },
  {
    icon: HeartHandshake,
    title: "NGO Coordination Hub",
    description: "Give NGOs a shared dashboard to prioritize needs, assign teams, and track impact in real time.",
  },
];

export function UseCasesSection() {
  return (
    <section className="border-t py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Platform Use Cases</p>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">Empowering every role in the response chain</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            SahyogAI brings together volunteers, community reporters, and NGO coordinators to resolve critical issues faster and more transparently.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
