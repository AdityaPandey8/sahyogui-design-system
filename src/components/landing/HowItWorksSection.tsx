import { Search, CheckCircle2, Send, Handshake } from "lucide-react";

const steps = [
  { icon: Search, label: "Report", desc: "Citizens report community issues with location and details." },
  { icon: CheckCircle2, label: "Verify", desc: "Admins verify and prioritize incoming reports." },
  { icon: Send, label: "Dispatch", desc: "AI matches and dispatches the best-fit volunteers and NGOs." },
  { icon: Handshake, label: "Resolve", desc: "Teams collaborate on the ground to solve the issue." },
];

export function HowItWorksSection() {
  return (
    <section className="border-t py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2
          data-reveal
          className="mb-8 sm:mb-14 text-center text-2xl font-bold text-foreground sm:text-3xl opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
        >
          How It Works
        </h2>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              className="flex flex-col items-center text-center opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-200 hover:scale-110">
                <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-1 text-sm sm:text-base font-bold text-foreground">{s.label}</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
