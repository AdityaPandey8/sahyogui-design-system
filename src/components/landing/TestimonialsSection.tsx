import { MessageSquare, HeartHandshake, Users } from "lucide-react";

const testimonials = [
  {
    quote: "SahyogAI helped our volunteer team reach vulnerable families faster than ever. The new dashboard is intuitive and keeps everyone aligned.",
    name: "Priya Shah",
    role: "Field Volunteer",
    icon: Users,
  },
  {
    quote: "We now see verified reports instantly and can coordinate resources across the city. The experience feels focused, fast, and reliable.",
    name: "Amit Verma",
    role: "NGO Coordinator",
    icon: HeartHandshake,
  },
  {
    quote: "The issue reporting flow is simple, and the platform helped our community get support on time. It truly feels built for real crisis response.",
    name: "Neha Rani",
    role: "Community Reporter",
    icon: MessageSquare,
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t bg-secondary/20 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Community Voice</p>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">What people are saying</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Trusted by volunteers, NGOs, and local communities to bring urgent help where it matters most.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name} className="group rounded-[2rem] border bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 transition group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{item.role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
