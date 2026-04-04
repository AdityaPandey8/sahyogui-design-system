import { MapPin } from "lucide-react";

export function MapPreviewSection() {
  return (
    <section className="border-t bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2
          data-reveal
          className="mb-6 sm:mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out"
        >
          Live Issue Map
        </h2>
        <div
          data-reveal
          className="relative overflow-hidden rounded-xl border bg-card shadow-sm opacity-0 translate-y-3 blur-[4px] transition-all duration-700 ease-out [transition-delay:100ms]"
        >
          <div className="flex h-48 sm:h-64 md:h-80 items-center justify-center bg-gradient-to-br from-primary/5 to-success/5">
            <div className="text-center px-4">
              <MapPin className="mx-auto mb-2 h-8 w-8 sm:h-10 sm:w-10 text-primary/40" />
              <p className="text-sm font-medium text-muted-foreground">Interactive map coming soon</p>
            </div>
          </div>
          <div className="absolute left-[20%] top-[30%] h-2.5 w-2.5 rounded-full bg-destructive shadow-sm animate-pulse" />
          <div className="absolute left-[55%] top-[45%] h-2.5 w-2.5 rounded-full bg-warning shadow-sm animate-pulse [animation-delay:500ms]" />
          <div className="absolute left-[70%] top-[25%] h-2.5 w-2.5 rounded-full bg-success shadow-sm animate-pulse [animation-delay:1000ms]" />
          <div className="absolute left-[35%] top-[60%] h-2.5 w-2.5 rounded-full bg-primary shadow-sm animate-pulse [animation-delay:1500ms]" />
        </div>
      </div>
    </section>
  );
}
