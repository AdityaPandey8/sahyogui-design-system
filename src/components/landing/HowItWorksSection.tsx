import { motion } from "framer-motion";
import { Search, CheckCircle2, Send, Handshake } from "lucide-react";

const steps = [
  { icon: Search, label: "Report", desc: "Citizens share issue details and location in seconds." },
  { icon: CheckCircle2, label: "Verify", desc: "Trusted teams confirm reports and prioritize what matters most." },
  { icon: Send, label: "Dispatch", desc: "Volunteers and NGOs are matched and routed in real time." },
  { icon: Handshake, label: "Resolve", desc: "Collaborative action closes the loop with faster outcomes." },
];

const stepMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorksSection() {
  return (
    <section className="border-t bg-secondary/10 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="space-y-6 text-center sm:space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">How It Works</p>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, compact coordination that keeps every response moving.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            A lightweight flow built for speed and clarity — from report to resolution in a few smooth steps.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={stepMotion}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/95 p-5 text-left shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/10 transition duration-300 group-hover:bg-primary/15">
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Step {index + 1}</p>
                    <h3 className="mt-2 text-base font-semibold text-foreground">{step.label}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{step.desc}</p>
                <span className="pointer-events-none absolute -right-4 top-4 hidden h-16 w-16 rounded-full border border-primary/10 bg-primary/5 blur-2xl sm:block" />
              </motion.div>
            );
          })}
        </div>

        <div className="relative mt-12 h-16">
          <div className="absolute top-1/2 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:block" />
          <div className="relative mx-auto flex w-full max-w-3xl items-center justify-between gap-3 sm:gap-0">
            {[0, 1, 2, 3].map((step) => (
              <div key={step} className="flex w-full items-center justify-center">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm shadow-primary/20">
                  {step + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
